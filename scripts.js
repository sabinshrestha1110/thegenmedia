// scripts.js — menu, reveal, filter, modal, parallax

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if(menuToggle){
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    if(mobileNav) mobileNav.hidden = expanded;
  });
}

// Reveal on scroll (IntersectionObserver)
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Simple filter for work
const filters = document.querySelectorAll('.filter');
const workGrid = document.getElementById('workGrid');
filters.forEach(btn=>{
  btn.addEventListener('click', () => {
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.work-item').forEach(item=>{
      if(filter === 'all' || item.dataset.type === filter) item.style.display = '';
      else item.style.display = 'none';
    });
  });
});

// Modal behavior for cases
const modal = document.getElementById('caseModal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalClose = document.querySelector('.modal-close');

function openCase(title, type){
  modalMedia.innerHTML = ''; // we can inject a larger SVG mockup
  // basic mockup HTML - reuse a simplicity: show an img referencing Logo.svg scaled and some text
  const big = document.createElement('div'); big.innerHTML = `
    <svg viewBox="0 0 800 480" style="width:100%;height:auto;background:#eee7e9;border-radius:10px;">
      <rect width="100%" height="100%" rx="10" fill="#eee7e9"/>
      <image href="/Logo.svg" x="36" y="36" width="150" height="150"></image>
    </svg>
  `;
  modalTitle.textContent = title;
  modalDesc.textContent = 'Mockup case: ' + type + '. This prototype uses generated mockups based on your logo. Replace with real images later.';
  modalMedia.appendChild(big);
  modal.setAttribute('aria-hidden','false');
}

document.querySelectorAll('.open-case').forEach((btn, idx)=>{
  btn.addEventListener('click', (e)=>{
    const item = e.target.closest('.work-item');
    const title = item.dataset.title || item.querySelector('.work-title').textContent;
    const type = item.dataset.type || 'project';
    openCase(title, type);
  });
});

if(modalClose){
  modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
}
modal.addEventListener('click', (e)=> { if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

// Parallax on elements with [data-parallax]
const parallaxEls = document.querySelectorAll('[data-parallax]');
let lastScroll = 0;
function updateParallax(){
  const sc = window.scrollY;
  parallaxEls.forEach(el=>{
    const mul = parseFloat(el.getAttribute('data-parallax')) || -0.1;
    el.style.transform = `translateY(${sc * mul}px)`;
  });
  lastScroll = sc;
  requestAnimationFrame(updateParallax);
}
requestAnimationFrame(updateParallax);

// Accessibility and reduced motion
if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  parallaxEls.forEach(el => el.style.transform = 'none');
}
