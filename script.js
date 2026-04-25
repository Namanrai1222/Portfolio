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

// ============ SCROLL HINT FADE ============
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = Math.max(0, 1 - window.scrollY / 300);
  });
}
