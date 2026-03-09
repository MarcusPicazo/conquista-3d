// --- SISTEMA DE IDIOMAS ---
const translations = {
    es: {
        title: "La Conquista de México",
        subtitle: "por la escuela berta von glumer",
        startBtn: "Comenzar Historia",
        nextBtn: "Avanzar Historia",
        restartBtn: "Reiniciar Historia",
        chapters: [
            { title: "El Desembarco", desc: "Los imponentes navíos españoles anclan frente a la costa. En la playa, el campamento cobra vida con fogatas y suministros, marcando el punto de no retorno." },
            { title: "La Alianza en Tlaxcala", desc: "En los valles altos, los tlaxcaltecas sellan la alianza decisiva. Sus guerreros se unen a los españoles bajo la sombra de las montañas sagradas." },
            { title: "La Gran Tenochtitlan", desc: "La entrada pacífica inicial. Cruzan las calzadas sobre el lago Texcoco y se maravillan ante la metrópoli flotante del emperador Moctezuma." },
            { title: "La Noche Triste", desc: "El desastre. Tras la muerte de Moctezuma, los españoles huyen bajo la lluvia. Cortés llora su derrota bajo el ahuehuete." },
            { title: "La Caída del Imperio", desc: "El fin de una era. Tras un largo asedio, Tenochtitlan es destruida y Cuauhtémoc capturado entre ruinas y humo." },
            { title: "El Nacimiento de la Nueva España", desc: "Sobre las ruinas, se alza la Catedral Metropolitana con piedra de los templos antiguos. El estilo colonial redefine el paisaje del Zócalo." }
        ]
    },
    en: {
        title: "The Conquest of Mexico",
        subtitle: "by Berta Von Glumer School",
        startBtn: "Start Story",
        nextBtn: "Next Chapter",
        restartBtn: "Restart Story",
        chapters: [
            { title: "The Landing", desc: "Massive Spanish ships anchor off the coast. On the beach, the camp comes alive with bonfires and supplies, marking the point of no return." },
            { title: "The Alliance in Tlaxcala", desc: "In the high valleys, the Tlaxcalans seal a decisive alliance. Their warriors join the Spanish under the shadow of sacred mountains." },
            { title: "The Great Tenochtitlan", desc: "The initial peaceful entry. They cross the causeways over Lake Texcoco and marvel at Emperor Moctezuma's floating metropolis." },
            { title: "The Night of Sorrows", desc: "Disaster strikes. After Moctezuma's death, the Spanish flee in the rain. Cortés weeps for his defeat beneath the Ahuehuete tree." },
            { title: "The Fall of the Empire", desc: "The end of an era. After a long siege, Tenochtitlan is destroyed and Cuauhtémoc is captured amidst ruins and smoke." },
            { title: "The Birth of New Spain", desc: "Upon the ruins, the Metropolitan Cathedral rises using stones from ancient temples. Colonial style redefines the Zócalo landscape." }
        ]
    }
};

let currentLang = 'es';

window.setLanguage = function(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    document.getElementById('ui-title').innerText = t.title;
    document.getElementById('ui-subtitle').innerText = t.subtitle;
    document.getElementById('start-btn').innerText = t.startBtn;
    
    if (hasStarted) {
        updateUI(chaptersData[currentChapter]);
    }
}

// --- SISTEMA DE AUDIO (SOLO ZOOM) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.3; 
masterGain.connect(audioCtx.destination);

function createNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 4; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return buffer;
}
const noiseBuffer = createNoiseBuffer();

function playZoomSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1;
    
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    const now = audioCtx.currentTime;
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 1); 
    gain.gain.linearRampToValueAtTime(0, now + 4);    
    
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 2); 
    filter.frequency.exponentialRampToValueAtTime(200, now + 4); 
    
    source.start(now);
    source.stop(now + 4.5);
}

// --- CONFIGURACIÓN THREE.JS ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.0012);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- DATOS CRONOLÓGICOS ---
const chaptersData = [
    { id: 0, year: "Abril 1519", camPos: { x: 0, y: 60, z: 200 }, lookAt: { x: 0, y: 10, z: -50 }, theme: "day" },
    { id: 1, year: "Septiembre 1519", camPos: { x: 0, y: 60, z: -950 }, lookAt: { x: 0, y: 10, z: -1100 }, theme: "cloudy" },
    { id: 2, year: "Noviembre 1519", camPos: { x: 0, y: 60, z: -2100 }, lookAt: { x: 0, y: 20, z: -2300 }, theme: "sunset" },
    { id: 3, year: "Junio 1520", camPos: { x: 5, y: 20, z: -3540 }, lookAt: { x: 30, y: 5, z: -3600 }, theme: "night" },
    { id: 4, year: "Agosto 1521", camPos: { x: 0, y: 40, z: -4400 }, lookAt: { x: 0, y: 0, z: -4600 }, theme: "war" },
    { id: 5, year: "1524 - 1530", camPos: { x: 0, y: 80, z: -5600 }, lookAt: { x: 0, y: 0, z: -5800 }, theme: "day" }
];

