const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const light = new THREE.PointLight(0x00ffcc, 1.5);
light.position.set(5, 5, 5);
scene.add(light);

const group = new THREE.Group();
const urls = [
    'https://voidstore-tan.vercel.app/', 
    'https://desitalk-sigma.vercel.app/',
    '#'
];

// Create 3D cards with links attached to their userdata
for(let i = 0; i < 3; i++) {
    const geometry = new THREE.BoxGeometry(2, 3, 0.1);
    const material = new THREE.MeshStandardMaterial({ 
        color: i === 0 ? 0x00ffcc : i === 1 ? 0xff0055 : 0x5500ff,
        metalness: 0.8, roughness: 0.2
    });
    const card = new THREE.Mesh(geometry, material);
    card.userData = { url: urls[i] };
    group.add(card);
}
scene.add(group);

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Click to open links
window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length > 0) {
        window.open(intersects[0].object.userData.url, '_blank');
    }
});

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mouse.x * 0.5 - group.rotation.y) * 0.05;
    group.rotation.x += (-mouse.y * 0.2 - group.rotation.x) * 0.05;
    
    group.children.forEach((c, i) => {
        c.position.y = Math.sin(Date.now() * 0.001 + i) * 0.1;
    });
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerWidth < 768) {
        camera.position.z = 10;
        group.children.forEach((c, i) => { c.position.x = 0; c.position.y = (i - 1) * 3.5; });
    } else {
        camera.position.z = 6;
        group.children.forEach((c, i) => { c.position.x = (i - 1) * 3.2; c.position.y = 0; });
    }
});

window.dispatchEvent(new Event('resize'));
animate();
