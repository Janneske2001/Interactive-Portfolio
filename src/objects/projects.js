import * as THREE from 'three'

// Objects With Data
export function createProjects(scene, projects) {

    const objects = []
    const geometry = new THREE.BoxGeometry()

    const xSpacing = 3
    const zSpacing = 3

    projects.forEach((project, index) => {

        // ------------------------------------------------------------------------------------------------------- LOG
        console.log("Creating project:", project.title)

        const texture = new THREE.TextureLoader().load(project.image)

        const ObjectMaterial = new THREE.MeshStandardMaterial({
            map: texture
        })

        ObjectMaterial.anisotropy = 16

        const object = new THREE.Mesh(geometry, ObjectMaterial)

        const rowLength = 4
        const x = index % rowLength
        const z = Math.floor(index / rowLength)

        object.position.x = (x - rowLength / 2) * xSpacing + (xSpacing / 2)
        object.position.z = (z - rowLength / 2) * zSpacing + zSpacing

        object.userData.project = project

        // ------------------------------------------------------------------------------------------------------- LOG
        console.log("Attached project:", object.userData.project.title)

        object.userData.targetScale = 1

        scene.add(object)
        objects.push(object)

    })

    // ------------------------------------------------------------------------------------------------------- LOG
    console.table(projects)
    console.log(objects)

    return objects
}