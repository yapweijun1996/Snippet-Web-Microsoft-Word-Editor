# 📄 Web Word Editor — PRD v1.1 (Revised)

> 目标：纯前端（HTML/CSS/JavaScript，无后端、无外部依赖）实现接近 Microsoft Word 的网页编辑体验；paste from Word 高保真、简洁 UI、稳定打印与导出。We'll blend CN/EN naturally so stakeholders on both sides can read smoothly.

🗓️ Date: 2025‑10‑09
👤 Owner: Wei Jun Yap (TNO)
✍️ Editor: ChatGPT
📌 Status: Draft v1.1 (for sign‑off)

---

## 1. Purpose / 背景与目标

在 ERP/业务场景里，客户会把需求或文档从 Microsoft Word 复制/导入到 Web 编辑器中进行微调与定稿。This PRD defines a front‑end‑only editor: keep Word formatting on paste, offer essential editing, stable pagination/print, and simple exports.

**Success criteria / 成功口径**

* Paste 保真 ≥ 90% for headings, bold/italic/underline, alignment, lists, tables, and images.
* Print to PDF 与屏幕页数一致（缩放 100%）；A4/A3/A5 准确。
* 用户 image resize 顺滑、无跑版；Undo/Redo ≥ 50 steps；crash 恢复有草稿。

---

## 2. Scope / 范围

**In (MVP v1.0)**

* Paste from Word → sanitize → normalize → edit in place
* Minimal toolbar（B/I/U、fontsize、paragraph style、align、lists、text color、背景色、insert image、insert table、insert page break）
* Page sizes: A3/A4/A5（屏幕预览 + 打印）
* Manual page break；basic auto pagination hints（避免在表格行中间断开）
* Image insert/resize（base64，保持纵横比；最大宽不超过内容宽）
* Export: Single‑file HTML（inline styles + base64 images） & Print→PDF（@media print）
* Autosave draft to localStorage；恢复草稿；Undo/Redo 50 步

**Out (later)**

* Real‑time collaboration，多人同时编辑
* Cloud storage / login
* Advanced tables（合并/拆分单元格、公式）
* 页眉/页脚/页码（v1.1+）
* Native DOCX import/export（v1.1+ 若允许前端库）

---

## 3. Personas & Key Use Cases / 角色与场景

* **Ops/PM（中文为主）**：复制 Word 需求→粘贴→轻编辑→导出 PDF 给甲方确认。
* **Sales/CS**：制作报价/说明书模板→统一样式→打印为 PDF。
* **Engineer**：在 ERP 中嵌入 editor modal，作为富文本输入窗口。

---

## 4. UX Principles / 设计原则

* 简洁直观、zero learning curve；toolbar 使用 icon + tooltip，文字尽量少但清晰。
* 内容即所见（WYSIWYG）；屏幕预览的纸张边界清晰（轻阴影）。
* Modal 有 focus trap、Esc 关闭，支持键盘导航；错误提示清晰。

---

## 5. Functional Requirements / 功能需求

**F‑01 Paste intake & sanitize（粘贴摄入与清洗）**

* 捕获 `paste`/`beforeinput`，优先读取 `text/html`；若无，用 `text/plain`。
* Sanitize allowlist（标签与样式见 §7）：移除脚本/事件属性/危险 URL。
* Normalize：去除 `mso-` 前缀样式、统一段落/列表/表格结构。

**F‑02 Editing core**

* ContentEditable 容器；基于 Selection/Range API 更新样式。
* 支持 B/I/U、字号（预设 8–48）、段落样式（Normal/H1–H3）、对齐、行高、列表（ul/ol，支持缩进/反缩进）。
* 快捷键：Ctrl/Cmd+B/I/U、Ctrl/Cmd+K（link）、Tab/Shift+Tab（list indent）、Ctrl/Cmd+Enter（page break）。

**F‑03 Tables（基础表格）**

* 插入表格（默认 3×3）、插/删 行列、单元格对齐、边框控制（支持 l/r/t/b 组合）。
* 粘贴表格：保留基本边框与对齐；避免跨页拆行（分页处保持整行）。

