const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));

// Data Mapping
const cardData = [
    { 
        title: "INTRO", 
        desc: "I am Madhav Sharma, a passionate web designer who loves creating modern and responsive websites. My greatest strength is being an optimist, always finding solutions. In my free time, I love playing basketball.", 
        color: 0x00ffcc 
    },
    { 
        title: "EDUCATION", 
        desc: "Completed 12th from Dalhousie Hilltop School, Himachal Pradesh (Non-Med with Python). Currently pursuing Cyber Security at Model Institute of Engineering and Technology (MIET).", 
        color: 0xff0055 
    },
    { 
        title: "AIM", 
        desc: "Securing the digital world with unique designs and advanced technical skills in Cyber Security.", 
        color: 0x5500ff 
    }
];

const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.7, roughness: 0.2 })
    );
    card.position.x = (i - 1) * 3.5;
    card.userData = data;
    group.add(card);
});
scene.add(group);
camera.position.z = 7;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mX = 0, mY = 0;

window.addEventListener('mousemove', (e) => {
    mX = (e.clientX / window.innerWidth - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 0) {
        const d = intersects[0].object.userData;
        openSidebar(d.title, d.desc);
    }
});

function openSidebar(title, desc) {
    document.getElementById('side-title').innerText = title;
    document.getElementById('side-desc').innerText = desc;

    // GSAP Flying Animation
    gsap.to("#info-sidebar", { duration: 0.7, x: 0, ease: "power3.out" });
    gsap.fromTo("#content-wrapper", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "back.out(1.7)" }
    );
}

window.closeSidebar = () => {
    gsap.to("#info-sidebar", { duration: 0.5, x: "100%", ease: "power3.in" });
};

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mX * 0.4 - group.rotation.y) * 0.1;
    group.rotation.x += (mY * 0.2 - group.rotation.x) * 0.1;
    renderer.render(scene, camera);
}
animate();
