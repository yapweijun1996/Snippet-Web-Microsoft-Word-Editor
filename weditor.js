/*!
 * WEditor Bootstrap (delay-load + singleton modal, multi-instance aware)
 * Step 1 (small step): scan triggers/containers and wire basic click handlers.
 * Next steps will: inject modal DOM, delay-load libs/word_editor.js, and open the editor.
 */
(function () {
  'use strict';

  // Configuration (can be extended later)
  var SELECTOR_TRIGGER = '.weditor_fc_modal';
  var SELECTOR_CONTAINER = '.weditor';

  // State
  var state = {
    pairs: [],
    scriptsLoaded: false,
    loadingPromise: null,
    currentIndex: -1
  };

  // Public API (will be expanded in next steps)
  var API = {
    // Open editor for the given index (0-based). In this step, just log.
    open: function (index) {
      if (typeof index !== 'number' || index < 0 || index >= state.pairs.length) {
        console.warn('[WEditor] Invalid index to open:', index);
        return;
      }
      state.currentIndex = index;
      // Next step: ensure modal DOM + delay-load scripts + open editor
      console.info('[WEditor] Open requested for pair index:', index, state.pairs[index]);
      notifyPending('open', index);
    },
    // Close editor (next step will delegate to word editor close)
    close: function () {
      console.info('[WEditor] Close requested (stub).');
      notifyPending('close', state.currentIndex);
    },
    // Access pairs (readonly snapshot)
    list: function () {
      return state.pairs.slice();
    },
    // Hooks (to be wired in next steps)
    onOpen: null,
    onClose: null,
    onExport: null
  };

  // Expose global once
  if (!window.WEditor) {
    window.WEditor = API;
  } else {
    // Merge shallowly to avoid breaking existing refs
    Object.assign(window.WEditor, API);
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll(SELECTOR_TRIGGER));
    var containers = Array.prototype.slice.call(document.querySelectorAll(SELECTOR_CONTAINER));

    state.pairs = [];
    // Pair each trigger with the nearest following .weditor container (sibling scanning). Fallback to first unused container.
    var usedHosts = new Set();
    triggers.forEach(function (tr, idx) {
      var cur = tr.nextElementSibling;
      var found = null;
      while (cur) {
        if (cur.matches && cur.matches(SELECTOR_CONTAINER) && !usedHosts.has(cur)) { found = cur; break; }
        cur = cur.nextElementSibling;
      }
      if (!found) {
        for (var j = 0; j < containers.length; j++) {
          var cand = containers[j];
          if (!usedHosts.has(cand)) { found = cand; break; }
        }
      }
      if (found) {
        usedHosts.add(found);
        state.pairs.push({ trigger: tr, host: found });
      }
    });

    // Bind click handlers to triggers (by index order pairing)
    state.pairs.forEach(function (pair, idx) {
      // Avoid double-binding
      if (pair.trigger._weditorBound) return;
      pair.trigger._weditorBound = true;
      pair.trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        // For now, just route to API.open (stub)
        API.open(idx);
      });
    });

    // Developer hints
    if (!state.pairs.length) {
      console.warn('[WEditor] No pairs found. Please add elements with classes "weditor_fc_modal" (trigger) and "weditor" (container).');
    } else {
      console.log('[WEditor] Bootstrap ready. Pairs:', state.pairs.length);
    }
  }

  // Small helper to surface that functionality is pending next step
  function notifyPending(kind, idx) {
    // Subtle toast-like alert for now (keeps first step minimal and reversible)
    try {
      var msg = 'WEditor: ' + kind + ' for #' + idx + ' is wired. Next step will load modal and word_editor.js dynamically.';
      // Prefer non-blocking console, fallback to alert for visibility in manual tests
      console.info(msg);
      // Non-intrusive in-page hint (once)
      if (!document.getElementById('weditor_pending_hint')) {
        var hint = document.createElement('div');
        hint.id = 'weditor_pending_hint';
        hint.textContent = msg;
        hint.style.cssText = [
          'position:fixed;bottom:12px;left:12px;z-index:99999;',
          'background:#e3f2fd;color:#0d47a1;border:1px solid #90caf9;',
          'padding:8px 12px;border-radius:6px;font:13px/1.4 system-ui,Segoe UI,Arial;',
          'box-shadow:0 6px 18px rgba(0,0,0,.15)'
        ].join('');
        document.body.appendChild(hint);
        setTimeout(function () {
          if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
        }, 2500);
      }
    } catch (_) {
      // As a last resort
      alert('WEditor bootstrap is wired. Next step will load modal and word_editor.js dynamically.');
    }
  }

})();
// Step 2: add delayed script loading + singleton modal injection + multi-instance open()
// This extends the initial bootstrap with real "open" behavior.
(function () {
  'use strict';

  if (!window.WEditor) return;

  var BOOT_STYLE_ID = 'weditor_bootstrapStyle';
  var PRINT_STYLE_ID = 'weditor_printStyle';
  var HOST_ROOT_ID = 'weditor_hostRoot';

  var loadState = { promise: null, done: false };

  function ensureHeadAssets() {
    var head = document.head || document.getElementsByTagName('head')[0];

    // Minimal runtime CSS to make modal work (not full theme; enough to function)
    if (!document.getElementById(BOOT_STYLE_ID)) {
      var bs = document.createElement('style');
      bs.id = BOOT_STYLE_ID;
      bs.textContent = [
        '.weditor_editor-modal{position:fixed;inset:0;display:none;align-items:stretch;justify-content:center;z-index:3000;background:rgba(0,0,0,.45)}',
        '.weditor_editor-modal.weditor_active{display:flex}',
        '.weditor_editor-shell{background:#fff;width:100%;max-width:none;display:flex;flex-direction:column;height:100vh}',
        '.weditor_editor-frame{display:flex;flex-direction:column;min-height:0;flex:1}',
        '.weditor_header{background:#2b579a;color:#fff;padding:8px 12px;display:flex;align-items:center;justify-content:space-between}',
        '.weditor_toolbar{position:sticky;top:0;z-index:10;background:#f1f1f1;border-bottom:1px solid #ddd;padding:6px 8px;display:flex;flex-wrap:wrap;gap:8px}',
        '.weditor_btn{height:28px;min-width:28px;padding:0 8px;border:1px solid #ddd;background:#fff;border-radius:3px;cursor:pointer;font-size:13px}',
        '.weditor_canvas{flex:1;overflow:auto;background:#e8e8e8;padding:20px 0 60px;min-height:0}',
        '.weditor_page-wrap{margin:0 auto;background:#fff;box-shadow:0 0 5px rgba(0,0,0,.15)}',
        '.weditor_page-content{outline:none;min-height:10mm;padding:20mm}',
        '.weditor_status{position:sticky;bottom:0;background:#f1f1f1;border-top:1px solid #ddd;padding:6px 12px;display:flex;justify-content:space-between}',
        '.weditor_modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);align-items:center;justify-content:center;z-index:2000}',
        '.weditor_modal.weditor_active{display:flex}',
        '.weditor_modal-card{background:#fff;width:min(92vw,520px);padding:16px;border-radius:6px}',
        '.weditor_img-toolbar,.weditor_table-toolbar{position:fixed;display:none;z-index:3000;background:#fff;border:1px solid #ddd;border-radius:6px;box-shadow:0 4px 18px rgba(0,0,0,.12);padding:8px}',
        '.weditor_toast-stack{position:fixed;top:24px;right:24px;display:flex;flex-direction:column;gap:12px;z-index:5000}',
        '.weditor_import-progress[hidden]{display:none !important}'
      ].join('');
      head.appendChild(bs);
    }

    // Print style handle expected by word_editor.js
    if (!document.getElementById(PRINT_STYLE_ID)) {
      var ps = document.createElement('style');
      ps.id = PRINT_STYLE_ID;
      ps.textContent = '@page { size: A4 portrait; margin: 20mm; }';
      head.appendChild(ps);
    }
  }

  function ensureModalDOM() {
    if (document.getElementById('weditor_editorModal')) return;

    var root = document.createElement('div');
    root.id = HOST_ROOT_ID;

    // Note: This is a trimmed-but-complete DOM set expected by word_editor.js (IDs must match).
    root.innerHTML = `
<button id="weditor_launchEditor" type="button" style="display:none"></button>

<div class="weditor_editor-modal" id="weditor_editorModal" role="dialog" aria-modal="true" aria-labelledby="weditor_editorTitle">
  <div class="weditor_editor-shell">
    <div class="weditor_offline-banner" id="weditor_offlineBanner" role="status" aria-live="polite" hidden></div>
    <div class="weditor_editor-frame">
      <div class="weditor_header">
        <h1 id="weditor_editorTitle">📝 Web Word-like Editor</h1>
        <div class="weditor_header-actions">
          <button type="button" class="weditor_btn" id="weditor_btnNew">New</button>
          <button type="button" class="weditor_btn" id="weditor_btnOpen">Open</button>
          <button type="button" class="weditor_btn" id="weditor_btnSave">Save</button>
          <button type="button" class="weditor_btn" id="weditor_btnPrint">Print</button>
          <button type="button" class="weditor_btn" id="weditor_btnCloseEditor" title="Close editor">×</button>
        </div>
      </div>

      <div class="weditor_toolbar" role="toolbar" aria-label="Editor toolbar">
        <div class="weditor_group">
          <button type="button" class="weditor_btn" id="weditor_btnUndo" title="Undo">↶</button>
          <button type="button" class="weditor_btn" id="weditor_btnRedo" title="Redo">↷</button>
        </div>

        <div class="weditor_group">
          <button class="weditor_btn" data-cmd="cut" title="Cut">✂</button>
          <button class="weditor_btn" data-cmd="copy" title="Copy">📋</button>
          <button class="weditor_btn" id="weditor_btnPaste" title="Paste">📌</button>
        </div>

        <div class="weditor_group">
          <select id="weditor_fontName" title="Font family">
            <option value="">Font</option>
            <option>Arial</option>
            <option selected>Calibri</option>
            <option>Cambria</option>
            <option>Courier New</option>
            <option>Georgia</option>
            <option>Times New Roman</option>
            <option>Verdana</option>
          </select>
          <select id="weditor_fontSize" title="Font size (pt)">
            <option value="">Size</option>
            <option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>
            <option>14</option><option>16</option><option>18</option><option>20</option><option>22</option>
            <option>24</option><option>28</option><option>36</option><option>48</option><option>72</option>
          </select>
          <button class="weditor_btn" data-cmd="bold"><b>B</b></button>
          <button class="weditor_btn" data-cmd="italic"><i>I</i></button>
          <button class="weditor_btn" data-cmd="underline"><u>U</u></button>
          <button class="weditor_btn" data-cmd="strikeThrough"><s>S</s></button>
          <button class="weditor_btn" data-cmd="subscript">x₂</button>
          <button class="weditor_btn" data-cmd="superscript">x²</button>
        </div>

        <div class="weditor_group">
          <button class="weditor_btn" id="weditor_btnColorText" title="Text color">A<div class="weditor_color-preview" id="weditor_cpText" style="background:black;height:6px;"></div></button>
          <input type="color" id="weditor_colorText" style="display:none" value="#000000"/>
          <button class="weditor_btn" id="weditor_btnColorHilite" title="Highlight">A<div class="weditor_color-preview" id="weditor_cpHilite" style="background:yellow;height:6px;"></div></button>
          <input type="color" id="weditor_colorHilite" style="display:none" value="#ffff00"/>
        </div>

        <div class="weditor_group">
          <button class="weditor_btn" data-cmd="justifyLeft" title="Align left">⬅</button>
          <button class="weditor_btn" data-cmd="justifyCenter" title="Align center">⬌</button>
          <button class="weditor_btn" data-cmd="justifyRight" title="Align right">➡</button>
          <button class="weditor_btn" data-cmd="justifyFull" title="Justify">☰</button>
          <button class="weditor_btn" data-cmd="insertOrderedList" title="Numbered list">1.</button>
          <button class="weditor_btn" data-cmd="insertUnorderedList" title="Bulleted list">•</button>
          <button class="weditor_btn" data-cmd="outdent" title="Outdent">⇤</button>
          <button class="weditor_btn" data-cmd="indent" title="Indent">⇥</button>
          <select id="weditor_listStyle" title="List style">
            <option value="">List style</option>
            <option value="ul:disc">• Disc</option>
            <option value="ul:circle">○ Circle</option>
            <option value="ul:square">■ Square</option>
            <option value="ol:decimal">1. Decimal</option>
            <option value="ol:lower-alpha">a. Lower alpha</option>
            <option value="ol:upper-alpha">A. Upper alpha</option>
            <option value="ol:lower-roman">i. Lower roman</option>
            <option value="ol:upper-roman">I. Upper roman</option>
          </select>
        </div>

        <div class="weditor_group">
          <button class="weditor_btn" id="weditor_btnLink" title="Insert link">🔗</button>
          <button class="weditor_btn" id="weditor_btnImage" title="Insert image">🖼</button>
          <button class="weditor_btn" id="weditor_btnTable" title="Insert table">⊞</button>
          <button type="button" class="weditor_btn" data-cmd="insertHorizontalRule" title="Horizontal line">—</button>
          <button class="weditor_btn" id="weditor_btnPageBreak" title="Insert page break">⤓</button>
        </div>

        <div class="weditor_group" title="Page setup">
          <span style="font-size:12px;color:#555;">Paper:</span>
          <span class="weditor_pill" aria-label="Paper size locked to A4">A4</span>
          <select id="weditor_orientation">
            <option>portrait</option>
            <option>landscape</option>
          </select>
          <label style="font-size:12px;color:#555;">Margins (mm):</label>
          <input type="number" id="weditor_margin" value="20" min="5" max="50" style="width:64px" />
          <label style="font-size:12px;color:#555;">Zoom:</label>
          <select id="weditor_zoom">
            <option>80%</option><option>90%</option><option selected>100%</option><option>110%</option><option>125%</option><option>150%</option>
          </select>
        </div>

        <div class="weditor_group">
          <button type="button" class="weditor_btn" id="weditor_btnFind" title="Find &amp; Replace">🔍</button>
          <button type="button" class="weditor_btn" id="weditor_btnClearFormat" title="Clear formatting">✖</button>
        </div>
      </div>

      <div class="weditor_canvas">
        <div class="weditor_page-wrap" id="weditor_pageWrap">
          <div class="weditor_page-content" id="weditor_editor" contenteditable="true" spellcheck="true"><p><br></p></div>
        </div>
      </div>
    </div>

    <div class="weditor_status">
      <div>Words: <span id="weditor_statWords">0</span> &nbsp; Characters: <span id="weditor_statChars">0</span></div>
      <div id="weditor_saveStatus">Ready</div>
    </div>

    <input type="file" id="weditor_fileOpen" accept=".html,.htm,.txt,.docx" class="weditor_sr-file" tabindex="-1" />
    <input type="file" id="weditor_fileImg" accept="image/*" class="weditor_sr-file" tabindex="-1" />
  </div>

  <div class="weditor_modal" id="weditor_modalLink">
    <div class="weditor_modal-card">
      <div class="weditor_modal-head">
        <h3>Insert Link</h3>
        <span class="weditor_close-x" data-close="weditor_modalLink">×</span>
      </div>
      <div class="weditor_form-row">
        <label>URL</label>
        <input type="text" id="weditor_linkURL" placeholder="https://example.com"/>
      </div>
      <div class="weditor_form-row">
        <label>Text (optional)</label>
        <input type="text" id="weditor_linkText" placeholder="Text to display"/>
      </div>
      <div class="weditor_modal-actions">
        <button class="weditor_btn" data-close="weditor_modalLink">Cancel</button>
        <button class="weditor_btn" id="weditor_doInsertLink" style="background:#1976d2;color:#fff;border:0;">Insert</button>
      </div>
    </div>
  </div>

  <div class="weditor_modal" id="weditor_modalTable">
    <div class="weditor_modal-card">
      <div class="weditor_modal-head">
        <h3>Insert Table</h3>
        <span class="weditor_close-x" data-close="weditor_modalTable">×</span>
      </div>
      <div class="weditor_form-row">
        <label>Rows</label><input type="number" id="weditor_tblRows" min="1" max="100" value="3"/>
      </div>
      <div class="weditor_form-row">
        <label>Columns</label><input type="number" id="weditor_tblCols" min="1" max="20" value="3"/>
      </div>
      <div class="weditor_modal-actions">
        <button class="weditor_btn" data-close="weditor_modalTable">Cancel</button>
        <button class="weditor_btn" id="weditor_doInsertTable" style="background:#1976d2;color:#fff;border:0;">Insert</button>
      </div>
    </div>
  </div>

  <div class="weditor_modal" id="weditor_modalFind">
    <div class="weditor_modal-card">
      <div class="weditor_modal-head">
        <h3>Find &amp; Replace</h3>
        <span class="weditor_close-x" data-close="weditor_modalFind">×</span>
      </div>
      <div class="weditor_form-row">
        <label>Find</label><input type="text" id="weditor_findTxt"/>
      </div>
      <div class="weditor_form-row">
        <label>Replace</label><input type="text" id="weditor_replTxt"/>
      </div>
      <div class="weditor_modal-actions">
        <button class="weditor_btn" id="weditor_doFind">Find next</button>
        <button class="weditor_btn" id="weditor_doReplace">Replace</button>
        <button class="weditor_btn" id="weditor_doReplaceAll" style="background:#1976d2;color:#fff;border:0;">Replace all</button>
      </div>
    </div>
  </div>

  <div class="weditor_img-toolbar" id="weditor_imgToolbar" role="dialog" aria-label="Image tools">
    <div class="weditor_row">
      <label>Width:</label>
      <input type="range" id="weditor_imgWidth" min="20" max="1600" value="300" style="width:140px"/>
      <label><input type="checkbox" id="weditor_imgLock" checked/> Lock ratio</label>
      <span id="weditor_imgSizeLabel" style="font-size:12px;color:#555;">300×—</span>
    </div>
    <div class="weditor_row">
      <label>Align:</label>
      <button class="weditor_btn" id="weditor_imgAlignLeft">Left</button>
      <button class="weditor_btn" id="weditor_imgAlignCenter">Center</button>
      <button class="weditor_btn" id="weditor_imgAlignRight">Right</button>
      <button class="weditor_btn" id="weditor_imgFloatLeft" title="Wrap left">Wrap ⬅</button>
      <button class="weditor_btn" id="weditor_imgFloatRight" title="Wrap right">Wrap ➡</button>
      <button class="weditor_btn" id="weditor_imgFloatNone" title="No wrap">No wrap</button>
    </div>
    <div class="weditor_row">
      <label>Border:</label>
      <button class="weditor_btn" id="weditor_imgBorderToggle">On/Off</button>
      <label>Radius</label><input type="range" id="weditor_imgRadius" min="0" max="40" value="0" style="width:100px"/>
      <label>Shadow</label><button class="weditor_btn" id="weditor_imgShadowToggle">On/Off</button>
    </div>
    <div class="weditor_row">
      <button class="weditor_btn" id="weditor_imgReplace">Replace URL</button>
      <button class="weditor_btn" id="weditor_imgUpload">Upload…</button>
      <button class="weditor_btn" id="weditor_imgRemove" style="color:#b00020;border-color:#f3cbd0;">Remove</button>
    </div>
  </div>

  <div class="weditor_table-toolbar" id="weditor_tableToolbar" role="dialog" aria-label="Table tools">
    <div class="weditor_row">
      <button class="weditor_btn" id="weditor_tblAddRowAbove" title="Add row above">Row ↑</button>
      <button class="weditor_btn" id="weditor_tblAddRowBelow" title="Add row below">Row ↓</button>
      <button class="weditor_btn" id="weditor_tblAddColLeft" title="Add column left">Col ←</button>
      <button class="weditor_btn" id="weditor_tblAddColRight" title="Add column right">Col →</button>
      <button class="weditor_btn" id="weditor_tblDeleteRow" title="Delete row" style="color:#b00020;">Del Row</button>
      <button class="weditor_btn" id="weditor_tblDeleteCol" title="Delete column" style="color:#b00020;">Del Col</button>
    </div>
    <div class="weditor_row">
      <button class="weditor_btn" id="weditor_tblToggleHeader" title="Toggle header row">Header</button>
      <label>Align:</label>
      <button class="weditor_btn" id="weditor_tblAlignLeft">Left</button>
      <button class="weditor_btn" id="weditor_tblAlignCenter">Center</button>
      <button class="weditor_btn" id="weditor_tblAlignRight">Right</button>
    </div>
    <div class="weditor_row">
      <label>Borders:</label>
      <button class="weditor_btn" data-border="all">All</button>
      <button class="weditor_btn" data-border="none">None</button>
      <button class="weditor_btn" data-border="top">Top</button>
      <button class="weditor_btn" data-border="right">Right</button>
      <button class="weditor_btn" data-border="bottom">Bottom</button>
      <button class="weditor_btn" data-border="left">Left</button>
    </div>
  </div>
</div>

<div class="weditor_toast-stack" id="weditor_toastStack" aria-live="polite" aria-atomic="true"></div>
<div class="weditor_import-progress" id="weditor_importProgress" role="status" aria-live="polite" hidden>
  <span class="weditor_import-progress__spinner" aria-hidden="true" style="display:inline-block;width:16px;height:16px;border-radius:50%;border:2px solid #d2e3fc;border-top-color:#2b579a;animation:spin .9s linear infinite;"></span>
  <span class="weditor_import-progress__message" id="weditor_importProgressMessage">Preparing...</span>
</div>
    `;
    document.body.appendChild(root);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      // Check if already present
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if ((s.src || '').indexOf(src) !== -1) {
          if (s.dataset.loaded === 'true') return resolve();
          s.addEventListener('load', function () { resolve(); });
          s.addEventListener('error', function (e) { reject(e); });
          return;
        }
      }
      var el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.dataset.weditor = 'true';
      el.onload = function () { el.dataset.loaded = 'true'; resolve(); };
      el.onerror = function (e) { reject(e); };
      (document.head || document.documentElement).appendChild(el);
    });
  }

  async function loadEditorScriptsOnce() {
    if (loadState.done) return;
    if (loadState.promise) return loadState.promise;
    loadState.promise = (async function () {
      // Load mammoth optionally first (safe if missing)
      try {
        if (!(window.mammoth && window.mammoth.convertToHtml)) {
          await loadScript('libs/mammoth.browser.min.js');
        }
      } catch (e) {
        console.warn('[WEditor] Mammoth optional load failed or unavailable', e);
      }
      // Load main editor if not yet present
      if (typeof window.openEditorModal !== 'function') {
        await loadScript('word_editor.js');
      }
      loadState.done = true;
    })();
    return loadState.promise;
  }

  // Write editor content back to the host container when closing
  var writingBack = false;
  function writeBackToHost() {
    if (writingBack) return;
    writingBack = true;
    try {
      var ed = document.getElementById('weditor_editor');
      if (ed && window.WEditor && window.WEditor._currentHost) {
        window.WEditor._currentHost.innerHTML = ed.innerHTML;
      }
    } catch (_) { /* noop */ }
    setTimeout(function () { writingBack = false; }, 0);
  }

  function hookCloseButton() {
    var btn = document.getElementById('weditor_btnCloseEditor');
    if (btn && !btn._weditorHooked) {
      btn._weditorHooked = true;
      btn.addEventListener('click', function(){
        try { writeBackToHost(); } catch(_) {}
        try {
          if (window.WEditor && typeof window.WEditor._unmountToModal === 'function') window.WEditor._unmountToModal();
          if (window.WEditor && window.WEditor._currentHost) {
            window.WEditor._currentHost.classList.remove('weditor_inline-host');
          }
          if (window.WEditor) { window.WEditor._currentHost = null; window.WEditor._currentIndex = -1; }
        } catch(_) {}
      });
    }
  }

  // Override open to perform: ensure assets + inject DOM + delay-load scripts + open + set content
  function ensureInlineStyle(){
  var id='weditor_inlineStyle';
  if (document.getElementById(id)) return;
  var st=document.createElement('style');
  st.id=id;
  st.textContent = [
    '.weditor_inline-host{display:block;}',
    '.weditor_inline-host .weditor_editor-shell{height:100%;border-radius:6px;box-shadow:none;}',
    '.weditor_inline-host .weditor_canvas{padding:20px 0 20px;background:#f7f7f7;}',
    '.weditor_inline-host .weditor_page-wrap{margin:0;}',
    '.weditor_inline-host .weditor_status{position:static;}'
  ].join('');
  (document.head||document.documentElement).appendChild(st);
}

