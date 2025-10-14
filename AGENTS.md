### **Step 1 — Understand**

* Restate user’s coding request.
* Think hard about this.
* Confirm goal + key constraints (e.g., language, framework, no hardcoding).

---

### **Step 2 — CoT (Reasoning)**

* Break request into smaller coding tasks.
* Identify key facts, edge cases, assumptions.
* Consider 1–2 implementation options, pick the best.
  👉 Keep CoT ≤5 bullets, clear and concise.

---

### **Step 3 — Code Response**

* Provide **final code** (copy-paste-ready).
* Add **minimal explanation** only if necessary for context.
* Code must respect:

  * ✅ User requirements
  * ✅ Chosen reasoning path
  * ✅ Maintainability (readable, modifiable)

---

### **Step 4 — Quick Check**

* ⚠️ Blind spot?
* ❌ Likely bug/failure mode?
* 🔄 Is the code reversible or safe to test?
  👉 Max 3 bullets.

---

### **Step 5 — Response**

* Generate response to user.

---

## Rules

### Main Rules
-reply me in mandarin, 
-review code logic,
-step by step with small action,
-breakdown ideas in listing format, eg: 1,2,3.....

### Code Response
- Before answering, review the provided code or codebase or .md to understand its logic. Only then make amendments or provide the final response.
- Always tie the **final code** back to the user query + reasoning.  
- Keep explanations short → code first.  
- If task is trivial → collapse into: **Understand → Code → Summary**.  
- Reflection limited to ≤3 bullets.  
- No irrelevant detail or brain dumps.  

### Language Style
- Reply in **Mandarin + English mixed**.  
- Default: write in Mandarin + English.  
- When using an **uncommon, abstract, or logically difficult word/phrase**, add a **short Mandarin explanation** immediately after it.  
- Format: `(中文解释: …)` after the word/phrase, OR collect them in a short **PS note** at the end.  
- Do NOT give full sentence-by-sentence translations. Only explain the difficult words/phrases.  
- Keep the reply natural, using Mandarin only when it helps understanding.  



# Repository Guidelines

## Project Structure & Module Organization
- `weditor.js` holds the self-contained editor snippet; treat it as the single source of truth for business logic, styling injection, and autosave.
- `index.html` is a minimal harness used for local smoke checks with three editor instances.
- `test001.docx` and `test002.docx` are Word fixtures for paste-fidelity validation; keep their formatting intact.
- `prd.md` captures the product contract; update it only when scope or success criteria change and mirror those updates in code comments where relevant.

## Build, Test, and Development Commands
- `python3 -m http.server 8080` (run from repo root) launches a static server so you can preview `index.html` locally.
- `open http://localhost:8080/index.html` or use your preferred browser to exercise the editor UI and paste workflows.
- No bundler is required; ensure any new assets remain zero-dependency and work via a single `<script src="./weditor.js"></script>`.

## Coding Style & Naming Conventions
- JavaScript: 2-space indentation, double quotes for strings, prefer `const`/`let` and avoid `var`.
- Keep toolbar/action identifiers short but descriptive (e.g., `"Bold"`, `"InsertTable"`); maintain the existing camelCase helper naming.
- Inline comments should explain intent around Word normalization, autosave cadence, or delta calculations; avoid restating code.
- When adding CSS inside `CSS_TEXT`, group related rules and keep selectors scoped to `.weditor-*` to prevent leakage.

## Testing Guidelines
- Run manual paste tests using the provided `.docx` fixtures plus any new customer samples; verify headings, tables, and lists survive sanitization.
- Exercise autosave by editing each textarea, refreshing the page, and confirming draft restoration per field.
- Browser matrix: at minimum validate Chrome and Edge latest; log regressions and mitigation in `prd.md`.
- No automated test suite exists today; if you add one, document the command here and keep coverage notes in this section.

## Commit & Pull Request Guidelines
- Follow the current short, imperative commit style (e.g., `Update paste sanitizer`, `Add table width controls`); include one logical change per commit.
- PRs should summarize scope, list manual test evidence (paste scenarios, autosave checks, fullscreen), and attach screenshots or GIFs for UI tweaks.
- Reference related issues or PRD sections; call out backward-compatibility concerns, especially changes touching storage keys or toolbar layout.

## Security & Configuration Tips
- The editor stores drafts in `localStorage` using field names; when adding new identifiers, ensure they remain unique per page.
- Sanitization strips unsafe tags—if you broaden allowed HTML, review against XSS risks and document the rationale in `prd.md`.
