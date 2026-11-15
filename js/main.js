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

  // Controles de Internacionalización (i18n: ES / EN)
  const langSwitchBtns = document.querySelectorAll('.lang-switch-btn');
  const labelSiteLang = document.getElementById('label-site-lang');
  const btnTopLang = document.getElementById('btn-top-lang');
  const topLangLabel = document.getElementById('top-lang-label');
  const btnSidebarLang = document.getElementById('btn-sidebar-lang');
  const sidebarLangLabel = document.getElementById('sidebar-lang-label');

  // Elementos de texto localizables en Bienvenida
  const mainSubtitle = document.getElementById('main-subtitle');
  const welcomeMascotBubble = document.getElementById('welcome-mascot-bubble');
  const briefingTitle = document.getElementById('briefing-title');
  const briefingP1 = document.getElementById('briefing-p1');
  const briefingRule = document.getElementById('briefing-rule');
  const labelPlayerName = document.getElementById('label-player-name');
  const labelMissionLevel = document.getElementById('label-mission-level');
  const diff1Title = document.getElementById('diff-1-title');
  const diff1Days = document.getElementById('diff-1-days');
  const diff1Desc = document.getElementById('diff-1-desc');
  const diff2Title = document.getElementById('diff-2-title');
  const diff2Days = document.getElementById('diff-2-days');
  const diff2Desc = document.getElementById('diff-2-desc');
  const diff3Title = document.getElementById('diff-3-title');
  const diff3Days = document.getElementById('diff-3-days');
  const diff3Desc = document.getElementById('diff-3-desc');
  const themeSelectorLabel = document.getElementById('theme-selector-label');
  const themeBtnBadge1 = document.getElementById('theme-btn-badge-1');
  const themeBtnTitle1 = document.getElementById('theme-btn-title-1');
  const themeBtnSub1 = document.getElementById('theme-btn-sub-1');
  const themeBtnBadge2 = document.getElementById('theme-btn-badge-2');
  const themeBtnTitle2 = document.getElementById('theme-btn-title-2');
  const themeBtnSub2 = document.getElementById('theme-btn-sub-2');
  const themeBtnBadge3 = document.getElementById('theme-btn-badge-3');
  const themeBtnTitle3 = document.getElementById('theme-btn-title-3');
  const themeBtnSub3 = document.getElementById('theme-btn-sub-3');

  // Elementos de texto localizables en Panel Lateral y Cabecera
  const mascotSidebarRole = document.getElementById('mascot-sidebar-role');
  const sidebarTelemetryTitle = document.getElementById('sidebar-telemetry-title');
  const sideLabelO2 = document.getElementById('side-label-o2');
  const sideLabelEnergy = document.getElementById('side-label-energy');
  const sideLabelHealth = document.getElementById('side-label-health');
  const sideLabelIntegrity = document.getElementById('side-label-integrity');
  const sideLabelScience = document.getElementById('side-label-science');
  const sidebarThemePrefix = document.getElementById('sidebar-theme-prefix');
  const sidebarVoiceLabel = document.getElementById('sidebar-voice-label');
  const sidebarScienceLabel = document.getElementById('sidebar-science-label');
  const sidebarSoundLabel = document.getElementById('sidebar-sound-label');
  const sidebarAbortLabel = document.getElementById('sidebar-abort-label');
  const topScienceLabel = document.getElementById('top-science-label');
  const topAbortLabel = document.getElementById('top-abort-label');

  // Elementos de texto localizables en Fin de Misión
  const lblGameoverScore = document.getElementById('lbl-gameover-score');
  const lblGameoverDays = document.getElementById('lbl-gameover-days');
  const lblGameoverScience = document.getElementById('lbl-gameover-science');

  // Elementos de texto localizables en Modales
  const modalScienceTitle = document.getElementById('modal-science-title');
  const modalAbortTitle = document.getElementById('modal-abort-title');
  const modalAbortPrompt = document.getElementById('modal-abort-prompt');
  const modalAbortDesc = document.getElementById('modal-abort-desc');
  const modalVoiceTitle = document.getElementById('modal-voice-title');
  const modalVoiceDesc = document.getElementById('modal-voice-desc');
  const modalVoiceActiveLabel = document.getElementById('modal-voice-active-label');
  const modalThemeTitle = document.getElementById('modal-theme-title');
  const modalThemeDesc = document.getElementById('modal-theme-desc');

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
  // 0. Internacionalización (i18n): Español (es) / Inglés (en)
  // ========================================================================
  function updateLanguageUI() {
    if (!window.i18n) return;
    const lang = window.i18n.getLanguage();
    const isEn = lang === 'en';

    // 1. Selectores de idioma (botones ES / EN en barra superior y formulario de bienvenida)
    if (langSwitchBtns && langSwitchBtns.length > 0) {
      langSwitchBtns.forEach(btn => {
        const btnLang = btn.dataset.lang;
        btn.classList.toggle('active', btnLang === lang);
      });
    }
    if (labelSiteLang) {
      labelSiteLang.textContent = window.i18n.t('label_site_lang');
    }

    // 2. Botón de cabecera superior y panel lateral
    if (topLangLabel) {
      topLangLabel.textContent = isEn ? 'ES' : 'EN';
    }
    if (btnTopLang) {
      btnTopLang.title = isEn ? 'Cambiar a Español' : 'Switch to English';
    }
    if (sidebarLangLabel) {
      sidebarLangLabel.textContent = isEn ? 'Language: English' : 'Idioma: Español';
    }

    // 3. Pantalla de bienvenida y briefing inicial
    if (mainSubtitle) mainSubtitle.textContent = window.i18n.t('app_subtitle');
    if (welcomeMascotBubble) {
      welcomeMascotBubble.innerHTML = isEn
        ? `<strong>Hello, Commander!</strong> I am <strong>AstroCan</strong>, your faithful co-pilot at the Lunar South Pole. What is your astronaut name and which mission level will we undertake today?`
        : `<strong>¡Hola, Comandante!</strong> Soy <strong>AstroCan</strong>, tu fiel copiloto en el Polo Sur Lunar. ¿Cuál es tu nombre de astronauta y qué nivel de misión asumiremos hoy?`;
    }
    if (briefingTitle) briefingTitle.textContent = window.i18n.t('briefing_title');
    if (briefingP1) briefingP1.textContent = window.i18n.t('briefing_p1');
    if (briefingRule) {
      briefingRule.innerHTML = isEn
        ? `⚖️ <strong>Golden Rule:</strong> No choice is free! Every single decision requires a real trade-off.`
        : `⚖️ <strong>Regla de Oro:</strong> ¡Ninguna opción es gratis! Cada decisión exige una compensación real (trade-off).`;
    }
    if (labelPlayerName) labelPlayerName.textContent = window.i18n.t('label_astronaut_name');
    if (inputPlayerName) inputPlayerName.placeholder = window.i18n.t('placeholder_name');
    if (nameValidationMsg) nameValidationMsg.textContent = window.i18n.t('validation_name_empty');
    if (labelMissionLevel) labelMissionLevel.textContent = window.i18n.t('label_mission_level');

    if (diff1Title) diff1Title.textContent = window.i18n.t('diff_1_title');
    if (diff1Days) diff1Days.textContent = window.i18n.t('diff_1_days');
    if (diff1Desc) diff1Desc.textContent = window.i18n.t('diff_1_desc');
    if (diff2Title) diff2Title.textContent = window.i18n.t('diff_2_title');
    if (diff2Days) diff2Days.textContent = window.i18n.t('diff_2_days');
    if (diff2Desc) diff2Desc.textContent = window.i18n.t('diff_2_desc');
    if (diff3Title) diff3Title.textContent = window.i18n.t('diff_3_title');
    if (diff3Days) diff3Days.textContent = window.i18n.t('diff_3_days');
    if (diff3Desc) diff3Desc.textContent = window.i18n.t('diff_3_desc');

    if (themeSelectorLabel) themeSelectorLabel.textContent = window.i18n.t('label_ui_theme');
    if (themeBtnBadge1) themeBtnBadge1.textContent = window.i18n.t('theme_badge_base');
    if (themeBtnTitle1) themeBtnTitle1.textContent = window.i18n.t('theme_default_title');
    if (themeBtnSub1) themeBtnSub1.textContent = window.i18n.t('theme_default_sub');
    if (themeBtnBadge2) themeBtnBadge2.textContent = window.i18n.t('theme_badge_pop');
    if (themeBtnTitle2) themeBtnTitle2.textContent = window.i18n.t('theme_pop_title');
    if (themeBtnSub2) themeBtnSub2.textContent = window.i18n.t('theme_pop_sub');
    if (themeBtnBadge3) themeBtnBadge3.textContent = window.i18n.t('theme_badge_retro');
    if (themeBtnTitle3) themeBtnTitle3.textContent = window.i18n.t('theme_retro_title');
    if (themeBtnSub3) themeBtnSub3.textContent = window.i18n.t('theme_retro_sub');

    if (btnStartMission) btnStartMission.textContent = window.i18n.t('btn_start_mission');

    // 4. Panel lateral y cabecera
    if (mascotSidebarRole) mascotSidebarRole.textContent = window.i18n.t('mascot_role');
    if (sidebarTelemetryTitle) sidebarTelemetryTitle.textContent = window.i18n.t('telemetry_title');
    if (sideLabelO2) sideLabelO2.textContent = window.i18n.t('res_o2');
    if (sideLabelEnergy) sideLabelEnergy.textContent = window.i18n.t('res_energy');
    if (sideLabelHealth) sideLabelHealth.textContent = window.i18n.t('res_health');
    if (sideLabelIntegrity) sideLabelIntegrity.textContent = window.i18n.t('res_integrity');
    if (sideLabelScience) sideLabelScience.textContent = window.i18n.t('res_science');

    if (sidebarThemePrefix) sidebarThemePrefix.textContent = window.i18n.t('btn_sidebar_theme');
    if (sidebarVoiceLabel) sidebarVoiceLabel.textContent = isEn ? 'Change Voice' : 'Cambiar Voz';
    if (sidebarScienceLabel) sidebarScienceLabel.textContent = window.i18n.t('btn_sidebar_science').replace('🔬 ', '');
    if (sidebarAbortLabel) sidebarAbortLabel.textContent = window.i18n.t('btn_sidebar_abort').replace('🛑 ', '');

    if (topScienceLabel) topScienceLabel.textContent = isEn ? 'NASA Archive' : 'Archivo NASA';
    if (topAbortLabel) topAbortLabel.textContent = isEn ? 'Abort' : 'Abortar';

    // 5. Modales
    if (modalScienceTitle) modalScienceTitle.textContent = window.i18n.t('modal_science_title');
    if (modalAbortTitle) modalAbortTitle.textContent = window.i18n.t('modal_abort_title');
    if (modalAbortPrompt) modalAbortPrompt.innerHTML = `<strong>${window.i18n.t('modal_abort_prompt')}</strong>`;
    if (modalAbortDesc) modalAbortDesc.textContent = window.i18n.t('modal_abort_desc');
    if (btnConfirmAbort) btnConfirmAbort.textContent = window.i18n.t('modal_abort_confirm');
    if (btnCancelAbort) btnCancelAbort.textContent = window.i18n.t('modal_abort_cancel');

    if (modalVoiceTitle) modalVoiceTitle.textContent = window.i18n.t('modal_voice_title');
    if (modalVoiceDesc) modalVoiceDesc.textContent = window.i18n.t('modal_voice_desc');
    if (modalVoiceActiveLabel) modalVoiceActiveLabel.textContent = window.i18n.t('modal_voice_active');
    if (btnCycleVoiceFast) btnCycleVoiceFast.textContent = window.i18n.t('modal_voice_cycle');
    if (btnCloseVoice) btnCloseVoice.textContent = window.i18n.t('modal_voice_done');

    if (modalThemeTitle) modalThemeTitle.textContent = window.i18n.t('modal_theme_title');
    if (modalThemeDesc) modalThemeDesc.textContent = window.i18n.t('modal_theme_desc');
    if (btnCycleThemeFast) btnCycleThemeFast.textContent = window.i18n.t('modal_theme_cycle');
    if (btnCloseTheme) btnCloseTheme.textContent = window.i18n.t('modal_theme_done');

    // 6. Fin de misión
    if (lblGameoverScore) lblGameoverScore.textContent = window.i18n.t('stat_score');
    if (lblGameoverDays) lblGameoverDays.textContent = window.i18n.t('stat_days');
    if (lblGameoverScience) lblGameoverScience.textContent = window.i18n.t('stat_science');
    if (btnShareCert) btnShareCert.textContent = window.i18n.t('btn_share_cert');
    if (btnRestart) btnRestart.textContent = window.i18n.t('btn_restart');

    // 7. Sincronizar narrador por voz
    if (window.speechNarrator) {
      window.speechNarrator.setLanguage(lang);
      updateVoiceButtonLabel(window.speechNarrator.getCurrentVoiceDetails());
      renderVoiceList();
    }

    // 8. Sincronizar botones de sonido
    updateSoundButtonsUI(window.gameAudio.muted);

    // 9. Si el juego está en curso, actualizar HUD y re-renderizar dilema actual
    if (!screenGame.classList.contains('hidden') && window.gameState.currentDay > 0) {
      updateHUD(window.gameState);
      if (currentEvent && !dilemmaCard.classList.contains('hidden')) {
        renderDilemma(currentEvent);
      }
    }

    // 10. Si la pantalla de fin de juego está activa, re-renderizar resultados
    if (!screenGameOver.classList.contains('hidden')) {
      showGameOver(window.gameState);
    }
  }

  // Eventos de selección de idioma en la pantalla de bienvenida y formulario home
  if (langSwitchBtns && langSwitchBtns.length > 0) {
    langSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.gameAudio.playClick();
        const targetLang = btn.dataset.lang;
        if (window.i18n) {
          window.i18n.setLanguage(targetLang);
          updateLanguageUI();
        }
      });
    });
  }

  // Evento de conmutación de idioma en cabecera superior y panel lateral
  const handleToggleLang = () => {
    window.gameAudio.playClick();
    if (window.i18n) {
      window.i18n.toggleLanguage();
      updateLanguageUI();
    }
  };
  if (btnTopLang) btnTopLang.addEventListener('click', handleToggleLang);
  if (btnSidebarLang) btnSidebarLang.addEventListener('click', handleToggleLang);

  if (window.i18n) {
    window.i18n.onLanguageChange(() => {
      updateLanguageUI();
    });
  }

  // ========================================================================
  // 1. Manejo de audio toggle (sincronizado entre cabecera y panel lateral)
  // ========================================================================
  const updateSoundButtonsUI = (isMuted) => {
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const text = isMuted ? (isEn ? '🔇 Mute' : '🔇 Silencio') : (isEn ? '🔊 Sound' : '🔊 Sonido');
    if (btnToggleSound) {
      btnToggleSound.textContent = isMuted ? '🔇' : '🔊';
      btnToggleSound.classList.toggle('btn-muted', isMuted);
    }
    if (btnSidebarSound) {
      btnSidebarSound.textContent = text;
      btnSidebarSound.classList.toggle('btn-muted', isMuted);
    }
    if (sidebarSoundLabel) {
      sidebarSoundLabel.textContent = isMuted ? (isEn ? 'Mute' : 'Silencio') : (isEn ? 'Sound' : 'Sonido');
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
        const localized = window.i18n ? window.i18n.localizeEvent(currentEvent) : currentEvent;
        window.speechNarrator.speakMission(localized);
      }
    });

    window.speechNarrator.setOnStateChange((isSpeaking, targetKey) => {
      const isEn = window.i18n && window.i18n.getLanguage() === 'en';
      // Actualizar botón de la misión
      const isSpeakingMission = isSpeaking && targetKey === 'mission';
      btnNarrateDilemma.classList.toggle('speaking', isSpeakingMission);
      btnNarrateDilemma.innerHTML = isSpeakingMission 
        ? (isEn ? '⏹️ Stop Voice' : '⏹️ Detener Voz') 
        : (isEn ? '📢 Listen to Mission' : '📢 Escuchar Misión');

      // Actualizar botones individuales de opciones
      const optionAudioBtns = document.querySelectorAll('.btn-listen-option');
      optionAudioBtns.forEach(btn => {
        const idx = btn.dataset.optIdx;
        const isSpeakingThis = isSpeaking && targetKey === `option-${idx}`;
        btn.classList.toggle('speaking', isSpeakingThis);
        btn.innerHTML = isSpeakingThis 
          ? (isEn ? '⏹️ Stop' : '⏹️ Detener') 
          : (isEn ? '🔊 Listen to Option' : '🔊 Escuchar Opción');
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
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const voices = window.speechNarrator.getActiveVoices();
    const current = window.speechNarrator.getCurrentVoiceDetails();

    if (!voices || voices.length === 0) {
      voiceOptionsList.innerHTML = `
        <div class="voice-card">
          <div class="voice-card-info">
            <span class="voice-card-flag">🌐</span>
            <div class="voice-card-texts">
              <strong class="voice-card-name">${isEn ? 'Default browser voice' : 'Voz predeterminada del navegador'}</strong>
              <span class="voice-card-region">${isEn ? 'English (Auto)' : 'Español Latinoamericano'}</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    voiceOptionsList.innerHTML = voices.map(v => {
      const details = window.speechNarrator.getVoiceDetails(v);
      const isSelected = current && current.name === v.name;
      const previewTitle = isEn ? 'Listen to sample' : 'Escuchar muestra';
      const previewText = isEn ? '▶️ Preview' : '▶️ Probar';
      const selectText = isSelected 
        ? (isEn ? '✓ Active' : '✓ Activa')
        : (isEn ? 'Select' : 'Elegir');

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
            <button type="button" class="btn-voice-preview" data-preview-voice="${escapeHtml(v.name)}" title="${previewTitle}">
              ${previewText}
            </button>
            <button type="button" class="btn-voice-select ${isSelected ? 'active' : ''}" data-select-voice="${escapeHtml(v.name)}">
              ${selectText}
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
        window.i18n ? window.i18n.t('mascot_need_name') : '¡Comandante! Necesito registrar tu nombre en el manifiesto oficial de vuelo antes de asumir el mando.'
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
    const initialGreeting = window.i18n
      ? window.i18n.t('mascot_start_mission', { name })
      : `¡Comandante ${name}, base transferida a tu mando! Gestionemos con sabiduría los recursos.`;
    window.astroMascot.setEmotion('greeting', initialGreeting);

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

      const isEn = window.i18n && window.i18n.getLanguage() === 'en';
      window.astroMascot.setEmotion(
        'greeting',
        isEn
          ? 'Mission aborted. You can enter a new astronaut name or pick another training level.'
          : 'Misión cancelada. Puedes ingresar un nuevo nombre o elegir otro nivel de entrenamiento.'
      );
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
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    if (hudPlayerName) hudPlayerName.textContent = state.playerName;
    if (hudDayText) hudDayText.textContent = `${isEn ? 'Day' : 'Día'} ${state.currentDay} / ${state.totalDays}`;

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
    if (sideValScience) sideValScience.textContent = `${state.resources.science} ${isEn ? 'pts' : 'pts'}`;

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

    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const scaledDelta = state.scaleDelta(opt.delta);

    const sciLabel = isEn ? 'Science' : 'Ciencia';
    const o2Label = 'O2';
    const energyLabel = isEn ? 'Energy' : 'Energía';
    const healthLabel = isEn ? 'Health' : 'Salud';
    const integrityLabel = isEn ? 'Integrity' : 'Integridad';

    // Formatear texto dinámico de ganancia
    const gains = [];
    if (scaledDelta.science > 0) gains.push(`+${scaledDelta.science} ${sciLabel}`);
    if (scaledDelta.oxygen > 0) gains.push(`+${scaledDelta.oxygen}% ${o2Label}`);
    if (scaledDelta.energy > 0) gains.push(`+${scaledDelta.energy}% ${energyLabel}`);
    if (scaledDelta.health > 0) gains.push(`+${scaledDelta.health}% ${healthLabel}`);
    if (scaledDelta.integrity > 0) gains.push(`+${scaledDelta.integrity}% ${integrityLabel}`);

    // Formatear texto dinámico de costo
    const costs = [];
    if (scaledDelta.oxygen < 0) costs.push(`${scaledDelta.oxygen}% ${o2Label}`);
    if (scaledDelta.energy < 0) costs.push(`${scaledDelta.energy}% ${energyLabel}`);
    if (scaledDelta.health < 0) costs.push(`${scaledDelta.health}% ${healthLabel}`);
    if (scaledDelta.integrity < 0) costs.push(`${scaledDelta.integrity}% ${integrityLabel}`);

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

    renderDilemma(currentEvent);
  }

  function renderDilemma(rawEvent) {
    if (!rawEvent) return;
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const localized = window.i18n ? window.i18n.localizeEvent(rawEvent) : rawEvent;

    dilemmaTag.textContent = localized.tag;
    dilemmaTitle.textContent = localized.title;
    dilemmaSender.textContent = isEn ? `📡 Transmission from: ${localized.sender}` : `📡 Transmisión de: ${localized.sender}`;
    dilemmaDesc.textContent = localized.description;

    if (btnNarrateDilemma) {
      btnNarrateDilemma.innerHTML = isEn ? '📢 Listen to Mission' : '📢 Escuchar Misión';
      btnNarrateDilemma.title = isEn ? 'Listen to this mission dilemma in audio' : 'Reproducir en audio este dilema';
    }

    // Mostrar Fuente Oficial de la NASA con certificación de ciencia real
    if (dilemmaSourceBox && localized.dataSource) {
      dilemmaSourceBox.innerHTML = `
        <div class="source-header">
          <span class="source-verified-badge">${isEn ? '🔬 REAL NASA SCIENCE' : '🔬 CIENCIA REAL DE LA NASA'}</span>
          <span class="source-live-tag">${isEn ? 'OPEN DATA' : 'DATOS ABIERTOS'}</span>
        </div>
        <div class="source-content">
          <strong>🛰️ ${isEn ? 'Official Dataset / Study:' : 'Conjunto de Datos / Estudio Oficial:'}</strong> 
          <a href="${localized.dataSource.url}" target="_blank" rel="noopener noreferrer" title="${isEn ? 'View official NASA science repository' : 'Consultar repositorio científico oficial de la NASA'}">
            ${localized.dataSource.name} ↗
          </a>
          <div class="source-detail-text">${localized.dataSource.detail}</div>
        </div>
      `;
      dilemmaSourceBox.classList.remove('hidden');
    } else if (dilemmaSourceBox) {
      dilemmaSourceBox.classList.add('hidden');
    }

    dilemmaScienceBox.innerHTML = `<strong>💡 ${isEn ? 'NASA Scientific Context:' : 'Contexto Científico NASA:'}</strong> ${localized.scientificContext}`;

    // Escalar opciones según nivel de dificultad
    currentScaledOptions = (localized.options || []).map(opt => getScaledOption(opt, window.gameState));

    // Renderizar opciones con compensaciones explícitas y matemáticas precisas
    dilemmaOptionsContainer.innerHTML = '';
    currentScaledOptions.forEach((opt, idx) => {
      const optCard = document.createElement('div');
      optCard.className = 'tradeoff-option-card';
      optCard.innerHTML = `
        <div class="option-header-row">
          <span class="option-badge">${isEn ? 'Option' : 'Opción'} ${String.fromCharCode(65 + idx)}</span>
          <strong class="option-title">${opt.title}</strong>
          <button type="button" class="btn-listen-option" data-opt-idx="${idx}" title="${isEn ? 'Listen to this option with audio narration' : 'Escuchar esta opción en audio'}">
            🔊 ${isEn ? 'Listen to Option' : 'Escuchar Opción'}
          </button>
        </div>
        <p class="option-action">${opt.actionText}</p>
        <div class="tradeoff-indicators">
          <div class="gain-badge">
            <span class="icon">✅ ${isEn ? 'GAIN:' : 'GANANCIA:'}</span> ${opt.gainText}
          </div>
          <div class="cost-badge">
            <span class="icon">⚠️ ${isEn ? 'SACRIFICE / COST:' : 'COSTO / SACRIFICIO:'}</span> ${opt.costText}
          </div>
        </div>
        <button class="btn-choose-option">
          ${opt.isMinigame 
            ? (isEn ? '🚀 START MANUAL ACTION' : '🚀 INICIAR ACCIÓN MANUAL') 
            : (isEn ? '👉 EXECUTE THIS ORDER' : '👉 EJECUTAR ESTA ORDEN')}
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
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const resources = [
      { key: 'oxygen',    icon: '💨', name: isEn ? 'Oxygen (O2)' : 'Oxígeno (O2)' },
      { key: 'energy',    icon: '⚡', name: isEn ? 'Energy & Batteries' : 'Energía & Baterías' },
      { key: 'health',    icon: '❤️', name: isEn ? 'Crew Health' : 'Salud Tripulación' },
      { key: 'integrity', icon: '🛡️', name: isEn ? 'Hull Integrity' : 'Integridad Casco' },
      { key: 'science',   icon: '🔬', name: isEn ? 'Science Points' : 'Puntos de Ciencia' }
    ];

    let rows = '';
    resources.forEach(r => {
      const b = Math.round(before[r.key]);
      const a = Math.round(after[r.key]);
      const diff = a - b;
      const noChangeText = isEn ? '→ No change' : '→ Sin cambio';
      if (diff === 0) {
        rows += `
          <tr class="change-row neutral">
            <td>${r.icon} ${r.name}</td>
            <td>${b}${r.key === 'science' ? '' : '%'}</td>
            <td class="change-neutral">${noChangeText}</td>
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
              <th>${isEn ? 'Resource' : 'Recurso'}</th>
              <th>${isEn ? 'Before' : 'Antes'}</th>
              <th>${label}</th>
              <th>${isEn ? 'Now' : 'Ahora'}</th>
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

      const isEn = window.i18n && window.i18n.getLanguage() === 'en';
      const scaledDelta = window.gameState.scaleDelta(rawDelta);
      const before = { ...window.gameState.resources };
      const record = window.gameState.applyResourceDelta(
        scaledDelta,
        isEn ? 'DONKI Solar Shield Power Divert' : 'Desvío de Energía Escudo Solar DONKI',
        isEn ? 'Real-time CME mitigation' : 'Gestión en tiempo real de CME'
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

      const isEn = window.i18n && window.i18n.getLanguage() === 'en';
      const scaledDelta = window.gameState.scaleDelta(rawDelta);
      const before = { ...window.gameState.resources };
      const record = window.gameState.applyResourceDelta(
        scaledDelta,
        isEn ? 'Shackleton Crater Ice Expedition' : 'Expedición de Hielo Cráter Shackleton',
        isEn ? 'In-situ resource utilization (ISRU)' : 'Extracción de recursos in-situ (ISRU)'
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

    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const orderLabel = isEn ? 'Your Order' : 'Tu Orden';
    const receiptTitle = isEn ? '📊 Impact of your Order on Resources' : '📊 Impacto de tu Orden en los Recursos';

    if (window.gameState.isGameOver) {
      transmissionText.innerHTML = `
        <div class="log-quote">"${feedbackText}"</div>
        <h4 class="receipt-title">${receiptTitle}</h4>
        ${buildResourceChangeTable(before, after, orderLabel)}
      `;
      btnNextDay.classList.add('hidden');
      return;
    }

    transmissionText.innerHTML = `
      <div class="log-quote">"${feedbackText}"</div>
      <h4 class="receipt-title">${receiptTitle}</h4>
      ${buildResourceChangeTable(before, after, orderLabel)}
      <div class="log-reminder">
        <em>${isEn ? 'Daily survival consumption will now be calculated. Your base consumes resources just by keeping the astronauts alive.' : 'Ahora se calculará el consumo de supervivencia del día. Tu base gasta recursos solo por mantener con vida a los astronautas.'}</em>
      </div>
    `;

    btnNextDay.textContent = isEn ? '📋 VIEW DAILY CONSUMPTION' : '📋 VER CONSUMO DEL DÍA';
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

    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const diffLabel = state.difficulty === 1 ? (isEn ? 'Cadet' : 'Cadete')
                    : state.difficulty === 2 ? (isEn ? 'Specialist' : 'Especialista')
                    : (isEn ? 'Commander' : 'Comandante');

    transmissionText.innerHTML = `
      <h3 class="transmission-title" style="margin-bottom: 10px;">
        ${isEn ? `📋 Daily Consumption Report — Day ${state.currentDay} (${diffLabel} Level)` : `📋 Reporte de Consumo Diario — Día ${state.currentDay} (Nivel ${diffLabel})`}
      </h3>

      <div class="decay-explanation-card">
        <p class="decay-intro">
          ${isEn 
            ? 'Every passing day, your lunar base <strong>automatically</strong> expends resources just to keep all 4 astronauts alive. These unavoidable costs reflect the real biological and engineering demands of deep space survival:'
            : 'Cada día que pasa, tu base lunar gasta recursos <strong>automáticamente</strong> solo por mantener con vida a los 4 astronautas. Estos costos son inevitables y representan las necesidades reales de supervivencia en el espacio profundo:'}
        </p>

        <div class="decay-item-grid">
          <div class="decay-item">
            <div class="decay-item-header">
              <span>💨 ${isEn ? 'Oxygen:' : 'Oxígeno:'} <strong class="change-negative">-${plan.rates.oxygen}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.oxygen}</p>
          </div>

          <div class="decay-item">
            <div class="decay-item-header">
              <span>⚡ ${isEn ? 'Energy:' : 'Energía:'} <strong class="change-negative">-${plan.rates.energy}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.energy}</p>
          </div>

          <div class="decay-item">
            <div class="decay-item-header">
              <span>❤️ ${isEn ? 'Health:' : 'Salud:'} <strong class="change-negative">-${plan.rates.health}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.health}</p>
          </div>

          <div class="decay-item">
            <div class="decay-item-header">
              <span>🛡️ ${isEn ? 'Integrity:' : 'Integridad:'} <strong class="change-negative">-${plan.rates.integrity}%</strong></span>
            </div>
            <p class="decay-item-reason">${plan.reasons.integrity}</p>
          </div>
        </div>
      </div>

      <h4 class="receipt-title" style="margin-top: 16px;">📊 ${isEn ? 'Final Balance of the Day' : 'Balance Final del Día'}</h4>
      ${buildResourceChangeTable(beforeDecay, afterDecay, isEn ? 'Daily Consumption' : 'Consumo Diario')}

      <div class="log-reminder" style="margin-top: 12px;">
        <em>${isEn
          ? '⚖️ Remember: in deep space no decision is neutral. Longer and harder missions require even stricter resource budgeting. Plan wisely, Commander!'
          : '⚖️ Recuerda: en el espacio profundo ninguna decisión es neutra. Las misiones más largas y difíciles dosifican los recursos con mayor rigor. ¡Planifica con sabiduría, Comandante!'}</em>
      </div>
    `;

    btnNextDay.textContent = isEn ? '☀️ ADVANCE TO NEXT LUNAR DAY' : '☀️ AVANZAR AL SIGUIENTE DÍA LUNAR';
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
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';

    // Reacción de fin de juego para AstroCan
    window.astroMascot.reactToGameOver(isVictory);

    if (isVictory) {
      window.gameAudio.playVictory();
      gameoverTitle.innerHTML = isEn ? `🏆 ORBITA5 MISSION ACCOMPLISHED!` : `🏆 ¡MISIÓN ORBITA5 CUMPLIDA!`;
      gameoverSubtitle.innerHTML = isEn
        ? `Congratulations, <strong>Commander ${state.playerName}</strong>. You successfully sustained the lunar outpost and completed the ${state.totalDays}-day mission.`
        : `Felicitaciones, <strong>Comandante ${state.playerName}</strong>. Has logrado mantener con vida al puesto avanzado lunar y completar con éxito la misión de ${state.totalDays} días.`;
      gameoverRank.innerHTML = `🏆 ${scoreData.rank}`;
      gameoverScore.textContent = scoreData.score;
      gameoverDays.textContent = `${scoreData.daysSurvived} / ${scoreData.totalDays} ${isEn ? 'Days' : 'Días'}`;
      gameoverScience.textContent = `${scoreData.scienceCollected} Pts`;

      gameoverLessonBox.className = 'lesson-card lesson-success';
      gameoverLessonText.innerHTML = isEn ? `
        <h4>🎓 Aerospace Leadership Certificate</h4>
        <p>You demonstrated a mastery of space exploration's most important principle: <strong>real trade-offs</strong>. You knew when to sacrifice science to secure the astronauts' oxygen, and how to ration electrical power amidst DONKI solar weather warnings and OSDR biological experiments.</p>
        <p>You are a true role model for future human missions to Mars!</p>
      ` : `
        <h4>🎓 Certificado de Liderazgo Aeroespacial</h4>
        <p>Demostraste comprender el principio más importante de la exploración espacial: <strong>las compensaciones reales (trade-offs)</strong>. Supiste cuándo sacrificar investigación para asegurar el oxígeno de los astronautas, y cómo dosificar la energía eléctrica ante las alertas de clima solar DONKI y los estudios biológicos OSDR.</p>
        <p>¡Eres un verdadero ejemplo de astronauta para las futuras misiones humanas a Marte!</p>
      `;
    } else {
      window.gameAudio.playDefeat();
      const fail = state.failureReason || {
        system: isEn ? 'LIFE SUPPORT' : 'SOPORTE VITAL',
        title: isEn ? 'Mission Evacuated' : 'Misión Evacuada',
        explanation: isEn ? 'One of the vital resources dropped to zero.' : 'Uno de los recursos vitales cayó a cero.',
        scienceLesson: isEn ? 'In deep space, there are no second chances without foresight.' : 'En el espacio, no hay segundas oportunidades sin previsión.'
      };

      gameoverTitle.innerHTML = isEn ? `⚠️ EMERGENCY PROTOCOL ACTIVATED` : `⚠️ PROTOCOLO DE EMERGENCIA ACTIVADO`;
      gameoverSubtitle.innerHTML = isEn
        ? `Attention, <strong>Astronaut ${state.playerName}</strong>: The lunar outpost suffered an unsustainable critical emergency. The Orion escape capsule was activated for emergency return to Earth.`
        : `Atención, <strong>Astronauta ${state.playerName}</strong>: La base lunar sufrió una emergencia crítica no sostenible. Se activó la cápsula de escape Orion para el retorno de emergencia a la Tierra.`;
      gameoverRank.innerHTML = isEn ? `Abort Cause: ${fail.system}` : `Causa de Aborto: ${fail.system}`;
      gameoverScore.textContent = scoreData.score;
      gameoverDays.textContent = `${scoreData.daysSurvived} / ${scoreData.totalDays} ${isEn ? 'Days' : 'Días'}`;
      gameoverScience.textContent = `${scoreData.scienceCollected} Pts`;

      gameoverLessonBox.className = 'lesson-card lesson-failure';
      gameoverLessonText.innerHTML = `
        <h4>🛑 ${isEn ? 'What happened:' : 'Lo que ocurrió:'} ${fail.title}</h4>
        <p>${fail.explanation}</p>
        <div class="science-truth-pill">
          <strong>🔬 ${isEn ? 'The real NASA scientific lesson:' : 'La lección científica real de la NASA:'}</strong>
          <p>${fail.scienceLesson}</p>
        </div>
        <p style="margin-top: 10px; font-weight: 600;">
          ${isEn 
            ? 'Do not give up! All space engineers learn from simulations before flight. Review your resource strategy and try again!' 
            : '¡No te rindas! Todos los ingenieros espaciales aprenden de las simulaciones antes de volar. ¡Revisa tu estrategia de recursos e inténtalo de nuevo!'}
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
      const isEn = window.i18n && window.i18n.getLanguage() === 'en';
      const originalText = isEn ? '📤 SHARE CERTIFICATE' : '📤 COMPARTIR CERTIFICADO';
      btnShareCert.innerHTML = isEn ? '⏳ GENERATING CERTIFICATE...' : '⏳ GENERANDO CERTIFICADO...';

      try {
        const outcome = await window.certificateGenerator.shareOrDownload(window.gameState);
        if (outcome === 'shared') {
          btnShareCert.innerHTML = isEn ? '✅ SHARED SUCCESSFULLY!' : '✅ ¡COMPARTIDO CON ÉXITO!';
        } else if (outcome === 'downloaded') {
          btnShareCert.innerHTML = isEn ? '📥 CERTIFICATE DOWNLOADED!' : '📥 ¡CERTIFICADO DESCARGADO!';
        } else {
          btnShareCert.innerHTML = isEn ? '📤 SHARE CERTIFICATE' : '📤 COMPARTIR CERTIFICADO';
        }
      } catch (err) {
        console.error('Error al exportar certificado:', err);
        btnShareCert.innerHTML = isEn ? '⚠️ EXPORT ERROR' : '⚠️ ERROR AL EXPORTAR';
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
    const isEn = window.i18n && window.i18n.getLanguage() === 'en';
    const studies = window.osdrRepository.getAllStudies();
    const donkiEvents = window.donkiService.historicalEvents;

    scienceContent.innerHTML = `
      <div class="science-tabs">
        <h3>🧬 ${isEn ? 'NASA OSDR Space Biology Repository (Open Science Data Repository)' : 'Repositorio de Biología Espacial OSDR (NASA Open Science Data Repository)'}</h3>
        <p class="section-intro">${isEn ? 'Authentic space biology and astronaut medicine studies searchable at' : 'Estudios auténticos de biología espacial y medicina de astronautas consultables en'} <a href="https://osdr.nasa.gov" target="_blank" rel="noopener noreferrer">osdr.nasa.gov</a>:</p>
        <div class="science-cards-grid">
          ${studies.map(s => `
            <div class="science-archive-item">
              <div class="archive-header-row">
                <span class="archive-badge">${s.id} • ${s.badge}</span>
                <a href="${s.studyUrl}" target="_blank" rel="noopener noreferrer" class="archive-source-link">${isEn ? 'View on NASA OSDR ↗' : 'Ver en NASA OSDR ↗'}</a>
              </div>
              <h4>${s.title}</h4>
              <p><strong>${isEn ? 'Organism / Sample:' : 'Organismo / Muestra:'}</strong> ${s.organism}</p>
              <p><strong>${isEn ? 'NASA Facility:' : 'Instalación NASA:'}</strong> ${s.nasaFacility}</p>
              <p class="archive-kid-expl">${s.kidExplanation}</p>
              <div class="archive-tradeoff">
                <strong>${isEn ? 'Trade-off in ORBITA5:' : 'Compensación en ORBITA5:'}</strong><br>
                ${s.tradeoffImpact.choiceYes}
              </div>
            </div>
          `).join('')}
        </div>

        <h3 style="margin-top: 24px;">☀️ ${isEn ? 'NASA DONKI Space Weather Database' : 'Base de Clima Espacial DONKI (Space Weather Database)'}</h3>
        <p class="section-intro">${isEn ? 'Authentic solar events tracked by NASA heliophysics fleet searchable at' : 'Eventos solares auténticos monitoreados por la flota de heliofísica de la NASA consultables en'} <a href="https://api.nasa.gov/DONKI" target="_blank" rel="noopener noreferrer">api.nasa.gov/DONKI</a>:</p>
        <div class="science-cards-grid">
          ${donkiEvents.map(e => `
            <div class="science-archive-item">
              <div class="archive-header-row">
                <span class="archive-badge" style="background: rgba(255, 71, 87, 0.2); border-color: #ff4757;">
                  ${e.id} • ${e.severity}
                </span>
                <span class="archive-craft-tag">${e.spacecraft || (isEn ? 'NASA Fleet' : 'Flota NASA')}</span>
              </div>
              <h4>${e.title}</h4>
              <p><strong>${isEn ? 'Catalog Date:' : 'Fecha en Catálogo:'}</strong> ${e.catalogDate} | <strong>${isEn ? 'Speed:' : 'Velocidad:'}</strong> ${e.speed} km/s</p>
              <p><strong>${isEn ? 'Estimated Dose:' : 'Dosis Estimada:'}</strong> ${e.radiationDoseMsv} mSv</p>
              <p class="archive-kid-expl">${e.scienceFact}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ========================================================================
  // Inicialización de la Interfaz con el Idioma Activo
  // ========================================================================
  updateLanguageUI();
});
