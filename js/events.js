/**
 * ORBITA5: Mission Dilemmas & Trade-Off Events
 * Basado estrictamente en datos abiertos y misiones reales de la NASA:
 * - NASA DONKI (Space Weather Database)
 * - NASA OSDR (Open Science Data Repository / GeneLab)
 * - NASA LRO (Lunar Reconnaissance Orbiter) & LCROSS
 * - NASA Apollo Lessons Learned & Human Research Program
 * 
 * Cada evento cita su fuente oficial con enlace verificable y cuenta con
 * aleatorización entre partidas (cross-session memory) para alta rejugabilidad y valor educativo.
 */

class MissionEventManager {
  constructor() {
    this.eventDeck = [];
    this.usedEventIds = new Set();
    this.initDeck();
  }

  initDeck() {
    this.eventDeck = [
      // 1. Clima Espacial Real (NASA DONKI)
      {
        id: 'EV_DONKI_SOLAR_STORM',
        category: 'DONKI_SPACE_WEATHER',
        tag: 'ALERTA SOLAR DONKI',
        title: '¡Tormenta Solar Detectada!',
        sender: 'Centro de Clima Espacial NASA (SWPC / DONKI)',
        description: 'Una Eyección de Masa Coronal (CME) viaja a alta velocidad hacia el polo lunar. Sin magnetosfera protectora, los protones de alta energía impactarán la base.',
        scientificContext: 'En la Tierra, el campo magnético desvía estas partículas creando auroras. En la Luna, los astronautas dependen de búnkeres de regolito y blindaje electromagnético activo.',
        dataSource: {
          name: 'NASA DONKI (Space Weather Database)',
          url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
          detail: 'Telemetría de la flota espacial heliofísica SDO, SOHO, STEREO y ACE'
        },
        isSolarEvent: true,
        options: [
          {
            title: 'Reforzar Blindaje al 100%',
            actionText: 'Desviar energía de calefactores al escudo electromagnético.',
            gainText: '+10 Ciencia, Salud protegida (0 daño)',
            costText: '-28% Energía (la base pasará frío)',
            delta: { energy: -28, health: 0, integrity: 0, science: 10, oxygen: 0 },
            feedback: '¡Tripulación protegida en el búnker! El escudo magnético desvió las partículas solares, pero las baterías se descargaron (-28% Energía).'
          },
          {
            title: 'Refugio Pasivo (Ahorrar Energía)',
            actionText: 'Mantener calefactores activos; la tripulación usará chalecos de agua.',
            gainText: 'Energía intacta para la noche',
            costText: '-22% Salud (dosis de radiación)',
            delta: { energy: 0, health: -22, integrity: 0, science: 0, oxygen: 0 },
            feedback: 'Electricidad conservada, pero los dosímetros registraron radiación ionizante en los astronautas (-22% Salud).'
          },
          {
            title: '🎮 Calibrar Escudo Manual',
            actionText: 'Microjuego: ajusta los deslizadores de energía contra reloj.',
            isMinigame: 'shield',
            gainText: 'Equilibrar según tu habilidad',
            costText: 'Riesgo si tardas demasiado',
            feedback: 'Iniciando protocolo de desvío de energía...'
          }
        ]
      },

      // 2. Biología Vegetal en Regolito (NASA OSDR OSD-379)
      {
        id: 'EV_OSDR_PLANT_O2',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'BIO-LABORATORIO OSDR',
        title: 'Dilema del Invernadero Lunar',
        sender: 'Laboratorio de Biología Espacial (Kennedy Space Center)',
        description: 'Las semillas de Arabidopsis thaliana germinaron en regolito lunar, pero sufren estrés oxidativo y requieren una inyección de O2 puro y agua destilada.',
        scientificContext: 'OSD-379: En 2022, la NASA cultivó plantas por primera vez en suelo lunar de Apolo 11, 12 y 17. Sobreviven, pero con genes de estrés activados.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-379',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-379',
          detail: 'Cultivo de Arabidopsis thaliana en regolito lunar auténtico de misiones Apolo'
        },
        options: [
          {
            title: 'Sacrificar O2 para las Plantas',
            actionText: 'Abrir válvulas de O2 al bio-laboratorio.',
            gainText: '+45 Ciencia (avance botánico)',
            costText: '-18% Oxígeno de tripulación',
            delta: { oxygen: -18, science: 45, energy: 0, health: 0, integrity: 0 },
            feedback: '¡Las plantas florecieron en suelo lunar! Datos invaluables para futuras bases permanentes, pero los astronautas deberán racionar aire (-18% O2).'
          },
          {
            title: 'Priorizar el Aire Humano',
            actionText: 'Cerrar el invernadero y sellar los depósitos principales.',
            gainText: 'Oxígeno 100% protegido',
            costText: '0 Ciencia (el cultivo muere)',
            delta: { oxygen: 0, science: 0, energy: 0, health: 0, integrity: 0 },
            feedback: 'La tripulación es prioridad uno. Los tanques de oxígeno están seguros, aunque se perdió la cosecha experimental.'
          }
        ]
      },

      // 3. Minería de Hielo Polar (NASA LCROSS & LRO)
      {
        id: 'EV_ICE_MINING_EXPEDITION',
        category: 'LUNAR_GEOLOGY',
        tag: 'GEOLOGÍA LUNAR POLAR',
        title: 'Expedición al Cráter Shackleton',
        sender: 'Ingeniería Robótica de Exploración',
        description: 'El fondo del cráter tiene hielo de agua atrapado a -230°C en oscuridad permanente. Necesitamos ese hielo para generar oxígeno y agua potable.',
        scientificContext: 'La misión LCROSS de la NASA estrelló una etapa de cohete en la Luna, detectando un 5.5% de hielo de agua en los cráteres del polo sur.',
        dataSource: {
          name: 'NASA LCROSS & Lunar Reconnaissance Orbiter (LRO)',
          url: 'https://science.nasa.gov/mission/lcross/',
          detail: 'Confirmación espectral de hielo en zonas de sombra permanente (PSR)'
        },
        options: [
          {
            title: '🎮 Conducir el Rover Minero',
            actionText: 'Microjuego: desciende al cráter y recolecta hielo evitando rocas.',
            isMinigame: 'rover',
            gainText: 'Hasta +40% O2 según hielo extraído',
            costText: 'Batería y chasis en riesgo térmico',
            feedback: 'Desplegando Rover Polar en el Cráter Shackleton...'
          },
          {
            title: 'Racionar Agua con Sistema ECLSS',
            actionText: 'No enviar el rover; recircular agua al límite de los filtros.',
            gainText: 'Rover seguro en el hangar',
            costText: '-14% Salud (racionamiento de agua)',
            delta: { health: -14, energy: 0, oxygen: 0, integrity: 0, science: 5 },
            feedback: 'Vehículo a salvo, pero la tripulación debe limitar el consumo de agua y bañarse con toallitas húmedas (-14% Salud).'
          }
        ]
      },

      // 4. Pérdida Ósea y Muscular (NASA OSDR OSD-120)
      {
        id: 'EV_OSDR_BONE_EXERCISE',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'MEDICINA OSDR',
        title: 'Alerta de Desmineralización Ósea (1/6 g)',
        sender: 'Medicina de Vuelo Espacial (JSC Houston)',
        description: 'La baja gravedad de la Luna no ejerce resistencia en el esqueleto. Los astronautas están perdiendo calcio y masa muscular en las piernas.',
        scientificContext: 'OSD-120: En gravedad reducida, los osteoclastos destruyen hueso más rápido de lo que se regenera. Se requieren 2.5h diarias de ejercicio resistivo.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-120',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-120',
          detail: 'Investigación de degradación ósea y muscular en microgravedad (Rodent Research)'
        },
        options: [
          {
            title: 'Ejercicio Obligatorio con Bandas',
            actionText: 'Toda la tripulación entrena 2.5 horas continuas.',
            gainText: '+22% Salud, +15 Ciencia',
            costText: '-14% O2 (respiración metabólica acelerada)',
            delta: { health: 22, oxygen: -14, science: 15, energy: 0, integrity: 0 },
            feedback: '¡Músculos y huesos fortalecidos! Pero la respiración agitada exigió más trabajo a los recicladores de aire (-14% O2).'
          },
          {
            title: 'Suspender Ejercicio (Ahorrar Aire)',
            actionText: 'Descanso estático para reducir el ritmo cardíaco.',
            gainText: 'O2 totalmente conservado',
            costText: '-20% Salud (atrofia muscular)',
            delta: { health: -20, oxygen: 0, science: 0, energy: 0, integrity: 0 },
            feedback: 'Oxígeno protegido, pero los astronautas reportan debilidad articular y pérdida de tono muscular (-20% Salud).'
          }
        ]
      },