function mountInline(host){
  try{
    var modal = document.getElementById('weditor_editorModal');
    if(!modal) return;
    var shell = modal.querySelector('.weditor_editor-shell');
    if(!shell) return;
    host.classList.add('weditor_inline-host');
    try {
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      if (!host.style.height) host.style.height = host.style.height || '100%';
      if (!host.style.width) host.style.width = host.style.width || '100%';
      if (!host.style.overflow) host.style.overflow = 'auto';
    } catch(_) {}
    if (shell.parentElement !== host){
      // clear visual placeholder; actual content is copied into editor area separately
      host.innerHTML = '';
      host.appendChild(shell);
    }
    shell.style.height = '100%';
  }catch(e){ console.warn('[WEditor] mountInline failed', e); }
}

function unmountToModal(){
  try{
    var modal = document.getElementById('weditor_editorModal');
    if(!modal) return;
    var shell = document.querySelector('.weditor_editor-shell');
    if(!shell) return;
    if (shell.parentElement !== modal){
      modal.appendChild(shell);
    }
  }catch(e){ console.warn('[WEditor] unmountToModal failed', e); }
}

// expose helpers for other patches
window.WEditor._ensureInlineStyle = ensureInlineStyle;
window.WEditor._mountInline = mountInline;
window.WEditor._unmountToModal = unmountToModal;

