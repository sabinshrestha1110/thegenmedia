document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar nav a');

    navLinks.forEach(link => {
        const linkHref = (link.getAttribute('href') || '').split('/').pop().toLowerCase();
        if (currentPage === linkHref || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            hamburger.classList.toggle('open');
        });
    }
});
