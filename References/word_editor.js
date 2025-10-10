// --- References ---
const editor = document.getElementById('weditor_editor');
const pageWrap = document.getElementById('weditor_pageWrap');
const pageContent = document.querySelector('.weditor_page-content');
const printStyle = document.getElementById('weditor_printStyle');
const editorModal = document.getElementById('weditor_editorModal');
const launchBtn = document.getElementById('weditor_launchEditor');
const closeEditorBtn = document.getElementById('weditor_btnCloseEditor');
const printBtn = document.getElementById('weditor_btnPrint');
const saveStatusEl = document.getElementById('weditor_saveStatus');
const bodyEl = document.body;
const fileOpenInput = document.getElementById('weditor_fileOpen');
const fileImgInput = document.getElementById('weditor_fileImg');
const listStyleSelect = document.getElementById('weditor_listStyle');
const undoBtn = document.getElementById('weditor_btnUndo');
const redoBtn = document.getElementById('weditor_btnRedo');
const clearFormatBtn = document.getElementById('weditor_btnClearFormat');
const toastStack = document.getElementById('weditor_toastStack');
const importProgress = document.getElementById('weditor_importProgress');
const importProgressMessage = document.getElementById('weditor_importProgressMessage');
const offlineBanner = document.getElementById('weditor_offlineBanner');

const STORAGE_KEY = `webword:v1:${location.href}`;

let isModalOpen = false;
let hasRestored = false;
let autoSaveTimer = null;
let statusResetTimer = null;
let needsSave = false;
let pendingImageInsert = false;
let docHistory = [];
let docHistoryBytes = 0;
let historyIndex = -1;
let isApplyingHistory = false;
let historyDebounce = null;
let saveStatusBase = 'Ready';
let isOffline = !navigator.onLine;
let hasAnnouncedOffline = false;

const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024; // ≈2.5MB threshold
const IMAGE_QUALITY = 0.82;
const MAX_HISTORY_ENTRIES = 50;
const MAX_HISTORY_BYTES = 2.5 * 1024 * 1024; // cap snapshots near 2.5MB
const HISTORY_DEBOUNCE_MS = 350;
const HISTORY_FLASH_MS = 700;
const IS_APPLE_PLATFORM = /Mac|iP(hone|od|ad)/i.test(navigator.platform || navigator.userAgent || '');
const CLEARABLE_TAGS = new Set(['SPAN','FONT','B','I','U','STRONG','EM','SUP','SUB','P','DIV','H1','H2','H3','H4','H5','H6','TD','TH','LI','A']);
const NON_MUTATING_CMDS = new Set(['copy']);
const FLASHABLE_BLOCK_SELECTOR = 'p,div,li,table,thead,tbody,tr,td,th,blockquote,section,article';
const LARGE_FILE_BYTES = 2 * 1024 * 1024;

const ALLOWED_TAGS = new Set([
  'p','h1','h2','h3','h4','h5','h6','span','b','strong','i','em','u','sup','sub','ul','ol','li',
  'table','thead','tbody','tr','td','th','hr','img','a','br','div'
]);
const DROP_CONTENT_TAGS = new Set(['script','style','meta','link','iframe','object','embed','form','button','input','textarea','select','svg','canvas','noscript']);
const ALLOWED_ATTRS = new Set(['style','href','target','rel','src','colspan','rowspan','alt']);
const URL_ATTRS = new Set(['href','src']);
const SAFE_TARGETS = new Set(['_blank','_self']);
const ALLOWED_STYLES = new Set([
  'font-weight','font-style','text-decoration','color','background-color','font-size','line-height','text-align','vertical-align',
  'margin','padding','border','border-top','border-right','border-bottom','border-left','border-collapse','border-spacing','list-style-type',
  'width','height','max-width','max-height','min-width','min-height','background','text-indent','white-space'
]);

renderSaveStatus();

// --- Paper sizes in mm (A4 only for MVP) ---
const PAPER_MM = {
  A4: { w: 210, h: 297 }
};

// --- Init ---
window.addEventListener('load', () => {
  restoreFromStorage();
  updateStats();

  // wire toolbar generic execCommand
  document.querySelectorAll('[data-cmd]').forEach(b => {
    b.addEventListener('click', () => execCmd(b.getAttribute('data-cmd')));
  });

  if (undoBtn) {
    undoBtn.addEventListener('click', e => { e.preventDefault(); undoHistory({ flash: true }); });
    undoBtn.disabled = true;
  }
  if (redoBtn) {
    redoBtn.addEventListener('click', e => { e.preventDefault(); redoHistory({ flash: true }); });
    redoBtn.disabled = true;
  }

  // launch / close modal
  launchBtn.addEventListener('click', openEditorModal);
  closeEditorBtn.addEventListener('click', closeEditorModal);
  printBtn.addEventListener('click', handlePrint);

  // colors
  document.getElementById('weditor_btnColorText').onclick = () => document.getElementById('weditor_colorText').click();
  document.getElementById('weditor_btnColorHilite').onclick = () => document.getElementById('weditor_colorHilite').click();
  document.getElementById('weditor_colorText').onchange = (e)=>{ execCmd('foreColor', e.target.value); document.getElementById('weditor_cpText').style.background = e.target.value; };
  document.getElementById('weditor_colorHilite').onchange = (e)=>{ execCmd('hiliteColor', e.target.value); document.getElementById('weditor_cpHilite').style.background = e.target.value; };

  // font family / size
  document.getElementById('weditor_fontName').onchange = (e)=> execCmd('fontName', e.target.value);
  document.getElementById('weditor_fontSize').onchange = (e)=> setFontSizePt(e.target.value);

  // page setup (A4 locked, orientation still respected)
  document.getElementById('weditor_orientation').onchange = applyPageSetup;
  document.getElementById('weditor_margin').oninput = applyPageSetup;
  document.getElementById('weditor_zoom').onchange = applyZoom;
  applyPageSetup();
  applyZoom();

  // paste
  document.getElementById('weditor_btnPaste').onclick = doPaste;
  editor.addEventListener('paste', onPasteSanitized);

  // typing / selection
  editor.addEventListener('input', onDirty);
  editor.addEventListener('keyup', updateStats);
  editor.addEventListener('mouseup', updateStats);
  document.addEventListener('keydown', handleEditorShortcuts, true);

  // file
  document.getElementById('weditor_btnNew').onclick = newDoc;
  document.getElementById('weditor_btnOpen').onclick = ()=> fileOpenInput.click();
  document.getElementById('weditor_btnSave').onclick = saveDoc;
  fileOpenInput.addEventListener('change', handleOpenFile);

  // link / table / page break
  document.getElementById('weditor_btnLink').onclick = openLinkModal;
  document.querySelectorAll('[data-close]').forEach(el=> el.onclick = ()=> closeModal(el.getAttribute('data-close')));
  document.querySelectorAll('.weditor_close-x').forEach(el=> el.onclick = ()=> closeModal(el.getAttribute('data-close')));
  document.getElementById('weditor_doInsertLink').onclick = doInsertLink;
  document.getElementById('weditor_btnTable').onclick = ()=> openModal('weditor_modalTable');
  document.getElementById('weditor_doInsertTable').onclick = doInsertTable;
  document.getElementById('weditor_btnPageBreak').onclick = insertPageBreak;
  if (listStyleSelect) listStyleSelect.onchange = handleListStyleChange;

  // find/replace
  document.getElementById('weditor_btnFind').onclick = ()=> openModal('weditor_modalFind');
  document.getElementById('weditor_doFind').onclick = doFindNext;
  document.getElementById('weditor_doReplace').onclick = doReplaceOne;
  document.getElementById('weditor_doReplaceAll').onclick = doReplaceAll;
  if (clearFormatBtn) {
    clearFormatBtn.addEventListener('click', e => { e.preventDefault(); clearFormatting(); });
  }

  // image controls
  wireImageTools();
  wireTableTools();

  resetHistory();
  updateOfflineState({ force: true, silent: true });
});

