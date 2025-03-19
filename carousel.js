// Project carousel variables
let projectCards = [];
let visibleProjects = 3;
let totalProjects = 5;
let currentStartIndex = 0;

// Initialize project carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectCarousel();
});

function initializeProjectCarousel() {
    projectCards = Array.from(document.querySelectorAll('.project-card'));
    totalProjects = projectCards.length;
    
    // Set up arrow functionality
    document.querySelector('.arrow-left').addEventListener('click', function() {
        rotateProjects('left');
    });
    
    document.querySelector('.arrow-right').addEventListener('click', function() {
        rotateProjects('right');
    });
    
    // Initial display
    updateVisibleProjects();
}

function rotateProjects(direction) {
    if (direction === 'left') {
        // Move one position to the right (show the previous card)
        currentStartIndex = (currentStartIndex - 1 + totalProjects) % totalProjects;
    } else if (direction === 'right') {
        // Move one position to the left (show the next card)
        currentStartIndex = (currentStartIndex + 1) % totalProjects;
    }
    
    updateVisibleProjects();
}

function updateVisibleProjects() {
    // Hide all projects first
    projectCards.forEach(card => {
        card.classList.add('hidden');
    });
    
    // Show only the visible ones
    for (let i = 0; i < visibleProjects; i++) {
        let index = (currentStartIndex + i) % totalProjects;
        projectCards[index].classList.remove('hidden');
        
        // Position the cards side by side with left-to-right ordering
        projectCards[index].style.order = i;
    }
}