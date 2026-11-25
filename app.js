/**
 * HUELLAS ESPACIALES (2050) — Motor Narrativo, Escena 3D, Audio y Buscador YouTube
 * Música: Única y exclusivamente YouTube (embed oficial + buscador integrado).
 */

/* ==========================================================================
   1. MOTOR DE AUDIO PROCEDURAL (Web Audio API)
   ========================================================================== */
class MotorAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.vientoGain = null;
    this.humGain = null;
    this.volumen = 0.8;
    this.enParque = false;
    this.silenciadoTemporal = false;
  }

  iniciar() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volumen;
      this.master.connect(this.ctx.destination);
      this._crearAmbientes();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  _crearAmbientes() {
    // Brisa de parque (ruido rosa filtrado)
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * w) / 1.02;
      last = data[i];
      data[i] *= 2.5;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const filtro = this.ctx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = 380;

    this.vientoGain = this.ctx.createGain();
    this.vientoGain.gain.value = 0;
    src.connect(filtro);
    filtro.connect(this.vientoGain);
    this.vientoGain.connect(this.master);
    src.start();

    // Zumbido digital tenue para el Acto I
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 58;
    this.humGain = this.ctx.createGain();
    this.humGain.gain.value = 0;
    osc.connect(this.humGain);
    this.humGain.connect(this.master);
    osc.start();
  }

  setVolumen(v) {
    this.volumen = v;
    if (this.master && !this.silenciadoTemporal) {
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
    }
  }

  silenciar(si) {
    this.silenciadoTemporal = si;
    if (!this.master) return;
    this.master.gain.setTargetAtTime(si ? 0.03 : this.volumen, this.ctx.currentTime, 0.25);
  }

  modoAislamiento(activo) {
    this.iniciar();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.enParque = !activo;
    this.humGain.gain.setTargetAtTime(activo ? 0.045 : 0, t, 0.6);
    this.vientoGain.gain.setTargetAtTime(activo ? 0.01 : 0.12, t, 1.0);
  }

  tocarNotif() {
    this.iniciar();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(980, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.07);
    g.gain.setValueAtTime(0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + 0.22);
  }

  tocarLumenVoz() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(640 + Math.random() * 140, t);
    g.gain.setValueAtTime(0.022, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + 0.1);
  }

  tocarCampana() {
    this.iniciar();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [392, 523.25, 659.25, 783.99].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.07 / (i + 1), t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      osc.connect(g); g.connect(this.master);
      osc.start(t); osc.stop(t + 3.2);
    });
  }

  tocarPuerta() {
    this.iniciar();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 1.1);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + 1.3);
  }

  tocarLlaveBloqueo() {
    this.iniciar();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    // 1. Clic metálico de inserción del dispositivo
    const osc1 = this.ctx.createOscillator();
    const g1 = this.ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(1250, t);
    osc1.frequency.exponentialRampToValueAtTime(280, t + 0.08);
    g1.gain.setValueAtTime(0.09, t);
    g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc1.connect(g1); g1.connect(this.master);
    osc1.start(t); osc1.stop(t + 0.08);

    // 2. Cierre mecánico electromagnético pesado
    const osc2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(140, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(42, t + 0.42);
    g2.gain.setValueAtTime(0.19, t + 0.04);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
    osc2.connect(g2); g2.connect(this.master);
    osc2.start(t + 0.04); osc2.stop(t + 0.48);
  }

  tocarPajaro() {
    if (!this.ctx || !this.enParque || this.silenciadoTemporal) return;
    const t = this.ctx.currentTime;
    const base = 2100 + Math.random() * 800;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.exponentialRampToValueAtTime(base + 650, t + 0.07);
    osc.frequency.exponentialRampToValueAtTime(base - 250, t + 0.16);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.02, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + 0.19);
  }
}

/* ==========================================================================
   2. GRABADORA DE VOZ + VISUALIZADOR EN CANVAS
   ========================================================================== */
class GrabadoraVoz {
  constructor(canvas) {
    this.canvas = canvas;
    this.rec = null;
    this.chunks = [];
    this.dataUrl = null;
    this.grabando = false;
    this.analyser = null;
    this.raf = null;
  }

  async iniciar() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.rec = new MediaRecorder(stream);
      this.chunks = [];

      const AC = window.AudioContext || window.webkitAudioContext;
      const actx = new AC();
      const src = actx.createMediaStreamSource(stream);
      this.analyser = actx.createAnalyser();
      this.analyser.fftSize = 64;
      src.connect(this.analyser);

      this.rec.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
      this.rec.onstop = () => {
        const blob = new Blob(this.chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => { this.dataUrl = reader.result; };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
        cancelAnimationFrame(this.raf);
      };
      this.rec.start();
      this.grabando = true;
      this._dibujar();
      return { ok: true };
    } catch (e) {
      return { ok: false, msg: "Micrófono no disponible. Puedes dejar tu huella solo con texto y canción." };
    }
  }

  detener() {
    if (this.rec && this.grabando) {
      this.rec.stop();
      this.grabando = false;
      return true;
    }
    return false;
  }

  _dibujar() {
    if (!this.grabando || !this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    const arr = new Uint8Array(this.analyser.frequencyBinCount);
    const loop = () => {
      if (!this.grabando) return;
      this.raf = requestAnimationFrame(loop);
      this.analyser.getByteFrequencyData(arr);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const bw = this.canvas.width / arr.length;
      for (let i = 0; i < arr.length; i++) {
        const h = (arr[i] / 255) * this.canvas.height * 0.9;
        ctx.fillStyle = `rgba(79,154,116,${0.4 + arr[i] / 300})`;
        ctx.fillRect(i * bw + 1, this.canvas.height - h, bw - 3, h);
      }
    };
    loop();
  }

  limpiar() {
    this.detener();
    this.dataUrl = null;
    if (this.canvas) {
      const ctx = this.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

/* ==========================================================================
   3. BUSCADOR INTEGRADO DE YOUTUBE
   ========================================================================== */
class BuscadorYouTube {
  constructor(dom, onSeleccion) {
    this.dom = dom;
    this.onSeleccion = onSeleccion;
    this.seleccionada = null;
    this._enlazar();
  }

  _enlazar() {
    const inp = this.dom.ytInput;
    inp.addEventListener("input", () => {
      const v = inp.value.trim();
      this.dom.ytLimpiar.classList.toggle("oculto", !v);
      this._mostrarSugerencias(v);
    });
    inp.addEventListener("focus", () => this._mostrarSugerencias(inp.value.trim()));
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); this.buscar(inp.value.trim()); }
    });
    this.dom.ytLimpiar.addEventListener("click", () => {
      inp.value = "";
      this.dom.ytLimpiar.classList.add("oculto");
      this._ocultarSugerencias();
      this._mostrarResultadosCatalogo(CONFIG.catalogo);
      inp.focus();
    });
    this.dom.ytBuscarBtn.addEventListener("click", () => this.buscar(inp.value.trim()));
    this.dom.ytQuitar.addEventListener("click", () => {
      this.seleccionada = null;
      this.dom.ytElegida.classList.add("oculto");
      this.onSeleccion(null);
      inp.focus();
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".yt-buscador")) this._ocultarSugerencias();
    });

    // Mostrar catálogo inicial al abrir
    this._mostrarResultadosCatalogo(CONFIG.catalogo.slice(0, 6));
  }

  _mostrarSugerencias(q) {
    const box = this.dom.ytSugerencias;
    const ql = q.toLowerCase();
    const hits = ql
      ? CONFIG.catalogo.filter((c) => `${c.artista} ${c.titulo}`.toLowerCase().includes(ql)).slice(0, 6)
      : CONFIG.catalogo.slice(0, 5);

    if (!hits.length || YT.extraerId(q)) { this._ocultarSugerencias(); return; }

    box.innerHTML = "";
    hits.forEach((item) => {
      const row = document.createElement("div");
      row.className = "yt-sug";
      row.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>
        <span><b>${item.artista}</b> — ${item.titulo}</span>`;
      row.addEventListener("click", () => {
        this.dom.ytInput.value = `${item.artista} ${item.titulo}`;
        this._ocultarSugerencias();
        this._renderResultados([item]);
        this.elegir(item);
      });
      box.appendChild(row);
    });
    box.classList.add("visible");
  }

  _ocultarSugerencias() {
    this.dom.ytSugerencias.classList.remove("visible");
  }

  async buscar(q) {
    this._ocultarSugerencias();
    if (!q) {
      this._mostrarResultadosCatalogo(CONFIG.catalogo);
      return;
    }

    // 1) ¿Pegó un enlace o ID de YouTube? -> Resolver título real con oEmbed (gratis, sin API key)
    const idDirecto = YT.extraerId(q);
    if (idDirecto) {
      this.dom.ytEstado.textContent = "Verificando vídeo en YouTube…";
      try {
        const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(YT.enlace(idDirecto))}`);
        if (res.ok) {
          const info = await res.json();
          const item = { id: idDirecto, titulo: info.title, artista: info.author_name || "YouTube" };
          this.dom.ytEstado.textContent = "Vídeo encontrado en YouTube:";
          this._renderResultados([item]);
          this.elegir(item);
          return;
        }
      } catch (_) {}
      const fallback = { id: idDirecto, titulo: "Vídeo de YouTube", artista: `ID ${idDirecto}` };
      this._renderResultados([fallback]);
      this.elegir(fallback);
      return;
    }

    // 2) Búsqueda en vivo de YouTube Data API v3 (con API Key oficial)
    const apiKey = Almacen.ajustes().apiKey || CONFIG.youtubeApiKey;
    if (apiKey) {
      this.dom.ytEstado.textContent = `Buscando "${q}" en YouTube…`;
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(q)}&key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const items = (data.items || [])
            .filter((it) => it.id && it.id.videoId)
            .map((it) => ({
              id: it.id.videoId,
              titulo: it.snippet.title,
              artista: it.snippet.channelTitle
            }));
          if (items.length) {
            this.dom.ytEstado.textContent = `${items.length} resultados de YouTube para "${q}":`;
            this._renderResultados(items);
            return;
          }
        }
      } catch (_) {}
    }

    // 3) Búsqueda en el catálogo verificado (NSQK, rusowsky, CA7RIEL & Paco Amoroso)
    const ql = q.toLowerCase();
    const filtrados = CONFIG.catalogo.filter((c) => `${c.artista} ${c.titulo}`.toLowerCase().includes(ql));
    if (filtrados.length) {
      this.dom.ytEstado.textContent = `${filtrados.length} canciones encontradas para "${q}":`;
      this._renderResultados(filtrados);
    } else {
      this.dom.ytEstado.innerHTML = `No está en el catálogo local. Pega arriba el enlace de YouTube de esa canción o <a id="yt-abrir-fuera">búscala en YouTube ↗</a> y pega el link.`;
      const a = document.getElementById("yt-abrir-fuera");
      if (a) a.addEventListener("click", () => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, "_blank", "noopener"));
      this.dom.ytResultados.innerHTML = "";
    }
  }

  _mostrarResultadosCatalogo(lista) {
    this.dom.ytEstado.textContent = "Elige una canción de NSQK, rusowsky o CA7RIEL & Paco Amoroso, o busca / pega cualquier enlace de YouTube:";
    this._renderResultados(lista);
  }

  _renderResultados(lista) {
    const cont = this.dom.ytResultados;
    cont.innerHTML = "";
    lista.forEach((item) => {
      const card = document.createElement("div");
      card.className = "yt-res" + (this.seleccionada && this.seleccionada.id === item.id ? " sel" : "");
      card.innerHTML = `
        <img src="${YT.miniatura(item.id)}" alt="">
        <div class="info">
          <div class="t">${item.titulo}</div>
          <div class="c">${item.artista} · YouTube</div>
        </div>`;
      card.addEventListener("click", () => {
        cont.querySelectorAll(".yt-res").forEach((el) => el.classList.remove("sel"));
        card.classList.add("sel");
        this.elegir(item);
      });
      cont.appendChild(card);
    });
  }

  elegir(item) {
    this.seleccionada = item;
    this.dom.ytElegidaImg.src = YT.miniatura(item.id);
    this.dom.ytElegidaTit.textContent = item.titulo;
    this.dom.ytElegidaCan.textContent = `${item.artista} · YouTube`;
    this.dom.ytElegida.classList.remove("oculto");
    this.onSeleccion(item);
  }

  reset() {
    this.seleccionada = null;
    this.dom.ytInput.value = "";
    this.dom.ytLimpiar.classList.add("oculto");
    this.dom.ytElegida.classList.add("oculto");
    this._mostrarResultadosCatalogo(CONFIG.catalogo.slice(0, 6));
  }
}

/* ==========================================================================
   4. JUEGO PRINCIPAL (Historia + Escena 3D + Controles)
   ========================================================================== */