window.addEventListener('beforeunload', flushAutoSave);
window.addEventListener('online', () => updateOfflineState());
window.addEventListener('offline', () => updateOfflineState());

function restoreFromStorage(){
  if (hasRestored) return;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) editor.innerHTML = saved;
  hasRestored = true;
}

function openEditorModal(){
  restoreFromStorage();
  isModalOpen = true;
  bodyEl.classList.add('weditor_modal-open');
  editorModal.classList.add('weditor_active');
  setSaveStatus(needsSave ? 'Unsaved' : 'Ready');
  updateStats();
  updateListStyleControl();
  syncTableSelection();
  try { editor.focus({ preventScroll: true }); } catch(_) { editor.focus(); }
}

function closeEditorModal(){
  flushAutoSave();
  isModalOpen = false;
  bodyEl.classList.remove('weditor_modal-open');
  editorModal.classList.remove('weditor_active');
  dismissImageTools();
  dismissTableTools();
  ['weditor_modalLink','weditor_modalTable','weditor_modalFind'].forEach(id => closeModal(id));
  setSaveStatus('Ready');
  updateListStyleControl();
}

function handlePrint(){
  if (!isModalOpen) return;
  flushAutoSave();
  requestAnimationFrame(() => window.print());
}

// --- Exec command wrapper ---
function execCmd(cmd, val=null) {
  document.execCommand(cmd, false, val);
  editor.focus();
  if (!NON_MUTATING_CMDS.has(cmd)) {
    onDirty();
  }
}

function setFontSizePt(pt) {
  if (!pt) return;
  // Wrap selection in span with font-size:pt (reliable across engines)
  const sel = window.getSelection();
  if (!sel || sel.rangeCount===0) return;
  const range = sel.getRangeAt(0);
  const span = document.createElement('span');
  span.style.fontSize = pt + 'pt';
  range.surroundContents ? safeSurround(range, span) : span.append(range.extractContents());
  range.insertNode(span);
  // place caret after span
  sel.removeAllRanges(); const r = document.createRange(); r.setStartAfter(span); r.collapse(true); sel.addRange(r);
  onDirty();
}

function safeSurround(range, node){
  try { range.surroundContents(node); }
  catch(_) { node.append(range.extractContents()); }
}

// --- Paste handling (preserve styles, strip junk) ---
async function onPasteSanitized(e){
  e.preventDefault();
  const cd = e.clipboardData || window.clipboardData;
  let html = cd?.getData?.('text/html');
  const text = cd.getData('text/plain');
  if (html) {
    execCmd('insertHTML', cleanWordHTML(html));
    onDirty();
    return;
  }
  const imageFile = extractImageFile(cd);
  if (imageFile){
    await insertImageFile(imageFile, { replace: false });
    return;
  }
  if (text) {
    execCmd('insertText', text);
    onDirty();
  }
}

function extractImageFile(clipboardData){
  if (!clipboardData) return null;
  if (clipboardData.files && clipboardData.files.length){
    for (const file of clipboardData.files){
      if (file.type && file.type.startsWith('image/')) return file;
    }
  }
  if (clipboardData.items && clipboardData.items.length){
    for (const item of clipboardData.items){
      if (item.kind === 'file' && item.type.startsWith('image/')){
        const file = item.getAsFile();
        if (file) return file;
      }
    }
  }
  return null;
}

async function doPaste() {
  if (navigator.clipboard?.read) {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        if (item.types.includes('text/html')) {
          const blob = await item.getType('text/html');
          const html = await blob.text();
          execCmd('insertHTML', cleanWordHTML(html));
          onDirty();
          return;
        }
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split('/')[1] || 'png';
          const file = new File([blob], `clipboard.${ext}`, { type: imageType });
          await insertImageFile(file, { replace: false });
          return;
        }
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        execCmd('insertText', text);
        onDirty();
      }
      return;
    } catch (err) {
      console.warn('Clipboard read failed, falling back', err);
    }
  }
  execCmd('paste'); // fallback (may be blocked / unsanitized)
}

function cleanWordHTML(html){
  if (!html) return '';
  html = html.replace(/<!--[\s\S]*?-->/gi, '')
             .replace(/<\/?(o|w):[^>]*>/gi, '')
             .replace(/<\/?v:[^>]*>/gi, '');
  const temp = document.createElement('div');
  temp.innerHTML = html;
  sanitizeFragment(temp);
  return temp.innerHTML;
}

function sanitizeFragment(root){
  sanitizeChildren(root);
}

function sanitizeChildren(node){
  let child = node.firstChild;
  while (child){
    const next = child.nextSibling;
    sanitizeNode(child);
    child = next;
  }
}

function sanitizeNode(node){
  if (node.nodeType === Node.COMMENT_NODE){
    node.remove();
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  sanitizeChildren(node);

  const tag = node.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)){
    if (DROP_CONTENT_TAGS.has(tag)){
      node.remove();
      return;
    }
    unwrapNode(node);
    return;
  }

  sanitizeAttributes(node);
}

function unwrapNode(node){
  const parent = node.parentNode;
  if (!parent){
    node.remove();
    return;
  }
  while (node.firstChild){
    parent.insertBefore(node.firstChild, node);
  }
  parent.removeChild(node);
}

function sanitizeAttributes(el){
  [...el.attributes].forEach(attr => {
    const name = attr.name.toLowerCase();
    const value = attr.value;
    if (!ALLOWED_ATTRS.has(name)){
      el.removeAttribute(attr.name);
      return;
    }
    if (name === 'style'){
      const clean = sanitizeStyle(value);
      if (clean) el.setAttribute('style', clean);
      else el.removeAttribute('style');
      return;
    }
    if (URL_ATTRS.has(name)){
      const safe = sanitizeUrl(value, name);
      if (safe) {
        el.setAttribute(name, safe);
        if (name === 'href'){
          if (!el.hasAttribute('target')) el.setAttribute('target','_blank');
          el.setAttribute('rel','noopener');
        }
      } else {
        el.removeAttribute(name);
      }
      return;
    }
    if (name === 'target'){
      const target = value.trim();
      if (!SAFE_TARGETS.has(target)){
        el.setAttribute('target','_blank');
      }
      return;
    }
    if ((name === 'colspan' || name === 'rowspan') && !/^\d+$/.test(value.trim())){
      el.removeAttribute(name);
    }
  });

  if (el.tagName.toLowerCase() === 'a' && !el.hasAttribute('href')){
    el.removeAttribute('target');
    el.removeAttribute('rel');
  }
}

