// Sistema de Navegación por Pantallas (SPA)
class PageNavigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = {
            'home': 'hero-container',
            'about': 'about-container',
            'experience': 'experience-container',
            'projects': 'projects-container',
            'achievements': 'achievements-container',
            'skills': 'skills-container',
            'certifications': 'certifications-container',
            'contact': 'contact-container'
        };
        this.init();
    }

    init() {
        // Esperar a que los componentes se carguen antes de inicializar
        const checkAndInit = () => {
            const heroContainer = document.getElementById('hero-container');
            if (heroContainer && heroContainer.innerHTML.trim() !== '') {
                // Los componentes ya están cargados, inicializar
                this.initializePage();
            } else {
                // Esperar un poco más
                setTimeout(checkAndInit, 100);
            }
        };

        // Comenzar a verificar después de un breve delay
        setTimeout(checkAndInit, 200);
    }

    initializePage() {
        // Cargar página inicial desde URL o localStorage
        const urlHash = window.location.hash.slice(1);
        if (urlHash && this.pages[urlHash]) {
            this.showPage(urlHash);
        } else {
            const savedPage = localStorage.getItem('currentPage') || 'home';
            this.showPage(savedPage);
        }

        // Escuchar cambios en el hash de la URL
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.slice(1) || 'home';
            if (this.pages[page]) {
                this.showPage(page);
            }
        });

        // Configurar navegación
        this.setupNavigation();
    }

    setupNavigation() {
        // Actualizar enlaces de navegación
        document.addEventListener('click', (e) => {
            // Buscar botones y enlaces con data-page
            const button = e.target.closest('button[data-page], .next-page-btn');
            const link = e.target.closest('a[data-page], .nav-link[href^="#"]');
            const element = button || link;
            
            if (element) {
                e.preventDefault();
                e.stopPropagation();
                
                // Obtener el nombre de la página
                let pageName = '';
                if (element.hasAttribute('data-page')) {
                    pageName = element.getAttribute('data-page');
                } else if (element.hasAttribute('href')) {
                    const href = element.getAttribute('href');
                    pageName = href.replace('#', '').replace('-container', '') || 'home';
                }
                
                if (pageName && this.pages[pageName]) {
                    this.showPage(pageName);
                    // Actualizar URL sin recargar
                    window.history.pushState({}, '', `#${pageName}`);
                }
            }
        });
    }

    showPage(pageName) {
        // No hacer nada si ya estamos en esa página
        if (this.currentPage === pageName && document.querySelector('.page-active')) return;

        // Agregar clase de transición al body para mejor UX
        document.body.classList.add('page-transitioning');

        // Ocultar todas las páginas (excepto navbar)
        Object.values(this.pages).forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container && containerId !== 'navbar-container') {
                container.classList.remove('page-active');
                container.classList.add('page-hidden');
            }
        });

        // Cerrar menú móvil si está abierto
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const navToggle = document.getElementById('navToggle');
            if (navToggle) navToggle.classList.remove('active');
        }

        // Mostrar página seleccionada con transición suave
        const targetContainer = document.getElementById(this.pages[pageName]);
        if (targetContainer && targetContainer.innerHTML.trim() !== '') {
            // Usar requestAnimationFrame para mejor rendimiento
            requestAnimationFrame(() => {
                targetContainer.classList.remove('page-hidden');
                requestAnimationFrame(() => {
                    targetContainer.classList.add('page-active');
                    
                    // Remover clase de transición después de la animación
                    setTimeout(() => {
                        document.body.classList.remove('page-transitioning');
                    }, 400);
                });
            });
        } else {
            console.warn(`⚠ Página ${pageName} no está cargada aún, esperando...`);
            // Si el componente no está cargado, esperar un poco y reintentar
            setTimeout(() => {
                const container = document.getElementById(this.pages[pageName]);
                if (container && container.innerHTML.trim() !== '') {
                    this.showPage(pageName);
                } else {
                    console.error(`✗ No se pudo cargar la página ${pageName}`);
                }
            }, 300);
        }

        // Actualizar navegación activa
        this.updateActiveNav(pageName);

        // Guardar página actual
        this.currentPage = pageName;
        localStorage.setItem('currentPage', pageName);

        // Scroll al inicio suavemente
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    updateActiveNav(pageName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || link.getAttribute('data-page') || '';
            const linkPage = href.replace('#', '').replace('-container', '') || 'home';
            if (linkPage === pageName || (pageName === 'home' && (href === '#hero' || href === '#home'))) {
                link.classList.add('active');
            }
        });
    }

    nextPage() {
        const pages = Object.keys(this.pages);
        const currentIndex = pages.indexOf(this.currentPage);
        if (currentIndex < pages.length - 1) {
            const nextPage = pages[currentIndex + 1];
            this.showPage(nextPage);
            window.history.pushState({}, '', `#${nextPage}`);
        }
    }

    prevPage() {
        const pages = Object.keys(this.pages);
        const currentIndex = pages.indexOf(this.currentPage);
        if (currentIndex > 0) {
            const prevPage = pages[currentIndex - 1];
            this.showPage(prevPage);
            window.history.pushState({}, '', `#${prevPage}`);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pageNavigation = new PageNavigation();

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            window.pageNavigation.nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            window.pageNavigation.prevPage();
        }
    });
});

