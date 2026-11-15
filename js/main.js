/**
 * ORBITA5: Main Application Controller
 * Orquesta la navegación de pantallas, la inicialización de módulos,
 * la actualización reactiva del HUD, fuentes de datos NASA,
 * el narrador por voz en español y las reacciones emocionales de AstroCan.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar lienzo espacial de fondo
  const spaceCanvas = new window.SpaceCanvas('space-canvas');

  // Consultar API en vivo de NASA DONKI en segundo plano
  if (window.donkiService) {
    window.donkiService.fetchLiveAlerts().then(() => {
      console.log(`[NASA DONKI] Estado: ${window.donkiService.isLive ? 'Conectado a API en vivo' : 'Modo banco histórico oficial'}`);
    });
  }

  // Registrar elementos de la mascota espacial AstroCan
  window.astroMascot.registerElements(
    ['#mascot-sidebar-img', '#mascot-mobile-img', '#gameover-mascot-img'],
    ['#mascot-sidebar-bubble', '#mascot-mobile-bubble', '#gameover-mascot-bubble']
  );

  // Referencias a pantallas principales
  const screenWelcome = document.getElementById('screen-welcome');
  const screenGame = document.getElementById('screen-game');
  const screenGameOver = document.getElementById('screen-gameover');
  const modalScience = document.getElementById('modal-science');
  const modalAbort = document.getElementById('modal-abort');
  const minigameContainer = document.getElementById('minigame-container');
  const gameContentScroll = document.querySelector('.game-content-scroll');

  // Elementos de la pantalla de bienvenida
  const inputPlayerName = document.getElementById('input-player-name');
  const nameValidationMsg = document.getElementById('name-validation-msg');
  const btnStartMission = document.getElementById('btn-start-mission');
  const difficultyButtons = document.querySelectorAll('.diff-btn');
  let selectedDifficulty = 1;

  // Botones de audio / silencio (barra superior y panel lateral)
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const btnSidebarSound = document.getElementById('btn-sidebar-sound');

  // HUD del juego (superior y ambiental)
  const hudPlayerName = document.getElementById('hud-player-name');
  const hudDayText = document.getElementById('hud-day-text');
  const hudEnvIcon = document.getElementById('hud-env-icon');
  const hudEnvPhase = document.getElementById('hud-env-phase');
  const hudEnvTemp = document.getElementById('hud-env-temp');
  const hudEnvSun = document.getElementById('hud-env-sun');

  // Barras de recursos compactas (Móvil / Tablet)
  const barO2 = document.getElementById('bar-o2');
  const valO2 = document.getElementById('val-o2');
  const barEnergy = document.getElementById('bar-energy');
  const valEnergy = document.getElementById('val-energy');
  const barHealth = document.getElementById('bar-health');
  const valHealth = document.getElementById('val-health');
  const barIntegrity = document.getElementById('bar-integrity');
  const valIntegrity = document.getElementById('val-integrity');
  const hudScienceVal = document.getElementById('hud-science-val');

  // Telemetría lateral (Laptop / PC)
  const sideValO2 = document.getElementById('side-val-o2');
  const sideValEnergy = document.getElementById('side-val-energy');
  const sideValHealth = document.getElementById('side-val-health');
  const sideValIntegrity = document.getElementById('side-val-integrity');
  const sideValScience = document.getElementById('side-val-science');

  // Tarjeta de dilema
  const dilemmaCard = document.getElementById('dilemma-card');
  const dilemmaTag = document.getElementById('dilemma-tag');
  const dilemmaTitle = document.getElementById('dilemma-title');
  const dilemmaSender = document.getElementById('dilemma-sender');
  const dilemmaDesc = document.getElementById('dilemma-desc');
  const dilemmaSourceBox = document.getElementById('dilemma-source-box');
  const dilemmaScienceBox = document.getElementById('dilemma-science-box');
  const dilemmaOptionsContainer = document.getElementById('dilemma-options-container');
  const btnNarrateDilemma = document.getElementById('btn-narrate-dilemma');

  // Feedback de transmisión
  const transmissionBox = document.getElementById('transmission-box');
  const transmissionText = document.getElementById('transmission-text');
  const btnNextDay = document.getElementById('btn-next-day');

  // Pantalla de fin de misión
  const gameoverTitle = document.getElementById('gameover-title');
  const gameoverSubtitle = document.getElementById('gameover-subtitle');
  const gameoverRank = document.getElementById('gameover-rank');
  const gameoverScore = document.getElementById('gameover-score');
  const gameoverDays = document.getElementById('gameover-days');
  const gameoverScience = document.getElementById('gameover-science');
  const gameoverLessonBox = document.getElementById('gameover-lesson-box');
  const gameoverLessonText = document.getElementById('gameover-lesson-text');
  const btnShareCert = document.getElementById('btn-share-cert');
  const btnRestart = document.getElementById('btn-restart');

  // Botones de abortar misión
  const btnAbortMission = document.getElementById('btn-abort-mission');
  const btnSidebarAbort = document.getElementById('btn-sidebar-abort');
  const btnConfirmAbort = document.getElementById('btn-confirm-abort');
  const btnCancelAbort = document.getElementById('btn-cancel-abort');
  const btnCloseAbortX = document.getElementById('btn-close-abort-x');

  // Botones de Archivo Científico
  const btnOpenScience = document.getElementById('btn-open-science');
  const btnSidebarScience = document.getElementById('btn-sidebar-science');
  const btnCloseScience = document.getElementById('btn-close-science');
  const scienceContent = document.getElementById('science-content');

  // Selector y Gestión de Voces de Síntesis
  const modalVoice = document.getElementById('modal-voice');
  const btnCloseVoiceX = document.getElementById('btn-close-voice-x');
  const btnCloseVoice = document.getElementById('btn-close-voice');
  const btnCycleVoiceFast = document.getElementById('btn-cycle-voice-fast');
  const voiceOptionsList = document.getElementById('voice-options-list');
  const modalCurrentVoiceText = document.getElementById('modal-current-voice-text');
  const btnChangeVoice = document.getElementById('btn-change-voice');
  const btnSidebarVoice = document.getElementById('btn-sidebar-voice');
  const btnTopVoice = document.getElementById('btn-top-voice');
  const currentVoiceLabel = document.getElementById('current-voice-label');

  // Selector y Gestión de Estilos Visuales (UI Themes)
  const modalTheme = document.getElementById('modal-theme');
  const btnCloseThemeX = document.getElementById('btn-close-theme-x');
  const btnCloseTheme = document.getElementById('btn-close-theme');
  const btnCycleThemeFast = document.getElementById('btn-cycle-theme-fast');
  const themeCardsGrid = document.getElementById('theme-cards-grid');
  const btnSidebarTheme = document.getElementById('btn-sidebar-theme');
  const sidebarThemeName = document.getElementById('sidebar-theme-name');
  const btnTopTheme = document.getElementById('btn-top-theme');
  const topThemeName = document.getElementById('top-theme-name');
  const welcomeThemeBtns = document.querySelectorAll('.theme-btn');

  // Helper para sanitizar strings insertados en HTML
  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Variables de estado local del turno actual
  let currentEvent = null;
  let currentScaledOptions = [];

  // ========================================================================
  // 1. Manejo de audio toggle (sincronizado entre cabecera y panel lateral)
  // ========================================================================
  const updateSoundButtonsUI = (isMuted) => {
    const text = isMuted ? '🔇 Silencio' : '🔊 Sonido';
    if (btnToggleSound) {
      btnToggleSound.textContent = text;
      btnToggleSound.classList.toggle('btn-muted', isMuted);
    }
    if (btnSidebarSound) {
      btnSidebarSound.textContent = text;
      btnSidebarSound.classList.toggle('btn-muted', isMuted);
    }
  };
  updateSoundButtonsUI(window.gameAudio.muted);

  const toggleSound = () => {
    const isMuted = window.gameAudio.toggleMute();
    updateSoundButtonsUI(isMuted);
  };
  if (btnToggleSound) btnToggleSound.addEventListener('click', toggleSound);
  if (btnSidebarSound) btnSidebarSound.addEventListener('click', toggleSound);

  // ========================================================================
  // 2. Narración por voz (Web Speech API) — Misión y Opciones separadas
  // ========================================================================
  if (btnNarrateDilemma) {
    btnNarrateDilemma.addEventListener('click', () => {
      window.gameAudio.playClick();
      if (currentEvent) {
        window.speechNarrator.speakMission(currentEvent);
      }
    });

    window.speechNarrator.setOnStateChange((isSpeaking, targetKey) => {
      // Actualizar botón de la misión
      const isSpeakingMission = isSpeaking && targetKey === 'mission';
      btnNarrateDilemma.classList.toggle('speaking', isSpeakingMission);
      btnNarrateDilemma.innerHTML = isSpeakingMission ? '⏹️ Detener Voz' : '📢 Escuchar Misión';

      // Actualizar botones individuales de opciones
      const optionAudioBtns = document.querySelectorAll('.btn-listen-option');
      optionAudioBtns.forEach(btn => {
        const idx = btn.dataset.optIdx;
        const isSpeakingThis = isSpeaking && targetKey === `option-${idx}`;
        btn.classList.toggle('speaking', isSpeakingThis);
        btn.innerHTML = isSpeakingThis ? '⏹️ Detener' : '🔊 Escuchar Opción';
      });
    });
  }

  // ========================================================================
  // 2b. Selector y Cambio de Voces de Síntesis
  // ========================================================================
  function updateVoiceButtonLabel(voiceDetails) {
    if (!voiceDetails) return;
    if (currentVoiceLabel) {
      currentVoiceLabel.textContent = voiceDetails.shortLabel || `${voiceDetails.flag} ${voiceDetails.cleanName}`;
    }
    if (modalCurrentVoiceText) {
      modalCurrentVoiceText.textContent = `${voiceDetails.flag} ${voiceDetails.cleanName} (${voiceDetails.region})`;
    }
  }

  function renderVoiceList() {
    if (!voiceOptionsList) return;
    const voices = window.speechNarrator.getSpanishVoices();
    const current = window.speechNarrator.getCurrentVoiceDetails();

    if (!voices || voices.length === 0) {
      voiceOptionsList.innerHTML = `
        <div class="voice-card">
          <div class="voice-card-info">
            <span class="voice-card-flag">🌐</span>
            <div class="voice-card-texts">
              <strong class="voice-card-name">Voz predeterminada del navegador</strong>
              <span class="voice-card-region">Español Latinoamericano</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    voiceOptionsList.innerHTML = voices.map(v => {
      const details = window.speechNarrator.getVoiceDetails(v);
      const isSelected = current && current.name === v.name;
      return `
        <div class="voice-card ${isSelected ? 'selected' : ''}" data-voice-name="${escapeHtml(v.name)}">
          <div class="voice-card-info">
            <span class="voice-card-flag">${details.flag}</span>
            <div class="voice-card-texts">
              <strong class="voice-card-name">${escapeHtml(details.cleanName)}</strong>
              <span class="voice-card-region">${escapeHtml(details.region)} • ${escapeHtml(v.lang)}</span>
            </div>
          </div>
          <div class="voice-card-actions">
            <button type="button" class="btn-voice-preview" data-preview-voice="${escapeHtml(v.name)}" title="Escuchar muestra">
              ▶️ Probar
            </button>
            <button type="button" class="btn-voice-select ${isSelected ? 'active' : ''}" data-select-voice="${escapeHtml(v.name)}">
              ${isSelected ? '✓ Activa' : 'Elegir'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Eventos para botones de prueba
    voiceOptionsList.querySelectorAll('.btn-voice-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.gameAudio.playClick();
        const vName = btn.dataset.previewVoice;
        const targetVoice = voices.find(v => v.name === vName);
        if (targetVoice) {
          window.speechNarrator.previewVoice(targetVoice);
        }
      });
    });

    // Eventos para selección de voz (al hacer clic en la tarjeta o botón Elegir)
    voiceOptionsList.querySelectorAll('.voice-card').forEach(card => {
      card.addEventListener('click', () => {
        window.gameAudio.playClick();
        const vName = card.dataset.voiceName;
        window.speechNarrator.setVoiceByName(vName);
      });
    });
  }

  function openVoiceModal() {
    window.gameAudio.playClick();
    renderVoiceList();
    if (modalVoice) modalVoice.classList.remove('hidden');
  }

  function closeVoiceModal() {
    window.gameAudio.playClick();
    if (modalVoice) modalVoice.classList.add('hidden');
  }

  // Inicializar etiqueta con la voz actual
  updateVoiceButtonLabel(window.speechNarrator.getCurrentVoiceDetails());

  // Escuchar cambios de voz desde el servicio
  window.speechNarrator.setOnVoiceChange((voiceDetails) => {
    updateVoiceButtonLabel(voiceDetails);
    renderVoiceList();
  });

  if (btnChangeVoice) btnChangeVoice.addEventListener('click', openVoiceModal);
  if (btnSidebarVoice) btnSidebarVoice.addEventListener('click', openVoiceModal);
  if (btnTopVoice) btnTopVoice.addEventListener('click', openVoiceModal);
  if (btnCloseVoiceX) btnCloseVoiceX.addEventListener('click', closeVoiceModal);
  if (btnCloseVoice) btnCloseVoice.addEventListener('click', closeVoiceModal);

  if (btnCycleVoiceFast) {
    btnCycleVoiceFast.addEventListener('click', () => {
      window.gameAudio.playClick();
      const newVoice = window.speechNarrator.cycleNextVoice();
      if (newVoice) {
        setTimeout(() => {
          const activeCard = voiceOptionsList ? voiceOptionsList.querySelector('.voice-card.selected') : null;
          if (activeCard) {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
    });
  }

  // ========================================================================
  // 2c. Selector y Cambio de Estilo de Interfaz (UI Themes)
  // ========================================================================
  function updateThemeButtonsUI(themeObj) {
    if (!themeObj && window.themeManager) {
      themeObj = window.themeManager.getCurrentTheme();
    }
    if (!themeObj) return;

    if (sidebarThemeName) {
      sidebarThemeName.textContent = themeObj.shortName;
    }
    if (topThemeName) {
      topThemeName.textContent = themeObj.shortName;
    }

    if (welcomeThemeBtns && welcomeThemeBtns.length > 0) {
      welcomeThemeBtns.forEach(btn => {
        const val = btn.dataset.themeVal;
        btn.classList.toggle('active', val === themeObj.id);
      });
    }

    renderThemeList();
  }

  function renderThemeList() {
    if (!themeCardsGrid || !window.themeManager) return;
    const themes = window.themeManager.getThemes();
    const currentTheme = window.themeManager.getCurrentTheme();

    themeCardsGrid.innerHTML = themes.map(th => {
      const isSelected = th.id === currentTheme.id;
      const swatchesHtml = th.swatches ? th.swatches.map(c => `<span class="theme-swatch" style="background:${c}"></span>`).join('') : '';
      return `
        <div class="theme-preview-card ${isSelected ? 'selected' : ''}" data-theme-id="${th.id}">
          <div class="theme-preview-header">
            <span class="theme-preview-icon">${th.icon}</span>
            <div>
              <strong class="theme-preview-name">${escapeHtml(th.name)}</strong>
              <div class="theme-preview-swatches">${swatchesHtml}</div>
            </div>
          </div>
          <p class="theme-preview-desc">${escapeHtml(th.desc)}</p>
          <button type="button" class="theme-preview-btn">
            ${isSelected ? '✓ Activo' : 'Activar Estilo'}
          </button>
        </div>
      `;
    }).join('');

    themeCardsGrid.querySelectorAll('.theme-preview-card').forEach(card => {
      card.addEventListener('click', () => {
        const tId = card.dataset.themeId;
        if (window.themeManager) {
          window.themeManager.setTheme(tId, true);
        }
      });
    });
  }

  function openThemeModal() {
    if (window.gameAudio) window.gameAudio.playClick();
    renderThemeList();
    if (modalTheme) modalTheme.classList.remove('hidden');
  }

  function closeThemeModal() {
    if (window.gameAudio) window.gameAudio.playClick();
    if (modalTheme) modalTheme.classList.add('hidden');
  }

  // Inicializar UI de temas y registrar observador
  if (window.themeManager) {
    window.themeManager.onThemeChange((themeId, themeObj) => {
      updateThemeButtonsUI(themeObj);
    });
    updateThemeButtonsUI(window.themeManager.getCurrentTheme());
  }

  // Eventos de botones de tema en pantalla de bienvenida
  if (welcomeThemeBtns) {
    welcomeThemeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.themeVal;
        if (window.themeManager) {
          window.themeManager.setTheme(val, true);
        }
      });
    });
  }

  if (btnSidebarTheme) btnSidebarTheme.addEventListener('click', openThemeModal);
  if (btnTopTheme) btnTopTheme.addEventListener('click', openThemeModal);
  if (btnCloseThemeX) btnCloseThemeX.addEventListener('click', closeThemeModal);
  if (btnCloseTheme) btnCloseTheme.addEventListener('click', closeThemeModal);

  if (btnCycleThemeFast) {
    btnCycleThemeFast.addEventListener('click', () => {
      if (window.themeManager) {
        window.themeManager.cycleTheme();
      }
    });
  }

  // ========================================================================
  // 3. Selección de dificultad
  // ========================================================================
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = parseInt(btn.dataset.diff, 10);
      window.gameAudio.playClick();
    });
  });

  // ========================================================================
  // 4. Inicio de Misión con Control de Nombre Requerido
  // ========================================================================
  function handleStartMission() {
    const rawName = inputPlayerName ? inputPlayerName.value.trim() : '';

    // Control estricto: no se puede asumir el mando si previamente no se ingresa el nombre de astronauta
    if (!rawName) {
      if (inputPlayerName) {
        inputPlayerName.classList.remove('input-error');
        void inputPlayerName.offsetWidth; // Reflow para reiniciar animación shake
        inputPlayerName.classList.add('input-error');
        inputPlayerName.focus();
      }
      if (nameValidationMsg) {
        nameValidationMsg.classList.remove('hidden');
      }
      window.gameAudio.playAlarm();
      window.astroMascot.setEmotion(
        'thinking',
        '¡Comandante! Necesito registrar tu nombre en el manifiesto oficial de vuelo antes de asumir el mando.'
      );
      return;
    }

    // Nombre válido: limpiar avisos
    if (inputPlayerName) inputPlayerName.classList.remove('input-error');
    if (nameValidationMsg) nameValidationMsg.classList.add('hidden');

    const name = rawName;
    window.gameAudio.playQuindar(true);
    window.gameAudio.startAmbient();

    window.gameState.startMission(name, selectedDifficulty);

    // Preparar mazo con rotación aleatoria de eventos nuevos no vistos en partidas anteriores
    if (window.missionEventManager) {
      window.missionEventManager.prepareSessionDeck(window.gameState);
    }

    // Intentar refrescar datos en vivo de las APIs públicas de la NASA en cada nueva partida
    if (window.donkiService) {
      window.donkiService.fetchLiveAlerts().catch(() => {});
    }

    screenWelcome.classList.add('hidden');
    screenGameOver.classList.add('hidden');
    screenGame.classList.remove('hidden');

    // Estado inicial de AstroCan
    window.astroMascot.setEmotion('greeting', `¡Comandante ${name}, base transferida a tu mando! Gestionemos con sabiduría los recursos.`);

    // Conectar observador de estado reactivo
    window.gameState.subscribe(updateHUD);

    // Cargar primer dilema
    loadNextDilemma();
  }

  btnStartMission.addEventListener('click', handleStartMission);

  if (inputPlayerName) {
    // Permitir iniciar también con la tecla Enter
    inputPlayerName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStartMission();
      }
    });

    // Limpiar mensaje de error en tiempo real mientras el usuario escribe
    inputPlayerName.addEventListener('input', () => {
      if (inputPlayerName.value.trim().length > 0) {
        inputPlayerName.classList.remove('input-error');
        if (nameValidationMsg) nameValidationMsg.classList.add('hidden');
      }
    });
  }

  // ========================================================================
  // 5. Abortar Misión (Modal y confirmación)
  // ========================================================================
  const showAbortModal = () => {
    window.gameAudio.playClick();
    modalAbort.classList.remove('hidden');
  };

  const hideAbortModal = () => {
    window.gameAudio.playClick();
    modalAbort.classList.add('hidden');
  };

  if (btnAbortMission) btnAbortMission.addEventListener('click', showAbortModal);
  if (btnSidebarAbort) btnSidebarAbort.addEventListener('click', showAbortModal);
  if (btnCancelAbort) btnCancelAbort.addEventListener('click', hideAbortModal);
  if (btnCloseAbortX) btnCloseAbortX.addEventListener('click', hideAbortModal);

  if (btnConfirmAbort) {
    btnConfirmAbort.addEventListener('click', () => {
      window.speechNarrator.stop();
      window.gameAudio.playClick();
      modalAbort.classList.add('hidden');

      // Abortar y reiniciar listeners
      window.gameState.abortMission();
      window.gameState.listeners = [];

      screenGame.classList.add('hidden');
      screenGameOver.classList.add('hidden');
      screenWelcome.classList.remove('hidden');

      window.astroMascot.setEmotion('greeting', 'Misión cancelada. Puedes ingresar un nuevo nombre o elegir otro nivel de entrenamiento.');
    });
  }

  // ========================================================================
  // 6. Actualización del HUD Reactivo (Compacto + Telemetría Lateral)
  // ========================================================================
  // Función para determinar el color de semáforo según el porcentaje
  function getResourceStatusClass(val) {
    if (val > 50) return 'text-status-good';       // Verde / Óptimo (> 50%)
    if (val > 25) return 'text-status-warning';    // Amarillo-Ámbar / Alerta (26% - 50%)
    return 'text-status-critical';                 // Rojo / Emergencia (<= 25%)
  }

  function updateHUD(state) {
    if (hudPlayerName) hudPlayerName.textContent = state.playerName;
    if (hudDayText) hudDayText.textContent = `Día ${state.currentDay} / ${state.totalDays}`;

    const env = state.getEnvironmentalStatus();
    if (hudEnvIcon) hudEnvIcon.textContent = env.icon || '☀️';
    if (hudEnvPhase) hudEnvPhase.textContent = env.phase;
    if (hudEnvTemp) hudEnvTemp.textContent = env.temp;
    if (hudEnvSun) hudEnvSun.textContent = env.sunlight;

    // Actualizar barras compactas (Móvil / Tablet) con Semáforo
    const updateBar = (bar, label, val) => {
      if (bar) {
        bar.style.width = `${val}%`;
        bar.classList.toggle('danger', val <= 25);
        bar.classList.toggle('warning', val > 25 && val <= 50);
      }
      if (label) {
        label.textContent = `${Math.round(val)}%`;
        label.classList.remove('text-status-good', 'text-status-warning', 'text-status-critical');
        label.classList.add(getResourceStatusClass(val));
      }
    };

    updateBar(barO2, valO2, state.resources.oxygen);
    updateBar(barEnergy, valEnergy, state.resources.energy);
    updateBar(barHealth, valHealth, state.resources.health);
    updateBar(barIntegrity, valIntegrity, state.resources.integrity);
    if (hudScienceVal) hudScienceVal.textContent = state.resources.science;

    // Actualizar telemetría lateral (Laptop / PC) con Semáforo
    const updateSideVal = (el, val) => {
      if (!el) return;
      el.textContent = `${Math.round(val)}%`;
      el.classList.remove('text-status-good', 'text-status-warning', 'text-status-critical');
      el.classList.add(getResourceStatusClass(val));
    };

    updateSideVal(sideValO2, state.resources.oxygen);
    updateSideVal(sideValEnergy, state.resources.energy);
    updateSideVal(sideValHealth, state.resources.health);
    updateSideVal(sideValIntegrity, state.resources.integrity);
    if (sideValScience) sideValScience.textContent = `${state.resources.science} pts`;

    // Verificar fin de juego
    if (state.isGameOver && state.gameResult !== 'ABORTED') {
      window.speechNarrator.stop();
      showGameOver(state);
    }
  }

  // ========================================================================
  // 7. Escalado de Opciones según Dificultad
  // ========================================================================
  function getScaledOption(opt, state) {
    if (opt.isMinigame) return opt;

    const scaledDelta = state.scaleDelta(opt.delta);

    // Formatear texto dinámico de ganancia
    const gains = [];
    if (scaledDelta.science > 0) gains.push(`+${scaledDelta.science} Ciencia`);
    if (scaledDelta.oxygen > 0) gains.push(`+${scaledDelta.oxygen}% O2`);
    if (scaledDelta.energy > 0) gains.push(`+${scaledDelta.energy}% Energía`);
    if (scaledDelta.health > 0) gains.push(`+${scaledDelta.health}% Salud`);
    if (scaledDelta.integrity > 0) gains.push(`+${scaledDelta.integrity}% Integridad`);

    // Formatear texto dinámico de costo
    const costs = [];
    if (scaledDelta.oxygen < 0) costs.push(`${scaledDelta.oxygen}% O2`);
    if (scaledDelta.energy < 0) costs.push(`${scaledDelta.energy}% Energía`);
    if (scaledDelta.health < 0) costs.push(`${scaledDelta.health}% Salud`);
    if (scaledDelta.integrity < 0) costs.push(`${scaledDelta.integrity}% Integridad`);

    const gainText = gains.length > 0 ? gains.join(', ') : opt.gainText;
    const costText = costs.length > 0 ? costs.join(', ') : opt.costText;

    return {
      ...opt,
      delta: scaledDelta,
      gainText,
      costText
    };
  }

  // ========================================================================
  // 8. Cargar siguiente dilema con opciones escaladas
  // ========================================================================
  function loadNextDilemma() {
    window.speechNarrator.stop();
    transmissionBox.classList.add('hidden');
    dilemmaCard.classList.remove('hidden');
    minigameContainer.classList.add('hidden');

    if (gameContentScroll) gameContentScroll.scrollTop = 0;

    currentEvent = window.missionEventManager.getNextEvent(window.gameState);

    // Reacción de AstroCan al evento
    window.astroMascot.reactToEvent(currentEvent);

    // Si es evento solar, activar resplandor y alarma
    if (currentEvent.isSolarEvent) {
      spaceCanvas.setSolarStorm(true);
      dilemmaCard.classList.add('solar-alert-active');
      window.gameAudio.playAlarm();
    } else {
      spaceCanvas.setSolarStorm(false);
      dilemmaCard.classList.remove('solar-alert-active');
      window.gameAudio.playQuindar(true);
    }

    dilemmaTag.textContent = currentEvent.tag;
    dilemmaTitle.textContent = currentEvent.title;
    dilemmaSender.textContent = `📡 Transmisión de: ${currentEvent.sender}`;
    dilemmaDesc.textContent = currentEvent.description;

    // Mostrar Fuente Oficial de la NASA con certificación de ciencia real
    if (dilemmaSourceBox && currentEvent.dataSource) {
      dilemmaSourceBox.innerHTML = `
        <div class="source-header">
          <span class="source-verified-badge">🔬 CIENCIA REAL DE LA NASA</span>
          <span class="source-live-tag">DATOS ABIERTOS</span>
        </div>
        <div class="source-content">
          <strong>🛰️ Conjunto de Datos / Estudio Oficial:</strong> 
          <a href="${currentEvent.dataSource.url}" target="_blank" rel="noopener noreferrer" title="Consultar repositorio científico oficial de la NASA">
            ${currentEvent.dataSource.name} ↗
          </a>
          <div class="source-detail-text">${currentEvent.dataSource.detail}</div>
        </div>
      `;
      dilemmaSourceBox.classList.remove('hidden');
    } else if (dilemmaSourceBox) {
      dilemmaSourceBox.classList.add('hidden');
    }

    dilemmaScienceBox.innerHTML = `<strong>💡 Contexto Científico NASA:</strong> ${currentEvent.scientificContext}`;

    // Escalar opciones según nivel de dificultad
    currentScaledOptions = currentEvent.options.map(opt => getScaledOption(opt, window.gameState));

    // Renderizar opciones con compensaciones explícitas y matemáticas precisas
    dilemmaOptionsContainer.innerHTML = '';
    currentScaledOptions.forEach((opt, idx) => {
      const optCard = document.createElement('div');
      optCard.className = 'tradeoff-option-card';
      optCard.innerHTML = `
        <div class="option-header-row">
          <span class="option-badge">Opción ${String.fromCharCode(65 + idx)}</span>
          <strong class="option-title">${opt.title}</strong>
          <button type="button" class="btn-listen-option" data-opt-idx="${idx}" title="Escuchar esta opción en audio">
            🔊 Escuchar Opción
          </button>
        </div>
        <p class="option-action">${opt.actionText}</p>
        <div class="tradeoff-indicators">
          <div class="gain-badge">
            <span class="icon">✅ GANANCIA:</span> ${opt.gainText}
          </div>
          <div class="cost-badge">
            <span class="icon">⚠️ COSTO / SACRIFICIO:</span> ${opt.costText}
          </div>
        </div>
        <button class="btn-choose-option">
          ${opt.isMinigame ? '🚀 INICIAR ACCIÓN MANUAL' : '👉 EJECUTAR ESTA ORDEN'}
        </button>
      `;

      // Listener para escuchar la opción individualmente por voz
      const btnListen = optCard.querySelector('.btn-listen-option');
      btnListen.addEventListener('click', (e) => {
        e.stopPropagation();
        window.gameAudio.playClick();
        window.speechNarrator.speakOption(opt, idx);
      });

      optCard.querySelector('.btn-choose-option').addEventListener('click', () => {
        handleOptionSelected(opt);
      });

      dilemmaOptionsContainer.appendChild(optCard);
    });
  }

  // ========================================================================
  // UTILIDAD: Generar HTML de la tabla de cambios de recursos
  // ========================================================================
  function buildResourceChangeTable(before, after, label) {
    const resources = [
      { key: 'oxygen',    icon: '💨', name: 'Oxígeno (O2)' },
      { key: 'energy',    icon: '⚡', name: 'Energía & Baterías' },
      { key: 'health',    icon: '❤️', name: 'Salud Tripulación' },
      { key: 'integrity', icon: '🛡️', name: 'Integridad Casco' },
      { key: 'science',   icon: '🔬', name: 'Puntos de Ciencia' }
    ];

    let rows = '';
    resources.forEach(r => {
      const b = Math.round(before[r.key]);
      const a = Math.round(after[r.key]);
      const diff = a - b;
      if (diff === 0) {
        rows += `
          <tr class="change-row neutral">
            <td>${r.icon} ${r.name}</td>
            <td>${b}${r.key === 'science' ? '' : '%'}</td>
            <td class="change-neutral">→ Sin cambio</td>
            <td>${a}${r.key === 'science' ? '' : '%'}</td>
          </tr>`;
      } else {
        const sign = diff > 0 ? '+' : '';
        const cls = diff > 0 ? 'change-positive' : 'change-negative';
        rows += `
          <tr class="change-row">
            <td>${r.icon} ${r.name}</td>
            <td>${b}${r.key === 'science' ? '' : '%'}</td>
            <td class="${cls}">${sign}${diff}${r.key === 'science' ? '' : '%'}</td>
            <td><strong>${a}${r.key === 'science' ? '' : '%'}</strong></td>
          </tr>`;
      }
    });

    return `
      <div class="resource-change-table-wrapper">
        <table class="resource-change-table">
          <thead>
            <tr>
              <th>Recurso</th>
              <th>Antes</th>
              <th>${label}</th>
              <th>Ahora</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ========================================================================
  // 9. Manejar opción elegida
  // ========================================================================
  function handleOptionSelected(opt) {
    window.speechNarrator.stop();
    window.gameAudio.playClick();

    if (opt.isMinigame === 'shield') {
      launchShieldMinigame();
      return;
    } else if (opt.isMinigame === 'rover') {
      launchRoverMinigame();
      return;
    }

    const before = { ...window.gameState.resources };

    const record = window.gameState.applyResourceDelta(
      opt.delta,
      opt.title,
      currentEvent.scientificContext
    );

    const after = { ...window.gameState.resources };

    // Reacción emocional de AstroCan
    window.astroMascot.reactToDelta(record.actualChanges, window.gameState.resources);

    if (opt.delta.oxygen < 0) window.gameAudio.playAirlock();
    else window.gameAudio.playQuindar(false);

    showDecisionReceipt(opt.feedback, before, after);
  }

  // ========================================================================
  // 10. Lanzadores de Minijuegos
  // ========================================================================
  function launchShieldMinigame() {
    window.speechNarrator.stop();
    dilemmaCard.classList.add('hidden');
    minigameContainer.classList.remove('hidden');
    if (gameContentScroll) gameContentScroll.scrollTop = 0;

    const shieldGame = new window.ShieldMinigame();
    shieldGame.start(minigameContainer, (rawDelta, debrief) => {
      minigameContainer.classList.add('hidden');
      spaceCanvas.setSolarStorm(false);
      dilemmaCard.classList.remove('solar-alert-active');

      const scaledDelta = window.gameState.scaleDelta(rawDelta);
      const before = { ...window.gameState.resources };
      const record = window.gameState.applyResourceDelta(
        scaledDelta,
        'Desvío de Energía Escudo Solar DONKI',
        'Gestión en tiempo real de CME'
      );
      const after = { ...window.gameState.resources };

      window.astroMascot.reactToDelta(record.actualChanges, window.gameState.resources);
      showDecisionReceipt(debrief, before, after);
    });
  }

  function launchRoverMinigame() {
    window.speechNarrator.stop();
    dilemmaCard.classList.add('hidden');
    minigameContainer.classList.remove('hidden');
    if (gameContentScroll) gameContentScroll.scrollTop = 0;

    const roverGame = new window.RoverMinigame();
    roverGame.start(minigameContainer, (rawDelta, debrief) => {
      minigameContainer.classList.add('hidden');

      const scaledDelta = window.gameState.scaleDelta(rawDelta);
      const before = { ...window.gameState.resources };
      const record = window.gameState.applyResourceDelta(
        scaledDelta,
        'Expedición de Hielo Cráter Shackleton',
        'Extracción de recursos in-situ (ISRU)'
      );
      const after = { ...window.gameState.resources };

      window.astroMascot.reactToDelta(record.actualChanges, window.gameState.resources);
      showDecisionReceipt(debrief, before, after);
    });
  }

  // ========================================================================
  // 11. PASO 1: Recibo Detallado de la Decisión Tomada
  // ========================================================================
  function showDecisionReceipt(feedbackText, before, after) {
    dilemmaCard.classList.add('hidden');
    transmissionBox.classList.remove('hidden');

    if (gameContentScroll) gameContentScroll.scrollTop = 0;

    if (window.gameState.isGameOver) {
      transmissionText.innerHTML = `
        <div class="log-quote">"${feedbackText}"</div>
        <h4 class="receipt-title">📊 Impacto de tu Orden en los Recursos</h4>
        ${buildResourceChangeTable(before, after, 'Tu Orden')}
      `;
      btnNextDay.classList.add('hidden');
      return;
    }

    transmissionText.innerHTML = `
      <div class="log-quote">"${feedbackText}"</div>
      <h4 class="receipt-title">📊 Impacto de tu Orden en los Recursos</h4>
      ${buildResourceChangeTable(before, after, 'Tu Orden')}
      <div class="log-reminder">
        <em>Ahora se calculará el consumo de supervivencia del día. Tu base gasta recursos solo por mantener con vida a los astronautas.</em>
      </div>
    `;

    btnNextDay.textContent = '📋 VER CONSUMO DEL DÍA';
    btnNextDay.classList.remove('hidden');
    btnNextDay.onclick = () => {
      window.gameAudio.playClick();
      showDailyConsumptionReport();
    };
  }

  // ========================================================================
  // 12. PASO 2: Reporte de Consumo Diario con Explicación Científica
  // ========================================================================
  function showDailyConsumptionReport() {
    const state = window.gameState;
    const plan = state.getDailyDecayPlan();

    const beforeDecay = { ...state.resources };
    state.applyDailyDecay();
    const afterDecay = { ...state.resources };

    // Reacción de AstroCan al consumo
    window.astroMascot.reactToDailyDecay(plan, state.resources);

    if (gameContentScroll) gameContentScroll.scrollTop = 0;

    if (state.isGameOver) return;

    const diffLabel = state.difficulty === 1 ? 'Cadete'
                    : state.difficulty === 2 ? 'Especialista'
                    : 'Comandante';

    transmissionText.innerHTML = `
      <h3 class="transmission-title" style="margin-bottom: 10px;">
        📋 Reporte de Consumo Diario — Día ${state.currentDay} (Nivel ${diffLabel})
      </h3>

      <div class="decay-explanation-card">
        <p class="decay-intro">
          Cada día que pasa, tu base lunar gasta recursos <strong>automáticamente</strong> solo por mantener
          con vida a los 4 astronautas. Estos costos son inevitables y representan las necesidades
          reales de supervivencia en el espacio profundo:
        </p>

        <div class="decay-item-grid">
          <div class="decay-item">
            <div class="decay-item-header">
              <span>💨 Oxígeno: <strong class="change-negative">-${plan.rates.oxygen}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.oxygen}</p>
          </div>

          <div class="decay-item">
            <div class="decay-item-header">
              <span>⚡ Energía: <strong class="change-negative">-${plan.rates.energy}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.energy}</p>
          </div>

          <div class="decay-item">
            <div class="decay-item-header">
              <span>❤️ Salud: <strong class="change-negative">-${plan.rates.health}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.health}</p>
          </div>

          <div class="decay-item">
            <div class="decay-item-header">
              <span>🛡️ Integridad: <strong class="change-negative">-${plan.rates.integrity}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.integrity}</p>
          </div>
        </div>
      </div>

      <h4 class="receipt-title" style="margin-top: 16px;">📊 Balance Final del Día</h4>
      ${buildResourceChangeTable(beforeDecay, afterDecay, 'Consumo Diario')}

      <div class="log-reminder" style="margin-top: 12px;">
        <em>⚖️ Recuerda: en el espacio profundo ninguna decisión es neutra. Las misiones más
        largas y difíciles dosifican los recursos con mayor rigor. ¡Planifica con sabiduría, Comandante!</em>
      </div>
    `;

    btnNextDay.textContent = '☀️ AVANZAR AL SIGUIENTE DÍA LUNAR';
    btnNextDay.onclick = () => {
      window.gameAudio.playClick();
      state.advanceDay();
      if (!state.isGameOver) {
        loadNextDilemma();
      }
    };
  }

  // ========================================================================
  // 13. Pantalla de Fin de Misión
  // ========================================================================
  function showGameOver(state) {
    screenGame.classList.add('hidden');
    screenGameOver.classList.remove('hidden');

    const scoreData = state.calculateFinalScore();
    const isVictory = state.gameResult === 'VICTORY';

    // Reacción de fin de juego para AstroCan
    window.astroMascot.reactToGameOver(isVictory);

    if (isVictory) {
      window.gameAudio.playVictory();
      gameoverTitle.innerHTML = `🏆 ¡MISIÓN ORBITA5 CUMPLIDA!`;
      gameoverSubtitle.innerHTML = `Felicitaciones, <strong>Comandante ${state.playerName}</strong>. Has logrado mantener con vida al puesto avanzado lunar y completar con éxito la misión de ${state.totalDays} días.`;
      gameoverRank.innerHTML = `🏆 ${scoreData.rank}`;
      gameoverScore.textContent = scoreData.score;
      gameoverDays.textContent = `${scoreData.daysSurvived} / ${scoreData.totalDays} Días`;
      gameoverScience.textContent = `${scoreData.scienceCollected} Pts`;

      gameoverLessonBox.className = 'lesson-card lesson-success';
      gameoverLessonText.innerHTML = `
        <h4>🎓 Certificado de Liderazgo Aeroespacial</h4>
        <p>Demostraste comprender el principio más importante de la exploración espacial: <strong>las compensaciones reales (trade-offs)</strong>. Supiste cuándo sacrificar investigación para asegurar el oxígeno de los astronautas, y cómo dosificar la energía eléctrica ante las alertas de clima solar DONKI y los estudios biológicos OSDR.</p>
        <p>¡Eres un verdadero ejemplo de astronauta para las futuras misiones humanas a Marte!</p>
      `;
    } else {
      window.gameAudio.playDefeat();
      const fail = state.failureReason || {
        system: 'SOPORTE VITAL',
        title: 'Misión Evacuada',
        explanation: 'Uno de los recursos vitales cayó a cero.',
        scienceLesson: 'En el espacio, no hay segundas oportunidades sin previsión.'
      };

      gameoverTitle.innerHTML = `⚠️ PROTOCOLO DE EMERGENCIA ACTIVADO`;
      gameoverSubtitle.innerHTML = `Atención, <strong>Astronauta ${state.playerName}</strong>: La base lunar sufrió una emergencia crítica no sostenible. Se activó la cápsula de escape Orion para el retorno de emergencia a la Tierra.`;
      gameoverRank.innerHTML = `Causa de Aborto: ${fail.system}`;
      gameoverScore.textContent = scoreData.score;
      gameoverDays.textContent = `${scoreData.daysSurvived} / ${scoreData.totalDays} Días`;
      gameoverScience.textContent = `${scoreData.scienceCollected} Pts`;

      gameoverLessonBox.className = 'lesson-card lesson-failure';
      gameoverLessonText.innerHTML = `
        <h4>🛑 Lo que ocurrió: ${fail.title}</h4>
        <p>${fail.explanation}</p>
        <div class="science-truth-pill">
          <strong>🔬 La lección científica real de la NASA:</strong>
          <p>${fail.scienceLesson}</p>
        </div>
        <p style="margin-top: 10px; font-weight: 600;">
          ¡No te rindas! Todos los ingenieros espaciales aprenden de las simulaciones antes de volar. ¡Revisa tu estrategia de recursos e inténtalo de nuevo!
        </p>
      `;
    }
  }

  // ========================================================================
  // 14. Compartir o Descargar Certificado Oficial
  // ========================================================================
  let isSharingCert = false;
  if (btnShareCert) {
    btnShareCert.addEventListener('click', async () => {
      if (isSharingCert) return;
      isSharingCert = true;
      const originalText = btnShareCert.innerHTML;
      btnShareCert.innerHTML = '⏳ GENERANDO CERTIFICADO...';

      try {
        const outcome = await window.certificateGenerator.shareOrDownload(window.gameState);
        if (outcome === 'shared') {
          btnShareCert.innerHTML = '✅ ¡COMPARTIDO CON ÉXITO!';
        } else if (outcome === 'downloaded') {
          btnShareCert.innerHTML = '📥 ¡CERTIFICADO DESCARGADO!';
        } else {
          btnShareCert.innerHTML = '📤 COMPARTIR CERTIFICADO';
        }
      } catch (err) {
        console.error('Error al exportar certificado:', err);
        btnShareCert.innerHTML = '⚠️ ERROR AL EXPORTAR';
      } finally {
        setTimeout(() => {
          btnShareCert.innerHTML = originalText;
          isSharingCert = false;
        }, 3000);
      }
    });
  }

  // ========================================================================
  // 15. Botón reiniciar
  // ========================================================================
  btnRestart.addEventListener('click', () => {
    window.speechNarrator.stop();
    window.gameAudio.playClick();
    window.gameState.listeners = [];
    screenGameOver.classList.add('hidden');
    screenWelcome.classList.remove('hidden');
    window.astroMascot.setEmotion('greeting');
  });

  // ========================================================================
  // 16. Modal del Archivo Científico de la NASA
  // ========================================================================
  const openScienceModal = () => {
    window.gameAudio.playClick();
    renderScienceArchive();
    modalScience.classList.remove('hidden');
  };

  if (btnOpenScience) btnOpenScience.addEventListener('click', openScienceModal);
  if (btnSidebarScience) btnSidebarScience.addEventListener('click', openScienceModal);

  if (btnCloseScience) {
    btnCloseScience.addEventListener('click', () => {
      window.gameAudio.playClick();
      modalScience.classList.add('hidden');
    });
  }

  function renderScienceArchive() {
    const studies = window.osdrRepository.getAllStudies();
    const donkiEvents = window.donkiService.historicalEvents;

    scienceContent.innerHTML = `
      <div class="science-tabs">
        <h3>🧬 Repositorio de Biología Espacial OSDR (NASA Open Science Data Repository)</h3>
        <p class="section-intro">Estudios auténticos de biología espacial y medicina de astronautas consultables en <a href="https://osdr.nasa.gov" target="_blank" rel="noopener noreferrer">osdr.nasa.gov</a>:</p>
        <div class="science-cards-grid">
          ${studies.map(s => `
            <div class="science-archive-item">
              <div class="archive-header-row">
                <span class="archive-badge">${s.id} • ${s.badge}</span>
                <a href="${s.studyUrl}" target="_blank" rel="noopener noreferrer" class="archive-source-link">Ver en NASA OSDR ↗</a>
              </div>
              <h4>${s.title}</h4>
              <p><strong>Organismo / Muestra:</strong> ${s.organism}</p>
              <p><strong>Instalación NASA:</strong> ${s.nasaFacility}</p>
              <p class="archive-kid-expl">${s.kidExplanation}</p>
              <div class="archive-tradeoff">
                <strong>Compensación en ORBITA5:</strong><br>
                ${s.tradeoffImpact.choiceYes}
              </div>
            </div>
          `).join('')}
        </div>

        <h3 style="margin-top: 24px;">☀️ Base de Clima Espacial DONKI (Space Weather Database)</h3>
        <p class="section-intro">Eventos solares auténticos monitoreados por la flota de heliofísica de la NASA consultables en <a href="https://api.nasa.gov/DONKI" target="_blank" rel="noopener noreferrer">api.nasa.gov/DONKI</a>:</p>
        <div class="science-cards-grid">
          ${donkiEvents.map(e => `
            <div class="science-archive-item">
              <div class="archive-header-row">
                <span class="archive-badge" style="background: rgba(255, 71, 87, 0.2); border-color: #ff4757;">
                  ${e.id} • ${e.severity}
                </span>
                <span class="archive-craft-tag">${e.spacecraft || 'Flota NASA'}</span>
              </div>
              <h4>${e.title}</h4>
              <p><strong>Fecha en Catálogo:</strong> ${e.catalogDate} | <strong>Velocidad:</strong> ${e.speed} km/s</p>
              <p><strong>Dosis Estimada:</strong> ${e.radiationDoseMsv} mSv</p>
              <p class="archive-kid-expl">${e.scienceFact}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
});
