# Huellas Espaciales: La Casa de la Memoria Afectiva

Aplicación 3D estática para GitHub Pages. Necesita un navegador moderno y conexión a Internet para cargar Three.js, Google Fonts y, si se habilita, Firebase o la búsqueda oficial de YouTube.

## Inicio rápido

1. Publica estos archivos en la raíz de un repositorio.
2. En GitHub, abre **Settings → Pages**, selecciona **Deploy from a branch**, escoge la rama y la carpeta `/ (root)`.
3. Abre la URL que GitHub genere. También puede probarse localmente con cualquier servidor estático (no abrir `index.html` directamente).

La casa funciona de inmediato en modo local: incluye seis huellas precargadas y un catálogo de canciones de YouTube. Los datos se guardan en el `localStorage` del navegador.

## Firebase opcional

Para sincronizar huellas en tiempo real, crea un proyecto Firebase con Firestore y pega la configuración web en `config.js`. Una configuración válida activa automáticamente la colección `huellas_casa` mediante Firestore v10 modular y `onSnapshot`.

Durante prototipado, una regla de Firestore puede permitir lectura y escritura sin autenticación. Antes de publicar, protege las reglas según tu modelo de acceso.

## YouTube opcional

Pega una clave de **YouTube Data API v3** en `YOUTUBE_API_KEY` de `config.js` para activar el buscador oficial. Sin clave, el buscador filtra el catálogo integrado y reconoce enlaces pegados de YouTube (`youtube.com`, `youtu.be` y `music.youtube.com`). La reproducción se realiza únicamente mediante el reproductor embed oficial de YouTube.

## Estructura

- `index.html`: interfaz, HUD y modales.
- `style.css`: diseño glassmorphism y vista adaptable.
- `config.js`: configuración opcional.
- `app.js`: escena, navegación, huellas y persistencia.
