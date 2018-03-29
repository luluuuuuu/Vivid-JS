var renderer, scene, camera, composer, controls, triangle, particle;

window.onload = function() {
    init();
    animate();
}

function init() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    document.getElementById('canvas').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene.add(camera);

    triangle = new THREE.Object3D();
    particle = new THREE.Object3D();

    scene.add(triangle);
    scene.add(particle);

    var geom_particle = new THREE.IcosahedronGeometry(2, 1);
    var geom_triangle = new THREE.TetrahedronGeometry(16, 0);

    var mat_particle = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: THREE.FlatShading
    });

    var mat_triangle = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        side: THREE.DoubleSide

    });

    for (var i = 0; i < 1000; i++) {
        var mesh_particle = new THREE.Mesh(geom_particle, mat_particle);
        mesh_particle.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        mesh_particle.position.multiplyScalar(90 + (Math.random() * 700));
        mesh_particle.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        particle.add(mesh_particle);
    }

    var mesh_triangle = new THREE.Mesh(geom_triangle, mat_triangle);
    mesh_triangle.scale.x = mesh_triangle.scale.y = mesh_triangle.scale.z = 10;
    triangle.add(mesh_triangle);

    var ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);

    var lights = [];
    lights[0] = new THREE.DirectionalLight(0xffffff, 1);
    lights[0].position.set(1, 0, 0);
    lights[1] = new THREE.DirectionalLight(0x3498DB, 1);
    lights[1].position.set(0.75, 1, 0.5);
    lights[2] = new THREE.DirectionalLight(0xFDA5D2, 1);
    lights[2].position.set(-0.75, -1, 0.5);
    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    window.addEventListener('resize', onWindowResize, false);
    var loader = new THREE.STLLoader();
    loader.load("deer.stl", function(geometry) {
        var material = new THREE.MeshPhongMaterial({
            color: 0x999999,
            specular: 0x111111,
            shininess: 200
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -60, 0);
        mesh.rotation.set(-Math.PI / 2, 0, 20);
        mesh.scale.set(0.36, 0.36, 0.36);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    });
};

var manager = new THREE.LoadingManager();
manager.onProgress = function(item, loaded, total) {

    console.log(item, loaded, total);

};

var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

var onError = function(xhr) {};



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    particle.rotation.x += 0.0000;
    particle.rotation.y -= 0.0040;
    triangle.rotation.x += 0.0020;
    triangle.rotation.y += 0.0020;
    renderer.clear();

    renderer.render(scene, camera)
};