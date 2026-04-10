/* ======================================
   MRIGNAINI — MOTION-LED INTERACTIONS
   "Playful Heritage x Graphic Editorial x Motion"
   Enhanced with scroll-driven animations
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- PRELOADER ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            document.body.style.overflow = '';
            document.body.classList.add('page-ready');
            initScrollAnimations();
            initStaggeredReveals();
            initScrollRevealSystem();
        }, 2200);
    });

    // Fallback timeout
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        document.body.classList.add('page-ready');
        initScrollAnimations();
        initStaggeredReveals();
        initScrollRevealSystem();
    }, 4000);

    // ---- CURSOR TRAIL ----
    if (window.matchMedia('(hover: hover)').matches) {
        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);
        let trailX = 0, trailY = 0, currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            trailX = e.clientX;
            trailY = e.clientY;
        });

        function updateTrail() {
            currentX += (trailX - currentX) * 0.15;
            currentY += (trailY - currentY) * 0.15;
            cursorTrail.style.transform = `translate(${currentX - 12}px, ${currentY - 12}px)`;
            requestAnimationFrame(updateTrail);
        }
        updateTrail();
    }

    // ---- NAVBAR ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

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

    // ---- ENHANCED SCROLL REVEAL SYSTEM ----
    // data-scroll="fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "slide-up"
    // data-scroll-delay="0.2" (seconds)
    // data-scroll-duration="0.8" (seconds)
    function initScrollRevealSystem() {
        const scrollElements = document.querySelectorAll('[data-scroll]');
        
        if (scrollElements.length === 0) return;

        const styleMap = {
            'fade-up': { from: 'opacity:0;transform:translateY(50px)', to: 'opacity:1;transform:translateY(0)' },
            'fade-down': { from: 'opacity:0;transform:translateY(-50px)', to: 'opacity:1;transform:translateY(0)' },
            'fade-left': { from: 'opacity:0;transform:translateX(-50px)', to: 'opacity:1;transform:translateX(0)' },
            'fade-right': { from: 'opacity:0;transform:translateX(50px)', to: 'opacity:1;transform:translateX(0)' },
            'scale': { from: 'opacity:0;transform:scale(0.85)', to: 'opacity:1;transform:scale(1)' },
            'slide-up': { from: 'opacity:0;transform:translateY(30px)', to: 'opacity:1;transform:translateY(0)' },
        };

        scrollElements.forEach(el => {
            const type = el.dataset.scroll || 'fade-up';
            const delay = parseFloat(el.dataset.scrollDelay) || 0;
            const duration = parseFloat(el.dataset.scrollDuration) || 0.8;
            const style = styleMap[type] || styleMap['fade-up'];
            
            el.style.cssText += `;${style.from};transition:all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s;will-change:transform,opacity;`;
        });

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const type = el.dataset.scroll || 'fade-up';
                    const style = styleMap[type] || styleMap['fade-up'];
                    
                    // Apply the "to" state
                    const toProps = style.to.split(';');
                    toProps.forEach(prop => {
                        if (prop.trim()) {
                            const [key, value] = prop.split(':');
                            el.style[key.trim()] = value.trim();
                        }
                    });
                    
                    scrollObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        scrollElements.forEach(el => scrollObserver.observe(el));
    }

    // ---- STAGGERED REVEAL SYSTEM ----
    function initStaggeredReveals() {
        document.querySelectorAll('.collections-grid, .process-timeline, .gallery-grid, .story-stats').forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, i) => {
                if (!child.classList.contains('timeline-line')) {
                    child.style.transitionDelay = `${i * 0.12}s`;
                }
            });
        });
    }

    // ---- SCROLL REVEAL (LEGACY .anim-reveal) ----
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
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
        initScrollParallax();
    }

    // ---- SCROLL-DRIVEN PARALLAX ----
    function initScrollParallax() {
        const parallaxSections = document.querySelectorAll('.story-image-frame, .video-frame');
        
        const parallaxObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.1 });

        parallaxSections.forEach(el => parallaxObserver.observe(el));
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
                const scale = 1.05 + scrollY * 0.0002;
                heroVideo.style.transform = `translateY(${translateY}px) scale(${scale})`;
                
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    const opacity = 1 - (scrollY / heroHeight) * 1.5;
                    const translateContent = scrollY * 0.5;
                    heroContent.style.opacity = Math.max(0, opacity);
                    heroContent.style.transform = `translateY(${translateContent}px)`;
                }
            }
        }, { passive: true });
    }

    // ---- TESTIMONIAL CAROUSEL ----
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoplayInterval;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        if (testimonialCards[index]) testimonialCards[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        const next = (currentIndex + 1) % testimonialCards.length;
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
    if (testimonialCards.length > 0) {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }

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
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });

    // ---- GALLERY TILT EFFECT ----
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 12;
            const rotateY = (x - 0.5) * 12;
            item.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            item.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => { item.style.transition = ''; }, 600);
        });
    });

    // ---- COLLECTION CARD 3D TILT ----
    document.querySelectorAll('.collection-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 8;
            const rotateY = (x - 0.5) * 8;
            const glowX = x * 100;
            const glowY = y * 100;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`;
            card.style.transition = 'none';
            card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(212,160,17,0.06), transparent 60%), white`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.background = '';
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });

    // ---- PARALLAX FLOATING MOTIFS ----
    const motifs = document.querySelectorAll('.section-motif, .hero-motif, .floating-petal');
    let ticking = false;
    
    function updateMotifPositions() {
        const scrollY = window.scrollY;
        const time = Date.now() * 0.001;
        
        motifs.forEach((motif, i) => {
            const speed = 0.04 + (i * 0.015);
            const yOffset = scrollY * speed;
            const xWobble = Math.sin(time * 0.8 + i * 1.5) * 12;
            const yWobble = Math.cos(time * 0.6 + i * 2) * 8;
            const rotation = Math.sin(time * 0.4 + i) * 10;
            const scale = 1 + Math.sin(time * 0.3 + i) * 0.05;
            motif.style.transform = `translateY(${-yOffset + yWobble}px) translateX(${xWobble}px) rotate(${rotation}deg) scale(${scale})`;
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateMotifPositions);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Idle float animation
    function idleFloat() {
        updateMotifPositions();
        requestAnimationFrame(idleFloat);
    }
    idleFloat();

    // ---- MARQUEE SPEED BOOST ON HOVER ----
    const marquee = document.querySelector('.marquee-track');
    if (marquee) {
        const marqueeDiv = document.querySelector('.marquee-divider');
        marqueeDiv.addEventListener('mouseenter', () => {
            marquee.style.animationDuration = '10s';
        });
        marqueeDiv.addEventListener('mouseleave', () => {
            marquee.style.animationDuration = '30s';
        });
    }

    // ---- SCROLL PROGRESS BAR ----
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });

    // ---- SECTION ENTRANCE ANIMATIONS ----
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('section, .marquee-divider').forEach(section => {
        sectionObserver.observe(section);
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
                link.style.color = 'var(--clr-mustard)';
            }
        });
    }, { passive: true });

    // ---- HERO TITLE CHARACTER ANIMATION ----
    const heroTitleLine = document.querySelector('.hero-title-line');
    if (heroTitleLine) {
        const text = heroTitleLine.textContent;
        heroTitleLine.innerHTML = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'hero-char';
            span.style.animationDelay = `${0.3 + i * 0.06}s`;
            heroTitleLine.appendChild(span);
        });
    }

    // ---- SMOOTH HOVER STATE FOR INTERACTIVE ELEMENTS ----
    document.querySelectorAll('.nav-link, .social-link, .dropdown-item, .footer-links a').forEach(el => {
        el.style.transition = el.style.transition 
            ? el.style.transition + ', transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    // ---- ONE-TIME COUPON POPUP ----
    // Show ₹200 off welcome popup only once per session
    if (!sessionStorage.getItem('mrignaini_popup_shown')) {
        sessionStorage.setItem('mrignaini_popup_shown', '1');
        
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'coupon-popup-overlay';
            overlay.innerHTML = `
                <div class="coupon-popup">
                    <button class="coupon-popup-close" aria-label="Close">&times;</button>
                    <div class="coupon-popup-emoji">🎁</div>
                    <h3>Welcome to Mrignaini!</h3>
                    <p>Enter this code at checkout for <strong>₹200 off</strong> your first order</p>
                    <div class="coupon-popup-code">MRIG200</div>
                    <div class="coupon-popup-hint">Use at checkout • Min order ₹999</div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Close handlers
            overlay.querySelector('.coupon-popup-close').addEventListener('click', () => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 300);
                }
            });
        }, 3000); // Show after 3 seconds
    }

});
