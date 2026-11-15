/**
 * Artemis Outpost: Minigame - "Desvío de Energía y Escudo Solar DONKI"
 * Desafío interactivo táctil / teclado contra reloj para niños de 7 a 12 años.
 * Enseña la compensación en tiempo real: ¿Cuánta energía estás dispuesto a sacrificar
 * de la base para proteger a los astronautas de la tormenta de radiación solar?
 */

class ShieldMinigame {
  constructor() {
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.timerId = null;
    this.timeLeft = 12;
    this.onCompleteCallback = null;

    // Asignación de energía por subsistema (deslizadores)
    this.allocation = {
      lab: 35,      // % energía del laboratorio científico
      heating: 40,  // % energía de calefacción
      greenhouse: 25 // % energía del invernadero
    };

    // Partículas de radiación solar entrantes
    this.protons = [];
    this.shieldRadius = 60;
    this.shieldStrength = 0; // Calculado de los sliders
  }

  start(containerEl, onComplete) {
    this.container = containerEl;
    this.onCompleteCallback = onComplete;
    this.timeLeft = 12;

    if (window.gameAudio) {
      window.gameAudio.playAlarm();
    }

    this.renderUI();
    this.initCanvas();
    this.startTimer();
  }

  calculateShield() {
    // La energía total desviada al escudo es la suma ponderada que el jugador decida transferir
    const totalDiverted = (100 - this.allocation.lab) * 0.4 + 
                          (100 - this.allocation.heating) * 0.4 + 
                          (100 - this.allocation.greenhouse) * 0.2;
    this.shieldStrength = Math.round(totalDiverted);
    return this.shieldStrength;
  }

  renderUI() {
    this.container.innerHTML = `
      <div class="minigame-card modal-glass">
        <div class="minigame-header">
          <div class="alarm-badge">
            <span class="alarm-pulsing-dot"></span> ALERTA SOLAR EN VIVO: PROTOCOLO DONKI
          </div>
          <div class="countdown-clock" id="shield-clock">⏱️ 12s</div>
        </div>

        <p class="minigame-instruction">
          ¡Una ráfaga de protones solares impactará el hábitat! Mueve los deslizadores para <strong>desviar energía</strong> hacia las bobinas del <strong>Escudo Magnético</strong> antes de que acabe el tiempo. 
          <br><span class="highlight-warn">Recuerda: Cuanta más energía desvíes, más fría quedará la base y menos ciencia producirás.</span>
        </p>

        <div class="shield-interactive-grid">
          <div class="shield-view-col">
            <canvas id="shield-canvas" width="340" height="260"></canvas>
            <div class="shield-meter-wrapper">
              <span class="shield-meter-label">Potencia del Escudo: <strong id="shield-val-text">50%</strong></span>
              <div class="meter-bar-track">
                <div id="shield-bar-fill" class="meter-bar-fill" style="width: 50%;"></div>
              </div>
            </div>
          </div>

          <div class="sliders-control-col">
            <!-- Slider 1: Laboratorio -->
            <div class="slider-group">
              <div class="slider-label-row">
                <span>🔬 Laboratorio de Ciencia:</span>
                <span id="lab-val" class="slider-num">35%</span>
              </div>
              <input type="range" id="slider-lab" min="0" max="100" value="35" class="range-slider">
              <small class="slider-hint">Bajar a 0% desvía energía al escudo, pero apaga las computadoras científicas.</small>
            </div>

            <!-- Slider 2: Calefacción -->
            <div class="slider-group">
              <div class="slider-label-row">
                <span>🔥 Calefacción de Módulos:</span>
                <span id="heat-val" class="slider-num">40%</span>
              </div>
              <input type="range" id="slider-heat" min="0" max="100" value="40" class="range-slider">
              <small class="slider-hint">Bajar a 0% apaga radiadores; la base se enfriará a 5°C esta noche.</small>
            </div>

            <!-- Slider 3: Invernadero -->
            <div class="slider-group">
              <div class="slider-label-row">
                <span>🌱 Invernadero Botánico:</span>
                <span id="green-val" class="slider-num">25%</span>
              </div>
              <input type="range" id="slider-green" min="0" max="100" value="25" class="range-slider">
              <small class="slider-hint">Bajar a 0% apaga las luces LED ultravioleta de las plantas.</small>
            </div>

            <button id="btn-lock-shield" class="btn-primary-action pulse-btn">
              ⚡ FIJAR ESCUDO Y SOPORTAR IMPACTO
            </button>
          </div>
        </div>
      </div>
    `;

    // Conectar eventos de sliders
    const sliderLab = document.getElementById('slider-lab');
    const sliderHeat = document.getElementById('slider-heat');
    const sliderGreen = document.getElementById('slider-green');
    const btnLock = document.getElementById('btn-lock-shield');

    const updateSliders = () => {
      this.allocation.lab = parseInt(sliderLab.value, 10);
      this.allocation.heating = parseInt(sliderHeat.value, 10);
      this.allocation.greenhouse = parseInt(sliderGreen.value, 10);

      document.getElementById('lab-val').textContent = `${this.allocation.lab}%`;
      document.getElementById('heat-val').textContent = `${this.allocation.heating}%`;
      document.getElementById('green-val').textContent = `${this.allocation.greenhouse}%`;

      const power = this.calculateShield();
      document.getElementById('shield-val-text').textContent = `${power}%`;
      const fill = document.getElementById('shield-bar-fill');
      fill.style.width = `${power}%`;
      fill.style.backgroundColor = power > 75 ? '#2ed573' : power > 45 ? '#ffa502' : '#ff4757';

      if (window.gameAudio) window.gameAudio.playClick();
    };

    sliderLab.addEventListener('input', updateSliders);
    sliderHeat.addEventListener('input', updateSliders);
    sliderGreen.addEventListener('input', updateSliders);
    btnLock.addEventListener('click', () => this.finishMinigame());

    this.calculateShield();
  }

