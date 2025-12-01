// scripts.js — final interactions: menu, reveal, filters, modal carousel, GSAP parallax & reveals
// Uses Swiper (deferred), GSAP + ScrollTrigger (deferred)

// --- DOM helpers
const q = sel => document.querySelector(sel);
const qa = sel => Array.from(document.querySelectorAll(sel));

// Mobile menu toggle
const menuToggle = q('#menuToggle');
const mobileNav = q('#mobileNav');
if(menuToggle){
  menuToggle.addEventListener('click', ()=>{
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    if(mobileNav){
      mobileNav.hidden = expanded;
      mobileNav.setAttribute('aria-hidden', String(expanded));
    }
  });
}

// --- Smooth reveal with IntersectionObserver (fallback before GSAP initializes)
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en => {
    if(en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
  });
},{threshold:0.12});
qa('.reveal').forEach(el => io.observe(el));

// --- Filters
const filters = qa('.filter');
const workItems = qa('.work-item');
filters.forEach(btn => {
  btn.addEventListener('click', ()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workItems.forEach(item=>{
      if(filter === 'all' || item.dataset.type === filter) item.style.display = '';
      else item.style.display = 'none';
    });
  });
});

// --- Data: larger mockup SVG strings for modal carousel
// We map index to an array of slide-markup strings (SVG). Keep them lightweight.
const largeSlides = [
  // index 0 - AXIS identity
  [
    `<svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(60,40)"><rect x="0" y="0" width="420" height="260" rx="12" fill="#fff" /><image href="/Logo.svg" x="20" y="18" width="160" height="160"/></g></svg>`,
    `<svg viewBox="0 0 1000 640"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(40,34)"><rect x="0" y="0" width="320" height="200" rx="12" fill="#fff"/><image href="/Logo.svg" x="18" y="16" width="96" height="96"/></g></svg>`
  ],
  // index 1 - SERRA packaging
  [
    `<svg viewBox="0 0 1000 640"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(80,40)"><rect x="0" y="0" width="200" height="360" rx="20" fill="#fff"/><image href="/Logo.svg" x="32" y="28" width="140" height="140"/></g></svg>`
  ],
  // index 2 - Pulse social
  [
    `<svg viewBox="0 0 1000 640"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(48,36)"><rect x="0" y="0" width="904" height="424" rx="12" fill="#fff"/><image href="/Logo.svg" x="36" y="36" width="120" height="120"/></g></svg>`
  ],
  // index 3 - Nimbus
  [
    `<svg viewBox="0 0 1000 640"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(40,30)"><rect x="0" y="0" width="920" height="160" rx="12" fill="#fff"/><image href="/Logo.svg" x="20" y="18" width="160" height="120"/></g></svg>`
  ],
  // index 4 - Office kit mockups
  [
    `<svg viewBox="0 0 1000 640"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(40,40)"><rect x="0" y="0" width="240" height="140" rx="10" fill="#fff"/><image href="/Logo.svg" x="12" y="8" width="64" height="64"/><rect x="280" y="0" width="420" height="320" rx="12" fill="#fff"/><image href="/Logo.svg" x="320" y="22" width="120" height="120"/></g></svg>`
  ],
  // index 5 - Echo campaign
  [
    `<svg viewBox="0 0 1000 640"><rect width="100%" height="100%" rx="20" fill="#eee7e9"/><g transform="translate(56,46)"><rect x="0" y="0" width="880" height="420" rx="12" fill="#fff"/><image href="/Logo.svg" x="36" y="36" width="140" height="140"/></g></svg>`
  ]
];

// --- Modal + Swiper setup
let activeSwiper = null;
const modal = q('#caseModal');
const modalSlides = q('#modalSlides');
const modalTitle = q('#modalTitle');
const modalDesc = q('#modalDesc');
const modalClose = q('.modal-close');

function openCase(index, title){
  // build slides
  modalSlides.innerHTML = '';
  const slides = largeSlides[index] || [];
  slides.forEach(svg => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = svg;
    modalSlides.appendChild(slide);
  });

  // create Swiper once slides exist
  if(window.Swiper){
    if(activeSwiper){ activeSwiper.destroy(true, true); activeSwiper = null; }
    activeSwiper = new Swiper('.swiper', {
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      slidesPerView: 1
    });
  }

  modalTitle.textContent = title;
  modalDesc.textContent = 'Sample case details — prototype mockups generated from your logo.';
  modal.setAttribute('aria-hidden','false');
  // trap focus
  trapFocus(modal);
  // set focus to close button
  setTimeout(()=> modalClose && modalClose.focus(), 120);
}

// open-case buttons
qa('.open-case').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const item = e.target.closest('.work-item');
    const idx = parseInt(item.dataset.index || '0', 10);
    const title = item.dataset.title || item.querySelector('.work-title').textContent;
    openCase(idx, title);
  });
});

// modal close handlers
modalClose && modalClose.addEventListener('click', ()=> closeModal());
modal && modal.addEventListener('click', (e)=> { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  // destroy swiper if exists
  if(activeSwiper){ activeSwiper.destroy(true, true); activeSwiper = null; }
  releaseFocus();
}

// --- Focus trap (simple)
let lastFocused = null;
function trapFocus(container){
  lastFocused = document.activeElement;
  container.setAttribute('tabindex','-1');
  container.focus();
  container.addEventListener('keydown', handleTrap);
}
function releaseFocus(){
  if(!modal) return;
  modal.removeEventListener('keydown', handleTrap);
  if(lastFocused) lastFocused.focus();
}
function handleTrap(e){
  if(e.key !== 'Tab') return;
  const focusable = modal.querySelectorAll('a,button,input,textarea,[tabindex]:not([tabindex="-1"])');
  if(!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length -1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}

// --- Anchor offset helper (sticky header)
function offsetAnchor(){
  if(location.hash.length > 1){
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if(el){
      const headerHeight = Math.min(96, document.querySelector('.header')?.offsetHeight || 84);
      const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
window.addEventListener('hashchange', offsetAnchor);
window.addEventListener('load', ()=> setTimeout(offsetAnchor, 60));

// --- GSAP animations (if available) — reveal & parallax
function initMotion(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // reveal elements with stagger
  gsap.utils.toArray('.reveal').forEach((el, i)=>{
    gsap.fromTo(el, { y: 14, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: i * 0.03
    });
  });

  // parallax elements — data-parallax multiplier
  qa('.parallax').forEach(el=>{
    const mul = parseFloat(el.getAttribute('data-parallax') || -0.08);
    gsap.to(el, {
      y: () => (window.innerHeight) * mul,
      ease: 'none',
      scrollTrigger: { scrub: 0.6 }
    });
  });
}

// Respect reduced motion
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  qa('.reveal').forEach(el=>el.classList.add('is-visible'));
} else {
  // wait for GSAP scripts to load then init
  window.addEventListener('load', () => { setTimeout(initMotion, 260); });
}

// --- Ensure images / svg references have alt where appropriate (logo images are decorative here)
qa('img').forEach(img=>{
  if(!img.hasAttribute('alt')) img.setAttribute('alt','');
});

// End of file
