const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Box bante hain
const geometry = new THREE.BoxGeometry(2, 3, 0.5);
const material = new THREE.MeshNormalMaterial(); // Normal material se rang-biranga dikhega bina light ke
const card = new THREE.Mesh(geometry, material);
scene.add(card);

camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    requestAnimationFrame(animate);
    
    // Rotation based on mouse
    card.rotation.y += (mouseX * 0.5 - card.rotation.y) * 0.1;
    card.rotation.x += (mouseY * 0.5 - card.rotation.x) * 0.1;
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
