/**
 * ORBITA5: Minigame - "Rover Ice Miner en Cráter Shackleton"
 * Navegación 2D en penumbra lunar para recolectar hielo de agua en zonas de sombra permanente (PSR).
 * Enseña la compensación de riesgo: ¿Arriesgas agotar la batería del rover por un cristal más,
 * o aseguras el regreso a salvo a la esclusa del hábitat?
 */

class RoverMinigame {
  constructor() {
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.animId = null;
    this.onCompleteCallback = null;

    // Estado del Rover
    this.rover = {
      x: 180,
      y: 180,
      angle: 0,
      speed: 0,
      maxSpeed: 2.8,
      turnSpeed: 0.055,
      battery: 100,
      hull: 100,
      iceCollected: 0
    };

    this.keys = {};
    this.boulders = [];
    this.iceCrystals = [];
    this.baseAirlock = { x: 45, y: 45, radius: 28 };
    this.isDone = false;
  }

  start(containerEl, onComplete) {
    this.container = containerEl;
    this.onCompleteCallback = onComplete;
    this.isDone = false;

    this.rover = {
      x: 220,
      y: 200,
      angle: 0,
      speed: 0,
      maxSpeed: 2.8,
      turnSpeed: 0.055,
      battery: 100,
      hull: 100,
      iceCollected: 0
    };

    this.renderUI();
    this.initWorld();
    this.initCanvas();
    this.bindControls();
  }

