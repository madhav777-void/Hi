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
    { title: "INTRO", desc: "Madhav Sharma - Optimist & Web Designer.", color: 0x00ffcc },
    { title: "EDUCATION", desc: "12th: Dalhousie Hilltop. Current: MIET Cyber Security.", color: 0xff0055 },
    { title: "VISION", desc: "Cyber Security & Human Brain interaction.", color: 0x5500ff }
];

const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8 })
    );
    card.position.x = (i - 1) * 3.8;
    card.userData = data;
    group.add(card);
});
scene.add(group);
camera.position.z = 8;

// --- FINAL VIDEO SCROLL SOLUTION ---
const video = document.getElementById('bg-video');

// Step 1: Force video to play then pause to "wake up" the browser engine
video.play().then(() => {
    video.pause();
});

// Step 2: Use GSAP to animate the 'currentTime' property directly
ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // Increased scrub for smoother frame delivery
    onUpdate: (self) => {
        if (video.duration) {
            // Directly setting the frame based on progress
            video.currentTime = self.progress * (video.duration - 0.1);
        }
    }
});

// Cards fly away logic
gsap.to(group.position, {
    scrollTrigger: { trigger: ".gallery-section", start: "top bottom", scrub: 1 },
    y: 10, opacity: 0
});

// Sidebar logic
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
        document.getElementById('info-sidebar').style.transform = "translateX(0)";
        gsap.fromTo("#content-wrapper", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 });
    }
});

window.closeSidebar = () => {
    document.getElementById('info-sidebar').style.transform = "translateX(100%)";
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
