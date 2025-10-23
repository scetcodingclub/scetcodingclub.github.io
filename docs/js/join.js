function scrollDivBottomIntoView(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const targetScroll = rect.top + scrollTop + el.offsetHeight - window.innerHeight;

  window.scrollTo({
    top: targetScroll,
    behavior: "smooth",
  });
}

(function () {
    const prefix = "What’s your ";
    const highlight = "focus?";
    const elPrefix = document.getElementById('focus-typer-prefix');
    const elHighlight = document.getElementById('focus-typer-highlight');
    if (!elPrefix || !elHighlight) return;

    let p = 0; // index for prefix
    let h = 0; // index for highlight
    let phase = 'typePrefix';

    function tick() {
        switch (phase) {
            case 'typePrefix': {
                elPrefix.textContent = prefix.slice(0, ++p);
                if (p === prefix.length) { phase = 'typeHighlight'; setTimeout(tick, 120); } else { setTimeout(tick, 80); }
                break;
            }
            case 'typeHighlight': {
                elHighlight.textContent = highlight.slice(0, ++h);
                if (h === highlight.length) { phase = 'pauseFull'; setTimeout(tick, 1200); } else { setTimeout(tick, 80); }
                break;
            }
            case 'pauseFull': {
                phase = 'eraseHighlight';
                setTimeout(tick, 60);
                break;
            }
            case 'eraseHighlight': {
                elHighlight.textContent = highlight.slice(0, --h);
                if (h === 0) { phase = 'erasePrefix'; setTimeout(tick, 60); } else { setTimeout(tick, 40); }
                break;
            }
            case 'erasePrefix': {
                elPrefix.textContent = prefix.slice(0, --p);
                if (p === 0) { phase = 'typePrefix'; setTimeout(tick, 500); } else { setTimeout(tick, 40); }
                break;
            }
        }
    }

    tick();
})();

// NEXUS Paths Description Functionality
const descriptions = {
    learner: "If you're eager to grow a little every day, this is for you. Here, you'll improve your coding, explore new ideas and share what you learn with others through small sessions and discussions. It's all about being consistent, curious and passionate not perfect.",
    contributor: "For those who love to build, create and take initiative. You'll help organise events, design content, or work on club projects turning ideas into reality while learning teamwork and leadership along the way.",
    allrounder: "For those who want the best of both worlds, learning and contributing. You'll grow your skills through coding and collaboration while helping in projects and events that make a real impact."
};

const actionButtons = {
    learner: '<a href="/form/join-form.html" class="bg-accent hover:bg-accent/90 text-dark font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm">Join the Learners Circle</button>',
    contributor: '<a href="/form/join-form.html" class="bg-accent hover:bg-accent/90 text-dark font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm">Become a Contributor</button>',
    allrounder: '<a href="/form/join-form.html" class="bg-accent hover:bg-accent/90 text-dark font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm">Start Your Journey</button>'
};

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.nexus-card');
    const descriptionPanel = document.getElementById('description-panel');
    const descriptionContent = document.getElementById('description-content');
    const actionButton = document.getElementById('action-button');
    const accentLine = document.getElementById('accent-line');

    function isMobile() {
        return window.innerWidth < 768; // md breakpoint
    }

    function resetAllCards() {
        cards.forEach(card => {
            const mobileDescription = card.querySelector('.nexus-description-mobile');
            mobileDescription.classList.add('hidden');
            card.classList.remove('expanded');
        });
        if (descriptionPanel) {
            descriptionPanel.classList.add('opacity-0', 'translate-y-4');
            descriptionPanel.classList.remove('opacity-100', 'translate-y-0');
        }
    }

    function updateAccentLinePosition(cardIndex) {
        if (!isMobile()) {
            // Remove all position classes
            accentLine.classList.remove('left-0', 'left-1/2', 'right-0', 'transform', '-translate-x-1/2', 'ml-0', 'ml-1/2', 'ml-auto', 'mx-auto');

            // Position the line within the panel based on card index
            if (cardIndex === 0) {
                // First card - left side of panel
                accentLine.classList.add('ml-0');
            } else if (cardIndex === 1) {
                // Second card - center of panel
                accentLine.classList.add('mx-auto');
            } else if (cardIndex === 2) {
                // Third card - right side of panel
                accentLine.classList.add('ml-auto');
            }
        }
    }

    cards.forEach((card, index) => {
        const path = card.dataset.path;
        const mobileDescription = card.querySelector('.nexus-description-mobile');
        
        card.addEventListener('click', () => {
            localStorage.setItem("path-type", path);
            if (isMobile()) {
                // Mobile behavior: expand card on click
                // Close other cards
                cards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherDescription = otherCard.querySelector('.nexus-description-mobile');
                        otherDescription.classList.add('hidden');
                        otherCard.classList.remove('expanded');
                    }
                });

                // Toggle current card
                mobileDescription.classList.toggle('hidden');
                card.classList.toggle('expanded');
            } else {

                // set scroll to the join panel
                scrollDivBottomIntoView("#join-panel");
                // const el = document.getElementById("join-panel");
                // window.scrollTo({
                //     top: el.offsetTop + el.offsetHeight - window.innerHeight,
                //     behavior: "smooth",
                // });


                // Desktop behavior: show description in panel
                descriptionContent.textContent = descriptions[path];

                // Update action button
                actionButton.innerHTML = actionButtons[path];

                // Update accent line position
                updateAccentLinePosition(index);

                // Show panel with animation
                descriptionPanel.classList.remove('opacity-0', 'translate-y-4');
                descriptionPanel.classList.add('opacity-100', 'translate-y-0');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        resetAllCards();
    });
});

window.addEventListener("navbar:loaded", (e) => {
  // ... your navbar scroll/hide and mobile menu logic ...

  // === Announcement bar ===
  const announcement = document.getElementById("announcement-bar");
  const clone = announcement.cloneNode(true)
  clone.hidden = false;
//   e.detail.navbar.insertAdjacentElement("afterend", clone);
  e.detail.navbar.appendChild(clone);
});
