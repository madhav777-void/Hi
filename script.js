gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));

const cardData = [
    { title: "INTRO", desc: "Madhav Sharma - MIET Student & Designer.", color: 0x00ffcc },
    { title: "QUALIFICATION", desc: "Dalhousie Hilltop School & MIET Cyber Security.", color: 0xff0055 },
    { title: "VISION", desc: "Understanding Brain & Security.", color: 0x5500ff }
];

const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8 })
    );
    card.position.x = (i - 1) * 3.5;
    card.userData = data;
    group.add(card);
});
scene.add(group);
camera.position.z = 8;

// --- VIDEO SCROLL FIX START ---
const video = document.getElementById('bg-video');

// 1. Force video to load and be ready
video.addEventListener('loadedmetadata', () => {
    console.log("Video Duration: ", video.duration);
});

// 2. Smooth Scroll Sync
let targetTime = 0;
ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
        // Target time calculation
        targetTime = self.progress * video.duration;
    }
});

// Use a loop to update video frame smoothly (Bypasses lag)
function updateVideo() {
    if (video.duration) {
        // This makes it buttery smooth
        video.currentTime = gsap.utils.interpolate(video.currentTime, targetTime, 0.1);
    }
    requestAnimationFrame(updateVideo);
}
updateVideo();
// --- VIDEO SCROLL FIX END ---

// Cards Fly-away on scroll
gsap.to(group.position, {
    scrollTrigger: { trigger: ".gallery-section", start: "top bottom", scrub: 1 },
    y: 10, opacity: 0
});

// Interaction
window.addEventListener('click', (e) => {
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length > 0) {
        const d = intersects[0].object.userData;
        document.getElementById('side-title').innerText = d.title;
        document.getElementById('side-desc').innerText = d.desc;
        document.getElementById('info-sidebar').classList.add('open');
        gsap.to("#content-wrapper", { opacity: 1, y: 0, delay: 0.2 });
    }
});

window.closeSidebar = () => document.getElementById('info-sidebar').classList.remove('open');

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
