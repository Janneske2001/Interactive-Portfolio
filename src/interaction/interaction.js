import * as THREE from 'three'
import { showProject } from '../ui/projectPanel.js'

export function createInteraction(camera, controls, objects) {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const clock = new THREE.Clock()

    let hoveredObject = null
    let targetObject = null
    let selectedObject = null
    let projectOpen = false

    let cameraTargetPosition = null
    let controlsTargetPosition = null
    
    // Store original camera position and controls target
    const originalCameraPosition = camera.position.clone()
    const originalControlsTarget = controls.target.clone()

    window.setProjectOpen = (value) => {
        projectOpen = value
    }

    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    })

    // Click Event Zoom In
    window.addEventListener("click", () => {
        if (projectOpen) return

        if (hoveredObject) {
            targetObject = hoveredObject
            selectedObject = hoveredObject

            selectedObject.userData.targetScale = 1.5

            cameraTargetPosition = new THREE.Vector3(
                hoveredObject.position.x,
                hoveredObject.position.y + 3.5,
                hoveredObject.position.z + 0.4
            )

            controlsTargetPosition = hoveredObject.position.clone()
            
            projectOpen = true
            showProject(hoveredObject.userData.project)
        }
    })

    // Function to reset camera to original position
    function resetCameraPosition() {
        cameraTargetPosition = originalCameraPosition.clone()
        controlsTargetPosition = originalControlsTarget.clone()
        
        // Reset selected object scale
        if (selectedObject) {
            selectedObject.userData.targetScale = 1
            selectedObject = null
        }
        
        targetObject = null
    }

    // Add close button listener
    const closeButton = document.getElementById("close-project")
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            import('../ui/projectPanel.js').then(module => {
                module.closeProject()
                resetCameraPosition() // Reset camera when closing
            })
        })
    }

    function update(gridTexture) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(objects)

        if (intersects.length > 0) {
            const object = intersects[0].object

            if (hoveredObject !== object) {
                if (hoveredObject && hoveredObject !== selectedObject) {
                    hoveredObject.userData.targetScale = 1
                }

                hoveredObject = object

                if (object !== selectedObject) {
                    object.userData.targetScale = 1.5
                }
            }
        } else {
            if (hoveredObject && hoveredObject !== selectedObject) {
                hoveredObject.userData.targetScale = 1
            }
            hoveredObject = null
        }

        objects.forEach(object => {
            const s = object.userData.targetScale
            object.scale.x += (s - object.scale.x) * 0.2
            object.scale.y += (s - object.scale.y) * 0.2
            object.scale.z += (s - object.scale.z) * 0.2
        })

        const time = clock.getElapsedTime()
        objects.forEach((object, index) => {
            if (object !== selectedObject) {
                object.position.y = 1 + Math.sin(time + index) * 0.2
            }
        })

        objects.forEach((object) => {
            const vector = object.position.clone()
            vector.project(camera)
            const dx = mouse.x - vector.x
            const dy = mouse.y - vector.y
            object.rotation.y += (dx * 0.6 - object.rotation.y) * 0.1
            object.rotation.x += (-dy * 0.4 - object.rotation.x) * 0.1
        })

        gridTexture.offset.y += 0.003

        // Handle camera movement to target position
        if (cameraTargetPosition) {
            camera.position.lerp(cameraTargetPosition, 0.1)
            if (controlsTargetPosition) {
                controls.target.lerp(controlsTargetPosition, 0.1)
            }
            
            // Check if we've reached the target position
            if (camera.position.distanceTo(cameraTargetPosition) < 0.05) {
                cameraTargetPosition = null
                controlsTargetPosition = null
            }
        }
    }

    return { update }
}