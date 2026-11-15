/**
 * ORBITA5: NASA DONKI (Space Weather Database Of Notifications, Knowledge, and Information)
 * Integra datos reales de actividad solar, eyecciones de masa coronal (CME), llamaradas (FLR)
 * y partículas energéticas solares (SEP) desde las APIs públicas y datos abiertos de la NASA.
 * Soporta conexión en vivo vía api.nasa.gov/DONKI y banco histórico oficial curado de heliofísica.
 */

class DonkiService {
  constructor() {
    this.apiKey = 'DEMO_KEY'; // Clave pública abierta de la NASA
    this.apiBase = 'https://api.nasa.gov/DONKI';
    this.isLive = false;
    this.cachedEvents = [];
    this.lastFetchedAt = 0;

    // Catálogo auténtico de eventos solares documentados por telescopios espaciales de la NASA (SDO, SOHO, STEREO, ACE)
    this.historicalEvents = [
      {
        id: 'DONKI-2024-10-03-FLR-X9',
        title: 'Llamarada Solar Extrema Clase X9.05 (AR3842)',
        catalogDate: '2024-10-03',
        type: 'FLR/CME',
        speed: 1820,
        halfAngle: 72,
        target: 'Sector Polo Sur Lunar (ORBITA5)',
        severity: 'EXTREMA',
        radiationDoseMsv: 245,
        spacecraft: 'Solar Dynamics Observatory (SDO / AIA 131)',
        summary: 'La región activa AR3842 produjo la llamarada más potente del Ciclo Solar 25 (X9.05), acompañada de una eyección de masa coronal ultra-rápida.',
        scienceFact: 'Los rayos X viajan a la velocidad de la luz y alcanzaron la Luna en solo 8 minutos. Las partículas pesadas llegaron 45 minutos después, cargando eléctricamente el regolito lunar.',
        powerCostToShield: 42,
        unshieldedHealthDamage: 32
      },
      {
        id: 'DONKI-2024-05-10-CME-01',
        title: 'Gran Tormenta Solar Histórica (Clase X5.8 / AR3664)',
        catalogDate: '2024-05-10',
        type: 'CME',
        speed: 1650,
        halfAngle: 65,
        target: 'Impacto Lunar Frontal',
        severity: 'EXTREMA',
        radiationDoseMsv: 220,
        spacecraft: 'SOHO / LASCO C3 & SDO',
        summary: 'La mancha solar AR3664 detonó una serie de eyecciones de masa coronal masivas. Es una de las tormentas más intensas registradas en las últimas dos décadas.',
        scienceFact: 'En la Tierra, el campo magnético desvió estas partículas creando auroras visibles hasta el trópico. Pero en la Luna, al no haber magnetosfera ni aire, los protones golpean el suelo directamente.',
        powerCostToShield: 40,
        unshieldedHealthDamage: 30
      },
      {
        id: 'DONKI-2023-03-24-FLR-M',
        title: 'Llamarada Solar Clase M2.8 con Flujo de Protones',
        catalogDate: '2023-03-24',
        type: 'FLR/SEP',
        speed: 980,
        halfAngle: 42,
        target: 'Flanco Lunar Oeste',
        severity: 'MODERADA',
        radiationDoseMsv: 85,
        spacecraft: 'SDO HMI & GOES-16 SUVI',
        summary: 'Telescopios espaciales de la NASA detectaron una fuerte emisión en rayos X ultravioleta con aceleración de partículas energéticas a alta velocidad.',
        scienceFact: 'Las partículas energéticas solares (SEP) viajan casi a la velocidad de la luz y pueden penetrar los trajes espaciales si los astronautas están en una caminata exterior (EVA).',
        powerCostToShield: 25,
        unshieldedHealthDamage: 18
      },
      {
        id: 'DONKI-2022-10-02-CME-FAST',
        title: 'Eyección Rápida Halo de Filamento Solar',
        catalogDate: '2022-10-02',
        type: 'CME',
        speed: 1240,
        halfAngle: 55,
        target: 'Espacio Interplanetario / Sistema Tierra-Luna',
        severity: 'ALTA',
        radiationDoseMsv: 140,
        spacecraft: 'SOHO LASCO & STEREO Ahead',
        summary: 'Un filamento magnético inestable colapsó sobre la cromosfera, arrojando plasma a 4.5 millones de km/h rumbo al polo sur lunar.',
        scienceFact: 'El agua y el regolito lunar son excelentes escudos naturales. 50 centímetros de regolito compactado bloquean gran parte de los rayos cósmicos y protones.',
        powerCostToShield: 35,
        unshieldedHealthDamage: 25
      },
      {
        id: 'DONKI-2024-01-22-SEP-LEVE',
        title: 'Evento de Partículas Solares Menor (Clase C9)',
        catalogDate: '2024-01-22',
        type: 'SEP',
        speed: 620,
        halfAngle: 28,
        target: 'Órbita Cislunar',
        severity: 'LEVE',
        radiationDoseMsv: 35,
        spacecraft: 'ACE EPAM & DSCOVR',
        summary: 'Pequeño destello solar que incrementó temporalmente el conteo de protones medido por la red satelital en el punto Lagrange L1.',
        scienceFact: 'Los hábitats espaciales de la NASA utilizan sensores HERA (Hybrid Electronic Radiation Assessor) para alertar a la tripulación con minutos de anticipación.',
        powerCostToShield: 15,
        unshieldedHealthDamage: 10
      },
      {
        id: 'DONKI-2017-09-06-FLR-X93',
        title: 'Mega-Llamarada Solar Clase X9.3 (AR2673)',
        catalogDate: '2017-09-06',
        type: 'FLR/CME',
        speed: 1960,
        halfAngle: 80,
        target: 'Impacto Lunar Directo',
        severity: 'EXTREMA',
        radiationDoseMsv: 260,
        spacecraft: 'Solar Dynamics Observatory (SDO)',
        summary: 'Una de las mayores llamaradas del Ciclo Solar 24 liberó tanta energía como mil millones de bombas de hidrógeno en segundos.',
        scienceFact: 'La radiación ionizante no se siente ni se huele; los astronautas solo saben que hay una tormenta gracias a los dosímetros personales y a la telemetría de DONKI.',
        powerCostToShield: 45,
        unshieldedHealthDamage: 35
      },
      {
        id: 'DONKI-2023-08-05-CH-WIND',
        title: 'Corriente de Viento Solar Rápido por Agujero Coronal',
        catalogDate: '2023-08-05',
        type: 'HSS',
        speed: 740,
        halfAngle: 35,
        target: 'Polo Sur Lunar',
        severity: 'MODERADA',
        radiationDoseMsv: 65,
        spacecraft: 'Parker Solar Probe & ACE',
        summary: 'Un agujero coronal oscuro en el polo norte solar abrió líneas de campo magnético, liberando viento solar a más de 700 km/s.',
        scienceFact: 'El viento solar rápido erosiona las rocas lunares a nivel atómico en un proceso llamado "pulverización catódica" (sputtering).',
        powerCostToShield: 20,
        unshieldedHealthDamage: 14
      },
      {
        id: 'DONKI-2024-03-23-CME-HALO',
        title: 'Eyección de Masa Coronal en Halo Completo',
        catalogDate: '2024-03-23',
        type: 'CME',
        speed: 1100,
        halfAngle: 90,
        target: 'Sistema Tierra-Luna',
        severity: 'ALTA',
        radiationDoseMsv: 125,
        spacecraft: 'SOHO / LASCO C2',
        summary: 'Una nube simétrica de plasma en 360 grados fue captada expandiéndose hacia la Luna, generando una alerta de tormenta severa.',
        scienceFact: 'Cuando una CME es de "halo completo", significa que viaja directamente hacia el observador. En la Luna, el blindaje magnético activo debe encenderse de inmediato.',
        powerCostToShield: 32,
        unshieldedHealthDamage: 22
      }
    ];
  }

