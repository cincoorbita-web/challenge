/**
 * ORBITA5: Speech Narrator Service (Web Speech API)
 * Proporciona narración en voz alta con soporte multivoz (Español Latinoamericano / Regional),
 * selector de voces interactivo, persistencia de preferencias y preescucha para niños.
 */

class SpeechNarratorService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? (window.speechSynthesis || null) : null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.currentTarget = null; // 'mission', 'option-0', 'option-1', 'preview', etc.
    this.onStateChangeCallback = null;
    this.onVoiceChangeCallback = null;
    this.voices = [];
    this.preferredVoice = null;

    if (this.synth) {
      this.loadVoices();
      if (typeof this.synth.onvoiceschanged !== 'undefined') {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  setOnStateChange(callback) {
    this.onStateChangeCallback = callback;
  }

  setOnVoiceChange(callback) {
    this.onVoiceChangeCallback = callback;
    // Si ya hay una voz preferida cargada, disparar el callback de inmediato
    if (this.preferredVoice && typeof callback === 'function') {
      callback(this.getVoiceDetails(this.preferredVoice));
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];

      // 1. Intentar restaurar la voz guardada por el usuario
      let savedVoiceName = null;
      try {
        if (typeof localStorage !== 'undefined') {
          savedVoiceName = localStorage.getItem('orbita5_voice_name') || localStorage.getItem('artemis_voice_name');
        }
      } catch (e) {
        // Ignorar restricciones de almacenamiento local
      }

      if (savedVoiceName) {
        const found = this.voices.find(v => v.name === savedVoiceName);
        if (found) {
          this.preferredVoice = found;
        }
      }

      // 2. Si no hay guardada o no se encontró, seleccionar la mejor voz latina por defecto
      if (!this.preferredVoice) {
        this.preferredVoice = this.findBestLatinVoice(this.voices);
      }

      // Notificar a los listeners del cambio de voz
      if (this.preferredVoice && this.onVoiceChangeCallback) {
        this.onVoiceChangeCallback(this.getVoiceDetails(this.preferredVoice));
      }
    } catch (e) {
      console.warn('Error al cargar voces del sintetizador:', e);
    }
  }

  /**
   * Obtiene la lista de voces en español disponibles en el sistema,
   * ordenadas priorizando variantes latinoamericanas.
   */
  getSpanishVoices() {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) {
        this.voices = this.synth.getVoices() || [];
      }
    }

    if (!this.voices || this.voices.length === 0) return [];

    // Filtrar voces en español
    const esVoices = this.voices.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('es') || lang.includes('es-') || lang.includes('es_');
    });

    // Si el navegador no tiene ninguna voz en español instalada, devolver todas las disponibles
    const baseList = esVoices.length > 0 ? esVoices : this.voices.slice(0, 10);

    // Ordenar con prioridad:
    // 1: Latinoamericanas (es-419, es-mx, es-ar, es-co, es-us, etc.)
    // 2: España (es-es)
    // 3: Otras
    const latinCodes = ['es-419', 'es-mx', 'es-ar', 'es-co', 'es-us', 'es-cl', 'es-pe', 'es-uy', 'es-ve', 'es-ec', 'es-cr'];
    
    return baseList.slice().sort((a, b) => {
      const langA = (a.lang || '').toLowerCase().replace('_', '-');
      const langB = (b.lang || '').toLowerCase().replace('_', '-');
      const isLatinA = latinCodes.some(c => langA.startsWith(c));
      const isLatinB = latinCodes.some(c => langB.startsWith(c));

      if (isLatinA && !isLatinB) return -1;
      if (!isLatinA && isLatinB) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }

  /**
   * Parsea los metadatos de una voz para presentar un nombre amigable,
   * bandera de país o región y etiqueta para botones.
   */
  getVoiceDetails(voice) {
    if (!voice) {
      return {
        voice: null,
        name: 'Auto',
        lang: 'es-419',
        flag: '🌎',
        region: 'Latinoamérica',
        cleanName: 'Latina (Auto)',
        shortLabel: '🌎 Latina',
        isSelected: true
      };
    }

    const lang = (voice.lang || '').toLowerCase().replace('_', '-');
    const rawName = voice.name || 'Voz';

    let flag = '🌐';
    let region = 'Español';

    if (lang.includes('es-ar') || rawName.toLowerCase().includes('argentin')) {
      flag = '🇦🇷'; region = 'Argentina';
    } else if (lang.includes('es-mx') || rawName.toLowerCase().includes('mexic')) {
      flag = '🇲🇽'; region = 'México';
    } else if (lang.includes('es-co') || rawName.toLowerCase().includes('colombia')) {
      flag = '🇨🇴'; region = 'Colombia';
    } else if (lang.includes('es-cl') || rawName.toLowerCase().includes('chile')) {
      flag = '🇨🇱'; region = 'Chile';
    } else if (lang.includes('es-pe') || rawName.toLowerCase().includes('peru') || rawName.toLowerCase().includes('perú')) {
      flag = '🇵🇪'; region = 'Perú';
    } else if (lang.includes('es-uy') || rawName.toLowerCase().includes('uruguay')) {
      flag = '🇺🇾'; region = 'Uruguay';
    } else if (lang.includes('es-ve') || rawName.toLowerCase().includes('venezuela')) {
      flag = '🇻🇪'; region = 'Venezuela';
    } else if (lang.includes('es-us') || rawName.toLowerCase().includes('estados unidos')) {
      flag = '🇺🇸'; region = 'EE.UU. (Latino)';
    } else if (lang.includes('es-419') || rawName.toLowerCase().includes('latin')) {
      flag = '🌎'; region = 'Latinoamérica';
    } else if (lang.includes('es-es') || rawName.toLowerCase().includes('spain') || rawName.toLowerCase().includes('españa')) {
      flag = '🇪🇸'; region = 'España';
    }

    // Nombre limpio y amigable
    let cleanName = rawName
      .replace(/^Microsoft\s+/i, '')
      .replace(/\s+Desktop/i, '')
      .replace(/\s+-\s+Spanish\s*\(.*?\)/i, '')
      .replace(/\(Enhanced\)/i, '')
      .replace(/\(Premium\)/i, '')
      .replace(/Google\s+español\s+de\s+Estados\s+Unidos/i, 'Google Latino')
      .replace(/Google\s+español/i, 'Google')
      .trim();

    if (!cleanName) cleanName = 'Voz ' + flag;

    const isSelected = this.preferredVoice ? this.preferredVoice.name === voice.name : false;

    return {
      voice,
      name: voice.name,
      lang: voice.lang,
      flag,
      region,
      cleanName,
      shortLabel: `${flag} ${cleanName}`,
      isSelected
    };
  }

  getCurrentVoiceDetails() {
    return this.getVoiceDetails(this.preferredVoice);
  }

  setVoiceByName(name) {
    if (!name) return;
    const found = this.voices.find(v => v.name === name);
    if (found) {
      this.preferredVoice = found;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('orbita5_voice_name', found.name);
        }
      } catch (e) {}

      const details = this.getVoiceDetails(found);
      if (this.onVoiceChangeCallback) {
        this.onVoiceChangeCallback(details);
      }
      return details;
    }
    return null;
  }

  /**
   * Cambia de forma cíclica a la siguiente voz en español disponible,
   * actualiza la interfaz y reproduce un breve mensaje de confirmación.
   */
  cycleNextVoice() {
    const list = this.getSpanishVoices();
    if (!list || list.length === 0) {
      if (typeof alert === 'function') alert('No se encontraron voces instaladas en tu navegador.');
      return null;
    }

    let currentIndex = -1;
    if (this.preferredVoice) {
      currentIndex = list.findIndex(v => v.name === this.preferredVoice.name);
    }

    const nextIndex = (currentIndex + 1) % list.length;
    const nextVoice = list[nextIndex];
    const details = this.setVoiceByName(nextVoice.name);

    // Reproducir confirmación rápida
    this.speakText(`Voz cambiada a ${details.cleanName} de ${details.region}.`, 'voice-change');

    return details;
  }

  /**
   * Reproduce una muestra de prueba con una voz determinada
   */
  previewVoice(voice) {
    if (!this.synth || !voice) return;
    this.stop();

    try {
      const details = this.getVoiceDetails(voice);
      const text = `¡Hola Comandante! Soy la voz de Control de Misión de ${details.region}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang || 'es-419';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentTarget = 'preview';
        if (this.onStateChangeCallback) this.onStateChangeCallback(true, 'preview');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentTarget = null;
        this.currentUtterance = null;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false, null);
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentTarget = null;
        this.currentUtterance = null;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false, null);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Error en preescucha de voz:', e);
      this.stop();
    }
  }

  /**
   * Prioriza la mejor voz latina si no se ha configurado ninguna
   */
  findBestLatinVoice(voices) {
    if (!voices || voices.length === 0) return null;

    const latinPriorityCodes = [
      'es-419', 'es-mx', 'es-ar', 'es-co', 'es-us', 'es-cl', 'es-pe', 'es-ve', 'es-uy', 'es-ec', 'es-cr'
    ];

    const latinKeywords = [
      'latin', 'latino', 'mexic', 'argentin', 'colombia', 'chile', 'estados unidos',
      'paulina', 'diego', 'luciana', 'sabina', 'dalia', 'raul', 'gonzalo',
      'soledad', 'carlos', 'sofia', 'juan', 'miguel', 'lupe', 'elena'
    ];

    // 1. Coincidencia por código de región latinoamericana
    for (const code of latinPriorityCodes) {
      const match = voices.find(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        return lang === code || lang.startsWith(`${code}-`);
      });
      if (match) return match;
    }

    // 2. Coincidencia por palabra clave latina
    const nameMatch = voices.find(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      if (!lang.startsWith('es')) return false;
      return latinKeywords.some(kw => name.includes(kw));
    });
    if (nameMatch) return nameMatch;

    // 3. Cualquier voz en español que NO sea de España
    const nonSpainVoice = voices.find(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return lang.startsWith('es') && !lang.includes('es-es') && !name.includes('spain') && !name.includes('españa');
    });
    if (nonSpainVoice) return nonSpainVoice;

    // 4. Fallback final: Cualquier voz en español
    return voices.find(v => (v.lang || '').toLowerCase().startsWith('es')) || null;
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('SpeechSynthesis cancel error:', e);
      }
    }
    this.isSpeaking = false;
    this.currentTarget = null;
    this.currentUtterance = null;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false, null);
    }
  }

  speakMission(event) {
    if (!this.isSupported()) {
      if (typeof alert === 'function') alert('Tu navegador no soporta síntesis de voz nativa.');
      else console.warn('Tu navegador no soporta síntesis de voz nativa.');
      return;
    }

    if (this.isSpeaking && this.currentTarget === 'mission') {
      this.stop();
      return;
    }

    let text = `Transmisión de Control de Misión. `;
    text += `${event.title}. `;
    text += `${event.description}. `;
    if (event.scientificContext) {
      text += `Dato científico de la NASA: ${event.scientificContext}. `;
    }
    text += `Comandante, revisa las opciones para tomar una decisión.`;

    this.speakText(text, 'mission');
  }

  speakOption(option, index) {
    if (!this.isSupported()) {
      if (typeof alert === 'function') alert('Tu navegador no soporta síntesis de voz nativa.');
      else console.warn('Tu navegador no soporta síntesis de voz nativa.');
      return;
    }

    const targetKey = `option-${index}`;

    if (this.isSpeaking && this.currentTarget === targetKey) {
      this.stop();
      return;
    }

    const letter = String.fromCharCode(65 + index);
    let text = `Opción ${letter}: ${option.title}. `;
    text += `Acción: ${option.actionText}. `;
    text += `Ganancia: ${option.gainText}. `;
    text += `Costo o sacrificio: ${option.costText}.`;

    this.speakText(text, targetKey);
  }

  speakText(text, targetKey = 'generic') {
    this.stop();

    if (!this.synth) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      if (!this.preferredVoice) {
        this.loadVoices();
      }

      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
        utterance.lang = this.preferredVoice.lang || 'es-419';
      } else {
        utterance.lang = 'es-419';
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentTarget = targetKey;
        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(true, targetKey);
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentTarget = null;
        this.currentUtterance = null;
        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(false, null);
        }
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        this.isSpeaking = false;
        this.currentTarget = null;
        this.currentUtterance = null;
        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(false, null);
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (err) {
      console.error('Error al iniciar narración:', err);
      this.stop();
    }
  }
}

window.speechNarrator = new SpeechNarratorService();
