document.addEventListener("DOMContentLoaded", async () => {

    try {
        response = await fetch("/components/navbar.html");
        html = await response.text();
        // document.getElementById("navbar-placeholder").innerHTML = data;

        const placeholder = document.getElementById("navbar-placeholder");
        // Create a temporary DOM node from the fetched HTML
        const temp = document.createElement("div");
        temp.innerHTML = html.trim();
        const navbarEl = temp.firstElementChild;
        placeholder.replaceWith(navbarEl);

        // notify other scripts that navbar is ready
        window.dispatchEvent(new CustomEvent("navbar:loaded", { detail: { navbar: navbarEl } }));
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
});

window.addEventListener('navbar:loaded', (e) => {
    // Navbar ready, you can run other code that depends on it
    // console.log('navbar ready', e.detail.navbar);

    // Navbar smooth fade in/out based on scroll position
    let lastScroll = 0;
    let ticking = false;
    const navbar = document.getElementById('mainNav');
    const navbarStartHideSection = document.querySelector('.navbar-start-hide');

    function updateNavbarVisibility() {
        if (!navbarStartHideSection) return;

        const currentScroll = window.scrollY || document.documentElement.scrollTop;
        const whoWeArePosition = navbarStartHideSection.getBoundingClientRect().top + window.scrollY;
        const windowHeight = window.innerHeight;
        const triggerPoint = whoWeArePosition - (windowHeight * 0.4); // Trigger slightly before reaching the section

        // Calculate scroll direction
        const scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
        lastScroll = currentScroll <= 0 ? 0 : currentScroll; // For mobile or negative scrolling

        // Check if we're in the trigger zone
        if (currentScroll > triggerPoint) {
            if (scrollDirection === 'down') {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }
        } else {
            navbar.classList.remove('navbar-hidden');
        }

        ticking = false;
    }

    // Optimized scroll handler with requestAnimationFrame
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbarVisibility);
            ticking = true;
        }
    }

    // Use passive scroll for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

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

});
