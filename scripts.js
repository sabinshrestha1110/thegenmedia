// Minimal, modern JS: menu, theme, reveal, accessibility

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if(menuToggle && mobileNav){
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    if(open){
      mobileNav.hidden = true;
    } else {
      mobileNav.hidden = false;
    }
  });
  // close when clicking links
  mobileNav.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=> { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded','false'); });
  });
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
function setTheme(dark){
  if(dark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  localStorage.setItem('tg-theme', dark ? 'dark' : 'light');
}
(function initTheme(){
  const saved = localStorage.getItem('tg-theme');
  if(saved) setTheme(saved === 'dark');
  else setTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
})();
if(themeToggle){
  themeToggle.addEventListener('click', ()=> setTheme(!document.documentElement.classList.contains('dark')));
}

// Scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Accessibility: focus outlines (show when keyboard used)
(function(){
  function onFirstTab(e){
    if(e.key === 'Tab'){ document.body.classList.add('user-is-tabbing'); window.removeEventListener('keydown', onFirstTab); }
  }
  window.addEventListener('keydown', onFirstTab);
})();
