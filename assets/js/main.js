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
});

// Desktop Nav Dropdown Controller — prevents stuck focus, double-activation, and overlapping panels
function initDesktopDropdowns() {
    const dropdownContainers = document.querySelectorAll('.desktop-nav .has-dropdown');
    if (!dropdownContainers.length) return;

    // Mark wide mega panels so CSS can anchor them to nav-left (prevents right-overflow on pages with fewer nav CTAs)
    dropdownContainers.forEach(container => {
        const panel = container.querySelector('.dropdown-menu-panel, .mega-menu-panel');
        if (panel && (panel.className.includes('w-[880px]') || panel.className.includes('w-[920px]'))) {
            panel.classList.add('mega-anchored');
        }
    });

    dropdownContainers.forEach(container => {
        const btn = container.querySelector('.nav-item-btn');

        // On mouse enter, close other dropdowns
        container.addEventListener('mouseenter', () => {
            dropdownContainers.forEach(other => {
                if (other !== container) {
                    other.classList.remove('is-open');
                    const otherBtn = other.querySelector('.nav-item-btn');
                    if (otherBtn && document.activeElement === otherBtn) {
                        otherBtn.blur();
                    }
                }
            });
        });

        // Mouse leave clears is-open state
        container.addEventListener('mouseleave', () => {
            container.classList.remove('is-open');
            if (btn && document.activeElement === btn) {
                btn.blur();
            }
        });

        // Toggle on click (for touch / keyboard)
        if (btn) {
            btn.addEventListener('click', (e) => {
                const isCurrentlyOpen = container.classList.contains('is-open');

                // Close all others first
                dropdownContainers.forEach(other => {
                    other.classList.remove('is-open');
                    const otherBtn = other.querySelector('.nav-item-btn');
                    if (otherBtn) otherBtn.blur();
                });

                if (!isCurrentlyOpen) {
                    container.classList.add('is-open');
                } else {
                    btn.blur();
                }
            });
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-nav .has-dropdown')) {
            dropdownContainers.forEach(c => {
                c.classList.remove('is-open');
                const b = c.querySelector('.nav-item-btn');
                if (b && document.activeElement === b) b.blur();
            });
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownContainers.forEach(c => {
                c.classList.remove('is-open');
                const b = c.querySelector('.nav-item-btn');
                if (b) b.blur();
            });
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
            answer: 'VilPower offers <strong>4 core enterprise data services:</strong><br><br>• <strong>AI Data Annotation</strong> — 2D/3D bounding boxes, LiDAR, segmentation<br>• <strong>XML & STM Publishing</strong> — JATS 1.3, BITS, PubMed Central<br>• <strong>Commercial Lease Abstraction</strong> — 40+ clause extraction, Yardi/MRI<br>• <strong>Legal & Web Intelligence</strong> — entity disambiguation, patent mining',
            quick: ['AI Annotation', 'XML Publishing', 'Lease Abstraction', 'Free Pilot']
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
