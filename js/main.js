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

    // Video Play Cards on Demand (Removed in UK version since video is in Portuguese)

    // 6. Checkout Modal, Gift Selection & Shipping Step (Whop Direct Redirection)
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutClose = document.getElementById('checkoutClose');
    const openModalBtns = document.querySelectorAll('.btn-open-donation');
    const checkoutValBtns = document.querySelectorAll('.checkout-val-btn');
    const giftCards = document.querySelectorAll('.gift-card');
    
    const checkoutStepInput = document.getElementById('checkoutStepInput');
    const checkoutStepShipping = document.getElementById('checkoutStepShipping');
    
    const btnGoToShipping = document.getElementById('btnGoToShipping');
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    const btnDoarAgora = document.getElementById('btnDoarAgora');
    
    const summaryAmount = document.getElementById('summaryAmount');
    const summaryType = document.getElementById('summaryType');
    const summaryGift = document.getElementById('summaryGift');
    
    // Mapping of Euro amounts to Whop redirect checkout links
    const WHOP_LINKS = {
        "10": "https://whop.com/checkout/plan_epwqXWaWXs6rD",
        "20": "https://whop.com/checkout/plan_ESj0ekhQCEC9F",
        "30": "https://whop.com/checkout/plan_Rg2H9oyFTW1WL",
        "50": "https://whop.com/checkout/plan_xsuTp1nPM75ZQ",
        "70": "https://whop.com/checkout/plan_bK9BZmrz4Wi6R",
        "100": "https://whop.com/checkout/plan_dgYHQSD98dmRF",
        "250": "https://whop.com/checkout/plan_58fPBG2E2ApXl",
        "500": "https://whop.com/checkout/plan_sonaYf5bEezND",
        "1000": "https://whop.com/checkout/plan_Vbwy7jEp0ySgC"
    };

    // Mapping of Euro amounts to Whop recurring (subscription) checkout links
    const WHOP_RECURRING_LINKS = {
        "10": "https://whop.com/checkout/plan_aC1YxEHhP1nEG",
        "20": "https://whop.com/checkout/plan_XPvBFB1E5RdlV",
        "30": "https://whop.com/checkout/plan_2KmlkBgmFcygi",
        "50": "https://whop.com/checkout/plan_Qfy9kPS24R8D7",
        "70": "https://whop.com/checkout/plan_hqQXQ62i8Xbzz",
        "100": "https://whop.com/checkout/plan_llopulr3jqDpx",
        "250": "https://whop.com/checkout/plan_uLHkXwS5VK9nM",
        "500": "https://whop.com/checkout/plan_OhTOS29mduGb5",
        "1000": "https://whop.com/checkout/plan_9CNMNYrzS3sVe"
    };

    let currentSelectedValue = '50';
    let currentSelectedGiftId = 'colar_1';
    let currentSelectedGiftName = 'Profil Équin (Or)';

    // Gift Card Selection Handler
    giftCards.forEach(card => {
        card.addEventListener('click', () => {
            giftCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            currentSelectedGiftId = card.getAttribute('data-gift-id');
            currentSelectedGiftName = card.getAttribute('data-gift-name');
        });
    });

    const openCheckout = (initialValue = '') => {
        checkoutModal.classList.add('active');
        checkoutModal.setAttribute('aria-hidden', 'false');
        
        // Reset to Step 1
        if (checkoutStepInput && checkoutStepShipping) {
            checkoutStepInput.style.display = 'block';
            checkoutStepShipping.style.display = 'none';
        }
        
        if (initialValue) {
            currentSelectedValue = initialValue;
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

    // Step 1 -> Step 2 transition
    if (btnGoToShipping) {
        btnGoToShipping.addEventListener('click', () => {
            const recurringCheckbox = document.getElementById('recurringCheckbox');
            const isRecurring = recurringCheckbox && recurringCheckbox.checked;

            if (summaryAmount) summaryAmount.innerText = `${currentSelectedValue} €`;
            if (summaryType) summaryType.innerText = isRecurring ? '(Don mensuel récurrent)' : '(Don ponctuel)';
            if (summaryGift) summaryGift.innerText = currentSelectedGiftName;

            checkoutStepInput.style.display = 'none';
            checkoutStepShipping.style.display = 'block';
        });
    }

    // Step 2 -> Step 1 back transition
    if (btnBackToStep1) {
        btnBackToStep1.addEventListener('click', () => {
            checkoutStepShipping.style.display = 'none';
            checkoutStepInput.style.display = 'block';
        });
    }

    // Redirect to the chosen Whop checkout link on click after shipping details
    if (btnDoarAgora) {
        btnDoarAgora.addEventListener('click', () => {
            const nameEl = document.getElementById('shipName');
            const emailEl = document.getElementById('shipEmail');
            const phoneEl = document.getElementById('shipPhone');
            const addressEl = document.getElementById('shipAddress');
            const zipEl = document.getElementById('shipZip');
            const cityEl = document.getElementById('shipCity');
            const countryEl = document.getElementById('shipCountry');

            if (!nameEl.value.trim() || !emailEl.value.trim() || !phoneEl.value.trim() || !addressEl.value.trim() || !zipEl.value.trim() || !cityEl.value.trim()) {
                alert('Veuillez remplir tous les champs obligatoires (*) du formulaire d\'expédition.');
                return;
            }

            const recurringCheckbox = document.getElementById('recurringCheckbox');
            const isRecurring = recurringCheckbox && recurringCheckbox.checked;
            
            const linksMap = isRecurring ? WHOP_RECURRING_LINKS : WHOP_LINKS;
            const url = linksMap[currentSelectedValue];
            
            if (url) {
                // Save donor shipping details & gift locally
                const donorData = {
                    name: nameEl.value.trim(),
                    email: emailEl.value.trim(),
                    phone: phoneEl.value.trim(),
                    address: addressEl.value.trim(),
                    zip: zipEl.value.trim(),
                    city: cityEl.value.trim(),
                    country: countryEl.value,
                    giftId: currentSelectedGiftId,
                    giftName: currentSelectedGiftName,
                    amount: currentSelectedValue,
                    recurring: isRecurring,
                    date: new Date().toISOString()
                };
                localStorage.setItem('ali_cavalos.donor_shipping', JSON.stringify(donorData));

                // Append return URL, UTM parameters + Donor info to Whop URL
                const returnUrl = window.location.origin + '/obrigado.html';
                const utmData = getUtmData();
                const params = new URLSearchParams();
                
                Object.entries(utmData).forEach(([key, val]) => {
                    if (val) params.set(key, val);
                });

                params.set('return_url', returnUrl);
                params.set('redirect_url', returnUrl);
                params.set('redirect_uri', returnUrl);
                params.set('gift', currentSelectedGiftName);
                params.set('donor_name', nameEl.value.trim());
                params.set('donor_email', emailEl.value.trim());
                params.set('amount', currentSelectedValue);
                params.set('recurring', isRecurring ? 'true' : 'false');

                const queryString = params.toString();
                const finalRedirectUrl = queryString ? `${url}?${queryString}` : url;
                
                window.location.href = finalRedirectUrl;
            } else {
                alert('Veuillez sélectionner un montant de don valide.');
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
