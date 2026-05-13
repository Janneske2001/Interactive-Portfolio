export const projects = [

{
    id: "doublename",
    title: "Double Name",
    type: "model", // "image" or "model"
    model: "/models/DoubleName.glb", // Path to GLB/GLTF file
    image: "/images/thumbnail.jpg", // Fallback/thumbnail image
    description: "This is a 3D model",
    role: "3D Modeler",
    tech: ["3D Design", "TinkerCad"],
    link: "https://example.com/3dfile"
},

{
    id: "3Dfile",
    title: "3D Model Example",
    type: "model",
    model: "/models/SolderBox.glb",
    image: "/images/solder.jpg",        // still used as thumbnail in the 3D scene
    role: "3D Modeler",
    tech: ["Blender", "Three.js"],
    link: "https://example.com/3dfile",
    content: [
        { type: "text", html: "I needed a case to put my new soldering iron and attributes in. I measured the sizes of all the items I wanted to put inside the box, and made fitting cutouts for them." },
        { type: "image", src: "/images/solder.jpg", alt: "Inside view" },
        { type: "text", html: "Here you can see more info." },
        { type: "image", src: "/images/soldercad.jpg", alt: "CAD drawing" }
    ]
},

{
    id: "deskorgan",
    title: "Desk Organizer",
    type: "model", // "image" or "model"
    model: "/models/DeskOrgan.glb", // Path to GLB/GLTF file
    image: "/images/thumbnail.jpg", // Fallback/thumbnail image
    description: "This is a 3D model",
    role: "3D Modeler",
    tech: ["Blender", "Three.js"],
    link: "https://example.com/3dfile"
},

{
    id: "coffee",
    title: "Coffee Reservoir",
    type: "model", // "image" or "model"
    model: "/models/Coffee.glb", // Path to GLB/GLTF file
    image: "/images/coffee.jpg", // Fallback/thumbnail image
    // description: "This is a 3D model",
    role: "3D Modeler",
    tech: ["Blender", "Three.js"],
    link: "https://example.com/3dfile",
    content: [
        { type: "image", src: "/images/coffee.jpg", alt: "Coffee bean extender" },
        { type: "text", html: "Here you can see the coffee bean extender in action. It can hold up to 500 grams more than the default amount of coffee beans." },
    ]
},

{
    id: "huntrix",
    title: "Huntrix Keychain",
    type: "model", // "image" or "model"
    model: "/models/Huntrix.glb", // Path to GLB/GLTF file
    image: "/images/thumbnail.jpg", // Fallback/thumbnail image
    description: "This is a 3D model",
    role: "3D Modeler",
    tech: ["Blender", "Three.js"],
    link: "https://example.com/3dfile"
},

{
    id: "gazelle",
    title: "Gazelle E-Bike Dummy Display",
    type: "model", // "image" or "model"
    model: "/models/Gazelle.glb", // Path to GLB/GLTF file
    image: "/images/bike2.jpg", // Fallback/thumbnail image
    role: "3D Modeler",
    tech: ["Blender", "Three.js"],
    link: "https://example.com/3dfile",
    content: [
            { type: "image", src: "/images/bike1.jpg", alt: "Dashboard view" },
            { type: "text", html: "This is the first description paragraph..." },
            { type: "image", src: "/images/bike2.jpg", alt: "Mobile view" },
            { type: "text", html: "Another explanation here..." },
            { type: "image", src: "/images/thumbnail.jpg", alt: "Settings panel" },
            { type: "text", html: "Final thoughts and results." }
        ]
},

{
    id: "portfolio",
    title: "Old Portfolio",
    type: "image",
    image: "/images/2.png",      // thumbnail in 3D scene
    role: "Game Design, Programming, Visual Direction",
    tech: ["Unity", "C#", "Level Design"],
    link: "https://example.com/portfolio",
    content: [
        { type: "image", src: "/images/2.png", alt: "Main menu" },
        { type: "text", html: "A gravity-based platformer puzzle game set inside a digital system." },
        { type: "image", src: "/images/3.png", alt: "Gameplay" },
        { type: "text", html: "The player must shift gravity to solve puzzles and avoid enemies." }
    ]
},

{
    id: "portfolio",
    title: "Old Portfolio",
    type: "image",
    image: "/images/3.png",
    description: "A gravity-based platformer puzzle game set inside a digital system.",
    role: "Game Design, Programming, Visual Direction",
    tech: ["Unity", "C#", "Level Design"],
    link: "https://example.com/portfolio"
},

{
    id: "gearbox",
    title: "3D Gearbox",
    type: "image",
    image: "/images/4.png",
    description: "A gravity-based platformer puzzle game set inside a digital system.",
    role: "Game Design, Programming, Visual Direction",
    tech: ["Unity", "C#", "Level Design"],
    link: "https://example.com/gearbox"
},

{
    id: "portfolio",
    title: "Old Portfolio",
    type: "image",
    image: "/images/5.png",
    description: "A gravity-based platformer puzzle game set inside a digital system.",
    role: "Game Design, Programming, Visual Direction",
    tech: ["Unity", "C#", "Level Design"],
    link: "https://example.com/portfolio"
},

{
    id: "portfolio",
    title: "Old Portfolio",
    type: "image",
    image: "/images/6.png",
    description: "A gravity-based platformer puzzle game set inside a digital system.",
    role: "Game Design, Programming, Visual Direction",
    tech: ["Unity", "C#", "Level Design"],
    link: "https://example.com/portfolio"
},

{
    id: "portfolio",
    title: "Old Portfolio",
    type: "model",
    image: "/images/portfolio.png",
    description: "A gravity-based platformer puzzle game set inside a digital system.",
    role: "Game Design, Programming, Visual Direction",
    tech: ["Unity", "C#", "Level Design"],
    link: "https://example.com/portfolio"
}

]