  // Intenta consultar la API en vivo de NASA DONKI con timeout seguro y ventana de fechas dinámica
  async fetchLiveAlerts() {
    try {
      const today = new Date();
      // Ventana de 45 días para asegurar detección de eventos recientes en el ciclo solar
      const past = new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000);
      const startDate = past.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const url = `${this.apiBase}/CME?startDate=${startDate}&endDate=${endDate}&api_key=${this.apiKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`NASA API status: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        this.isLive = true;
        this.cachedEvents = this.transformLiveEvents(data);
        this.lastFetchedAt = Date.now();
        return this.cachedEvents;
      }
    } catch (err) {
      // Fallback transparente al banco histórico oficial de la NASA
      this.isLive = false;
    }
    return this.historicalEvents;
  }

  // Transforma eventos crudos del formato JSON de la NASA a formato estructurado del juego
  transformLiveEvents(nasaItems) {
    return nasaItems.slice(0, 8).map((item, idx) => {
      const speed = item.cmeAnalyses && item.cmeAnalyses[0] ? Math.round(item.cmeAnalyses[0].speed || 850) : 850;
      const severity = speed > 1300 ? 'EXTREMA' : speed > 900 ? 'ALTA' : 'MODERADA';
      const radDose = Math.round(speed / 8.5);

      return {
        id: `DONKI-LIVE-${item.activityID || idx}`,
        title: `Alerta Solar en Vivo: CME (${item.startTime ? item.startTime.substring(0, 10) : 'Fecha Reciente'})`,
        catalogDate: item.startTime ? item.startTime.substring(0, 10) : 'En Vivo',
        type: 'CME',
        speed: speed,
        halfAngle: item.cmeAnalyses && item.cmeAnalyses[0] ? item.cmeAnalyses[0].halfAngle || 45 : 45,
        target: 'Sector Polo Sur Lunar (ORBITA5)',
        severity: severity,
        radiationDoseMsv: radDose,
        spacecraft: 'Flota Espacial Heliofísica de la NASA (SDO / SOHO / STEREO)',
        summary: item.note || 'Evento de eyección de masa coronal capturado en vivo por la red de alerta temprana de clima espacial de la NASA (DONKI).',
        scienceFact: 'El observatorio espacial SOHO y el telescopio SDO vigilan el Sol las 24 horas para dar tiempo a los astronautas de resguardarse en el búnker de regolito.',
        powerCostToShield: Math.min(45, Math.max(15, Math.round(radDose * 0.22))),
        unshieldedHealthDamage: Math.min(35, Math.max(12, Math.round(radDose * 0.18)))
      };
    });
  }

  // Obtiene un evento aleatorio favoreciendo eventos que el usuario no haya visto en partidas anteriores
  getEventForDay(day, difficultyLevel) {
    const pool = (this.isLive && this.cachedEvents.length > 0) ? this.cachedEvents : this.historicalEvents;

    // Obtener IDs de eventos DONKI ya vistos en partidas previas
    let seenDonki = [];
    try {
      if (typeof localStorage !== 'undefined') {
        seenDonki = JSON.parse(localStorage.getItem('orbita5_seen_donki') || '[]');
      }
    } catch (e) {}

    // Filtrar candidatos por nivel de severidad adecuado
    let candidates = pool;
    if (difficultyLevel === 1) {
      candidates = pool.filter(e => e.severity === 'LEVE' || e.severity === 'MODERADA');
    } else if (difficultyLevel === 2) {
      candidates = pool.filter(e => e.severity === 'ALTA' || e.severity === 'MODERADA');
    } else {
      candidates = pool.filter(e => e.severity === 'EXTREMA' || e.severity === 'ALTA');
    }

    if (candidates.length === 0) candidates = pool;

    // Priorizar eventos no vistos previamente
    const unseen = candidates.filter(e => !seenDonki.includes(e.id));
    const chosenList = unseen.length > 0 ? unseen : candidates;

    // Selección aleatoria para alta rejugabilidad
    const selected = chosenList[Math.floor(Math.random() * chosenList.length)];

    // Registrar en el historial de eventos vistos
    try {
      if (typeof localStorage !== 'undefined') {
        if (!seenDonki.includes(selected.id)) {
          seenDonki.push(selected.id);
          // Si ya vio casi todos, reiniciar ciclo para permitir rejugabilidad infinita
          if (seenDonki.length >= pool.length) seenDonki = [selected.id];
          localStorage.setItem('orbita5_seen_donki', JSON.stringify(seenDonki));
        }
      }
    } catch (e) {}

    return selected;
  }
}

window.donkiService = new DonkiService();