      // 5. Polvo Lunar y Vidrio Abrasivo (Apollo Lessons Learned)
      {
        id: 'EV_REGOLITH_DUST_CLOG',
        category: 'LUNAR_ENGINEERING',
        tag: 'INGENIERÍA POLAR',
        title: 'Polvo de Regolito en las Escotillas',
        sender: 'Sensores de Hermeticidad del Hábitat',
        description: 'El polvo lunar no tiene erosión por viento: son microscópicas esquirlas afiladas con carga estática. Se adhirió a los sellos de goma de la compuerta exterior.',
        scientificContext: 'Los astronautas del programa Apolo reportaron que el polvo destruyó trajes espaciales y causó irritación respiratoria (fiebre del heno lunar).',
        dataSource: {
          name: 'NASA Lunar Dust & Electrodynamic Dust Shield (EDS)',
          url: 'https://science.nasa.gov/moon/moon-dust/',
          detail: 'Programa Apolo y desarrollo de tecnología de barrido electrostático'
        },
        options: [
          {
            title: 'Activación del Escudo Electrostático EDS',
            actionText: 'Pulsos de alto voltaje para repeler el polvo de las compuertas.',
            gainText: '+20% Integridad (sellado perfecto)',
            costText: '-16% Energía eléctrica',
            delta: { integrity: 20, energy: -16, oxygen: 0, health: 0, science: 0 },
            feedback: '¡Sellos limpios al 100%! La tecnología electrostática expulsó las esquirlas, consumiendo un 16% de batería.'
          },
          {
            title: 'Limpieza Manual con Cepillos',
            actionText: 'Limpiar a mano para no gastar electricidad.',
            gainText: '0% de gasto energético',
            costText: '-14% Integridad, -10% Salud (polvo en cabina)',
            delta: { integrity: -14, health: -10, energy: 0, oxygen: 0, science: 0 },
            feedback: 'Energía guardada, pero el polvo rayó las juntas de vacío e ingresó a la cabina irritando los ojos de la tripulación.'
          }
        ]
      },

