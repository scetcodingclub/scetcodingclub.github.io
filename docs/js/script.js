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

    // Toggle roll number field based on user type
    function toggleRollNumberField() {
        const userTypeSelect = document.getElementById('userType');
        const userType = userTypeSelect.value;
        const rollNumberContainer = document.getElementById('rollNumberContainer');
        const rollNumberInput = document.getElementById('rollNumber');

        if (userType === 'scet') {
            rollNumberContainer.classList.remove('hidden');
            rollNumberInput.required = true;
            rollNumberInput.setAttribute('aria-required', 'true');
            rollNumberInput.setAttribute('aria-invalid', 'false');
        } else {
            rollNumberContainer.classList.add('hidden');
            rollNumberInput.required = false;
            rollNumberInput.removeAttribute('aria-required');
            rollNumberInput.removeAttribute('aria-invalid');
            rollNumberInput.value = ''; // Clear the roll number when hiding
        }

        // Trigger form validation
        rollNumberInput.reportValidity();
    }

    // Contact Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const userType = document.getElementById('userType').value;
            const name = document.getElementById('name').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const mobile = document.getElementById('mobile').value.trim();
            const message = document.getElementById('message').value.trim();
            const rollNumber = userType === 'scet' ? document.getElementById('rollNumber').value.trim() : '';

            // Create email body with proper line breaks
            let body = `Hello NEXUS Team,%0D%0A%0D%0A` +
                `I would like to get in touch with you regarding: ${subject}%0D%0A%0D%0A` +
                `Name: ${name}%0D%0A`;

            // Add roll number only if user is SCET student
            if (userType === 'scet' && rollNumber) {
                body += `Roll Number: ${rollNumber}%0D%0A`;
            }

            // Add contact info and message
            body += `Mobile Number: ${mobile}%0D%0A` +
                `User Type: ${userType === 'scet' ? 'SCET Student' : 'General Inquiry'}%0D%0A%0D%0A` +
                `Message:%0D%0A${message}%0D%0A%0D%0A` +
                `Looking forward to your response.`;

            // Create mailto link
            const mailtoLink = `mailto:nexuscodingclub@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

            // Open default email client
            window.location.href = mailtoLink;

            // Reset form after submission
            this.reset();
            document.getElementById('rollNumberContainer').classList.add('hidden');
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