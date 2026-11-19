import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FIREBASE_CONFIG, YOUTUBE_API_KEY } from './config.js';

const EMOTIONS = {
  Calma: '#38bdf8', Nostalgia: '#fbbf24', 'Vulnerabilidad / Desahogo': '#c084fc',
  'Alegría / Gratitud': '#34d399', 'Saturación / Cansancio': '#fb7185'
};
const LEVELS = [{ y: 0, label: 'Nivel 1 · Planta Baja' }, { y: 5, label: 'Nivel 2 · Cuartos' }, { y: 10, label: 'Nivel 3 · Terraza' }];
const CATALOG = [
  ['dvgZkm1xWPE', 'Viva La Vida', 'Coldplay'], ['TWcyIpul8OE', 'Holocene', 'Bon Iver'],
  ['iYYRH4apXDo', 'Space Oddity', 'David Bowie'], ['Y3ywicffOj4', 'Dreams', 'Fleetwood Mac'],
  ['aGCdLKXNF3w', 'Everybody Wants To Rule The World', 'Tears for Fears'], ['u7K72X4eo_s', 'Teardrop', 'Massive Attack'],
  ['n2MtEsrcTTs', 'Harvest Moon', 'Neil Young'], ['AIOAlaACuv4', 'Fast Car', 'Tracy Chapman'],
  ['eH3giaIzONA', 'The Night We Met', 'Lord Huron'], ['2Vv-BfVoq4g', 'Perfect', 'Ed Sheeran'],
  ['RBumgq5yVrA', 'Let Her Go', 'Passenger'], ['mWRsgZuwf_8', 'The Scientist', 'Coldplay'],
  ['4I4DopAJBnE', 'Both Sides Now', 'Joni Mitchell'], ['CvFH_6DNRCY', 'Clair de Lune', 'Claude Debussy'],
  ['KQetemT1sWc', 'Here Comes The Sun', 'The Beatles'], ['w67-hlaUSIs', 'Gracias a la Vida', 'Mercedes Sosa'],
  ['ZbZSe6N_BXs', 'Happy', 'Pharrell Williams'], ['fLexgOxsZu0', 'Sweet Dreams', 'Eurythmics'],
  ['jofNR_WkoCE', 'Somewhere Only We Know', 'Keane'], ['P7lE-G1oC34', 'Fix You', 'Coldplay']
].map(([id, title, channel]) => ({ id, title, channel }));
const SEED_MEMORIES = [
  ['recibidor', -6, 0.57, 1.8, 'El Recibidor', 1, 'Calma', 'La primera vez que llegué, el silencio no estaba vacío.'],
  ['sala', -1.2, 0.57, -1.2, 'La Sala de Estar', 1, 'Nostalgia', 'Todavía cabe una tarde entera entre ese sofá y la ventana.'],
  ['cocina', 5.6, 0.57, -1.4, 'La Cocina', 1, 'Alegría / Gratitud', 'Alguien dejó encendida la conversación.'],
  ['estudio', -3.9, 5.57, -.8, 'El Estudio / Cuarto de Escucha', 2, 'Vulnerabilidad / Desahogo', 'Escuché esta canción hasta que ya no dolió igual.'],
  ['habitacion', 4.2, 5.57, -1.3, 'La Habitación', 2, 'Saturación / Cansancio', 'Hoy no tuve que resolver nada para merecer descanso.'],
  ['terraza', .5, 10.57, -1.5, 'La Terraza / Mirador Nocturno', 3, 'Calma', 'La ciudad seguía despierta. Yo por fin no tenía prisa.']
].map((m, i) => ({ id: `seed-${m[0]}`, x:m[1], y:m[2], z:m[3], habitacion:m[4], piso:m[5], emocion:m[6], color:EMOTIONS[m[6]], texto:m[7], youtubeVideoId:CATALOG[i].id, youtubeTitle:CATALOG[i].title, timestamp:Date.now() - (i + 1) * 86400000 }));

