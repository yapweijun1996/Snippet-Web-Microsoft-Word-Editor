(function(){
  "use strict";

  // ---------- Inject CSS via JS (snippet-friendly) ----------
  const STYLE_ID = "weditor-lite-style";
  const CSS_TEXT = `
.weditor-wrap{border:1px solid #ccc;margin:8px 0;background:#fff;display:flex;flex-direction:column}
.weditor-toolbar{display:flex;flex-wrap:wrap;gap:4px;padding:6px;border-bottom:1px solid #ddd;background:#f7f7f7}
.weditor-toolbar button{padding:4px 8px;border:1px solid #ccc;background:#fff;cursor:pointer}
.weditor-toolbar button:disabled{opacity:.5;cursor:not-allowed}
.weditor-area{min-height:160px;padding:10px;outline:0;overflow-y:auto}
.weditor_textarea{display:none}
body.weditor-fullscreen-active{overflow:hidden}
.weditor-wrap.weditor-fullscreen{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;margin:0;border:0}
.weditor-wrap.weditor-fullscreen .weditor-area{flex:1;min-height:0}

/* 轻量表格可视化增强（可删） */
.weditor-area table{border-collapse:collapse;width:100%}
.weditor-area td,.weditor-area th{border:1px solid #ccc;padding:6px;vertical-align:top}
.weditor-area td:empty::after,.weditor-area th:empty::after{content:"\\00a0"}
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

  function insertTableAtCaret(editor, rows=2, cols=2){
    rows = Math.max(1, parseInt(rows||2,10));
    cols = Math.max(1, parseInt(cols||2,10));

    const colPct = (100/cols).toFixed(3) + "%";
    const colgroup = el("colgroup", null, Array.from({length:cols}, ()=> el("col",{style:{width:colPct}})));

    const table = el("table",{border:"1",style:{borderCollapse:"collapse",width:"100%",tableLayout:"fixed"}});
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
    editor.dispatchEvent(new Event("input",{bubbles:true}));
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
    divEditor.addEventListener("blur",  ()=>{
      syncToTextarea();
      const now = getHTML();
      if (now !== history.current()){
        history.push(now);
        lastSaved = now;
      }
    });

    // Toolbar helpers
    function addBtn(text, title, fn){
      const b = el("button",{type:"button",title},[text]);
      b.addEventListener("click", fn);
      toolbar.appendChild(b);
      return b;
    }

    // Core buttons
    addBtn("B","Bold", ()=>exec("bold"));
    addBtn("I","Italic", ()=>exec("italic"));
    addBtn("U","Underline", ()=>exec("underline"));
    addBtn("H1","Heading 1", ()=>exec("formatBlock","<h1>"));
    addBtn("H2","Heading 2", ()=>exec("formatBlock","<h2>"));
    addBtn("P","Paragraph", ()=>exec("formatBlock","<p>"));
    addBtn("*","Bulleted list", ()=>exec("insertUnorderedList"));
    addBtn("1.","Numbered list", ()=>exec("insertOrderedList"));
    addBtn("L","Align left", ()=>exec("justifyLeft"));
    addBtn("C","Center", ()=>exec("justifyCenter"));
    addBtn("R","Align right", ()=>exec("justifyRight"));
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
    });
    addBtn("Img","Insert image (URL)", ()=>{
      const u = prompt("Image URL:");
      if (!u) return;
      if (!isHttpUrl(u)) { alert("Only http(s) image URL allowed"); return; }
      exec("insertImage", u);
    });
    addBtn("HR","Horizontal rule", ()=>exec("insertHorizontalRule"));
    addBtn("Clr","Clear formatting", ()=>exec("removeFormat"));

    // Undo / Redo / HTML (redo-safe)
    btnUndo = addBtn("Undo","Undo (Ctrl/Cmd+Z)", ()=>history.undo());
    btnRedo = addBtn("Redo","Redo (Ctrl+Y or Shift+Ctrl/Cmd+Z)", ()=>history.redo());
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
    });

    // Fullscreen
    let isFullScreen = false;
    const btnFs = addBtn("FS", "Fullscreen", toggleFullScreen);
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
    parent.insertBefore(wrap, divEditor);
    wrap.appendChild(toolbar);
    wrap.appendChild(divEditor);

    // ---------- 外部：Textarea → Editor 同步 ----------
    function setEditorHTMLFromTextarea(v) {
      const val = (v == null || v === "") ? "<p><br></p>" : String(v);
      setHTML(val, { silent: true });
      cancelSnapshotTimer();
      history.push(val);
      lastSaved = val;
      updateUndoRedoButtons();
    }
    pair.addEventListener("input", () => setEditorHTMLFromTextarea(pair.value));
    pair.addEventListener("change", () => setEditorHTMLFromTextarea(pair.value));
    const mo = new MutationObserver(() => setEditorHTMLFromTextarea(pair.value));
    mo.observe(pair, { characterData: true, subtree: true });

    // ====================== Table Utilities & UX ======================
    function getCellFromSelection() {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode) return null;
      const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
      return el ? el.closest("td,th") : null;
    }
    function getTableContext() {
      const cell = getCellFromSelection();
      if (!cell) return null;
      const row = cell.parentElement;
      const table = cell.closest("table");
      if (!table) return null;
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
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function deleteRow() {
      const ctx = getTableContext(); if (!ctx) return;
      const { table, row } = ctx;
      const body = table.tBodies[0] || table;
      if (body.rows.length <= 1) { table.remove(); }
      else { row.remove(); }
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }
    function insertCol(after = true) {
      const ctx = getTableContext(); if (!ctx) return;
      normalizeTable(ctx.table);
      const { table, colIndex } = ctx;
      const idx = after ? colIndex + 1 : colIndex;

      // Insert a cell in each row at visual index
      Array.from(table.rows).forEach(tr=>{
        const tdList = Array.from(tr.children);
        let vIndex = 0, insertBefore = null;
        for (const cell of tdList) {
          const span = parseInt(cell.getAttribute("colspan") || "1", 10);
          if (vIndex + span > idx) { insertBefore = cell.nextSibling; break; }
          vIndex += span;
        }
        const td = document.createElement("td");
        td.style.padding = "6px";
        td.style.verticalAlign = "top";
        td.innerHTML = "&nbsp;";
        tr.insertBefore(td, insertBefore);
      });

      // Mirror the structure in <colgroup>
      const cg = table.querySelector("colgroup");
      if (cg){
        const newCol = document.createElement("col");
        cg.insertBefore(newCol, cg.children[idx] || null);
      }

      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
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
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
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

    // ------ Column Resize via Drag ------
    let colResizeState = null; // { table, colIndex, startX, startWidthPx }
    const EDGE = 6;

    function getColIndexFromHit(cell, clientX) {
      const rect = cell.getBoundingClientRect();
      const nearRight = (rect.right - clientX) <= EDGE && (rect.right - clientX) >= -2;
      if (!nearRight) return -1;
      const row = cell.parentElement;
      let colIndex = 0;
      for (const td of row.children) {
        const span = parseInt(td.getAttribute("colspan") || "1", 10);
        if (td === cell) break;
        colIndex += span;
      }
      return colIndex;
    }

    divEditor.addEventListener("mousemove", (e)=>{
      const cell = e.target.closest && e.target.closest("td,th");
      if (!cell || !isNodeInside(cell, divEditor)) {
        divEditor.style.cursor = "";
        return;
      }
      const idx = getColIndexFromHit(cell, e.clientX);
      divEditor.style.cursor = idx >= 0 ? "col-resize" : "";
    });

    divEditor.addEventListener("mousedown", (e)=>{
      const cell = e.target.closest && e.target.closest("td,th");
      if (!cell || !isNodeInside(cell, divEditor)) return;
      const idx = getColIndexFromHit(cell, e.clientX);
      if (idx < 0) return;

      const table = cell.closest("table");
      normalizeTable(table);
      e.preventDefault();
      e.stopPropagation();

      let sampleCell = null;
      for (const tr of Array.from(table.rows)) {
        let vIndex = 0;
        for (const td of Array.from(tr.children)) {
          const span = parseInt(td.getAttribute("colspan") || "1", 10);
          if (vIndex <= idx && idx < vIndex + span) { sampleCell = td; break; }
          vIndex += span;
        }
        if (sampleCell) break;
      }
      if (!sampleCell) return;
      const startWidthPx = sampleCell.offsetWidth;

      colResizeState = {
        table, colIndex: idx,
        startX: e.clientX,
        startWidthPx
      };

      document.addEventListener("mousemove", onColResizeMove);
      document.addEventListener("mouseup", onColResizeUp);
    });

    function onColResizeMove(e){
      if (!colResizeState) return;
      const { table, colIndex, startX, startWidthPx } = colResizeState;
      const delta = e.clientX - startX;
      const newWidth = Math.max(30, startWidthPx + delta);
      const cg = table.querySelector("colgroup");
      if (!cg) return;
      const col = cg.children[colIndex];
      if (!col) return;
      col.style.width = newWidth + "px";
    }
    function onColResizeUp(){
      if (!colResizeState) return;
      document.removeEventListener("mousemove", onColResizeMove);
      document.removeEventListener("mouseup", onColResizeUp);
      colResizeState = null;
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    // ------ Table Buttons ------
    const btnTbl = addBtn("Tbl","Insert table", ()=>{
      const r = prompt("Rows?", "2");
      const c = prompt("Cols?", "2");
      insertTableAtCaret(divEditor, r, c);
    });
    addBtn("+Row","Insert row below", ()=>insertRow(true));
    addBtn("^Row","Insert row above", ()=>insertRow(false));
    addBtn("DelRow","Delete current row", ()=>deleteRow());
    addBtn("+Col","Insert column right", ()=>insertCol(true));
    addBtn("<-Col","Insert column left", ()=>insertCol(false));
    addBtn("DelCol","Delete current column", ()=>deleteCol());
    addBtn("=Cols","Distribute columns (%)", ()=>distributeColumns());
    addBtn("Fit","Auto-fit column width", ()=>autofitColumns());
    addBtn("W","Set current column width", ()=>setCurrentColumnWidth());
  }

  // ---------- Init all editors ----------
  function initAll(){ $$(".weditor").forEach(buildEditor); }
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

})();
