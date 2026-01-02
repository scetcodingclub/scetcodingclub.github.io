/* ============================================================
   UNIFIED SCRIPT - FAQ SYSTEM + INTERACTIVITY
   Well-commented code for easy understanding
   ============================================================ */

/* ============================================================
   FAQ DATA
   Array of frequently asked questions with answers
   ============================================================ */
const faqs = [
    {
        question: "No Prior Experience Required",
        answer: "Perfect for complete beginners! We start with fundamental SQL concepts and gradually progress to advanced techniques. Our step-by-step approach ensures everyone understands core database principles before moving forward."
    },
    {
        question: "Is This Useful For Non-CS/IT Students?",
        answer: "Absolutely! SQL and data management are universal skills. Students from mechanical, electrical, civil, manufacturing, and other engineering branches greatly benefit from this workshop. Industries worldwide depend on database skills."
    },
    {
        question: "Do I Need to Bring a Laptop?",
        answer: "Highly recommended, Bringing your own laptop gives you several advantages: continue practicing at home, take all resources directly, and have a configured environment for future projects."
    },
    {
        question: "Get Resources & Code After Workshop?",
        answer: "You'll receive a helpful CheatSheet to get you started. And if you need further assistance, our Coding Club is always here to help!."
    },
    {
        question: "What if I Can't Attend All 3 Days?",
        answer: "We highly recommend attending the workshop as much as possible to ensure you receive the helpful CheatSheet. And if you need further assistance, our Coding Club is always here to help you in the future!"
    }
];

/* ============================================================
   RENDER FAQ ITEMS
   Create FAQ HTML from data and add to page
   ============================================================ */
function renderFAQs() {
    // Get FAQ container element
    const container = document.getElementById('faqContainer');

    // Exit if no container found
    if (!container) return;

    // Create HTML for each FAQ item
    container.innerHTML = faqs.map((faq, index) => `
        <!-- FAQ Item: Clickable to expand/collapse -->
        <div class="faq-item stagger-item" data-index="${index}" onclick="toggleFAQItem(${index})">
            <!-- Question Header -->
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold">${faq.question}</h3>
                <!-- Plus/Minus Icon -->
                <span class="faq-icon" style="color: #d946a6; font-weight: bold; font-size: 1.5rem;">+</span>
            </div>
            <!-- Answer (hidden by default) -->
            <p class="text-gray-400 mt-4 hidden faq-answer">${faq.answer}</p>
        </div>
    `).join('');

    // Add stagger animation to all FAQ items
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        item.style.animation = `slideInUp 0.5s ease-out forwards`;
        item.style.animationDelay = `${index * 0.1}s`;  // Delay each item
    });
}

/* ============================================================
   TOGGLE FAQ ITEM
   Show/hide answer when FAQ item is clicked
   ============================================================ */
function toggleFAQItem(index) {
    // Get the clicked FAQ item
    const faqItem = document.querySelector(`[data-index="${index}"]`);
    if (!faqItem) return;

    // Check if currently open
    const isActive = faqItem.classList.contains('active');

    // ============================================================
    // Close all other FAQ items
    // ============================================================
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            // Close this item
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            // Hide answer
            answer.classList.add('hidden');
            icon.textContent = '+';
            answer.style.animation = 'none';
        }
    });

    // ============================================================
    // Toggle current item
    // ============================================================
    faqItem.classList.toggle('active');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');

    if (!isActive) {
        // Open: show answer
        answer.classList.remove('hidden');
        icon.textContent = '−';  // Change icon to minus
        answer.style.animation = 'slideDown 0.3s ease-out';  // Smooth animation
    } else {
        // Close: hide answer
        answer.classList.add('hidden');
        icon.textContent = '+';  // Change icon to plus
    }
}

/* ============================================================
   KEYBOARD NAVIGATION FOR FAQ
   Use arrow keys to navigate FAQ items
   ============================================================ */
function setupFAQKeyboard() {
    document.addEventListener('keydown', (e) => {
        // Arrow Down: Next FAQ
        if (e.key === 'ArrowDown') {
            const activeFAQ = document.querySelector('.faq-item.active');
            const nextFAQ = activeFAQ?.nextElementSibling;
            if (nextFAQ && nextFAQ.classList.contains('faq-item')) {
                const index = Array.from(document.querySelectorAll('.faq-item')).indexOf(nextFAQ);
                toggleFAQItem(index);
            }
        } 
        // Arrow Up: Previous FAQ
        else if (e.key === 'ArrowUp') {
            const activeFAQ = document.querySelector('.faq-item.active');
            const prevFAQ = activeFAQ?.previousElementSibling;
            if (prevFAQ && prevFAQ.classList.contains('faq-item')) {
                const index = Array.from(document.querySelectorAll('.faq-item')).indexOf(prevFAQ);
                toggleFAQItem(index);
            }
        }
    });
}

/* ============================================================
   PAGE LOAD DETECTION
   Run when page completely loads
   ============================================================ */
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
    console.log('✨ Page fully loaded!');
});

/* ============================================================
   CARD TILT EFFECT
   Cards tilt when mouse moves over them
   ============================================================ */
function setupCardTilt() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Get card position
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angles
            const angleY = (x - centerX) / (rect.width / 2) * 10;
            const angleX = (centerY - y) / (rect.height / 2) * 10;

            // Apply tilt immediately
            this.style.transition = 'none';
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });

        // Reset tilt on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

