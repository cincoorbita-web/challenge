/**
 * ORBITA5: Theme Manager (Sistema de Temas de UI)
 * Gestiona el intercambio en caliente entre los 3 estilos de interfaz:
 * 1. 'default'     -> Base Sci-Fi Clásico (futurista, semáforo neón, Fredoka)
 * 2. 'comic-pop'   -> Cómic Pop-Art / Superhéroe (trazos de tinta negra, halftone, sombras duras, Bangers)
 * 3. 'comic-retro' -> Novela Gráfica / Pulp Vintage (viñetas dobles, papel analógico, tonos cálidos)
 */

class ThemeManager {
  constructor() {
    this.storageKey = 'orbita5_ui_theme';
    this.themes = [
      {
        id: 'default',
        name: 'Sci-Fi Clásico',
        shortName: 'Sci-Fi',
        icon: '🚀',
        tag: 'Base',
        desc: 'Puesto de mando lunar futurista. Interfaz limpia con transparencias de vidrio, acentos cian y semáforo translúcido.',
        swatches: ['#030612', '#00d2d3', '#0984e3', '#6c5ce7']
      },
      {
        id: 'comic-pop',
        name: 'Cómic Pop-Art',
        shortName: 'Cómic Pop',
        icon: '💥',
        tag: '¡Acción!',
        desc: 'Estilo historieta moderna de superhéroes: bordes gruesos de tinta negra, sombras angulares duras, viñetas de acción y amarillo explosivo.',
        swatches: ['#ffe600', '#ff2a5f', '#00f0ff', '#000000']
      },
      {
        id: 'comic-retro',
        name: 'Novela Gráfica',
        shortName: 'Pulp Vintage',
        icon: '📜',
        tag: 'Vintage',
        desc: 'Estilo clásico de ciencia ficción de los años 60s–70s (estilo Tintín en la Luna / Pulp): viñetas dobles editoriales, tramas de imprenta y tonos cálidos.',
        swatches: ['#f4a261', '#e76f51', '#2a9d8f', '#16151f']
      }
    ];

    this.currentThemeId = this.loadSavedTheme();
    this.listeners = [];
  }

  /**
   * Carga el tema guardado en localStorage o fallback a 'default'
   */
  loadSavedTheme() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && this.themes.some(t => t.id === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('[ThemeManager] No se pudo leer de localStorage:', e);
    }
    return 'default';
  }

  /**
   * Inicializa el tema aplicando el atributo al elemento raíz
   */
  init() {
    this.applyTheme(this.currentThemeId, false);
  }

  /**
   * Aplica un tema visual
   * @param {string} themeId 
   * @param {boolean} playSound 
   */
  setTheme(themeId, playSound = true) {
    if (!this.themes.some(t => t.id === themeId)) {
      console.warn(`[ThemeManager] Tema desconocido: ${themeId}`);
      return;
    }

    this.currentThemeId = themeId;
    this.applyTheme(themeId, playSound);

    try {
      localStorage.setItem(this.storageKey, themeId);
    } catch (e) {
      console.warn('[ThemeManager] No se pudo guardar en localStorage:', e);
    }

    this.notifyListeners(themeId);
  }

  /**
   * Aplica la clase y data-theme al DOM
   */
  applyTheme(themeId, playSound) {
    document.documentElement.setAttribute('data-theme', themeId);
    if (document.body) {
      document.body.setAttribute('data-theme', themeId);
    }

    if (playSound && window.gameAudio && typeof window.gameAudio.playClick === 'function') {
      window.gameAudio.playClick();
    }
  }

  /**
   * Alterna cíclicamente al siguiente tema
   */
  cycleTheme() {
    const currentIndex = this.themes.findIndex(t => t.id === this.currentThemeId);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex].id, true);
    return this.themes[nextIndex];
  }

  /**
   * Obtiene la definición del tema activo
   */
  getCurrentTheme() {
    return this.themes.find(t => t.id === this.currentThemeId) || this.themes[0];
  }

  /**
   * Lista de todos los temas disponibles
   */
  getThemes() {
    return this.themes;
  }

  /**
   * Suscribe un listener a cambios de tema
   */
  onThemeChange(fn) {
    if (typeof fn === 'function') {
      this.listeners.push(fn);
    }
  }

  notifyListeners(themeId) {
    const themeObj = this.getCurrentTheme();
    this.listeners.forEach(fn => {
      try {
        fn(themeId, themeObj);
      } catch (err) {
        console.error('[ThemeManager] Error en listener:', err);
      }
    });
  }
}

// Instancia global
window.themeManager = new ThemeManager();
// Inicializar inmediatamente antes del render
window.themeManager.init();
