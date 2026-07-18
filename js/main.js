document.addEventListener('DOMContentLoaded', () => {
    // UTM Parameter Capture & Storage
    function captureUtmParams() {
        try {
            const params = new URLSearchParams(window.location.search);
            const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck'];
            const current = JSON.parse(localStorage.getItem('ali_cavalos.utm') || '{}');
            const updated = {};
            
            utmKeys.forEach(key => {
                const val = params.get(key);
                updated[key] = val !== null ? val : (current[key] || '');
            });
            
            localStorage.setItem('ali_cavalos.utm', JSON.stringify(updated));
        } catch (e) {
            console.error('Error capturing UTMs:', e);
        }
    }
    
    function getUtmData() {
        try {
            return JSON.parse(localStorage.getItem('ali_cavalos.utm') || '{}');
        } catch (e) {
            return {};
        }
    }

    // Initialize UTM capture
    captureUtmParams();

    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const nav = document.getElementById('nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const isActive = nav.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isActive);
            menuBtn.innerHTML = isActive ? '&#x2715;' : '&#x2630;'; // X or Hamburger
        });
    }

    // Header scroll background change
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Gallery Lightbox Handler
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.querySelector('img').getAttribute('data-fullsrc') || card.querySelector('img').getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.style.display = 'flex';
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                lightbox.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // 4. Video Play Cards on Demand
    const videoThumbs = document.querySelectorAll('.video-thumbnail-container');
    videoThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const videoUrl = thumb.getAttribute('data-video');
            const isLocal = thumb.getAttribute('data-local') === 'true';
            
            if (isLocal) {
                // Local Video
                const videoEl = document.createElement('video');
                videoEl.setAttribute('src', videoUrl);
                videoEl.setAttribute('controls', 'true');
                videoEl.setAttribute('autoplay', 'true');
                videoEl.style.width = '100%';
                videoEl.style.height = '100%';
                videoEl.style.objectFit = 'cover';
                thumb.innerHTML = '';
                thumb.appendChild(videoEl);
            } else {
                // YouTube Embed
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoUrl}?autoplay=1`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                thumb.innerHTML = '';
                thumb.appendChild(iframe);
            }
        });
    });

    // 4. Video Play Cards on Demand (Hidden/Removed placeholder)
    // Note: Video play features are ready for when video links are provided.
    const btnPlayHeroVideo = document.getElementById('btnPlayHeroVideo');
    const heroMediaContainer = document.getElementById('heroMediaContainer');
    
    if (btnPlayHeroVideo && heroMediaContainer) {
        btnPlayHeroVideo.addEventListener('click', () => {
            const videoEl = document.createElement('video');
            videoEl.src = 'assets/videos/video_principal.mp4';
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.muted = true; // Enforces muted in all browsers
            videoEl.defaultMuted = true; // Fallback helper
            videoEl.playsInline = true;
            videoEl.controls = true;
            videoEl.style.width = '100%';
            videoEl.style.height = '100%';
            videoEl.style.objectFit = 'cover';
            
            heroMediaContainer.innerHTML = '';
            heroMediaContainer.appendChild(videoEl);
        });
    }

    // 6. Checkout Modal & Donation Value Selection (Whop Direct Redirection)
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutClose = document.getElementById('checkoutClose');
    const openModalBtns = document.querySelectorAll('.btn-open-donation');
    const checkoutValBtns = document.querySelectorAll('.checkout-val-btn');
    const btnDoarAgora = document.getElementById('btnDoarAgora');
    
    // Mapping of Pound amounts to Whop redirect checkout links
    const WHOP_LINKS = {
        "10": "https://whop.com/checkout/ali-horses-10",
        "20": "https://whop.com/checkout/ali-horses-20",
        "30": "https://whop.com/checkout/ali-horses-30",
        "50": "https://whop.com/checkout/ali-horses-50",
        "70": "https://whop.com/checkout/ali-horses-70",
        "100": "https://whop.com/checkout/ali-horses-100",
        "250": "https://whop.com/checkout/ali-horses-250",
        "500": "https://whop.com/checkout/ali-horses-500"
    };

    let currentSelectedValue = '50'; // default starting choice

    const openCheckout = (initialValue = '') => {
        checkoutModal.classList.add('active');
        checkoutModal.setAttribute('aria-hidden', 'false');
        
        if (initialValue) {
            currentSelectedValue = initialValue;
            
            // Highlight selected button, remove active from others
            checkoutValBtns.forEach(btn => {
                const btnVal = btn.getAttribute('data-value');
                if (btnVal === initialValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    };

    const closeCheckout = () => {
        checkoutModal.classList.remove('active');
        checkoutModal.setAttribute('aria-hidden', 'true');
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = btn.getAttribute('data-donate-value');
            
            // If clicked directly inside a specific donation package card, redirect immediately
            if (btn.closest('.donation-card')) {
                const url = WHOP_LINKS[value];
                if (url) {
                    window.location.href = url;
                    return;
                }
            }
            
            // Otherwise open modal for value selection
            openCheckout(value);
        });
    });

    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckout);
    }

    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckout();
            }
        });
    }

    // Modal quick value buttons
    checkoutValBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            checkoutValBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSelectedValue = btn.getAttribute('data-value');
        });
    });

    // Redirect to the chosen Whop checkout link on click
    if (btnDoarAgora) {
        btnDoarAgora.addEventListener('click', () => {
            const url = WHOP_LINKS[currentSelectedValue];
            if (url) {
                window.location.href = url;
            } else {
                alert('Select a valid donation amount.');
            }
        });
    }

    // --- Anti-cloning Deterrents ---
    // Disable right click menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Disable common shortcut keys used for inspecting/viewing source code
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
            (e.ctrlKey && e.key === 'U') || 
            (e.ctrlKey && e.key === 'S')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // 7. Success Stories Read More
    const toggleStoryBtns = document.querySelectorAll('.toggle-story-btn');
    toggleStoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.story-card');
            const fullStory = card.querySelector('.story-full');
            const isOpened = fullStory.classList.contains('active');
            
            if (isOpened) {
                fullStory.classList.remove('active');
                btn.innerText = 'Ver história completa';
            } else {
                fullStory.classList.add('active');
                btn.innerText = 'Fechar história';
            }
        });
    });

    // 8. FAQ Accordion Dropdowns
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close other items
            faqItems.forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            if (isOpen) {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            } else {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});
