// Portfolio page-specific JavaScript
const initPortfolioModal = () => {
    const babinCard = document.querySelector('.featured-card[data-member="babin"]');
    const modal = document.getElementById('cvModal');
    
    console.log("Portfolio CV Modal Init:", { babinCard: !!babinCard, modal: !!modal });

    if (!babinCard || !modal) return;

    const modalBackdrop = modal.querySelector('.cv-modal-backdrop');
    const modalClose = modal.querySelector('.cv-modal-close');
    const modalContent = modal.querySelector('.cv-modal-content');

    // Open Modal
    babinCard.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Babin Maden portfolio card clicked!");
        
        // Populate modal with HTML CV (more compatible than PDF under file:// protocol)
        modalContent.innerHTML = `
            <iframe class="cv-modal-iframe" src="babincv.html" title="Babin Maden CV"></iframe>
        `;
        
        // Show modal by adding class and locking main page scrolling
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Modal Function
    const closeModal = () => {
        console.log("Closing CV modal...");
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear iframe after transition to stop PDF/HTML background processes
        setTimeout(() => {
            modalContent.innerHTML = '';
        }, 300);
    };

    // Close on click of close button, backdrop, or escape key
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
};

// Robust DOM load check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioModal);
} else {
    initPortfolioModal();
}