let currentChapter = 0;
let isAnimating = false;
let hasStarted = false;

const cameraTarget = { x: 0, y: 0, z: 0 };
const cameraBasePos = { x: 0, y: 0, z: 0 };

// --- TEXTURAS PROCEDURALES ---
function createBrickTexture(baseColorHex) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, size, size);
    
    const brickH = 32;
    const brickW = 64;
    
    for (let y = 0; y < size; y += brickH) {
        const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
        for (let x = -brickW; x < size; x += brickW) {
            const shade = Math.random() * 0.1 - 0.05;
            ctx.fillStyle = shade > 0 ? `rgba(255,255,255,${shade})` : `rgba(0,0,0,${-shade})`;
            ctx.fillRect(x + offset, y, brickW, brickH);
            
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + offset, y, brickW, brickH);
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createNoiseTexture(baseColor, noiseScale = 1) {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);
    for(let i=0; i<5000 * noiseScale; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const w = Math.random() * 3;
        const h = Math.random() * 3;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        ctx.fillRect(x, y, w, h);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// --- MATERIALES ---
const matStone = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
const matWood = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });
const matWater = new THREE.MeshPhongMaterial({ color: 0x0044ff, transparent: true, opacity: 0.9, shininess: 100, specular: 0x111111 });
const matSand = new THREE.MeshStandardMaterial({ color: 0xE6C288, roughness: 1 });
const matGrass = new THREE.MeshStandardMaterial({ color: 0x556b2f, roughness: 1 }); 
const matRed = new THREE.MeshStandardMaterial({ color: 0x880000, roughness: 0.8 });
const matWhite = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9 });
const matSail = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
const matTent = new THREE.MeshStandardMaterial({ color: 0xf0e6d2, roughness: 0.9 });
const matGreen = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 1 });
const matPine = new THREE.MeshStandardMaterial({ color: 0x1a3300, roughness: 0.9 });
const matRuins = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1 });
const matTreeBark = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 1.0 });
const matLeaves = new THREE.MeshStandardMaterial({ color: 0x0a3d0a, roughness: 0.8 });
const matSkin = new THREE.MeshStandardMaterial({ color: 0xdeb887, roughness: 0.5 });
const matArmor = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6, roughness: 0.4 });
const matTlaxcalanCloth = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
const matTlaxcalanRed = new THREE.MeshStandardMaterial({ color: 0xb22222, roughness: 1 }); 
const matFire = new THREE.MeshBasicMaterial({ color: 0xff4500 });
const matCathedral = new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.8 });
const matDarkWood = new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 0.9 });
const matFlagRed = new THREE.MeshStandardMaterial({ color: 0xcc0000, side: THREE.DoubleSide });
const matFlagGold = new THREE.MeshStandardMaterial({ color: 0xffcc00, side: THREE.DoubleSide });
const matColonialRed = new THREE.MeshStandardMaterial({ color: 0x800000, roughness: 0.8 });
const matCloth = new THREE.MeshStandardMaterial({ color: 0xd8c0a0, side: THREE.DoubleSide });
const matBlack = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
const matBronze = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.8, roughness: 0.4 });
const texCantera = createNoiseTexture('#d4c4a8', 1); 
const texTezontle = createNoiseTexture('#8b3a3a', 2); 
const texBrick = createBrickTexture('#d4c4a8'); 
const matCantera = new THREE.MeshStandardMaterial({ map: texCantera, roughness: 0.9 });
const matTezontle = new THREE.MeshStandardMaterial({ map: texTezontle, roughness: 1.0 });
const matCathedralBrick = new THREE.MeshStandardMaterial({ map: texBrick, roughness: 0.95 });

// --- GENERADORES ---
function createShip(x, z, rot, scale = 1) {
    const group = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(10*scale, 5*scale, 25*scale), matWood);
    hull.position.y = 2.5*scale; hull.castShadow = true; group.add(hull);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.3*scale, 0.3*scale, 20*scale), matWood);
    mast.position.set(0, 10*scale, 5*scale); group.add(mast);
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(12*scale, 8*scale), matSail);
    sail.position.set(0, 12*scale, 5*scale); group.add(sail);
    group.position.set(x, 0, z); group.rotation.y = rot;
    gsap.to(group.position, {y: 1, duration: 2+Math.random(), yoyo: true, repeat: -1, ease: "sine.inOut"});
    gsap.to(group.rotation, {z: 0.05, duration: 3+Math.random(), yoyo: true, repeat: -1, ease: "sine.inOut"});
    return group;
}

