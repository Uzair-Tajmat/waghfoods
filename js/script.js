// Kitchen Express Hakka Noodles - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initHeaderScroll();
    initProductCards();
    initMarquee();
    initCounterAnimation();
    initSmoothScroll();
    initProductFilter();
    initTestimonialSlider();
    initParallax();
    initGalleryLightbox();
});

// ==================== NAVIGATION ====================
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ==================== HEADER SCROLL EFFECT ====================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation delay for grid items
                const parent = entry.target.parentElement;
                if (parent && (parent.classList.contains('features-grid') ||
                               parent.classList.contains('products-grid') ||
                               parent.classList.contains('recipes-grid') ||
                               parent.classList.contains('values-grid') ||
                               parent.classList.contains('gallery-grid'))) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));

    // Auto-add fade-in class to cards
    const cards = document.querySelectorAll('.feature-card, .product-card, .recipe-card, .value-card, .gallery-item');
    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
}

// ==================== PRODUCT CARDS HOVER EFFECTS ====================
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add tilt effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// ==================== MARQUEE ANIMATION ====================
function initMarquee() {
    const marquee = document.querySelector('.marquee-content');
    if (marquee) {
        // Clone content for seamless loop
        const content = marquee.innerHTML;
        marquee.innerHTML = content + content;

        // Pause on hover
        marquee.addEventListener('mouseenter', () => {
            marquee.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('mouseleave', () => {
            marquee.style.animationPlayState = 'running';
        });
    }
}

// ==================== COUNTER ANIMATION ====================
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== PRODUCT FILTER ====================
function initProductFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            products.forEach(product => {
                const category = product.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// ==================== TESTIMONIAL SLIDER ====================
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const testimonials = slider.querySelectorAll('.testimonial-card');
    if (testimonials.length <= 1) return;

    let currentIndex = 0;

    // Hide all except first
    testimonials.forEach((t, i) => {
        if (i !== 0) t.style.display = 'none';
    });

    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonial-dots';
    dotsContainer.style.cssText = 'display: flex; justify-content: center; gap: 10px; margin-top: 30px;';

    testimonials.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background: ${i === 0 ? '#d4a853' : '#ddd'};
            cursor: pointer;
            transition: 0.3s ease;
        `;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    slider.appendChild(dotsContainer);

    function goToSlide(index) {
        testimonials[currentIndex].style.display = 'none';
        testimonials[index].style.display = 'block';
        testimonials[index].style.animation = 'fadeInUp 0.5s ease';

        const dots = dotsContainer.querySelectorAll('.dot');
        dots[currentIndex].style.background = '#ddd';
        dots[index].style.background = '#d4a853';

        currentIndex = index;
    }

    // Auto-advance
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        goToSlide(nextIndex);
    }, 5000);
}

// ==================== PARALLAX EFFECT ====================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ==================== GALLERY LIGHTBOX ====================
function initGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');

    const images = [];
    galleryItems.forEach((item) => {
        const img = item.querySelector('img');
        if (img) images.push(img.src);
    });

    let currentIndex = 0;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });
}

// ==================== CURSOR FOLLOWER (Optional Enhancement) ====================
function initCursorFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #d4a853;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Grow on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .recipe-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = '#c62828';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.borderColor = '#d4a853';
        });
    });
}

// ==================== TYPING EFFECT ====================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ==================== IMAGE LAZY LOADING ====================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==================== FLOATING ACTION BUTTON ====================
function initFloatingButton() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '&#8593;';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #c62828;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'scale(1.1)';
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'scale(1)';
    });
}

// Initialize floating button
document.addEventListener('DOMContentLoaded', initFloatingButton);

// ==================== RIPPLE EFFECT FOR BUTTONS ====================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation to styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize ripple effect
document.addEventListener('DOMContentLoaded', initRippleEffect);

// ==================== PRELOADER ====================
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        .preloader-content {
            text-align: center;
            color: #d4a853;
        }
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(212, 168, 83, 0.3);
            border-top-color: #d4a853;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.prepend(preloader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 500);
    });
}

// Initialize preloader immediately
initPreloader();