const $ = (selector) => document.querySelector(selector);
const canvas = $('#house-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#080a11');
scene.fog = new THREE.FogExp2('#111728', .018);
const camera = new THREE.PerspectiveCamera(53, innerWidth / innerHeight, .1, 160);
camera.position.set(-8, 2.3, 12);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = .075; controls.maxPolarAngle = Math.PI / 2 - .05; controls.target.set(-3, 1.3, 0); controls.minDistance = 2; controls.maxDistance = 18;
const walkableSurfaces = [], orbs = [], raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
const clock = new THREE.Clock(); let memories = [], hoveredOrb = null, placing = false, placePoint = null, floorTween = null, activeMemory = null, started = false, store = null;
const playerHeight = 1.65, keys = new Set();

const color = (v) => new THREE.Color(v);
function material(hex, opts = {}) { return new THREE.MeshStandardMaterial({ color: hex, roughness: .72, metalness: .08, ...opts }); }
function addBox(x, y, z, w, h, d, mat, group = scene, walkable = false) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); mesh.position.set(x,y,z); mesh.castShadow = false; mesh.receiveShadow = true; group.add(mesh); if (walkable) walkableSurfaces.push(mesh); return mesh; }
function addLight(x,y,z,hex,intensity=3, distance=9) { const l = new THREE.PointLight(hex,intensity,distance,2); l.position.set(x,y,z); scene.add(l); return l; }

function buildHouse() {
  scene.add(new THREE.HemisphereLight('#7899c8','#151017',1.25));
  const ground = material('#111827'); const wall = material('#283143',{transparent:true,opacity:.52,roughness:.35,metalness:.25}); const trim = material('#61708a',{emissive:'#1e2a40',emissiveIntensity:.5,metalness:.5});
  // Each large slab is a raycastable surface, keeping the vertical movement grounded.
  addBox(0,0,0,18,.28,12,ground,scene,true); addBox(-2,5,0,14,.28,12,ground,scene,true); addBox(1,10,0,17,.24,12,material('#172033'),scene,true);
  // open architectural frames and waist-height dividers
  [[-7,1.1,0,.18,2.2,12],[0,1.1,5.9,18,2.2,.18],[0,1.1,-5.9,18,2.2,.18],[-3.4,1.05,0,.18,2.1,7],[3.1,1.05,0,.18,2.1,7],[-2,6.05,0,.18,2.1,12],[2.6,6.05,0,.18,2.1,12]].forEach(a=>addBox(...a,wall));
  [-8.6,-3.4,3.1,8.6].forEach(x=>{addBox(x,1.7,-5.8,.18,3.4,.18,trim);addBox(x,1.7,5.8,.18,3.4,.18,trim)});
  [[-8.6,0],[8.6,0],[-2,5],[7,5],[-7.5,10],[8.5,10]].forEach(([x,y])=>addBox(x,y+2.1,-5.8,.18,4.2,.18,trim));
  // furniture: sala
  addBox(-.9,.55,-1.4,3.1,.75,1.3,material('#3a4559')); addBox(-.9,.98,-1.4,3.1,.12,1.3,material('#1b2433')); addBox(-1,.35,1.15,1.6,.3,1,material('#9d8467')); addLight(-1,2.5,0,'#f9ba75',4);
  // cocina
  addBox(5.5,.6,-1.6,3.1,1.2,1.25,material('#38455a')); addBox(5.5,1.25,-1.6,3.2,.12,1.35,material('#cab99d')); addBox(6.8,.42,1.6,1.2,.84,1.2,material('#58657b')); addLight(5.6,2.6,0,'#f5bb80',3.5);
  // estudio + habitación
  addBox(-4,5.65,-1.2,2.9,.18,1.3,material('#775e47')); addBox(-4,5.2,-.8,.12,.85,.12,trim); addBox(-2.8,5.9,1.6,.35,1.8,2.2,material('#1b2431')); addLight(-4,7.5,0,'#a98df1',2.5);
  addBox(4.3,5.6,-1.1,3.4,.45,2.4,material('#46536d')); addBox(4.3,5.88,-1.1,3.1,.15,2.1,material('#d7cfbd')); addBox(5.7,6.5,1.4,.18,1.6,.18,trim); addLight(4,7.6,-.4,'#efad8e',3);
  // terrace rails, transparent and low
  const glass = material('#8bc8e9',{transparent:true,opacity:.15,roughness:.05,metalness:.35});
  [[0,10.8,-5.7,17,1.5,.09],[0,10.8,5.7,17,1.5,.09],[-8.4,10.8,0,.09,1.5,11.4],[8.4,10.8,0,.09,1.5,11.4]].forEach(a=>addBox(...a,glass));
  for(let i=0;i<14;i++) { const a=i/14*Math.PI*2, r=3+Math.random()*4; const star=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.035,5,5),material('#dceaff',{emissive:'#bcd8ff',emissiveIntensity:2})); star.position.set(Math.cos(a)*r,11.5+Math.random()*3,Math.sin(a)*r); scene.add(star); }
  // broad staircase as individual raycastable treads, left of the house.
  makeStairs(-7.1, -3.8, 0, 5, 10); makeStairs(6.9, -3.8, 5, 10, 10);
  // installation entrance marker
  addLight(-6,2.6,2,'#79bdea',2.6); addLight(0,12,0,'#7fb7ff',2.4,14);
}
function makeStairs(x,z,startY,endY,count) { const rise=(endY-startY)/count, depth=3.1/count; for(let i=0;i<count;i++){ const y=startY+rise*(i+1)/2; addBox(x,y,z+1.55-i*depth,2.1,rise,depth+.035,material('#273249'),scene,true); } }

