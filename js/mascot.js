/**
 * ORBITA5: Mascot Companion Controller ("AstroCan")
 * Gestiona los 7 estados emocionales del cachorro astronauta según
 * las decisiones del usuario, eventos solares, estado de recursos y fin de misión.
 * Con soporte bilingüe (Español / Inglés).
 */

class AstroMascot {
  constructor() {
    this.name = 'AstroCan';
    this.currentEmotion = 'greeting';
    this.lastMessage = null;

    this.emotions = {
      greeting: {
        img: 'assets/mascot/greeting.jpg',
        title: '¡Hola, Comandante!',
        defaultMsgKey: 'mascot_greeting',
        borderClass: 'mascot-border-normal'
      },
      thinking: {
        img: 'assets/mascot/thinking.jpg',
        title: 'Analizando opciones...',
        defaultMsgKey: 'mascot_thinking',
        borderClass: 'mascot-border-thinking'
      },
      scared: {
        img: 'assets/mascot/scared.jpg',
        title: '¡Alerta en la Base!',
        defaultMsgKey: 'mascot_scared',
        borderClass: 'mascot-border-danger'
      },
      worried: {
        img: 'assets/mascot/worried.jpg',
        title: 'Situación delicada...',
        defaultMsgKey: 'mascot_worried',
        borderClass: 'mascot-border-warning'
      },
      relaxed: {
        img: 'assets/mascot/relaxed.jpg',
        title: 'Todo bajo control',
        defaultMsgKey: 'mascot_relaxed',
        borderClass: 'mascot-border-success'
      },
      celebrating: {
        img: 'assets/mascot/celebrating.jpg',
        title: '¡Genial, Comandante!',
        defaultMsgKey: 'mascot_celebrating',
        borderClass: 'mascot-border-celebrating'
      },
      crying: {
        img: 'assets/mascot/crying.jpg',
        title: '¡Emergencia Crítica!',
        defaultMsgKey: 'mascot_crying',
        borderClass: 'mascot-border-danger'
      }
    };

    // Colección de elementos DOM suscritos
    this.avatarElements = [];
    this.bubbleElements = [];
  }

  registerElements(avatarSelectors, bubbleSelectors) {
    this.avatarElements = avatarSelectors
      .map(sel => typeof sel === 'string' ? document.querySelector(sel) : sel)
      .filter(Boolean);

    this.bubbleElements = bubbleSelectors
      .map(sel => typeof sel === 'string' ? document.querySelector(sel) : sel)
      .filter(Boolean);
  }

  isEn() {
    return typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';
  }

  setEmotion(emotionKey, customMessage = null) {
    const data = this.emotions[emotionKey] || this.emotions.greeting;
    this.currentEmotion = emotionKey;

    let msg = customMessage;
    if (!msg) {
      if (typeof window !== 'undefined' && window.i18n) {
        msg = window.i18n.t(data.defaultMsgKey);
      } else {
        msg = '¡Hola, Comandante! Listo para la misión lunar.';
      }
    }
    this.lastMessage = msg;

    // Mapa de clases de animación Hero según el estado emocional
    const heroClassMap = {
      greeting: 'mascot-hero-greeting',
      celebrating: 'mascot-hero-celebrating',
      scared: 'mascot-hero-scared',
      crying: 'mascot-hero-crying',
      thinking: 'mascot-hero-thinking',
      worried: 'mascot-hero-worried',
      relaxed: 'mascot-hero-relaxed'
    };
    const heroClass = heroClassMap[emotionKey] || 'mascot-hero-pop';

    const allHeroClasses = [
      'mascot-pop',
      'mascot-hero-pop',
      'mascot-hero-greeting',
      'mascot-hero-celebrating',
      'mascot-hero-scared',
      'mascot-hero-crying',
      'mascot-hero-thinking',
      'mascot-hero-worried',
      'mascot-hero-relaxed'
    ];

    // Actualizar avatares con Hero Animation
    this.avatarElements.forEach(img => {
      img.src = data.img;
      img.alt = `${this.name}: ${data.title}`;
      img.classList.remove(...allHeroClasses);
      void img.offsetWidth; // Reflow para reiniciar animación
      img.classList.add(heroClass);

      // Asignar atributo de emoción al contenedor para auras dinámicas
      const container = img.closest('.mascot-avatar-container') || img.parentElement;
      if (container) {
        container.setAttribute('data-emotion', emotionKey);
      }
    });

    // Actualizar globos de diálogo con Hero Pop
    this.bubbleElements.forEach(bubble => {
      bubble.textContent = msg;
      bubble.classList.remove('bubble-pop', 'bubble-hero-pop');
      void bubble.offsetWidth;
      bubble.classList.add('bubble-hero-pop');
    });

    // Actualizar caja de la mascota en el sidebar si existe
    const sidebarBox = document.querySelector('.sidebar-mascot-box');
    if (sidebarBox) {
      sidebarBox.setAttribute('data-emotion', emotionKey);
    }
  }

