// scripts.js — minimal, accessible interactivity

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if(menuToggle && mobileNav){
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Theme (dark/light) toggle stored in localStorage
const themeToggle = document.getElementById('themeToggle');
function setTheme(mode){ // mode: 'dark' | 'light'
  if(mode === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
  localStorage.setItem('tg-theme', mode);
}
(function initTheme(){
  const saved = localStorage.getItem('tg-theme');
  if(saved) setTheme(saved);
  else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    setTheme(prefersLight ? 'light' : 'dark');
  }
})();
if(themeToggle){
  themeToggle.addEventListener('click', ()=> {
    const light = document.documentElement.classList.contains('light');
    setTheme(light ? 'dark' : 'light');
  });
}

// Scroll reveal (IntersectionObserver)
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
},{threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Respect prefers-reduced-motion
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.reveal').forEach(el=>{ el.style.transition = 'none'; el.classList.add('is-visible'); });
}

// Close mobile nav on resize > 900
window.addEventListener('resize', ()=> {
  if(window.innerWidth >= 900 && mobileNav) { mobileNav.hidden = true; menuToggle && menuToggle.setAttribute('aria-expanded','false'); }
});
