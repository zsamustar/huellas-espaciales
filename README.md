# Huellas Espaciales (2050) ✦ Historia Contemplativa

Un relato interactivo en primera persona sobre soltar el ruido digital del 2050 y volver a conectar con lo humano. Construido en **HTML5, CSS3 y JavaScript moderno** sin bundlers (listo para abrir en local o subir a GitHub Pages).

---

## 📖 La Historia (Actos)

1. **Pantalla de Título**: Vista aérea del Parque de las Huellas con luces flotantes.
2. **Acto I — El Ruido y el Aislamiento**: Despiertas en una habitación apagada del 2050 saturado por notificaciones cuánticas, rachas y métricas mientras sostienes tu teléfono en la mano. Llega un mensaje de tu madre invitándote a ir al parque. *(Mantén <kbd>Espacio</kbd> para saltar la cinemática).*
3. **Acto II — El Umbral**: Llegas al pabellón de entrada frente al pedestal con el letrero *"DEJA TU CELULAR · Para poder conectar contigo mismo"*. Acércate y pulsa <kbd>E</kbd> para depositar tu teléfono.
4. **Acto III — Bienvenida con Lumen**: Una luz dorada llamada **Lumen** aparece, te explica el sentido del parque y te enseña los controles. Al terminar, las compuertas se abren hacia el parque bañado por luz diurna.
5. **Acto IV — El Parque y las Huellas**: Explora los senderos, el estanque con nenúfares, el puente y las 10 huellas iniciales con música real de **NSQK**, **rusowsky** y **CA7RIEL & Paco Amoroso** vía YouTube oficial.
6. **Epílogo — Tu Propia Huella**: Pulsa <kbd>N</kbd> para abrir el buscador integrado estilo barra de YouTube, elegir tu canción, grabar una nota de voz opcional y dejar tu luz en el parque.

---

## 🕹️ Controles

| Acción | Control |
| :--- | :--- |
| **Caminar** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> o Flechas |
| **Mirar** | Movimiento libre del ratón (haz clic para bloquear el cursor) |
| **Interactuar / Avanzar diálogo** | <kbd>E</kbd> *(estrictamente)* |
| **Dejar una nueva huella** | <kbd>N</kbd> |
| **Pausar / Cerrar ventanas** | <kbd>ESC</kbd> |

---

## 🎵 Música y Resonancia Emocional (YouTube Data API v3 Integrada)

- **Buscador global de YouTube en vivo**: Integrado con la API oficial de YouTube (Data API v3) para buscar cualquier canción, artista o video en tiempo real con miniaturas oficiales.
- **Catálogo verificado**: Fallback automático con 19 canciones de NSQK, rusowsky y CA7RIEL & Paco Amoroso.
- **Reproductor embed oficial**: Formato 16:9 con limpieza inmediata del iframe al cerrar para evitar audios superpuestos.
- **Eco del Recuerdo (Resonancia Emocional)**: Al terminar de escuchar cada huella, emerge una tarjeta flotante en estilo VisionOS Liquid Glass que te pregunta por el sentimiento evocado (ej. *¿Sentiste el peso de soltar a alguien...?*), permitiendo responder con un clic, generando una onda luminosa en el parque y guardando tu reflexión.

---

## 🚀 Cómo Subir a GitHub y Publicar en GitHub Pages

Dado que no usa bundlers ni dependencias de compilación (código nativo puro), está 100% listo para GitHub Pages:

### 1. Inicializar y subir con Git:
Abre una terminal en este directorio y ejecuta:

```bash
cd C:\Users\Zsamustar\.gemini\antigravity\scratch\huellas-espaciales-2050
git init
git add .
git commit -m "feat: Huellas Espaciales (2050) - Experiencia contemplativa 3D"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/huellas-espaciales-2050.git
git push -u origin main
```

### 2. Activar GitHub Pages:
1. En tu repositorio de GitHub, ve a **Settings** > **Pages**.
2. En **Source**, selecciona `Deploy from a branch`.
3. Elige la rama `main` y la carpeta `/ (root)`, luego pulsa **Save**.
4. En 1-2 minutos tu enlace público estará activo en:
   `https://TU-USUARIO.github.io/huellas-espaciales-2050/`

---

## 🚀 Cómo Ejecutar

1. Abre la carpeta `C:\Users\Zsamustar\.gemini\antigravity\scratch\huellas-espaciales-2050\`.
2. Inicia un servidor local (recomendado para usar micrófono y YouTube embed sin restricciones de `file://`):
   ```bash
   python -m http.server 8080
   ```
3. Abre `http://localhost:8080/` en tu navegador.
