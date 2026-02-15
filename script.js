gsap.registerPlugin(ScrollTrigger);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.6));

const cardData = [
    { title: "INTRO", desc: "I am Madhav Sharma, a passionate web designer from MIET Jammu.", color: 0x00ffcc },
    { title: "EDUCATION", desc: "12th: Dalhousie Hilltop School. Currently: MIET Cyber Security.", color: 0xff0055 },
    { title: "VISION", desc: "Exploring the intersection of Cyber Security and Human Cognition.", color: 0x5500ff }
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

// --- CRITICAL VIDEO SCROLL LOGIC ---
const video = document.getElementById('bg-video');
let scrollPos = 0;

ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.1,
    onUpdate: (self) => {
        scrollPos = self.progress;
    }
});

// Force smooth video frame updates
function syncVideo() {
    if (video.duration) {
        const targetTime = video.duration * scrollPos;
        video.currentTime = gsap.utils.interpolate(video.currentTime, targetTime, 0.1);
    }
    requestAnimationFrame(syncVideo);
}
syncVideo();

// Cards fly away on scroll
gsap.to(group.position, {
    scrollTrigger: { trigger: ".gallery-section", start: "top bottom", scrub: 1 },
    y: 10, opacity: 0
});

// Interactions
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
