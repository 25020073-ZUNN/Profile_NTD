import os
import re
import json
import subprocess
import html

# ── Paths ──
BASE_DIR = r"C:\Users\Admin\Documents\NTD_Profile"
INTRO_JS_PATH = os.path.join(BASE_DIR, "js", "pages", "intro.js")
SUMMARY_JS_PATH = os.path.join(BASE_DIR, "js", "pages", "summary.js")
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")
HTML_OUT_PATH = os.path.join(BASE_DIR, "print_temp.html")
PDF_OUT_PATH = os.path.join(BASE_DIR, "portfolio.pdf")

# ── JS Parsing Utilities ──
def extract_js_object(content, var_name):
    pattern = r'(?:const|let|var)\s+' + var_name + r'\s*=\s*\{'
    match = re.search(pattern, content)
    if not match:
        raise ValueError(f"Could not find variable: {var_name}")
    
    start_idx = match.end() - 1  # Starting {
    brace_count = 0
    end_idx = -1
    
    for i in range(start_idx, len(content)):
        char = content[i]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i + 1
                break
                
    if end_idx == -1:
        raise ValueError(f"No matching closing brace found for: {var_name}")
        
    return content[start_idx:end_idx]

def js_to_json(js_str):
    # Remove single-line comments
    js_str = re.sub(r'//.*?\n', '\n', js_str)
    # Remove block comments
    js_str = re.sub(r'/\*.*?\*/', '', js_str, flags=re.DOTALL)
    
    result = []
    i = 0
    in_single_quote = False
    in_double_quote = False
    escaped = False
    
    while i < len(js_str):
        c = js_str[i]
        if escaped:
            result.append(c)
            escaped = False
            i += 1
            continue
        if c == '\\':
            result.append(c)
            escaped = True
            i += 1
            continue
        if c == "'":
            if not in_double_quote:
                in_single_quote = not in_single_quote
                result.append('"')
            else:
                result.append(c)
        elif c == '"':
            if not in_single_quote:
                in_double_quote = not in_double_quote
                result.append('"')
            else:
                result.append('\\"')
        else:
            result.append(c)
        i += 1
        
    json_like = "".join(result)
    
    # Quote unquoted keys
    quoted_keys = re.sub(r'(?<=[{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'"\1":', json_like)
    quoted_keys = re.sub(r'(?<=\{)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'"\1":', quoted_keys)
    
    # Remove trailing commas
    clean_json = re.sub(r',\s*\}', '}', quoted_keys)
    clean_json = re.sub(r',\s*\]', ']', clean_json)
    
    return clean_json

def load_js_variable(file_path, var_name):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    obj_str = extract_js_object(content, var_name)
    json_str = js_to_json(obj_str)
    return json.loads(json_str)

# ── Render Utilities ──
def escape_html(text):
    return html.escape(text)

def render_sections(sections, project_id):
    html_elements = []
    for section in sections:
        sec_type = section.get('type')
        if sec_type == 'heading':
            level = section.get('level', 2)
            content = section.get('content')
            html_elements.append(f"<h{level} class='section-heading'>{content}</h{level}>")
        elif sec_type == 'text':
            content = section.get('content')
            # Text can contain HTML tags in content.json
            html_elements.append(f"<p class='section-text'>{content}</p>")
        elif sec_type == 'list':
            ordered = section.get('ordered', False)
            tag = 'ol' if ordered else 'ul'
            items = section.get('items', [])
            items_html = "".join(f"<li>{item}</li>" for item in items)
            html_elements.append(f"<{tag} class='section-list'>{items_html}</{tag}>")
        elif sec_type == 'image':
            src = section.get('src')
            caption = section.get('caption', '')
            if not src.startswith('http'):
                src = f"projects/bai-tap-{project_id}/{src}"
            caption_html = f"<div class='image-caption'>{caption}</div>" if caption else ""
            html_elements.append(f"<div class='image-container'><img src='{src}' alt='{caption}'>{caption_html}</div>")
        elif sec_type == 'code':
            content = section.get('content')
            html_elements.append(f"<pre class='section-code'><code>{escape_html(content)}</code></pre>")
        elif sec_type == 'divider':
            html_elements.append("<hr class='section-divider'>")
    return "\n".join(html_elements)

# ── Main Generator ──
def main():
    print("Loading project configuration files...")
    try:
        personal_info = load_js_variable(INTRO_JS_PATH, "PERSONAL_INFO")
        print("-> PERSONAL_INFO loaded successfully!")
    except Exception as e:
        print("-> Error loading PERSONAL_INFO:", e)
        return
        
    try:
        summary_data = load_js_variable(SUMMARY_JS_PATH, "SUMMARY_DATA")
        print("-> SUMMARY_DATA loaded successfully!")
    except Exception as e:
        print("-> Error loading SUMMARY_DATA:", e)
        return

    projects = []
    for i in range(1, 7):
        json_path = os.path.join(PROJECTS_DIR, f"bai-tap-{i}", "content.json")
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                projects.append(json.load(f))
            print(f"-> Loaded project {i} content.json")
        else:
            print(f"-> Project {i} content.json not found!")
            return

    print("Compiling HTML report...")
    
    # ── CSS Template ──
    css_content = "<style>\n" + """
    :root {
      --primary-color: #0f172a;   /* Slate 900 - Deep navy */
      --secondary-color: #2563eb; /* Blue 600 - Tech blue */
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --bg-subtle: #f1f5f9;
      --accent-color: #10b981;    /* Green 500 - Success badge */
      
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      
      --text-xs: 0.75rem;
      --text-sm: 0.875rem;
      --text-base: 1rem;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background: white;
      font-size: 11pt;
    }
    
    /* Cover Page */
    .cover-page {
      height: 245mm;
      border: 4px double var(--primary-color);
      margin: 0 auto;
      padding: 20mm 15mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      page-break-after: always;
      break-after: page;
    }
    
    .cover-header {
      font-size: 13pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--primary-color);
    }
    
    .cover-subheader {
      font-size: 11pt;
      font-weight: 600;
      color: var(--text-muted);
      margin-top: 5px;
    }
    
    .cover-divider {
      width: 60px;
      height: 1.5px;
      background-color: var(--border-color);
      margin: 15px auto;
    }
    
    .cover-title-container {
      margin: auto 0;
    }
    
    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1.3;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .cover-subtitle {
      font-size: 13pt;
      color: var(--text-secondary);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.5;
    }
    
    .cover-details-table {
      width: 100%;
      max-width: 500px;
      border-collapse: collapse;
      text-align: left;
      margin-bottom: 30px;
    }
    
    .cover-details-table tr {
      border-bottom: 1px dashed var(--border-color);
    }
    
    .cover-details-table tr:last-child {
      border-bottom: none;
    }
    
    .cover-details-table td {
      padding: 10px 0;
      font-size: 10.5pt;
    }
    
    .cover-details-table td.label {
      font-weight: bold;
      color: var(--text-primary);
      width: 38%;
    }
    
    .cover-date {
      font-size: 10.5pt;
      font-weight: 500;
      color: var(--text-muted);
    }
    
    /* Layout and Sections */
    .report-section {
      padding: 10mm 0;
      page-break-after: always;
      break-after: page;
      max-width: 175mm;
      margin: 0 auto;
    }
    
    .report-section:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    .section-title {
      font-size: 18pt;
      color: var(--primary-color);
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 20px;
      text-transform: uppercase;
      font-weight: 800;
    }
    
    .columns {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    
    .column-left {
      width: 48%;
    }
    
    .column-right {
      width: 48%;
    }
    
    .column-title {
      color: var(--primary-color);
      border-left: 4px solid var(--primary-color);
      padding-left: 10px;
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 13pt;
      font-weight: 700;
    }
    
    .info-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .info-table td {
      padding: 5px 0;
      font-size: 10.5pt;
      border-bottom: 1px solid var(--border-color);
    }
    
    .info-table tr:last-child td {
      border-bottom: none;
    }
    
    .info-table td.label {
      font-weight: bold;
      color: var(--text-primary);
      width: 32%;
    }
    
    .quote-box {
      background: var(--bg-subtle);
      padding: 10px 12px;
      border-radius: 6px;
      border-left: 4px solid var(--secondary-color);
      margin-top: 10px;
    }
    
    .quote-text {
      font-style: italic;
      margin: 0;
      color: var(--text-secondary);
      font-size: 10pt;
    }
    
    .quote-author {
      text-align: right;
      font-weight: bold;
      margin: 4px 0 0 0;
      font-size: 9pt;
      color: var(--text-primary);
    }
    
    /* Skills progress bars */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 30px;
      margin-top: 10px;
    }
    
    .skill-item {
      margin-bottom: 5px;
    }
    
    .skill-meta {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 10pt;
      margin-bottom: 4px;
      color: var(--text-primary);
    }
    
    .skill-bar-container {
      width: 100%;
      background-color: var(--bg-subtle);
      border-radius: 9999px;
      height: 8px;
      overflow: hidden;
    }
    
    .skill-bar-fill {
      height: 100%;
      background-color: var(--secondary-color);
      border-radius: 9999px;
    }
    
    /* Timeline */
    .timeline {
      border-left: 2px solid var(--border-color);
      padding-left: 20px;
      margin-left: 10px;
      margin-top: 15px;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 12px;
    }
    
    .timeline-item:last-child {
      margin-bottom: 0;
    }
    
    .timeline-dot {
      position: absolute;
      left: -27px;
      top: 3px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-color);
      border: 2px solid white;
    }
    
    .timeline-date {
      font-weight: 700;
      color: var(--secondary-color);
      font-size: 9.5pt;
      text-transform: uppercase;
    }
    
    .timeline-title {
      margin: 1px 0 2px 0;
      font-size: 11pt;
      color: var(--text-primary);
      font-weight: 700;
    }
    
    .timeline-desc {
      margin: 0;
      font-size: 10pt;
      color: var(--text-secondary);
    }
    
    /* Section Divider Page */
    .divider-page {
      padding: 105mm 0;
      text-align: center;
      page-break-after: always;
      break-after: page;
    }
    
    .divider-title {
      font-size: 24pt;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 800;
      margin-bottom: 15px;
    }
    
    .divider-line {
      width: 100px;
      height: 4px;
      background-color: var(--secondary-color);
    }
    
    /* Exercises pages styles */
    .exercise-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--primary-color);
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    
    .exercise-meta {
      display: flex;
      flex-direction: column;
    }
    
    .exercise-label {
      font-weight: bold;
      color: var(--secondary-color);
      text-transform: uppercase;
      font-size: 9.5pt;
      letter-spacing: 0.5px;
    }
    
    .exercise-title {
      margin: 3px 0 0 0;
      color: var(--primary-color);
      font-size: 17pt;
      font-weight: 800;
    }
    
    .exercise-badge {
      background: #e6fffa;
      color: #086f6c;
      border: 1px solid #b2f5ea;
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: bold;
      font-size: 9.5pt;
    }
    
    .exercise-description {
      font-style: italic;
      color: var(--text-muted);
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 10.5pt;
    }
    
    .exercise-tags {
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
    }
    
    .tag {
      background-color: var(--bg-subtle);
      color: var(--text-secondary);
      font-size: 8.5pt;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    
    /* Exercise Rendered Content Styles */
    .section-heading {
      color: var(--primary-color);
      font-weight: 700;
      margin-top: 25px;
      margin-bottom: 10px;
      page-break-after: avoid;
      break-after: avoid;
    }
    
    h2.section-heading { font-size: 13pt; border-bottom: 1px solid var(--border-color); padding-bottom: 4px; }
    h3.section-heading { font-size: 11.5pt; }
    
    .section-text {
      margin-top: 0;
      margin-bottom: 12px;
      text-align: justify;
      font-size: 10.5pt;
    }
    
    .section-list {
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 20px;
      font-size: 10.5pt;
    }
    
    .section-list li {
      margin-bottom: 4px;
      text-align: justify;
    }
    
    .image-container {
      margin: 15px 0;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .image-container img {
      max-width: 100%;
      max-height: 110mm;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }
    
    .image-caption {
      font-size: 9pt;
      color: var(--text-muted);
      margin-top: 6px;
      font-style: italic;
      font-weight: 500;
    }
    
    .section-code {
      background-color: var(--bg-subtle);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px 14px;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 9.5pt;
      line-height: 1.4;
      margin: 15px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .section-code code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
      color: inherit;
    }
    
    .section-divider {
      border: none;
      border-top: 1px solid var(--border-color);
      margin: 25px 0;
    }
    
    /* Table styles matching content.json inline styles */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 15px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }
    
    .table th, .table td {
      border: 1px solid var(--border-color);
      padding: 8px 10px;
    }
    
    .table thead tr {
      background-color: var(--bg-subtle);
    }
    
    /* Stats layout Part III */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-top: 15px;
      margin-bottom: 25px;
    }
    
    .stat-card {
      background: var(--bg-subtle);
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      border: 1px solid var(--border-color);
    }
    
    .stat-value {
      font-size: 20pt;
      font-weight: 800;
      color: var(--primary-color);
      line-height: 1;
    }
    
    .stat-label {
      font-size: 9pt;
      color: var(--text-secondary);
      margin-top: 6px;
      font-weight: 600;
    }
    
    /* Experiences and future plans */
    .exp-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
      margin-bottom: 25px;
    }
    
    .exp-card {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border-top: 4px solid var(--secondary-color);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }
    
    .exp-icon {
      font-size: 18pt;
      margin-bottom: 5px;
    }
    
    .exp-title {
      margin: 5px 0;
      color: var(--text-primary);
      font-size: 11pt;
      font-weight: 700;
    }
    
    .exp-text {
      margin: 5px 0 0 0;
      font-size: 9.5pt;
      color: var(--text-secondary);
      text-align: justify;
      line-height: 1.5;
    }
    
    .lessons-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 15px;
      margin-bottom: 25px;
    }
    
    .lesson-item {
      display: flex;
      gap: 15px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
    }
    
    .lesson-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .lesson-num {
      background: var(--primary-color);
      color: white;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 9.5pt;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .lesson-title {
      margin: 0;
      color: var(--text-primary);
      font-size: 11pt;
      font-weight: 700;
    }
    
    .lesson-desc {
      margin: 3px 0 0 0;
      font-size: 9.5pt;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    
    .plan-card {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--accent-color);
    }
    
    /* Signatures */
    .signatures {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    .signature-col {
      text-align: center;
      width: 45%;
    }
    
    .signature-title {
      font-weight: bold;
      margin-bottom: 50px;
      color: var(--text-primary);
      font-size: 11pt;
    }
    
    .signature-name {
      font-weight: bold;
      color: var(--text-primary);
      font-size: 11pt;
      margin-top: 0;
    }
    
    .signature-guide {
      font-style: italic;
      color: var(--text-muted);
      font-size: 9.5pt;
      margin-top: 0;
    }
    
    /* Heading tweaks for print */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      break-after: avoid;
    }
    
    /* Specific page breaks logic */
    .page-break-before {
      page-break-before: always;
      break-before: page;
    }
    
    /* Inline styles fix */
    .table-container table {
      width: 100% !important;
      border-collapse: collapse !important;
    }
    </""" + "style>"
    
    # ── HTML Boilerplate ──
    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo cáo học tập & Portfolio cá nhân - Nguyễn Tấn Dũng</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  {css_content}
</head>
<body>

  <!-- ── 1. COVER PAGE ── -->
  <div class="cover-page">
    <div>
      <div class="cover-header">TRƯỜNG ĐẠI HỌC CÔNG NGHỆ - ĐHQGHN</div>
      <div class="cover-subheader">KHOA CÔNG NGHỆ THÔNG TIN</div>
      <div class="cover-divider"></div>
    </div>
    
    <div class="cover-title-container">
      <h1 class="cover-title">BÁO CÁO HỌC TẬP &<br>PORTFOLIO CÁ NHÂN</h1>
      <p class="cover-subtitle">{personal_info['subtitle']}</p>
    </div>
    
    <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
      <table class="cover-details-table">
        <tr>
          <td class="label">Sinh viên thực hiện:</td>
          <td>{personal_info['name']}</td>
        </tr>
        <tr>
          <td class="label">Ngành học:</td>
          <td>{personal_info['major']} - {personal_info['year']}</td>
        </tr>
        <tr>
          <td class="label">Trường:</td>
          <td>{personal_info['school']}</td>
        </tr>
        <tr>
          <td class="label">Email liên hệ:</td>
          <td>{personal_info['email']}</td>
        </tr>
        <tr>
          <td class="label">Địa điểm học tập:</td>
          <td>{personal_info['location']}</td>
        </tr>
      </table>
      
      <div class="cover-divider"></div>
      <div class="cover-date">Hà Nội, Tháng 6 Năm 2026</div>
    </div>
  </div>

  <!-- ── 2. PART I: INTRO & ROADMAP ── -->
  <div class="report-section">
    <h2 class="section-title">Phần I: Giới thiệu bản thân & Lộ trình</h2>
    
    <div class="columns">
      <div class="column-left">
        <h3 class="column-title">Tiểu sử cá nhân</h3>
        <p style="text-align: justify; font-size: 10.5pt; margin-top: 0;">{personal_info['bio']}</p>
        
        <div class="quote-box">
          <p class="quote-text">{personal_info['quote']}</p>
          <p class="quote-author">{personal_info['quoteAuthor']}</p>
        </div>
      </div>
      
      <div class="column-right">
        <h3 class="column-title">Thông tin học tập</h3>
        <table class="info-table">
          <tr>
            <td class="label">Họ và tên:</td>
            <td>{personal_info['name']}</td>
          </tr>
          <tr>
            <td class="label">Học hiệu:</td>
            <td>{personal_info['school']}</td>
          </tr>
          <tr>
            <td class="label">Chuyên ngành:</td>
            <td>{personal_info['major']}</td>
          </tr>
          <tr>
            <td class="label">Niên khóa:</td>
            <td>{personal_info['year']} (Năm thứ nhất)</td>
          </tr>
          <tr>
            <td class="label">Email:</td>
            <td>{personal_info['email']}</td>
          </tr>
        </table>
      </div>
    </div>
    
    <h3 class="column-title" style="margin-top: 15px;">Kỹ năng & Công cụ đạt được</h3>
    <div class="skills-grid">
      {"".join(f'''
      <div class="skill-item">
        <div class="skill-meta">
          <span>{skill['icon']} {skill['name']}</span>
          <span>{skill['level']}%</span>
        </div>
        <div class="skill-bar-container">
          <div class="skill-bar-fill" style="width: {skill['level']}%;"></div>
        </div>
      </div>
      ''' for skill in personal_info['skills'])}
    </div>
    
    <h3 class="column-title" style="margin-top: 20px;">Lộ trình thực hành các bài tập</h3>
    <div class="timeline">
      {"".join(f'''
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <span class="timeline-date">{goal['date']}</span>
        <h4 class="timeline-title">{goal['title']}</h4>
        <p class="timeline-desc">{goal['desc']}</p>
      </div>
      ''' for goal in personal_info['goals'])}
    </div>
  </div>

  <!-- ── 3. PART II DIVIDER PAGE ── -->
  <div class="divider-page">
    <h2 class="divider-title">Phần II: Chi tiết các bài thực hành</h2>
    <div class="divider-line"></div>
  </div>
"""

    # ── 4. EXERCISES (PROJECT DETAILS) ──
    for project in projects:
        tags_html = "".join(f"<span class='tag'>{tag}</span>" for tag in project.get('tags', []))
        sections_html = render_sections(project.get('sections', []), project['id'])
        
        html_content += f"""
  <div class="report-section">
    <div class="exercise-header">
      <div class="exercise-meta">
        <span class="exercise-label">Bài thực hành {project['id']}</span>
        <h2 class="exercise-title">{project['title']}</h2>
      </div>
      <span class="exercise-badge">Hoàn thành</span>
    </div>
    
    <p class="exercise-description">{project['description']}</p>
    <div class="exercise-tags">{tags_html}</div>
    
    <div style="margin-top: 15px;">
      {sections_html}
    </div>
  </div>
"""

    # ── 5. PART III: SUMMARY PAGE ──
    stats_html = "".join(f"""
      <div class="stat-card">
        <div class="stat-value">{stat['value']}</div>
        <div class="stat-label">{stat['label']}</div>
      </div>
    """ for stat in summary_data['stats'])
    
    exp_html = "".join(f"""
      <div class="exp-card">
        <div class="exp-icon">{exp['icon']}</div>
        <h4 class="exp-title">{exp['title']}</h4>
        <p class="exp-text">{exp['text']}</p>
      </div>
    """ for exp in summary_data['experiences'])
    
    lessons_html = "".join(f"""
      <div class="lesson-item">
        <div class="lesson-num">{idx + 1}</div>
        <div>
          <h4 class="lesson-title">{lesson['title']}</h4>
          <p class="lesson-desc">{lesson['desc']}</p>
        </div>
      </div>
    """ for idx, lesson in enumerate(summary_data['lessons']))
    
    future_html = "".join(f"""
      <div class="plan-card">
        <div class="exp-icon">{plan['icon']}</div>
        <h4 class="exp-title">{plan['title']}</h4>
        <p class="exp-text" style="font-size: 9.5pt; text-align: left;">{plan['desc']}</p>
      </div>
    """ for plan in summary_data['futurePlans'])

    html_content += f"""
  <!-- ── 6. PART III: SUMMARY & SIGNATURES ── -->
  <div class="report-section">
    <h2 class="section-title">Phần III: Tổng kết hành trình</h2>
    
    <h3 class="column-title">Số liệu thống kê học tập</h3>
    <div class="stats-grid">
      {stats_html}
    </div>
    
    <h3 class="column-title" style="margin-top: 30px;">Trải nghiệm và thu hoạch</h3>
    <div class="exp-grid">
      {exp_html}
    </div>
    
    <h3 class="column-title" style="margin-top: 30px;">Bài học cốt lõi rút ra</h3>
    <div class="lessons-list">
      {lessons_html}
    </div>
    
    <h3 class="column-title" style="margin-top: 30px;">Kế hoạch học tập và phát triển tương lai</h3>
    <div class="exp-grid">
      {future_html}
    </div>
    
    <div class="signatures">
      <div class="signature-col">
        <p class="signature-title">Giảng viên đánh giá</p>
        <p class="signature-guide">(Ký và ghi rõ họ tên)</p>
      </div>
      <div class="signature-col">
        <p class="signature-title">Người thực hiện báo cáo</p>
        <p class="signature-name" style="margin-top: 60px;">{personal_info['name']}</p>
      </div>
    </div>
  </div>

</body>
</html>
"""

    # Write print_temp.html
    with open(HTML_OUT_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated {HTML_OUT_PATH} successfully!")

    # ── 6. Convert to PDF using Google Chrome or Edge ──
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    ]
    
    browser_exe = None
    for path in chrome_paths:
        if os.path.exists(path):
            browser_exe = path
            break
            
    if not browser_exe:
        print("Error: Could not find Google Chrome or Microsoft Edge installed on standard paths.")
        return
        
    print(f"Using browser: {browser_exe}")
    print("Generating PDF from HTML...")
    
    # Run browser headless printing command
    cmd = [
        browser_exe,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={PDF_OUT_PATH}",
        f"file:///{HTML_OUT_PATH.replace(os.sep, '/')}"
    ]
    
    try:
        subprocess.run(cmd, check=True)
        if os.path.exists(PDF_OUT_PATH):
            print(f"SUCCESS: Report PDF generated successfully at {PDF_OUT_PATH}!")
            # Clean up temp HTML file
            try:
                os.remove(HTML_OUT_PATH)
                print("Cleaned up print_temp.html")
            except Exception as clean_err:
                print(f"Warning: Could not remove temporary HTML file: {clean_err}")
        else:
            print("Error: PDF file was not created after running browser command.")
    except Exception as e:
        print("Error compiling PDF using headless browser command:", e)

if __name__ == "__main__":
    main()
