import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let hoveredCube = null

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(0, 8, 4)
// camera.lookAt(0, 0, 0)

// Renderer + Controls
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// Max-Min Zoom
controls.minDistance = 6
controls.maxDistance = 12
// Prevent Clipping Bottom
controls.maxPolarAngle = Math.PI / 2
// Prevent Panning Away
controls.enablePan = false
// Lock Target
controls.target.set(0, 0.5, 0)
controls.update()



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

// SINGLE CUBE
const cube = new THREE.Mesh(geometry, material)
// cube.position.y = 1
cube.position.set(0,0,0)

// scene.add(cube)


// ------------------------------     PROJECT DATA
const projects = [
  {
    title: "NOVA Breach",
    type: "game",
    link: "https://example.com/nova",
    texture: null
  },
  {
    title: "3D Print Gearbox",
    type: "3d",
    link: "https://example.com/gearbox",
    texture: null
  },
  {
    title: "Portfolio Website",
    type: "web",
    link: "https://example.com/portfolio",
    texture: null
  },
  {
    title: "Hardware Mod",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  },
  {
    title: "TEST1",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  },
  {
    title: "TEST2",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  },
  {
    title: "TEST3",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  },
  {
    title: "TEST4",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  },
  {
    title: "TEST5",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  },
  {
    title: "TEST6",
    type: "hardware",
    link: "https://example.com/mod",
    texture: null
  }
]


// GRID OF CUBES
// const cubes = []

// const gridSize = 3
// const xSpacing = 4
// const zSpacing = 3

// for (let x = 0; x < gridSize; x++) {
//   for (let z = 0; z < gridSize; z++) {

//     const cube = new THREE.Mesh(geometry, material)

//     cube.position.x = (x - gridSize / 2) * xSpacing + (xSpacing / 2)
//     cube.position.z = (z - gridSize / 2) * zSpacing + (zSpacing / 2)
//     cube.position.y = 1

//     scene.add(cube)
//     cubes.push(cube)

//   }
// }


// Cubes With Data
const cubes = []
const xSpacing = 3
const zSpacing = 3

projects.forEach((project, index) => {

  const cube = new THREE.Mesh(geometry, material)

  const rowLength = 4

  const x = index % rowLength
  const z = Math.floor(index / rowLength)

  cube.position.x = (x - rowLength / 2) * xSpacing + (xSpacing / 2)
  cube.position.z = (z - rowLength / 2) * zSpacing + (zSpacing)
  cube.position.y = 1

  cube.userData = project

  scene.add(cube)
  cubes.push(cube)

})


// Light
const light = new THREE.PointLight(0xffffff, 10)
light.position.set(5, 5, 5)
scene.add(light)


window.addEventListener("mousemove", (event) => {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

})


// Animation
function animate() {
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(cubes)

  if (intersects.length > 0) {
    const cube = intersects[0].object
    if (hoveredCube !== cube) {
      if (hoveredCube) {
        hoveredCube.scale.set(1,1,1)
      }

      hoveredCube = cube
      cube.scale.set(1.2,1.2,1.2)
    }

  } else {
    if (hoveredCube) {
      hoveredCube.scale.set(1,1,1)
    }

    hoveredCube = null

  }

  requestAnimationFrame(animate)

//  cube.rotation.x += 0.01
//  cube.rotation.y += 0.01

  controls.update()

  renderer.render(scene, camera)

}

window.addEventListener("click", () => {

  if (hoveredCube) {
    const project = hoveredCube.userData
    console.log("Opening project:", project.title)
    window.open(project.link, "_blank")
  }

})


animate()