var prevOpen = window.WEditor.open;
  window.WEditor.open = async function (index) {
    try {
      var pairs = (window.WEditor.list && window.WEditor.list()) || [];
      if (!(typeof index === 'number') || index < 0 || index >= pairs.length) {
        console.warn('[WEditor] Invalid index:', index);
        return;
      }
      var pair = pairs[index];
      window.WEditor._currentIndex = index;
      window.WEditor._currentHost = pair.host;

      ensureHeadAssets();
      ensureModalDOM();
      await loadEditorScriptsOnce();
      ensureStatusBlock();
      patchUpdateStatsSafe();

      if (typeof window.openEditorModal === 'function') {
        if (!window.WEditor._loadDispatched) {
          try { window.dispatchEvent(new Event('load')); } catch (e) {}
          window.WEditor._loadDispatched = true;
        }
        window.openEditorModal();
      } else {
        // Fallback: try the previous stub if exists
        if (typeof prevOpen === 'function') prevOpen(index);
      }

      // After modal opens, inject the host HTML into editor
      var ed = document.getElementById('weditor_editor');
      if (ed) {
        ed.innerHTML = (pair.host && pair.host.innerHTML) ? pair.host.innerHTML : '<p><br></p>';
        // reset editor history if available
        if (typeof window.resetHistory === 'function') {
          try { window.resetHistory(); } catch (_) {}
        }
        // Inline mount into host: move the editor shell into the target container and hide modal overlay
        if (window.WEditor && typeof window.WEditor._ensureInlineStyle === 'function') { window.WEditor._ensureInlineStyle(); }
        if (window.WEditor && typeof window.WEditor._mountInline === 'function') { window.WEditor._mountInline(pair.host); }
        var _modalEl = document.getElementById('weditor_editorModal');
        if (_modalEl) { _modalEl.classList.remove('weditor_active'); }
        if (document && document.body && document.body.classList) { document.body.classList.remove('weditor_modal-open'); }
      }

      hookCloseButton();

      if (typeof window.WEditor.onOpen === 'function') {
        try { window.WEditor.onOpen({ index: index, host: pair.host, trigger: pair.trigger }); } catch (_) {}
      }
    } catch (e) {
      console.error('[WEditor] open failed:', e);
      alert('WEditor failed to open. See console for details.');
    }
  };

})();
// Step 3: minimal public API hooks (onExport/onClose) + explicit WEditor.close()
// Non-intrusive: appended patch that observes existing buttons and triggers callbacks.
(function () {
  'use strict';
  if (!window.WEditor) return;

  function getEditorHtml() {
    var ed = document.getElementById('weditor_editor');
    return ed ? ed.innerHTML : '';
  }

  // Hook export: after native save handler runs, notify onExport with current HTML
  document.addEventListener('click', function (e) {
    var t = e && e.target;
    if (!(t && t.id === 'weditor_btnSave')) return;
    // defer to let word_editor.js saveDoc run first
    setTimeout(function () {
      if (typeof window.WEditor.onExport === 'function') {
        try {
          window.WEditor.onExport({
            index: window.WEditor._currentIndex ?? -1,
            host: window.WEditor._currentHost || null,
            html: getEditorHtml(),
            mode: 'html' // exported as HTML single file in native flow
          });
        } catch (_) {}
      }
    }, 0);
  }, true);

  // Hook close: write back to host container, then notify onClose
  var _closing = false;
  document.addEventListener('click', function (e) {
    var t = e && e.target;
    if (!(t && t.id === 'weditor_btnCloseEditor')) return;
    if (_closing) return;
    _closing = true;
    setTimeout(function () {
      try {
        var ed = document.getElementById('weditor_editor');
        if (ed && window.WEditor && window.WEditor._currentHost) {
          window.WEditor._currentHost.innerHTML = ed.innerHTML;
        }
        // unmount back to modal and clean host class/state
        try {
          if (window.WEditor && typeof window.WEditor._unmountToModal === 'function') window.WEditor._unmountToModal();
          if (window.WEditor && window.WEditor._currentHost) {
            window.WEditor._currentHost.classList.remove('weditor_inline-host');
          }
        } catch(_) {}
        if (typeof window.WEditor.onClose === 'function') {
          try {
            window.WEditor.onClose({
              index: window.WEditor._currentIndex ?? -1,
              host: window.WEditor._currentHost || null
            });
          } catch (_) {}
        }
        if (window.WEditor) { window.WEditor._currentHost = null; window.WEditor._currentIndex = -1; }
      } finally {
        _closing = false;
      }
    }, 0);
  }, true);

  // Explicit programmatic close API
  window.WEditor.close = function () {
    try {
      var ed = document.getElementById('weditor_editor');
      if (ed && window.WEditor && window.WEditor._currentHost) {
        window.WEditor._currentHost.innerHTML = ed.innerHTML;
      }
      try {
        if (window.WEditor && typeof window.WEditor._unmountToModal === 'function') window.WEditor._unmountToModal();
        if (window.WEditor && window.WEditor._currentHost) {
          window.WEditor._currentHost.classList.remove('weditor_inline-host');
        }
      } catch(_) {}
      if (typeof window.closeEditorModal === 'function') {
        window.closeEditorModal();
      }
      if (typeof window.WEditor.onClose === 'function') {
        try {
          window.WEditor.onClose({
            index: window.WEditor._currentIndex ?? -1,
            host: window.WEditor._currentHost || null
          });
        } catch (_) {}
      }
      if (window.WEditor) { window.WEditor._currentHost = null; window.WEditor._currentIndex = -1; }
    } catch (e) {
      console.warn('[WEditor] close() encountered an issue:', e);
    }
  };
})();