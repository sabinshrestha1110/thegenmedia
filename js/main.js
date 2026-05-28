document.addEventListener("DOMContentLoaded", () => {
    // Scroll Animations using IntersectionObserver
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.featured-card, .story-image, .story-text, .feedback-container');
    animateElements.forEach((el, index) => {
        el.classList.add('fade-up-element');
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(el);
    });
});
