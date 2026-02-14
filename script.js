const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.4));

// Data
const myData = [
    { title: "WHO AM I?", desc: "I am Madhav Sharma, a passionate web designer who loves creating modern and responsive websites. My greatest strength is being an optimist.", color: 0x00ffcc },
    { title: "MY SKILLS", desc: "I enjoy experimenting with new ideas and technologies to build unique websites. Optimism helps me learn from every challenge.", color: 0xff0055 },
    { title: "MY HOBBIES", desc: "In my free time, I love playing basketball and staying active. I believe in staying energetic both in code and on the court!", color: 0x5500ff }
];

const group = new THREE.Group();
myData.forEach((data, i) => {
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

// Interaction
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
        document.getElementById('side-title').innerText = d.title;
        document.getElementById('side-desc').innerText = d.desc;
        document.getElementById('info-sidebar').classList.add('open');
    }
});

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mX * 0.4 - group.rotation.y) * 0.1;
    group.rotation.x += (mY * 0.2 - group.rotation.x) * 0.1;
    group.children.forEach((c, i) => c.position.y = Math.sin(Date.now()*0.001+i)*0.1);
    renderer.render(scene, camera);
}
animate();

window.closeSidebar = () => document.getElementById('info-sidebar').classList.remove('open');
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
