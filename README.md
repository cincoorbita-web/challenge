# 🚀 ARTEMIS CHALLENGE: Comandante Lunar
### Junior Astronaut Mission Trainer | NASA International Space Apps Challenge

**ARTEMIS CHALLENGE: Comandante Lunar** es una aplicación interactiva y videojuego web educativo diseñado para niños de entre 7 y 12 años. Su objetivo es transmitir de forma clara, visual y emocionante las verdaderas restricciones de la supervivencia en el espacio profundo y la toma de decisiones basada en **compensaciones reales (trade-offs)**.

El juego está desarrollado con tecnologías web modernas estándar (HTML5, CSS3, JavaScript modular, Canvas 2D, Web Audio API y Web Speech API), funcionando al 100% en el cliente y de manera autónoma (incluso sin conexión a internet ni dependencias externas).

---

## 🎨 Tipografía Fredoka y Semáforo de Recursos en Tiempo Real

- **Tipografía Amigable y Moderna (Fredoka):** La interfaz utiliza la fuente redondeada *Fredoka* (Google Fonts), diseñada para brindar máxima legibilidad, calidez y un tono lúdico adecuado para niños de 7 a 12 años.
- **Semáforo de Recursos Dinámico (Textos y Telemetría):** Los valores numéricos de los recursos cambian de color en tiempo real según el porcentaje disponible:
  - 🟢 **Verde Óptimo (`> 50%`):** Sistemas estables y seguros.
  - 🟡 **Ámbar / Precaución (`26% – 50%`):** Alerta preventiva; el recurso está descendiendo.
  - 🔴 **Rojo Crítico (`≤ 25%`):** Emergencia vital con pulso visual activo; peligro inminente de evacuación.

---

## 🐶 AstroCan: Mascota y Copiloto Reactivo con Emociones

Para generar un lazo empático inmediato con niños de 7 a 12 años, la expedición cuenta con **AstroCan**, un adorable cachorro astronauta (con escafandra y parche de mate espacial) que reacciona visualmente y con mensajes de diálogo a las decisiones del jugador a través de **7 estados emocionales**:

1. **`greeting` (Saludando contento):** Recibe al astronauta en la pantalla de bienvenida y al inicio de la jornada ("¡Hola, Comandante! Listo para la misión").
2. **`thinking` (Pensativo con dedito en la barbilla):** Se activa cuando llega un nuevo dilema o transmisión de la NASA para invitar al niño a evaluar las opciones con calma.
3. **`scared` (Asustado con patas en las mejillas):** Reacciona ante una alerta de tormenta solar DONKI o cuando un recurso vital cae a niveles críticos (≤ 20%).
4. **`worried` (Preocupado y cabizbajo):** Aparece cuando una orden exigió un alto sacrificio en energía o salud.
5. **`relaxed` (Tranquilo y sonriente):** Indica que las reservas de la base están estables y todo marcha bajo control.
6. **`celebrating` (Saltando de alegría):** Celebra grandes hallazgos científicos (+ciencia), éxito en minijuegos o la victoria final de la misión.
7. **`crying` (Llorando con lágrimas):** Refleja la evacuación de emergencia si un recurso vital se agota a cero, consolando al niño y motivándolo a intentarlo de nuevo.

---

## 📢 Accesibilidad, Narración por Voz y Selector de Voces (Web Speech API)

Pensando en la autonomía del niño y evitando saturarlo con párrafos largos:
- **Botón `📢 Escuchar Misión`:** Lee exclusivamente la transmisión de Control de Misión, la situación del hábitat y el dato científico oficial de la NASA.
- **Botón `🔊 Escuchar Opción` (en cada tarjeta de decisión):** Permite al jugador escuchar por separado cada alternativa (su acción, ganancia y costo) únicamente cuando él lo desee.
- **Botón `🎙️ Selector y Cambio de Voz`:** Permite alternar entre los diferentes tipos de voces instalados en el navegador y sistema operativo (macOS, Windows, Android, iOS):
  - **Identificación con Banderas y Regiones:** Muestra el nombre limpio y la procedencia (ej: 🇲🇽 México, 🇦🇷 Argentina, 🇨🇴 Colombia, 🇪🇸 España, 🇺🇸 EE.UU., 🌎 Latinoamérica).
  - **Modal Interactivo:** Permite ver la lista completa de voces en español, probar una muestra de audio (`▶️ Probar`) y elegir con un clic.
  - **Rotación Rápida:** Botón para pasar a la siguiente voz (`🔄 Siguiente Voz Rápida`) con confirmación hablada.
  - **Persistencia:** Guarda la voz preferida en `localStorage` para recordarla en próximas misiones.
