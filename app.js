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
    this._construirCuartoAislamiento();
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
      fundido: $("fundido"), vineta: $("viñeta"), glitch: $("glitch"), notifs: $("notifs"),
      subtitulos: $("subtitulos"), tarjetaCap: $("tarjeta-capitulo"), capNum: $("cap-num"), capTitulo: $("cap-titulo"),
      saltarProg: $("saltar-prog"),
      hud: $("hud"), objBox: $("objetivo"), objEtq: $("obj-etq"), objTxt: $("obj-txt"), objSub: $("obj-sub"),
      brujulaMarcas: $("brujula-marcas"), mira: $("mira"), prompt: $("prompt"), promptTxt: $("prompt-txt"),
      etiqOrbe: $("etiqueta-orbe"), eoEmo: $("eo-emo"), eoTit: $("eo-tit"), eoMus: $("eo-mus"),
      contadorTxt: $("contador-txt"), btnNuevaHuella: $("btn-nueva-huella"), btnPausa: $("btn-pausa"),
      dialogo: $("dialogo"), dlgTexto: $("dlg-texto"), dlgPie: $("dlg-pie"),
      modalHuella: $("modal-huella"), mhChip: $("mh-chip"), mhTitulo: $("mh-titulo"), mhMeta: $("mh-meta"),
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
    this.scene.fog = new THREE.FogExp2(0xdcf0f5, 0.011);

    this.camera = new THREE.PerspectiveCamera(66, innerWidth / innerHeight, 0.05, 220);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.dom.canvas, antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.35));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.hemi = new THREE.HemisphereLight(0xfffaf0, 0x6d997b, 1.15);
    this.scene.add(this.hemi);
    this.sol = new THREE.DirectionalLight(0xfff1d6, 1.25);
    this.sol.position.set(22, 38, -14);
    this.scene.add(this.sol);

    addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
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

  _construirCuartoAislamiento() {
    // Habitación minimalista aislada en x = 80 (para el Acto I)
    const g = new THREE.Group();
    g.position.set(80, 0, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x1e262c, roughness: 0.9 });
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), mat);
    suelo.rotation.x = -Math.PI / 2;
    g.add(suelo);

    const pared = (w, h, d, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      g.add(m);
    };
    pared(7, 3.2, 0.2, 0, 1.6, -3.5);
    pared(7, 3.2, 0.2, 0, 1.6, 3.5);
    pared(0.2, 3.2, 7, -3.5, 1.6, 0);
    pared(0.2, 3.2, 7, 3.5, 1.6, 0);

    // Ventana tenue azulada
    const vent = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), new THREE.MeshBasicMaterial({ color: 0x3b5366 }));
    vent.position.set(0, 1.7, -3.38);
    g.add(vent);

    // Cama simple
    const cama = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 2.2), new THREE.MeshStandardMaterial({ color: 0x2a343b }));
    cama.position.set(-1.5, 0.22, -1.2);
    g.add(cama);

    this.scene.add(g);
  }

  _construirUmbral() {
    const g = new THREE.Group();
    const piedra = new THREE.MeshStandardMaterial({ color: 0xede5d6, roughness: 0.65 });
    const muro = new THREE.MeshStandardMaterial({ color: 0xf7f3eb, roughness: 0.85 });

    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 10.5), piedra);
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.set(0, 0, 0.5);
    g.add(suelo);

    const muroTras = new THREE.Mesh(new THREE.BoxGeometry(9.6, 4.6, 0.3), muro);
    muroTras.position.set(0, 2.3, 5.75);
    g.add(muroTras);

    const muroL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, 10.5), muro);
    muroL.position.set(-4.8, 2.3, 0.5);
    g.add(muroL);

    const muroR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.6, 10.5), muro);
    muroR.position.set(4.8, 2.3, 0.5);
    g.add(muroR);

    // Pedestal + caja
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.48, 0.95, 16),
      new THREE.MeshStandardMaterial({ color: 0x314a3f, roughness: 0.45 })
    );
    col.position.set(0, 0.475, 0.2);
    g.add(col);

    const bandeja = new THREE.Mesh(
      new THREE.BoxGeometry(0.64, 0.1, 0.52),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.78 })
    );
    bandeja.position.set(0, 0.98, 0.2);
    g.add(bandeja);

    // Letrero
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillRect(10, 10, 492, 236);
    ctx.strokeStyle = "#4f9a74";
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 492, 236);
    ctx.textAlign = "center";
    ctx.fillStyle = "#16302a";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText("DEJA TU CELULAR", 256, 94);
    ctx.fillStyle = "#5d7469";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText("Para poder conectar contigo mismo", 256, 144);
    ctx.fillStyle = "#2c5a47";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("Acércate y pulsa [E]", 256, 198);

    const cartel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 0.65),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide })
    );
    cartel.position.set(0, 1.68, 0.2);
    g.add(cartel);

    // Puertas correderas
    const matPuerta = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.72, roughness: 0.25 });
    this.puertaIzq = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.6, 0.12), matPuerta);
    this.puertaIzq.position.set(-2.3, 2.3, -4.7);
    g.add(this.puertaIzq);

    this.puertaDer = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.6, 0.12), matPuerta);
    this.puertaDer.position.set(2.3, 2.3, -4.7);
    g.add(this.puertaDer);

    // Dintel
    const dintel = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.5, 0.3), muro);
    dintel.position.set(0, 4.6, -4.7);
    g.add(dintel);

    this.scene.add(g);
  }

  _construirParque() {
    const g = new THREE.Group();
    const { x: cx, z: cz } = CONFIG.mundo.centroParque;

    // Pradera base
    const pradera = new THREE.Mesh(
      new THREE.CircleGeometry(78, 48),
      new THREE.MeshStandardMaterial({ color: 0x73a57a, roughness: 0.9 })
    );
    pradera.rotation.x = -Math.PI / 2;
    pradera.position.set(cx, -0.01, cz);
    g.add(pradera);

    // Senderos de arena
    const matSendero = new THREE.MeshStandardMaterial({ color: 0xefe3ce, roughness: 0.92, side: THREE.DoubleSide });
    const anillo = new THREE.Mesh(new THREE.RingGeometry(13, 16.5, 36), matSendero);
    anillo.rotation.x = -Math.PI / 2;
    anillo.position.set(cx, 0.02, cz);
    g.add(anillo);

    const entrada = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 16), matSendero);
    entrada.rotation.x = -Math.PI / 2;
    entrada.position.set(0, 0.02, -12.5);
    g.add(entrada);

    const cruce = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 34), matSendero);
    cruce.rotation.x = -Math.PI / 2;
    cruce.position.set(0, 0.02, -32);
    g.add(cruce);

    // Estanque con reflejo y nenúfares
    const est = CONFIG.mundo.estanque;
    this.agua = new THREE.Mesh(
      new THREE.CircleGeometry(est.r, 32),
      new THREE.MeshStandardMaterial({ color: 0x56a3a6, roughness: 0.18, metalness: 0.25 })
    );
    this.agua.rotation.x = -Math.PI / 2;
    this.agua.position.set(est.x, 0.04, est.z);
    g.add(this.agua);

    const matNenufar = new THREE.MeshStandardMaterial({ color: 0x3b7a52, roughness: 0.8 });
    const matFlor = new THREE.MeshBasicMaterial({ color: 0xffe0ec });
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + Math.random() * 0.5;
      const d = 1.5 + Math.random() * (est.r - 2.2);
      const nx = est.x + Math.cos(a) * d;
      const nz = est.z + Math.sin(a) * d;
      const n = new THREE.Mesh(new THREE.CircleGeometry(0.42 + Math.random() * 0.25, 12), matNenufar);
      n.rotation.x = -Math.PI / 2;
      n.position.set(nx, 0.055, nz);
      g.add(n);
      if (i % 2 === 0) {
        const flor = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), matFlor);
        flor.position.set(nx, 0.14, nz);
        g.add(flor);
      }
    }

    // Puente pequeño junto al estanque
    const matMadera = new THREE.MeshStandardMaterial({ color: 0x9b6e44, roughness: 0.75 });
    const puente = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), matMadera);
    puente.position.set(est.x - est.r + 0.5, 0.16, est.z);
    g.add(puente);

    // Árboles distribuidos orgánicamente
    const matTronco = new THREE.MeshStandardMaterial({ color: 0x5c4230, roughness: 0.9 });
    const tonosHoja = [0x4c8a62, 0x62a376, 0x76b882, 0x3f7552].map((col) =>
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.8, flatShading: true })
    );
    const arbolesPos = [
      [-9, -12, 1.1], [-17, -18, 1.3], [-24, -29, 1.2], [-18, -42, 1.4], [-9, -49, 1.1],
      [6, -12, 1.0], [15, -16, 1.25], [27, -25, 1.35], [28, -40, 1.2], [18, -50, 1.3],
      [4, -55, 1.45], [-29, -46, 1.15], [-32, -20, 1.1], [31, -14, 1.05], [-3, -34, 0.95]
    ];
    arbolesPos.forEach(([x, z, s], idx) => {
      const arb = new THREE.Group();
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * s, 0.36 * s, 3.6 * s, 8), matTronco);
      tronco.position.y = 1.8 * s;
      arb.add(tronco);
      const copa = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1 * s, 1), tonosHoja[idx % tonosHoja.length]);
      copa.position.y = 3.8 * s;
      arb.add(copa);
      arb.position.set(x, 0, z);
      arb.userData = { copa, fase: Math.random() * 6.28 };
      g.add(arb);
      this.arboles.push(arb);
    });

    // Bancos y farolas
    const matMetal = new THREE.MeshStandardMaterial({ color: 0x2d4238, metalness: 0.6, roughness: 0.3 });
    [[-6, -19, 0.7], [7, -21, -0.7], [11, -35, -1.9], [-12, -37, 1.1]].forEach(([x, z, r]) => {
      const b = new THREE.Group();
      const as = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.55), matMadera);
      as.position.y = 0.45;
      const resp = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.45, 0.08), matMadera);
      resp.position.set(0, 0.75, -0.24);
      b.add(as, resp);
      b.position.set(x, 0, z);
      b.rotation.y = r;
      g.add(b);
    });

    const matGlobo = new THREE.MeshBasicMaterial({ color: 0xfff1ba });
    [[-3.2, -9], [3.2, -9], [-9, -27], [9, -27], [0, -45]].forEach(([x, z]) => {
      const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 3.4, 8), matMetal);
      poste.position.set(x, 1.7, z);
      const globo = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), matGlobo);
      globo.position.set(x, 3.5, z);
      g.add(poste, globo);
    });

    // Flores de colores suaves
    const coloresFlor = [0xffe066, 0xff9ebb, 0x9bf6ff, 0xffffff];
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 12 + Math.random() * 42;
      const fx = cx + Math.cos(a) * d;
      const fz = cz + Math.sin(a) * d;
      if (Math.hypot(fx - est.x, fz - est.z) < est.r + 1) continue;
      const fl = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 6, 6),
        new THREE.MeshBasicMaterial({ color: coloresFlor[i % coloresFlor.length] })
      );
      fl.position.set(fx, 0.12, fz);
      g.add(fl);
    }

    // Esporas doradas flotantes
    const nPart = 260;
    const posArr = new Float32Array(nPart * 3);
    for (let i = 0; i < nPart * 3; i += 3) {
      posArr[i] = cx + (Math.random() - 0.5) * 90;
      posArr[i + 1] = 0.6 + Math.random() * 7;
      posArr[i + 2] = cz + (Math.random() - 0.5) * 90;
    }
    const pGeom = new THREE.BufferGeometry();
    pGeom.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    this.particulas = new THREE.Points(
      pGeom,
      new THREE.PointsMaterial({ color: 0xffe48a, size: 0.16, transparent: true, opacity: 0.75 })
    );
    g.add(this.particulas);

    this.scene.add(g);
  }

  _construirLumen() {
    const g = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), new THREE.MeshBasicMaterial({ color: 0xfff8d6 }));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 16), new THREE.MeshBasicMaterial({ color: 0xf2c45a, transparent: true, opacity: 0.35 }));
    const anillo = new THREE.Mesh(
      new THREE.RingGeometry(0.52, 0.6, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, side: THREE.DoubleSide })
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

  _crearOrbe(h) {
    const emo = CONFIG.emociones[h.emocion] || CONFIG.emociones.gratitud;
    const g = new THREE.Group();
    const y = h.pos.y || 1.7;
    g.position.set(h.pos.x, y, h.pos.z);

    const nucleo = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), new THREE.MeshBasicMaterial({ color: emo.luz }));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.68, 14, 14), new THREE.MeshBasicMaterial({ color: emo.luz, transparent: true, opacity: 0.32 }));
    const anillo = new THREE.Mesh(
      new THREE.RingGeometry(0.76, 0.88, 22),
      new THREE.MeshBasicMaterial({ color: emo.luz, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    anillo.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
    const haz = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.14, y, 6),
      new THREE.MeshBasicMaterial({ color: emo.luz, transparent: true, opacity: 0.16 })
    );
    haz.position.y = -y / 2;

    g.add(nucleo, halo, anillo, haz);
    this.scene.add(g);

    const obj = { id: h.id, datos: h, grupo: g, nucleo, halo, anillo, baseY: y, fase: Math.random() * 6.28 };
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

    this.celularEntregado = true;
    this.puertasAbiertas = true;
    this.aperturaT = 1;
    this.puertaIzq.position.x = -5.1;
    this.puertaDer.position.x = 5.1;
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

    // Acto I: Aislamiento en el cuarto
    this.estado = "CINE";
    this.cineAbort = new AbortController();
    const sig = this.cineAbort.signal;

    document.body.classList.add("cine");
    this.dom.vineta.classList.add("activa");
    this.dom.glitch.classList.add("activo");
    this.audio.modoAislamiento(true);

    // Oscurecer luz ambiente para el cuarto
    this.scene.background.setHex(0x161f24);
    this.scene.fog.color.setHex(0x161f24);
    this.hemi.intensity = 0.45;
    this.sol.intensity = 0.2;

    this.camera.up.set(0, 1, 0);
    this.camera.position.set(80, 1.55, 1.5);
    this.yaw = 0.1; this.pitch = -0.15;
    this.camera.rotation.set(-0.15, 0.1, 0, "YXZ");
    this._aplicarRotacion();
    this.manoGrupo.visible = true;
    this._dibujarPantalla("aislamiento");

    try {
      await this._mostrarCapitulo("ACTO I", "EL RUIDO", sig);

      // Lanzar lluvia de notificaciones mientras corren los subtítulos
      const notifTimer = setInterval(() => {
        if (sig.aborted) { clearInterval(notifTimer); return; }
        this._spawnNotif();
      }, 950);

      for (const linea of CONFIG.guion.aislamiento) {
        await this._subtitulo(linea.t, linea.d, sig);
      }
      clearInterval(notifTimer);
      this._limpiarNotifs();

      // Llega el mensaje de la madre
      this._dibujarPantalla("madre");
      this.audio.tocarNotif();
      this._spawnNotif({ ico: "💬", col: "#25a35a", t: "Mamá", s: "Ve al parque. Te va a hacer bien. ❤" }, true);
      await this._esperar(1200, sig);
      await this._subtitulo(CONFIG.guion.mensajeMadre, 4600, sig);
      for (const l of CONFIG.guion.decision) await this._subtitulo(l.t, l.d, sig);
    } catch (_) {
      // Saltado por el usuario
      this._limpiarNotifs();
    }

    // Transición al Acto II (El Umbral)
    await this._fundido(true, true);
    document.body.classList.remove("cine");
    this.dom.vineta.classList.remove("activa");
    this.dom.glitch.classList.remove("activo");
    this.dom.subtitulos.classList.remove("visible");

    // Restaurar luz diurna
    this.scene.background.setHex(0xdcf0f5);
    this.scene.fog.color.setHex(0xdcf0f5);
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

    await this._fundido(false, true);

    this.estado = "UMBRAL";
    this.puedeMoverse = true;
    this.dom.hud.classList.add("visible");
    this._setObjetivo("ACTO II · EL UMBRAL", "Deja tu celular en la caja", "Acércate al pedestal y pulsa [E]");

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
    el.style.top = centrada ? "20%" : `${12 + Math.random() * 58}%`;
    el.innerHTML = `<div class="ico" style="background:${n.col}">${n.ico}</div><div><b>${n.t}</b><small>${n.s}</small></div>`;
    this.dom.notifs.appendChild(el);
    this.audio.tocarNotif();
    setTimeout(() => {
      el.classList.add("salir");
      setTimeout(() => el.remove(), 600);
    }, centrada ? 4200 : 2800);
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

    // Animar la mano bajando hacia el pedestal
    const dur = 1100;
    const t0 = performance.now();
    const p0 = this.manoGrupo.position.clone();
    await new Promise((res) => {
      const paso = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = k * (2 - k);
        this.manoGrupo.position.set(p0.x - 0.24 * e, p0.y - 0.26 * e, p0.z - 0.35 * e);
        if (k < 1) requestAnimationFrame(paso);
        else res();
      };
      requestAnimationFrame(paso);
    });

    this.manoGrupo.visible = false;
    this.camera.remove(this.manoGrupo);
    this._dibujarPantalla("reposo");

    // Celular descansando sobre el pedestal
    const celFijo = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.014, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x202825 })
    );
    celFijo.position.set(0, 1.04, 0.2);
    const pantFija = new THREE.Mesh(
      new THREE.PlaneGeometry(0.13, 0.24),
      new THREE.MeshBasicMaterial({ map: this.pantallaTex })
    );
    pantFija.rotation.x = -Math.PI / 2;
    pantFija.position.set(0, 1.049, 0.2);
    this.scene.add(celFijo, pantFija);

    this.audio.tocarCampana();

    // Acto III: Aparece Lumen y da el tutorial
    this.lumen.visible = true;
    this.lumen.position.set(0, 1.65, -2.2);
    this.estado = "TUTORIAL";
    this._setObjetivo("ACTO III · BIENVENIDA", "Escucha a Lumen", "Pulsa [E] para avanzar el diálogo");

    this._iniciarDialogo(CONFIG.guion.tutorial, () => {
      this.puertasAbiertas = true;
      this.audio.tocarPuerta();
      Almacen.guardarProgreso({ historiaCompleta: true });
      this._entrarModoParque();
      this._mostrarCapitulo("ACTO IV", "EL PARQUE DE LAS HUELLAS", new AbortController().signal).catch(() => {});
    });
  }

  _entrarModoParque() {
    this.estado = "PARQUE";
    this.puedeMoverse = true;
    this.dom.hud.classList.add("visible");
    this.dom.btnNuevaHuella.classList.remove("oculto");
    this._setObjetivo("EXPLORA EL PARQUE", "Acércate a las luces y pulsa [E]", "Cuando quieras, pulsa [N] para dejar tu propia huella");
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
    this.dlgEscribiendo = true;
    let i = 0;
    this.dlgTimer = setInterval(() => {
      this.dom.dlgTexto.textContent += linea[i++];
      if (i % 3 === 0) this.audio.tocarLumenVoz();
      if (i >= linea.length) {
        clearInterval(this.dlgTimer);
        this.dlgEscribiendo = false;
        this.dom.dlgPie.classList.add("listo");
      }
    }, 24);
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
    this.dom.mhTitulo.textContent = h.titulo;
    this.dom.mhMeta.textContent = `${h.autor} · ${h.fecha || "2050"}`;
    this.dom.mhTexto.textContent = `“${h.texto}”`;
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
    const h = this.huellaActiva;
    this.dom.mhYt.innerHTML = "";
    this.dom.mhAudio.pause();
    this.dom.mhAudio.src = "";
    this.dom.modalHuella.classList.remove("abierto");
    this.audio.silenciar(false);
    this.estado = "PARQUE";
    this.puedeMoverse = true;
    this.ultimoMouse = null;

    if (h) {
      this._mostrarResonancia(h);
    }

    if (!this.tresCelebrado && this.escuchadas.size >= 3) {
      this.tresCelebrado = true;
      this._toast(CONFIG.guion.tresEscuchadas, 7500);
      this._setObjetivo("TU TURNO", "Pulsa [N] para dejar tu huella", "Busca una canción en YouTube y cuenta lo que sientes");
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
    this.ultimoMouse = null;
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
    this.ultimoMouse = null;
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
        else if (this.dom.resonancia.classList.contains("activo")) this._ocultarResonancia();
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

    // Apertura de puertas
    if (this.puertasAbiertas && this.aperturaT < 1) {
      this.aperturaT = Math.min(1, this.aperturaT + dt * 0.9);
      const e = this.aperturaT * (2 - this.aperturaT);
      this.puertaIzq.position.x = -2.3 - e * 2.8;
      this.puertaDer.position.x = 2.3 + e * 2.8;
    }

    // Lumen flotando
    if (this.lumen && this.lumen.visible) {
      this.lumen.position.y = 1.68 + Math.sin(t * 2.2) * 0.12;
      this.lumen.userData.anillo.rotation.z += dt * 1.1;
      const sc = 1 + Math.sin(t * 3) * 0.1;
      this.lumen.userData.halo.scale.set(sc, sc, sc);
    }

    // Árboles, partículas y orbes
    this.arboles.forEach((a) => {
      a.userData.copa.rotation.z = Math.sin(t * 1.2 + a.userData.fase) * 0.035;
    });
    if (this.particulas) this.particulas.rotation.y = t * 0.014;
    this.orbes.forEach((o) => {
      o.grupo.position.y = o.baseY + Math.sin(t * 1.4 + o.fase) * 0.16;
      o.anillo.rotation.z += dt * 0.65;
    });

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
      this.dom.promptTxt.innerHTML = `Presiona <kbd>E</kbd> para dejar tu celular`;
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
      this.dom.promptTxt.innerHTML = `Presiona <kbd>E</kbd> para escuchar esta huella`;
      // Proyectar etiqueta sobre el orbe
      const p = obj.grupo.position.clone().add(new THREE.Vector3(0, 0.95, 0)).project(this.camera);
      if (p.z < 1) {
        const emo = CONFIG.emociones[obj.datos.emocion] || CONFIG.emociones.gratitud;
        this.dom.etiqOrbe.style.left = `${(p.x * 0.5 + 0.5) * innerWidth}px`;
        this.dom.etiqOrbe.style.top = `${(-p.y * 0.5 + 0.5) * innerHeight}px`;
        this.dom.eoEmo.textContent = `${emo.simbolo} ${emo.label}`;
        this.dom.eoEmo.style.color = emo.hex;
        this.dom.eoTit.textContent = obj.datos.titulo;
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
    if (!this.celularEntregado) { this.dom.brujulaMarcas.innerHTML = ""; return; }
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
