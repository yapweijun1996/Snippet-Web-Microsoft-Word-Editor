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
  var DEFAULT_MAMMOTH_STYLE_MAP = [
    // Generic, "brute-force" style mappings for elements. This is more robust.
    "h1 => h1[style='font-size:26px; font-weight:700; color:#000; margin:18px 0 8px; line-height:1.2; text-align:center;']",
    "h2 => h2[style='font-size:22px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']",
    "h3 => h3[style='font-size:18px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']",
    "h4 => h4[style='font-size:16px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']",
    "h5 => h5[style='font-size:14px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']",
    "h6 => h6[style='font-size:13px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']",
    "p => p[style='margin:0 0 1.15em;']",

    // Specific style names as fallbacks
    "p[style-name='Title'] => h1[style='font-size:30px; font-weight:600; color:#000; text-align:center; margin:12px 0 6px;']:fresh",
    "p[style-name='title'] => h1[style='font-size:30px; font-weight:600; color:#000; text-align:center; margin:12px 0 6px;']:fresh",
    "p[style-name='标题'] => h1[style='font-size:30px; font-weight:600; color:#000; text-align:center; margin:12px 0 6px;']:fresh",
    "p[style-name='Subtitle'] => p[style='font-style:italic; color:#555; text-align:center; margin:0 0 16px;']:fresh",
    "p[style-name='subtitle'] => p[style='font-style:italic; color:#555; text-align:center; margin:0 0 16px;']:fresh",
    "p[style-name='副标题'] => p[style='font-style:italic; color:#555; text-align:center; margin:0 0 16px;']:fresh",

    // Headings 1-9 (EN + CN) - Inline Styles
    "p[style-name='Heading 1'] => h1[style='font-size:26px; font-weight:700; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading1'] => h1[style='font-size:26px; font-weight:700; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='标题 1'] => h1[style='font-size:26px; font-weight:700; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading 2'] => h2[style='font-size:22px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading2'] => h2[style='font-size:22px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='标题 2'] => h2[style='font-size:22px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading 3'] => h3[style='font-size:18px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading3'] => h3[style='font-size:18px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='标题 3'] => h3[style='font-size:18px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading 4'] => h4[style='font-size:16px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading4'] => h4[style='font-size:16px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='标题 4'] => h4[style='font-size:16px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading 5'] => h5[style='font-size:14px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading5'] => h5[style='font-size:14px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='标题 5'] => h5[style='font-size:14px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading 6'] => h6[style='font-size:13px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading6'] => h6[style='font-size:13px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='标题 6'] => h6[style='font-size:13px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",

    // APA/Academic Style Names
    "p[style-name='Heading Level 1'] => h1[style='font-size:26px; font-weight:700; color:#000; margin:18px 0 8px; line-height:1.2; text-align:center;']:fresh",
    "p[style-name='Heading Level 2'] => h2[style='font-size:22px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading Level 3'] => h3[style='font-size:18px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading Level 4'] => h4[style='font-size:16px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Heading Level 5'] => h5[style='font-size:14px; font-weight:600; color:#000; margin:18px 0 8px; line-height:1.2;']:fresh",
    "p[style-name='Abstract'] => p[style='margin:0 0 1.15em;']",

    // Normal / Body / Spacing (EN + CN) - Inline Styles
    "p[style-name='Normal'] => p[style='margin:0 0 1.15em;']",
    "p:empty => p:empty[style='margin:0 0 1.15em;min-height:1em;']", // Preserve empty lines
    "p[style-name='Normal (Web)'] => p[style='margin:0 0 1.15em;']",
    "p[style-name='Body Text'] => p[style='margin:0 0 1.15em;']",
    "p[style-name='BodyText'] => p[style='margin:0 0 1.15em;']",
    "p[style-name='正文'] => p[style='margin:0 0 1.15em;']",
    "p[style-name='正文文本'] => p[style='margin:0 0 1.15em;']",
    "p[style-name='No Spacing'] => p[style='margin:0;']",
    "p[style-name='NoSpacing'] => p[style='margin:0;']",
    "p[style-name='无间距'] => p[style='margin:0;']",
    "p[style-name='List Paragraph'] => p[style='margin:0 0 1.15em 32px; text-indent:0;']",
    "p[style-name='ListParagraph'] => p[style='margin:0 0 1.15em 32px; text-indent:0;']",
    "p[style-name='列表段落'] => p[style='margin:0 0 1.15em 32px; text-indent:0;']",

    // Alignment - applied via style attribute
    "p.weditor-align-center => p[style='text-align:center;']",
    "p.weditor-align-right => p[style='text-align:right;']",
    "p.weditor-align-justify => p[style='text-align:justify;']",

    // Quotes / Captions - Inline Styles
    "p[style-name='Quote'] => blockquote[style='border-left:4px solid #c6c6c6; background:#f9f9f9; margin:16px 0; padding:12px 16px;']:fresh",
    "p[style-name='Intense Quote'] => blockquote[style='border-left:6px solid #000; background:#f1f1f1; font-style:italic; margin:16px 0; padding:12px 16px;']:fresh",
    "p[style-name='引用'] => blockquote[style='border-left:4px solid #c6c6c6; background:#f9f9f9; margin:16px 0; padding:12px 16px;']:fresh",
    "p[style-name='加强引用'] => blockquote[style='border-left:6px solid #000; background:#f1f1f1; font-style:italic; margin:16px 0; padding:12px 16px;']:fresh",
    "p[style-name='Caption'] => p[style='font-size:13px; color:#5a5a5a; text-align:center; margin:8px 0 12px;']",
    "p[style-name='题注'] => p[style='font-size:13px; color:#5a5a5a; text-align:center; margin:8px 0 12px;']",

    // Character styles (for inline headings and emphasis)
    "r[style-name='Heading 1 Char'] => strong[style='font-size:26px; font-weight:700; color:#000;']",
    "r[style-name='Heading 2 Char'] => strong[style='font-size:22px; font-weight:600; color:#000;']",
    "r[style-name='Heading 3 Char'] => strong[style='font-size:18px; font-weight:600; color:#000;']",
    "r[style-name='Heading 4 Char'] => strong[style='font-size:16px; font-weight:600; color:#000;']",
    "r[style-name='Heading 5 Char'] => strong[style='font-size:14px; font-weight:600; color:#000;']",
    "r[style-name='Hyperlink'] => a",
    "r[style-name='Emphasis'] => em",
    "r[style-name='Strong'] => strong",
    "r[style-name='Code'] => code[style='font-family:Consolas, \"Courier New\", monospace; background:#f2f2f2; padding:0 2px;']",
    "p[style-name='Code'] => pre[style='font-family:Consolas, \"Courier New\", monospace; background:#f8f8f8; border:1px solid #e0e0e0; padding:10px; overflow:auto;']:fresh",

    // Tables - Basic structure, inline styles for tables are very complex, better to keep classes
    "table => table[style='width:100%; border-collapse:collapse; margin:16px 0;']",
    "table > tr > td => td[style='border:1px solid #c6c6c6; padding:6px 10px; text-align:left;']",
    "table > tr > th => th[style='border:1px solid #c6c6c6; padding:6px 10px; text-align:left; background:#f3f3f3; font-weight:600;']"
  ];
  var FONT_FAMILY_OPTIONS = [
    { label: 'Font', value: '', placeholder: true },
    { label: 'Default', value: 'Segoe UI, Calibri, "Helvetica Neue", Arial, sans-serif' },
    { label: 'Calibri', value: 'Calibri' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Courier New', value: '"Courier New", Courier, monospace' }
  ];
  var FONT_SIZE_OPTIONS = [
    { label: 'Size', value: '', placeholder: true },
    { label: 'Normal (15px)', value: '3' },
    { label: 'Small (12px)', value: '2' },
    { label: 'Large (18px)', value: '4' },
    { label: 'Heading (24px)', value: '5' },
    { label: 'Display (32px)', value: '6' }
  ];

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
      '.weditor__select{border:1px solid #999;background:#fff;padding:4px 6px;font-size:13px;cursor:pointer;}',
      '.weditor__color{border:1px solid #999;background:#fff;padding:0;width:36px;height:26px;}',
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
      '.weditor__wrapper[data-mode="fullscreen"]{display:flex;flex-direction:column;width:794px;min-height:1123px;margin:0 auto;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15);}',
      '.weditor__wrapper[data-mode="fullscreen"] .weditor{flex:1;border:0;padding:48px;box-sizing:border-box;max-width:100%;}',
      'body.weditor-no-scroll{overflow:hidden;}',
      '@media print{body, .weditor-overlay__body{background:#fff;padding:0;margin:0;}.weditor__wrapper[data-mode="fullscreen"]{box-shadow:none;border:0;margin:0;width:100%;}}',
      /* Word-like overrides for imported DOCX */
      '.weditor{font-family:"Times New Roman",Times,serif;font-size:16px;line-height:1.45;color:#000;max-width:650px;margin:0 auto;padding:48px;box-sizing:border-box;}',
      '.weditor h1,.weditor .weditor-heading-1,.weditor .weditor-doc-title{color:#000;font-weight:700;font-size:26px;margin:18px 0 8px;line-height:1.2;text-align:center;}',
      '.weditor .weditor-doc-subtitle{display:block;font-style:italic;color:#555;text-align:center;margin:0 0 12px;}',
      '.weditor h2,.weditor .weditor-heading-2{font-size:22px;font-weight:600;color:#000;}',
      '.weditor h3,.weditor .weditor-heading-3{font-size:18px;font-weight:600;color:#000;}',
      '.weditor h4,.weditor .weditor-heading-4{font-size:16px;font-weight:600;color:#000;text-transform:none;letter-spacing:0;}',
      '.weditor h5,.weditor .weditor-heading-5{font-size:14px;font-weight:600;color:#000;}',
      '.weditor h6,.weditor .weditor-heading-6{font-size:13px;font-weight:600;color:#000;}',
      '.weditor p,.weditor p.weditor-normal,.weditor p.weditor-body-text{margin:0 0 1.15em;text-indent:0;}',
      '.weditor p.weditor-no-spacing{margin-bottom:0;}',
      '.weditor p.weditor-list-paragraph{margin-left:32px;text-indent:0;}',
      '.weditor p.weditor-caption{font-size:13px;color:#5a5a5a;text-align:center;margin:8px 0 12px;}',
      '.weditor ul,.weditor ol{margin:0 0 12px 32px;}',
      '.weditor .weditor-align-center{text-align:center;}',
      '.weditor .weditor-align-right{text-align:right;}',
      '.weditor .weditor-align-justify{text-align:justify;}',
      '.weditor blockquote{border-left:4px solid #d0d0d0;background:#f9f9f9;margin:16px 0;padding:12px 16px;color:#2f2f2f;}',
      '.weditor blockquote.weditor-quote{border-left-color:#c6c6c6;}',
      '.weditor blockquote.weditor-intense-quote{border-left:6px solid #000;background:#f1f1f1;font-style:italic;}',
      '.weditor table,.weditor .weditor-doc-table{width:100%;border-collapse:collapse;margin:16px 0;}',
      '.weditor th,.weditor td{border:1px solid #c6c6c6;padding:6px 10px;text-align:left;}',
      '.weditor th{background:#f3f3f3;font-weight:600;}',
      '.weditor .doc-link{color:#1155cc;text-decoration:underline;}',
      '.weditor .doc-followed-link{color:#6b6b6b;text-decoration:underline;}',
      '.weditor .doc-strong{font-weight:700;}',
      '.weditor .doc-emphasis,.weditor .doc-subtle-emphasis,.weditor .doc-intense-emphasis{font-style:italic;}',
      '.weditor pre.doc-code{font-family:Consolas,"Courier New",monospace;background:#f8f8f8;border:1px solid #e0e0e0;padding:10px;overflow:auto;}',
      '.weditor code.doc-inline-code{font-family:Consolas,"Courier New",monospace;background:#f2f2f2;padding:0 2px;}'
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

    instance.fileInput = createFileInput(instance);
    instance.wrapper.appendChild(instance.fileInput);

    instance.placeholder = document.createComment('weditor-origin');
    instance.wrapper.parentNode.insertBefore(instance.placeholder, instance.wrapper.nextSibling);

    if (!el.hasAttribute('contenteditable')) el.setAttribute('contenteditable', 'true');
    if (!el.hasAttribute('spellcheck')) el.setAttribute('spellcheck', 'true');
    el.classList.add('weditor__editable');

    instance.title = deriveTitle(instance);
    instance.extraStyleMap = parseStyleMapAttribute(el.getAttribute('data-weditor-stylemap'));

    var themeFromOptions = options && options.theme && typeof options.theme === 'object'
      ? Object.assign({}, options.theme)
      : {};
    var themeFromAttr = parseThemeAttribute(el.getAttribute('data-weditor-theme'));
    if (themeFromAttr) {
      themeFromOptions = Object.assign(themeFromOptions, themeFromAttr);
    }
    instance.theme = Object.keys(themeFromOptions).length ? themeFromOptions : null;
    applyThemeVariables(instance);
    attachSyncField(instance);
    addTestingTools(instance); // Add testing button and show textarea

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
      { type: 'command', command: 'justifyLeft', label: '⯇', title: 'Align left' },
      { type: 'command', command: 'justifyCenter', label: '⇔', title: 'Align center' },
      { type: 'command', command: 'justifyRight', label: '⯈', title: 'Align right' },
      { type: 'command', command: 'justifyFull', label: '⯌', title: 'Justify' },
      { divider: true },
      { type: 'select', action: 'fontName', title: 'Font family', options: FONT_FAMILY_OPTIONS },
      { type: 'select', action: 'fontSize', title: 'Font size', options: FONT_SIZE_OPTIONS },
      { type: 'color', action: 'foreColor', title: 'Text colour' },
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
    } else if (action === 'open') {
      if (instance.fileInput) instance.fileInput.click();
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

  function parseThemeAttribute(value) {
    if (!value) return null;
    var trimmed = String(value).trim();
    if (!trimmed) return null;
    try {
      var parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('[Weditor] Failed to parse theme attribute', err);
    }
    return null;
  }

  function applyThemeVariables(instance) {
    if (!instance || !instance.theme) return;
    var theme = instance.theme;
    var target = instance.editorEl;
    if (!target || !target.style) return;
    var mapping = {
      heading1: '--weditor-heading1-color',
      heading2: '--weditor-heading2-color',
      heading3: '--weditor-heading3-color',
      heading4: '--weditor-heading4-color',
      heading5: '--weditor-heading5-color',
      heading6: '--weditor-heading6-color',
      title: '--weditor-title-color',
      subtitle: '--weditor-subtitle-color'
    };
    Object.keys(theme).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(theme, key)) return;
      var value = theme[key];
      if (typeof value !== 'string' || !value.trim()) return;
      var varName = mapping[key] || (key.indexOf('--') === 0 ? key : '--weditor-' + key.replace(/[^a-z0-9]+/gi, '-').toLowerCase());
      target.style.setProperty(varName, value.trim());
    });
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
      pushEditorToField(instance);
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
