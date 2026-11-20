/**
 * VilPower Solutions — Global Enterprise JavaScript Engine
 * Navigation Dropdowns, Mobile Accordions & High-Performance Scroll-Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure homepage always starts at the top hero section on load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }

    // Initialize Global Page Preloader & Smooth Entrance Cascade (Nexsas SaaS Style)
    initPagePreloader();

    // Initialize 4-Stage Precision Pipeline Scroll-Driven Stacking Cards
    initPrecisionPipelineStack();
    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Floating Pill Header on Scroll behavior
    const header = document.getElementById('main-header');
    if (header) {
        const onHeaderScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled', 'shadow-md', 'bg-white/95');
                header.classList.remove('bg-white/80');
            } else {
                header.classList.remove('is-scrolled', 'shadow-md', 'bg-white/95');
                header.classList.add('bg-white/80');
            }
        };
        window.addEventListener('scroll', onHeaderScroll, { passive: true });
        onHeaderScroll();
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

    // Initialize Desktop Nav Dropdown Controller (Prevents overlapping & stuck focus)
    initDesktopDropdowns();
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
    // Initialize HITL Cockpit Panel
    initHITLPanel();
    // Initialize 4-Stage Precision Pipeline Pinned Scroll Floating Cards
    initPipelineScrollCards();
    // Initialize Ecosystem Directory Live Search & Filter
    initEcosystemDirectory();
    // Initialize Rotary Dial Architecture Tabs
    initRotaryDial();
});

// 4-Stage E-Publishing Precision Pipeline — Pinned Scroll Floating Cards Controller
function initPipelineScrollCards() {
    const section = document.getElementById('pipeline-scroll-section');
    if (!section) return;

    const card1 = document.getElementById('pipeline-card-1');
    const card2 = document.getElementById('pipeline-card-2');
    const card3 = document.getElementById('pipeline-card-3');
    const card4 = document.getElementById('pipeline-card-4');
    if (!card1 || !card2 || !card3 || !card4) return;

    let ticking = false;

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    const lerp = (start, end, t) => start + (end - start) * t;

    function update() {
        if (window.innerWidth < 1024) {
            // Reset transforms on mobile/tablet so responsive grid takes over cleanly
            [card1, card2, card3, card4].forEach(card => {
                card.style.transform = '';
                card.style.opacity = '';
            });
            ticking = false;
            return;
        }

        const rect = section.getBoundingClientRect();
        const totalScroll = rect.height - window.innerHeight;
        if (totalScroll <= 0) {
            ticking = false;
            return;
        }

        // Section progress from 0 to 1
        const progress = clamp(-rect.top / totalScroll, 0, 1);

        // Milestone 1 (p=0): Only heading is visible. Cards are below viewport.
        // Milestone 2 (p~0.30 - 0.40): Card 1 (Top-Left) and Card 2 (Bottom-Right) float in.
        // Milestone 3 (p~0.65 - 0.75): Card 1 floats up/out, Card 2 is at Top-Right, Card 3 (Mid-Left) and Card 4 (Bottom-Right) float in.

        // Card 1: Enters from bottom (+105vh) at p=0.03, settles in top-left (~20vh) at p=0.35, floats off (-35vh) by p=0.68
        const t1 = clamp((progress - 0.03) / (0.65 - 0.03), 0, 1);
        const y1 = lerp(105, -35, t1);
        const op1 = progress < 0.03 ? 0 : (progress > 0.58 ? clamp(lerp(1, 0, (progress - 0.58) / 0.08), 0, 1) : 1);
        card1.style.transform = `translate3d(0, ${y1}vh, 0) rotate(-6deg)`;
        card1.style.opacity = op1;

        // Card 2: Enters from bottom (+115vh) at p=0.06, reaches bottom-right (~58vh) at p=0.35, reaches top-right (~14vh) at p=0.70, floats off (-35vh) by p=0.88
        const t2 = clamp((progress - 0.06) / (0.88 - 0.06), 0, 1);
        const y2 = lerp(115, -35, t2);
        const op2 = progress < 0.06 ? 0 : (progress > 0.80 ? clamp(lerp(1, 0, (progress - 0.80) / 0.08), 0, 1) : 1);
        card2.style.transform = `translate3d(0, ${y2}vh, 0) rotate(5deg)`;
        card2.style.opacity = op2;

        // Card 3: Enters from bottom (+115vh) at p=0.32, reaches mid-left (~38vh) at p=0.70, floats off (-30vh) by p=0.96
        const t3 = clamp((progress - 0.32) / (0.96 - 0.32), 0, 1);
        const y3 = lerp(115, -30, t3);
        const op3 = progress < 0.32 ? 0 : (progress > 0.88 ? clamp(lerp(1, 0, (progress - 0.88) / 0.08), 0, 1) : 1);
        card3.style.transform = `translate3d(0, ${y3}vh, 0) rotate(-4deg)`;
        card3.style.opacity = op3;

        // Card 4: Enters from bottom (+115vh) at p=0.42, reaches lower-right (~62vh) at p=0.75, moves to ~20vh by p=1.0
        const t4 = clamp((progress - 0.42) / (1.0 - 0.42), 0, 1);
        const y4 = lerp(115, 20, t4);
        const op4 = progress < 0.42 ? 0 : 1;
        card4.style.transform = `translate3d(0, ${y4}vh, 0) rotate(4deg)`;
        card4.style.opacity = op4;

        ticking = false;
    }

    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    requestTick();
}

// Ecosystem Directory Live Filter
function initEcosystemDirectory() {
    const searchInput = document.getElementById('eco-search-input');
    const filterBtns = document.querySelectorAll('.eco-filter-btn');
    const cards = document.querySelectorAll('.eco-directory-card');
    if (!cards.length) return;

    let currentCategory = 'all';
    let searchQuery = '';

    function filterCards() {
        cards.forEach(card => {
            const cat = card.getAttribute('data-category') || '';
            const title = (card.querySelector('h4')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
            const tag = (card.querySelector('.eco-card-tag')?.textContent || '').toLowerCase();

            const matchesCat = currentCategory === 'all' || cat.toLowerCase().includes(currentCategory);
            const matchesSearch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery) || tag.includes(searchQuery);

            if (matchesCat && matchesSearch) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            filterCards();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-[#1B45BD]', 'text-white');
                b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
            });
            btn.classList.add('active', 'bg-[#1B45BD]', 'text-white');
            btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
            currentCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase();
            filterCards();
        });
    });
}

// Rotary Dial Interactive Architecture Tabs
function initRotaryDial() {
    const tabs = document.querySelectorAll('.rotary-tab-btn');
    const innerRing = document.querySelector('.rotary-ring-inner');
    const outerRing = document.querySelector('.rotary-ring-outer');
    const titleEl = document.getElementById('rotary-tab-title');
    const descEl = document.getElementById('rotary-tab-desc');
    if (!tabs.length || !titleEl || !descEl) return;

    const data = {
        'annotation': {
            title: 'Annotation Operations & Sensor Calibration',
            desc: '500+ rural women engineering talent annotating 3D LiDAR point clouds, 2D polygons, and video tracking sequences with verified ground-truth sensor fusion and zero multi-agent drift.',
            innerDeg: 0,
            outerDeg: 0
        },
        'publishing': {
            title: 'Scientific & Digital Publishing Engine',
            desc: 'Automated conversion of scientific manuscripts into validated NLM JATS 1.3, BITS, and MathML equations, alongside certified ePUB3 trade publishing for Apple Books and Amazon Kindle.',
            innerDeg: 120,
            outerDeg: -120
        },
        'quality': {
            title: 'Dual-Pass Human-in-the-Loop Quality Gate',
            desc: 'Every single record undergoes secondary blind verification and automated schema preflight, delivering our industry-leading guaranteed 99.8% audited SLA accuracy.',
            innerDeg: 240,
            outerDeg: -240
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-blue-50', 'text-[#1B45BD]', 'border-blue-200');
                t.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
            });
            tab.classList.add('active', 'bg-blue-50', 'text-[#1B45BD]', 'border-blue-200');
            tab.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

            const key = tab.getAttribute('data-rotary-tab');
            if (data[key]) {
                titleEl.textContent = data[key].title;
                descEl.textContent = data[key].desc;
                if (innerRing) innerRing.style.transform = `rotate(${data[key].innerDeg}deg)`;
                if (outerRing) outerRing.style.transform = `rotate(${data[key].outerDeg}deg)`;
            }
        });
    });
}

// Desktop Nav Dropdown Controller — prevents stuck focus, double-activation, and overlapping panels
function initDesktopDropdowns() {
    const desktopNav = document.querySelector('.desktop-nav');
    const dropdownContainers = document.querySelectorAll('.desktop-nav .has-dropdown');
    if (!dropdownContainers.length) return;

    // Mark wide mega panels so CSS can center them under the floating pill when scrolled
    dropdownContainers.forEach(container => {
        const panel = container.querySelector('.dropdown-menu-panel, .mega-menu-panel');
        if (panel && (
            panel.className.includes('w-[880px]') ||
            panel.className.includes('w-[920px]') ||
            panel.className.includes('w-[940px]') ||
            panel.className.includes('w-[960px]') ||
            panel.className.includes('w-[980px]')
        )) {
            panel.classList.add('mega-anchored');
            container.classList.add('has-mega-menu');
        }
    });

    const closeAllDropdowns = () => {
        dropdownContainers.forEach(c => {
            if (c._closeTimer) {
                clearTimeout(c._closeTimer);
                c._closeTimer = null;
            }
            c.classList.remove('is-open');
            const b = c.querySelector('.nav-item-btn');
            if (b && document.activeElement === b) b.blur();
        });
    };

    dropdownContainers.forEach(container => {
        const btn = container.querySelector('.nav-item-btn');

        // On mouse enter, cancel all pending close timers and immediately close any other open dropdowns
        container.addEventListener('mouseenter', () => {
            dropdownContainers.forEach(other => {
                if (other._closeTimer) {
                    clearTimeout(other._closeTimer);
                    other._closeTimer = null;
                }
                if (other !== container) {
                    other.classList.remove('is-open');
                    const otherBtn = other.querySelector('.nav-item-btn');
                    if (otherBtn && document.activeElement === otherBtn) {
                        otherBtn.blur();
                    }
                }
            });
            container.classList.add('is-open');
        });

        // Mouse leave clears is-open state with a grace window (160ms)
        // so moving cursor straight down into dropdown panel stays open smoothly
        container.addEventListener('mouseleave', () => {
            if (container._closeTimer) {
                clearTimeout(container._closeTimer);
            }
            container._closeTimer = setTimeout(() => {
                container.classList.remove('is-open');
                if (btn && document.activeElement === btn) {
                    btn.blur();
                }
                container._closeTimer = null;
            }, 160);
        });

        // Toggle on click (for touch / keyboard)
        if (btn) {
            btn.addEventListener('click', (e) => {
                const isCurrentlyOpen = container.classList.contains('is-open');

                // Close all others first
                closeAllDropdowns();

                if (!isCurrentlyOpen) {
                    container.classList.add('is-open');
                } else {
                    btn.blur();
                }
            });
        }
    });

    // When hovering over non-dropdown links in desktop-nav (e.g. Contact), close any open dropdowns immediately
    if (desktopNav) {
        const directNavLinks = desktopNav.querySelectorAll(':scope > a, :scope > div:not(.has-dropdown)');
        directNavLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                closeAllDropdowns();
            });
        });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-nav .has-dropdown')) {
            closeAllDropdowns();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

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

// Interactive Hero Playground Tab Switcher (HITL Cockpit)
// Tab switcher — delegates to live engine
function switchDemoTab(tabName) {
    const tabs = ['vision', 'nlp', 'audio'];
    tabs.forEach(t => {
        const btn  = document.getElementById(`demo-tab-${t}`);
        const pane = document.getElementById(`demo-content-${t}`);
        if (!btn || !pane) return;
        if (t === tabName) {
            btn.classList.remove('hitl-tab-inactive');
            btn.classList.add('hitl-tab-active');
            pane.classList.remove('hidden');
        } else {
            btn.classList.remove('hitl-tab-active');
            btn.classList.add('hitl-tab-inactive');
            pane.classList.add('hidden');
        }
    });
    if (window.lucide) lucide.createIcons();
    if (window._hitlEngine) window._hitlEngine.onTabSwitch(tabName);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HITL Live Demo Engine — unified live controller for all 3 tabs
   ═══════════════════════════════════════════════════════════════════════════ */
