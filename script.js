const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create 3D Floating Cards
const group = new THREE.Group();
const colors = [0x00ffcc, 0xff0055, 0x5500ff];

for(let i=0; i<3; i++) {
    const geo = new THREE.BoxGeometry(2, 3, 0.1);
    const mat = new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.8, roughness: 0.2 });
    const card = new THREE.Mesh(geo, mat);
    card.position.x = (i - 1) * 3.5;
    group.add(card);
}
scene.add(group);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

camera.position.z = 7;

// Mouse Interaction
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.1;
    group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.1;
    renderer.render(scene, camera);
}
animate();