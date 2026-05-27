# 🎓 Portfolio - Dự án cá nhân

> Website Portfolio cá nhân được xây dựng với HTML, CSS & JavaScript thuần (Vanilla). Trình bày kỹ năng, dự án bài tập và hành trình học tập.

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Hướng dẫn chạy](#-hướng-dẫn-chạy)
- [Chỉnh sửa thông tin cá nhân](#-chỉnh-sửa-thông-tin-cá-nhân)
- [Thêm nội dung bài tập](#-thêm-nội-dung-bài-tập)
- [Cấu trúc content.json](#-cấu-trúc-contentjson)
- [Tùy chỉnh giao diện](#-tùy-chỉnh-giao-diện)
- [Kiến trúc kỹ thuật](#-kiến-trúc-kỹ-thuật)

---

## 🌟 Tổng quan

Website có **3 trang chính**:

| Trang | Route | Mô tả |
|-------|-------|--------|
| **Giới thiệu** | `#/intro` | Thông tin cá nhân, kỹ năng, mục tiêu nghề nghiệp |
| **Dự án** | `#/projects` | 6 bài tập thành phần với nội dung chi tiết |
| **Tổng kết** | `#/summary` | Trải nghiệm, bài học rút ra, kế hoạch tương lai |

### Tính năng nổi bật

- ✨ **SPA (Single Page Application)** - Chuyển trang mượt mà, không reload
- 🎨 **Dark theme hiện đại** - Glassmorphism, gradient accents, particle background
- 📱 **Responsive** - Hiển thị tốt trên mọi thiết bị
- 🎭 **Animations** - Scroll reveal, hover effects, progress bar animations
- 📂 **Project system** - Nội dung bài tập được quản lý qua file JSON, dễ chỉnh sửa
- 🔗 **Deep linking** - Truy cập trực tiếp bài tập qua URL (ví dụ: `#/projects/3`)

---

## 📁 Cấu trúc thư mục

```
Portfolio/
├── index.html                 # Entry point
├── README.md                  # File này
│
├── css/                       # 🎨 Styles
│   ├── variables.css          # Design tokens (màu, font, spacing)
│   ├── base.css               # Reset, typography
│   ├── layout.css             # Grid, containers, page structure
│   ├── components.css         # Cards, buttons, tags, modals
│   ├── animations.css         # Keyframes & animation classes
│   ├── responsive.css         # Navbar + media queries
│   └── pages/
│       ├── intro.css          # Styles trang Giới thiệu
│       ├── projects.css       # Styles trang Dự án
│       └── summary.css        # Styles trang Tổng kết
│
├── js/                        # ⚡ JavaScript
│   ├── app.js                 # Main entry - khởi tạo router & modules
│   ├── router.js              # SPA router (hash-based)
│   ├── components/
│   │   ├── navbar.js          # Navigation bar
│   │   ├── pageTransition.js  # Page transition animations
│   │   ├── scrollReveal.js    # Scroll-based reveal effects
│   │   ├── particleBg.js     # Animated particle background
│   │   └── projectCard.js     # Project card rendering
│   └── pages/
│       ├── intro.js           # Trang Giới thiệu (data + render)
│       ├── projects.js        # Trang Dự án (loads JSON, renders cards)
│       └── summary.js         # Trang Tổng kết (data + render)
│
└── projects/                  # 📂 Nội dung bài tập
    ├── bai-tap-1/
    │   ├── content.json       # Metadata + nội dung
    │   └── assets/            # Hình ảnh, file đính kèm
    ├── bai-tap-2/
    ├── bai-tap-3/
    ├── bai-tap-4/
    ├── bai-tap-5/
    └── bai-tap-6/
```

---

## 🚀 Hướng dẫn chạy

### Cách 1: Live Server (VS Code) — ĐỀ NGHỊ

1. Cài extension **Live Server** trong VS Code
2. Click chuột phải vào `index.html` → **Open with Live Server**
3. Website sẽ mở tại `http://127.0.0.1:5500`

### Cách 2: Python HTTP Server

```bash
cd Portfolio
python3 -m http.server 8000
# Mở http://localhost:8000
```

### Cách 3: Node.js

```bash
npx -y serve .
```

> ⚠️ **Lưu ý quan trọng**: Không thể mở trực tiếp file `index.html` bằng trình duyệt (file://) vì website sử dụng ES Modules (`import/export`) và `fetch()` để load JSON. Bạn **bắt buộc phải chạy qua một local server**.

---

## ✏️ Chỉnh sửa thông tin cá nhân

### Trang Giới thiệu

Mở file **`js/pages/intro.js`** và tìm object `PERSONAL_INFO` ở đầu file:

```javascript
const PERSONAL_INFO = {
  name: 'Nguyễn Văn A',           // ← Tên của bạn
  greeting: 'Xin chào, mình là',
  subtitle: 'Sinh viên ngành...',  // ← Giới thiệu ngắn
  school: 'Trường Đại học XYZ',   // ← Tên trường
  major: 'Kỹ thuật Số & CNTT',    // ← Ngành học
  // ... các trường khác
};
```

### Trang Tổng kết

Mở file **`js/pages/summary.js`** và tìm object `SUMMARY_DATA` ở đầu file:

```javascript
const SUMMARY_DATA = {
  stats: [...],           // Thống kê
  experiences: [...],     // Trải nghiệm
  lessons: [...],         // Bài học rút ra
  skillsAcquired: [...],  // Kỹ năng đạt được
  futurePlans: [...]      // Kế hoạch tương lai
};
```

---

## 📝 Thêm nội dung bài tập

### Bước 1: Mở file content.json

Mỗi bài tập có một file `content.json` trong thư mục `projects/bai-tap-X/`:

```
projects/bai-tap-1/content.json  ← Chỉnh sửa file này
```

### Bước 2: Cập nhật metadata

```json
{
  "id": 1,
  "title": "Tiêu đề bài tập",
  "subtitle": "Bài tập X - Mục Y.Z",
  "icon": "📁",
  "description": "Mô tả ngắn gọn...",
  "tags": ["Tag1", "Tag2"],
  "status": "done",
  "displayMode": "parsed"
}
```

| Trường | Giá trị | Mô tả |
|--------|---------|--------|
| `status` | `"done"` / `"wip"` / `"todo"` | Trạng thái: Hoàn thành / Đang làm / Chưa bắt đầu |
| `displayMode` | `"parsed"` / `"embedded"` / `"hybrid"` | Cách hiển thị nội dung (xem bên dưới) |

### Bước 3: Thêm nội dung vào sections

```json
{
  "sections": [
    { "type": "heading", "content": "Tiêu đề" },
    { "type": "text", "content": "Đoạn văn bản..." },
    { "type": "image", "src": "assets/screenshot.png", "caption": "Mô tả ảnh" },
    { "type": "code", "content": "console.log('hello')" },
    { "type": "list", "ordered": false, "items": ["Item 1", "Item 2"] }
  ]
}
```

### Bước 4: Thêm hình ảnh

1. Tạo thư mục `assets/` bên trong folder bài tập
2. Đặt file ảnh vào đó
3. Tham chiếu trong JSON: `"src": "assets/ten-anh.png"`

---

## 📐 Cấu trúc content.json

### Các loại section hỗ trợ

| Type | Mô tả | Thuộc tính |
|------|--------|------------|
| `heading` | Tiêu đề | `content`, `level` (2-4, mặc định 2) |
| `text` | Đoạn văn | `content` (hỗ trợ HTML inline) |
| `list` | Danh sách | `items[]`, `ordered` (true/false) |
| `image` | Hình ảnh | `src`, `caption` (tùy chọn) |
| `code` | Code block | `content`, `language` (tùy chọn) |
| `embed` | iframe nhúng | `src`, `height` (mặc định "400px") |
| `divider` | Đường kẻ ngang | (không có thuộc tính) |

### Chế độ hiển thị (displayMode)

#### `"parsed"` (Mặc định - Khuyên dùng)
Nội dung từ `sections[]` được parse thành HTML đẹp trên trang Portfolio.
**Dùng khi:** Bài tập có nội dung dạng text, hình ảnh, code snippets.

#### `"embedded"`
Nhúng file HTML riêng bằng iframe.
```json
{
  "displayMode": "embedded",
  "embedSrc": "index.html",
  "embedHeight": "600px"
}
```
**Dùng khi:** Bài tập có demo tương tác riêng (mini website, app).

#### `"hybrid"`
Kết hợp: hiển thị metadata + sections, đồng thời có thể nhúng embed trong sections.
**Dùng khi:** Bài tập vừa có mô tả vừa có phần demo.

### Ví dụ content.json hoàn chỉnh

```json
{
  "id": 1,
  "title": "Thao tác với tệp tin và thư mục",
  "subtitle": "Bài tập 1 - Mục 3.4",
  "icon": "📁",
  "description": "Trình bày cấu trúc thư mục tối ưu...",
  "tags": ["File System", "Organization"],
  "status": "done",
  "displayMode": "parsed",
  "sections": [
    {
      "type": "heading",
      "content": "1. Giới thiệu"
    },
    {
      "type": "text",
      "content": "Trong bài tập này, mình đã thực hành..."
    },
    {
      "type": "image",
      "src": "assets/folder-structure.png",
      "caption": "Cấu trúc thư mục dự án"
    },
    {
      "type": "heading",
      "content": "2. Quy tắc đặt tên"
    },
    {
      "type": "list",
      "ordered": true,
      "items": [
        "Dùng chữ thường, phân cách bằng dấu gạch ngang",
        "Không dùng ký tự đặc biệt hoặc dấu cách",
        "Tên file phản ánh nội dung bên trong"
      ]
    },
    {
      "type": "code",
      "content": "bai-tap-01/\n├── assets/\n│   ├── screenshot-01.png\n│   └── screenshot-02.png\n├── content.json\n└── README.md"
    },
    {
      "type": "heading",
      "content": "3. Kết quả"
    },
    {
      "type": "text",
      "content": "Sau khi áp dụng các quy tắc, việc tìm kiếm và quản lý file trở nên dễ dàng hơn rất nhiều."
    }
  ]
}
```

---

## 🎨 Tùy chỉnh giao diện

### Đổi bảng màu

Mở file **`css/variables.css`** và thay đổi các biến:

```css
:root {
  --accent-start: #00d4aa;   /* Màu accent chính */
  --accent-mid:   #00b4d8;   /* Màu accent phụ */
  --accent-end:   #7c3aed;   /* Màu accent thứ 3 */
  
  --bg-primary:   #06060b;   /* Màu nền chính */
  --text-primary: #e2e8f0;   /* Màu chữ chính */
}
```

### Đổi font

Thay đổi trong `css/variables.css`:

```css
--font-heading: 'Space Grotesk', sans-serif;  /* Font tiêu đề */
--font-body:    'Inter', sans-serif;           /* Font nội dung */
```

Nhớ cập nhật link Google Fonts trong `index.html` nếu dùng font khác.

### Thêm trang mới

1. Tạo file CSS: `css/pages/new-page.css`
2. Tạo file JS: `js/pages/newPage.js` (export `renderNewPage()`)
3. Trong `js/app.js`:
   ```javascript
   import { renderNewPage } from './pages/newPage.js';
   // Trong constructor:
   this.router.addRoute('new-page', renderNewPage);
   ```
4. Thêm link trong `js/components/navbar.js` array `NAV_ITEMS`
5. Link CSS mới trong `index.html`

---

## 🏗 Kiến trúc kỹ thuật

### SPA Router

- **Hash-based routing**: URL dạng `#/route/param`
- **Deep linking**: Truy cập trực tiếp `#/projects/3` để mở bài tập số 3
- **Browser history**: Hỗ trợ nút back/forward

### Page Transitions

- Fade out trang hiện tại → Fade in trang mới
- Scroll to top tự động khi chuyển trang
- Không reload trang

### Project Loading

```
User clicks card → URL changes to #/projects/1
                 → Router detects param
                 → Loads content.json via fetch()
                 → Renders detail view
                 → Initializes scroll reveal
```

### Hiệu suất

- **Lazy rendering**: Mỗi trang chỉ render khi được truy cập
- **Content caching**: JSON chỉ fetch 1 lần, cache trong memory
- **IntersectionObserver**: Animations chỉ chạy khi element visible
- **requestAnimationFrame**: Particle background tối ưu