  renderUI() {
    const isEn = typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';
    this.container.innerHTML = `
      <div class="minigame-card modal-glass">
        <div class="minigame-header">
          <div class="alarm-badge" style="background: rgba(0, 180, 255, 0.2); border-color: #00d2d3;">
            ${isEn ? '🧊 POLAR EXPEDITION: SHACKLETON CRATER (-230°C)' : '🧊 EXPEDICIÓN POLAR: CRÁTER SHACKLETON (-230°C)'}
          </div>
          <div class="rover-stats-pill">
            ${isEn ? 'Ice:' : 'Hielo:'} <strong id="rover-ice-count" style="color: #48dbfb;">0</strong> ${isEn ? 'crystals' : 'cristales'}
          </div>
        </div>

        <p class="minigame-instruction">
          ${isEn 
            ? 'Drive the Rover with <strong>Arrow keys / WASD</strong> or touch buttons. Collect <strong>water ice</strong> in the dark crater and press <strong>"RETURN TO AIRLOCK"</strong> before your battery runs out.'
            : 'Conduce el Rover con las <strong>Flechas / WASD</strong> o los botones de pantalla. Recolecta <strong>hielo de agua</strong> en la oscuridad del cráter y presiona <strong>"RETORNAR A LA ESCLUSA"</strong> antes de que se agote la batería del rover.'}
        </p>

        <div class="rover-game-layout">
          <div class="rover-canvas-wrapper">
            <canvas id="rover-canvas" width="460" height="340"></canvas>
            <div class="rover-meters-bar">
              <div class="meter-box">
                <span>🔋 ${isEn ? 'Battery:' : 'Batería:'} <strong id="rover-battery-text">100%</strong></span>
                <div class="meter-bar-track">
                  <div id="rover-bat-fill" class="meter-bar-fill" style="width: 100%; background: #2ed573;"></div>
                </div>
              </div>
              <div class="meter-box">
                <span>🛡️ ${isEn ? 'Chassis:' : 'Chasis:'} <strong id="rover-hull-text">100%</strong></span>
                <div class="meter-bar-track">
                  <div id="rover-hull-fill" class="meter-bar-fill" style="width: 100%; background: #00d2d3;"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="rover-side-actions">
            <!-- Botón de retorno estratégico -->
            <button id="btn-return-airlock" class="btn-primary-action pulse-btn" style="background: linear-gradient(135deg, #0984e3, #00cec9);">
              🚀 ${isEn ? 'RETURN TO AIRLOCK WITH ICE' : 'REGRESAR A LA ESCLUSA CON EL HIELO'}
            </button>
            <small style="display:block; text-align:center; color: #a4b0be; margin-top: 6px;">
              ${isEn ? "Don't let battery hit 0%!" : '¡No arriesgues la batería al 0%!'}
            </small>

            <!-- Controles táctiles en pantalla para móviles/tablets -->
            <div class="virtual-dpad">
              <div class="dpad-row">
                <button class="dpad-btn" id="dpad-up">▲</button>
              </div>
              <div class="dpad-row">
                <button class="dpad-btn" id="dpad-left">◀</button>
                <button class="dpad-btn" id="dpad-down">▼</button>
                <button class="dpad-btn" id="dpad-right">▶</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-return-airlock').addEventListener('click', () => {
      this.finish(true);
    });
  }

  initWorld() {
    this.boulders = [
      { x: 120, y: 130, radius: 18 },
      { x: 320, y: 90, radius: 24 },
      { x: 260, y: 240, radius: 20 },
      { x: 100, y: 260, radius: 16 },
      { x: 380, y: 220, radius: 22 },
      { x: 190, y: 70, radius: 15 }
    ];

    this.iceCrystals = [
      { x: 80, y: 190, collected: false },
      { x: 210, y: 130, collected: false },
      { x: 360, y: 150, collected: false },
      { x: 290, y: 290, collected: false },
      { x: 150, y: 310, collected: false },
      { x: 410, y: 80, collected: false },
      { x: 370, y: 280, collected: false }
    ];
  }

  initCanvas() {
    this.canvas = document.getElementById('rover-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  bindControls() {
    this.handleKeyDown = (e) => {
      this.keys[e.key] = true;
    };
    this.handleKeyUp = (e) => {
      this.keys[e.key] = false;
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Soporte para D-Pad táctil
    const bindTouch = (id, key) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.keys[key] = true;
      });
      btn.addEventListener('pointerup', () => {
        this.keys[key] = false;
      });
      btn.addEventListener('pointerleave', () => {
        this.keys[key] = false;
      });
    };

    bindTouch('dpad-up', 'ArrowUp');
    bindTouch('dpad-down', 'ArrowDown');
    bindTouch('dpad-left', 'ArrowLeft');
    bindTouch('dpad-right', 'ArrowRight');
  }

  update() {
    if (this.isDone) return;

    // Rotación
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.rover.angle -= this.rover.turnSpeed;
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.rover.angle += this.rover.turnSpeed;
    }

    // Aceleración
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      this.rover.speed = Math.min(this.rover.maxSpeed, this.rover.speed + 0.12);
      this.rover.battery -= 0.045; // El motor gasta batería
    } else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      this.rover.speed = Math.max(-this.rover.maxSpeed * 0.5, this.rover.speed - 0.1);
      this.rover.battery -= 0.035;
    } else {
      this.rover.speed *= 0.92; // Fricción suave en suelo lunar
    }

    // Gasto pasivo de frío extremo (-230°C) en la batería
    this.rover.battery -= 0.02;

    this.rover.x += Math.cos(this.rover.angle) * this.rover.speed;
    this.rover.y += Math.sin(this.rover.angle) * this.rover.speed;

    // Bordes del mapa
    this.rover.x = Math.max(15, Math.min(this.canvas.width - 15, this.rover.x));
    this.rover.y = Math.max(15, Math.min(this.canvas.height - 15, this.rover.y));

    // Colisiones con rocas afiladas
    this.boulders.forEach(b => {
      const dx = this.rover.x - b.x;
      const dy = this.rover.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < b.radius + 10) {
        this.rover.hull -= 0.8;
        this.rover.speed = -this.rover.speed * 0.5;
        if (window.gameAudio && Math.random() < 0.1) window.gameAudio.playClick();
      }
    });

    // Recolección de cristales de hielo
    this.iceCrystals.forEach(ice => {
      if (!ice.collected) {
        const dx = this.rover.x - ice.x;
        const dy = this.rover.y - ice.y;
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          ice.collected = true;
          this.rover.iceCollected++;
          if (window.gameAudio) window.gameAudio.playCollect();
          document.getElementById('rover-ice-count').textContent = this.rover.iceCollected;
        }
      }
    });

    // Actualizar barras
    const batEl = document.getElementById('rover-battery-text');
    const batFill = document.getElementById('rover-bat-fill');
    const hullEl = document.getElementById('rover-hull-text');
    const hullFill = document.getElementById('rover-hull-fill');

    if (batEl && batFill) {
      const b = Math.max(0, Math.round(this.rover.battery));
      batEl.textContent = `${b}%`;
      batFill.style.width = `${b}%`;
      batFill.style.background = b > 40 ? '#2ed573' : b > 15 ? '#ffa502' : '#ff4757';
    }

    if (hullEl && hullFill) {
      const h = Math.max(0, Math.round(this.rover.hull));
      hullEl.textContent = `${h}%`;
      hullFill.style.width = `${h}%`;
    }

    // Falla si la batería o el chasis caen a 0
    if (this.rover.battery <= 0 || this.rover.hull <= 0) {
      this.finish(false);
    }
  }

  draw() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Fondo: Penumbra total del cráter Shackleton (-230°C)
    this.ctx.fillStyle = '#06080d';
    this.ctx.fillRect(0, 0, w, h);

    // Esclusa de base de partida
    this.ctx.fillStyle = 'rgba(0, 210, 211, 0.25)';
    this.ctx.strokeStyle = '#00d2d3';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.baseAirlock.x, this.baseAirlock.y, this.baseAirlock.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '9px sans-serif';
    this.ctx.fillText('ESCLUSA', this.baseAirlock.x - 18, this.baseAirlock.y + 3);

    // Rocas afiladas de regolito
    this.boulders.forEach(b => {
      this.ctx.fillStyle = '#1e272e';
      this.ctx.strokeStyle = '#485460';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    });

    // Cristales de hielo de agua (azules brillantes)
    this.iceCrystals.forEach(ice => {
      if (!ice.collected) {
        // Resplandor
        const glow = this.ctx.createRadialGradient(ice.x, ice.y, 2, ice.x, ice.y, 14);
        glow.addColorStop(0, 'rgba(84, 160, 255, 0.9)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(ice.x, ice.y, 14, 0, Math.PI * 2);
        this.ctx.fill();

        // Diamante de hielo
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.moveTo(ice.x, ice.y - 6);
        this.ctx.lineTo(ice.x + 5, ice.y);
        this.ctx.lineTo(ice.x, ice.y + 6);
        this.ctx.lineTo(ice.x - 5, ice.y);
        this.ctx.closePath();
        this.ctx.fill();
      }
    });

    // Haz de faros del Rover (Cono de luz)
    this.ctx.save();
    const lightLength = 110;
    const lightAngle = 0.55; // Ángulo de apertura
    const headX = this.rover.x + Math.cos(this.rover.angle) * 8;
    const headY = this.rover.y + Math.sin(this.rover.angle) * 8;

    const lightGrad = this.ctx.createRadialGradient(
      headX, headY, 5,
      headX + Math.cos(this.rover.angle) * lightLength,
      headY + Math.sin(this.rover.angle) * lightLength,
      lightLength
    );
    lightGrad.addColorStop(0, 'rgba(255, 255, 230, 0.45)');
    lightGrad.addColorStop(0.6, 'rgba(255, 255, 200, 0.18)');
    lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = lightGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(headX, headY);
    this.ctx.arc(headX, headY, lightLength, this.rover.angle - lightAngle, this.rover.angle + lightAngle);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    // Dibujar el Rover lunar
    this.ctx.save();
    this.ctx.translate(this.rover.x, this.rover.y);
    this.ctx.rotate(this.rover.angle);

    // Chasis
    this.ctx.fillStyle = '#f1f2f6';
    this.ctx.fillRect(-10, -7, 20, 14);

    // 4 Ruedas de malla de alambre elástico (tecnología NASA para regolito)
    this.ctx.fillStyle = '#2f3542';
    this.ctx.fillRect(-12, -9, 7, 3);
    this.ctx.fillRect(5, -9, 7, 3);
    this.ctx.fillRect(-12, 6, 7, 3);
    this.ctx.fillRect(5, 6, 7, 3);

    // Antena y faros
    this.ctx.fillStyle = '#ffeaa7';
    this.ctx.fillRect(8, -4, 3, 8);

    this.ctx.restore();
  }

  loop() {
    this.update();
    this.draw();
    if (!this.isDone) {
      this.animId = requestAnimationFrame(this.loop);
    }
  }

  finish(safelyReturned) {
    if (this.isDone) return;
    this.isDone = true;

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    if (this.animId) cancelAnimationFrame(this.animId);

    let delta = {};
    let debriefText = '';

    const isEn = typeof window !== 'undefined' && window.i18n && window.i18n.getLanguage() === 'en';

    if (safelyReturned) {
      const ice = this.rover.iceCollected;
      const o2Gained = ice * 6; // Cada cristal aporta O2 al descongelarse y electrolizarse
      const scienceGained = ice * 8;
      const energyCost = Math.round((100 - this.rover.battery) * 0.18);

      delta = {
        oxygen: o2Gained,
        science: scienceGained,
        energy: -energyCost,
        health: 5,
        integrity: -3
      };

      debriefText = isEn
        ? `Successful expedition to Shackleton Crater! You returned safely to the airlock with ${ice} pure ice crystals. Electrolysis produced +${o2Gained}% Oxygen and drinkable water, using only ${energyCost}% energy to recharge the rover.`
        : `¡Expedición exitosa al Cráter Shackleton! Retornaste a tiempo a la esclusa con ${ice} cristales de hielo puro. La electrólisis generó +${o2Gained}% de Oxígeno y agua bebible, consumiendo solo ${energyCost}% de energía en la recarga del rover.`;
      if (window.gameAudio) window.gameAudio.playVictory();
    } else {
      // El rover se quedó varado o colapsó
      delta = {
        oxygen: 0,
        energy: -12,
        integrity: -18,
        health: -8,
        science: 5
      };

      debriefText = isEn
        ? `Emergency in Shackleton Crater! The rover battery froze at -230°C or the chassis collapsed. The crew had to tow it back. All harvested ice was lost and suspension was damaged (-18% Integrity). A harsh lesson about autonomy in deep space!`
        : `¡Emergencia en el Cráter Shackleton! La batería del rover se agotó por el frío de -230°C o el chasis colapsó. La tripulación tuvo que remolcarlo de emergencia. Se perdió el hielo recolectado y se dañó la suspensión (-18% Integridad). ¡Una dura lección sobre la autonomía en el espacio profundo!`;
      if (window.gameAudio) window.gameAudio.playDefeat();
    }

    if (this.onCompleteCallback) {
      this.onCompleteCallback(delta, debriefText);
    }
  }
}

window.RoverMinigame = RoverMinigame;
