/**
 * ORBITA5: Speech Narrator Service (Web Speech API)
 * Proporciona narración en voz alta bilingüe (Español Latinoamericano / Inglés),
 * selector de voces interactivo, persistencia de preferencias por idioma y preescucha.
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
    this.currentLang = (typeof window !== 'undefined' && window.i18n) ? window.i18n.getLanguage() : 'en';
    this.preferredVoices = {
      es: null,
      en: null
    };

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
    const pref = this.getPreferredVoice();
    if (pref && typeof callback === 'function') {
      setTimeout(() => {
        try {
          if (this.onVoiceChangeCallback === callback) {
            callback(this.getVoiceDetails(this.getPreferredVoice()));
          }
        } catch (e) {
          console.warn('Voice change notification error:', e);
        }
      }, 0);
    }
  }

  /**
   * Cambia el idioma activo de narración (es / en)
   */
  setLanguage(lang) {
    if (!['es', 'en'].includes(lang)) return;
    this.currentLang = lang;
    this.loadVoices();
    const active = this.getPreferredVoice();
    if (this.onVoiceChangeCallback && active) {
      this.onVoiceChangeCallback(this.getVoiceDetails(active));
    }
  }

  getPreferredVoice() {
    return this.preferredVoices[this.currentLang] || null;
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
      if (this.voices.length === 0) return;

      // Cargar para español
      let savedVoiceEs = null;
      try {
        if (typeof localStorage !== 'undefined') {
          savedVoiceEs = localStorage.getItem('orbita5_voice_name_es') || localStorage.getItem('orbita5_voice_name');
        }
      } catch (e) {}

      if (savedVoiceEs) {
        this.preferredVoices.es = this.voices.find(v => v.name === savedVoiceEs) || null;
      }
      if (!this.preferredVoices.es) {
        this.preferredVoices.es = this.findBestLatinVoice(this.voices);
      }

      // Cargar para inglés
      let savedVoiceEn = null;
      try {
        if (typeof localStorage !== 'undefined') {
          savedVoiceEn = localStorage.getItem('orbita5_voice_name_en');
        }
      } catch (e) {}

      if (savedVoiceEn) {
        this.preferredVoices.en = this.voices.find(v => v.name === savedVoiceEn) || null;
      }
      if (!this.preferredVoices.en) {
        this.preferredVoices.en = this.findBestEnglishVoice(this.voices);
      }

      // Notificar cambio
      const activeVoice = this.getPreferredVoice();
      if (activeVoice && this.onVoiceChangeCallback) {
        this.onVoiceChangeCallback(this.getVoiceDetails(activeVoice));
      }
    } catch (e) {
      console.warn('Error al cargar voces del sintetizador:', e);
    }
  }

  /**
   * Obtiene la lista de voces según el idioma actual
   */
  getActiveVoices() {
    return this.currentLang === 'en' ? this.getEnglishVoices() : this.getSpanishVoices();
  }

  /**
   * Obtiene la lista de voces en español (priorizando variantes latinas)
   */
  getSpanishVoices() {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices() || [];
    }
    if (!this.voices || this.voices.length === 0) return [];

    const esVoices = this.voices.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('es') || lang.includes('es-') || lang.includes('es_');
    });

    const baseList = esVoices.length > 0 ? esVoices : this.voices.slice(0, 10);
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
   * Obtiene la lista de voces en inglés (priorizando US, UK, Canada, Australia)
   */
  getEnglishVoices() {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices() || [];
    }
    if (!this.voices || this.voices.length === 0) return [];

    const enVoices = this.voices.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('en') || lang.includes('en-') || lang.includes('en_');
    });

    const baseList = enVoices.length > 0 ? enVoices : this.voices.slice(0, 10);
    const priorityCodes = ['en-us', 'en-gb', 'en-ca', 'en-au'];

    return baseList.slice().sort((a, b) => {
      const langA = (a.lang || '').toLowerCase().replace('_', '-');
      const langB = (b.lang || '').toLowerCase().replace('_', '-');
      const pA = priorityCodes.findIndex(c => langA.startsWith(c));
      const pB = priorityCodes.findIndex(c => langB.startsWith(c));

      if (pA !== -1 && pB !== -1) return pA - pB;
      if (pA !== -1) return -1;
      if (pB !== -1) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }

  /**
   * Parsea metadatos de una voz para presentar nombre limpio, bandera y región
   */
  getVoiceDetails(voice) {
    const isEn = this.currentLang === 'en';
    if (!voice) {
      return {
        voice: null,
        name: 'Auto',
        lang: isEn ? 'en-US' : 'es-419',
        flag: isEn ? '🇺🇸' : '🌎',
        region: isEn ? 'United States' : 'Latinoamérica',
        cleanName: isEn ? 'English (Auto)' : 'Latina (Auto)',
        shortLabel: isEn ? '🇺🇸 US Auto' : '🌎 Latina',
        isSelected: true
      };
    }

    const lang = (voice.lang || '').toLowerCase().replace('_', '-');
    const rawName = voice.name || 'Voice';

    let flag = '🌐';
    let region = isEn ? 'English' : 'Español';

    // Voces en Español
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
      flag = '🇺🇸'; region = isEn ? 'US (Spanish)' : 'EE.UU. (Latino)';
    } else if (lang.includes('es-419') || rawName.toLowerCase().includes('latin')) {
      flag = '🌎'; region = isEn ? 'Latin America' : 'Latinoamérica';
    } else if (lang.includes('es-es') || rawName.toLowerCase().includes('spain') || rawName.toLowerCase().includes('españa')) {
      flag = '🇪🇸'; region = isEn ? 'Spain' : 'España';
    }
    // Voces en Inglés
    else if (lang.includes('en-us') || rawName.toLowerCase().includes('united states') || rawName.toLowerCase().includes('us english')) {
      flag = '🇺🇸'; region = isEn ? 'United States' : 'Estados Unidos';
    } else if (lang.includes('en-gb') || rawName.toLowerCase().includes('united kingdom') || rawName.toLowerCase().includes('uk english')) {
      flag = '🇬🇧'; region = isEn ? 'United Kingdom' : 'Reino Unido';
    } else if (lang.includes('en-ca') || rawName.toLowerCase().includes('canada')) {
      flag = '🇨🇦'; region = isEn ? 'Canada' : 'Canadá';
    } else if (lang.includes('en-au') || rawName.toLowerCase().includes('australia')) {
      flag = '🇦🇺'; region = 'Australia';
    } else if (lang.includes('en-in') || rawName.toLowerCase().includes('india')) {
      flag = '🇮🇳'; region = 'India';
    } else if (lang.includes('en-ie') || rawName.toLowerCase().includes('ireland')) {
      flag = '🇮🇪'; region = isEn ? 'Ireland' : 'Irlanda';
    }

    // Limpieza de prefijos comunes
    let cleanName = rawName
      .replace(/^Microsoft\s+/i, '')
      .replace(/\s+Desktop/i, '')
      .replace(/\s+-\s+Spanish\s*\(.*?\)/i, '')
      .replace(/\s+-\s+English\s*\(.*?\)/i, '')
      .replace(/\(Enhanced\)/i, '')
      .replace(/\(Premium\)/i, '')
      .replace(/Google\s+español\s+de\s+Estados\s+Unidos/i, 'Google Latino')
      .replace(/Google\s+US\s+English/i, 'Google US')
      .replace(/Google\s+UK\s+English/i, 'Google UK')
      .trim();

    if (!cleanName) cleanName = 'Voice ' + flag;

    const currentPref = this.getPreferredVoice();
    const isSelected = currentPref ? currentPref.name === voice.name : false;

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
    return this.getVoiceDetails(this.getPreferredVoice());
  }

  setVoiceByName(name) {
    if (!name) return null;
    const found = this.voices.find(v => v.name === name);
    if (found) {
      this.preferredVoices[this.currentLang] = found;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`orbita5_voice_name_${this.currentLang}`, found.name);
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
   * Cambia de forma cíclica a la siguiente voz del idioma activo
   */
  cycleNextVoice() {
    const list = this.getActiveVoices();
    if (!list || list.length === 0) return null;

    let currentIndex = -1;
    const currentPref = this.getPreferredVoice();
    if (currentPref) {
      currentIndex = list.findIndex(v => v.name === currentPref.name);
    }

    const nextIndex = (currentIndex + 1) % list.length;
    const nextVoice = list[nextIndex];
    const details = this.setVoiceByName(nextVoice.name);

    if (details) {
      const phrase = this.currentLang === 'en'
        ? `Voice changed to ${details.cleanName} from ${details.region}.`
        : `Voz cambiada a ${details.cleanName} de ${details.region}.`;
      this.speakText(phrase, 'voice-change');
    }

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
      const isVoiceEn = (voice.lang || '').toLowerCase().startsWith('en');
      const text = isVoiceEn
        ? `Hello Commander! I am the Mission Control voice from ${details.region}.`
        : `¡Hola Comandante! Soy la voz de Control de Misión de ${details.region}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang || (isVoiceEn ? 'en-US' : 'es-419');
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentTarget = 'preview';
        if (this.onStateChangeCallback) this.onStateChangeCallback(true, 'preview');
      };

      utterance.onend = utterance.onerror = () => {
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

    for (const code of latinPriorityCodes) {
      const match = voices.find(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        return lang === code || lang.startsWith(`${code}-`);
      });
      if (match) return match;
    }

    const nameMatch = voices.find(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      if (!lang.startsWith('es')) return false;
      return latinKeywords.some(kw => name.includes(kw));
    });
    if (nameMatch) return nameMatch;

    const nonSpainVoice = voices.find(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return lang.startsWith('es') && !lang.includes('es-es') && !name.includes('spain') && !name.includes('españa');
    });
    if (nonSpainVoice) return nonSpainVoice;

    return voices.find(v => (v.lang || '').toLowerCase().startsWith('es')) || null;
  }

  findBestEnglishVoice(voices) {
    if (!voices || voices.length === 0) return null;

    const usPriorityCodes = ['en-us'];
    const ukPriorityCodes = ['en-gb'];
    const preferredNames = ['samantha', 'alex', 'victoria', 'daniel', 'karen', 'oliver', 'serena', 'ava', 'allison'];

    // 1. Coincidencia por nombre preferido en inglés
    const nameMatch = voices.find(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      if (!lang.startsWith('en')) return false;
      return preferredNames.some(pn => name.includes(pn));
    });
    if (nameMatch) return nameMatch;

    // 2. Coincidencia por US English
    const usMatch = voices.find(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith('en-us'));
    if (usMatch) return usMatch;

    // 3. Coincidencia por UK English
    const ukMatch = voices.find(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith('en-gb'));
    if (ukMatch) return ukMatch;

    // 4. Cualquier voz en inglés
    return voices.find(v => (v.lang || '').toLowerCase().startsWith('en')) || null;
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
    if (!this.isSupported()) return;

    if (this.isSpeaking && this.currentTarget === 'mission') {
      this.stop();
      return;
    }

    const isEn = this.currentLang === 'en';
    const loc = window.i18n ? window.i18n.localizeEvent(event) : event;

    let text = isEn ? 'Mission Control Transmission. ' : 'Transmisión de Control de Misión. ';
    text += `${loc.title}. `;
    text += `${loc.description}. `;
    if (loc.scientificContext) {
      text += isEn ? `NASA scientific insight: ${loc.scientificContext}. ` : `Dato científico de la NASA: ${loc.scientificContext}. `;
    }
    text += isEn ? 'Commander, review the options to make a decision.' : 'Comandante, revisa las opciones para tomar una decisión.';

    this.speakText(text, 'mission');
  }

  speakOption(option, index) {
    if (!this.isSupported()) return;

    const targetKey = `option-${index}`;
    if (this.isSpeaking && this.currentTarget === targetKey) {
      this.stop();
      return;
    }

    const isEn = this.currentLang === 'en';
    const letter = String.fromCharCode(65 + index);

    let text = isEn ? `Option ${letter}: ${option.title}. ` : `Opción ${letter}: ${option.title}. `;
    text += isEn ? `Action: ${option.actionText}. ` : `Acción: ${option.actionText}. `;
    text += isEn ? `Benefit: ${option.gainText}. ` : `Ganancia: ${option.gainText}. `;
    text += isEn ? `Trade-off cost: ${option.costText}.` : `Costo o sacrificio: ${option.costText}.`;

    this.speakText(text, targetKey);
  }

  speakText(text, targetKey = 'generic') {
    this.stop();
    if (!this.synth) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      let voice = this.getPreferredVoice();

      if (!voice) {
        this.loadVoices();
        voice = this.getPreferredVoice();
      }

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || (this.currentLang === 'en' ? 'en-US' : 'es-419');
      } else {
        utterance.lang = this.currentLang === 'en' ? 'en-US' : 'es-419';
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
