/**
 * ORBITA5: Internationalization (i18n) Service
 * Soporte bilingüe completo: Español (es) e Inglés (en)
 * Gestiona traducciones de la interfaz (UI), telemetría, eventos de la NASA,
 * diálogos de AstroCan, minijuegos, certificado oficial y narración por voz.
 */

class I18nManager {
  constructor() {
    this.storageKey = 'orbita5_lang';
    this.languages = ['es', 'en'];
    this.currentLang = this.loadSavedLanguage();
    this.listeners = [];

    this.translations = {
      es: {
        // Metadatos y Encabezados
        app_title: 'ORBITA5',
        app_subtitle: 'Simulador de supervivencia lunar para jóvenes astronautas (7–12 años)',
        nasa_badge: '🚀 NASA SPACE APPS CHALLENGE 2026',

        // Pantalla de Bienvenida
        welcome_mascot_intro: '¡Hola, Comandante! Soy AstroCan, tu fiel copiloto en el Polo Sur Lunar. ¿Cuál es tu nombre de astronauta y qué nivel de misión asumiremos hoy?',
        briefing_title: '📍 Tu Misión: Base Lunar en el Polo Sur (Cráter Shackleton)',
        briefing_p1: 'Gestionarás el primer puesto avanzado humano en la Luna. Aquí no hay aire, no hay agua líquida y la temperatura va de +105°C a -200°C.',
        briefing_rule: '⚖️ Regla de Oro: ¡Ninguna opción es gratis! Cada decisión exige una compensación real (trade-off).',
        label_astronaut_name: '👤 Tu nombre de astronauta:',
        placeholder_name: 'Ej: Comandante Sofía',
        validation_name_empty: '⚠️ Ingresa tu nombre de astronauta para registrar tu credencial antes de asumir el mando.',
        label_mission_level: '🎯 Nivel de Misión:',
        diff_1_title: '🥉 Cadete',
        diff_1_days: '7 Días',
        diff_1_desc: 'Sol constante, impacto estándar.',
        diff_2_title: '🥈 Especialista',
        diff_2_days: '14 Días',
        diff_2_desc: 'Atardecer polar, impacto moderado.',
        diff_3_title: '🥇 Comandante',
        diff_3_days: '28 Días',
        diff_3_desc: '14 días de noche a -173°C, maratón.',
        label_ui_theme: '🎨 Estilo Visual de la Interfaz (UI):',
        label_site_lang: '🌐 Idioma / Language:',
        theme_default_title: 'Sci-Fi Clásico',
        theme_default_sub: 'Futurista y Limpio',
        theme_pop_title: 'Cómic Pop-Art',
        theme_pop_sub: 'Tinta y Halftone',
        theme_retro_title: 'Novela Gráfica',
        theme_retro_sub: 'Pulp Clásico 70s',
        theme_badge_base: 'Base',
        theme_badge_pop: '¡Acción!',
        theme_badge_retro: 'Vintage',
        btn_start_mission: '🚀 ASUMIR EL MANDO',
        ai_badge_img: 'Generado por IA',
        ai_badge_img_short: 'IA',
        ai_audio_note: 'Audio narrado generado con Inteligencia Artificial (Síntesis de voz / Web Speech API).',
        modal_voice_note: '🔊 Audio y síntesis vocal generados con Inteligencia Artificial (Web Speech API).',
        welcome_ai_note: '🤖 Uso de Inteligencia Artificial: Código y estructura desarrollados con asistencia de Gemini y Claude (Antigravity). Ilustraciones de AstroCan y narración vocal generadas con IA.',

        // Panel Lateral y HUD
        mascot_role: 'Copiloto de Misión',
        mascot_online_status: '¡Sistemas de la base en línea! Esperando tus órdenes, Comandante.',
        telemetry_title: '📡 Telemetría de la Base',
        res_o2: '💨 Oxígeno:',
        res_energy: '⚡ Baterías:',
        res_health: '❤️ Salud:',
        res_integrity: '🛡️ Casco:',
        res_science: '🔬 Ciencia:',
        res_science_pts: 'pts',
        btn_sidebar_theme: '🎨 Estilo UI:',
        btn_sidebar_voice: '🎙️ Cambiar Voz',
        btn_sidebar_science: '🔬 Archivo Científico NASA',
        btn_sidebar_sound_on: '🔊 Sonido',
        btn_sidebar_sound_off: '🔇 Silencio',
        btn_sidebar_abort: '🛑 Abortar Misión',
        btn_sidebar_lang: '🌐 Idioma: Español',

        // Barra Superior
        day_prefix: 'Día',
        btn_top_abort: '🛑 Abortar',
        btn_top_abort_title: 'Volver a la sala de mando',
        btn_top_science: '🔬 Archivo NASA',
        btn_top_voice_title: 'Cambiar tipo de voz de narración',
        btn_top_theme_title: 'Cambiar estilo visual de interfaz (UI)',
        btn_top_lang_title: 'Switch language / Cambiar idioma',
        env_phase_default: 'Día Solar',

        // Tarjeta de Dilema
        dilemma_tag_default: 'ALERTA',
        dilemma_sender_default: '📡 Transmisión de Control de Misión',
        btn_change_voice_label: 'Voz: Auto',
        btn_listen_mission: '📢 Escuchar Misión',
        btn_stop_voice: '⏹️ Detener Voz',
        btn_listen_option: '🔊 Escuchar Opción',
        btn_stop_option: '⏹️ Detener',
        btn_choose_option: 'Elegir esta opción',
        source_verified: 'VERIFICADO POR NASA',
        source_live: 'DATOS EN VIVO',
        source_historic: 'BANCO HISTÓRICO',
        source_study: 'ESTUDIO CIENTÍFICO',
        source_label: 'Fuente Oficial:',
        science_context_label: '💡 Contexto científico:',
        gain_label: 'Ganancia:',
        cost_label: 'Costo o Sacrificio:',
        option_prefix: 'Opción',
        action_prefix: 'Acción:',

        // Informe de Misión (Transmisión)
        transmission_title: '📻 Informe de Control de Misión',
        btn_next_day: '☀️ AVANZAR AL SIGUIENTE DÍA',
        table_resource: 'Recurso',
        table_before: 'Antes',
        table_order: 'Tu Orden',
        table_after: 'Ahora',
        decay_summary_title: 'Consumo Diario de Supervivencia',
        decay_summary_desc: 'Metabolismo de la tripulación, calefacción térmica y micro-fugas.',

        // Fin de Misión (Victoria / Derrota)
        victory_title: '🎉 ¡MISIÓN CUMPLIDA!',
        victory_subtitle: 'Has mantenido con vida la base lunar demostrando sabiduría en las compensaciones reales.',
        defeat_title: '⚠️ MISIÓN EVACUADA',
        defeat_subtitle: 'Uno de los recursos vitales cayó a cero. La tripulación fue evacuada de emergencia a la Tierra.',
        stat_score: 'PUNTUACIÓN',
        stat_days: 'DÍAS',
        stat_science: 'CIENCIA',
        btn_share_cert: '📤 COMPARTIR CERTIFICADO',
        btn_restart: '🔄 NUEVA MISIÓN',
        rank_cadet: 'Cadete Espacial',
        rank_specialist: 'Oficial Científico ORBITA5',
        rank_commander: 'Comandante Lunar',
        rank_supreme: 'Comandante Supremo Lunar',
        rank_trainee: 'Aspirante en Entrenamiento',

        // Modales
        modal_close: 'Cerrar',
        modal_science_title: '🔬 Archivo Científico NASA',
        modal_abort_title: '🛑 Abortar Misión ORBITA5',
        modal_abort_prompt: '¿Seguro que deseas abortar la misión lunar?',
        modal_abort_desc: 'Se cancelará la simulación actual y regresarás a la sala de mando inicial para cambiar tu nombre de astronauta o elegir otro nivel de dificultad.',
        modal_abort_confirm: '🚀 Sí, Abortar y Salir',
        modal_abort_cancel: 'Continuar Misión',

        modal_voice_title: '🎙️ Voces de Control de Misión',
        modal_voice_desc: 'Selecciona la voz de síntesis que prefieras para escuchar las alertas y decisiones en tu base lunar:',
        modal_voice_active: 'Voz activa:',
        modal_voice_cycle: '🔄 Siguiente Voz Rápida',
        modal_voice_done: 'Listo',
        modal_voice_preview: '▶️ Probar',
        modal_voice_select: 'Elegir',
        modal_voice_selected: '✓ Activa',

        modal_theme_title: '🎨 Estilo Visual de la Interfaz (UI)',
        modal_theme_desc: 'Selecciona cómo deseas experimentar ORBITA5. Puedes alternar libremente entre la interfaz base de ciencia ficción y las propuestas con estilo cómic:',
        modal_theme_cycle: '🔄 Alternar Estilo Rápido',
        modal_theme_done: 'Listo',
        modal_theme_active: '✓ Activo',
        modal_theme_activate: 'Activar Estilo',

        // Certificado Canvas
        cert_mission_victory: 'MISIÓN CUMPLIDA',
        cert_mission_defeat: 'MISIÓN EVACUADA',
        cert_sub: 'ORBITA5: COMANDANTE LUNAR',
        cert_stat_score: 'PUNTUACIÓN FINAL',
        cert_stat_days: 'DÍAS SOBREVIVIDOS',
        cert_stat_science: 'CIENCIA PRODUCIDA',
        cert_victory_msg1: 'Demostraste comprender las compensaciones reales (trade-offs) de la',
        cert_victory_msg2: 'supervivencia en el espacio profundo. ¡Futuro astronauta de Marte!',
        cert_defeat_msg1: 'Aprendiste que en el espacio profundo cada recurso es vital.',
        cert_defeat_msg2: '¡Inténtalo de nuevo y mejora tu estrategia de recursos!',
        cert_generated_on: 'Certificado generado el',
        cert_footer_brand: 'ORBITA5 — Simulador de Supervivencia Lunar',
        cert_share_title_win: '🏆 ¡Misión Cumplida! — ORBITA5',
        cert_share_title_loss: '⚠️ Misión Evacuada — ORBITA5',
        cert_share_text: '{name} completó una misión lunar de {days} días con {science} puntos de ciencia en ORBITA5. ¿Podrás superarlo? 🚀',

        // Narrador por Voz
        speech_mission_intro: 'Transmisión de Control de Misión.',
        speech_mission_science: 'Dato científico de la NASA:',
        speech_mission_cta: 'Comandante, revisa las opciones para tomar una decisión.',
        speech_option_intro: 'Opción {letter}: {title}.',
        speech_option_action: 'Acción: {action}.',
        speech_option_gain: 'Ganancia: {gain}.',
        speech_option_cost: 'Costo o sacrificio: {cost}.',
        speech_preview_phrase: '¡Hola, Comandante! Esta es una prueba de voz para la misión espacial en ORBITA5.',
        speech_switch_phrase: 'Cambiando a voz en español: {name}.',

        // AstroCan Diálogos
        mascot_greeting: '¡Hola, Comandante! Listo para la misión lunar.',
        mascot_thinking: 'Mmm... en el espacio profundo ninguna decisión es gratis. ¿Qué deberíamos priorizar?',
        mascot_scared: '¡Cuidado, Comandante! ¡La radiación solar o una falla crítica amenaza el hábitat!',
        mascot_worried: 'Uff... ese sacrificio nos costó bastante. Habrá que vigilar de cerca las reservas.',
        mascot_relaxed: '¡Excelente maniobra! Los sistemas están estables y podemos continuar con seguridad.',
        mascot_celebrating: '¡Síiii! ¡Un avance científico histórico y la tripulación está a salvo!',
        mascot_crying: '¡Oh no! Las reservas cayeron a cero... ¡activando cápsula de retorno de emergencia!',
        mascot_need_name: '¡Comandante! Necesito registrar tu nombre en el manifiesto oficial de vuelo antes de asumir el mando.',
        mascot_start_mission: '¡Comandante {name}, base transferida a tu mando! Gestionemos con sabiduría los recursos.',
        mascot_solar_alert: '¡Alerta de tormenta solar DONKI! ¡Protones de alta energía acercándose al cráter!',
        mascot_bio_alert: 'Un estudio biológico de la NASA... ¿sacrificamos oxígeno o energía para la investigación?',
        mascot_geo_alert: '¡El hielo del cráter Shackleton es oro puro para el puesto lunar! Pensemos en los riesgos.',

        // Minijuegos
        minigame_shield_title: 'Desvío de Energía y Escudo Solar',
        minigame_shield_alarm: '¡TORMENTA SOLAR DONKI EN CURSO!',
        minigame_shield_instruct: 'Ajusta los 3 deslizadores de energía hacia el escudo electromagnético antes del impacto.',
        minigame_shield_btn: 'ESTABILIZAR ESCUDO',
        minigame_rover_title: 'Exploración en Cráter Shackleton',
        minigame_rover_instruct: 'Conduce el rover con las flechas o pantalla táctil para extraer hielo sin colisionar con rocas afiladas.',
        minigame_rover_btn: 'REGRESAR A LA BASE',

        // Fases ambientales
        phase_polar_dawn: 'Amanecer Polar Lunar',
        phase_solar_day: 'Día Solar Pleno',
        phase_polar_twilight: 'Atardecer Polar',
        phase_lunar_night: 'Noche Lunar Extrema (-173°C)',
        phase_trans_night: 'Transición a Noche Polar',
        phase_polar_sunrise: 'Salida del Sol Polar',

        // ====================================================================
        // MODO AVENTURA JUNIOR (7–9 AÑOS)
        // ====================================================================
        btn_junior_mode: '🎮 MODO AVENTURA JUNIOR (7–9 AÑOS)',
        btn_junior_mode_sub: '¡Conduce con AstroCan, esquiva obstáculos y aprende con voz!',
        btn_tactical_mode: '🚀 SIMULADOR DE MANDO (10–12 AÑOS)',
        btn_tactical_mode_sub: 'Toma decisiones estratégicas y gestiona recursos de supervivencia',

        junior_arcade_title: 'Expedición Lunar Junior con AstroCan',
        junior_arcade_subtitle: 'Esquiva rocas espaciales, recoge oxígeno y energía, y completa los 5 días de misión.',
        junior_day_label: 'Día',
        junior_day_of_total: 'Día {day} de {total}',
        junior_day_progress: 'Progreso del Día',
        junior_res_o2: 'Oxígeno',
        junior_res_energy: 'Baterías',
        junior_res_hull: 'Casco',
        junior_res_science: 'Muestras',
        junior_audio_active: '🔊 Voz NASA: Activada',
        junior_audio_muted: '🔇 Voz NASA: Silenciada',
        junior_voice_btn: 'Voz: {name}',
        junior_broadcast_badge: '📡 TRANSMISIÓN EDUCATIVA NASA',
        junior_broadcast_live: '● EN VIVO',
        junior_broadcast_skip: 'Continuar ya',
        junior_btn_listen_again: '📢 Escuchar de nuevo',
        junior_btn_next_day: '👉 CONTINUAR AL SIGUIENTE DÍA',
        junior_btn_finish: '🎉 ¡VER DIPLOMA DE EXPLORADOR!',
        junior_btn_restart: '🔄 Reintentar Expedición',
        junior_btn_home: '🏠 Volver a la Sala de Mando',
        junior_controls_hint: 'Usa las flechas ◀ ▶ o toca los botones para conducir, y 🚀 para saltar',
        junior_touch_left: '◀ IZQ',
        junior_touch_right: 'DER ▶',
        junior_touch_jump: '🚀 SALTO',

        // Hechos Científicos de los 5 Días (Educativo / Niños 7-9 años)
        junior_fact_1_title: '¡El Salto de la Jirafa en la Luna!',
        junior_fact_1_body: '¿Sabías que en la Luna pesas 6 veces menos que en la Tierra? Si aquí saltas un metro, ¡en la Luna saltarías tan alto como una jirafa! Por eso los astronautas del programa Apolo parecían flotar dando pequeños saltitos de canguro.',
        junior_fact_1_tag: 'Ciencia Real NASA: Gravedad Lunar (1/6 g)',

        junior_fact_2_title: '¡Polvo Espacial como Pequeños Cristales!',
        junior_fact_2_body: 'El suelo lunar está cubierto de un polvo llamado regolito. En la Tierra el viento y la lluvia suavizan la arena, pero en la Luna no hay clima. Sus partículas son tan diminutas y filosas como cristales rotos que se pegan a los trajes de los astronautas.',
        junior_fact_2_tag: 'Ciencia Real NASA: Regolito Lunar (Misión Artemis)',

        junior_fact_3_title: '¡Hielo Secreto en el Cráter Shackleton!',
        junior_fact_3_body: 'En el Polo Sur de la Luna hay cráteres profundos donde jamás entra la luz del Sol y hace un frío helado de -230°C. La misión LCROSS de la NASA descubrió que en esa sombra permanente se esconden millones de toneladas de hielo de agua pura.',
        junior_fact_3_tag: 'Ciencia Real NASA: Sondas LCROSS y LRO',

        junior_fact_4_title: '¡Un Horno de Día y un Congelador de Noche!',
        junior_fact_4_body: 'Como la Luna no tiene una atmósfera que la cubra como una cobija, cuando le da el Sol se calienta hasta +120°C (¡más caliente que el agua hirviendo!). Y cuando se hace de noche, baja de golpe a -130°C. ¡Por eso necesitamos energía para mantener el hábitat calientito!',
        junior_fact_4_tag: 'Ciencia Real NASA: Termofísica Lunar (Diviner LRO)',

        junior_fact_5_title: '¡Misión Cumplida, Joven Astronauta!',
        junior_fact_5_body: '¡Excelente trabajo explorando la Luna! Has superado los 5 días de misión. Gracias a las muestras de hielo y minerales que recogiste conduciendo el rover con AstroCan, la base espacial de la NASA tiene agua, aire y combustible para seguir explorando.',
        junior_fact_5_tag: 'Ciencia Real NASA: Programa Artemis Human Landing System',

        junior_victory_title: '🎉 ¡EXPEDICIÓN JUNIOR COMPLETADA!',
        junior_victory_sub: '¡Completaste con valentía los 5 días lunares explorando con AstroCan!',
        junior_depleted_title: '⚠️ ¡Suministros Agotados!',
        junior_depleted_sub: '¡Casi lo logras! En el espacio cada intento nos enseña algo nuevo. ¡Recarguemos el rover y volvamos a intentarlo juntos!',
        junior_btn_retry_day: '🔄 Reintentar este Día',
        junior_badge_explorer: '🏅 Medalla de Explorador Lunar Junior'
      },

      en: {
        // Metadata & Headers
        app_title: 'ORBITA5',
        app_subtitle: 'Lunar survival simulator for junior astronauts (ages 7–12)',
        nasa_badge: '🚀 NASA SPACE APPS CHALLENGE 2026',

        // Welcome Screen
        welcome_mascot_intro: 'Hello, Commander! I am AstroCan, your faithful co-pilot at the Lunar South Pole. What is your astronaut name and which mission level will we undertake today?',
        briefing_title: '📍 Your Mission: Lunar South Pole Base (Shackleton Crater)',
        briefing_p1: 'You will manage humanity\'s first outpost on the Moon. There is no air, no liquid water, and temperatures swing from +105°C to -200°C.',
        briefing_rule: '⚖️ Golden Rule: No choice is free! Every single decision requires a real trade-off.',
        label_astronaut_name: '👤 Your astronaut name:',
        placeholder_name: 'Ex: Commander Alex',
        validation_name_empty: '⚠️ Please enter your astronaut name to register your flight badge before taking command.',
        label_mission_level: '🎯 Mission Level:',
        diff_1_title: '🥉 Cadet',
        diff_1_days: '7 Days',
        diff_1_desc: 'Constant sunlight, standard impact.',
        diff_2_title: '🥈 Specialist',
        diff_2_days: '14 Days',
        diff_2_desc: 'Polar twilight, moderate impact.',
        diff_3_title: '🥇 Commander',
        diff_3_days: '28 Days',
        diff_3_desc: '14 days of night at -173°C, endurance marathon.',
        label_ui_theme: '🎨 UI Visual Style:',
        label_site_lang: '🌐 Language / Idioma:',
        theme_default_title: 'Classic Sci-Fi',
        theme_default_sub: 'Futuristic & Clean',
        theme_pop_title: 'Pop-Art Comic',
        theme_pop_sub: 'Ink & Halftone',
        theme_retro_title: 'Graphic Novel',
        theme_retro_sub: '70s Pulp Classic',
        theme_badge_base: 'Base',
        theme_badge_pop: 'Action!',
        theme_badge_retro: 'Vintage',
        btn_start_mission: '🚀 TAKE COMMAND',
        ai_badge_img: 'AI Generated',
        ai_badge_img_short: 'AI',
        ai_audio_note: 'AI-generated narrated audio (Voice synthesis / Web Speech API).',
        modal_voice_note: '🔊 Audio and voices generated with Artificial Intelligence (Web Speech API).',
        welcome_ai_note: '🤖 AI Usage Disclosure: Code and web structure developed with Gemini and Claude assistance (Antigravity). AstroCan illustrations and voice narration generated with AI.',

        // Sidebar & HUD
        mascot_role: 'Mission Co-Pilot',
        mascot_online_status: 'Base systems online! Standing by for your orders, Commander.',
        telemetry_title: '📡 Base Telemetry',
        res_o2: '💨 Oxygen:',
        res_energy: '⚡ Batteries:',
        res_health: '❤️ Health:',
        res_integrity: '🛡️ Hull:',
        res_science: '🔬 Science:',
        res_science_pts: 'pts',
        btn_sidebar_theme: '🎨 UI Style:',
        btn_sidebar_voice: '🎙️ Change Voice',
        btn_sidebar_science: '🔬 NASA Science Archive',
        btn_sidebar_sound_on: '🔊 Sound',
        btn_sidebar_sound_off: '🔇 Mute',
        btn_sidebar_abort: '🛑 Abort Mission',
        btn_sidebar_lang: '🌐 Language: English',

        // Top Bar
        day_prefix: 'Day',
        btn_top_abort: '🛑 Abort',
        btn_top_abort_title: 'Return to mission briefing',
        btn_top_science: '🔬 NASA Archive',
        btn_top_voice_title: 'Change narration voice',
        btn_top_theme_title: 'Change UI visual style',
        btn_top_lang_title: 'Cambiar idioma / Switch language',
        env_phase_default: 'Solar Day',

        // Dilemma Card
        dilemma_tag_default: 'ALERT',
        dilemma_sender_default: '📡 Mission Control Transmission',
        btn_change_voice_label: 'Voice: Auto',
        btn_listen_mission: '📢 Listen Mission',
        btn_stop_voice: '⏹️ Stop Voice',
        btn_listen_option: '🔊 Listen Option',
        btn_stop_option: '⏹️ Stop',
        btn_choose_option: 'Choose this option',
        source_verified: 'VERIFIED BY NASA',
        source_live: 'LIVE API DATA',
        source_historic: 'HISTORICAL ARCHIVE',
        source_study: 'SCIENTIFIC STUDY',
        source_label: 'Official Source:',
        science_context_label: '💡 Scientific insight:',
        gain_label: 'Benefit:',
        cost_label: 'Trade-off Cost:',
        option_prefix: 'Option',
        action_prefix: 'Action:',

        // Mission Report (Transmission)
        transmission_title: '📻 Mission Control Report',
        btn_next_day: '☀️ ADVANCE TO NEXT DAY',
        table_resource: 'Resource',
        table_before: 'Before',
        table_order: 'Your Order',
        table_after: 'Now',
        decay_summary_title: 'Daily Survival Consumption',
        decay_summary_desc: 'Crew metabolism, thermal heating, and regolith abrasion.',

        // End of Mission (Victory / Defeat)
        victory_title: '🎉 MISSION ACCOMPLISHED!',
        victory_subtitle: 'You successfully maintained the lunar base, demonstrating mastery over real trade-offs.',
        defeat_title: '⚠️ MISSION EVACUATED',
        defeat_subtitle: 'Vital supplies dropped to zero. The crew was forced to evacuate back to Earth.',
        stat_score: 'SCORE',
        stat_days: 'DAYS',
        stat_science: 'SCIENCE',
        btn_share_cert: '📤 SHARE CERTIFICATE',
        btn_restart: '🔄 NEW MISSION',
        rank_cadet: 'Space Cadet',
        rank_specialist: 'ORBITA5 Science Officer',
        rank_commander: 'Lunar Commander',
        rank_supreme: 'Supreme Lunar Commander',
        rank_trainee: 'Trainee Aspirant',

        // Modals
        modal_close: 'Close',
        modal_science_title: '🔬 NASA Science Archive',
        modal_abort_title: '🛑 Abort ORBITA5 Mission',
        modal_abort_prompt: 'Are you sure you want to abort the lunar mission?',
        modal_abort_desc: 'The current simulation will be cancelled and you will return to the briefing screen to change your name or select another difficulty.',
        modal_abort_confirm: '🚀 Yes, Abort and Exit',
        modal_abort_cancel: 'Continue Mission',

        modal_voice_title: '🎙️ Mission Control Voices',
        modal_voice_desc: 'Select your preferred voice synthesis to hear alerts and options at your lunar base:',
        modal_voice_active: 'Active voice:',
        modal_voice_cycle: '🔄 Quick Next Voice',
        modal_voice_done: 'Done',
        modal_voice_preview: '▶️ Preview',
        modal_voice_select: 'Select',
        modal_voice_selected: '✓ Active',

        modal_theme_title: '🎨 UI Visual Style',
        modal_theme_desc: 'Choose how you want to experience ORBITA5. Freely switch between clean Sci-Fi and our vibrant Comic proposals:',
        modal_theme_cycle: '🔄 Quick Theme Toggle',
        modal_theme_done: 'Done',
        modal_theme_active: '✓ Active',
        modal_theme_activate: 'Apply Style',

        // Certificate Canvas
        cert_mission_victory: 'MISSION ACCOMPLISHED',
        cert_mission_defeat: 'MISSION EVACUATED',
        cert_sub: 'ORBITA5: LUNAR COMMANDER',
        cert_stat_score: 'FINAL SCORE',
        cert_stat_days: 'DAYS SURVIVED',
        cert_stat_science: 'SCIENCE PRODUCED',
        cert_victory_msg1: 'You demonstrated a deep understanding of real survival trade-offs',
        cert_victory_msg2: 'in deep space exploration. Future Mars astronaut!',
        cert_defeat_msg1: 'You learned that in deep space every single resource is vital.',
        cert_defeat_msg2: 'Try again and refine your resource allocation strategy!',
        cert_generated_on: 'Certificate generated on',
        cert_footer_brand: 'ORBITA5 — Lunar Survival Simulator',
        cert_share_title_win: '🏆 Mission Accomplished! — ORBITA5',
        cert_share_title_loss: '⚠️ Mission Evacuated — ORBITA5',
        cert_share_text: '{name} completed a {days}-day lunar mission with {science} science points in ORBITA5. Can you beat this score? 🚀',

        // Speech Narrator
        speech_mission_intro: 'Mission Control Transmission.',
        speech_mission_science: 'NASA Scientific Insight:',
        speech_mission_cta: 'Commander, review your options to make a decision.',
        speech_option_intro: 'Option {letter}: {title}.',
        speech_option_action: 'Action: {action}.',
        speech_option_gain: 'Benefit: {gain}.',
        speech_option_cost: 'Cost or trade-off: {cost}.',
        speech_preview_phrase: 'Hello, Commander! This is a voice synthesis test for your ORBITA5 lunar mission.',
        speech_switch_phrase: 'Switching to English voice: {name}.',

        // AstroCan Mascot Dialogues
        mascot_greeting: 'Hello, Commander! Ready for the lunar mission.',
        mascot_thinking: 'Hmm... in deep space no decision is free. What should we prioritize?',
        mascot_scared: 'Watch out, Commander! Solar radiation or a critical failure threatens our habitat!',
        mascot_worried: 'Oof... that sacrifice cost us dearly. We need to watch our reserves closely.',
        mascot_relaxed: 'Outstanding maneuver! Systems are stable and we can proceed safely.',
        mascot_celebrating: 'Yesss! A historic scientific breakthrough and the crew is safe!',
        mascot_crying: 'Oh no! Reserves hit zero... activating emergency escape capsule!',
        mascot_need_name: 'Commander! I need to register your name on the flight manifest before you take command.',
        mascot_start_mission: 'Commander {name}, base command transferred to you! Let\'s manage resources wisely.',
        mascot_solar_alert: 'DONKI solar storm alert! High-energy solar protons heading towards the crater!',
        mascot_bio_alert: 'A NASA biological study... should we sacrifice oxygen or energy for science?',
        mascot_geo_alert: 'Shackleton crater ice is pure gold for our outpost! Let\'s weigh the risks.',

        // Minigames
        minigame_shield_title: 'Power Diversion & Solar Shield',
        minigame_shield_alarm: 'DONKI SOLAR STORM IN PROGRESS!',
        minigame_shield_instruct: 'Adjust the 3 power sliders toward the electromagnetic shield before proton impact.',
        minigame_shield_btn: 'STABILIZE SHIELD',
        minigame_rover_title: 'Shackleton Crater Exploration',
        minigame_rover_instruct: 'Drive the rover with arrow keys or touch controls to harvest water ice without hitting sharp rocks.',
        minigame_rover_btn: 'RETURN TO BASE',

        // Environmental Phases
        phase_polar_dawn: 'Lunar Polar Dawn',
        phase_solar_day: 'Full Solar Day',
        phase_polar_twilight: 'Polar Twilight',
        phase_lunar_night: 'Extreme Lunar Night (-173°C)',
        phase_trans_night: 'Transition to Polar Night',
        phase_polar_sunrise: 'Polar Sunrise',

        // ====================================================================
        // JUNIOR ADVENTURE MODE (AGES 7–9)
        // ====================================================================
        btn_junior_mode: '🎮 JUNIOR ADVENTURE MODE (AGES 7–9)',
        btn_junior_mode_sub: 'Drive with AstroCan, dodge obstacles, and learn with voice!',
        btn_tactical_mode: '🚀 MISSION COMMAND SIMULATOR (AGES 10–12)',
        btn_tactical_mode_sub: 'Make strategic decisions and manage survival trade-offs',

        junior_arcade_title: 'Junior Moon Expedition with AstroCan',
        junior_arcade_subtitle: 'Dodge space boulders, gather oxygen & energy, and complete all 5 days!',
        junior_day_label: 'Day',
        junior_day_of_total: 'Day {day} of {total}',
        junior_day_progress: 'Day Progress',
        junior_res_o2: 'Oxygen',
        junior_res_energy: 'Batteries',
        junior_res_hull: 'Hull',
        junior_res_science: 'Samples',
        junior_audio_active: '🔊 NASA Voice: Active',
        junior_audio_muted: '🔇 NASA Voice: Muted',
        junior_voice_btn: 'Voice: {name}',
        junior_broadcast_badge: '📡 NASA SCIENCE BROADCAST',
        junior_broadcast_live: '● LIVE',
        junior_broadcast_skip: 'Continue now',
        junior_btn_listen_again: '📢 Listen Again',
        junior_btn_next_day: '👉 PROCEED TO NEXT DAY',
        junior_btn_finish: '🎉 VIEW EXPLORER DIPLOMA!',
        junior_btn_restart: '🔄 Retry Expedition',
        junior_btn_home: '🏠 Return to Mission Hub',
        junior_controls_hint: 'Use arrow keys ◀ ▶ or on-screen buttons to drive, and 🚀 to jump',
        junior_touch_left: '◀ LEFT',
        junior_touch_right: 'RIGHT ▶',
        junior_touch_jump: '🚀 JUMP',

        // 5-Day Science Facts (Educational / Ages 7-9)
        junior_fact_1_title: 'The Giraffe Leap on the Moon!',
        junior_fact_1_body: 'Did you know you weigh 6 times less on the Moon than on Earth? If you can jump 1 meter on Earth, on the Moon you would soar as high as a giraffe! That is why Apollo astronauts bounced around doing kangaroo hops.',
        junior_fact_1_tag: 'Real NASA Science: Lunar Gravity (1/6 g)',

        junior_fact_2_title: 'Space Dust Like Tiny Crystals!',
        junior_fact_2_body: 'The Moon is blanketed in a dust called regolith. On Earth, rain and wind smooth sand over time, but on the airless Moon the grains stay sharp like microscopic shards of glass that cling to spacesuits!',
        junior_fact_2_tag: 'Real NASA Science: Lunar Regolith (Artemis Mission)',

        junior_fact_3_title: 'Secret Ice Inside Shackleton Crater!',
        junior_fact_3_body: 'At the Lunar South Pole, deep crater floors never see sunlight and stay freezing at -230°C. NASA\'s LCROSS mission proved that millions of tons of pure water ice are hidden right in those shadows!',
        junior_fact_3_tag: 'Real NASA Science: LCROSS & LRO Probes',

        junior_fact_4_title: 'A Giant Oven by Day, A Freezer by Night!',
        junior_fact_4_body: 'Because the Moon lacks an atmosphere like Earth to insulate it, direct sunlight heats the rocks to +120°C (hotter than boiling water!). Once the sun sets, temperatures plunge to -130°C. That is why our habitat needs energy to stay warm!',
        junior_fact_4_tag: 'Real NASA Science: Lunar Thermophysics (LRO Diviner)',

        junior_fact_5_title: 'Mission Accomplished, Junior Astronaut!',
        junior_fact_5_body: 'Outstanding work! You survived all 5 lunar days exploring the South Pole. Thanks to the water ice crystals and minerals you collected driving with AstroCan, our NASA outpost has drinking water, oxygen, and rocket fuel!',
        junior_fact_5_tag: 'Real NASA Science: Artemis Human Landing System',

        junior_victory_title: '🎉 JUNIOR EXPEDITION COMPLETE!',
        junior_victory_sub: 'You bravely completed all 5 lunar days exploring with AstroCan!',
        junior_depleted_title: '⚠️ Supplies Depleted!',
        junior_depleted_sub: 'You were so close! In space exploration every attempt teaches us something new. Let\'s recharge the rover and try again together!',
        junior_btn_retry_day: '🔄 Retry this Day',
        junior_badge_explorer: '🏅 Junior Lunar Explorer Medal'
      }
    };

    // Diccionario de eventos traducidos al inglés
    this.eventsEn = {
      EV_DONKI_SOLAR_STORM: {
        tag: 'DONKI SOLAR ALERT',
        title: 'Solar Storm Detected!',
        sender: 'NASA Space Weather Center (SWPC / DONKI)',
        description: 'A Coronal Mass Ejection (CME) is racing at high velocity toward the lunar south pole. Without Earth\'s magnetosphere, high-energy protons will hit the outpost.',
        scientificContext: 'On Earth, the geomagnetic field deflects these particles creating auroras. On the Moon, astronauts rely on regolith bunkers and active electromagnetic shields.',
        dataSource: {
          name: 'NASA DONKI (Space Weather Database)',
          detail: 'Telemetry from SDO, SOHO, STEREO, and ACE heliospheric fleet'
        },
        options: [
          {
            title: 'Reinforce Shield to 100%',
            actionText: 'Divert power from thermal heaters to the electromagnetic shield.',
            gainText: '+10 Science, Health protected (0 damage)',
            costText: '-28% Energy (base will endure extreme cold)',
            feedback: 'Crew safely shielded in the bunker! The magnetic shield deflected the solar protons, but batteries drained heavily (-28% Energy).'
          },
          {
            title: 'Passive Shelter (Save Energy)',
            actionText: 'Keep heaters running; crew will wear water-jacket vests in sleep quarters.',
            gainText: 'Energy conserved for the polar night',
            costText: '-22% Health (radiation dosage)',
            feedback: 'Power preserved, but personal dosimeters recorded ionizing radiation doses across the crew (-22% Health).'
          },
          {
            title: '🎮 Calibrate Shield Manually',
            actionText: 'Minigame: adjust energy sliders against the clock.',
            gainText: 'Balance outcome based on your skill',
            costText: 'High risk if you take too long',
            feedback: 'Initiating emergency energy diversion protocol...'
          }
        ]
      },

      EV_OSDR_PLANT_O2: {
        tag: 'OSDR BIO-LAB',
        title: 'Lunar Greenhouse Dilemma',
        sender: 'Space Biology Lab (Kennedy Space Center)',
        description: 'Arabidopsis thaliana seeds germinated in lunar regolith, but are experiencing severe oxidative stress and require an emergency injection of pure O2 and distilled water.',
        scientificContext: 'OSD-379: In 2022, NASA successfully grew plants in Apollo 11, 12, and 17 lunar regolith for the first time. They survive, but with stress genes heavily triggered.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-379',
          detail: 'Arabidopsis thaliana growth in authentic Apollo lunar regolith'
        },
        options: [
          {
            title: 'Sacrifice O2 for the Crops',
            actionText: 'Open reserve valves to supply the plant bio-chamber.',
            gainText: '+45 Science (botanical breakthrough)',
            costText: '-18% Crew Oxygen',
            feedback: 'Plants blossomed in lunar soil! Invaluable data for permanent bases, but astronauts must ration breathing air (-18% O2).'
          },
          {
            title: 'Prioritize Human Air',
            actionText: 'Shut down the greenhouse chamber and seal the main tanks.',
            gainText: 'Oxygen 100% preserved',
            costText: '0 Science (experimental crop lost)',
            feedback: 'Crew safety is priority one. Oxygen tanks are secure, though the experimental crops could not be saved.'
          }
        ]
      },

      EV_ICE_MINING_EXPEDITION: {
        tag: 'POLAR LUNAR GEOLOGY',
        title: 'Shackleton Crater Expedition',
        sender: 'Robotic Exploration Engineering',
        description: 'The crater floor harbors water ice trapped at -230°C in permanent darkness. We urgently need that ice to extract drinking water and split it into breathable oxygen.',
        scientificContext: 'NASA\'s LCROSS impactor confirmed 5.5% water ice locked inside permanently shadowed craters at the lunar south pole.',
        dataSource: {
          name: 'NASA LCROSS & Lunar Reconnaissance Orbiter (LRO)',
          detail: 'Spectral confirmation of water ice in Permanently Shadowed Regions (PSRs)'
        },
        options: [
          {
            title: '🎮 Drive the Mining Rover',
            actionText: 'Minigame: descend into the crater and collect ice while dodging boulders.',
            gainText: 'Up to +40% O2 depending on harvested ice',
            costText: 'Battery and chassis under severe thermal stress',
            feedback: 'Deploying Polar Mining Rover into Shackleton Crater...'
          },
          {
            title: 'Ration Water via ECLSS Recycler',
            actionText: 'Do not deploy the rover; push water recycling filters to their limit.',
            gainText: 'Rover safe in the hangar',
            costText: '-14% Health (strict water rationing)',
            feedback: 'Vehicle secured, but the crew must restrict water consumption and sponge bathe (-14% Health).'
          }
        ]
      },

      EV_OSDR_BONE_EXERCISE: {
        tag: 'OSDR SPACE MEDICINE',
        title: 'Bone Demineralization Alert (1/6 g)',
        sender: 'Space Flight Medicine (JSC Houston)',
        description: 'The Moon\'s weak gravity exerts minimal resistance on the human skeleton. Astronauts are losing calcium and leg muscle mass faster than anticipated.',
        scientificContext: 'OSD-120: In reduced gravity, osteoclasts break down bone tissue faster than osteoblasts can rebuild it. At least 2.5 hours of daily resistive exercise is mandatory.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-120',
          detail: 'Bone and muscle density degradation under microgravity (Rodent Research)'
        },
        options: [
          {
            title: 'Mandatory Resistance Exercise',
            actionText: 'All crew members train for 2.5 continuous hours on bungee harnesses.',
            gainText: '+22% Health, +15 Science',
            costText: '-14% O2 (elevated metabolic respiration)',
            feedback: 'Bones and muscles strengthened! However, heavy breathing burdened the air scrubbers (-14% O2).'
          },
          {
            title: 'Suspend Exercise (Save Air)',
            actionText: 'Static rest to keep metabolic heart rate minimal.',
            gainText: 'Oxygen 100% conserved',
            costText: '-20% Health (muscle atrophy)',
            feedback: 'Oxygen conserved, but astronauts report joint stiffness and muscle weakness (-20% Health).'
          }
        ]
      },