**F‑04 Images（图片）**

* 插入：上传文件 / 粘贴剪贴板图片 / 拖拽到编辑区；以 base64 内联。
* Resize handles（四角），默认锁定纵横比；按住 Shift 可解锁。
* 限制：单图最大 5MB，宽度不超过内容区；超限给出提示。

**F‑05 Pagination & Print（分页与打印）**

* Page sizes：A3 420×297mm，A4 297×210mm，A5 210×148mm。
* 默认边距：上/下/左/右 = 20mm（可在设置中调整）；屏幕预览显示纸张阴影。
* Manual page break 节点（可视化为水平虚线）；打印使用 `@media print`，强制 `@page { size: <paper>; margin: <mm>; }`；browser print scale = 100%。

**F‑06 Export（导出）**

* HTML：单文件导出，内联样式、图片 base64。
* PDF：调用浏览器打印（用户选择“另存为 PDF”），通过 @media print 保证分页一致。
* DOCX（可选，v1.1+）：若批准允许“纯前端库”，则引入 `docx`/`mammoth`；否则延后。

**F‑07 Persistence & Recovery（持久化与恢复）**

* Autosave：每 2s 节流写入 localStorage；崩溃或刷新后可恢复。
* 清理：在导出成功或用户「清空」时提供一键清理草稿。

**F‑08 Modal integration（集成）**

* 以 `<button>` 触发 modal 打开；modal 宽 80–90vw，最大 1200px；支持全屏切换。
* 提供简单事件回调：onOpen/onClose/onExport。

---

## 6. Non‑Functional / 非功能性

* **Front‑end only**；不依赖服务器或外部网络。
* **Performance**：50 页文档输入延迟 < 50ms；首次渲染 < 1000ms；图片懒加载。
* **Reliability**：Undo/Redo 50 步；草稿恢复成功率 100%。
* **Security**：XSS 清洗、CSP（见 §10）。
* **Compatibility**：桌面 Chrome/Edge ≥ 120、Firefox ≥ 120、Safari ≥ 16；移动端暂只读（MVP）。
* **Accessibility**：键盘可达、ARIA、对比度 AA。

---

## 7. Paste Allowlist / 粘贴白名单（工程落地）

**Allowed tags**: `p,h1,h2,h3,h4,h5,h6,span,b,strong,i,em,u,sup,sub,ul,ol,li,table,thead,tbody,tr,td,th,hr,img,a,br,div`（div 仅作容器，插入后尽量归一到 p/table 结构）。
**Allowed attrs**: `style,href,target,src,colspan,rowspan,alt`；禁止一切 `on*` 事件。
**Allowed styles**: `font-weight,font-style,text-decoration,color,background-color,font-size,line-height,text-align,vertical-align,margin,padding,border,border-*,border-collapse,list-style-type`。
**Strip**: `position,fixed,behavior,expression,filter,zoom,unicode-bidi` 以及任何 `javascript:`/`data:text/html` URL。
**Normalize**: 移除 `class^=Mso` 与 `mso-` 样式；将非标准列表、空段落、嵌套 span 统一精简。

---

## 8. Data Model & Serialization / 数据模型

* DOM 即 source of truth（简化架构）；插入/编辑时做规范化以减少奇异节点。
* Save/Export：HTML 单文件；将来可选 JSON schema（v1.2）用于模板复用。

---

## 9. Printing Spec / 打印规范

* `@page { size: A4|A3|A5; margin: 20mm; }`（margin 可配置）
* `@media print` 隐藏工具栏与非内容元素；强制图像 max-width: 100%。
* 避免在表格行中断页：对表格使用 `page-break-inside: avoid;`；分页符前后增加 1em 缓冲。

---

## 10. Security / 安全

* Sanitize on paste（白名单 + 移除 events/script/style 注入）
* CSP 建议：`default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self';`
* 可选：将编辑区置于 sandboxed iframe（提升隔离，复杂度↑）。

---

## 11. Performance Targets / 性能目标

