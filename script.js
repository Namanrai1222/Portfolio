// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

// ============ ACTIVE NAV ON SCROLL ============
const sections = document.querySelectorAll('.section');
const navLinkList = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinkList.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').replace('#', '');
    if (href === current) link.classList.add('active');
  });
});

// ============ SCROLL ANIMATIONS (IntersectionObserver) ============
// Animations replay every time elements enter the viewport
const animElements = document.querySelectorAll('.anim');
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      // Remove visible so animation replays on re-entry
      entry.target.classList.remove('visible');
    }
  });
}, observerOpts);
animElements.forEach(el => observer.observe(el));

// ============ PARALLAX BACKGROUND DRIFT ============
// Slowly shift the fixed background as user scrolls for a continuous feel
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / maxScroll; // 0 to 1

      // Drift background subtly - move UP as user scrolls to keep coverage
      const yShift = -(scrollY * 0.03);
      const xShift = Math.sin(progress * Math.PI * 2) * 8;
      document.body.style.setProperty('--bg-y', yShift + 'px');
      document.body.style.setProperty('--bg-x', xShift + 'px');

      ticking = false;
    });
    ticking = true;
  }
});

// Apply CSS custom properties for background movement
const style = document.createElement('style');
style.textContent = `
  body::before {
    transform: translate3d(var(--bg-x, 0), var(--bg-y, 0), 0);
  }
`;
document.head.appendChild(style);

// ============ SCROLL HINT FADE ============
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = Math.max(0, 1 - window.scrollY / 300);
  });
}