function initHITLPanel() {
    const panel = document.querySelector('.hitl-cockpit-panel');
    if (!panel) return;

    let paused     = false;
    let activeTab  = 'vision';
    const _timers  = { vision: [], nlp: [], audio: [] };

    function _later(fn, ms, tab) {
        const id = setTimeout(fn, ms);
        const key = tab || activeTab;
        if (_timers[key]) _timers[key].push({t:'to', id});
        return id;
    }
    function _every(fn, ms, tab) {
        const id = setInterval(fn, ms);
        const key = tab || activeTab;
        if (_timers[key]) _timers[key].push({t:'iv', id});
        return id;
    }
    function _clearTab(tab) {
        (_timers[tab] || []).forEach(x => x.t === 'iv' ? clearInterval(x.id) : clearTimeout(x.id));
        _timers[tab] = [];
    }

    // Always live — no pause on hover

    /* ── helpers ─────────────────────────────────────────────────────── */
    function _fadeText(elId, txt) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.style.opacity = '0';
        _later(() => { el.textContent = txt; el.style.transition = 'opacity 0.35s'; el.style.opacity = '1'; }, 220);
    }

    /* ══════════════════════════════════════════════════════════════════
       VISION ENGINE
       ══════════════════════════════════════════════════════════════════ */
    const vMsgs = [
        'Initialising LiDAR+RGB fusion…',
        'Scanning frame…',
        'Detecting objects…',
        'VEHICLE #049 locked · conf 99.8%',
        'PEDESTRIAN locked · conf 99.6%',
        'SIGNAL locked · conf 97.1%',
        'Running Tier-3 QA audit…',
        'Multi-pass verification ✓',
        'Output dispatched to pipeline',
        'Next frame queued…',
    ];
    let vMsgIdx = 0, vRunning = false;

    function vSetProcBar(pct) {
        const b = document.getElementById('vision-proc-bar');
        if (b) { b.style.transition = pct === 0 ? 'none' : 'width 0.1s linear'; b.style.width = pct + '%'; }
    }
    function vSetObjCount(n) { const e = document.getElementById('vision-obj-count'); if (e) e.textContent = n; }

    function vLoop() {
        if (!vRunning) return;
        vMsgIdx = 0;

        // Helper: set SVG element opacity via attribute
        function svgShow(id, val) {
            const el = document.getElementById(id);
            if (el) el.setAttribute('opacity', String(val));
        }

        // Reset all SVG annotation groups + corners + labels
        ['anno-vehicle','anno-ped','anno-sig'].forEach(id => svgShow(id, 0));
        ['vc-tl','vc-tr','vc-bl','vc-br',
         'pd-tl','pd-tr','pd-bl','pd-br',
         'sg-tl','sg-tr','sg-bl','sg-br'].forEach(id => svgShow(id, 0));
        ['vc-label-bg','vc-label','vc-conf',
         'pd-label-bg','pd-label','pd-conf',
         'sg-label-bg','sg-label','sg-conf'].forEach(id => svgShow(id, 0));

        vSetProcBar(0); vSetObjCount(0);

        const frameEl   = document.getElementById('hitl-frame-num');
        const frameBase = 49 + Math.floor(Math.random() * 60);
        if (frameEl) frameEl.textContent = String(frameBase).padStart(4, '0');

        // Status messages
        const msgIv = _every(() => {
            if (paused || activeTab !== 'vision') return;
            _fadeText('hitl-status-text', vMsgs[vMsgIdx % vMsgs.length]);
            vMsgIdx++;
        }, 850);

        // Progress bar
        let pct = 0;
        const barIv = _every(() => {
            if (paused) return;
            pct = Math.min(pct + 2.8, 100);
            vSetProcBar(pct);
            if (pct >= 100) clearInterval(barIv);
        }, 55);

        // ── rAF scanline sweep → triggers each object as it crosses ──
        const SCAN_MS  = 2400;
        const HOLD_MS  = 1400;
        const scanLine = document.getElementById('hitl-scanline-svg');
        const scanGlow = document.getElementById('hitl-scanline-glow');

        // y = SVG coordinate of each box TOP edge
        const svgObjects = [
            { y: 66,  id: 'anno-sig',     n: 1, dFrame: 0,
              corners: ['sg-tl','sg-tr','sg-bl','sg-br'],
              labels:  ['sg-label-bg','sg-label','sg-conf'] },
            { y: 104, id: 'anno-ped',     n: 2, dFrame: 1,
              corners: ['pd-tl','pd-tr','pd-bl','pd-br'],
              labels:  ['pd-label-bg','pd-label','pd-conf'] },
            { y: 112, id: 'anno-vehicle', n: 3, dFrame: 2,
              corners: ['vc-tl','vc-tr','vc-bl','vc-br'],
              labels:  ['vc-label-bg','vc-label','vc-conf'] },
        ];
        const triggered = new Set();
        let scanStart = null;

        function scanStep(ts) {
            if (!vRunning || activeTab !== 'vision') {
                if (scanLine) scanLine.setAttribute('opacity', '0');
                if (scanGlow) scanGlow.setAttribute('opacity', '0');
                return;
            }
            if (!scanStart) scanStart = ts;
            const progress = Math.min((ts - scanStart) / SCAN_MS, 1);
            const svgY = -3 + progress * 229; // sweep y: -3 → 226

            if (scanLine) {
                scanLine.setAttribute('y', String(svgY - 1));
                scanLine.setAttribute('opacity', progress < 0.97 ? '1' : '0');
            }
            if (scanGlow) {
                scanGlow.setAttribute('y', String(svgY - 6));
                scanGlow.setAttribute('opacity', progress < 0.97 ? '0.45' : '0');
            }

            // Reveal each object when scanline reaches its top edge
            svgObjects.forEach(obj => {
                if (triggered.has(obj.id)) return;
                if (svgY >= obj.y) {
                    triggered.add(obj.id);
                    svgShow(obj.id, 1);
                    obj.corners.forEach((cid, i) => {
                        setTimeout(() => svgShow(cid, 1), i * 60);
                    });
                    setTimeout(() => {
                        obj.labels.forEach(lid => svgShow(lid, 1));
                    }, 280);
                    vSetObjCount(obj.n);
                    if (frameEl) frameEl.textContent = String(frameBase + obj.dFrame).padStart(4,'0');
                }
            });

            if (progress < 1) {
                requestAnimationFrame(scanStep);
            } else {
                if (scanLine) scanLine.setAttribute('opacity', '0');
                if (scanGlow) scanGlow.setAttribute('opacity', '0');
                _later(() => {
                    clearInterval(msgIv);
                    _later(() => { if (vRunning && activeTab === 'vision') vLoop(); }, 300);
                }, HOLD_MS);
            }
        }

        // Short delay then kick off scan
        _later(() => {
            if (!vRunning || activeTab !== 'vision') return;
            triggered.clear();
            scanStart = null;
            if (scanLine) { scanLine.setAttribute('y', '-1'); scanLine.setAttribute('opacity', '1'); }
            if (scanGlow) { scanGlow.setAttribute('y', '-6'); scanGlow.setAttribute('opacity', '0.45'); }
            requestAnimationFrame(scanStep);
        }, 300);
    }

    function startVision() { vRunning = true;  vLoop(); }
    function stopVision()  { vRunning = false; }

    /* ══════════════════════════════════════════════════════════════════
       NLP ENGINE
       ══════════════════════════════════════════════════════════════════ */
    const nlpDocs = [
        {
            parts: [
                {t:'tx', v:'"The tenant '},
                {t:'en', label:'ORG',   v:'ACME Global Logistics Inc.', color:'#1B45BD', bg:'#eff4ff',  bd:'#bfdbfe'},
                {t:'tx', v:' agreed to lease Suite 400 at '},
                {t:'en', label:'LOC',   v:'500 Silicon Way, Austin TX', color:'#0e7490', bg:'#ecfeff',   bd:'#a5f3fc'},
                {t:'tx', v:' commencing '},
                {t:'en', label:'DATE',  v:'Nov 1, 2026',                color:'#029146', bg:'#ecfdf3',    bd:'#a7f3d0'},
                {t:'tx', v:' at '},
                {t:'en', label:'MONEY', v:'$48,500/mo',                 color:'#b45309', bg:'#fffbeb', bd:'#fcd34d'},
                {t:'tx', v:'."'},
            ],
            intent: 'COMMERCIAL_LEASE · HIGH_CONF',
            halluc: '0.00% (Audited)',
        },
        {
            parts: [
                {t:'tx', v:'"Landlord '},
                {t:'en', label:'ORG',  v:'Pinnacle REIT LLC',  color:'#1B45BD', bg:'#eff4ff',  bd:'#bfdbfe'},
                {t:'tx', v:' grants renewal option at '},
                {t:'en', label:'LOC',  v:'Tower B, Floor 12',  color:'#0e7490', bg:'#ecfeff',   bd:'#a5f3fc'},
                {t:'tx', v:' until '},
                {t:'en', label:'DATE', v:'Dec 31, 2028',       color:'#029146', bg:'#ecfdf3',    bd:'#a7f3d0'},
                {t:'tx', v:'."'},
            ],
            intent: 'RENEWAL_OPTION · HIGH_CONF',
            halluc: '0.00% (Audited)',
        },
    ];
    const nlpStatusSteps = [
        'Tokenising clause…',
        'Running Legal-BERT NER…',
        'Entities extracted…',
        'Intent classified ✓',
        'Hallucination check pass ✓',
    ];
    let nlpDocIdx = 0, nlpRunning = false;

    function nlpLoop() {
        if (!nlpRunning) return;
        const doc = nlpDocs[nlpDocIdx % nlpDocs.length];
        nlpDocIdx++;

        const sentEl  = document.getElementById('nlp-sentence');
        const intentEl = document.getElementById('nlp-intent');
        const hallucEl = document.getElementById('nlp-halluc');
        if (!sentEl) return;

        sentEl.innerHTML = '';
        if (intentEl) intentEl.textContent = '—';
        if (hallucEl) hallucEl.textContent  = '—';
        _fadeText('nlp-status-text', nlpStatusSteps[0]);

        const entitySpans = [];
        doc.parts.forEach(p => {
            if (p.t === 'tx') {
                sentEl.appendChild(document.createTextNode(p.v));
            } else {
                const s = document.createElement('span');
                s.className = 'nlp-entity';
                s.style.cssText = `background:${p.bg};color:${p.color};border:1px solid ${p.bd};`;
                s.textContent = `[${p.label}: ${p.v}]`;
                sentEl.appendChild(s);
                entitySpans.push(s);
            }
        });

        // Reveal entities with stagger
        entitySpans.forEach((span, i) => {
            _later(() => {
                span.classList.add('visible');
                _fadeText('nlp-status-text', nlpStatusSteps[Math.min(i + 1, nlpStatusSteps.length - 1)]);
            }, 550 + i * 500);
        });

        const done = 550 + entitySpans.length * 500 + 400;
        _later(() => {
            // Populate result cards directly (not via _fadeText to avoid id lookup timing issues)
            const intentEl2 = document.getElementById('nlp-intent');
            const hallucEl2 = document.getElementById('nlp-halluc');
            if (intentEl2) {
                intentEl2.style.opacity = '0';
                setTimeout(() => { intentEl2.textContent = doc.intent; intentEl2.style.transition = 'opacity 0.4s'; intentEl2.style.opacity = '1'; }, 150);
            }
            if (hallucEl2) {
                hallucEl2.style.opacity = '0';
                setTimeout(() => { hallucEl2.textContent = doc.halluc; hallucEl2.style.transition = 'opacity 0.4s'; hallucEl2.style.opacity = '1'; }, 350);
            }
            _fadeText('nlp-status-text', nlpStatusSteps[nlpStatusSteps.length - 1]);
            // Use native setTimeout so _clearTab won't kill this restart,
            // but double-guard: nlpRunning AND activeTab must still be 'nlp'
            const restartId = setTimeout(() => {
                if (nlpRunning && activeTab === 'nlp') nlpLoop();
            }, 2400);
            // Register restart timer so onTabSwitch can cancel it via _clearTab
            _timers['nlp'].push({ t: 'to', id: restartId });
        }, done);
    }

    function startNlp() { nlpRunning = true;  nlpLoop(); }
    function stopNlp()  { nlpRunning = false; }

    /* ══════════════════════════════════════════════════════════════════
       AUDIO ENGINE
       ══════════════════════════════════════════════════════════════════ */
    const jatsLines = [
        '<span style="color:#1B45BD">&lt;article&gt;</span>',
        '  <span style="color:#1B45BD">&lt;front&gt;&lt;article-meta&gt;</span>',
        '    <span style="color:#1B45BD">&lt;article-id</span> <span style="color:#d97706">pub-id-type</span>=<span style="color:#16a34a">"doi"</span><span style="color:#1B45BD">&gt;</span><span style="color:#334155">10.1016/j.cell.2026.08.004</span><span style="color:#1B45BD">&lt;/article-id&gt;</span>',
        '    <span style="color:#1B45BD">&lt;title-group&gt;</span>',
        '      <span style="color:#1B45BD">&lt;article-title&gt;</span><span style="color:#334155">Clinical Precision Bio-Assay in Neural Tissue</span><span style="color:#1B45BD">&lt;/article-title&gt;</span>',
        '    <span style="color:#1B45BD">&lt;/title-group&gt;</span>',
        '    <span style="color:#1B45BD">&lt;pub-date</span> <span style="color:#d97706">pub-type</span>=<span style="color:#16a34a">"epub"</span><span style="color:#1B45BD">&gt;&lt;year&gt;</span><span style="color:#334155">2026</span><span style="color:#1B45BD">&lt;/year&gt;&lt;/pub-date&gt;</span>',
        '  <span style="color:#1B45BD">&lt;/article-meta&gt;&lt;/front&gt;</span>',
        '<span style="color:#029146;font-weight:700;">✓ Schema valid · PubMed DTD · 100% Pass</span>',
    ];
    const audioMsgs = [
        'Diarising audio stream…',
        'SPK_A detected · 00:04.2',
        'SPK_B detected · 00:12.8',
        'Transcription aligned…',
        'Parsing JATS 1.3 XML…',
        'Schema validation running…',
        'PubMed Central DTD ✓',
        'Validation 100% Pass',
    ];
    let jatsIdx = 0, audioSecs = 0, audioRunning = false, audioMsgIdx = 0;

    function startAudio() {
        audioRunning = true;
        jatsIdx = 0; audioSecs = 0; audioMsgIdx = 0;
        const jatsEl = document.getElementById('jats-output');
        if (jatsEl) jatsEl.innerHTML = '';

        // Timer counter
        _every(() => {
            if (paused || activeTab !== 'audio') return;
            audioSecs += 0.1;
            const m = Math.floor(audioSecs / 60).toString().padStart(2,'0');
            const s = (audioSecs % 60).toFixed(1).padStart(4,'0');
            const el = document.getElementById('audio-timer');
            if (el) el.textContent = `${m}:${s}`;
        }, 100);

        // Waveform randomiser
        _every(() => {
            if (paused || activeTab !== 'audio') return;
            for (let i = 0; i < 12; i++) {
                const b = document.getElementById(`wb${i}`);
                if (b) b.style.height = (Math.floor(Math.random() * 75) + 10) + '%';
            }
            const isA = Math.random() > 0.45;
            const spkA = document.getElementById('audio-spk-a');
            const spkB = document.getElementById('audio-spk-b');
            if (spkA) spkA.style.opacity = isA ? '1' : '0.3';
            if (spkB) spkB.style.opacity = isA ? '0.3' : '1';
        }, 180);

        // JATS XML lines typewriter
        _every(() => {
            if (paused || activeTab !== 'audio') return;
            const jEl = document.getElementById('jats-output');
            if (!jEl) return;
            if (jatsIdx < jatsLines.length) {
                const d = document.createElement('div');
                d.innerHTML = jatsLines[jatsIdx++];
                jEl.appendChild(d);
                jEl.scrollTop = jEl.scrollHeight;
            } else {
                // Reset and loop
                _later(() => { jatsIdx = 0; audioSecs = 0; if (jEl) jEl.innerHTML = ''; }, 1800);
            }
        }, 700);

        // Status messages
        _every(() => {
            if (paused || activeTab !== 'audio') return;
            _fadeText('audio-status-text', audioMsgs[audioMsgIdx % audioMsgs.length]);
            audioMsgIdx++;
        }, 1100);
    }

    function stopAudio() { audioRunning = false; }

    /* ══════════════════════════════════════════════════════════════════
       TAB SWITCH HANDLER
       ══════════════════════════════════════════════════════════════════ */
    function onTabSwitch(tab) {
        const prev = activeTab;
        activeTab = tab;

        if (tab === 'nlp')   { nlpRunning = false;   _clearTab('nlp');   startNlp();   }
        if (tab === 'audio') { audioRunning = false; _clearTab('audio'); startAudio(); }        if (tab === 'vision') {
            _clearTab('vision');
            vRunning = true;
            _later(vLoop, 80, 'vision');
        }
    }

    /* ══════════════════════════════════════════════════════════════════
       BOOT — wait for panel to slide into view then start vision
       ══════════════════════════════════════════════════════════════════ */
    function boot() {
        activeTab = 'vision';
        startVision();
    }

    const revealEl = panel.closest('.reveal-right');
    if (revealEl) {
        const mo = new MutationObserver(() => {
            if (revealEl.classList.contains('active')) {
                mo.disconnect();
                _later(boot, 420, 'vision');
            }
        });
        mo.observe(revealEl, { attributes: true, attributeFilter: ['class'] });
    } else {
        _later(boot, 100, 'vision');
    }

    // Expose engine globally so switchDemoTab can call it
    window._hitlEngine = { onTabSwitch };
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
    { title: "Cleanroom Workstations & Dual-Monitor Pods", category: "Infrastructure", img: "img/cleanroom-workstations.jpg", desc: "Ergonomic dual-monitor setups with high-resolution IPS displays and strict zero-device physical security." },
    { title: "ISO 27001 Certified Network Vault & Server Infrastructure", category: "Infrastructure", img: "img/server-vault.jpg", desc: "Air-gapped server room with redundant UPS backup, fire suppression, and biometric dual-factor authentication." },
    { title: "In-House 8-Week Incubation Classroom Batch", category: "Training", img: "img/rural-academy.jpg", desc: "Rigorous curriculum training rural women graduates in computer vision, JATS XML DTDs, and client platforms." },
    { title: "Computer Vision 3-Tier Quality Assurance Pod", category: "Team", img: "img/mobility-pod.jpg", desc: "Senior cross-verifiers running real-time statistical audit pipelines with sub-pixel edge alignment." },
    { title: "JATS 1.3 Scientific STM Publishing Validation Desk", category: "Team", img: "img/xml-publishing-desk.jpg", desc: "PubMed Central schema compliance specialists converting medical and technical journal articles." },
    { title: "Rural Women Tech Empowerment Graduation 2026", category: "Events", img: "img/graduation-ceremony.jpg", desc: "Celebrating 1,500+ rural women placed into permanent full-time digital technology careers." }
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
    const img = document.getElementById('lightbox-img');
    const modal = document.getElementById('lightbox-modal');
    if (cat) cat.textContent = item.category;
    if (cap) cap.textContent = item.title;
    if (desc) desc.textContent = item.desc;
    if (img && item.img) {
        img.src = item.img;
        img.alt = item.title;
    }
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
    } else if (val === 'E-Publishing Services') {
        const el = document.getElementById('epub-fields');
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
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');

    // Disable button + show loading state
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    // Simulate submission (replace with real fetch() when backend ready)
    setTimeout(() => {
        // Reset form
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Claim 50-Record Free Benchmark →'; }

        // Swap form for success message inside the modal
        const formWrap = form.parentElement;
        if (formWrap) {
            formWrap.innerHTML = `
                <div class="text-center py-6 space-y-4">
                    <div class="w-14 h-14 mx-auto flex items-center justify-center">
                        <svg class="w-14 h-14" viewBox="0 0 52 52">
                            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900">Pilot Request Received!</h3>
                    <p class="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                        Our operations team will contact you within <strong>4 hours</strong> with your pilot onboarding details.
                    </p>
                    <button onclick="closePilotModal()" class="mt-2 px-5 py-2 rounded-lg bg-[#029146] text-white text-xs font-bold hover:bg-[#027a3a] transition-colors">
                        Close
                    </button>
                </div>`;
            if (window.lucide) lucide.createIcons();
        }
    }, 600);
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
    const wraps = document.querySelectorAll('.hero-rotating-service-wrap');
    if (!wraps.length) return;

    wraps.forEach(wrap => {
        const items = wrap.querySelectorAll('.hero-rotating-service-item');
        if (items.length <= 1) return;

        const isFullBlock = wrap.classList.contains('block') || wrap.classList.contains('w-full');
        let currentIndex = 0;
        const intervalTime = 3400; // 3.4s rotation cycle
        let rotateTimer = null;
        let itemWidths = [];

        // Accurate in-situ measurement of each item using computed font (for inline-block wraps)
        function measureAll() {
            if (isFullBlock) return;
            itemWidths = [];
            items.forEach((item, i) => {
                const prevPos = item.style.position;
                const prevDisplay = item.style.display;
                const prevVis = item.style.visibility;
                const prevTransform = item.style.transform;

                item.style.position = 'relative';
                item.style.display = 'inline-block';
                item.style.visibility = 'hidden';
                item.style.transform = 'none';

                const rect = item.getBoundingClientRect();
                const width = rect.width || item.offsetWidth || item.scrollWidth;
                itemWidths[i] = Math.ceil(width);

                item.style.position = prevPos;
                item.style.display = prevDisplay;
                item.style.visibility = prevVis;
                item.style.transform = prevTransform;
            });
        }

        function setWrapWidth(index) {
            if (isFullBlock) {
                wrap.style.width = '100%';
                return;
            }
            if (!itemWidths.length || itemWidths.every(w => w === 0)) {
                measureAll();
            }
            const w = itemWidths[index] || 0;
            if (w > 0) {
                wrap.style.width = w + 'px';
            }
        }

        // Measure on initial execution
        measureAll();
        setWrapWidth(0);

        // Re-measure accurately when fonts finish loading or window resizes
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                measureAll();
                setWrapWidth(currentIndex);
            });
        }

        window.addEventListener('resize', () => {
            measureAll();
            setWrapWidth(currentIndex);
        });

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

            // Smoothly animate wrap width so "into [word]" stays exactly centered
            setWrapWidth(nextIndex);

            // Cleanup exit state after animation ends
            setTimeout(() => {
                currentItem.classList.remove('exit');
            }, 680);

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
    });
}


