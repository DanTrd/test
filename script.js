// Cryptocurrency symbols mapping
const cryptoSymbols = {
    bitcoin: '₿',
    ethereum: 'Ξ',
    solana: '◎',
    bnb: 'BNB',
    cardano: '₳',
    polygon: '⬟',
    // Using geometric shapes for other cryptos
    white: '✦',
    gray: '✧',
    white2: 'Ł',
    gray2: '₮'
};

// Symbol classes for styling
const symbolClasses = ['bitcoin', 'ethereum', 'solana', 'bnb', 'cardano', 'polygon', 'white', 'gray', 'white', 'gray'];

let stars = [];
let scrollPosition = 0;
let isScrolling = false;
let stopScrollThreshold = 0; // Will be calculated based on solutions section position

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Randomly select a symbol
    const symbolKeys = Object.keys(cryptoSymbols);
    const randomSymbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
    star.textContent = cryptoSymbols[randomSymbol];
    
    // Add class for styling
    const classIndex = symbolKeys.indexOf(randomSymbol);
    if (classIndex < symbolClasses.length) {
        star.classList.add(symbolClasses[classIndex] || 'white');
    }
    
    // Random horizontal position
    const leftPosition = Math.random() * 100;
    star.style.left = `${leftPosition}%`;
    
    // Random animation duration (8-15 seconds)
    const baseDuration = 8 + Math.random() * 7;
    star.dataset.baseDuration = baseDuration;
    star.style.animationDuration = `${baseDuration}s`;
    
    // Random delay
    star.style.animationDelay = `${Math.random() * 2}s`;
    
    // Random size variation
    const size = 18 + Math.random() * 12;
    star.style.fontSize = `${size}px`;
    
    return star;
}

function updateStarSpeed() {
    // Calculate threshold based on contact section (bottom block) position
    const contactSection = document.getElementById('contact-section');
    if (contactSection && stopScrollThreshold === 0) {
        const rect = contactSection.getBoundingClientRect();
        stopScrollThreshold = window.pageYOffset + rect.top;
    }
    
    if (stopScrollThreshold === 0) return;
    
    const scrollPercent = Math.min(scrollPosition / stopScrollThreshold, 1);
    const speedMultiplier = 1 - (scrollPercent * 0.9); // Slow down to 10% speed, then stop
    
    stars.forEach(star => {
        if (star.parentNode) {
            const baseDuration = parseFloat(star.dataset.baseDuration);
            const newDuration = baseDuration / speedMultiplier;
            
            if (speedMultiplier > 0.1) {
                star.style.animationDuration = `${newDuration}s`;
                star.style.animationPlayState = 'running';
            } else {
                star.style.animationPlayState = 'paused';
            }
        }
    });
}

function handleScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    updateStarSpeed();
    
    // Throttle scroll events
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            isScrolling = false;
        });
    }
}

function initStars() {
    const container = document.getElementById('starsContainer');
    const starsCount = 30; // Number of stars visible at once
    
    // Create initial stars
    for (let i = 0; i < starsCount; i++) {
        const star = createStar();
        container.appendChild(star);
        stars.push(star);
        
        // Set random starting position
        star.style.top = `${Math.random() * 100}%`;
    }
    
    // Continuously add new stars (only when not scrolled too far)
    setInterval(() => {
        if (scrollPosition < stopScrollThreshold) {
            const star = createStar();
            container.appendChild(star);
            stars.push(star);
            
            // Remove stars that have finished animating (after animation completes)
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                    stars = stars.filter(s => s !== star);
                }
            }, (parseFloat(star.style.animationDuration) + parseFloat(star.style.animationDelay || 0)) * 1000);
        }
    }, 500); // Add a new star every 500ms
}

// Smooth scroll behavior
function smoothScroll() {
    // Add smooth scroll to all anchor links if any
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards, list items and sections
    document.querySelectorAll('.card, .team-card, .solution-card, .section-title, .neon-list li').forEach(el => {
        observer.observe(el);
    });
}

// Navigation active state management
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    smoothScroll();
    initScrollAnimations();
    
    // Handle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                updateActiveNav();
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial scroll position check
    handleScroll();
    updateActiveNav();
    handleNavbarScroll();
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
