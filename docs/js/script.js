document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize carousels
    function initCarousel(slideClass, prevBtnClass, nextBtnClass) {
        const slides = document.querySelector(`.${slideClass}`);
        if (!slides) return; // Exit if slides container not found

        const prevBtn = document.querySelector(`.${prevBtnClass}`);
        const nextBtn = document.querySelector(`.${nextBtnClass}`);
        let currentSlide = 0;
        let slideInterval;
        const totalSlides = slides.children.length;

        // Set initial position
        function updateSlidePosition() {
            slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlidePosition();
            resetInterval();
        }

        // Previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlidePosition();
            resetInterval();
        }

        // Auto slide
        function startAutoSlide() {
            // Clear any existing interval
            if (slideInterval) clearInterval(slideInterval);

            // Start new interval
            slideInterval = setInterval(() => {
                nextSlide();
            }, 4000); // Change slide every 4 seconds
        }

        // Reset interval when manually changing slides
        function resetInterval() {
            clearInterval(slideInterval);
            startAutoSlide();
        }

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Pause on hover
        const carouselContainer = slides.parentElement;
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            carouselContainer.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
        }

        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;

        if (slides) {
            slides.addEventListener('touchstart', e => {
                touchStartX = e.touches[0].clientX;
                clearInterval(slideInterval);
            }, { passive: true });

            slides.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].clientX;
                handleSwipe();
                startAutoSlide();
            }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to trigger slide change
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        }

        // Start auto-sliding
        startAutoSlide();
    }

    // Initialize all carousels when the DOM is fully loaded
    function initializeAllCarousels() {
        // Initialize each carousel with a small delay to prevent layout shifts
        setTimeout(() => {
            initCarousel('carousel-slide-1', 'carousel-prev-1', 'carousel-next-1');
        }, 100);

        setTimeout(() => {
            initCarousel('carousel-slide-2', 'carousel-prev-2', 'carousel-next-2');
        }, 200);

        setTimeout(() => {
            initCarousel('carousel-slide-3', 'carousel-prev-3', 'carousel-next-3');
        }, 300);
    }

    // Initialize carousels when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAllCarousels);
    } else {
        // DOMContentLoaded has already fired, initialize immediately
        initializeAllCarousels();
    }

    // Mobile menu functionality
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuContent = document.getElementById('menu-content');
    const closeButton = document.getElementById('close-menu-button');
    const menuLinks = document.querySelectorAll('#mobile-menu a:not(#close-menu-button)');
    const menuIcon = document.getElementById('menu-icon');
    // Select all main content sections that should be blurred
    const mainContent = document.querySelector('body > div:not(#mobile-menu)');
    const sections = document.querySelectorAll('section, header');

    menuButton.addEventListener('click', function () {
        // Show menu and overlay
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open

        // Add blur to all sections and main content
        sections.forEach(section => {
            section.style.filter = 'blur(4px)';
            section.style.transition = 'filter 0.3s ease';
        });
        if (mainContent) {
            mainContent.style.filter = 'blur(4px)';
            mainContent.style.transition = 'filter 0.3s ease';
        }

        setTimeout(() => {
            menuOverlay.classList.remove('opacity-0');
            menuContent.classList.remove('translate-x-full');

            // Change icon
            menuIcon.classList.replace('fa-bars', 'fa-times');

            // Animate menu items one by one
            menuLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.classList.remove('-translate-x-8');
                    link.classList.remove('opacity-0');
                }, 100 * index);
            });
        });
    });

    function closeMenu() {
        // Animate out menu items first
        menuLinks.forEach((link, index) => {
            setTimeout(() => {
                link.classList.add('-translate-x-8');
                link.classList.add('opacity-0');
            }, 50 * index);
        });

        // Then animate out the menu
        setTimeout(() => {
            menuOverlay.classList.add('opacity-0');
            menuContent.classList.add('translate-x-full');

            // Remove blur from all sections and main content
            sections.forEach(section => {
                section.style.filter = 'none';
            });
            if (mainContent) {
                mainContent.style.filter = 'none';
            }
            document.body.style.overflow = ''; // Re-enable scrolling

            // Change icon back
            menuIcon.classList.replace('fa-times', 'fa-bars');

            // Hide menu after animation
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }, 200);
    }

    closeButton.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close when clicking menu items
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Simple counter animation
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.textContent = end > 1000 ? value.toLocaleString() : value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = end > 1000 ? end.toLocaleString() : end;
            }
        };
        window.requestAnimationFrame(step);
    }

    // Animate all counters
    function animateStats() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            animateValue(counter, 0, target, 2000);
        });
    }

    // Start animation when about section is in view
    const aboutSection = document.querySelector('#about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (aboutSection) {
        observer.observe(aboutSection);
    }
});