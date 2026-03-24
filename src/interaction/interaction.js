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
    
    // Gyro data with proper ranges
    let gyroRotation = { x: 0, y: 0, z: 0 }
    let gyroSupported = false
    let gyroEnabled = false
    let permissionButton = null
    let initialOrientation = null
    
    // Check if device has gyro
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Handle gyro data with correct mapping
    function handleGyro(event) {
        if (!gyroEnabled || projectOpen) return
        
        // Get device orientation
        let beta = event.beta || 0    // Front-back tilt: -180 to 180
        let gamma = event.gamma || 0  // Left-right tilt: -90 to 90
        let alpha = event.alpha || 0  // Compass direction: 0-360
        
        // Store initial orientation to calibrate
        if (initialOrientation === null) {
            initialOrientation = { beta, gamma, alpha }
        }
        
        // Calculate relative tilt from initial position
        let relativeBeta = beta - (initialOrientation.beta || 0)
        let relativeGamma = gamma - (initialOrientation.gamma || 0)
        
        // Clamp and normalize for smoother rotation
        const maxTilt = 45 // Maximum tilt angle in degrees
        
        // Beta controls X rotation (front/back tilt)
        // When tilting forward, cubes should rotate up/down
        let targetRotX = Math.max(-maxTilt, Math.min(maxTilt, relativeBeta)) / maxTilt
        
        // Gamma controls Y rotation (left/right tilt)
        // When tilting left, cubes should rotate left/right
        let targetRotY = Math.max(-maxTilt, Math.min(maxTilt, relativeGamma)) / maxTilt
        
        // Invert or adjust as needed for natural feel
        targetRotX = -targetRotX // Invert to feel natural
        targetRotY = targetRotY
        
        // Apply smoothing
        gyroRotation.x += (targetRotX * 0.8 - gyroRotation.x) * 0.15
        gyroRotation.y += (targetRotY * 0.8 - gyroRotation.y) * 0.15
        
        // Optional: Add slight Z rotation for advanced devices
        // gyroRotation.z += (-relativeBeta * 0.2 - gyroRotation.z) * 0.1
    }
    
    // Create permission button
    function createPermissionButton() {
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
        
        document.body.appendChild(permissionButton)
        return permissionButton
    }
    
    // Calibrate gyro to current position
    function calibrateGyro() {
        initialOrientation = null
        console.log('Gyro calibrated')
        
        // Show calibration feedback
        const indicator = document.getElementById('gyro-indicator')
        if (indicator) {
            indicator.textContent = '🎮 Calibrating...'
            setTimeout(() => {
                if (gyroEnabled) {
                    indicator.textContent = '🎮 Motion Control Active'
                }
            }, 1000)
        }
    }
    
    // Request gyro permission
    async function requestGyroPermission() {
        if (!isMobile) return
        
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
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
                        
                        // Add calibrate button after enabling
                        addCalibrateButton()
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
            window.addEventListener('deviceorientation', handleGyro)
            gyroSupported = true
            gyroEnabled = true
            showGyroIndicator(true)
            addCalibrateButton()
            console.log('Gyro enabled on Android')
        } else {
            console.log('Gyro not supported')
            showGyroIndicator(false)
        }
    }
    
    // Add calibrate button
    function addCalibrateButton() {
        setTimeout(() => {
            const existingCalibrate = document.getElementById('gyro-calibrate')
            if (existingCalibrate) return
            
            const calibrateBtn = document.createElement('button')
            calibrateBtn.id = 'gyro-calibrate'
            calibrateBtn.textContent = '🎯 Calibrate'
            calibrateBtn.style.position = 'fixed'
            calibrateBtn.style.bottom = '20px'
            calibrateBtn.style.left = '120px'
            calibrateBtn.style.zIndex = '9999'
            calibrateBtn.style.padding = '8px 16px'
            calibrateBtn.style.background = 'rgba(0,0,0,0.7)'
            calibrateBtn.style.color = '#00ffff'
            calibrateBtn.style.border = '1px solid #00ffff'
            calibrateBtn.style.borderRadius = '20px'
            calibrateBtn.style.fontSize = '12px'
            calibrateBtn.style.cursor = 'pointer'
            calibrateBtn.style.fontFamily = 'monospace'
            calibrateBtn.style.pointerEvents = 'auto'
            
            calibrateBtn.onclick = (e) => {
                e.stopPropagation()
                calibrateGyro()
            }
            
            document.body.appendChild(calibrateBtn)
        }, 1000)
    }
    
    // Show gyro indicator
    function showGyroIndicator(enabled) {
        const indicator = document.getElementById('gyro-indicator')
        if (indicator) {
            if (enabled) {
                indicator.textContent = '🎮 Motion Control Active - Tilt device to rotate cubes'
                indicator.style.display = 'block'
                indicator.style.background = 'rgba(0,0,0,0.8)'
                setTimeout(() => {
                    indicator.style.opacity = '0.7'
                }, 3000)
            } else {
                indicator.textContent = '📱 Motion Control Not Available'
                indicator.style.display = 'block'
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
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        
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
        if (event.target.id === 'gyro-calibrate') return
        
        const touch = event.touches[0]
        const coords = getNormalizedCoordinates(touch.clientX, touch.clientY)
        
        mouse.x = coords.x
        mouse.y = coords.y
        lastTouchPosition = { x: coords.x, y: coords.y }
    })

    window.addEventListener("touchend", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        
        const touchDuration = Date.now() - touchStartTime
        const touchDistance = Math.hypot(
            lastTouchPosition.x - touchStartPosition.x,
            lastTouchPosition.y - touchStartPosition.y
        )
        
        if (touchDuration < 300 && touchDistance < 0.1 && !projectOpen) {
            setTimeout(() => {
                handleProjectClick()
            }, 10)
        }
        
        isTouching = false
    })

    // Click Event (desktop)
    window.addEventListener("click", (event) => {
        if (event.target.id === 'gyro-permission-button') return
        if (event.target.id === 'gyro-calibrate') return
        
        if (!projectOpen) {
            handleProjectClick()
        }
    })

    function handleProjectClick() {
        if (projectOpen) return

        if (hoveredObject) {
            console.log("Opening project:", hoveredObject.userData.project.title)
            
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
        closeButton.addEventListener("click", (e) => {
            e.stopPropagation()
            import('../ui/projectPanel.js').then(module => {
                module.closeProject()
                resetCameraPosition()
                projectOpen = false
            })
        })
        
        closeButton.addEventListener("touchstart", (e) => {
            e.preventDefault()
            e.stopPropagation()
            import('../ui/projectPanel.js').then(module => {
                module.closeProject()
                resetCameraPosition()
                projectOpen = false
            })
        })
    }

    // Initialize gyro on mobile
    if (isMobile) {
        setTimeout(() => {
            requestGyroPermission()
        }, 500)
    }

    function update(gridTexture) {
        // Update raycasting for hover detection
        if (!gyroEnabled || isTouching || !isMobile) {
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
            if (gyroEnabled && isMobile && !projectOpen && !isTouching) {
                // Use gyro for rotation on mobile - rotate cubes based on device tilt
                if (object !== selectedObject) {
                    // Map gyro values to rotation angles
                    // Rotate X (up/down) and Y (left/right)
                    object.rotation.x = gyroRotation.x * 0.8
                    object.rotation.y = gyroRotation.y * 0.8
                    // Keep Z rotation minimal for stability
                    object.rotation.z = gyroRotation.z * 0.3
                } else {
                    // Selected object rotates less
                    object.rotation.x = gyroRotation.x * 0.4
                    object.rotation.y = gyroRotation.y * 0.4
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
        if (gridTexture) {
            gridTexture.offset.y += 0.003
        }

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