function createTent(x, z, r, scale = 1) {
    const group = new THREE.Group();
    const tent = new THREE.Mesh(new THREE.ConeGeometry(4*scale, 5*scale, 4), matTent);
    tent.position.y = 2.5*scale; tent.rotation.y = Math.PI/4; tent.castShadow = true; group.add(tent);
    group.position.set(x, 0, z); group.rotation.y = r; return group;
}

function createCrates(x, z, scale=1) {
    const group = new THREE.Group();
    const s = scale;
    const boxGeo = new THREE.BoxGeometry(2*s, 2*s, 2*s);
    const b1 = new THREE.Mesh(boxGeo, matWood);
    b1.position.y = 1*s; b1.castShadow = true; group.add(b1);
    const b2 = new THREE.Mesh(boxGeo, matWood);
    b2.position.set(1.5*s, 1*s, 1.5*s); b2.rotation.y = 0.5; b2.castShadow = true; group.add(b2);
    group.position.set(x, 0, z); return group;
}

function createCampfire(x, z, scale=1) {
    const group = new THREE.Group();
    const s = scale;
    const logGeo = new THREE.CylinderGeometry(0.2*s, 0.2*s, 1.5*s, 5);
    const log1 = new THREE.Mesh(logGeo, matWood); log1.rotation.z = Math.PI/2;
    const log2 = new THREE.Mesh(logGeo, matWood); log2.rotation.x = Math.PI/2;
    group.add(log1, log2);
    const fireLight = new THREE.PointLight(0xff6600, 1, 20*s);
    fireLight.position.y = 1*s; group.add(fireLight);
    const fireGeo = new THREE.ConeGeometry(0.5*s, 1.2*s, 5);
    const fire = new THREE.Mesh(fireGeo, matFire);
    fire.position.y = 0.5*s; group.add(fire);
    gsap.to(fireLight, {intensity: 1.5, duration: 0.2, yoyo: true, repeat: -1, ease: "rough"});
    gsap.to(fire.scale, {y: 1.4, x: 1.1, z: 1.1, duration: 0.15, yoyo: true, repeat: -1, ease: "rough"});
    group.position.set(x, 0, z); return group;
}

function createPalm(x, z, s=1) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5*s, 0.8*s, 8*s, 6), matWood);
    trunk.position.y = 4*s; group.add(trunk);
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(4*s, 2*s, 6), matGreen);
    leaves.position.y = 8*s; group.add(leaves);
    group.position.set(x, 0, z); return group;
}

function createPine(x, z, s=1) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5*s, 0.8*s, 4*s, 6), matWood);
    trunk.position.y = 2*s; group.add(trunk);
    const leaves1 = new THREE.Mesh(new THREE.ConeGeometry(3*s, 6*s, 8), matPine);
    leaves1.position.y = 5*s; group.add(leaves1);
    const leaves2 = new THREE.Mesh(new THREE.ConeGeometry(2.5*s, 5*s, 8), matPine);
    leaves2.position.y = 7*s; group.add(leaves2);
    group.position.set(x, 0, z); return group;
}

function createMountain(x, z, h, w) {
    const geo = new THREE.ConeGeometry(w, h, 32);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({color: 0x5c5c5c, roughness: 0.9}));
    mesh.position.set(x, h/2 - 10, z); return mesh;
}

function createTlaxBuilding(x, z, w, h, d, y=0) {
    const group = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(w, h, d);
    const base = new THREE.Mesh(baseGeo, matWhite);
    base.position.y = h/2; base.castShadow = true; group.add(base);
    const bandGeo = new THREE.BoxGeometry(w + 0.2, h/4, d + 0.2);
    const band = new THREE.Mesh(bandGeo, matTlaxcalanRed);
    band.position.y = h * 0.8; group.add(band);
    group.position.set(x, y, z); return group;
}

function createCharacterGroup(count, x, z, colorMat, isSpanish) {
    const group = new THREE.Group();
    for(let i=0; i<count; i++) {
        const char = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.7, 8), colorMat);
        body.position.y = 0.85; char.add(body);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.25), matSkin);
        head.position.y = 1.8; char.add(head);
        if(isSpanish) {
            const helmet = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.3, 8), matArmor);
            helmet.position.y = 2.1; char.add(helmet);
        } else {
            const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.1, 0.4, 4), matRed);
            plume.position.y = 2.1; char.add(plume);
        }
        char.position.set((Math.random()-0.5)*3, 0, (Math.random()-0.5)*3);
        group.add(char);
    }
    group.position.set(x, 0, z); return group;
}

