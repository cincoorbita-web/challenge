/**
 * ORBITA5: Módulo de Aventura Lunar Junior (Público Objetivo: 7 a 9 años)
 * Arcade de exploración lunar interactivo con AstroCan.
 * 
 * Características principales:
 * - Simulación de 5 Días Lunares con misiones de recolección y supervivencia.
 * - Desplazamiento y salto en baja gravedad lunar (1/6 g).
 * - Esquiva obstáculos (rocas lunares, cráteres, micrometeoritos) que restan recursos clave.
 * - Recolección de suministros (oxígeno 💨, baterías ⚡, blindaje 🛡️, muestras de hielo 🌟) que restauran recursos.
 * - Al completar cada día, se presenta un Dato Científico Real de la NASA con locución
 *   en audio automática por defecto (Web Speech API) para que los niños más pequeños no dependan de la lectura.
 * - Totalmente bilingüe (Español / Inglés) y compatible con controles de teclado y botones táctiles en pantalla.
 */

class JuniorArcadeGame {
  constructor() {
    this.screenEl = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.lastTime = 0;

    // Estado de la Misión Junior (5 Días)
    this.currentDay = 1;
    this.totalDays = 5;
    this.dayProgress = 0; // 0% a 100%
    this.dayDuration = 20; // ~20 segundos de conducción activa por día
    this.isPaused = false;
    this.isPlaying = false;
    this.audioEnabled = true; // Por defecto: narración en voz alta activada
    this.autoAdvanceTimer = null; // Timer para avanzar de día automáticamente con audio
    this.playerName = 'Junior';

    // Recursos vitales de supervivencia del Rover
    this.resources = {
      oxygen: 100,
      energy: 100,
      hull: 100,
      science: 0
    };

    // Estado del Rover de AstroCan
    this.rover = {
      x: 300,
      y: 330,
      width: 76,
      height: 52,
      speedX: 0,
      maxSpeedX: 5.5,
      accelX: 0.65,
      friction: 0.88,
      tilt: 0,
      // Salto en baja gravedad lunar (1/6 g)
      isJumping: false,
      jumpOffset: 0,
      jumpVelocity: 0,
      gravity: 0.42,
      wheelRot: 0
    };

    // Colecciones del mundo dinámico
    this.keys = {};
    this.entities = []; // Obstáculos y Coleccionables
    this.particles = []; // Chispas, estrellas, polvo lunar
    this.floatingDeltas = []; // Indicadores flotantes en canvas (+15% O2, etc.)
    this.nextSpawnTimer = 0;

    // Elementos del DOM suscritos
    this.dom = {};

    // 5 Datos Curiosos Científicos de la NASA (Educativos / Niños 7-9 años)
    this.scienceFacts = [
      {
        day: 1,
        titleKey: 'junior_fact_1_title',
        bodyKey: 'junior_fact_1_body',
        tagKey: 'junior_fact_1_tag',
        icon: '🦘',
        bgPhase: 'dawn'
      },
      {
        day: 2,
        titleKey: 'junior_fact_2_title',
        bodyKey: 'junior_fact_2_body',
        tagKey: 'junior_fact_2_tag',
        icon: '💎',
        bgPhase: 'midday'
      },
      {
        day: 3,
        titleKey: 'junior_fact_3_title',
        bodyKey: 'junior_fact_3_body',
        tagKey: 'junior_fact_3_tag',
        icon: '🧊',
        bgPhase: 'shadow'
      },
      {
        day: 4,
        titleKey: 'junior_fact_4_title',
        bodyKey: 'junior_fact_4_body',
        tagKey: 'junior_fact_4_tag',
        icon: '🌡️',
        bgPhase: 'storm'
      },
      {
        day: 5,
        titleKey: 'junior_fact_5_title',
        bodyKey: 'junior_fact_5_body',
        tagKey: 'junior_fact_5_tag',
        icon: '🏆',
        bgPhase: 'base'
      }
    ];

    // Estrellas de fondo para parallax
    this.stars = [];
  }

  isEn() {
    return typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';
  }

  t(key, params = {}) {
    if (typeof window !== 'undefined' && window.i18n) {
      return window.i18n.t(key, params);
    }
    return key;
  }

