/**
 * VilPower Solutions — Global Enterprise JavaScript Engine
 * Navigation Dropdowns, Mobile Accordions & High-Performance Scroll-Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Sticky header elevation shadow behavior
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('shadow-md', 'bg-white/95');
                header.classList.remove('bg-white/80');
            } else {
                header.classList.remove('shadow-md', 'bg-white/95');
                header.classList.add('bg-white/80');
            }
        }, { passive: true });
    }

    // Scroll Progress Indicator Logic
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }

    // Back to Top Button visibility toggler
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        }, { passive: true });
    }

    // Highlight active link on desktop navigation based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item-btn, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active-nav');
        }
    });

    // Initialize Scroll Reveal Animations
    initScrollReveal();
    // Initialize Nexaris-style Split Text reveals
    initSplitText();
    // Initialize Odometer counters
    initCounters();
    // Initialize Hero Rotating Service Titles
    initRotatingServiceTitles();
    // Initialize Cursor Spotlight Glow Cards
    initSpotlightCards();
});

// Cursor Spotlight Glow Tracker (Linear / Stripe Signature Effect)
function initSpotlightCards() {
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
    });
}

// Nexaris-Style Split Text / Word Stagger Reveal
function initSplitText() {
    const splitElements = document.querySelectorAll('.split-headline');
    splitElements.forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.innerHTML = words.map((word, i) => {
            const delay = (i * 0.032).toFixed(3);
            return `<span class="split-word"><span class="split-word-inner" style="transition-delay: ${delay}s">${word}</span></span>`;
        }).join(' ');
    });

    const splitObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { 
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.05 
    });

    splitElements.forEach(el => splitObserver.observe(el));
}

// Scroll Reveal Intersection Observer (Smooth Eased Triggering)
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('active'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.05
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// Mobile Drawer Menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!menu) return;
    const isOpen = menu.classList.toggle('hidden');
    if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
        if (window.lucide) lucide.createIcons();
    }
}

// Mobile Accordion toggle for Dropdown submenus
function toggleMobileAccordion(id) {
    const item = document.getElementById(id);
    if (!item) return;
    item.classList.toggle('open');
    if (window.lucide) lucide.createIcons();
}

// Interactive Hero Playground Tab Switcher
function switchDemoTab(tabName) {
    const tabs = ['vision', 'nlp', 'audio'];
    tabs.forEach(t => {
        const btn = document.getElementById(`demo-tab-${t}`);
        const pane = document.getElementById(`demo-content-${t}`);
        if (btn && pane) {
            if (t === tabName) {
                btn.className = 'demo-tab-btn py-1.5 px-2 rounded-md bg-white text-[#1B45BD] border border-[#bfdbfe] text-center transition-all font-bold shadow-sm';
                pane.classList.remove('hidden');
            } else {
                btn.className = 'demo-tab-btn py-1.5 px-2 rounded-md text-slate-500 hover:text-slate-900 text-center transition-all';
                pane.classList.add('hidden');
            }
        }
    });
    if (window.lucide) lucide.createIcons();
}

// Vaulta Style Showcase Tab Switcher (Home Page 2)
function switchVaultaTab(tabKey) {
    const tabs = ['insights', 'publishing', 'lease', 'intelligence'];
    tabs.forEach(k => {
        const btn = document.getElementById(`vtab-btn-${k}`);
        const pane = document.getElementById(`vtab-pane-${k}`);
        if (btn && pane) {
            if (k === tabKey) {
                btn.classList.add('active');
                pane.classList.remove('hidden');
            } else {
                btn.classList.remove('active');
                pane.classList.add('hidden');
            }
        }
    });
    if (window.lucide) lucide.createIcons();
}

// Hero Filled-Side Slider Controller (Home Page 2)
let currentHeroSlide = 0;
const totalHeroSlides = 4;
let heroSliderTimer = null;

function setHeroSlide(index) {
    currentHeroSlide = (index + totalHeroSlides) % totalHeroSlides;
    
    for (let i = 0; i < totalHeroSlides; i++) {
        const slide = document.getElementById(`hero-slide-${i}`);
        const tab = document.getElementById(`hero-tab-${i}`);
        const dot = document.getElementById(`hero-dot-${i}`);
        
        if (slide) {
            slide.classList.toggle('active', i === currentHeroSlide);
        }
        if (tab) {
            tab.classList.remove('active');
            if (i === currentHeroSlide) {
                void tab.offsetWidth; // Trigger layout reflow to restart CSS progress fill
                tab.classList.add('active');
            }
        }
        if (dot) {
            dot.classList.toggle('active', i === currentHeroSlide);
        }
    }
    if (window.lucide) lucide.createIcons();
}

function nextHeroSlide() {
    setHeroSlide(currentHeroSlide + 1);
}

function prevHeroSlide() {
    setHeroSlide(currentHeroSlide - 1);
}

function startHeroSliderAutoPlay() {
    if (heroSliderTimer) clearInterval(heroSliderTimer);
    heroSliderTimer = setInterval(() => {
        nextHeroSlide();
    }, 5500);
}

function pauseHeroSlider() {
    if (heroSliderTimer) {
        clearInterval(heroSliderTimer);
        heroSliderTimer = null;
    }
}

// Initialize hero slider on load if present
document.addEventListener('DOMContentLoaded', () => {
    const sliderWrap = document.getElementById('hero-slider-wrap');
    if (sliderWrap) {
        setHeroSlide(0);
        startHeroSliderAutoPlay();
        sliderWrap.addEventListener('mouseenter', pauseHeroSlider);
        sliderWrap.addEventListener('mouseleave', startHeroSliderAutoPlay);
    }
});


// Modal Handlers
function openPilotModal(servicePreset) {
    const modal = document.getElementById('pilot-modal');
    if (modal) {
        modal.classList.add('show');
        if (servicePreset) {
            const select = document.getElementById('pilot-service');
            if (select) select.value = servicePreset;
        }
        if (window.lucide) lucide.createIcons();
    }
}

function closePilotModal() {
    const modal = document.getElementById('pilot-modal');
    if (modal) modal.classList.remove('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

// Gallery Lightbox
const galleryData = [
    { title: "Cleanroom Workstations & Dual-Monitor Pods", category: "Infrastructure", icon: "monitor", desc: "Ergonomic dual-monitor setups with high-resolution IPS displays and strict zero-device physical security." },
    { title: "ISO 27001 Certified Network Vault & Server Infrastructure", category: "Infrastructure", icon: "server", desc: "Air-gapped server room with redundant UPS backup, fire suppression, and biometric dual-factor authentication." },
    { title: "In-House 8-Week Incubation Classroom Batch", category: "Training", icon: "graduation-cap", desc: "Rigorous curriculum training rural women graduates in computer vision, JATS XML DTDs, and client platforms." },
    { title: "Computer Vision 3-Tier Quality Assurance Pod", category: "Team", icon: "users", desc: "Senior cross-verifiers running real-time statistical audit pipelines with sub-pixel edge alignment." },
    { title: "JATS 1.3 Scientific STM Publishing Validation Desk", category: "Team", icon: "file-check", desc: "PubMed Central schema compliance specialists converting medical and technical journal articles." },
    { title: "Rural Women Tech Empowerment Graduation 2026", category: "Events", icon: "award", desc: "Celebrating 1,500+ rural women placed into permanent full-time digital technology careers." }
];

let lightboxIndex = 0;

function filterGallery(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.className = 'filter-btn px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs transition-all shadow-sm';
    });
    if (btn) {
        btn.className = 'filter-btn px-4 py-2 rounded-lg bg-[#1B45BD] text-white border border-[#1B45BD] text-xs font-bold transition-all shadow-sm';
    }

    document.querySelectorAll('.gallery-card').forEach(item => {
        item.style.display = (category === 'all' || item.dataset.category === category) ? 'block' : 'none';
    });
}

function openLightbox(index) {
    lightboxIndex = index;
    const item = galleryData[lightboxIndex];
    if (!item) return;
    const cat = document.getElementById('lightbox-category');
    const cap = document.getElementById('lightbox-caption');
    const desc = document.getElementById('lightbox-desc');
    const modal = document.getElementById('lightbox-modal');
    if (cat) cat.textContent = item.category;
    if (cap) cap.textContent = item.title;
    if (desc) desc.textContent = item.desc;
    if (modal) modal.classList.add('show');
    if (window.lucide) lucide.createIcons();
}

function moveLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + galleryData.length) % galleryData.length;
    openLightbox(lightboxIndex);
}

// Form Handlers
function updateQualifications() {
    const select = document.getElementById('service-interest');
    if (!select) return;
    const val = select.value;
    document.querySelectorAll('.qualification').forEach(el => el.classList.add('hidden'));

    if (val === 'AI Data Services') {
        const el = document.getElementById('ai-fields');
        if (el) el.classList.remove('hidden');
    } else if (val === 'Lease Abstraction') {
        const el = document.getElementById('lease-fields');
        if (el) el.classList.remove('hidden');
    } else if (val === 'XML & Digital Publishing') {
        const el = document.getElementById('xml-fields');
        if (el) el.classList.remove('hidden');
    }
}

function handleLeadSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const form = document.getElementById('lead-form');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Transmitting Scope to Ops...';
    }
    setTimeout(() => {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Submit Project Scope for Formal Proposal →';
        }
        const fw = document.getElementById('form-wrap');
        const sw = document.getElementById('success-wrap');
        if (fw) fw.classList.add('hidden');
        if (sw) {
            sw.classList.remove('hidden');
            // Force redraw/re-render of the animated SVG checkmark elements
            const svgEl = sw.querySelector('svg');
            if (svgEl) {
                const content = svgEl.innerHTML;
                svgEl.innerHTML = '';
                void svgEl.offsetWidth; // Trigger layout reflow
                svgEl.innerHTML = content;
            }
        }
        if (form) {
            form.reset();
            updateQualifications(); // Restore default dynamic fields visibility
        }
        if (window.lucide) lucide.createIcons();
    }, 600);
}

function handlePilotSubmit(e) {
    e.preventDefault();
    closePilotModal();
    alert('🎉 Thank you! Your request for a Free 50-Record Benchmark Pilot has been received. Our operations team will contact you within 4 hours.');
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// High-Precision Smooth Number Counter Animation with easeOutExpo curve
function initCounters() {
    const counters = document.querySelectorAll('.stat-counter, [data-stat-counter]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const rawTarget = el.getAttribute('data-stat-counter') || el.getAttribute('data-target') || el.textContent.trim();
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
                const useCommas = el.getAttribute('data-use-commas') === 'true' || rawTarget.includes(',') || (!isNaN(parseFloat(rawTarget)) && parseFloat(rawTarget) >= 1000);
                
                const numStr = rawTarget.replace(/[^0-9.]/g, '');
                const targetNum = parseFloat(numStr);
                if (isNaN(targetNum)) {
                    obs.unobserve(el);
                    return;
                }

                const duration = 1800; // 1.8s smooth duration
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Smooth easeOutExpo: progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = easeProgress * targetNum;
                    
                    let formattedVal = currentVal.toFixed(decimals);
                    if (useCommas) {
                        const parts = formattedVal.split('.');
                        parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
                        formattedVal = parts.join('.');
                    }
                    
                    el.textContent = `${prefix}${formattedVal}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        let finalVal = targetNum.toFixed(decimals);
                        if (useCommas) {
                            const parts = finalVal.split('.');
                            parts[0] = parseInt(parts[0], 10).toLocaleString('en-US');
                            finalVal = parts.join('.');
                        }
                        el.textContent = `${prefix}${finalVal}${suffix}`;
                    }
                }

                requestAnimationFrame(update);

                // Trigger associated progress bar if present in parent card
                const parent = el.closest('.nexaris-card, .nexaris-card-emerald, div');
                if (parent) {
                    const fill = parent.querySelector('.metric-progress-fill');
                    if (fill) {
                        const targetWidth = fill.getAttribute('data-fill') || '100%';
                        fill.style.width = targetWidth;
                    }
                }

                obs.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    counters.forEach(el => observer.observe(el));
}

// Hero Rotating Service Title Controller (Vertical Slide + Fade)
function initRotatingServiceTitles() {
    const wrap = document.querySelector('.hero-rotating-service-wrap');
    if (!wrap) return;

    const items = wrap.querySelectorAll('.hero-rotating-service-item');
    if (items.length <= 1) return;

    let currentIndex = 0;
    const intervalTime = 3400; // 3.4 seconds rotation cycle
    let rotateTimer = null;

    // Measure and set minimum width to prevent any layout shifts
    function adjustWrapWidth() {
        if (window.innerWidth >= 640) {
            let maxWidth = 0;
            items.forEach(item => {
                const prevPos = item.style.position;
                item.style.position = 'relative';
                const w = item.offsetWidth;
                item.style.position = prevPos;
                if (w > maxWidth) maxWidth = w;
            });
            if (maxWidth > 0) {
                wrap.style.minWidth = (maxWidth + 4) + 'px';
            }
        } else {
            wrap.style.minWidth = 'auto';
        }
    }

    adjustWrapWidth();
    window.addEventListener('resize', adjustWrapWidth);

    function rotateNext() {
        const currentItem = items[currentIndex];
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];

        // Animate current out
        currentItem.classList.remove('active');
        currentItem.classList.add('exit');

        // Animate next in
        nextItem.classList.remove('exit');
        nextItem.classList.add('active');

        // Cleanup previous after animation finishes
        setTimeout(() => {
            currentItem.classList.remove('exit');
        }, 700);

        currentIndex = nextIndex;
    }

    function startRotation() {
        if (rotateTimer) clearInterval(rotateTimer);
        rotateTimer = setInterval(rotateNext, intervalTime);
    }

    startRotation();

    // Pause on hover
    wrap.addEventListener('mouseenter', () => {
        if (rotateTimer) clearInterval(rotateTimer);
    });

    wrap.addEventListener('mouseleave', () => {
        startRotation();
    });
}

