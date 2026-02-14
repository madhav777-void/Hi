// ... (Purana setup camera, scene ka wahi rahega) ...

// Mouse Interaction variables
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isSidebarLocked = false; // Check karne ke liye ki click hua hai ya nahi

window.addEventListener('mousemove', (e) => {
    // 3D Rotation ke liye logic
    mX = (e.clientX / window.innerWidth - 0.5) * 2;
    mY = (e.clientY / window.innerHeight - 0.5) * 2;

    // Hover Detection (Jhalak dikhane ke liye)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    const sidebar = document.getElementById('info-sidebar');

    if (intersects.length > 0 && !isSidebarLocked) {
        // Agar cursor card par hai aur click nahi hua
        const d = intersects[0].object.userData;
        document.getElementById('side-title').innerText = d.title;
        document.getElementById('side-desc').innerText = d.desc;
        sidebar.classList.add('preview'); // Jhalak dikhao
    } else if (!isSidebarLocked) {
        sidebar.classList.remove('preview'); // Jhalak hatao
    }
});

window.addEventListener('click', (e) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    const sidebar = document.getElementById('info-sidebar');

    if (intersects.length > 0) {
        const d = intersects[0].object.userData;
        document.getElementById('side-title').innerText = d.title;
        document.getElementById('side-desc').innerText = d.desc;
        
        isSidebarLocked = true; // Lock kar do
        sidebar.classList.remove('preview');
        sidebar.classList.add('open'); // Poora dikhao
    } else {
        // Agar kahin bahar click kiya toh band kar do
        closeSidebar();
    }
});

window.closeSidebar = () => {
    isSidebarLocked = false;
    const sidebar = document.getElementById('info-sidebar');
    sidebar.classList.remove('open');
    sidebar.classList.remove('preview');
};