class Juego {
  constructor() {
    this.audio = new MotorAudio();
    this.estado = "TITULO"; // TITULO | CINE | UMBRAL | TUTORIAL | PARQUE | MODAL | PAUSA
    this.celularEntregado = false;
    this.puertasAbiertas = false;
    this.aperturaT = 0;

    // Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Controles
    this.teclas = {};
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.pointerLock = false;
    this.ultimoMouse = null;
    this.puedeMoverse = false;

    // Objetos 3D clave
    this.manoGrupo = null;
    this.pantallaTex = null;
    this.pantallaCtx = null;
    this.ultimoRedibujo = -1;
    this.puertaIzq = null;
    this.puertaDer = null;
    this.lumen = null;
    this.arboles = [];
    this.particulas = null;
    this.agua = null;
    this.orbes = [];

    // Interacción
    this.raycaster = new THREE.Raycaster();
    this.centro = new THREE.Vector2(0, 0);
    this.focoCaja = false;
    this.focoHuella = null;
    this.escuchadas = Almacen.escuchadas();
    this.tresCelebrado = this.escuchadas.size >= 3;

    // Cinemática / diálogo
    this.saltarHold = 0;
    this.cineAbort = null;
    this.dlgCola = [];
    this.dlgIdx = 0;
    this.dlgEscribiendo = false;
    this.dlgTimer = null;
    this.dlgCallback = null;
    this.proximoPajaro = 4;

    this.dom = {};
    this.grabadora = null;
    this.buscadorYT = null;
    this.emocionElegida = "gratitud";
  }

  async iniciar() {
    this._cachearDOM();
    this._iniciar3D();
    this._construirManoYCelular();
    this._construirUmbral();
    this._construirParque();
    this._construirLumen();
    await this._cargarHuellas();
    this._iniciarModales();
    this._iniciarInput();
    this._mostrarTitulo();
    this._loop();
  }

  _cachearDOM() {
    const $ = (id) => document.getElementById(id);
    this.dom = {
      canvas: $("canvas-3d"),
      pantallaTitulo: $("pantalla-titulo"), btnEmpezar: $("btn-empezar"), btnIrParque: $("btn-ir-parque"),
      fundido: $("fundido"), destelloLuz: $("destello-luz"), vineta: $("viñeta"), glitch: $("glitch"), notifs: $("notifs"),
      subtitulos: $("subtitulos"), tarjetaCap: $("tarjeta-capitulo"), capNum: $("cap-num"), capTitulo: $("cap-titulo"),
      saltarProg: $("saltar-prog"),
      hud: $("hud"), objBox: $("objetivo"), objEtq: $("obj-etq"), objTxt: $("obj-txt"), objSub: $("obj-sub"),
      brujulaMarcas: $("brujula-marcas"), mira: $("mira"), prompt: $("prompt"), promptTxt: $("prompt-txt"),
      etiqOrbe: $("etiqueta-orbe"), eoEmo: $("eo-emo"), eoTit: $("eo-tit"), eoMus: $("eo-mus"),
      contadorTxt: $("contador-txt"), btnNuevaHuella: $("btn-nueva-huella"), btnPausa: $("btn-pausa"),
      dialogo: $("dialogo"), dlgTexto: $("dlg-texto"), dlgPie: $("dlg-pie"), dlgProgreso: $("dlg-progreso"),
      modalHuella: $("modal-huella"), mhCaja: $("mh-caja"), mhChip: $("mh-chip"), mhLugar: $("mh-lugar"),
      mhTitulo: $("mh-titulo"), mhMeta: $("mh-meta"),
      mhTexto: $("mh-texto"), mhVoz: $("mh-voz"), mhAudio: $("mh-audio"), mhCancion: $("mh-cancion"),
      mhYt: $("mh-yt"), mhYtLink: $("mh-yt-link"), mhCerrar: $("mh-cerrar"), mhCerrarBtn: $("mh-cerrar-btn"),
      modalCrear: $("modal-crear"), formCrear: $("form-crear"), mcEmociones: $("mc-emociones"),
      mcTitulo: $("mc-titulo"), mcAutor: $("mc-autor"), mcTexto: $("mc-texto"),
      mcGrabar: $("mc-grabar"), mcGrabEstado: $("mc-grab-estado"), mcBorrarVoz: $("mc-borrar-voz"),
      ondaVoz: $("onda-voz"), mcAudioPrev: $("mc-audio-prev"), mcCerrar: $("mc-cerrar"), mcCancelar: $("mc-cancelar"),
      ytInput: $("yt-input"), ytLimpiar: $("yt-limpiar"), ytBuscarBtn: $("yt-buscar-btn"),
      ytSugerencias: $("yt-sugerencias"), ytEstado: $("yt-estado"), ytResultados: $("yt-resultados"),
      ytElegida: $("yt-elegida"), ytElegidaImg: $("yt-elegida-img"), ytElegidaTit: $("yt-elegida-tit"),
      ytElegidaCan: $("yt-elegida-can"), ytQuitar: $("yt-quitar"),
      modalPausa: $("modal-pausa"), mpCerrar: $("mp-cerrar"), mpReanudar: $("mp-reanudar"),
      mpReiniciar: $("mp-reiniciar-historia"), mpBorrar: $("mp-borrar-huellas"),
      ajVol: $("aj-vol"), ajVolVal: $("aj-vol-val"), ajSens: $("aj-sens"), ajSensVal: $("aj-sens-val"), ajApiKey: $("aj-apikey"),
      toast: $("toast"),
      resonancia: $("resonancia"), resHalo: $("res-halo"), resIcono: $("res-icono"),
      resHuellaTit: $("res-huella-tit"), resPregunta: $("res-pregunta"), resOpciones: $("res-opciones"),
      resConfirmacion: $("res-confirmacion"), resConfTxt: $("res-conf-txt")
    };
    this.grabadora = new GrabadoraVoz(this.dom.ondaVoz);
  }

