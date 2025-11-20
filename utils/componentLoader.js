// Component Loader - Carga dinámica de componentes HTML
class ComponentLoader {
    constructor() {
        this.components = new Map();
    }

    async loadComponent(componentName, containerId) {
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - No se pudo cargar ${componentName}.html`);
            }
            const html = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
                this.components.set(componentName, html);
                console.log(`✓ Componente ${componentName} cargado correctamente`);
                // Disparar evento personalizado para inicialización
                window.dispatchEvent(new CustomEvent('componentLoaded', {
                    detail: { componentName, containerId }
                }));
            } else {
                console.warn(`⚠ Contenedor ${containerId} no encontrado para ${componentName}`);
            }
        } catch (error) {
            console.error(`✗ Error cargando componente ${componentName}:`, error);
            // Crear un mensaje de error visible
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: #ef4444;">
                        <p><strong>Error al cargar ${componentName}</strong></p>
                        <p style="font-size: 0.9rem; color: #666;">${error.message}</p>
                    </div>
                `;
            }
            throw error; // Re-lanzar para que loadAllComponents lo detecte
        }
    }

    async loadAllComponents() {
        const components = [
            { name: 'navbar', container: 'navbar-container' },
            { name: 'hero', container: 'hero-container' },
            { name: 'about', container: 'about-container' },
            { name: 'experience', container: 'experience-container' },
            { name: 'projects', container: 'projects-container' },
            { name: 'achievements', container: 'achievements-container' },
            { name: 'skills', container: 'skills-container' },
            { name: 'certifications', container: 'certifications-container' },
            { name: 'contact', container: 'contact-container' },
            { name: 'colorCustomizer', container: 'colorCustomizer-container' }
        ];

        // Cargar componentes secuencialmente para mejor control
        for (const comp of components) {
            try {
                await this.loadComponent(comp.name, comp.container);
            } catch (error) {
                console.error(`Fallo al cargar ${comp.name}, continuando...`, error);
            }
        }
    }

    getComponent(componentName) {
        return this.components.get(componentName);
    }
}

// Inicializar y cargar componentes
const componentLoader = new ComponentLoader();

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader');
    let loadingTimeout;
    
    // Función para ocultar loader
    const hideLoader = () => {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }
        if (loadingTimeout) clearTimeout(loadingTimeout);
    };

    // Timeout de seguridad - ocultar loader después de 5 segundos máximo
    loadingTimeout = setTimeout(() => {
        console.warn('⚠ Timeout de carga alcanzado, ocultando loader');
        hideLoader();
        if (window.pageNavigation && !document.querySelector('.page-active')) {
            window.pageNavigation.showPage('home');
        }
    }, 5000);

    try {
        // Mostrar loader
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
            loader.style.visibility = 'visible';
        }

        // Cargar todos los componentes
        await componentLoader.loadAllComponents();
        console.log('✓ Todos los componentes cargados');
        
        // Esperar a que pageNavigation se inicialice
        let attempts = 0;
        while (!window.pageNavigation && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        if (!window.pageNavigation) {
            console.log('Inicializando PageNavigation...');
            if (typeof PageNavigation !== 'undefined') {
                window.pageNavigation = new PageNavigation();
            }
        }
        
        // Ocultar loader después de cargar todo
        setTimeout(() => {
            hideLoader();
            
            // Asegurar que la página inicial se muestre
            setTimeout(() => {
                const heroContainer = document.getElementById('hero-container');
                if (heroContainer && heroContainer.innerHTML.trim() !== '') {
                    if (window.pageNavigation) {
                        window.pageNavigation.showPage('home');
                    } else {
                        // Fallback: mostrar directamente
                        heroContainer.classList.add('page-active');
                        heroContainer.classList.remove('page-hidden');
                    }
                }
            }, 200);
        }, 600);
        
    } catch (error) {
        console.error('Error cargando componentes:', error);
        hideLoader();
        
        // Mostrar error en la página
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fee; color: #c33; padding: 2rem; border-radius: 8px; z-index: 10000; text-align: center; max-width: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);';
        errorDiv.innerHTML = '<h2>Error al cargar</h2><p>Hubo un problema al cargar los componentes. Por favor, revisa la consola para más detalles.</p><button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #c33; color: white; border: none; border-radius: 4px; cursor: pointer;">Recargar</button>';
        document.body.appendChild(errorDiv);
    }
});

// Exportar para uso global
window.componentLoader = componentLoader;