function roomFor(x,y,z) { const level = y < 3 ? 1 : y < 8 ? 2 : 3; if(level===3) return {name:'La Terraza / Mirador Nocturno', floor:3}; if(level===2) return x < 1 ? {name:'El Estudio / Cuarto de Escucha',floor:2} : {name:'La Habitación',floor:2}; if(x < -3.5) return {name:'El Recibidor',floor:1}; if(x < 3.1) return {name:'La Sala de Estar',floor:1}; return {name:'La Cocina',floor:1}; }
function createOrb(memory) {
  const group = new THREE.Group(); group.position.set(memory.x,memory.y,memory.z); group.userData.memory = memory;
  const geometry = new THREE.IcosahedronGeometry(.55,4); geometry.userData.base = Float32Array.from(geometry.attributes.position.array);
  const c = color(memory.color || EMOTIONS[memory.emocion]); const body = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({color:c,emissive:c,emissiveIntensity:1.3,transparent:true,opacity:.78,roughness:.22,metalness:.05,transmission:.08})); body.userData.base = geometry.userData.base; group.add(body);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(.78,24,16),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.1,side:THREE.BackSide,blending:THREE.AdditiveBlending})); group.add(halo);
  const light = new THREE.PointLight(c,1.4,4,2); group.add(light);
  if(memory.youtubeVideoId) { const ring = new THREE.Mesh(new THREE.TorusGeometry(.78,.025,8,48),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.86})); ring.rotation.x=Math.PI*.37; ring.userData.orbit=true; group.add(ring); }
  group.userData.body=body; scene.add(group); orbs.push(group);
}
function rebuildOrbs() { while(orbs.length){ const o=orbs.pop(); scene.remove(o); o.traverse(x=>{x.geometry?.dispose();x.material?.dispose()}); } memories.forEach(createOrb); updateAtmosphere(); updateHud(); }

