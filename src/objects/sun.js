import * as THREE from 'three'

// Vapor Sun
export function createSun(scene) {

    const sunGeometry = new THREE.PlaneGeometry(12.5, 12.5)
    const sunTexture = new THREE.TextureLoader().load('../images/VaporSun.png')

    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
    sunMaterial.transparent = true

    const plane = new THREE.Mesh(sunGeometry, sunMaterial)

    plane.position.y = 3
    plane.position.z = -20

    scene.add(plane)
}