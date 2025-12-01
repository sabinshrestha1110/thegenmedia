// scripts.js - small vanilla JS for nav, dark mode, scroll reveal, accessibility

// Mobile nav toggle (works for multiple header buttons)
function bindNavToggle(toggleId, navId){
  const btn = document.getElementById(toggleId);
  const nav = document.getElementById(navId);
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? '' : 'block';
  });
}

// Bind toggles for headers if present
bindNavToggle('navToggle', 'siteNav');
bindNavToggle('navToggle2', 'siteNav2');
bindNavToggle('navToggle3', 'siteNav3');
bindNavToggle('navToggle4', 'siteNav4');
bindNavToggle('navToggle5', 'siteNav5');

// Theme toggle (dark mode)
const themeButtons = document.querySelectorAll('.theme-toggle');
function applyTheme(isDark){
  if(isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  localStorage.setItem('thegen-dark', isDark ? '1' : '0');
}
function initTheme(){
  const saved = localStorage.getItem('thegen-dark');
  if(saved === null){
    // default: follow system
    const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(dark);
  } else {
    applyTheme(saved === '1');
  }
}
themeButtons.forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(!isDark);
  });
});
initTheme();

// Simple scroll reveal using IntersectionObserver
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
},{threshold: 0.12});

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Close mobile nav when clicking a link (for single-page nav)
document.querySelectorAll('.site-nav a[data-link]').forEach(a=>{
  a.addEventListener('click', ()=>{
    // hide any visible nav panels
    document.querySelectorAll('.site-nav').forEach(nav=>nav.style.display='');
    document.querySelectorAll('.nav-toggle').forEach(btn=>btn.setAttribute('aria-expanded','false'));
  });
});

// Accessibility: show focus outlines on keyboard use only
(function(){
  function handleFirstTab(e){
    if(e.key === 'Tab'){
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// Optional: hide sticky CTA on large screens (CSS already hides), small behavior
(function(){
  const sticky = document.getElementById('stickyCta');
  if(!sticky) return;
  function update(){
    if(window.innerWidth >= 900) sticky.style.display = 'none';
    else sticky.style.display = '';
  }
  window.addEventListener('resize', update);
  update();
})();
