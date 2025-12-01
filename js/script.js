document.addEventListener('DOMContentLoaded', function() {
    const hero = document.getElementById('hero');

    if (hero) {
        window.addEventListener('scroll', function() {
            // Get the current scroll position
            const scrolled = window.scrollY;

            // Apply a subtle vertical movement (Parallax) to the hero background
            // The background moves 5 times slower than the foreground (scrolled * 0.2)
            // This is the "moving element" effect requested by graphic designers.
            hero.style.backgroundPositionY = (scrolled * 0.2) + 'px';
        });
    }

    // --- Add more interactive JS features (like fade-in on scroll) here later ---
});