/* ==========================================================================
   VilPower AI Assistant — Pure JS FAQ Chatbot
   ========================================================================== */

(function () {

    /* ── Knowledge Base ──────────────────────────────────────────────────── */
    const VP_KB = [
        {
            keys: ['hello','hi','hey','start','help','what can you do','who are you'],
            answer: 'Hi! I\'m the VilPower AI Assistant. I can answer questions about our services, pricing, quality standards, and how to get started.<br><br>What would you like to know?',
            quick: ['Our Services', 'Pricing', 'Free Pilot', 'Turnaround Time']
        },
        {
            keys: ['service','what do you do','offerings','capability','capabilities','solutions','provide'],
            answer: 'VilPower offers <strong>5 core enterprise data services:</strong><br><br>• <strong>AI Data Annotation</strong> — 2D/3D bounding boxes, LiDAR, segmentation<br>• <strong>XML & STM Publishing</strong> — JATS 1.3, BITS, PubMed Central<br>• <strong>E-Publishing Solutions</strong> — ePUB3, Fixed Layout, InDesign Typesetting, WCAG 2.1<br>• <strong>Commercial Lease Abstraction</strong> — 40+ clause extraction, Yardi/MRI<br>• <strong>Legal & Web Intelligence</strong> — entity disambiguation, patent mining',
            quick: ['AI Annotation', 'XML Publishing', 'E-Publishing', 'Lease Abstraction', 'Free Pilot']
        },
        {
            keys: ['epub','epublishing','e-publishing','ebook','ebooks','typesetting','indesign','fixed layout','reflowable','interactive ebook','accessible publishing','daisy','nimas','kindle','kf8','kfx'],
            answer: '<strong>E-Publishing & eBook Production</strong><br><br>• Reflowable & Fixed-Layout ePUB 3.2<br>• Amazon Kindle KF8 / KFX conversion<br>• Adobe InDesign typesetting & composition<br>• Interactive eBooks with read-aloud audio sync (SMIL)<br>• WCAG 2.1 AA & European Accessibility Act (EAA)<br>• Print-on-Demand (POD) press-ready PDFs<br><br>Accuracy: <strong>99.8% First-Pass ePUBCheck Pass Rate</strong>',
            quick: ['Free Pilot', 'Turnaround Time', 'Pricing']
        },
        {
            keys: ['ai annotation','computer vision','lidar','bounding box','segmentation','annotation','label','labeling','vision'],
            answer: '<strong>AI Data Annotation</strong><br><br>We handle:<br>• 2D/3D Bounding Boxes & Polygons<br>• LiDAR 3D Point Cloud Cuboids<br>• Semantic & Instance Segmentation<br>• Keypoint Rigging & Tracking<br>• NLP NER & RLHF<br><br>Clients: Autonomous mobility, robotics, healthcare imaging.<br>Accuracy: <strong>99.7% audited SLA</strong>',
            quick: ['Free Pilot', 'Turnaround Time', 'Pricing', 'ISO Certified?']
        },
        {
            keys: ['xml','stm','jats','publishing','pubmed','latex','bits','journal','article'],
            answer: '<strong>XML & STM Digital Publishing</strong><br><br>• JATS 1.3 & BITS 2.1 conversion<br>• LaTeX / MathML / EPUB3<br>• PubMed Central DTD — 100% pass rate<br>• Crossref metadata & DOI tagging<br><br>Serving scientific publishers, academic journals, and STM press clients globally.',
            quick: ['Free Pilot', 'Turnaround Time', 'Pricing']
        },
        {
            keys: ['lease','abstraction','reit','real estate','yardi','mri','cam','commercial'],
            answer: '<strong>Commercial Lease Abstraction</strong><br><br>• 40+ critical clause extraction<br>• CAM caps, rent escalations, options<br>• Yardi Voyager & MRI compatible<br>• REIT portfolio scale processing<br><br>TAT: 24–48 hours per lease batch.',
            quick: ['Free Pilot', 'Turnaround Time', 'Pricing']
        },
        {
            keys: ['legal','web intelligence','patent','entity','disambiguation','docket','kyc','corporate'],
            answer: '<strong>Legal & Web Data Intelligence</strong><br><br>• Patent claims extraction & mining<br>• Corporate entity disambiguation<br>• KYC & beneficial ownership verification<br>• AML/sanction list screening<br>• Cleanroom web data pipelines',
            quick: ['Free Pilot', 'Pricing', 'ISO Certified?']
        },
        {
            keys: ['price','pricing','cost','rate','how much','charge','fee','per record','per image','per frame'],
            answer: 'Our pricing is <strong>custom-quoted</strong> based on:<br><br>• Service type & annotation complexity<br>• Monthly volume (frames/records)<br>• Tooling requirements (Labelbox, CVAT, etc.)<br>• Turnaround time targets<br><br>Most clients find us <strong>40–50% more cost-effective</strong> than US/EU alternatives with superior accuracy.<br><br>Best way to start — claim a <strong>free 50-record pilot</strong> and we\'ll quote based on your actual dataset.',
            cta: { label: '🚀 Get Free Pilot', action: 'pilot', color: 'green' },
            quick: ['Free Pilot', 'Turnaround Time', 'Contact Team']
        },
        {
            keys: ['pilot','free pilot','trial','sample','benchmark','test','50 record','50-record','demo'],
            answer: '<strong>Free 50-Record Pilot</strong><br><br>Send us a 50-record sample — we process it <strong>free of charge</strong> and return it within 24h with a full QA accuracy audit report.<br><br>No commitment. No credit card. Just proof.',
            cta: { label: '🚀 Claim Free Pilot Now', action: 'pilot', color: 'green' },
            quick: ['Turnaround Time', 'ISO Certified?', 'Contact Team']
        },
        {
            keys: ['turnaround','tat','delivery','fast','speed','how long','timeline','time','hours','days'],
            answer: '<strong>Turnaround Times:</strong><br><br>• <strong>Free Pilot (50 records):</strong> &lt; 24 hours<br>• <strong>Standard batch:</strong> 24–72 hours<br>• <strong>Dedicated pod:</strong> Continuous delivery<br><br>We operate 6 days/week with overlap across IST / EST / GMT timezones.',
            quick: ['Free Pilot', 'Pricing', 'ISO Certified?']
        },
        {
            keys: ['iso','iso 27001','security','certified','compliance','nda','gdpr','hipaa','cleanroom','air gapped','air-gapped'],
            answer: '<strong>Security & Compliance:</strong><br><br>✅ ISO 27001 Certified infrastructure<br>✅ Air-gapped cleanroom facilities<br>✅ Zero personal device policy<br>✅ Biometric dual-factor access control<br>✅ Signed NDAs before project start<br>✅ GDPR & HIPAA-aligned workflows<br>✅ No data leaves our secure vault',
            quick: ['Free Pilot', 'Our Team', 'Contact Team']
        },
        {
            keys: ['accuracy','quality','sla','precision','99.7','error','rate','multi pass'],
            answer: '<strong>Quality Standards:</strong><br><br>• <strong>99.7% audited accuracy</strong> — guaranteed SLA<br>• 3-tier QA hierarchy (Annotator → QA → Senior Lead)<br>• Statistical sampling + 100% edge-case review<br>• Sub-pixel annotation calibration<br>• Hallucination rate: <strong>0.00%</strong> (audited)<br><br>157M+ records delivered flawlessly since 2011.',
            quick: ['Free Pilot', 'Pricing', 'ISO Certified?']
        },
        {
            keys: ['team','staff','workforce','people','employee','women','rural','tamil','india','bangalore'],
            answer: '<strong>Our Team:</strong><br><br>• <strong>1,500+ full-time engineers</strong> — Tamil Nadu, India<br>• <strong>95%+ rural women</strong> — permanent positions, not gig<br>• <strong>&lt; 3% annual turnover</strong> — deepest domain expertise<br>• 8-week paid tech academy before production<br>• Est. 2011 — 15+ years of operational excellence',
            quick: ['Free Pilot', 'Our Story', 'Contact Team']
        },
        {
            keys: ['about','story','history','founded','vilpower','company','mission','impact','social'],
            answer: 'VilPower was founded in <strong>2011 in Tamil Nadu, India</strong>.<br><br>Our mission: bring permanent high-growth tech careers to rural women while delivering world-class AI data operations to global enterprises.<br><br>We call it the <strong>Digital Banyan Tree</strong> — deep roots, wide canopy.',
            quick: ['Our Team', 'Free Pilot', 'ISO Certified?']
        },
        {
            keys: ['contact','email','call','talk','reach','phone','speak','human','agent','person'],
            answer: 'You can reach our team directly:<br><br>📧 <strong>support@vilpower.com</strong><br><br>Or submit your project scope and we\'ll respond within <strong>4 hours</strong> with a formal proposal.',
            cta: { label: '📋 Submit Project Scope', action: 'contact', color: '' },
            quick: ['Free Pilot', 'Pricing']
        },
        {
            keys: ['industry','industries','autonomous','mobility','healthcare','robotics','adas','medical','lidar','automotive'],
            answer: '<strong>Industries We Serve:</strong><br><br>🚗 Autonomous Mobility & ADAS<br>🔬 Healthcare & Life Sciences<br>📚 Scientific & STM Publishing<br>🏢 Commercial Real Estate / REITs<br>⚖️ LegalTech & Analytics<br>🤖 AI Labs & Research',
            quick: ['AI Annotation', 'Free Pilot', 'Pricing']
        },
    ];

    /* ── Default quick replies (shown on open) ──────────────────────────── */
    const VP_DEFAULT_QUICK = ['Our Services', 'Free Pilot', 'Pricing', 'ISO Certified?', 'Turnaround Time'];

    /* ── State ───────────────────────────────────────────────────────────── */
    let vpIsOpen       = false;
    let vpHasOpened    = false;
    let vpGreeted      = false;

    /* ── Toggle ──────────────────────────────────────────────────────────── */
    window.vpToggleChat = function () {
        vpIsOpen = !vpIsOpen;
        const win    = document.getElementById('vp-chat-window');
        const iconChat  = document.getElementById('vp-toggle-icon');
        const iconClose = document.getElementById('vp-toggle-icon-close');
        const badge  = document.getElementById('vp-unread-badge');

        if (vpIsOpen) {
            win.style.display = 'flex';
            // Re-trigger open animation
            win.style.animation = 'none';
            void win.offsetWidth;
            win.style.animation = '';
            iconChat.style.display  = 'none';
            iconClose.style.display = 'flex';
            if (badge) badge.style.display = 'none';
            if (!vpGreeted) {
                vpGreeted = true;
                vpBotMessage('👋 Hi! I\'m the <strong>VilPower AI Assistant</strong>.<br>Ask me about our services, pricing, quality standards, or how to get started.', VP_DEFAULT_QUICK, 400);
            }
            setTimeout(() => {
                const inp = document.getElementById('vp-input');
                if (inp) inp.focus();
            }, 350);
        } else {
            win.style.display = 'none';
            iconChat.style.display  = 'flex';
            iconClose.style.display = 'none';
        }
    };

    /* ── Send message ────────────────────────────────────────────────────── */
    window.vpSend = function (text) {
        const inp = document.getElementById('vp-input');
        const msg = (text || (inp ? inp.value.trim() : '')).trim();
        if (!msg) return;
        if (inp) inp.value = '';

        vpUserMessage(msg);
        vpClearQuickReplies();

        // Find best match
        const lower = msg.toLowerCase();
        let best = null;
        let bestScore = 0;
        VP_KB.forEach(entry => {
            let score = 0;
            entry.keys.forEach(k => {
                if (lower.includes(k)) score += k.split(' ').length;
            });
            if (score > bestScore) { bestScore = score; best = entry; }
        });

        // Show typing then answer
        vpShowTyping();
        setTimeout(() => {
            vpHideTyping();
            if (best && bestScore > 0) {
                vpBotMessage(best.answer, best.quick || [], 0, best.cta || null);
            } else {
                vpBotMessage(
                    'I\'m not sure about that — but our team can help directly.<br><br>📧 <strong>support@vilpower.com</strong><br><br>Or claim a free pilot and we\'ll scope your project.',
                    ['Free Pilot', 'Contact Team', 'Our Services'],
                    0
                );
            }
        }, 700 + Math.random() * 400);
    };

    /* ── Message renderers ───────────────────────────────────────────────── */
    function vpUserMessage(text) {
        const box = document.getElementById('vp-messages');
        if (!box) return;
        const div = document.createElement('div');
        div.className = 'vp-msg vp-user';
        div.innerHTML = `<div class="vp-bubble">${escHtml(text)}</div>`;
        box.appendChild(div);
        vpScrollBottom();
    }

    function vpBotMessage(html, quickReplies, delay, cta) {
        delay = delay || 0;
        setTimeout(() => {
            const box = document.getElementById('vp-messages');
            if (!box) return;
            const div = document.createElement('div');
            div.className = 'vp-msg vp-bot';

            let ctaHtml = '';
            if (cta) {
                const cls = cta.color === 'green' ? 'vp-cta-btn green' : 'vp-cta-btn';
                const action = cta.action === 'pilot'
                    ? `onclick="vpToggleChat();setTimeout(openPilotModal,200)"`
                    : `onclick="vpToggleChat();setTimeout(()=>window.location='contact.html',200)"`;
                ctaHtml = `<br><button class="${cls}" ${action}>${cta.label}</button>`;
            }

            div.innerHTML = `
                <div class="vp-msg-avatar"></div>
                <div class="vp-bubble">${html}${ctaHtml}</div>`;
            box.appendChild(div);
            vpScrollBottom();

            if (quickReplies && quickReplies.length) {
                vpShowQuickReplies(quickReplies);
            }
        }, delay);
    }

    /* ── Typing indicator ────────────────────────────────────────────────── */
    function vpShowTyping() {
        const box = document.getElementById('vp-messages');
        if (!box) return;
        const div = document.createElement('div');
        div.className = 'vp-msg vp-bot vp-typing';
        div.id = 'vp-typing-indicator';
        div.innerHTML = `
            <div class="vp-msg-avatar"></div>
            <div class="vp-bubble">
                <span class="vp-typing-dot"></span>
                <span class="vp-typing-dot"></span>
                <span class="vp-typing-dot"></span>
            </div>`;
        box.appendChild(div);
        vpScrollBottom();
    }
    function vpHideTyping() {
        const el = document.getElementById('vp-typing-indicator');
        if (el) el.remove();
    }

    /* ── Quick replies ───────────────────────────────────────────────────── */
    function vpShowQuickReplies(replies) {
        const box = document.getElementById('vp-quick-replies');
        if (!box) return;
        box.innerHTML = '';
        replies.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'vp-qr-btn';
            btn.textContent = r;
            btn.onclick = () => vpSend(r);
            box.appendChild(btn);
        });
    }
    function vpClearQuickReplies() {
        const box = document.getElementById('vp-quick-replies');
        if (box) box.innerHTML = '';
    }

    /* ── Helpers ─────────────────────────────────────────────────────────── */
    function vpScrollBottom() {
        const box = document.getElementById('vp-messages');
        if (box) setTimeout(() => { box.scrollTop = box.scrollHeight; }, 30);
    }
    function escHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    /* ── Show unread badge after 4s if not opened ────────────────────────── */
    setTimeout(() => {
        if (!vpIsOpen) {
            const badge = document.getElementById('vp-unread-badge');
            if (badge) badge.style.display = 'flex';
        }
    }, 4000);

})();