function createPyramid(x, z, scale = 1, ruined = false) {
    const group = new THREE.Group();
    const levels = 5;
    const baseSize = 40 * scale;
    const heightStep = 6 * scale;
    const mat = ruined ? matRuins : matStone;
    for(let i = 0; i < levels; i++) {
        const currentSize = baseSize - (i * (baseSize/levels) * 0.8);
        const geo = new THREE.BoxGeometry(currentSize, heightStep, currentSize);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = (i * heightStep) + (heightStep/2);
        if(ruined) {
            mesh.rotation.z = (Math.random() - 0.5) * 0.1;
            mesh.rotation.y = (Math.random() - 0.5) * 0.2;
            mesh.position.x += (Math.random() - 0.5) * 2;
        }
        mesh.castShadow = true; group.add(mesh);
    }
    if(!ruined || Math.random() > 0.3) { 
        const topGeo = new THREE.BoxGeometry(10 * scale, 6 * scale, 10 * scale);
        const top = new THREE.Mesh(topGeo, ruined ? matRuins : matRed);
        top.position.y = (levels * heightStep) + (3 * scale);
        if(ruined) { top.rotation.z = 0.3; top.position.x += 2; }
        group.add(top);
    }
    group.position.set(x, 0, z); return group;
}

function createBetterCathedral(x, z) {
    const group = new THREE.Group();
    
    const naveGeo = new THREE.BoxGeometry(60, 30, 90);
    const nave = new THREE.Mesh(naveGeo, matCantera);
    nave.position.y = 15; 
    group.add(nave);
    
    const facadeGeo = new THREE.BoxGeometry(62, 40, 5);
    const facade = new THREE.Mesh(facadeGeo, matCantera);
    facade.position.set(0, 20, 45); 
    group.add(facade);

    const mainDoor = new THREE.Mesh(new THREE.BoxGeometry(14, 20, 6), matDarkWood);
    mainDoor.position.set(0, 10, 45);
    group.add(mainDoor);

    const sideDoorGeo = new THREE.BoxGeometry(10, 15, 6);
    const sideDoor1 = new THREE.Mesh(sideDoorGeo, matDarkWood);
    sideDoor1.position.set(-20, 7.5, 45);
    group.add(sideDoor1);
    const sideDoor2 = new THREE.Mesh(sideDoorGeo, matDarkWood);
    sideDoor2.position.set(20, 7.5, 45);
    group.add(sideDoor2);

    const towerBaseW = 14;
    const towerBaseH = 45;
    const towerGeo = new THREE.BoxGeometry(towerBaseW, towerBaseH, 14);

    const t1 = new THREE.Mesh(towerGeo, matCantera);
    t1.position.set(-28, towerBaseH/2, 45);
    group.add(t1);

    const t2 = new THREE.Mesh(towerGeo, matCantera);
    t2.position.set(28, towerBaseH/2, 45);
    group.add(t2);

    const towerMidW = 12;
    const towerMidH = 20;
    const towerMidGeo = new THREE.BoxGeometry(towerMidW, towerMidH, 12);
    
    const tm1 = new THREE.Mesh(towerMidGeo, matCantera);
    tm1.position.set(-28, towerBaseH + towerMidH/2, 45);
    group.add(tm1);

    const tm2 = new THREE.Mesh(towerMidGeo, matCantera);
    tm2.position.set(28, towerBaseH + towerMidH/2, 45);
    group.add(tm2);

    const bellGeo = new THREE.SphereGeometry(3, 8, 8, 0, Math.PI * 2, 0, Math.PI/2);
    const bell1 = new THREE.Mesh(bellGeo, matBronze);
    bell1.position.set(-28, towerBaseH + 10, 45);
    group.add(bell1);
    
    const bell2 = new THREE.Mesh(bellGeo, matBronze);
    bell2.position.set(28, towerBaseH + 10, 45);
    group.add(bell2);

    const capGeo = new THREE.CylinderGeometry(0.5, 6, 10, 8); 
    const cap1 = new THREE.Mesh(capGeo, matCantera);
    cap1.position.set(-28, towerBaseH + towerMidH + 5, 45);
    group.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, matCantera);
    cap2.position.set(28, towerBaseH + towerMidH + 5, 45);
    group.add(cap2);

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.5, 4, 0.5), matStone);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5), matStone);
    
    const cross1 = new THREE.Group();
    cross1.add(crossV.clone(), crossH.clone());
    cross1.position.set(-28, towerBaseH + towerMidH + 12, 45);
    group.add(cross1);

    const cross2 = new THREE.Group();
    cross2.add(crossV.clone(), crossH.clone());
    cross2.position.set(28, towerBaseH + towerMidH + 12, 45);
    group.add(cross2);

    const drumGeo = new THREE.CylinderGeometry(18, 18, 10, 16);
    const drum = new THREE.Mesh(drumGeo, matCantera);
    drum.position.set(0, 35, 0); 
    group.add(drum);

    const domeGeo = new THREE.SphereGeometry(18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, matCantera);
    dome.position.set(0, 40, 0);
    group.add(dome);

    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 8, 8), matCantera);
    lantern.position.set(0, 58, 0);
    group.add(lantern);
    
    const pedimentGeo = new THREE.BoxGeometry(20, 10, 5);
    const pediment = new THREE.Mesh(pedimentGeo, matCantera);
    pediment.position.set(0, 45, 45);
    group.add(pediment);

    group.position.set(x, 0, z);
    return group;
}