  // Reacción inicial al presentar un nuevo evento
  reactToEvent(event) {
    const isEn = this.isEn();
    if (event.isSolarEvent) {
      this.setEmotion(
        'scared',
        isEn
          ? 'DONKI solar storm alert! High-energy solar protons heading towards the crater!'
          : '¡Alerta de tormenta solar DONKI! ¡Protones de alta energía acercándose al cráter!'
      );
    } else if (event.category === 'OSDR_BIO_RESEARCH') {
      this.setEmotion(
        'thinking',
        isEn
          ? 'A NASA biological study... should we sacrifice oxygen or energy for science?'
          : 'Un estudio biológico de la NASA... ¿sacrificamos oxígeno o energía para la investigación?'
      );
    } else if (event.category === 'LUNAR_GEOLOGY') {
      this.setEmotion(
        'thinking',
        isEn
          ? 'Shackleton crater ice is pure gold for our outpost! Let\'s weigh the risks.'
          : '¡El hielo del cráter Shackleton es oro puro para el puesto lunar! Pensemos en los riesgos.'
      );
    } else {
      this.setEmotion(
        'thinking',
        isEn
          ? 'New transmission from Earth. Check the trade-offs and benefits before ordering.'
          : 'Nueva transmisión de la Tierra. Revisa bien las ganancias y costos antes de ordenar.'
      );
    }
  }

  // Reacción a una orden ejecutada y balance de recursos
  reactToDelta(actualChanges, currentResources) {
    const isEn = this.isEn();

    // Si algún recurso vital está en nivel de alarma crítica (<= 20%)
    const isCritical = currentResources.oxygen <= 20 ||
                       currentResources.energy <= 20 ||
                       currentResources.health <= 20 ||
                       currentResources.integrity <= 20;

    if (isCritical) {
      this.setEmotion(
        'scared',
        isEn
          ? 'Danger! One of our life-support systems dropped to emergency levels. We need to recover it!'
          : '¡Peligro! Uno de nuestros sistemas vitales cayó a nivel de emergencia. ¡Necesitamos recuperarlo!'
      );
      return;
    }

    // Gran avance en ciencia o recolección
    if (actualChanges.science >= 20 || (actualChanges.oxygen > 10 && actualChanges.energy >= 0)) {
      this.setEmotion(
        'celebrating',
        isEn
          ? 'Great breakthrough, Commander! Vital discoveries added to the ORBITA5 mission!'
          : '¡Gran acierto, Comandante! ¡Sumamos valiosos descubrimientos para la misión ORBITA5!'
      );
      return;
    }

    // Costo severo en energía o salud
    if (actualChanges.energy <= -15 || actualChanges.health <= -15 || actualChanges.oxygen <= -15) {
      this.setEmotion(
        'worried',
        isEn
          ? 'Oof... that sacrifice took a heavy toll, but it was necessary for survival.'
          : 'Uff... ese sacrificio nos dejó tocados, pero fue necesario para la supervivencia.'
      );
      return;
    }

    // Si los recursos están en niveles confortables (> 60%)
    if (currentResources.oxygen >= 60 && currentResources.energy >= 50 && currentResources.health >= 60) {
      this.setEmotion(
        'relaxed',
        isEn
          ? 'Our supplies are stable! Good leadership balance, Commander.'
          : '¡Nuestras reservas están estables! Buen balance de mando, Comandante.'
      );
      return;
    }

    this.setEmotion(
      'relaxed',
      isEn
        ? 'Order recorded successfully in the main computer.'
        : 'Orden registrada con éxito en el computador central.'
    );
  }

  // Reacción al consumo diario de supervivencia
  reactToDailyDecay(plan, resources) {
    const isEn = this.isEn();
    if (resources.energy <= 25) {
      this.setEmotion(
        'scared',
        isEn
          ? 'Our batteries are trembling! In the lunar night, we will need heat no matter what.'
          : '¡Nuestras baterías están temblando! En la noche lunar necesitaremos calor sí o sí.'
      );
    } else if (resources.oxygen <= 25) {
      this.setEmotion(
        'worried',
        isEn
          ? 'Oxygen consumption was high today. The crew needs to breathe carefully.'
          : 'El consumo de O2 fue alto hoy. La tripulación necesita respirar con cuidado.'
      );
    } else {
      this.setEmotion(
        'relaxed',
        isEn
          ? 'Day survived. The base consumed what was expected to keep the astronauts alive.'
          : 'Día superado. La base consumió lo esperado para mantener con vida a los astronautas.'
      );
    }
  }

  // Reacción a fin de misión
  reactToGameOver(isVictory) {
    const isEn = this.isEn();
    if (isVictory) {
      this.setEmotion(
        'celebrating',
        isEn
          ? 'HOORAY! Mission accomplished at the Lunar South Pole! Best Commander in the galaxy!'
          : '¡VIVAAA! ¡Misión cumplida en el Polo Sur Lunar! ¡Eres el mejor Comandante de la galaxia!'
      );
    } else {
      this.setEmotion(
        'crying',
        isEn
          ? 'Oh no! We had to evacuate the base... But we learned a lot and next time we will make it!'
          : '¡Oh no! Tuvimos que evacuar la base... ¡Pero aprendimos mucho y la próxima lo lograremos!'
      );
    }
  }
}

window.astroMascot = new AstroMascot();
