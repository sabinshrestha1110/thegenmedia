document.addEventListener('DOMContentLoaded', function() {
    const hero = document.getElementById('hero');

    if (hero) {
        window.addEventListener('scroll', function() {
            // Get the current scroll position
            const scrolled = window.scrollY;

            // Apply a subtle vertical movement (Parallax) to the hero background
            // The background moves 5 times slower than the foreground (scrolled / 5)
            hero.style.backgroundPositionY = (scrolled * 0.2) + 'px';
        });
    }

    // --- You can add more interactive JS features here later ---
});
