import * as THREE from 'three';

const root = document.getElementById('app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
root.appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(1, 0.35, 120, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0x66fcf1,
  roughness: 0.28,
  metalness: 0.48,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const ambient = new THREE.AmbientLight(0xffffff, 0.45);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(2, 3, 4);
scene.add(keyLight);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize);

function render() {
  mesh.rotation.x += 0.004;
  mesh.rotation.y += 0.006;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
