// Loading Spinner
window.addEventListener('load', function() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.opacity = '0';
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
        }, 500);
    }
});

// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Toggle mobile menu
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Handle touch events for better mobile experience
    let touchStartY = 0;
    let touchEndY = 0;

    navMenu.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    navMenu.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        // Swipe up to close menu
        if (diff > swipeThreshold && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .sport-card, .section-title');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Form handling for contact page
    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    const submitAnotherBtn = document.getElementById('submit-another');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                preferred_sport: document.getElementById('preferred_sport').value,
                message: document.getElementById('message').value.trim()
            };

            // Validate form data
            const errors = window.SupabaseService ? window.SupabaseService.validateForm(formData) : [];
            
            if (errors.length > 0) {
                showNotification(errors.join(', '), 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Submit to Supabase
                if (window.SupabaseService) {
                    const result = await window.SupabaseService.submitEnquiry(formData);
                    if (result.success) {
                        // Hide form and show thank you message
                        contactForm.style.display = 'none';
                        thankYouMessage.style.display = 'block';
                        
                        // Scroll to thank you message
                        thankYouMessage.scrollIntoView({ behavior: 'smooth' });
                        
                        showNotification('Enquiry submitted successfully!', 'success');
                    } else {
                        showNotification('Error submitting enquiry. Please try again.', 'error');
                    }
                } else {
                    // Fallback: Show error if Supabase is not available
                    showNotification('Service temporarily unavailable. Please try again later.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error submitting enquiry. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Handle "Submit Another Enquiry" button
    if (submitAnotherBtn) {
        submitAnotherBtn.addEventListener('click', function() {
            // Hide thank you message and show form again
            thankYouMessage.style.display = 'none';
            contactForm.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Scroll to form
            contactForm.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Remove country code if present
            if (value.startsWith('91')) {
                value = value.substring(2);
            }
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            e.target.value = value;
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        line-height: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(style);

// Utility functions
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

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
window.addEventListener('scroll', debounce(function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollTopBtn = document.getElementById('scroll-top-btn');
    
    if (scrollTop > 300) {
        if (!scrollTopBtn) {
            scrollTopBtn = document.createElement('button');
            scrollTopBtn.id = 'scroll-top-btn';
            scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollTopBtn.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
                transition: all 0.3s ease;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            `;
            scrollTopBtn.addEventListener('click', scrollToTop);
            document.body.appendChild(scrollTopBtn);
        }
        scrollTopBtn.style.display = 'flex';
    } else if (scrollTopBtn) {
        scrollTopBtn.style.display = 'none';
    }
}, 100));

// Initialize tooltips if needed
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #1e293b;
                color: white;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this.addEventListener('mouseleave', function() {
                tooltip.remove();
            });
        });
    });
}

// Initialize tooltips when DOM is loaded
document.addEventListener('DOMContentLoaded', initTooltips);

// Smooth reveal animations for sections
const revealSections = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', function() {
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });
});

// Hero Slider Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    // Check if elements exist before proceeding
    if (!slides || slides.length === 0) return;
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Only handle dots if they exist
    if (dots && dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
    }
    
    // Show current slide
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    
    // Only handle dots if they exist
    if (dots && dots.length > currentSlide) {
        dots[currentSlide].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

function goToSlide(n) {
    currentSlide = n - 1;
    showSlide(currentSlide);
}

// Auto-advance slides every 5 seconds (only if slides exist)
if (slides && slides.length > 1) {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Initialize slider (only if slides exist)
document.addEventListener('DOMContentLoaded', function() {
    if (slides && slides.length > 0) {
        showSlide(0);
    }
});

function setupCourtSliderDots(galleryId, dotsId) {
    const gallery = document.getElementById(galleryId);
    const dotsContainer = document.getElementById(dotsId);
    if (!gallery || !dotsContainer) return;
    const images = gallery.querySelectorAll('img');
    dotsContainer.innerHTML = '';
    images.forEach((img, idx) => {
        const dot = document.createElement('span');
        dot.className = 'court-slider-dot' + (idx === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
    });
    gallery.addEventListener('scroll', () => {
        const scrollLeft = gallery.scrollLeft;
        const imgWidth = images[0].offsetWidth + 12; // 12px gap
        const idx = Math.round(scrollLeft / imgWidth);
        dotsContainer.querySelectorAll('.court-slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupCourtSliderDots('courtGalleryBadminton', 'courtSliderDotsBadminton');
    setupCourtSliderDots('courtGalleryPickleball', 'courtSliderDotsPickleball');
}); 