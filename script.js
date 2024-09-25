let scene, camera, renderer, controls, pointerLocked = false;

const moveSpeed = 0.1;
const rotationSpeed = 0.002;
let keys = { w: false, a: false, s: false, d: false };

init();
animate();

function init() {
    // Buat scene
    scene = new THREE.Scene();

    // Buat kamera (First Person)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // Tinggi mata pada posisi default

    // Buat renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Buat lantai
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // Event listener untuk mouse lock (Pointer Lock API)
    document.addEventListener('click', () => {
        if (!pointerLocked) {
            document.body.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        pointerLocked = !!document.pointerLockElement;
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyW') keys.w = true;
        if (e.code === 'KeyA') keys.a = true;
        if (e.code === 'KeyS') keys.s = true;
        if (e.code === 'KeyD') keys.d = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'KeyW') keys.w = false;
        if (e.code === 'KeyA') keys.a = false;
        if (e.code === 'KeyS') keys.s = false;
        if (e.code === 'KeyD') keys.d = false;
    });

    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        if (pointerLocked) {
            camera.rotation.y -= e.movementX * rotationSpeed;
            camera.rotation.x -= e.movementY * rotationSpeed;
            camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x)); // Batas rotasi vertikal
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Gerakan pemain
    if (keys.w) {
        camera.position.x -= Math.sin(camera.rotation.y) * moveSpeed;
        camera.position.z -= Math.cos(camera.rotation.y) * moveSpeed;
    }
    if (keys.s) {
        camera.position.x += Math.sin(camera.rotation.y) * moveSpeed;
        camera.position.z += Math.cos(camera.rotation.y) * moveSpeed;
    }
    if (keys.a) {
        camera.position.x -= Math.cos(camera.rotation.y) * moveSpeed;
        camera.position.z += Math.sin(camera.rotation.y) * moveSpeed;
    }
    if (keys.d) {
        camera.position.x += Math.cos(camera.rotation.y) * moveSpeed;
        camera.position.z -= Math.sin(camera.rotation.y) * moveSpeed;
    }

    // Render scene
    renderer.render(scene, camera);
}