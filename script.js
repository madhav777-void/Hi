gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

const cardData = [
    { title: "INTRO", desc: "I am Madhav Sharma, a passionate web designer and optimist from MIET. I love building unique 3D websites.", color: 0x00ffcc },
    { title: "EDUCATION", desc: "12th: Dalhousie Hilltop School. Currently: Pursuing Cyber Security at MIET Jammu.", color: 0xff0055 },
    { title: "VISION", desc: "Merging Cyber Security with creative 3D Web Development.", color: 0x5500ff }
];

const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8, roughness: 0.1 })
    );
    card.position.x = (i - 1) * 3.8;
    card.userData = data;
    group.add(card);
});
scene.add(group);
camera.position.z = 8;

// VIDEO SCROLL LOGIC
const video = document.getElementById('bg-video');
ScrollTrigger.create({
    trigger: "body", start: "top top", end: "bottom bottom", scrub: true,
    onUpdate: (self) => { if (video.duration) video.currentTime = video.duration * self.progress; }
});

// CARDS ANIMATION ON SCROLL
gsap.to(group.position, {
    scrollTrigger: {
        trigger: ".gallery-section", start: "top bottom", end: "top center", scrub: 1
    },
    y: 12, // Cards fly UP as you scroll down
    z: -5,
    opacity: 0
});

// Click Interaction
window.addEventListener('click', (e) => {
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length > 0) openSidebar(intersects[0].object.userData);
});

function openSidebar(data) {
    document.getElementById('side-title').innerText = data.title;
    document.getElementById('side-desc').innerText = data.desc;
    gsap.to("#info-sidebar", { duration: 0.6, x: 0, ease: "expo.out" });
    gsap.fromTo("#content-wrapper", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
}
window.closeSidebar = () => gsap.to("#info-sidebar", { duration: 0.5, x: "100%", ease: "expo.in" });

// Mouse Movement for 3D Cards
let mX = 0, mY = 0;
window.addEventListener('mousemove', (e) => {
    mX = (e.clientX / window.innerWidth - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mX * 0.4 - group.rotation.y) * 0.1;
    group.rotation.x += (mY * 0.2 - group.rotation.x) * 0.1;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