function sanitizeStyle(styleValue){
  if (!styleValue) return '';
  const rules = styleValue.split(';').map(r => r.trim()).filter(Boolean);
  const cleaned = [];
  for (const rule of rules){
    const idx = rule.indexOf(':');
    if (idx === -1) continue;
    const property = rule.slice(0, idx).trim().toLowerCase();
    let value = rule.slice(idx + 1).trim();
    if (!isAllowedStyle(property)) continue;
    if (!value) continue;
    const lowerVal = value.toLowerCase();
    if (lowerVal.includes('expression') || lowerVal.includes('javascript:') || /url\s*\(/i.test(lowerVal)) continue;
    value = value.replace(/!important/gi, '').trim();
    if (!value) continue;
    cleaned.push(`${property}: ${value}`);
  }
  return cleaned.join('; ');
}

function isAllowedStyle(property){
  if (ALLOWED_STYLES.has(property)) return true;
  if (property.startsWith('margin') && ALLOWED_STYLES.has('margin')) return true;
  if (property.startsWith('padding') && ALLOWED_STYLES.has('padding')) return true;
  if (property.startsWith('border') && ALLOWED_STYLES.has('border')) return true;
  return false;
}

function sanitizeUrl(raw, attr){
  if (!raw) return '';
  const url = raw.trim();
  const lower = url.toLowerCase();
  if (attr === 'src' && lower.startsWith('data:image/')) return url;
  const allowedProtocols = ['http:','https:','mailto:','tel:','//','blob:'];
  if (lower.startsWith('#')) return url;
  if (allowedProtocols.some(proto => lower.startsWith(proto))) return url;
  return '';
}

function renderSaveStatus(){
  if (!saveStatusEl) return;
  const suffix = isOffline ? ' · Offline' : '';
  saveStatusEl.textContent = `${saveStatusBase}${suffix}`;
}

function setSaveStatus(baseText){
  saveStatusBase = baseText;
  renderSaveStatus();
}

// --- Status & autosave ---
function updateStats(){
  const t = editor.innerText || '';
  const words = t.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('weditor_statWords').textContent = words;
  document.getElementById('weditor_statChars').textContent = t.length;
}

function onDirty(){
  if (!isModalOpen) return;
  if (historyIndex >= 0 && docHistory[historyIndex] && docHistory[historyIndex].html === editor.innerHTML){
    needsSave = false;
    setSaveStatus('Ready');
    if (historyDebounce){
      clearTimeout(historyDebounce);
      historyDebounce = null;
    }
    if (autoSaveTimer){
      clearTimeout(autoSaveTimer);
      autoSaveTimer = null;
    }
    return;
  }
  needsSave = true;
  setSaveStatus('Unsaved');
  updateStats();
  queueAutoSave();
  queueHistorySnapshot();
}

function queueAutoSave(){
  if (autoSaveTimer) return;
  autoSaveTimer = setTimeout(runAutoSave, 2000);
}

function queueHistorySnapshot(){
  if (isApplyingHistory) return;
  if (historyDebounce){
    return;
  }
  historyDebounce = setTimeout(()=> {
    historyDebounce = null;
    pushHistory();
  }, HISTORY_DEBOUNCE_MS);
}

function runAutoSave(){
  autoSaveTimer = null;
  if (!needsSave || !isModalOpen) return;
  persistContent();
  needsSave = false;
  setSaveStatus('Auto-saved');
  scheduleStatusReset();
}

function scheduleStatusReset(){
  if (statusResetTimer) clearTimeout(statusResetTimer);
  statusResetTimer = setTimeout(()=> {
    if (saveStatusBase === 'Auto-saved' || saveStatusBase === 'Saved') {
      setSaveStatus('Ready');
    }
  }, 1500);
}

function persistContent(){
  localStorage.setItem(STORAGE_KEY, editor.innerHTML);
}

function flushAutoSave(){
  if (!isModalOpen) return;
  if (autoSaveTimer){
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
  if (needsSave){
    persistContent();
    needsSave = false;
    setSaveStatus('Saved');
    scheduleStatusReset();
  }
}

function pushHistory(providedSnapshot){
  if (isApplyingHistory) return;
  const html = editor.innerHTML;
  const selection = providedSnapshot !== undefined ? providedSnapshot : getSelectionSnapshot();
  if (historyIndex >= 0){
    const current = docHistory[historyIndex];
    if (current && current.html === html){
      const prevSize = current.size ?? current.html.length;
      const nextSize = html.length;
      docHistoryBytes += nextSize - prevSize;
      docHistory[historyIndex] = { html, selection, size: nextSize };
      updateHistoryUI();
      return;
    }
  }
  if (historyIndex < docHistory.length - 1){
    for (let i = historyIndex + 1; i < docHistory.length; i++){
      const removed = docHistory[i];
      const removedSize = removed?.size ?? removed?.html?.length ?? 0;
      docHistoryBytes -= removedSize;
    }
    docHistory.length = historyIndex + 1;
  }
  const entrySize = html.length;
  docHistory.push({ html, selection, size: entrySize });
  docHistoryBytes += entrySize;
  historyIndex = docHistory.length - 1;
  enforceHistoryBudget();
  updateHistoryUI();
}

function resetHistory(){
  if (historyDebounce){
    clearTimeout(historyDebounce);
    historyDebounce = null;
  }
  docHistory = [];
  docHistoryBytes = 0;
  historyIndex = -1;
  pushHistory(getSelectionSnapshot());
}

function updateHistoryUI(){
  if (undoBtn){
    undoBtn.disabled = historyIndex <= 0;
  }
  if (redoBtn){
    redoBtn.disabled = historyIndex === -1 || historyIndex >= docHistory.length - 1;
  }
}

function enforceHistoryBudget(){
  while ((docHistory.length > MAX_HISTORY_ENTRIES || docHistoryBytes > MAX_HISTORY_BYTES) && docHistory.length > 1){
    const removed = docHistory.shift();
    const removedSize = removed?.size ?? removed?.html?.length ?? 0;
    docHistoryBytes -= removedSize;
    historyIndex -= 1;
  }
  if (docHistoryBytes < 0) docHistoryBytes = 0;
  if (historyIndex < 0) historyIndex = docHistory.length - 1;
}

function undoHistory(options = {}){
  if (!isModalOpen) return;
  if (historyIndex <= 0) return;
  historyIndex -= 1;
  applyHistoryState(docHistory[historyIndex], { action: 'undo', flash: options.flash });
}

function redoHistory(options = {}){
  if (!isModalOpen) return;
  if (historyIndex === -1 || historyIndex >= docHistory.length - 1) return;
  historyIndex += 1;
  applyHistoryState(docHistory[historyIndex], { action: 'redo', flash: options.flash });
}

function applyHistoryState(state, options = {}){
  if (!state) return;
  isApplyingHistory = true;
  if (historyDebounce){
    clearTimeout(historyDebounce);
    historyDebounce = null;
  }
  editor.innerHTML = state.html;
  dismissImageTools();
  dismissTableTools();
  needsSave = true;
  setSaveStatus('Unsaved');
  updateStats();
  updateListStyleControl();
  syncTableSelection();
  if (isModalOpen){
    queueAutoSave();
  }
  const finalize = ()=> {
    applySelectionSnapshot(state.selection);
    try { editor.focus({ preventScroll: true }); } catch(_) { editor.focus(); }
    const latestSnapshot = getSelectionSnapshot();
    if (historyIndex >= 0 && historyIndex < docHistory.length){
      const current = docHistory[historyIndex];
      const prevSize = current?.size ?? current?.html?.length ?? 0;
      const nextHtml = editor.innerHTML;
      const nextSize = nextHtml.length;
      docHistoryBytes += nextSize - prevSize;
      docHistory[historyIndex] = { html: nextHtml, selection: latestSnapshot, size: nextSize };
    }
    isApplyingHistory = false;
    updateHistoryUI();
  };
  if (typeof requestAnimationFrame === 'function'){
    requestAnimationFrame(finalize);
  } else {
    finalize();
  }
  if (options.flash && options.action === 'undo'){
    flashSnapshot(state.selection);
  }
}

function handleEditorShortcuts(event){
  if (!isModalOpen) return;
  const modifierActive = IS_APPLE_PLATFORM ? event.metaKey : event.ctrlKey;
  if (!modifierActive || event.altKey) return;
  const key = (event.key || '').toLowerCase();
  if (key === 'z'){
    event.preventDefault();
    if (event.shiftKey){
      redoHistory({ flash: true });
    } else {
      undoHistory({ flash: true });
    }
  } else if (key === 'y' && !IS_APPLE_PLATFORM){
    event.preventDefault();
    redoHistory({ flash: true });
  } else {
    const targetEl = event.target instanceof Element ? event.target : null;
    if (shouldRespectFormControl(targetEl)) return;
    const selectionInEditor = isSelectionWithinEditor();
    const targetInEditor = targetEl ? (targetEl === editor || editor.contains(targetEl)) : false;
    const hasEditorContext = selectionInEditor || targetInEditor;
    if (key === 'b' || key === 'i' || key === 'u'){
      if (!hasEditorContext) return;
      event.preventDefault();
      if (!targetInEditor) focusEditorForShortcut();
      const cmd = key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline';
      execCmd(cmd);
    } else if (key === 'a'){
      event.preventDefault();
      if (!targetInEditor) focusEditorForShortcut();
      selectAllEditor();
    } else if ((key === 'c' || key === 'v')){
      if (!hasEditorContext) return;
      if (!targetInEditor) focusEditorForShortcut();
      // allow default browser handling for copy/paste
    }
  }
}

function flashSnapshot(snapshot){
  const target = findFlashTarget(snapshot);
  flashElement(target || editor);
}

function findFlashTarget(snapshot){
  if (!snapshot) return null;
  const startNode = getNodeFromPath(snapshot.start?.path, editor);
  const endNode = getNodeFromPath(snapshot.end?.path, editor);
  const node = selectBestNode(startNode, endNode);
  if (!node) return null;
  if (node.nodeType === Node.ELEMENT_NODE){
    return node.closest(FLASHABLE_BLOCK_SELECTOR) || node;
  }
  if (node.parentElement){
    return node.parentElement.closest(FLASHABLE_BLOCK_SELECTOR) || node.parentElement;
  }
  return null;
}

function selectBestNode(a, b){
  if (a && editor.contains(a)) return a;
  if (b && editor.contains(b)) return b;
  return null;
}

function flashElement(element){
  if (!element) return;
  if (element.dataset.undoFlashTimer){
    clearTimeout(Number(element.dataset.undoFlashTimer));
  }
  element.classList.remove('weditor_undo-flash');
  void element.offsetWidth;
  element.classList.add('weditor_undo-flash');
  const timer = window.setTimeout(()=> {
    element.classList.remove('weditor_undo-flash');
    delete element.dataset.undoFlashTimer;
  }, HISTORY_FLASH_MS);
  element.dataset.undoFlashTimer = String(timer);
}

function shouldRespectFormControl(el){
  if (!el) return false;
  if (el === editor || editor.contains(el)) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (el.isContentEditable && !editor.contains(el)) return true;
  return false;
}

function isSelectionWithinEditor(){
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  return editor.contains(range.startContainer) && editor.contains(range.endContainer);
}

function focusEditorForShortcut(){
  if (document.activeElement === editor) return;
  try {
    editor.focus({ preventScroll: true });
  } catch (_) {
    editor.focus();
  }
}

function selectAllEditor(){
  const range = document.createRange();
  range.selectNodeContents(editor);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  focusEditorForShortcut();
}

function showToast(message, options = {}){
  if (!toastStack || !message) return null;
  const { type = 'info', duration = 4000, sticky = false } = options;
  const toast = document.createElement('div');
  toast.className = `weditor_toast weditor_toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  toastStack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('weditor_toast--visible'));
  if (!sticky){
    const ttl = Math.max(1800, Number.isFinite(duration) ? duration : 0);
    const timerId = window.setTimeout(() => removeToast(toast), ttl || 4000);
    toast.dataset.timerId = String(timerId);
  }
  toast.addEventListener('click', () => removeToast(toast));
  return toast;
}

function removeToast(toast){
  if (!toast || !toastStack || !toastStack.contains(toast)) return;
  if (toast.dataset.timerId){
    clearTimeout(Number(toast.dataset.timerId));
    delete toast.dataset.timerId;
  }
  toast.classList.remove('weditor_toast--visible');
  window.setTimeout(() => {
    if (toast.parentNode === toastStack){
      toastStack.removeChild(toast);
    }
  }, 180);
}

function showImportProgress(message){
  if (!importProgress) return;
  importProgress.hidden = false;
  importProgress.setAttribute('aria-hidden', 'false');
  if (importProgressMessage){
    importProgressMessage.textContent = message;
  }
}

function hideImportProgress(){
  if (!importProgress) return;
  importProgress.hidden = true;
  importProgress.setAttribute('aria-hidden', 'true');
  if (importProgressMessage){
    importProgressMessage.textContent = '';
  }
}

function formatBytes(bytes){
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B','KB','MB','GB','TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1){
    value /= 1024;
    unitIndex += 1;
  }
  const formatted = value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
}

function updateOfflineState(options = {}){
  const offlineNow = !navigator.onLine;
  const force = Boolean(options.force);
  if (!force && offlineNow === isOffline){
    if (!hasAnnouncedOffline){
      toggleOfflineUI(offlineNow);
      hasAnnouncedOffline = true;
    }
    return;
  }
  isOffline = offlineNow;
  toggleOfflineUI(offlineNow);
  hasAnnouncedOffline = true;
  if (options.silent) return;
  if (offlineNow){
    showToast('Offline mode: edits stay local until connection returns.', { type: 'warning', duration: 6000 });
  } else {
    showToast('Connection restored. Online features are available again.', { type: 'success', duration: 3500 });
  }
}

function toggleOfflineUI(offlineNow){
  bodyEl.classList.toggle('weditor_offline', offlineNow);
  if (offlineBanner){
    if (offlineNow){
      offlineBanner.textContent = 'Offline mode — changes stay on this device until you reconnect.';
      offlineBanner.hidden = false;
    } else {
      offlineBanner.hidden = true;
      offlineBanner.textContent = '';
    }
  }
  renderSaveStatus();
}

function getSelectionSnapshot(){
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)){
    return null;
  }
  const startPath = getNodePath(range.startContainer, editor);
  const endPath = getNodePath(range.endContainer, editor);
  if (!startPath || !endPath) return null;
  return {
    start: { path: startPath, offset: range.startOffset },
    end: { path: endPath, offset: range.endOffset }
  };
}

function applySelectionSnapshot(snapshot){
  if (!snapshot) return;
  const startNode = getNodeFromPath(snapshot.start?.path, editor);
  const endNode = getNodeFromPath(snapshot.end?.path, editor);
  if (!startNode || !endNode) return;
  const range = document.createRange();
  range.setStart(startNode, Math.min(snapshot.start.offset ?? 0, getNodeMaxOffset(startNode)));
  range.setEnd(endNode, Math.min(snapshot.end.offset ?? 0, getNodeMaxOffset(endNode)));
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function getNodePath(node, root){
  const path = [];
  let current = node;
  while (current && current !== root){
    const parent = current.parentNode;
    if (!parent) return null;
    const index = Array.prototype.indexOf.call(parent.childNodes, current);
    if (index === -1) return null;
    path.unshift(index);
    current = parent;
  }
  if (current !== root) return null;
  return path;
}

function getNodeFromPath(path, root){
  if (!Array.isArray(path)) return null;
  let current = root;
  for (const index of path){
    if (!current || !current.childNodes || index < 0 || index >= current.childNodes.length){
      return null;
    }
    current = current.childNodes[index];
  }
  return current;
}

function getNodeMaxOffset(node){
  if (!node) return 0;
  if (node.nodeType === Node.TEXT_NODE){
    return node.nodeValue ? node.nodeValue.length : 0;
  }
  return node.childNodes ? node.childNodes.length : 0;
}

function getElementsInRange(range){
  const elements = [];
  let root = range.commonAncestorContainer;
  if (root.nodeType !== Node.ELEMENT_NODE){
    root = root.parentElement;
  }
  if (!root) return elements;
  const traverse = (node)=>{
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (!range.intersectsNode(node)) return;
    elements.push(node);
    for (const child of node.children){
      traverse(child);
    }
  };
  traverse(root);
  return elements;
}

function clearFormatting(){
  if (!isModalOpen) return;
  const snapshot = getSelectionSnapshot();
  document.execCommand('removeFormat', false, null);
  if (snapshot) {
    applySelectionSnapshot(snapshot);
  }
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0){
    onDirty();
    return;
  }
  const range = sel.getRangeAt(0);
  const elements = getElementsInRange(range);
  elements.forEach(node => {
    if (node === editor) return;
    if (node.tagName && CLEARABLE_TAGS.has(node.tagName)){
      if (node.hasAttribute('style')){
        node.removeAttribute('style');
      }
      if (node.tagName === 'SPAN' && node.attributes.length === 0){
        unwrapNode(node);
      }
    }
  });
  onDirty();
}

// --- File ops ---
function newDoc(){
  if (!confirm('Create new document? Unsaved changes will be lost.')) return;
  editor.innerHTML = '<p><br></p>';
  localStorage.removeItem(STORAGE_KEY);
  onDirty();
  resetHistory();
}
function saveDoc(){
  const content = editor.innerHTML;
  const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Document</title></head><body>${content}</body></html>`], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: 'document.html' });
  a.click(); URL.revokeObjectURL(url);
  persistContent();
  needsSave = false;
  setSaveStatus('Saved');
  scheduleStatusReset();
}
async function handleOpenFile(e){
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  const isDocx = /\.(docx)$/i.test(file.name);
  const sizeLabel = file.size ? formatBytes(file.size) : '';
  const fileLabel = file.name || 'document';
  const shouldShowProgress = isDocx || file.size >= LARGE_FILE_BYTES;
  if (shouldShowProgress){
    const descriptor = isDocx ? 'Importing DOCX' : 'Opening file';
    const label = sizeLabel ? `${fileLabel} (${sizeLabel})` : fileLabel;
    showImportProgress(`${descriptor}: ${label}`);
  }
  try {
    if (isDocx) {
      if (!window.mammoth?.convertToHtml) {
        showToast('DOCX support is unavailable right now. Please refresh and try again.', { type: 'error', duration: 6000 });
        return;
      }
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.convertToHtml({ arrayBuffer });
      const html = cleanWordHTML(result.value || '');
      editor.innerHTML = html || '<p><br></p>';
    } else {
      const text = await file.text();
      editor.innerHTML = text || '<p><br></p>';
    }
    updateStats();
    updateListStyleControl();
    syncTableSelection();
    dismissImageTools();
    dismissTableTools();
    resetHistory();
    needsSave = false;
    setSaveStatus('Ready');
    showToast(`${fileLabel} imported successfully`, { type: 'success', duration: 3200 });
  } catch (err) {
    console.error('File import failed', err);
    showToast(`Could not import ${fileLabel}. Please verify the file is valid.`, { type: 'error', duration: 6500 });
  } finally {
    if (shouldShowProgress){
      hideImportProgress();
    }
  }
}
// --- Modals simple helpers ---
function openModal(id){ document.getElementById(id).classList.add('weditor_active'); }
function closeModal(id){ document.getElementById(id).classList.remove('weditor_active'); }

