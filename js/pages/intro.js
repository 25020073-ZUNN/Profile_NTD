/**
 * Intro Page - Trang Giới thiệu
 * 
 * ╔══════════════════════════════════════════════════╗
 * ║  HƯỚNG DẪN CHỈNH SỬA THÔNG TIN CÁ NHÂN:       ║
 * ║  Tìm object PERSONAL_INFO bên dưới và thay đổi  ║
 * ║  các giá trị theo thông tin thật của bạn.        ║
 * ╚══════════════════════════════════════════════════╝
 */

// ============================================================
// CHỈNH SỬA THÔNG TIN CÁ NHÂN TẠI ĐÂY
// ============================================================
const PERSONAL_INFO = {
  name: 'NGUYỄN  TẤN DŨNG',
  greeting: 'Xin chào, mình là',
  subtitle: 'Sinh viên ngành Công nghệ Thông tin, đam mê khám phá công nghệ và xây dựng các sản phẩm số sáng tạo.',

  // Thông tin cá nhân
  school: 'Trường Đại học Công nghệ - Đại học Quốc Gia Hà Nội',
  major: 'Công nghệ thông tin',
  year: 'Năm 1',
  email: '1tandung0601@gmail.com',
  location: 'TP Hà Nội',

  // Giới thiệu bản thân
  bio: 'Mình là sinh viên năm nhất, luôn tò mò về cách công nghệ có thể giải quyết những vấn đề thực tế. Với niềm đam mê lập trình và thiết kế, mình mong muốn trở thành một kỹ sư phần mềm có khả năng tạo ra những sản phẩm có giá trị cho cộng đồng.',

  // Phương châm cá nhân
  quote: '"Thiết kế cuộc sống mà bạn muốn, rồi tìm cách biến nó thành hiện thực."',
  quoteAuthor: '— Phương châm cá nhân',

  // Kỹ năng & công cụ
  skills: [
    { name: 'HTML/CSS', icon: '🌐', level: 70 },
    { name: 'JavaScript', icon: '⚡', level: 50 },
    { name: 'Python', icon: '🐍', level: 40 },
    { name: 'Git', icon: '📦', level: 55 },
    { name: 'AI Tools', icon: '🤖', level: 65 },
    { name: 'Figma', icon: '🎨', level: 45 },
  ],

  // Marquee items — infinite scroll content
  marqueeRow1: [
    { icon: '🌐', text: 'HTML / CSS', level: '70%' },
    { icon: '⚡', text: 'JavaScript', level: '50%' },
    { icon: '🐍', text: 'Python', level: '40%' },
    { icon: '📦', text: 'Git & GitHub', level: '55%' },
    { icon: '🤖', text: 'ChatGPT / AI', level: '65%' },
    { icon: '🎨', text: 'Figma', level: '45%' },
    { icon: '📊', text: 'Google Sheets', level: '60%' },
    { icon: '🖥️', text: 'VS Code', level: '70%' },
  ],
  marqueeRow2: [
    { icon: '🔍', text: 'Tìm kiếm thông tin', level: '75%' },
    { icon: '📝', text: 'Viết Prompt', level: '70%' },
    { icon: '👥', text: 'Làm việc nhóm', level: '65%' },
    { icon: '🎬', text: 'Tạo nội dung số', level: '60%' },
    { icon: '⚖️', text: 'AI có trách nhiệm', level: '70%' },
    { icon: '📁', text: 'Quản lý tệp tin', level: '80%' },
    { icon: '💡', text: 'Tư duy phản biện', level: '60%' },
    { icon: '🚀', text: 'Học hỏi liên tục', level: '90%' },
  ],

  // Quá trình học tập (timeline)
  goals: [
    {
      date: 'Bài tập 1',
      title: 'Thao tác với tệp tin và thư mục',
      desc: 'Làm quen với hệ thống, quản lý tệp tin và tổ chức cấu trúc thư mục khoa học.'
    },
    {
      date: 'Bài tập 2',
      title: 'Tìm kiếm & đánh giá thông tin',
      desc: 'Nâng cao kỹ năng khai thác internet, sử dụng cú pháp tìm kiếm nâng cao và kiểm chứng nguồn tin.'
    },
    {
      date: 'Bài tập 3',
      title: 'Viết Prompt hiệu quả với AI',
      desc: 'Học cách giao tiếp, thiết kế câu lệnh tối ưu để làm việc cùng AI hiệu quả.'
    },
    {
      date: 'Bài tập 4',
      title: 'Công cụ hợp tác trực tuyến',
      desc: 'Ứng dụng các nền tảng số để làm việc nhóm, chia sẻ dữ liệu và cộng tác trực tuyến.'
    },
    {
      date: 'Bài tập 5',
      title: 'Sáng tạo nội dung số với AI',
      desc: 'Sử dụng công nghệ AI để lên ý tưởng, thiết kế hình ảnh và sản xuất nội dung số đa phương tiện.'
    },
    {
      date: 'Bài tập 6',
      title: 'Sử dụng AI có trách nhiệm',
      desc: 'Hiểu về bản quyền, đạo đức AI, tính bảo mật dữ liệu và ứng dụng AI bền vững.'
    }
  ]
};

// ============================================================
// RENDER FUNCTIONS
// ============================================================

/**
 * Render a marquee row with duplicated items for infinite scroll
 */