function createCarriage(x, z) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 6), matDarkWood);
    body.position.y = 2.5; group.add(body);
    const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
    wheelGeo.rotateZ(Math.PI/2);
    const w1 = new THREE.Mesh(wheelGeo, matWood); w1.position.set(2.2, 1.5, 2); group.add(w1);
    const w2 = new THREE.Mesh(wheelGeo, matWood); w2.position.set(-2.2, 1.5, 2); group.add(w2);
    const w3 = new THREE.Mesh(wheelGeo, matWood); w3.position.set(2.2, 1.5, -2); group.add(w3);
    const w4 = new THREE.Mesh(wheelGeo, matWood); w4.position.set(-2.2, 1.5, -2); group.add(w4);
    group.position.set(x, 0, z); group.rotation.y = Math.random() * Math.PI; return group;
}

function createFountain(x, z) {
    const group = new THREE.Group();
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(10, 8, 2, 16), matStone);
    basin.position.y = 1; group.add(basin);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.5, 16), matWater);
    water.position.y = 2; group.add(water);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 6, 8), matStone);
    pillar.position.y = 3; group.add(pillar);
    group.position.set(x, 0, z); return group;
}

function createNationalPalace(x, z) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(120, 25, 30), matColonialRed); 
    body.position.y = 12.5; group.add(body);
    const door = new THREE.Mesh(new THREE.BoxGeometry(15, 18, 2), matDarkWood);
    door.position.set(0, 9, 16); group.add(door);
    for(let i=-4; i<=4; i++) {
        if(i===0) continue;
        const win = new THREE.Mesh(new THREE.BoxGeometry(6, 8, 1), matWhite);
        win.position.set(i*12, 16, 15.5); group.add(win);
    }
    group.position.set(x, 0, z); return group;
}

function createArcade(x, z, length, rotateY) {
    const group = new THREE.Group();
    const roof = new THREE.Mesh(new THREE.BoxGeometry(length, 2, 10), matWhite);
    roof.position.y = 10; group.add(roof);
    const count = Math.floor(length / 10);
    for(let i=0; i<=count; i++) {
        const col = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 2), matStone);
        col.position.set(-length/2 + i*10, 5, 0); group.add(col);
    }
    const top = new THREE.Mesh(new THREE.BoxGeometry(length, 10, 10), matColonialRed);
    top.position.y = 16; group.add(top);
    group.position.set(x, 0, z); group.rotation.y = rotateY; return group;
}

function createColonialBuilding(x, z, w, h, d) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWhite);
    body.position.y = h/2; group.add(body);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(w*0.8, h/3, 4), matRed);
    roof.position.y = h + h/6; roof.rotation.y = Math.PI/4; group.add(roof);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5), matWood);
    pole.position.set(w/2 - 1, h, d/2 - 1); group.add(pole);
    const flagR1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), matFlagRed);
    flagR1.position.set(w/2, h + 2, d/2 - 1);
    const flagY = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.1), matFlagGold);
    flagY.position.set(w/2, h + 1.25, d/2 - 1);
    const flagR2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), matFlagRed);
    flagR2.position.set(w/2, h + 0.5, d/2 - 1);
    group.add(flagR1, flagY, flagR2);
    group.position.set(x, 0, z); return group;
}

function createMarketStall(x, z) {
    const group = new THREE.Group();
    const table = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 2), matWood);
    table.position.y = 1; group.add(table);
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(5, 4), matCloth);
    cloth.rotation.x = -Math.PI/2; cloth.rotation.y = Math.random() * 0.5; 
    cloth.position.y = 3.5; group.add(cloth);
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), matWood);
    p1.position.set(-2, 1.75, 1); group.add(p1);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.5), matWood);
    p2.position.set(2, 1.75, 1); group.add(p2);
    group.position.set(x, 0, z); group.rotation.y = Math.random() * Math.PI;
    return group;
}

function createAhuehuete(x, z) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 15, 8), matTreeBark);
    trunk.position.y = 7.5; trunk.castShadow = true; group.add(trunk);
    const fol = new THREE.Group(); fol.position.y = 12;
    for(let i=0; i<6; i++) {
        const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(6+Math.random()*4), matLeaves);
        leaf.position.set((Math.random()-0.5)*15, Math.random()*10, (Math.random()-0.5)*15);
        fol.add(leaf);
    }
    group.add(fol); group.position.set(x, 0, z); return group;
}

function createCortes(x, z) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3, 1), matArmor);
    body.position.y = 1.5; body.rotation.x = Math.PI/8; group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5), matSkin);
    head.position.set(0, 3.2, 0.8); group.add(head);
    const helmet = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.6, 8), matArmor);
    helmet.position.set(0, 3.6, 0.8); helmet.rotation.x = Math.PI/4; group.add(helmet);
    group.position.set(x, 0, z); return group;
}

