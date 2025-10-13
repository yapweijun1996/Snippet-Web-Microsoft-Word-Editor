# 📄 Web Word Editor — PRD v1.3 (Final MVP)

> **目标**: 纯前端实现一个自包含 (self-contained) 的富文本编辑器代码片段 (snippet)，重点解决 Word 粘贴保真问题，并提供稳定的全屏编辑和草稿恢复功能。

🗓️ Date: 2025-10-13
👤 Owner: Wei Jun Yap (TNO)
📌 Status: **MVP Complete**

---

## 1. Purpose / 背景与目标

在 ERP/业务场景里，客户需要一个可以轻松集成的富文本编辑器，用于处理从 Microsoft Word 粘贴的内容。此 PRD 定义了一个纯前端、零依赖的编辑器代码片段，它保留了 Word 的基本格式，提供了核心编辑功能，并支持无缝的全屏编辑模式和可靠的草稿恢复。

**Success criteria / 成功口径**

*   ✅ **Snippet Portability**: The editor can be added to any page by simply copying and pasting a single `<script>` block.
*   ✅ **Paste Fidelity**: Pasting from Word retains essential formatting (headings, lists, tables, text styles) with ≥80% usability.
*   ✅ **Autosave & Recovery**: Drafts are saved automatically to `localStorage` on a per-field basis and are successfully restored after a page refresh.
*   ✅ **Fullscreen Mode**: The fullscreen editing experience is smooth, intuitive, and works across multiple editor instances.

---

## 2. Scope / 范围 (Final MVP)

**In (Implemented)**

*   ✅ **Self-Contained Snippet**: CSS is injected via JavaScript; no external files needed.
*   ✅ **Multi-Instance Support**: Can run multiple independent editors on the same page.
*   ✅ **Word Paste Handling**: Basic sanitization to retain core formatting while removing unsafe elements.
*   ✅ **Core Toolbar**: Includes text styling (B/I/U), headings, lists, alignment, links, images (URL), and tables.
*   ✅ **In-Place Fullscreen Mode**: A toolbar button expands the editor to fill the viewport for focused editing.
*   ✅ **Namespaced Autosave**: Content is saved to `localStorage`, keyed by page URL and field name to prevent conflicts.
*   ✅ **Draft Recovery**: Automatically loads saved drafts upon initialization.
*   ✅ **Custom Undo/Redo**: A 50-step history stack, independent of the browser's native implementation.
*   ✅ **Keyboard Shortcuts**: `Ctrl+Z`/`Ctrl+Y` for history; `Ctrl+F` and `Esc` for fullscreen mode.

**Out (Post-MVP)**

*   ❌ Complex pagination and print optimization.
*   ❌ DOCX import/export.
*   ❌ Advanced image handling (e.g., resizing, drag-and-drop upload).
*   ❌ Advanced table features (e.g., cell merging).

---

## 5. Functional Requirements / 功能需求 (Final)

**F-01 Snippet Architecture**
*   The entire editor is encapsulated in an IIFE (Immediately Invoked Function Expression).
*   On load, it injects its required CSS into the document's `<head>`.
*   It automatically discovers and builds editors for each `<div class="weditor">` and its subsequent `<textarea class="weditor_textarea">`.

**F-02 Fullscreen Mode**
*   A "Fullscreen" button (⛶) on the toolbar toggles the mode.
*   When active, the editor's wrapper element (`.weditor-wrap`) expands to cover the full viewport using `position: fixed`.
*   An "Exit" button is dynamically added. The `Esc` key also exits the mode.

**F-03 Autosave and Recovery**
*   Content is saved to `localStorage` 5 seconds after the user stops typing.
*   The storage key is unique per editor instance, e.g., `weditor-draft:http://.../page:tac`.
*   When an editor initializes, it checks for a corresponding draft in `localStorage` and loads it if found.

**F-04 Paste Handling**
*   On paste, the editor intercepts the event and gets the `text/html` content.
*   A sanitization function recursively cleans the HTML, removing unsafe tags and attributes while preserving an allowlist of formatting tags (e.g., `p`, `h1`, `strong`, `table`).

---

## 19. Acceptance / 验收标准 (Final)

*   [x] **Snippet Integration**: The editor can be successfully integrated into a new page by copy-pasting the script.
*   [x] **Word Paste**: Pasting from Word preserves basic formatting as specified.
*   [x] **Fullscreen**: Fullscreen mode can be entered and exited smoothly via the button and keyboard shortcuts.
*   [x] **Autosave**: Edits in multiple editors are correctly saved to distinct `localStorage` keys.
*   [x] **Recovery**: Refreshing the page successfully restores the last saved draft for each editor.
*   [x] **Undo/Redo**: The custom 50-step history works correctly, including keyboard shortcuts.
*   [x] **Dependencies**: The editor runs without any backend or external library dependencies.
