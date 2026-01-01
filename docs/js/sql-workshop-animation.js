/* ============================================================
   COMPREHENSIVE ANIMATION ENGINE
   All animations consolidated in one powerful, well-organized file
   ============================================================ */

class AnimationEngine {
    /* ============================================================
       CONSTRUCTOR - Initialize animation system
       ============================================================ */
    constructor() {
        // Store references to animated elements
        this.animatingElements = new Map();
        // Start initialization when created
        this.init();
    }

    /* ============================================================
       INITIALIZE - Set up all animations
       Called when AnimationEngine is created
       ============================================================ */
    init() {
        console.log('🚀 Advanced Animation Engine Initializing...');

        // Setup all animation types
        this.setupScrollAnimations();      // Animations triggered on scroll
        this.setupHoverAnimations();       // Animations on mouse hover
        this.setupParallax();              // Parallax background effect
        this.setupInteractive3D();         // 3D effects on elements
        this.setupProgressBar();           // Scroll progress bar
        this.setupCursorGlow();            // Cursor trail effect
        this.setupButtonRipple();          // Button ripple effect
        this.setupSmoothScroll();          // Smooth page scrolling
        this.setupSectionAnimations();     // Section fade-in animations
        this.setupLazyLoad();              // Lazy load images
        this.addCustomAnimations();        // Add custom keyframe animations

        console.log('✨ All animations loaded!');
    }

