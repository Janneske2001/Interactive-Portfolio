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
    let permissionButton = null
    
    // Check if device has gyro
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Handle gyro data with smoothing
    function handleGyro(event) {
        if (!gyroEnabled || projectOpen) return
        
        // Get beta (front-back) and gamma (left-right)
        let beta = event.beta || 0  // -180 to 180
        let gamma = event.gamma || 0 // -90 to 90
        
        // Limit tilt range for better experience
        const maxTilt = 35
        let normalizedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta)) / maxTilt
        let normalizedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma)) / maxTilt
        
        // Apply smoothing (low-pass filter)
        gyroRotation.x += (normalizedBeta * 0.6 - gyroRotation.x) * 0.15
        gyroRotation.y += (normalizedGamma * 0.6 - gyroRotation.y) * 0.15
    }
    
    // Create permission button (better implementation)
    function createPermissionButton() {
        // Remove existing button if any
        if (permissionButton) {
            permissionButton.remove()
        }
        
        permissionButton = document.createElement('button')
        permissionButton.id = 'gyro-permission-button'
        permissionButton.textContent = '🎮 Enable Motion Control'
        permissionButton.style.position = 'fixed'
        permissionButton.style.bottom = '20px'
        permissionButton.style.left = '20px'
        permissionButton.style.zIndex = '9999'
        permissionButton.style.padding = '12px 24px'
        permissionButton.style.background = 'linear-gradient(135deg, #f40fed, #8a2be2)'
        permissionButton.style.color = 'white'
        permissionButton.style.border = 'none'
        permissionButton.style.borderRadius = '25px'
        permissionButton.style.fontSize = '16px'
        permissionButton.style.fontWeight = 'bold'
        permissionButton.style.cursor = 'pointer'
        permissionButton.style.boxShadow = '0 0 15px rgba(244, 15, 237, 0.5)'
        permissionButton.style.fontFamily = 'monospace'
        permissionButton.style.pointerEvents = 'auto'
        
        // Add hover effect
        permissionButton.onmouseenter = () => {
            permissionButton.style.transform = 'scale(1.05)'
            permissionButton.style.boxShadow = '0 0 20px rgba(244, 15, 237, 0.8)'
        }
        permissionButton.onmouseleave = () => {
            permissionButton.style.transform = 'scale(1)'
            permissionButton.style.boxShadow = '0 0 15px rgba(244, 15, 237, 0.5)'
        }
        
        document.body.appendChild(permissionButton)
        return permissionButton
    }
    
    // Request gyro permission
    async function requestGyroPermission() {
        if (!isMobile) return
        
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS requires explicit permission
            const button = createPermissionButton()
            
            button.onclick = async (e) => {
                e.stopPropagation()
                try {
                    const response = await DeviceOrientationEvent.requestPermission()
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleGyro)
                        gyroSupported = true
                        gyroEnabled = true
                        button.remove()
                        showGyroIndicator(true)
                        console.log('Gyro enabled on iOS')
                    }
                } catch (error) {
                    console.error('Gyro permission denied:', error)
                    button.textContent = '❌ Motion Control Blocked'
                    setTimeout(() => {
                        button.remove()
                    }, 2000)
                }
            }
        } else if ('DeviceOrientationEvent' in window) {
            // Android and other devices
            window.addEventListener('deviceorientation', handleGyro)
            gyroSupported = true
            gyroEnabled = true
            showGyroIndicator(true)
            console.log('Gyro enabled on Android')
        } else {
            console.log('Gyro not supported')
            showGyroIndicator(false)
        }
    }
    
    // Show gyro indicator
    function showGyroIndicator(enabled) {
        const indicator = document.getElementById('gyro-indicator')
        if (indicator) {
            if (enabled) {
                indicator.textContent = '🎮 Motion Control Active'
                indicator.style.display = 'block'
                indicator.style.opacity = '1'
                setTimeout(() => {
                    indicator.style.opacity = '0.6'
                }, 3000)
            } else {
                indicator.textContent = '📱 Motion Control Not Available'
                indicator.style.display = 'block'
                setTimeout(() => {
                    indicator.style.opacity = '0.4'
                }, 3000)
            }
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
        if (gyroEnabled && isMobile) return
        const coords = getNormalizedCoordinates(event.clientX, event.clientY)
        mouse.x = coords.x
        mouse.y = coords.y
    })

    // Touch events (mobile)
    window.addEventListener("touchstart", (event) => {
        // Don't prevent default on the permission button
        if (event.target.id === 'gyro-permission-button') return
        
        event.preventDefault()
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        
        touchStartTime = Date.now()
        touchStartPosition = { x: coords.x, y: coords.y }
        lastTouchPosition = { x: coords.x, y: coords.y }
        isTouching = true
        
        mouse.x = coords.x
        mouse.y = coords.y
    })

    window.addEventListener("touchmove", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        event.preventDefault()
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        
        mouse.x = coords.x
        mouse.y = coords.y
        lastTouchPosition = { x: coords.x, y: coords.y }
    })

    window.addEventListener("touchend", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        event.preventDefault()
        isTouching = false
        
        const touchDuration = Date.now() - touchStartTime
        const touchDistance = Math.hypot(
            lastTouchPosition.x - touchStartPosition.x,
            lastTouchPosition.y - touchStartPosition.y
        )
        
        if (touchDuration < 300 && touchDistance < 0.1) {
            handleProjectClick()
        }
    })

    // Click Event (desktop)
    window.addEventListener("click", () => {
        handleProjectClick()
    })

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

    function resetCameraPosition() {
        cameraTargetPosition = originalCameraPosition.clone()
        controlsTargetPosition = originalControlsTarget.clone()
        
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
                resetCameraPosition()
            })
        })
        
        closeButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            import('../ui/projectPanel.js').then(module => {
                module.closeProject()
                resetCameraPosition()
            })
        })
    }

    // Initialize gyro on mobile
    if (isMobile) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            requestGyroPermission()
        }, 500)
    }

    function update(gridTexture) {
        // Raycasting for hover/selection
        if (isTouching || !gyroEnabled) {
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
                if (object !== selectedObject) {
                    object.rotation.x += (gyroRotation.x * 0.8 - object.rotation.x) * 0.12
                    object.rotation.y += (gyroRotation.y * 0.8 - object.rotation.y) * 0.12
                } else {
                    object.rotation.x += (gyroRotation.x * 0.4 - object.rotation.x) * 0.12
                    object.rotation.y += (gyroRotation.y * 0.4 - object.rotation.y) * 0.12
                }
            } else if (!gyroEnabled || !isMobile) {
                // Use mouse/touch for rotation
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