// ==========================================
// PORTFOLIO CONFIGURATION
// ==========================================

// IMPORTANT: Update this URL with your actual resume link
const RESUME_URL ="https://drive.google.com/uc?export=download&id=1_ner9lrnGfmhN0iPICdnO3_A2MHO8ZYO";
// Alternative: You can also use direct download links from Google Drive, Dropbox, etc.
// Example: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"

// ==========================================
// DOM ELEMENTS
// ==========================================

const imageInput = document.getElementById('imageInput');
const profileImg = document.getElementById('profileImg');
const scrollTopBtn = document.getElementById('scrollTop');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectsGrid = document.getElementById('projectsGrid');
const resumeLink = document.getElementById('resumeLink');

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    setupImageUpload();
    setupProjectFiltering();
    setupScrollToTop();
    setupSmoothScrolling();
    setupResumeLink();
    setupSkillCardInteraction();
}

// ==========================================
// IMAGE UPLOAD FUNCTIONALITY
// ==========================================

function setupImageUpload() {
    if (imageInput && profileImg) {
        imageInput.addEventListener('change', handleImageUpload);
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        showNotification('No file selected', 'error');
        return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please select a valid image file (JPEG, PNG, GIF, or WebP)', 'error');
        return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        showNotification('Image size should be less than 5MB', 'error');
        return;
    }

    // Create FileReader to read the image
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // Set the background image
            profileImg.style.backgroundImage = `url(${e.target.result})`;
            profileImg.classList.add('has-image');
            
            // Store in localStorage for persistence
            localStorage.setItem('profileImage', e.target.result);
            
            showNotification('Profile photo updated successfully!', 'success');
        } catch (error) {
            console.error('Error loading image:', error);
            showNotification('Error loading image. Please try again.', 'error');
        }
    };

    reader.onerror = function() {
        showNotification('Error reading file. Please try again.', 'error');
    };

    reader.readAsDataURL(file);
}

// Load saved profile image on page load
function loadSavedImage() {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage && profileImg) {
        profileImg.style.backgroundImage = `url(${savedImage})`;
        profileImg.classList.add('has-image');
    }
}

// ==========================================
// PROJECT FILTERING FUNCTIONALITY
// ==========================================

function setupProjectFiltering() {
    // Add click listeners to filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProjects(filter);
            updateActiveFilter(this);
        });
    });
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories');
        
        if (category === 'all') {
            card.classList.remove('hidden');
            card.style.display = 'block';
            visibleCount++;
        } else if (categories && categories.split(',').includes(category)) {
            card.classList.remove('hidden');
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });

    // Show message if no projects found
    showFilterResults(visibleCount, category);
    
    // Smooth scroll to projects section after filtering
    setTimeout(() => {
        scrollToSection('projects');
    }, 100);
}

function updateActiveFilter(activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function showFilterResults(count, category) {
    // Remove any existing result message
    const existingMessage = document.querySelector('.filter-result-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create result message
    const message = document.createElement('div');
    message.className = 'filter-result-message';
    message.style.cssText = `
        text-align: center;
        margin: 2rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
        color: #666;
        font-size: 1rem;
    `;

    if (count === 0) {
        message.innerHTML = `<p>No projects found for "${category}". <button onclick="filterProjects('all')" style="color: #3498db; background: none; border: none; cursor: pointer; font-weight: 600;">Show all projects</button></p>`;
        message.style.background = '#fff3cd';
        message.style.color = '#856404';
    } else {
        const categoryName = category === 'all' ? 'All Projects' : category.charAt(0).toUpperCase() + category.slice(1);
        message.innerHTML = `<p>Showing ${count} project${count !== 1 ? 's' : ''} for <strong>${categoryName}</strong></p>`;
    }

    // Insert after filter buttons
    const filterContainer = document.querySelector('.projects-filter');
    filterContainer.parentNode.insertBefore(message, projectsGrid);

    // Auto-remove message after 3 seconds if showing results
    if (count > 0) {
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
}

// ==========================================
// SKILL CARD INTERACTION
// ==========================================

function setupSkillCardInteraction() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            if (skill) {
                filterBySkill(skill);
            }
        });
    });
}

function filterBySkill(skill) {
    // Scroll to projects section
    scrollToSection('projects');
    
    // Wait for scroll to complete, then filter
    setTimeout(() => {
        filterProjects(skill);
        
        // Update active filter button
        const targetBtn = document.querySelector(`[data-filter="${skill}"]`);
        if (targetBtn) {
            updateActiveFilter(targetBtn);
        }
        
        showNotification(`Showing ${skill.toUpperCase()} projects`, 'info');
    }, 500);
}

// ==========================================
// SCROLL FUNCTIONALITY
// ==========================================

function setupScrollToTop() {
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', scrollToTop);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function setupSmoothScrolling() {
    // Add smooth scrolling to all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80; // Height of fixed header
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ==========================================
// RESUME FUNCTIONALITY
// ==========================================

function setupResumeLink() {
    if (resumeLink) {
        // Update the resume link with the configured URL
        resumeLink.href = RESUME_URL;
        
        // Add click tracking
        resumeLink.addEventListener('click', function(e) {
            // Validate URL before allowing click
            if (RESUME_URL.includes('YOUR_RESUME_FILE_ID')) {
                e.preventDefault();
                showNotification('Please update the resume URL in script.js file', 'warning');
                return;
            }
            
            // Track resume download
            console.log('Resume download initiated');
            showNotification('Opening resume...', 'info');
        });
    }
}

// Function to update resume URL programmatically
function updateResumeLink(newUrl) {
    if (resumeLink) {
        resumeLink.href = newUrl;
        showNotification('Resume link updated successfully!', 'success');
    }
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set styles based on type
    const colors = {
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
    };

    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${color.bg};
        color: ${color.text};
        border: 1px solid ${color.border};
        border-radius: 8px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations here
    const elements = document.querySelectorAll('.skill-card, .project-card');
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ==========================================
// ERROR HANDLING
// ==========================================

window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// ==========================================
// LOAD SAVED DATA
// ==========================================

// Load saved profile image when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSavedImage();
});

// ==========================================
// EXPORT FUNCTIONS (for external use)
// ==========================================

// Make key functions available globally
window.portfolioFunctions = {
    filterProjects,
    scrollToSection,
    updateResumeLink,
    showNotification,
    handleImageUpload: () => imageInput.click()
};