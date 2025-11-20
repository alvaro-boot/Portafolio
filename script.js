// ============================================
// Script principal del portafolio
// ============================================

// Esperar a que se carguen los componentes
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Inicializar aplicación cuando se carguen los componentes
window.addEventListener('componentLoaded', (event) => {
    if (event.detail.componentName === 'navbar') {
        initNavigation();
    }
    if (event.detail.componentName === 'projects') {
        initProjectFilters();
    }
    if (event.detail.componentName === 'contact') {
        initContactForm();
    }
    if (event.detail.componentName === 'hero') {
        initHeroAnimations();
    }
    if (event.detail.componentName === 'about') {
        initStatsAnimation();
        initSkillBars();
    }
    if (event.detail.componentName === 'skills') {
        initSkillLevelBars();
    }
    if (event.detail.componentName === 'experience') {
        initExperienceAnimations();
    }
});

// Inicializar aplicación
function initializeApp() {
    initThemeToggle();
    initScrollToTop();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initParallax();
    initTooltips();
    initNavToggle();
    initLoadingAnimations();
}

// Toggle del menú móvil
function initNavToggle() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Animaciones de carga
function initLoadingAnimations() {
    // Animar elementos al entrar en viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar cards y elementos importantes
    setTimeout(() => {
        document.querySelectorAll('.proyecto-card, .achievement-card, .certification-card, .habilidad-categoria').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }, 500);
}

// ============================================
// Navegación
// ============================================
function initNavigation() {
    // La navegación ahora se maneja con initNavToggle() y pageNavigation.js
    // Esta función se mantiene por compatibilidad pero la lógica está en initNavToggle()
}

// Navegación con efecto (sin scroll, siempre visible)
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // El navbar siempre está visible, no depende del scroll
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
}

// ============================================
// Modo Oscuro/Claro
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            body.classList.toggle('light-theme');
            
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon(currentTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ============================================
// Botón Scroll to Top
// ============================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// Smooth Scroll (Deshabilitado - ahora usamos navegación por páginas)
// ============================================
function initSmoothScroll() {
    // Smooth scroll deshabilitado - ahora usamos navegación por páginas
    // Los enlaces se manejan a través de pageNavigation.js
}

// ============================================
// Animaciones al hacer scroll
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos con data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Observar otros elementos para animaciones generales
    const animateElements = document.querySelectorAll(
        '.experiencia-card, .proyecto-card, .habilidad-categoria, .stat-card, .intro-card'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// Hero Animations
// ============================================
function initHeroAnimations() {
    const heroImage = document.querySelector('.image-placeholder');
    if (heroImage) {
        // Efecto parallax en la imagen del hero
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Animación de partículas
    createParticles();
}

function createParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(37, 99, 235, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// Animaciones de Estadísticas
// ============================================
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-content h3[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-count'));
                const duration = 2000;
                const increment = finalValue / (duration / 16);
                let currentValue = 0;

                const updateCounter = () => {
                    currentValue += increment;
                    if (currentValue < finalValue) {
                        target.textContent = Math.floor(currentValue) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = finalValue + '+';
                    }
                };

                updateCounter();
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ============================================
// Barras de habilidades (Sobre Mí)
// ============================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress[data-progress]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
                barObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        barObserver.observe(bar);
    });
}

// ============================================
// Barras de nivel de habilidades
// ============================================
function initSkillLevelBars() {
    const levelBars = document.querySelectorAll('.level-bar[data-level]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const levelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute('data-level');
                setTimeout(() => {
                    bar.style.width = level + '%';
                }, 300);
                levelObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    levelBars.forEach(bar => {
        levelObserver.observe(bar);
    });
}

// ============================================
// Filtros de Proyectos
// ============================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.proyecto-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Obtener filtro seleccionado
            const filter = button.getAttribute('data-filter');

            // Filtrar proyectos
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ============================================
// Formulario de Contacto
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                asunto: formData.get('asunto'),
                mensaje: formData.get('mensaje')
            };

            try {
                // Mostrar mensaje de carga
                showFormMessage('loading', 'Enviando mensaje...');

                // Simular delay de envío
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Aquí puedes integrar con EmailJS, FormSpree, o tu propio backend
                // Ejemplo con EmailJS (descomentar y configurar):
                /*
                if (typeof emailjs !== 'undefined') {
                    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
                        .then(() => {
                            showFormMessage('success', '¡Mensaje enviado correctamente! Te responderé pronto.');
                            contactForm.reset();
                        })
                        .catch(() => {
                            showFormMessage('error', 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
                        });
                } else {
                    // Fallback para desarrollo
                    showFormMessage('success', '¡Mensaje enviado correctamente! Te responderé pronto.');
                    contactForm.reset();
                }
                */

                // Por ahora, mostramos un mensaje de éxito simulado
                showFormMessage('success', '¡Mensaje enviado correctamente! Te responderé pronto.');
                contactForm.reset();

            } catch (error) {
                showFormMessage('error', 'Error al enviar el mensaje. Por favor, intenta nuevamente o contáctame directamente por email.');
                console.error('Error:', error);
            }
        });

        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                return false;
            }
        }

        field.classList.remove('error');
        return true;
    }
}

function showFormMessage(type, message) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.className = `form-message ${type}`;
        formMessage.textContent = message;
        formMessage.style.display = 'block';

        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// ============================================
// Descargar CV
// ============================================
const downloadCVBtn = document.getElementById('downloadCV');

if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Aquí debes agregar la URL de tu CV o la lógica para generar/descargar el CV
        // Por ejemplo:
        // window.open('assets/cv-alvaro-cotes.pdf', '_blank');
        
        // Por ahora, mostramos un mensaje
        alert('Por favor, agrega la ruta a tu CV en el archivo script.js en la función del botón "Descargar CV"');
        
        // Descomenta y configura la siguiente línea con la ruta de tu CV:
        // window.open('assets/cv-alvaro-cotes.pdf', '_blank');
    });
}

// ============================================
// Efecto Parallax
// ============================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-gradient, .hero-particles');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        parallaxElements.forEach(element => {
            if (scrolled < window.innerHeight * 2) {
                element.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

// ============================================
// Tooltips
// ============================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = e.target.getAttribute('data-tooltip');
            if (tooltip) {
                // Los tooltips se manejan con CSS ::after
                // Esta función puede extenderse para tooltips más complejos
            }
        });
    });
}

// ============================================
// Animaciones de Experiencia
// ============================================
function initExperienceAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });
}

// ============================================
// Prevenir envío de formulario vacío
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        if (submitBtn) {
            form.addEventListener('input', () => {
                let isValid = true;
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                    }
                });

                submitBtn.disabled = !isValid;
                submitBtn.style.opacity = isValid ? '1' : '0.6';
                submitBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
            });
        }
    });
});

// ============================================
// Prevenir FOUC (Flash of Unstyled Content)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// ============================================
// Manejo de errores
// ============================================
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});

// ============================================
// Performance: Lazy loading de imágenes
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
