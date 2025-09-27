// Create floating particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling for navigation links
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

// Scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Header background on scroll
function updateHeader() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.8)';
    }
}

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && message) {
                // Simulate form submission
                const button = this.querySelector('.cta-button');
                const originalText = button.textContent;
                button.textContent = 'Sending...';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.textContent = 'Message Sent!';
                    this.reset();
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                    }, 2000);
                }, 1000);
            }
        });
    }
});

// Typing animation for subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Add click ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = event.clientX - button.offsetLeft - radius + 'px';
    circle.style.top = event.clientY - button.offsetTop - radius + 'px';
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Initialize animations and event listeners
window.addEventListener('load', () => {
    createParticles();
    
    // Start typing animation after page load
    setTimeout(() => {
        const subtitle = document.querySelector('.hero .subtitle');
        if (subtitle) {
            typeWriter(subtitle, 'Computer Science Student & Full-Stack Developer', 50);
        }
    }, 1000);
    
    // Add ripple effect to buttons
    document.querySelectorAll('.cta-button, .project-link').forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Add hover effects to cards
    document.querySelectorAll('.card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Event listeners for scroll effects
window.addEventListener('scroll', () => {
    revealOnScroll();
    updateHeader();
    
    // Parallax effect for profile image
    const scrolled = window.pageYOffset;
    const parallaxElement = document.querySelector('.profile-image');
    const speed = scrolled * 0.2;
    
    if (parallaxElement && scrolled < window.innerHeight) {
        parallaxElement.style.transform = `translateY(${speed}px) scale(${1 + scrolled * 0.0001})`;
    }
});

// Initial reveal check
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
});

// Smooth scroll behavior for older browsers
function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
    }
}