document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. Navigation Actions & Mobile Menu
    // -----------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll styling toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking on scroll
        let currentSectionId = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('open');
        // Burger line transformations
        const lines = mobileToggle.querySelectorAll('.line');
        if (navMenu.classList.contains('active')) {
            lines[0].style.transform = 'translateY(8px) rotate(45deg)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });

    // Close menu on click of nav-link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('open');
            const lines = mobileToggle.querySelectorAll('.line');
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        });
    });

    // -----------------------------------------------------------------
    // 2. Interactive Canvas Particle Background
    // -----------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    // Responsive Canvas resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle blueprint
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
            this.color = Math.random() > 0.5 ? 'hsl(262, 83%, 60%)' : 'hsl(327, 85%, 55%)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce on boundary bounds
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

            // Interactive mouse repeller
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    this.x += directionX * force * 2;
                    this.y += directionY * force * 2;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Initialize particles network
    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 120);
        for (let i = 0; i < numberOfParticles; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particlesArray.push(new Particle(x, y));
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Draw connection lines
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    // Gradual fade based on distance
                    const opacity = (1 - (distance / 130)) * 0.15;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // -----------------------------------------------------------------
    // 3. Typewriter Effect
    // -----------------------------------------------------------------
    const typewriter = document.getElementById('typewriter');
    const words = ["high-performance web apps", "creative visual designs", "robust API architectures", "scalable cloud systems"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriter.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1800; // Delay before deleting
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Small delay before typing next word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();


    // -----------------------------------------------------------------
    // 4. Scroll Reveal & Intersection Observer
    // -----------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Trigger Skill bars growth when skills section is visible
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // -----------------------------------------------------------------
    // 5. 3D Card Tilt Effect
    // -----------------------------------------------------------------
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Mouse coordinates relative to card center
            const mouseX = e.clientX - cardRect.left - cardWidth / 2;
            const mouseY = e.clientY - cardRect.top - cardHeight / 2;
            
            // Maximum tilt angle (degrees)
            const maxTilt = 10;
            const rotateX = (-mouseY / (cardHeight / 2)) * maxTilt;
            const rotateY = (mouseX / (cardWidth / 2)) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });


    // -----------------------------------------------------------------
    // 6. Contact Form Handler (Mocked)
    // -----------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
            
            // Button loading feedback state
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulating API network call
            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = '⚡ Message sent successfully! Thank you.';
                
                // Clear inputs
                contactForm.reset();
                
                // Reset button
                submitBtn.querySelector('.btn-text').textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Clear alert after some time
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1200);
        });
    }
});