function relativeTime(v) { const then = v?.toDate ? v.toDate().getTime() : Number(v) || Date.now(); const diff=Math.max(0,Date.now()-then), hours=Math.floor(diff/36e5), days=Math.floor(hours/24); return days ? `Hace ${days} día${days===1?'':'s'}` : hours ? `Hace ${hours} hora${hours===1?'':'s'}` : 'Hace un momento'; }
function updateAtmosphere(){ const count={};memories.forEach(m=>count[m.emocion]=(count[m.emocion]||0)+1); const dominant=Object.keys(count).sort((a,b)=>count[b]-count[a])[0]||'Calma'; const c=color(EMOTIONS[dominant]); scene.fog.color.lerp(c,.17); $('#dominant-emotion').textContent=dominant; $('#mood-dot').style.setProperty('--sky',`#${c.getHexString()}`); $('#mood-dot').style.background=`#${c.getHexString()}`; }
function updateHud(){ $('#footprint-count').textContent=`${memories.length} huella${memories.length===1?'':'s'} en la casa`; const r=roomFor(camera.position.x,camera.position.y,camera.position.z); $('#current-room').textContent=`Estás en: ${r.name}`; }

function surfaceHeightAt(position) { const origin = new THREE.Vector3(position.x, 30, position.z); raycaster.set(origin,new THREE.Vector3(0,-1,0)); const hits=raycaster.intersectObjects(walkableSurfaces,false); return hits[0]?.point.y; }
function updatePlayer(delta) {
  if(document.activeElement?.matches('input,textarea')) return;
  let forward=0, side=0; if(keys.has('KeyW')||keys.has('ArrowUp'))forward+=1;if(keys.has('KeyS')||keys.has('ArrowDown'))forward-=1;if(keys.has('KeyA')||keys.has('ArrowLeft'))side-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))side+=1;
  if(forward||side){const f=new THREE.Vector3();camera.getWorldDirection(f);f.y=0;f.normalize();const s=new THREE.Vector3().crossVectors(f,camera.up).normalize();const move=f.multiplyScalar(forward).add(s.multiplyScalar(side)); if(move.lengthSq())move.normalize().multiplyScalar(delta*4.2);camera.position.add(move);controls.target.add(move);}
  const floorY=surfaceHeightAt(camera.position); if(floorY!==undefined&&!floorTween){ const next=floorY+playerHeight; const d=next-camera.position.y; camera.position.y+=d*Math.min(1,delta*9);controls.target.y+=d*Math.min(1,delta*9); }
  camera.position.x=THREE.MathUtils.clamp(camera.position.x,-8.3,8.3);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-5.5,5.5); updateHud();
}
function goToFloor(index){const y=LEVELS[index].y+playerHeight;floorTween={start:performance.now(),fromCam:camera.position.y,fromTarget:controls.target.y,to:y,toTarget:LEVELS[index].y+.2,index};document.querySelectorAll('[data-floor]').forEach(b=>b.classList.toggle('active',+b.dataset.floor===index));}
function updateFloorTween(){if(!floorTween)return;const t=Math.min(1,(performance.now()-floorTween.start)/950),e=t*(2-t);camera.position.y=THREE.MathUtils.lerp(floorTween.fromCam,floorTween.to,e);controls.target.y=THREE.MathUtils.lerp(floorTween.fromTarget,floorTween.toTarget,e);if(t===1)floorTween=null;}