// --- Link ---
function openLinkModal(){
  const sel = String(window.getSelection());
  document.getElementById('weditor_linkText').value = sel || '';
  document.getElementById('weditor_linkURL').value = '';
  openModal('weditor_modalLink');
}
function doInsertLink(){
  const url = document.getElementById('weditor_linkURL').value.trim();
  const text = document.getElementById('weditor_linkText').value.trim();
  if (!url){ closeModal('weditor_modalLink'); return; }
  if (text){
    execCmd('insertHTML', `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(text)}</a>`);
  } else {
    execCmd('createLink', url);
    // ensure target=_blank
    const sel = window.getSelection(); if (sel?.anchorNode) {
      const a = (sel.anchorNode.nodeType===1? sel.anchorNode : sel.anchorNode.parentElement).closest('a');
      if (a){ a.target = '_blank'; a.rel = 'noopener'; }
    }
  }
  closeModal('weditor_modalLink'); onDirty();
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

// --- Table ---
function doInsertTable(){
  const r = Math.max(1, +document.getElementById('weditor_tblRows').value||3);
  const c = Math.max(1, +document.getElementById('weditor_tblCols').value||3);
  let html = `<table style="width:100%;border-collapse:collapse;border:1px solid #000;">`;
  for (let i=0;i<r;i++){
    html += `<tr>`;
    for (let j=0;j<c;j++){
      html += `<td style="border:1px solid #000;padding:4px;"><p><br></p></td>`;
    }
    html += `</tr>`;
  }
  html += `</table><p><br></p>`;
  execCmd('insertHTML', html);
  closeModal('weditor_modalTable'); onDirty();
}

// --- Page break ---
function insertPageBreak(){
  execCmd('insertHTML', `<div class="weditor_page-break" contenteditable="false"></div>`);
  onDirty();
}

// --- Page setup & zoom ---
function applyPageSetup(){
  const paper = 'A4';
  const orient = document.getElementById('weditor_orientation').value;
  const margin = Math.max(0, +document.getElementById('weditor_margin').value || 20);
  const dim = PAPER_MM[paper] || PAPER_MM.A4;
  const W = orient==='portrait' ? dim.w : dim.h;
  const H = orient==='portrait' ? dim.h : dim.w;
  // On-screen size in mm (CSS supports mm)
  pageWrap.style.width = W + 'mm';
  pageWrap.style.minHeight = H + 'mm';
  // Content padding = margins
  if (pageContent) pageContent.style.padding = margin + 'mm';
  // Print @page
  printStyle.textContent = `@page{ size: ${paper} ${orient}; margin: ${margin}mm; }`;
}
function applyZoom(){
  const zStr = document.getElementById('weditor_zoom').value.replace('%','');
  const z = Math.max(10, +zStr || 100);
  pageWrap.style.transform = `scale(${z/100})`;
}

function handleListStyleChange(e){
  const val = e.target.value;
  if (!val || !isModalOpen) return;
  const parts = val.split(':');
  if (parts.length !== 2) return;
  const [listKind, style] = parts;
  const wantsOrdered = listKind === 'ol';
  let list = getClosestList();
  const toggleCmd = wantsOrdered ? 'insertOrderedList' : 'insertUnorderedList';
  if (!list){
    execCmd(toggleCmd);
    list = getClosestList();
  } else {
    const isOrdered = list.tagName.toLowerCase() === 'ol';
    if (isOrdered !== wantsOrdered){
      execCmd(toggleCmd);
      list = getClosestList();
    }
  }
  if (list){
    list.style.listStyleType = style;
    onDirty();
  }
  updateListStyleControl();
}

function getClosestList(){
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node = sel.anchorNode;
  if (!node) return null;
  if (node.nodeType !== Node.ELEMENT_NODE) node = node.parentElement;
  if (!node) return null;
  return node.closest('ul,ol');
}

function updateListStyleControl(){
  if (!listStyleSelect) return;
  if (!isModalOpen){
    listStyleSelect.value = '';
    return;
  }
  const list = getClosestList();
  if (!list){
    listStyleSelect.value = '';
    return;
  }
  const tag = list.tagName.toLowerCase();
  let style = (list.style.listStyleType || '').trim();
  if (!style){
    style = window.getComputedStyle(list).listStyleType || '';
  }
  if (!style){
    style = tag === 'ol' ? 'decimal' : 'disc';
  }
  const value = `${tag}:${style}`;
  const hasOption = Array.from(listStyleSelect.options).some(opt => opt.value === value);
  listStyleSelect.value = hasOption ? value : '';
}

// --- Find & Replace (simple) ---
let _lastFindIndex = -1, _lastFindText = '';
function doFindNext(){
  const needle = document.getElementById('weditor_findTxt').value;
  if (!needle) return;
  const html = editor.innerHTML;
  if (_lastFindText !== needle){ _lastFindText = needle; _lastFindIndex = -1; }
  const from = _lastFindIndex + 1;
  const idx = html.toLowerCase().indexOf(needle.toLowerCase(), from);
  if (idx >= 0){
    _lastFindIndex = idx;
    selectHtmlRangeByIndex(editor, idx, needle.length);
  } else { _lastFindIndex = -1; }
}
function doReplaceOne(){
  const find = document.getElementById('weditor_findTxt').value;
  const repl = document.getElementById('weditor_replTxt').value;
  if (!find) return;
  const sel = window.getSelection();
  if (sel && String(sel) && String(sel).toLowerCase()===find.toLowerCase()){
    execCmd('insertText', repl);
    onDirty(); doFindNext();
  } else {
    doFindNext();
  }
}
function doReplaceAll(){
  const find = document.getElementById('weditor_findTxt').value;
  const repl = document.getElementById('weditor_replTxt').value;
  if (!find) return;
  const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  editor.innerHTML = editor.innerHTML.replace(re, repl);
  onDirty();
}
function selectHtmlRangeByIndex(root, index, length){
  // naive selection across text nodes
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let pos = 0, startNode=null, startOffset=0, endNode=null, endOffset=0;
  while (walker.nextNode()){
    const n = walker.currentNode, len = n.nodeValue.length;
    if (!startNode && pos + len >= index) { startNode = n; startOffset = index - pos; }
    if (startNode && pos + len >= index + length){ endNode = n; endOffset = index + length - pos; break; }
    pos += len;
  }
  if (startNode && endNode){
    const r = document.createRange(); r.setStart(startNode, startOffset); r.setEnd(endNode, endOffset);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }
}

// --- Image Tools ---
let currentImg = null, naturalRatio = 1;
const imgTB = document.getElementById('weditor_imgToolbar');
const widthSlider = document.getElementById('weditor_imgWidth');
const lockRatio = document.getElementById('weditor_imgLock');
const sizeLabel = document.getElementById('weditor_imgSizeLabel');
let currentCell = null;
const tableTB = document.getElementById('weditor_tableToolbar');

function wireImageTools(){
  // click to open toolbar
  editor.addEventListener('click', e => {
    const img = e.target.closest('img');
    if (img) selectImage(img);
    else dismissImageTools();
  });
  // keyboard/mouse outside
  document.addEventListener('scroll', positionToolbar, true);
  window.addEventListener('resize', positionToolbar);

  // controls
  widthSlider.oninput = ()=> applyImgWidth(+widthSlider.value);
  document.getElementById('weditor_imgAlignLeft').onclick = ()=> setImgAlign('left');
  document.getElementById('weditor_imgAlignCenter').onclick = ()=> setImgAlign('center');
  document.getElementById('weditor_imgAlignRight').onclick = ()=> setImgAlign('right');
  document.getElementById('weditor_imgFloatLeft').onclick = ()=> setImgFloat('left');
  document.getElementById('weditor_imgFloatRight').onclick = ()=> setImgFloat('right');
  document.getElementById('weditor_imgFloatNone').onclick = ()=> setImgFloat('none');
  document.getElementById('weditor_imgBorderToggle').onclick = toggleImgBorder;
  document.getElementById('weditor_imgRadius').oninput = (e)=> setImgRadius(+e.target.value);
  document.getElementById('weditor_imgShadowToggle').onclick = toggleImgShadow;
  document.getElementById('weditor_imgReplace').onclick = replaceImgURL;
  document.getElementById('weditor_imgUpload').onclick = ()=> { pendingImageInsert = false; fileImgInput.click(); };
  document.getElementById('weditor_imgRemove').onclick = removeImg;
  fileImgInput.addEventListener('change', handleImgUpload);
}

function wireTableTools(){
  if (!tableTB) return;
  editor.addEventListener('click', e => {
    const cell = e.target.closest('td,th');
    if (cell) selectTableCell(cell);
    else if (!e.target.closest('.weditor_table-toolbar')) dismissTableTools();
  });
  document.addEventListener('click', e => {
    if (!editor.contains(e.target) && !tableTB.contains(e.target)) dismissTableTools();
  });
  tableTB.addEventListener('mousedown', e => e.preventDefault());
  const bind = (id, handler)=>{
    const btn = document.getElementById(id);
    if (btn) btn.onclick = handler;
  };
  bind('weditor_tblAddRowAbove', ()=> modifyTableRow('above'));
  bind('weditor_tblAddRowBelow', ()=> modifyTableRow('below'));
  bind('weditor_tblAddColLeft', ()=> modifyTableColumn('left'));
  bind('weditor_tblAddColRight', ()=> modifyTableColumn('right'));
  bind('weditor_tblDeleteRow', deleteTableRow);
  bind('weditor_tblDeleteCol', deleteTableColumn);
  bind('weditor_tblToggleHeader', toggleTableHeader);
  bind('weditor_tblAlignLeft', ()=> setCellAlignment('left'));
  bind('weditor_tblAlignCenter', ()=> setCellAlignment('center'));
  bind('weditor_tblAlignRight', ()=> setCellAlignment('right'));
  tableTB.querySelectorAll('[data-border]').forEach(btn => {
    btn.addEventListener('click', ()=> applyCellBorder(btn.getAttribute('data-border')));
  });
  window.addEventListener('resize', positionTableToolbar);
  document.addEventListener('scroll', positionTableToolbar, true);
}

function selectTableCell(cell){
  if (!tableTB || !cell) return;
  if (currentCell === cell){
    positionTableToolbar();
    return;
  }
  if (currentCell) currentCell.classList.remove('weditor_cell-selected');
  currentCell = cell;
  currentCell.classList.add('weditor_cell-selected');
  tableTB.style.display = 'block';
  positionTableToolbar();
}

function dismissTableTools(){
  if (currentCell) currentCell.classList.remove('weditor_cell-selected');
  currentCell = null;
  if (tableTB) tableTB.style.display = 'none';
}

function positionTableToolbar(){
  if (!tableTB || !currentCell || tableTB.style.display === 'none') return;
  const rect = currentCell.getBoundingClientRect();
  const top = Math.max(8, rect.top + window.scrollY - tableTB.offsetHeight - 10);
  const left = Math.min(window.scrollX + rect.left, window.scrollX + window.innerWidth - tableTB.offsetWidth - 8);
  tableTB.style.top = `${top}px`;
  tableTB.style.left = `${left}px`;
}

function tableHasMergedCells(table){
  if (!table) return false;
  return Array.from(table.rows).some(row =>
    Array.from(row.cells).some(cell => cell.colSpan > 1 || cell.rowSpan > 1));
}

function modifyTableRow(where){
  if (!currentCell) return;
  const row = currentCell.parentElement;
  if (!row) return;
  const table = row.closest('table');
  if (tableHasMergedCells(table)) {
    alert('Table row operations are disabled when merged cells are present.');
    return;
  }
  const container = row.parentElement;
  const clone = row.cloneNode(true);
  Array.from(clone.cells).forEach(cell => {
    cell.innerHTML = '<p><br></p>';
    cell.classList.remove('weditor_cell-selected');
  });
  if (where === 'above') container.insertBefore(clone, row);
  else container.insertBefore(clone, row.nextSibling);
  onDirty();
  const targetIndex = Math.min(currentCell.cellIndex, clone.cells.length - 1);
  selectTableCell(clone.cells[targetIndex]);
}

function modifyTableColumn(where){
  if (!currentCell) return;
  const table = currentCell.closest('table');
  if (!table) return;
  if (tableHasMergedCells(table)) {
    alert('Table column operations are disabled when merged cells are present.');
    return;
  }
  const index = currentCell.cellIndex;
  let inserted = null;
  Array.from(table.rows).forEach(row => {
    const reference = row.cells[index] || row.cells[row.cells.length - 1];
    const source = reference || document.createElement(row.parentElement.tagName.toLowerCase() === 'thead' ? 'th' : 'td');
    const newCell = source.cloneNode(false);
    newCell.innerHTML = '<p><br></p>';
    newCell.classList.remove('weditor_cell-selected');
    newCell.colSpan = 1;
    newCell.rowSpan = 1;
    newCell.style.cssText = source.style?.cssText || '';
    if (where === 'left'){
      row.insertBefore(newCell, row.cells[index] || null);
    } else {
      row.insertBefore(newCell, row.cells[index + 1] || null);
    }
    if (row === currentCell.parentElement) inserted = newCell;
  });
  onDirty();
  if (inserted) selectTableCell(inserted);
}

function deleteTableRow(){
  if (!currentCell) return;
  const table = currentCell.closest('table');
  if (!table) return;
  if (tableHasMergedCells(table)) {
    alert('Delete row is disabled when merged cells are present.');
    return;
  }
  const row = currentCell.parentElement;
  const rowIndex = Array.from(table.rows).indexOf(row);
  const cellIndex = currentCell.cellIndex;
  row.remove();
  onDirty();
  if (!table.rows.length){
    table.remove();
    dismissTableTools();
    return;
  }
  const nextRow = table.rows[Math.min(rowIndex, table.rows.length - 1)];
  if (!nextRow || !nextRow.cells.length){
    dismissTableTools();
    return;
  }
  const nextCell = nextRow.cells[Math.min(cellIndex, nextRow.cells.length - 1)];
  if (nextCell) selectTableCell(nextCell);
  else dismissTableTools();
}

function deleteTableColumn(){
  if (!currentCell) return;
  const table = currentCell.closest('table');
  if (!table) return;
  if (tableHasMergedCells(table)) {
    alert('Delete column is disabled when merged cells are present.');
    return;
  }
  const colIndex = currentCell.cellIndex;
  const rowIndex = Array.from(table.rows).indexOf(currentCell.parentElement);
  Array.from(table.rows).forEach(row => {
    if (row.cells[colIndex]) row.cells[colIndex].remove();
  });
  onDirty();
  if (!table.rows.length || !table.rows[0].cells.length){
    table.remove();
    dismissTableTools();
    return;
  }
  const targetRow = table.rows[Math.min(rowIndex, table.rows.length - 1)];
  const newIndex = Math.min(colIndex, targetRow.cells.length - 1);
  const nextCell = targetRow.cells[newIndex];
  if (nextCell) selectTableCell(nextCell);
  else dismissTableTools();
}

function toggleTableHeader(){
  if (!currentCell) return;
  const table = currentCell.closest('table');
  if (!table) return;
  if (tableHasMergedCells(table)) {
    alert('Header toggle is disabled when merged cells are present.');
    return;
  }
  const tbody = table.tBodies[0] || table.createTBody();
  if (table.tHead){
    const headRow = table.tHead.rows[0];
    if (headRow){
      const newRow = document.createElement('tr');
      Array.from(headRow.cells).forEach(cell => {
        const td = document.createElement('td');
        td.innerHTML = cell.innerHTML || '<p><br></p>';
        td.style.cssText = cell.style.cssText;
        td.colSpan = cell.colSpan;
        td.rowSpan = cell.rowSpan;
        newRow.appendChild(td);
      });
      tbody.insertBefore(newRow, tbody.firstChild);
      selectTableCell(newRow.cells[Math.min(currentCell.cellIndex, newRow.cells.length - 1)]);
    }
    table.deleteTHead();
  } else {
    if (!tbody.rows.length) return;
    const firstRow = tbody.rows[0];
    const thead = table.createTHead();
    const headRow = thead.insertRow();
    Array.from(firstRow.cells).forEach(cell => {
      const th = document.createElement('th');
      th.innerHTML = cell.innerHTML;
      th.style.cssText = cell.style.cssText;
      th.colSpan = cell.colSpan;
      th.rowSpan = cell.rowSpan;
      headRow.appendChild(th);
    });
    selectTableCell(headRow.cells[Math.min(currentCell.cellIndex, headRow.cells.length - 1)]);
    firstRow.remove();
    if (!tbody.rows.length){
      const filler = document.createElement('tr');
      Array.from(headRow.cells).forEach(()=>{
        const td = document.createElement('td');
        td.innerHTML = '<p><br></p>';
        filler.appendChild(td);
      });
      tbody.appendChild(filler);
    }
  }
  onDirty();
}

function setCellAlignment(mode){
  if (!currentCell) return;
  currentCell.style.textAlign = mode;
  onDirty();
  positionTableToolbar();
}

function applyCellBorder(mode){
  if (!currentCell) return;
  const borderStyle = '1px solid #000';
  if (mode === 'all'){
    currentCell.style.border = borderStyle;
  } else if (mode === 'none'){
    currentCell.style.border = 'none';
  } else {
    const map = { top: 'borderTop', right: 'borderRight', bottom: 'borderBottom', left: 'borderLeft' };
    const prop = map[mode];
    if (!prop) return;
    const computed = window.getComputedStyle(currentCell)[prop];
    const current = currentCell.style[prop];
    const isActive = current && current !== 'none' ? true : (computed && !/none|0px/.test(computed));
    currentCell.style[prop] = isActive ? 'none' : borderStyle;
  }
  onDirty();
  positionTableToolbar();
}

function getClosestCell(){
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node = sel.anchorNode;
  if (!node) return null;
  if (node.nodeType !== Node.ELEMENT_NODE) node = node.parentElement;
  if (!node) return null;
  return node.closest('td,th');
}

function syncTableSelection(){
  if (!isModalOpen){
    dismissTableTools();
    return;
  }
  const cell = getClosestCell();
  if (cell) selectTableCell(cell);
  else dismissTableTools();
}

function selectImage(img){
  if (currentImg && currentImg!==img) unmarkImage(currentImg);
  currentImg = img;
  naturalRatio = (img.naturalWidth && img.naturalHeight) ? (img.naturalHeight ? img.naturalWidth/img.naturalHeight : 1) : (img.width && img.height ? img.width/img.height : 1);
  img.classList.add('weditor_img-selected');
  ensureImgHandle(img);
  widthSlider.max = Math.max(1600, Math.round(getContentMaxWidth()));
  widthSlider.value = Math.round(img.width || 300);
  updateImgSizeLabel();
  showToolbarNear(img);
}

function unmarkImage(img){
  img.classList.remove('weditor_img-selected');
  const h = img._handleEl; if (h && h.parentNode) h.parentNode.removeChild(h);
  img._handleEl = null;
}

function ensureImgHandle(img){
  if (img._handleEl) return;
  const h = document.createElement('div');
  h.className = 'weditor_img-handle';
  h.style.position = 'absolute';
  // parent must be relative to position handle
  const posWrapper = img.parentElement;
  if (getComputedStyle(posWrapper).position === 'static') posWrapper.style.position = 'relative';
  posWrapper.appendChild(h);
  img._handleEl = h;
  positionHandle(img);
  // drag to resize
  let dragging=false, startX=0, startW=0;
  h.addEventListener('mousedown', (e)=>{
    e.preventDefault(); dragging=true; startX=e.clientX; startW=img.width;
    document.body.style.userSelect='none';
  });
  window.addEventListener('mousemove', (e)=>{
    if (!dragging) return;
    const dx = e.clientX - startX;
    applyImgWidth(Math.max(20, startW + dx));
  });
  window.addEventListener('mouseup', ()=>{
    if (dragging){ dragging=false; document.body.style.userSelect=''; onDirty(); }
  });
}

function positionHandle(img){
  const h = img._handleEl; if (!h) return;
  const r = img.getBoundingClientRect();
  const pr = img.parentElement.getBoundingClientRect();
  h.style.left = (r.right - pr.left - 5) + 'px';
  h.style.top  = (r.bottom - pr.top - 5) + 'px';
}

function showToolbarNear(img){
  imgTB.style.display = 'block';
  positionToolbar();
}
function positionToolbar(){
  if (!currentImg) return;
  const r = currentImg.getBoundingClientRect();
  const top = Math.max(8, r.top + window.scrollY - imgTB.offsetHeight - 10);
  const left = Math.min(window.scrollX + r.left, window.scrollX + window.innerWidth - imgTB.offsetWidth - 8);
  imgTB.style.top = top + 'px';
  imgTB.style.left = left + 'px';
  // update handle position too
  positionHandle(currentImg);
}
function dismissImageTools(){
  if (currentImg) unmarkImage(currentImg);
  currentImg = null;
  imgTB.style.display = 'none';
}

function applyImgWidth(w){
  if (!currentImg) return;
  currentImg.style.width = w + 'px';
  if (lockRatio.checked && naturalRatio){
    currentImg.style.height = Math.round(w / naturalRatio) + 'px';
  } else {
    currentImg.style.height = 'auto';
  }
  widthSlider.value = Math.round(w);
  updateImgSizeLabel();
  positionToolbar();
  onDirty();
}
function updateImgSizeLabel(){
  if (!currentImg){ sizeLabel.textContent = ''; return; }
  sizeLabel.textContent = `${Math.round(currentImg.getBoundingClientRect().width)}×${Math.round(currentImg.getBoundingClientRect().height)} px`;
}

function setImgAlign(where){
  if (!currentImg) return;
  currentImg.style.display = 'block';
  currentImg.style.float = 'none';
  currentImg.style.margin = '0';
  if (where==='left'){ currentImg.style.marginRight = 'auto'; }
  if (where==='center'){ currentImg.style.margin = '0 auto'; }
  if (where==='right'){ currentImg.style.marginLeft = 'auto'; }
  positionToolbar(); onDirty();
}
function setImgFloat(where){
  if (!currentImg) return;
  currentImg.style.display = 'inline-block';
  if (where==='left'){ currentImg.style.float = 'left'; currentImg.style.margin = '0 12px 8px 0'; }
  else if (where==='right'){ currentImg.style.float = 'right'; currentImg.style.margin = '0 0 8px 12px'; }
  else { currentImg.style.float = 'none'; currentImg.style.margin = '0'; }
  positionToolbar(); onDirty();
}
function toggleImgBorder(){
  if (!currentImg) return;
  const has = currentImg.style.border && currentImg.style.border !== 'none';
  currentImg.style.border = has ? 'none' : '1px solid #000';
  onDirty();
}
function setImgRadius(v){
  if (!currentImg) return;
  currentImg.style.borderRadius = v + 'px';
  onDirty();
}
function toggleImgShadow(){
  if (!currentImg) return;
  const has = currentImg.style.boxShadow && currentImg.style.boxShadow !== 'none';
  currentImg.style.boxShadow = has ? 'none' : '0 6px 18px rgba(0,0,0,.25)';
  onDirty();
}
function replaceImgURL(){
  if (!currentImg) return;
  const u = prompt('Image URL:', currentImg.src || '');
  if (!u) return;
  const safe = sanitizeUrl(u, 'src');
  if (!safe){
    alert('Please enter a safe image URL (http/https/data).');
    return;
  }
  currentImg.addEventListener('load', ()=> { updateImgSizeLabel(); positionToolbar(); }, { once: true });
  currentImg.src = safe;
  onDirty();
}
async function handleImgUpload(e){
  const file = e.target.files?.[0];
  e.target.value = '';
  if (!file) return;
  const replace = !pendingImageInsert && !!currentImg;
  await insertImageFile(file, { replace });
  pendingImageInsert = false;
}

async function insertImageFile(file, { replace = false } = {}){
  if (!file || !(file.type || '').startsWith('image/')) return;
  try {
    const dataUrl = await processImageFile(file);
    if (!dataUrl) return;
    if (replace && currentImg){
      currentImg.addEventListener('load', ()=> { updateImgSizeLabel(); positionToolbar(); }, { once: true });
      currentImg.src = dataUrl;
      onDirty();
    } else {
      execCmd('insertImage', dataUrl);
      onDirty();
      focusLastImage();
    }
  } catch (err) {
    console.error('Image insert failed', err);
    alert('Unable to insert image. Please try a different file.');
  }
}

async function processImageFile(file){
  const dataUrl = await readFileAsDataURL(file);
  if (!dataUrl) return '';
  const type = file.type || '';
  if (type === 'image/svg+xml' || type === 'image/gif') {
    return dataUrl;
  }
  const img = await loadImageElement(dataUrl);
  if (!img.naturalWidth || !img.naturalHeight) return dataUrl;
  const maxWidth = getContentMaxWidth();
  const needsResize = img.naturalWidth > maxWidth;
  const needsCompress = file.size > MAX_IMAGE_BYTES || needsResize;
  if (!needsCompress) return dataUrl;
  const targetWidth = Math.min(img.naturalWidth, maxWidth);
  const scale = targetWidth / img.naturalWidth;
  const targetHeight = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  const mimeType = type === 'image/png' ? 'image/png' : 'image/jpeg';
  const quality = mimeType === 'image/jpeg' ? IMAGE_QUALITY : 0.92;
  const compressed = canvas.toDataURL(mimeType, quality);
  if (compressed && (needsResize || compressed.length < dataUrl.length)) {
    return compressed;
  }
  return dataUrl;
}

function getContentMaxWidth(){
  if (!pageContent) return 1024;
  return Math.max(320, Math.floor(pageContent.clientWidth || 1024));
}

function readFileAsDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => resolve(ev.target?.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = ()=> resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function focusLastImage(){
  if (!isModalOpen) return;
  const imgs = editor.querySelectorAll('img');
  if (!imgs.length) return;
  selectImage(imgs[imgs.length - 1]);
}
function removeImg(){
  if (!currentImg) return;
  const p = currentImg.parentElement;
  currentImg.remove();
  if (p && p.classList?.contains('weditor_img-handle')) p.remove();
  dismissImageTools();
  onDirty();
}

// --- Insert image from toolbar button ---
document.getElementById('weditor_btnImage').addEventListener('click', ()=>{
  const raw = prompt('Image URL (or leave blank to upload):', '');
  if (raw && raw.trim()){
    const safe = sanitizeUrl(raw.trim(), 'src');
    if (!safe){
      alert('Please enter a safe image URL (http/https/data).');
      return;
    }
    execCmd('insertImage', safe);
    onDirty();
    focusLastImage();
  } else {
    pendingImageInsert = true;
    fileImgInput.click();
  }
});

// --- Table selection state etc. (optional active buttons) ---
document.addEventListener('selectionchange', ()=>{
  // could toggle .active on buttons using document.queryCommandState(cmd) if desired
  if (currentImg && !editor.contains(currentImg)) dismissImageTools();
  updateListStyleControl();
  syncTableSelection();
});
