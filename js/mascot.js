/**
 * ORBITA5: Mascot Companion Controller ("AstroCan")
 * Gestiona los 7 estados emocionales del cachorro astronauta según
 * las decisiones del usuario, eventos solares, estado de recursos y fin de misión.
 */

class AstroMascot {
  constructor() {
    this.name = 'AstroCan';
    this.currentEmotion = 'greeting';

    this.emotions = {
      greeting: {
        img: 'assets/mascot/greeting.jpg',
        title: '¡Hola, Comandante!',
        defaultMsg: '¡Soy AstroCan! Tu copiloto en el Puesto Avanzado Lunar. ¡Listo para la misión!',
        borderClass: 'mascot-border-normal'
      },
      thinking: {
        img: 'assets/mascot/thinking.jpg',
        title: 'Analizando opciones...',
        defaultMsg: 'Mmm... en el espacio profundo ninguna decisión es gratis. ¿Qué deberíamos priorizar?',
        borderClass: 'mascot-border-thinking'
      },
      scared: {
        img: 'assets/mascot/scared.jpg',
        title: '¡Alerta en la Base!',
        defaultMsg: '¡Cuidado, Comandante! ¡La radiación solar o una falla crítica amenaza el hábitat!',
        borderClass: 'mascot-border-danger'
      },
      worried: {
        img: 'assets/mascot/worried.jpg',
        title: 'Situación delicada...',
        defaultMsg: 'Uff... ese sacrificio nos costó bastante. Habrá que vigilar de cerca las reservas.',
        borderClass: 'mascot-border-warning'
      },
      relaxed: {
        img: 'assets/mascot/relaxed.jpg',
        title: 'Todo bajo control',
        defaultMsg: '¡Excelente maniobra! Los sistemas están estables y podemos continuar con seguridad.',
        borderClass: 'mascot-border-success'
      },
      celebrating: {
        img: 'assets/mascot/celebrating.jpg',
        title: '¡Genial, Comandante!',
        defaultMsg: '¡Síiii! ¡Un avance científico histórico y la tripulación está a salvo!',
        borderClass: 'mascot-border-celebrating'
      },
      crying: {
        img: 'assets/mascot/crying.jpg',
        title: '¡Emergencia Crítica!',
        defaultMsg: '¡Oh no! Las reservas cayeron a cero... ¡activando cápsula de retorno de emergencia!',
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

  setEmotion(emotionKey, customMessage = null) {
    const data = this.emotions[emotionKey] || this.emotions.greeting;
    this.currentEmotion = emotionKey;
    const msg = customMessage || data.defaultMsg;

    // Actualizar avatares
    this.avatarElements.forEach(img => {
      img.src = data.img;
      img.alt = `${this.name}: ${data.title}`;
      img.classList.remove('mascot-pop');
      void img.offsetWidth; // Reflow para reiniciar animación
      img.classList.add('mascot-pop');
    });

    // Actualizar globos de diálogo
    this.bubbleElements.forEach(bubble => {
      bubble.textContent = msg;
      bubble.classList.remove('bubble-pop');
      void bubble.offsetWidth;
      bubble.classList.add('bubble-pop');
    });
  }

  // Reacción inicial al presentar un nuevo evento
  reactToEvent(event) {
    if (event.isSolarEvent) {
      this.setEmotion('scared', '¡Alerta de tormenta solar DONKI! ¡Protones de alta energía acercándose al cráter!');
    } else if (event.category === 'OSDR_BIO_RESEARCH') {
      this.setEmotion('thinking', 'Un estudio biológico de la NASA... ¿sacrificamos oxígeno o energía para la investigación?');
    } else if (event.category === 'LUNAR_GEOLOGY') {
      this.setEmotion('thinking', '¡El hielo del cráter Shackleton es oro puro para el puesto lunar! Pensemos en los riesgos.');
    } else {
      this.setEmotion('thinking', 'Nueva transmisión de la Tierra. Revisa bien las ganancias y costos antes de ordenar.');
    }
  }

  // Reacción a una orden ejecutada y balance de recursos
  reactToDelta(actualChanges, currentResources) {
    // Si algún recurso vital está en nivel de alarma crítica (<= 20%)
    const isCritical = currentResources.oxygen <= 20 ||
                       currentResources.energy <= 20 ||
                       currentResources.health <= 20 ||
                       currentResources.integrity <= 20;

    if (isCritical) {
      this.setEmotion('scared', '¡Peligro! Uno de nuestros sistemas vitales cayó a nivel de emergencia. ¡Necesitamos recuperarlo!');
      return;
    }

    // Gran avance en ciencia o recolección
    if (actualChanges.science >= 20 || (actualChanges.oxygen > 10 && actualChanges.energy >= 0)) {
      this.setEmotion('celebrating', '¡Gran acierto, Comandante! ¡Sumamos valiosos descubrimientos para la misión ORBITA5!');
      return;
    }

    // Costo severo en energía o salud
    if (actualChanges.energy <= -15 || actualChanges.health <= -15 || actualChanges.oxygen <= -15) {
      this.setEmotion('worried', 'Uff... ese sacrificio nos dejó tocados, pero fue necesario para la supervivencia.');
      return;
    }

    // Si los recursos están en niveles confortables (> 60%)
    if (currentResources.oxygen >= 60 && currentResources.energy >= 50 && currentResources.health >= 60) {
      this.setEmotion('relaxed', '¡Nuestras reservas están estables! Buen balance de mando, Comandante.');
      return;
    }

    this.setEmotion('relaxed', 'Orden registrada con éxito en el computador central.');
  }

  // Reacción al consumo diario de supervivencia
  reactToDailyDecay(plan, resources) {
    if (resources.energy <= 25) {
      this.setEmotion('scared', '¡Nuestras baterías están temblando! En la noche lunar necesitaremos calor sí o sí.');
    } else if (resources.oxygen <= 25) {
      this.setEmotion('worried', 'El consumo de O2 fue alto hoy. La tripulación necesita respirar con cuidado.');
    } else {
      this.setEmotion('relaxed', 'Día superado. La base consumió lo esperado para mantener con vida a los astronautas.');
    }
  }

  // Reacción a fin de misión
  reactToGameOver(isVictory) {
    if (isVictory) {
      this.setEmotion('celebrating', '¡VIVAAA! ¡Misión cumplida en el Polo Sur Lunar! ¡Eres el mejor Comandante de la galaxia!');
    } else {
      this.setEmotion('crying', '¡Oh no! Tuvimos que evacuar la base... ¡Pero aprendimos mucho y la próxima lo lograremos!');
    }
  }
}

window.astroMascot = new AstroMascot();