* 100k+ DOM nodes 文档仍可响应；关键操作（输入/选区变化/按钮点击）< 50ms。
* 节流/防抖：resize、scroll、selectionchange。
* 图片懒加载 + 仅在可见区渲染 resize handles。

---

## 12. Compatibility Matrix / 兼容矩阵

| Platform       | Min Version | Notes                 |
| -------------- | ----------- | --------------------- |
| Chrome / Edge  | 120         | 推荐                    |
| Firefox        | 120         | paste 行为略异，纳入测试样例     |
| Safari (macOS) | 16          | selection/range 差异需适配 |
| iOS / Android  | 最新          | MVP 只读或轻编辑（不保证全部快捷键）  |

---

## 13. Accessibility / 无障碍

* Modal: `role=dialog`, `aria-labelledby`, focus trap, Esc 关闭。
* Toolbar：tab 可达、aria-pressed 状态同步；为图标提供 `aria-label`。
* 对比度 ≥ AA；键盘可插入分页（Ctrl/Cmd+Enter）。

---

## 14. QA & Acceptance / 测试与验收

**Sample pack（样例包）**：

1. 标题/段落/多级列表；
2. 大表格 + 合并单元格（观察降级策略）；
3. 图片混排（左/中/右）；
4. 50+ 页长文；
5. 中英混排与颜色/高亮。

**Acceptance checklist / 验收清单**（全过才算通过）：

* [ ] Paste 保真 ≥ 90%，无脚本/事件残留
* [ ] A3/A4/A5 预览与打印页数一致（100% scale）
* [ ] 手动分页可视、可编辑；表格不被拆行
* [ ] 图片插入/缩放稳定，超限提示有效
* [ ] Undo/Redo ≥ 50；刷新可恢复草稿
* [ ] HTML 导出再导入格式稳定
* [ ] 快捷键与 toolbar 状态同步
* [ ] 兼容矩阵全部通过手测
* [ ] 性能：50 页输入延迟 < 50ms

---

## 15. Milestones / 里程碑

* **M1（1–2 周）**：编辑容器 + paste 清洗 + 基础 toolbar + A4 预览 + HTML 导出 + autosave
* **M2（1–2 周）**：A3/A5 + 表格基础 + 图片插入/缩放 + 打印样式
* **M3（1 周）**：分页细化 + 快捷键完善 + QA 样例通过
* **M4（可选 1 周）**：页眉/页脚、DOCX（若允许前端库）

---

## 16. Risks & Mitigations / 风险与对策

* **Word 粘贴差异** → 建立样例集、白名单更新；回归测试脚本化
* **分页/打印不一致** → 固定 scale=100%、`@media print` 独立样式、表格避断
* **大文档卡顿** → 节流+懒加载、分页容器化
* **XSS** → 严格清洗 + CSP + 可选 iframe 隔离

---

## 17. Open Decisions / 待拍板

* DOCX 是否纳入 v1.1（允许使用前端库 `docx/mammoth`）？
* 移动端是否支持编辑（或仅只读）？
* 页眉/页脚/页码：进 v1.1 还是 v1.2？
* 表格合并/拆分：MVP 还是后续？

---

## 18. Owner Decisions — v1.2 Overrides / 业主拍板（立即生效）

> 来自你刚才的要求，我把“硬性约束”和“优先级”明确写死；以下内容**覆盖**前文不一致处。

### 18.1 Architecture & Packaging / 架构与打包

* **纯前端** only，**绝不**使用后端服务；允许使用 **Docker** 仅作为开发/演示打包容器（静态托管）。
* 允许引入 **前端‑only DOCX 处理库**：首选 **Mammoth.js**（你口头说“marmot.js”，此处按 Mammoth.js 记录）用于浏览器内 `.docx → HTML` 转换；不得调用服务器。
* 单人编辑工具（非协作），**不考虑**多人/多设备并发编辑。

### 18.2 Page & Print / 纸张与打印

* **A4 为唯一目标尺寸（MVP）**：297×210mm，默认边距 20mm；A3/A5 延后。
* 打印以 `@media print` + `@page { size: A4; }` 实现；浏览器打印缩放固定 100%。

