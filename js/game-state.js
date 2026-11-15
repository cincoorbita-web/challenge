/**
 * Artemis Outpost: Game State Manager
 * Controla recursos vitales, escalado dinámico de puntos según dificultad,
 * ciclo de días lunares con condiciones ambientales dinámicas día a día,
 * y soporte para abortar misión o finalizar con éxito.
 */

class GameState {
  constructor() {
    this.playerName = 'Astronauta';
    this.difficulty = 1;
    this.totalDays = 7;
    this.currentDay = 1;
    this.resources = { oxygen: 100, energy: 100, health: 100, integrity: 100, science: 0 };
    this.history = [];
    this.isGameOver = false;
    this.gameResult = null;
    this.failureReason = null;
    this.listeners = [];
  }

  startMission(name, difficultyLevel) {
    this.playerName = name.trim() || 'Comandante Junior';
    this.difficulty = parseInt(difficultyLevel, 10) || 1;

    if (this.difficulty === 1) {
      this.totalDays = 7;
      this.resources = { oxygen: 100, energy: 100, health: 100, integrity: 100, science: 20 };
    } else if (this.difficulty === 2) {
      this.totalDays = 14;
      this.resources = { oxygen: 95, energy: 90, health: 95, integrity: 95, science: 10 };
    } else {
      this.totalDays = 28;
      this.resources = { oxygen: 95, energy: 95, health: 95, integrity: 95, science: 0 };
    }

    this.currentDay = 1;
    this.history = [];
    this.isGameOver = false;
    this.gameResult = null;
    this.failureReason = null;
    this.notify();
  }

  abortMission() {
    this.isGameOver = true;
    this.gameResult = 'ABORTED';
    this.history = [];
    this.notify();
  }

  // ========================================================================
  // ESCALADO DE PUNTOS SEGÚN NIVEL DE DIFICULTAD
  // En misiones largas (14 y 28 días), los costos de eventos no pueden ser
  // destructivos (-28% por evento en 28 días haría el juego matemáticamente
  // imposible). Se aplica un factor proporcional de escala.
  // ========================================================================
  getDifficultyMultiplier() {
    if (this.difficulty === 1) return 1.0;   // Cadete (7 días): impacto completo
    if (this.difficulty === 2) return 0.60;  // Especialista (14 días): impacto moderado
    return 0.35;                             // Comandante (28 días): maratón de resistencia
  }

  scaleDelta(rawDelta) {
    if (!rawDelta || typeof rawDelta !== 'object') {
      return { oxygen: 0, energy: 0, health: 0, integrity: 0, science: 0 };
    }
    const factor = this.getDifficultyMultiplier();
    const scaled = {};

    for (const [key, val] of Object.entries(rawDelta)) {
      if (val === 0) {
        scaled[key] = 0;
      } else if (key === 'science') {
        // La ciencia se mantiene íntegra o con ligero bonus para recompensar al jugador
        scaled[key] = Math.round(val);
      } else {
        const scaledVal = Math.round(val * factor);
        // Garantizar que si había costo o ganancia, no desaparezca completamente
        scaled[key] = (scaledVal === 0 && val !== 0) ? (val > 0 ? 1 : -1) : scaledVal;
      }
    }
    return scaled;
  }

