const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lights
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(5, 5, 5);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

const myData = [
    { title: "WHO AM I?", desc: "I am Madhav Sharma, a passionate web designer and optimist who loves finding solutions and learning from challenges.", color: 0x00ffcc },
    { title: "MY SKILLS", desc: "Expertise in creating modern, responsive websites and experimenting with new tech like Three.js.", color: 0xff0055 },
    { title: "MY LIFESTYLE", desc: "Basketball player and active learner. I bring the same energy to my code as I do to the court.", color: 0x5500ff }
];

const group = new THREE.Group();
myData.forEach((data, i) => {
    const card = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.1),
        new THREE.MeshStandardMaterial({ color: data.color, metalness: 0.6, roughness: 0.2 })
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
let isLocked = false;

window.addEventListener('mousemove', (e) => {
    mX = (e.clientX / window.innerWidth - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    if (!isLocked) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(group.children);
        const sb = document.getElementById('info-sidebar');
        if (intersects.length > 0) {
            updateSidebar(intersects[0].object.userData);
            sb.classList.add('preview');
        } else {
            sb.classList.remove('preview');
        }
    }
});

window.addEventListener('click', (e) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    const sb = document.getElementById('info-sidebar');
    if (intersects.length > 0) {
        updateSidebar(intersects[0].object.userData);
        isLocked = true;
        sb.classList.remove('preview');
        sb.classList.add('open');
    } else {
        closeSidebar();
    }
});

function updateSidebar(data) {
    document.getElementById('side-title').innerText = data.title;
    document.getElementById('side-desc').innerText = data.desc;
}

window.closeSidebar = () => {
    isLocked = false;
    document.getElementById('info-sidebar').classList.remove('open', 'preview');
};

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += (mX * 0.3 - group.rotation.y) * 0.1;
    group.rotation.x += (mY * 0.1 - group.rotation.x) * 0.1;
    group.children.forEach((c, i) => c.position.y = Math.sin(Date.now()*0.001+i)*0.15);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