// ==========================================================================
// Reference Video Stacking Cards Deck Engine (Auto-Play & Interactive Transitions)
// Features VilPower's Real Enterprise Capabilities
// ==========================================================================
const vilpowerCapabilities = [
    {
        id: 'ingestion',
        badgeColor: '#eff4ff', // Soft Blue
        badgeHtml: '<span class="font-inter-tight font-black text-[11px] leading-tight text-[#1B45BD]">STAGE</span><span class="font-inter-tight font-bold text-[8px] text-[#1B45BD]">01</span>',
        title: 'Stage 01: Secure Data Intake',
        desc: 'Encrypted S3/API ingestion into air-gapped ISO 27001 server vaults with zero external USB permissions and strict biometric access control.',
        pillTag: 'Air-Gapped Sandbox',
        link: 'ai-data-annotation.html',
        bg: 'linear-gradient(135deg, #1B45BD 0%, #2546e8 100%)'
    },
    {
        id: 'preprocess',
        badgeColor: '#ecfdf5', // Mint Emerald
        badgeHtml: '<span class="font-inter-tight font-black text-[11px] leading-tight text-[#029146]">STAGE</span><span class="font-inter-tight font-bold text-[8px] text-[#029146]">02</span>',
        title: 'Stage 02: AI Model Pre-Labeling',
        desc: 'Auto-clustering, initial bounding proposals, and OCR parsing accelerate throughput by 3.8x with automated schema preflight before human verification.',
        pillTag: '3.8x Speed Multiplier',
        link: 'ai-data-annotation.html',
        bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    },
    {
        id: 'humanqa',
        badgeColor: '#fef3c7', // Soft Amber
        badgeHtml: '<span class="font-inter-tight font-black text-[11px] leading-tight text-amber-800">STAGE</span><span class="font-inter-tight font-bold text-[8px] text-amber-800">03</span>',
        title: 'Stage 03: Dual-Pass Human Review',
        desc: 'Full-time Tamil Nadu specialists perform sub-pixel calibration, edge correction, and paralegal clause auditing with zero multi-agent drift.',
        pillTag: '100% Dedicated Staff',
        link: 'ai-data-annotation.html',
        bg: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)'
    },
    {
        id: 'delivery',
        badgeColor: '#dcfce7', // Bright Emerald
        badgeHtml: '<span class="font-inter-tight font-black text-[11px] leading-tight text-emerald-800">STAGE</span><span class="font-inter-tight font-bold text-[8px] text-emerald-800">04</span>',
        title: 'Stage 04: 99.7% Audited Delivery',
        desc: 'Tier-3 quality signoff, automated XML DTD validation, and instant export into Yardi, MRI, CVAT, or client production pipelines.',
        pillTag: '99.7% SLA Certified',
        link: 'ai-data-annotation.html',
        bg: 'linear-gradient(135deg, #029146 0%, #047857 100%)'
    }
];

