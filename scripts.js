// scripts.js — interactions: mobile menu, reveal, parallax, theme toggle, anchor offset, accessible links

// helpers
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// MOBILE MENU
const menuToggle = $('#menuToggle');
const mobileMenu = $('#mobileMenu');
if(menuToggle){
  menuToggle.addEventListener('click', ()=>{
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    if(mobileMenu){
      mobileMenu.hidden = !open;
      mobileMenu.setAttribute('aria-hidden', String(!open));
    }
  });
}

// THEME TOGGLE (auto-detect and manual)
const themeToggle = $('#themeToggle');
const root = document.documentElement;
const userPref = localStorage.getItem('tgm-theme');
function applyTheme(theme){
  if(theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem('tgm-theme', theme);
}
function detectTheme(){
  if(userPref) applyTheme(userPref);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
  else applyTheme('light');
}
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const darked = root.classList.contains('dark');
    applyTheme(darked ? 'light' : 'dark');
  });
}
detectTheme();

// SMOOTH REVEAL (IntersectionObserver)
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('is-visible'); observer.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  $$('.reveal').forEach(el => io.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('is-visible'));
}

// PARALLAX: simple, efficient (respect reduced motion)
const parallaxEls = $$('[data-parallax]');
function updateParallax(){
  const scroll = window.scrollY;
  parallaxEls.forEach(el => {
    const m = parseFloat(el.dataset.parallax) || -0.08;
    el.style.transform = `translateY(${Math.round(scroll * m)}px)`;
  });
}
if(!prefersReduced){
  requestAnimationFrame(function loop(){ updateParallax(); requestAnimationFrame(loop); });
}

// ANCHOR OFFSET FOR STICKY HEADER
function offsetAnchor(){
  if(location.hash.length > 1){
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if(el){
      const header = document.querySelector('.site-header');
      const headerH = header ? header.offsetHeight : 84;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({top, behavior: 'smooth'});
    }
  }
}
window.addEventListener('hashchange', offsetAnchor);
window.addEventListener('load', ()=> setTimeout(offsetAnchor, 60));

// EXTERNAL LINKS safety
$$('a[target="_blank"]').forEach(a => { if(!a.hasAttribute('rel')) a.setAttribute('rel','noopener noreferrer'); });

// STICKY CTA (mobile visibility)
function updateSticky(){
  const st = document.querySelector('.sticky-cta');
  if(!st) return;
  st.style.display = window.innerWidth >= 900 ? 'none' : 'flex';
}
window.addEventListener('resize', updateSticky);
window.addEventListener('load', updateSticky);