/* ============================================================
   ICON ANIMATIONS
   Icons respond to mouse events
   ============================================================ */
function setupIconAnimations() {
    const icons = document.querySelectorAll('.feature-icon');

    icons.forEach((icon) => {
        // Speed up animation on hover
        icon.addEventListener('mouseenter', function() {
            this.style.animationDuration = '0.5s';
        });

        // Return to normal speed
        icon.addEventListener('mouseleave', function() {
            this.style.animationDuration = '3s';
        });
    });
}



/* ============================================================
   SMOOTH SCROLL
   Smooth animation when clicking anchor links
   ============================================================ */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Get target element
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Get scroll position
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 100;

                // Smooth scroll to target
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Highlight target briefly
                target.style.background = 'rgba(217, 70, 166, 0.1)';
                setTimeout(() => {
                    target.style.background = '';
                }, 2000);
            }
        });
    });
}

/* ============================================================
   MOBILE OPTIMIZATION
   Reduce animations on mobile devices for better performance
   ============================================================ */
function setupMobileOptimization() {
    // Detect if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Shorten all animations on mobile
        document.querySelectorAll('[style*="animation"]').forEach(el => {
            const animation = el.style.animation;
            if (animation) {
                // Reduce animation duration
                el.style.animation = animation.replace(/(\d+)s/, '0.5s');
            }
        });
        console.log('📱 Mobile optimizations applied');
    }
}

/* ============================================================
   KEYBOARD SHORTCUTS
   Special keyboard combinations
   ============================================================ */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape: Close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('[role="dialog"]');
            modals.forEach(modal => modal.style.display = 'none');
        }

        // Ctrl+/ : Show keyboard shortcuts
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            console.log('⌨️ Keyboard Shortcuts:');
            console.log('ESC - Close modals');
            console.log('Arrow Keys - Navigate FAQ');
            console.log('Ctrl+/ - Show this list');
        }
    });
}

/* ============================================================
   PERFORMANCE MONITORING
   Measure and log page load time
   ============================================================ */
function setupPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            // Get timing data
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

            // Log load time
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        });
    }
}

/* ============================================================
   ACCESSIBILITY FEATURES
   Improve usability for all users
   ============================================================ */
function setupAccessibility() {
    // Add focus outlines to interactive elements
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #d946a6';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Create skip-to-content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: fixed;
        top: -40px;
        left: 0;
        z-index: 100;
        background: #d946a6;
        color: white;
        padding: 8px;
        text-decoration: none;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.prepend(skipLink);
}

/* ============================================================
   ANIMATION SPEED CONTROLLER
   Allow users to adjust animation speed
   ============================================================ */
class AnimationSpeedController {
    constructor() {
        this.speed = 1;  // Default speed (1x)
    }

    // Change animation speed
    setSpeed(multiplier) {
        this.speed = multiplier;
        const allElements = document.querySelectorAll('[style*="animation"]');

        allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const animationDuration = computedStyle.animationDuration;

            if (animationDuration) {
                const duration = parseFloat(animationDuration);
                el.style.animationDuration = (duration / multiplier) + 's';
            }
        });
    }

    // Reset to normal
    reset() {
        location.reload();
    }
}

// Create global controller instance
window.speedController = new AnimationSpeedController();

/* ============================================================
   INITIALIZATION
   Run all setup functions when DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Script...');

    // Render FAQ items first
    renderFAQs();

    // Setup all interactions
    setupCardTilt();               // Card tilt on hover
    setupIconAnimations();         // Icon hover effects
    setupButtonAnimations();       // Button click feedback
    setupSmoothScroll();          // Smooth anchor scrolling
    setupFAQKeyboard();           // Keyboard navigation
    setupMobileOptimization();    // Mobile performance
    setupKeyboardShortcuts();     // Special key combinations
    setupPerformanceMonitoring(); // Track page load
    setupAccessibility();         // Accessibility features

    console.log('✨ All systems initialized!');
    console.log('🎯 Ready for user interaction!');
});

/* ============================================================
   PUBLIC API
   Functions accessible to other scripts
   ============================================================ */
window.FAQ = {
    // Toggle specific FAQ
    toggle: (index) => toggleFAQItem(index),

    // Open FAQ
    open: (index) => {
        const item = document.querySelector(`[data-index="${index}"]`);
        if (item && !item.classList.contains('active')) {
            toggleFAQItem(index);
        }
    },

    // Close FAQ
    close: (index) => {
        const item = document.querySelector(`[data-index="${index}"]`);
        if (item && item.classList.contains('active')) {
            toggleFAQItem(index);
        }
    },

    // Close all FAQs
    closeAll: () => {
        document.querySelectorAll('.faq-item.active').forEach((item) => {
            const index = Array.from(document.querySelectorAll('.faq-item')).indexOf(item);
            toggleFAQItem(index);
        });
    }
};

/* ============================================================
   TRIGGER ANIMATIONS FROM CONSOLE
   Useful for debugging and testing
   ============================================================ */
window.triggerAnimation = {
    // Pop animation
    pop: (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.animation = 'pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    },

    // Glow animation
    glow: (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.animation = 'pulse-glow 2s ease-in-out infinite';
        });
    },

    // Stop animation
    stop: (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.animation = 'none';
        });
    }
};

