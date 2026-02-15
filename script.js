gsap.registerPlugin(ScrollTrigger);

const video = document.getElementById('bg-video');
let accelamount = 0.1; // Smoothness factor (Higher = faster, Lower = smoother)
let scrollpos = 0;
let delay = 0;

// Force video to prepare
video.pause();

ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
        scrollpos = self.progress;
    }
});

// Smooth Interpolation Loop
function smoothVideoUpdate() {
    if (video.duration) {
        // scrollpos * duration is our target
        // delay is the current smoothed position
        delay += (scrollpos - delay) * accelamount;
        video.currentTime = delay * video.duration;
    }
    requestAnimationFrame(smoothVideoUpdate);
}
smoothVideoUpdate();

// 3D Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

const cardData = [{color: 0x00ffcc}, {color: 0xff0055}, {color: 0x5500ff}];
const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8 })
    );
    card.position.x = (i - 1) * 3.8;
    group.add(card);
});
scene.add(group);
camera.position.z = 8;

// Cards disappear as you scroll
gsap.to(group.position, {
    scrollTrigger: { trigger: ".gallery-section", start: "top bottom", scrub: 1 },
    y: 15, opacity: 0
});

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
