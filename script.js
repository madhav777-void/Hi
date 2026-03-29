const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const pointLight = new THREE.PointLight(0x00ffcc, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 1. CYBER-GRID FLOOR
const gridHelper = new THREE.GridHelper(100, 40, 0x00ffcc, 0x222222);
gridHelper.position.y = -5;
scene.add(gridHelper);

// 2. BACKGROUND INTERACTIVE MODEL
const bgGroup = new THREE.Group();
const bgGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const bgMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.1 
});
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgGroup.add(bgMesh);
scene.add(bgGroup);

// 3. PROJECT CARDS
const cardGroup = new THREE.Group();
const colors = [0x00ffcc, 0xff0055, 0x5500ff];
for(let i = 0; i < 3; i++) {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.9, roughness: 0.1 })
    );
    cardGroup.add(card);
}
scene.add(cardGroup);

// Tracking variables
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

const updateMouse = (x, y) => {
    targetX = (x / window.innerWidth - 0.5) * 2;
    targetY = (y / window.innerHeight - 0.5) * 2;
};

window.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => updateMouse(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

function animate() {
    requestAnimationFrame(animate);

    // Smooth lerp for movements
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    // Background model follows cursor with parallax
    bgGroup.position.x = currentX * 3;
    bgGroup.position.y = -currentY * 3;
    bgGroup.rotation.y += 0.002;

    // Foreground cards tilt
    cardGroup.rotation.y = currentX * 0.5;
    cardGroup.rotation.x = -currentY * 0.2;

    // Grid animation
    gridHelper.position.z = (Date.now() * 0.001) % 2.5;

    renderer.render(scene, camera);
}

// FULL MOBILE OPTIMIZATION LOGIC
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    if (width < 768) {
        camera.position.z = 12; // Pull back for narrow screens
        bgMesh.scale.set(0.5, 0.5, 0.5); // Smaller BG model for mobile
        cardGroup.children.forEach((card, i) => {
            card.position.x = 0;
            card.position.y = (i - 1) * 3.8; // Stacked vertically
        });
    } else {
        camera.position.z = 8;
        bgMesh.scale.set(1, 1, 1);
        cardGroup.children.forEach((card, i) => {
            card.position.x = (i - 1) * 3.5; // Spread horizontally
            card.position.y = 0;
        });
    }
});

// Initial Init
window.dispatchEvent(new Event('resize'));
animate();
