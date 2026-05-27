/**
 * Page Transition Manager - Clean Professional
 * Simple, fast transitions for light theme
 */

export default class PageTransition {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isTransitioning = false;
  }

  async transition(html, pageId, afterRender = null) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const currentPage = this.container.querySelector('.page.active');

    // Create new page element
    const newPage = document.createElement('div');
    newPage.className = 'page';
    newPage.id = `page-${pageId}`;
    newPage.innerHTML = html;

    // Fade out current page
    if (currentPage) {
      currentPage.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      currentPage.classList.remove('active');
      
      await this.wait(200);
      currentPage.remove();
    }

    // Add and activate new page
    this.container.appendChild(newPage);
    void newPage.offsetHeight;
    window.scrollTo({ top: 0, behavior: 'instant' });

    requestAnimationFrame(() => {
      newPage.classList.add('active');
      
      if (afterRender) {
        afterRender(newPage);
      }

      this.isTransitioning = false;
    });
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
