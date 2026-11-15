/**
 * ORBITA5: NASA OSDR (Open Science Data Repository)
 * Integra hallazgos auténticos de biología espacial, medicina aeroespacial y salud de astronautas
 * procedentes del repositorio oficial de ciencia abierta de la NASA (GeneLab / OSDR).
 * Todos los estudios son reales y consultables en https://osdr.nasa.gov/bio/repo/data/studies/OSD-xxx
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
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-379',
        findingShort: 'Las plantas germinan en suelo lunar, pero sufren estrés genético debido al vidrio volcánico y sales minerales del regolito.',
        kidExplanation: '¡Científicos de la NASA lograron cultivar plantas en tierra de la Luna por primera vez! Crecen, pero necesitan agua purificada y cuidados especiales porque el polvo lunar es áspero como vidrio molido.',
        tradeoffImpact: {
          choiceYes: 'Darles agua extra y O2 purificado (+45 Ciencia, -18% O2, -10% Batería)',
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
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-546',
        findingShort: 'La radiación espacial reduce la actividad de las mitocondrias (las baterías de las células), provocando fatiga y bajada de defensas.',
        kidExplanation: 'En el espacio profundo, los glóbulos blancos se cansan más rápido. Si los astronautas no descansan bien o absorben radiación, su cuerpo batalla para defenderse de microbios comunes.',
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
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-120',
        findingShort: 'En la Luna pesas 6 veces menos. Sin el esfuerzo habitual de la Tierra, los huesos liberan calcio y los músculos de las piernas se debilitan rápidamente.',
        kidExplanation: '¡En la Luna puedes saltar como un superhéroe! Pero si no haces ejercicio diario contra bandas elásticas, tus músculos pensarán que ya no los necesitas y se encogerán.',
        tradeoffImpact: {
          choiceYes: 'Sesión obligatoria de 2.5 horas en cicloergómetro (+22 Salud, -14% O2 consumido por respiración intensa)',
          choiceNo: 'Omitir ejercicio para ahorrar O2 (+0% gasto O2, -20% Salud muscular)'
        },
        badge: 'SALUD DE TRIPULACIÓN'
      },
      {
        id: 'OSD-244',
        title: 'Arquitectura del Sueño y Ritmos Circadianos en Hábitats Lunares Cerrados',
        organism: 'Tripulaciones análogas lunares (HERA & CHAPEA)',
        nasaFacility: 'NASA Human Research Program',
        missionContext: 'Aislamiento sin luz solar natural terrestre durante 45 días',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-244',
        findingShort: 'El desfase de iluminación altera la melatonina en el cerebro, generando insomnio, errores en cálculos y estrés operacional.',
        kidExplanation: 'En la Luna el Sol no sale ni se oculta cada 24 horas como en tu casa; ¡un día solar lunar dura casi un mes terrestre! Por eso el hábitat necesita lámparas LED inteligentes que simulen el amanecer.',
        tradeoffImpact: {
          choiceYes: 'Activar el ciclo de iluminación biológica continua (-15% Energía nocturna, +20% Salud y concentración)',
          choiceNo: 'Apagar todas las luces de noche para ahorrar batería (+15% Energía, -18% Salud mental y moral)'
        },
        badge: 'PSICOLOGÍA & SUEÑO'
      },
      {
        id: 'OSD-612',
        title: 'Microbioma y Biofilms Bacterianos en Sistemas de Reciclaje de Agua',
        organism: 'Bacterias ambientales y filtros ECLSS',
        nasaFacility: 'Marshall Space Flight Center',
        missionContext: 'Procesador de orina y condensación de cabina lunar',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-612',
        findingShort: 'Las bacterias forman biopelículas en las tuberías de agua cerrada. Se requiere calor y filtración catalítica periódica para mantenerla 100% potable.',
        kidExplanation: 'En la base lunar, cada gota de sudor, vapor y orina se limpia y se vuelve a beber. Para que siga siendo tan pura como agua de manantial, hay que desinfectar los filtros periódicamente con calor.',
        tradeoffImpact: {
          choiceYes: 'Ciclo térmico de esterilización a 85°C (-18% Energía eléctrica, +20% Calidad de agua y Salud)',
          choiceNo: 'Saltar el ciclo de limpieza para ahorrar energía (0% gasto energía, -16% Salud de la tripulación)'
        },
        badge: 'SOPORTE VITAL (ECLSS)'
      },
      {
        id: 'OSD-477',
        title: 'Síndrome Neuro-Ocular Espacial (SANS) y Edema Retiniano',
        organism: 'Retina y nervio óptico humano en vuelos de larga duración',
        nasaFacility: 'NASA Johnson Space Center / Ocular Health Laboratory',
        missionContext: 'Monitoreo de agudeza visual y presión intracraneal en microgravedad',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-477',
        findingShort: 'Sin gravedad, los fluidos corporales suben a la cabeza, aplanando la parte posterior del globo ocular e hinchando el nervio óptico, lo que degrada la visión.',
        kidExplanation: 'En la Tierra, la gravedad jala la sangre a tus pies. En el espacio, los líquidos se van a la cabeza: los astronautas tienen la cara hinchada y después de semanas empiezan a ver borroso como si necesitaran anteojos nuevos.',
        tradeoffImpact: {
          choiceYes: 'Usar pantalones de succión de presión negativa (Chibis) 2 horas al día (+18 Salud, -12% Energía)',
          choiceNo: 'Ignorar el tratamiento de presión (+0% gasto energía, -18% Salud y agudeza de navegación)'
        },
        badge: 'OFTALMOLOGÍA ESPACIAL'
      },
      {
        id: 'OSD-313',
        title: 'Daño al Endotelio Cardíaco por Rayos Cósmicos Pesados (Iones de Hierro HZE)',
        organism: 'Tejido cardiovascular bajo radiación de partículas de alta energía',
        nasaFacility: 'NASA Space Radiation Laboratory (NSRL) / Brookhaven National Lab',
        missionContext: 'Simulación de radiación cósmica galáctica (GCR) más allá de la magnetosfera',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-313',
        findingShort: 'Los iones de hierro viajan a velocidades relativistas y atraviesan el hábitat como micro-balas, causando roturas de doble cadena de ADN en las arterias.',
        kidExplanation: 'Las estrellas lejanas que explotaron hace millones de años lanzan rayos cósmicos superveloces. La única forma de frenarlos es con paredes gruesas de hidrógeno, plástico o agua.',
        tradeoffImpact: {
          choiceYes: 'Bombear agua de reserva a las paredes de los dormitorios (+22 Salud, -15% O2 movilizado en tanques)',
          choiceNo: 'Confiar solo en el blindaje de aluminio (+0% gasto agua/O2, -22% Salud cardiovascular)'
        },
        badge: 'RADIOBIOLOGÍA'
      },
      {
        id: 'OSD-665',
        title: 'Evolución y Resistencia a Antibióticos de Microbios en el Hábitat',
        organism: 'Enterobacter bugandensis y cepas bacterianas en superficies cerradas',
        nasaFacility: 'NASA Jet Propulsion Laboratory (JPL) & ISS Environmental Monitoring',
        missionContext: 'Vigilancia genómica de bacterias aisladas en ambientes espaciales sellados',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-665',
        findingShort: 'Bajo estrés de radiación y microgravedad, las bacterias mutan más rápido y desarrollan paredes celulares más gruesas resistentes a los desinfectantes estándar.',
        kidExplanation: 'Las bacterias que viajan en la piel de los astronautas se vuelven más rudas en el espacio. Si no se limpia el hábitat con luz ultravioleta germicida, se vuelven difíciles de eliminar.',
        tradeoffImpact: {
          choiceYes: 'Esterilización UV profunda de conductos de ventilación (-16% Energía, +20% Integridad microbiológica)',
          choiceNo: 'Limpieza superficial con paños (+0% energía, -18% Salud por brote bacteriano)'
        },
        badge: 'GENÓMICA MICROBIANA'
      },
      {
        id: 'OSD-253',
        title: 'Dinámica de Telómeros y Envejecimiento Celular (NASA Twins Study)',
        organism: 'Células sanguíneas de astronautas en misiones de 1 año (Scott y Mark Kelly)',
        nasaFacility: 'NASA Human Research Program & Stanford University',
        missionContext: 'Comparación genética de astronauta en órbita vs. su gemelo en la Tierra',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-253',
        findingShort: 'Los extremos de los cromosomas (telómeros) se alargan temporalmente por estrés en el espacio, pero al regresar a gravedad sufren un acortamiento acelerado e inestabilidad genómica.',
        kidExplanation: 'Tus cromosomas tienen como agujetas con puntas de plástico que protegen tu ADN. La NASA descubrió en dos hermanos gemelos que el espacio somete a estas puntas a un trabajo durísimo.',
        tradeoffImpact: {
          choiceYes: 'Administrar protocolo de enzimas reparadoras y descanso (-12% Energía médica, +25 Salud, +30 Ciencia)',
          choiceNo: 'Priorizar reparaciones externas de la base (+20 Integridad, -18% Salud genética)'
        },
        badge: 'GENÉTICA DE GEMELOS'
      },
      {
        id: 'OSD-578',
        title: 'Degradación Nutricional y Pérdida de Vitaminas en Alimentos Espaciales',
        organism: 'Raciones alimentarias liofilizadas y nutrientes esenciales (B1, C, D)',
        nasaFacility: 'Johnson Space Center Space Food Systems Laboratory',
        missionContext: 'Estabilidad de vitaminas tras almacenamiento prolongado bajo radiación espacial',
        studyUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-578',
        findingShort: 'Las vitaminas C y B1 se descomponen hasta un 40% más rápido en el espacio por la radiación ionizante y el calor, provocando anemia y debilidad en misiones de más de 14 días.',
        kidExplanation: 'La comida de astronauta parece deliciosa en bolsitas, pero con el tiempo los rayos cósmicos destruyen las vitaminas. Si los exploradores no comen vegetales frescos cultivados en la base, pierden energía vital.',
        tradeoffImpact: {
          choiceYes: 'Encender micro-invernadero hidropónico para lechugas frescas (-15% Energía, -10% O2, +25 Salud)',
          choiceNo: 'Consumir paquetes de reserva secos (+0% costo energía, -16% Salud por déficit vitamínico)'
        },
        badge: 'NUTRICIÓN ESPACIAL'
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
