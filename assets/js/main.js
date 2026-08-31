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
    // Initialize Odometer counters
    initCounters();
});

// Scroll Reveal Intersection Observer
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
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
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

// Odometer / Count up animation for stats
function initCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
                const useCommas = el.getAttribute('data-use-commas') === 'true';
                const duration = 2000; // 2 seconds
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out quadratic
                    const easeProgress = progress * (2 - progress);
                    const currentVal = easeProgress * target;
                    
                    let formattedVal = currentVal.toFixed(decimals);
                    if (useCommas) {
                        formattedVal = Math.floor(currentVal).toLocaleString();
                    }
                    
                    el.textContent = prefix + formattedVal + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        let finalVal = target.toFixed(decimals);
                        if (useCommas) {
                            finalVal = Math.floor(target).toLocaleString();
                        }
                        el.textContent = prefix + finalVal + suffix;
                    }
                }

                requestAnimationFrame(update);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => observer.observe(counter));
}