  // ========================================================================
  // CONDICIONES AMBIENTALES DINÁMICAS DÍA A DÍA
  // Varían según la dificultad, el día actual y la posición solar real
  // en el Polo Sur Lunar (Cráter Shackleton / Montes Malapert).
  // ========================================================================
  getEnvironmentalStatus() {
    const day = this.currentDay;
    const diff = this.difficulty;

    // ---- NIVEL 3: COMANDANTE (28 DÍAS) ----
    if (diff === 3) {
      if (day <= 3) {
        return {
          phase: 'Amanecer Polar Lunar',
          sunlight: '85%',
          temp: '+45°C en crestas iluminadas',
          icon: '🌅'
        };
      } else if (day <= 7) {
        return {
          phase: 'Mediodía Solar (Pico de Luz Eterna)',
          sunlight: '100%',
          temp: '+105°C bajo radiación directa',
          icon: '☀️'
        };
      } else if (day <= 11) {
        return {
          phase: 'Tarde Solar Alta',
          sunlight: '90%',
          temp: '+80°C en la cresta',
          icon: '🌤️'
        };
      } else if (day === 12 || day === 13) {
        return {
          phase: 'Atardecer Polar (Sol rasante)',
          sunlight: '45%',
          temp: '-15°C en sombra parcial',
          icon: '🌇'
        };
      } else if (day === 14) {
        return {
          phase: 'Crepúsculo Lunar (Última luz)',
          sunlight: '12%',
          temp: '-65°C',
          icon: '🌆'
        };
      } else if (day === 15) {
        return {
          phase: '¡PUESTA DE SOL TOTAL!',
          sunlight: '0%',
          temp: '-110°C y bajando...',
          icon: '🌑'
        };
      } else if (day <= 21) {
        return {
          phase: 'Noche Lunar Profunda',
          sunlight: '0%',
          temp: '-173°C',
          icon: '🌑'
        };
      } else if (day <= 26) {
        return {
          phase: 'Noche Lunar Extrema (Punto más frío)',
          sunlight: '0%',
          temp: '-200°C en los cráteres',
          icon: '❄️'
        };
      } else {
        return {
          phase: 'Pre-Amanecer (Resplandor en el horizonte)',
          sunlight: '5%',
          temp: '-140°C',
          icon: '🌒'
        };
      }
    }

    // ---- NIVEL 2: ESPECIALISTA (14 DÍAS) ----
    if (diff === 2) {
      if (day <= 3) {
        return {
          phase: 'Día Solar Continuo (Pico de Luz)',
          sunlight: '100%',
          temp: '+100°C bajo radiación directa',
          icon: '☀️'
        };
      } else if (day <= 6) {
        return {
          phase: 'Mediodía Polar Sostenido',
          sunlight: '95%',
          temp: '+85°C en la cresta',
          icon: '☀️'
        };
      } else if (day <= 9) {
        return {
          phase: 'Tarde Solar (Ángulo descendente)',
          sunlight: '75%',
          temp: '+40°C',
          icon: '🌤️'
        };
      } else if (day <= 12) {
        return {
          phase: 'Atardecer Polar (Sol rasante)',
          sunlight: '40%',
          temp: '-25°C en sombra parcial',
          icon: '🌇'
        };
      } else {
        return {
          phase: 'Crepúsculo Extenso (Penumbra)',
          sunlight: '20%',
          temp: '-55°C',
          icon: '🌆'
        };
      }
    }

    // ---- NIVEL 1: CADETE (7 DÍAS) ----
    if (day <= 2) {
      return {
        phase: 'Día Solar Continuo (Luz Eterna)',
        sunlight: '100%',
        temp: '+95°C bajo radiación directa',
        icon: '☀️'
      };
    } else if (day <= 4) {
      return {
        phase: 'Mediodía Solar Polar',
        sunlight: '95%',
        temp: '+85°C en la cresta Shackleton',
        icon: '☀️'
      };
    } else if (day <= 6) {
      return {
        phase: 'Tarde Solar Estable',
        sunlight: '88%',
        temp: '+60°C',
        icon: '🌤️'
      };
    } else {
      return {
        phase: 'Sol Alto de Salida (Último día)',
        sunlight: '92%',
        temp: '+75°C',
        icon: '🌤️'
      };
    }
  }