function createSoldier(x, z) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 8), matArmor);
    body.position.y = 1.5; group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.4), matSkin);
    head.position.y = 3.2; group.add(head);
    const helmet = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 8), matArmor);
    helmet.position.y = 3.6; group.add(helmet);
    const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 8), matWood);
    spear.position.set(0.6, 2.5, 0); group.add(spear);
    group.position.set(x, 0, z); return group;
}

// --- CONSTRUCCIÓN DE ESCENARIOS ---

const globalWater = new THREE.Mesh(new THREE.PlaneGeometry(4000, 10000), matWater);
globalWater.rotation.x = -Math.PI / 2;
globalWater.position.set(0, -2, -3000); 
scene.add(globalWater);

const s1 = new THREE.Group();
const beachGeo = new THREE.CylinderGeometry(300, 300, 5, 64);
const beach = new THREE.Mesh(beachGeo, matSand);
beach.position.y = -2; s1.add(beach);

s1.add(createShip(-150, -250, 0.2, 4.0)); 
s1.add(createShip(120, -220, -0.3, 4.0));
s1.add(createShip(0, -300, 0, 4.5));

s1.add(createTent(0, 50, 0, 2.5)); 
s1.add(createTent(-40, 80, 0.5, 1.8));
s1.add(createTent(40, 70, -0.5, 1.8));
s1.add(createTent(-70, 30, 0.2, 1.8));
s1.add(createTent(70, 40, -0.2, 1.8));

s1.add(createCampfire(0, 100, 2.0));
s1.add(createCampfire(-50, 60, 1.5));
s1.add(createCampfire(50, 50, 1.5));

s1.add(createCrates(20, 90, 2.0));
s1.add(createCrates(-20, 80, 2.0));

for(let i=0; i<150; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 120 + Math.random() * 150;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if(Math.abs(x) > 80 || z > 120) {
         const scale = 2.0 + Math.random() * 1.5; 
         s1.add(createPalm(x, z, scale));
    }
}
scene.add(s1);

const s2 = new THREE.Group();
s2.position.z = -1100;

const hill1 = new THREE.Mesh(new THREE.CylinderGeometry(150, 180, 10, 32), matGrass);
hill1.position.set(0, -2, 0); s2.add(hill1);
const hill2 = new THREE.Mesh(new THREE.CylinderGeometry(100, 120, 15, 32), matGrass);
hill2.position.set(80, 0, -80); s2.add(hill2);
const hill3 = new THREE.Mesh(new THREE.CylinderGeometry(80, 100, 12, 32), matGrass);
hill3.position.set(-90, -1, 70); s2.add(hill3);

const tlaxPlaza = new THREE.Mesh(new THREE.BoxGeometry(120, 1, 120), matStone);
tlaxPlaza.position.y = 3; s2.add(tlaxPlaza);

s2.add(createMountain(-200, 250, 150, 120));
s2.add(createMountain(220, 200, 120, 100));

s2.add(createTlaxBuilding(0, 60, 20, 10, 15, 3)); 
s2.add(createTlaxBuilding(-40, -40, 15, 8, 10, 3));
s2.add(createTlaxBuilding(80, -80, 10, 6, 8, 7.5));
s2.add(createTlaxBuilding(-90, 70, 10, 6, 8, 5)); 
s2.add(createTlaxBuilding(30, 40, 10, 5, 8, 3));
s2.add(createTlaxBuilding(-30, 50, 8, 6, 8, 3));
s2.add(createTlaxBuilding(100, -60, 8, 5, 8, 7.5));
s2.add(createTlaxBuilding(70, -100, 10, 6, 8, 7.5));
s2.add(createTlaxBuilding(-110, 60, 8, 5, 8, 5));
s2.add(createTlaxBuilding(-80, 90, 8, 6, 8, 5));

const spanishGroup = createCharacterGroup(10, -20, 0, matArmor, true);
spanishGroup.lookAt(20, 0, 0); spanishGroup.position.y = 3.5; s2.add(spanishGroup);
const tlaxGroup = createCharacterGroup(12, 20, 0, matTlaxcalanCloth, false);
tlaxGroup.lookAt(-20, 0, 0); tlaxGroup.position.y = 3.5; s2.add(tlaxGroup);

for(let i=0; i<30; i++) {
    const px = (Math.random()-0.5)*400;
    const pz = (Math.random()-0.5)*400;
    if(Math.abs(px) > 60 || Math.abs(pz) > 60) {
        s2.add(createPine(px, pz, 1 + Math.random()));
    }
}
scene.add(s2);

const s3 = new THREE.Group();
s3.position.z = -2300;
const island = new THREE.Mesh(new THREE.CylinderGeometry(150, 150, 5, 32), matStone);
island.position.y = 0.5; s3.add(island);
const cw = new THREE.Mesh(new THREE.BoxGeometry(30, 4, 800), matStone);
cw.position.set(0, 0.5, 200); s3.add(cw);
s3.add(createPyramid(0, 0, 1.5)); 
s3.add(createPyramid(-60, 40, 0.7));
s3.add(createPyramid(60, -30, 0.7));
scene.add(s3);

