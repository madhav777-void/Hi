const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High-performance for Xiaomi 14 Civi
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.PointLight(0x00ffcc, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

// 1. CYBER GRID (Jo pehle tha)
const grid = new THREE.GridHelper(100, 40, 0x00ffcc, 0x222222);
grid.position.y = -5;
scene.add(grid);

// 2. 3D BACKGROUND MODEL (Interactive Torus)
const bgGroup = new THREE.Group();
const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(8, 2.5, 100, 16),
    new THREE.MeshStandardMaterial({ color: 0x00ffcc, wireframe: true, transparent: true, opacity: 0.15 })
);
bgGroup.add(torus);
scene.add(bgGroup);

let targetX = 0, targetY = 0;

const handleInput = (x, y) => {
    targetX = (x / window.innerWidth - 0.5) * 2;
    targetY = (y / window.innerHeight - 0.5) * 2;
};

window.addEventListener('mousemove', (e) => handleInput(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => handleInput(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

function animate() {
    requestAnimationFrame(animate);

    // Smooth background follow
    bgGroup.rotation.y += 0.003;
    bgGroup.position.x += (targetX * 2 - bgGroup.position.x) * 0.05;
    bgGroup.position.y += (-targetY * 2 - bgGroup.position.y) * 0.05;

    // Grid animation
    grid.position.z = (Date.now() * 0.001) % 2;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Mobile specific camera zoom
    camera.position.z = window.innerWidth < 768 ? 15 : 10;
});

window.dispatchEvent(new Event('resize'));
animate();
