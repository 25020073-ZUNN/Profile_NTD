/**
 * Summary Page - Trang Tổng kết
 *
 * ╔══════════════════════════════════════════════════╗
 * ║  CHỈNH SỬA NỘI DUNG TỔNG KẾT TẠI ĐÂY          ║
 * ║  Thay đổi các giá trị trong SUMMARY_DATA         ║
 * ╚══════════════════════════════════════════════════╝
 */

const SUMMARY_DATA = {
  // Thống kê
  stats: [
    { value: '6',  label: 'Bài tập hoàn thành' },
    { value: '10+', label: 'Kỹ năng mới' },
    { value: '50+', label: 'Giờ học tập' },
    { value: '∞',  label: 'Động lực phát triển' }
  ],

  // Trải nghiệm
  experiences: [
    {
      icon: '💡',
      title: 'Khám phá công nghệ',
      text: 'Được tiếp cận với nhiều công cụ và nền tảng công nghệ hiện đại, từ quản lý file cho đến các công cụ AI tiên tiến.'
    },
    {
      icon: '🤝',
      title: 'Kỹ năng hợp tác',
      text: 'Học cách làm việc nhóm hiệu quả thông qua các công cụ cộng tác trực tuyến và quy trình quản lý dự án.'
    },
    {
      icon: '🎯',
      title: 'Tư duy phản biện',
      text: 'Phát triển khả năng đánh giá thông tin, sử dụng AI có trách nhiệm và tư duy sáng tạo trong giải quyết vấn đề.'
    }
  ],

  // Bài học rút ra
  lessons: [
    {
      title: 'Tổ chức là nền tảng',
      desc: 'Cấu trúc thư mục rõ ràng và đặt tên khoa học giúp tiết kiệm rất nhiều thời gian.'
    },
    {
      title: 'Đánh giá nguồn tin cẩn thận',
      desc: 'Không phải mọi thông tin trên mạng đều đáng tin cậy, cần kiểm chứng đa nguồn.'
    },
    {
      title: 'AI là công cụ, không phải câu trả lời',
      desc: 'AI hỗ trợ tuyệt vời nhưng cần sử dụng có trách nhiệm và luôn kiểm tra kết quả.'
    },
    {
      title: 'Giao tiếp hiệu quả trong nhóm',
      desc: 'Công cụ tốt chỉ hiệu quả khi đi kèm với quy trình và thái độ hợp tác tích cực.'
    },
    {
      title: 'Học qua thực hành',
      desc: 'Làm dự án thực tế giúp hiểu sâu hơn nhiều so với chỉ đọc lý thuyết.'
    }
  ],

  // Kỹ năng đạt được
  skillsAcquired: [
    { name: 'Quản lý tệp tin & thư mục', level: 80 },
    { name: 'Tìm kiếm & đánh giá thông tin', level: 75 },
    { name: 'Viết Prompt cho AI', level: 70 },
    { name: 'Công cụ hợp tác trực tuyến', level: 65 },
    { name: 'Sáng tạo nội dung số', level: 60 },
    { name: 'Sử dụng AI có trách nhiệm', level: 70 }
  ],

  // Kế hoạch tương lai
  futurePlans: [
    { icon: '📱', title: 'Phát triển Web/App', desc: 'Học sâu hơn về phát triển ứng dụng web và mobile.' },
    { icon: '🧠', title: 'Trí tuệ nhân tạo', desc: 'Nghiên cứu và ứng dụng AI/ML vào các dự án thực tế.' },
    { icon: '🌍', title: 'Đóng góp cộng đồng', desc: 'Tham gia các dự án mã nguồn mở và hoạt động cộng đồng.' }
  ]
};

export function renderSummaryPage() {
  return `
    <!-- Summary Hero -->
    <section class="summary-hero">
      <div class="container">
        <h1 class="summary-hero__title reveal">
          <span class="text-gradient">Tổng kết hành trình</span>
        </h1>
        <p class="summary-hero__subtitle reveal">
          Nhìn lại quá trình học tập, những trải nghiệm quý giá và bài học rút ra từ các bài tập thực hành.
        </p>
        <div class="divider reveal"></div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section" id="stats-section">
      <div class="container">
        <div class="stats-grid stagger-children">
          ${SUMMARY_DATA.stats.map(stat => `
            <div class="card stat-card reveal">
              <div class="stat-card__value">${stat.value}</div>
              <div class="stat-card__label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Experiences -->
    <section class="section" id="experiences-section">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Trải nghiệm</span>
          <h2 class="section__title">Những điều đã học được</h2>
          <div class="divider"></div>
        </div>
        <div class="experience-grid stagger-children">
          ${SUMMARY_DATA.experiences.map(exp => `
            <div class="card experience-card reveal">
              <div class="experience-card__icon">${exp.icon}</div>
              <h3 class="experience-card__title">${exp.title}</h3>
              <p class="experience-card__text">${exp.text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Lessons -->
    <section class="section" id="lessons-section">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Bài học</span>
          <h2 class="section__title">Bài học rút ra</h2>
          <div class="divider"></div>
        </div>
        <div class="lessons-list stagger-children">
          ${SUMMARY_DATA.lessons.map((lesson, i) => `
            <div class="lesson-item reveal">
              <div class="lesson-item__number">${i + 1}</div>
              <div class="lesson-item__content">
                <h4 class="lesson-item__title">${lesson.title}</h4>
                <p class="lesson-item__desc">${lesson.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Skills Acquired -->
    <section class="section" id="skills-acquired-section">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Kỹ năng</span>
          <h2 class="section__title">Kỹ năng đạt được</h2>
          <div class="divider"></div>
        </div>
        <div class="skills-progress reveal">
          ${SUMMARY_DATA.skillsAcquired.map(skill => `
            <div class="skill-progress-item">
              <span class="skill-progress-item__label">${skill.name}</span>
              <div class="skill-progress-item__bar">
                <div class="progress">
                  <div class="progress__bar" data-width="${skill.level}%"></div>
                </div>
              </div>
              <span class="skill-progress-item__value">${skill.level}%</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Future Plans -->
    <section class="section" id="future-section">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Tương lai</span>
          <h2 class="section__title">Kế hoạch phát triển</h2>
          <div class="divider"></div>
        </div>
        <div class="future-cards stagger-children">
          ${SUMMARY_DATA.futurePlans.map(plan => `
            <div class="card future-card reveal">
              <div class="future-card__icon">${plan.icon}</div>
              <h3 class="future-card__title">${plan.title}</h3>
              <p class="future-card__desc">${plan.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer reveal">
      <div class="container">
        <p class="site-footer__text">
          Được tạo với <span class="site-footer__heart">♥</span> bằng HTML, CSS & JavaScript
        </p>
        <p class="site-footer__text" style="margin-top: var(--space-2);">
          © 2025 Portfolio. Bài tập dự án cá nhân.
        </p>
      </div>
    </footer>
  `;
}

export function initSummaryPage(pageElement) {
  // Animate progress bars when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  pageElement.querySelectorAll('.progress__bar').forEach(bar => {
    observer.observe(bar);
  });

  // Animate stat counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseInt(text);
        if (!isNaN(num) && num > 0 && num <= 100) {
          animateCounter(el, 0, num, 1500);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  pageElement.querySelectorAll('.stat-card__value').forEach(el => {
    statObserver.observe(el);
  });
}

function animateCounter(el, start, end, duration) {
  const startTime = performance.now();
  const suffix = el.textContent.replace(/[0-9]/g, '');
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (end - start) * eased);
    
    el.textContent = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}
