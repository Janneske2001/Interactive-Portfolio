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
    
    // Gyro/Touch state
    let touchStartTime = 0
    let touchStartPosition = { x: 0, y: 0 }
    let isTouching = false
    let lastTouchPosition = { x: 0, y: 0 }
    
    // Gyro data
    let gyroRotation = { x: 0, y: 0, z: 0 }
    let gyroSupported = false
    let gyroEnabled = false
    
    // Check if device has gyro
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Request gyro permission (iOS requires user interaction)
    function requestGyroPermission() {
        if (!isMobile) return
        
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS requires explicit permission
            const permissionButton = document.createElement('button')
            permissionButton.textContent = 'Enable Motion Control'
            permissionButton.style.position = 'fixed'
            permissionButton.style.bottom = '20px'
            permissionButton.style.left = '20px'
            permissionButton.style.zIndex = '1000'
            permissionButton.style.padding = '10px 20px'
            permissionButton.style.backgroundColor = '#f40fed'
            permissionButton.style.color = 'white'
            permissionButton.style.border = 'none'
            permissionButton.style.borderRadius = '5px'
            permissionButton.style.cursor = 'pointer'
            permissionButton.style.fontSize = '14px'
            
            permissionButton.onclick = async () => {
                try {
                    const response = await DeviceOrientationEvent.requestPermission()
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleGyro)
                        gyroSupported = true
                        gyroEnabled = true
                        permissionButton.remove()
                        console.log('Gyro enabled')
                    }
                } catch (error) {
                    console.error('Gyro permission denied:', error)
                    permissionButton.remove()
                }
            }
            
            document.body.appendChild(permissionButton)
        } else if ('DeviceOrientationEvent' in window) {
            // Android and other devices
            window.addEventListener('deviceorientation', handleGyro)
            gyroSupported = true
            gyroEnabled = true
            console.log('Gyro supported')
        } else {
            console.log('Gyro not supported')
        }
    }

    // Show indicator when gyro is enabled
    const indicator = document.getElementById('gyro-indicator')
    if (indicator) {
        indicator.style.display = 'block'
        setTimeout(() => {
            indicator.style.opacity = '0.5'
        }, 3000)
    }
    
    // Handle gyro data
    function handleGyro(event) {
        if (!gyroEnabled || projectOpen) return
        
        // Normalize values (beta: front-back tilt, gamma: left-right tilt)
        // beta range: -180 to 180, gamma range: -90 to 90
        let beta = event.beta || 0  // Front-back tilt
        let gamma = event.gamma || 0 // Left-right tilt
        
        // Clamp and normalize for smoother rotation
        const maxTilt = 45 // Maximum tilt angle in degrees
        const normalizedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta)) / maxTilt
        const normalizedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma)) / maxTilt
        
        // Apply smoothing (low-pass filter)
        gyroRotation.x += (normalizedBeta * 0.5 - gyroRotation.x) * 0.1
        gyroRotation.y += (normalizedGamma * 0.5 - gyroRotation.y) * 0.1
        gyroRotation.z = 0
    }
    
    // Request gyro permission on user interaction (required for iOS)
    function enableGyroOnFirstTouch() {
        if (!gyroSupported && isMobile) {
            requestGyroPermission()
            // Remove listener after first touch
            window.removeEventListener('touchstart', enableGyroOnFirstTouch)
        }
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
        if (gyroEnabled && isMobile) return // Skip mouse on mobile with gyro
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

    // Initialize gyro
    if (isMobile) {
        requestGyroPermission()
        window.addEventListener('touchstart', enableGyroOnFirstTouch)
    }

    function update(gridTexture) {
        // Update raycasting
        if (isTouching) {
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

        // Apply rotation based on input method
        objects.forEach((object) => {
            if (gyroEnabled && isMobile && !projectOpen) {
                // Use gyro for rotation on mobile
                // Only rotate non-selected objects
                if (object !== selectedObject) {
                    // Smooth gyro rotation
                    object.rotation.x += (gyroRotation.x * 0.8 - object.rotation.x) * 0.1
                    object.rotation.y += (gyroRotation.y * 0.8 - object.rotation.y) * 0.1
                    object.rotation.z += (gyroRotation.z * 0.5 - object.rotation.z) * 0.1
                } else {
                    // Selected object still responds to gyro but less
                    object.rotation.x += (gyroRotation.x * 0.4 - object.rotation.x) * 0.1
                    object.rotation.y += (gyroRotation.y * 0.4 - object.rotation.y) * 0.1
                }
            } else if (!gyroEnabled || !isMobile) {
                // Use mouse/touch for rotation on desktop or when gyro is disabled
                const rotationStrength = isTouching ? 0.3 : 0.6
                const vector = object.position.clone()
                vector.project(camera)
                const dx = mouse.x - vector.x
                const dy = mouse.y - vector.y
                object.rotation.y += (dx * rotationStrength - object.rotation.y) * 0.1
                object.rotation.x += (-dy * 0.4 - object.rotation.x) * 0.1
            }
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