      EV_REGOLITH_DUST_CLOG: {
        tag: 'LUNAR ENGINEERING',
        title: 'Regolith Dust in Airway Hatches',
        sender: 'Habitat Hermeticity Sensors',
        description: 'Lunar dust has no wind erosion: it consists of razor-sharp, electrostatically charged glassy shards clinging to the outer airlock rubber seals.',
        scientificContext: 'Apollo astronauts reported that lunar dust tore through space suits and caused acute respiratory irritation (lunar hay fever).',
        dataSource: {
          name: 'NASA Lunar Dust & Electrodynamic Dust Shield (EDS)',
          detail: 'Apollo lessons learned & electrodynamic dust removal technology'
        },
        options: [
          {
            title: 'Activate EDS Electrodynamic Shield',
            actionText: 'Fire high-voltage pulses across seals to repel charged dust.',
            gainText: '+20% Hull Integrity (perfect seal)',
            costText: '-16% Electrical Energy',
            feedback: 'Airlock seals 100% cleared! Electrostatic waves blasted dust shards away, consuming 16% battery power.'
          },
          {
            title: 'Manual Brushing',
            actionText: 'Brush airlocks by hand to avoid power expenditure.',
            gainText: '0% power consumption',
            costText: '-14% Integrity, -10% Health (dust in cabin)',
            feedback: 'Power saved, but abrasive dust scratched the vacuum gaskets and infiltrated the air ducts, irritating crew eyes.'
          }
        ]
      },

