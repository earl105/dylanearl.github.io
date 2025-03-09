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

// Project carousel functions
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

// Load Three.js from CDN
document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initLaptop;
    document.head.appendChild(script);
});

// This function is changed to properly position and rotate the laptop screen
function initLaptop() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 600 / 450, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(600, 450); // Increased size for more screen real estate
    renderer.setClearColor(0x000000, 0);
    
    const container = document.getElementById('laptop-scene');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        console.error('Laptop container not found');
        return;
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create laptop base and screen
    const laptopGroup = new THREE.Group();
    
    // Laptop base
    const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    laptopGroup.add(base);
    
    // Add keyboard
    const keyboardGeometry = new THREE.PlaneGeometry(2.8, 1.8);
    const keyboardMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.rotation.x = -Math.PI / 2;
    keyboard.position.y = 0.11;
    base.add(keyboard);
    
    // Add key grid
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 12; j++) {
            const keyGeometry = new THREE.BoxGeometry(0.18, 0.02, 0.18);
            const keyMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.set(-1.3 + j * 0.23, 0.13, -0.8 + i * 0.25);
            base.add(key);
        }
    }


    //add spacebar
    const spaceGeometry = new THREE.BoxGeometry(1.2, 0.18, 0.07);
    const spaceMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    space.rotation.x = -Math.PI / 2;
    space.position.y = 0.111;
    space.position.z = 0.2;
    base.add(space);
    
    // Add trackpad
    const trackpadGeometry = new THREE.PlaneGeometry(1, 0.5);
    const trackpadMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.y = 0.111;
    trackpad.position.z = 0.6;
    base.add(trackpad);
    
    // Laptop screen
    const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    
    // Screen display
    const displayGeometry = new THREE.PlaneGeometry(2.8, 1.8);
    const displayMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.z = 0.06;
    screen.add(display);
    
    // Create a hinge group to handle proper rotation
    const hingeGroup = new THREE.Group();
    laptopGroup.add(hingeGroup);
    
    // Position the hinge at the back of the base
    hingeGroup.position.z = -1;
    
    // Add the screen to the hinge group
    hingeGroup.add(screen);
    
    // Position the screen so its bottom edge is at the hinge point
    screen.position.y = 1.05; // Half the screen height (2/2=1) to place bottom at origin
    
    // Set initial screen angle
    hingeGroup.rotation.x = -Math.PI / 6; // Slightly open by default
    
    laptopGroup.position.y = -0.3; // Position slightly higher on the screen
    scene.add(laptopGroup);
    
    // Variables for dragging interaction
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    
    // Event listeners for dragging
    container.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });
    
    container.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
                
            };
            
            // Rotate the laptop group based on mouse movement
            laptopGroup.rotation.y += deltaMove.x * 0.01;
            laptopGroup.rotation.x += deltaMove.y * 0.01;
          
            
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });
    
    window.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    // Scroll event to open/close laptop screen
    window.addEventListener('scroll', updateLaptopScreen);
    function updateLaptopScreen() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const section1 = document.getElementById('section1');
        
        if (section1) {
            const section1Top = section1.offsetTop;
            const section1Height = section1.offsetHeight;
            
            // Calculate scroll position relative to section1
            const relativeScroll = Math.min(Math.max(scrollY / section1Height, 0), 1);
            
            
            const closedRatio = relativeScroll; 
           
            const openRotation = -Math.PI / 6; 
            const closedRotation = 3; // approx Closed position (screen flush with chassis)
            
            // Linear interpolation between open and closed positions based on scroll
            hingeGroup.rotation.x = openRotation + (closedRatio * (closedRotation - openRotation));
        }
    }
    
    
    
    
    
    
    // Add passive movement to suggest interactivity
    let time = 0;
    
    function animate() {
        time += 0.01;
        
        // Add subtle passive movement to indicate interactivity
        if (!isDragging) {
            laptopGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
            //laptopGroup.rotation.x = Math.sin(time * 0.3) * 0.05 - 0.1; // Slight tilt
        }
        
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const containerWidth = Math.min(container.clientWidth, 600);
        const containerHeight = containerWidth * 0.75;
        
        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(containerWidth, containerHeight);
    });
    
    // Initial update for laptop screen position
    updateLaptopScreen();
}