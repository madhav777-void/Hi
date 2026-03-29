const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pointLight = new THREE.PointLight(0x00ffcc, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 1. CYBER-GRID
const grid = new THREE.GridHelper(100, 50, 0x00ffcc, 0x222222);
grid.position.y = -5;
scene.add(grid);

// 2. BG MODEL (Torus)
const bgGroup = new THREE.Group();
const bgMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(10, 3, 100, 16),
    new THREE.MeshStandardMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.1 })
);
bgGroup.add(bgMesh);
scene.add(bgGroup);

// 3. PROJECT CARDS (With URLs)
const cardGroup = new THREE.Group();
const urls = ['https://voidstore-tan.vercel.app/', 'https://desitalk-sigma.vercel.app/', '#'];
const colors = [0x00ffcc, 0xff0055, 0x5500ff];

for(let i = 0; i < 3; i++) {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.8, roughness: 0.2 })
    );
    card.userData = { url: urls[i] };
    cardGroup.add(card);
}
scene.add(cardGroup);

let targetX = 0, targetY = 0;

const updateInput = (x, y) => {
    targetX = (x / window.innerWidth - 0.5) * 2;
    targetY = (y / window.innerHeight - 0.5) * 2;
    mouse.x = targetX;
    mouse.y = -targetY;
};

window.addEventListener('mousemove', (e) => updateInput(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => updateInput(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(cardGroup.children);
    if(hits.length > 0 && hits[0].object.userData.url !== '#') {
        window.open(hits[0].object.userData.url, '_blank');
    }
});

function animate() {
    requestAnimationFrame(animate);
    
    // Background movement
    bgGroup.position.x += (targetX * 2 - bgGroup.position.x) * 0.05;
    bgGroup.position.y += (-targetY * 2 - bgGroup.position.y) * 0.05;
    bgGroup.rotation.y += 0.003;

    // Card Tilt
    cardGroup.rotation.y += (targetX * 0.5 - cardGroup.rotation.y) * 0.05;
    cardGroup.rotation.x += (-targetY * 0.2 - cardGroup.rotation.x) * 0.05;

    // Grid scroll effect
    grid.position.z = (Date.now() * 0.001) % 2;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth < 768) {
        camera.position.z = 12;
        bgMesh.scale.set(0.5, 0.5, 0.5);
        cardGroup.children.forEach((c, i) => {
            c.position.set(0, (i - 1) * 3.8, 0);
        });
    } else {
        camera.position.z = 8;
        bgMesh.scale.set(1,
