import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
 75,
 window.innerWidth / window.innerHeight,
 0.1,
 1000
)

camera.position.set(5, 5, 5)
camera.lookAt(0, 0, 0)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Grid
const grid = new THREE.GridHelper(20, 20)
scene.add(grid)

// Cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// Light
const light = new THREE.PointLight(0xffffff, 10)
light.position.set(5, 5, 5)
scene.add(light)

// Animation
function animate() {

 requestAnimationFrame(animate)

 cube.rotation.x += 0.01
 cube.rotation.y += 0.01

 renderer.render(scene, camera)

}

animate()