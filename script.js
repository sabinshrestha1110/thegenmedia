// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    
    // SCROLL REVEAL ANIMATION
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // How many pixels into view before revealing

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("active");
            }
        });
    };

    // Trigger once on load
    revealOnScroll();
    
    // Trigger on scroll
    window.addEventListener("scroll", revealOnScroll);
});
