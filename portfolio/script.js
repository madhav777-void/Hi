// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create 3D Cards
const group = new THREE.Group();
const colors = [0x00ffcc, 0xff0055, 0x5500ff];

for(let i = 0; i < 3; i++) {
    const geometry = new THREE.BoxGeometry(2, 3, 0.1);
    const material = new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.7, roughness: 0.2 });
    const card = new THREE.Mesh(geometry, material);
    card.position.x = (i - 1) * 3.5;
    group.add(card);
}
scene.add(group);

camera.position.z = 7;

// Mouse Movement Logic
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation based on mouse
    group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.1;
    group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.1;
    
    renderer.render(scene, camera);
}

// Window Resize Fix
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
console.log("3D Scene Loaded Successfully");
