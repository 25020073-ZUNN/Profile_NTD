/**
 * App.js - Main Application Entry Point
 * Initializes the SPA router, components, and page rendering
 */

import Router from './router.js';
import PageTransition from './components/pageTransition.js';
import ParticleBackground from './components/particleBg.js';
import { renderNavbar, setActiveNav } from './components/navbar.js';
import { refreshScrollReveal } from './components/scrollReveal.js';
import { renderIntroPage, initIntroPage } from './pages/intro.js';
import { renderProjectsPage, renderProjectDetailPage, initProjectsPage, initProjectDetailPage } from './pages/projects.js';
import { renderSummaryPage, initSummaryPage } from './pages/summary.js';

// ── Initialize App ──
class App {
  constructor() {
    this.router = new Router();
    this.transition = new PageTransition('page-container');
    this.particles = null;
    
    this.init();
  }

  init() {
    // Render navbar
    renderNavbar();

    // Init particle background (subtle on light theme)
    this.particles = new ParticleBackground('particles-canvas');

    // Setup routes
    this.router.addRoute('intro', renderIntroPage);
    this.router.addRoute('projects', renderProjectsPage);
    this.router.addRoute('summary', renderSummaryPage);

    // Handle navigation
    this.router.setNavigateCallback(async (route, params, previousRoute) => {
      await this.handleNavigation(route, params);
    });

    // Back to top button
    this.setupBackToTop();

    // Start router
    this.router.start();
  }

  async handleNavigation(route, params) {
    // Update navbar active state
    setActiveNav(route);

    // Determine what to render
    let html;
    let pageId;
    let initFn;

    if (route === 'projects' && params.length > 0) {
      // Project detail view
      html = await renderProjectDetailPage(params[0]);
      pageId = `project-${params[0]}`;
      initFn = initProjectDetailPage;
    } else if (route === 'projects') {
      // Project list view
      html = await renderProjectsPage();
      pageId = 'projects';
      initFn = initProjectsPage;
    } else if (route === 'intro') {
      html = renderIntroPage();
      pageId = 'intro';
      initFn = initIntroPage;
    } else if (route === 'summary') {
      html = renderSummaryPage();
      pageId = 'summary';
      initFn = initSummaryPage;
    } else {
      html = renderIntroPage();
      pageId = 'intro';
      initFn = initIntroPage;
    }

    // Transition to new page
    await this.transition.transition(html, pageId, (pageElement) => {
      // Initialize page-specific logic
      if (initFn) {
        initFn(pageElement);
      }
      // Re-init scroll reveal for new content
      refreshScrollReveal();
    });
  }

  setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