  initCanvas() {
    this.canvas = document.getElementById('shield-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Inicializar protones solares
    this.protons = [];
    for (let i = 0; i < 40; i++) {
      this.protons.push({
        x: Math.random() * this.canvas.width + this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: -(Math.random() * 3 + 4),
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.5,
        color: Math.random() > 0.4 ? '#ff6b81' : '#ffa502'
      });
    }

    this.animateCanvas();
  }

  animateCanvas() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const domeX = w * 0.28;
    const domeY = h * 0.55;

    this.ctx.fillStyle = '#0a0d18';
    this.ctx.fillRect(0, 0, w, h);

    // Domo del hábitat lunar en el canvas
    this.ctx.fillStyle = '#ced6e0';
    this.ctx.beginPath();
    this.ctx.arc(domeX, domeY, 32, Math.PI * 0.5, Math.PI * 1.5);
    this.ctx.fill();

    // Campo de fuerza magnético generado
    const shieldStrengthPct = this.shieldStrength / 100;
    const shieldArc = this.ctx.createRadialGradient(
      domeX, domeY, 35,
      domeX, domeY, 55
    );
    const alpha = Math.min(0.9, shieldStrengthPct * 0.95);
    shieldArc.addColorStop(0, `rgba(0, 210, 211, ${alpha * 0.2})`);
    shieldArc.addColorStop(0.8, `rgba(0, 210, 211, ${alpha})`);
    shieldArc.addColorStop(1, 'rgba(0, 210, 211, 0)');

    this.ctx.fillStyle = shieldArc;
    this.ctx.beginPath();
    this.ctx.arc(domeX, domeY, 52, -Math.PI * 0.45, Math.PI * 0.45, false);
    this.ctx.lineWidth = Math.max(1, shieldStrengthPct * 8);
    this.ctx.strokeStyle = `rgba(116, 185, 255, ${alpha})`;
    this.ctx.stroke();

    // Mover y rebotar protones solares
    this.protons.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Distancia al domo
      const dx = p.x - domeX;
      const dy = p.y - domeY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Si choca con el escudo magnético
      if (dist < 52 && p.x > domeX) {
        if (Math.random() < shieldStrengthPct) {
          // El protón es desviado hacia arriba o abajo
          p.vx = Math.abs(p.vx) * 0.8;
          p.vy = (dy > 0 ? 1 : -1) * (Math.random() * 4 + 2);
        } else {
          // El protón penetra el escudo débil y golpea la base
          p.x = -10;
        }
      }

      // Reiniciar protones que salen de pantalla
      if (p.x < 0 || p.y < 0 || p.y > h) {
        p.x = w + Math.random() * 40;
        p.y = Math.random() * h;
        p.vx = -(Math.random() * 3 + 4);
        p.vy = (Math.random() - 0.5) * 1.5;
      }

      // Dibujar protón con estela
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
      this.ctx.stroke();
    });

    this.animId = requestAnimationFrame(() => this.animateCanvas());
  }

  startTimer() {
    this.timerId = setInterval(() => {
      this.timeLeft--;
      const clock = document.getElementById('shield-clock');
      if (clock) clock.textContent = `⏱️ ${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.finishMinigame();
      }
    }, 1000);
  }

  finishMinigame() {
    clearInterval(this.timerId);
    if (this.animId) cancelAnimationFrame(this.animId);

    const shield = this.shieldStrength;
    let delta = {};
    let debriefText = '';

    // Cálculo real de compensaciones según la decisión del niño:
    const energySacrificed = Math.round(shield * 0.35); // Energía gastada en el escudo
    const scienceLost = Math.round((100 - this.allocation.lab) * 0.15); // Ciencia perdida por apagar el lab

    if (shield >= 75) {
      // Escudo blindado
      delta = {
        energy: -energySacrificed,
        health: 0, // Cero daño por radiación
        science: -scienceLost,
        integrity: 0
      };
      debriefText = `¡Excelente desvío de energía (${shield}%)! Bloqueaste el 100% de la eyección de masa coronal DONKI. La tripulación está a salvo sin daño biológico, aunque tus reservas de energía bajaron un ${energySacrificed}%.`;
    } else if (shield >= 45) {
      // Escudo moderado
      delta = {
        energy: -energySacrificed,
        health: -12, // Dosis moderada
        science: Math.max(5, 20 - scienceLost),
        integrity: -5
      };
      debriefText = `Escudo calibrado al ${shield}%. Lograste desviar la mayoría de los protones, pero una filtración causó una dosis de radiación leve (-12% Salud) en los astronautas.`;
    } else {
      // Escudo insuficiente
      delta = {
        energy: -10, // Ahorraste energía
        health: -28, // Severo daño por radiación
        science: 15,
        integrity: -10
      };
      debriefText = `¡Escudo insuficiente (${shield}%)! La tormenta solar DONKI atravesó el hábitat. Ahorraste energía eléctrica, pero la tripulación absorbió radiación de alta energía (-28% Salud) y experimenta náuseas espaciales.`;
    }

    if (this.onCompleteCallback) {
      this.onCompleteCallback(delta, debriefText);
    }
  }
}

window.ShieldMinigame = ShieldMinigame;
