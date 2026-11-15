/**
 * Artemis Outpost: NASA OSDR (Open Science Data Repository)
 * Integra hallazgos auténticos de biología espacial, medicina aeroespacial y salud de astronautas
 * procedentes del repositorio oficial de ciencia abierta de la NASA (GeneLab / OSDR).
 */

class OsdrRepository {
  constructor() {
    this.studies = [
      {
        id: 'OSD-379',
        title: 'Plantas Cultivadas en Regolito Lunar de las Misiones Apolo',
        organism: 'Arabidopsis thaliana (Planta modelo)',
        nasaFacility: 'Laboratorio de Biología Espacial / Kennedy Space Center',
        missionContext: 'Muestras reales de suelo traídas por Apolo 11, 12 y 17',
        findingShort: 'Las plantas germinan en suelo lunar, pero sufren estrés genético debido al vidrio volcánico y sales minerales del regolito.',
        kidExplanation: '¡Científicos de la NASA lograron cultivar plantas en tierra de la Luna por primera vez! Crecen, pero necesitan agua purificada y cuidados especiales porque el polvo lunar es áspero como vidrio molido.',
        tradeoffImpact: {
          choiceYes: 'Darles agua extra y O2 purificado (+40 Ciencia, -15% O2, -10% Batería)',
          choiceNo: 'Ahorrar agua para la tripulación (0% costo, se pierde el experimento biológico)'
        },
        badge: 'BIO-INVERNADERO'
      },
      {
        id: 'OSD-546',
        title: 'Disfunción Mitocondrial y Sistema Inmune bajo Radiación Cósmica',
        organism: 'Células humanas / Astronautas de la Estación Espacial',
        nasaFacility: 'NASA Ames Research Center & Johnson Space Center',
        missionContext: 'Estudios de gemelos (Twins Study) y vuelos de larga duración',
        findingShort: 'La radiación espacial reduce la actividad de las mitocondrias (las baterías de las células), provocando fatiga y bajada de defensas.',
        kidExplanation: 'En el espacio profundo, los glóbulos blancos se cansan más rápido. Si los astronautas no descansan bien o absorben radiación, su cuerpo batalla para defenderse.',
        tradeoffImpact: {
          choiceYes: 'Prescribir suplementos antioxidantes y 9 horas de descanso (+20 Salud, -15% Tiempo de reparaciones)',
          choiceNo: 'Exigirles turnos extra de trabajo (+25 Integridad de la base, -20% Salud de tripulación)'
        },
        badge: 'MEDICINA ESPACIAL'
      },
      {
        id: 'OSD-120',
        title: 'Degradación de Masa Ósea y Atrofia Muscular en Gravedad Reducida',
        organism: 'Tejido óseo de mamíferos en microgravedad (1/6 g)',
        nasaFacility: 'Center for Space Medicine / Houston',
        missionContext: 'Simulación de 1/6 g lunar y misiones Rodent Research',
        findingShort: 'En la Luna pesas 6 veces menos. Sin el esfuerzo habitual de la Tierra, los huesos liberan calcio y los músculos de las piernas se debilitan rápidamente.',
        kidExplanation: '¡En la Luna puedes saltar como un superhéroe! Pero si no haces ejercicio diario contra ligas elásticas, tus músculos pensarán que ya no los necesitas y se encogerán.',
        tradeoffImpact: {
          choiceYes: 'Sesión obligatoria de 2 horas en cicloergómetro (+15 Salud, -12% O2 consumido por respiración intensa)',
          choiceNo: 'Omitir ejercicio para ahorrar O2 (+0% gasto O2, -18% Salud muscular)'
        },
        badge: 'SALUD DE TRIPULACIÓN'
      },
      {
        id: 'OSD-244',
        title: 'Arquitectura del Sueño y Ritmos Circadianos en Hábitats Lunares Cerrados',
        organism: 'Tripulaciones análogas lunares (HERA & CHAPEA)',
        nasaFacility: 'NASA Human Research Program',
        missionContext: 'Aislamiento sin luz solar natural terrestre durante 45 días',
        findingShort: 'El desfase de iluminación altera la melatonina en el cerebro, generando insomnio, errores en cálculos y estrés operacional.',
        kidExplanation: 'En la Luna el Sol no sale ni se oculta cada 24 horas como en tu casa; ¡un día solar lunar dura casi un mes terrestre! Por eso el hábitat necesita lámparas LED inteligentes que simulen el amanecer.',
        tradeoffImpact: {
          choiceYes: 'Activar el ciclo de iluminación biológica continua (-15% Energía nocturna, +15% Salud y concentración)',
          choiceNo: 'Apagar todas las luces de noche para ahorrar batería (+15% Energía, -15% Salud mental y moral)'
        },
        badge: 'PSICOLOGÍA & SUEÑO'
      },
      {
        id: 'OSD-612',
        title: 'Microbioma y Biofilms Bacterianos en Sistemas de Reciclaje de Agua',
        organism: 'Bacterias ambientales y filtros ECLSS',
        nasaFacility: 'Marshall Space Flight Center',
        missionContext: 'Procesador de orina y condensación de cabina lunar',
        findingShort: 'Las bacterias forman biopelículas en las tuberías de agua cerrada. Se requiere calor y filtración catalítica periódica para mantenerla 100% potable.',
        kidExplanation: 'En la base lunar, cada gota de sudor, vapor y orina se limpia y se vuelve a beber. Para que siga siendo tan pura como agua de manantial, hay que desinfectar los filtros.',
        tradeoffImpact: {
          choiceYes: 'Ciclo térmico de esterilización a 85°C (-20% Energía eléctrica, +20% Calidad de agua y Salud)',
          choiceNo: 'Saltar el ciclo de limpieza para ahorrar energía (0% gasto energía, -18% Salud de la tripulación)'
        },
        badge: 'SOPORTE VITAL (ECLSS)'
      }
    ];
  }

  getStudyById(id) {
    return this.studies.find(s => s.id === id);
  }

  getAllStudies() {
    return this.studies;
  }

  getRandomStudy() {
    const idx = Math.floor(Math.random() * this.studies.length);
    return this.studies[idx];
  }
}

window.osdrRepository = new OsdrRepository();