- Utiliza la síntesis de voz nativa del navegador priorizada en **Español Latinoamericano** (`window.speechSynthesis` con BCP 47 `es-419`, `es-MX`, `es-AR`, `es-CO`, etc.), con selección inteligente de acentos latinos (Paulina, Diego, Sabina, etc.), tono cálido y amigable para niños, y posibilidad de detener la lectura en cualquier momento (`⏹️ Detener`).

---

## 🛑 Botón para Abortar Misión

Si el jugador desea cambiar de nivel de dificultad o probar con otro nombre de astronauta:
- Dispone del botón **`🛑 Abortar Misión`** en la barra superior (y en el panel de telemetría de PC).
- Muestra un modal de confirmación seguro para evitar toques accidentales.
- Al confirmar, reinicia de forma limpia el estado y devuelve al jugador a la pantalla de mando inicial.

---

## 📱 UX/UI Optimizada y Tipografía Escalada para 3 Pantallas

La interfaz se adapta a 3 formatos distintos garantizando legibilidad y confort visual:

1. **💻 Laptop / PC (Escritorio > 980px): Vista de Estación en 2 Columnas con Tipografía Ampliada**
   - **Tipografía Escalada:** Textos de dilemas (1.1rem), títulos destacados (1.45rem), cajas científicas y botones dimensionados para monitores de alta resolución, evitando textos diminutos.
   - **Columna Izquierda (Panel Lateral de Estación, 350px):** Muestra permanentemente la tarjeta de AstroCan en alta resolución, su globo de diálogo, la telemetría detallada con semáforo y accesos directos (Archivo NASA, Sonido, Abortar).
   - **Columna Derecha (Terminal de Mando):** Encabezado ambiental polar, dilema con fuente oficial citada, opciones de decisión en rejilla amplia y microjuegos interactivos.
2. **📱 Tablet (601px a 980px): Vista Híbrida de Mando**
   - Banner superior donde AstroCan y su globo de diálogo se integran de forma horizontal junto a los indicadores climáticos.
   - Opciones en rejilla de 2 columnas con botones táctiles de gran tamaño.
3. **📱 Celular (≤ 600px): Layout Vertical de Máxima Densidad**
   - Formato 100dvh con mini-avatar de AstroCan y globo compacto.
   - Opciones apiladas en 1 columna fácilmente accionables con el pulgar.
   - Controles de microjuego adaptados para pantalla táctil (D-Pad táctil para el rover y deslizadores táctiles para el escudo).

---

## 🌌 Puesto Avanzado Lunar de Gran Escala en el Fondo Canvas

El lienzo procedural a 60 FPS representa el **Puesto Avanzado Artemis** con gran escala y riqueza de detalles en la superficie lunar:
- **Domo Principal Presurizado (Radio 75px):** Con cúpula de blindaje de regolito, ventanas de observación con iluminación cálida interior y esclusa hermética con sello cian iluminado.
- **Bio-Laboratorio OSDR (Radio 45px):** Con cúpula geodésica y luminiscencia botánica verde de cultivo hidropónico.
- **Túnel de Conexión:** Pasadizo presurizado con ojos de buey iluminados.
- **Torre de Comunicaciones y Antena Parabólica:** Mástil de 95px de altura con plato parabólico orientado hacia la Tierra y baliza roja de advertencia parpadeante.
- **Parque de Paneles Solares Verticales:** 3 grandes torres fotovoltaicas con marcos azules diseñadas para captar el ángulo rasante del Sol en el polo lunar.
- **Rover Lunar y Tanques Criogénicos:** Rover de 6 ruedas proyectando un cono de luz de faros sobre el regolito y tanques de almacenamiento de oxígeno e hidrógeno.

---

## ⚖️ Escalado Matemático de Recursos por Nivel de Misión

Para evitar que las misiones de 14 y 28 días sean matemáticamente imposibles de ganar:
- **Factor de Escala Dinámico:**
  - **Nivel 1 (Cadete - 7 días):** Factor `1.0x` (impactos estándar de -15% a -25%, ideal para aprender).
  - **Nivel 2 (Especialista - 14 días):** Factor `0.60x` (impactos moderados de -10% a -15% y desgaste diario de ~2%/día).
  - **Nivel 3 (Comandante - 28 días):** Factor `0.35x` (impactos de -6% a -10%).
- **El Gran Reto de la Noche Lunar en Nivel 3:**
  - Durante los primeros 14 días (sol constante), el consumo de energía es de solo 1%/día, permitiendo acumular reservas.
  - Durante los días 15 al 28 (noche lunar a -173°C / -200°C), los paneles fotovoltaicos caen a 0W y los calefactores consumen 3.5%/día.
  - Si el jugador juega con sabiduría, sobrevive con éxito el maratón lunar; si gasta energía descuidadamente, la base sufre un apagón térmico en plena noche polar.
