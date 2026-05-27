/**
 * Creative Geometric Background - serious.business Vibe
 * Renders an off-white canvas with a subtle paper dot grid, and draws
 * modern, drifting, colorful geometric shapes (stars, capsules, squares, circles)
 * that bounce/wrap around, react to mouse attraction, and respond to vertical scroll parallax.
 */

export default class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    
    // Animation variables
    this.time = 0;
    this.shapes = [];
    this.numShapes = 16;
    
    // Interactions
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.targetMouseX = -1000;
    this.targetMouseY = -1000;
    
    this.isRunning = false;
    this.animationId = null;

    // Creative Colors Palette
    this.colors = [
      '#FF5F35', // Orange
      '#2B4BF2', // Blue
      '#00DF89', // Green
      '#FCD34D', // Yellow
      '#9D4EDD'  // Purple
    ];

    this.init();
  }

  init() {
    this.resize();
    this.createShapes();
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
      opacity: 1;
    `;
  }

  createShapes() {
    this.shapes = [];
    const types = ['circle', 'square', 'capsule', 'cross'];
    
    for (let i = 0; i < this.numShapes; i++) {
      const size = Math.random() * 25 + 15; // Width/radius
      this.shapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: size,
        color: this.colors[i % this.colors.length],
        type: types[i % types.length],
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        parallaxFactor: 0.15 + Math.random() * 0.35, // Parallax depth
        originalX: 0,
        originalY: 0
      });
    }
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      // Re-adjust out of bound shapes
      this.shapes.forEach(s => {
        if (s.x > this.canvas.width) s.x = Math.random() * this.canvas.width;
        if (s.y > this.canvas.height) s.y = Math.random() * this.canvas.height;
      });
    });

    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    // Reset mouse when leaving window
    document.addEventListener('mouseleave', () => {
      this.targetMouseX = -1000;
      this.targetMouseY = -1000;
    });
  }

  update() {
    this.time += 0.01;
    
    // Lerp scroll position for smooth parallax
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.1;
    
    // Lerp mouse coordinates
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

    // Update shapes
    this.shapes.forEach(s => {
      // 1. Core drift movement
      s.x += s.vx;
      s.y += s.vy;
      s.angle += s.rotSpeed;

      // 2. Wrap around screen bounds
      if (s.x < -s.size * 2) s.x = this.canvas.width + s.size * 2;
      if (s.x > this.canvas.width + s.size * 2) s.x = -s.size * 2;
      
      if (s.y < -s.size * 2) s.y = this.canvas.height + s.size * 2;
      if (s.y > this.canvas.height + s.size * 2) s.y = -s.size * 2;

      // 3. Playful mouse attraction/repulsion
      if (this.mouseX > -500) {
        // Calculate shape Y coordinates adding scroll parallax offset
        const actualY = s.y - this.scrollY * s.parallaxFactor;
        const dx = this.mouseX - s.x;
        const dy = this.mouseY - actualY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250;
        
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          // Subtly attract to cursor creating a fluid magnetic effect
          s.x += (dx / dist) * force * 1.5;
          s.y += (dy / dist) * force * 1.5;
          
          // Speed up rotation near cursor
          s.angle += s.rotSpeed * 2 * force;
        }
      }
    });
  }

  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // 1. Pure Sand Cream background color
    this.ctx.fillStyle = '#FAF6F0';
    this.ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle dot-matrix/paper-grid
    this.ctx.save();
    this.ctx.fillStyle = '#121212';
    this.ctx.globalAlpha = 0.04;
    const dotSpacing = 60;
    const scrollOffset = (this.scrollY * 0.1) % dotSpacing;
    
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = -scrollOffset; y < height; y += dotSpacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.ctx.restore();

    // 3. Draw geometric shapes
    this.shapes.forEach(s => {
      this.ctx.save();
      
      // Calculate scroll parallax position
      const renderY = s.y - this.scrollY * s.parallaxFactor;
      
      // Translate to shape position
      this.ctx.translate(s.x, renderY);
      this.ctx.rotate(s.angle);
      
      // Apply drawing styles (Chunky border + solid color fills)
      this.ctx.fillStyle = s.color;
      this.ctx.strokeStyle = '#121212';
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.85; // Solid creative colors

      // Subtle drop shadow underlay for neo-brutalism offset
      this.ctx.shadowColor = '#121212';
      this.ctx.shadowBlur = 0;
      this.ctx.shadowOffsetX = 3;
      this.ctx.shadowOffsetY = 3;

      this.ctx.beginPath();
      
      switch (s.type) {
        case 'circle':
          this.ctx.arc(0, 0, s.size * 0.7, 0, Math.PI * 2);
          break;
          
        case 'square':
          this.ctx.rect(-s.size * 0.6, -s.size * 0.6, s.size * 1.2, s.size * 1.2);
          break;
          
        case 'capsule':
          // Draw a capsule/pill shape
          const w = s.size * 1.5;
          const h = s.size * 0.6;
          const r = h / 2;
          this.ctx.moveTo(-w/2 + r, -h/2);
          this.ctx.lineTo(w/2 - r, -h/2);
          this.ctx.arc(w/2 - r, 0, r, -Math.PI/2, Math.PI/2);
          this.ctx.lineTo(-w/2 + r, h/2);
          this.ctx.arc(-w/2 + r, 0, r, Math.PI/2, -Math.PI/2);
          this.ctx.closePath();
          break;
          
        case 'cross':
          // Draw cross shape
          const len = s.size * 0.8;
          const th = s.size * 0.28;
          this.ctx.rect(-len, -th/2, len * 2, th);
          this.ctx.rect(-th/2, -len, th, len * 2);
          break;
      }
      
      this.ctx.fill();
      this.ctx.shadowOffsetX = 0; // Disable shadow for stroke to look clean
      this.ctx.shadowOffsetY = 0;
      this.ctx.stroke();
      
      this.ctx.restore();
    });
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
