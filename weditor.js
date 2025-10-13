(function(){
  "use strict";

  // ---------- Inject CSS via JS (snippet-friendly) ----------
  const STYLE_ID = "weditor-lite-style";
  const CSS_TEXT = `
.weditor-wrap{border:1px solid #ccc;margin:8px 0;background:#fff;display:flex;flex-direction:column}
.weditor-toolbar{display:flex;flex-wrap:wrap;gap:8px;padding:8px;border-bottom:1px solid #ddd;background:#f7f7f7;position:relative;align-items:center;--weditor-btn-h:36px;--weditor-btn-py:8px;--weditor-btn-px:10px}
.weditor-toolbar-group{display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:6px;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,0.08)}
.weditor-toolbar-group[data-hidden=\"true\"]{display:none}
.weditor-toolbar-group-label{font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
.weditor-toolbar-group-inner{display:flex;flex-wrap:wrap;gap:4px}
.weditor-toolbar-row{display:flex;flex-wrap:wrap;gap:8px;width:100%}
.weditor-toolbar-row + .weditor-toolbar-row{margin-top:6px}
.weditor-toolbar button{display:inline-flex;align-items:center;justify-content:center;min-height:var(--weditor-btn-h);padding:var(--weditor-btn-py) var(--weditor-btn-px);border:1px solid #cbd5f5;background:#fff;border-radius:4px;cursor:pointer;transition:background .15s,border-color .15s,box-shadow .15s}
.weditor-table-subgroup{display:flex;flex-direction:column;gap:4px;padding:4px 6px;background:#f1f5f9;border-radius:6px}
.weditor-table-subgroup-label{font-size:10px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.04em}
.weditor-table-subgroup-buttons{display:flex;flex-wrap:wrap;gap:4px}
.weditor-toolbar button.weditor-table-btn{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:118px;min-height:var(--weditor-btn-h);padding:var(--weditor-btn-py) var(--weditor-btn-px);font-size:12px;line-height:1.2}
.weditor-toolbar button.weditor-table-btn .weditor-table-btn-primary{font-weight:600;color:#1e293b}
.weditor-toolbar button.weditor-table-btn .weditor-table-btn-secondary{font-size:11px;color:#475569}
.weditor-toolbar button:hover:not(:disabled){background:#eef2ff;border-color:#94a3b8;box-shadow:0 1px 3px rgba(15,23,42,0.12)}
.weditor-toolbar button:disabled{opacity:.5;cursor:not-allowed}
.weditor-toolbar button:focus-visible{outline:2px solid #2563eb;outline-offset:1px}
.weditor-toolbar button[data-active="true"]{background:#e0e7ff;border-color:#94a3b8}
/* Primary/Secondary emphasis for key actions */
.weditor-btn--primary{background:#2563eb;color:#fff;border-color:#1d4ed8}
.weditor-btn--primary:hover:not(:disabled){background:#1d4ed8;border-color:#1e40af}
.weditor-btn--secondary{background:#fff;color:#1e293b;border-color:#cbd5f5}
/* Ensure table button inner labels invert correctly when primary */
.weditor-btn--primary .weditor-table-btn-primary{color:#fff}
.weditor-btn--primary .weditor-table-btn-secondary{color:#e2e8f0}
.weditor-area{min-height:160px;padding:10px;outline:0;overflow-y:auto}
.weditor_textarea{display:none}
body.weditor-fullscreen-active{overflow:hidden}
.weditor-wrap.weditor-fullscreen{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;margin:0;border:0}
.weditor-wrap.weditor-fullscreen .weditor-area{flex:1;min-height:0}

/* 轻量表格可视化增强（可删） */
.weditor-area table{border-collapse:collapse;width:100%}
.weditor-area td,.weditor-area th{border:1px solid #ccc;padding:6px;vertical-align:top}
.weditor-area td:empty::after,.weditor-area th:empty::after{content:"\\00a0"}
.weditor-table-popup{position:absolute;top:100%;left:4px;margin-top:6px;padding:10px;border:1px solid #ccc;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.12);border-radius:4px;display:none;flex-direction:column;gap:8px;min-width:180px;z-index:1000}
.weditor-table-popup[data-open="true"]{display:flex}
.weditor-table-popup label{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#333;gap:8px}
.weditor-table-popup input{width:72px;padding:4px;border:1px solid #bbb;border-radius:3px}
.weditor-table-popup select{width:100%;padding:4px;border:1px solid #bbb;border-radius:3px;background:#fff}
.weditor-table-popup input[type="color"]{padding:0;min-width:48px;height:30px;cursor:pointer}
.weditor-table-popup .actions{display:flex;justify-content:flex-end;gap:6px}
.weditor-table-popup .actions button{padding:var(--weditor-btn-py,8px) var(--weditor-btn-px,10px)}
.weditor-table-popup button{border:1px solid #bbb;background:#f8f8f8;cursor:pointer;min-height:var(--weditor-btn-h,36px);padding:var(--weditor-btn-py,8px) var(--weditor-btn-px,10px)}
.weditor-border-popup{min-width:240px}
.weditor-border-section{display:flex;flex-direction:column;gap:6px}
.weditor-border-section[data-hidden="true"]{display:none}
.weditor-border-heading{font-size:11px;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:.04em}
.weditor-border-scope{display:flex;gap:6px}
.weditor-border-scope select{flex:1;padding:4px;border:1px solid #bbb;border-radius:3px;background:#fff}
.weditor-border-presets{display:flex;flex-wrap:wrap;gap:4px}
.weditor-border-presets[data-hidden="true"]{display:none}
.weditor-border-option{min-height:var(--weditor-btn-h,36px);padding:var(--weditor-btn-py,8px) var(--weditor-btn-px,10px);border:1px solid #cbd5f5;border-radius:4px;background:#fff;cursor:pointer;font-size:11px;line-height:1.2;transition:background .15s,border-color .15s}
.weditor-border-option[data-active="true"]{background:#eef2ff;border-color:#94a3b8;font-weight:600}
.weditor-border-option[data-disabled="true"]{opacity:.55;cursor:not-allowed}
.weditor-area td.weditor-cell-selected,.weditor-area th.weditor-cell-selected{background-color:#bde0fe !important;outline:1px solid #007bff}
  `.trim();
  (function ensureStyle(){
    if (!document.getElementById(STYLE_ID)){
      const tag = document.createElement("style");
      tag.id = STYLE_ID;
      tag.appendChild(document.createTextNode(CSS_TEXT));
      (document.head || document.documentElement).appendChild(tag);
    }
  })();

  // ---------- Helpers ----------
  const TABLE_DEBUG = true;
  const tableDebug = (...args)=>{ if (TABLE_DEBUG && typeof console !== "undefined") console.log("[weditor-table]", ...args); };
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
  const el = (tag, attrs, kids=[])=>{
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k==="class") n.className = attrs[k];
      else if (k==="style") Object.assign(n.style, attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    kids.forEach(c=>n.appendChild(typeof c==="string"?document.createTextNode(c):c));
    return n;
  };
  const isHttpUrl = (u)=>/^https?:\/\//i.test(String(u||""));

  function isNodeInside(node, container){
    if (!node) return false;
    let cur = (node.nodeType===1?node:node.parentElement);
    while(cur){
      if (cur === container) return true;
      cur = cur.parentElement;
    }
    return false;
  }

  function moveCaretToEnd(container){
    const range = document.createRange();
    range.selectNodeContents(container);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function placeCaretInside(el){
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function normalizeColorToHex(color){
    const fallback = "#cccccc";
    if (!color) return fallback;
    const value = String(color).trim();
    const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch){
      if (value.length === 4){
        const r = value[1], g = value[2], b = value[3];
        return "#" + r + r + g + g + b + b;
      }
      return value.toLowerCase();
    }
    const rgbMatch = value.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i);
    if (rgbMatch){
      const toHex = (num)=>Math.max(0, Math.min(255, parseInt(num || "0", 10))).toString(16).padStart(2,"0");
      const r = toHex(rgbMatch[1]);
      const g = toHex(rgbMatch[2]);
      const b = toHex(rgbMatch[3]);
      return "#" + r + g + b;
    }
    if (value.toLowerCase() === "transparent") return fallback;
    return fallback;
  }

  function applyDefaultTableBorder(table){
    if (!table) return;
    table.style.borderCollapse = table.style.borderCollapse || "collapse";
    table.style.tableLayout = table.style.tableLayout || "fixed";
    table.style.border = "1px solid #cccccc";
    table.style.borderWidth = "1px";
    table.style.borderStyle = "solid";
    table.style.borderColor = "#cccccc";
    table.querySelectorAll("td,th").forEach(cell=>{
      cell.style.border = "1px solid #cccccc";
      cell.style.borderWidth = "1px";
      cell.style.borderStyle = "solid";
      cell.style.borderColor = "#cccccc";
    });
  }

  function insertTableAtCaret(editor, rows=2, cols=2){
    rows = Math.max(1, parseInt(rows||2,10));
    cols = Math.max(1, parseInt(cols||2,10));

    const colPct = (100/cols).toFixed(3) + "%";
    const colgroup = el("colgroup", null, Array.from({length:cols}, ()=> el("col",{style:{width:colPct}})));

    const table = el("table",{style:{borderCollapse:"collapse",width:"100%",tableLayout:"fixed"}});
    table.appendChild(colgroup);

    const tbody = el("tbody");
    for (let r=0;r<rows;r++){
      const tr = el("tr");
      for (let c=0;c<cols;c++){
        tr.appendChild(el("td",{style:{padding:"6px",verticalAlign:"top"}},["\u00A0"]));
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    const sel = window.getSelection();
    if (sel && sel.rangeCount){
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(table);
    } else {
      editor.appendChild(table);
    }
    const firstCell = table.querySelector("td");
    if (firstCell) placeCaretInside(firstCell);
    applyDefaultTableBorder(table);
  }

  // ---------- Build one editor (div.weditor + next textarea.weditor_textarea) ----------
  function buildEditor(divEditor){
    // find paired textarea
    let pair = divEditor.nextElementSibling;
    while (pair && !pair.classList.contains("weditor_textarea")) pair = pair.nextElementSibling;
    if (!pair) { console.warn("No paired .weditor_textarea for", divEditor); return; }

    // UI skeleton
    const wrap = el("div",{class:"weditor-wrap"});
    const toolbar = el("div",{class:"weditor-toolbar"});
    // Two-row toolbar containers
    const rowPrimary = el("div",{class:"weditor-toolbar-row weditor-toolbar-row-primary", role:"toolbar", "aria-label":"Primary toolbar"});
    const rowSecondary = el("div",{class:"weditor-toolbar-row weditor-toolbar-row-secondary", role:"toolbar", "aria-label":"Secondary toolbar"});
    toolbar.appendChild(rowPrimary);
    toolbar.appendChild(rowSecondary);

    // Editable area (reuse given div)
    divEditor.classList.add("weditor-area");
    divEditor.setAttribute("contenteditable","true");
    if (pair.value && pair.value.trim()){
      divEditor.innerHTML = pair.value;
    } else if (!divEditor.innerHTML.trim()){
      divEditor.innerHTML = "<p><br></p>";
    }

    // Exec helper（保证选区在编辑器内）
    function exec(cmd, val=null){
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !isNodeInside(sel.anchorNode, divEditor)) {
        divEditor.focus();
        moveCaretToEnd(divEditor);
      }
      document.execCommand(cmd, false, val);
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
      // Reflect toggle states immediately after command (中文解释: 交互后立刻更新状态)
      try { updateToggleStates && updateToggleStates(); } catch(e){}
    }

    // ---------- History manager (with redo-safe undo) ----------
    let showingSource = false;
    function getHTML(){ return showingSource ? divEditor.textContent : divEditor.innerHTML; }
    function setHTML(v, opts={}){
      const silent = !!opts.silent;
      if (showingSource) divEditor.textContent = v;
      else divEditor.innerHTML = v;
      if (!silent){
        divEditor.dispatchEvent(new Event("input",{bubbles:true}));
      } else {
        pair.value = getHTML();
      }
    }

    let btnUndo = null, btnRedo = null;
    function updateUndoRedoButtons(){
      if (btnUndo) btnUndo.disabled = !history.canUndo();
      if (btnRedo) btnRedo.disabled = !history.canRedo();
    }

    const history = {
      stack: [],
      index: -1,
      max: 50,
      push(html){
        if (this.index < this.stack.length - 1) this.stack.splice(this.index+1);
        this.stack.push({html});
        if (this.stack.length > this.max) this.stack.shift();
        this.index = this.stack.length - 1;
        updateUndoRedoButtons();
      },
      current(){ return this.index>=0 ? this.stack[this.index].html : null; },
      canUndo(){ return this.index > 0; },
      canRedo(){ return this.index >= 0 && this.index < this.stack.length - 1; },
      undo(){
        if (!this.canUndo()) return;
        this.index--;
        cancelSnapshotTimer();
        const html = this.stack[this.index].html;
        setHTML(html, {silent:true});
        lastSaved = html;
        updateUndoRedoButtons();
      },
      redo(){
        if (!this.canRedo()) return;
        this.index++;
        cancelSnapshotTimer();
        const html = this.stack[this.index].html;
        setHTML(html, {silent:true});
        lastSaved = html;
        updateUndoRedoButtons();
      }
    };

    // initial snapshot
    history.push(getHTML());

    // snapshot merge / timers
    let histTimer=null, lastSaved=getHTML();
    function cancelSnapshotTimer(){ clearTimeout(histTimer); histTimer=null; }
    function scheduleSnapshot(){
      cancelSnapshotTimer();
      histTimer = setTimeout(()=>{
        const now = getHTML();
        if (now !== lastSaved){
          history.push(now);
          lastSaved = now;
        }
      }, 500);
    }

    // Sync to textarea
    let syncTimer=null;
    function syncToTextarea(){
      clearTimeout(syncTimer);
      syncTimer = setTimeout(()=>{ pair.value = getHTML(); }, 120);
    }

    divEditor.addEventListener("input", scheduleSnapshot);
    divEditor.addEventListener("input", syncToTextarea);
    divEditor.addEventListener("input", updateToggleStates);
    divEditor.addEventListener("input", updateTableToolsVisibility);
    divEditor.addEventListener("blur",  ()=>{
      updateTableToolsVisibility();
      syncToTextarea();
      const now = getHTML();
      if (now !== history.current()){
        history.push(now);
        lastSaved = now;
      }
    });
    divEditor.addEventListener("focus", updateTableToolsVisibility);

    // Toolbar helpers
    function createToolbarGroup(label, opts = {}) {
      const group = el("div", { class: "weditor-toolbar-group", role: "group" });
      if (label) {
        group.appendChild(el("span", { class: "weditor-toolbar-group-label" }, [label]));
        try { group.setAttribute("aria-label", label); } catch(_) {}
      }
      const inner = el("div", { class: "weditor-toolbar-group-inner" });
      group.appendChild(inner);
      if (opts.initiallyHidden) {
        group.setAttribute("data-hidden", "true");
      }
      const targetRow = (opts && opts.row === "secondary") ? rowSecondary : rowPrimary;
      targetRow.appendChild(group);
      return { group, inner };
    }

    function addBtn(text, title, fn, target = toolbar){
      const b = el("button",{type:"button",title, "aria-label": title},[text]);
      b.addEventListener("click", fn);
      target.appendChild(b);
      return b;
    }

    // Undo / Redo / HTML (redo-safe)
    const groupHistory = createToolbarGroup("History",{row:"primary"});
    btnUndo = addBtn("Undo","Undo (Ctrl/Cmd+Z)", ()=>history.undo(), groupHistory.inner);
    btnRedo = addBtn("Redo","Redo (Ctrl+Y or Shift+Ctrl/Cmd+Z)", ()=>history.redo(), groupHistory.inner);

    const groupView = createToolbarGroup("View",{row:"primary"});
    addBtn("HTML","Toggle HTML view", ()=>{
      const before = getHTML();
      if (before !== history.current()){
        history.push(before);
        lastSaved = before;
      }
      if (!showingSource){
        divEditor.textContent = divEditor.innerHTML;
        showingSource = true;
      } else {
        divEditor.innerHTML = divEditor.textContent;
        showingSource = false;
      }
      const after = getHTML();
      if (after !== history.current()){
        history.push(after);
        lastSaved = after;
      }
      cancelSnapshotTimer();
      pair.value = after;
      updateUndoRedoButtons();
    }, groupView.inner);

    // Fullscreen
    let isFullScreen = false;
    let btnFs = null;
    function handleEscKey(e) {
      if (isFullScreen && e.key === "Escape") {
        e.preventDefault();
        toggleFullScreen();
      }
    }
    function toggleFullScreen() {
      isFullScreen = !isFullScreen;
      wrap.classList.toggle("weditor-fullscreen", isFullScreen);
      document.body.classList.toggle("weditor-fullscreen-active", isFullScreen);
      btnFs.textContent = isFullScreen ? "X" : "FS";
      btnFs.title = isFullScreen ? "Exit Fullscreen" : "Fullscreen";
      if (isFullScreen) {
        document.addEventListener("keydown", handleEscKey);
        divEditor.focus();
      } else {
        document.removeEventListener("keydown", handleEscKey);
      }
    }

    // Unified Formatting group (merge Text/Headings/Lists/Align)
    const groupFormatting = createToolbarGroup("Formatting");
    const btnBold = addBtn("B","Bold (Ctrl/Cmd+B)", ()=>exec("bold"), groupFormatting.inner);
    const btnItalic = addBtn("I","Italic (Ctrl/Cmd+I)", ()=>exec("italic"), groupFormatting.inner);
    const btnUnderline = addBtn("U","Underline (Ctrl/Cmd+U)", ()=>exec("underline"), groupFormatting.inner);
    /* moved Clear Formatting to More group (secondary row) */
    
    addBtn("H1","Heading 1", ()=>exec("formatBlock","<h1>"), groupFormatting.inner);
    addBtn("H2","Heading 2", ()=>exec("formatBlock","<h2>"), groupFormatting.inner);
    addBtn("P","Paragraph", ()=>exec("formatBlock","<p>"), groupFormatting.inner);
    
    const btnUL = addBtn("*","Bulleted list", ()=>exec("insertUnorderedList"), groupFormatting.inner);
    const btnOL = addBtn("1.","Numbered list", ()=>exec("insertOrderedList"), groupFormatting.inner);
    
    const btnAlignL = addBtn("L","Align left", ()=>exec("justifyLeft"), groupFormatting.inner);
    const btnAlignC = addBtn("C","Center", ()=>exec("justifyCenter"), groupFormatting.inner);
    const btnAlignR = addBtn("R","Align right", ()=>exec("justifyRight"), groupFormatting.inner);

    const groupInsert = createToolbarGroup("Insert",{row:"primary"});
    addBtn("Link","Insert link", ()=>{
      const u = prompt("Link URL:");
      if (!u) return;
      if (!isHttpUrl(u)) { alert("Only http(s) URL allowed"); return; }
      exec("createLink", u);
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let a = sel.anchorNode.nodeType===1? sel.anchorNode : sel.anchorNode.parentElement;
        if (a && a.tagName === "A") {
          a.setAttribute("target","_blank");
          a.setAttribute("rel","noopener noreferrer");
        }
      }
    }, groupInsert.inner);
    addBtn("Img","Insert image (URL)", ()=>{
      const u = prompt("Image URL:");
      if (!u) return;
      if (!isHttpUrl(u)) { alert("Only http(s) image URL allowed"); return; }
      exec("insertImage", u);
    }, groupInsert.inner);
    addBtn("HR","Horizontal rule", ()=>exec("insertHorizontalRule"), groupInsert.inner);
    // Secondary row - More (Clear, Fullscreen)
    const groupMore = createToolbarGroup("More",{row:"secondary"});
    addBtn("Clear","Clear Formatting", ()=>exec("removeFormat"), groupMore.inner);
    btnFs = addBtn("FS","Fullscreen", toggleFullScreen, groupMore.inner);

    const groupTableTools = createToolbarGroup("Table",{row:"secondary"});
    
    // Collapsed toggle for Table tools when caret not inside a table
    let tablePanelManualOpen = false;
    let tablePanelManualClosed = false; // remember if user explicitly collapsed (中文解释: 用户手动关闭后抑制自动展开)
    let tablePanelOutsideHandler = null;
    // Give the Table tools panel a stable id for a11y
    const tablePanelId = "weditor-table-panel-" + Math.random().toString(36).slice(2,9);
    groupTableTools.group.id = tablePanelId;
    
    const btnTableCollapsed = addBtn("Table ▾","Table tools", ()=>{
      toggleTablePanel(btnTableCollapsed);
    }, rowSecondary);
    // Secondary visual style + ARIA wiring
    btnTableCollapsed.classList.add("weditor-btn--secondary");
    btnTableCollapsed.setAttribute("aria-controls", tablePanelId);
    btnTableCollapsed.setAttribute("aria-expanded", "false");
    
    function toggleTablePanel(anchor){
      tablePanelManualOpen = !tablePanelManualOpen;
      if (tablePanelManualOpen){
        // User explicitly opened -> clear manual-closed suppression
        tablePanelManualClosed = false;
        groupTableTools.group.removeAttribute("data-hidden");
        anchor.setAttribute("aria-expanded","true");
        // Outside click to close
        if (!tablePanelOutsideHandler){
          tablePanelOutsideHandler = (evt)=>{
            const target = evt.target;
            if (!groupTableTools.group.contains(target) && !anchor.contains(target)){
              tablePanelManualOpen = false;
              tablePanelManualClosed = true; // mark user-intended collapse (中文解释: 记住用户关闭)
              groupTableTools.group.setAttribute("data-hidden","true");
              anchor.setAttribute("aria-expanded","false");
              document.removeEventListener("mousedown", tablePanelOutsideHandler, true);
              tablePanelOutsideHandler = null;
            }
          };
          document.addEventListener("mousedown", tablePanelOutsideHandler, true);
        }
      } else {
        // User clicked toggle to close -> suppress auto-open until user opens again
        tablePanelManualClosed = true;
        groupTableTools.group.setAttribute("data-hidden","true");
        anchor.setAttribute("aria-expanded","false");
        if (tablePanelOutsideHandler){
          document.removeEventListener("mousedown", tablePanelOutsideHandler, true);
          tablePanelOutsideHandler = null;
        }
      }
    }
    function createTableSubgroup(labelText) {
      const wrapper = el("div", { class: "weditor-table-subgroup" });
      if (labelText) {
        wrapper.appendChild(el("span", { class: "weditor-table-subgroup-label" }, [labelText]));
      }
      const container = el("div", { class: "weditor-table-subgroup-buttons" });
      wrapper.appendChild(container);
      groupTableTools.inner.appendChild(wrapper);
      return container;
    }

    function addTableAction(primary, secondary, title, handler, container) {
      const btn = el("button", { type: "button", title, class: "weditor-table-btn" });
      btn.appendChild(el("span", { class: "weditor-table-btn-primary" }, [primary]));
      if (secondary) {
        btn.appendChild(el("span", { class: "weditor-table-btn-secondary" }, [secondary]));
      }
      btn.addEventListener("click", handler);
      container.appendChild(btn);
      return btn;
    }

    function updateTableToolsVisibility() {
      // Auto-open when content contains a table unless user manually collapsed (中文解释: 用户手动关闭后不再自动展开)
      try {
        // Manual open always wins
        if (tablePanelManualOpen) {
          groupTableTools.group.removeAttribute("data-hidden");
          btnTableCollapsed.setAttribute("aria-expanded","true");
          return;
        }
        // Respect manual close (suppresses auto-open)
        if (tablePanelManualClosed) {
          groupTableTools.group.setAttribute("data-hidden","true");
          btnTableCollapsed.setAttribute("aria-expanded","false");
          return;
        }
        const hasAnyTable = !!divEditor.querySelector("table");
        // When no tables remain, clear suppression so future tables can auto-open
        if (!hasAnyTable) {
          tablePanelManualClosed = false;
        }
        let show = false;
        if (hasAnyTable) {
          // Auto-open if any table exists
          show = true;
        } else {
          // Fallback: caret-in-table (practically false if no table)
          const sel = window.getSelection();
          if (sel && sel.rangeCount) {
            const anchor = sel.anchorNode;
            const focus = sel.focusNode;
            const insideEditor = isNodeInside(anchor, divEditor) || isNodeInside(focus, divEditor);
            if (insideEditor) {
              const ctx = getTableContext();
              show = !!(ctx && ctx.table);
            }
          }
        }
        if (show) {
          groupTableTools.group.removeAttribute("data-hidden");
          btnTableCollapsed.setAttribute("aria-expanded","true");
        } else {
          groupTableTools.group.setAttribute("data-hidden", "true");
          btnTableCollapsed.setAttribute("aria-expanded","false");
        }
      } catch (err) {
        groupTableTools.group.setAttribute("data-hidden", "true");
        btnTableCollapsed.setAttribute("aria-expanded","false");
      }
    }

    // Toggle state helpers for accessibility and affordance
    function setToggleState(btn, active){
      if (!btn) return;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      if (active) btn.setAttribute("data-active","true");
      else btn.removeAttribute("data-active");
    }
    function updateToggleStates(){
      try {
        const bold = !!document.queryCommandState("bold");
        const italic = !!document.queryCommandState("italic");
        const underline = !!document.queryCommandState("underline");
        const ul = !!document.queryCommandState("insertUnorderedList");
        const ol = !!document.queryCommandState("insertOrderedList");
        const jl = !!document.queryCommandState("justifyLeft");
        const jc = !!document.queryCommandState("justifyCenter");
        const jr = !!document.queryCommandState("justifyRight");
        setToggleState(btnBold, bold);
        setToggleState(btnItalic, italic);
        setToggleState(btnUnderline, underline);
        setToggleState(btnUL, ul);
        setToggleState(btnOL, ol);
        setToggleState(btnAlignL, jl);
        setToggleState(btnAlignC, jc);
        setToggleState(btnAlignR, jr);
      } catch(e){}
    }
    const handleSelectionChange = () => {
      // Re-evaluate visibility on any selection change.
      updateTableToolsVisibility();
      updateToggleStates();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    updateTableToolsVisibility();

    updateUndoRedoButtons();

    // Keyboard shortcuts
    divEditor.addEventListener("keydown",(e)=>{
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey){
        e.preventDefault();
        history.undo();
      } else if (k === "y" || (k === "z" && e.shiftKey)){
        e.preventDefault();
        history.redo();
      }
    });

    // Mount DOM
    const parent = divEditor.parentNode;
    const nextSibling = parent ? divEditor.nextSibling : null;
    wrap.appendChild(toolbar);
    wrap.appendChild(divEditor);
    if (parent) {
      // Keep placement stable even inside tables by re-inserting at the original slot.
      if (nextSibling) parent.insertBefore(wrap, nextSibling);
      else parent.appendChild(wrap);
    }

    // ---------- 外部：Textarea → Editor 同步 ----------
    function setEditorHTMLFromTextarea(v) {
      const val = (v == null || v === "") ? "<p><br></p>" : String(v);
      setHTML(val, { silent: true });
      cancelSnapshotTimer();
      history.push(val);
      lastSaved = val;
      updateUndoRedoButtons();
      // Keep table tools in sync with content presence (中文解释: 内容含表格时自动展开)
      updateTableToolsVisibility();
    }
    pair.addEventListener("input", () => setEditorHTMLFromTextarea(pair.value));
    pair.addEventListener("change", () => setEditorHTMLFromTextarea(pair.value));
    const mo = new MutationObserver(() => setEditorHTMLFromTextarea(pair.value));
    mo.observe(pair, { characterData: true, subtree: true });

    // ====================== Table Utilities & UX ======================
    const BORDER_STYLE_OPTIONS = ["solid","dashed","dotted","double","none"];
    function normalizeBorderOptions(options){
      const base = options || {};
      let width = Number(base.width);
      if (!Number.isFinite(width) || width < 0) width = 1;
      let style = String(base.style || "solid").toLowerCase();
      if (!BORDER_STYLE_OPTIONS.includes(style)) style = "solid";
      let color = normalizeColorToHex(base.color || "#cccccc");
      if (style === "none" || width === 0) {
        style = "none";
        width = 0;
      }
      return { width, style, color };
    }
    function storeTableBorderState(table, preset, options){
      if (!table || !table.dataset) return;
      const normalized = normalizeBorderOptions(options);
      table.dataset.weditorBorderPreset = preset || "table-all";
      table.dataset.weditorBorderWidth = String(normalized.width);
      table.dataset.weditorBorderStyle = normalized.style;
      table.dataset.weditorBorderColor = normalized.color;
    }
    function getStoredTableBorderState(table){
      if (!table || !table.dataset) return null;
      const preset = table.dataset.weditorBorderPreset;
      if (!preset) return null;
      const width = parseFloat(table.dataset.weditorBorderWidth);
      const style = table.dataset.weditorBorderStyle;
      const color = table.dataset.weditorBorderColor;
      return {
        preset,
        options: normalizeBorderOptions({ width, style, color })
      };
    }
    function clearTableBorderState(table){
      if (!table || !table.dataset) return;
      delete table.dataset.weditorBorderPreset;
      delete table.dataset.weditorBorderWidth;
      delete table.dataset.weditorBorderStyle;
      delete table.dataset.weditorBorderColor;
    }
    function enforceStoredTableBorderState(table){
      const stored = getStoredTableBorderState(table);
      if (!stored) return false;
      applyTableBorderStyles(stored.options, stored.preset, table);
      return true;
    }
    function getCellFromSelection() {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode) return null;
      const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
      if (!el) return null;
      const cell = el.closest("td,th");
      if (!cell) return null;
      return divEditor.contains(cell) ? cell : null;
    }
    function getTableContext() {
      const cell = getCellFromSelection();
      if (!cell) return null;
      const row = cell.parentElement;
      const table = cell.closest("table");
      if (!table || !divEditor.contains(table)) return null;
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      let colIndex = 0;
      for (const td of row.children) {
        if (td === cell) break;
        colIndex += parseInt(td.getAttribute("colspan") || "1", 10);
      }
      return { table, row, cell, rowIndex, colIndex };
    }
    function normalizeTable(table) {
      if (!table) return;
      // Ensure TBODY exists
      if (!table.tBodies || table.tBodies.length === 0) {
        const tb = document.createElement("tbody");
        while (table.firstChild) tb.appendChild(table.firstChild);
        table.appendChild(tb);
      }
      // Compute current column count from first row (sum of colspans)
      const firstRow = table.rows[0];
      let colCount = 0;
      if (firstRow){
        colCount = Array.from(firstRow.children).reduce((n, td)=> n + parseInt(td.getAttribute("colspan") || "1", 10), 0);
      }
      // Ensure colgroup exists and matches colCount
      let cg = table.querySelector("colgroup");
      if (!cg && colCount > 0) {
        cg = document.createElement("colgroup");
        const pct = (100/colCount).toFixed(3) + "%";
        for (let i=0;i<colCount;i++){
          const c = document.createElement("col");
          c.style.width = pct;
          cg.appendChild(c);
        }
        table.insertBefore(cg, table.tBodies[0] || table.firstChild);
      } else if (cg) {
        const cols = Array.from(cg.children);
        if (cols.length < colCount) {
          for (let i=cols.length;i<colCount;i++) cg.appendChild(document.createElement("col"));
        } else if (cols.length > colCount) {
          for (let i=cols.length-1;i>=colCount;i--) cg.removeChild(cg.children[i]);
        }
      }
      // Cell hygiene; width controlled by <col>
      table.querySelectorAll("td,th").forEach(td=>{
        if (!td.innerHTML || td.innerHTML === "") td.innerHTML = "&nbsp;";
        td.style.verticalAlign = td.style.verticalAlign || "top";
        td.style.width = "";
        td.style.whiteSpace = "";
      });
      table.style.borderCollapse = table.style.borderCollapse || "collapse";
      if (!table.style.width) table.style.width = "100%";
      table.style.tableLayout = table.style.tableLayout || "fixed";
    }

    function getVisualColumnIndex(cell) {
      if (!cell) return -1;
      const row = cell.parentElement;
      const table = row ? row.closest("table") : null;
      if (!row || !table) return -1;
      const rows = Array.from(table.rows);
      const spanMap = [];
      for (const tr of rows) {
        for (let i = 0; i < spanMap.length; i++) {
          if (spanMap[i] > 0) spanMap[i] -= 1;
        }
        let colCursor = 0;
        for (const td of Array.from(tr.children)) {
          while ((spanMap[colCursor] || 0) > 0) {
            colCursor++;
          }
          const colspan = parseInt(td.getAttribute("colspan") || "1", 10) || 1;
          const rowspan = (parseInt(td.getAttribute("rowspan") || "1", 10) || 1) - 1;
          if (td === cell) {
            return colCursor;
          }
          for (let span = 0; span < colspan; span++) {
            spanMap[colCursor + span] = Math.max(rowspan, 0);
          }
          colCursor += colspan;
        }
      }
      return -1;
    }

    function findCellCoveringColumn(table, colIndex) {
      if (!table || colIndex < 0) return null;
      const spanMap = [];
      for (const tr of Array.from(table.rows)) {
        for (let i = 0; i < spanMap.length; i++) {
          if (spanMap[i] > 0) spanMap[i] -= 1;
        }
        let colCursor = 0;
        for (const td of Array.from(tr.children)) {
          while ((spanMap[colCursor] || 0) > 0) {
            colCursor++;
          }
          const colspan = parseInt(td.getAttribute("colspan") || "1", 10) || 1;
          const rowspan = (parseInt(td.getAttribute("rowspan") || "1", 10) || 1) - 1;
          const covers = colCursor <= colIndex && colIndex < colCursor + colspan;
          if (covers) {
            return { cell: td, colspan };
          }
          for (let span = 0; span < colspan; span++) {
            spanMap[colCursor + span] = Math.max(rowspan, 0);
          }
          colCursor += colspan;
        }
      }
      return null;
    }

    function buildTableMap(table) {
      const map = [];
      const rowspans = [];
      Array.from(table.rows).forEach((row, rowIndex) => {
        map[rowIndex] = [];
        let colIndex = 0;
        Array.from(row.cells).forEach(cell => {
          while (rowspans[colIndex]) {
            map[rowIndex][colIndex] = rowspans[colIndex].cell;
            rowspans[colIndex].rowspan--;
            if (rowspans[colIndex].rowspan === 0) {
              rowspans[colIndex] = undefined;
            }
            colIndex++;
          }
          map[rowIndex][colIndex] = cell;
          const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
          const rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
          for (let c = 0; c < colspan; c++) {
            for (let r = 0; r < rowspan; r++) {
              if (r > 0) {
                if (!map[rowIndex + r]) map[rowIndex + r] = [];
                map[rowIndex + r][colIndex + c] = cell;
              }
              if (c > 0) {
                map[rowIndex][colIndex + c] = cell;
              }
            }
          }
          if (rowspan > 1) {
            rowspans[colIndex] = { cell, rowspan: rowspan - 1 };
          }
          colIndex += colspan;
        });
      });
      return map;
    }

    function getCellCoords(tableMap, cell) {
      for (let r = 0; r < tableMap.length; r++) {
        for (let c = 0; c < tableMap[r].length; c++) {
          if (tableMap[r][c] === cell) {
            return { r, c };
          }
        }
      }
      return null;
    }

    function measureColumnWidth(table, colIndex, cachedHit) {
      const hit = cachedHit || findCellCoveringColumn(table, colIndex);
      if (!hit) return null;
      const { cell, colspan } = hit;
      const rect = cell.getBoundingClientRect ? cell.getBoundingClientRect() : null;
      const raw = rect ? rect.width : cell.offsetWidth;
      if (!Number.isFinite(raw) || raw <= 0) return null;
      return raw / Math.max(colspan, 1);
    }

    function getSelectedCellsInRow(row, range){
      if (!row || !range) return [];
      const cells = Array.from(row.children);
      const selected = [];
      for (const cell of cells){
        let intersects = false;
        if (typeof range.intersectsNode === "function"){
          try {
            intersects = range.intersectsNode(cell);
          } catch (err) {
            intersects = false;
          }
        }
        if (!intersects){
          const cellRange = document.createRange();
          cellRange.selectNodeContents(cell);
          const endsBefore = range.compareBoundaryPoints(Range.END_TO_START, cellRange) < 0;
          const startsAfter = range.compareBoundaryPoints(Range.START_TO_END, cellRange) > 0;
          if (!endsBefore && !startsAfter){
            intersects = true;
          }
          cellRange.detach?.();
        }
        if (intersects){
          selected.push(cell);
        }
      }
      tableDebug("getSelectedCellsInRow", { count: selected.length, row, range });
      return selected;
    }

    function getCellIndexFromRowOffset(row, offset){
      if (!row || offset == null || offset < 0) return -1;
      const nodes = Array.from(row.childNodes || []);
      let cellIndex = 0;
      for (let i=0;i<nodes.length;i++){
        const node = nodes[i];
        if (node.nodeType === 1){
          const tag = node.tagName ? node.tagName.toLowerCase() : "";
          if (tag === "td" || tag === "th"){
            if (i >= offset) return cellIndex;
            cellIndex++;
          }
        }
      }
      return cellIndex;
    }

    function ensurePixelColWidths(table) {
      const cg = table.querySelector("colgroup");
      if (!cg) return;
      const cols = Array.from(cg.children);
      if (!cols.length) return;
      const tableRect = table.getBoundingClientRect();
      const fallbackTotal = tableRect.width || table.offsetWidth || 0;
      let totalAssigned = 0;
      cols.forEach((col, idx)=>{
        const hit = findCellCoveringColumn(table, idx);
        let width = measureColumnWidth(table, idx, hit);
        if (!Number.isFinite(width) || width <= 0) {
          const parsed = parseFloat(col.style.width);
          width = Number.isFinite(parsed) && parsed > 0 ? parsed : MIN_COL_WIDTH;
        }
        width = Math.max(MIN_COL_WIDTH, Math.round(width));
        col.style.width = width + "px";
        totalAssigned += width;
      });
      const finalWidth = totalAssigned > 0 ? totalAssigned : Math.max(MIN_TABLE_WIDTH, Math.round(fallbackTotal));
      if (finalWidth > 0) table.style.width = finalWidth + "px";
    }

    function getCurrentBorderSettings(table) {
      const fallback = { width: 1, style: "solid", color: "#cccccc" };
      if (!table) return fallback;
      const stored = getStoredTableBorderState(table);
      if (stored) {
        return {
          width: Math.max(0, Math.round(stored.options.width)),
          style: stored.options.style,
          color: stored.options.color
        };
      }
      const sampleCell = table.querySelector("td,th");
      const computed = sampleCell && window.getComputedStyle ? window.getComputedStyle(sampleCell) : null;
      let width = computed ? parseFloat(computed.borderLeftWidth || "0") || 0 : 0;
      let style = computed ? String(computed.borderLeftStyle || fallback.style).toLowerCase() : fallback.style;
      if (!BORDER_STYLE_OPTIONS.includes(style)) style = fallback.style;
      let color = normalizeColorToHex(computed ? computed.borderLeftColor || fallback.color : fallback.color);
      if (width <= 0 || style === "none") {
        const tableComputed = window.getComputedStyle ? window.getComputedStyle(table) : null;
        const tableWidth = tableComputed ? parseFloat(tableComputed.borderTopWidth || "0") || 0 : 0;
        const tableStyleRaw = tableComputed ? String(tableComputed.borderTopStyle || "").toLowerCase() : "";
        const tableStyle = BORDER_STYLE_OPTIONS.includes(tableStyleRaw) ? tableStyleRaw : (tableStyleRaw === "none" ? "none" : style);
        if (tableStyleRaw === "none") {
          style = "none";
          width = 0;
        } else if (tableWidth > 0 && tableStyleRaw && tableStyleRaw !== "none") {
          width = Math.max(0, Math.round(tableWidth));
          style = tableStyle;
          color = normalizeColorToHex(tableComputed ? tableComputed.borderTopColor || color : color);
        }
      }
      return {
        width: Math.max(0, Math.round(width)),
        style,
        color
      };
    }

    function applyTableBorderStyles(options, preset = "table-all", tableOverride = null) {
      if (!options) return;
      let table = tableOverride;
      if (!table) {
        if (!restoreEditorSelection()) divEditor.focus();
        const ctx = getTableContext();
        if (!ctx || !ctx.table) return;
        table = ctx.table;
      }
      normalizeTable(table);
      const { width, style, color } = normalizeBorderOptions(options);
      const zero = style === "none" || width === 0;
      const value = width + "px " + style + " " + color;
      if (preset === "table-none" || zero) {
        table.style.border = "none";
        table.style.borderStyle = "none";
        table.style.borderWidth = "0";
        table.style.borderColor = "";
        table.querySelectorAll("td,th").forEach(cell=>{
          cell.style.border = "0";
          cell.style.borderStyle = "none";
          cell.style.borderWidth = "0";
          cell.style.borderColor = "";
        });
      } else if (preset === "table-outer") {
        table.style.border = value;
        table.style.borderStyle = style;
        table.style.borderWidth = width + "px";
        table.style.borderColor = color;
        table.querySelectorAll("td,th").forEach(cell=>{
          cell.style.border = "0";
          cell.style.borderStyle = "none";
          cell.style.borderWidth = "0";
          cell.style.borderColor = "";
        });
      } else {
        table.style.border = value;
        table.style.borderStyle = style;
        table.style.borderWidth = width + "px";
        table.style.borderColor = color;
        table.querySelectorAll("td,th").forEach(cell=>{
          cell.style.border = value;
          cell.style.borderStyle = style;
          cell.style.borderWidth = width + "px";
          cell.style.borderColor = color;
        });
      }
      table.style.borderCollapse = table.style.borderCollapse || "collapse";
      storeTableBorderState(table, preset, { width, style, color });
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    function applyCellBorderPreset(cell, options, preset = "cell-all") {
      if (!cell) return;
      const table = cell.closest("table");
      if (table) {
        normalizeTable(table);
        table.style.borderCollapse = table.style.borderCollapse || "collapse";
      }
      const { width, style, color } = normalizeBorderOptions(options);
      if (preset === "cell-none") {
        cell.style.border = "0";
        cell.style.borderStyle = "none";
        cell.style.borderWidth = "0";
        cell.style.borderColor = "";
        divEditor.dispatchEvent(new Event("input",{bubbles:true}));
        return;
      }
      const zero = style === "none" || width === 0;
      const value = width + "px " + style + " " + color;
      if (preset === "cell-all") {
        cell.style.border = value;
        cell.style.borderStyle = style;
        cell.style.borderWidth = width + "px";
        cell.style.borderColor = color;
      } else {
        const SIDE_MAP = {
          "cell-top": "Top",
          "cell-right": "Right",
          "cell-bottom": "Bottom",
          "cell-left": "Left"
        };
        const side = SIDE_MAP[preset];
        if (!side) {
          divEditor.dispatchEvent(new Event("input",{bubbles:true}));
          return;
        }
        const base = "border" + side;
        if (zero) {
          cell.style[base] = "0";
          cell.style[base + "Style"] = "none";
          cell.style[base + "Width"] = "0";
          cell.style[base + "Color"] = "";
        } else {
          cell.style[base] = value;
          cell.style[base + "Style"] = style;
          cell.style[base + "Width"] = width + "px";
          cell.style[base + "Color"] = color;
        }
      }
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    function resetTableBorders() {
      if (!restoreEditorSelection()) divEditor.focus();
      const ctx = getTableContext();
      if (!ctx || !ctx.table) return;
      const { table } = ctx;
      normalizeTable(table);
      table.style.border = "";
      table.style.borderStyle = "";
      table.style.borderWidth = "";
      table.style.borderColor = "";
      table.querySelectorAll("td,th").forEach(cell=>{
        cell.style.border = "";
        cell.style.borderStyle = "";
        cell.style.borderWidth = "";
        cell.style.borderColor = "";
      });
      clearTableBorderState(table);
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    function hideTableBorders() {
      applyTableBorderStyles({ width: 0, style: "none", color: "#000000" }, "table-none");
    }

    function insertRow(after = true) {
      const ctx = getTableContext(); if (!ctx) return;
      normalizeTable(ctx.table);
      const { table, row, rowIndex } = ctx;
      const refIndex = after ? rowIndex + 1 : rowIndex;
      const cols = Array.from(row.children).reduce((n, td)=> n + parseInt(td.getAttribute("colspan") || "1", 10), 0);
      const tr = document.createElement("tr");
      for (let i=0;i<cols;i++) {
        const td = document.createElement("td");
        td.style.padding = "6px";
        td.style.verticalAlign = "top";
        td.innerHTML = "&nbsp;";
        tr.appendChild(td);
      }
      (table.tBodies[0]||table).insertBefore(tr, (table.tBodies[0]||table).children[refIndex] || null);
      placeCaretInside(tr.children[0]);
      const restyled = enforceStoredTableBorderState(table);
      if (!restyled) divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function deleteRow() {
      const ctx = getTableContext(); if (!ctx) return;
      const { table, row } = ctx;
      const body = table.tBodies[0] || table;
      if (body.rows.length <= 1) { table.remove(); }
      else { row.remove(); }
      const restyled = enforceStoredTableBorderState(table);
      if (!restyled) divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function insertCol(after = true) {
      const ctx = getTableContext(); if (!ctx) return;
      normalizeTable(ctx.table);
      const { table, colIndex, cell } = ctx;
      const parsedSpan = parseInt(cell.getAttribute("colspan") || "1", 10);
      const currentSpan = Number.isFinite(parsedSpan) && parsedSpan > 0 ? parsedSpan : 1;
      const idx = after ? colIndex + currentSpan : colIndex;

      // Insert a cell in each row at visual index
      const createdCells = [];
      Array.from(table.rows).forEach(tr=>{
        const tdList = Array.from(tr.children);
        let vIndex = 0, insertBefore = null;
        for (const cell of tdList) {
          const span = parseInt(cell.getAttribute("colspan") || "1", 10);
          if (vIndex + span > idx) { insertBefore = cell; break; }
          vIndex += span;
        }
        const td = document.createElement("td");
        td.style.padding = "6px";
        td.style.verticalAlign = "top";
        td.innerHTML = "&nbsp;";
        tr.insertBefore(td, insertBefore);
        createdCells.push(td);
      });

      // Mirror the structure in <colgroup>
      const cg = table.querySelector("colgroup");
      if (cg){
        const newCol = document.createElement("col");
        cg.insertBefore(newCol, cg.children[idx] || null);
        const usesPxSizing = Array.from(cg.children).some(col=>{
          const w = col.style.width || "";
          return /\dpx\s*$/i.test(w);
        }) || (table.style.width && /\dpx\s*$/i.test(table.style.width));
        if (usesPxSizing) {
          ensurePixelColWidths(table);
        } else {
          const needsFix = createdCells.every(cell=>{
            const rect = cell.getBoundingClientRect ? cell.getBoundingClientRect() : null;
            const width = rect ? rect.width : cell.offsetWidth;
            return !Number.isFinite(width) || width < 1;
          });
          if (needsFix) {
            ensurePixelColWidths(table);
          } else {
            const n = cg.children.length;
            if (n > 0) {
              const pct = (100 / n).toFixed(3) + "%";
              Array.from(cg.children).forEach(col=>{
                if (!col.style.width || !/\S/.test(col.style.width) || !/%\s*$/i.test(col.style.width)) {
                  col.style.width = pct;
                }
              });
            }
          }
        }
      }

      const restyled = enforceStoredTableBorderState(table);
      if (!restyled) divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function deleteCol() {
      const ctx = getTableContext(); if (!ctx) return;
      const { table, colIndex } = ctx;
      Array.from(table.rows).forEach(tr=>{
        let vIndex = 0;
        for (const cell of Array.from(tr.children)) {
          const span = parseInt(cell.getAttribute("colspan") || "1", 10);
          if (vIndex <= colIndex && colIndex < vIndex + span) { cell.remove(); break; }
          vIndex += span;
        }
      });
      const cg = table.querySelector("colgroup");
      if (cg && cg.children[colIndex]) cg.children[colIndex].remove();
      const restyled = enforceStoredTableBorderState(table);
      if (!restyled) divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function distributeColumns() {
      const ctx = getTableContext(); if (!ctx) return;
      const { table } = ctx;
      normalizeTable(table);
      const cg = table.querySelector("colgroup");
      if (!cg) return;
      const n = cg.children.length;
      if (!n) return;
      const pct = (100 / n).toFixed(3) + "%";
      Array.from(cg.children).forEach(col=>{ col.style.width = pct; });
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function autofitColumns() {
      const ctx = getTableContext(); if (!ctx) return;
      const { table } = ctx;
      normalizeTable(table);
      const cg = table.querySelector("colgroup");
      if (cg) Array.from(cg.children).forEach(col=>{ col.style.width = ""; });
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function setCurrentColumnWidth() {
      const ctx = getTableContext(); if (!ctx) return;
      const { table, colIndex } = ctx;
      const val = prompt("Column width (e.g. 120px or 20%):", "120px");
      if (!val) return;
      if (!/^\s*\d+(\.\d+)?(px|%)\s*$/.test(val)) { alert("Please enter a valid px or % value"); return; }
      const width = val.trim();
      normalizeTable(table);
      const cg = table.querySelector("colgroup");
      if (!cg) return;
      const col = cg.children[colIndex];
      if (!col) return;
      col.style.width = width;
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    function mergeSelectedCellsHorizontally() {
      const cellsToMerge = cellSelectionState.selectedCells;
      tableDebug("mergeSelectedCellsHorizontally invoked with new logic", { count: cellsToMerge.length });

      if (cellsToMerge.length <= 1) {
        alert("Please select two or more cells to merge.");
        return;
      }

      const table = cellsToMerge[0].closest("table");
      if (!table) return;

      // Verify all cells are in the same row and table
      const parentRow = cellsToMerge[0].parentElement;
      const allInSameRow = cellsToMerge.every(cell => cell.parentElement === parentRow && cell.closest("table") === table);
      if (!allInSameRow) {
        alert("Please select cells within a single row to merge.");
        return;
      }
      
      // Verify no cells have rowspan > 1
      if (cellsToMerge.some(cell => (parseInt(cell.getAttribute("rowspan") || "1", 10) || 1) > 1)) {
        alert("Merging cells that span multiple rows is not supported yet.");
        return;
      }

      normalizeTable(table);
      
      // Sort cells by their visual order in the row
      const rowCells = Array.from(parentRow.children);
      cellsToMerge.sort((a, b) => rowCells.indexOf(a) - rowCells.indexOf(b));

      const combinedColspan = cellsToMerge.reduce((sum, cell) => {
        return sum + Math.max(1, parseInt(cell.getAttribute("colspan") || "1", 10));
      }, 0);

      const hasMeaningfulContent = (cell) => {
        const text = cell.textContent ? cell.textContent.replace(/\u00A0/g, "").trim() : "";
        if (text.length > 0) return true;
        return Boolean(cell.querySelector && cell.querySelector("img,table,iframe,video,svg,canvas"));
      };
      const contentParts = [];
      cellsToMerge.forEach(cell => {
        if (hasMeaningfulContent(cell)) {
          contentParts.push(cell.innerHTML);
        }
      });

      const first = cellsToMerge[0];
      for (let i = 1; i < cellsToMerge.length; i++) {
        cellsToMerge[i].remove();
      }

      if (combinedColspan > 1) first.setAttribute("colspan", combinedColspan);
      else first.removeAttribute("colspan");

      if (contentParts.length) {
        first.innerHTML = contentParts.join("<br>");
      } else {
        first.innerHTML = "&nbsp;";
      }

      placeCaretInside(first);
      clearCellSelection();
      const restyled = enforceStoredTableBorderState(table);
      if (!restyled) divEditor.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // track last caret inside editor (for popup actions)
    let savedEditorRange = null;
    function saveEditorSelection(){
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      if (!isNodeInside(range.commonAncestorContainer, divEditor)) return;

      tableDebug("saveEditorSelection", { collapsed: range.collapsed, start: range.startContainer, end: range.endContainer });
      savedEditorRange = range.cloneRange();
      updateTableToolsVisibility();
    }
    function restoreEditorSelection(){
      const sel = window.getSelection();
      if (!savedEditorRange || !sel) return false;
      sel.removeAllRanges();
      sel.addRange(savedEditorRange);
      tableDebug("restoreEditorSelection applied", { collapsed: savedEditorRange.collapsed, start: savedEditorRange.startContainer, end: savedEditorRange.endContainer });
      return true;
    }
    divEditor.addEventListener("mouseup", saveEditorSelection);
    divEditor.addEventListener("keyup", saveEditorSelection);

    function positionToolbarPopup(anchor, popup) {
      if (!anchor || !popup) return;
      const toolbarRect = toolbar.getBoundingClientRect();
      const buttonRect = anchor.getBoundingClientRect();
      const rawLeft = buttonRect.left - toolbarRect.left;
      const maxLeft = Math.max(4, toolbarRect.width - popup.offsetWidth - 8);
      const left = Math.min(Math.max(4, rawLeft), maxLeft);
      popup.style.left = left + "px";
    }

    // ------ Insert Table Popup ------
    const insertTablePopup = (() => {
      let node = null;
      let outsideHandler = null;
      let lastRows = 2;
      let lastCols = 2;

      function ensurePopup() {
        if (node) return node;
        node = el("div", { class: "weditor-table-popup" }, [
          el("label", null, [
            "Rows",
            el("input", { type: "number", min: "1", step: "1", value: String(lastRows), name: "rows" })
          ]),
          el("label", null, [
            "Columns",
            el("input", { type: "number", min: "1", step: "1", value: String(lastCols), name: "cols" })
          ]),
          el("div", { class: "actions" }, [
            el("button", { type: "button", "data-action": "cancel" }, ["Cancel"]),
            el("button", { type: "button", "data-action": "ok" }, ["Insert"])
          ])
        ]);

        const handleOk = () => {
          if (!node) return;
          const rowsInput = node.querySelector('input[name="rows"]');
          const colsInput = node.querySelector('input[name="cols"]');
          const rows = parseInt(rowsInput.value, 10);
          const cols = parseInt(colsInput.value, 10);
          if (!Number.isFinite(rows) || rows <= 0) {
            rowsInput.focus();
            rowsInput.select();
            return;
          }
          if (!Number.isFinite(cols) || cols <= 0) {
            colsInput.focus();
            colsInput.select();
            return;
          }
          lastRows = rows;
          lastCols = cols;
          closePopup();
          if (!restoreEditorSelection()) {
            divEditor.focus();
            moveCaretToEnd(divEditor);
          } else {
            divEditor.focus();
          }
          insertTableAtCaret(divEditor, rows, cols);
          saveEditorSelection();
        };

        node.addEventListener("click", (evt) => {
          const action = evt.target && evt.target.dataset ? evt.target.dataset.action : null;
          if (!action) return;
          evt.preventDefault();
          if (action === "cancel") {
            closePopup();
          } else if (action === "ok") {
            handleOk();
          }
        });

        node.addEventListener("keydown", (evt) => {
          if (evt.key === "Escape") {
            evt.preventDefault();
            closePopup();
          } else if (evt.key === "Enter") {
            evt.preventDefault();
            handleOk();
          }
        });

        return node;
      }

      function openPopup(anchor) {
        closePopup();
        saveEditorSelection();
        const popup = ensurePopup();
        const rowsInput = popup.querySelector('input[name="rows"]');
        const colsInput = popup.querySelector('input[name="cols"]');
        rowsInput.value = String(lastRows);
        colsInput.value = String(lastCols);
        toolbar.appendChild(popup);
        popup.setAttribute("data-open", "true");
        requestAnimationFrame(() => {
          positionToolbarPopup(anchor, popup);
          rowsInput.focus();
          rowsInput.select();
        });
        outsideHandler = (evt) => {
          if (!popup.contains(evt.target) && !anchor.contains(evt.target)) {
            closePopup();
          }
        };
        document.addEventListener("mousedown", outsideHandler, true);
      }

      function closePopup() {
        if (!node) return;
        node.removeAttribute("data-open");
        if (node.parentNode) node.parentNode.removeChild(node);
        if (outsideHandler) {
          document.removeEventListener("mousedown", outsideHandler, true);
          outsideHandler = null;
        }
      }

      return {
        open: openPopup,
        close: closePopup
      };
    })();

    // ------ Table Border Popup ------
    const tableBorderPopup = (() => {
      let node = null;
      let outsideHandler = null;
      let widthInput = null;
      let styleSelect = null;
      let colorInput = null;
      let scopeSelect = null;
      let tablePresetContainer = null;
      let cellPresetContainer = null;
      let tablePresetSection = null;
      let cellPresetSection = null;
      let tablePresetButtons = [];
      let cellPresetButtons = [];
      let currentScope = "table";
      let tablePreset = "table-all";
      let cellPreset = "cell-all";
      let lastSettings = { width: 1, style: "solid", color: "#cccccc" };
      let lastState = { scope: "table", tablePreset: "table-all", cellPreset: "cell-all" };

      function selectPreset(group, value){
        const buttons = group === "table" ? tablePresetButtons : cellPresetButtons;
        buttons.forEach(btn=>{
          btn.setAttribute("data-active", btn.dataset.value === value ? "true" : "false");
        });
        if (group === "table") {
          tablePreset = value;
        } else {
          cellPreset = value;
        }
      }

      function updateScopeUI(){
        if (!tablePresetSection || !cellPresetSection) return;
        if (currentScope === "cell") {
          tablePresetSection.setAttribute("data-hidden","true");
          cellPresetSection.removeAttribute("data-hidden");
        } else {
          cellPresetSection.setAttribute("data-hidden","true");
          tablePresetSection.removeAttribute("data-hidden");
        }
      }

      function createPresetButton(label, value, group){
        const btn = el("button", { type: "button", class: "weditor-border-option", "data-value": value }, [label]);
        btn.addEventListener("click", ()=>{
          if (group === "table") {
            tablePreset = value;
            selectPreset("table", value);
          } else {
            cellPreset = value;
            selectPreset("cell", value);
          }
        });
        return btn;
      }

      function ensurePopup() {
        if (node) return node;
        widthInput = el("input", { type: "number", name: "borderWidth", min: "0", step: "1" });
        styleSelect = el("select", { name: "borderStyle" }, BORDER_STYLE_OPTIONS.map(style=>{
          const label = style.charAt(0).toUpperCase() + style.slice(1);
          return el("option", { value: style }, [label]);
        }));
        colorInput = el("input", { type: "color", name: "borderColor" });
        scopeSelect = el("select", { name: "borderScope" }, [
          el("option", { value: "table" }, ["Whole table"]),
          el("option", { value: "cell" }, ["Current cell"])
        ]);
        scopeSelect.addEventListener("change", ()=>{
          currentScope = scopeSelect.value === "cell" ? "cell" : "table";
          updateScopeUI();
        });

        tablePresetContainer = el("div", { class: "weditor-border-presets" });
        tablePresetButtons = [
          createPresetButton("All Grid", "table-all", "table"),
          createPresetButton("Outer Only", "table-outer", "table"),
          createPresetButton("No Borders", "table-none", "table")
        ];
        tablePresetButtons.forEach(btn=>tablePresetContainer.appendChild(btn));

        cellPresetContainer = el("div", { class: "weditor-border-presets" });
        cellPresetButtons = [
          createPresetButton("All Sides", "cell-all", "cell"),
          createPresetButton("Top", "cell-top", "cell"),
          createPresetButton("Right", "cell-right", "cell"),
          createPresetButton("Bottom", "cell-bottom", "cell"),
          createPresetButton("Left", "cell-left", "cell"),
          createPresetButton("No Borders", "cell-none", "cell")
        ];
        cellPresetButtons.forEach(btn=>cellPresetContainer.appendChild(btn));

        const styleSection = el("div", { class: "weditor-border-section" }, [
          el("span", { class: "weditor-border-heading" }, ["Line style"]),
          el("label", null, ["Line width (px)", widthInput]),
          el("label", null, ["Border style", styleSelect]),
          el("label", null, ["Color", colorInput])
        ]);

        const scopeSection = el("div", { class: "weditor-border-section" }, [
          el("span", { class: "weditor-border-heading" }, ["Apply to"]),
          el("div", { class: "weditor-border-scope" }, [scopeSelect])
        ]);

        tablePresetSection = el("div", { class: "weditor-border-section" }, [
          el("span", { class: "weditor-border-heading" }, ["Table presets"]),
          tablePresetContainer
        ]);

        cellPresetSection = el("div", { class: "weditor-border-section" }, [
          el("span", { class: "weditor-border-heading" }, ["Cell presets"]),
          cellPresetContainer
        ]);

        const actions = el("div", { class: "actions" });
        const btnCancel = el("button", { type: "button" }, ["Cancel"]);
        const btnApply = el("button", { type: "button" }, ["Apply"]);
        actions.appendChild(btnCancel);
        actions.appendChild(btnApply);

        node = el("div", { class: "weditor-table-popup weditor-border-popup" }, [
          styleSection,
          scopeSection,
          tablePresetSection,
          cellPresetSection,
          actions
        ]);

        scopeSelect.value = currentScope;
        selectPreset("table", tablePreset);
        selectPreset("cell", cellPreset);
        updateScopeUI();

        btnCancel.addEventListener("click", () => {
          closePopup();
        });
        btnApply.addEventListener("click", () => {
          const scope = scopeSelect.value === "cell" ? "cell" : "table";
          const preset = scope === "cell" ? cellPreset : tablePreset;
          const rawWidth = parseFloat(widthInput.value);
          if (preset !== "cell-none" && preset !== "table-none") {
            if (!Number.isFinite(rawWidth) || rawWidth < 0) {
              alert("Please enter a non-negative number for the border width.");
              widthInput.focus();
              widthInput.select();
              return;
            }
          }
          const selectedStyle = styleSelect.value || lastSettings.style;
          const selectedColor = normalizeColorToHex(colorInput.value || lastSettings.color);
          const normalized = normalizeBorderOptions({ width: rawWidth, style: selectedStyle, color: selectedColor });
          lastSettings = { width: normalized.width, style: normalized.style, color: selectedColor };
          if (!restoreEditorSelection()) {
            divEditor.focus();
          }
          const ctx = getTableContext();
          if (!ctx || !ctx.table) {
            closePopup();
            return;
          }
          if (scope === "table") {
            const applyOptions = preset === "table-none"
              ? { width: 0, style: "none", color: selectedColor }
              : { width: normalized.width, style: normalized.style, color: selectedColor };
            applyTableBorderStyles(applyOptions, preset, ctx.table);
          } else {
            if (!ctx.cell) {
              closePopup();
              return;
            }
            const applyOptions = preset === "cell-none"
              ? { width: 0, style: "none", color: selectedColor }
              : { width: normalized.width, style: normalized.style, color: selectedColor };
            applyCellBorderPreset(ctx.cell, applyOptions, preset);
          }
          lastState.scope = scope;
          lastState.tablePreset = tablePreset;
          lastState.cellPreset = cellPreset;
          closePopup();
        });

        return node;
      }

      function openPopup(anchor) {
        closePopup();
        saveEditorSelection();
        const ctx = getTableContext();
        if (!ctx || !ctx.table) return;
        lastSettings = getCurrentBorderSettings(ctx.table);
        const popup = ensurePopup();
        widthInput.value = String(lastSettings.width);
        styleSelect.value = lastSettings.style;
        colorInput.value = normalizeColorToHex(lastSettings.color);
        currentScope = lastState.scope;
        if (currentScope === "cell" && !ctx.cell) currentScope = "table";
        const storedState = getStoredTableBorderState(ctx.table);
        const validStoredPreset = storedState && ["table-all","table-outer","table-none"].includes(storedState.preset) ? storedState.preset : null;
        tablePreset = validStoredPreset || lastState.tablePreset;
        cellPreset = lastState.cellPreset;
        scopeSelect.value = currentScope;
        selectPreset("table", tablePreset);
        selectPreset("cell", cellPreset);
        updateScopeUI();
        toolbar.appendChild(popup);
        popup.setAttribute("data-open", "true");
        requestAnimationFrame(() => {
          positionToolbarPopup(anchor, popup);
          const focusTarget = currentScope === "cell" ? cellPresetButtons[0] : widthInput;
          if (focusTarget && focusTarget.focus) {
            focusTarget.focus();
            if (focusTarget === widthInput) {
              widthInput.select();
            }
          }
        });
        outsideHandler = (evt) => {
          if (!popup.contains(evt.target) && (!anchor || !anchor.contains(evt.target))) {
            closePopup();
          }
        };
        document.addEventListener("mousedown", outsideHandler, true);
      }

      function closePopup() {
        if (!node) return;
        node.removeAttribute("data-open");
        if (node.parentNode) node.parentNode.removeChild(node);
        if (outsideHandler) {
          document.removeEventListener("mousedown", outsideHandler, true);
          outsideHandler = null;
        }
      }

      return {
        open: openPopup,
        close: closePopup
      };
    })();

    // ------ Column / Table Resize via Drag ------
    let colResizeState = null; // { table, colIndex, startX, startWidthPx }
    let rowResizeState = null; // { row, table, startY, startHeight }
    let tableResizeState = null; // { table, startX, startWidth, ratios, minWidth }
    let tableResizeHover = null; // { table, rect, delta }
    let rowResizeHover = null; // { row, table }
    const EDGE = 6;
    const TABLE_EDGE = 10;
    const ROW_EDGE = 6;
    const MIN_COL_WIDTH = 5;
    const MIN_ROW_HEIGHT = 5;
    const MIN_TABLE_WIDTH = 160;

    function getColIndexFromHit(cell, clientX) {
      const rect = cell.getBoundingClientRect();
      const offsetRight = rect.right - clientX;
      const nearRight = offsetRight <= EDGE && offsetRight >= -2;
      if (nearRight) {
        const idx = getVisualColumnIndex(cell);
        return idx;
      }
      const offsetLeft = clientX - rect.left;
      const nearLeft = offsetLeft <= EDGE && offsetLeft >= -2;
      if (nearLeft) {
        const idx = getVisualColumnIndex(cell);
        const mapped = idx > 0 ? idx - 1 : -1;
        return mapped;
      }
      return -1;
    }

    function getTableEdgeHover(clientX, clientY) {
      for (const table of Array.from(divEditor.querySelectorAll("table"))) {
        if (!isNodeInside(table, divEditor)) continue;
        const rect = table.getBoundingClientRect();
        if (clientY < rect.top || clientY > rect.bottom) continue;
        const delta = clientX - rect.right;
        if (delta >= -TABLE_EDGE && delta <= TABLE_EDGE) {
          return { table, rect, delta };
        }
      }
      return null;
    }

    function collectColWidthRatios(table, totalWidth) {
      normalizeTable(table);
      const cg = table.querySelector("colgroup");
      if (!cg) return [];
      const cols = Array.from(cg.children);
      if (!cols.length) return [];
      let raw = cols.map(col=>{
        const w = (col.style && col.style.width) || "";
        if (!w) return 0;
        if (w.endsWith("%")) return Math.max(0, parseFloat(w) / 100);
        if (w.endsWith("px")) return Math.max(0, parseFloat(w) / Math.max(totalWidth, 1));
        const num = parseFloat(w);
        return Number.isFinite(num) ? Math.max(0, num / Math.max(totalWidth, 1)) : 0;
      });
      let sumRaw = raw.reduce((s,v)=>s + (Number.isFinite(v) ? v : 0), 0);
      if (!sumRaw) {
        const firstRow = table.rows[0];
        if (firstRow) {
          raw = [];
          const cells = Array.from(firstRow.children);
          for (const cell of cells) {
            const cellRect = cell.getBoundingClientRect();
            const span = parseInt(cell.getAttribute("colspan") || "1", 10) || 1;
            const per = Math.max(0, cellRect.width / span / Math.max(totalWidth, 1));
            for (let i=0;i<span;i++) raw.push(per);
          }
        }
        if (!raw.length) raw = Array.from({length: cols.length}, ()=>1 / cols.length);
        sumRaw = raw.reduce((s,v)=>s + v, 0);
      }
      if (raw.length < cols.length) {
        raw = raw.concat(Array.from({length: cols.length - raw.length}, ()=>1 / cols.length));
      }
      const sum = raw.reduce((s,v)=>s + v, 0) || cols.length;
      return raw.slice(0, cols.length).map(v=>v / sum);
    }

    function distributeWidths(total, ratios, minPerCol) {
      const count = ratios.length;
      if (!count) return [];
      total = Math.max(total, count * minPerCol);
      const normalized = ratios.map(v=>Math.max(0, v));
      const sum = normalized.reduce((s,v)=>s + v, 0) || count;
      const result = new Array(count).fill(minPerCol);
      let remaining = total - count * minPerCol;
      for (let i=0;i<count;i++){
        const share = normalized[i] / sum;
        const extra = (i === count - 1) ? remaining : Math.round(remaining * share);
        result[i] += extra;
        remaining -= extra;
      }
      if (remaining !== 0) result[count - 1] += remaining;
      return result;
    }

    function resolveCellForPoint(target, clientX, clientY) {
      if (target && typeof target.closest === "function") {
        const cell = target.closest("td,th");
        if (cell && isNodeInside(cell, divEditor)) return cell;
      }
      if (typeof document.elementFromPoint !== "function") return null;
      const offsets = [0, -2, 2, -4, 4, -6, 6];
      for (const dx of offsets) {
        const probe = document.elementFromPoint(clientX + dx, clientY);
        if (!probe || typeof probe.closest !== "function") continue;
        const cell = probe.closest("td,th");
        if (cell && isNodeInside(cell, divEditor)) return cell;
      }
      return null;
    }

    divEditor.addEventListener("mousemove", (e)=>{
      if (tableResizeState) {
        divEditor.style.cursor = "ew-resize";
        return;
      }
      if (rowResizeState) {
        divEditor.style.cursor = "ns-resize";
        return;
      }
      tableResizeHover = null;
      rowResizeHover = null;
      let cursor = "";
      const edgeHit = getTableEdgeHover(e.clientX, e.clientY);
      const cell = resolveCellForPoint(e.target, e.clientX, e.clientY);
      if (cell && isNodeInside(cell, divEditor)) {
        const idx = getColIndexFromHit(cell, e.clientX);
        if (idx >= 0 && (!edgeHit || edgeHit.delta < 0)) {
          cursor = "col-resize";
        }
      }
      if (!cursor && cell && isNodeInside(cell, divEditor)) {
        const row = cell.parentElement;
        if (row) {
          const rowRect = row.getBoundingClientRect();
          const deltaY = e.clientY - rowRect.bottom;
          if (deltaY >= -ROW_EDGE && deltaY <= ROW_EDGE) {
            cursor = "ns-resize";
            rowResizeHover = { row, table: row.closest("table") };
          }
        }
      }
      if (!cursor && edgeHit && edgeHit.delta >= -1) {
        cursor = "ew-resize";
        tableResizeHover = edgeHit;
      }
      divEditor.style.cursor = cursor;
    });

    divEditor.addEventListener("mousedown", (e)=>{
      const cell = resolveCellForPoint(e.target, e.clientX, e.clientY);
      if (cell && isNodeInside(cell, divEditor)) {
        const idx = getColIndexFromHit(cell, e.clientX);
        const table = cell.closest("table");
        if (idx >= 0 && (!tableResizeHover || tableResizeHover.table !== table || tableResizeHover.delta < 0)) {
          if (e.button !== 0) {
            return;
          }
          normalizeTable(table);
          e.preventDefault();
          e.stopPropagation();

          const hit = findCellCoveringColumn(table, idx);
          if (!hit) return;
          const measured = measureColumnWidth(table, idx, hit);
          const fallback = hit.cell ? hit.cell.offsetWidth : 0;
          const fallbackPerCol = (Number.isFinite(fallback) && fallback > 0) ? (fallback / Math.max(hit.colspan, 1)) : null;
          const startWidthPx = Math.max(
            MIN_COL_WIDTH,
            (measured != null ? measured : fallbackPerCol != null ? fallbackPerCol : MIN_COL_WIDTH)
          );

          colResizeState = {
            table, colIndex: idx,
            startX: e.clientX,
            startWidthPx,
            prepared: false
          };

          document.addEventListener("mousemove", onColResizeMove);
          document.addEventListener("mouseup", onColResizeUp);
          return;
        }
      }

      if (rowResizeHover && isNodeInside(rowResizeHover.row, divEditor)) {
        startRowResize(e, rowResizeHover);
        return;
      }

      if (tableResizeHover && isNodeInside(tableResizeHover.table, divEditor)) {
        startTableResize(e, tableResizeHover);
      }
    });

    function onColResizeMove(e){
      if (!colResizeState) return;
      const { table, colIndex, startX, startWidthPx } = colResizeState;
      const delta = e.clientX - startX;
      if (!colResizeState.prepared) {
        if (Math.abs(delta) < 2) return;
        ensurePixelColWidths(table);
        colResizeState.prepared = true;
      }
      const newWidth = Math.max(MIN_COL_WIDTH, startWidthPx + delta);
      const cg = table.querySelector("colgroup");
      if (!cg) return;
      const col = cg.children[colIndex];
      if (!col) return;
      col.style.width = newWidth + "px";
      const total = Array.from(cg.children).reduce((sum, c)=>{
        const val = parseFloat(c.style.width);
        return sum + (Number.isFinite(val) ? val : 0);
      }, 0);
      if (total > 0) {
        table.style.width = Math.max(total, MIN_TABLE_WIDTH) + "px";
      }
    }
    function onColResizeUp(){
      if (!colResizeState) return;
      document.removeEventListener("mousemove", onColResizeMove);
      document.removeEventListener("mouseup", onColResizeUp);
      colResizeState = null;
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    function startRowResize(e, hover) {
      const { row, table } = hover;
      if (!row || !table) return;
      normalizeTable(table);
      e.preventDefault();
      e.stopPropagation();
      const rect = row.getBoundingClientRect();
      const startHeight = rect && rect.height ? rect.height : row.offsetHeight;
      rowResizeState = {
        row,
        table,
        startY: e.clientY,
        startHeight: Math.max(MIN_ROW_HEIGHT, startHeight || MIN_ROW_HEIGHT)
      };
      document.addEventListener("mousemove", onRowResizeMove);
      document.addEventListener("mouseup", onRowResizeUp);
    }

    function onRowResizeMove(e) {
      if (!rowResizeState) return;
      const { row, startY, startHeight } = rowResizeState;
      const delta = e.clientY - startY;
      const newHeight = Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + delta));
      row.style.height = newHeight + "px";
      Array.from(row.children).forEach(cell=>{
        cell.style.height = newHeight + "px";
      });
      divEditor.style.cursor = "ns-resize";
    }

    function onRowResizeUp() {
      if (!rowResizeState) return;
      document.removeEventListener("mousemove", onRowResizeMove);
      document.removeEventListener("mouseup", onRowResizeUp);
      rowResizeState = null;
      rowResizeHover = null;
      divEditor.style.cursor = "";
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    function startTableResize(e, hover) {
      const { table } = hover;
      normalizeTable(table);
      e.preventDefault();
      e.stopPropagation();
      const rect = table.getBoundingClientRect();
      const startWidth = rect.width || table.offsetWidth || 0;
      const ratios = collectColWidthRatios(table, startWidth || 1);
      const colCount = ratios.length || (table.rows[0] ? table.rows[0].cells.length : 0) || 1;
      const minWidth = Math.max(MIN_TABLE_WIDTH, colCount * MIN_COL_WIDTH);
      tableResizeState = {
        table,
        startX: e.clientX,
        startWidth: startWidth || minWidth,
        ratios: ratios.length ? ratios : Array.from({length: colCount}, ()=>1 / colCount),
        minWidth: minWidth
      };
      document.addEventListener("mousemove", onTableResizeMove);
      document.addEventListener("mouseup", onTableResizeUp);
    }

    function onTableResizeMove(e){
      if (!tableResizeState) return;
      const { table, startX, startWidth, ratios, minWidth } = tableResizeState;
      const delta = e.clientX - startX;
      let newWidth = Math.round(startWidth + delta);
      if (!Number.isFinite(newWidth)) return;
      newWidth = Math.max(minWidth, newWidth);
      const cg = table.querySelector("colgroup");
      if (cg && ratios.length) {
        const widths = distributeWidths(newWidth, ratios, MIN_COL_WIDTH);
        const cols = Array.from(cg.children);
        widths.forEach((w, idx)=>{
          if (cols[idx]) cols[idx].style.width = w + "px";
        });
        const totalAssigned = widths.reduce((sum, w)=>sum + w, 0);
        table.style.width = totalAssigned + "px";
      } else {
        table.style.width = newWidth + "px";
      }
      divEditor.style.cursor = "ew-resize";
    }
    function onTableResizeUp(){
      if (!tableResizeState) return;
      document.removeEventListener("mousemove", onTableResizeMove);
      document.removeEventListener("mouseup", onTableResizeUp);
      tableResizeState = null;
      tableResizeHover = null;
      divEditor.style.cursor = "";
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    // ------ New Cell Selection Logic ------
    let cellSelectionState = {
      isSelecting: false,
      startCell: null,
      endCell: null,
      selectedCells: []
    };

    function clearCellSelection() {
      if (cellSelectionState.selectedCells.length > 0) {
        cellSelectionState.selectedCells.forEach(cell => cell.classList.remove("weditor-cell-selected"));
      }
      cellSelectionState = { isSelecting: false, startCell: null, endCell: null, selectedCells: [] };
      tableDebug("Cell selection cleared");
    }

    function onCellMouseDown(e) {
      // Do not engage if it's not a primary button click or if resizing is active
      if (e.button !== 0 || colResizeState || rowResizeState || tableResizeState) {
        return;
      }

      const targetCell = e.target.closest("td,th");
      if (!targetCell || !isNodeInside(targetCell, divEditor)) {
        // If clicking outside a cell, clear any existing selection
        if (!e.target.closest("table")) {
          clearCellSelection();
        }
        return;
      }
      
      // On mousedown, we only *prepare* to select. We don't prevent default yet.
      // We clear previous selection and set a potential start cell.
      clearCellSelection();
      cellSelectionState.startCell = targetCell;
      
      document.addEventListener("mousemove", onCellMouseMove);
      document.addEventListener("mouseup", onCellMouseUp);
      tableDebug("Cell selection prepared", { startCell: targetCell });
    }

    function onCellMouseMove(e) {
      if (!cellSelectionState.startCell) return;

      // If we are not yet in selection mode, check if the mouse has moved enough
      // to be considered a drag, not a click.
      if (!cellSelectionState.isSelecting) {
        // This is the first mousemove after a mousedown. Now we engage selection mode.
        cellSelectionState.isSelecting = true;
        // Prevent text selection now that we're sure it's a drag
        e.preventDefault();
        // Clear native selection
        window.getSelection()?.removeAllRanges();
        tableDebug("Cell selection engaged by dragging");
      }

      const targetCell = e.target.closest("td,th");
      if (!targetCell || !isNodeInside(targetCell, divEditor) || targetCell === cellSelectionState.endCell) {
        return;
      }
      cellSelectionState.endCell = targetCell;
      
      const table = cellSelectionState.startCell.closest("table");
      if (!table) return;

      const tableMap = buildTableMap(table);
      const startCoords = getCellCoords(tableMap, cellSelectionState.startCell);
      const endCoords = getCellCoords(tableMap, cellSelectionState.endCell);

      if (!startCoords || !endCoords) return;

      const minRow = Math.min(startCoords.r, endCoords.r);
      const maxRow = Math.max(startCoords.r, endCoords.r);
      const minCol = Math.min(startCoords.c, endCoords.c);
      const maxCol = Math.max(startCoords.c, endCoords.c);

      const newSelectedCells = [];
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const cell = tableMap[r] && tableMap[r][c];
          if (cell && !newSelectedCells.includes(cell)) {
            newSelectedCells.push(cell);
          }
        }
      }

      cellSelectionState.selectedCells.forEach(cell => {
        if (!newSelectedCells.includes(cell)) {
          cell.classList.remove("weditor-cell-selected");
        }
      });
      newSelectedCells.forEach(cell => {
        if (!cell.classList.contains("weditor-cell-selected")) {
          cell.classList.add("weditor-cell-selected");
        }
      });
      cellSelectionState.selectedCells = newSelectedCells;
    }

    function onCellMouseUp(e) {
      if (!cellSelectionState.startCell) return;

      if (!cellSelectionState.isSelecting) {
        // This was a simple click, not a drag. Clear the potential selection.
        clearCellSelection();
      } else {
        tableDebug("Cell selection finalized", { start: cellSelectionState.startCell, end: cellSelectionState.endCell, count: cellSelectionState.selectedCells.length });
      }
      
      cellSelectionState.isSelecting = false;
      cellSelectionState.startCell = null;
      document.removeEventListener("mousemove", onCellMouseMove);
      document.removeEventListener("mouseup", onCellMouseUp);
    }

    divEditor.addEventListener("mousedown", onCellMouseDown);

    // ------ Table Buttons ------
    const btnTbl = addBtn("Table","Insert table", (evt)=>{
      evt.preventDefault();
      insertTablePopup.open(evt.currentTarget || btnTbl);
    }, groupInsert.inner);
    // Emphasize primary action: Insert Table
    btnTbl.classList.add("weditor-btn--primary");
    const tableRows = createTableSubgroup("Rows");
    addTableAction("Insert Row Below", null, "Insert row below (⌥↓)", ()=>insertRow(true), tableRows);
    addTableAction("Insert Row Above", null, "Insert row above (⌥↑)", ()=>insertRow(false), tableRows);
    addTableAction("Delete Row", null, "Delete row (⌘⌫)", ()=>deleteRow(), tableRows);

    const tableColumns = createTableSubgroup("Columns");
    addTableAction("Add Col Right", null, "Insert column right (⌥→)", ()=>insertCol(true), tableColumns);
    addTableAction("Add Col Left", null, "Insert column left (⌥←)", ()=>insertCol(false), tableColumns);
    addTableAction("Delete Col", null, "Delete column (⌘⌫)", ()=>deleteCol(), tableColumns);

    const tableWidth = createTableSubgroup("Column Width");
    addTableAction("Balance Width", null, "Distribute columns (%) (Auto)", ()=>distributeColumns(), tableWidth);
    addTableAction("Auto Fit", null, "Auto-fit column width (⇧⌥F)", ()=>autofitColumns(), tableWidth);
    addTableAction("Set Width (This Col)", null, "Set current column width (⌥W)", ()=>setCurrentColumnWidth(), tableWidth);

    const tableCells = createTableSubgroup("Cells");
    const btnMergeCells = addTableAction("Merge Cells", null, "Merge selected cells in the current row (⌥M)", ()=>mergeSelectedCellsHorizontally(), tableCells);
    btnMergeCells.classList.add("weditor-btn--primary");

    const tableBorders = createTableSubgroup("Borders");
    const btnBorderStyle = addTableAction("Borders","Line & Color","Adjust table border width, style, and color (⌥B)", ()=>tableBorderPopup.open(btnBorderStyle), tableBorders);
    btnBorderStyle.classList.add("weditor-btn--primary");
    addTableAction("Hide Borders","No Lines","Remove all borders from this table (⇧⌥H)", ()=>hideTableBorders(), tableBorders);
    addTableAction("Reset Borders","Default","Reset border styling to default (⇧⌥R)", ()=>resetTableBorders(), tableBorders);
  }

  // ---------- Init all editors ----------
  function initAll(){ $$(".weditor").forEach(buildEditor); }
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

})();
