/* ======================================
   MRIGNAINI — WEBSITE INTERACTIONS
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            initScrollAnimations();
        }, 2200);
    });

    // Fallback: hide preloader after 4s max
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        initScrollAnimations();
    }, 4000);

    // ---- NAVBAR ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- SCROLL REVEAL ANIMATIONS ----
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.anim-reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ---- COUNTER ANIMATION ----
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    const duration = 2000;
                    const startTime = performance.now();

                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out quart
                        const eased = 1 - Math.pow(1 - progress, 4);
                        el.textContent = Math.floor(eased * target);

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = target;
                        }
                    }

                    requestAnimationFrame(update);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => counterObserver.observe(c));
    }

    animateCounters();

    // ---- VIDEO SHOWCASE PLAY/PAUSE ----
    const showcaseVideo = document.getElementById('showcaseVideo');
    const videoPlayBtn = document.getElementById('videoPlayBtn');

    if (showcaseVideo && videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            if (showcaseVideo.paused) {
                showcaseVideo.play();
                showcaseVideo.muted = false;
                videoPlayBtn.classList.add('hidden');
            } else {
                showcaseVideo.pause();
                showcaseVideo.muted = true;
                videoPlayBtn.classList.remove('hidden');
            }
        });

        showcaseVideo.addEventListener('click', () => {
            if (!showcaseVideo.paused) {
                showcaseVideo.pause();
                showcaseVideo.muted = true;
                videoPlayBtn.classList.remove('hidden');
            }
        });

        // Auto-play when in viewport
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showcaseVideo.play();
                } else {
                    showcaseVideo.pause();
                    showcaseVideo.muted = true;
                    videoPlayBtn.classList.remove('hidden');
                }
            });
        }, { threshold: 0.3 });

        videoObserver.observe(showcaseVideo);
    }

    // ---- HERO VIDEO PARALLAX ----
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight;
            if (scrollY < heroHeight) {
                const translateY = scrollY * 0.3;
                heroVideo.style.transform = `translateY(${translateY}px) scale(1.05)`;
            }
        }, { passive: true });
    }

    // ---- TESTIMONIAL CAROUSEL ----
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        const next = (currentIndex + 1) % cards.length;
        showTestimonial(next);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showTestimonial(index);
            resetAutoplay();
        });
    });

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

    autoplayInterval = setInterval(nextTestimonial, 5000);

    // ---- CONTACT FORM ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, var(--clr-emerald), var(--clr-sage))';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ---- MAGNETIC HOVER EFFECT ON BUTTONS ----
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ---- GALLERY TILT EFFECT ----
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 8;
            const rotateY = (x - 0.5) * 8;
            item.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                item.style.transition = '';
            }, 500);
        });
    });

    // ---- NAVBAR ACTIVE LINK HIGHLIGHTING ----
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--clr-gold)';
            }
        });
    }, { passive: true });

});
