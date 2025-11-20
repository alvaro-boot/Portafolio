// Sistema de Personalización de Colores
class ColorCustomizer {
    constructor() {
        this.colors = {
            '--bg-main': '#ffffff',
            '--text-main': '#1f2937',
            '--accent-color': '#2563eb',
            '--secondary-color': '#f59e0b',
            '--border-color': '#e5e7eb'
        };
        this.init();
    }

    init() {
        // Cargar colores guardados
        this.loadSavedColors();
        
        // Esperar a que se cargue el componente
        window.addEventListener('componentLoaded', (event) => {
            if (event.detail.componentName === 'colorCustomizer') {
                this.setupEventListeners();
                this.updateColorInputs();
            }
        });
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('customizerToggle');
        const closeBtn = document.getElementById('closeCustomizer');
        const panel = document.getElementById('customizerPanel');
        const resetBtn = document.getElementById('resetColors');
        const saveBtn = document.getElementById('saveColors');

        // Toggle panel
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                panel.classList.toggle('active');
                toggleBtn.classList.toggle('active');
            });
        }

        // Cerrar panel
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.classList.remove('active');
                if (toggleBtn) toggleBtn.classList.remove('active');
            });
        }

        // Selectores de color
        const colorInputs = document.querySelectorAll('input[type="color"]');
        colorInputs.forEach(input => {
            const variable = input.getAttribute('data-variable');
            const textInput = document.getElementById(input.id + 'Text');

            input.addEventListener('input', (e) => {
                const color = e.target.value;
                this.setColor(variable, color);
                if (textInput) textInput.value = color;
            });

            if (textInput) {
                textInput.addEventListener('change', (e) => {
                    const color = this.validateColor(e.target.value);
                    this.setColor(variable, color);
                    input.value = color;
                    textInput.value = color;
                });
            }
        });

        // Temas predefinidos
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const colors = JSON.parse(btn.getAttribute('data-colors'));
                this.applyPreset(colors);
            });
        });

        // Reset
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetColors();
            });
        }

        // Save
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveColors();
                this.showNotification('Colores guardados exitosamente');
            });
        }
    }

    setColor(variable, color) {
        this.colors[variable] = color;
        document.documentElement.style.setProperty(variable, color);
    }

    applyPreset(colors) {
        Object.keys(colors).forEach(variable => {
            this.setColor(variable, colors[variable]);
        });
        this.updateColorInputs();
    }

    updateColorInputs() {
        Object.keys(this.colors).forEach(variable => {
            const input = document.querySelector(`input[data-variable="${variable}"]`);
            const textInput = document.getElementById(input ? input.id + 'Text' : '');
            
            if (input) {
                input.value = this.colors[variable];
                if (textInput) textInput.value = this.colors[variable];
            }
        });
    }

    resetColors() {
        const defaultColors = {
            '--bg-main': '#ffffff',
            '--text-main': '#1f2937',
            '--accent-color': '#2563eb',
            '--secondary-color': '#f59e0b',
            '--border-color': '#e5e7eb'
        };
        this.applyPreset(defaultColors);
    }

    saveColors() {
        localStorage.setItem('customColors', JSON.stringify(this.colors));
    }

    loadSavedColors() {
        const saved = localStorage.getItem('customColors');
        if (saved) {
            try {
                const colors = JSON.parse(saved);
                Object.keys(colors).forEach(variable => {
                    this.colors[variable] = colors[variable];
                    document.documentElement.style.setProperty(variable, colors[variable]);
                });
            } catch (e) {
                console.error('Error cargando colores guardados:', e);
            }
        }
    }

    validateColor(color) {
        // Validar formato hexadecimal
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            return color;
        }
        return '#000000';
    }

    showNotification(message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'color-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.colorCustomizer = new ColorCustomizer();
});

