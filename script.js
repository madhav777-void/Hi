const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1.2);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));

// Data updated as per your request
const cardData = [
    { 
        title: "HELLO.", 
        desc: "I am Madhav Sharma, a passionate web designer who loves creating modern and responsive websites. My greatest strength is being an optimist, always finding solutions and learning from challenges. I enjoy experimenting with new ideas and technologies to build unique websites. In my free time, I love playing basketball and staying active.", 
        color: 0x00ffcc 
    },
    { title: "PROJECTS", desc: "Coming soon... Stay tuned for some unique 3D web experiences.", color: 0x333333 },
    { title: "CONTACT", desc: "Let's build something amazing together. Reach out via email or LinkedIn.", color: 0x333333 }
];

const group = new THREE.Group();
cardData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 3.2, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.8, roughness: 0.1 })
    );
    card.position.x = (i - 1) * 3.8;
    card.userData = data;
    group.add(card);
});
scene.add(group);
camera.position.z = 8;

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

    // GSAP Animation: Udta hua effect
    gsap.to("#info-sidebar", { duration: 0.8, x: 0, ease: "expo.out" });
    gsap.to("#content-wrapper", { duration: 1, opacity: 1, y: 0, delay: 0.3, ease: "power4.out" });
}

window.closeSidebar = () => {
    gsap.to("#content-wrapper", { duration: 0.5, opacity: 0, y: 30 });
    gsap.to("#info-sidebar", { duration: 0.8, x: "100%", ease: "expo.in" });
};

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mX * 0.3 - group.rotation.y) * 0.1;
    group.rotation.x += (mY * 0.1 - group.rotation.x) * 0.1;
    group.children.forEach((c, i) => c.position.y = Math.sin(Date.now()*0.001+i)*0.1);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