- **Coherencia Matemática:** El texto de cada tarjeta de opción muestra exactamente el número de puntos ya escalado, y la tabla de recibo (*Antes → Tu Orden → Ahora*) valida la resta/suma con exactitud.

---

## 🔬 Integración de Datos Científicos Reales de la NASA

Cada evento incluye la fuente oficial con enlace directo para aprender más:
- **NASA DONKI (`api.nasa.gov/DONKI`):** Consulta en tiempo real de eyecciones de masa coronal (CME) y tormentas solares, con transición automática a registros históricos oficiales si no hay red.
- **NASA OSDR (`osdr.nasa.gov`):** Estudios biológicos auténticos:
  - **OSD-379:** Plantas cultivadas en regolito de Apolo 11, 12 y 17.
  - **OSD-546:** Disfunción mitocondrial e inmunodepresión por radiación cósmica.
  - **OSD-120:** Pérdida de densidad ósea y muscular en 1/6 g.
  - **OSD-244:** Desfase circadiano en hábitats cerrados.
  - **OSD-612:** Biopelículas bacterianas en recicladores de agua ECLSS.
- **NASA LCROSS & LRO:** Hielo de agua en zonas de sombra permanente (PSR) del Cráter Shackleton.

---

## 📤 Certificado Oficial para Compartir (Sin Base de Datos)

- Genera un diploma en PNG de alta resolución (**1080 × 1350 px**) con Canvas 2D.
- Incluye nombre del astronauta, medalla, rango, días sobrevividos, puntuación, ciencia y barras finales de recursos con tipografía Fredoka.
- Utiliza la **Web Share API nativa** para compartir por **WhatsApp**, **Telegram**, etc., permitiendo a los niños competir sanamente sin requerir servidores ni bases de datos.

---

## 📂 Estructura del Proyecto

```
challenge/
├── index.html              # Estructura semántica accesible, 3 layouts (PC, Tablet, Móvil)
├── assets/
│   └── mascot/             # 7 expresiones emocionales de AstroCan
│       ├── greeting.jpg    # Saludando alegre
│       ├── thinking.jpg    # Pensativo evaluando dilema
│       ├── scared.jpg      # Asustado en alerta solar o emergencia
│       ├── worried.jpg     # Preocupado tras sacrificios duros
│       ├── relaxed.jpg     # Relajado con base bajo control
│       ├── celebrating.jpg # Celebrando victoria o ciencia
│       └── crying.jpg      # Triste en evacuación de emergencia
├── css/
│   ├── styles.css          # Estilos Artemis, tipografía Fredoka, semáforo, 3 layouts
│   ├── space-scene.css     # Animaciones del fondo estelar y alertas de radiación
│   └── minigames.css       # Estilos para escudo solar y arcade del rover
├── js/
│   ├── audio.js            # Motor procedural de sonido Web Audio API
│   ├── speech.js           # Narrador en voz alta (misión y opciones separadas)
│   ├── mascot.js           # Controlador emocional de AstroCan
│   ├── space-canvas.js     # Lienzo de estrellas, satélites, la Tierra y base lunar grande
│   ├── data-donki.js       # Servicio de clima espacial de la NASA (DONKI)
│   ├── data-osdr.js        # Repositorio de estudios biológicos de la NASA (OSDR)
│   ├── game-state.js       # Gestor reactivo de recursos, escalado y clima dinámico
│   ├── events.js           # Mazo de dilemas de compensación real con fuentes NASA
│   ├── minigame-shield.js  # Microjuego de calibración de escudo y desvío de energía
│   ├── minigame-rover.js   # Microjuego 2D del rover en el Cráter Shackleton
│   ├── certificate.js      # Generador de certificados Canvas (1080x1350) y Web Share API
│   └── main.js             # Controlador principal y orquestador del flujo
└── README.md               # Documentación completa y fundamentación científica
```

---

## 🚀 Cómo Ejecutar el Juego

El proyecto no requiere Node.js, compilación ni bases de datos. Puede ejecutarse de dos formas:

1. **Directamente en cualquier navegador web:** Haz doble clic sobre el archivo `index.html`.
2. **Servidor local (recomendado):**
   ```bash
   python3 -m http.server 8000
   ```
   Abre tu navegador en `http://localhost:8000`.

---
*Desarrollado con pasión por la exploración espacial, la astronomía y la educación científica interactiva para la próxima generación de astronautas del Programa Artemis.*
