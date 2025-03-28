// Mobile Laptop Animation Script
document.addEventListener('DOMContentLoaded', function() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = initMobileLaptop;
        document.head.appendChild(script);
    }
});

function initMobileLaptop() {
    // Scene setup
    const scene = new THREE.Scene();
    const container = document.getElementById('laptop-scene');
    
    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = containerWidth * 0.75; // Maintain 4:3 aspect ratio
    
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 6; // Slightly further back to accommodate mobile view
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0);
    
    if (container) {
        // Clear any existing content (like the desktop version)
        container.innerHTML = '';
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
    
    // Create laptop group
    const laptopGroup = new THREE.Group();
    
    // Laptop base
    const baseGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x181818 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    laptopGroup.add(base);
    
    // Add keyboard
    const keyboardGeometry = new THREE.PlaneGeometry(2.8, 1.8);
    const keyboardMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.rotation.x = -Math.PI / 2;
    keyboard.position.y = 0.07;
    base.add(keyboard);
    
    // Add key grid
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 12; j++) {
            const keyGeometry = new THREE.BoxGeometry(0.18, 0.02, 0.18);
            const keyMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.set(-1.3 + j * 0.23, .07, -0.8 + i * 0.25);
            base.add(key);
        }
    }

    // Add spacebar
    const spaceGeometry = new THREE.BoxGeometry(1, 0.18, 0.07);
    const spaceMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
    space.rotation.x = -Math.PI / 2;
    space.position.y = 0.06;
    space.position.z = 0.2;
    base.add(space);
    
    // Add trackpad
    const trackpadGeometry = new THREE.PlaneGeometry(1, 0.5);
    const trackpadMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 });
    const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
    trackpad.rotation.x = -Math.PI / 2;
    trackpad.position.y = 0.075;
    trackpad.position.z = 0.6;
    base.add(trackpad);
    
    // Laptop screen
    const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x181818 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    
    // Create a text canvas
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 256;
    const textContext = textCanvas.getContext('2d');
    
    // Create a texture from the canvas
    const textTexture = new THREE.CanvasTexture(textCanvas);
    
    // Screen display with text texture
    const displayGeometry = new THREE.PlaneGeometry(2.8, 1.8);
    const displayMaterial = new THREE.MeshBasicMaterial({ 
        map: textTexture,
        color: 0x00ff00
    });
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
    screen.position.y = 1.05;
    
    // Set initial screen angle
    hingeGroup.rotation.x = -Math.PI / 6; // Slightly open by default
    
    // For mobile, center the laptop and adjust positioning
    laptopGroup.position.x = 0; // Centered horizontally
    laptopGroup.position.y = -2; // Slightly adjusted vertical position
    laptopGroup.rotation.x = 0.3; // Maintain the downward tilt
    laptopGroup.scale.set(2, 2, 2);
    scene.add(laptopGroup);
    
    // Text and interaction code remains the same as the desktop version
    const lines = [
        ">Dylan Earl",
        ">Software Dev",
        ">Student @",
        ">Ohio State"
    ];

    const secondLines = lines;

    let currentText = "";
    let targetText = "";
    let currentLineIndex = 0;
    let isTyping = true;
    let isFirstSet = true;
    let charIndex = 0;
    let timer = 0;
    let blinkTimer = 0;
    let showCursor = true;
    
    function updateTextCanvas() {
        textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
        textContext.fillStyle = 'rgba(0, 0, 0, 0.9)';
        textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
        
        textContext.font = 'bold 32px monospace';
        textContext.fillStyle = '#00ff00';
        
        const lines = currentText.split('\n');
        lines.forEach((line, index) => {
            const displayLine = line + (index === lines.length - 1 && showCursor ? '|' : '');
            textContext.fillText(displayLine, 20, 60 + index * 50);
        });
        
        textTexture.needsUpdate = true;
    }
    
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
        const section1 = document.getElementById('section1');
        
        if (section1) {
            const section1Top = section1.offsetTop;
            const section1Height = section1.offsetHeight;
            
            const relativeScroll = Math.min(Math.max(scrollY / section1Height, 0), 1);
            
            const closedRatio = relativeScroll; 
           
            const openRotation = -Math.PI / 6; 
            const closedRotation = 2.5;
            
            hingeGroup.rotation.x = openRotation + (closedRatio * (closedRotation - openRotation));
        }
    }
    
    // Add passive movement to suggest interactivity
    let time = 0;
    
    function animate() {
        time += 0.01;
        timer += 0.016;
        blinkTimer += 0.016;
        
        if (blinkTimer > 0.5) {
            showCursor = !showCursor;
            blinkTimer = 0;
        }
        
        // Text animation code remains the same as desktop version
        if (timer > 0.1) {
            timer = 0;
            
            const currentLines = isFirstSet ? lines : secondLines;
            
            // ... (rest of the text animation logic remains the same)
            
            // Update text and logic for typing/deleting
            if (isTyping) {
                if (charIndex < currentLines[currentLineIndex].length) {
                    charIndex++;
                    let newText = "";
                    for (let i = 0; i < currentLineIndex; i++) {
                        newText += currentLines[i] + '\n';
                    }
                    newText += currentLines[currentLineIndex].substring(0, charIndex);
                    targetText = newText;
                } else if (currentLineIndex < currentLines.length - 1) {
                    currentLineIndex++;
                    charIndex = 0;
                } else if (timer > 1) {
                    isTyping = false;
                    timer = 0;
                    charIndex = currentLines[currentLines.length - 1].length;
                }
            } else {
                // Deleting animation code (same as desktop version)
                if (charIndex > 0) {
                    charIndex--;
                    
                    let newText = "";
                    for (let i = 0; i < currentLineIndex; i++) {
                        newText += currentLines[i] + '\n';
                    }
                    newText += currentLines[currentLineIndex].substring(0, charIndex);
                    targetText = newText;
                } else if (currentLineIndex > 0) {
                    currentLineIndex--;
                    charIndex = currentLines[currentLineIndex].length;
                } else if (timer > 1) {
                    isTyping = true;
                    isFirstSet = !isFirstSet;
                    currentLineIndex = 0;
                    charIndex = 0;
                    timer = 0;
                }
            }
            
            currentText = targetText;
        }
        
        updateTextCanvas();
        
        // Add subtle passive movement to indicate interactivity
        if (!isDragging) {
            laptopGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
            laptopGroup.rotation.x = Math.sin(time * 0.3) * 0.05 + 0.3;
        }
        
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            const containerWidth = container.clientWidth;
            const containerHeight = containerWidth * 1.5;
            
            camera.aspect = containerWidth / containerHeight;
            camera.updateProjectionMatrix();
            
            renderer.setSize(containerWidth, containerHeight);
        }
    });
    
    // Initial update for laptop screen position
    updateLaptopScreen();
}