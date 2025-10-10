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
  var lastOptions = DEFAULTS;
  var DEFAULT_MAMMOTH_STYLE_MAP = [
    "p[style-name='Title'] => h1.weditor-doc-title:fresh",
    "p[style-name='Subtitle'] => p.weditor-doc-subtitle:fresh",
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "p[style-name='Heading 4'] => h4:fresh",
    "p[style-name='Heading 5'] => h5:fresh",
    "p[style-name='Heading 6'] => h6:fresh",
    "p[style-name='Heading 7'] => h6.weditor-heading-7:fresh",
    "p[style-name='Heading 8'] => h6.weditor-heading-8:fresh",
    "p[style-name='Heading 9'] => h6.weditor-heading-9:fresh",
    "p[style-name='Normal'] => p.weditor-normal",
    "p[style-name='Body Text'] => p.weditor-body-text",
    "p[style-name='No Spacing'] => p.weditor-no-spacing",
    "p[style-name='List Paragraph'] => p.weditor-list-paragraph",
    "p[style-name='Caption'] => p.weditor-caption",
    "p[style-name='TOC Heading'] => p.weditor-toc-heading",
    "p[style-name='Quote'] => blockquote.weditor-quote:fresh",
    "p[style-name='Intense Quote'] => blockquote.weditor-intense-quote:fresh",
    "r[style-name='Hyperlink'] => span.doc-link",
    "r[style-name='Emphasis'] => span.doc-emphasis",
    "r[style-name='Subtle Emphasis'] => span.doc-subtle-emphasis",
    "r[style-name='Intense Emphasis'] => span.doc-intense-emphasis",
    "r[style-name='Strong'] => span.doc-strong",
    "r[style-name='Intense Reference'] => span.doc-intense-reference",
    "table[style-name='Table Grid'] => table.weditor-doc-table.table-grid",
    "table[style-name='Light Shading'] => table.weditor-doc-table.table-light-shading",
    "table[style-name='Medium Shading 1'] => table.weditor-doc-table.table-medium-shading",
    "table => table.weditor-doc-table",
    "table row => tr",
    "table header cell => th",
    "table cell => td"
  ];

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.weditor__wrapper{display:flex;flex-direction:column;gap:8px;}',
      '.weditor__wrapper .weditor{min-height:200px;}',
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
      '.weditor-overlay__body{flex:1;overflow:auto;padding:12px;background:#f5f5f5;}',
      '.weditor__wrapper[data-mode="fullscreen"]{height:100%;}',
      '.weditor__wrapper[data-mode="fullscreen"] .weditor{height:100%;min-height:calc(100% - 36px);}',
      'body.weditor-no-scroll{overflow:hidden;}'
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
      fileInput: null,
      statusEl: null,
      statusTimer: null,
      placeholder: null,
      title: null,
      index: -1,
      isFullscreen: false,
      extraStyleMap: []
    };

    instance.wrapper.className = 'weditor__wrapper';
    instance.toolbar = createToolbar(instance);
    instance.wrapper.appendChild(instance.toolbar);

    var parent = el.parentNode;
    parent.insertBefore(instance.wrapper, el);
    instance.wrapper.appendChild(el);

    instance.fileInput = createFileInput(instance);
    instance.wrapper.appendChild(instance.fileInput);

    instance.placeholder = document.createComment('weditor-origin');
    instance.wrapper.parentNode.insertBefore(instance.placeholder, instance.wrapper.nextSibling);

    if (!el.hasAttribute('contenteditable')) el.setAttribute('contenteditable', 'true');
    if (!el.hasAttribute('spellcheck')) el.setAttribute('spellcheck', 'true');
    el.classList.add('weditor__editable');

    instance.title = deriveTitle(instance);
    instance.extraStyleMap = parseStyleMapAttribute(el.getAttribute('data-weditor-stylemap'));

    el.addEventListener('input', function () {
      setStatus(instance, 'Editing…', 1500);
    });
    el.addEventListener('focus', function () {
      instance.wrapper.classList.add('weditor__wrapper--active');
    });
    el.addEventListener('blur', function () {
      instance.wrapper.classList.remove('weditor__wrapper--active');
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
      { type: 'command', command: 'justifyLeft', label: '⯇', title: 'Align left' },
      { type: 'command', command: 'justifyCenter', label: '⇔', title: 'Align center' },
      { type: 'command', command: 'justifyRight', label: '⯈', title: 'Align right' },
      { type: 'command', command: 'justifyFull', label: '⯌', title: 'Justify' },
      { divider: true },
      { type: 'command', command: 'insertUnorderedList', label: '• List', title: 'Bulleted list' },
      { type: 'command', command: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
      { divider: true },
      { type: 'command', command: 'removeFormat', label: 'Clean', title: 'Remove formatting' },
      { type: 'action', action: 'table', label: 'Tbl', title: 'Insert table' },
      { type: 'action', action: 'clear', label: 'Clear', title: 'Clear content' },
      { type: 'action', action: 'open', label: 'Open', title: 'Import file (.docx/.html/.txt)' },
      { type: 'action', action: 'fullscreen', label: 'Full', title: 'Open fullscreen' }
    ];

    controls.forEach(function (cfg) {
      if (cfg.divider) {
        var divider = document.createElement('span');
        divider.className = 'weditor__divider';
        toolbar.appendChild(divider);
        return;
      }
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
          } catch (err) {
            console.warn('[Weditor] Command failed:', cfg.command, err);
          }
        } else if (cfg.type === 'action') {
          handleToolbarAction(instance, cfg.action);
        }
      });
      toolbar.appendChild(btn);
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
    } else if (action === 'open') {
      if (instance.fileInput) instance.fileInput.click();
    } else if (action === 'fullscreen') {
      enterFullscreen(instance, instance.title);
    } else if (action === 'table') {
      insertTable(instance, 3, 3);
    }
  }

  function createFileInput(instance) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm,.txt,.docx';
    input.style.display = 'none';
    input.addEventListener('change', function (ev) {
      var file = ev.target.files && ev.target.files[0];
      input.value = '';
      if (!file) return;
      importFile(instance, file);
    });
    return input;
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

  function parseStyleMapAttribute(value) {
    if (!value) return [];
    var trimmed = String(value).trim();
    if (!trimmed) return [];
    var parsed = [];
    try {
      var json = JSON.parse(trimmed);
      if (Array.isArray(json)) {
        for (var i = 0; i < json.length; i++) {
          if (typeof json[i] === 'string' && json[i].trim()) parsed.push(json[i].trim());
        }
        if (parsed.length) return parsed;
      }
    } catch (err) {
      // fall through to split
    }
    trimmed.split(/\s*;\s*/).forEach(function (entry) {
      if (entry) parsed.push(entry.trim());
    });
    return parsed;
  }

  function focusInstance(instance) {
    try {
      instance.editorEl.focus({ preventScroll: true });
    } catch (_) {
      instance.editorEl.focus();
    }
  }

  function resolveMammothOptions(instance) {
    var userOptions = instance && instance.options && instance.options.mammothOptions
      ? instance.options.mammothOptions
      : {};
    var merged = Object.assign({}, userOptions);
    var styleMap = DEFAULT_MAMMOTH_STYLE_MAP.slice();
    if (merged.styleMap) {
      if (Array.isArray(merged.styleMap)) {
        styleMap = styleMap.concat(merged.styleMap);
      } else if (typeof merged.styleMap === 'string') {
        styleMap.push(merged.styleMap);
      }
    }
    if (instance && instance.extraStyleMap && instance.extraStyleMap.length) {
      styleMap = styleMap.concat(instance.extraStyleMap);
    }
    merged.styleMap = styleMap;
    if (typeof merged.includeDefaultStyleMap === 'undefined') {
      merged.includeDefaultStyleMap = true;
    }
    return merged;
  }

  async function importFile(instance, file) {
    if (!instance || !file) return;
    setStatus(instance, 'Importing ' + file.name + '…', 0);
    try {
      var html;
      if (/\.docx$/i.test(file.name)) {
        if (window.mammoth && typeof window.mammoth.convertToHtml === 'function') {
          var arrayBuffer = await file.arrayBuffer();
          var result = await window.mammoth.convertToHtml(
            { arrayBuffer: arrayBuffer },
            resolveMammothOptions(instance)
          );
          html = result && result.value ? result.value : '';
        } else {
          console.warn('[Weditor] Mammoth.js not available for DOCX import.');
          setStatus(instance, 'DOCX support requires mammoth.js', 4000);
          return;
        }
      } else {
        html = await file.text();
      }
      instance.editorEl.innerHTML = html || defaultEmpty();
      setStatus(instance, 'Loaded ' + file.name, 4000);
      focusInstance(instance);
    } catch (err) {
      console.error('[Weditor] Import failed', err);
      setStatus(instance, 'Import failed', 4000);
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
    importFile: function (target, file) {
      var inst = resolveInstance(typeof target === 'undefined' ? 0 : target);
      if (!inst) return Promise.reject(new Error('No editor instance found'));
      return importFile(inst, file);
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

})(window, document);
