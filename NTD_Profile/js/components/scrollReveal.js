/**
 * Scroll Reveal - Clean IntersectionObserver animations
 */

let currentObserver = null;

export function initScrollReveal() {
  if (currentObserver) {
    currentObserver.disconnect();
  }

  currentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
    currentObserver.observe(el);
  });

  return currentObserver;
}

export function refreshScrollReveal() {
  requestAnimationFrame(() => {
    initScrollReveal();
  });
}
