const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

const cardData = [
    { title: "HELLO.", desc: "I am Madhav Sharma, a passionate web designer and optimist. I love building unique 3D websites and playing basketball.", color: 0x00ffcc },
    { title: "EDUCATION", desc: "12th: Dalhousie Hilltop School (Python/Non-Med). Currently: Pursuing Cyber Security at MIET.", color: 0xff0055 },
    { title: "AIM", desc: "Blending high-end security with creative 3D web experiences.", color: 0x5500ff }
];

const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.7, roughness: 0.2 })
    );
    
    // Mobile Check for card spacing
    const isMobile = window.innerWidth < 768;
    card.position.x = isMobile ? (i - 1) * 2.5 : (i - 1) * 3.5;
    if(isMobile) card.scale.set(0.8, 0.8, 0.8);

    card.userData = data;
    group.add(card);
});
scene.add(group);
camera.position.z = window.innerWidth < 768 ? 9 : 7;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mX = 0, mY = 0;

window.addEventListener('mousemove', (e) => {
    mX = (e.clientX / window.innerWidth - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Touch & Click Event
const handleInteraction = (clientX, clientY) => {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length > 0) openSidebar(intersects[0].object.userData);
};

window.addEventListener('click', (e) => handleInteraction(e.clientX, e.clientY));
window.addEventListener('touchstart', (e) => handleInteraction(e.touches[0].clientX, e.touches[0].clientY));

function openSidebar(data) {
    document.getElementById('side-title').innerText = data.title;
    document.getElementById('side-desc').innerText = data.desc;
    gsap.to("#info-sidebar", { duration: 0.6, x: 0, ease: "power2.out" });
    gsap.fromTo("#content-wrapper", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
}

window.closeSidebar = () => gsap.to("#info-sidebar", { duration: 0.5, x: "100%", ease: "power2.in" });

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mX * 0.3 - group.rotation.y) * 0.1;
    group.rotation.x += (mY * 0.1 - group.rotation.x) * 0.1;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = window.innerWidth < 768 ? 9 : 7;
});