let activeCardIdx = 0;
let deckAutoTimer = null;
let isDeckHovered = false;

function renderZkDeck(targetIdx) {
    activeCardIdx = (targetIdx + vilpowerCapabilities.length) % vilpowerCapabilities.length;
    const peekIdx = (activeCardIdx + 1) % vilpowerCapabilities.length;

    const activeItem = vilpowerCapabilities[activeCardIdx];
    const peekItem = vilpowerCapabilities[peekIdx];

    const frontCard = document.getElementById('deck-card-front');
    const backCard = document.getElementById('deck-card-back');
    const tabBtns = document.querySelectorAll('.zk-cap-tab');

    // Update tab indicators
    tabBtns.forEach((btn, i) => {
        if (i === activeCardIdx) {
            btn.className = 'zk-cap-tab active relative overflow-hidden px-3.5 py-1.5 rounded-full bg-[#3559E0] text-white text-[11px] font-semibold transition-all shadow-sm';
        } else {
            btn.className = 'zk-cap-tab px-3.5 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200 text-[11px] font-semibold hover:bg-slate-50 transition-all';
        }
    });

    if (frontCard && backCard) {
        // Smooth slide-fade transition
        frontCard.style.opacity = '0';
        frontCard.style.transform = 'translateY(12px) scale(0.98)';

        setTimeout(() => {
            // Update Front Card (Active)
            frontCard.style.background = activeItem.bg;
            const frontTitle = frontCard.querySelector('.zk-card-title');
            const frontDesc = frontCard.querySelector('.zk-card-desc');
            const frontBadge = frontCard.querySelector('.zk-front-badge');
            const frontLink = frontCard.querySelector('.zk-front-link');
            const frontTag = frontCard.querySelector('.zk-front-tag');

            if (frontTitle) frontTitle.textContent = activeItem.title;
            if (frontDesc) frontDesc.innerHTML = '<span class="text-white/80 font-inter-tight text-sm leading-none mt-0.5">&gt;</span> <span>' + activeItem.desc + '</span>';
            if (frontBadge) {
                frontBadge.style.backgroundColor = activeItem.badgeColor;
                frontBadge.innerHTML = activeItem.badgeHtml;
            }
            if (frontLink) frontLink.setAttribute('href', activeItem.link);
            if (frontTag) frontTag.textContent = activeItem.pillTag;

            // Update Back Card (Peek)
            backCard.style.background = peekItem.bg;
            const backBadge = backCard.querySelector('.zk-back-badge');
            const backLink = backCard.querySelector('.zk-back-link');
            const backTitlePeek = backCard.querySelector('.zk-back-title-peek');

            if (backBadge) {
                backBadge.style.backgroundColor = peekItem.badgeColor;
                backBadge.innerHTML = peekItem.badgeHtml;
            }
            if (backLink) backLink.setAttribute('href', peekItem.link);
            if (backTitlePeek) backTitlePeek.textContent = peekItem.title;

            if (window.lucide && window.lucide.createIcons) {
                window.lucide.createIcons();
            }

            frontCard.style.opacity = '1';
            frontCard.style.transform = 'translateY(0) scale(1)';
        }, 180);
    }
}