const s4 = new THREE.Group();
s4.position.z = -3600;
const landNT = new THREE.Mesh(new THREE.CylinderGeometry(70, 70, 5, 32), matSand);
landNT.position.set(30, 0.5, 0); s4.add(landNT);
const cwBroken = new THREE.Mesh(new THREE.BoxGeometry(20, 4, 100), matStone);
cwBroken.position.set(0, 0.5, -60); s4.add(cwBroken);
s4.add(createAhuehuete(30, 0));
const cortes = createCortes(26, 0); 
cortes.lookAt(30, 3, -3600); s4.add(cortes);
const soldier = createSoldier(34, 2);
soldier.lookAt(26, 2, 3602); s4.add(soldier);
const rainGeo = new THREE.BufferGeometry();
const rainPos = new Float32Array(1500);
for(let i=0; i<1500; i++) rainPos[i] = (Math.random()-0.5)*300;
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 0.5}));
rain.position.y = 50; s4.add(rain);
scene.add(s4);

const s5 = new THREE.Group();
s5.position.z = -4600;
const islandRuin = new THREE.Mesh(new THREE.CylinderGeometry(160, 160, 5, 32), matRuins);
islandRuin.position.y = 0.5; s5.add(islandRuin);
s5.add(createPyramid(0, 0, 1.5, true)); 
s5.add(createPyramid(-50, 60, 0.7, true));
s5.add(createPyramid(70, -20, 0.7, true));
const ashGeo = new THREE.BufferGeometry();
const ashCount = 10000;
const ashPos = new Float32Array(ashCount * 3);
for(let i=0; i<ashCount * 3; i+=3) {
    ashPos[i] = (Math.random()-0.5)*500; 
    ashPos[i+1] = Math.random()*200;     
    ashPos[i+2] = (Math.random()-0.5)*500; 
}
ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3));
const ash = new THREE.Points(ashGeo, new THREE.PointsMaterial({color: 0xff5500, size: 1.5, transparent: true, opacity: 0.4}));
ash.position.y = 20; 
s5.add(ash);
scene.add(s5);

const s6 = new THREE.Group();
s6.position.z = -5800;
const cityBase = new THREE.Mesh(new THREE.CylinderGeometry(220, 220, 5, 64), matStone);
cityBase.position.y = 0; s6.add(cityBase);
const cat = createBetterCathedral(0, -60);
cat.rotation.y = Math.PI; s6.add(cat);
const palacio = createNationalPalace(80, 0);
palacio.rotation.y = -Math.PI/2; s6.add(palacio);
const portales = createArcade(-80, 0, 100, Math.PI/2);
s6.add(portales);
s6.add(createColonialBuilding(0, 80, 40, 25, 30));
s6.add(createColonialBuilding(-50, 70, 30, 20, 20));
s6.add(createColonialBuilding(50, 70, 30, 20, 20));
s6.add(createColonialBuilding(100, -40, 20, 15, 20));
s6.add(createColonialBuilding(-100, -40, 20, 15, 20));
s6.add(createColonialBuilding(100, 40, 20, 15, 20));
s6.add(createColonialBuilding(-100, 40, 20, 15, 20));
s6.add(createFountain(0, 0));
s6.add(createMarketStall(20, 20));
s6.add(createMarketStall(-20, 20));
s6.add(createMarketStall(20, -20));
s6.add(createMarketStall(-20, -20));
s6.add(createMarketStall(30, 0));
s6.add(createMarketStall(-30, 0));
s6.add(createCarriage(40, -50));
s6.add(createCarriage(-30, 50));
const oldPyramid = createPyramid(60, -60, 0.5, true);
oldPyramid.position.y = 0; s6.add(oldPyramid);
for(let i=0; i<8; i++) {
    const people = createCharacterGroup(3, (Math.random()-0.5)*120, (Math.random()-0.5)*100, matWhite, false);
    people.position.y = 2.5;
    s6.add(people);
}
s6.add(createPine(-40, 40, 0.8));
s6.add(createPine(40, 40, 0.8));
s6.add(createPine(-40, -20, 0.8));
s6.add(createPine(40, -20, 0.8));
s6.add(createPine(0, 90, 0.8));
s6.add(createPine(0, -90, 0.8));
scene.add(s6);

// --- LUCES ---
const ambientLight = new THREE.AmbientLight(0x404040, 1); scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1); sunLight.position.set(100, 100, 50); scene.add(sunLight);
const torchLight = new THREE.PointLight(0xffaa00, 1, 100); scene.add(torchLight);

