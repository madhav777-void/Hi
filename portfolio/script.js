const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better performance
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00ffcc, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const group = new THREE.Group();
const colors = [0x00ffcc, 0xff0055, 0x5500ff];

for(let i = 0; i < 3; i++) {
    const geometry = new THREE.BoxGeometry(2, 3, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
        color: colors[i], 
        metalness: 0.9, 
        roughness: 0.1 
    });
    const card = new THREE.Mesh(geometry, material);
    group.add(card);
}
scene.add(group);

let mouseX = 0;
let mouseY = 0;

// Mouse & Touch Interaction
const handleMove = (x, y) => {
    mouseX = (x / window.innerWidth - 0.5) * 2;
    mouseY = (y / window.innerHeight - 0.5) * 2;
};

window.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
window.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.05;
    group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.05;
    
    group.children.forEach((c, i) => {
        c.position.y = Math.sin(Date.now() * 0.001 + i) * 0.1;
    });
    
    renderer.render(scene, camera);
}

// Responsive Logic
window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    if (w < 768) {
        camera.position.z = 10;
        group.children.forEach((c, i) => {
            c.position.x = 0;
            c.position.y = (i - 1) * 3.5; // Stack vertically on small screens
        });
    } else {
        camera.position.z = 6;
        group.children.forEach((c, i) => {
            c.position.x = (i - 1) * 3;
            c.position.y = 0;
        });
    }
});

// Initialize
window.dispatchEvent(new Event('resize'));
animate();
