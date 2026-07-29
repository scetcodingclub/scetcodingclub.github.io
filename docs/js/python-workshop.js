const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 90;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 640 ? 1.25 : 2));
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight1.position.set(20, 30, 40);
scene.add(dirLight1);
const dirLight2 = new THREE.DirectionalLight(0x306998, 0.6);
dirLight2.position.set(-20, -30, -20);
scene.add(dirLight2);

function createPythonHalfShape() {
  const shape = new THREE.Shape();
  const scale = 0.16;
  const tx = (x) => (x - 100) * scale;
  const ty = (y) => (100 - y) * scale;
  shape.moveTo(tx(99.8), ty(0));
  shape.bezierCurveTo(tx(44.7), ty(0), tx(47.3), ty(23.9), tx(47.3), ty(23.9));
  shape.lineTo(tx(47.4), ty(49.2));
  shape.lineTo(tx(100), ty(49.2));
  shape.lineTo(tx(100), ty(56.7));
  shape.lineTo(tx(23.3), ty(56.7));
  shape.bezierCurveTo(tx(23.3), ty(56.7), tx(0), ty(54), tx(0), ty(109.3));
  shape.bezierCurveTo(tx(0), ty(164.6), tx(20.3), ty(161.8), tx(20.3), ty(161.8));
  shape.lineTo(tx(32.3), ty(161.8));
  shape.lineTo(tx(32.3), ty(144.9));
  shape.bezierCurveTo(tx(32.3), ty(125.7), tx(48.9), ty(109.8), tx(68.3), ty(109.8));
  shape.lineTo(tx(121.3), ty(109.8));
  shape.bezierCurveTo(tx(137.6), ty(109.8), tx(151), ty(96.3), tx(151), ty(80.1));
  shape.lineTo(tx(151), ty(26.7));
  shape.bezierCurveTo(tx(151), ty(9.8), tx(135.5), ty(0), tx(99.8), ty(0));
  shape.closePath();
  const eyeHole = new THREE.Path();
  eyeHole.absarc(tx(73), ty(25), 7.5 * scale, 0, Math.PI * 2, true);
  shape.holes.push(eyeHole);
  return shape;
}

const pythonGroup = new THREE.Group();
const halfGeometry = new THREE.ExtrudeGeometry(createPythonHalfShape(), {
  depth: 3.5, bevelEnabled: true, bevelThickness: 0.8, bevelSize: 0.6, bevelSegments: 4
});
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x306998, shininess: 90, specular: 0x6699cc, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
const blueMesh = new THREE.Mesh(halfGeometry, blueMaterial);
blueMesh.position.z = -1.75;
const yellowMaterial = new THREE.MeshPhongMaterial({ color: 0xFFE873, shininess: 90, specular: 0xffffaa, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
const yellowMesh = new THREE.Mesh(halfGeometry, yellowMaterial);
yellowMesh.rotation.z = Math.PI;
yellowMesh.position.z = -1.68;
pythonGroup.add(blueMesh, yellowMesh);
scene.add(pythonGroup);

const particleCount = 700;
const particlesGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const colorBlue = new THREE.Color(0x306998);
const colorYellow = new THREE.Color(0xffe873);
for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 80;
  positions[i + 1] = (Math.random() - 0.5) * 80;
  positions[i + 2] = (Math.random() - 0.5) * 80;
  const color = Math.random() > 0.5 ? colorBlue : colorYellow;
  colors[i] = color.r;
  colors[i + 1] = color.g;
  colors[i + 2] = color.b;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const particleSystem = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ size: 0.6, vertexColors: true, transparent: true, opacity: 0.7 }));
scene.add(particleSystem);

function animate() {
  requestAnimationFrame(animate);
  pythonGroup.rotation.y += 0.007;
  particleSystem.rotation.y -= 0.001;
  particleSystem.rotation.x += 0.0008;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 640 ? 1.25 : 2));
});


/* ============================================================
   FAQ DATA
   Array of frequently asked questions with answers
   ============================================================ */
const faqs = [
    {
        question: "No Prior Experience Required",
        answer: "Perfect for complete beginners! We start with fundamental Python concepts and gradually progress to advanced techniques. Our step-by-step approach ensures everyone understands core programming principles before moving forward."
    },
    {
        question: "Is This Useful For Non-CS/IT Students?",
        answer: "Absolutely! Python and programming are universal skills. Students from mechanical, electrical, civil, manufacturing, and other engineering branches greatly benefit from this workshop. Industries worldwide depend on Python skills."
    },
    {
        question: "Do I Need to Bring a Laptop?",
        answer: "Highly recommended. Bringing your own laptop. No laptop? We've got you covered! Computers will be provided for participants who don't have a laptop."
    },
    {
        question: "Get Resources & Code After Workshop?",
        answer: "You'll receive a helpful CheatSheet to get you started. And if you need further assistance, our Coding Club is always here to help!"
    },
    {
        question: "What if I Can't Attend Both Days?",
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

    // Create HTML for each FAQ item using custom CSS classes
    container.innerHTML = faqs.map((faq, index) => `
        <!-- FAQ Item: Clickable to expand/collapse -->
        <div class="faq-item" data-index="${index}" onclick="toggleFAQItem(${index})">
            <!-- Question Header -->
            <div class="faq-question-row">
                <h3 class="faq-question-text">${faq.question}</h3>
                <!-- Plus Icon -->
                <span class="faq-icon">+</span>
            </div>
            <!-- Answer (hidden via CSS max-height: 0) -->
            <p class="faq-answer">${faq.answer}</p>
        </div>
    `).join('');

    // Stagger the entrance animation for each FAQ item
    document.querySelectorAll('.faq-item').forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = `faqSlideInUp 0.5s ease-out forwards`;
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animated');
        }, 100 + index * 80);
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
    // Close all other FAQ items (accordion behavior)
    // ============================================================
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
            item.classList.remove('active');
            const icon = item.querySelector('.faq-icon');
            icon.textContent = '+';
        }
    });

    // ============================================================
    // Toggle current item
    // ============================================================
    faqItem.classList.toggle('active');
    const icon = faqItem.querySelector('.faq-icon');

    if (!isActive) {
        // Open: change icon to plus (rotated via CSS)
        icon.textContent = '+';
    } else {
        // Close: reset icon
        icon.textContent = '+';
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
                target.style.background = 'rgba(48, 105, 152, 0.1)';
                setTimeout(() => {
                    target.style.background = '';
                }, 2000);
            }
        });
    });
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
   PAGE LOAD DETECTION
   Run when page completely loads
   ============================================================ */
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
    console.log('✨ Page fully loaded!');
});

/* ============================================================
   INITIALIZATION
   Run all setup functions when DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Script...');

    // Render FAQ items
    renderFAQs();

    // Setup all interactions
    setupSmoothScroll();          // Smooth anchor scrolling
    setupFAQKeyboard();           // Keyboard navigation
    setupKeyboardShortcuts();     // Special key combinations

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