### 18.3 Editing Scope / 编辑范围（MVP 收敛）

* **快捷键：本期不做**（完全通过 toolbar 操作）。
* **粘贴保真目标升级**：从 Word 复制 → **版式尽可能一致**（目标 ≥95% 视觉一致度；表格/段落/列表/图片位置不漂移）。
* **图片**：支持粘贴/上传/拖拽；提供拖拽缩放（四角 handle，默认锁比例）。

  * **自动压缩**：当图片过大（> 2–5MB 或宽度超出内容区）时，前端使用 `<canvas>` 等比重采样压缩；质量目标在 0.7–0.85 范围内，肉眼无明显劣化。
* **列表样式（你特别点名）**：

  * 无序：`disc / circle / square`（相当于“radio‑like dots” 样式）。
  * 有序：`decimal / lower-alpha / upper-alpha / lower-roman / upper-roman`（1. a. A. i. I.）。
* **表格**：必须支持插入表格、行/列增删、表头行（thead）、单元格对齐、边框（l/r/t/b 组合）；合并/拆分单元格延后。
* **文本样式**：粗体/斜体/下划线、字号、对齐、行高、文字色/背景色、水平线（画线）。
* **撤销/重做**：必须支持，目标 50 步历史。

### 18.4 Modal Behavior / 全屏 Modal 行为

* 由按钮触发进入**全屏 modal**，编辑区占满视窗；`×` 关闭回到原页面。
* **自动保存**：在 modal 打开期间，定时将内容写入 `localStorage`。
* **URL‑namespaced 存储**：

  * 使用 **当前完整 URL** 作为 localStorage key 的命名空间（或者 `hash` 后的 8 位摘要）以区分不同 transaction。
  * 这样不同单据/事务不会互相覆盖；关闭 modal 或刷新后可从相同 URL 恢复。

### 18.5 Export Policy / 导出策略

* **HTML 单文件导出**（inline style + base64 images）。
* **PDF**：使用浏览器“打印为 PDF”。
* **DOCX 导入（可选）**：允许在浏览器内通过 Mammoth.js 把用户选取的 `.docx` 转成 HTML 后再进入编辑（**不要求**本期做 DOCX 导出）。

---

## 19. Acceptance — Updated / 验收口径（更新版）

* [ ] Word 粘贴后版式视觉一致度 **≥95%**（标题/段落/列表/表格/图片布局不漂移）。
* [ ] 仅 A4：屏幕页数与打印 PDF **一致**（100% 缩放）。
* [ ] 图片可粘贴/上传/拖拽并可缩放；超大自动压缩且清晰度可接受。
* [ ] 列表样式覆盖：`disc/circle/square` 与 `decimal/alpha/roman` 系列可选。
* [ ] 表格插入与行列增删、表头行、边框/对齐稳定；长表不被分页拆行。
* [ ] 撤销/重做 ≥ 50 步；关闭 modal 或刷新后，按 **URL 命名空间** 恢复内容。
* [ ] 导出 HTML 单文件成功；打印为 PDF 分页正确。
* [ ] 全程无后端依赖，资源可通过 Docker 静态托管运行。

---

## 20. Notes for Dev / 开发实现要点（补充）

* **Mammoth.js 集成**：用户选择 `.docx` → 前端读取 ArrayBuffer → Mammoth 转 HTML → 进入 sanitize→normalize→插入。若用户不导入文件，仍支持从 Word 直接粘贴路径。
* **Sanitize**：沿用 §7 白名单；严格移除 `on*` 事件与 `javascript:` URL；将 `Mso*` 样式归一。
* **Image 压缩**：使用 `<canvas>` 按最大内容宽度重采样；保持 EXIF 朝向；压缩质量自适应（目标 < 1MB/图）。
* **localStorage key**：例如 `webword:v1:${location.href}` 或 `webword:v1:${sha256(location.href).slice(0,8)}`。
* **性能**：粘贴后分批插入（microtask 分片），避免大 DOM 一次性 reflow；图片懒加载。