      // 6. Ritmos Circadianos y Sueño (NASA OSDR OSD-244)
      {
        id: 'EV_OSDR_CIRCADIAN_RHYTHM',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'PSICOLOGÍA OSDR',
        title: 'Insomnio: Desfase Circadiano',
        sender: 'Monitores de Biometría Humana',
        description: 'En el polo sur lunar el sol gira casi horizontal sobre el horizonte. Sin noche terrestre de 24 horas, los cerebros no producen melatonina y la tripulación sufre fatiga extrema.',
        scientificContext: 'OSD-244: La luz azul de día promueve estado de alerta; la luz ámbar estimula el sueño profundo. Sin este ciclo, la tasa de error operacional se dispara.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-244',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-244',
          detail: 'Investigación de ritmos circadianos en hábitats cerrados (HERA & CHAPEA)'
        },
        options: [
          {
            title: 'Simulación LED de Ciclo Terrestre',
            actionText: 'Programar iluminación biológica espectral en los camarotes.',
            gainText: '+20% Salud, +15 Ciencia',
            costText: '-15% Energía (iluminación continua)',
            delta: { health: 20, science: 15, energy: -15, oxygen: 0, integrity: 0 },
            feedback: '¡Sueño profundo reparador! Concentración al 100% para operar la base, a costa de 15% de energía nocturna.'
          },
          {
            title: 'Apagar Todas las Luces (Ahorro de Batería)',
            actionText: 'Oscuridad total para no consumir watts.',
            gainText: '+15% Energía conservada',
            costText: '-18% Salud (ansiedad y desorientación)',
            delta: { energy: 15, health: -18, science: 0, oxygen: 0, integrity: 0 },
            feedback: 'Baterías protegidas, pero los astronautas están desvelados y con mareos operacionales (-18% Salud).'
          }
        ]
      },

      // 7. Biofilms en Sistema de Reciclaje de Agua (NASA OSDR OSD-612)
      {
        id: 'EV_OSDR_MICROBIOME_WATER',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'SOPORTE VITAL OSDR',
        title: 'Biofilms en Ductos de Agua ECLSS',
        sender: 'Sensor de Calidad de Agua (Marshall SFC)',
        description: 'Bacterias del microbioma humano han formado biopelículas viscosas en las tuberías de orina y condensación reciclada. El agua potable muestra trazas bacterianas.',
        scientificContext: 'OSD-612: Los sistemas cerrados de recuperación de agua requieren ciclos térmicos a 85°C para desprender películas bacterianas resistentes.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-612',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-612',
          detail: 'Biopelículas bacterianas en procesadores de agua de soporte vital'
        },
        options: [
          {
            title: 'Ciclo Térmico a 85°C con Filtro Catalítico',
            actionText: 'Hervir y purgar todo el circuito de tuberías.',
            gainText: '+20% Salud, +12 Ciencia',
            costText: '-18% Energía eléctrica',
            delta: { health: 20, science: 12, energy: -18, oxygen: 0, integrity: 0 },
            feedback: '¡Agua 100% pura y libre de bacterias! Los astronautas beben con total seguridad (-18% Energía).'
          },
          {
            title: 'Filtrado Simple sin Calor',
            actionText: 'Mantener las tuberías frías para no quemar energía.',
            gainText: 'Energía eléctrica intacta',
            costText: '-16% Salud (contaminación bacteriana)',
            delta: { energy: 0, health: -16, oxygen: 0, integrity: 0, science: 0 },
            feedback: 'Baterías intactas, pero dos miembros de la tripulación reportan dolores estomacales por microbios en el agua (-16% Salud).'
          }
        ]
      },

      // 8. Síndrome Neuro-Ocular SANS (NASA OSDR OSD-477)
      {
        id: 'EV_OSDR_SANS_VISION',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'OFTALMOLOGÍA OSDR',
        title: 'Visión Borrosa: Síndrome SANS',
        sender: 'Laboratorio de Salud Ocular (JSC Houston)',
        description: 'La redistribución de líquidos hacia la cabeza en baja gravedad presiona la parte posterior de los ojos. El piloto lunar ve borroso en las pantallas de navegación.',
        scientificContext: 'OSD-477: En el espacio, el nervio óptico se inflama (edema papilar). La NASA prueba dispositivos de presión negativa en las piernas para redirigir la sangre.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-477',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-477',
          detail: 'Síndrome Neuro-Ocular Asociado a Vuelos Espaciales (SANS) y agudeza visual'
        },
        options: [
          {
            title: 'Pantalones de Presión Negativa (Chibis)',
            actionText: 'Aplicar succión en piernas 2 horas al día para redistribuir líquidos.',
            gainText: '+18% Salud visual, +20 Ciencia',
            costText: '-12% Energía de bombas neumáticas',
            delta: { health: 18, science: 20, energy: -12, oxygen: 0, integrity: 0 },
            feedback: '¡Visión restaurada! La presión ocular volvió a valores seguros y el piloto leyó las cartas de descenso con nitidez (-12% Energía).'
          },
          {
            title: 'Lentes Correctivos Provisorios',
            actionText: 'Ajustar graduación en lentes sin encender bombas.',
            gainText: 'Cero gasto de energía',
            costText: '-18% Salud de tripulación',
            delta: { energy: 0, health: -18, oxygen: 0, integrity: 0, science: 0 },
            feedback: 'Las gafas ayudan temporalmente, pero la inflamación en el nervio óptico persiste y genera cefaleas matutinas (-18% Salud).'
          }
        ]
      },

      // 9. Rayos Cósmicos Pesados en el Corazón (NASA OSDR OSD-313)
      {
        id: 'EV_OSDR_RADIATION_HEART',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'RADIOBIOLOGÍA OSDR',
        title: 'Impacto de Iones de Hierro Pesados (HZE)',
        sender: 'Laboratorio de Radiación Espacial (Brookhaven / NSRL)',
        description: 'Sensores de radiación cósmica galáctica detectaron iones pesados de hierro atravesando el hábitat. Estos rayos no provienen del Sol, sino de supernovas lejanas.',
        scientificContext: 'OSD-313: Los iones de hierro rompen el ADN endotelial del corazón. Las moléculas ricas en hidrógeno (como el agua en las paredes) son el mejor escudo contra ellos.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-313',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-313',
          detail: 'Efectos de iones de hierro galácticos en tejido cardiovascular (Brookhaven NSRL)'
        },
        options: [
          {
            title: 'Mover Tanques de Agua como Blindaje',
            actionText: 'Bombear reservas de agua hacia los mamparos perimetrales.',
            gainText: '+22% Salud protegida, +15 Ciencia',
            costText: '-16% Oxígeno/Agua movilizada',
            delta: { health: 22, science: 15, oxygen: -16, energy: 0, integrity: 0 },
            feedback: '¡Escudo de hidrógeno activo! Los iones pesados chocaron con el agua y se frenaron sin dañar a los astronautas (-16% O2/Agua).'
          },
          {
            title: 'Confiar en los Muros de Aluminio',
            actionText: 'No alterar la distribución hidráulica de la base.',
            gainText: 'Reservas de tanques estables',
            costText: '-22% Salud celular',
            delta: { health: -22, energy: 0, oxygen: 0, integrity: 0, science: 0 },
            feedback: 'El aluminio ligero no logró frenar los rayos cósmicos. Los dosímetros registraron microlesiones celulares en los astronautas (-22% Salud).'
          }
        ]
      },

      // 10. Mapeo de Hidrógeno con Neutrones (NASA LRO & VIPER)
      {
        id: 'EV_LRO_VIPER_MAPPING',
        category: 'LUNAR_SCIENCE',
        tag: 'CARTOGRAFÍA LUNAR',
        title: 'Mapeo de Neutrones en el Monte Malapert',
        sender: 'Equipo Científico LRO (Diviner & LEND)',
        description: 'El satélite orbital LRO detectó una anomalía de neutrones lentos: señal inequívoca de altas concentraciones de hidrógeno cerca de la superficie.',
        scientificContext: 'El instrumento LEND de la sonda LRO mide neutrones reflejados para crear mapas de agua subterránea que guiarán a los exploradores lunares.',
        dataSource: {
          name: 'NASA Lunar Reconnaissance Orbiter (LEND & Diviner)',
          url: 'https://science.nasa.gov/mission/lro/',
          detail: 'Detección de hidrógeno y mapeo térmico de cráteres polares'
        },
        options: [
          {
            title: 'Sonda Geológica de Perforación Profunda',
            actionText: 'Desplegar taladro robótico en la cresta iluminada.',
            gainText: '+50 Ciencia, +15% O2 detectado',
            costText: '-20% Energía eléctrica del hábitat',
            delta: { science: 50, oxygen: 15, energy: -20, health: 0, integrity: 0 },
            feedback: '¡Hallazgo extraordinario! El taladro extrajo un núcleo de suelo con 8% de hielo atrapado. Ciencia y reservas de aire garantizadas (-20% Batería).'
          },
          {
            title: 'Mapeo Pasivo Orbital Solamente',
            actionText: 'Recibir datos satelitales sin gastar energía en el taladro.',
            gainText: '+15 Ciencia pura',
            costText: 'Cero gasto de batería',
            delta: { science: 15, energy: 0, oxygen: 0, health: 0, integrity: 0 },
            feedback: 'Datos orbitales guardados en la computadora de vuelo sin gastar un solo kilowatt de las baterías de la base.'
          }
        ]
      },

      // 11. Estabilidad de Vitaminas en Comida Espacial (NASA OSDR OSD-578)
      {
        id: 'EV_OSDR_FOOD_VITAMINS',
        category: 'OSDR_BIO_RESEARCH',
        tag: 'NUTRICIÓN OSDR',
        title: 'Degradación de Vitaminas en las Raciones',
        sender: 'Laboratorio de Sistemas Alimentarios (JSC)',
        description: 'La radiación ionizante y el almacenamiento prolongado degradaron la vitamina C y B1 en los paquetes de comida liofilizada.',
        scientificContext: 'OSD-578: En el espacio profundo, los nutrientes se degradan 40% más rápido. Sin vitaminas frescas, los astronautas desarrollan fatiga y anemia.',
        dataSource: {
          name: 'NASA OSDR — Estudio OSD-578',
          url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-578',
          detail: 'Degradación nutricional y estabilidad de vitaminas en almacenamiento espacial'
        },
        options: [
          {
            title: 'Activar Cultivo Hidropónico de Microvegetales',
            actionText: 'Sembrar brotes de rábano y lechuga rica en vitamina C.',
            gainText: '+24% Salud, +25 Ciencia',
            costText: '-14% Energía, -10% O2',
            delta: { health: 24, science: 25, energy: -14, oxygen: -10, integrity: 0 },
            feedback: '¡Comida fresca y crujiente! La tripulación recuperó vitalidad y ánimo con nutrientes vivos recién cosechados.'
          },
          {
            title: 'Consumir Raciones Estándar con Sal',
            actionText: 'No gastar recursos del hábitat en el huerto.',
            gainText: 'Energía y O2 100% conservados',
            costText: '-16% Salud (fatiga nutricional)',
            delta: { energy: 0, oxygen: 0, health: -16, science: 0, integrity: 0 },
            feedback: 'Recursos intactos, pero la monotonía y la falta de vitaminas provocaron cansancio y defensas bajas en los astronautas (-16% Salud).'
          }
        ]
      },

      // 12. Terremoto Lunar por Mareas Terrestres (Apollo Passive Seismic Experiment)
      {
        id: 'EV_APOLLO_SEISMIC_SHOCK',
        category: 'LUNAR_GEOLOGY',
        tag: 'SISMOLOGÍA LUNAR',
        title: 'Sismo Lunar Profundo (Moonquake)',
        sender: 'Red de Sismómetros Lunares (Apollo Heritage)',
        description: 'La fuerza de gravedad de la Tierra tironea la masa de la Luna, provocando un sismo de 4.8 grados en la escala de Richter que durará más de 10 minutos.',
        scientificContext: 'A diferencia de los terremotos terrestres que duran segundos, los sismos lunares vibran como una campana durante horas porque la roca es seca y fría.',
        dataSource: {
          name: 'NASA Apollo Passive Seismic Experiment',
          url: 'https://www.nasa.gov/mission/apollo-11/',
          detail: 'Sismología lunar y tensiones gravitacionales provocadas por la Tierra'
        },
        options: [
          {
            title: 'Presurizar Amortiguadores de la Base',
            actionText: 'Extender patas telescópicas hidráulicas bajo los domos.',
            gainText: '+22% Integridad estructural, +20 Ciencia',
            costText: '-18% Energía de bombas hidráulicas',
            delta: { integrity: 22, science: 20, energy: -18, health: 0, oxygen: 0 },
            feedback: '¡Base estable! Las patas hidráulicas absorbieron las vibraciones del suelo como un rascacielos sismorresistente (-18% Energía).'
          },
          {
            title: 'Asegurar Equipos Internos a Mano',
            actionText: 'Amarrar pantallas y cajas sin activar amortiguadores activos.',
            gainText: 'Baterías protegidas',
            costText: '-20% Integridad (grietas microscópicas en el domo)',
            delta: { energy: 0, integrity: -20, health: 0, oxygen: 0, science: 0 },
            feedback: 'Energía conservada, pero los 15 minutos de vibración continua aflojaron tornillos estructurales en el bio-laboratorio (-20% Integridad).'
          }
        ]
      },

      // 13. Noche Lunar Extrema (Día 15 de 28)
      {
        id: 'EV_LUNAR_NIGHTFALL',
        category: 'LUNAR_SURVIVAL',
        tag: 'SUPERVIVENCIA EXTREMA',
        title: 'Puesta de Sol: Comienza la Noche Polar Lunar',
        sender: 'Control de Misión Houston',
        description: 'El Sol se ocultó tras los bordes del cráter. Comienzan 354 horas de noche gélida a -173°C. Los paneles solares generan 0 watts. ¿Cómo administrarás las celdas de combustible?',
        scientificContext: 'Sobrevivir la noche lunar es el mayor reto de la exploración espacial humana. Se necesitan celdas de combustible regenerativas o reactores de fisión compactos.',
        dataSource: {
          name: 'NASA Human Lunar Architecture — Lunar Night Survival',
          url: 'https://www.nasa.gov/humans-in-space/',
          detail: 'Desafío de supervivencia térmica durante 354h continuas de oscuridad'
        },
        options: [
          {
            title: 'Modo Criogénico (Apagar Laboratorios)',
            actionText: 'Toda la calefacción va exclusivamente a los dormitorios.',
            gainText: '+5% Salud (tripulación caliente)',
            costText: '-20 Ciencia (experimentos congelados)',
            delta: { energy: 0, health: 5, science: -20, oxygen: 0, integrity: 0 },
            feedback: 'Prudente. Astronautas a salvo y calientes, sacrificando el ritmo de investigaciones científicas.'
          },
          {
            title: 'Quemar O2/H2 en Celdas de Combustible',
            actionText: 'Mantener todos los laboratorios encendidos para descubrimientos.',
            gainText: '+60 Ciencia, +10% Energía',
            costText: '-25% O2, -20% Integridad (sobrecalentamiento térmico)',
            delta: { science: 60, oxygen: -25, integrity: -20, energy: 10, health: 0 },
            feedback: '¡Hazaña científica! La base iluminó la noche lunar, pero consumiste una cuarta parte de las reservas de oxígeno vital.'
          }
        ]
      }
    ];
  }

  // Baraja un array de manera aleatoria uniforme (Fisher-Yates)
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Prepara el mazo de sesión priorizando eventos no vistos en partidas anteriores
  prepareSessionDeck(gameState) {
    this.usedEventIds.clear();

    let seenEvents = [];
    try {
      if (typeof localStorage !== 'undefined') {
        seenEvents = JSON.parse(localStorage.getItem('orbita5_seen_events') || '[]');
      }
    } catch (e) {}

    // Eventos generales (excluyendo el evento especial de la noche lunar)
    const generalEvents = this.eventDeck.filter(e => e.id !== 'EV_LUNAR_NIGHTFALL');

    // Separar entre eventos nunca vistos y ya vistos
    const unseen = generalEvents.filter(e => !seenEvents.includes(e.id));
    const seen = generalEvents.filter(e => seenEvents.includes(e.id));

    // Si ya vio casi todos los eventos, reiniciar memoria para permitir rejugabilidad infinita
    if (unseen.length < gameState.totalDays) {
      seenEvents = [];
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('orbita5_seen_events', JSON.stringify([]));
        }
      } catch (e) {}
    }

    // Barajar ambos grupos
    const shuffledUnseen = this.shuffle(unseen.length > 0 ? unseen : generalEvents);
    const shuffledSeen = this.shuffle(seen);

    // Mazo ordenado: primero eventos nuevos para el jugador, luego los vistos previamente
    this.sessionDeck = [...shuffledUnseen, ...shuffledSeen];
  }

  getNextEvent(gameState) {
    const day = gameState.currentDay;
    const diff = gameState.difficulty;

    // Regla especial 1: En nivel 3 (Comandante, 28 días), el día 15 es la caída de la noche lunar
    if (diff === 3 && day === 15) {
      return this.eventDeck.find(e => e.id === 'EV_LUNAR_NIGHTFALL');
    }

    // Regla especial 2: Tormenta Solar DONKI obligatoria en días críticos (día 2 o día 5) si aún no ha ocurrido
    if ((day === 2 || day === 5) && !this.usedEventIds.has('EV_DONKI_SOLAR_STORM')) {
      this.usedEventIds.add('EV_DONKI_SOLAR_STORM');
      this.markEventSeen('EV_DONKI_SOLAR_STORM');
      return this.buildSolarStormEvent(gameState);
    }

    // Si el mazo de sesión no está inicializado, prepararlo ahora
    if (!this.sessionDeck || this.sessionDeck.length === 0) {
      this.prepareSessionDeck(gameState);
    }

    // Buscar el siguiente evento disponible que no se haya usado en esta partida
    let selected = this.sessionDeck.find(e => !this.usedEventIds.has(e.id) && e.id !== 'EV_LUNAR_NIGHTFALL');

    // Si se agotaron los eventos del mazo de sesión, reciclar los no usados
    if (!selected) {
      this.usedEventIds.clear();
      selected = this.sessionDeck.find(e => e.id !== 'EV_LUNAR_NIGHTFALL') || this.eventDeck[0];
    }

    this.usedEventIds.add(selected.id);
    this.markEventSeen(selected.id);

    // Si es el evento solar, construirlo dinámicamente con los datos de NASA DONKI
    if (selected.id === 'EV_DONKI_SOLAR_STORM') {
      return this.buildSolarStormEvent(gameState);
    }

    return selected;
  }

  // Registra un evento en la memoria persistente para evitar repeticiones en la siguiente partida
  markEventSeen(eventId) {
    try {
      if (typeof localStorage !== 'undefined') {
        const seen = JSON.parse(localStorage.getItem('orbita5_seen_events') || '[]');
        if (!seen.includes(eventId)) {
          seen.push(eventId);
          localStorage.setItem('orbita5_seen_events', JSON.stringify(seen));
        }
      }
    } catch (e) {}
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
    const craft = donkiData.spacecraft || 'Flota Espacial NASA';

    return {
      id: 'EV_DONKI_SOLAR_STORM',
      category: 'DONKI_SPACE_WEATHER',
      tag: isLive ? '🟢 NASA DONKI EN VIVO' : '🛰️ NASA DONKI OFICIAL',
      title: isLive 
        ? `¡Alerta Solar en Vivo! (CME ${donkiData.catalogDate})` 
        : `¡Tormenta Solar Detectada! (${donkiData.title})`,
      sender: isLive ? 'API Abierta de Clima Espacial NASA (DONKI)' : `Centro de Clima Espacial NASA (${craft})`,
      description: isLive
        ? `Datos captados en tiempo real por telescopios de la NASA: Una Eyección de Masa Coronal (CME) registrada el ${donkiData.catalogDate} viaja a ${speed} km/s. Dosis estimada de radiación: ${radDose} mSv.`
        : `Registro oficial de heliofísica (${craft}): Una Eyección de Masa Coronal (CME) viaja a ${speed} km/s hacia la Luna. Dosis estimada: ${radDose} mSv. Sin atmósfera ni magnetosfera, los protones impactarán la base en 2 horas.`,
      scientificContext: donkiData.scienceFact || 'En la Tierra, la magnetosfera y la atmósfera nos protegen creando auroras. En la Luna, los astronautas dependen de escudos de regolito y campos electromagnéticos.',
      dataSource: {
        name: isLive ? 'NASA DONKI API (Consulta en Tiempo Real)' : `NASA DONKI Space Weather Database (${craft})`,
        url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
        detail: isLive 
          ? `Transmisión en tiempo real desde NASA DONKI (ID: ${donkiData.id})`
          : `Registro de heliofísica de la NASA del ${donkiData.catalogDate} — Misión ${craft}`
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
          feedback: 'Iniciando protocolo de desvío de energía...'
        }
      ]
    };
  }
}

window.missionEventManager = new MissionEventManager();
