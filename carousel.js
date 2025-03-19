// Project carousel variables
let projectCards = [];
let visibleProjects = 3;
let totalProjects = 5;
let currentStartIndex = 0;
let isAnimating = false; // Flag to prevent multiple animations running simultaneously
let lastDirection = null; // Track the last direction of movement
const animationDuration = 500; // Animation duration in milliseconds

// Initialize project carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectCarousel();
});

function initializeProjectCarousel() {
    projectCards = Array.from(document.querySelectorAll('.project-card'));
    totalProjects = projectCards.length;
    
    // Set up arrow functionality
    document.querySelector('.arrow-left').addEventListener('click', function() {
        if (!isAnimating) {
            rotateProjects('left');
        }
    });
    
    document.querySelector('.arrow-right').addEventListener('click', function() {
        if (!isAnimating) {
            rotateProjects('right');
        }
    });
    
    // Initial setup - position all cards and show only visible ones
    setupInitialState();
}

function setupInitialState() {
    // Position all cards, even hidden ones
    projectCards.forEach((card, index) => {
        // Set initial positions
        card.style.transition = 'none'; // No transition for initial setup
        card.style.position = 'absolute';
        card.style.left = (index < visibleProjects ? (index * 33.3) + '%' : '100%');
        card.style.width = '30%';
        card.style.opacity = index < visibleProjects ? '1' : '0';
        
        // Only the first visibleProjects cards should be visible
        if (index < visibleProjects) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Force reflow to ensure styles are applied before enabling transitions
    void projectCards[0].offsetWidth;
    
    // Enable transitions for future updates
    projectCards.forEach(card => {
        card.style.transition = `left ${animationDuration}ms ease, opacity ${animationDuration/2}ms ease`;
    });
}

function rotateProjects(direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Store the current direction for next rotation
    const directionChanged = lastDirection !== null && lastDirection !== direction;
    lastDirection = direction;
    
    // Calculate new start index
    const newStartIndex = (direction === 'left') 
        ? (currentStartIndex - 1 + totalProjects) % totalProjects 
        : (currentStartIndex + 1) % totalProjects;
    
    // The card that will appear
    const newCardIndex = (direction === 'left')
        ? newStartIndex
        : (newStartIndex + visibleProjects - 1) % totalProjects;
    
    // The card that will disappear
    const disappearingCardIndex = (direction === 'left')
        ? (currentStartIndex + visibleProjects - 1) % totalProjects
        : currentStartIndex;
    
    // If direction changed, reposition all hidden cards to match the new direction
    if (directionChanged) {
        projectCards.forEach((card, index) => {
            // Only adjust hidden cards' positions
            if (card.classList.contains('hidden')) {
                if (direction === 'left') {
                    // When going left, hidden cards should be positioned to the left
                    card.style.transition = 'none';
                    card.style.left = '-33%';
                } else {
                    // When going right, hidden cards should be positioned to the right
                    card.style.transition = 'none';
                    card.style.left = '100%';
                }
                // Force reflow
                void card.offsetWidth;
                // Re-enable transitions
                card.style.transition = `left ${animationDuration}ms ease, opacity ${animationDuration/2}ms ease`;
            }
        });
    }
    
    // Prepare the new card
    const newCard = projectCards[newCardIndex];
    newCard.classList.remove('hidden');
    
    // Set initial position and opacity for the new card before animation
    if (direction === 'left') {
        // Position the new card offscreen to the left
        newCard.style.left = '-33%';
        newCard.style.opacity = '0';
    } else {
        // Position the new card offscreen to the right
        newCard.style.left = '100%';
        newCard.style.opacity = '0';
    }
    
    // Force reflow
    void newCard.offsetWidth;
    
    // Animate all cards
    setTimeout(() => {
        // Update opacity for both new and disappearing cards
        newCard.style.opacity = '1';
        projectCards[disappearingCardIndex].style.opacity = '0';
        
        // Update positions for all cards
        for (let i = 0; i < totalProjects; i++) {
            const relativePosition = (totalProjects + i - newStartIndex) % totalProjects;
            
            if (relativePosition < visibleProjects) {
                // This card will be visible after animation
                projectCards[i].style.left = (relativePosition * 33.3) + '%';
            } else if (i === disappearingCardIndex) {
                // This card will move off-screen
                if (direction === 'left') {
                    projectCards[i].style.left = '100%'; // Move off to the right
                } else {
                    projectCards[i].style.left = '-33%'; // Move off to the left
                }
            }
        }
    }, 50);
    
    // After animation completes, update state and clean up
    setTimeout(() => {
        // Hide the card that moved off-screen
        projectCards[disappearingCardIndex].classList.add('hidden');
        
        // Reset opacity for next time
        projectCards[disappearingCardIndex].style.opacity = '1';
        
        // Important: Ensure the hidden card is positioned correctly for next time it appears
        if (direction === 'left') {
            // Position it offscreen to the left for next time
            projectCards[disappearingCardIndex].style.left = '-33%';
        } else {
            // Position it offscreen to the right for next time
            projectCards[disappearingCardIndex].style.left = '100%';
        }
        
        // Update current index state
        currentStartIndex = newStartIndex;
        isAnimating = false;
    }, animationDuration + 100); // Add a small buffer to ensure animation completes
}