function renderMarqueeRow(items, reverse = false) {
  const itemsHtml = items.map(item => `
    <div class="marquee-item">
      <span class="marquee-item__icon">${item.icon}</span>
      <span class="marquee-item__text">${item.text}</span>
      <span class="marquee-item__level">${item.level}</span>
    </div>
  `).join('');

  // Duplicate items for seamless loop
  return `
    <div class="marquee-row">
      <div class="marquee-track ${reverse ? 'marquee-track--reverse' : ''}">
        ${itemsHtml}
        ${itemsHtml}
      </div>
    </div>
  `;
}

export function renderIntroPage() {
  return `
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="container hero__container">
        <div class="hero__content">
          <p class="hero__greeting reveal">
            <span class="wave">👋</span>
            <span>${PERSONAL_INFO.greeting}</span>
          </p>
          <h1 class="hero__name reveal text-plasma">
            ${PERSONAL_INFO.name}
          </h1>
          <p class="hero__subtitle reveal">
            ${PERSONAL_INFO.subtitle}
          </p>
          <div class="hero__cta reveal">
            <a href="#/projects" class="btn btn--primary btn--lg" id="cta-projects">
              Xem bài tập
            </a>
            <a href="#/summary" class="btn btn--outline btn--lg" id="cta-summary">
              Tổng kết hành trình
            </a>
          </div>
        </div>
        <div class="hero__profile reveal reveal--right">
          <div class="hero__avatar-card">
            <div class="hero__avatar-glow"></div>
            <img class="hero__avatar" src="assets/images/profilefic.jpg" alt="Nguyễn Tấn Dũng">
            <div class="hero__profile-badge">
              <span class="hero__profile-badge-dot"></span>
              MSV:25020073 / CNTT-IT5
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Infinite Scrolling Marquee -->
    <section class="marquee-section" id="marquee-section">
      <p class="marquee-section__label">Kỹ năng & Công cụ</p>
      ${renderMarqueeRow(PERSONAL_INFO.marqueeRow1)}
      ${renderMarqueeRow(PERSONAL_INFO.marqueeRow2, true)}
    </section>

    <!-- About Section -->
    <section class="section" id="about-section">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Về mình</span>
          <h2 class="section__title">Giới thiệu bản thân</h2>
          <div class="divider"></div>
        </div>
        <div class="about-grid">
          <div class="about__content reveal reveal--left">
            <h3 class="about__subtitle">Sinh viên Công nghệ Thông tin</h3>
            <p class="about__bio">${PERSONAL_INFO.bio}</p>
          </div>
          <div class="about__info reveal reveal--right">
            <div class="info-list">
              <div class="info-item">
                <span class="info-item__icon">🏫</span>
                <div class="info-item__details">
                  <span class="info-item__label">Trường</span>
                  <span class="info-item__value">${PERSONAL_INFO.school}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-item__icon">📚</span>
                <div class="info-item__details">
                  <span class="info-item__label">Ngành</span>
                  <span class="info-item__value">${PERSONAL_INFO.major}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-item__icon">🎓</span>
                <div class="info-item__details">
                  <span class="info-item__label">Năm học</span>
                  <span class="info-item__value">${PERSONAL_INFO.year}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-item__icon">📧</span>
                <div class="info-item__details">
                  <span class="info-item__label">Email</span>
                  <span class="info-item__value">${PERSONAL_INFO.email}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-item__icon">📍</span>
                <div class="info-item__details">
                  <span class="info-item__label">Địa điểm</span>
                  <span class="info-item__value">${PERSONAL_INFO.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote Section -->
    <section class="section" id="quote-section">
      <div class="container">
        <div class="card card--glass quote-card gradient-border reveal reveal--scale">
          <div class="quote-card__icon">❝</div>
          <p class="quote-card__text">${PERSONAL_INFO.quote}</p>
          <p class="quote-card__author">${PERSONAL_INFO.quoteAuthor}</p>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="section" id="skills-section">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Kỹ năng</span>
          <h2 class="section__title">Công cụ & Kỹ năng</h2>
          <div class="divider"></div>
        </div>
        <div class="skills-grid stagger-children">
          ${PERSONAL_INFO.skills.map(skill => `
            <div class="skill-item reveal">
              <span class="skill-item__icon">${skill.icon}</span>
              <span class="skill-item__name">${skill.name}</span>
              <div class="skill-item__level">
                <div class="progress">
                  <div class="progress__bar" data-width="${skill.level}%"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Goals Timeline -->
    <section class="section" id="goals-section">
      <div class="container container--narrow">
        <div class="section__header reveal">
          <span class="section__label">Lộ trình</span>
          <h2 class="section__title">Quá trình học tập</h2>
          <div class="divider"></div>
        </div>
        <div class="timeline stagger-children">
          ${PERSONAL_INFO.goals.map(goal => `
            <div class="timeline__item reveal">
              <div class="timeline__dot"></div>
              <span class="timeline__date">${goal.date}</span>
              <h4 class="timeline__title">${goal.title}</h4>
              <p class="timeline__desc">${goal.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

/**
 * Post-render initialization for intro page
 * Animates progress bars after they become visible
 */
export function initIntroPage(pageElement) {
  // Animate progress bars when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  pageElement.querySelectorAll('.progress__bar').forEach(bar => {
    observer.observe(bar);
  });
}
