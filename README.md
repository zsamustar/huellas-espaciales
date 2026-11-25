# Estaciones de Desconexión (2050) ✦ Huellas Espaciales

> **Concepto Académico:**
> Este proyecto no es un videojuego con polígonos ni orbes arcade. Es una **experiencia interactiva inmersiva y contemplativa** ambientada en el año 2050, donde los parques públicos han sido rediseñados como *Santuarios de Silencio*. En una sociedad hiperconectada y saturada de estímulos neuronales, el teléfono móvil funciona como **la única llave física** para desbloquear el acceso a la reconexión humana.

---

## 📖 Las 3 Fases de la Experiencia

1. **Fase 1 — La Sobrecarga Neuronal (Cinemática rápida de ~10 segundos):**
   - Vista en primera persona dentro de una habitación urbana en 2050 (`assets/habitacion_360.jpg`).
   - Flurry rápido de notificaciones invasivas, ruidos electrónicos y métricas de rendimiento.
   - A los 7 segundos: **silencio total súbito** y un mensaje cálido de Mamá que atraviesa el ruido: *«¿Te acuerdas del parque al que íbamos? Ahora hay un santuario donde dejas el celular como llave. Ve. Te va a hacer bien.»*

2. **Fase 2 — El Umbral: El Celular como Llave Física:**
   - Llegas al pabellón de acceso frente a un tótem monolítico de desconexión.
   - Sostienes tu celular en la mano en primer plano.
   - Al pulsar <kbd>E</kbd>, encajas el celular en la bahía de bloqueo: suena un cerrojo mecánico y magnético pesado, la pantalla del teléfono se apaga, el anillo del pedestal pasa de rojo a verde esmeralda y las compuertas de cristal templado se abren suavemente.
   - Lumen, el guardián del santuario, te da la bienvenida al silencio.

3. **Fase 3 — El Santuario Natural 360° (Fotografía Inmersiva Fotorrealista):**
   - El parque está renderizado como un **entorno inmersivo fotográfico 360°** (`assets/parque_360.jpg`), libre de árboles poligonales o estética arcade.
   - **Puntos Orgánicos de Memoria**: Las huellas son lugares naturales reales (un banco de madera envejecido, la orilla del estanque con nenúfares, la sombra de los robles, el sendero de grava clara).
   - Al acercarte a un punto y pulsar <kbd>E</kbd>, escuchas la memoria y la canción de YouTube que esa persona dejó grabada.
   - Al cerrar la huella, emerge la tarjeta de **Resonancia Emocional** (vidrio líquido VisionOS) preguntándote qué sentiste, dejando una onda de luz en el suelo y guardando tu reflexión.
   - Pulsando <kbd>N</kbd> puedes buscar cualquier canción en vivo con la **YouTube Data API v3**, escribir tu sentir y dejar tu memoria en el parque.

---

## 🕹️ Controles

| Acción | Control |
| :--- | :--- |
| **Caminar** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> |
| **Mirar en 360°** | Movimiento libre del ratón o flechas <kbd>←</kbd> <kbd>→</kbd> |
| **Interactuar (Llave / Memorias)** | <kbd>E</kbd> |
| **Dejar una nueva memoria** | <kbd>N</kbd> |
| **Menú y Ajustes / Cerrar ventanas** | <kbd>ESC</kbd> |

---

## 🎵 Música y Resonancia Emocional (YouTube Data API v3 Oficial)

- **Buscador global en tiempo real**: Conexión a la API oficial de YouTube (Data API v3) para consultar cualquier canción, artista o video con miniaturas oficiales.
- **Catálogo verificado local**: 19 temas de NSQK, rusowsky y CA7RIEL & Paco Amoroso integrados.
- **Reproductor 16:9 oficial**: Con cierre y detención inmediata para no superponer audio.
- **Eco del Recuerdo (Reflexión post-huella)**: Pregunta empática en VisionOS Liquid Glass adaptada a cada emoción (quiebre, alivio, despedida, gratitud, esperanza).

---

## 🚀 Cómo Subir a GitHub y Publicar en GitHub Pages

Al estar desarrollado en **HTML5, CSS3 y JavaScript moderno con Three.js vía CDN**, no requiere npm ni compilación.

```bash
cd C:\Users\Zsamustar\.gemini\antigravity\scratch\huellas-espaciales-2050
git init
git add .
git commit -m "feat: Estaciones de Desconexion 2050 - Experiencia inmersiva 360"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/huellas-espaciales-2050.git
git push -u origin main
```

En GitHub: ve a **Settings** > **Pages** > selecciona rama `main` y carpeta `/ (root)` > **Save**. Tu enlace público estará activo en minutos.

---

## 🚀 Cómo Ejecutar

1. Abre la carpeta `C:\Users\Zsamustar\.gemini\antigravity\scratch\huellas-espaciales-2050\`.
2. Inicia un servidor local (recomendado para usar micrófono y YouTube embed sin restricciones de `file://`):
   ```bash
   python -m http.server 8080
   ```
3. Abre `http://localhost:8080/` en tu navegador.
