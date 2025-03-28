// Variables to track scrolling state
let isScrolling = false;
let scrollTimer = null;
let sections = [];
let indicators = [];
let currentSection = 0;
let navLinks = [];

// Initialize everything when the page loads
window.addEventListener('load', initialize);

function initialize() {
    getSections();
    setupIndicators();
    setupNavLinks();
    
    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchmove', handleScrollStart);
    window.addEventListener('wheel', handleScrollStart);
    window.addEventListener('resize', handleResize);
    
    // Initial update of indicators based on starting position
    updateIndicators(getCurrentSection());
}

function getSections() {
    sections = Array.from(document.querySelectorAll('.section'));
    indicators = Array.from(document.querySelectorAll('.indicator'));
    navLinks = Array.from(document.querySelectorAll('.nav-link'));
}

function setupIndicators() {
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => scrollToSection(index));
    });
}

function setupNavLinks() {
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#section')) {
                e.preventDefault();
                const sectionIndex = parseInt(link.getAttribute('href').replace('#section', '')) - 1;
                scrollToSection(sectionIndex);
            }
        });
    });
}

function updateIndicators(index) {
    currentSection = index;
    
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update navigation links
    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#section')) {
            const sectionIndex = parseInt(href.replace('#section', '')) - 1;
            if (sectionIndex === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    const targetPosition = index * window.innerHeight;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function getCurrentSection() {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Calculate which section is most visible
    const sectionIndex = Math.round(scrollPosition / viewportHeight);
    
    // Ensure index is within bounds
    return Math.max(0, Math.min(sectionIndex, sections.length - 1));
}

function handleScrollStart() {
    isScrolling = true;
    clearScrollTimer();
}

function handleScrollEnd() {
    isScrolling = false;
    
    // Find the nearest section
    const nearestSection = getCurrentSection();
    
    // Only snap if we're not already at the target section
    if (nearestSection !== currentSection) {
        scrollToSection(nearestSection);
    }
    
    // Update indicators
    updateIndicators(nearestSection);
}

function clearScrollTimer() {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
        scrollTimer = null;
    }
}

function handleScroll() {
    // Reset the timer each time we scroll
    clearScrollTimer();
    // Wait 150ms after scroll stops before snapping
    scrollTimer = setTimeout(handleScrollEnd, 150);
}

function handleResize() {
    // Recalculate sections on window resize
    getSections();
    
    // Re-snap to current section to maintain proper alignment
    scrollToSection(currentSection);
}