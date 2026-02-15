gsap.registerPlugin(ScrollTrigger);

// 1. Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

// 2. The 3 Cards Logic
const cardData = [
    { title: "WHO AM I?", desc: "Madhav Sharma, MIET Student and creative thinker.", color: 0x00ffcc },
    { title: "STUDIES", desc: "Non-Med background, now diving into Cyber Security.", color: 0xff0055 },
    { title: "GOAL", desc: "Mastering the digital world through design and code.", color: 0x5500ff }
];

const cardsGroup = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.7, roughness: 0.2 })
    );
    card.position.x = (i - 1) * 3.5;
    card.userData = data;
    cardsGroup.add(card);
});
scene.add(cardsGroup);
camera.position.z = 8;

// 3. Scroll Sync: Cards & Video
const video = document.getElementById('bg-video');

ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5, // High scrub for butter smoothness
    onUpdate: (self) => {
        // Video Control
        if (video.duration) {
            video.currentTime = self.progress * (video.duration - 0.1);
        }
        // Cards Movement (Fly up as you scroll)
        cardsGroup.position.y = self.progress * 15;
        cardsGroup.rotation.z = self.progress * 0.5;
    }
});

// 4. Click & Sidebar Logic
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cardsGroup.children);
    
    if (intersects.length > 0) {
        const info = intersects[0].object.userData;
        document.getElementById('side-title').innerText = info.title;
        document.getElementById('side-desc').innerText = info.desc;
        document.getElementById('info-sidebar').style.transform = "translateX(0)";
    }
});

window.closeSidebar = () => {
    document.getElementById('info-sidebar').style.transform = "translateX(100%)";
};

// 5. Animation Loop
function animate() {
    requestAnimationFrame(animate);
    // Gentle floating rotation
    cardsGroup.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
