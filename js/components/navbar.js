/**
 * Navbar Component
 * Renders the navigation bar and handles active state + mobile toggle
 */

const NAV_ITEMS = [
  { route: 'intro',    label: 'Giới thiệu',  icon: '👤' },
  { route: 'projects', label: 'Dự án',        icon: '📂' },
  { route: 'summary',  label: 'Tổng kết',     icon: '📊' }
];

export function renderNavbar() {
  const navbar = document.getElementById('navbar');
  
  navbar.innerHTML = `
    <div class="navbar__inner">
      <a href="#/intro" class="navbar__logo" id="nav-logo">
        <span class="navbar__logo-dot"></span>
        Portfolio
      </a>
      <div class="navbar__links" id="nav-links">
        ${NAV_ITEMS.map(item => `
          <a href="#/${item.route}" 
             class="navbar__link" 
             data-route="${item.route}"
             id="nav-${item.route}">
            ${item.label}
          </a>
        `).join('')}
      </div>
      <button class="navbar__toggle" id="nav-toggle" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  `;

  // Mobile toggle
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  });
}

/**
 * Update active state in navbar
 * @param {string} activeRoute - Current route name
 */
export function setActiveNav(activeRoute) {
  document.querySelectorAll('.navbar__link').forEach(link => {
    const route = link.dataset.route;
    link.classList.toggle('active', route === activeRoute);
  });
}
