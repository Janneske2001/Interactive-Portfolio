import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
 75,
 window.innerWidth / window.innerHeight,
 0.1,
 1000
)

camera.position.set(0, 5, 5)
camera.lookAt(0, 1, 0)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

})

// Grid
const grid = new THREE.GridHelper(40, 40)
scene.add(grid)

// Cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
const cube = new THREE.Mesh(geometry, material)
// cube.position.y = 1
cube.position.set(0,0,0)

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

 controls.update()

 renderer.render(scene, camera)

}

animate()