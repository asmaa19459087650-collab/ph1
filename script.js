// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Mobile Nav Overlay =====
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

// ===== Mobile Menu Toggle =====
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

overlay.addEventListener('click', () => {
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // Add a fun rotation to the button
    themeToggle.style.transform = 'translateY(-50%) rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'translateY(-50%)';
    }, 500);
});

// ===== Scroll Events =====
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Progress bar
    progressBar.style.width = (scrollY / docHeight * 100) + '%';

    // Back to top
    backToTop.classList.toggle('visible', scrollY > 400);

    // Active nav link
    updateActiveNav();

    // Scroll animations
    animateOnScroll();

    // Counter animation
    animateCounters();

    // Parallax effect for hero
    parallaxHero(scrollY);
}

// ===== Active Navigation =====
function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ===== Scroll Animations =====
function animateOnScroll() {
    const animClasses = ['.animate-on-scroll', '.animate-slide-right', '.animate-slide-left', '.animate-scale', '.animate-rotate'];
    animClasses.forEach(cls => {
        document.querySelectorAll(cls + ':not(.animated)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('animated');
            }
        });
    });
}

// ===== Counter Animation =====
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const rect = statNumbers[0].getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    countersAnimated = true;

    statNumbers.forEach(num => {
        const target = parseInt(num.dataset.count);
        const duration = 2500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // quartic ease out
            num.textContent = Math.floor(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                num.textContent = target;
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Parallax Hero =====
function parallaxHero(scrollY) {
    const hero = document.querySelector('.hero-content');
    if (hero && scrollY < window.innerHeight) {
        const speed = scrollY * 0.3;
        hero.style.transform = `translateY(${speed}px)`;
        hero.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
    }
}

// ===== Back to Top =====
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Accordion =====
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

        if (!isActive) item.classList.add('active');
    });
});

// ===== Particles =====
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#0ea5e9', '#8b5cf6', '#6366f1', '#38bdf8', '#10b981', '#f59e0b'];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (5 + Math.random() * 8) + 's';

        const size = 2 + Math.random() * 6;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.opacity = (0.15 + Math.random() * 0.4);

        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'square') particle.style.borderRadius = '2px';
        else if (shape === 'triangle') {
            particle.style.borderRadius = '0';
            particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        }

        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

// ===== Tilt Effect for Cards =====
function initTiltEffect() {
    document.querySelectorAll('.type-card, .benefit-card, .guideline-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ===== Typing Effect for Hero =====
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let i = 0;
    const speed = 25;

    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a delay
    setTimeout(type, 800);
}

// ===== Stagger Animation for Grids =====
function applyStaggerClasses() {
    const grids = ['.types-grid', '.benefits-grid', '.guidelines-grid', '.about-grid'];
    grids.forEach(gridSelector => {
        const grid = document.querySelector(gridSelector);
        if (!grid) return;
        const children = grid.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.add('stagger-' + ((i % 8) + 1));
        }
    });
}

// ===== Smooth Reveal for Sections =====
function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-header').forEach(el => {
        observer.observe(el);
    });
}

// ===== Number Increment on Hover =====
function initHoverCounters() {
    document.querySelectorAll('.type-card').forEach(card => {
        const items = card.querySelectorAll('.type-list li');
        card.addEventListener('mouseenter', () => {
            items.forEach((item, i) => {
                item.style.transitionDelay = (i * 0.03) + 's';
                item.style.transform = 'translateX(-4px)';
                item.style.opacity = '1';
            });
        });
        card.addEventListener('mouseleave', () => {
            items.forEach(item => {
                item.style.transitionDelay = '0s';
                item.style.transform = '';
            });
        });
    });
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Success animation
        btn.innerHTML = '<i class="fas fa-check"></i> <span>تم الإرسال بنجاح!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.style.transform = 'scale(1.05)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.transform = '';
            contactForm.reset();
        }, 3000);
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Magnetic Button Effect =====
function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.setProperty('--mx', x * 0.15 + 'px');
            btn.style.setProperty('--my', y * 0.15 + 'px');
            btn.style.transform = `translate(var(--mx), var(--my)) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    applyStaggerClasses();
    initTiltEffect();
    initTypingEffect();
    initIntersectionObserver();
    initHoverCounters();
    initMagneticButtons();
    animateOnScroll();
    animateCounters();

    // Open first accordion item
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion) firstAccordion.classList.add('active');

    // Add ripple class to all buttons
    document.querySelectorAll('.btn').forEach(btn => btn.classList.add('ripple'));
});
