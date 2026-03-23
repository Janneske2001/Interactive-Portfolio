import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'

// Renderer + Controls
export function createControls(camera, domElement) {

    const controls = new OrbitControls(camera, domElement)

    controls.enableDamping = true

    // Max-Min Zoom
    controls.minDistance = 3
    controls.maxDistance = 8

    // Prevent Clipping Bottom
    controls.maxPolarAngle = Math.PI / 2

    // Prevent Panning Away
    const minPan = new THREE.Vector3(-5, 1, -5);
    const maxPan = new THREE.Vector3(5, 2, 5);

    controls.addEventListener('change', () => {
        controls.target.clamp(minPan, maxPan);
    });

    // Lock Target
    controls.target.set(0, 0.5, 0)
    controls.update()

    return controls
}