function nextZkDeck() {
    renderZkDeck(activeCardIdx + 1);
}

function startDeckTimer() {
    stopDeckTimer();
    deckAutoTimer = setInterval(() => {
        if (!isDeckHovered) {
            nextZkDeck();
        }
    }, 4000);
}

function stopDeckTimer() {
    if (deckAutoTimer) {
        clearInterval(deckAutoTimer);
        deckAutoTimer = null;
    }
}

function initZkDeckAnimation() {
    const deckWrap = document.querySelector('.zk-card-deck-wrap');
    if (!deckWrap) return;

    deckWrap.addEventListener('mouseenter', () => { isDeckHovered = true; });
    deckWrap.addEventListener('mouseleave', () => { isDeckHovered = false; });

    // Initial render
    renderZkDeck(0);
    startDeckTimer();
}

window.renderZkDeck = renderZkDeck;
window.nextZkDeck = nextZkDeck;

document.addEventListener('DOMContentLoaded', () => {
    initZkDeckAnimation();
});


// The 4-Stage Precision Pipeline — Direct 1-to-1 Smooth Scroll Controller
function initPrecisionPipelineStack() {
    const section = document.getElementById('precision-pipeline');
    if (!section) return;

    const pinWrap = section.querySelector('.pipeline-pin-wrap');
    const cards = section.querySelectorAll('.pipeline-stack-card');
    if (!pinWrap || cards.length < 4) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper functions
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    // Smooth natural easing
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    let ticking = false;

    function update() {
        if (window.innerWidth < 1024 || window.innerHeight < 680 || prefersReducedMotion) {
            cards.forEach(card => {
                card.style.transform = '';
                card.style.opacity = '';
            });
            ticking = false;
            return;
        }

        const rect = pinWrap.getBoundingClientRect();
        const totalScroll = pinWrap.offsetHeight - window.innerHeight;
        if (totalScroll <= 0) {
            ticking = false;
            return;
        }

        // Section scroll progress from 0 (at entry) to 1 (at exit)
        const progress = clamp(-rect.top / totalScroll, 0, 1);

        // Card 01: Stationary at top: 0px
        cards[0].style.transform = 'translate3d(0, 0, 0)';
        cards[0].style.opacity = '1';

        // Stage 02: Rises smoothly from 140px below during progress 0.00 -> 0.33
        const t1 = clamp(progress / 0.33, 0, 1);
        const y1 = (1 - easeOutCubic(t1)) * 140;
        cards[1].style.transform = `translate3d(0, ${y1.toFixed(1)}px, 0)`;
        cards[1].style.opacity = String(clamp(t1 * 3, 0, 1));

        // Stage 03: Rises smoothly from 140px below during progress 0.33 -> 0.66
        const t2 = clamp((progress - 0.33) / 0.33, 0, 1);
        const y2 = (1 - easeOutCubic(t2)) * 140;
        cards[2].style.transform = `translate3d(0, ${y2.toFixed(1)}px, 0)`;
        cards[2].style.opacity = String(clamp(t2 * 3, 0, 1));

        // Stage 04: Rises smoothly from 140px below during progress 0.66 -> 0.96
        const t3 = clamp((progress - 0.66) / 0.30, 0, 1);
        const y3 = (1 - easeOutCubic(t3)) * 140;
        cards[3].style.transform = `translate3d(0, ${y3.toFixed(1)}px, 0)`;
        cards[3].style.opacity = String(clamp(t3 * 3, 0, 1));

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        update();
    });

    if (window.lucide) {
        lucide.createIcons();
    }

    // Initial render
    update();
}

// Global Page Preloader & Smooth Cascade Entrance (Nexsas SaaS Style)
function initPagePreloader() {
    // Immediately set page ready so on-load animations fire instantly without blocking preloader
    document.body.classList.add('page-ready');
    const existing = document.getElementById('page-preloader');
    if (existing) existing.remove();
}
