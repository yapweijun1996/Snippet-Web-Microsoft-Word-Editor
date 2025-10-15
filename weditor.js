(function(){
  "use strict";

  // ---------- Inject CSS via JS (snippet-friendly) ----------
  const STYLE_ID = "weditor-lite-style";
  const CSS_TEXT = `
.weditor-wrap{border:1px solid #ccc;margin:8px 0;background:#fff;display:flex;flex-direction:column}
.weditor-toolbar{z-index:10;position:sticky;top:0;display:flex;flex-direction:column;gap:0;background:#f8fafc;border-bottom:1px solid #e2e8f0;--weditor-btn-h:34px;--weditor-btn-py:6px;--weditor-btn-px:12px}
.weditor-toolbar-nav{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 12px;background:linear-gradient(135deg,#f8fafc,#eef2ff)}
.weditor-nav-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:999px;border:1px solid transparent;background:#ffffff;color:#1e293b;font-size:13px;font-weight:600;letter-spacing:.01em;cursor:pointer;box-shadow:0 1px 2px rgba(15,23,42,0.08);transition:all .18s ease}
.weditor-nav-btn:hover:not(:disabled){background:#e0e7ff;color:#1e293b;box-shadow:0 4px 10px rgba(79,70,229,0.16);transform:translateY(-1px)}
.weditor-nav-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
.weditor-nav-btn[data-active="true"]{background:#2563eb;color:#fff;border-color:#1d4ed8;box-shadow:0 8px 18px rgba(37,99,235,0.32)}
.weditor-nav-btn[data-indicator="true"]::after{content:"";width:8px;height:8px;border-radius:999px;background:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,0.25);margin-left:6px}
.weditor-nav-btn:focus-visible{outline:2px solid #1d4ed8;outline-offset:2px}
.weditor-nav-btn--action{background:#f1f5f9;border-color:#d6e3ff;font-weight:500}
.weditor-nav-btn--action:hover:not(:disabled){background:#e2e8f0;box-shadow:0 2px 6px rgba(15,23,42,0.18)}
.weditor-toolbar-panels{display:flex;flex-direction:column;gap:12px;padding:0}
.weditor-toolbar-panel{margin:0}
.weditor-toolbar-panel[data-open="true"]{margin:0 12px 12px}
.weditor-toolbar-panel{display:none;flex-direction:column;gap:12px;padding:16px;border-radius:12px;border:1px solid #dbeafe;background:#ffffff;box-shadow:0 12px 32px rgba(15,23,42,0.12)}
.weditor-toolbar-panel[data-open="true"]{display:flex}
.weditor-toolbar-panel[data-hidden="true"]{display:none}
.weditor-table-panel{background:#f8fafc;border-color:#cbd5f5}
.weditor-toolbar-panel-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#334155}
.weditor-toolbar-group-inner{display:flex;flex-direction:column;gap:12px;width:100%}
.weditor-panel-section{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.weditor-panel-section-block{display:flex;flex-direction:column;gap:6px;width:100%}
.weditor-panel-section-block + .weditor-panel-section-block{border-top:1px dashed #e2e8f0;padding-top:12px;margin-top:4px}
.weditor-panel-label{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#475569}
.weditor-panel-section + .weditor-panel-section{border-top:1px dashed #e2e8f0;padding-top:10px}
.weditor-toolbar-panel button{display:inline-flex;align-items:center;justify-content:center;min-height:var(--weditor-btn-h);padding:var(--weditor-btn-py) var(--weditor-btn-px);border:1px solid #cbd5f5;background:#fff;border-radius:8px;cursor:pointer;font-size:13px;transition:background .15s,border-color .15s,box-shadow .15s,transform .15s}
.weditor-toolbar-panel button.weditor-btn--icon{font-size:16px}
.weditor-toolbar-panel button svg{display:block;width:1em;height:1em;stroke-width:1px}
.weditor-toolbar-panel button:hover:not(:disabled){background:#eff6ff;border-color:#93c5fd;box-shadow:0 4px 10px rgba(59,130,246,0.24);transform:translateY(-1px)}
.weditor-toolbar-panel button:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
.weditor-toolbar-panel button:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
.weditor-toolbar-panel button[data-active="true"]{background:#e0e7ff;border-color:#94a3b8;box-shadow:0 0 0 2px rgba(148,163,184,0.35)}
.weditor-toolbar-panel select{min-height:var(--weditor-btn-h);padding:var(--weditor-btn-py) var(--weditor-btn-px);border:1px solid #cbd5f5;background:#fff;border-radius:8px;cursor:pointer;font-size:13px;transition:background .15s,border-color .15s,box-shadow .15s}
.weditor-toolbar-panel select:hover:not(:disabled){background:#eef2ff;border-color:#94a3b8;box-shadow:0 2px 8px rgba(15,23,42,0.12)}
.weditor-toolbar-panel select:disabled{opacity:.5;cursor:not-allowed}
.weditor-toolbar-panel select:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
.weditor-toolbar-panel select + button,.weditor-toolbar-panel button + select{margin-left:2px}
.weditor-style-select{min-width:140px}
.weditor-font-select{min-width:160px}
.weditor-size-select{min-width:80px}
/* Optional: hide desktop line-height select when icon menu is present (中文解释: 桌面端隐藏原生行高下拉) */
@media (min-width:768px){
  .weditor-lineheight-select{display:none}
}
/* Typographic cues for buttons (中文解释: 直观的文字样式提示) */
.weditor-btn-bold{font-weight:700}
.weditor-btn-italic{font-style:italic}
.weditor-btn-underline{text-decoration:underline;text-underline-offset:2px}
.weditor-table-subgroup{display:flex;flex-direction:column;gap:6px;padding:6px 8px;background:#f1f5f9;border-radius:8px;border:1px solid #e2e8f0}
.weditor-table-subgroup-label{font-size:10px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.04em;display:flex;align-items:center;gap:4px}
.weditor-table-subgroup-info{display:inline-flex;align-items:center;justify-content:center;min-width:16px;padding:0 6px;height:16px;border-radius:8px;background:#e2e8f0;color:#1e293b;font-size:10px;font-weight:600;cursor:help;user-select:none}
.weditor-table-subgroup-buttons{display:flex;flex-wrap:wrap;gap:4px}
.weditor-toolbar-panel button.weditor-table-btn{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:118px;min-height:var(--weditor-btn-h);padding:var(--weditor-btn-py) var(--weditor-btn-px);font-size:12px;line-height:1.2;text-align:left}
.weditor-toolbar-panel button.weditor-table-btn .weditor-table-btn-primary{font-weight:600;color:#1e293b}
.weditor-toolbar-panel button.weditor-table-btn .weditor-table-btn-secondary{font-size:11px;color:#475569}
/* Primary/Secondary emphasis for key actions */
.weditor-toolbar-panel .weditor-btn--primary{background:#2563eb;color:#fff;border-color:#1d4ed8}
.weditor-toolbar-panel .weditor-btn--primary:hover:not(:disabled){background:#1d4ed8;border-color:#1e40af}
.weditor-toolbar-panel .weditor-btn--secondary{background:#fff;color:#1e293b;border-color:#cbd5f5}
/* Ensure table button inner labels invert correctly when primary */
.weditor-btn--primary .weditor-table-btn-primary{color:#fff}
.weditor-btn--primary .weditor-table-btn-secondary{color:#e2e8f0}
.weditor-area{all:initial;min-height:160px;padding:10px;outline:0;overflow-y:auto}
.weditor-area p, .weditor-area h1, .weditor-area h2, .weditor-area h3, .weditor-area ul, .weditor-area ol, .weditor-area li, .weditor-area table, .weditor-area tr, .weditor-area td, .weditor-area th, .weditor-area span, .weditor-area div, .weditor-area font {
  all: revert; /* Revert to browser defaults, ignoring inherited styles from outside the editor */
}
.weditor-area font {
  color: inherit; /* Allow font color to be set by the color attribute */
}
.weditor-area p.weditor-nospace{margin:0;line-height:1.35}
.weditor_textarea{display:none}
body.weditor-fullscreen-active{overflow:hidden}
.weditor-wrap.weditor-fullscreen{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;margin:0;border:0}
.weditor-wrap.weditor-fullscreen .weditor-area{flex:1;min-height:0}
/* Exit Fullscreen button (top-right in fullscreen) */
.weditor-fs-exit{position:absolute;top:10px;right:8px;min-width:36px;min-height:36px;padding:6px 10px;display:none;align-items:center;justify-content:center;border:1px solid #dc2626;background:#ef4444;color:#fff;border-radius:4px;cursor:pointer;box-shadow:0 1px 3px rgba(15,23,42,0.12);z-index:10000}
.weditor-wrap.weditor-fullscreen .weditor-fs-exit{display:inline-flex}
.weditor-fs-exit:hover{background:#dc2626;border-color:#b91c1c}
.weditor-fs-exit:focus-visible{outline:2px solid #b91c1c;outline-offset:1px}

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
.weditor-table-popup button[data-active="true"]{background:#eef2ff;border-color:#94a3b8;font-weight:600}
/* Compact dropdown-like menu for simple option lists (中文解释: 专用于选项菜单的紧凑样式) */
.weditor-menu-popup{
  position:absolute;padding:8px 0;
  border:1px solid #e2e8f0;background:#fff;
  box-shadow:0 4px 12px rgba(0,0,0,0.12);border-radius:8px;
  display:none;flex-direction:column;gap:2px;min-width:120px;z-index:1000;
  max-height:200px;overflow-y:auto
}
.weditor-menu-popup[data-open="true"]{display:flex}
.weditor-menu-popup button{
  display:flex;align-items:center;padding:8px 16px;
  border:none;background:transparent;cursor:pointer;
  font-size:13px;color:#475569;text-align:left;
  transition:background .15s,color .15s;
  border-radius:4px;margin:0 4px;
  font-variant-numeric: tabular-nums
}
.weditor-menu-popup button:hover:not(:disabled){
  background:#f1f5f9;color:#1e293b
}
.weditor-menu-popup button:focus-visible{
  outline:2px solid #2563eb;outline-offset:-2px
}
.weditor-menu-popup button[data-active="true"]{
  background:#e0e7ff;color:#2563eb;font-weight:600
}
.weditor-menu-tabs{display:flex;border-bottom:1px solid #e2e8f0;margin:0 8px}
.weditor-tab-btn{border:none;background:transparent;padding:8px 12px;cursor:pointer;font-size:13px;color:#475569;border-bottom:2px solid transparent}
.weditor-tab-btn[data-active="true"]{color:#2563eb;font-weight:600;border-bottom-color:#2563eb}
.weditor-tab-content{padding:12px}
.weditor-input{width:100%;padding:6px;border:1px solid #cbd5f5;border-radius:4px}
.weditor-file-input-area{display:flex;flex-direction:column;align-items:center;gap:8px}
.weditor-preview-img{max-width:100%;max-height:120px;margin-top:8px;border:1px solid #e2e8f0;border-radius:4px}
.weditor-menu-actions{display:flex;justify-content:flex-end;gap:8px;padding:8px 12px;border-top:1px solid #e2e8f0}
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
@media (max-width:640px){
  .weditor-toolbar-nav{gap:4px;padding:8px}
  .weditor-nav-btn{padding:6px 12px;font-size:12px}
  .weditor-toolbar-panel{padding:12px}
  .weditor-panel-section{gap:6px}
  .weditor-toolbar-panel button{min-height:30px;padding:6px 10px}
  .weditor-toolbar-panel select{min-height:30px;padding:6px 10px}
}
  `.trim() + `
/* Image Resize Handles */
.weditor-area img{position:relative;cursor:pointer}
.weditor-img-selected{outline:2px solid #2563eb;outline-offset:2px;user-select:none}
.weditor-img-resize-handle{position:absolute;width:8px;height:8px;background:#fff;border:1px solid #2563eb;box-shadow:0 0 3px rgba(0,0,0,0.2);z-index:1001}
.weditor-img-resize-handle[data-dir="nw"]{top:-5px;left:-5px;cursor:nwse-resize}
.weditor-img-resize-handle[data-dir="ne"]{top:-5px;right:-5px;cursor:nesw-resize}
.weditor-img-resize-handle[data-dir="sw"]{bottom:-5px;left:-5px;cursor:nesw-resize}
.weditor-img-resize-handle[data-dir="se"]{bottom:-5px;right:-5px;cursor:nwse-resize}
.weditor-img-resize-handle[data-dir="n"]{top:-5px;left:50%;margin-left:-4px;cursor:ns-resize}
.weditor-img-resize-handle[data-dir="s"]{bottom:-5px;left:50%;margin-left:-4px;cursor:ns-resize}
.weditor-img-resize-handle[data-dir="w"]{top:50%;left:-5px;margin-top:-4px;cursor:ew-resize}
.weditor-img-resize-handle[data-dir="e"]{top:50%;right:-5px;margin-top:-4px;cursor:ew-resize}
/* Page Break visualization */
.weditor-page-break{display:block;height:24px;margin:12px 0;background-color:#f1f5f9;background-image:url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-dasharray='6%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");background-position:center center;background-repeat:repeat;position:relative;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;text-align:center;line-height:24px;user-select:none;cursor:default}
@media print{
 .weditor-page-break{height:0!important;margin:0!important;border:0!important;visibility:hidden!important;page-break-after:always!important}
}
.weditor-page-break:hover{background-color:#eef2ff!important}
.weditor-page-break-selected{outline:2px solid #2563eb;outline-offset:1px;background-color:#e0e7ff!important}
`;
 (function ensureStyle(){
   if (!document.getElementById(STYLE_ID)){
      const tag = document.createElement("style");
      tag.id = STYLE_ID;
      tag.appendChild(document.createTextNode(CSS_TEXT));
      (document.head || document.documentElement).appendChild(tag);
    }
  })();

  // ---------- Helpers ----------
  const TABLE_DEBUG = false;
  const PAGE_BREAK_BG_IMAGE = "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23cbd5e1' stroke-width='2' stroke-dasharray='6%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")";
  const PAGE_BREAK_BASE_BG = "#f1f5f9";
  const PAGE_BREAK_SELECTED_BG = "#e0e7ff";
  const PAGE_BREAK_SELECTED_OUTLINE = "2px solid #2563eb";
  const PAGE_BREAK_LABEL = "PAGE BREAK";
  const PAGE_BREAK_INLINE_STYLE = {
    display: "block",
    height: "24px",
    margin: "12px 0",
    padding: "0",
    border: "0",
    backgroundColor: PAGE_BREAK_BASE_BG,
    backgroundImage: PAGE_BREAK_BG_IMAGE,
    backgroundPosition: "center center",
    backgroundRepeat: "repeat",
    position: "relative",
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    textAlign: "center",
    lineHeight: "24px",
    userSelect: "none",
    cursor: "default",
    pageBreakAfter: "always",
    breakAfter: "page"
  };
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

  // Font size presets (global; used by buildEditor and window.weditorTest)
  const FONT_SIZE_PRESETS = [
    { label: "6", value: "1" },
    { label: "8", value: "2" },
    { label: "10", value: "3" },
    { label: "12", value: "4" },
    { label: "14", value: "5" },
    { label: "16", value: "6" },
    { label: "18", value: "7" },
    { label: "20", value: "css-20" },
    { label: "22", value: "css-22" },
    { label: "24", value: "css-24" },
    { label: "26", value: "css-26" },
    { label: "28", value: "css-28" },
    { label: "32", value: "css-32" },
    { label: "36", value: "css-36" },
    { label: "48", value: "css-48" },
    { label: "72", value: "css-72" }
  ];
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
    let selectedPageBreak = null;
    let suppressNextPageBreakClear = false;
    let showingSource = false;

    const handlePageBreakClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof divEditor.focus === "function") {
        try {
          divEditor.focus({ preventScroll: true });
        } catch (_err) {
          divEditor.focus();
        }
      }
      const target = e.currentTarget;
      selectPageBreak(target);
      suppressNextPageBreakClear = true;
    };

    function setPageBreakActive(pb, active){
      if (!pb) return;
      if (active) {
        pb.classList.add("weditor-page-break-selected");
        pb.style.outline = PAGE_BREAK_SELECTED_OUTLINE;
        pb.style.outlineOffset = "1px";
        pb.style.backgroundColor = PAGE_BREAK_SELECTED_BG;
      } else {
        pb.classList.remove("weditor-page-break-selected");
        pb.style.outline = "";
        pb.style.outlineOffset = "";
        const baseBg = pb.__weditorPageBreakBaseBg || PAGE_BREAK_BASE_BG;
        pb.style.backgroundColor = baseBg;
      }
    }

    function selectPageBreak(pb) {
      const nodes = divEditor.querySelectorAll(".weditor-page-break");
      nodes.forEach(node => setPageBreakActive(node, node === pb));
      if (pb) {
        selectedPageBreak = pb;
        window.getSelection()?.removeAllRanges();
      } else {
        selectedPageBreak = null;
        suppressNextPageBreakClear = false;
      }
    }

    function bindPageBreakNode(pb){
      if (!pb || pb.__weditorPageBreakBound) return;
      pb.__weditorPageBreakBound = true;
      if (!pb.classList.contains("weditor-page-break")) pb.classList.add("weditor-page-break");
      pb.setAttribute("contenteditable","false");
      pb.setAttribute("role","separator");
      pb.setAttribute("aria-label","Page break");
      Object.assign(pb.style, PAGE_BREAK_INLINE_STYLE);
      pb.__weditorPageBreakBaseBg = PAGE_BREAK_BASE_BG;
      if (!pb.textContent.trim()) pb.textContent = PAGE_BREAK_LABEL;
      pb.addEventListener("click", handlePageBreakClick);
    }

    const bindUnboundPageBreaks = () => {
      divEditor.querySelectorAll(".weditor-page-break").forEach(bindPageBreakNode);
    };
    function removeSelectedPageBreak(options = {}) {
      if (!selectedPageBreak) return false;
      const pb = selectedPageBreak;
      const prev = pb.previousElementSibling;
      const next = pb.nextElementSibling;
      pb.remove();
      selectPageBreak(null);
      if (options.restoreCaret !== false) {
        const sel = window.getSelection();
        if (prev && sel) {
          const r = document.createRange();
          r.selectNodeContents(prev);
          r.collapse(false);
          sel.removeAllRanges();
          sel.addRange(r);
        } else if (next && sel) {
          const r = document.createRange();
          r.selectNodeContents(next);
          r.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r);
        } else if (sel) {
          moveCaretToEnd(divEditor);
        }
      }
      divEditor.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    // find paired textarea
    let pair = divEditor.nextElementSibling;
    while (pair && !pair.classList.contains("weditor_textarea")) pair = pair.nextElementSibling;
    if (!pair) { console.warn("No paired .weditor_textarea for", divEditor); return; }

    // UI skeleton
    const wrap = el("div",{class:"weditor-wrap"});
    const toolbar = el("div",{class:"weditor-toolbar"});
    const navBar = el("div",{class:"weditor-toolbar-nav", role:"toolbar", "aria-label":"Editor toolbar actions"});
    const panelContainer = el("div",{class:"weditor-toolbar-panels"});
    toolbar.appendChild(navBar);
    toolbar.appendChild(panelContainer);

    const navButtons = new Map();
    const panelMap = new Map();
    let activePanelId = null;
    let btnFs = null;
    let btnFsExit = null;

    function setNavActive(btn, active){
      if (!btn) return;
      if (active){
        btn.setAttribute("data-active","true");
        btn.setAttribute("aria-pressed","true");
      } else {
        btn.removeAttribute("data-active");
        btn.setAttribute("aria-pressed","false");
      }
    }

    function openPanel(panelId, opts = {}){
      const panel = panelMap.get(panelId);
      if (!panel) return;
      if (activePanelId && activePanelId !== panelId){
        closePanel(activePanelId);
      }
      panel.setAttribute("data-open","true");
      panel.removeAttribute("data-hidden");
      panel.setAttribute("aria-hidden","false");
      const trigger = navButtons.get(panelId);
      if (trigger){
        setNavActive(trigger, true);
        trigger.setAttribute("aria-expanded","true");
      }
      activePanelId = panelId;
      if (!opts.skipFocus){
        requestAnimationFrame(()=>{
          const focusable = panel.querySelector("button,select,input,textarea");
          if (focusable && typeof focusable.focus === "function"){
            focusable.focus({ preventScroll: true });
          }
        });
      }
    }

    function closePanel(panelId){
      const panel = panelMap.get(panelId);
      if (!panel) return;
      panel.removeAttribute("data-open");
      panel.setAttribute("data-hidden","true");
      panel.setAttribute("aria-hidden","true");
      const trigger = navButtons.get(panelId);
      if (trigger){
        setNavActive(trigger, false);
        trigger.setAttribute("aria-expanded","false");
      }
      if (activePanelId === panelId){
        activePanelId = null;
      }
    }

    function togglePanel(panelId){
      if (activePanelId === panelId){
        closePanel(panelId);
      } else {
        openPanel(panelId);
      }
    }

    function createNavButton(label, options = {}){
      const { panelId = null, handler = null, classes = "", title = null } = options;
      const attrs = {
        type: "button",
        class: ("weditor-nav-btn " + (classes || "")).trim(),
        "aria-label": label,
        "aria-pressed": "false",
        title: title || label
      };
      if (panelId){
        attrs["aria-expanded"] = "false";
      }
      const btn = el("button", attrs, [label]);
      if (panelId){
        btn.dataset.panelTarget = panelId;
        btn.addEventListener("click", ()=>togglePanel(panelId));
        navButtons.set(panelId, btn);
      } else if (typeof handler === "function"){
        btn.addEventListener("click", handler);
      }
      navBar.appendChild(btn);
      return btn;
    }

    // Editable area (reuse given div)
    divEditor.classList.add("weditor-area");
    divEditor.setAttribute("contenteditable","true");
    if (pair.value && pair.value.trim()){
      divEditor.innerHTML = pair.value;
    } else if (!divEditor.innerHTML.trim()){
      // divEditor.innerHTML = "<p><br></p>";
      divEditor.innerHTML = "<div><br></div>";
    }
    bindUnboundPageBreaks();
    selectPageBreak(null);

    function alignImage(alignment) {
      const img = divEditor.querySelector('img.weditor-img-selected');
      if (!img) return;

      // Clear existing alignment styles
      img.style.float = '';
      img.style.margin = '';
      img.style.display = '';
      // Also clear text-align from parent paragraph if it exists
      const p = img.closest('p');
      if (p) p.style.textAlign = '';

      switch(alignment) {
        case 'left':
          img.style.float = 'left';
          img.style.marginRight = '10px';
          break;
        case 'center':
          // For center, we wrap it in a paragraph and center the paragraph
          if (p) {
            p.style.textAlign = 'center';
          } else {
            // If not in a paragraph, wrap it
            const wrapper = el('p', {style: {textAlign: 'center'}});
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
          }
          break;
        case 'right':
          img.style.float = 'right';
          img.style.marginLeft = '10px';
          break;
      }
      divEditor.dispatchEvent(new Event("input",{bubbles:true}));
    }

    // Exec helper（保证选区在编辑器内）
    function exec(cmd, val=null){
      if (showingSource) return;
      if (handleCommandForSelectedCells(cmd, val)) return;
      const selectedImg = divEditor.querySelector('img.weditor-img-selected');

      if (selectedImg && (cmd === 'justifyLeft' || cmd === 'justifyCenter' || cmd === 'justifyRight')) {
        const alignment = cmd.replace('justify', '').toLowerCase();
        alignImage(alignment);
        return;
      }

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

    const BLOCK_STYLE_SELECTOR = "p,h1,h2,h3,h4,h5,h6,li,blockquote,td,th,div,section,article,header,footer";

    // 获取当前选区内的所有块级节点（默认仅段落用于 No Spacing）(中文解释: 可根据选择器扩展命中范围)
    function getSelectedParagraphsInEditor(selector = "p"){
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) {
        const first = divEditor.querySelector(selector);
        return first ? [first] : [];
      }
      const range = sel.getRangeAt(0);
      if (!isNodeInside(range.commonAncestorContainer, divEditor)) return [];
      const blocks = $$(selector, divEditor);
      const result = [];
      blocks.forEach(block=>{
        let intersects = false;
        if (typeof range.intersectsNode === "function") {
          try { intersects = range.intersectsNode(block); } catch(_) { intersects = false; }
        }
        if (!intersects){
          const pr = document.createRange();
          pr.selectNodeContents(block);
          const endsBefore = range.compareBoundaryPoints(Range.END_TO_START, pr) < 0;
          const startsAfter = range.compareBoundaryPoints(Range.START_TO_END, pr) > 0;
          if (!endsBefore && !startsAfter) intersects = true;
          pr.detach?.();
        }
        if (intersects) result.push(block);
      });
      if (!result.length) {
        const anchor = sel.anchorNode;
        let n = anchor ? (anchor.nodeType===1 ? anchor : anchor.parentElement) : null;
        const fallback = n && n.closest ? n.closest(selector) : null;
        if (fallback && isNodeInside(fallback, divEditor)) result.push(fallback);
      }
      return result;
    }

    const BLOCK_ELEMENT_SELECTOR = "p,div,table,thead,tbody,tfoot,tr,td,th,ul,ol,li,section,article,header,footer,blockquote,h1,h2,h3,h4,h5,h6";
    const FORMATTABLE_BLOCK_SELECTOR = "p,h1,h2,h3,h4,h5,h6,div,section,article,header,footer,blockquote,li,td,th";
    const FORMATTABLE_BLOCK_TAGS = new Set(["P","H1","H2","H3","H4","H5","H6","DIV","SECTION","ARTICLE","HEADER","FOOTER","BLOCKQUOTE","LI","TD","TH"]);
    function normalizeSelectionToNode(node){
      if (!node) return;
      const sel = window.getSelection();
      if (!sel) return;
      try {
        const range = document.createRange();
        range.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(range);
      } catch(_){}
    }

    function normalizeFormattingTarget(node) {
      if (!node) return null;
      let cur = node.nodeType === 1 ? node : node.parentElement;
      while (cur && cur !== divEditor) {
        if (FORMATTABLE_BLOCK_TAGS.has(cur.tagName)) return cur;
        cur = cur.parentElement;
      }
      return null;
    }

    function getSelectedFormattingBlocks() {
      const blocks = getSelectedParagraphsInEditor(FORMATTABLE_BLOCK_SELECTOR);
      const seen = new Set();
      const result = [];
      blocks.forEach(node=>{
        const target = normalizeFormattingTarget(node);
        if (!target || !isNodeInside(target, divEditor)) return;
        if (seen.has(target)) return;
        seen.add(target);
        result.push(target);
      });
      if (!result.length) {
        const sel = window.getSelection && window.getSelection();
        const anchor = sel && sel.anchorNode ? normalizeFormattingTarget(sel.anchorNode) : null;
        if (anchor && !seen.has(anchor) && isNodeInside(anchor, divEditor)) {
          result.push(anchor);
        }
      }
      return result;
    }

    function applyBlockStyleToSelection(prop, value, opts = {}) {
      if (!prop) return false;
      const blocks = getSelectedFormattingBlocks();
      if (!blocks.length) return null;
      if (opts && opts.multiOnly && blocks.length < (opts.minimumBlocks || 2)) return null;
      const normalized = value === null || value === undefined ? "" : String(value);
      let mutated = false;
      blocks.forEach(block=>{
        if (!block || !isNodeInside(block, divEditor)) return;
        const current = block.style.getPropertyValue(prop);
        if (!normalized) {
          if (!current) return;
          block.style.removeProperty(prop);
          markSuppressedInlineProp(block, prop);
          if (!block.getAttribute("style")) block.removeAttribute("style");
          mutated = true;
        } else {
          if (current === normalized) return;
          block.style.setProperty(prop, normalized);
          recordInlineStyle(block, prop, normalized);
          mutated = true;
        }
        if (opts && typeof opts.afterEach === "function") {
          try { opts.afterEach(block, normalized); } catch(_){}
        }
      });
      if (!mutated) return null;
      if (opts && typeof opts.afterAll === "function") {
        try { opts.afterAll(blocks, normalized); } catch(_){}
      }
      if (!(opts && opts.silent)) {
        divEditor.dispatchEvent(new Event("input",{bubbles:true}));
      }
      return blocks;
    }

    function tryWrapRangeWithFontSize(range, fontSize){
      const span = document.createElement("span");
      span.style.fontSize = fontSize;
      try {
        range.surroundContents(span);
        normalizeSelectionToNode(span);
        return true;
      } catch(err) {
        let hasBlock = false;
        try {
          const fragment = range.cloneContents();
          if (fragment && typeof fragment.querySelector === "function") {
            hasBlock = !!fragment.querySelector(BLOCK_ELEMENT_SELECTOR);
          }
        } catch(_) {
          hasBlock = true;
        }
        if (hasBlock) return false;
        try {
          const extracted = range.extractContents();
          span.appendChild(extracted);
          range.insertNode(span);
          normalizeSelectionToNode(span);
          return true;
        } catch(_) {
          return false;
        }
      }
    }
    function applyFontSizePx(fontSize){
      if (!fontSize || showingSource) return false;

      const applyOnce = () => {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return "none";
        const range = sel.getRangeAt(0);
        if (!isNodeInside(range.commonAncestorContainer, divEditor)) return "none";
        if (range.collapsed) return "none";
        if (tryWrapRangeWithFontSize(range, fontSize)) {
          return "inline";
        }
        const blocksApplied = applyBlockStyleToSelection("font-size", fontSize, {
          multiOnly: true,
          silent: true
        });
        return blocksApplied ? "blocks" : "none";
      };

      let applied = false;
      if (cellSelectionState.selectedCells.length) {
        forEachSelectedCellRange(() => {
          const mode = applyOnce();
          if (mode !== "none") applied = true;
        });
        if (applied) {
          divEditor.dispatchEvent(new Event("input", { bubbles: true }));
        }
        return applied;
      }

      const mode = applyOnce();
      if (mode !== "none") {
        divEditor.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      }
      return false;
    }

    function applyTextAlignment(alignment) {
      if (!alignment || showingSource) return false;
      const normalized = alignment === "left" || alignment === "start" ? "" : alignment;
      const blocks = applyBlockStyleToSelection("text-align", normalized, {
        minimumBlocks: 1,
        afterEach(block){
          if (block && typeof block.removeAttribute === "function") {
            block.removeAttribute("align");
          }
        }
      });
      return Array.isArray(blocks) && blocks.length > 0;
    }

    function applyLineHeight(value) {
      if (!value) return;
      if (showingSource) return;
      if (cellSelectionState.selectedCells.length) {
        let changed = false;
        cellSelectionState.selectedCells.forEach(cell => {
          if (!cell || !cell.isConnected) return;
          const nodes = $$(BLOCK_STYLE_SELECTOR, cell);
          if (nodes.length) {
            nodes.forEach(node => {
              if (isNodeInside(node, divEditor)) {
                node.style.lineHeight = value;
                changed = true;
              }
            });
          } else {
            cell.style.lineHeight = value;
            changed = true;
          }
        });
        if (changed) divEditor.dispatchEvent(new Event("input",{bubbles:true}));
        return;
      }
      const blocks = getSelectedParagraphsInEditor(BLOCK_STYLE_SELECTOR);
      if (!blocks.length) return;
      blocks.forEach(node => {
        if (isNodeInside(node, divEditor)) {
          node.style.lineHeight = value;
        }
      });
      divEditor.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // ---------- History manager (with redo-safe undo) ----------
    function getHTML(){ return showingSource ? divEditor.textContent : divEditor.innerHTML; }

    function sanitizePageBreaksForExport(root){
      if (!root || typeof root.querySelectorAll !== "function") return;
      root.querySelectorAll(".weditor-page-break").forEach(pb=>{
        if (!pb) return;
        pb.classList.remove("weditor-page-break-selected");
        pb.removeAttribute("aria-label");
        pb.removeAttribute("role");
        pb.removeAttribute("contenteditable");
        pb.textContent = "";
        if (pb.style) {
          pb.removeAttribute("style");
          pb.style.display = "block";
          pb.style.pageBreakAfter = "always";
          try { pb.style.setProperty("break-after", "page"); } catch(_){}
        }
      });
    }

    function getExportHTML(){
      if (showingSource) return divEditor.textContent;
      const clone = divEditor.cloneNode(true);
      sanitizePageBreaksForExport(clone);
      return clone.innerHTML;
    }
    function setHTML(v, opts={}){
      const silent = !!opts.silent;
      if (showingSource) {
        divEditor.textContent = v;
      } else {
        divEditor.innerHTML = v;
        bindUnboundPageBreaks();
        selectPageBreak(null);
      }
      if (!silent){
        divEditor.dispatchEvent(new Event("input",{bubbles:true}));
      } else {
        pair.value = getExportHTML();
        if (!showingSource) {
          convertToInlineStyles();
        }
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
      syncTimer = setTimeout(()=>{ pair.value = getExportHTML(); }, 120);
    }

    divEditor.addEventListener("input", scheduleSnapshot);
    divEditor.addEventListener("input", syncToTextarea);
    divEditor.addEventListener("input", updateToggleStates);
    divEditor.addEventListener("input", updateTableToolsVisibility);
    divEditor.addEventListener("input", ()=>{
      bindUnboundPageBreaks();
      if (!selectedPageBreak) return;
      if (suppressNextPageBreakClear) {
        suppressNextPageBreakClear = false;
        return;
      }
      selectPageBreak(null);
    });
    divEditor.addEventListener("blur", syncToTextarea);
    divEditor.addEventListener("focus", updateTableToolsVisibility);

    // ---------- Inline Style Conversion Logic ----------
    const FONT_SIZE_MAP = {
      '1': '10px', '2': '13px', '3': '16px', '4': '18px', '5': '24px',
      '6': '32px', '7': '48px', 'css-20': '20px', 'css-22': '22px',
      'css-24': '24px', 'css-26': '26px', 'css-28': '28px',
      'css-32': '32px', 'css-36': '36px', 'css-48': '48px', 'css-72': '72px'
    };
    const FONT_SIZE_LOOKUPS = (() => {
      const pxToValue = new Map();
      Object.entries(FONT_SIZE_MAP).forEach(([key, px]) => {
        const normalized = String(px).trim().toLowerCase();
        if (!pxToValue.has(normalized) || key.startsWith("css-")) {
          pxToValue.set(normalized, key);
        }
      });
      const pxEntries = [];
      pxToValue.forEach((valueKey, normalizedPx) => {
        const numeric = parseFloat(normalizedPx);
        if (!Number.isNaN(numeric)) {
          pxEntries.push({ valueKey, normalizedPx, numeric });
        }
      });
      return { pxToValue, pxEntries };
    })();
    const PIXEL_TO_FONT_SIZE_VALUE = FONT_SIZE_LOOKUPS.pxToValue;
    const FONT_SIZE_PX_ENTRIES = FONT_SIZE_LOOKUPS.pxEntries;
    function resolveFontSizeKeyFromPx(pxValue){
      if (!pxValue) return "";
      const normalized = String(pxValue).trim().toLowerCase();
      if (!normalized) return "";
      if (PIXEL_TO_FONT_SIZE_VALUE.has(normalized)) {
        return PIXEL_TO_FONT_SIZE_VALUE.get(normalized);
      }
      if (/^\d+(\.\d+)?px$/.test(normalized)) {
        const numeric = parseFloat(normalized);
        let bestDiff = Infinity;
        let bestKey = "";
        FONT_SIZE_PX_ENTRIES.forEach(entry => {
          const diff = Math.abs(entry.numeric - numeric);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestKey = entry.valueKey;
          }
        });
        if (bestDiff <= 1) return bestKey;
      }
      return "";
    }

    function parseStyleAttribute(styleText = "") {
      const entries = new Map();
      styleText.split(";").forEach(chunk => {
        if (!chunk.trim()) return;
        const separatorIndex = chunk.indexOf(":");
        if (separatorIndex === -1) return;
        const prop = chunk.slice(0, separatorIndex).trim().toLowerCase();
        const value = chunk.slice(separatorIndex + 1).trim();
        if (prop && value) entries.set(prop, value);
      });
      return entries;
    }

  function serializeStyleMap(styleMap) {
      return Array.from(styleMap.entries())
        .map(([prop, value]) => `${prop}: ${value}`)
        .join("; ");
    }

    const INLINE_STYLE_MODE = {
      INLINE_ONLY: "inline-only",
      TRACKED_INLINE: "tracked-inline"
    };
    let inlineStyleMode = INLINE_STYLE_MODE.INLINE_ONLY;

    const styleLedger = new Map(); // prop -> Map<value, Set<Element>>
    const suppressedInlineProps = new WeakMap();
    const INHERITED_STYLE_PROPS = new Set([
      "color",
      "font-family",
      "font-size",
      "font-style",
      "font-weight",
      "line-height",
      "text-align",
      "text-decoration-line"
    ]);

    function markSuppressedInlineProp(el, prop) {
      let bag = suppressedInlineProps.get(el);
      if (!bag) {
        bag = new Set();
        suppressedInlineProps.set(el, bag);
      }
      bag.add(prop);
    }

    function releaseSuppressedInlineProp(el, prop) {
      const bag = suppressedInlineProps.get(el);
      if (!bag) return;
      bag.delete(prop);
      if (!bag.size) suppressedInlineProps.delete(el);
    }

    function isInlinePropSuppressed(el, prop) {
      const bag = suppressedInlineProps.get(el);
      return bag ? bag.has(prop) : false;
    }

    function resetStyleLedger() {
      styleLedger.clear();
    }

    function recordInlineStyle(el, prop, value) {
      releaseSuppressedInlineProp(el, prop);
      if (!styleLedger.has(prop)) {
        styleLedger.set(prop, new Map());
      }
      const valueMap = styleLedger.get(prop);
      if (!valueMap.has(value)) {
        valueMap.set(value, new Set());
      }
      valueMap.get(value).add(el);
      if (inlineStyleMode !== INLINE_STYLE_MODE.INLINE_ONLY) {
        el.dataset.weditorStyle = "1";
      }
    }

    function removeLedgerEntry(el, prop, value) {
      const valueMap = styleLedger.get(prop);
      if (!valueMap) return;
      const set = valueMap.get(value);
      if (!set) return;
      set.delete(el);
      if (!set.size) {
        valueMap.delete(value);
      }
      if (!valueMap.size) {
        styleLedger.delete(prop);
      }
    }

    function removeInlineStyles(prop, value) {
      if (!prop) return;
      const valueMap = styleLedger.get(prop);
      if (!valueMap) return;
      const targets = [];
      if (value !== undefined && value !== null) {
        const key = String(value);
        const set = valueMap.get(key);
        if (set) targets.push([key, set]);
      } else {
        valueMap.forEach((set, val) => targets.push([val, set]));
      }
      if (!targets.length) return;
      targets.forEach(([val, set]) => {
        set.forEach(el => {
          if (!el || !isNodeInside(el, divEditor)) return;
          el.style.removeProperty(prop);
          if (!el.getAttribute("style")) {
            el.removeAttribute("style");
            if (inlineStyleMode !== INLINE_STYLE_MODE.INLINE_ONLY) {
              delete el.dataset.weditorStyle;
            }
          }
          markSuppressedInlineProp(el, prop);
        });
        set.clear();
        valueMap.delete(val);
      });
      if (!valueMap.size) {
        styleLedger.delete(prop);
      }
      syncToTextarea();
      debouncedConvertToInlineStyles();
    }

    function setInlineStyleMode(mode) {
      if (!mode) return;
      const normalized = String(mode).toLowerCase();
      const values = Object.values(INLINE_STYLE_MODE);
      if (!values.includes(normalized)) return;
      inlineStyleMode = normalized;
      debouncedConvertToInlineStyles();
    }

    function normalizeFontElement(fontEl) {
      const span = document.createElement("span");
      const attrs = Array.from(fontEl.attributes);
      const existingStyleAttr = attrs.find(attr => attr.name.toLowerCase() === "style");
      if (existingStyleAttr) {
        span.setAttribute("style", existingStyleAttr.value);
      }
      const suppressed = suppressedInlineProps.get(fontEl);
      if (suppressed && suppressed.size) {
        suppressedInlineProps.set(span, new Set(suppressed));
        suppressedInlineProps.delete(fontEl);
      }
      attrs.forEach(attr => {
        const name = attr.name.toLowerCase();
        const val = attr.value;
        if (name === "face") {
          span.style.fontFamily = val;
        } else if (name === "color") {
          span.style.color = val;
        } else if (name === "size") {
          const sizeKey = val.trim();
          if (FONT_SIZE_MAP[sizeKey]) {
            span.style.fontSize = FONT_SIZE_MAP[sizeKey];
          } else if (/^\d+(\.\d+)?px$/i.test(sizeKey)) {
            span.style.fontSize = sizeKey;
          }
        } else if (name !== "style") {
          span.setAttribute(attr.name, val);
        }
      });
      while (fontEl.firstChild) span.appendChild(fontEl.firstChild);
      fontEl.parentNode?.replaceChild(span, fontEl);
      return span;
    }

    function unwrapNestedParagraph(element) {
      let el = element;
      while (el && el.tagName === "P") {
        const parent = el.parentElement;
        if (!parent || parent.tagName !== "P") break;
        const grand = parent.parentElement;
        if (!grand) break;
        grand.insertBefore(el, parent.nextSibling);
        if (!parent.textContent.trim()) {
          parent.remove();
        }
      }
      return el;
    }

    function cleanSemanticStyleOverrides(el, styleMap) {
      const removeProp = prop => {
        if (!styleMap.has(prop)) return;
        styleMap.delete(prop);
        try { el.style.removeProperty(prop); } catch(_) {}
      };
      const tag = el.tagName;
      if (tag === "B" || tag === "STRONG") {
        removeProp("font-weight");
      }
      if (tag === "I" || tag === "EM") {
        removeProp("font-style");
      }
      if (tag === "U") {
        removeProp("text-decoration-line");
        removeProp("text-decoration");
      }
      if ((tag === "B" || tag === "STRONG" || tag === "I" || tag === "EM" || tag === "U") && !styleMap.size) {
        el.removeAttribute("style");
      }
    }

    function unwrapSpanIfEmpty(span) {
      if (!span || span.tagName !== "SPAN") return;
      if (span.attributes.length) return;
      const parent = span.parentNode;
      if (!parent) return;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      span.remove();
    }

    function normalizeOrphanListItem(li) {
      if (!li || li.tagName !== "LI") return li;
      const parent = li.parentElement;
      if (parent && parent.tagName && /^(UL|OL)$/i.test(parent.tagName)) return li;
      const replacement = document.createElement("p");
      Array.from(li.attributes).forEach(attr => {
        if (attr.name.toLowerCase() === "value") return;
        replacement.setAttribute(attr.name, attr.value);
      });
      while (li.firstChild) replacement.appendChild(li.firstChild);
      li.parentNode?.replaceChild(replacement, li);
      return replacement;
    }

    const HOIST_PARENT_TAGS = new Set(["P","DIV","LI","H1","H2","H3","H4","H5","H6"]);
    const HOISTABLE_PROPS = ["color","font-family","font-size","font-weight","font-style","text-decoration-line","background-color"];
    const BLOCK_TAGS = new Set(["P","DIV","LI","UL","OL","TABLE","TBODY","THEAD","TFOOT","TR","TD","TH","SECTION","ARTICLE","HEADER","FOOTER","BLOCKQUOTE"]);
    const LIST_STRUCTURE_TAGS = new Set(["UL","OL","LI"]);
    const TABLE_STRUCTURE_TAGS = new Set(["TABLE","TBODY","THEAD","TFOOT","TR","TD","TH"]);

    function hoistSpanStylesAfterConversion() {
      const spans = Array.from(divEditor.querySelectorAll("span"));
      spans.forEach(span => {
        const parent = span.parentElement;
        if (!parent) return;
        if (parent === divEditor) return;
        if (!HOIST_PARENT_TAGS.has(parent.tagName)) return;
        if (parent.childNodes.length !== 1) return;
        const spanStyleText = span.getAttribute("style");
        if (!spanStyleText) return;
        const spanMap = parseStyleAttribute(spanStyleText);
        let moved = false;
        HOISTABLE_PROPS.forEach(prop => {
          if (!spanMap.has(prop)) return;
          const spanValue = spanMap.get(prop);
          if (parent.style.getPropertyValue(prop)) {
            const parentValue = parent.style.getPropertyValue(prop);
            if (prop === "font-size" && parentValue) {
              const parentPx = parentValue.trim().toLowerCase();
              const childPx = (spanValue || "").trim().toLowerCase();
              if (parentPx === childPx) {
                spanMap.delete(prop);
                removeLedgerEntry(span, prop, spanValue);
              }
            }
            return;
          }
          const value = spanMap.get(prop);
          parent.style.setProperty(prop, value);
          recordInlineStyle(parent, prop, value);
          spanMap.delete(prop);
          removeLedgerEntry(span, prop, value);
          moved = true;
        });
        if (!moved) {
          unwrapSpanIfEmpty(span);
          return;
        }
        if (parent.style.length) {
          parent.setAttribute("style", parent.style.cssText);
        }
        if (spanMap.size) {
          span.setAttribute("style", serializeStyleMap(spanMap));
        } else {
          span.removeAttribute("style");
        }
        unwrapSpanIfEmpty(span);
      });
    }

    const DEFAULT_STYLE_VALUES = new Map([
      ["font-weight", "400"],
      ["font-style", "normal"],
      ["text-decoration-line", "none"],
      ["text-align", "start"]
    ]);

    function hasBorderShorthand(styleMap) {
      return ["border", "border-width", "border-style", "border-color"].some(key => styleMap.has(key));
    }

    function shouldSkipComputedProp(prop, value, el, styleMap, computed) {
      const trimmed = (value || "").trim();
      if (!trimmed || trimmed === "initial") return true;

      if (isInlinePropSuppressed(el, prop)) return true;

      const inlineValue = el.style.getPropertyValue(prop);
      if (styleMap.has(prop)) return true;
      if (trimmed === "auto" && !inlineValue) return true;

      if (prop === "color" && trimmed === "rgb(0, 0, 0)" && !inlineValue) return true;
      if (prop === "background-color") {
        if ((el.dataset && el.dataset.weditorSelectionHighlight === "1") || (el.classList && el.classList.contains("weditor-cell-selected"))) {
          return true;
        }
        if ((trimmed === "rgba(0, 0, 0, 0)" || trimmed === "transparent") && !inlineValue) return true;
      }
      const tagName = el.tagName;
      if ((tagName === "B" || tagName === "STRONG") && prop === "font-weight" && (trimmed === "700" || trimmed === "bold")) return true;
      if ((tagName === "I" || tagName === "EM") && prop === "font-style" && trimmed === "italic") return true;
      if (tagName === "U" && prop === "text-decoration-line" && trimmed.indexOf("underline") !== -1) return true;
      if (prop === "line-height" && !inlineValue) {
        if (trimmed === "normal") return true;
        try {
          const display = computed.getPropertyValue("display");
          if (display === "inline") return true;
        } catch(_){ }
        const numeric = parseFloat(trimmed);
        if (!Number.isNaN(numeric) && numeric > 0) {
          if (trimmed.toLowerCase().endsWith("px")) {
            if (numeric < 8) return true;
          } else if (numeric < 0.8) {
            return true;
          }
        }
      }

      if (!inlineValue && INHERITED_STYLE_PROPS.has(prop)) {
        const parent = el.parentElement;
        if (parent && isNodeInside(parent, divEditor)) {
          try {
            const parentComputed = window.getComputedStyle(parent);
            const parentValue = parentComputed && parentComputed.getPropertyValue(prop);
            const shouldForceForRoot = parent === divEditor && (prop === "font-family" || prop === "font-size");
            if (!shouldForceForRoot && parentValue === trimmed) {
              return true;
            }
          } catch(_){}
        }
      }

      if (DEFAULT_STYLE_VALUES.has(prop) && DEFAULT_STYLE_VALUES.get(prop) === trimmed && !inlineValue) return true;

      if (prop.startsWith("margin-") && styleMap.has("margin")) return true;
      if (prop.startsWith("padding-") && styleMap.has("padding")) return true;
      if (prop.startsWith("border-") && hasBorderShorthand(styleMap)) return true;

      if (prop.endsWith("-color")) {
        const widthProp = prop.replace("-color", "-width");
        const widthVal = computed.getPropertyValue(widthProp);
        const inlineWidth = el.style.getPropertyValue(widthProp) || styleMap.get(widthProp);
        if ((widthVal === "0px" || widthVal === "0") && (!inlineWidth || inlineWidth === "0px" || inlineWidth === "0")) {
          return true;
        }
      }

      return false;
    }

    const INLINE_TEXT_PROPS = [
      'font-size', 'font-family', 'font-weight', 'font-style', 'text-decoration-line',
      'color', 'background-color', 'line-height', 'text-align'
    ];
    const INLINE_TEXT_PROP_SET = new Set(INLINE_TEXT_PROPS);
    const IMPORTANT_STYLES = INLINE_TEXT_PROPS;

    let isConvertingInlineStyles = false;
    let inlineStyleRerunNeeded = false;

    function convertToInlineStyles() {
      if (isConvertingInlineStyles) {
        inlineStyleRerunNeeded = true;
        return;
      }
      isConvertingInlineStyles = true;
      inlineStyleRerunNeeded = false;
      try {
        resetStyleLedger();
        const elements = divEditor.querySelectorAll('*');
        elements.forEach(originalEl => {
          let el = originalEl;
          const hadTrackedInline = inlineStyleMode !== INLINE_STYLE_MODE.INLINE_ONLY && el.dataset.weditorStyle === "1";
          if (inlineStyleMode !== INLINE_STYLE_MODE.INLINE_ONLY) {
            delete el.dataset.weditorStyle;
          }
          if (el.tagName === 'FONT') {
            el = normalizeFontElement(el);
          }
          if (el.tagName === 'P') {
            el = unwrapNestedParagraph(el);
          }
          if (el.tagName === 'LI') {
            el = normalizeOrphanListItem(el);
          }
          if (BLOCK_TAGS.has(el.tagName)) {
            const parent = el.parentElement;
            if (parent && parent !== divEditor && BLOCK_TAGS.has(parent.tagName)) {
              const parentTag = parent.tagName;
              const childTag = el.tagName;
              const parentIsStructural = LIST_STRUCTURE_TAGS.has(parentTag) || TABLE_STRUCTURE_TAGS.has(parentTag);
              const childIsStructural = LIST_STRUCTURE_TAGS.has(childTag) || TABLE_STRUCTURE_TAGS.has(childTag);
              if (!parentIsStructural && !childIsStructural) {
                const hasSiblingContent = Array.from(parent.childNodes).some(node => {
                  if (node === el) return false;
                  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent.trim();
                  if (node.nodeType === Node.COMMENT_NODE) return false;
                  return true;
                });
                if (!hasSiblingContent) {
                  const fragment = document.createDocumentFragment();
                  fragment.appendChild(el);
                  parent.parentNode?.insertBefore(fragment, parent.nextSibling);
                  if (!parent.textContent.trim()) parent.remove();
                }
              }
            }
          }

          const computed = window.getComputedStyle(el);
          const existingStyleText = el.getAttribute('style') || '';
          const styleMap = parseStyleAttribute(existingStyleText);
          if (el.hasAttribute && el.hasAttribute("dir")) {
            const dirAttr = (el.getAttribute("dir") || "").toLowerCase();
            if (!dirAttr || dirAttr === "ltr") {
              el.removeAttribute("dir");
            }
          }
          if (el.hasAttribute && el.hasAttribute("align")) {
            const alignAttr = (el.getAttribute("align") || "").toLowerCase();
            el.removeAttribute("align");
            if (alignAttr && alignAttr !== "left" && alignAttr !== "start") {
              if (!styleMap.has("text-align") && !el.style.getPropertyValue("text-align")) {
                styleMap.set("text-align", alignAttr);
              }
            }
          }
          Array.from(styleMap.keys()).forEach(prop => {
            if (isInlinePropSuppressed(el, prop)) {
              styleMap.delete(prop);
            }
          });

          cleanSemanticStyleOverrides(el, styleMap);

          try {
            if (styleMap.has("line-height") && computed.getPropertyValue("display") === "inline") {
              el.style.removeProperty("line-height");
              styleMap.delete("line-height");
            }
          } catch(_){}

          let parentComputed = null;
          if (hadTrackedInline && INHERITED_STYLE_PROPS.size) {
            const parent = el.parentElement;
            if (parent && isNodeInside(parent, divEditor)) {
              try {
                parentComputed = window.getComputedStyle(parent);
              } catch(_){}
            }
          }
          if (parentComputed) {
            Array.from(styleMap.entries()).forEach(([prop, val]) => {
              if (!INHERITED_STYLE_PROPS.has(prop)) return;
              if (parentComputed.getPropertyValue(prop) === val) {
                el.style.removeProperty(prop);
                styleMap.delete(prop);
              }
            });
          }

          IMPORTANT_STYLES.forEach(prop => {
            const value = computed.getPropertyValue(prop);
            if (shouldSkipComputedProp(prop, value, el, styleMap, computed)) return;
            styleMap.set(prop, value.trim());
          });

          if (styleMap.size) {
            const serialized = serializeStyleMap(styleMap);
            el.setAttribute('style', serialized);
            styleMap.forEach((val, prop) => {
              if (!INLINE_TEXT_PROP_SET.has(prop)) return;
              recordInlineStyle(el, prop, val);
            });
          } else {
            el.removeAttribute('style');
            if (inlineStyleMode !== INLINE_STYLE_MODE.INLINE_ONLY) {
              delete el.dataset.weditorStyle;
            }
          }
          unwrapSpanIfEmpty(el);
        });
        hoistSpanStylesAfterConversion();
        // After converting styles, ensure the textarea is updated
        syncToTextarea();
      } finally {
        isConvertingInlineStyles = false;
        if (inlineStyleRerunNeeded) {
          inlineStyleRerunNeeded = false;
          convertToInlineStyles();
        }
      }
    }

    let inlineStyleTimer = null;
    function debouncedConvertToInlineStyles() {
      clearTimeout(inlineStyleTimer);
      inlineStyleTimer = setTimeout(convertToInlineStyles, 500);
    }

    divEditor.addEventListener("input", debouncedConvertToInlineStyles);
    debouncedConvertToInlineStyles();
 
    // Toolbar helpers
    function normalizePanelId(label, fallback){
      const base = (label || fallback || "panel").toString().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
      let id = base || ("panel-" + Math.random().toString(36).slice(2,7));
      let dedupe = 1;
      while (panelMap.has(id)){
        dedupe += 1;
        id = `${base || "panel"}-${dedupe}`;
      }
      return id;
    }

    function createToolbarGroup(label, opts = {}) {
      const id = opts.id || normalizePanelId(label, opts.navLabel);
      const navLabel = opts.navLabel || label;
      const panelClasses = ["weditor-toolbar-panel"];
      if (opts.panelClass) panelClasses.push(opts.panelClass);
      const group = el("div", {
        class: panelClasses.join(" "),
        role: "group",
        "aria-label": label || navLabel || "Tools",
        "data-panel": id,
        "data-hidden": "true",
        "aria-hidden": "true"
      });
      if (label && opts.showHeading !== false){
        group.appendChild(el("div",{class:"weditor-toolbar-panel-title"},[label]));
      }
      const inner = el("div", { class: "weditor-toolbar-group-inner" });
      group.appendChild(inner);
      panelContainer.appendChild(group);
      panelMap.set(id, group);
      let trigger = null;
      if (opts.createNav !== false){
        trigger = createNavButton(navLabel || label || "Panel", { panelId: id, classes: opts.navClass || "" });
      }
      return { id, group, inner, trigger };
    }

    function createPanelSection(parent, label){
      const block = el("div", { class: "weditor-panel-section-block" });
      if (label) {
        block.appendChild(el("div", { class: "weditor-panel-label" }, [label]));
      }
      const section = el("div", { class: "weditor-panel-section" });
      block.appendChild(section);
      parent.appendChild(block);
      return section;
    }

    function addBtn(content, title, fn, target = toolbar, extraClass = ""){
      const b = el("button",{type:"button",title, "aria-label": title});
      if (extraClass) b.classList.add(...extraClass.split(" ").filter(Boolean));
      if (typeof content === "string" && content.trim().startsWith("<svg")){
        b.innerHTML = content;
      } else if (typeof content === "string"){
        b.appendChild(document.createTextNode(content));
      } else if (content && content.nodeType === 1){
        b.appendChild(content);
      }
      b.addEventListener("click", fn);
      target.appendChild(b);
      return b;
    }

    // Undo / Redo quick actions on nav
    btnUndo = createNavButton("Undo", { handler: ()=>history.undo(), classes: "weditor-nav-btn--action" });
    btnRedo = createNavButton("Redo", { handler: ()=>history.redo(), classes: "weditor-nav-btn--action" });
    btnFs = createNavButton("Fullscreen", { handler: ()=>toggleFullScreen(), classes: "weditor-nav-btn--action", title: "Toggle fullscreen" });

    const groupFormatting = createToolbarGroup("Text", { id: "text", navLabel: "Text", showHeading: false });
    const groupInsert = createToolbarGroup("Insert", { id: "insert", navLabel: "Insert", showHeading: false });
    const groupLayout = createToolbarGroup("Layout", { id: "layout", navLabel: "Layout", showHeading: false });
    const groupTableTools = createToolbarGroup("Table Tools", { id: "table", navLabel: "Table", panelClass: "weditor-table-panel" });


    const textSelectorsSection = el("div", { class: "weditor-panel-section" });
    const textInlineSection = el("div", { class: "weditor-panel-section" });
    groupFormatting.inner.appendChild(textSelectorsSection);
    groupFormatting.inner.appendChild(textInlineSection);

    const layoutStructureSection = el("div", { class: "weditor-panel-section" });
    const layoutAlignmentSection = el("div", { class: "weditor-panel-section" });
    const layoutUtilitiesSection = el("div", { class: "weditor-panel-section" });
    groupLayout.inner.appendChild(layoutStructureSection);
    groupLayout.inner.appendChild(layoutAlignmentSection);
    groupLayout.inner.appendChild(layoutUtilitiesSection);

    addBtn("HTML","Toggle HTML view", ()=>{
      const before = getHTML();
      if (before !== history.current()){
        history.push(before);
        lastSaved = before;
      }
      if (!showingSource){
        const exportHTML = getExportHTML();
        divEditor.textContent = exportHTML;
        showingSource = true;
      } else {
        divEditor.innerHTML = divEditor.textContent;
        bindUnboundPageBreaks();
        selectPageBreak(null);
        showingSource = false;
      }
      // Disable WYSIWYG-only controls when showing source (中文解释: 源码模式禁用下拉避免误操作)
      setTimeout(()=>{ try{ if (typeof setWYSIWYGEnabled === "function") setWYSIWYGEnabled(!showingSource); }catch(_){ } }, 0);

      const after = getHTML();
      if (after !== history.current()){
        history.push(after);
        lastSaved = after;
      }
      cancelSnapshotTimer();
      pair.value = getExportHTML();
      updateUndoRedoButtons();
    }, layoutUtilitiesSection);

    // Fullscreen
    let isFullScreen = false;
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
      if (btnFs) {
        btnFs.textContent = isFullScreen ? "Exit Fullscreen" : "Fullscreen";
        btnFs.title = isFullScreen ? "Exit Fullscreen" : "Fullscreen";
        btnFs.setAttribute("aria-pressed", isFullScreen ? "true" : "false");
      }
      if (isFullScreen) {
        document.addEventListener("keydown", handleEscKey);
        divEditor.focus();
      } else {
        document.removeEventListener("keydown", handleEscKey);
      }
    }

    // Unified Formatting group (merge Text/Headings/Lists/Align)
    let sizeSelect = el("select", { title: "Font size", "aria-label": "Font size", class: "weditor-size-select" });
    FONT_SIZE_PRESETS.forEach(s=>{
      sizeSelect.appendChild(el("option", { value: s.value }, [s.label]));
    });
    sizeSelect.addEventListener("change", ()=>{
      const value = sizeSelect.value;
      if (value.startsWith("css-")) {
        // 使用CSS样式实现大字体大小
        const fontSize = value.substring(4) + "px";
        applyFontSizePx(fontSize);
        updateToggleStates();
      } else {
        // 使用传统的execCommand（仅限于1-7）
        exec("fontSize", value);
      }
    });
    textSelectorsSection.appendChild(sizeSelect);

    // Font family selector (minimal, execCommand 'fontName') (中文解释: 字体族选择器)
    const FONT_FAMILY_PRESETS = [
      "Arial",
      "Calibri",
      "Times New Roman",
      "Georgia",
      "Helvetica",
      "Tahoma",
      "Verdana",
      "Courier New",
      "Consolas"
    ];
    let fontSelect = el("select", {
      title: "Font family",
      "aria-label": "Font family",
      class: "weditor-font-select"
    });
    FONT_FAMILY_PRESETS.forEach(name=>{
      const opt = el("option", { value: name, style: { fontFamily: name }}, [name]);
      fontSelect.appendChild(opt);
    });
    fontSelect.addEventListener("change", ()=>{
      const v = fontSelect.value;
      if (!v) return;
      const applied = applyBlockStyleToSelection("font-family", v, { multiOnly: true });
      if (!applied) {
        exec("fontName", v);
      } else {
        try { updateToggleStates && updateToggleStates(); } catch(_){}
      }
    });
    textSelectorsSection.appendChild(fontSelect);

    // Helpers for reflecting current font family (中文解释: 解析当前选区字体并匹配预设)
    function normalizeFontNameValue(v){
      if (!v) return "";
      return String(v).replace(/^['"]|['"]$/g,"").trim();
    }
    function resolveCurrentFontFromSelection(){
      // 1) Try execCommand reported fontName
      let name = document.queryCommandValue && document.queryCommandValue("fontName");
      name = normalizeFontNameValue(name || "");
      // 2) Fallback to computed style of anchor
      if (!name){
        const sel = window.getSelection && window.getSelection();
        if (sel && sel.anchorNode){
          const n = sel.anchorNode.nodeType===1 ? sel.anchorNode : sel.anchorNode.parentElement;
          if (n && n.nodeType===1){
            const cs = window.getComputedStyle ? window.getComputedStyle(n) : null;
            const fam = cs && cs.fontFamily ? cs.fontFamily.split(",")[0] : "";
            name = normalizeFontNameValue(fam);
          }
        }
      }
      // 3) Match against presets (case-insensitive)
      const key = name.toLowerCase();
      for (const f of FONT_FAMILY_PRESETS){
        if (f.toLowerCase() === key) return f;
      }
      return "";
    }
    function resolveCurrentFontSizeValue(){
      // 1) Prefer execCommand result (only reliable for legacy 1-7 sizes)
      const raw = document.queryCommandValue && document.queryCommandValue("fontSize");
      const value = raw ? String(raw) : "";
      if (["1","2","3","4","5","6","7"].includes(value)) {
        return value;
      }
      // 2) Walk up DOM to find explicit inline font-size
      const sel = window.getSelection && window.getSelection();
      if (sel && sel.anchorNode){
        let n = sel.anchorNode.nodeType===1 ? sel.anchorNode : sel.anchorNode.parentElement;
        while (n && n !== divEditor){
          if (n.style && n.style.fontSize){
            const key = resolveFontSizeKeyFromPx(n.style.fontSize);
            if (key) return key;
          }
          n = n.parentElement;
        }
      }
      // 3) Fallback to computed style on anchor node
      if (sel && sel.anchorNode){
        const node = sel.anchorNode.nodeType===1 ? sel.anchorNode : sel.anchorNode.parentElement;
        if (node && node.nodeType===1){
          const cs = window.getComputedStyle ? window.getComputedStyle(node) : null;
          const key = cs ? resolveFontSizeKeyFromPx(cs.fontSize) : "";
          if (key) return key;
        }
      }
      return "";
    }

    // New: Paragraph style select (Normal/H1/H2/H3) — minimal UX, Word-like
    const styleSelect = el("select", {
      title: "Paragraph style",
      "aria-label": "Paragraph style",
      class: "weditor-style-select"
    });
    [
      { label: "Normal", value: "p" },
      { label: "No Spacing", value: "noSpacing" },
      { label: "Heading 1", value: "h1" },
      { label: "Heading 2", value: "h2" },
      { label: "Heading 3", value: "h3" }
    ].forEach(opt=>{
      styleSelect.appendChild(el("option", { value: opt.value }, [opt.label]));
    });
    styleSelect.addEventListener("change", ()=>{
      const v = styleSelect.value;
      if (v === "noSpacing"){
        exec("formatBlock","<p>");
        setTimeout(()=>{
          const list = getSelectedParagraphsInEditor();
          list.forEach(p=>{
            if (isNodeInside(p, divEditor)) p.classList.add("weditor-nospace");
          });
          updateToggleStates();
        },0);
      } else if (v){
        exec("formatBlock","<"+v+">");
        setTimeout(()=>{
          const list = getSelectedParagraphsInEditor();
          list.forEach(p=>{
            if (isNodeInside(p, divEditor)) p.classList.remove("weditor-nospace");
          });
          updateToggleStates();
        },0);
      }
    });
    textSelectorsSection.appendChild(styleSelect);

    // Line height selector (行高选择器)
    const LINE_HEIGHT_PRESETS = [
      { label: "0.1", value: "0.1" },
      { label: "0.2", value: "0.2" },
      { label: "0.3", value: "0.3" },
      { label: "0.4", value: "0.4" },
      { label: "0.5", value: "0.5" },
      { label: "0.6", value: "0.6" },
      { label: "0.7", value: "0.7" },
      { label: "0.8", value: "0.8" },
      { label: "0.9", value: "0.9" },
      { label: "1.0", value: "1.0" },
      { label: "1.15", value: "1.15" },
      { label: "1.5", value: "1.5" },
      { label: "2.0", value: "2.0" },
      { label: "2.5", value: "2.5" },
      { label: "3.0", value: "3.0" }
    ];
    let lineHeightSelect = el("select", {
      title: "Line height",
      "aria-label": "Line height",
      class: "weditor-lineheight-select"
    });
    LINE_HEIGHT_PRESETS.forEach(preset=>{
      lineHeightSelect.appendChild(el("option", { value: preset.value }, [preset.label]));
    });
    lineHeightSelect.addEventListener("change", ()=>{
      const value = lineHeightSelect.value;
      applyLineHeight(value);
    });
    layoutStructureSection.appendChild(lineHeightSelect);
    
    // Line height icon button + popup (non-destructive; keep select) (中文解释: 渐进式，保留原下拉)
    const ICON_LINE_HEIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <!-- Vertical arrow for spacing adjustment -->
      <path d="M6 4v16m-2-2l2 2 2-2M4 6l2-2 2 2"/>
      
      <!-- Horizontal lines representing text -->
      <line x1="10" y1="6" x2="20" y2="6"/>
      <line x1="10" y1="10" x2="20" y2="10"/>
      <line x1="10" y1="14" x2="20" y2="14"/>
      <line x1="10" y1="18" x2="20" y2="18"/>
    </svg>`;

    // Lightweight menu reusing existing popup style/positioning (中文解释: 复用已有弹层样式与定位)
    const lineHeightMenu = (() => {
      let node = null;
      let outsideHandler = null;
      let lhButtons = [];
      let anchorForFocus = null;

      function ensurePopup() {
        if (node) return node;
        node = el("div", { class: "weditor-menu-popup", role: "menu" });
        // Build option buttons for all presets
        LINE_HEIGHT_PRESETS.forEach(preset => {
          const b = el("button", { type: "button", title: "Line height " + preset.label, role: "menuitemradio" }, [preset.label]);
          b.dataset.lhValue = preset.value;
          b.setAttribute("aria-selected","false");
          b.setAttribute("aria-checked","false");
          b.addEventListener("click", () => {
            try { if (!restoreEditorSelection || !restoreEditorSelection()) divEditor.focus(); } catch (_){}
            applyLineHeight(preset.value);
            closePopup();
          });
          node.appendChild(b);
          lhButtons.push(b);
        });
        // Keyboard navigation inside popup (ArrowUp/Down/Home/End, Enter/Space, Escape)
        node.addEventListener("keydown", (evt) => {
          if (!lhButtons || !lhButtons.length) return;
          const key = evt.key;
          const current = document.activeElement;
          const idx = lhButtons.indexOf(current);
          const focusAt = (i) => { if (lhButtons[i]) { lhButtons[i].focus(); evt.preventDefault(); } };
          if (key === "ArrowDown") { focusAt((idx >= 0 ? idx + 1 : 0) % lhButtons.length); }
          else if (key === "ArrowUp") { focusAt(idx > 0 ? idx - 1 : lhButtons.length - 1); }
          else if (key === "Home") { focusAt(0); }
          else if (key === "End") { focusAt(lhButtons.length - 1); }
          else if (key === "Enter" || key === " ") { if (idx >= 0) { lhButtons[idx].click(); evt.preventDefault(); } }
          else if (key === "Escape") { closePopup(); try { if (btnLhIcon && btnLhIcon.focus) btnLhIcon.focus(); } catch(_){} }
        });
        return node;
      }

      function openPopup(anchor) {
        closePopup();
        try { saveEditorSelection && saveEditorSelection(); } catch (_){}
        const popup = ensurePopup();
        anchorForFocus = anchor;
 
        // Highlight current active line-height in menu (中文解释: 打开时同步当前行高高亮)
        let activeValue = "";
        try {
          if (typeof lineHeightSelect !== "undefined" && lineHeightSelect && lineHeightSelect.value) {
            activeValue = lineHeightSelect.value;
          } else {
            const sel = window.getSelection && window.getSelection();
            if (sel && sel.anchorNode) {
              let n = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
              const block = n ? n.closest("p,h1,h2,h3") : null;
              if (block && isNodeInside(block, divEditor)) {
                const cs = window.getComputedStyle ? window.getComputedStyle(block) : null;
                const lh = cs ? cs.lineHeight : "";
                const lhNum = parseFloat(lh);
                const fontSize = cs ? parseFloat(cs.fontSize) : 16;
                if (lhNum && fontSize && /px\s*$/i.test(lh)) {
                  const relativeLh = (lhNum / fontSize).toFixed(2);
                  for (const preset of LINE_HEIGHT_PRESETS) {
                    if (Math.abs(parseFloat(preset.value) - relativeLh) < 0.05) { activeValue = preset.value; break; }
                  }
                }
              }
            }
          }
        } catch(_){}

        lhButtons.forEach(btn=>{
          const on = btn.dataset.lhValue === activeValue;
          btn.setAttribute("data-active", on ? "true" : "false");
          btn.setAttribute("aria-selected", on ? "true" : "false");
          btn.setAttribute("aria-checked", on ? "true" : "false");
        });

        toolbar.appendChild(popup);
        popup.setAttribute("data-open","true");
        requestAnimationFrame(() => {
          positionToolbarPopup(anchor, popup);
          const activeBtn = lhButtons.find(b => b.getAttribute("data-active") === "true") || lhButtons[0];
          if (activeBtn && activeBtn.focus) activeBtn.focus();
        });
        outsideHandler = (evt) => {
          if (!popup.contains(evt.target) && (!anchor || !anchor.contains(evt.target))) {
            closePopup();
          }
        };
        document.addEventListener("mousedown", outsideHandler, true);
      }

      function closePopup() {
        // Always return focus back to trigger button (中文解释: 关闭后把焦点还给触发按钮)
        if (!node) {
          try { if (anchorForFocus && anchorForFocus.focus) anchorForFocus.focus(); } catch (_){}
          anchorForFocus = null;
          return;
        }
        node.removeAttribute("data-open");
        if (node.parentNode) node.parentNode.removeChild(node);
        if (outsideHandler) {
          document.removeEventListener("mousedown", outsideHandler, true);
          outsideHandler = null;
        }
        try { if (anchorForFocus && anchorForFocus.focus) anchorForFocus.focus(); } catch (_){}
        anchorForFocus = null;
      }
      return { open: openPopup, close: closePopup };
    })();

    const btnLhIcon = addBtn(ICON_LINE_HEIGHT, "Line height", () => lineHeightMenu.open(btnLhIcon), layoutStructureSection, "weditor-btn--icon");

    // ---------- New Image Insert Popup System ----------
    const imageInsertMenu = (() => {
      let node = null;
      let outsideHandler = null;
      let activeTab = "url";
      let urlInput = null;
      let fileInput = null;
      let previewImg = null;
      let anchorForFocus = null;

      function fileToBase64(file) {
        return new Promise((resolve, reject) => {
          if (!file || !file.type.startsWith("image/")) {
            reject(new Error("Please select a valid image file"));
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      }

      function isValidImageUrl(url) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      }

      function insertImageToEditor(imageData) {
        try {
          if (!restoreEditorSelection || !restoreEditorSelection()) {
            divEditor.focus();
            moveCaretToEnd(divEditor);
          }
          exec("insertImage", imageData);
          closePopup();
        } catch (error) {
          alert("Image insert failed: " + error.message);
        }
      }

      function ensurePopup() {
        if (node) return node;
        
        const tabButtons = el("div", { class: "weditor-menu-tabs" }, [
          el("button", { type: "button", class: "weditor-tab-btn", "data-tab": "url" }, ["URL"]),
          el("button", { type: "button", class: "weditor-tab-btn", "data-tab": "file" }, ["Upload"])
        ]);
        
        const urlTab = el("div", { class: "weditor-tab-content", "data-tab": "url" }, [
          el("label", null, [ "Image URL",
            urlInput = el("input", { type: "url", placeholder: "https://example.com/image.jpg", class: "weditor-input" })
          ])
        ]);
        
        const fileTab = el("div", { class: "weditor-tab-content", "data-tab": "file" }, [
          el("div", { class: "weditor-file-input-area" }, [
            fileInput = el("input", { type: "file", accept: "image/*", class: "weditor-file-input", style: { display: "none" } }),
            el("button", { type: "button", class: "weditor-file-btn" }, ["Select Image"]),
            previewImg = el("img", { class: "weditor-preview-img", style: { display: "none" } })
          ])
        ]);
        
        const actions = el("div", { class: "weditor-menu-actions" }, [
          el("button", { type: "button", "data-action": "cancel" }, ["Cancel"]),
          el("button", { type: "button", "data-action": "insert" }, ["Insert"])
        ]);
        
        node = el("div", { class: "weditor-menu-popup" }, [ tabButtons, urlTab, fileTab, actions ]);
        
        setupPopupInteractions();
        return node;
      }

      function setupPopupInteractions() {
        const tabs = $$(".weditor-tab-btn", node);
        const contents = $$(".weditor-tab-content", node);
        const fileSelectBtn = node.querySelector(".weditor-file-btn");

        function switchTab(tabName) {
          activeTab = tabName;
          tabs.forEach(t => t.setAttribute("data-active", t.dataset.tab === tabName ? "true" : "false"));
          contents.forEach(c => c.style.display = c.dataset.tab === tabName ? "" : "none");
          if (tabName === "url" && urlInput) urlInput.focus();
        }

        tabs.forEach(tab => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
        if (fileSelectBtn) fileSelectBtn.addEventListener("click", () => fileInput.click());

        if (fileInput) {
          fileInput.addEventListener("change", async () => {
            const file = fileInput.files[0];
            if (file) {
              try {
                previewImg.src = await fileToBase64(file);
                previewImg.style.display = "block";
              } catch (err) {
                alert(err.message);
                previewImg.style.display = "none";
              }
            }
          });
        }
        
        node.addEventListener("click", async (e) => {
          const action = e.target.dataset.action;
          if (action === "cancel") closePopup();
          else if (action === "insert") {
            if (activeTab === "url") {
              const url = urlInput.value.trim();
              if (isValidImageUrl(url)) insertImageToEditor(url);
              else { alert("Please enter a valid image URL."); urlInput.focus(); }
            } else if (activeTab === "file") {
              if (previewImg.src && previewImg.src.startsWith("data:image")) {
                insertImageToEditor(previewImg.src);
              } else {
                alert("Please select an image file first.");
              }
            }
          }
        });
        switchTab("url");
      }

      function openPopup(anchor) {
        closePopup();
        saveEditorSelection();
        const popup = ensurePopup();
        anchorForFocus = anchor;
        toolbar.appendChild(popup);
        popup.setAttribute("data-open", "true");
        requestAnimationFrame(() => {
          positionToolbarPopup(anchor, popup);
          if (urlInput) urlInput.focus();
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
        if (anchorForFocus) anchorForFocus.focus();
        anchorForFocus = null;
      }

      return { open: openPopup, close: closePopup };
    })();
    

    // Toggle enable/disable for WYSIWYG-only controls (中文解释: 根据模式启用/禁用三个下拉)
    function setWYSIWYGEnabled(enabled){
      try{
        sizeSelect.disabled  = !enabled;
        styleSelect.disabled = !enabled;
        fontSelect.disabled  = !enabled;
        lineHeightSelect.disabled = !enabled;
        // Guarded to avoid ReferenceError before declaration (中文解释: 使用 typeof 防止未声明错误)
        if (typeof btnLhIcon !== "undefined" && btnLhIcon) btnLhIcon.disabled = !enabled;
      }catch(_){}
    }
    // Initialize once based on current mode
    setWYSIWYGEnabled(!showingSource);
    // Step 2a: Add minimal Text Color tool (native color picker) (中文解释: 使用浏览器自带颜色选择器)
    const inputTextColor = el("input", { type: "color", style: { display: "none" } });
    wrap.appendChild(inputTextColor);
    const btnTextColor = addBtn("A","Text color", ()=>{
      try { saveEditorSelection && saveEditorSelection(); } catch(_) {}
      inputTextColor.click();
    }, textInlineSection);
    inputTextColor.addEventListener("input", ()=>{
      try { if (!restoreEditorSelection || !restoreEditorSelection()) divEditor.focus(); } catch(_) {}
      const value = inputTextColor.value;
      const applied = applyBlockStyleToSelection("color", value, { multiOnly: true });
      if (!applied) {
        exec("foreColor", value);
      }
    });

    // Step 2b: Background/Highlight color picker (minimal, with selection restore)
    // (中文解释: 背景高亮颜色；选择颜色前后保持光标/选区)
    const inputBgColor = el("input", { type: "color", style: { display: "none" } });
    wrap.appendChild(inputBgColor);
    const btnBgColor = addBtn("Bg","Highlight color", ()=>{
      try { saveEditorSelection && saveEditorSelection(); } catch(_) {}
      inputBgColor.click();
    }, textInlineSection);
    inputBgColor.addEventListener("input", ()=>{
      try { if (!restoreEditorSelection || !restoreEditorSelection()) divEditor.focus(); } catch(_) {}
      const value = inputBgColor.value;
      const applied = applyBlockStyleToSelection("background-color", value, { multiOnly: true });
      if (applied) return;
      try {
        exec("hiliteColor", value);
      } catch(_){
        // Fallback for older engines (中文解释: 旧浏览器后备)
        exec("backColor", value);
      }
    });
    const btnBold = addBtn("B","Bold (Ctrl/Cmd+B)", ()=>exec("bold"), textInlineSection);
    const btnItalic = addBtn("I","Italic (Ctrl/Cmd+I)", ()=>exec("italic"), textInlineSection);
    const btnUnderline = addBtn("U","Underline (Ctrl/Cmd+U)", ()=>exec("underline"), textInlineSection);
    btnBold.classList.add("weditor-btn-bold");
    btnItalic.classList.add("weditor-btn-italic");
    btnUnderline.classList.add("weditor-btn-underline");
    /* moved Clear Formatting to More group (secondary row) */
    
    const btnH1 = null;
    const btnH2 = null;
    const btnH3 = null;
    const btnP  = null;
    
    const btnUL = addBtn("*","Bulleted list", ()=>exec("insertUnorderedList"), layoutAlignmentSection);
    const btnOL = addBtn("1.","Numbered list", ()=>exec("insertOrderedList"), layoutAlignmentSection);
    
    // Balanced SVG Icons for alignment (24x24, 4u padding, non-scaling stroke)
    const ICON_ALIGN_L = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="4" y1="6" x2="20" y2="6" vector-effect="non-scaling-stroke"></line><line x1="4" x2="20" vector-effect="non-scaling-stroke" y1="16" y2="16"></line><line x1="4" x2="14" vector-effect="non-scaling-stroke" y2="11" y1="11"></line><line x1="4" x2="14" vector-effect="non-scaling-stroke" y1="21" y2="21"></line></svg>`;
    const ICON_ALIGN_C = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="4" y1="6" x2="20" y2="6" vector-effect="non-scaling-stroke"></line><line x1="4" x2="20" vector-effect="non-scaling-stroke" y2="16" y1="16"></line><line x1="7" x2="17" vector-effect="non-scaling-stroke" y1="11" y2="11"></line><line x1="7" x2="17" vector-effect="non-scaling-stroke" y2="21" y1="21"></line></svg>`;
    const ICON_ALIGN_R = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="4" y1="6" x2="20" y2="6" vector-effect="non-scaling-stroke"></line><line x1="4" x2="20" vector-effect="non-scaling-stroke" y2="16" y1="16"></line><line x1="10" x2="20" vector-effect="non-scaling-stroke" y1="11" y2="11"></line><line x1="10" x2="20" vector-effect="non-scaling-stroke" y2="21" y1="21"></line></svg>`;
 
    const btnAlignL = addBtn(ICON_ALIGN_L,"Align left", ()=>{
      if (!applyTextAlignment("left")) {
        exec("justifyLeft");
      } else {
        try { updateToggleStates && updateToggleStates(); } catch(_){}
      }
    }, layoutAlignmentSection, "weditor-btn--icon");
    const btnAlignC = addBtn(ICON_ALIGN_C,"Center", ()=>{
      if (!applyTextAlignment("center")) {
        exec("justifyCenter");
      } else {
        try { updateToggleStates && updateToggleStates(); } catch(_){}
      }
    }, layoutAlignmentSection, "weditor-btn--icon");
    const btnAlignR = addBtn(ICON_ALIGN_R,"Align right", ()=>{
      if (!applyTextAlignment("right")) {
        exec("justifyRight");
      } else {
        try { updateToggleStates && updateToggleStates(); } catch(_){}
      }
    }, layoutAlignmentSection, "weditor-btn--icon");

    const insertLinkSection = createPanelSection(groupInsert.inner, "Links");
    const insertMediaSection = createPanelSection(groupInsert.inner, "Media");
    const insertPageSection = createPanelSection(groupInsert.inner, "Document");
    const insertTableSection = createPanelSection(groupInsert.inner, "Tables");

    const btnLink = addBtn("Insert Link","Insert link (Ctrl/Cmd+K)", ()=>{
      // 1) If caret is already inside a link, treat as "Edit link"
      try {
        const sel0 = window.getSelection && window.getSelection();
        const node0 = sel0 && sel0.anchorNode ? (sel0.anchorNode.nodeType===1 ? sel0.anchorNode : sel0.anchorNode.parentElement) : null;
        const a0 = node0 && node0.closest ? node0.closest("a") : null;
        if (a0 && isNodeInside(a0, divEditor)) {
          const cur = a0.getAttribute("href") || "https://";
          const next = prompt("Edit link URL:", cur);
          if (!next) return;
          if (!isHttpUrl(next)) { alert("Only http(s) URL allowed"); return; }
          a0.setAttribute("href", next);
          a0.setAttribute("target","_blank");
          a0.setAttribute("rel","noopener noreferrer");
          divEditor.dispatchEvent(new Event("input",{bubbles:true}));
          return;
        }
      } catch(_){}
      // 2) Must have a non-collapsed selection to create a new link
      try {
        const sel1 = window.getSelection && window.getSelection();
        if (!sel1 || !sel1.rangeCount) return;
        const range = sel1.getRangeAt(0);
        if (range.collapsed) {
          alert("Select text to link first.");
          return;
        }
      } catch(_){}
      // 3) Create a new link for the selected text
      const u = prompt("Link URL:");
      if (!u) return;
      if (!isHttpUrl(u)) { alert("Only http(s) URL allowed"); return; }
      exec("createLink", u);
      const sel2 = window.getSelection();
      if (sel2 && sel2.anchorNode) {
        let a2 = sel2.anchorNode.nodeType===1? sel2.anchorNode : sel2.anchorNode.parentElement;
        if (a2 && a2.tagName === "A") {
          a2.setAttribute("target","_blank");
          a2.setAttribute("rel","noopener noreferrer");
        }
      }
    }, insertLinkSection);
    // Step 1: Add Unlink button (remove link only, keep other formatting)
    // (中文解释: 仅移除超链接，不清除其他文字样式)
    const btnUnlink = addBtn("Remove Link","Remove link (Ctrl/Cmd+Shift+K)", ()=>{
      // Try native unlink first
      exec("unlink");
      // Fallback: if still inside an <a>, unwrap it
      try {
        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          let n = sel.anchorNode.nodeType===1 ? sel.anchorNode : sel.anchorNode.parentElement;
          const a = n && n.closest ? n.closest("a") : null;
          if (a && a.parentNode) {
            const frag = document.createDocumentFragment();
            while (a.firstChild) frag.appendChild(a.firstChild);
            a.parentNode.replaceChild(frag, a);
            divEditor.dispatchEvent(new Event("input",{bubbles:true}));
          }
        }
      } catch(_){}
    }, insertLinkSection);
    // Step 2: Add EditLink button (edit only the current anchor's href)
    // (中文解释: 编辑当前光标所在链接的地址，保留其它文本样式)
    const btnEditLink = addBtn("Edit Link","Edit link", ()=>{
      try{
        const sel = window.getSelection && window.getSelection();
        const n = sel && sel.anchorNode ? (sel.anchorNode.nodeType===1 ? sel.anchorNode : sel.anchorNode.parentElement) : null;
        const a = n && n.closest ? n.closest("a") : null;
        if (!a){
          alert("Place caret inside a link to edit.");
          return;
        }
        const cur = a.getAttribute("href") || "https://";
        const next = prompt("Edit link URL:", cur);
        if (!next) return;
        if (!isHttpUrl(next)) { alert("Only http(s) URL allowed"); return; }
        a.setAttribute("href", next);
        a.setAttribute("target","_blank");
        a.setAttribute("rel","noopener noreferrer");
        divEditor.dispatchEvent(new Event("input",{bubbles:true}));
      }catch(_){}
    }, insertLinkSection);

    const btnInsertImage = addBtn("Insert Image", "Insert image", (e) => {
      imageInsertMenu.open(e.currentTarget);
    }, insertMediaSection);
    addBtn("Divider","Insert divider", ()=>exec("insertHorizontalRule"), insertMediaSection);
    addBtn("Page Break", "Insert page break", () => {
      if (typeof divEditor.focus === "function") {
        try {
          divEditor.focus({ preventScroll: true });
        } catch (_err) {
          divEditor.focus();
        }
      }
      if (selectedPageBreak) {
        removeSelectedPageBreak();
        return;
      }
      // Remove any existing page breaks to ensure only one exists
      // divEditor.querySelectorAll(".weditor-page-break").forEach(pb => pb.remove());

      const pageBreakNode = el("div", {
        class: "weditor-page-break"
      });
      bindPageBreakNode(pageBreakNode);
 
      const sel = window.getSelection();
      let caretRange = null;
      if (sel && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        const insertionRange = range.cloneRange();
        insertionRange.collapse(false);

        let nodeToInsertAfter = insertionRange.startContainer;
        if (nodeToInsertAfter === divEditor) {
          const idx = Math.max(0, insertionRange.startOffset - 1);
          let fallbackNode = divEditor.childNodes[idx] || divEditor.lastChild;
          if (fallbackNode && fallbackNode.nodeType === Node.TEXT_NODE) {
            fallbackNode = fallbackNode.parentNode;
          }
          nodeToInsertAfter = fallbackNode || divEditor.lastElementChild || divEditor;
        }

        if (nodeToInsertAfter && nodeToInsertAfter.nodeType !== Node.ELEMENT_NODE) {
          nodeToInsertAfter = nodeToInsertAfter.parentNode;
        }
        
        // Traverse up to find the top-level block element within the editor
        while (nodeToInsertAfter && nodeToInsertAfter.parentNode !== divEditor && nodeToInsertAfter.parentNode !== document.body) {
          nodeToInsertAfter = nodeToInsertAfter.parentNode;
        }

        // Insert after the found block element
        if (nodeToInsertAfter && nodeToInsertAfter.parentNode === divEditor) {
          nodeToInsertAfter.parentNode.insertBefore(pageBreakNode, nodeToInsertAfter.nextSibling);
        } else {
          divEditor.appendChild(pageBreakNode);
        }

        // Place caret after the inserted page break
        caretRange = document.createRange();
        caretRange.setStartAfter(pageBreakNode);
        caretRange.collapse(true);

      } else {
        divEditor.appendChild(pageBreakNode);
        caretRange = document.createRange();
        caretRange.setStartAfter(pageBreakNode);
        caretRange.collapse(true);
      }

      selectPageBreak(pageBreakNode);
      suppressNextPageBreakClear = true;

      const freshSel = window.getSelection();
      if (caretRange && freshSel) {
        freshSel.removeAllRanges();
        freshSel.addRange(caretRange);
      }

      if (typeof pageBreakNode.scrollIntoView === "function") {
        try {
          pageBreakNode.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } catch (_err) {
          pageBreakNode.scrollIntoView();
        }
      }
      
      divEditor.dispatchEvent(new Event("input", { bubbles: true }));
    }, insertPageSection);
    // Layout extras
    addBtn("Clear","Clear formatting", ()=>exec("removeFormat"), layoutUtilitiesSection);
    // Create top-right Exit Fullscreen button (only visible in fullscreen via CSS)
    btnFsExit = el("button", {
      type: "button",
      title: "Exit Fullscreen",
      "aria-label": "Exit Fullscreen",
      class: "weditor-fs-exit"
    }, ["X"]);
    btnFsExit.addEventListener("click", ()=>{ if (isFullScreen) toggleFullScreen(); });
    wrap.appendChild(btnFsExit);
    
    let tablePanelManualOpen = false;
    let tablePanelManualClosed = false;
    let tablePanelPendingReveal = false;
    const tablePanelDomId = "weditor-table-panel-" + Math.random().toString(36).slice(2,9);
    groupTableTools.group.id = tablePanelDomId;
    if (groupTableTools.trigger){
      groupTableTools.trigger.setAttribute("aria-controls", tablePanelDomId);
      groupTableTools.trigger.addEventListener("click", (ev)=>{
        const triggerBtn = ev.currentTarget;
        const currentlyActive = triggerBtn.getAttribute("data-active") === "true";
        const willOpen = !currentlyActive;
        tablePanelManualOpen = willOpen;
        tablePanelManualClosed = !willOpen;
        if (!willOpen) {
          tablePanelPendingReveal = false;
        }
        groupTableTools.trigger.removeAttribute("data-indicator");
      }, true);
    }
    function createTableSubgroup(labelText, infoText) {
      const wrapper = el("div", { class: "weditor-table-subgroup" });
      if (labelText) {
        const labelKids = [labelText];
        if (infoText) {
          labelKids.push(el("span", {
            class: "weditor-table-subgroup-info",
            title: infoText,
            role: "note",
            "aria-label": infoText
          }, ["?"]));
        }
        wrapper.appendChild(el("span", { class: "weditor-table-subgroup-label" }, labelKids));
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
      try {
        const trigger = groupTableTools.trigger;
        const panelId = groupTableTools.id;
        const hasAnyTable = !!divEditor.querySelector("table");

        if (!hasAnyTable) {
          tablePanelPendingReveal = false;
          if (!tablePanelManualOpen) {
            closePanel(panelId);
            trigger && trigger.removeAttribute("data-indicator");
          }
          tablePanelManualClosed = false;
          return;
        }

        if (tablePanelManualOpen) {
          openPanel(panelId, { skipFocus: true });
          trigger && trigger.removeAttribute("data-indicator");
          return;
        }

        if (tablePanelManualClosed) {
          closePanel(panelId);
          trigger && trigger.removeAttribute("data-indicator");
          return;
        }

        const ctx = getTableContext();
        const caretInsideTable = !!(ctx && ctx.table);

        if (tablePanelPendingReveal && hasAnyTable) {
          tablePanelPendingReveal = false;
          openPanel(panelId);
          trigger && trigger.removeAttribute("data-indicator");
          return;
        }

        if (caretInsideTable) {
          openPanel(panelId, { skipFocus: true });
          trigger && trigger.removeAttribute("data-indicator");
          return;
        }

        trigger && trigger.setAttribute("data-indicator","true");
        if (!tablePanelManualOpen && !caretInsideTable && activePanelId === panelId) {
          closePanel(panelId);
        }
      } catch (err) {
        closePanel(groupTableTools.id);
        if (groupTableTools.trigger) {
          groupTableTools.trigger.removeAttribute("data-indicator");
        }
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

        // reflect font size to selector (中文解释: 将选区字号回显到下拉框)
        if (typeof sizeSelect !== "undefined" && sizeSelect) {
          try {
            const fsValue = resolveCurrentFontSizeValue && resolveCurrentFontSizeValue();
            if (fsValue && sizeSelect.value !== fsValue) {
              sizeSelect.value = fsValue;
            }
          } catch(_){}
        }
        // reflect font family to selector (中文解释: 将选区字体回显到字体下拉)
        try {
          if (typeof fontSelect !== "undefined" && fontSelect) {
            const ffMatch = resolveCurrentFontFromSelection && resolveCurrentFontFromSelection();
            if (ffMatch && fontSelect.value !== ffMatch) {
              fontSelect.value = ffMatch;
            }
          }
        } catch(_){}
        // reflect block format to styleSelect (p/h1/h2/h3)
        try {
          if (typeof styleSelect !== "undefined" && styleSelect) {
            let fbRaw = document.queryCommandValue("formatBlock");
            let tag = String(fbRaw || "").replace(/[<><>]/g,"").toLowerCase();
            if (!tag) {
              const sel = window.getSelection && window.getSelection();
              if (sel && sel.anchorNode) {
                let n = sel.anchorNode.nodeType===1 ? sel.anchorNode : sel.anchorNode.parentElement;
                while (n && n !== divEditor && (!n.tagName || !/^(p|h1|h2|h3)$/i.test(n.tagName))) {
                  n = n.parentElement;
                }
                if (n && n !== divEditor && n.tagName) tag = n.tagName.toLowerCase();
              }
            }
            if (["p","h1","h2","h3"].includes(tag)) {
              // Choose 'noSpacing' when current paragraph has .weditor-nospace (中文解释: P 段落无间距样式)
              let chosen = tag;
              if (tag === "p") {
                const sel2 = window.getSelection && window.getSelection();
                if (sel2 && sel2.anchorNode){
                  let m = sel2.anchorNode.nodeType===1 ? sel2.anchorNode : sel2.anchorNode.parentElement;
                  const p2 = m && m.closest ? m.closest("p") : null;
                  if (p2 && isNodeInside(p2, divEditor) && p2.classList.contains("weditor-nospace")) {
                    chosen = "noSpacing";
                  }
                }
              }
              if (styleSelect.value !== chosen) styleSelect.value = chosen;
              // reflect active state to H1/H2/H3/P buttons (中文解释: 同步激活态)
              setToggleState(btnP,  tag === "p");
              setToggleState(btnH1, tag === "h1");
              setToggleState(btnH2, tag === "h2");
              setToggleState(btnH3, tag === "h3");
            }
          }
        } catch(_){}

        // reflect line height to selector
        try {
          if (typeof lineHeightSelect !== "undefined" && lineHeightSelect) {
            const sel = window.getSelection && window.getSelection();
            if (sel && sel.anchorNode) {
              let n = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement;
              const block = n ? n.closest("p,h1,h2,h3") : null;
              if (block && isNodeInside(block, divEditor)) {
                const cs = window.getComputedStyle ? window.getComputedStyle(block) : null;
                const lh = cs ? cs.lineHeight : "";
                const lhNum = parseFloat(lh);
                const fontSize = cs ? parseFloat(cs.fontSize) : 16;
                if (lhNum && fontSize && lh.endsWith("px")) {
                  const relativeLh = (lhNum / fontSize).toFixed(2);
                  let bestMatch = "";
                  for (const preset of LINE_HEIGHT_PRESETS) {
                    if (Math.abs(parseFloat(preset.value) - relativeLh) < 0.05) {
                      bestMatch = preset.value;
                      break;
                    }
                  }
                  if (lineHeightSelect.value !== bestMatch) {
                    lineHeightSelect.value = bestMatch;
                  }
                }
              }
            }
          }
        } catch (_) {}

        // Link-related toggle: active when caret is within an anchor
        try {
          let insideLink = false;
          const sel2 = window.getSelection && window.getSelection();
          if (sel2 && sel2.anchorNode){
            let n2 = sel2.anchorNode.nodeType===1 ? sel2.anchorNode : sel2.anchorNode.parentElement;
            const a2 = n2 && n2.closest ? n2.closest("a") : null;
            insideLink = !!(a2 && isNodeInside(a2, divEditor));
          }
          setToggleState(btnUnlink, insideLink);
          setToggleState(btnEditLink, insideLink);
        } catch(_){}

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
    updateToggleStates();

    updateUndoRedoButtons();

    // Keyboard shortcuts
    divEditor.addEventListener("keydown",(e)=>{
      const mod = e.ctrlKey || e.metaKey;
      if (e.key === "Tab" && !mod) {
        const sel = window.getSelection?.();
        const anchor = sel && sel.anchorNode;
        if (anchor && isNodeInside(anchor, divEditor)) {
          e.preventDefault();
          exec(e.shiftKey ? "outdent" : "indent");
          divEditor.dispatchEvent(new Event("input", { bubbles: true }));
        }
        return;
      }
      if (selectedPageBreak && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
        removeSelectedPageBreak();
        return;
      }
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey){
        e.preventDefault();
        history.undo();
      } else if (k === "y" || (k === "z" && e.shiftKey)){
        e.preventDefault();
        history.redo();
      } else if (k === "f" && e.shiftKey){
        // Ctrl+Shift+F: 快速切换字体大小 (中文解释: 快速字体大小切换)
        e.preventDefault();
        if (sizeSelect) {
          const currentIndex = sizeSelect.selectedIndex;
          const nextIndex = (currentIndex + 1) % FONT_SIZE_PRESETS.length;
          sizeSelect.selectedIndex = nextIndex;
          sizeSelect.dispatchEvent(new Event("change"));
        }
      } else if (k === "k"){
        // Ctrl/Cmd+K: create link; Ctrl/Cmd+Shift+K: unlink (中文解释: 链接快捷键)
        e.preventDefault();
        try {
          if (e.shiftKey) {
            if (btnUnlink && btnUnlink.click) btnUnlink.click();
          } else {
            if (btnLink && btnLink.click) btnLink.click();
          }
        } catch(_){}
      } else if (e.altKey){
        // Word-like heading shortcuts (中文解释: 快捷键与 Word 类似)
        if (k === "1"){ e.preventDefault(); exec("formatBlock","<h1>"); }
        else if (k === "2"){ e.preventDefault(); exec("formatBlock","<h2>"); }
        else if (k === "3"){ e.preventDefault(); exec("formatBlock","<h3>"); }
        else if (k === "0"){ e.preventDefault(); exec("formatBlock","<p>"); }
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

    // Setup image resize functionality for this editor instance
    imageSelectionAndResize.setup(divEditor, wrap);

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
    pair.addEventListener("change", () => setEditorHTMLFromTextarea(pair.value));
    pair.addEventListener("input", () => setEditorHTMLFromTextarea(pair.value));
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
    function normalizeTable(table, opts = {}) {
      const { enforceEqualColWidths = true } = opts;
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
        const pct = enforceEqualColWidths ? (100/colCount).toFixed(3) + "%" : "";
        for (let i=0;i<colCount;i++){
          const c = document.createElement("col");
          if (pct) c.style.width = pct;
          cg.appendChild(c);
        }
        table.insertBefore(cg, table.tBodies[0] || table.firstChild);
      } else if (cg) {
        const cols = Array.from(cg.children);
        if (cols.length < colCount) {
          const pct = enforceEqualColWidths ? (100/colCount).toFixed(3) + "%" : "";
          for (let i=cols.length;i<colCount;i++) {
            const col = document.createElement("col");
            if (pct) col.style.width = pct;
            cg.appendChild(col);
          }
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
    function distributeColumns(targetTable) {
      const ctx = targetTable ? { table: targetTable } : getTableContext();
      if (!ctx) return;
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

    function cellHasMeaningfulContent(cell) {
      if (!cell) return false;
      const text = cell.textContent ? cell.textContent.replace(/\u00A0/g, "").trim() : "";
      if (text.length > 0) return true;
      return Boolean(cell.querySelector && cell.querySelector("img,table,iframe,video,svg,canvas"));
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

      const contentParts = [];
      cellsToMerge.forEach(cell => {
        if (cellHasMeaningfulContent(cell)) {
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

    function mergeSelectedCellsVertically() {
      const cellsToMerge = cellSelectionState.selectedCells;
      tableDebug("mergeSelectedCellsVertically invoked", { count: cellsToMerge.length });

      if (cellsToMerge.length <= 1) {
        alert("Please select two or more cells to merge.");
        return;
      }

      const table = cellsToMerge[0].closest("table");
      if (!table) return;

      if (cellsToMerge.some(cell => cell.closest("table") !== table)) {
        alert("Please select cells within a single column to merge.");
        return;
      }

      if (cellsToMerge.some(cell => (parseInt(cell.getAttribute("colspan") || "1", 10) || 1) > 1)) {
        alert("Merging cells that span multiple columns is not supported yet.");
        return;
      }

      normalizeTable(table);
      const tableMap = buildTableMap(table);
      const cellsWithCoords = [];
      for (const cell of cellsToMerge) {
        const coords = getCellCoords(tableMap, cell);
        if (!coords) {
          alert("Unable to determine cell positions for merge.");
          return;
        }
        cellsWithCoords.push({ cell, coords });
      }

      cellsWithCoords.sort((a, b) => a.coords.r - b.coords.r);
      const columnIndex = cellsWithCoords[0].coords.c;
      if (cellsWithCoords.some(item => item.coords.c !== columnIndex)) {
        alert("Please select cells within a single column to merge.");
        return;
      }

      const selectedSet = new Set(cellsToMerge);
      const topRow = cellsWithCoords[0].coords.r;
      const bottomRow = cellsWithCoords[cellsWithCoords.length - 1].coords.r;
      for (let r = topRow; r <= bottomRow; r++) {
        const occupant = tableMap[r] && tableMap[r][columnIndex];
        if (!occupant || !selectedSet.has(occupant)) {
          alert("Selected cells must form a continuous column.");
          return;
        }
      }

      const primary = cellsWithCoords[0].cell;
      const combinedRowspan = cellsWithCoords.reduce((sum, item) => {
        return sum + Math.max(1, parseInt(item.cell.getAttribute("rowspan") || "1", 10));
      }, 0);

      const originalPrimaryContent = primary.innerHTML;
      const extraParts = [];
      for (let i = 1; i < cellsWithCoords.length; i++) {
        const currentCell = cellsWithCoords[i].cell;
        if (cellHasMeaningfulContent(currentCell)) {
          extraParts.push(currentCell.innerHTML);
        }
        currentCell.remove();
      }

      if (combinedRowspan > 1) primary.setAttribute("rowspan", combinedRowspan);
      else primary.removeAttribute("rowspan");

      if (extraParts.length) {
        if (cellHasMeaningfulContent(primary)) {
          const parts = [originalPrimaryContent, ...extraParts].filter(Boolean);
          primary.innerHTML = parts.join("<br>");
        } else {
          primary.innerHTML = extraParts.join("<br>");
        }
      } else if (!cellHasMeaningfulContent(primary)) {
        primary.innerHTML = "&nbsp;";
      }

      placeCaretInside(primary);
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
      const gap = 6; // vertical gap below trigger (中文解释: 与按钮的垂直间距)
      const top = Math.round(buttonRect.bottom - toolbarRect.top + gap);
      popup.style.left = left + "px";
      popup.style.top = top + "px";
      popup.style.position = "absolute";
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
          tablePanelPendingReveal = true;
          insertTableAtCaret(divEditor, rows, cols);
          saveEditorSelection();
          updateTableToolsVisibility();
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
      normalizeTable(table, { enforceEqualColWidths: false });
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
      if (!e.target.closest(".weditor-page-break")) {
        selectPageBreak(null);
      }
      const cell = resolveCellForPoint(e.target, e.clientX, e.clientY);
      if (cell && isNodeInside(cell, divEditor)) {
        const idx = getColIndexFromHit(cell, e.clientX);
        const table = cell.closest("table");
        if (idx >= 0 && (!tableResizeHover || tableResizeHover.table !== table || tableResizeHover.delta < 0)) {
          if (e.button !== 0) {
            return;
          }
          normalizeTable(table, { enforceEqualColWidths: false });
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

    divEditor.addEventListener("dblclick", (e)=>{
      const cell = resolveCellForPoint(e.target, e.clientX, e.clientY);
      if (cell && isNodeInside(cell, divEditor)) {
        const table = cell.closest("table");
        if (table) {
          const idx = getColIndexFromHit(cell, e.clientX);
          if (idx >= 0) {
            e.preventDefault();
            e.stopPropagation();
            distributeColumns(table);
            return;
          }
        }
      }
      const edgeHit = getTableEdgeHover(e.clientX, e.clientY);
      if (edgeHit && edgeHit.table && isNodeInside(edgeHit.table, divEditor)) {
        e.preventDefault();
        e.stopPropagation();
        distributeColumns(edgeHit.table);
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
      normalizeTable(table, { enforceEqualColWidths: false });
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
      normalizeTable(table, { enforceEqualColWidths: false });
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
    const CELL_SELECTION_HIGHLIGHT = "rgb(189, 224, 254)";
    let cellSelectionState = {
      anchorCell: null,
      selectedCells: []
    };

    function markCellSelected(cell) {
      if (!cell || !cell.classList) return;
      if (!cell.classList.contains("weditor-cell-selected")) {
        cell.classList.add("weditor-cell-selected");
      }
      if (cell.dataset) cell.dataset.weditorSelectionHighlight = "1";
    }

    function unmarkCellSelected(cell) {
      if (!cell || !cell.classList) return;
      cell.classList.remove("weditor-cell-selected");
      if (cell.dataset && cell.dataset.weditorSelectionHighlight === "1") {
        if (cell.style && cell.style.getPropertyValue) {
          const current = (cell.style.getPropertyValue("background-color") || "").trim().toLowerCase();
          if (current === CELL_SELECTION_HIGHLIGHT || current === "#bde0fe") {
            cell.style.removeProperty("background-color");
            if (!cell.getAttribute("style")) cell.removeAttribute("style");
          }
        }
        delete cell.dataset.weditorSelectionHighlight;
      }
    }

    function clearCellSelection(opts = {}) {
      const { resetAnchor = true } = opts;
      if (cellSelectionState.selectedCells.length > 0) {
        cellSelectionState.selectedCells.forEach(unmarkCellSelected);
      }
      cellSelectionState.selectedCells = [];
      if (resetAnchor) cellSelectionState.anchorCell = null;
      tableDebug("Cell selection cleared");
    }

    function getSelectionSnapshot() {
      const sel = window.getSelection && window.getSelection();
      if (!sel || !sel.rangeCount) return [];
      const ranges = [];
      for (let i = 0; i < sel.rangeCount; i++) {
        try {
          ranges.push(sel.getRangeAt(i).cloneRange());
        } catch (_) {}
      }
      return ranges;
    }

    function restoreSelectionSnapshot(ranges) {
      const sel = window.getSelection && window.getSelection();
      if (!sel) return;
      sel.removeAllRanges();
      if (ranges && ranges.length) {
        ranges.forEach(range => {
          try { sel.addRange(range); } catch (_) {}
        });
      }
    }

    function forEachSelectedCellRange(applyFn) {
      const cells = cellSelectionState.selectedCells;
      if (!cells.length) return false;
      const sel = window.getSelection && window.getSelection();
      const snapshot = getSelectionSnapshot();
      let changed = false;
      cells.forEach((cell, index) => {
        if (!cell.isConnected) return;
        try {
          const range = document.createRange();
          range.selectNodeContents(cell);
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
          const res = applyFn(range, cell, index);
          if (res !== false) changed = true;
        } catch (err) {
          tableDebug("forEachSelectedCellRange error", err);
        }
      });
      restoreSelectionSnapshot(snapshot);
      return changed;
    }

    function applyCellSelection(newCells, anchorCell) {
      const unique = [];
      const seen = new Set();
      newCells.forEach(cell => {
        if (cell && cell.isConnected && !seen.has(cell)) {
          seen.add(cell);
          unique.push(cell);
        }
      });

      const prev = new Set(cellSelectionState.selectedCells);
      cellSelectionState.selectedCells.forEach(cell => {
        if (!seen.has(cell)) unmarkCellSelected(cell);
      });
      unique.forEach(markCellSelected);
      cellSelectionState.selectedCells = unique;
      if (anchorCell && anchorCell.isConnected) {
        cellSelectionState.anchorCell = anchorCell;
      }
      tableDebug("Cell selection updated", { count: unique.length });
    }

    function selectCellsRange(anchorCell, targetCell) {
      if (!anchorCell || !targetCell) return;
      if (!anchorCell.isConnected || !targetCell.isConnected) return;
      const table = anchorCell.closest("table");
      if (!table || table !== targetCell.closest("table")) return;

      const tableMap = buildTableMap(table);
      const startCoords = getCellCoords(tableMap, anchorCell);
      const endCoords = getCellCoords(tableMap, targetCell);
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
      applyCellSelection(newSelectedCells, anchorCell);
    }

    function toggleCellSelection(cell) {
      if (!cell || !cell.isConnected) return;
      const idx = cellSelectionState.selectedCells.indexOf(cell);
      if (idx >= 0) {
        unmarkCellSelected(cellSelectionState.selectedCells[idx]);
        cellSelectionState.selectedCells.splice(idx, 1);
      } else {
        cellSelectionState.selectedCells.push(cell);
        markCellSelected(cell);
      }
      if (!cellSelectionState.selectedCells.length) {
        cellSelectionState.anchorCell = null;
      }
      tableDebug("Cell toggle", { count: cellSelectionState.selectedCells.length });
    }

    function onCellPointerDown(e) {
      if (e.button !== 0 || colResizeState || rowResizeState || tableResizeState) return;

      const targetCell = e.target.closest("td,th");
      if (!targetCell || !isNodeInside(targetCell, divEditor)) {
        if (!e.target.closest("table")) {
          clearCellSelection();
        }
        return;
      }

      if (e.shiftKey) {
        e.preventDefault();
        divEditor.focus();
        const anchor = cellSelectionState.anchorCell && cellSelectionState.anchorCell.isConnected
          ? cellSelectionState.anchorCell
          : targetCell;
        selectCellsRange(anchor, targetCell);
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        divEditor.focus();
        toggleCellSelection(targetCell);
        if (!cellSelectionState.anchorCell) cellSelectionState.anchorCell = targetCell;
        return;
      }

      // Normal click: clear previous highlight but keep anchor for potential Shift+Click.
      if (cellSelectionState.selectedCells.length) {
        clearCellSelection({ resetAnchor: false });
      }
      cellSelectionState.anchorCell = targetCell;
    }

    divEditor.addEventListener("mousedown", onCellPointerDown);

    function handleCommandForSelectedCells(cmd, val) {
      const cells = cellSelectionState.selectedCells;
      if (!cells.length) return false;

      const SUPPORTED_COMMANDS = new Set([
        "bold", "italic", "underline", "strikeThrough",
        "foreColor", "hiliteColor", "backColor",
        "justifyLeft", "justifyCenter", "justifyRight", "justifyFull",
        "removeFormat", "fontName", "fontSize", "formatBlock"
      ]);
      if (!SUPPORTED_COMMANDS.has(cmd)) return false;

      const changed = forEachSelectedCellRange(() => {
        document.execCommand(cmd, false, val);
      });
      if (changed) {
        divEditor.dispatchEvent(new Event("input",{bubbles:true}));
        try { updateToggleStates && updateToggleStates(); } catch(_){}
      }
      return changed;
    }

    // ------ Table Buttons ------
    const btnTbl = addBtn("Insert Table","Insert table", (evt)=>{
      evt.preventDefault();
      insertTablePopup.open(evt.currentTarget || btnTbl);
    }, insertTableSection);
    addBtn("Table Tools","Open table tools panel", ()=>{
      tablePanelManualOpen = true;
      tablePanelManualClosed = false;
      tablePanelPendingReveal = false;
      if (groupTableTools.trigger){
        groupTableTools.trigger.removeAttribute("data-indicator");
      }
      openPanel(groupTableTools.id);
    }, insertTableSection);
    // Use normal styling (no .weditor-btn--primary) to keep dark text per design
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

    const tableCells = createTableSubgroup("Cells", "Shift+Click 选择多个单元格，Cmd/Ctrl+Click 切换选择");
    const btnMergeCells = addTableAction("Merge Cells →", null, "Merge selected cells in the current row (⌥M)", ()=>mergeSelectedCellsHorizontally(), tableCells);
    btnMergeCells.classList.add("weditor-btn--primary");
    addTableAction("Merge Cells ↓", null, "Merge selected cells in the current column (⇧⌥M)", ()=>mergeSelectedCellsVertically(), tableCells);

    const tableBorders = createTableSubgroup("Borders");
    const btnBorderStyle = addTableAction("Borders","Line & Color","Adjust table border width, style, and color (⌥B)", ()=>tableBorderPopup.open(btnBorderStyle), tableBorders);
    btnBorderStyle.classList.add("weditor-btn--primary");
    addTableAction("Hide Borders","No Lines","Remove all borders from this table (⇧⌥H)", ()=>hideTableBorders(), tableBorders);
    addTableAction("Reset Borders","Default","Reset border styling to default (⇧⌥R)", ()=>resetTableBorders(), tableBorders);
  }

  // ====================== Image Selection & Resize ======================
  const imageSelectionAndResize = (() => {
    let selectedImage = null;
    let resizeState = null;
    const MIN_SIZE = 20;
    const directions = ["nw", "ne", "sw", "se", "n", "s", "w", "e"];
    let handleContainer = null;

    function ensureHandleContainer(editorWrap) {
      if (handleContainer && editorWrap.contains(handleContainer)) return;
      handleContainer = el("div", { style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: 1002 } });
      editorWrap.appendChild(handleContainer);
    }

    function createResizeHandles(img) {
      if (!handleContainer) return;
      directions.forEach(dir => {
        const handle = el("div", { class: "weditor-img-resize-handle", "data-dir": dir, style: { pointerEvents: "auto" } });
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          startResize(e, img, dir);
        });
        handleContainer.appendChild(handle);
      });
      positionHandles(img);
    }

    function positionHandles(img) {
      if (!handleContainer) return;
      const handles = handleContainer.querySelectorAll(".weditor-img-resize-handle");
      const rect = img.getBoundingClientRect();
      const containerRect = handleContainer.getBoundingClientRect();
      const top = rect.top - containerRect.top;
      const left = rect.left - containerRect.left;
      const width = rect.width;
      const height = rect.height;

      handles.forEach(h => {
        const dir = h.dataset.dir;
        if (dir.includes("n")) h.style.top = (top - 5) + "px";
        if (dir.includes("s")) h.style.top = (top + height - 5) + "px";
        if (dir.includes("w")) h.style.left = (left - 5) + "px";
        if (dir.includes("e")) h.style.left = (left + width - 5) + "px";
        if (dir === "n" || dir === "s") h.style.left = (left + width / 2 - 4) + "px";
        if (dir === "w" || dir === "e") h.style.top = (top + height / 2 - 4) + "px";
      });
    }

    function removeResizeHandles() {
      if (handleContainer) handleContainer.innerHTML = "";
    }

    function selectImage(img, editorWrap) {
      if (selectedImage && selectedImage !== img) deselectImage();
      selectedImage = img;
      img.classList.add("weditor-img-selected");
      ensureHandleContainer(editorWrap);
      createResizeHandles(img);
      window.getSelection()?.removeAllRanges();
    }

    function deselectImage() {
      if (!selectedImage) return;
      selectedImage.classList.remove("weditor-img-selected");
      removeResizeHandles();
      selectedImage = null;
    }

    function startResize(e, img, direction) {
      const rect = img.getBoundingClientRect();
      resizeState = {
        img, direction,
        startX: e.clientX, startY: e.clientY,
        startWidth: rect.width, startHeight: rect.height,
        aspectRatio: rect.width / rect.height
      };
      document.addEventListener("mousemove", onResizeMove);
      document.addEventListener("mouseup", onResizeEnd);
      document.body.style.cursor = `${direction.includes("n") || direction.includes("s") ? "ns" : ""}${direction.includes("w") || direction.includes("e") ? "ew" : ""}-resize`;
    }

    function onResizeMove(e) {
      if (!resizeState) return;
      const { img, direction, startX, startY, startWidth, startHeight } = resizeState;
      let newWidth = startWidth;
      let newHeight = startHeight;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (direction.includes("e")) newWidth = Math.max(MIN_SIZE, startWidth + deltaX);
      if (direction.includes("w")) newWidth = Math.max(MIN_SIZE, startWidth - deltaX);
      if (direction.includes("s")) newHeight = Math.max(MIN_SIZE, startHeight + deltaY);
      if (direction.includes("n")) newHeight = Math.max(MIN_SIZE, startHeight - deltaY);

      if (direction.length === 2) { // Corner handles
        const safeStartWidth = startWidth > 0 ? startWidth : MIN_SIZE;
        const safeStartHeight = startHeight > 0 ? startHeight : MIN_SIZE;
        const widthRatio = safeStartWidth ? newWidth / safeStartWidth : 1;
        const heightRatio = safeStartHeight ? newHeight / safeStartHeight : 1;
        const widthDeltaRatio = Math.abs(widthRatio - 1);
        const heightDeltaRatio = Math.abs(heightRatio - 1);
        let ratio;
        if (widthDeltaRatio === 0 && heightDeltaRatio === 0) {
          ratio = 1;
        } else if (widthDeltaRatio >= heightDeltaRatio) {
          ratio = widthRatio;
        } else {
          ratio = heightRatio;
        }
        const minWidthRatio = safeStartWidth ? MIN_SIZE / safeStartWidth : 0;
        const minHeightRatio = safeStartHeight ? MIN_SIZE / safeStartHeight : 0;
        ratio = Math.max(ratio, minWidthRatio, minHeightRatio);
        newWidth = Math.max(MIN_SIZE, safeStartWidth * ratio);
        newHeight = Math.max(MIN_SIZE, safeStartHeight * ratio);
      }

      img.style.width = Math.round(newWidth) + "px";
      img.style.height = Math.round(newHeight) + "px";
      positionHandles(img);
    }

    function onResizeEnd() {
      if (!resizeState) return;
      document.removeEventListener("mousemove", onResizeMove);
      document.removeEventListener("mouseup", onResizeEnd);
      document.body.style.cursor = "";
      resizeState.img.dispatchEvent(new Event("input", { bubbles: true }));
      resizeState = null;
    }

    function setup(editorDiv, editorWrap) {
      editorWrap.addEventListener("click", (e) => {
        const img = e.target.closest("img");
        if (img && isNodeInside(img, editorDiv)) {
          e.preventDefault();
          selectImage(img, editorWrap);
        } else if (selectedImage) {
          deselectImage();
        }
      });

      editorDiv.addEventListener("keydown", (e) => {
        if (selectedImage && (e.key === "Backspace" || e.key === "Delete")) {
          e.preventDefault();
          const p = selectedImage.parentElement;
          selectedImage.remove();
          deselectImage();
          // If the parent paragraph is now empty, ensure it's usable
          if (p && p.tagName === 'P' && p.innerHTML.trim() === '') {
            p.innerHTML = '<br>';
          }
          editorDiv.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    }
    function getSelectedImage() {
      return selectedImage;
    }
    return { setup, deselect: deselectImage, getSelectedImage };
  })();
 
  // ---------- Init all editors ----------
  function initAll(){ $$(".weditor").forEach(buildEditor); }
  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Export for testing (中文解释: 导出供测试使用)
  if (typeof window !== "undefined") {
    window.weditorTest = {
      FONT_SIZE_PRESETS,
      buildEditor,
      initAll
    };
    window.weditorStyles = {
      remove(prop, value) {
        removeInlineStyles(prop, value);
      },
      removeAll(prop) {
        removeInlineStyles(prop);
      },
      setMode(mode) {
        setInlineStyleMode(mode);
      },
      getMode() {
        return inlineStyleMode;
      },
      MODES: {
        INLINE_ONLY: "inline-only",
        TRACKED_INLINE: "tracked-inline"
      }
    };
  }

})();
