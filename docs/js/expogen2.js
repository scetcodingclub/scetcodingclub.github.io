/* =============================================================
   EXPOGEN 2.0 — Main JavaScript
   File: expogen2.js
   Sections:
     1. Scroll Progress Bar
     2. Reveal on Scroll (Intersection Observer)
     3. Animated Stat Counters
     4. FAQ Accordion
     5. Carousel (auto-play, touch, resize, dots)
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   1. SCROLL PROGRESS BAR
   Fills the fixed top bar as user scrolls down the page
───────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const doc  = document.documentElement;
    const pct  = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────
   2. REVEAL ON SCROLL
   Adds .visible class to .reveal / .reveal-left / .reveal-right
   elements when they enter the viewport, triggering CSS transitions
───────────────────────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));

  // Immediately show anything already in view on first load
  window.addEventListener('load', () => {
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('visible');
      }
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   3. ANIMATED STAT COUNTERS
   Counts from 0 up to [data-target] when the stats block
   scrolls into view. Fires once per page load.
───────────────────────────────────────────────────────────── */
function initCounters() {
  const statsBlock = document.getElementById('statsBlock');
  if (!statsBlock) return;

  function animateSingleCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const DURATION_MS = 1800;
    const STEPS       = 60;
    const increment   = target / STEPS;
    let current       = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, DURATION_MS / STEPS);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target
            .querySelectorAll('[data-target]')
            .forEach(animateSingleCounter);
          observer.unobserve(entry.target); // run once only
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(statsBlock);
}


/* ─────────────────────────────────────────────────────────────
   4. FAQ ACCORDION
   Toggles .active on the clicked .faq-item.
   Closes any other open item first (one open at a time).
   Called inline from HTML: onclick="toggleFaq(this)"
───────────────────────────────────────────────────────────── */
function toggleFaq(item) {
  const isAlreadyOpen = item.classList.contains('active');

  // Close all items
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));

  // If it wasn't open before, open it now
  if (!isAlreadyOpen) {
    item.classList.add('active');
  }
}


/* ─────────────────────────────────────────────────────────────
   5. CAROUSEL
   Features:
   • Responsive slides-per-view: 1 (mobile) → 2 (tablet) → 3 (desktop)
   • Auto-plays every 3.5 s, pauses on interaction
   • Touch / swipe support for mobile
   • Keyboard arrow-key support
   • Dot indicators (clickable)
   • Prev / Next buttons
   • Rebuilds on window resize if breakpoint changes
───────────────────────────────────────────────────────────── */
function initCarousel() {
  const track   = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');

  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const TOTAL_SLIDES  = slides.length;
  const AUTO_DELAY_MS = 3500;

  let current      = 0;
  let perView      = getPerView();
  let totalGroups  = Math.ceil(TOTAL_SLIDES / perView);
  let autoTimer    = null;

  /* ── Helpers ── */
  function getPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    totalGroups = Math.ceil(TOTAL_SLIDES / perView);
    for (let i = 0; i < totalGroups; i++) {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = ((index % totalGroups) + totalGroups) % totalGroups; // safe wrap
    const offset = -(current * perView * (100 / TOTAL_SLIDES));
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ── Auto-play ── */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_DELAY_MS);
  }
  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  function resetAuto() { startAuto(); } // restart after manual interaction

  /* ── Buttons ── */
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  /* ── Touch / Swipe ── */
  let touchStartX = 0;
  let touchStartY = 0;

  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;

    // Only act if horizontal swipe (more X than Y movement) and > 40 px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  /* ── Responsive rebuild on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPerView = getPerView();
      if (newPerView !== perView) {
        perView = newPerView;
        current = 0;
        buildDots();
        goTo(0);
      }
    }, 200);
  });

  /* ── Init ── */
  buildDots();
  goTo(0);
  startAuto();
}


/* =============================================================
   BOOT — run everything when the DOM is ready
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initReveal();
  initCounters();
  initCarousel();
  // toggleFaq is global so it can be called from inline onclick
});