  // Aplica un cambio de recursos con clamping 0-100% y registra antes/después
  applyResourceDelta(delta, decisionTitle, scientificContext) {
    const prev = { ...this.resources };

    if (delta.oxygen !== undefined) this.resources.oxygen = Math.max(0, Math.min(100, this.resources.oxygen + delta.oxygen));
    if (delta.energy !== undefined) this.resources.energy = Math.max(0, Math.min(100, this.resources.energy + delta.energy));
    if (delta.health !== undefined) this.resources.health = Math.max(0, Math.min(100, this.resources.health + delta.health));
    if (delta.integrity !== undefined) this.resources.integrity = Math.max(0, Math.min(100, this.resources.integrity + delta.integrity));
    if (delta.science !== undefined) this.resources.science = Math.max(0, this.resources.science + delta.science);

    const actualChanges = {
      oxygen: this.resources.oxygen - prev.oxygen,
      energy: this.resources.energy - prev.energy,
      health: this.resources.health - prev.health,
      integrity: this.resources.integrity - prev.integrity,
      science: this.resources.science - prev.science
    };

    const record = {
      day: this.currentDay,
      title: decisionTitle || 'Operación de Puesto Avanzado',
      context: scientificContext || '',
      requestedDelta: { ...delta },
      actualChanges,
      before: prev,
      after: { ...this.resources }
    };

    this.history.push(record);
    this.checkGameConditions();
    this.notify();
    return record;
  }

  // ========================================================================
  // PLAN PEDAGÓGICO DE CONSUMO DIARIO
  // Equilibrado con rigor para que Especialista y Comandante sean desafiantes
  // pero perfectamente viables y justos.
  // ========================================================================
  getDailyDecayPlan() {
    let o2Decay = 3, energyDecay = 3, healthDecay = 2, integrityDecay = 2;
    let o2Reason = 'Respiración continua de los 4 astronautas (~3.4 kg O2/día) y micro-fugas en esclusas.';
    let energyReason = 'Soporte vital básico, recicladores ECLSS, bombas térmicas y calefacción.';
    let healthReason = 'Desgaste biológico en 1/6 g: desmineralización ósea (OSDR-120) y fatiga muscular.';
    let integrityReason = 'Micro-abrasión por polvo de regolito electrostático en sellos de esclusas.';

    if (this.difficulty === 2) {
      // Especialista (14 días): consumo balanceado (~28% O2 en 14 días)
      o2Decay = 2;
      healthDecay = 2;
      integrityDecay = 1;
      if (this.currentDay >= 10) {
        energyDecay = 3;
        energyReason = 'Atardecer polar: menor generación fotovoltaica; mayor uso de baterías para calefactores.';
      } else {
        energyDecay = 2;
        energyReason = 'Operación estándar de soporte vital e iluminación polar de laboratorios.';
      }
      o2Reason = 'Consumo metabólico de O2 con caminatas extravehiculares periódicas.';
    } else if (this.difficulty === 3) {
      // Comandante (28 días): maratón de supervivencia
      if (this.currentDay >= 15) {
        o2Decay = 2;
        energyDecay = 3.5;
        healthDecay = 2;
        integrityDecay = 1;
        energyReason = '¡NOCHE LUNAR (-173°C a -200°C)! Paneles a 0W. Los calefactores térmicos consumen baterías.';
        healthReason = 'Estrés por frío extremo, confinamiento y desfase circadiano total (OSDR-244).';
        o2Reason = 'Respiración en modo de supervivencia dentro del módulo presurizado central.';
      } else {
        o2Decay = 1;
        energyDecay = 1;
        healthDecay = 1;
        integrityDecay = 1;
        energyReason = 'Generación solar continua en el pico de luz; recarga preventiva de baterías para la noche.';
        o2Reason = 'Sistemas de reciclaje Sabatier funcionando con alta eficiencia solar.';
      }
    }

    return {
      rates: {
        oxygen: Math.round(o2Decay),
        energy: Math.round(energyDecay),
        health: Math.round(healthDecay),
        integrity: Math.round(integrityDecay)
      },
      reasons: { oxygen: o2Reason, energy: energyReason, health: healthReason, integrity: integrityReason }
    };
  }

  applyDailyDecay() {
    const plan = this.getDailyDecayPlan();
    return this.applyResourceDelta(
      {
        oxygen: -plan.rates.oxygen,
        energy: -plan.rates.energy,
        health: -plan.rates.health,
        integrity: -plan.rates.integrity,
        science: 0
      },
      `Consumo Diario de Supervivencia - Día ${this.currentDay}`,
      'Metabolismo de la tripulación, calefacción térmica y desgaste abrasivo de regolito.'
    );
  }

