/**
 * Artemis Outpost: Mission Dilemmas & Trade-Off Events
 * Cada evento incluye la fuente de datos NASA oficial de donde proviene.
 */

class MissionEventManager {
  constructor() {
    this.eventDeck = [];
    this.usedEventIds = new Set();
    this.initDeck();
  }

  initDeck() {
    this.eventDeck = [
      {
        id: 'EV_DONKI_SOLAR_STORM',
        category: 'DONKI_SPACE_WEATHER',
        tag: 'ALERTA SOLAR DONKI',
        title: '¡Tormenta Solar Detectada!',
        sender: 'Centro de Clima Espacial NASA (SWPC)',
        description: 'Una Eyección de Masa Coronal (CME) viaja a 1,250 km/s hacia la Luna. Sin campo magnético lunar, los protones impactarán el hábitat en 2 horas.',
        scientificContext: 'En la Tierra, la magnetosfera y la atmósfera nos protegen. En la Luna, los astronautas dependen de escudos de regolito y campos electromagnéticos.',
        dataSource: {
          name: 'NASA DONKI (Space Weather Database)',
          url: 'https://api.nasa.gov/DONKI',
          detail: 'Eventos CME reales monitoreados por SDO, SOHO y ACE'
        },
        isSolarEvent: true,
        options: [
          {
            title: 'Reforzar Blindaje al 100%',
            actionText: 'Desviar energía de calefactores al escudo electromagnético.',
            gainText: '+10 Ciencia, Salud protegida (0 daño)',
            costText: '-28% Energía (la base pasará frío)',
            delta: { energy: -28, health: 0, integrity: 0, science: 10, oxygen: 0 },
            feedback: '¡Tripulación protegida en el búnker de regolito! Pero los calefactores se apagaron y el circuito de agua secundario se enfrió (-28% Energía).'
          },
          {
            title: 'Refugio Pasivo (Ahorrar Energía)',
            actionText: 'Mantener calefactores activos; la tripulación usará chalecos de agua.',
            gainText: 'Energía intacta para la noche',
            costText: '-22% Salud (dosis de radiación)',
            delta: { energy: 0, health: -22, integrity: 0, science: 0, oxygen: 0 },
            feedback: 'Electricidad conservada, pero los dosímetros registran 90 mSv de radiación ionizante en la tripulación (-22% Salud).'
          },
          {
            title: '🎮 Calibrar Escudo Manual',
            actionText: 'Microjuego: ajusta los deslizadores de energía contra reloj.',
            isMinigame: 'shield',
            gainText: 'Equilibrar según tu habilidad',
            costText: 'Riesgo si tardas demasiado',
            feedback: 'Iniciando protocolo de desvío...'
          }
        ]
      },
      {
        id: 'EV_OSDR_PLANT_O2',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'BIO-LABORATORIO OSDR',
        title: 'Dilema del Invernadero Lunar',
        sender: 'Dra. Ellen (Botánica Espacial)',
        description: 'Las semillas de Arabidopsis germinaron en regolito lunar, pero necesitan una purga de O2 enriquecido hacia las campanas de cultivo para sobrevivir.',
        scientificContext: 'OSDR-379: En 2022 se cultivaron plantas en suelo lunar de Apolo 11, 12 y 17 por primera vez. Sobreviven con genes de estrés activos.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-379',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-379',
          detail: 'Cultivo de Arabidopsis thaliana en regolito lunar auténtico'
        },
        options: [
          {
            title: 'Sacrificar O2 para las Plantas',
            actionText: 'Abrir válvulas de O2 al invernadero.',
            gainText: '+45 Ciencia (descubrimiento histórico)',
            costText: '-18% Oxígeno de la tripulación',
            delta: { oxygen: -18, science: 45, energy: 0, health: 0, integrity: 0 },
            feedback: '¡Las plantas florecieron en regolito! Datos invaluables para la NASA, pero los astronautas racionarán aire los próximos días (-18% O2).'
          },
          {
            title: 'Priorizar el Aire Humano',
            actionText: 'Cerrar el invernadero y sellar los depósitos.',
            gainText: 'Oxígeno 100% protegido',
            costText: '0 Ciencia (el cultivo muere)',
            delta: { oxygen: 0, science: 0, energy: 0, health: 0, integrity: 0 },
            feedback: 'Vida humana primero. Los tanques de O2 están seguros, pero se perdió la cosecha experimental de la NASA.'
          }
        ]
      },
      {
        id: 'EV_ICE_MINING_EXPEDITION',
        category: 'LUNAR_GEOLOGY',
        tag: 'GEOLOGÍA LUNAR POLAR',
        title: 'Expedición al Cráter Shackleton',
        sender: 'Ingeniero Robótico de Misión',
        description: 'El cráter tiene zonas de sombra eterna con hielo de agua pura. Necesitamos agua para beber y electrólisis de oxígeno, pero el rover se arriesga a -230°C.',
        scientificContext: 'La misión LCROSS demostró millones de toneladas de hielo en cráteres oscuros lunares. Descender congela lubricantes y el regolito destruye las ruedas.',
        dataSource: {
          name: 'NASA LCROSS & Lunar Reconnaissance Orbiter',
          url: 'https://www.nasa.gov/mission/lcross-702/',
          detail: 'Confirmación de hielo en zonas de sombra permanente (PSR)'
        },
        options: [
          {
            title: '🎮 Conducir el Rover Minero',
            actionText: 'Microjuego: navega en el cráter oscuro recolectando hielo.',
            isMinigame: 'rover',
            gainText: 'Hasta +40% O2 según hielo recolectado',
            costText: 'Batería y chasis en riesgo',
            feedback: 'Desplegando Rover Polar...'
          },
          {
            title: 'Racionar Agua con ECLSS',
            actionText: 'No enviar el rover; racionamiento estricto de agua.',
            gainText: 'Rover protegido, +5 Ciencia',
            costText: '-12% Salud (agua racionada)',
            delta: { health: -12, energy: 0, oxygen: 0, integrity: 0, science: 5 },
            feedback: 'Rover a salvo, pero la tripulación bebe agua reciclada al límite y se ducha con toallitas (-12% Salud).'
          }
        ]
      },
      {
        id: 'EV_OSDR_BONE_EXERCISE',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'MEDICINA OSDR',
        title: 'Alerta de Pérdida Ósea (1/6 g)',
        sender: 'Director Médico de Vuelo',
        description: 'Los sensores biomédicos detectan pérdida de calcio. En gravedad lunar el cuerpo casi no hace esfuerzo. Se necesitan 2.5 horas de ejercicio intenso con bandas elásticas.',
        scientificContext: 'OSDR-120: En baja gravedad los osteoclastos destruyen hueso más rápido de lo que se forma. El ejercicio contra resistencia es la única solución.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-120',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-120',
          detail: 'Degradación ósea en gravedad reducida y Rodent Research'
        },
        options: [
          {
            title: 'Ejercicio Obligatorio Intenso',
            actionText: 'Toda la tripulación entrena 2.5 horas hoy.',
            gainText: '+22% Salud, +15 Ciencia',
            costText: '-14% O2 (respiración agitada)',
            delta: { health: 22, oxygen: -14, science: 15, energy: 0, integrity: 0 },
            feedback: '¡Huesos fuertes y moral alta! Pero los filtros de CO2 registraron demanda metabólica elevada (-14% O2).'
          },
          {
            title: 'Suspender Ejercicio (Ahorrar O2)',
            actionText: 'Reposo estático para minimizar consumo de aire.',
            gainText: 'O2 totalmente conservado',
            costText: '-20% Salud (atrofia ósea)',
            delta: { health: -20, oxygen: 0, science: 0, energy: 0, integrity: 0 },
            feedback: 'Aire conservado, pero la tripulación tiene debilidad en rodillas y mareos. El estudio OSDR-120 confirma el deterioro.'
          }
        ]
      },
      {
        id: 'EV_REGOLITH_DUST_CLOG',
        category: 'LUNAR_ENGINEERING',
        tag: 'INGENIERÍA LUNAR',
        title: 'Regolito Bloqueando los Sellos',
        sender: 'Sensor de Presión del Hábitat',
        description: 'El polvo lunar son vidrios microscópicos cargados de estática. Tras varias EVAs, se adhirió a los sellos de la compuerta. Hay un micro-escape de gas.',
        scientificContext: 'En el programa Apolo, el polvo destruyó trajes y causó irritación pulmonar ("fiebre del heno lunar"). La NASA prueba repelentes electrostáticos.',
        dataSource: {
          name: 'NASA Lunar Dust — Apollo Lessons Learned',
          url: 'https://www.nasa.gov/lunar-dust',
          detail: 'Programa Apolo: efectos del regolito en equipos y salud'
        },
        options: [
          {
            title: 'Limpieza Electrostática Profunda',
            actionText: 'Repeler polvo con campos de alto voltaje.',
            gainText: '+18% Integridad (sellado restaurado)',
            costText: '-16% Energía',
            delta: { integrity: 18, energy: -16, oxygen: 0, health: 0, science: 0 },
            feedback: '¡Sellos impecables! La base está 100% presurizada, a costa de un 16% de batería.'
          },
          {
            title: 'Parche Mecánico Manual',
            actionText: 'Limpiar con cepillos de cerdas sintéticas.',
            gainText: 'Cero gasto de energía',
            costText: '-14% Integridad, -8% Salud (polvo inhalado)',
            delta: { integrity: -14, health: -8, energy: 0, oxygen: 0, science: 0 },
            feedback: 'Energía conservada, pero el polvo cortó el sello y los astronautas inhalaron partículas al quitarse el casco.'
          }
        ]
      },
      {
        id: 'EV_OSDR_CIRCADIAN_RHYTHM',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'PSICOLOGÍA OSDR',
        title: 'Insomnio: Ciclo Circadiano Alterado',
        sender: 'Monitores de Biometría',
        description: 'Sin ciclo natural día/noche de 24h, los cerebros no producen melatonina. Los astronautas cometen errores de cálculo y no pueden dormir.',
        scientificContext: 'OSDR-244: La luz azul activa vigilia; la luz ámbar induce sueño profundo. Sin este ciclo, la eficiencia operacional cae drásticamente.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-244',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-244',
          detail: 'Ritmos circadianos en hábitats cerrados (HERA & CHAPEA)'
        },
        options: [
          {
            title: 'Sistema LED de Ciclo Terrestre',
            actionText: 'Configurar lámparas LED biológicas en todos los módulos.',
            gainText: '+20% Salud, +15 Ciencia',
            costText: '-15% Energía (iluminación continua)',
            delta: { health: 20, science: 15, energy: -15, oxygen: 0, integrity: 0 },
            feedback: '¡8 horas de sueño reparador! Coordinación mental al 100%, aunque las LED consumieron 15% de batería.'
          },
          {
            title: 'Apagón Total para Ahorrar Baterías',
            actionText: 'Base en penumbra durante las horas de descanso.',
            gainText: '+15% Energía ahorrada',
            costText: '-18% Salud (insomnio y estrés)',
            delta: { energy: 15, health: -18, science: 0, oxygen: 0, integrity: 0 },
            feedback: 'Baterías al máximo, pero la tripulación tiene insomnio y desorientación. Un astronauta casi derrama una muestra por fatiga.'
          }
        ]
      },
      {
        id: 'EV_OSDR_MICROBIOME_WATER',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'SOPORTE VITAL OSDR',
        title: 'Biofilms en Tuberías de Agua',
        sender: 'Analizador Químico ECLSS',
        description: 'Bacterias del microbioma humano forman biopelículas en los ductos de agua reciclada. Sin esterilización, el agua causará infecciones gastrointestinales.',
        scientificContext: 'OSDR-612: Los sistemas de soporte vital requieren ciclos de esterilización a 85°C para eliminar biopelículas resistentes.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-612',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-612',
          detail: 'Microbioma y biofilms en sistemas ECLSS (Marshall SFC)'
        },
        options: [
          {
            title: 'Esterilización Térmica a 85°C',
            actionText: 'Calentamiento catalítico en toda la red de agua.',
            gainText: '+20% Salud (agua pura), +10 Ciencia',
            costText: '-18% Energía',
            delta: { health: 20, science: 10, energy: -18, oxygen: 0, integrity: 0 },
            feedback: '¡Agua cristalina! Los astronautas beben con seguridad, a cambio de 18% de energía.'
          },
          {
            title: 'Posponer Limpieza',
            actionText: 'Mantener tuberías a temperatura estándar.',
            gainText: 'Energía intacta',
            costText: '-16% Salud (agua contaminada)',
            delta: { energy: 0, health: -16, oxygen: 0, integrity: 0, science: 0 },
            feedback: 'Electricidad conservada, pero el agua tiene mal olor y dos astronautas reportan malestar estomacal (-16% Salud).'
          }
        ]
      },
      {
        id: 'EV_LUNAR_NIGHTFALL',
        category: 'LUNAR_SURVIVAL',
        tag: 'SUPERVIVENCIA EXTREMA',
        title: 'Puesta de Sol: La Noche Lunar',
        sender: 'Control de Misión Houston',
        description: 'El Sol se ocultó tras los bordes del cráter. Comienzan 354 horas de noche a -173°C. Los paneles fotovoltaicos generan 0 watts. ¿Cómo administrarás las celdas de combustible?',
        scientificContext: 'Sobrevivir la noche lunar es el mayor desafío de Artemis. Se necesitan celdas de combustible regenerativas o reactores nucleares compactos.',
        dataSource: {
          name: 'NASA Artemis Plan — Lunar Night Survival',
          url: 'https://www.nasa.gov/mission/artemis-i/',
          detail: 'Desafío de supervivencia térmica durante 354h de oscuridad'
        },
        options: [
          {
            title: 'Modo Criogénico (Apagar Labs)',
            actionText: 'Toda la calefacción va a los dormitorios.',
            gainText: '+5% Salud (tripulación caliente)',
            costText: '-20 Ciencia (investigaciones congeladas)',
            delta: { energy: 0, health: 5, science: -20, oxygen: 0, integrity: 0 },
            feedback: 'Prudente. Astronautas calientes y vivos, sacrificando el ritmo científico.'
          },
          {
            title: 'Quemar O2/H2 en Celdas de Combustible',
            actionText: 'Mantener todos los laboratorios encendidos.',
            gainText: '+60 Ciencia, +10% Energía',
            costText: '-25% O2, -20% Integridad (sobrecalentamiento)',
            delta: { science: 60, oxygen: -25, integrity: -20, energy: 10, health: 0 },
            feedback: '¡Hazaña científica! La base iluminó la noche lunar, pero quemaste una cuarta parte del oxígeno vital.'
          }
        ]
      }
    ];
  }

  getNextEvent(gameState) {
    const day = gameState.currentDay;
    const diff = gameState.difficulty;

    if (diff === 3 && day === 15) {
      return this.eventDeck.find(e => e.id === 'EV_LUNAR_NIGHTFALL');
    }
    if ((day === 2 || day === 5) && !this.usedEventIds.has('EV_DONKI_SOLAR_STORM')) {
      this.usedEventIds.add('EV_DONKI_SOLAR_STORM');
      return this.buildSolarStormEvent(gameState);
    }

    let available = this.eventDeck.filter(e => !this.usedEventIds.has(e.id));
    if (available.length === 0) {
      this.usedEventIds.clear();
      available = this.eventDeck;
    }
    const selected = available[Math.floor(Math.random() * available.length)];
    this.usedEventIds.add(selected.id);
    if (selected.id === 'EV_DONKI_SOLAR_STORM') {
      return this.buildSolarStormEvent(gameState);
    }
    return selected;
  }

  buildSolarStormEvent(gameState) {
    const donki = window.donkiService;
    const donkiData = donki ? donki.getEventForDay(gameState.currentDay, gameState.difficulty) : null;
    const isLive = donki && donki.isLive;

    if (!donkiData) {
      return this.eventDeck.find(e => e.id === 'EV_DONKI_SOLAR_STORM');
    }

    const speed = donkiData.speed || 1250;
    const radDose = donkiData.radiationDoseMsv || 120;
    const shieldCost = donkiData.powerCostToShield || 28;
    const healthDamage = donkiData.unshieldedHealthDamage || 22;

    return {
      id: 'EV_DONKI_SOLAR_STORM',
      category: 'DONKI_SPACE_WEATHER',
      tag: isLive ? '🟢 NASA DONKI EN VIVO' : '🛰️ NASA DONKI HISTÓRICO',
      title: isLive 
        ? `¡Alerta Solar en Vivo! (CME ${donkiData.catalogDate})` 
        : `¡Tormenta Solar Detectada! (${donkiData.title})`,
      sender: isLive ? 'API Abierta de Clima Espacial NASA (DONKI)' : 'Centro de Clima Espacial NASA (SWPC / DONKI)',
      description: isLive
        ? `Datos captados en tiempo real por la flota heliofísica de la NASA: Una Eyección de Masa Coronal (CME) registrada el ${donkiData.catalogDate} viaja a ${speed} km/s. Dosis estimada de radiación: ${radDose} mSv.`
        : `Registro oficial SDO/SOHO: Una Eyección de Masa Coronal (CME) viaja a ${speed} km/s hacia la Luna. Sin atmósfera ni magnetosfera, los protones impactarán el hábitat en 2 horas.`,
      scientificContext: donkiData.scienceFact || 'En la Tierra, la magnetosfera y la atmósfera nos protegen creando auroras. En la Luna, los astronautas dependen de escudos de regolito y campos electromagnéticos.',
      dataSource: {
        name: isLive ? 'NASA DONKI API (Consulta en Vivo)' : 'NASA DONKI Space Weather Database',
        url: 'https://api.nasa.gov/DONKI',
        detail: isLive 
          ? `Transmisión en tiempo real desde api.nasa.gov/DONKI (ID: ${donkiData.id})`
          : `Registro histórico de heliofísica NASA del ${donkiData.catalogDate}`
      },
      isSolarEvent: true,
      options: [
        {
          title: 'Reforzar Blindaje al 100%',
          actionText: 'Desviar energía de calefactores al escudo electromagnético.',
          gainText: '+10 Ciencia, Salud protegida',
          costText: `-${shieldCost}% Energía (la base pasará frío)`,
          delta: { energy: -shieldCost, health: 0, integrity: 0, science: 10, oxygen: 0 },
          feedback: `¡Tripulación protegida en el búnker! El escudo magnético desvió las partículas de ${speed} km/s (-${shieldCost}% Energía).`
        },
        {
          title: 'Refugio Pasivo (Ahorrar Energía)',
          actionText: 'Mantener calefactores activos; la tripulación usará chalecos de agua.',
          gainText: 'Energía intacta para la noche',
          costText: `-${healthDamage}% Salud (dosis de radiación)`,
          delta: { energy: 0, health: -healthDamage, integrity: 0, science: 0, oxygen: 0 },
          feedback: `Electricidad conservada, pero los dosímetros registraron ${radDose} mSv de radiación en los astronautas (-${healthDamage}% Salud).`
        },
        {
          title: '🎮 Calibrar Escudo Manual',
          actionText: 'Microjuego: ajusta los deslizadores de energía contra reloj.',
          isMinigame: 'shield',
          gainText: 'Equilibrar según tu habilidad',
          costText: 'Riesgo si tardas demasiado',
          feedback: 'Iniciando protocolo de desvío...'
        }
      ]
    };
  }
}

window.missionEventManager = new MissionEventManager();
