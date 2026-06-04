/**
 * Subtle Dot Grid Background - Modern Tech & Academic Vibe
 * Renders an understated, fixed dot grid pattern that reacts slightly to vertical scroll
 * and remains quietly in the background (z-index: -1).
 */

export default class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    
    // Animation variables
    this.time = 0;
    this.scrollY = 0;
    this.targetScrollY = 0;
    
    this.isRunning = false;
    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    this.setupEvents();
    this.start();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.75;
    `;
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    }, { passive: true });
  }

  update() {
    this.time += 0.01;
    // Lerp scroll position for smooth vertical parallax
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
  }

  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Subtle dot grid settings
    const dotSpacing = 28;
    const dotSize = 1.5;
    
    // Set color to a very soft slate gray dot
    this.ctx.fillStyle = '#e2e8f0'; 
    
    // Calculate vertical offset based on scroll for subtle parallax
    const offsetY = -Math.floor(this.scrollY * 0.1) % dotSpacing;

    this.ctx.beginPath();
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = offsetY; y < height; y += dotSpacing) {
        if (y < 0) continue;
        this.ctx.arc(x + (dotSpacing / 2), y, dotSize / 2, 0, Math.PI * 2);
      }
    }
    this.ctx.fill();
  }

  animate() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