  advanceDay() {
    if (this.isGameOver) return;
    this.currentDay++;
    if (this.currentDay > this.totalDays) {
      this.isGameOver = true;
      this.gameResult = 'VICTORY';
    }
    this.checkGameConditions();
    this.notify();
  }

  checkGameConditions() {
    if (this.isGameOver) return;
    const checks = [
      { key: 'oxygen', system: 'SOPORTE VITAL (OXÍGENO)', title: 'Asfixia por Agotamiento de O2',
        explanation: 'Las reservas de oxígeno cayeron a cero. Se activó la cápsula Orion para evacuación de emergencia.',
        scienceLesson: 'En el espacio, el O2 se fuga en cada esclusa y se gasta en experimentos y celdas de combustible. Sin electrólisis de agua lunar, ¡cada litro es irreemplazable!' },
      { key: 'energy', system: 'RED ELÉCTRICA Y CALEFACCIÓN', title: 'Apagón Térmico y Congelamiento',
        explanation: 'Las baterías se agotaron por completo. Sin energía, los calefactores murieron y la base cayó en congelamiento extremo.',
        scienceLesson: 'La Luna no tiene atmósfera que retenga el calor. En la noche lunar, la temperatura cae a -173°C. Calentar la base consume más del 60% de la energía de reserva.' },
      { key: 'health', system: 'SALUD DE LA TRIPULACIÓN', title: 'Crisis Médica por Radiación y Agotamiento',
        explanation: 'Los astronautas sufrieron una dosis crítica de radiación cósmica o fatiga severa. No pueden continuar operando el hábitat.',
        scienceLesson: 'La radiación cósmica y las partículas solares dañan las células y debilitan el sistema inmune. Sin escudos de regolito o descanso adecuado, la estancia humana es inviable.' },
      { key: 'integrity', system: 'ESTRUCTURA DEL HÁBITAT', title: 'Brecha de Casco por Regolito y Micrometeoritos',
        explanation: 'Los sellos se desgastaron por el polvo lunar afilado o un micrometeorito perforó la cúpula. La base perdió presurización.',
        scienceLesson: 'El polvo lunar es vidrio volcánico afilado que corta telas espaciales y traba los rodamientos si no se limpia con repelentes electrostáticos.' }
    ];

    for (const c of checks) {
      if (this.resources[c.key] <= 0) {
        this.isGameOver = true;
        this.gameResult = 'DEFEAT';
        this.failureReason = c;
        this.notify();
        return;
      }
    }
  }

  calculateFinalScore() {
    const survivalDays = Math.min(this.currentDay, this.totalDays);
    const avgResources = (this.resources.oxygen + this.resources.energy + this.resources.health + this.resources.integrity) / 4;
    const mult = this.difficulty === 1 ? 1.0 : this.difficulty === 2 ? 1.5 : 2.2;
    const finalScore = Math.round((this.resources.science * 2 + avgResources * 5 + survivalDays * 30) * mult);

    let rank, medal;
    if (this.gameResult === 'VICTORY') {
      if (finalScore > 1200) { rank = 'Comandante Supremo Lunar'; medal = '🥇'; }
      else if (finalScore > 750) { rank = 'Oficial Científico Artemis'; medal = '🥈'; }
      else { rank = 'Pionero de la Frontera Espacial'; medal = '🥉'; }
    } else {
      rank = 'Aspirante en Entrenamiento'; medal = '⚠️';
    }
    return { score: finalScore, rank, medal, daysSurvived: survivalDays, totalDays: this.totalDays, scienceCollected: this.resources.science, remainingAvgHealth: Math.round(avgResources) };
  }

  subscribe(listener) { this.listeners.push(listener); }
  notify() { this.listeners.forEach(fn => fn(this)); }
}

window.gameState = new GameState();
