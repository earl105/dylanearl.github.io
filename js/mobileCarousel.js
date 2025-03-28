document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in mobile view
    function initMobileProjectCarousel() {
        // Only run on mobile screens
        if (window.innerWidth > 768) return;

        const projectsSection = document.getElementById('section3');
        // Check if the mobile carousel container already exists, if so, don't recreate it
        if (projectsSection.querySelector('.mobile-projects-container')) return;

        // Get project data from HTML
        const mobileProjectDataElements = document.querySelectorAll('#mobile-project-data .mobile-project-card-data');
        const mobileProjectsData = Array.from(mobileProjectDataElements).map(el => ({
            header: el.getAttribute('data-header'),
            title: el.getAttribute('data-title'),
            icons: JSON.parse(el.getAttribute('data-icons')),
            description: el.textContent.trim()
        }));

        console.log('Mobile Projects Data:', mobileProjectsData);

        // Create mobile projects container
        const mobileProjectsContainer = document.createElement('div');
        // Make sure it only shows on mobile using the existing class structure
        mobileProjectsContainer.className = 'mobile-projects-container mobile-only';

        // Create project card
        const projectCard = document.createElement('div');
        projectCard.className = 'mobile-project-card';

        // Current project index
        let currentProjectIndex = 0;

        // Create project elements
        function renderProject(project) {
            // Clear existing content *of the card only*
            projectCard.innerHTML = '';

            // Header
            const projectHeader = document.createElement('div');
            projectHeader.className = `mobile-project-header ${project.header}`;
            projectCard.appendChild(projectHeader);

            // Body
            const projectBody = document.createElement('div');
            projectBody.className = 'mobile-project-body';

            // Title
            const projectTitle = document.createElement('div');
            projectTitle.className = 'mobile-project-title';
            projectTitle.innerHTML = `
                ${project.title}
                <div class="mobile-project-icons">
                    ${project.icons.map(icon => `<img src="${icon}" alt="Tech Logo">`).join('')}
                </div>
            `;
            projectBody.appendChild(projectTitle);

            // Description
            const projectDescription = document.createElement('div');
            projectDescription.className = 'mobile-project-description';
            projectDescription.textContent = project.description;
            projectBody.appendChild(projectDescription);

            projectCard.appendChild(projectBody);
        }

        // Navigation arrows
        const arrowLeft = document.createElement('div');
        arrowLeft.className = 'mobile-arrow-nav mobile-arrow-left';
        arrowLeft.textContent = '←';
        arrowLeft.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex - 1 + mobileProjectsData.length) % mobileProjectsData.length;
            renderProject(mobileProjectsData[currentProjectIndex]);
        });

        const arrowRight = document.createElement('div');
        arrowRight.className = 'mobile-arrow-nav mobile-arrow-right';
        arrowRight.textContent = '→';
        arrowRight.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex + 1) % mobileProjectsData.length;
            renderProject(mobileProjectsData[currentProjectIndex]);
        });

        // Assemble container
        mobileProjectsContainer.appendChild(arrowLeft);
        mobileProjectsContainer.appendChild(projectCard);
        mobileProjectsContainer.appendChild(arrowRight);

        // Append the mobile container to the projects section
        projectsSection.appendChild(mobileProjectsContainer);

        // Initial render
        renderProject(mobileProjectsData[currentProjectIndex]);
    }

    // Initial load and resize handling
    initMobileProjectCarousel();
    window.addEventListener('resize', initMobileProjectCarousel);
});