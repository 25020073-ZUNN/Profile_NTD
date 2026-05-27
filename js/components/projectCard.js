/**
 * Project Card Component
 * Handles rendering individual project cards and opening project details
 */

/**
 * Render a project card
 * @param {Object} project - Project data from content.json
 * @param {number} index - Index for animation stagger
 * @returns {string} HTML string
 */
export function renderProjectCard(project, index) {
  const statusMap = {
    done: { label: 'Hoàn thành', class: 'done' },
    wip:  { label: 'Đang làm', class: 'wip' },
    todo: { label: 'Chưa bắt đầu', class: 'todo' }
  };
  
  const status = statusMap[project.status] || statusMap.todo;
  const tags = (project.tags || []).map(t => 
    `<span class="tag">${t}</span>`
  ).join('');

  return `
    <div class="project-card reveal" 
         data-project-id="${project.id}" 
         style="transition-delay: ${index * 0.08}s"
         id="project-card-${project.id}"
         tabindex="0"
         role="button"
         aria-label="Xem chi tiết ${project.title}">
      
      <!-- Animated Neon Border Background -->
      <div class="project-card__neon-bg"></div>

      <div class="project-card__inner">
        <div class="project-card__main">
          <div class="project-card__icon">${project.icon || '📄'}</div>
          <div class="project-card__info">
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__subtitle">${project.subtitle || ''}</p>
          </div>
          <div class="project-card__status">
            <span class="project-card__badge project-card__badge--${status.class}">
              ${status.label}
            </span>
            <span class="project-card__id">Bài tập ${project.id}</span>
          </div>
        </div>

        <div class="project-card__drawer">
          <div class="project-card__drawer-content">
            <p class="project-card__description">${project.description}</p>
            <div class="project-card__tags">${tags}</div>
            <div class="project-card__footer">
              <span class="project-card__link">
                Mở bài tập <span>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render project detail content from sections array
 * @param {Object} project - Full project data with sections
 * @returns {string} HTML string
 */
export function renderProjectDetail(project) {
  const tags = (project.tags || []).map(t => 
    `<span class="tag">${t}</span>`
  ).join('');

  let contentHtml = '';
  
  if (project.displayMode === 'embedded' && project.embedSrc) {
    // Full embed mode
    contentHtml = `
      <div class="embed-container">
        <iframe src="projects/bai-tap-${project.id}/${project.embedSrc}" 
                height="${project.embedHeight || '500px'}"
                title="${project.title}"></iframe>
      </div>
    `;
  } else if (project.sections && project.sections.length > 0) {
    // Parse sections from JSON
    contentHtml = project.sections.map(section => {
      switch (section.type) {
        case 'heading':
          const level = section.level || 2;
          return `<h${level}>${section.content}</h${level}>`;
        
        case 'text':
          return `<p>${section.content}</p>`;
        
        case 'list':
          const listTag = section.ordered ? 'ol' : 'ul';
          const items = section.items.map(item => `<li>${item}</li>`).join('');
          return `<${listTag}>${items}</${listTag}>`;
        
        case 'image':
          const imgSrc = section.src.startsWith('http') 
            ? section.src 
            : `projects/bai-tap-${project.id}/${section.src}`;
          const caption = section.caption 
            ? `<p class="image-caption">${section.caption}</p>` 
            : '';
          return `<img src="${imgSrc}" alt="${section.caption || ''}" loading="lazy">${caption}`;
        
        case 'code':
          return `<pre><code>${escapeHtml(section.content)}</code></pre>`;
        
        case 'embed':
          const embedSrc = section.src.startsWith('http')
            ? section.src
            : `projects/bai-tap-${project.id}/${section.src}`;
          return `
            <div class="embed-container">
              <iframe src="${embedSrc}" 
                      height="${section.height || '400px'}"
                      title="Demo"></iframe>
            </div>
          `;

        case 'divider':
          return '<hr style="border: none; border-top: 1px solid var(--border-subtle); margin: var(--space-8) 0;">';
        
        default:
          return '';
      }
    }).join('\n');
  } else {
    contentHtml = `
      <div style="text-align: center; padding: var(--space-12) 0; color: var(--text-muted);">
        <p style="font-size: var(--text-4xl); margin-bottom: var(--space-4);">📝</p>
        <p>Nội dung bài tập chưa được thêm.</p>
        <p style="font-size: var(--text-sm); margin-top: var(--space-2);">
          Hãy chỉnh sửa file <code>projects/bai-tap-${project.id}/content.json</code> để thêm nội dung.
        </p>
      </div>
    `;
  }

  return `
    <div class="project-detail">
      <button class="project-detail__back" id="project-back">
        ← Quay lại danh sách
      </button>
      <div class="project-detail__header">
        <div class="project-detail__meta">
          <span class="tag">Bài tập ${project.id}</span>
          ${tags}
        </div>
        <h1 class="project-detail__title">${project.title}</h1>
        <p class="project-detail__description">${project.description}</p>
        ${project.driveLink ? `
        <a href="${project.driveLink}" target="_blank" rel="noopener noreferrer" 
           class="btn btn--primary" style="margin-top: var(--space-6); display: inline-flex;">
          📄 Xem tài liệu đầy đủ (Google Drive)
        </a>
        ` : ''}
      </div>
      <div class="project-content">
        ${contentHtml}
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
