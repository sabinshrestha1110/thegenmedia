// scripts.js — minimal interactions: menu, reveal on scroll, anchor offset, sticky CTA, reduced-motion

// helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Mobile menu toggle
const menuToggle = $('#menuToggle');
const mobileNav = $('#mobileNav');
if(menuToggle){
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    if(mobileNav){
      mobileNav.hidden = open;
      mobileNav.setAttribute('aria-hidden', String(!open));
    }
  });
}

// Reveal on scroll (IntersectionObserver)
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const io = new IntersectionObserver((entries, ob) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('is-visible'); ob.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  $$('.reveal').forEach(el => io.observe(el));
} else {
  // If reduced motion, show all
  $$('.reveal').forEach(el => el.classList.add('is-visible'));
}

// Anchor offset for sticky header
function offsetAnchor(){
  if(location.hash.length > 1){
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if(el){
      const header = document.querySelector('.site-header');
      const h = header ? header.offsetHeight : 84;
      const y = el.getBoundingClientRect().top + window.scrollY - h - 12;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }
}
window.addEventListener('hashchange', offsetAnchor);
window.addEventListener('load', ()=> setTimeout(offsetAnchor, 60));

// Sticky CTA visibility (only for mobile)
function updateSticky(){
  const st = document.querySelector('.sticky-cta');
  if(!st) return;
  if(window.innerWidth >= 900) st.style.display = 'none';
  else st.style.display = 'flex';
}
window.addEventListener('resize', updateSticky);
window.addEventListener('load', updateSticky);

// make external links open in new tab (already set for CTAs) — ensure safe rel
$$('a[target="_blank"]').forEach(a => {
  if(!a.hasAttribute('rel')) a.setAttribute('rel','noopener noreferrer');
});