function extractYouTubeId(input='') { const m=input.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|music\.youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/i) || input.match(/^([\w-]{11})$/); return m?.[1] || ''; }
function thumbnail(id){return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;}
function displayResults(items, message=''){ const holder=$('#youtube-results'); holder.innerHTML=message?`<p class="card-meta">${message}</p>`:''; items.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='youtube-result';b.innerHTML=`<img src="${thumbnail(item.id)}" alt=""><span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.channel||'YouTube')}</small></span>`;b.onclick=()=>selectVideo(item,b);holder.append(b);}); }
function escapeHTML(s=''){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function selectVideo(item,button){$('#youtube-id').value=item.id;$('#youtube-title-input').value=item.title;document.querySelectorAll('.youtube-result').forEach(x=>x.classList.remove('selected'));button?.classList.add('selected');}
async function searchYouTube(){ const q=$('#youtube-query').value.trim();if(!q)return displayResults(CATALOG.slice(0,5),'Elige una canción de la casa.');const pasted=extractYouTubeId(q);if(pasted){const v={id:pasted,title:'Video de YouTube seleccionado',channel:'YouTube'};displayResults([v]);selectVideo(v,$('#youtube-results .youtube-result'));return;} if(YOUTUBE_API_KEY){try{const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=5&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`;const data=await fetch(url).then(r=>{if(!r.ok)throw Error();return r.json()});return displayResults(data.items.map(x=>({id:x.id.videoId,title:x.snippet.title,channel:x.snippet.channelTitle})));}catch{showToast('No fue posible consultar YouTube. Mostramos la colección de la casa.');}} const terms=q.toLocaleLowerCase();const results=CATALOG.filter(v=>(v.title+' '+v.channel).toLowerCase().includes(terms));displayResults(results.length?results:CATALOG.slice(0,5),results.length?'':'No hay coincidencias; estas canciones quedan disponibles.'); }

function openMemoryModal(point){ placePoint=point; const r=roomFor(point.x,point.y,point.z); $('#memory-location').textContent=`Guardando memoria en: ${r.name} (Nivel ${r.floor})`; $('#memory-form').reset(); $('#youtube-results').innerHTML=''; $('#emotion-options').innerHTML=''; Object.entries(EMOTIONS).forEach(([name,hex],i)=>{const b=document.createElement('button');b.type='button';b.className=`emotion-option ${i===0?'selected':''}`;b.style.setProperty('--emotion',hex);b.textContent=name;b.dataset.emotion=name;b.onclick=()=>{document.querySelectorAll('.emotion-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');};$('#emotion-options').append(b)}); $('#memory-modal').classList.remove('hidden'); $('#memory-text').focus(); }
function closeModal(id){$(`#${id}`).classList.add('hidden');if(id==='memory-card'){$('#youtube-player').innerHTML='';activeMemory=null;}}
function showMemory(memory){activeMemory=memory;const c=memory.color||EMOTIONS[memory.emocion];$('#card-emotion').textContent=memory.emocion;$('#card-room').textContent=`${memory.habitacion} · Nivel ${memory.piso}`;$('#card-time').textContent=relativeTime(memory.timestamp);$('#card-text').textContent=memory.texto;$('#memory-card').style.setProperty('--card-color',c);const player=$('#youtube-player');player.innerHTML=memory.youtubeVideoId?`<iframe title="Reproductor de YouTube: ${escapeHTML(memory.youtubeTitle||'canción')}" src="https://www.youtube.com/embed/${memory.youtubeVideoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`:'';$('#memory-card').classList.remove('hidden'); const target=new THREE.Vector3(memory.x,memory.y,memory.z);controls.target.lerp(target,.28);camera.position.lerp(target.clone().add(new THREE.Vector3(3,2.8,5)),.16);}

function showToast(message){const t=$('#toast');t.textContent=message;t.classList.remove('hidden');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.add('hidden'),3200)}
async function setupStore(){const configured=Object.values(FIREBASE_CONFIG).every(Boolean);if(!configured){const saved=localStorage.getItem('huellas-casa-v1');memories=saved?JSON.parse(saved):SEED_MEMORIES; if(!saved)localStorage.setItem('huellas-casa-v1',JSON.stringify(memories));store={async add(m){memories=[...memories,m];localStorage.setItem('huellas-casa-v1',JSON.stringify(memories));rebuildOrbs();}};return;}try{const [{initializeApp},{getFirestore,collection,addDoc,onSnapshot,serverTimestamp,query,orderBy}]=await Promise.all([import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')]);const db=getFirestore(initializeApp(FIREBASE_CONFIG));const ref=collection(db,'huellas_casa');onSnapshot(query(ref,orderBy('timestamp','desc')),(snap)=>{memories=snap.docs.map(d=>({id:d.id,...d.data()}));rebuildOrbs();},()=>{showToast('Firestore no respondió; se activó la memoria local.');memories=SEED_MEMORIES;rebuildOrbs();});store={async add(m){await addDoc(ref,{...m,timestamp:serverTimestamp()});}};}catch(error){console.warn(error);memories=SEED_MEMORIES;rebuildOrbs();showToast('No se pudo conectar con Firebase; la casa está en modo local.');}}

function onPointerMove(e){pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;if(placing){raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(walkableSurfaces,false)[0];if(hit){placementRing.visible=true;placementRing.position.copy(hit.point).add(new THREE.Vector3(0,.05,0));}else placementRing.visible=false;return;}raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(orbs,true).find(h=>h.object.parent?.userData?.memory||h.object.parent?.parent?.userData?.memory);const group=hit?.object.parent?.userData?.memory?hit.object.parent:hit?.object.parent?.parent;canvas.style.cursor=group?'pointer':'grab';if(hoveredOrb&&hoveredOrb!==group)hoveredOrb.scale.setScalar(1);hoveredOrb=group;if(group)group.scale.setScalar(1.14);}
function onCanvasClick(){if(!started)return;if(placing){raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(walkableSurfaces,false)[0];if(hit){placing=false;placementRing.visible=false;openMemoryModal(hit.point);}return;}if(hoveredOrb)showMemory(hoveredOrb.userData.memory);}
const placementRing=new THREE.Mesh(new THREE.RingGeometry(.35,.43,40),new THREE.MeshBasicMaterial({color:'#e6f4ff',transparent:true,opacity:.9,side:THREE.DoubleSide}));placementRing.rotation.x=-Math.PI/2;placementRing.visible=false;scene.add(placementRing);

$('#enter-house').onclick=()=>{$('#intro').classList.add('hidden');$('#hud').classList.remove('hidden');$('#place-memory').classList.remove('hidden');started=true;canvas.focus();showToast('La casa escucha. Elige un cuarto o camina hacia él.');};
$('#place-memory').onclick=()=>{placing=true;closeModal('memory-card');showToast('Haz clic sobre el piso donde quieres dejar la huella.');};
document.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>goToFloor(+b.dataset.floor));document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$('#memory-text').oninput=e=>$('#character-count').textContent=`${e.target.value.length} / 220`;$('#youtube-search-button').onclick=searchYouTube;$('#youtube-query').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();searchYouTube();}});
$('#memory-form').onsubmit=async(e)=>{e.preventDefault();const emotion=document.querySelector('.emotion-option.selected')?.dataset.emotion||'Calma';const r=roomFor(placePoint.x,placePoint.y,placePoint.z);const m={id:crypto.randomUUID(),x:placePoint.x,y:placePoint.y+.57,z:placePoint.z,habitacion:r.name,piso:r.floor,emocion:emotion,color:EMOTIONS[emotion],texto:$('#memory-text').value.trim(),youtubeVideoId:$('#youtube-id').value,youtubeTitle:$('#youtube-title-input').value,timestamp:Date.now()};try{await store.add(m);closeModal('memory-modal');showToast('La huella quedó respirando en la casa.');}catch{showToast('No se pudo guardar esta huella. Revisa la configuración de Firebase.');}};
addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&!document.activeElement?.matches('input,textarea')){keys.add(e.code);e.preventDefault();}if(e.key==='Escape'){placing=false;placementRing.visible=false;closeModal('memory-modal');closeModal('memory-card');}});addEventListener('keyup',e=>keys.delete(e.code));canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('click',onCanvasClick);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
buildHouse(); setupStore().then(()=>{rebuildOrbs();});
function animate(){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;updatePlayer(delta);updateFloorTween();orbs.forEach((o,i)=>{const b=o.userData.body;const a=b.geometry.attributes.position.array,base=b.userData.base;for(let j=0;j<a.length;j+=3){const pulse=1+Math.sin(t*1.55+i+j*.017)*.035;a[j]=base[j]*pulse;a[j+1]=base[j+1]*pulse;a[j+2]=base[j+2]*pulse;}b.geometry.attributes.position.needsUpdate=true;o.position.y=(o.userData.memory.y||0)+Math.sin(t*1.2+i)*.06;o.children.forEach(c=>{if(c.userData.orbit)c.rotation.z=t*.7;});});placementRing.rotation.z=t*.8;controls.update();renderer.render(scene,camera);}animate();