const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(8000 * 3);
for(let i=0; i<8000*3; i++) starPos[i] = (Math.random()-0.5)*10000; 
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xffffff, size: 1.5}));
scene.add(stars);

// --- LÓGICA DE CONTROL ---

window.startStory = function() {
    hasStarted = true;
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hidden');
    playZoomSound();
    gsap.to("#ui-layer", {opacity: 1, duration: 1, delay: 0.5});
}

function updateLighting(theme, dur = 3) {
    let fogC, bgC, ambI, sunI, sunY;
    if(theme === "day") {
        fogC = {r:0.5, g:0.7, b:0.9}; bgC = fogC; ambI=0.8; sunI=1.2; sunY=100;
    } else if (theme === "cloudy") { 
        fogC = {r:0.6, g:0.65, b:0.7}; bgC = fogC; ambI=0.6; sunI=0.8; sunY=80;
    } else if (theme === "sunset") { 
        fogC = {r:0.8, g:0.4, b:0.2}; bgC = fogC; ambI=0.5; sunI=0.9; sunY=20;
    } else if (theme === "night") { 
        fogC = {r:0.05, g:0.05, b:0.1}; bgC = {r:0, g:0, b:0}; ambI=0.1; sunI=0.1; sunY=-10;
    } else if (theme === "war") { 
        fogC = {r:0.3, g:0.1, b:0.05}; bgC = {r:0.2, g:0.05, b:0}; ambI=0.2; sunI=0.5; sunY=10;
    }
    gsap.to(scene.fog.color, {...fogC, duration: dur});
    gsap.to(scene.background, {...bgC, duration: dur});
    gsap.to(ambientLight, {intensity: ambI, duration: dur});
    gsap.to(sunLight, {intensity: sunI, duration: dur});
    gsap.to(sunLight.position, {y: sunY, duration: dur});
}

const c0 = chaptersData[0];
camera.position.set(c0.camPos.x, c0.camPos.y, c0.camPos.z + 50);
cameraBasePos.x = c0.camPos.x;
cameraBasePos.y = c0.camPos.y;
cameraBasePos.z = c0.camPos.z;
cameraTarget.x = c0.lookAt.x;
cameraTarget.y = c0.lookAt.y;
cameraTarget.z = c0.lookAt.z;
camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);

scene.background = new THREE.Color(0x87CEEB);
updateLighting("day");

gsap.to(camera.position, {z: c0.camPos.z, duration: 3, ease: "power2.out", onComplete: () => {
     cameraBasePos.z = c0.camPos.z; 
}});
document.getElementById('loading').style.display = 'none';

window.nextChapter = function() { 
    if (isAnimating) return;
    isAnimating = true;
    
    playZoomSound();

    let nextIndex = (currentChapter + 1);
    if (nextIndex >= chaptersData.length) {
        nextIndex = 0;
    }
    
    const target = chaptersData[nextIndex];

    gsap.to("#info-panel", {opacity: 0, duration: 0.5});
    updateLighting(target.theme, 5);

    gsap.to(camera.position, {
        x: target.camPos.x,
        y: target.camPos.y,
        z: target.camPos.z,
        duration: 6, 
        ease: "power1.inOut",
        onComplete: () => {
            cameraBasePos.x = target.camPos.x;
            cameraBasePos.y = target.camPos.y;
            cameraBasePos.z = target.camPos.z;
        }
    });
    
    gsap.to(cameraTarget, {
        x: target.lookAt.x,
        y: target.lookAt.y,
        z: target.lookAt.z,
        duration: 6,
        ease: "power1.inOut",
        onComplete: () => {
            updateUI(target);
            currentChapter = nextIndex;
            isAnimating = false;
        }
    });
};

function updateUI(data) {
    const langData = translations[currentLang];
    const chapterText = langData.chapters[data.id];
    
    document.getElementById('year-display').innerText = data.year;
    document.getElementById('title-display').innerText = chapterText.title;
    document.getElementById('desc-display').innerText = chapterText.desc;
    
    const btn = document.getElementById('next-btn');
    if(data.id === chaptersData.length - 1) { 
         btn.innerText = langData.restartBtn;
    } else {
         btn.innerText = langData.nextBtn;
    }
    gsap.to("#info-panel", {opacity: 1, duration: 1});
}

function animate() {
    requestAnimationFrame(animate);
    
    if(!isAnimating) {
        const time = Date.now() * 0.0005;
        camera.position.x = cameraBasePos.x + Math.sin(time) * 5; 
        camera.position.y = cameraBasePos.y + Math.cos(time * 0.5) * 2; 
        camera.position.z -= 0.02; 
        cameraBasePos.z -= 0.02;
    }
    
    camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    torchLight.position.copy(camera.position);

    const sp = stars.geometry.attributes.position.array;
    for(let i=2; i<sp.length; i+=3) { 
        sp[i] += 2; 
        if(sp[i] > 2000) sp[i] = -8000; 
    }
    stars.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();