  /**
   * Inicializa las referencias del DOM y vincula eventos
   */
  init() {
    this.screenEl = document.getElementById('screen-junior-arcade');
    this.canvas = document.getElementById('junior-arcade-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Cachear elementos de UI
    this.dom = {
      valDay: document.getElementById('junior-hud-day'),
      barProgress: document.getElementById('junior-bar-progress'),
      valO2: document.getElementById('junior-val-o2'),
      barO2: document.getElementById('junior-bar-o2'),
      valEnergy: document.getElementById('junior-val-energy'),
      barEnergy: document.getElementById('junior-bar-energy'),
      valHull: document.getElementById('junior-val-hull'),
      barHull: document.getElementById('junior-bar-hull'),
      valScience: document.getElementById('junior-val-science'),
      btnAudioToggle: document.getElementById('junior-btn-audio-toggle'),
      btnVoice: document.getElementById('junior-btn-voice'),
      btnExit: document.getElementById('junior-btn-exit'),
      // Banner de transmisión en vivo (reproducción fluida con audio)
      broadcastCard: document.getElementById('junior-broadcast-card'),
      broadcastTitle: document.getElementById('junior-broadcast-title'),
      broadcastText: document.getElementById('junior-broadcast-text'),
      broadcastTag: document.getElementById('junior-broadcast-tag'),
      broadcastFill: document.getElementById('junior-broadcast-fill'),
      btnBroadcastSkip: document.getElementById('junior-btn-broadcast-skip'),
      // Modal educativo (lectura pausada cuando el audio está silenciado)
      modalFact: document.getElementById('junior-modal-fact'),
      factDayTag: document.getElementById('junior-fact-day-tag'),
      factTitle: document.getElementById('junior-fact-title'),
      factBody: document.getElementById('junior-fact-body'),
      factNasaBadge: document.getElementById('junior-fact-nasa-badge'),
      btnListenAgain: document.getElementById('junior-btn-listen-again'),
      btnNextDay: document.getElementById('junior-btn-next-day'),
      // Modal fin / derrota
      modalEnd: document.getElementById('junior-modal-end'),
      endTitle: document.getElementById('junior-end-title'),
      endSubtitle: document.getElementById('junior-end-subtitle'),
      endStars: document.getElementById('junior-end-stars'),
      endStats: document.getElementById('junior-end-stats'),
      btnEndRestart: document.getElementById('junior-btn-end-restart'),
      btnEndHome: document.getElementById('junior-btn-end-home'),
      // Controles táctiles
      touchLeft: document.getElementById('junior-touch-left'),
      touchRight: document.getElementById('junior-touch-right'),
      touchJump: document.getElementById('junior-touch-jump')
    };

    // Crear estrellas de fondo
    this.stars = [];
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 220,
        size: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.02
      });
    }

    this.bindEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas || !this.screenEl) return;
    const wrapper = this.canvas.parentElement;
    if (!wrapper) return;

    const availableWidth = Math.min(840, wrapper.clientWidth || 800);
    const targetHeight = Math.min(480, Math.max(340, Math.round(availableWidth * 0.58)));

    this.canvas.width = availableWidth;
    this.canvas.height = targetHeight;

    // Reubicar posición base del rover según el alto del canvas
    this.rover.y = this.canvas.height - 75;
    if (this.rover.x > this.canvas.width - 60) {
      this.rover.x = this.canvas.width / 2;
    }
  }

  bindEvents() {
    // Teclado
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying || this.isPaused) return;
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) {
        this.keys.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) {
        this.keys.right = true;
      }
      if (['ArrowUp', 'Space', 'KeyW', 'w', 'W'].includes(e.code)) {
        this.triggerJump();
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) {
        this.keys.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) {
        this.keys.right = false;
      }
    });

    // Controles táctiles en pantalla
    const bindTouch = (btn, action) => {
      if (!btn) return;
      const start = (e) => {
        e.preventDefault();
        if (action === 'left') this.keys.left = true;
        if (action === 'right') this.keys.right = true;
        if (action === 'jump') this.triggerJump();
      };
      const end = (e) => {
        e.preventDefault();
        if (action === 'left') this.keys.left = false;
        if (action === 'right') this.keys.right = false;
      };

      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };

    bindTouch(this.dom.touchLeft, 'left');
    bindTouch(this.dom.touchRight, 'right');
    bindTouch(this.dom.touchJump, 'jump');

    // Toque / Arrastre directo en el Canvas
    let touchStartX = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.isPlaying || this.isPaused || e.touches.length === 0) return;
      touchStartX = e.touches[0].clientX;
      const rect = this.canvas.getBoundingClientRect();
      const canvasX = e.touches[0].clientX - rect.left;

      if (canvasX < rect.width * 0.4) {
        this.keys.left = true;
        this.keys.right = false;
      } else if (canvasX > rect.width * 0.6) {
        this.keys.right = true;
        this.keys.left = false;
      } else {
        this.triggerJump();
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.isPlaying || this.isPaused || e.touches.length === 0) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX;
      if (diff < -20) {
        this.keys.left = true;
        this.keys.right = false;
      } else if (diff > 20) {
        this.keys.right = true;
        this.keys.left = false;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.keys.left = false;
      this.keys.right = false;
    });

    // Botón de alternar audio (Voz de la NASA)
    if (this.dom.btnAudioToggle) {
      this.dom.btnAudioToggle.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        this.updateAudioButtonUI();
        if (!this.audioEnabled && window.speechNarrator) {
          window.speechNarrator.stop();
        }
      });
    }

    // Botón Salir al Menú Principal
    if (this.dom.btnExit) {
      this.dom.btnExit.addEventListener('click', () => {
        this.exitToHome();
      });
    }

    // Botón de salto de transmisión radial en vivo (Continuar ya)
    if (this.dom.btnBroadcastSkip) {
      this.dom.btnBroadcastSkip.addEventListener('click', () => {
        if (this.autoAdvanceTimer) {
          clearTimeout(this.autoAdvanceTimer);
          this.autoAdvanceTimer = null;
        }
        if (window.speechNarrator) {
          window.speechNarrator.stop();
        }
        this.advanceToNextDay();
      });
    }

    // Botones del Modal de Dato Científico (cuando audio está apagado)
    if (this.dom.btnListenAgain) {
      this.dom.btnListenAgain.addEventListener('click', () => {
        this.narrateCurrentFact(true);
      });
    }

    if (this.dom.btnNextDay) {
      this.dom.btnNextDay.addEventListener('click', () => {
        this.advanceToNextDay();
      });
    }

    // Botones de Fin de Misión / Reintento
    if (this.dom.btnEndRestart) {
      this.dom.btnEndRestart.addEventListener('click', () => {
        if (this.resources.oxygen <= 0 || this.resources.energy <= 0 || this.resources.hull <= 0) {
          this.retryDay();
        } else {
          this.start(this.playerName);
        }
      });
    }

    if (this.dom.btnEndHome) {
      this.dom.btnEndHome.addEventListener('click', () => {
        this.exitToHome();
      });
    }
  }

  triggerJump() {
    if (!this.rover.isJumping) {
      this.rover.isJumping = true;
      this.rover.jumpVelocity = 9.2; // Salto alto y flotante por 1/6 de gravedad
      if (window.gameAudio) window.gameAudio.playClick();

      // Partículas de polvo de despegue
      for (let i = 0; i < 10; i++) {
        this.particles.push({
          x: this.rover.x + (Math.random() * 40 - 20),
          y: this.rover.y + 10,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * -1.8 - 0.5,
          radius: Math.random() * 3 + 1.5,
          color: 'rgba(200, 214, 229, 0.7)',
          life: 28,
          maxLife: 28
        });
      }
    }
  }

  updateAudioButtonUI() {
    if (!this.dom.btnAudioToggle) return;
    const label = this.audioEnabled ? this.t('junior_audio_active') : this.t('junior_audio_muted');
    this.dom.btnAudioToggle.textContent = label;
    this.dom.btnAudioToggle.classList.toggle('audio-active', this.audioEnabled);
  }

  /**
   * Inicia la experiencia completa de 5 días
   */
  start(playerName = 'Junior Astronaut') {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    this.playerName = playerName || 'Junior';
    this.currentDay = 1;
    this.dayProgress = 0;
    this.isPaused = false;
    this.isPlaying = true;
    this.entities = [];
    this.particles = [];
    this.floatingDeltas = [];
    this.nextSpawnTimer = 0.5;

    // Recursos iniciales al 100%
    this.resources = {
      oxygen: 100,
      energy: 100,
      hull: 100,
      science: 0
    };

    this.resizeCanvas();
    this.rover.x = this.canvas.width / 2;
    this.rover.y = this.canvas.height - 75;
    this.rover.speedX = 0;
    this.rover.jumpOffset = 0;
    this.rover.isJumping = false;

    // Ocultar modales y banner de transmisión
    if (this.dom.modalFact) this.dom.modalFact.classList.add('hidden');
    if (this.dom.modalEnd) this.dom.modalEnd.classList.add('hidden');
    if (this.dom.broadcastCard) this.dom.broadcastCard.classList.add('hidden');

    this.updateHUD();
    this.updateAudioButtonUI();

    // Reacción entusiasta de AstroCan
    if (window.astroMascot) {
      window.astroMascot.setEmotion(
        'greeting',
        this.isEn()
          ? `Welcome to Junior Space Rover, ${this.playerName}! Dodge lunar rocks and collect oxygen with me!`
          : `¡Bienvenido al Rover Espacial Junior, ${this.playerName}! ¡Esquiva rocas lunares y recolecta oxígeno conmigo!`
      );
    }

    if (window.gameAudio) window.gameAudio.playClick();

    // Iniciar bucle de animación
    this.lastTime = performance.now();
    cancelAnimationFrame(this.animId);
    this.gameLoop = (time) => {
      const dt = Math.min(0.1, (time - this.lastTime) / 1000);
      this.lastTime = time;

      if (this.isPlaying && !this.isPaused) {
        this.update(dt);
      }
      this.render();

      this.animId = requestAnimationFrame(this.gameLoop);
    };
    this.animId = requestAnimationFrame(this.gameLoop);
  }

  stop() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    cancelAnimationFrame(this.animId);
    if (this.dom.broadcastCard) {
      this.dom.broadcastCard.classList.add('hidden');
    }
    if (window.speechNarrator) {
      window.speechNarrator.stop();
    }
  }

  exitToHome() {
    this.stop();
    if (this.screenEl) this.screenEl.classList.add('hidden');
    const welcome = document.getElementById('screen-welcome');
    if (welcome) welcome.classList.remove('hidden');

    if (window.astroMascot) {
      window.astroMascot.setEmotion('greeting');
    }
    if (window.gameAudio) window.gameAudio.playClick();
  }

  /**
   * Actualización lógica de físicas, spawn y colisiones
   */
  update(dt) {
    // 1. Progresión del Día actual (~20 segundos por día)
    this.dayProgress += (dt / this.dayDuration) * 100;
    if (this.dayProgress >= 100) {
      this.dayProgress = 100;
      this.updateHUD();
      this.completeDay();
      return;
    }

    // 2. Consumo basal dinámico de supervivencia según el día (exige esquivar y recolectar)
    this.resources.oxygen = Math.max(0, this.resources.oxygen - dt * (1.1 + this.currentDay * 0.15));
    this.resources.energy = Math.max(0, this.resources.energy - dt * (1.2 + this.currentDay * 0.15));

    // Si algún recurso vital llega a 0, pausar y ofrecer recarga
    if (this.resources.oxygen <= 0 || this.resources.energy <= 0 || this.resources.hull <= 0) {
      this.handleSuppliesDepleted();
      return;
    }

    // 3. Movimiento horizontal del Rover
    if (this.keys.left) {
      this.rover.speedX -= this.rover.accelX;
      this.rover.tilt = Math.max(-0.16, this.rover.tilt - 0.035);
    } else if (this.keys.right) {
      this.rover.speedX += this.rover.accelX;
      this.rover.tilt = Math.min(0.16, this.rover.tilt + 0.035);
    } else {
      this.rover.speedX *= this.rover.friction;
      this.rover.tilt *= 0.85;
    }

    this.rover.speedX = Math.max(-this.rover.maxSpeedX, Math.min(this.rover.maxSpeedX, this.rover.speedX));
    this.rover.x += this.rover.speedX;

    // Límites de la pista lunar
    const minX = 40;
    const maxX = this.canvas.width - 40;
    if (this.rover.x < minX) {
      this.rover.x = minX;
      this.rover.speedX = 0;
    }
    if (this.rover.x > maxX) {
      this.rover.x = maxX;
      this.rover.speedX = 0;
    }

    // 4. Salto en baja gravedad lunar
    if (this.rover.isJumping) {
      this.rover.jumpOffset += this.rover.jumpVelocity;
      this.rover.jumpVelocity -= this.rover.gravity;

      if (this.rover.jumpOffset <= 0) {
        this.rover.jumpOffset = 0;
        this.rover.isJumping = false;
        this.rover.jumpVelocity = 0;
      }
    }

    // Rotación de ruedas con la marcha
    this.rover.wheelRot += 0.12;

    // 5. Spawn de Obstáculos y Coleccionables con cadencia rápida y desafiante
    this.nextSpawnTimer -= dt;
    if (this.nextSpawnTimer <= 0) {
      this.spawnEntity();
      // Cadencia dinámica de spawn: entre 0.35 y 0.70 segundos
      this.nextSpawnTimer = Math.random() * 0.35 + Math.max(0.35, 0.65 - this.currentDay * 0.06);
    }

    // Velocidad de avance del terreno acelerada según el día (220 a 320 px/s)
    const worldSpeed = 220 + (this.currentDay * 20);

    // 6. Actualización de Entidades y Detección de Colisiones
    const roverBox = {
      x: this.rover.x - this.rover.width / 2 + 10,
      y: (this.rover.y - this.rover.jumpOffset) - this.rover.height / 2 + 5,
      width: this.rover.width - 20,
      height: this.rover.height - 10
    };

    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.y += worldSpeed * dt;

      // Colisión AABB amigable
      const isColliding = (
        roverBox.x < ent.x + ent.radius &&
        roverBox.x + roverBox.width > ent.x - ent.radius &&
        roverBox.y < ent.y + ent.radius &&
        roverBox.y + roverBox.height > ent.y - ent.radius
      );

      // Si el rover está saltando lo suficientemente alto, supera obstáculos terrestres
      const isJumpedOver = ent.isObstacle && ent.canJumpOver && (this.rover.jumpOffset > 24);

      if (isColliding) {
        if (isJumpedOver) {
          // ¡Salto exitoso por encima del obstáculo! Bonificación acrobática
          this.resources.science += 5;
          this.spawnFloatingDelta(ent.x, ent.y, '+5 ⭐', '#f1c40f');
          this.spawnSparkles(ent.x, ent.y, '#f1c40f', 6);
          this.entities.splice(i, 1);
          continue;
        }

        // Aplicar impacto del objeto
        this.handleEntityCollision(ent);
        this.entities.splice(i, 1);
        continue;
      }

      // Remover si salió del canvas
      if (ent.y > this.canvas.height + 60) {
        this.entities.splice(i, 1);
      }
    }

    // 7. Partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 8. Badges flotantes en canvas
    for (let i = this.floatingDeltas.length - 1; i >= 0; i--) {
      const d = this.floatingDeltas[i];
      d.y -= 38 * dt;
      d.alpha -= 0.6 * dt;
      if (d.alpha <= 0) {
        this.floatingDeltas.splice(i, 1);
      }
    }

    this.updateHUD();
  }

  /**
   * Genera un nuevo obstáculo o coleccionable en la parte superior del camino
   */
  spawnEntity() {
    // Proporción desafiante: más obstáculos a medida que avanzan los días (50% a 70%)
    const obstacleChance = Math.min(0.70, 0.50 + (this.currentDay * 0.045));
    const isObstacle = Math.random() < obstacleChance;
    const margin = 50;
    const spawnX = Math.random() * (this.canvas.width - margin * 2) + margin;

    if (isObstacle) {
      const obsTypes = [
        { type: 'boulder', icon: '🪨', label: 'Roca', radius: 19, cost: { hull: -18, energy: -5 }, canJumpOver: true, color: '#7f8c8d' },
        { type: 'crater', icon: '🕳️', label: 'Cráter', radius: 23, cost: { energy: -20, hull: -8 }, canJumpOver: true, color: '#34495e' },
        { type: 'meteor', icon: '☄️', label: 'Meteorito', radius: 18, cost: { hull: -22, oxygen: -12 }, canJumpOver: false, color: '#e74c3c' }
      ];
      const selected = obsTypes[Math.floor(Math.random() * obsTypes.length)];
      this.entities.push({
        ...selected,
        isObstacle: true,
        x: spawnX,
        y: -30
      });
    } else {
      const colTypes = [
        { type: 'oxygen', icon: '💨', label: '+O2', radius: 18, gain: { oxygen: 18 }, color: '#00d2d3' },
        { type: 'battery', icon: '⚡', label: '+Energy', radius: 18, gain: { energy: 18 }, color: '#feca57' },
        { type: 'repair', icon: '🛡️', label: '+Hull', radius: 18, gain: { hull: 18 }, color: '#48dbfb' },
        { type: 'crystal', icon: '🌟', label: '+Ciencia', radius: 20, gain: { science: 30, oxygen: 8, energy: 8 }, color: '#9b59b6' }
      ];
      const selected = colTypes[Math.floor(Math.random() * colTypes.length)];
      this.entities.push({
        ...selected,
        isObstacle: false,
        x: spawnX,
        y: -30
      });
    }
  }

  /**
   * Maneja colisión con objeto o coleccionable
   */
  handleEntityCollision(ent) {
    if (ent.isObstacle) {
      // Daño por obstáculo
      if (ent.cost.hull) this.resources.hull = Math.max(0, this.resources.hull + ent.cost.hull);
      if (ent.cost.energy) this.resources.energy = Math.max(0, this.resources.energy + ent.cost.energy);
      if (ent.cost.oxygen) this.resources.oxygen = Math.max(0, this.resources.oxygen + ent.cost.oxygen);

      const penaltyParts = [];
      if (ent.cost.hull) penaltyParts.push(`${ent.cost.hull}% 🛡️`);
      if (ent.cost.energy) penaltyParts.push(`${ent.cost.energy}% ⚡`);
      if (ent.cost.oxygen) penaltyParts.push(`${ent.cost.oxygen}% 💨`);
      const penaltyText = penaltyParts.join(' ');

      this.spawnFloatingDelta(ent.x, ent.y, penaltyText, '#ff4757');
      this.spawnDustPuff(ent.x, ent.y);

      if (window.gameAudio) window.gameAudio.playAlarm();

      // AstroCan se asusta brevemente
      if (window.astroMascot) {
        window.astroMascot.setEmotion('scared', this.isEn() ? 'Ouch! Careful with that lunar obstacle!' : '¡Ouch! ¡Cuidado con ese obstáculo lunar!');
      }
    } else {
      // Ganancia por coleccionable
      if (ent.gain.oxygen) this.resources.oxygen = Math.min(100, this.resources.oxygen + ent.gain.oxygen);
      if (ent.gain.energy) this.resources.energy = Math.min(100, this.resources.energy + ent.gain.energy);
      if (ent.gain.hull) this.resources.hull = Math.min(100, this.resources.hull + ent.gain.hull);
      if (ent.gain.science) this.resources.science += ent.gain.science;

      const gainText = ent.gain.science
        ? `+${ent.gain.science} 🔬`
        : ent.gain.oxygen ? `+${ent.gain.oxygen}% 💨` : `+${ent.gain.energy}% ⚡`;

      this.spawnFloatingDelta(ent.x, ent.y, gainText, '#2ed573');
      this.spawnSparkles(ent.x, ent.y, ent.color, 12);

      if (window.gameAudio) window.gameAudio.playCollect();

      // AstroCan celebra la recolección
      if (window.astroMascot && Math.random() < 0.3) {
        window.astroMascot.setEmotion('celebrating', this.isEn() ? 'Great catch, Junior Astronaut!' : '¡Excelente recolección, Pequeño Astronauta!');
      }
    }
  }

  spawnSparkles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        color: color || '#f1c40f',
        life: 30,
        maxLife: 30
      });
    }
  }

  spawnDustPuff(x, y) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color: 'rgba(189, 195, 199, 0.65)',
        life: 25,
        maxLife: 25
      });
    }
  }

  spawnFloatingDelta(x, y, text, color) {
    this.floatingDeltas.push({
      x,
      y,
      text,
      color: color || '#ffffff',
      alpha: 1.0
    });
  }

  /**
   * Finaliza el día actual y presenta el Dato Curioso.
   * Si la narración con voz está activa, se reproduce fluidamente mediante un
   * banner radial interactivo y avanza automáticamente al terminar, sin bloquear con modales obligatorios.
   */
  completeDay() {
    this.isPaused = true;
    if (window.gameAudio) window.gameAudio.playVictory();

    // Bonificación moderada de suministros de la base (+10% a todos)
    this.resources.oxygen = Math.min(100, this.resources.oxygen + 10);
    this.resources.energy = Math.min(100, this.resources.energy + 10);
    this.resources.hull = Math.min(100, this.resources.hull + 10);

    const factData = this.scienceFacts[this.currentDay - 1];
    const isEn = this.isEn();
    const title = this.t(factData.titleKey);
    const body = this.t(factData.bodyKey);
    const tag = this.t(factData.tagKey);
    const speechScript = `${title}. ${body}`;

    // Reacción de AstroCan al dato científico
    if (window.astroMascot) {
      window.astroMascot.setEmotion('thinking', title);
    }

    // FLUJO CON NARRACIÓN DE VOZ ACTIVA:
    // Transmisión radial en vivo no bloqueante que avanza sola al culminar el audio
    if (this.audioEnabled) {
      if (this.dom.modalFact) this.dom.modalFact.classList.add('hidden');

      if (this.dom.broadcastCard) {
        if (this.dom.broadcastTitle) this.dom.broadcastTitle.textContent = `${factData.icon} ${title}`;
        if (this.dom.broadcastText) this.dom.broadcastText.textContent = body;
        if (this.dom.broadcastTag) this.dom.broadcastTag.textContent = tag;

        // Reiniciar barra de progreso visual de la transmisión radial
        if (this.dom.broadcastFill) {
          this.dom.broadcastFill.style.transition = 'none';
          this.dom.broadcastFill.style.width = '0%';
          setTimeout(() => {
            if (this.dom.broadcastFill) {
              const estDuration = Math.max(5.5, speechScript.length * 0.08);
              this.dom.broadcastFill.style.transition = `width ${estDuration}s linear`;
              this.dom.broadcastFill.style.width = '100%';
            }
          }, 60);
        }

        this.dom.broadcastCard.classList.remove('hidden');
      }

      if (this.autoAdvanceTimer) {
        clearTimeout(this.autoAdvanceTimer);
        this.autoAdvanceTimer = null;
      }

      // Reproducir audio con Web Speech API y pasar callback de finalización
      if (window.speechNarrator) {
        window.speechNarrator.speakText(speechScript, 'junior-fact', () => {
          if (this.autoAdvanceTimer) {
            clearTimeout(this.autoAdvanceTimer);
            this.autoAdvanceTimer = null;
          }
          this.advanceToNextDay();
        });
      }

      // Fallback de seguridad en caso de que onend no dispare
      const fallbackMs = Math.max(6500, speechScript.length * 90);
      this.autoAdvanceTimer = setTimeout(() => {
        this.advanceToNextDay();
      }, fallbackMs);

    } else {
      // FLUJO CON AUDIO SILENCIADO/DESACTIVADO:
      // Se muestra el modal tradicional para lectura manual a su propio ritmo
      if (this.dom.broadcastCard) this.dom.broadcastCard.classList.add('hidden');

      if (this.dom.modalFact) {
        const dayText = isEn
          ? `NASA SCIENCE TRANSMISSION — DAY ${this.currentDay} / 5`
          : `TRANSMISIÓN EDUCATIVA NASA — DÍA ${this.currentDay} DE 5`;

        if (this.dom.factDayTag) this.dom.factDayTag.textContent = dayText;
        if (this.dom.factTitle) this.dom.factTitle.textContent = `${factData.icon} ${title}`;
        if (this.dom.factBody) this.dom.factBody.textContent = body;
        if (this.dom.factNasaBadge) this.dom.factNasaBadge.textContent = tag;

        if (this.dom.btnNextDay) {
          this.dom.btnNextDay.textContent = (this.currentDay === this.totalDays)
            ? this.t('junior_btn_finish')
            : this.t('junior_btn_next_day');
        }

        this.dom.modalFact.classList.remove('hidden');
      }
    }
  }

  narrateCurrentFact(forced = false) {
    if (!this.audioEnabled && !forced) return;
    if (window.speechNarrator) {
      const factData = this.scienceFacts[this.currentDay - 1];
      const title = this.t(factData.titleKey);
      const body = this.t(factData.bodyKey);
      const speechScript = `${title}. ${body}`;

      window.speechNarrator.speakText(speechScript, 'junior-fact');
    }
  }

  advanceToNextDay() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    if (window.speechNarrator) {
      window.speechNarrator.stop();
    }
    if (this.dom.broadcastCard) {
      this.dom.broadcastCard.classList.add('hidden');
    }
    if (this.dom.modalFact) {
      this.dom.modalFact.classList.add('hidden');
    }

    if (this.currentDay >= this.totalDays) {
      this.showVictoryScreen();
      return;
    }

    this.currentDay++;
    this.dayProgress = 0;
    this.entities = [];
    this.isPaused = false;

    if (window.astroMascot) {
      window.astroMascot.setEmotion(
        'relaxed',
        this.isEn()
          ? `Day ${this.currentDay} starting! Keep your eyes on the road, Commander!`
          : `¡Comenzando el Día ${this.currentDay}! ¡Ojos atentos al camino, Comandante!`
      );
    }

    if (window.gameAudio) window.gameAudio.playClick();
  }

  retryDay() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    if (window.speechNarrator) {
      window.speechNarrator.stop();
    }
    this.dayProgress = 0;
    this.isPaused = false;
    this.isPlaying = true;
    this.entities = [];
    this.particles = [];
    this.floatingDeltas = [];
    this.nextSpawnTimer = 0.5;

    // Recargar suministros al 100% para la nueva tentativa del día
    this.resources.oxygen = 100;
    this.resources.energy = 100;
    this.resources.hull = 100;

    this.rover.x = this.canvas.width / 2;
    this.rover.speedX = 0;
    this.rover.jumpOffset = 0;
    this.rover.isJumping = false;

    if (this.dom.modalEnd) this.dom.modalEnd.classList.add('hidden');
    if (this.dom.modalFact) this.dom.modalFact.classList.add('hidden');
    if (this.dom.broadcastCard) this.dom.broadcastCard.classList.add('hidden');

    this.updateHUD();
    if (window.astroMascot) {
      window.astroMascot.setEmotion(
        'relaxed',
        this.isEn()
          ? `Supplies restocked! Let's conquer Day ${this.currentDay} together!`
          : `¡Suministros recargados! ¡A conquistar el Día ${this.currentDay} juntos!`
      );
    }
    if (window.gameAudio) window.gameAudio.playClick();
  }

  showVictoryScreen() {
    this.isPlaying = false;
    this.isPaused = true;
    if (window.gameAudio) window.gameAudio.playVictory();

    if (this.dom.modalEnd) {
      if (this.dom.endTitle) this.dom.endTitle.textContent = this.t('junior_victory_title');
      if (this.dom.endSubtitle) this.dom.endSubtitle.textContent = this.t('junior_victory_sub');
      if (this.dom.endStars) this.dom.endStars.innerHTML = '⭐⭐⭐';

      const isEn = this.isEn();
      if (this.dom.endStats) {
        this.dom.endStats.innerHTML = `
          <div class="junior-end-stat-card">
            <span>📅 ${isEn ? 'Days Survived:' : 'Días Superados:'}</span>
            <strong>5 / 5</strong>
          </div>
          <div class="junior-end-stat-card">
            <span>🔬 ${isEn ? 'Science Gathered:' : 'Muestras de Ciencia:'}</span>
            <strong>${this.resources.science} pts</strong>
          </div>
          <div class="junior-end-stat-card">
            <span>🛡️ ${isEn ? 'Base Status:' : 'Estado Final Base:'}</span>
            <strong style="color: #2ed573;">${isEn ? 'OPTIMAL' : 'ÓPTIMO'}</strong>
          </div>
        `;
      }

      this.dom.modalEnd.classList.remove('hidden');

      if (window.astroMascot) {
        window.astroMascot.setEmotion('celebrating');
      }

      // Narración de felicitación por voz
      if (this.audioEnabled && window.speechNarrator) {
        const victoryMsg = isEn
          ? `Hooray! Congratulations ${this.playerName}! You completed all 5 lunar days and earned your Junior Explorer badge!`
          : `¡Viva! ¡Felicitaciones ${this.playerName}! ¡Has completado los 5 días lunares y ganado tu medalla de Explorador Junior!`;
        window.speechNarrator.speakText(victoryMsg, 'junior-victory');
      }
    }
  }

  handleSuppliesDepleted() {
    this.isPaused = true;
    if (window.gameAudio) window.gameAudio.playDefeat();

    if (this.dom.modalEnd) {
      if (this.dom.endTitle) this.dom.endTitle.textContent = this.t('junior_depleted_title');
      if (this.dom.endSubtitle) this.dom.endSubtitle.textContent = this.t('junior_depleted_sub');
      if (this.dom.endStars) this.dom.endStars.innerHTML = '⭐';

      const isEn = this.isEn();
      if (this.dom.endStats) {
        this.dom.endStats.innerHTML = `
          <p style="font-size: 0.95rem; color: #ced6e0; margin-bottom: 10px;">
            ${isEn
              ? 'In space exploration, every mission teaches us how to survive. Let\'s recharge our supplies and try again!'
              : 'En la exploración espacial, cada intento nos enseña a sobrevivir mejor. ¡Recarguemos suministros y volvamos a la pista!'}
          </p>
        `;
      }

      if (this.dom.btnEndRestart) {
        this.dom.btnEndRestart.textContent = this.t('junior_btn_retry_day');
      }

      this.dom.modalEnd.classList.remove('hidden');

      if (window.astroMascot) {
        window.astroMascot.setEmotion('scared');
      }

      if (this.audioEnabled && window.speechNarrator) {
        const retryMsg = isEn
          ? 'Supplies ran low, but true astronauts never give up! Let\'s recharge and try again!'
          : '¡Se agotaron los suministros, pero los verdaderos astronautas nunca se rinden! ¡Recarguemos y volvamos a intentarlo!';
        window.speechNarrator.speakText(retryMsg, 'junior-retry');
      }
    }
  }

  /**
   * Actualiza las barras de progreso y colores de semáforo
   */
  updateHUD() {
    const isEn = this.isEn();

    // 1. Día y barra de avance del día
    if (this.dom.valDay) {
      this.dom.valDay.textContent = `${isEn ? 'Day' : 'Día'} ${this.currentDay} / ${this.totalDays}`;
    }
    if (this.dom.barProgress) {
      this.dom.barProgress.style.width = `${Math.min(100, Math.max(0, this.dayProgress))}%`;
    }

    // 2. Barras de recursos con Sistema de Semáforo
    const updateMeter = (valEl, barEl, value) => {
      const clamped = Math.max(0, Math.min(100, Math.round(value)));
      if (valEl) valEl.textContent = `${clamped}%`;
      if (barEl) {
        barEl.style.width = `${clamped}%`;
        barEl.classList.toggle('danger', clamped <= 25);
        barEl.classList.toggle('warning', clamped > 25 && clamped <= 50);
      }
    };

    updateMeter(this.dom.valO2, this.dom.barO2, this.resources.oxygen);
    updateMeter(this.dom.valEnergy, this.dom.barEnergy, this.resources.energy);
    updateMeter(this.dom.valHull, this.dom.barHull, this.resources.hull);

    if (this.dom.valScience) {
      this.dom.valScience.textContent = `${this.resources.science} pts`;
    }
  }

  /**
   * Renderizado en Canvas (Fondo lunar, estrellas, parallax, rover y entidades)
   */
  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Cielo espacial con estrellas titilantes
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    skyGrad.addColorStop(0, '#020512');
    skyGrad.addColorStop(0.7, '#071026');
    skyGrad.addColorStop(1, '#0c1a3b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Estrellas
    for (const star of this.stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // La Tierra en el horizonte lunar
    ctx.save();
    ctx.beginPath();
    ctx.arc(w * 0.85, 60, 24, 0, Math.PI * 2);
    const earthGrad = ctx.createRadialGradient(w * 0.85 - 5, 55, 2, w * 0.85, 60, 26);
    earthGrad.addColorStop(0, '#48dbfb');
    earthGrad.addColorStop(0.6, '#0984e3');
    earthGrad.addColorStop(1, '#053d7a');
    ctx.fillStyle = earthGrad;
    ctx.fill();
    // Atmósfera de la Tierra
    ctx.strokeStyle = 'rgba(0, 210, 211, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    // 2. Colinas lunares de fondo (Parallax)
    ctx.fillStyle = '#1e273f';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.58);
    ctx.quadraticCurveTo(w * 0.25, h * 0.5, w * 0.55, h * 0.59);
    ctx.quadraticCurveTo(w * 0.8, h * 0.52, w, h * 0.58);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // 3. Suelo lunar (Regolito con textura y perspectiva hacia el rover)
    const groundGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    groundGrad.addColorStop(0, '#2f3640');
    groundGrad.addColorStop(0.4, '#353b48');
    groundGrad.addColorStop(1, '#1e222d');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    // Líneas guía de pista espacial para dar sensación de velocidad y avance
    ctx.strokeStyle = 'rgba(0, 210, 211, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.6);
    ctx.lineTo(20, h);
    ctx.moveTo(w * 0.8, h * 0.6);
    ctx.lineTo(w - 20, h);
    ctx.stroke();

    // 4. Renderizar Entidades (Obstáculos y Coleccionables)
    for (const ent of this.entities) {
      this.drawEntity(ctx, ent);
    }

    // 5. Haz de luz de los faros del Rover sobre el regolito lunar
    ctx.save();
    const beamY = this.rover.y - this.rover.jumpOffset;
    const lightGrad = ctx.createRadialGradient(
      this.rover.x, beamY - 10, 10,
      this.rover.x, beamY - 70, 95
    );
    lightGrad.addColorStop(0, 'rgba(255, 230, 100, 0.35)');
    lightGrad.addColorStop(1, 'rgba(255, 230, 100, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(this.rover.x - 25, beamY);
    ctx.lineTo(this.rover.x - 70, beamY - 110);
    ctx.lineTo(this.rover.x + 70, beamY - 110);
    ctx.lineTo(this.rover.x + 25, beamY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 6. Sombra del Rover en el suelo lunar
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    const shadowScale = Math.max(0.4, 1 - (this.rover.jumpOffset / 120));
    ctx.beginPath();
    ctx.ellipse(this.rover.x, this.rover.y + 14, 32 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Dibujar el Rover de AstroCan
    this.drawRover(ctx);

    // 8. Partículas y Destellos
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }

    // 9. Badges de deltas flotantes en Canvas
    for (const d of this.floatingDeltas) {
      ctx.save();
      ctx.font = 'bold 16px "Fredoka", sans-serif';
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.alpha;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(d.text, d.x - 20, d.y);
      ctx.restore();
    }
  }

  /**
   * Dibuja los objetos y obstáculos en el canvas
   */
  drawEntity(ctx, ent) {
    ctx.save();
    ctx.translate(ent.x, ent.y);

    // Sombra en el suelo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, ent.radius * 0.7, ent.radius * 0.8, ent.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (ent.isObstacle) {
      if (ent.type === 'boulder') {
        // Roca lunar facetada
        ctx.fillStyle = '#7f8c8d';
        ctx.beginPath();
        ctx.moveTo(-ent.radius, 0);
        ctx.lineTo(-ent.radius * 0.6, -ent.radius);
        ctx.lineTo(ent.radius * 0.4, -ent.radius * 0.9);
        ctx.lineTo(ent.radius, -ent.radius * 0.2);
        ctx.lineTo(ent.radius * 0.7, ent.radius * 0.7);
        ctx.lineTo(-ent.radius * 0.5, ent.radius * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (ent.type === 'crater') {
        // Cráter lunar
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.ellipse(0, 0, ent.radius, ent.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7f8c8d';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        // Micrometeorito brillante
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, 0, ent.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    } else {
      // Coleccionables con halo resplandeciente
      ctx.shadowColor = ent.color;
      ctx.shadowBlur = 12;

      ctx.fillStyle = ent.color;
      ctx.beginPath();
      ctx.arc(0, 0, ent.radius, 0, Math.PI * 2);
      ctx.fill();

      // Borde exterior
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Emoji/Icono central
      ctx.shadowBlur = 0;
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ent.icon, 0, 1);
    }

    ctx.restore();
  }

  /**
   * Dibuja el Rover con AstroCan al volante
   */
  drawRover(ctx) {
    const rx = this.rover.x;
    const ry = this.rover.y - this.rover.jumpOffset;

    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(this.rover.tilt);

    // 1. Chasis del Rover (Estilo NASA Artemis)
    ctx.fillStyle = '#f5f6fa';
    ctx.strokeStyle = '#00d2d3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-28, -14, 56, 22, 6);
    ctx.fill();
    ctx.stroke();

    // Detalle dorado aeroespacial
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(-22, -10, 44, 4);

    // 2. Cabina de vidrio y AstroCan
    ctx.fillStyle = 'rgba(72, 219, 251, 0.4)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(0, -18, 16, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Casco espacial de AstroCan
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -18, 11, 0, Math.PI * 2);
    ctx.fill();

    // Visor dorado del casco de astronauta
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(0, -17, 7, 0, Math.PI);
    ctx.fill();

    // Orejas de perrito en el casco
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(-8, -25, 4, 0, Math.PI * 2);
    ctx.arc(8, -25, 4, 0, Math.PI * 2);
    ctx.fill();

    // 3. Antena de comunicación con satélite NASA
    ctx.strokeStyle = '#718093';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, -14);
    ctx.lineTo(-24, -28);
    ctx.stroke();

    // Luz parpadeante de señal
    ctx.fillStyle = (Date.now() % 600 < 300) ? '#2ed573' : '#00d2d3';
    ctx.beginPath();
    ctx.arc(-24, -28, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Faros delanteros
    ctx.fillStyle = '#feca57';
    ctx.fillRect(-26, -6, 5, 5);
    ctx.fillRect(21, -6, 5, 5);

    // 5. Cuatro Ruedas lunares con suspensión
    const drawWheel = (wx, wy) => {
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(this.rover.wheelRot);
      ctx.fillStyle = '#2f3542';
      ctx.strokeStyle = '#747d8c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-6, -7, 12, 14, 3);
      ctx.fill();
      ctx.stroke();
      // Rayos de la llanta
      ctx.beginPath();
      ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
      ctx.stroke();
      ctx.restore();
    };

    drawWheel(-24, 10);
    drawWheel(-10, 10);
    drawWheel(10, 10);
    drawWheel(24, 10);

    ctx.restore();
  }
}

// Instancia global
window.juniorArcadeGame = new JuniorArcadeGame();