    /* ============================================================
       SCROLL TRIGGERED ANIMATIONS
       Elements animate when they enter viewport
       ============================================================ */
    setupScrollAnimations() {
        // Configuration for intersection observer
        const observerOptions = {
            threshold: 0.1,                    // Trigger when 10% visible
            rootMargin: '0px 0px -50px 0px'   // Trigger 50px before entering
        };

        // Create observer to detect element visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When element becomes visible
                if (entry.isIntersecting) {
                    // Animate cards
                    if (entry.target.classList.contains('card')) {
                        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    }

                    // Animate staggered items
                    if (entry.target.classList.contains('stagger-item')) {
                        this.animateStaggerItems(entry.target.parentElement);
                    }

                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Start observing all items
        document.querySelectorAll('.card, .stagger-item, .testimonial').forEach(el => {
            observer.observe(el);
        });
    }

    /* ============================================================
       STAGGER ITEMS ANIMATION
       Animate multiple items with delayed start times
       ============================================================ */
    animateStaggerItems(container) {
        // Get all stagger items in container
        const items = container.querySelectorAll('.stagger-item');

        // Animate each item with delay
        items.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.6s ease-out forwards`;
            item.style.animationDelay = `${index * 0.1}s`;  // 0.1s delay between items
        });
    }

    /* ============================================================
       HOVER ANIMATIONS
       Effects when mouse hovers over elements
       ============================================================ */
    setupHoverAnimations() {
        // Get all cards
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            // ============================================================
            // 3D TILT EFFECT - Card rotates based on mouse position
            // ============================================================
            card.addEventListener('mousemove', (e) => {
                // Get card position and dimensions
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation angles based on mouse distance from center
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;

                // Apply 3D rotation immediately (no transition)
                card.style.transition = 'none';
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });

            // ============================================================
            // MOUSE LEAVE - Reset to normal
            // ============================================================
            card.addEventListener('mouseleave', () => {
                // Smooth transition back to normal
                card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });

            // ============================================================
            // GLOW EFFECT - Add magenta glow on hover
            // ============================================================
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 0 40px rgba(217, 70, 166, 0.6), inset 0 0 20px rgba(217, 70, 166, 0.1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = '';
            });
        });

        // ============================================================
        // ICON HOVER ANIMATIONS
        // ============================================================
        const icons = document.querySelectorAll('.feature-icon');

        icons.forEach(icon => {
            // Speed up animation on hover
            icon.addEventListener('mouseenter', function() {
                this.style.animation = 'icon-bounce 0.6s ease-in-out';
                this.style.boxShadow = '0 0 30px rgba(217, 70, 166, 0.6), inset 0 0 10px rgba(217, 70, 166, 0.3)';
            });

            // Return to normal animation
            icon.addEventListener('mouseleave', function() {
                this.style.animation = 'icon-float 3s ease-in-out infinite';
                this.style.boxShadow = '';
            });
        });
    }

    /* ============================================================
       PARALLAX SCROLLING
       Background moves at different speeds while scrolling
       ============================================================ */
    setupParallax() {
        // Get all floating blobs
        const blobs = document.querySelectorAll('.floating-blob');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Move each blob at different speed
            blobs.forEach((blob, index) => {
                const speed = 0.3 + index * 0.15;  // Different speed for each blob
                blob.style.transform = `translateY(${scrollY * speed}px)`;
            });

            // Adjust section opacity based on scroll
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const scrollPercent = 1 - (rect.top / window.innerHeight);
                if (scrollPercent > 0 && scrollPercent < 1) {
                    section.style.opacity = 0.8 + scrollPercent * 0.2;
                }
            });
        });
    }

    /* ============================================================
       INTERACTIVE 3D ELEMENTS
       Special 3D effects for marked elements
       ============================================================ */
    setupInteractive3D() {
        // Get all 3D elements
        const interactive3DElements = document.querySelectorAll('[data-3d="true"]');

        interactive3DElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                // Calculate position ratio (0 to 1)
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                // Calculate rotation based on position
                const rotateX = (y - 0.5) * 10;
                const rotateY = (x - 0.5) * -10;

                // Apply 3D transform
                el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });

            // Reset on mouse leave
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    /* ============================================================
       PROGRESS BAR
       Shows scroll progress at top of page
       ============================================================ */
    setupProgressBar() {
        window.addEventListener('scroll', () => {
            // Calculate scroll percentage
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            // Update progress bar width
            const progressBar = document.getElementById('scrollProgress');
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
        });
    }

    /* ============================================================
       CURSOR GLOW
       Creates glowing effect around mouse cursor
       ============================================================ */
    setupCursorGlow() {
        // Create cursor glow element
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(217, 70, 166, 0.3) 0%, rgba(217, 70, 166, 0) 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(cursorGlow);

        // Follow mouse movement
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
        });

        // Hide when mouse leaves page
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    /* ============================================================
       BUTTON RIPPLE EFFECT
       Creates ripple animation on button click
       ============================================================ */
    setupButtonRipple() {
        // Get all buttons
        const buttons = document.querySelectorAll('.btn-primary');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple element
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                // Style ripple
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                `;

                // Add ripple to button
                this.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 600);

                // Button press animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    /* ============================================================
       SMOOTH SCROLL
       Smooth scrolling to anchors
       ============================================================ */
    setupSmoothScroll() {
        // Find all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                // Get target element
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Smooth scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /* ============================================================
       SECTION ANIMATIONS
       Fade in sections as they enter viewport
       ============================================================ */
    setupSectionAnimations() {
        const sections = document.querySelectorAll('section');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'fadeIn 0.8s ease-out';
                }
            });
        }, { threshold: 0.1 });

        // Observe all sections
        sections.forEach(section => {
            section.style.opacity = '0';
            sectionObserver.observe(section);
        });
    }

    /* ============================================================
       LAZY LOAD IMAGES
       Load images only when visible
       ============================================================ */
    setupLazyLoad() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all lazy-load images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /* ============================================================
       CUSTOM ANIMATIONS
       Add CSS keyframe animations to page
       ============================================================ */
    addCustomAnimations() {
        // Check if already added
        if (document.querySelector('style[data-custom-animations]')) return;

        // Create style element
        const style = document.createElement('style');
        style.setAttribute('data-custom-animations', 'true');
        style.textContent = `
            /* Ripple animation for buttons */
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            /* Fade in animation */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Slide down animation */
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Slide in up animation */
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        // Add styles to page
        document.head.appendChild(style);
    }
}

/* ============================================================
   INITIALIZE ANIMATION ENGINE
   Runs when page loads
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const engine = new AnimationEngine();
    console.log('✨ Animation Engine Ready!');
    console.log('🎬 All animations active with magenta theme!');
});

/* ============================================================
   WINDOW RESIZE HANDLER
   Adjust animations if window size changes
   ============================================================ */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('🔄 Animations adjusted for viewport');
    }, 250);
});

/* ============================================================
   GLOBAL ANIMATION UTILITIES
   Useful functions accessible from console
   ============================================================ */
window.AnimationUtils = {
    // Pop animation
    popCard: (element) => {
        element.style.animation = 'pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    },

    // Glow pulse animation
    glowPulse: (element, duration = 2000) => {
        element.style.animation = `pulse-glow ${duration}ms ease-in-out infinite`;
    },

    // Stop animation
    stopAnimation: (element) => {
        element.style.animation = 'none';
    },

    // Reset transforms
    resetTransform: (element) => {
        element.style.transform = 'none';
    },

    // Add animated class
    addAnimatedClass: (element, className) => {
        element.classList.add(className);
        element.addEventListener('animationend', () => {
            element.classList.remove(className);
        }, { once: true });
    }
};
