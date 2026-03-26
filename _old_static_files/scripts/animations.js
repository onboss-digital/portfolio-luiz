// Animation system for the portfolio website

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-card')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all sections and animated elements
    const elementsToAnimate = document.querySelectorAll('section, .skill-card, .project-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Skill bar animation
function animateSkillBar(skillCard) {
    const skillBar = skillCard.querySelector('.skill-bar');
    if (skillBar) {
        const width = skillBar.getAttribute('data-width');
        setTimeout(() => {
            skillBar.style.width = width + '%';
        }, 200);
    }
}

// Hero canvas animation
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particles system
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#3B82F6';
            ctx.fill();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections between nearby particles
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        window.removeEventListener('resize', resizeCanvas);
    };
}

// Testimonials carousel
function initTestimonialsCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    let carouselInterval;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 5000);
    }
    
    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    
    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopCarousel();
            startCarousel(); // Restart timer
        });
    });
    
    // Pause on hover
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
    }
    
    // Start the carousel
    startCarousel();
    
    return stopCarousel;
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.getElementById('intro');
        
        if (hero) {
            const parallaxElements = hero.querySelectorAll('.container > div');
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });
}

// Initialize all animations
function initAnimations() {
    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .animation-delay-200 {
            animation-delay: 0.2s;
            animation-fill-mode: both;
        }
        
        .animation-delay-400 {
            animation-delay: 0.4s;
            animation-fill-mode: both;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize all animation systems
    initScrollAnimations();
    initSmoothScrolling();
    initParallaxEffect();
    
    // Initialize hero canvas animation
    const cleanupCanvas = initHeroCanvas();
    
    // Initialize testimonials carousel
    const stopCarousel = initTestimonialsCarousel();
    
    // Return cleanup function
    return () => {
        if (cleanupCanvas) cleanupCanvas();
        if (stopCarousel) stopCarousel();
    };
}

// Export for use in other scripts
window.initAnimations = initAnimations;
