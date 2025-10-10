(function (window, document) {
  'use strict';

  var DEFAULTS = {
    editorSelector: '.weditor',
    fullscreenButtonSelector: '.weditor_fc_modal'
  };
  var STYLE_ID = 'weditor-lite-style';
  var registry = [];
  var editorMap = new WeakMap();
  var overlay = null;
  var formSyncRegistry = new WeakSet();
  var lastOptions = DEFAULTS;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.weditor__wrapper{display:flex;flex-direction:column;gap:8px;}',
      '.weditor__wrapper .weditor{min-height:200px;border:1px solid #ccc;padding:8px;background:#fff;}',
      '.weditor__toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:6px;}',
      '.weditor__btn{border:1px solid #999;background:#f7f7f7;padding:4px 9px;cursor:pointer;font-size:13px;}',
      '.weditor__btn:hover{background:#ececec;}',
      '.weditor__divider{width:1px;height:18px;background:#ccc;margin:0 4px;}',
      '.weditor-status{margin-left:auto;font-size:12px;color:#555;}',
      '.weditor__wrapper--active .weditor{outline:1px solid #4c7ae5;outline-offset:2px;}',
      '.weditor-overlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:10000;padding:16px;box-sizing:border-box;}',
      '.weditor-overlay[data-open="true"]{display:flex;}',
      '.weditor-overlay__inner{background:#fff;display:flex;flex-direction:column;width:100%;max-width:960px;height:100%;max-height:90vh;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.2);} ',
      '.weditor-overlay__header{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #ddd;}',
      '.weditor-overlay__title{font-weight:600;font-size:15px;}',
      '.weditor-overlay__close{border:1px solid #999;background:#f7f7f7;padding:4px 12px;cursor:pointer;}',
      '.weditor-overlay__close:hover{background:#ececec;}',
      '.weditor-overlay__body{flex:1;overflow-y:auto;background:#e9e9e9;padding:32px 0;}',
      '.weditor__wrapper[data-mode="fullscreen"]{display:flex;flex-direction:column;width:var(--weditor-page-width,210mm);min-height:var(--weditor-page-height,297mm);margin:0 auto;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15);}',
      '.weditor__wrapper[data-mode="fullscreen"] .weditor{flex:1;border:0;padding:var(--weditor-page-margin,25.4mm);box-sizing:border-box;max-width:100%;}',
      'body.weditor-no-scroll{overflow:hidden;}',
      '@media print{body, .weditor-overlay__body{background:#fff;padding:0;margin:0;}.weditor__wrapper[data-mode="fullscreen"]{box-shadow:none;border:0;margin:0;width:100%;}}'
    ].join('');
    document.head.appendChild(style);
  }


  function mountAll(options) {
    var opts = Object.assign({}, lastOptions, options || {});
    lastOptions = opts;
    ensureStyles();
    var editors = document.querySelectorAll(opts.editorSelector);
    Array.prototype.forEach.call(editors, function (el) {
      mount(el, opts);
    });
    setupFullscreenTriggers(opts);
    return registry.slice();
  }

  function mount(el, options) {
    if (!el || el.nodeType !== 1) return null;
    var existing = editorMap.get(el);
    if (existing) return existing;

    ensureStyles();
    var instance = createInstance(el, options || lastOptions);
    if (!instance) return null;

    registry.push(instance);
    instance.index = registry.length - 1;
    el.dataset.weditorIndex = String(instance.index);
    editorMap.set(el, instance);
    return instance;
  }

  function createInstance(el, options) {
    if (!el.parentNode) return null;

    var instance = {
      editorEl: el,
      options: options,
      wrapper: document.createElement('div'),
      toolbar: null,
      statusEl: null,
      statusTimer: null,
      placeholder: null,
      title: null,
      index: -1,
      isFullscreen: false,
      extraStyleMap: [],
      theme: null,
      syncField: null,
      syncTimer: null
    };

    instance.wrapper.className = 'weditor__wrapper';
    instance.toolbar = createToolbar(instance);
    instance.wrapper.appendChild(instance.toolbar);

    var parent = el.parentNode;
    parent.insertBefore(instance.wrapper, el);
    instance.wrapper.appendChild(el);


    instance.placeholder = document.createComment('weditor-origin');
    instance.wrapper.parentNode.insertBefore(instance.placeholder, instance.wrapper.nextSibling);

    if (!el.hasAttribute('contenteditable')) el.setAttribute('contenteditable', 'true');
    if (!el.hasAttribute('spellcheck')) el.setAttribute('spellcheck', 'true');
    el.classList.add('weditor__editable');

    instance.title = deriveTitle(instance);
    attachSyncField(instance);
    addTestingTools(instance);

    el.addEventListener('input', function () {
      setStatus(instance, 'Editing…', 1500);
      scheduleFieldSync(instance);
    });
    el.addEventListener('focus', function () {
      instance.wrapper.classList.add('weditor__wrapper--active');
    });
    el.addEventListener('blur', function () {
      instance.wrapper.classList.remove('weditor__wrapper--active');
      pushEditorToField(instance);
    });

    return instance;
  }

  function createToolbar(instance) {
    var toolbar = document.createElement('div');
    toolbar.className = 'weditor__toolbar';

    var controls = [
      { type: 'command', command: 'undo', label: '↺', title: 'Undo' },
      { type: 'command', command: 'redo', label: '↻', title: 'Redo' },
      { divider: true },
      { type: 'command', command: 'bold', label: '<b>B</b>', title: 'Bold' },
      { type: 'command', command: 'italic', label: '<i>I</i>', title: 'Italic' },
      { type: 'command', command: 'underline', label: '<u>U</u>', title: 'Underline' },
      { divider: true },
      { type: 'command', command: 'justifyLeft', label: '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2 3h12v2H2zm0 4h8v2H2zm0 4h12v2H2z"/></svg>', title: 'Align left' },
      { type: 'command', command: 'justifyCenter', label: '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2 3h12v2H2zm2 4h8v2H4zm-2 4h12v2H2z"/></svg>', title: 'Align center' },
      { type: 'command', command: 'justifyRight', label: '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2 3h12v2H2zm4 4h8v2H6zm-4 4h12v2H2z"/></svg>', title: 'Align right' },
      { type: 'command', command: 'justifyFull', label: '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2 3h12v2H2zm0 4h12v2H2zm0 4h12v2H2z"/></svg>', title: 'Justify' },
      { divider: true },
      { type: 'command', command: 'insertUnorderedList', label: '• List', title: 'Bulleted list' },
      { type: 'command', command: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
      { divider: true },
      { type: 'command', command: 'removeFormat', label: 'Clean', title: 'Remove formatting' },
      { type: 'action', action: 'table', label: 'Tbl', title: 'Insert table' },
      { type: 'action', action: 'clear', label: 'Clear', title: 'Clear content' },
      { type: 'action', action: 'fullscreen', label: 'Full', title: 'Open fullscreen' }
    ];

    controls.forEach(function (cfg) {
      if (cfg.divider) {
        var divider = document.createElement('span');
        divider.className = 'weditor__divider';
        toolbar.appendChild(divider);
        return;
      }
      if (cfg.type === 'select') {
        var select = document.createElement('select');
        select.className = 'weditor__select';
        if (cfg.title) select.title = cfg.title;
        cfg.options.forEach(function (optConfig) {
          var option = document.createElement('option');
          option.textContent = optConfig.label || '';
          option.value = String(typeof optConfig.value === 'undefined' ? '' : optConfig.value);
          if (optConfig.placeholder) {
            option.disabled = true;
            option.selected = true;
          }
          select.appendChild(option);
        });
        select.addEventListener('change', function (ev) {
          var value = ev.target.value;
          if (!value) return;
          executeFormattingCommand(instance, cfg.action, value, cfg.title || cfg.action);
          select.selectedIndex = 0;
        });
        toolbar.appendChild(select);
      } else if (cfg.type === 'color') {
        var input = document.createElement('input');
        input.type = 'color';
        input.className = 'weditor__color';
        if (cfg.title) input.title = cfg.title;
        input.value = '#1f1f1f';
        input.addEventListener('input', function (ev) {
          executeFormattingCommand(instance, cfg.action, ev.target.value, cfg.title || cfg.action);
        });
        toolbar.appendChild(input);
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'weditor__btn';
        btn.innerHTML = cfg.label;
        if (cfg.title) btn.title = cfg.title;
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          instance.editorEl.focus({ preventScroll: true });
          if (cfg.type === 'command') {
            try {
              document.execCommand(cfg.command, false, cfg.value || null);
              setStatus(instance, cfg.title || cfg.command, 1200);
              scheduleFieldSync(instance);
            } catch (err) {
              console.warn('[Weditor] Command failed:', cfg.command, err);
              setStatus(instance, 'Command failed', 2000);
            }
          } else if (cfg.type === 'action') {
            handleToolbarAction(instance, cfg.action);
          }
        });
        toolbar.appendChild(btn);
      }
    });

    var status = document.createElement('span');
    status.className = 'weditor-status';
    toolbar.appendChild(status);
    instance.statusEl = status;

    return toolbar;
  }

  function handleToolbarAction(instance, action) {
    if (!instance) return;
    if (action === 'clear') {
      instance.editorEl.innerHTML = defaultEmpty();
      setStatus(instance, 'Cleared', 1500);
      instance.editorEl.focus({ preventScroll: true });
      pushEditorToField(instance);
    } else if (action === 'fullscreen') {
      enterFullscreen(instance, instance.title);
    } else if (action === 'table') {
      insertTable(instance, 3, 3);
    }
  }

  function attachSyncField(instance) {
    if (!instance || !instance.editorEl) return;
    var field = findSyncField(instance);
    if (!field) return;

    instance.syncField = field;
    if (field._weditorCreated && !field.hasAttribute('data-weditor-visible')) {
      field.hidden = true;
      field.setAttribute('aria-hidden', 'true');
    }
    field.classList.add('weditor__field');
    field.setAttribute('data-weditor-bound', 'true');

    if (field.value && field.value.trim()) {
      instance.editorEl.innerHTML = field.value;
    } else {
      pushEditorToField(instance);
    }

    var syncFromField = function () {
      if (!instance.syncField) return;
      instance.editorEl.innerHTML = field.value ? field.value : defaultEmpty();
    };
    field.addEventListener('input', syncFromField);
    field.addEventListener('change', syncFromField);

    if (field.form && !formSyncRegistry.has(field.form)) {
      formSyncRegistry.add(field.form);
      field.form.addEventListener('submit', function () {
        syncAllToFields();
      });
    }
  }

  function findSyncField(instance) {
    var editor = instance && instance.editorEl ? instance.editorEl : null;
    if (!editor) return null;
    var selector = editor.getAttribute('data-weditor-field');
    var field = null;

    if (selector) {
      try {
        field = document.querySelector(selector);
      } catch (err) {
        console.warn('[Weditor] Unable to resolve data-weditor-field selector:', selector, err);
      }
      if (!field) {
        try {
          field = instance.wrapper.querySelector(selector);
        } catch (_) {
          // ignore
        }
      }
    }

    if (field && field.tagName !== 'TEXTAREA') {
      field = null;
    }

    if (!field) {
      var host = editor.closest('[data-editor]') || instance.wrapper;
      if (host) {
        field = host.querySelector('textarea[data-weditor-source], textarea[data-weditor-storage], textarea[data-role="weditor-source"]');
      }
    }

    if (!field) {
      var sibling = editor.nextElementSibling;
      while (sibling) {
        if (sibling.tagName === 'TEXTAREA') {
          field = sibling;
          break;
        }
        sibling = sibling.nextElementSibling;
      }
    }

    if (!field) {
      var nameAttr = editor.getAttribute('data-weditor-name');
      if (nameAttr) {
        field = document.createElement('textarea');
        field.name = nameAttr;
        field._weditorCreated = true;
        instance.wrapper.appendChild(field);
      }
    }

    return field && field.tagName === 'TEXTAREA' ? field : null;
  }

  function scheduleFieldSync(instance) {
    if (!instance || !instance.syncField) return;
    if (instance.syncTimer) {
      clearTimeout(instance.syncTimer);
    }
    instance.syncTimer = window.setTimeout(function () {
      instance.syncTimer = null;
      pushEditorToField(instance);
    }, 120);
  }

  function pushEditorToField(instance) {
    if (!instance || !instance.syncField || !instance.editorEl) return;
    var html = instance.editorEl.innerHTML || '';
    instance.syncField.value = hasMeaningfulContent(html) ? html : '';
  }

  function syncAllToFields() {
    for (var i = 0; i < registry.length; i++) {
      pushEditorToField(registry[i]);
    }
  }

  function hasMeaningfulContent(html) {
    if (!html) return false;
    var stripped = String(html)
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<\/?[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();
    return stripped.length > 0;
  }

  function executeFormattingCommand(instance, command, value, statusText) {
    if (!instance || !command) return;
    focusInstance(instance);
    var needsCss = command === 'foreColor' || command === 'fontSize';
    var cssEnabled = false;
    if (needsCss) {
      try {
        document.execCommand('styleWithCSS', true);
        cssEnabled = true;
      } catch (err) {
        cssEnabled = false;
      }
    }
    try {
      document.execCommand(command, false, value);
      setStatus(instance, statusText || command, 1500);
      scheduleFieldSync(instance);
    } catch (err) {
      console.warn('[Weditor] Command failed:', command, err);
      setStatus(instance, 'Command failed', 2000);
    } finally {
      if (needsCss && cssEnabled) {
        try {
          document.execCommand('styleWithCSS', false);
        } catch (err2) {
          // ignore
        }
      }
    }
  }


  function insertTable(instance, rows, cols) {
    if (!instance) return;
    var r = typeof rows === 'number' && rows > 0 ? rows : 2;
    var c = typeof cols === 'number' && cols > 0 ? cols : 2;
    var temp = document.createElement('div');
    var table = '<table style="width:100%;border-collapse:collapse;">';
    for (var i = 0; i < r; i++) {
      table += '<tr>';
      for (var j = 0; j < c; j++) {
        table += '<td style="border:1px solid #999;padding:6px;"><br></td>';
      }
      table += '</tr>';
    }
    table += '</table><p><br></p>';
    temp.innerHTML = table;
    instance.editorEl.focus({ preventScroll: true });
    try {
      document.execCommand('insertHTML', false, temp.innerHTML);
      setStatus(instance, 'Inserted table', 1600);
      scheduleFieldSync(instance);
    } catch (err) {
      console.warn('[Weditor] Table insert failed', err);
      setStatus(instance, 'Table insert failed', 2000);
    }
  }

  function deriveTitle(instance) {
    var host = instance.editorEl.closest('[data-editor]');
    if (host && host.getAttribute('data-editor')) {
      return host.getAttribute('data-editor');
    }
    if (instance.wrapper && instance.wrapper.previousElementSibling) {
      var heading = instance.wrapper.previousElementSibling.querySelector && instance.wrapper.previousElementSibling.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) return heading.textContent.trim();
    }
    var fallbackHeading = instance.editorEl.closest('article, section');
    if (fallbackHeading) {
      var headerNode = fallbackHeading.querySelector('h1, h2, h3, h4, h5, h6');
      if (headerNode) return headerNode.textContent.trim();
    }
    return 'Editor';
  }

  function setupFullscreenTriggers(options) {
    if (!options || !options.fullscreenButtonSelector) return;
    var triggers = document.querySelectorAll(options.fullscreenButtonSelector);
    Array.prototype.forEach.call(triggers, function (btn) {
      if (btn._weditorBound) return;
      btn._weditorBound = true;
      btn.addEventListener('click', function (ev) {
        ev.preventDefault();
        var inst = findInstanceByButton(btn, options);
        if (inst) {
          var title = deriveTitleFromButton(btn, inst);
          enterFullscreen(inst, title);
        }
      });
    });
  }

  function findInstanceByButton(btn, options) {
    var idxAttr = btn.getAttribute('data-editor-index');
    if (idxAttr) {
      var parsed = parseInt(idxAttr, 10);
      if (!isNaN(parsed) && registry[parsed]) return registry[parsed];
    }

    var host = btn.closest('[data-editor]');
    if (host) {
      var editor = host.querySelector(options.editorSelector);
      if (editor && editorMap.has(editor)) return editorMap.get(editor);
    }

    if (btn.nextElementSibling && btn.nextElementSibling.matches(options.editorSelector)) {
      var inst = editorMap.get(btn.nextElementSibling);
      if (inst) return inst;
    }

    return registry.length ? registry[0] : null;
  }

  function deriveTitleFromButton(btn, instance) {
    var label = (btn.getAttribute('aria-label') || btn.textContent || '').trim();
    if (label) return label;
    return instance && instance.title ? instance.title : 'Editor';
  }

  function ensureOverlay() {
    if (overlay) return overlay;

    overlay = {
      root: document.createElement('div'),
      inner: null,
      header: null,
      title: null,
      body: null,
      closeBtn: null,
      current: null
    };

    overlay.root.className = 'weditor-overlay';
    overlay.root.setAttribute('aria-hidden', 'true');

    overlay.inner = document.createElement('div');
    overlay.inner.className = 'weditor-overlay__inner';

    overlay.header = document.createElement('div');
    overlay.header.className = 'weditor-overlay__header';

    overlay.title = document.createElement('span');
    overlay.title.className = 'weditor-overlay__title';
    overlay.title.textContent = 'Editor';

    overlay.closeBtn = document.createElement('button');
    overlay.closeBtn.type = 'button';
    overlay.closeBtn.className = 'weditor-overlay__close';
    overlay.closeBtn.textContent = 'Close';
    overlay.closeBtn.addEventListener('click', exitFullscreen);

    overlay.header.appendChild(overlay.title);
    overlay.header.appendChild(overlay.closeBtn);

    overlay.body = document.createElement('div');
    overlay.body.className = 'weditor-overlay__body';

    overlay.inner.appendChild(overlay.header);
    overlay.inner.appendChild(overlay.body);
    overlay.root.appendChild(overlay.inner);

    overlay.root.addEventListener('click', function (ev) {
      if (ev.target === overlay.root) exitFullscreen();
    });

    document.addEventListener('keydown', handleEscape);
    document.body.appendChild(overlay.root);
    return overlay;
  }

  function enterFullscreen(instance, title) {
    if (!instance || instance.isFullscreen) return;
    var ov = ensureOverlay();

    if (instance.wrapper && instance.wrapper.parentNode) {
      instance.wrapper.dataset.mode = 'fullscreen';
    }

    ov.body.innerHTML = '';
    ov.body.appendChild(instance.wrapper);
    ov.title.textContent = title || instance.title || 'Editor';

    ov.root.setAttribute('data-open', 'true');
    ov.root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('weditor-no-scroll');

    ov.current = instance;
    instance.isFullscreen = true;
    focusInstance(instance);
  }

  function exitFullscreen() {
    if (!overlay || !overlay.current) return;
    var instance = overlay.current;
    var placeholder = instance.placeholder;

    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(instance.wrapper, placeholder);
    }
    instance.wrapper.dataset.mode = '';
    instance.isFullscreen = false;

    overlay.body.innerHTML = '';
    overlay.current = null;
    overlay.root.removeAttribute('data-open');
    overlay.root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('weditor-no-scroll');
    focusInstance(instance);
  }

  function handleEscape(ev) {
    if (ev.key === 'Escape') {
      exitFullscreen();
    }
  }

  function setStatus(instance, text, timeout) {
    if (!instance || !instance.statusEl) return;
    if (instance.statusTimer) {
      clearTimeout(instance.statusTimer);
      instance.statusTimer = null;
    }
    instance.statusEl.textContent = text || '';
    if (text && timeout) {
      instance.statusTimer = window.setTimeout(function () {
        if (instance.statusEl.textContent === text) {
          instance.statusEl.textContent = '';
        }
        instance.statusTimer = null;
      }, timeout);
    }
  }

  function defaultEmpty() {
    return '<p><br></p>';
  }


  function ensureEmptyParagraphs(root) {
    try {
      var ps = root ? root.querySelectorAll('p') : null;
      if (!ps) return;
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        var stripped = p.innerHTML.replace(/<br\s*\/?>/gi, '').replace(/&nbsp;|\s+/gi, '').trim();
        if (!stripped) {
          p.innerHTML = '<br>';
        }
      }
    } catch (_) {}
  }

  function focusInstance(instance) {
    try {
      instance.editorEl.focus({ preventScroll: true });
    } catch (_) {
      instance.editorEl.focus();
    }
  }


  function resolveInstance(target) {
    if (typeof target === 'number') {
      return registry[target] || null;
    }
    if (!target) return null;
    if (editorMap.has(target)) return editorMap.get(target);
    if (target.editorEl && editorMap.has(target.editorEl)) return editorMap.get(target.editorEl);
    for (var i = 0; i < registry.length; i++) {
      var inst = registry[i];
      if (inst.editorEl === target || inst.wrapper === target) return inst;
    }
    return null;
  }

  var api = {
    mountAll: mountAll,
    mount: function (target, options) {
      if (!target) return null;
      if (target instanceof Element) {
        return mount(target, options);
      }
      if (typeof target === 'string') {
        var nodeList = document.querySelectorAll(target);
        var mounted = [];
        Array.prototype.forEach.call(nodeList, function (el) {
          mounted.push(mount(el, options));
        });
        return mounted;
      }
      return null;
    },
    open: function (target) {
      var inst = resolveInstance(typeof target === 'undefined' ? 0 : target);
      if (inst) enterFullscreen(inst, inst.title);
    },
    close: exitFullscreen,
    focus: function (target) {
      var inst = resolveInstance(typeof target === 'undefined' ? 0 : target);
      if (inst) focusInstance(inst);
    },
    instances: function () {
      return registry.map(function (inst) { return inst.editorEl; });
    }
  };

  window.Weditor = Object.assign({}, window.Weditor || {}, api);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.Weditor.mountAll();
    }, { once: true });
  } else {
    window.Weditor.mountAll();
  }

  function addTestingTools(instance) {
    if (!instance || !instance.syncField) return;

    // 1. Make the textarea visible for inspection
    instance.syncField.hidden = false;
    instance.syncField.style.width = '100%';
    instance.syncField.style.minHeight = '100px';
    instance.syncField.style.marginTop = '8px';
    instance.syncField.style.fontSize = '12px';
    instance.syncField.style.fontFamily = 'monospace';
    instance.syncField.style.boxSizing = 'border-box';

    // 2. Create and add the "Test in New Tab" button
    var testBtn = document.createElement('button');
    testBtn.textContent = 'Test in New Tab';
    testBtn.style.marginLeft = '8px';
    testBtn.type = 'button';

    testBtn.addEventListener('click', function () {
      var htmlContent = instance.syncField.value;
      if (!htmlContent) {
        setStatus(instance, 'Textarea is empty', 2000);
        return;
      }
      try {
        // Get the entire stylesheet content from the main page.
        var mainStylesheet = document.getElementById(STYLE_ID);
        var styles = mainStylesheet ? mainStylesheet.textContent : '';

        // Construct the full HTML for the new tab as a string.
        var fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Weditor Content Test</title>
            <style>${styles}</style>
            <style>
              /* Additional styles for the test page itself */
              body { background: #e9e9e9; padding: 32px 0; }
              .weditor { margin: 0 auto; } /* Center the editor content */
            </style>
          </head>
          <body>
            <div class="weditor">${htmlContent}</div>
          </body>
        </html>`;

        // Use the Blob and Object URL method for robust new tab creation.
        var blob = new Blob([fullHtml], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        var newTab = window.open(url, '_blank');
        if (!newTab) {
          setStatus(instance, 'Popup blocked?', 3000);
        }
        // Revoke the object URL after a short delay to allow the browser to load it.
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
        setStatus(instance, 'Opened in new tab', 2000);
      } catch (err) {
        console.error('[Weditor] Could not open new tab.', err);
        setStatus(instance, 'Failed to open tab', 3000);
      }
    });

    // Find the header to append the button to
    var host = instance.editorEl.closest('.weditor-instance');
    if (host) {
      var header = host.querySelector('.weditor-instance__header');
      if (header) {
        // Add it before the fullscreen button for better layout
        var fullscreenBtn = header.querySelector('.weditor_fc_modal');
        if (fullscreenBtn) {
          header.insertBefore(testBtn, fullscreenBtn);
        } else {
          header.appendChild(testBtn);
        }
      }
    }
  }

})(window, document);
