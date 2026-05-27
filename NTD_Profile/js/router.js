/**
 * SPA Router - Hash-based routing with smooth page transitions
 * 
 * Usage:
 *   import Router from './router.js';
 *   const router = new Router();
 *   router.addRoute('intro', renderIntroPage);
 *   router.addRoute('projects', renderProjectsPage);
 *   router.start();
 */

export default class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.pageOrder = [];
    this.onNavigate = null; // callback when navigating
  }

  /**
   * Register a route
   * @param {string} name - Route name (used in hash, e.g. #/intro)
   * @param {Function} render - Function that returns HTML string for the page
   */
  addRoute(name, render) {
    this.routes[name] = render;
    this.pageOrder.push(name);
  }

  /**
   * Set the callback for navigation events
   * @param {Function} callback - Called with (routeName, params) on navigate
   */
  setNavigateCallback(callback) {
    this.onNavigate = callback;
  }

  /**
   * Parse the current hash into route name and params
   * Example: #/projects/3 → { route: 'projects', params: ['3'] }
   */
  parseHash() {
    const hash = window.location.hash.slice(2) || this.pageOrder[0]; // remove #/
    const parts = hash.split('/');
    return {
      route: parts[0],
      params: parts.slice(1)
    };
  }

  /**
   * Navigate to a route programmatically
   * @param {string} route - Route name
   * @param  {...string} params - Optional params
   */
  navigate(route, ...params) {
    const path = [route, ...params].join('/');
    window.location.hash = `/${path}`;
  }

  /**
   * Handle route changes
   */
  handleRoute() {
    const { route, params } = this.parseHash();
    
    if (!this.routes[route]) {
      // Fallback to first route
      this.navigate(this.pageOrder[0]);
      return;
    }

    const previousRoute = this.currentRoute;
    this.currentRoute = route;

    if (this.onNavigate) {
      this.onNavigate(route, params, previousRoute);
    }
  }

  /**
   * Get direction of navigation (for transition animation)
   */
  getDirection(from, to) {
    const fromIdx = this.pageOrder.indexOf(from);
    const toIdx = this.pageOrder.indexOf(to);
    return toIdx > fromIdx ? 'forward' : 'backward';
  }

  /**
   * Start listening to hash changes
   */
  start() {
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial load
    if (!window.location.hash) {
      window.location.hash = `/${this.pageOrder[0]}`;
    } else {
      this.handleRoute();
    }
  }
}
