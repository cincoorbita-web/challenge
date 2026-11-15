/**
 * ORBITA5: Game State Manager
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
    const isEn = typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';

    // ---- NIVEL 3: COMANDANTE (28 DÍAS) ----
    if (diff === 3) {
      if (day <= 3) {
        return {
          phase: isEn ? 'Lunar Polar Dawn' : 'Amanecer Polar Lunar',
          sunlight: '85%',
          temp: isEn ? '+45°C on illuminated ridges' : '+45°C en crestas iluminadas',
          icon: '🌅'
        };
      } else if (day <= 7) {
        return {
          phase: isEn ? 'Solar Noon (Eternal Peak Light)' : 'Mediodía Solar (Pico de Luz Eterna)',
          sunlight: '100%',
          temp: isEn ? '+105°C direct radiation' : '+105°C bajo radiación directa',
          icon: '☀️'
        };
      } else if (day <= 11) {
        return {
          phase: isEn ? 'High Solar Afternoon' : 'Tarde Solar Alta',
          sunlight: '90%',
          temp: isEn ? '+80°C on ridge' : '+80°C en la cresta',
          icon: '🌤️'
        };
      } else if (day === 12 || day === 13) {
        return {
          phase: isEn ? 'Polar Twilight (Low angle sun)' : 'Atardecer Polar (Sol rasante)',
          sunlight: '45%',
          temp: isEn ? '-15°C partial shadow' : '-15°C en sombra parcial',
          icon: '🌇'
        };
      } else if (day === 14) {
        return {
          phase: isEn ? 'Lunar Dusk (Last light)' : 'Crepúsculo Lunar (Última luz)',
          sunlight: '12%',
          temp: '-65°C',
          icon: '🌆'
        };
      } else if (day === 15) {
        return {
          phase: isEn ? 'TOTAL SUNSET!' : '¡PUESTA DE SOL TOTAL!',
          sunlight: '0%',
          temp: isEn ? '-110°C and dropping...' : '-110°C y bajando...',
          icon: '🌑'
        };
      } else if (day <= 21) {
        return {
          phase: isEn ? 'Deep Lunar Night' : 'Noche Lunar Profunda',
          sunlight: '0%',
          temp: '-173°C',
          icon: '🌑'
        };
      } else if (day <= 26) {
        return {
          phase: isEn ? 'Extreme Lunar Night (Coldest Point)' : 'Noche Lunar Extrema (Punto más frío)',
          sunlight: '0%',
          temp: isEn ? '-200°C in craters' : '-200°C en los cráteres',
          icon: '❄️'
        };
      } else {
        return {
          phase: isEn ? 'Pre-Dawn (Horizon Glow)' : 'Pre-Amanecer (Resplandor en el horizonte)',
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
          phase: isEn ? 'Continuous Solar Day (Peak Light)' : 'Día Solar Continuo (Pico de Luz)',
          sunlight: '100%',
          temp: isEn ? '+100°C direct radiation' : '+100°C bajo radiación directa',
          icon: '☀️'
        };
      } else if (day <= 6) {
        return {
          phase: isEn ? 'Sustained Polar Noon' : 'Mediodía Polar Sostenido',
          sunlight: '95%',
          temp: isEn ? '+85°C on ridge' : '+85°C en la cresta',
          icon: '☀️'
        };
      } else if (day <= 9) {
        return {
          phase: isEn ? 'Solar Afternoon (Declining angle)' : 'Tarde Solar (Ángulo descendente)',
          sunlight: '75%',
          temp: '+40°C',
          icon: '🌤️'
        };
      } else if (day <= 12) {
        return {
          phase: isEn ? 'Polar Twilight (Low angle sun)' : 'Atardecer Polar (Sol rasante)',
          sunlight: '40%',
          temp: isEn ? '-25°C partial shadow' : '-25°C en sombra parcial',
          icon: '🌇'
        };
      } else {
        return {
          phase: isEn ? 'Extended Twilight (Penumbra)' : 'Crepúsculo Extenso (Penumbra)',
          sunlight: '20%',
          temp: '-55°C',
          icon: '🌆'
        };
      }
    }

    // ---- NIVEL 1: CADETE (7 DÍAS) ----
    if (day <= 2) {
      return {
        phase: isEn ? 'Continuous Solar Day (Eternal Light)' : 'Día Solar Continuo (Luz Eterna)',
        sunlight: '100%',
        temp: isEn ? '+95°C direct radiation' : '+95°C bajo radiación directa',
        icon: '☀️'
      };
    } else if (day <= 4) {
      return {
        phase: isEn ? 'Polar Solar Noon' : 'Mediodía Solar Polar',
        sunlight: '95%',
        temp: isEn ? '+85°C on Shackleton ridge' : '+85°C en la cresta Shackleton',
        icon: '☀️'
      };
    } else if (day <= 6) {
      return {
        phase: isEn ? 'Stable Solar Afternoon' : 'Tarde Solar Estable',
        sunlight: '88%',
        temp: '+60°C',
        icon: '🌤️'
      };
    } else {
      return {
        phase: isEn ? 'High Departing Sun (Final Day)' : 'Sol Alto de Salida (Último día)',
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
    const isEn = typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';

    let o2Decay = 3, energyDecay = 3, healthDecay = 2, integrityDecay = 2;
    let o2Reason = isEn 
      ? 'Continuous breathing of 4 astronauts (~3.4 kg O2/day) and micro-leaks in airlocks.'
      : 'Respiración continua de los 4 astronautas (~3.4 kg O2/día) y micro-fugas en esclusas.';
    let energyReason = isEn
      ? 'Basic life support, ECLSS recyclers, thermal pumps and module heating.'
      : 'Soporte vital básico, recicladores ECLSS, bombas térmicas y calefacción.';
    let healthReason = isEn
      ? 'Biological wear in 1/6 g: bone demineralization (OSDR-120) and muscular fatigue.'
      : 'Desgaste biológico en 1/6 g: desmineralización ósea (OSDR-120) y fatiga muscular.';
    let integrityReason = isEn
      ? 'Micro-abrasion by electrostatic lunar regolith dust on airlock seals.'
      : 'Micro-abrasión por polvo de regolito electrostático en sellos de esclusas.';

    if (this.difficulty === 2) {
      // Especialista (14 días): consumo balanceado (~28% O2 en 14 días)
      o2Decay = 2;
      healthDecay = 2;
      integrityDecay = 1;
      if (this.currentDay >= 10) {
        energyDecay = 3;
        energyReason = isEn
          ? 'Polar twilight: reduced photovoltaic power; higher battery draw for thermal heaters.'
          : 'Atardecer polar: menor generación fotovoltaica; mayor uso de baterías para calefactores.';
      } else {
        energyDecay = 2;
        energyReason = isEn
          ? 'Standard life support operation and polar lighting for science modules.'
          : 'Operación estándar de soporte vital e iluminación polar de laboratorios.';
      }
      o2Reason = isEn
        ? 'Metabolic oxygen consumption with scheduled extravehicular activities.'
        : 'Consumo metabólico de O2 con caminatas extravehiculares periódicas.';
    } else if (this.difficulty === 3) {
      // Comandante (28 días): maratón de supervivencia
      if (this.currentDay >= 15) {
        o2Decay = 2;
        energyDecay = 3.5;
        healthDecay = 2;
        integrityDecay = 1;
        energyReason = isEn
          ? 'LUNAR NIGHT (-173°C to -200°C)! Solar panels at 0W. Thermal heaters heavily drain battery banks.'
          : '¡NOCHE LUNAR (-173°C a -200°C)! Paneles a 0W. Los calefactores térmicos consumen baterías.';
        healthReason = isEn
          ? 'Severe extreme cold stress, habitat confinement, and circadian disruption (OSDR-244).'
          : 'Estrés por frío extremo, confinamiento y desfase circadiano total (OSDR-244).';
        o2Reason = isEn
          ? 'Survival respiration mode inside the core pressurized module.'
          : 'Respiración en modo de supervivencia dentro del módulo presurizado central.';
      } else {
        o2Decay = 1;
        energyDecay = 1;
        healthDecay = 1;
        integrityDecay = 1;
        energyReason = isEn
          ? 'Continuous solar generation at the peak of light; preventive battery recharge before nightfall.'
          : 'Generación solar continua en el pico de luz; recarga preventiva de baterías para la noche.';
        o2Reason = isEn
          ? 'Sabatier recycling systems operating at maximum solar efficiency.'
          : 'Sistemas de reciclaje Sabatier funcionando con alta eficiencia solar.';
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
    const isEn = typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';

    const checks = isEn ? [
      { key: 'oxygen', system: 'LIFE SUPPORT (OXYGEN)', title: 'Asphyxiation from O2 Depletion',
        explanation: 'Oxygen reserves dropped to zero. The Orion capsule was automatically activated for emergency evacuation.',
        scienceLesson: 'In space, O2 leaks through every airlock cycle and is spent in experiments and fuel cells. Without lunar water electrolysis, every liter is irreplaceable!' },
      { key: 'energy', system: 'ELECTRICAL GRID & THERMAL HEATING', title: 'Thermal Blackout and Freezing',
        explanation: 'Batteries were completely drained. Without power, thermal heaters died and the habitat froze.',
        scienceLesson: 'The Moon has no atmosphere to retain heat. During the lunar night, temperatures plummet to -173°C. Heating the base consumes over 60% of reserve power.' },
      { key: 'health', system: 'CREW HEALTH & MEDICINE', title: 'Medical Crisis: Radiation and Exhaustion',
        explanation: 'The astronauts suffered a critical dose of cosmic radiation or severe fatigue and can no longer operate the habitat.',
        scienceLesson: 'Cosmic radiation and solar protons damage cells and compromise the human immune system. Without regolith shielding or adequate rest, human stay is unviable.' },
      { key: 'integrity', system: 'HABITAT STRUCTURE & HULL', title: 'Hull Breach from Regolith and Micrometeoroids',
        explanation: 'Seals wore out from abrasive lunar dust or a micrometeoroid breached the dome. The base lost pressurization.',
        scienceLesson: 'Lunar dust consists of razor-sharp volcanic glass shards that cut space fabrics and jam bearings unless repelled electrostatically.' }
    ] : [
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
    const isEn = typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';

    let rank, medal;
    if (this.gameResult === 'VICTORY') {
      if (finalScore > 1200) {
        rank = isEn ? 'Supreme Lunar Commander' : 'Comandante Supremo Lunar';
        medal = '🥇';
      } else if (finalScore > 750) {
        rank = isEn ? 'ORBITA5 Science Officer' : 'Oficial Científico ORBITA5';
        medal = '🥈';
      } else {
        rank = isEn ? 'Space Frontier Pioneer' : 'Pionero de la Frontera Espacial';
        medal = '🥉';
      }
    } else {
      rank = isEn ? 'Trainee Aspirant' : 'Aspirante en Entrenamiento';
      medal = '⚠️';
    }
    return { score: finalScore, rank, medal, daysSurvived: survivalDays, totalDays: this.totalDays, scienceCollected: this.resources.science, remainingAvgHealth: Math.round(avgResources) };
  }

  subscribe(listener) { this.listeners.push(listener); }
  notify() { this.listeners.forEach(fn => fn(this)); }
}

window.gameState = new GameState();