  /* ------------------------------------------------------------------------
     ESCENA 3D
     ------------------------------------------------------------------------ */
  _iniciar3D() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdcf0f5);
    this.nieblaParque = new THREE.FogExp2(0xdce9df, 0.0115);

    this.camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.05, 260);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.dom.canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    // Iluminación realista de mañana dorada con sombras suaves
    this.hemi = new THREE.HemisphereLight(0xfffaf0, 0x4f7559, 0.95);
    this.scene.add(this.hemi);

    this.sol = new THREE.DirectionalLight(0xfff0cc, 1.75);
    this.sol.position.set(26, 38, -10);
    this.sol.castShadow = true;
    this.sol.shadow.mapSize.width = 2048;
    this.sol.shadow.mapSize.height = 2048;
    this.sol.shadow.camera.near = 4;
    this.sol.shadow.camera.far = 120;
    const sc = 48;
    this.sol.shadow.camera.left = -sc;
    this.sol.shadow.camera.right = sc;
    this.sol.shadow.camera.top = sc;
    this.sol.shadow.camera.bottom = -sc;
    this.sol.shadow.bias = -0.0005;
    this.scene.add(this.sol);

    // Panoramas 360 fotorrealistas + Iluminación Basada en Imagen (IBL)
    const texLoader = new THREE.TextureLoader();
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy ? this.renderer.capabilities.getMaxAnisotropy() : 4;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();

    this.texturaHabitacion = texLoader.load("assets/habitacion_360.jpg");
    this.texturaHabitacion.mapping = THREE.EquirectangularReflectionMapping;
    this.texturaHabitacion.encoding = THREE.sRGBEncoding;
    this.texturaHabitacion.anisotropy = Math.min(8, maxAniso);

    this.texturaParque = texLoader.load("assets/parque_360.jpg", (tex) => {
      try {
        const envRT = pmrem.fromEquirectangular(tex);
        this.scene.environment = envRT.texture;
        pmrem.dispose();
      } catch (_) {}
    });
    this.texturaParque.mapping = THREE.EquirectangularReflectionMapping;
    this.texturaParque.encoding = THREE.sRGBEncoding;
    this.texturaParque.anisotropy = Math.min(8, maxAniso);

    // Cargar texturas fotográficas PBR reales para objetos 3D del parque
    const cargarPBR = (url, repX = 1, repY = 1) => {
      const t = texLoader.load(url);
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repX, repY);
      t.encoding = THREE.sRGBEncoding;
      t.anisotropy = Math.min(8, maxAniso);
      return t;
    };

    this.texBrillo = this._crearTexturaBrillo();
    this.texCarta = this._crearTexturaCarta();
    this.texFollaje = this._crearTexturaFollaje();
    this.texMascaraSuelo = this._crearMascaraRadial();

    this.mats = {
      cesped: new THREE.MeshStandardMaterial({
        map: cargarPBR("assets/tex_cesped.jpg", 26, 26),
        color: 0xc6d4b8,
        roughness: 0.94,
        metalness: 0.01
      }),
      grava: new THREE.MeshStandardMaterial({
        map: cargarPBR("assets/tex_grava.jpg", 2.2, 14),
        color: 0xc2b59e,
        roughness: 0.96,
        metalness: 0.01
      }),
      madera: new THREE.MeshStandardMaterial({
        map: cargarPBR("assets/tex_madera.jpg", 1.5, 1.5),
        color: 0xd8c6b2,
        roughness: 0.65,
        metalness: 0.04
      }),
      corteza: new THREE.MeshStandardMaterial({
        map: cargarPBR("assets/tex_corteza.jpg", 2, 4),
        color: 0xc9bfb4,
        roughness: 0.94,
        metalness: 0.02
      }),
      hierro: new THREE.MeshStandardMaterial({
        color: 0x1d2421, roughness: 0.38, metalness: 0.78
      }),
      piedra: new THREE.MeshStandardMaterial({
        map: cargarPBR("assets/tex_grava.jpg", 1.5, 1.5),
        color: 0x626960,
        roughness: 0.92,
        metalness: 0.03
      }),
      papel: new THREE.MeshStandardMaterial({
        map: this.texCarta, roughness: 0.78, metalness: 0.02, side: THREE.DoubleSide
      }),
      follaje: new THREE.MeshStandardMaterial({
        map: this.texFollaje,
        alphaTest: 0.32,
        roughness: 0.75,
        metalness: 0.02,
        side: THREE.DoubleSide
      })
    };

    const geo360 = new THREE.SphereGeometry(210, 64, 48);
    this.mat360 = new THREE.MeshBasicMaterial({
      map: this.texturaParque,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
    this.esfera360 = new THREE.Mesh(geo360, this.mat360);
    this.esfera360.renderOrder = -1;
    this.esfera360.rotation.y = Math.PI * 0.5;
    this.scene.add(this.esfera360);
    this.scene.background = this.texturaParque;

    addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }

  _crearTexturaBrillo() {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0.0, "rgba(255,255,255,1)");
    grad.addColorStop(0.22, "rgba(255,250,235,0.85)");
    grad.addColorStop(0.55, "rgba(255,235,180,0.28)");
    grad.addColorStop(1.0, "rgba(255,235,180,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  _crearMascaraRadial() {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(128, 128, 72, 128, 128, 126);
    grad.addColorStop(0.0, "#ffffff");
    grad.addColorStop(0.72, "#ffffff");
    grad.addColorStop(1.0, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  _crearTexturaCarta() {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 320;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#faf3e3";
    ctx.fillRect(0, 0, 256, 320);
    ctx.strokeStyle = "rgba(130, 110, 88, 0.22)";
    ctx.lineWidth = 2;
    for (let y = 52; y < 280; y += 22) {
      ctx.beginPath();
      ctx.moveTo(26, y);
      ctx.lineTo(210 + Math.sin(y) * 18, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(85, 68, 52, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, 236, 300);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  _crearTexturaFollaje() {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 512, 512);
    // Ramitas finas
    ctx.strokeStyle = "#4d3c2b";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(256, 480); ctx.quadraticCurveTo(250, 290, 256, 110); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(256, 340); ctx.lineTo(130, 210); ctx.moveTo(256, 300); ctx.lineTo(385, 190); ctx.stroke();
    // Racimo orgánico de hojas botánicas iluminadas por el sol
    const tonos = ["#3a6b35", "#4c8040", "#5f9446", "#74a64c", "#8eb854", "#315b2d", "#a6bd53"];
    for (let i = 0; i < 145; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.65) * 195;
      const x = 256 + Math.cos(ang) * rad;
      const y = 250 + Math.sin(ang) * rad * 0.92;
      const rx = 14 + Math.random() * 18;
      const ry = 7 + Math.random() * 9;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI * 2);
      ctx.fillStyle = tonos[Math.floor(Math.random() * tonos.length)];
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 245, 195, 0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-rx * 0.7, 0); ctx.lineTo(rx * 0.7, 0); ctx.stroke();
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  _mostrarEscena(modo) {
    const enHabitacion = modo === "HABITACION";
    if (this.grupoUmbral) this.grupoUmbral.visible = !enHabitacion;
    if (this.grupoParque) this.grupoParque.visible = !enHabitacion;
    this.orbes.forEach((o) => { o.grupo.visible = !enHabitacion; });
    this.scene.fog = enHabitacion ? null : this.nieblaParque;
    if (this.esfera360) {
      this.esfera360.rotation.y = Math.PI * 0.5;
    }
  }

  _construirManoYCelular() {
    const g = new THREE.Group();
    g.position.set(0.24, -0.2, -0.44);
    g.rotation.set(-0.14, -0.22, 0.07);

    const c = document.createElement("canvas");
    c.width = 256; c.height = 512;
    this.pantallaCtx = c.getContext("2d");
    this.pantallaTex = new THREE.CanvasTexture(c);
    this._dibujarPantalla("aislamiento");

    const chasis = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.255, 0.009),
      new THREE.MeshStandardMaterial({ color: 0x202825, roughness: 0.25, metalness: 0.75 })
    );
    g.add(chasis);

    const pantalla = new THREE.Mesh(
      new THREE.PlaneGeometry(0.122, 0.242),
      new THREE.MeshBasicMaterial({ map: this.pantallaTex })
    );
    pantalla.position.z = 0.0052;
    g.add(pantalla);

    const piel = new THREE.MeshStandardMaterial({ color: 0xd9bca0, roughness: 0.78 });
    const manga = new THREE.MeshStandardMaterial({ color: 0x394d44, roughness: 0.85 });

    const brazo = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.056, 0.36, 12), manga);
    brazo.position.set(0.06, -0.22, 0.16);
    brazo.rotation.set(0.52, 0, -0.28);
    g.add(brazo);

    const palma = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.085, 0.04), piel);
    palma.position.set(0.035, -0.05, -0.02);
    palma.rotation.set(0.1, -0.15, 0.1);
    g.add(palma);

    for (let i = 0; i < 4; i++) {
      const dedo = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.018, 0.04), piel);
      dedo.position.set(-0.065, -0.072 + i * 0.026, 0.008);
      g.add(dedo);
    }

    this.manoGrupo = g;
    this.camera.add(g);
  }

  _dibujarPantalla(modo) {
    const ctx = this.pantallaCtx;
    if (!ctx) return;
    ctx.fillStyle = modo === "reposo" ? "#1d1a14" : "#0e151a";
    ctx.fillRect(0, 0, 256, 512);

    if (modo === "reposo") {
      ctx.fillStyle = "#f2c45a";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EN REPOSO", 128, 240);
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#b5a689";
      ctx.fillText("Disfruta del parque", 128, 268);
      ctx.textAlign = "left";
    } else {
      ctx.fillStyle = "#95b2c2";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("03:17", 20, 40);
      ctx.font = "14px sans-serif";
      ctx.fillText("11%", 204, 40);

      const tarjetas = modo === "madre"
        ? [{ col: "#25a35a", t: "Mamá", s: "Ve al parque. Te va a hacer bien ❤" }]
        : [
            { col: "#e1306c", t: "FeedCuántico", s: "340 momentos sin ver" },
            { col: "#ff7a1a", t: "Racha de 900 días", s: "¡No la pierdas hoy!" },
            { col: "#3a86ff", t: "Tiempo hoy", s: "11 h 42 min de pantalla" }
          ];
      tarjetas.forEach((n, idx) => {
        const y = 78 + idx * 92;
        ctx.fillStyle = n.col;
        ctx.fillRect(16, y, 224, 76);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText(n.t, 28, y + 28);
        ctx.font = "13px sans-serif";
        ctx.fillText(n.s, 28, y + 52);
      });
    }
    this.pantallaTex.needsUpdate = true;
  }

  _construirUmbral() {
    const g = new THREE.Group();
    const travertino = new THREE.MeshStandardMaterial({
      map: this.mats.grava.map, color: 0xe2d8c7, roughness: 0.72, metalness: 0.05
    });
    const cristalArq = new THREE.MeshStandardMaterial({
      color: 0xeef7f3, roughness: 0.08, metalness: 0.18, transparent: true, opacity: 0.24,
      envMapIntensity: 1.5, side: THREE.DoubleSide
    });
    const titanio = new THREE.MeshStandardMaterial({ color: 0x1b2420, roughness: 0.28, metalness: 0.82 });
    const laton = new THREE.MeshStandardMaterial({ color: 0xd8b46a, roughness: 0.28, metalness: 0.88 });
    const ledCalido = new THREE.MeshBasicMaterial({ color: 0xffe4a8 });

    // 1. Suelo arquitectónico de piedra travertino + tarimas laterales de roble real
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 10.6), travertino);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.set(0, 0.01, 0.5);
    suelo.receiveShadow = true;
    g.add(suelo);

    [-3.65, 3.65].forEach((lx) => {
      const tarima = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 10.2), this.mats.madera);
      tarima.position.set(lx, 0.02, 0.5);
      tarima.receiveShadow = true;
      g.add(tarima);
    });

    // Tiras LED cálidas empotradas en el suelo guiando la vista hacia la llave y el parque
    [-1.45, 1.45].forEach((gx) => {
      const guia = new THREE.Mesh(new THREE.PlaneGeometry(0.055, 9.6), ledCalido);
      guia.rotation.x = -Math.PI / 2;
      guia.position.set(gx, 0.022, 0.4);
      g.add(guia);
    });

    // 2. Envolvente de cristal templado panorámico
    const muroTras = new THREE.Mesh(new THREE.BoxGeometry(9.6, 4.6, 0.12), cristalArq);
    muroTras.position.set(0, 2.3, 5.75);
    g.add(muroTras);

    const muroL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.6, 10.5), cristalArq);
    muroL.position.set(-4.8, 2.3, 0.5);
    g.add(muroL);

    const muroR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.6, 10.5), cristalArq);
    muroR.position.set(4.8, 2.3, 0.5);
    g.add(muroR);

    const techoCristal = new THREE.Mesh(new THREE.PlaneGeometry(9.8, 10.7), cristalArq);
    techoCristal.rotation.x = Math.PI / 2;
    techoCristal.position.set(0, 4.62, 0.5);
    g.add(techoCristal);

    // 3. Costillas arquitectónicas de titanio oscuro y pérgola de listones de roble (proyectan sombras cálidas)
    for (let i = 0; i < 5; i++) {
      const rz = -4.65 + i * 2.58;
      // Pilares laterales
      [-4.74, 4.74].forEach((rx) => {
        const pilar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.65, 0.24), titanio);
        pilar.position.set(rx, 2.32, rz);
        pilar.castShadow = true;
        g.add(pilar);
        // Detalle vertical en madera de roble interior
        const listonInt = new THREE.Mesh(new THREE.BoxGeometry(0.09, 4.5, 0.14), this.mats.madera);
        listonInt.position.set(rx + (rx < 0 ? 0.14 : -0.14), 2.26, rz);
        listonInt.castShadow = true;
        g.add(listonInt);
      });
      // Viga superior de roble y titanio
      const viga = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.22, 0.22), titanio);
      viga.position.set(0, 4.58, rz);
      viga.castShadow = true;
      g.add(viga);
    }
    // Listones finos de pérgola en el techo para luz tamizada
    for (let s = 0; s < 14; s++) {
      const listonTecho = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.08, 0.11), this.mats.madera);
      listonTecho.position.set(0, 4.46, -4.1 + s * 0.72);
      listonTecho.castShadow = true;
      g.add(listonTecho);
    }

    // Iluminación cálida interior de la cápsula
    const luzCapsula = new THREE.PointLight(0xfff1d6, 0.85, 13);
    luzCapsula.position.set(0, 3.85, 1.2);
    g.add(luzCapsula);

    // 4. Pedestal monolítico escultórico: Obsidiana mate + collar de latón cepillado
    const plinto = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.1, 32), titanio);
    plinto.position.set(0, 0.06, 0.2);
    plinto.receiveShadow = true;
    g.add(plinto);

    const anilloBase = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.014, 12, 48), laton);
    anilloBase.rotation.x = Math.PI / 2;
    anilloBase.position.set(0, 0.11, 0.2);
    g.add(anilloBase);

    const totem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.36, 0.96, 24),
      new THREE.MeshStandardMaterial({ color: 0x131a17, metalness: 0.78, roughness: 0.2 })
    );
    totem.position.set(0, 0.58, 0.2);
    totem.castShadow = true;
    totem.receiveShadow = true;
    g.add(totem);

    // Collar superior de latón cepillado
    const collarLaton = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.016, 12, 40), laton);
    collarLaton.rotation.x = Math.PI / 2;
    collarLaton.position.set(0, 1.05, 0.2);
    g.add(collarLaton);

    // Ranura profunda receptora para insertar el celular verticalmente
    const ranuraBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.055, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x050807, roughness: 0.12, metalness: 0.92 })
    );
    ranuraBase.position.set(0, 1.06, 0.2);
    g.add(ranuraBase);

    // Tira luminosa dentro de la ranura
    this.ranuraLuz = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.045),
      new THREE.MeshBasicMaterial({ color: 0xff8a4c, transparent: true, opacity: 0.92, side: THREE.DoubleSide })
    );
    this.ranuraLuz.rotation.x = -Math.PI / 2;
    this.ranuraLuz.position.set(0, 1.09, 0.2);
    g.add(this.ranuraLuz);

    // Anillo luminoso de estado de la esclusa (ámbar/coral = cerrado, verde esmeralda = desbloqueado)
    this.anilloLlave = new THREE.Mesh(
      new THREE.RingGeometry(0.19, 0.245, 48),
      new THREE.MeshBasicMaterial({ color: 0xff6b4a, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    this.anilloLlave.rotation.x = -Math.PI / 2;
    this.anilloLlave.position.set(0, 1.075, 0.2);
    g.add(this.anilloLlave);

    // Onda expansiva luminosa al encajar el celular
    this.anilloPulso = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.29, 48),
      new THREE.MeshBasicMaterial({ color: 0x4bffa5, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
    );
    this.anilloPulso.rotation.x = -Math.PI / 2;
    this.anilloPulso.position.set(0, 1.082, 0.2);
    g.add(this.anilloPulso);
    this.pulsoT = -1;

    // Luz local del pedestal
    this.luzTotem = new THREE.PointLight(0xff844b, 1.0, 5.5);
    this.luzTotem.position.set(0, 1.45, 0.2);
    g.add(this.luzTotem);

    // Placa holográfica elegante sobre el monolito
    const c = document.createElement("canvas");
    c.width = 512; c.height = 200;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(12, 24, 20, 0.86)";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(10, 10, 492, 180, 26) : ctx.rect(10, 10, 492, 180);
    ctx.fill();
    ctx.strokeStyle = "rgba(216, 180, 106, 0.72)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#d8b46a";
    ctx.font = "700 17px sans-serif";
    ctx.fillText("CÁPSULA DE DESCONEXIÓN · 2050", 256, 54);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 30px sans-serif";
    ctx.fillText("Tu celular es la llave", 256, 106);
    ctx.fillStyle = "#7cf0bd";
    ctx.font = "600 20px sans-serif";
    ctx.fillText("Pulsa [E] para depositarlo y abrir", 256, 152);

    const cartel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.36, 0.54),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide })
    );
    cartel.position.set(0, 1.72, 0.2);
    this.cartelUmbral = cartel;
    g.add(cartel);

    // 5. Puertas correderas de cristal templado con marco fino de titanio y tiras luminosas de estado
    const matPuerta = new THREE.MeshStandardMaterial({
      color: 0xf0f8f5, transparent: true, opacity: 0.42, roughness: 0.08, metalness: 0.2, envMapIntensity: 1.8
    });
    const crearHojaPuerta = (lado) => {
      const hoja = new THREE.Group();
      const vidrio = new THREE.Mesh(new THREE.BoxGeometry(2.36, 4.45, 0.08), matPuerta);
      const bordeExt = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.5, 0.12), titanio);
      bordeExt.position.x = lado * 1.16;
      const bordeInt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.5, 0.11), titanio);
      bordeInt.position.x = -lado * 1.16;
      const tiraLuz = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 4.2, 0.13),
        new THREE.MeshBasicMaterial({ color: 0xff7b4a })
      );
      tiraLuz.position.x = -lado * 1.12;
      hoja.add(vidrio, bordeExt, bordeInt, tiraLuz);
      hoja.userData.tiraLuz = tiraLuz;
      return hoja;
    };

    this.puertaIzq = crearHojaPuerta(-1);
    this.puertaIzq.position.set(-1.2, 2.28, -4.65);
    g.add(this.puertaIzq);

    this.puertaDer = crearHojaPuerta(1);
    this.puertaDer.position.set(1.2, 2.28, -4.65);
    g.add(this.puertaDer);

    // Paneles fijos laterales de cristal junto a las puertas
    [-3.55, 3.55].forEach((px) => {
      const fijo = new THREE.Mesh(new THREE.BoxGeometry(2.3, 4.45, 0.08), cristalArq);
      fijo.position.set(px, 2.28, -4.65);
      g.add(fijo);
    });

    // Dintel arquitectónico con acento en latón
    const dintel = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.34, 0.32), titanio);
    dintel.position.set(0, 4.58, -4.65);
    g.add(dintel);

    // Luz volumétrica dorada que inunda el pabellón hacia adentro al abrir las puertas
    this.hazLuz = new THREE.Group();
    const matHaz = new THREE.MeshBasicMaterial({
      map: this.texBrillo, color: 0xffe596, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    const hazSuelo = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 10.5), matHaz);
    hazSuelo.rotation.x = -Math.PI / 2;
    hazSuelo.position.set(0, 0.04, -1.2);
    const hazAire = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 5.2), matHaz.clone());
    hazAire.position.set(0, 2.35, -4.3);
    const hazRayoL = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 9.2), matHaz.clone());
    hazRayoL.rotation.set(-Math.PI / 2.6, 0.25, 0);
    hazRayoL.position.set(-0.9, 1.5, -2.0);
    const hazRayoR = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 9.2), matHaz.clone());
    hazRayoR.rotation.set(-Math.PI / 2.6, -0.25, 0);
    hazRayoR.position.set(0.9, 1.5, -2.0);
    this.hazLuz.add(hazSuelo, hazAire, hazRayoL, hazRayoR);
    g.add(this.hazLuz);

    this.luzPortal = new THREE.PointLight(0xffe194, 0, 18);
    this.luzPortal.position.set(0, 2.6, -4.2);
    g.add(this.luzPortal);

    this.grupoUmbral = g;
    this.scene.add(g);
  }

  _construirParque() {
    const g = new THREE.Group();
    const { x: cx, z: cz } = CONFIG.mundo.centroParque;

    // 1. Pradera de césped fotográfico PBR con sombras reales
    const pradera = new THREE.Mesh(new THREE.CircleGeometry(76, 64), this.mats.cesped);
    pradera.rotation.x = -Math.PI / 2;
    pradera.position.set(cx, -0.02, cz);
    pradera.receiveShadow = true;
    g.add(pradera);

    // 2. Senderos naturales de grava soleada (con glorietas suaves en los cruces)
    const crearTramoSendero = (x, z, largo, ancho, rotY = 0) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(ancho, largo), this.mats.grava);
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = rotY;
      m.position.set(x, 0.015, z);
      m.receiveShadow = true;
      g.add(m);
    };
    crearTramoSendero(0, -14.5, 20.5, 3.3, 0);          // Salida directa desde el umbral
    crearTramoSendero(-0.6, -35.0, 24.0, 3.0, 0.05);    // Camino central hacia el horizonte
    crearTramoSendero(-5.5, -24.0, 12.5, 2.2, 0.95);    // Ramal hacia la arboleda de robles
    crearTramoSendero(3.6, -26.2, 8.8, 2.1, -0.78);     // Ramal hacia la orilla del estanque

    // Glorietas orgánicas de grava en los cruces y mirador final
    [[0, -24.5, 2.9], [-0.2, -46.8, 3.4]].forEach(([gx, gz, gr]) => {
      const glorieta = new THREE.Mesh(new THREE.CircleGeometry(gr, 28), this.mats.grava);
      glorieta.rotation.x = -Math.PI / 2;
      glorieta.position.set(gx, 0.017, gz);
      glorieta.receiveShadow = true;
      g.add(glorieta);
    });

    // Piedras de borde a lo largo del sendero principal
    for (let i = 0; i < 24; i++) {
      const lado = i % 2 === 0 ? -1 : 1;
      const z = -6.5 - i * 1.75;
      const x = lado * (1.85 + Math.sin(i * 1.3) * 0.25);
      const p = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 + (i % 3) * 0.06, 1), this.mats.piedra);
      p.scale.set(1.2, 0.52, 0.95);
      p.position.set(x, 0.06, z);
      p.rotation.y = i * 1.1;
      p.castShadow = true;
      p.receiveShadow = true;
      g.add(p);
    }

    // 3. Estanque natural reflectante (usa IBL del cielo 360°)
    const est = CONFIG.mundo.estanque;
    const fondoEst = new THREE.Mesh(
      new THREE.CircleGeometry(est.r + 0.5, 40),
      new THREE.MeshStandardMaterial({ color: 0x162b26, roughness: 0.95 })
    );
    fondoEst.rotation.x = -Math.PI / 2;
    fondoEst.position.set(est.x, 0.01, est.z);
    g.add(fondoEst);

    this.agua = new THREE.Mesh(
      new THREE.CircleGeometry(est.r, 48),
      new THREE.MeshStandardMaterial({
        color: 0x3b6e6c, roughness: 0.07, metalness: 0.45,
        transparent: true, opacity: 0.86, envMapIntensity: 1.7
      })
    );
    this.agua.rotation.x = -Math.PI / 2;
    this.agua.position.set(est.x, 0.045, est.z);
    this.agua.receiveShadow = true;
    g.add(this.agua);

    // Piedras de río, juncos y nenúfares en la orilla del estanque
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const rx = est.x + Math.cos(a) * (est.r + 0.15 + Math.sin(i * 2.1) * 0.35);
      const rz = est.z + Math.sin(a) * (est.r + 0.15 + Math.cos(i * 1.7) * 0.35);
      const roca = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32 + (i % 4) * 0.12, 1), this.mats.piedra);
      roca.scale.set(1.3, 0.55, 1.0);
      roca.position.set(rx, 0.12, rz);
      roca.rotation.set(0.1, a, 0.05);
      roca.castShadow = true;
      roca.receiveShadow = true;
      g.add(roca);
    }

    // Nenúfares flotando en el agua
    const matNenufar = new THREE.MeshStandardMaterial({ color: 0x3f7d44, roughness: 0.45, side: THREE.DoubleSide });
    const matFlor = new THREE.MeshStandardMaterial({ color: 0xffeef2, roughness: 0.4 });
    for (let i = 0; i < 16; i++) {
      const a = 2.1 + (i / 16) * 2.8;
      const r = est.r * (0.42 + (i % 5) * 0.11);
      const nx = est.x + Math.cos(a) * r;
      const nz = est.z + Math.sin(a) * r;
      const hoja = new THREE.Mesh(new THREE.CircleGeometry(0.34 + (i % 3) * 0.09, 18, 0.25, Math.PI * 1.85), matNenufar);
      hoja.rotation.x = -Math.PI / 2;
      hoja.rotation.z = i * 0.9;
      hoja.position.set(nx, 0.058, nz);
      g.add(hoja);
      if (i % 4 === 0) {
        const flor = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.11, 7), matFlor);
        flor.rotation.x = Math.PI;
        flor.position.set(nx, 0.11, nz);
        g.add(flor);
      }
    }

    // 4. Árboles botánicos realistas (corteza fotográfica + copas de hojas orgánicas, cero esferas low-poly)
    const arbolesPos = [
      [-9.5, -12.0, 1.15], [9.2, -11.5, 1.05], [-13.5, -24.0, 1.3],
      [-11.0, -35.5, 1.2], [9.5, -42.0, 1.25], [-5.2, -45.0, 1.15],
      [6.8, -48.5, 1.1], [-16.5, -16.5, 1.0], [18.5, -16.0, 1.2],
      [21.5, -36.5, 1.25], [-15.0, -42.0, 1.1], [15.5, -46.0, 1.05],
      [-3.5, -54.0, 1.3], [11.5, -18.5, 0.95]
    ];
    arbolesPos.forEach(([ax, az, esc], idx) => {
      g.add(this._crearArbolRealista(ax, az, esc, idx));
    });

    // 5. Flores silvestres y hojas caídas sobre el césped
    const coloresFlor = [0xfff8dc, 0xffd97d, 0xf2c6de, 0xd8f3dc];
    for (let i = 0; i < 65; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 6 + Math.random() * 28;
      const fx = cx + Math.cos(ang) * rad;
      const fz = cz + Math.sin(ang) * rad;
      if (Math.hypot(fx - est.x, fz - est.z) < est.r + 1.4) continue;
      if (Math.abs(fx) < 2.2 && fz > -46) continue;
      const flor = new THREE.Mesh(
        new THREE.CircleGeometry(0.08 + Math.random() * 0.06, 6),
        new THREE.MeshStandardMaterial({ color: coloresFlor[i % coloresFlor.length], roughness: 0.7, side: THREE.DoubleSide })
      );
      flor.rotation.x = -Math.PI / 2;
      flor.position.set(fx, 0.03, fz);
      g.add(flor);
    }

    // 6. Motas de polvo solar dorado flotando suavemente
    const nPart = 420;
    const posArr = new Float32Array(nPart * 3);
    for (let i = 0; i < nPart * 3; i += 3) {
      posArr[i] = cx + (Math.random() - 0.5) * 76;
      posArr[i + 1] = 0.4 + Math.random() * 6.5;
      posArr[i + 2] = cz + (Math.random() - 0.5) * 76;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    this.particulas = new THREE.Points(
      pGeom,
      new THREE.PointsMaterial({
        map: this.texBrillo, color: 0xffe896, size: 0.34,
        transparent: true, opacity: 0.76, blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    g.add(this.particulas);

    this.grupoParque = g;
    this.scene.add(g);
  }

  _crearArbolRealista(x, z, escala = 1, seed = 0) {
    const arbol = new THREE.Group();
    arbol.position.set(x, 0, z);
    arbol.scale.setScalar(escala);

    // Tronco esculpido con base ensanchada y corteza fotográfica real
    const tronco = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.46, 4.4, 12),
      this.mats.corteza
    );
    tronco.position.y = 2.15;
    tronco.rotation.z = Math.sin(seed * 2.1) * 0.05;
    tronco.castShadow = true;
    tronco.receiveShadow = true;
    arbol.add(tronco);

    // Ramas principales que se abren orgánicamente
    for (let b = 0; b < 4; b++) {
      const ang = (b / 4) * Math.PI * 2 + seed * 0.7;
      const rama = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.17, 2.5, 8),
        this.mats.corteza
      );
      rama.position.set(Math.cos(ang) * 0.65, 4.2 + (b % 2) * 0.35, Math.sin(ang) * 0.65);
      rama.rotation.z = -Math.cos(ang) * 0.65;
      rama.rotation.x = Math.sin(ang) * 0.65;
      rama.castShadow = true;
      arbol.add(rama);
    }

    // Copa botánica formada por múltiples planos cruzados de hojas reales con alfa
    const posicionesCopa = [
      [0, 5.4, 0, 4.6], [-1.3, 4.8, 0.8, 3.6], [1.4, 4.9, -0.7, 3.7],
      [0.4, 5.1, 1.3, 3.5], [-0.9, 5.3, -1.2, 3.4], [0.2, 6.2, 0.1, 3.8]
    ];
    posicionesCopa.forEach(([cx, cy, cz, tam], i) => {
      for (let k = 0; k < 2; k++) {
        const plano = new THREE.Mesh(new THREE.PlaneGeometry(tam, tam), this.mats.follaje);
        plano.position.set(cx, cy, cz);
        plano.rotation.y = (i * 0.9) + k * (Math.PI / 2);
        plano.rotation.x = (k === 0 ? 0.18 : -0.15);
        plano.castShadow = true;
        plano.receiveShadow = true;
        arbol.add(plano);
      }
    });

    return arbol;
  }

  _crearBancoRoble() {
    const banco = new THREE.Group();
    // Listones de roble para asiento y respaldo
    for (let i = 0; i < 4; i++) {
      const liston = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.055, 0.11), this.mats.madera);
      liston.position.set(0, 0.48, -0.17 + i * 0.125);
      liston.castShadow = true; liston.receiveShadow = true;
      banco.add(liston);
    }
    for (let i = 0; i < 3; i++) {
      const resp = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.11, 0.05), this.mats.madera);
      resp.position.set(0, 0.66 + i * 0.13, -0.26 - i * 0.025);
      resp.rotation.x = -0.18;
      resp.castShadow = true; resp.receiveShadow = true;
      banco.add(resp);
    }
    // Patas y reposabrazos de hierro forjado oscuro
    [-0.78, 0.78].forEach((px) => {
      const pataF = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.06), this.mats.hierro);
      pataF.position.set(px, 0.24, 0.2); pataF.castShadow = true;
      const pataB = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.98, 0.06), this.mats.hierro);
      pataB.position.set(px, 0.49, -0.25); pataB.rotation.x = -0.12; pataB.castShadow = true;
      const brazo = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.52), this.mats.hierro);
      brazo.position.set(px, 0.66, -0.02); brazo.castShadow = true;
      banco.add(pataF, pataB, brazo);
    });
    return banco;
  }

  _crearCarta(colorSello) {
    const carta = new THREE.Group();
    const hoja = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.012, 0.31), this.mats.papel);
    hoja.castShadow = true; hoja.receiveShadow = true;
    const sello = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.016, 16),
      new THREE.MeshStandardMaterial({ color: colorSello, roughness: 0.35, metalness: 0.1, emissive: colorSello, emissiveIntensity: 0.35 })
    );
    sello.position.set(0, 0.008, 0.03);
    carta.add(hoja, sello);
    return carta;
  }

  _crearHojaOrganica(colorHex) {
    const h = new THREE.Mesh(
      new THREE.CircleGeometry(0.11, 7),
      new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.65, side: THREE.DoubleSide })
    );
    h.scale.set(1.45, 0.72, 1);
    h.rotation.x = -Math.PI / 2;
    return h;
  }

  _construirLumen() {
    const g = new THREE.Group();
    const core = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.texBrillo, color: 0xfff8d6, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    core.scale.set(0.95, 0.95, 1);
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.texBrillo, color: 0xf6cf6b, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    halo.scale.set(1.9, 1.9, 1);
    const anillo = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.48, 36),
      new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0.55, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    anillo.rotation.x = Math.PI / 2.4;
    g.add(core, halo, anillo);
    g.position.set(0, 1.75, -2.5);
    g.visible = false;
    g.userData = { halo, anillo };
    this.lumen = g;
    this.scene.add(g);
  }

  async _cargarHuellas() {
    this.orbes.forEach((o) => this.scene.remove(o.grupo));
    this.orbes = [];
    const lista = await Almacen.obtenerHuellas();
    lista.forEach((h) => this._crearOrbe(h));
    this._actualizarContador();
  }

  // Recuerdo integrado físicamente en un objeto real del parque (banco, árbol, carta, farol, barquito, hojas)
  _crearOrbe(h) {
    const emo = CONFIG.emociones[h.emocion] || CONFIG.emociones.gratitud;
    const g = new THREE.Group();
    g.position.set(h.pos.x, 0, h.pos.z);

    let luzY = 0.75;
    let flotante = null;
    const tipo = h.objeto || "carta_hojas";

    if (tipo === "banco_carta" || tipo === "banco_cuaderno" || tipo === "banco_horizonte") {
      const banco = this._crearBancoRoble();
      banco.rotation.y = tipo === "banco_horizonte" ? 0 : (h.pos.x > 0 ? -Math.PI / 2.2 : Math.PI / 2.2);
      g.add(banco);

      const reliquia = this._crearCarta(emo.luz);
      reliquia.position.set(0.22, 0.525, 0.02);
      reliquia.rotation.y = 0.32;
      banco.add(reliquia);

      // Hojas caídas alrededor del banco
      for (let i = 0; i < 5; i++) {
        const hoja = this._crearHojaOrganica(i % 2 === 0 ? 0xd99b43 : 0xc46d3b);
        hoja.position.set((Math.random() - 0.5) * 1.9, 0.025, (Math.random() - 0.5) * 1.5);
        hoja.rotation.z = Math.random() * 6;
        g.add(hoja);
      }
      luzY = 0.85;
    } else if (tipo === "roble_nota") {
      const arbol = this._crearArbolRealista(0, 0, 1.25, 7);
      g.add(arbol);
      const nota = this._crearCarta(emo.luz);
      nota.position.set(0.32, 1.38, 0.28);
      nota.rotation.set(Math.PI / 2, 0, -0.55);
      g.add(nota);
      for (let i = 0; i < 8; i++) {
        const hoja = this._crearHojaOrganica(i % 2 === 0 ? 0xe08e45 : 0xb85c38);
        const a = (i / 8) * Math.PI * 2;
        hoja.position.set(Math.cos(a) * (0.8 + Math.random() * 0.8), 0.03, Math.sin(a) * (0.8 + Math.random() * 0.8));
        g.add(hoja);
      }
      luzY = 1.45;
    } else if (tipo === "muelle_farol") {
      // Pequeño muelle de madera hacia el estanque + farol cálido de cristal
      for (let i = 0; i < 7; i++) {
        const tabla = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.07, 0.34), this.mats.madera);
        tabla.position.set(0.4 + i * 0.38, 0.24, 0);
        tabla.rotation.y = Math.PI / 2;
        tabla.castShadow = true; tabla.receiveShadow = true;
        g.add(tabla);
      }
      const farol = new THREE.Group();
      const baseF = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.06, 12), this.mats.hierro);
      const cristalF = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.28, 12),
        new THREE.MeshStandardMaterial({ color: 0xfff5d6, emissive: emo.luz, emissiveIntensity: 0.9, transparent: true, opacity: 0.88 })
      );
      cristalF.position.y = 0.17;
      const tapaF = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.1, 12), this.mats.hierro);
      tapaF.position.y = 0.35;
      farol.add(baseF, cristalF, tapaF);
      farol.position.set(1.2, 0.3, 0.45);
      g.add(farol);
      luzY = 0.72;
    } else if (tipo === "barco_papel") {
      // Barquito de papel origami flotando sobre el agua
      const barco = new THREE.Group();
      const casco = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.14, 4), this.mats.papel);
      casco.rotation.x = Math.PI; casco.scale.set(1.4, 1, 0.7);
      const vela = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 3), this.mats.papel);
      vela.position.y = 0.13;
      barco.add(casco, vela);
      barco.position.set(0, 0.12, 0);
      g.add(barco);
      flotante = barco;
      luzY = 0.45;
    } else if (tipo === "tocon_altavoz") {
      // Tocón con corteza real + pequeño altavoz acústico retro
      const tocon = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.56, 14), this.mats.corteza);
      tocon.position.y = 0.28; tocon.castShadow = true; tocon.receiveShadow = true;
      const altavoz = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.16), this.mats.madera);
      altavoz.position.set(0, 0.67, 0); altavoz.rotation.y = -0.45; altavoz.castShadow = true;
      const cono = new THREE.Mesh(new THREE.CircleGeometry(0.075, 16), this.mats.hierro);
      cono.position.set(0, 0.67, 0.085); cono.rotation.y = -0.45;
      g.add(tocon, altavoz, cono);
      luzY = 0.95;
    } else if (tipo === "estanque_nenufar") {
      // Piedras lisas de orilla + nenúfar luminoso con flor de loto
      const roca = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 1), this.mats.piedra);
      roca.scale.set(1.4, 0.48, 1.1); roca.position.set(-0.3, 0.14, 0);
      roca.castShadow = true; roca.receiveShadow = true;
      const hojaN = new THREE.Mesh(
        new THREE.CircleGeometry(0.46, 20, 0.2, Math.PI * 1.85),
        new THREE.MeshStandardMaterial({ color: 0x3f8a4b, roughness: 0.4, side: THREE.DoubleSide })
      );
      hojaN.rotation.x = -Math.PI / 2; hojaN.position.set(0.55, 0.07, 0.1);
      const loto = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.14, 7),
        new THREE.MeshStandardMaterial({ color: 0xfff0f5, emissive: emo.luz, emissiveIntensity: 0.45 })
      );
      loto.rotation.x = Math.PI; loto.position.set(0.55, 0.16, 0.1);
      g.add(roca, hojaN, loto);
      flotante = loto;
      luzY = 0.55;
    } else {
      // Piedra plana de jardín + carta/sobre manuscrito + hojas otoñales (sobre_sendero, piedras_hojas o huella nueva)
      const piedra = new THREE.Mesh(new THREE.DodecahedronGeometry(0.46, 1), this.mats.piedra);
      piedra.scale.set(1.35, 0.42, 1.15);
      piedra.position.y = 0.14;
      piedra.castShadow = true; piedra.receiveShadow = true;
      g.add(piedra);

      const carta = this._crearCarta(emo.luz);
      carta.position.set(0, 0.34, 0);
      carta.rotation.y = 0.4;
      g.add(carta);

      for (let i = 0; i < 6; i++) {
        const hoja = this._crearHojaOrganica(i % 2 === 0 ? 0xe0a94d : 0x76a856);
        const a = (i / 6) * Math.PI * 2;
        hoja.position.set(Math.cos(a) * 0.72, 0.025, Math.sin(a) * 0.72);
        hoja.rotation.z = a;
        g.add(hoja);
      }
      luzY = 0.68;
    }

    // Luz integrada suavemente en el objeto (halo etéreo + partículas + punto de luz local)
    const auraGrupo = new THREE.Group();
    auraGrupo.position.y = luzY;

    const spriteCore = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.texBrillo, color: 0xffffff, transparent: true, opacity: 0.72,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    spriteCore.scale.set(0.48, 0.48, 1);

    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this.texBrillo, color: emo.luz, transparent: true, opacity: 0.56,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    halo.scale.set(1.45, 1.45, 1);

    // Hitbox invisible generosa para interactuar fácilmente con [E]
    const nucleo = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 8, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    auraGrupo.add(spriteCore, halo, nucleo);

    // Motas doradas/luciérnagas naciendo desde el objeto
    const nP = 18;
    const pPos = new Float32Array(nP * 3);
    for (let i = 0; i < nP * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 1.15;
      pPos[i + 1] = Math.random() * 1.25 - 0.2;
      pPos[i + 2] = (Math.random() - 0.5) * 1.15;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      map: this.texBrillo, color: emo.luz, size: 0.2,
      transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const polvo = new THREE.Points(pGeo, pMat);
    auraGrupo.add(polvo);

    g.add(auraGrupo);
    this.scene.add(g);

    const obj = {
      id: h.id, datos: h, grupo: g, auraGrupo, flotante,
      nucleo, halo, spriteCore, polvo, baseY: luzY, fase: Math.random() * 6.28
    };
    this.orbes.push(obj);
    return obj;
  }

  /* ------------------------------------------------------------------------
     HISTORIA: ACTOS I, II, III, IV Y EPÍLOGO
     ------------------------------------------------------------------------ */
  _mostrarTitulo() {
    this.estado = "TITULO";
    this.puedeMoverse = false;
    this.manoGrupo.visible = false;
    const prog = Almacen.progreso();
    if (prog.historiaCompleta) this.dom.btnIrParque.classList.remove("oculto");
  }

  _irDirectoAlParque() {
    this.audio.iniciar();
    this.audio.modoAislamiento(false);
    this.dom.pantallaTitulo.classList.add("salir");
    setTimeout(() => this.dom.pantallaTitulo.classList.add("oculto"), 1400);

    this._mostrarEscena("PARQUE");
    if (this.mat360 && this.texturaParque) {
      this.mat360.map = this.texturaParque;
      this.mat360.needsUpdate = true;
      this.scene.background = this.texturaParque;
    }

    this.celularEntregado = true;
    this.puertasAbiertas = true;
    this.aperturaT = 1;
    this.puertaIzq.position.x = -3.55;
    this.puertaDer.position.x = 3.55;
    this.manoGrupo.visible = false;
    this.lumen.visible = true;
    this.lumen.position.set(4, 2.1, -18);

    this.camera.up.set(0, 1, 0);
    this.camera.position.set(0, CONFIG.mundo.alturaOjos, -8);
    this.yaw = 0; this.pitch = 0;
    this.camera.rotation.set(0, 0, 0, "YXZ");
    this._aplicarRotacion();
    this._entrarModoParque();
  }

  async _comenzarHistoria() {
    this.audio.iniciar();
    this.dom.pantallaTitulo.classList.add("salir");
    setTimeout(() => this.dom.pantallaTitulo.classList.add("oculto"), 1400);

    // Acto I: Aislamiento y sobrecarga sensorial en la habitación 2050 (Fotósfera 360 pura, sin cortes)
    this.estado = "CINE";
    this.cineAbort = new AbortController();
    const sig = this.cineAbort.signal;

    document.body.classList.add("cine");
    this.dom.vineta.classList.add("activa");
    this.dom.glitch.classList.add("activo");
    this.audio.modoAislamiento(true);

    this._mostrarEscena("HABITACION");
    if (this.mat360 && this.texturaHabitacion) {
      this.mat360.map = this.texturaHabitacion;
      this.mat360.needsUpdate = true;
      this.scene.background = this.texturaHabitacion;
    }

    this.hemi.intensity = 0.65;
    this.sol.intensity = 0.4;

    this.camera.up.set(0, 1, 0);
    this.camera.position.set(0, 1.55, 0);
    this.yaw = 0; this.pitch = -0.04;
    this.camera.rotation.set(-0.04, 0, 0, "YXZ");
    this._aplicarRotacion();
    this.manoGrupo.visible = true;
    this._dibujarPantalla("aislamiento");

    try {
      await this._mostrarCapitulo("2050", "LA SOBRECARGA", sig);

      // Ráfaga acelerada de notificaciones neuronales (~5.5s de caos)
      let count = 0;
      const notifTimer = setInterval(() => {
        if (sig.aborted || count >= 10) { clearInterval(notifTimer); return; }
        this._spawnNotif();
        this.audio.tocarNotif();
        count++;
      }, 480);

      for (const l of CONFIG.guion.aislamiento) await this._subtitulo(l.t, l.d, sig);
      clearInterval(notifTimer);

      // Silencio súbito: el ruido digital colapsa
      this._limpiarNotifs();
      this.audio.modoAislamiento(false);
      this.dom.glitch.classList.remove("activo");

      // Notificación salvadora de la madre
      this._dibujarPantalla("madre");
      this.audio.tocarCampana();
      this._spawnNotif({ ico: "❤", col: "#25a35a", t: "Mamá", s: "Hay un parque donde dejas el celular como llave. Ve. Te va a hacer bien." }, true);
      await this._subtitulo(CONFIG.guion.mensajeMadre, 3600, sig);
      for (const l of CONFIG.guion.decision) await this._subtitulo(l.t, l.d, sig);
    } catch (_) {
      // Saltado por el usuario
      this._limpiarNotifs();
    }

    // Transición al Acto II (El Umbral del Santuario)
    await this._fundido(true, false);
    document.body.classList.remove("cine");
    this.dom.vineta.classList.remove("activa");
    this.dom.glitch.classList.remove("activo");
    this.dom.subtitulos.classList.remove("visible");

    // Mostrar pabellón del umbral y panorama 360 del parque
    this._mostrarEscena("UMBRAL");
    if (this.mat360 && this.texturaParque) {
      this.mat360.map = this.texturaParque;
      this.mat360.needsUpdate = true;
      this.scene.background = this.texturaParque;
    }

    this.hemi.intensity = 1.15;
    this.sol.intensity = 1.25;
    this.audio.modoAislamiento(false);

    this.camera.up.set(0, 1, 0);
    this.camera.position.set(0, CONFIG.mundo.alturaOjos, 3.2);
    this.yaw = 0; this.pitch = 0;
    this.camera.rotation.set(0, 0, 0, "YXZ");
    this._aplicarRotacion();
    this._dibujarPantalla("aislamiento");
    this.manoGrupo.visible = true;

    await this._fundido(false, false);

    this.estado = "UMBRAL";
    this.puedeMoverse = true;
    this.dom.hud.classList.add("visible");
    this._setObjetivo("ACTO II · EL UMBRAL", "El celular es la llave", "Acércate al pedestal y pulsa [E] para depositarlo");

    for (const l of CONFIG.guion.viaje) {
      if (this.celularEntregado) break;
      await this._subtitulo(l.t, l.d, new AbortController().signal).catch(() => {});
    }
  }

  _spawnNotif(dato, centrada = false) {
    const n = dato || CONFIG.notificaciones[Math.floor(Math.random() * CONFIG.notificaciones.length)];
    const el = document.createElement("div");
    el.className = "notif";
    el.style.left = centrada ? "calc(50% - 145px)" : `${6 + Math.random() * 68}%`;
    el.style.top = centrada ? "22%" : `${12 + Math.random() * 58}%`;
    el.innerHTML = `<div class="ico" style="background:${n.col}">${n.ico}</div><div><b>${n.t}</b><small>${n.s}</small></div>`;
    this.dom.notifs.appendChild(el);
    this.audio.tocarNotif();
    setTimeout(() => {
      el.classList.add("salir");
      setTimeout(() => el.remove(), 600);
    }, centrada ? 4200 : 2600);
  }

  _limpiarNotifs() {
    this.dom.notifs.innerHTML = "";
  }

  async _depositarCelular() {
    if (this.celularEntregado) return;
    this.celularEntregado = true;
    this.focoCaja = false;
    this.puedeMoverse = false;
    this.dom.prompt.classList.remove("visible");
    this.dom.mira.classList.remove("foco");
    this.dom.subtitulos.classList.remove("visible");

    // Helper para animaciones suavizadas
    const animar = (ms, fn) => new Promise((res) => {
      const t0 = performance.now();
      const paso = (now) => {
        const k = Math.min(1, (now - t0) / ms);
        const ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        fn(k, ease);
        if (k < 1) requestAnimationFrame(paso);
        else res();
      };
      requestAnimationFrame(paso);
    });

    // Fase 1: Enfocar suavemente la cámara hacia el pedestal y acercar la mano
    const camPos0 = this.camera.position.clone();
    const camPosObj = new THREE.Vector3(0, 1.56, 1.55);
    const yaw0 = this.yaw, pitch0 = this.pitch;
    const manoP0 = this.manoGrupo.position.clone();

    await animar(650, (k, e) => {
      this.camera.position.lerpVectors(camPos0, camPosObj, e);
      this.yaw = yaw0 * (1 - e);
      this.pitch = pitch0 + (-0.28 - pitch0) * e;
      this._aplicarRotacion();
      this.manoGrupo.position.set(
        manoP0.x * (1 - e * 0.7),
        manoP0.y - 0.08 * e,
        manoP0.z - 0.24 * e
      );
    });

    // Crear el celular 3D independiente para la animación visible de inserción en la ranura
    const celAnim = new THREE.Group();
    const chasis = new THREE.Mesh(
      new THREE.BoxGeometry(0.145, 0.27, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x161d1a, metalness: 0.85, roughness: 0.18 })
    );
    const pantMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.132, 0.254),
      new THREE.MeshBasicMaterial({ map: this.pantallaTex })
    );
    pantMesh.position.z = 0.008;
    celAnim.add(chasis, pantMesh);
    celAnim.position.set(0.08, 1.38, 0.72);
    celAnim.rotation.set(-0.35, -0.18, 0.08);
    this.scene.add(celAnim);

    this.manoGrupo.visible = false;
    this.camera.remove(this.manoGrupo);

    // Fase 2: El celular vuela suavemente sobre la ranura iluminada y se alinea verticalmente
    await animar(550, (k, e) => {
      celAnim.position.set(
        0.08 * (1 - e),
        1.38 + Math.sin(k * Math.PI) * 0.12 + 0.04 * e,
        0.72 + (0.2 - 0.72) * e
      );
      celAnim.rotation.set(-0.35 * (1 - e), -0.18 * (1 - e), 0.08 * (1 - e));
    });

    // Fase 3: El celular desciende lentamente DENTRO de la ranura y se guarda como llave
    await animar(650, (k, e) => {
      celAnim.position.y = 1.42 - 0.44 * e; // Entra y se hunde casi por completo en el monolito
      if (k > 0.55) this._dibujarPantalla("reposo");
    });

    // Pestillo electromagnético + cambio de luz a verde esmeralda + onda expansiva
    this.audio.tocarLlaveBloqueo();
    if (this.anilloLlave) this.anilloLlave.material.color.setHex(0x33ff99);
    if (this.ranuraLuz) this.ranuraLuz.material.color.setHex(0x33ff99);
    if (this.puertaIzq && this.puertaIzq.userData.tiraLuz) this.puertaIzq.userData.tiraLuz.material.color.setHex(0x33ff99);
    if (this.puertaDer && this.puertaDer.userData.tiraLuz) this.puertaDer.userData.tiraLuz.material.color.setHex(0x33ff99);
    if (this.luzTotem) {
      this.luzTotem.color.setHex(0x33ff99);
      this.luzTotem.intensity = 2.4;
    }
    this.pulsoT = 0; // Dispara la onda luminosa expansiva en _loop()

    await this._esperar(380);

    // Fase 4: Las compuertas se abren y la luz dorada del parque inunda el interior
    if (this.cartelUmbral) this.cartelUmbral.visible = false;
    this.puertasAbiertas = true;
    this.audio.tocarPuerta();
    if (this.dom.destelloLuz) this.dom.destelloLuz.classList.add("activo");

    // Elevar suavemente la mirada hacia las puertas que se abren con el resplandor entrando
    await animar(1250, (k, e) => {
      this.pitch = -0.28 + (0.04 - (-0.28)) * e;
      this.camera.fov = 66 + Math.sin(k * Math.PI) * 3.5;
      this.camera.updateProjectionMatrix();
      this._aplicarRotacion();
    });
    if (this.dom.destelloLuz) this.dom.destelloLuz.classList.remove("activo");

    // Acto III: Lumen emerge suavemente de la luz dorada con diálogo centrado y resumido
    this.lumen.visible = true;
    this.lumen.position.set(0, 1.65, -2.5);
    this.lumen.scale.set(0.01, 0.01, 0.01);
    await animar(550, (k, e) => {
      const s = 0.01 + 0.99 * e;
      this.lumen.scale.set(s, s, s);
    });

    this.estado = "TUTORIAL";
    this._setObjetivo("ACTO III · LUMEN", "Escucha la bienvenida", "Pulsa [E] para avanzar");

    this._iniciarDialogo(CONFIG.guion.tutorial, () => {
      Almacen.guardarProgreso({ historiaCompleta: true });
      this._entrarModoParque();
      this._mostrarCapitulo("SANTUARIO", "EL PARQUE DE LAS MEMORIAS", new AbortController().signal).catch(() => {});
    });
  }

  _entrarModoParque() {
    this.estado = "PARQUE";
    this.puedeMoverse = true;
    this.dom.hud.classList.add("visible");
    this.dom.btnNuevaHuella.classList.remove("oculto");
    this._setObjetivo("SANTUARIO DE DESCONEXIÓN", "Recorre los senderos y pulsa [E]", "Pulsa [N] cuando quieras dejar tu propia memoria");
  }

  /* ------------------------------------------------------------------------
     DIÁLOGO DE LUMEN
     ------------------------------------------------------------------------ */
  _iniciarDialogo(lineas, alTerminar) {
    this.dlgCola = lineas;
    this.dlgIdx = 0;
    this.dlgCallback = alTerminar;
    this.dom.dialogo.classList.add("visible");
    this._mostrarLineaDialogo();
  }

  _mostrarLineaDialogo() {
    clearInterval(this.dlgTimer);
    const linea = this.dlgCola[this.dlgIdx];
    this.dom.dlgTexto.textContent = "";
    this.dom.dlgPie.classList.remove("listo");
    if (this.dom.dlgProgreso) {
      this.dom.dlgProgreso.innerHTML = this.dlgCola
        .map((_, idx) => `<span class="${idx === this.dlgIdx ? "activo" : ""}"></span>`)
        .join("");
    }
    this.dlgEscribiendo = true;
    let i = 0;
    this.dlgTimer = setInterval(() => {
      this.dom.dlgTexto.textContent += linea[i++];
      if (i % 4 === 0) this.audio.tocarLumenVoz();
      if (i >= linea.length) {
        clearInterval(this.dlgTimer);
        this.dlgEscribiendo = false;
        this.dom.dlgPie.classList.add("listo");
      }
    }, 15);
  }

  _avanzarDialogo() {
    if (this.estado !== "TUTORIAL") return;
    if (this.dlgEscribiendo) {
      clearInterval(this.dlgTimer);
      this.dom.dlgTexto.textContent = this.dlgCola[this.dlgIdx];
      this.dlgEscribiendo = false;
      this.dom.dlgPie.classList.add("listo");
      return;
    }
    this.dlgIdx++;
    if (this.dlgIdx < this.dlgCola.length) {
      this._mostrarLineaDialogo();
    } else {
      this.dom.dialogo.classList.remove("visible");
      if (this.dlgCallback) this.dlgCallback();
    }
  }

  /* ------------------------------------------------------------------------
     MODALES: VER HUELLA, CREAR HUELLA (BUSCADOR YT) Y PAUSA
     ------------------------------------------------------------------------ */
  _iniciarModales() {
    // Emociones en formulario
    this.dom.mcEmociones.innerHTML = "";
    Object.values(CONFIG.emociones).forEach((em) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "emo" + (em.id === this.emocionElegida ? " sel" : "");
      b.style.color = em.hex;
      b.innerHTML = `<span class="s">${em.simbolo}</span><span class="n">${em.label}</span>`;
      b.addEventListener("click", () => {
        this.dom.mcEmociones.querySelectorAll(".emo").forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel");
        this.emocionElegida = em.id;
      });
      this.dom.mcEmociones.appendChild(b);
    });

    // Buscador de YouTube
    this.buscadorYT = new BuscadorYouTube(this.dom, () => {});

    // Grabadora
    this.dom.mcGrabar.addEventListener("click", async () => {
      if (!this.grabadora.grabando) {
        const r = await this.grabadora.iniciar();
        if (r.ok) {
          this.dom.mcGrabar.classList.add("grabando");
          this.dom.mcGrabEstado.textContent = "Grabando… pulsa otra vez para detener";
        } else {
          this._toast(r.msg);
        }
      } else {
        this.grabadora.detener();
        this.dom.mcGrabar.classList.remove("grabando");
        this.dom.mcGrabEstado.textContent = "Nota de voz lista";
        setTimeout(() => {
          if (this.grabadora.dataUrl) {
            this.dom.mcAudioPrev.src = this.grabadora.dataUrl;
            this.dom.mcAudioPrev.classList.remove("oculto");
            this.dom.mcBorrarVoz.classList.remove("oculto");
          }
        }, 200);
      }
    });
    this.dom.mcBorrarVoz.addEventListener("click", () => {
      this.grabadora.limpiar();
      this.dom.mcAudioPrev.classList.add("oculto");
      this.dom.mcBorrarVoz.classList.add("oculto");
      this.dom.mcGrabEstado.textContent = "Nota eliminada";
    });

    // Envío de nueva huella
    this.dom.formCrear.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.buscadorYT.seleccionada) {
        this._toast("Elige o busca una canción de YouTube antes de dejar tu huella.");
        return;
      }
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      dir.y = 0; dir.normalize();

      const nueva = {
        id: "h-" + Date.now(),
        emocion: this.emocionElegida,
        titulo: this.dom.mcTitulo.value.trim(),
        autor: this.dom.mcAutor.value.trim() || "Anónimo",
        fecha: new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
        texto: this.dom.mcTexto.value.trim(),
        youtubeId: this.buscadorYT.seleccionada.id,
        cancion: `${this.buscadorYT.seleccionada.artista} — ${this.buscadorYT.seleccionada.titulo}`,
        audio: this.grabadora.dataUrl || null,
        pos: {
          x: Number((this.camera.position.x + dir.x * 2.6).toFixed(2)),
          y: Number((1.5 + Math.random() * 0.6).toFixed(2)),
          z: Number((this.camera.position.z + dir.z * 2.6).toFixed(2))
        }
      };

      await Almacen.guardarHuella(nueva);
      this._crearOrbe(nueva);
      this._actualizarContador();
      this.audio.tocarCampana();
      this._cerrarModalCrear();

      this.dom.formCrear.reset();
      this.grabadora.limpiar();
      this.dom.mcAudioPrev.classList.add("oculto");
      this.dom.mcBorrarVoz.classList.add("oculto");
      this.buscadorYT.reset();

      if (!Almacen.progreso().huellaPropia) {
        Almacen.guardarProgreso({ huellaPropia: true });
        this._lanzarEpilogo();
      } else {
        this._toast("✦ Tu huella ya brilla en el parque.");
      }
    });

    // Botones de título, modales y pausa
    this.dom.btnEmpezar.addEventListener("click", () => this._comenzarHistoria());
    this.dom.btnIrParque.addEventListener("click", () => this._irDirectoAlParque());
    this.dom.btnNuevaHuella.addEventListener("click", () => this._abrirModalCrear());
    this.dom.btnPausa.addEventListener("click", () => this._abrirPausa());

    this.dom.mhCerrar.addEventListener("click", () => this._cerrarModalHuella());
    this.dom.mhCerrarBtn.addEventListener("click", () => this._cerrarModalHuella());
    this.dom.mcCerrar.addEventListener("click", () => this._cerrarModalCrear());
    this.dom.mcCancelar.addEventListener("click", () => this._cerrarModalCrear());
    this.dom.mpCerrar.addEventListener("click", () => this._cerrarPausa());
    this.dom.mpReanudar.addEventListener("click", () => this._cerrarPausa());

    this.dom.mpReiniciar.addEventListener("click", () => location.reload());
    this.dom.mpBorrar.addEventListener("click", async () => {
      if (confirm("¿Borrar las huellas que creaste y reiniciar tu progreso de escucha?")) {
        await Almacen.borrarPropias();
        this.escuchadas = new Set();
        await this._cargarHuellas();
        this._toast("Huellas propias borradas.");
      }
    });

    // Ajustes persistentes
    const aj = Almacen.ajustes();
    this.dom.ajVol.value = aj.volumen;
    this.dom.ajVolVal.textContent = `${Math.round(aj.volumen * 100)}%`;
    this.audio.setVolumen(aj.volumen);

    this.dom.ajSens.value = aj.sensibilidad;
    this.dom.ajSensVal.textContent = `${aj.sensibilidad.toFixed(1)}×`;
    this.dom.ajApiKey.value = aj.apiKey || "";

    this.dom.ajVol.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      this.dom.ajVolVal.textContent = `${Math.round(v * 100)}%`;
      this.audio.setVolumen(v);
      Almacen.guardarAjustes({ volumen: v });
    });
    this.dom.ajSens.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      this.dom.ajSensVal.textContent = `${v.toFixed(1)}×`;
      Almacen.guardarAjustes({ sensibilidad: v });
    });
    this.dom.ajApiKey.addEventListener("change", (e) => {
      Almacen.guardarAjustes({ apiKey: e.target.value.trim() });
      this._toast("API Key guardada.");
    });

    // Botones de respuesta a la Resonancia Emocional post-huella
    document.querySelectorAll(".res-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tipo = e.currentTarget.getAttribute("data-r");
        this._responderResonancia(tipo);
      });
    });
  }

  _abrirHuella(orbe) {
    const h = orbe.datos;
    this.huellaActiva = h;
    const emo = CONFIG.emociones[h.emocion] || CONFIG.emociones.gratitud;
    this.estadoPrevio = this.estado;
    this.estado = "MODAL";
    this.puedeMoverse = false;
    if (document.pointerLockElement) document.exitPointerLock();

    this.dom.mhChip.textContent = `${emo.simbolo} ${emo.label}`;
    this.dom.mhChip.style.background = emo.hex;
    if (this.dom.mhCaja) this.dom.mhCaja.style.setProperty("--emo-color", emo.hex);
    if (this.dom.mhLugar) this.dom.mhLugar.textContent = h.lugar || "Rincón del santuario";
    this.dom.mhTitulo.textContent = h.titulo;
    this.dom.mhMeta.textContent = `${h.autor} · ${h.fecha || "2050"}`;
    this.dom.mhTexto.textContent = h.texto;
    this.dom.mhCancion.textContent = h.cancion || "";
    this.dom.mhYtLink.href = YT.enlace(h.youtubeId);

    if (h.audio) {
      this.dom.mhVoz.classList.remove("oculto");
      this.dom.mhAudio.src = h.audio;
    } else {
      this.dom.mhVoz.classList.add("oculto");
      this.dom.mhAudio.src = "";
    }

    this.dom.mhYt.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = YT.embed(h.youtubeId, true);
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    this.dom.mhYt.appendChild(iframe);

    this.audio.silenciar(true);
    this.dom.modalHuella.classList.add("abierto");

    this.escuchadas = Almacen.marcarEscuchada(h.id);
    this._actualizarContador();
  }

  _cerrarModalHuella() {
    this.dom.mhYt.innerHTML = "";
    this.dom.mhAudio.pause();
    this.dom.mhAudio.src = "";
    this.dom.modalHuella.classList.remove("abierto");
    this.audio.silenciar(false);
    this.estado = "PARQUE";
    this.puedeMoverse = true;
    this._reactivarCamara();

    if (!this.tresCelebrado && this.escuchadas.size >= 3) {
      this.tresCelebrado = true;
      this._toast(CONFIG.guion.tresEscuchadas, 7500);
      this._setObjetivo("TU TURNO", "Pulsa [N] para dejar tu huella", "Busca una canción en YouTube y cuenta lo que sientes");
    }
  }

  _reactivarCamara() {
    this.ultimoMouse = null;
    try { window.focus(); } catch (_) {}
    try { this.dom.canvas.focus({ preventScroll: true }); } catch (_) {}
    if (!this.pointerLock && (this.estado === "UMBRAL" || this.estado === "PARQUE")) {
      try {
        const p = this.dom.canvas.requestPointerLock();
        if (p && p.catch) p.catch(() => {});
      } catch (_) {}
    }
  }

  /* ------------------------------------------------------------------------
     RESONANCIA EMOCIONAL POST-HUELLA
     ------------------------------------------------------------------------ */
  _mostrarResonancia(h) {
    if (!h || !this.dom.resonancia) return;
    clearTimeout(this.resTimer);

    const emo = CONFIG.emociones[h.emocion] || CONFIG.emociones.gratitud;
    const preg = CONFIG.generarPregunta(h);

    this.dom.resHalo.style.background = `radial-gradient(circle, ${emo.hex}66, transparent 70%)`;
    this.dom.resIcono.textContent = emo.simbolo;
    this.dom.resIcono.style.color = emo.hex;
    this.dom.resHuellaTit.textContent = `${h.titulo} · ${h.autor}`;
    this.dom.resPregunta.textContent = preg;

    // Resetear opciones a su estado interactivo
    this.dom.resOpciones.classList.remove("oculto");
    this.dom.resOpciones.style.display = "";
    this.dom.resConfirmacion.classList.add("oculto");

    this.dom.resonancia.classList.remove("res-oculto");
    requestAnimationFrame(() => {
      this.dom.resonancia.classList.add("activo");
    });

    this.audio.tocarCampana();

    // Auto-cierre suave tras 14 segundos si el usuario decide seguir caminando
    this.resTimer = setTimeout(() => {
      this._ocultarResonancia();
    }, 14000);
  }

  _responderResonancia(tipo) {
    if (!this.huellaActiva) return;
    clearTimeout(this.resTimer);

    Almacen.guardarResonancia(this.huellaActiva.id, tipo);
    this.audio.tocarCampana();

    const respuestas = {
      si: "✨ Tu sentir resuena con este rincón del parque.",
      procesando: "✧ Tómate tu tiempo. El parque no tiene prisa.",
      paz: "✺ La música y el silencio hacen su trabajo."
    };

    this.dom.resConfTxt.textContent = respuestas[tipo] || respuestas.si;
    this.dom.resOpciones.classList.add("oculto");
    this.dom.resConfirmacion.classList.remove("oculto");

    // Onda luminosa expansiva en la posición del orbe en 3D
    this._crearOndaResonancia(this.huellaActiva);

    this.resTimer = setTimeout(() => {
      this._ocultarResonancia();
    }, 2800);
  }

  _ocultarResonancia() {
    clearTimeout(this.resTimer);
    if (!this.dom.resonancia) return;
    this.dom.resonancia.classList.remove("activo");
    setTimeout(() => {
      this.dom.resonancia.classList.add("res-oculto");
    }, 450);
  }

  _crearOndaResonancia(h) {
    if (!h || !h.pos) return;
    const emo = CONFIG.emociones[h.emocion] || CONFIG.emociones.gratitud;
    const ringGeo = new THREE.RingGeometry(0.5, 0.85, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: emo.luz, side: THREE.DoubleSide, transparent: true, opacity: 0.95 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(h.pos.x, 0.06, h.pos.z);
    this.scene.add(ring);

    const start = performance.now();
    const anim = () => {
      const elap = (performance.now() - start) / 1000;
      if (elap > 1.8) {
        this.scene.remove(ring);
        ringGeo.dispose();
        ringMat.dispose();
        return;
      }
      const s = 1 + elap * 4.2;
      ring.scale.set(s, s, 1);
      ringMat.opacity = Math.max(0, 0.95 * (1 - elap / 1.8));
      requestAnimationFrame(anim);
    };
    anim();
  }

  _abrirModalCrear() {
    if (!this.celularEntregado) return;
    this.estado = "MODAL";
    this.puedeMoverse = false;
    if (document.pointerLockElement) document.exitPointerLock();
    this.dom.modalCrear.classList.add("abierto");
  }

  _cerrarModalCrear() {
    this.dom.modalCrear.classList.remove("abierto");
    this.estado = "PARQUE";
    this.puedeMoverse = true;
    this._reactivarCamara();
  }

  _abrirPausa() {
    if (this.estado === "MODAL" || this.estado === "TITULO" || this.estado === "CINE") return;
    this.estadoPrevioPausa = this.estado;
    this.estado = "PAUSA";
    this.puedeMoverse = false;
    if (document.pointerLockElement) document.exitPointerLock();
    this.dom.modalPausa.classList.add("abierto");
  }

  _cerrarPausa() {
    this.dom.modalPausa.classList.remove("abierto");
    this.estado = this.estadoPrevioPausa || "PARQUE";
    this.puedeMoverse = this.estado !== "TUTORIAL";
    this._reactivarCamara();
  }

  async _lanzarEpilogo() {
    this.estado = "CINE";
    this.puedeMoverse = false;
    document.body.classList.add("cine");
    const sig = new AbortController().signal;
    for (const l of CONFIG.guion.epilogo) {
      await this._subtitulo(l.t, l.d, sig).catch(() => {});
    }
    document.body.classList.remove("cine");
    this.estado = "PARQUE";
    this.puedeMoverse = true;
    this._setObjetivo("PARQUE DE LAS HUELLAS", "Sigue recorriendo cuando quieras", "Pulsa [N] para dejar otra huella");
  }

  /* ------------------------------------------------------------------------
     INPUT (ratón libre + estrictamente [E] para interactuar)
     ------------------------------------------------------------------------ */
  _iniciarInput() {
    addEventListener("keydown", (e) => {
      this.teclas[e.code] = true;

      if (this.estado === "CINE" && e.code === "Space") e.preventDefault();

      if (e.code === "KeyE" || e.key === "e" || e.key === "E") {
        if (this.estado === "TUTORIAL") { this._avanzarDialogo(); return; }
        if (this.estado === "UMBRAL" && !this.celularEntregado && this.focoCaja) {
          this._depositarCelular(); return;
        }
        if (this.estado === "PARQUE") {
          const obj = this.focoHuella || this._huellaMasCercana(5.5);
          if (obj) this._abrirHuella(obj);
        }
      }

      if (this.estado === "TUTORIAL" && e.code === "Space") {
        e.preventDefault();
        this._avanzarDialogo();
      }

      if ((e.code === "KeyN" || e.key === "n" || e.key === "N") && this.estado === "PARQUE") {
        this._abrirModalCrear();
      }

      if (e.code === "Escape") {
        if (this.dom.modalHuella.classList.contains("abierto")) this._cerrarModalHuella();
        else if (this.dom.modalCrear.classList.contains("abierto")) this._cerrarModalCrear();
        else if (this.dom.modalPausa.classList.contains("abierto")) this._cerrarPausa();
        else if (this.estado === "UMBRAL" || this.estado === "PARQUE") this._abrirPausa();
      }
    });

    addEventListener("keyup", (e) => { this.teclas[e.code] = false; });

    // Clic en el canvas: solo bloquea el cursor para mirar (nunca interactúa con objetos)
    this.dom.canvas.addEventListener("click", () => {
      this.audio.iniciar();
      if (!this.pointerLock && (this.estado === "UMBRAL" || this.estado === "PARQUE")) {
        try {
          const p = this.dom.canvas.requestPointerLock();
          if (p && p.catch) p.catch(() => {});
        } catch (_) {}
      }
    });

    document.addEventListener("pointerlockchange", () => {
      this.pointerLock = document.pointerLockElement === this.dom.canvas;
    });

    // Movimiento libre del ratón (sin arrastrar)
    addEventListener("mousemove", (e) => {
      if (!this.puedeMoverse || (this.estado !== "UMBRAL" && this.estado !== "PARQUE")) return;
      let dx = 0, dy = 0;
      if (this.pointerLock) {
        dx = e.movementX; dy = e.movementY;
      } else {
        if (this.ultimoMouse) {
          dx = e.clientX - this.ultimoMouse.x;
          dy = e.clientY - this.ultimoMouse.y;
        }
        this.ultimoMouse = { x: e.clientX, y: e.clientY };
      }
      if (!dx && !dy) return;
      dx = Math.max(-45, Math.min(45, dx));
      dy = Math.max(-45, Math.min(45, dy));
      const sens = 0.0022 * Almacen.ajustes().sensibilidad;
      this.yaw -= dx * sens;
      this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch - dy * sens));
      this._aplicarRotacion();
    });

    addEventListener("mouseleave", () => { this.ultimoMouse = null; });
    addEventListener("blur", () => { this.ultimoMouse = null; });

    this.dom.dialogo.addEventListener("click", () => this._avanzarDialogo());
  }

  _aplicarRotacion() {
    this.camera.up.set(0, 1, 0);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
  }

  /* ------------------------------------------------------------------------
     LOOP PRINCIPAL
     ------------------------------------------------------------------------ */
  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = Math.min(this.clock.getDelta(), 0.08);
    const t = this.clock.getElapsedTime();

    // Cámara orbital suave en la pantalla de título
    if (this.estado === "TITULO") {
      const a = t * 0.08;
      this.camera.position.set(Math.sin(a) * 26, 7.5, -30 + Math.cos(a) * 26);
      this.camera.lookAt(0, 1.5, -30);
    } else {
      // Horizonte garantizado recto (cero roll / inclinación lateral)
      this.camera.up.set(0, 1, 0);
      if (this.camera.rotation.z !== 0) {
        this.camera.rotation.z = 0;
      }
    }

    // Saltar cinemática manteniendo Espacio
    if (this.estado === "CINE") {
      if (this.teclas.Space) {
        this.saltarHold = Math.min(1, this.saltarHold + dt / 1.1);
        if (this.saltarHold >= 1 && this.cineAbort) this.cineAbort.abort();
      } else {
        this.saltarHold = Math.max(0, this.saltarHold - dt * 2);
      }
      this.dom.saltarProg.style.width = `${this.saltarHold * 100}%`;
    }

    // Movimiento primera persona
    if (this.puedeMoverse && (this.estado === "UMBRAL" || this.estado === "PARQUE")) {
      this._mover(dt, t);
      this._detectarFoco();
      this._actualizarBrujula();
    }

    // Movimiento suave orgánico en la habitación (Acto I) para mayor inmersión
    if (this.estado === "CINE") {
      this.yaw = Math.sin(t * 0.32) * 0.14;
      this.pitch = -0.04 + Math.sin(t * 0.65) * 0.025;
      this._aplicarRotacion();
      if (this.manoGrupo && this.manoGrupo.visible) {
        this.manoGrupo.position.y = -0.2 + Math.sin(t * 2.2) * 0.008;
      }
    }

    // Apertura de puertas + iluminación dorada entrando hacia el interior del pabellón
    if (this.puertasAbiertas && this.aperturaT < 1) {
      this.aperturaT = Math.min(1, this.aperturaT + dt * 0.68);
      const e = this.aperturaT < 0.5
        ? 2 * this.aperturaT * this.aperturaT
        : 1 - Math.pow(-2 * this.aperturaT + 2, 2) / 2;
      this.puertaIzq.position.x = -1.2 - e * 2.35;
      this.puertaDer.position.x = 1.2 + e * 2.35;
      if (this.hazLuz) {
        const intensidadHaz = Math.sin(this.aperturaT * Math.PI * 0.85) * 0.42 + e * 0.16;
        this.hazLuz.children.forEach((m) => { m.material.opacity = intensidadHaz; });
      }
      if (this.luzPortal) {
        this.luzPortal.intensity = e * 2.6;
      }
    }

    // Onda expansiva luminosa del pedestal al encajar la llave celular
    if (this.pulsoT >= 0 && this.pulsoT < 1 && this.anilloPulso) {
      this.pulsoT = Math.min(1, this.pulsoT + dt * 1.15);
      const s = 1 + this.pulsoT * 10.5;
      this.anilloPulso.scale.set(s, s, 1);
      this.anilloPulso.material.opacity = (1 - this.pulsoT) * 0.85;
    }

    // Lumen flotando suavemente
    if (this.lumen && this.lumen.visible) {
      this.lumen.position.y = 1.68 + Math.sin(t * 2.2) * 0.12;
      this.lumen.userData.anillo.rotation.z += dt * 1.1;
      const sc = 1.9 + Math.sin(t * 2.8) * 0.22;
      this.lumen.userData.halo.scale.set(sc, sc, 1);
    }

    // Esfera 360 infinita: sigue la posición de la cámara
    if (this.esfera360) this.esfera360.position.copy(this.camera.position);

    // Partículas solares y auras integradas en los objetos del parque (bancos, cartas, farol, barquito)
    if (this.particulas) this.particulas.rotation.y = t * 0.012;
    this.orbes.forEach((o) => {
      if (o.auraGrupo) o.auraGrupo.position.y = o.baseY + Math.sin(t * 1.6 + o.fase) * 0.07;
      if (o.flotante) {
        o.flotante.position.y = 0.14 + Math.sin(t * 2.1 + o.fase) * 0.03;
        o.flotante.rotation.z = Math.sin(t * 1.4 + o.fase) * 0.08;
      }
      if (o.polvo) o.polvo.rotation.y = t * 0.24;
      if (o.halo) {
        const hs = 1.38 + Math.sin(t * 2.2 + o.fase) * 0.22;
        o.halo.scale.set(hs, hs, 1);
      }
    });

    // Anillo y ranura de la esclusa pulsando en ámbar/coral antes de entregar el celular
    if (this.anilloLlave && !this.celularEntregado) {
      const p = 0.48 + Math.sin(t * 4.2) * 0.36;
      this.anilloLlave.material.opacity = p;
      if (this.ranuraLuz) this.ranuraLuz.material.opacity = 0.55 + Math.sin(t * 4.2) * 0.38;
      if (this.luzTotem) this.luzTotem.intensity = 0.75 + Math.sin(t * 4.2) * 0.35;
    }

    // Pájaros aleatorios
    if (this.estado === "PARQUE" && t > this.proximoPajaro) {
      this.audio.tocarPajaro();
      this.proximoPajaro = t + 4.5 + Math.random() * 8;
    }

    this.renderer.render(this.scene, this.camera);
  }

  _mover(dt, t) {
    // Rotación suave de cámara con flechas de dirección izquierda / derecha
    if (this.teclas.ArrowLeft) {
      this.yaw += 2.0 * dt;
      this._aplicarRotacion();
    }
    if (this.teclas.ArrowRight) {
      this.yaw -= 2.0 * dt;
      this._aplicarRotacion();
    }

    const f = 9.5;
    this.vel.x -= this.vel.x * f * dt;
    this.vel.z -= this.vel.z * f * dt;

    const fwd = (this.teclas.KeyW || this.teclas.ArrowUp ? 1 : 0) - (this.teclas.KeyS || this.teclas.ArrowDown ? 1 : 0);
    const lat = (this.teclas.KeyD ? 1 : 0) - (this.teclas.KeyA ? 1 : 0);
    const len = Math.hypot(fwd, lat) || 1;
    const v = CONFIG.mundo.velocidad * dt * 10;
    if (fwd) this.vel.z -= (fwd / len) * v;
    if (lat) this.vel.x += (lat / len) * v;

    const s = Math.sin(this.yaw), c = Math.cos(this.yaw);
    this.camera.position.x += (this.vel.x * c + this.vel.z * s) * dt;
    this.camera.position.z += (-this.vel.x * s + this.vel.z * c) * dt;
    this.camera.position.y = CONFIG.mundo.alturaOjos;

    // Límites físicos
    if (!this.puertasAbiertas) {
      this.camera.position.x = Math.max(-4.1, Math.min(4.1, this.camera.position.x));
      this.camera.position.z = Math.max(-4.1, Math.min(5.0, this.camera.position.z));
    } else {
      const { x: cx, z: cz } = CONFIG.mundo.centroParque;
      const d = Math.hypot(this.camera.position.x - cx, this.camera.position.z - cz);
      if (this.camera.position.z < -4.7 && d > CONFIG.mundo.radioParque) {
        const ang = Math.atan2(this.camera.position.z - cz, this.camera.position.x - cx);
        this.camera.position.x = cx + Math.cos(ang) * CONFIG.mundo.radioParque;
        this.camera.position.z = cz + Math.sin(ang) * CONFIG.mundo.radioParque;
      }
      // No meterse dentro del agua del estanque
      const est = CONFIG.mundo.estanque;
      const de = Math.hypot(this.camera.position.x - est.x, this.camera.position.z - est.z);
      if (de < est.r + 0.6) {
        const ang = Math.atan2(this.camera.position.z - est.z, this.camera.position.x - est.x);
        this.camera.position.x = est.x + Math.cos(ang) * (est.r + 0.6);
        this.camera.position.z = est.z + Math.sin(ang) * (est.r + 0.6);
      }
    }

    // Balanceo de la mano con el celular
    if (this.manoGrupo && this.manoGrupo.visible) {
      const mag = Math.hypot(this.vel.x, this.vel.z);
      this.manoGrupo.position.y = -0.2 + Math.sin(t * (mag > 0.3 ? 8 : 2)) * (mag > 0.3 ? 0.014 : 0.004);
    }
  }

  _huellaMasCercana(maxDist) {
    let mejor = null, dMin = maxDist;
    this.orbes.forEach((o) => {
      const d = this.camera.position.distanceTo(o.grupo.position);
      if (d < dMin) { dMin = d; mejor = o; }
    });
    return mejor;
  }

  _detectarFoco() {
    if (!this.celularEntregado) {
      const d = this.camera.position.distanceTo(new THREE.Vector3(0, 1.0, 0.2));
      this.focoCaja = d < 3.8;
      this.dom.mira.classList.toggle("foco", this.focoCaja);
      this.dom.prompt.classList.toggle("visible", this.focoCaja);
      this.dom.promptTxt.innerHTML = `Presiona <kbd>E</kbd> para encajar tu celular como llave`;
      this.dom.etiqOrbe.classList.remove("visible");
      return;
    }

    this.raycaster.setFromCamera(this.centro, this.camera);
    const hits = this.raycaster.intersectObjects(this.orbes.map((o) => o.nucleo));
    let obj = (hits.length && hits[0].distance < 10)
      ? this.orbes.find((o) => o.nucleo === hits[0].object)
      : this._huellaMasCercana(CONFIG.mundo.radioInteraccion);

    this.focoHuella = obj;
    this.dom.mira.classList.toggle("foco", !!obj);
    this.dom.prompt.classList.toggle("visible", !!obj);

    if (obj) {
      const lugar = obj.datos.lugar || "Punto natural";
      this.dom.promptTxt.innerHTML = `Presiona <kbd>E</kbd> para escuchar memoria · ${lugar}`;
      // Proyectar etiqueta sobre el objeto de memoria
      const p = obj.grupo.position.clone().add(new THREE.Vector3(0, (obj.baseY || 0.8) + 0.65, 0)).project(this.camera);
      if (p.z < 1) {
        const emo = CONFIG.emociones[obj.datos.emocion] || CONFIG.emociones.gratitud;
        this.dom.etiqOrbe.style.left = `${(p.x * 0.5 + 0.5) * innerWidth}px`;
        this.dom.etiqOrbe.style.top = `${(-p.y * 0.5 + 0.5) * innerHeight}px`;
        this.dom.eoEmo.textContent = `${emo.simbolo} ${emo.label}`;
        this.dom.eoEmo.style.color = emo.hex;
        this.dom.eoTit.textContent = `${lugar} — ${obj.datos.titulo}`;
        this.dom.eoMus.textContent = obj.datos.cancion || "";
        this.dom.etiqOrbe.classList.add("visible");
      } else {
        this.dom.etiqOrbe.classList.remove("visible");
      }
    } else {
      this.dom.etiqOrbe.classList.remove("visible");
    }
  }

  _actualizarBrujula() {
    const bruj = document.getElementById("brujula");
    if (!this.celularEntregado) {
      this.dom.brujulaMarcas.innerHTML = "";
      if (bruj) bruj.style.opacity = "0";
      return;
    }
    if (bruj) bruj.style.opacity = "1";
    const cont = this.dom.brujulaMarcas;
    cont.innerHTML = "";

    const norm = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
    const mirarYaw = -this.yaw; // 0 = Norte (-Z)

    // Puntos cardinales
    [["N", 0], ["E", Math.PI / 2], ["S", Math.PI], ["O", -Math.PI / 2]].forEach(([lbl, ang]) => {
      const diff = norm(ang - mirarYaw);
      if (Math.abs(diff) < 1.2) {
        const el = document.createElement("span");
        el.className = "punto";
        el.textContent = lbl;
        el.style.left = `${50 + (diff / 1.2) * 48}%`;
        cont.appendChild(el);
      }
    });

    // Huellas
    this.orbes.forEach((o) => {
      const dx = o.grupo.position.x - this.camera.position.x;
      const dz = o.grupo.position.z - this.camera.position.z;
      const ang = Math.atan2(dx, -dz);
      const diff = norm(ang - mirarYaw);
      if (Math.abs(diff) < 1.2) {
        const emo = CONFIG.emociones[o.datos.emocion] || CONFIG.emociones.gratitud;
        const m = document.createElement("span");
        m.className = "marca" + (this.escuchadas.has(o.id) ? " escuchada" : "");
        m.style.color = emo.hex;
        m.style.left = `${50 + (diff / 1.2) * 48}%`;
        cont.appendChild(m);
      }
    });
  }

  /* ------------------------------------------------------------------------
     UTILIDADES DE UI Y CINEMÁTICA
     ------------------------------------------------------------------------ */
  _setObjetivo(etq, txt, sub = "") {
    this.dom.objEtq.textContent = etq;
    this.dom.objTxt.textContent = txt;
    this.dom.objSub.textContent = sub;
    this.dom.objBox.classList.remove("pulso");
    void this.dom.objBox.offsetWidth;
    this.dom.objBox.classList.add("pulso");
  }

  _actualizarContador() {
    this.dom.contadorTxt.textContent = `${this.escuchadas.size} / ${this.orbes.length} escuchadas`;
  }

  _toast(msg, ms = 4200) {
    this.dom.toast.textContent = msg;
    this.dom.toast.classList.add("visible");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => this.dom.toast.classList.remove("visible"), ms);
  }

  _esperar(ms, sig) {
    return new Promise((res, rej) => {
      if (sig && sig.aborted) return rej();
      const id = setTimeout(res, ms);
      if (sig) sig.addEventListener("abort", () => { clearTimeout(id); rej(); }, { once: true });
    });
  }

  async _subtitulo(texto, ms, sig) {
    this.dom.subtitulos.textContent = texto;
    this.dom.subtitulos.classList.add("visible");
    try { await this._esperar(ms, sig); }
    finally { this.dom.subtitulos.classList.remove("visible"); }
  }

  async _mostrarCapitulo(num, tit, sig) {
    this.dom.capNum.textContent = num;
    this.dom.capTitulo.textContent = tit;
    this.dom.tarjetaCap.classList.add("visible");
    try { await this._esperar(2800, sig); }
    finally { this.dom.tarjetaCap.classList.remove("visible"); }
    await this._esperar(600, sig);
  }

  _fundido(on, negro = false) {
    this.dom.fundido.classList.toggle("negro", negro);
    this.dom.fundido.classList.toggle("activo", on);
    return new Promise((r) => setTimeout(r, 1400));
  }
}

addEventListener("DOMContentLoaded", () => { window.app = new Juego(); window.app.iniciar(); });
