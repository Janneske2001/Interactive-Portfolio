export function showProject(project) {
    // Set projectOpen flag in interaction module
    if (window.setProjectOpen) {
        window.setProjectOpen(true)
    }

    // Disable controls if available
    if (window.controls) {
        window.controls.enablePan = false
        window.controls.enableZoom = false
    }

    console.log("Opening project:", project)

    // Update DOM elements
    document.getElementById("project-title").textContent = project.title
    document.getElementById("project-image").src = project.image
    document.getElementById("project-description").textContent = project.description
    document.getElementById("project-link").href = project.link

    // Role
    const roleElement = document.getElementById("project-role")
    if (roleElement) {
        roleElement.textContent = project.role ? "Role: " + project.role : ""
    }

    // Tech tags
    const techContainer = document.getElementById("project-tech")
    if (techContainer) {
        techContainer.innerHTML = ""
        if (project.tech && project.tech.length > 0) {
            project.tech.forEach(t => {
                const tag = document.createElement("span")
                tag.textContent = t
                tag.classList.add("tech-tag")
                techContainer.appendChild(tag)
            })
        }
    }

    // Show panel
    const panel = document.getElementById("project-panel")
    panel.classList.remove("hidden")
    setTimeout(() => {
        panel.classList.add("active")
    }, 10)

    // Reset animations
    const items = document.querySelectorAll("#project-panel .panel-item")
    items.forEach(item => {
        item.style.transition = ""
    })
}

export function closeProject() {
    const panel = document.getElementById("project-panel")
    panel.classList.remove("active")
    
    setTimeout(() => {
        panel.classList.add("hidden")
        
        // Re-enable controls
        if (window.controls) {
            window.controls.enablePan = true
            window.controls.enableZoom = true
        }
        
        // Reset projectOpen flag
        if (window.setProjectOpen) {
            window.setProjectOpen(false)
        }
        
        // Note: Camera reset is now handled in interaction.js
    }, 300)
}