/**
 * Artemis Outpost: Space Canvas Renderer
 * Genera el fondo interactivo en 60 FPS:
 * - Campo de estrellas con centelleo y paralaje
 * - Vista de la Tierra emergiendo ("Earthrise") desde el Polo Sur Lunar
 * - Silueta de cráteres lunares (Cráter Shackleton) y domos del puesto avanzado
 * - Satélites orbitales animados (Lunar Gateway, LRO) y micrometeoritos
 * - Efecto de tormenta solar (CME / DONKI) cuando hay alerta de radiación
 */

class SpaceCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.satellites = [];
    this.shootingStars = [];
    this.auroraParticles = [];
    this.solarStormActive = false;
    this.solarStormIntensity = 0;
    this.width = 0;
    this.height = 0;
    this.lastTime = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initStars(280);
    this.initSatellites();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initStars(count) {
    this.stars = [];
    const colors = ['#ffffff', '#aee4ff', '#ffeaa7', '#dfe6e9', '#74b9ff'];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.78, // Parte superior y media (cielo)
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        layer: Math.random() // Para paralaje suave
      });
    }
  }

  initSatellites() {
    this.satellites = [
      {
        name: 'Lunar Gateway',
        x: -40,
        y: 110,
        vx: 0.38,
        vy: 0.08,
        size: 5,
        solarPanelSpan: 16,
        blinkTimer: 0,
        color: '#00d2d3'
      },
      {
        name: 'Lunar Reconnaissance Orbiter (LRO)',
        x: window.innerWidth + 30,
        y: 190,
        vx: -0.45,
        vy: 0.05,
        size: 3.5,
        solarPanelSpan: 12,
        blinkTimer: 0,
        color: '#feca57'
      }
    ];
  }

  triggerShootingStar() {
    if (Math.random() < 0.012 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * this.width * 0.8 + this.width * 0.1,
        y: Math.random() * this.height * 0.3,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 12,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        life: 1.0
      });
    }
  }

  setSolarStorm(active, intensity = 1.0) {
    this.solarStormActive = active;
    this.solarStormIntensity = intensity;
    if (active && this.auroraParticles.length === 0) {
      for (let i = 0; i < 45; i++) {
        this.auroraParticles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height * 0.65,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.7 + 0.3
        });
      }
    }
  }

  drawEarth() {
    const earthX = this.width * 0.82;
    const earthY = Math.min(180, this.height * 0.22);
    const radius = Math.min(52, this.width * 0.08);

    // Resplandor atmosférico de la Tierra (Atmospheric glow)
    const glowGrad = this.ctx.createRadialGradient(
      earthX, earthY, radius * 0.85,
      earthX, earthY, radius * 1.45
    );
    glowGrad.addColorStop(0, 'rgba(0, 180, 255, 0.45)');
    glowGrad.addColorStop(0.5, 'rgba(0, 120, 255, 0.15)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = glowGrad;
    this.ctx.beginPath();
    this.ctx.arc(earthX, earthY, radius * 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Cuerpo principal de la Tierra (Océanos)
    const earthGrad = this.ctx.createRadialGradient(
      earthX - radius * 0.35, earthY - radius * 0.35, radius * 0.1,
      earthX, earthY, radius
    );
    earthGrad.addColorStop(0, '#48dbfb');
    earthGrad.addColorStop(0.5, '#1e3799');
    earthGrad.addColorStop(0.85, '#0c2461');
    earthGrad.addColorStop(1, '#050f2c');

    this.ctx.fillStyle = earthGrad;
    this.ctx.beginPath();
    this.ctx.arc(earthX, earthY, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Continentes y nubes estilizadas
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(earthX, earthY, radius, 0, Math.PI * 2);
    this.ctx.clip();

    // Masas continentales (verde / beige)
    this.ctx.fillStyle = 'rgba(46, 204, 113, 0.55)';
    this.ctx.beginPath();
    this.ctx.ellipse(earthX - radius * 0.2, earthY - radius * 0.15, radius * 0.35, radius * 0.45, 0.3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(earthX + radius * 0.25, earthY + radius * 0.1, radius * 0.4, radius * 0.3, -0.4, 0, Math.PI * 2);
    this.ctx.fill();

    // Nubes blancas con movimiento y transparencias
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    this.ctx.beginPath();
    this.ctx.ellipse(earthX - radius * 0.1, earthY - radius * 0.3, radius * 0.5, radius * 0.18, 0.15, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(earthX + radius * 0.1, earthY + radius * 0.25, radius * 0.6, radius * 0.2, -0.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Sombra creciente lunar (Fase de la Tierra vista desde la Luna)
    const shadowGrad = this.ctx.createLinearGradient(
      earthX - radius, earthY, earthX + radius, earthY
    );
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGrad.addColorStop(0.65, 'rgba(5, 10, 25, 0.4)');
    shadowGrad.addColorStop(1, 'rgba(0, 2, 10, 0.95)');

    this.ctx.fillStyle = shadowGrad;
    this.ctx.fillRect(earthX - radius, earthY - radius, radius * 2, radius * 2);

    this.ctx.restore();
  }

  drawMoonLandscape() {
    const h = this.height;
    const w = this.width;
    const groundY = h * 0.74;

    // Gradiente de polvo lunar y suelo
    const terrainGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
    terrainGrad.addColorStop(0, '#2d3436');
    terrainGrad.addColorStop(0.2, '#1e272e');
    terrainGrad.addColorStop(0.6, '#0f1418');
    terrainGrad.addColorStop(1, '#050709');

    // Cordillera de fondo (Malapert Mountain / Cresta Shackleton)
    this.ctx.fillStyle = 'rgba(25, 30, 38, 0.95)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h);
    this.ctx.lineTo(0, groundY - 45);
    this.ctx.quadraticCurveTo(w * 0.2, groundY - 75, w * 0.45, groundY - 35);
    this.ctx.quadraticCurveTo(w * 0.7, groundY - 95, w * 0.88, groundY - 50);
    this.ctx.quadraticCurveTo(w * 0.95, groundY - 30, w, groundY - 40);
    this.ctx.lineTo(w, h);
    this.ctx.closePath();
    this.ctx.fill();

    // Relieve del frente (Cráter y regolito con sombras profundas)
    this.ctx.fillStyle = terrainGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(0, h);
    this.ctx.lineTo(0, groundY);
    this.ctx.bezierCurveTo(w * 0.25, groundY + 20, w * 0.4, groundY - 15, w * 0.65, groundY + 12);
    this.ctx.bezierCurveTo(w * 0.8, groundY + 28, w * 0.9, groundY - 8, w, groundY);
    this.ctx.lineTo(w, h);
    this.ctx.closePath();
    this.ctx.fill();

    // Cráteres en sombra permanente (PSR) en el suelo
    const craters = [
      { x: w * 0.16, y: groundY + 45, rx: 55, ry: 18 },
      { x: w * 0.52, y: groundY + 68, rx: 80, ry: 24 },
      { x: w * 0.85, y: groundY + 50, rx: 65, ry: 20 }
    ];

    craters.forEach(c => {
      // Borde iluminado
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, Math.PI, Math.PI * 2);
      this.ctx.stroke();

      // Fondo oscuro en sombra eterna
      this.ctx.fillStyle = '#020406';
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Resplandor de hielo de agua en el fondo del cráter
      const iceGlow = this.ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, c.rx * 0.5);
      iceGlow.addColorStop(0, 'rgba(84, 160, 255, 0.4)');
      iceGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = iceGlow;
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.rx * 0.6, c.ry * 0.6, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Puesto Avanzado Lunar Artemis (Domo inflable y paneles solares verticales)
    this.drawOutpost(w * 0.36, groundY - 2);
  }

  drawOutpost(baseX, baseY) {
    // 1. Tanques criogénicos de O2 / H2 en la periferia
    this.ctx.fillStyle = '#dfe4ea';
    this.ctx.beginPath();
    this.ctx.roundRect(baseX - 165, baseY - 24, 28, 22, 6);
    this.ctx.fill();
    this.ctx.fillStyle = '#2ed573'; // Franja verde O2
    this.ctx.fillRect(baseX - 165, baseY - 15, 28, 4);

    this.ctx.fillStyle = '#ced6e0';
    this.ctx.beginPath();
    this.ctx.roundRect(baseX - 132, baseY - 28, 24, 26, 6);
    this.ctx.fill();
    this.ctx.fillStyle = '#0984e3'; // Franja azul H2
    this.ctx.fillRect(baseX - 132, baseY - 17, 24, 4);

    // 2. Campo de paneles solares verticales grandes (Polo Sur Lunar)
    for (let p = 0; p < 3; p++) {
      const px = baseX - 95 + p * 34;
      const py = baseY + 4;
      // Mástil de soporte
      this.ctx.strokeStyle = '#747d8c';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py);
      this.ctx.lineTo(px, py - 58);
      this.ctx.stroke();

      // Marco de panel fotovoltaico grande
      this.ctx.fillStyle = '#0984e3';
      this.ctx.fillRect(px - 10, py - 68, 20, 44);
      this.ctx.strokeStyle = '#70a1ff';
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeRect(px - 10, py - 68, 20, 44);

      // Rejilla de celdas solares
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(px, py - 68);
      this.ctx.lineTo(px, py - 24);
      this.ctx.moveTo(px - 10, py - 46);
      this.ctx.lineTo(px + 10, py - 46);
      this.ctx.stroke();
    }

    // 3. Torre de comunicaciones y antena de espacio profundo
    const towerX = baseX - 30;
    this.ctx.strokeStyle = '#ced6e0';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(towerX, baseY);
    this.ctx.lineTo(towerX, baseY - 95);
    this.ctx.stroke();

    // Refuerzos cruzados de la torre
    this.ctx.strokeStyle = 'rgba(206, 214, 224, 0.4)';
    this.ctx.lineWidth = 1.5;
    for (let ty = baseY; ty > baseY - 90; ty -= 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(towerX - 8, ty);
      this.ctx.lineTo(towerX + 8, ty - 20);
      this.ctx.moveTo(towerX + 8, ty);
      this.ctx.lineTo(towerX - 8, ty - 20);
      this.ctx.stroke();
    }

    // Plato parabólico grande apuntando a la Tierra
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.arc(towerX, baseY - 95, 18, -0.7, 1.4);
    this.ctx.stroke();

    // Baliza de advertencia parpadeante en la cúspide
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      this.ctx.fillStyle = '#ff4757';
      this.ctx.beginPath();
      this.ctx.arc(towerX, baseY - 99, 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Destello
      this.ctx.fillStyle = 'rgba(255, 71, 87, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(towerX, baseY - 99, 10, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. Domo secundario (Bio-Laboratorio OSDR / Invernadero)
    const labX = baseX + 90;
    const labRadius = 45;
    const labGrad = this.ctx.createRadialGradient(
      labX - 10, baseY - 25, 4,
      labX, baseY - 15, labRadius
    );
    labGrad.addColorStop(0, '#57606f');
    labGrad.addColorStop(0.6, '#2f3542');
    labGrad.addColorStop(1, '#1e272e');

    this.ctx.fillStyle = labGrad;
    this.ctx.beginPath();
    this.ctx.arc(labX, baseY, labRadius, Math.PI, 0, false);
    this.ctx.fill();

    // Cúpula geodésica transparente del bio-laboratorio con luz botánica verde
    this.ctx.fillStyle = 'rgba(46, 213, 115, 0.75)';
    this.ctx.beginPath();
    this.ctx.arc(labX, baseY - 16, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = 'rgba(46, 213, 115, 0.4)';
    this.ctx.beginPath();
    this.ctx.arc(labX - 16, baseY - 10, 8, 0, Math.PI * 2);
    this.ctx.arc(labX + 16, baseY - 10, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // 5. Túnel presurizado de conexión hermético
    this.ctx.fillStyle = '#2f3542';
    this.ctx.fillRect(baseX + 35, baseY - 22, 35, 22);
    this.ctx.strokeStyle = '#57606f';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(baseX + 35, baseY - 22, 35, 22);

    // Ojos de buey iluminados en el túnel
    this.ctx.fillStyle = '#ffeaa7';
    this.ctx.beginPath();
    this.ctx.arc(baseX + 44, baseY - 11, 3.5, 0, Math.PI * 2);
    this.ctx.arc(baseX + 61, baseY - 11, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    // 6. DOMO PRINCIPAL DEL HÁBITAT (Gran tamaño y presencia)
    const domeRadius = 75;
    const domeGrad = this.ctx.createRadialGradient(
      baseX - 20, baseY - 45, 10,
      baseX, baseY - 20, domeRadius
    );
    domeGrad.addColorStop(0, '#ffffff');
    domeGrad.addColorStop(0.35, '#dfe4ea');
    domeGrad.addColorStop(0.7, '#a4b0be');
    domeGrad.addColorStop(1, '#47535e');

    this.ctx.fillStyle = domeGrad;
    this.ctx.beginPath();
    this.ctx.arc(baseX, baseY, domeRadius, Math.PI, 0, false);
    this.ctx.fill();

    // Líneas estructurales de placas de regolito del domo
    this.ctx.strokeStyle = 'rgba(87, 96, 111, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(baseX, baseY, domeRadius * 0.7, Math.PI, 0, false);
    this.ctx.stroke();

    // Ventanas panorámicas de observación de la cúpula (luz cálida interior)
    this.ctx.fillStyle = '#ffeaa7';
    this.ctx.beginPath();
    this.ctx.arc(baseX - 25, baseY - 35, 7, 0, Math.PI * 2);
    this.ctx.arc(baseX + 12, baseY - 35, 7, 0, Math.PI * 2);
    this.ctx.arc(baseX - 8, baseY - 50, 6, 0, Math.PI * 2);
    this.ctx.fill();

    // Resplandor cálido de las ventanas del hábitat
    this.ctx.fillStyle = 'rgba(254, 202, 87, 0.25)';
    this.ctx.beginPath();
    this.ctx.arc(baseX - 8, baseY - 38, 30, 0, Math.PI * 2);
    this.ctx.fill();

    // Esclusa de aire principal con puerto de acople (Airlock)
    this.ctx.fillStyle = '#1e272e';
    this.ctx.fillRect(baseX - 16, baseY - 20, 32, 20);
    this.ctx.strokeStyle = '#00d2d3';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(baseX - 16, baseY - 20, 32, 20);

    // Luz de señalización de la esclusa
    this.ctx.fillStyle = '#00d2d3';
    this.ctx.fillRect(baseX - 12, baseY - 16, 24, 4);

    // 7. Rover lunar estacionado cerca del hábitat con faros
    const roverX = baseX + 160;
    const roverY = baseY - 2;

    // Cono de luz de faros del rover sobre el suelo
    const lightCone = this.ctx.createRadialGradient(
      roverX + 18, roverY, 2,
      roverX + 60, roverY, 50
    );
    lightCone.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    lightCone.addColorStop(0.6, 'rgba(0, 210, 211, 0.15)');
    lightCone.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = lightCone;
    this.ctx.beginPath();
    this.ctx.moveTo(roverX + 16, roverY - 4);
    this.ctx.lineTo(roverX + 65, roverY - 14);
    this.ctx.lineTo(roverX + 65, roverY + 14);
    this.ctx.closePath();
    this.ctx.fill();

    // Chasis del Rover
    this.ctx.fillStyle = '#d2dae2';
    this.ctx.beginPath();
    this.ctx.roundRect(roverX - 14, roverY - 16, 30, 12, 3);
    this.ctx.fill();

    // Ruedas de malla de alambre de titanio (6 ruedas)
    this.ctx.fillStyle = '#485460';
    for (let w = -1; w <= 1; w++) {
      this.ctx.beginPath();
      this.ctx.arc(roverX + w * 11, roverY - 2, 5.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  drawSolarStormParticles() {
    if (!this.solarStormActive) return;

    // Resplandor de radiación ionizante en el cielo
    const stormGrad = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    stormGrad.addColorStop(0, 'rgba(255, 71, 87, 0.15)');
    stormGrad.addColorStop(0.5, 'rgba(255, 165, 2, 0.1)');
    stormGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = stormGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Líneas de flujo de protones solares (CME)
    this.ctx.strokeStyle = 'rgba(255, 107, 129, 0.7)';
    this.ctx.lineWidth = 1.5;
    this.auroraParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y > this.height * 0.7) {
        p.y = 0;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
      this.ctx.stroke();
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Fondo profundo del espacio
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#03050c');
    bgGrad.addColorStop(0.65, '#070b16');
    bgGrad.addColorStop(1, '#0e1424');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dibujar estrellas centelleantes
    this.stars.forEach(s => {
      s.alpha += s.twinkleSpeed;
      if (s.alpha > 1 || s.alpha < 0.2) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;

    // Estrellas fugaces / Micrometeoritos
    this.triggerShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      const tailX = ss.x - Math.cos(ss.angle) * ss.len;
      const tailY = ss.y - Math.sin(ss.angle) * ss.len;

      const grad = this.ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.life})`);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(ss.x, ss.y);
      this.ctx.stroke();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= 0.04;

      if (ss.life <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }

    // Dibujar Satélites orbitales
    this.satellites.forEach(sat => {
      sat.x += sat.vx;
      sat.y += sat.vy;

      // Reaparecer al salir de pantalla
      if (sat.vx > 0 && sat.x > this.width + 60) {
        sat.x = -60;
        sat.y = Math.random() * (this.height * 0.35) + 60;
      } else if (sat.vx < 0 && sat.x < -60) {
        sat.x = this.width + 60;
        sat.y = Math.random() * (this.height * 0.35) + 60;
      }

      // Dibujar satélite con paneles solares
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(sat.x - sat.size / 2, sat.y - sat.size / 2, sat.size, sat.size);

      // Paneles solares
      this.ctx.fillStyle = sat.color;
      this.ctx.fillRect(sat.x - sat.solarPanelSpan, sat.y - 2, sat.solarPanelSpan - 3, 4);
      this.ctx.fillRect(sat.x + 3, sat.y - 2, sat.solarPanelSpan - 3, 4);

      // Destello intermitente
      sat.blinkTimer += 0.05;
      if (Math.sin(sat.blinkTimer) > 0.8) {
        this.ctx.fillStyle = '#fffa65';
        this.ctx.beginPath();
        this.ctx.arc(sat.x, sat.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Dibujar la Tierra en el horizonte lunar
    this.drawEarth();

    // Dibujar partículas si hay tormenta solar activa
    this.drawSolarStormParticles();

    // Dibujar el relieve lunar y la base Artemis
    this.drawMoonLandscape();

    requestAnimationFrame(this.animate);
  }
}

window.SpaceCanvas = SpaceCanvas;
