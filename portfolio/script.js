// 1. Basic Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. Project Data (Yahan apne projects ki details daalein)
const projectData = [
    { name: "Project One", color: 0x00ffcc, link: "https://google.com" },
    { name: "Project Two", color: 0xff0055, link: "https://github.com" },
    { name: "Project Three", color: 0x5500ff, link: "https://vercel.com" }
];

const cards = [];
const group = new THREE.Group();

projectData.forEach((data, i) => {
    const geo = new THREE.BoxGeometry(2.5, 3.5, 0.2);
    const mat = new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.7, roughness: 0.1 });
    const card = new THREE.Mesh(geo, mat);
    
    card.position.x = (i - 1) * 4; // Cards ko thoda door door rakhne ke liye
    card.userData = { link: data.link }; // Link save karne ke liye
    
    group.add(card);
    cards.push(card);
});
scene.add(group);

// 3. Lighting (3D feel ke liye lights zaroori hain)
const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

camera.position.z = 8;

// 4. Mouse Move Interaction (Smooth Rotation)
let targetX = 0, targetY = 0;
window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
});

// 5. Click Interaction (Raycaster)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cards);
    
    if (intersects.length > 0) {
        window.open(intersects[0].object.userData.link, "_blank");
    }
});

// 6. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (targetX - group.rotation.y) * 0.05;
    group.rotation.x += (targetY - group.rotation.x) * 0.05;
    
    // Floating effect
    cards.forEach((c, i) => {
        c.position.y = Math.sin(Date.now() * 0.002 + i) * 0.2;
    });
    
    renderer.render(scene, camera);
}
animate();

// 7. Responsive Fix
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