      EV_OSDR_CIRCADIAN_RHYTHM: {
        tag: 'OSDR PSYCHOLOGY',
        title: 'Insomnia: Circadian Disruption',
        sender: 'Human Biometric Monitors',
        description: 'At the lunar south pole, the sun skims horizontally across the horizon. Without Earth\'s 24-hour day/night cycle, crew brains cease producing melatonin, causing extreme fatigue.',
        scientificContext: 'OSD-244: Blue daytime light stimulates alertness; amber light triggers deep sleep. Without synchronized spectral lighting, operational error rates skyrocket.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-244',
          detail: 'Circadian rhythms & sleep architecture in closed habitats (HERA & CHAPEA)'
        },
        options: [
          {
            title: 'LED Earth-Cycle Simulation',
            actionText: 'Program dynamic spectral circadian lighting in crew quarters.',
            gainText: '+20% Health, +15 Science',
            costText: '-15% Energy (continuous lighting)',
            feedback: 'Deep restorative sleep achieved! Crew focus restored to 100% at the cost of 15% night battery power.'
          },
          {
            title: 'Kill All Lights (Battery Saver)',
            actionText: 'Total darkness to conserve every single watt.',
            gainText: '+15% Energy conserved',
            costText: '-18% Health (anxiety and disorientation)',
            feedback: 'Batteries shielded, but sleep deprivation caused headaches and operational vertigo (-18% Health).'
          }
        ]
      },

      EV_OSDR_MICROBIOME_WATER: {
        tag: 'OSDR LIFE SUPPORT',
        title: 'Biofilms in ECLSS Water Lines',
        sender: 'Water Quality Sensor (Marshall SFC)',
        description: 'Bacteria from the human microbiome have formed slimy biofilms inside the urine-distillation and moisture-condensate pipes. Potable water tests show bacterial traces.',
        scientificContext: 'OSD-612: Closed-loop water recovery systems require 85°C thermal pasteurization cycles to purge resistant bacterial matrix films.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-612',
          detail: 'Bacterial biofilms in regenerative life-support water processors'
        },
        options: [
          {
            title: '85°C Thermal Purge with Catalytic Filter',
            actionText: 'Boil and sanitize the entire plumbing loop.',
            gainText: '+20% Health, +12 Science',
            costText: '-18% Electrical Energy',
            feedback: 'Water is 100% pure and microbe-free! Crew drinks with complete confidence (-18% Energy).'
          },
          {
            title: 'Cold Passive Carbon Filtration',
            actionText: 'Keep pipes cold to avoid burning power.',
            gainText: 'Power reserves untouched',
            costText: '-16% Health (bacterial contamination)',
            feedback: 'Power intact, but two astronauts developed stomach cramps from microbial buildup in drinking water (-16% Health).'
          }
        ]
      },

      EV_OSDR_SANS_VISION: {
        tag: 'OSDR OPHTHALMOLOGY',
        title: 'Blurred Vision: SANS Syndrome',
        sender: 'Ocular Health Lab (JSC Houston)',
        description: 'Headward fluid shift in low gravity exerts persistent pressure on the posterior eyeballs. The lunar pilot reports blurred vision on instrument navigation screens.',
        scientificContext: 'OSD-477: In microgravity, optic nerve sheath swelling (papilledema) alters eye geometry. NASA evaluates lower-body negative pressure devices to pull fluids downward.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-477',
          detail: 'Spaceflight Associated Neuro-ocular Syndrome (SANS) & visual acuity'
        },
        options: [
          {
            title: 'Negative Pressure Chibis Pants',
            actionText: 'Apply lower-body vacuum suction for 2 hours daily to redistribute fluids.',
            gainText: '+18% Visual Health, +20 Science',
            costText: '-12% Energy for pneumatic pumps',
            feedback: 'Vision restored! Ocular pressure dropped back to safe thresholds and the pilot read descent charts with razor-sharp clarity (-12% Energy).'
          },
          {
            title: 'Temporary Corrective Glasses',
            actionText: 'Adjust lens prescription without turning on pumps.',
            gainText: 'Zero energy expenditure',
            costText: '-18% Crew Health',
            feedback: 'Glasses provide temporary relief, but persistent optic nerve swelling triggers chronic morning headaches (-18% Health).'
          }
        ]
      },

      EV_OSDR_RADIATION_HEART: {
        tag: 'OSDR RADIOBIOLOGY',
        title: 'Galactic Heavy Iron Ions (HZE)',
        sender: 'Space Radiation Lab (Brookhaven / NSRL)',
        description: 'Galactic cosmic ray detectors registered heavy iron ions piercing the habitat. These rays originate not from the Sun, but from distant deep-space supernova explosions.',
        scientificContext: 'OSD-313: High-energy iron nuclei fracture cardiovascular endothelial DNA. Hydrogen-rich materials (such as water tanks along outer walls) provide the best defense.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-313',
          detail: 'Cardiovascular effects of galactic iron ions (Brookhaven NSRL)'
        },
        options: [
          {
            title: 'Reconfigure Water Tanks as Shielding',
            actionText: 'Pump water reserves into perimeter bulkheads.',
            gainText: '+22% Health protected, +15 Science',
            costText: '-16% Mobilized Oxygen/Water',
            feedback: 'Hydrogen shield activated! Heavy ions collided with water molecules and stalled safely without harming the crew (-16% O2/Water).'
          },
          {
            title: 'Rely on Outer Aluminum Walls',
            actionText: 'Do not reconfigure base hydraulic distribution.',
            gainText: 'Tank plumbing left undisturbed',
            costText: '-22% Cellular Health',
            feedback: 'Lightweight aluminum walls failed to stop heavy cosmic rays. Dosimeters registered cellular micro-damage across the crew (-22% Health).'
          }
        ]
      },

      EV_LRO_VIPER_MAPPING: {
        tag: 'LUNAR CARTOGRAPHY',
        title: 'Neutron Hydrogen Mapping on Malapert',
        sender: 'LRO Science Team (Diviner & LEND)',
        description: 'Orbital satellite LRO detected an epithermal neutron anomaly: an unmistakable signature of high hydrogen concentrations right beneath the lunar regolith.',
        scientificContext: 'LRO\'s LEND instrument detects reflected neutrons to build subsurface water maps that will guide Artemis and lunar base explorers.',
        dataSource: {
          name: 'NASA Lunar Reconnaissance Orbiter (LEND & Diviner)',
          detail: 'Hydrogen detection & thermal mapping of polar craters'
        },
        options: [
          {
            title: 'Deep Core Robotic Drill',
            actionText: 'Deploy robotic drill along the illuminated ridge.',
            gainText: '+50 Science, +15% O2 discovered',
            costText: '-20% Habitat Electrical Power',
            feedback: 'Extraordinary discovery! The core drill extracted lunar soil containing 8% trapped ice. Crucial science and air supplies secured (-20% Battery).'
          },
          {
            title: 'Orbital Passive Mapping Only',
            actionText: 'Record satellite telemetry without powering the surface drill.',
            gainText: '+15 Pure Science',
            costText: 'Zero battery expenditure',
            feedback: 'Orbital data safely archived in the flight computer without spending a single kilowatt from base batteries.'
          }
        ]
      },

      EV_OSDR_FOOD_VITAMINS: {
        tag: 'OSDR NUTRITION',
        title: 'Vitamin Degradation in Food Packs',
        sender: 'Space Food Systems Lab (JSC Houston)',
        description: 'Space radiation and prolonged storage have degraded Vitamins C and B1 in freeze-dried meal pouches, threatening crew health.',
        scientificContext: 'OSD-578: In deep space, vitamins degrade 40% faster than on Earth. Without fresh micronutrients, astronauts suffer fatigue and compromised immunity.',
        dataSource: {
          name: 'NASA OSDR — Study OSD-578',
          detail: 'Nutritional degradation and vitamin stability in long-duration space storage'
        },
        options: [
          {
            title: 'Activate Hydroponic Microgreen Garden',
            actionText: 'Sprout fresh radish and lettuce rich in bioavailable Vitamin C.',
            gainText: '+24% Health, +25 Science',
            costText: '-14% Energy, -10% O2',
            feedback: 'Fresh, crisp food! The crew regained vigor and morale from live, newly harvested micronutrients.'
          },
          {
            title: 'Consume Standard Salted Rations',
            actionText: 'Do not spend habitat resources on the indoor garden.',
            gainText: 'Energy and O2 100% conserved',
            costText: '-16% Health (nutritional fatigue)',
            feedback: 'Resources untouched, but monotonous rations and vitamin deficiency led to fatigue and weakened immunity (-16% Health).'
          }
        ]
      },

      EV_APOLLO_SEISMIC_SHOCK: {
        tag: 'LUNAR SEISMOLOGY',
        title: 'Deep Moonquake Alert',
        sender: 'Lunar Seismic Network (Apollo Heritage)',
        description: 'Earth\'s gravitational tidal pull is warping the Moon\'s mantle, triggering a magnitude 4.8 moonquake that will rumble for more than 10 continuous minutes.',
        scientificContext: 'Unlike brief terrestrial quakes, moonquakes vibrate like a tuning bell for hours because lunar bedrock is dry, rigid, and cold.',
        dataSource: {
          name: 'NASA Apollo Passive Seismic Experiment',
          detail: 'Lunar seismology & tidal stress caused by Earth\'s gravity'
        },
        options: [
          {
            title: 'Pressurize Habitat Hydraulic Dampers',
            actionText: 'Extend telescopic shock-absorbing legs beneath base domes.',
            gainText: '+22% Structural Hull Integrity, +20 Science',
            costText: '-18% Energy for hydraulic pumps',
            feedback: 'Base remained rock solid! Telescopic dampers absorbed ground shockwaves like an earthquake-proof skyscraper (-18% Energy).'
          },
          {
            title: 'Lash Down Equipment Manually',
            actionText: 'Tie down racks and consoles without engaging active dampers.',
            gainText: 'Batteries protected',
            costText: '-20% Integrity (micro-fractures in dome)',
            feedback: 'Power saved, but 15 minutes of uninterrupted vibrations shook structural bolts loose in the bio-lab (-20% Integrity).'
          }
        ]
      },

      EV_LUNAR_NIGHTFALL: {
        tag: 'EXTREME SURVIVAL',
        title: 'Sunset: Lunar Polar Night Begins',
        sender: 'Houston Mission Control',
        description: 'The Sun has dipped below the crater rim. 354 hours of frigid darkness at -173°C begin. Solar arrays generate zero watts. How will you budget fuel cells?',
        scientificContext: 'Surviving the lunar night is human space exploration\'s greatest thermal hurdle, requiring regenerative fuel cells or compact surface nuclear fission.',
        dataSource: {
          name: 'NASA Human Lunar Architecture — Lunar Night Survival',
          detail: 'Thermal survival challenge across 354 hours of continuous darkness'
        },
        options: [
          {
            title: 'Cryogenic Survival Mode (Power Down Labs)',
            actionText: 'Divert all heating power exclusively to crew sleeping quarters.',
            gainText: '+5% Health (crew kept warm)',
            costText: '-20 Science (frozen bio-experiments)',
            feedback: 'Prudent decision. Astronauts safe and warm, at the expense of pausing scientific research.'
          },
          {
            title: 'Full Base Operations on Emergency Cells',
            actionText: 'Keep all science laboratories heated and running.',
            gainText: '+30 Science breakthrough',
            costText: '-25% Critical Battery Energy',
            feedback: 'Scientific triumph under the polar night, but fuel cell reserves are now dangerously close to empty.'
          }
        ]
      }
    };
  }

  loadSavedLanguage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.storageKey);
        if (saved && this.languages.includes(saved)) {
          return saved;
        }
      }
    } catch (e) {
      console.warn('[I18n] Error leyendo idioma de localStorage:', e);
    }
    return 'en';
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (!this.languages.includes(lang)) return;
    this.currentLang = lang;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, lang);
      }
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang;
      }
    } catch (e) {}

    this.notifyListeners(lang);
  }

  toggleLanguage() {
    const next = this.currentLang === 'es' ? 'en' : 'es';
    this.setLanguage(next);
    return next;
  }

  t(key, params = {}) {
    const dict = this.translations[this.currentLang] || this.translations.es;
    let text = dict[key] || this.translations.es[key] || key;

    for (const [pKey, pVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), pVal);
    }
    return text;
  }

  /**
   * Localiza un objeto de evento según el idioma actual
   */
  localizeEvent(event) {
    if (!event) return event;
    if (this.currentLang === 'es') return event;

    const enData = this.eventsEn[event.id];
    if (!enData) return event;

    // Clonar para no mutar destructivamente el original
    const localized = { ...event };
    if (enData.tag) localized.tag = enData.tag;
    if (enData.title) localized.title = enData.title;
    if (enData.sender) localized.sender = enData.sender;
    if (enData.description) localized.description = enData.description;
    if (enData.scientificContext) localized.scientificContext = enData.scientificContext;

    if (enData.dataSource) {
      localized.dataSource = {
        ...event.dataSource,
        name: enData.dataSource.name || event.dataSource?.name,
        detail: enData.dataSource.detail || event.dataSource?.detail
      };
    }

    if (Array.isArray(event.options) && Array.isArray(enData.options)) {
      localized.options = event.options.map((opt, idx) => {
        const enOpt = enData.options[idx];
        if (!enOpt) return opt;
        return {
          ...opt,
          title: enOpt.title || opt.title,
          actionText: enOpt.actionText || opt.actionText,
          gainText: enOpt.gainText || opt.gainText,
          costText: enOpt.costText || opt.costText,
          feedback: enOpt.feedback || opt.feedback
        };
      });
    }

    return localized;
  }

  onLanguageChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notifyListeners(lang) {
    this.listeners.forEach(fn => {
      try {
        fn(lang);
      } catch (err) {
        console.error('[I18n] Error en callback de idioma:', err);
      }
    });
  }
}

// Instancia global
window.i18n = new I18nManager();
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = window.i18n.getLanguage();
}
