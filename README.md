# 📄 Web Word Editor

A **self-contained, zero-dependency rich text editor** designed specifically for business applications that need reliable Microsoft Word paste fidelity and advanced table manipulation capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version: 1.3](https://img.shields.io/badge/Version-1.3-blue.svg)](https://github.com/your-repo/web-word-editor)

## 🌟 Key Features

### **Snippet-Portable Integration**
- **Single script inclusion** - add rich text editing to any webpage with one `<script>` tag
- **Zero external dependencies** - no frameworks, no CDN requirements, no build process
- **CSS auto-injection** - styles included via JavaScript for true portability

### **Microsoft Word Paste Fidelity**
- **Smart content sanitization** - preserves essential formatting (headings, lists, tables, styles)
- **≥80% formatting retention** - maintains document structure and visual hierarchy
- **Safe HTML handling** - removes potentially dangerous tags while keeping content intact

### **Advanced Table Tools**
- **Visual table manipulation** - drag-to-resize columns and tables
- **Border styling system** - comprehensive border width, style, and color controls
- **Row/column operations** - insert, delete, and manage table structure
- **Auto-fit and distribution** - intelligent column width management

### **Professional User Experience**
- **Fullscreen editing mode** - distraction-free writing environment
- **Custom undo/redo system** - 50-step history independent of browser limitations
- **Autosave & recovery** - automatic draft preservation with field-specific storage
- **Keyboard shortcuts** - `Ctrl+Z/Y` for undo/redo, `Ctrl+F`/`Esc` for fullscreen

## 🚀 Quick Start

### Basic Integration

Add the editor to any HTML page with just two elements:

```html
<!-- 1. Create editor container -->
<div class="weditor"></div>

<!-- 2. Add paired textarea for form submission -->
<textarea class="weditor_textarea" name="content" style="display:none;"></textarea>

<!-- 3. Include the editor script -->
<script src="weditor.js"></script>
```

**That's it!** The editor will automatically discover and enhance all `.weditor` elements on your page.

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Application</title>
</head>
<body>
    <form action="/submit" method="post">
        <div>
            <label>Document Content:</label>
            <div class="weditor"></div>
            <textarea class="weditor_textarea" name="document_content" style="display:none;"></textarea>
        </div>
        <button type="submit">Save</button>
    </form>

    <script src="weditor.js"></script>
</body>
</html>
```

## 📋 Feature Overview

### Text Formatting
- **Bold, Italic, Underline** - standard text styling options
- **Headings (H1, H2)** - document structure formatting
- **Lists** - bulleted and numbered lists
- **Alignment** - left, center, right text alignment
- **Clear Formatting** - remove all styling from selection

### Content Insertion
- **Hyperlinks** - URL insertion with security validation
- **Images** - URL-based image embedding
- **Tables** - interactive table creation and management
- **Horizontal Rules** - visual content separation

### Advanced Functionality
- **HTML Source View** - toggle between visual and code editing
- **Fullscreen Mode** - immersive editing experience
- **Multi-instance Support** - multiple editors per page
- **Draft Recovery** - automatic content restoration after page refresh

## 🛠️ Development & Testing

### Local Development Server

```bash
# Start local server (Python 3)
python3 -m http.server 8080

# Or use any other static server
# Then open: http://localhost:8080/index.html
```

### Browser Compatibility

✅ **Chrome** (latest)
✅ **Edge** (latest)
✅ **Firefox** (latest)
✅ **Safari** (latest)

### Test Files Included

- `test001.docx`, `test002.docx` - Word document fixtures for paste testing
- `index.html` - development harness with multiple editor instances

## 🏗️ Architecture

### Design Philosophy
- **Self-Contained**: Entire editor in single JavaScript file with embedded CSS
- **Zero Dependencies**: No external libraries or framework requirements
- **Progressive Enhancement**: Graceful fallback if JavaScript disabled
- **Form Integration**: Seamless integration with existing HTML forms

### Technical Implementation
- **IIFE Pattern**: Immediately Invoked Function Expression for clean encapsulation
- **Event-Driven**: Modern event handling with proper cleanup
- **localStorage**: Field-specific draft storage with unique keys per page
- **ContentEditable**: Standards-based rich text editing

## 🔧 Customization

### Styling
The editor includes comprehensive CSS that can be customized by modifying the `CSS_TEXT` variable in `weditor.js`. All styles use the `.weditor-*` prefix to prevent conflicts.

### Configuration
Key settings can be adjusted in the editor source:

```javascript
// Example customizations
const WEditorConfig = {
  historySize: 50,        // Undo/redo history depth
  autosaveDelay: 500,     // Autosave delay in milliseconds
  minColumnWidth: 40,     // Minimum table column width
  storagePrefix: 'weditor-draft'  // localStorage key prefix
};
```

## 📝 Usage Scenarios

### ERP Systems
Perfect for enterprise resource planning applications requiring rich text document editing with structured content like:
- Contract management
- Knowledge base articles
- Project documentation
- Customer communication templates

### Content Management
Ideal for CMS systems needing:
- Article authoring
- Product descriptions
- User-generated content
- Template-based editing

### Business Applications
Suitable for any business application requiring:
- Report generation
- Note-taking capabilities
- Structured document creation
- Collaborative editing interfaces

## 🤝 Contributing

### Development Guidelines
- Follow existing code style (2-space indentation, double quotes)
- Maintain zero-dependency requirement
- Test across supported browsers
- Update `prd.md` for any scope changes

### Commit Style
```
Add table border controls
Update paste sanitizer for better Word compatibility
Fix fullscreen mode keyboard handling
```

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues, feature requests, or questions:
1. Check existing documentation in `prd.md`
2. Review browser compatibility notes
3. Test with provided Word document fixtures
4. Verify integration follows the provided HTML structure

---

**Built with ❤️ for business users who need reliable Word paste handling and professional rich text editing capabilities.**