/**
 * HUELLAS ESPACIALES (2050) — Configuración, catálogo musical, guion y almacenamiento
 * Música: única y exclusivamente YouTube (embed oficial + buscador integrado).
 */

const CONFIG = {
  version: 3,
  youtubeApiKey: "AIzaSyAFjP0M7vGv8q9cNrOGJwHW09hP-maYSKM",
  claves: {
    huellas: "huellas2050_huellas_v4",
    escuchadas: "huellas2050_escuchadas_v4",
    resonancias: "huellas2050_resonancias_v4",
    progreso: "huellas2050_progreso_v4",
    ajustes: "huellas2050_ajustes_v4"
  },

  emociones: {
    quiebre:   { id: "quiebre",   label: "Quiebre",   simbolo: "⚡", hex: "#e8785a", luz: 0xff8a66 },
    alivio:    { id: "alivio",    label: "Alivio",    simbolo: "✧", hex: "#3fae8a", luz: 0x5fe0b0 },
    despedida: { id: "despedida", label: "Despedida", simbolo: "✺", hex: "#c86fae", luz: 0xf59ad6 },
    gratitud:  { id: "gratitud",  label: "Gratitud",  simbolo: "✦", hex: "#d9a630", luz: 0xffd36a },
    esperanza: { id: "esperanza", label: "Esperanza", simbolo: "✶", hex: "#3d9fd6", luz: 0x7fd2ff }
  },

  // Catálogo verificado (IDs comprobados con oEmbed de YouTube).
  // Se usa como buscador local cuando no hay API key, y para las huellas iniciales.
  catalogo: [
    { id: "eIKhtQkjS1g", titulo: "Si En Tu Mente Estuve", artista: "Nsqk" },
    { id: "tVvZcVfE5KM", titulo: "SANGRE !", artista: "Nsqk" },
    { id: "00Kf5DBH6Eg", titulo: "¿Qué Tan Cerca Es Cerca?", artista: "Nsqk" },
    { id: "Sv9I9v1GlhI", titulo: "Cuando Me Vaya", artista: "Nsqk" },
    { id: "d2QMdIuk7Xk", titulo: "Hombre De Bien", artista: "Nsqk" },
    { id: "htyO4KFoMVY", titulo: "tuffluv", artista: "Nsqk" },
    { id: "2LxMArf6w3Y", titulo: "¿En Qué Momento?", artista: "Nsqk" },
    { id: "d1I899PKATY", titulo: "BAD INTENCIONES", artista: "Nsqk" },
    { id: "71dbVAxQ_7E", titulo: "Dientes De Fierro (ft. Jean Dawson)", artista: "Nsqk" },
    { id: "69Sboa-k-UQ", titulo: "SAMSA", artista: "Nsqk" },
    { id: "yrgTEtyRE8M", titulo: "malibU", artista: "rusowsky" },
    { id: "DPqULcZXuGE", titulo: "pikito", artista: "rusowsky" },
    { id: "5dIRPEPR9xA", titulo: "Johnny Glamour (ft. Las Ketchup)", artista: "rusowsky" },
    { id: "3N88XszkcMQ", titulo: "ALTAGAMA", artista: "rusowsky" },
    { id: "Cq0jaj-eocI", titulo: "EL DÍA DEL AMIGO", artista: "CA7RIEL & Paco Amoroso" },
    { id: "9kqnsoY94L8", titulo: "Tiny Desk Concert", artista: "CA7RIEL & Paco Amoroso" },
    { id: "iwsW0xR3yeI", titulo: "DUMBAI", artista: "CA7RIEL & Paco Amoroso" },
    { id: "klMGDp6eeow", titulo: "LA QUE PUEDE, PUEDE", artista: "CA7RIEL & Paco Amoroso" },
    { id: "N4S9nJH_A7E", titulo: "MI DIOSA (En Vivo)", artista: "CA7RIEL & Paco Amoroso" }
  ],

  huellasIniciales: [
    {
      id: "h-001", emocion: "despedida", autor: "Inés, 24", fecha: "Marzo 2050",
      lugar: "Carta en el banco de roble", objeto: "banco_carta",
      titulo: "Borré su chat, pero no a ella",
      texto: "Llevaba un año releyendo nuestras conversaciones cada noche. Hoy vine aquí, me senté en la madera tibia y la recordé sin pantalla de por medio. Dolió menos de lo que pensaba.",
      pregunta: "¿Sentiste el peso de soltar a alguien que aún sigue en tus pensamientos?",
      youtubeId: "eIKhtQkjS1g", cancion: "Nsqk — Si En Tu Mente Estuve",
      pos: { x: 4.4, y: 0, z: -13.0 }
    },
    {
      id: "h-002", emocion: "alivio", autor: "Tomás y Leo", fecha: "Julio 2050",
      lugar: "Nenúfares en la orilla", objeto: "estanque_nenufar",
      titulo: "Nos reímos hasta llorar",
      texto: "Diez años hablando solo por audios. Hoy nos vimos aquí sin avisar a nadie, sin subir nada. Leo se tropezó con una rama y no paramos de reír en media hora.",
      pregunta: "¿Sentiste esa risa limpia y cómplice que solo surge cuando no hay pantallas delante?",
      youtubeId: "Cq0jaj-eocI", cancion: "CA7RIEL & Paco Amoroso — EL DÍA DEL AMIGO",
      pos: { x: 4.8, y: 0, z: -22.5 }
    },
    {
      id: "h-003", emocion: "quiebre", autor: "Anónimo", fecha: "Enero 2050",
      lugar: "Nota bajo el gran roble", objeto: "roble_nota",
      titulo: "Me di cuenta de lo lejos que estaba",
      texto: "Tenía a todo el mundo a un toque de distancia y a nadie cerca. Junto a este tronco entendí que llevaba meses sin mirar a nadie a los ojos.",
      pregunta: "¿Sentiste ese vacío inquietante de estar hiperconectado pero a solas?",
      youtubeId: "00Kf5DBH6Eg", cancion: "Nsqk — ¿Qué Tan Cerca Es Cerca?",
      pos: { x: -6.8, y: 0, z: -16.5 }
    },
    {
      id: "h-004", emocion: "esperanza", autor: "Mara, 31", fecha: "Abril 2050",
      lugar: "Sobre en la piedra del sendero", objeto: "sobre_sendero",
      titulo: "Lo que dejo cuando me vaya",
      texto: "Pensé que si desaparecía de las redes desaparecía de verdad. Resulta que no. Mi hermana me escribió una carta. En papel. Aún existo.",
      pregunta: "¿Sentiste la calidez de saber que importas más allá de una notificación?",
      youtubeId: "Sv9I9v1GlhI", cancion: "Nsqk — Cuando Me Vaya",
      pos: { x: -1.8, y: 0, z: -24.5 }
    },
    {
      id: "h-005", emocion: "gratitud", autor: "Julia", fecha: "Agosto 2050",
      lugar: "Cuaderno en el banco sombreado", objeto: "banco_cuaderno",
      titulo: "Un domingo cualquiera",
      texto: "Nadie me pidió nada en todo el día. Comí fruta en este banco, me quedé dormida y al despertar había un perro desconocido apoyado en mí. Gracias, perro.",
      pregunta: "¿Sentiste gratitud por esos pequeños instantes donde nadie espera nada de ti?",
      youtubeId: "yrgTEtyRE8M", cancion: "rusowsky — malibU",
      pos: { x: -8.2, y: 0, z: -30.0 }
    },
    {
      id: "h-006", emocion: "quiebre", autor: "Dani, 19", fecha: "Febrero 2050",
      lugar: "Hojas sobre piedras con rocío", objeto: "piedras_hojas",
      titulo: "Llorar no era un fallo del sistema",
      texto: "Me enseñaron a optimizarlo todo, también lo que sentía. Aquí lloré por primera vez en dos años y no pasó nada malo. Solo llovió un poco por dentro.",
      pregunta: "¿Sentiste el desahogo de permitirte romper sin tener que arreglarte al instante?",
      youtubeId: "tVvZcVfE5KM", cancion: "Nsqk — SANGRE !",
      pos: { x: -11.5, y: 0, z: -22.0 }
    },
    {
      id: "h-007", emocion: "alivio", autor: "Papá de Nico", fecha: "Mayo 2050",
      lugar: "Farol en el muelle de madera", objeto: "muelle_farol",
      titulo: "Ser buena persona sin que nadie lo vea",
      texto: "Ayudé a un señor a no resbalar junto a la orilla. No hubo vídeo, no hubo likes. Solo un 'gracias, hijo'. Fue lo mejor de la semana.",
      pregunta: "¿Sentiste el alivio genuino de hacer algo bueno solo por el hecho de hacerlo?",
      youtubeId: "d2QMdIuk7Xk", cancion: "Nsqk — Hombre De Bien",
      pos: { x: 5.5, y: 0, z: -30.5 }
    },
    {
      id: "h-008", emocion: "gratitud", autor: "La banda del barrio", fecha: "Junio 2050",
      lugar: "Altavoz viejo sobre el tocón", objeto: "tocon_altavoz",
      titulo: "Bailamos sin grabarlo",
      texto: "Alguien trajo un altavoz viejo. Bailamos todos, mal, muy mal. Nadie sacó el móvil porque quedó en el pedestal de la entrada. Fue perfecto.",
      pregunta: "¿Sentiste esa felicidad libre de disfrutar el presente sin buscar la toma perfecta?",
      youtubeId: "9kqnsoY94L8", cancion: "CA7RIEL & Paco Amoroso — Tiny Desk",
      pos: { x: 3.5, y: 0, z: -39.5 }
    },
    {
      id: "h-009", emocion: "esperanza", autor: "Sofi", fecha: "Septiembre 2050",
      lugar: "Barquito de papel en el agua", objeto: "barco_papel",
      titulo: "Empezar pequeñito",
      texto: "No voy a cambiar mi vida entera de golpe. Hoy solo vine. Mañana quizá llame a mi abuela. Pasito a pasito, pikito a pikito.",
      pregunta: "¿Sentiste que dar un paso minúsculo hoy ya es suficiente para empezar a sanar?",
      youtubeId: "DPqULcZXuGE", cancion: "rusowsky — pikito",
      pos: { x: 7.5, y: 0, z: -34.2 }
    },
    {
      id: "h-010", emocion: "despedida", autor: "R.", fecha: "Octubre 2050",
      lugar: "Carta sellada al final del sendero", objeto: "banco_horizonte",
      titulo: "Amor duro, amor de verdad",
      texto: "Le dije adiós a la versión de mí que necesitaba gustarle a todo el mundo. Fue un amor duro. Pero me quedo con la que soy.",
      pregunta: "¿Sentiste la serenidad de elegirte a ti mismo, aun cuando signifique soltar lo demás?",
      youtubeId: "htyO4KFoMVY", cancion: "Nsqk — tuffluv",
      pos: { x: 0.0, y: 0, z: -47.5 }
    }
  ],

  // Generador de preguntas reflexivas para huellas nuevas o personalizadas
  generarPregunta(h) {
    if (h && h.pregunta) return h.pregunta;
    const banco = {
      quiebre: [
        "¿Sentiste esa grieta necesaria para dejar entrar algo nuevo?",
        "¿Sentiste el nudo en la garganta de reconocer tu propia vulnerabilidad?",
        "¿Sentiste el peso de haber cargado tanto durante tanto tiempo?"
      ],
      alivio: [
        "¿Sentiste cómo soltabas el aire que llevabas tiempo conteniendo?",
        "¿Sentiste esa repentina ligereza de dejar de aparentar?",
        "¿Sentiste la paz de que por fin el ruido se apague?"
      ],
      despedida: [
        "¿Sentiste la tristeza limpia de decir adiós con amor?",
        "¿Sentiste el eco de lo que ya fue pero que siempre te acompañará?",
        "¿Sentiste lo difícil y a la vez sanador que es soltar?"
      ],
      gratitud: [
        "¿Sentiste una chispa cálida en el pecho por lo vivido?",
        "¿Sentiste agradecimiento por la gente y los momentos que te sostuvieron?",
        "¿Sentiste que a pesar de todo valió la pena estar aquí?"
      ],
      esperanza: [
        "¿Sentiste una pequeña luz abriéndose paso en el horizonte?",
        "¿Sentiste que el mañana puede ser un día más amable?",
        "¿Sentiste ganas de volver a intentar, pasito a pasito?"
      ]
    };
    const lista = banco[h ? h.emocion : "gratitud"] || banco.gratitud;
    const seed = ((h && (h.id || h.titulo)) || "eco").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return lista[seed % lista.length];
  },

  // Guion de la historia (rápido, cinematográfico, lectura instantánea)
  guion: {
    aislamiento: [
      { t: "2050. Demasiadas pantallas.", d: 2100 },
      { t: "Demasiado ruido en la cabeza.", d: 2300 }
    ],
    mensajeMadre: "Mamá ❤ · «Hay un parque donde dejas el celular como llave. Ve. Te va a hacer bien.»",
    decision: [
      { t: "El celular es la llave para desconectar.", d: 2200 }
    ],
    viaje: [
      { t: "Santuario de Desconexión · 2050", d: 2400 },
      { t: "Encaja tu celular en el pedestal para abrir.", d: 2800 }
    ],
    tutorial: [
      "Bienvenido. Tu celular ya es la llave.",
      "Aquí no hay pantallas ni ruido. Solo aire real.",
      "Acércate a las luces y pulsa [E] para escuchar un recuerdo.",
      "Pulsa [N] cuando quieras dejar tu propia canción. Respira."
    ],
    tresEscuchadas: "¿Sientes la calma? Pulsa [N] cuando quieras dejar tu huella.",
    epilogo: [
      { t: "Tu huella ya vive en este parque.", d: 2800 },
      { t: "Quien deje su celular aquí escuchará lo que sentiste.", d: 3400 },
      { t: "Sin pantallas. De humano a humano.", d: 2600 }
    ]
  },

  notificaciones: [
    { ico: "📸", col: "#e1306c", t: "lu_vibes", s: "ha subido 14 historias" },
    { ico: "🔥", col: "#ff7a1a", t: "¡Tu racha está en peligro!", s: "Quedan 2 horas" },
    { ico: "💬", col: "#25a35a", t: "Grupo «Clase 2041»", s: "128 mensajes nuevos" },
    { ico: "⚡", col: "#7b5cff", t: "FeedCuántico", s: "Te estás perdiendo 340 momentos" },
    { ico: "👁", col: "#3a86ff", t: "Nadie ha visto tu historia", s: "Prueba a publicar a otra hora" },
    { ico: "📉", col: "#ef476f", t: "Tu engagement bajó un 12%", s: "Publica algo ahora" },
    { ico: "🤖", col: "#118ab2", t: "Asistente IA", s: "He respondido a 9 personas por ti" },
    { ico: "🎮", col: "#06d6a0", t: "Tus amigos juegan sin ti", s: "Únete a la partida" },
    { ico: "📰", col: "#555", t: "Última hora", s: "Todo va mal. Toca para saber más" },
    { ico: "❤", col: "#ff4d6d", t: "A 3 personas les gustó", s: "una foto de hace 4 años" },
    { ico: "⏰", col: "#ffb703", t: "Tiempo de pantalla", s: "Hoy: 11 h 42 min" },
    { ico: "💬", col: "#25a35a", t: "Mensaje de: nadie", s: "Escribiendo…" }
  ],

  mundo: {
    alturaOjos: 1.68,
    velocidad: 4.4,
    radioParque: 58,
    centroParque: { x: 0, z: -30 },
    estanque: { x: 13.5, z: -27.5, r: 8.2 },
    radioInteraccion: 4.0
  }
};

