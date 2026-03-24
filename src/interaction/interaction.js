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
    
    // Touch state for mobile
    let touchStartTime = 0
    let touchStartPosition = { x: 0, y: 0 }
    let isTouching = false
    let lastTouchPosition = { x: 0, y: 0 }

    window.setProjectOpen = (value) => {
        projectOpen = value
    }

    // Helper function to get normalized device coordinates
    function getNormalizedCoordinates(clientX, clientY) {
        return {
            x: (clientX / window.innerWidth) * 2 - 1,
            y: -(clientY / window.innerHeight) * 2 + 1
        }
    }

    // Mouse events (desktop)
    window.addEventListener("mousemove", (event) => {
        const coords = getNormalizedCoordinates(event.clientX, event.clientY)
        mouse.x = coords.x
        mouse.y = coords.y
    })

    // Touch events (mobile)
    window.addEventListener("touchstart", (event) => {
        event.preventDefault()
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        
        touchStartTime = Date.now()
        touchStartPosition = { x: coords.x, y: coords.y }
        lastTouchPosition = { x: coords.x, y: coords.y }
        isTouching = true
        
        // Update mouse position for immediate feedback
        mouse.x = coords.x
        mouse.y = coords.y
    })

    window.addEventListener("touchmove", (event) => {
        event.preventDefault()
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        
        mouse.x = coords.x
        mouse.y = coords.y
        lastTouchPosition = { x: coords.x, y: coords.y }
    })

    window.addEventListener("touchend", (event) => {
        event.preventDefault()
        isTouching = false
        
        const touchDuration = Date.now() - touchStartTime
        const touchDistance = Math.hypot(
            lastTouchPosition.x - touchStartPosition.x,
            lastTouchPosition.y - touchStartPosition.y
        )
        
        // Detect tap (short duration and minimal movement)
        if (touchDuration < 300 && touchDistance < 0.1) {
            // Trigger click for mobile taps
            handleProjectClick()
        }
    })

    // Click Event (desktop)
    window.addEventListener("click", () => {
        handleProjectClick()
    })

    // Separate function to handle project selection
    function handleProjectClick() {
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
    }

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

    // Add close button listener (works on both desktop and mobile)
    const closeButton = document.getElementById("close-project")
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            import('../ui/projectPanel.js').then(module => {
                module.closeProject()
                resetCameraPosition()
            })
        })
        
        // Add touch event for mobile
        closeButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            import('../ui/projectPanel.js').then(module => {
                module.closeProject()
                resetCameraPosition()
            })
        })
    }

    function update(gridTexture) {
        // Update raycasting for both mouse and touch
        if (isTouching) {
            // For mobile, we can still raycast on every frame for hover feedback
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
        } else {
            // Desktop raycasting
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
        }

        // Smooth scaling
        const lerpFactor = 0.2
        objects.forEach(object => {
            const target = object.userData.targetScale
            const scale = object.scale
            scale.x += (target - scale.x) * lerpFactor
            scale.y += (target - scale.y) * lerpFactor
            scale.z += (target - scale.z) * lerpFactor
        })

        // Bounce Animation
        const time = clock.getElapsedTime()
        objects.forEach((object, index) => {
            if (object !== selectedObject) {
                object.position.y = 1 + Math.sin(time + index) * 0.2
            }
        })

        // Follow Mouse/Touch (reduced intensity on mobile for better performance)
        const rotationStrength = isTouching ? 0.3 : 0.6 // Less rotation on mobile
        objects.forEach((object) => {
            const vector = object.position.clone()
            vector.project(camera)
            const dx = mouse.x - vector.x
            const dy = mouse.y - vector.y
            object.rotation.y += (dx * rotationStrength - object.rotation.y) * 0.1
            object.rotation.x += (-dy * 0.4 - object.rotation.x) * 0.1
        })

        // Move Grid
        gridTexture.offset.y += 0.003

        // Camera movement
        if (cameraTargetPosition) {
            camera.position.lerp(cameraTargetPosition, 0.1)
            if (controlsTargetPosition) {
                controls.target.lerp(controlsTargetPosition, 0.1)
            }
            
            if (camera.position.distanceTo(cameraTargetPosition) < 0.05) {
                cameraTargetPosition = null
                controlsTargetPosition = null
            }
        }
    }

    return { update }
}