/* ==========================================================================
   Utilidades de YouTube (embed oficial)
   ========================================================================== */
const YT = {
  extraerId(txt) {
    if (!txt) return null;
    const s = txt.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
    const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/|music\.youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/i);
    return m ? m[1] : null;
  },
  embed(id, autoplay = true) {
    const origen = location.protocol.startsWith("http") ? `&origin=${encodeURIComponent(location.origin)}` : "";
    return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1${origen}`;
  },
  miniatura(id, calidad = "mqdefault") {
    return `https://i.ytimg.com/vi/${id}/${calidad}.jpg`;
  },
  enlace(id) {
    return `https://www.youtube.com/watch?v=${id}`;
  }
};

/* ==========================================================================
   Almacenamiento (localStorage, con interfaz asíncrona lista para Firebase)
   Para conectar Firebase basta con reimplementar estos métodos usando
   Firestore (colección "huellas") manteniendo las mismas firmas.
   ========================================================================== */
const Almacen = {
  _leer(clave, defecto) {
    try {
      const v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : defecto;
    } catch (e) {
      return defecto;
    }
  },
  _escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (e) {
      console.warn("No se pudo guardar (¿almacenamiento lleno?):", e);
      return false;
    }
  },

  async obtenerHuellas() {
    const propias = this._leer(CONFIG.claves.huellas, []);
    return [...CONFIG.huellasIniciales, ...propias];
  },
  async guardarHuella(huella) {
    const propias = this._leer(CONFIG.claves.huellas, []);
    propias.push(huella);
    let ok = this._escribir(CONFIG.claves.huellas, propias);
    if (!ok && huella.audio) {
      // Sin espacio para el audio: guardamos la huella sin la nota de voz
      propias[propias.length - 1] = { ...huella, audio: null };
      ok = this._escribir(CONFIG.claves.huellas, propias);
    }
    return ok;
  },
  async borrarPropias() {
    this._escribir(CONFIG.claves.huellas, []);
    this._escribir(CONFIG.claves.escuchadas, []);
  },

  escuchadas() { return new Set(this._leer(CONFIG.claves.escuchadas, [])); },
  marcarEscuchada(id) {
    const s = this.escuchadas();
    s.add(id);
    this._escribir(CONFIG.claves.escuchadas, [...s]);
    return s;
  },

  resonancias() { return this._leer(CONFIG.claves.resonancias, {}); },
  guardarResonancia(huellaId, respuesta) {
    const r = this.resonancias();
    r[huellaId] = { respuesta, fecha: Date.now() };
    this._escribir(CONFIG.claves.resonancias, r);
    return r;
  },

  progreso() { return this._leer(CONFIG.claves.progreso, { historiaCompleta: false, huellaPropia: false }); },
  guardarProgreso(p) { this._escribir(CONFIG.claves.progreso, { ...this.progreso(), ...p }); },

  ajustes() { return this._leer(CONFIG.claves.ajustes, { volumen: 0.8, sensibilidad: 1, apiKey: CONFIG.youtubeApiKey }); },
  guardarAjustes(a) { this._escribir(CONFIG.claves.ajustes, { ...this.ajustes(), ...a }); }
};
