export const projects = [

{
    id: "doublename",
    title: "Double Name",
    type: "model", // "image" or "model"
    model: "/models/DoubleName.glb", // Path to GLB/GLTF file
    image: "/images/name.png", // Fallback/thumbnail image
    // description: "This is a 3D model",
    role: "3D Modeler",
    tech: ["3D Modeling", "TinkerCAD", "3D Printing"],
    link: "https://www.tinkercad.com/things/44tNfWXmQzh-evi-jannes-naam-bordje?sharecode=uPsf1I78ShFWzxmqujuJHefNkEptYAPEu33ANeztnZs",
    content: [
        { type: "image", src: "/images/name.png", alt: "3d preview JANNES" },
        { type: "text", html: "I made a 3D model with the names of me and my girlfriend combined." },
        { type: "image", src: "/images/name2.png", alt: "3d preview EVI" }
    ]
},

{
    id: "solderbox",
    title: "Soldering Box",
    type: "model",
    model: "/models/SolderBox.glb",
    image: "/images/solder.jpg",        // still used as thumbnail in the 3D scene
    role: "3D Modeler",
    tech: ["3D Modeling", "TinkerCAD", "3D Printing"],
    link: "https://www.tinkercad.com/things/2VvhhMVt1Vv-solder-box?sharecode=CBXIbzsG3w-90CachbzF3cCOixmX0mXfEwd2_kmxlvU",
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
    image: "/images/desk.png", // Fallback/thumbnail image
    description: "This is a 3D model I made for my girlfriend to store her pens and pencils.",
    role: "3D Modeler",
    tech: ["3D Modeling", "TinkerCAD", "3D Printing"],
    link: "https://www.tinkercad.com/things/5qSUARU5vmK-desk-organiser?sharecode=DwNaBWstVbrrLHomCvhqTGNZM-6HQ6aoOnC-kGfYnL4"
},

{
    id: "coffee",
    title: "Coffee Reservoir",
    type: "model", // "image" or "model"
    model: "/models/Coffee.glb", // Path to GLB/GLTF file
    image: "/images/beans_cad.png", // Fallback/thumbnail image
    // description: "This is a 3D model",
    role: "3D Modeler",
    tech: ["Blender", "Three.js"],
    link: "https://www.tinkercad.com/things/47ExlBX1Idi-bean-reservoir-20?sharecode=Eo3JIrrZV2sJg3SLUoDwaxrNqI33Q90j_3sM74iYUFI",
    content: [
        { type: "image", src: "/images/beans.jpg", alt: "Coffee bean extender" },
        { type: "text", html: "Here you can see the coffee bean extender in action. It can hold up to 500 grams more than the default amount of coffee beans. It has a little slot on the inside where you can insert a 'plastic window' which could be from a cut up plastic bottle. Below is a screenshot from TinkerCad, the online tool I used to create this." },
        { type: "image", src: "/images/beans_cad.png", alt: "Coffee bean extender CAD" }
    ]
},

{
    id: "huntrix",
    title: "Huntrix Keychain",
    type: "model", // "image" or "model"
    model: "/models/Huntrix.glb", // Path to GLB/GLTF file
    image: "/images/huntrix.png", // Fallback/thumbnail image
    description: "I made this 3D model to be printed as keychain. I uploaded it to a 3D print file website.",
    role: "3D Modeler",
    tech: ["3D Modeling", "TinkerCAD", "3D Printing"],
    link: "https://www.printables.com/model/1411393-huntrix-logo-flat-multicolor"
},

{
    id: "gazelle",
    title: "Gazelle E-Bike Dummy Display",
    type: "model", // "image" or "model"
    model: "/models/Gazelle.glb", // Path to GLB/GLTF file
    image: "/images/bike2.jpg", // Fallback/thumbnail image
    role: "3D Modeler",
    tech: ["3D Modeling", "TinkerCAD", "3D Printing"],
    link: "https://www.tinkercad.com/things/lCrlyb3nhC5-gazelle-dummy-display?sharecode=fXDnA0ebnGKvIApJMQZtx_ZHZWE9BqiYpoutfcvO8MQ",
    content: [
            { type: "image", src: "/images/gazelle_oos.jpg", alt: "Out Of Stock part" },
            { type: "text", html: "The original Gazelle screen dummy wasn't available anymore. I wanted to solve this by recreating the plastic cover to still protect the exposed contact points. I first took a few photos of the screen module itself, and then started copying as much as I could from here." },
            { type: "image", src: "/images/bike1.jpg", alt: "Original screen" },
            { type: "text", html: "After recreating the mounting points, I wanted to do a test fit. It took a few tries until I got the perfect secure fit." },
            { type: "image", src: "/images/gazelle_cad.jpg", alt: "CAD" },
            { type: "text", html: "Finally, I got a 3D printed dummy display to keep the contact points of the Ebike protected when the original display is taken off." },
            { type: "image", src: "/images/bike2.jpg", alt: "Final Product" }
        ]
},

{
    id: "pagercover",
    title: "Pager Cover Redesign",
    type: "model",
    model: "/models/PagerCover.glb",
    image: "/images/IMG_2689.JPEG",      // thumbnail in 3D scene
    role: "Designer, CAD Modeler, Prototype Tester",
    tech: ["3D Modeling", "TinkerCAD", "3D Printing"],
    link: "https://www.tinkercad.com/things/kyhhnQIq2YI-pager-klep?sharecode=x_O3fDMRcnFEKs_kr1PUmYG2iLbXUVqKnYKYf4hUV1c",
    content: [
        { type: "text", html: "The paging devices used at my workplace frequently became unusable because their battery covers would break after being dropped. To solve this problem, I recreated the component in 3D and began testing printed versions. Early prototypes revealed small dimensional errors that prevented a proper fit." },
        { type: "image", src: "/images/IMG_2671.JPEG", alt: "Pager measurements" },
        { type: "image", src: "/images/IMG_2679.JPEG", alt: "Cover digital 3D model" },
        { type: "text", html: "After several iterations and adjustments, the final design fit correctly and restored functionality to the devices." },
        { type: "image", src: "/images/IMG_2689.JPEG", alt: "Final cover" }
    ]
},

{
    id: "kauwebende",
    title: "Kauwe Bende Group Project",
    type: "model",
    model: "/models/KauweBendeKaart.glb",
    image: "/images/IMG_2409.JPEG",      // thumbnail in 3D scene
    role: "Concept Designer, UI/UX Designer, Front-End Developer",
    tech: ["JavaScript", "HTML", "CSS", "Three.js", "PWA", "Vercel"],
    link: "https://kauwebende.vercel.app/",
    content: [
        { type: "text", html: "KauweBende started as a group project focused on making social interaction easier during events. My initial idea was a physical card game where players could match cards using colours and symbols while answering conversation prompts." },
        { type: "image", src: "/images/IMG_1233.JPEG", alt: "Paper concept" },
        { type: "image", src: "/images/IMG_2708.JPEG", alt: "Paper prototype" },
        { type: "text", html: "As the project evolved, I proposed moving the questions into a digital format. This reduced complexity while making the game easier to manage and expand." },
        { type: "image", src: "/images/IMG_2307.JPEG", alt: "Digital concept" },
        { type: "text", html: "The final product was designed around a shared iPad experience. Players select a category and receive a random question. Accessibility features such as text-to-speech were added based on stakeholder feedback." },
        { type: "image", src: "/images/ScreenShot1.png", alt: "Digital concept" },
        { type: "image", src: "/images/ScreenShot0.png", alt: "Final Digital Product" },
        { type: "text", html: "Questions are stored separately from the application itself, allowing new content to be added without modifying the system. The application can also function offline thanks to PWA support." },
        { type: "image", src: "/images/IMG_2409.JPEG", alt: "Final Product" }
    ]
},

{
    id: "rgbkeyboard",
    title: "RGB Keyboard Speed Control",
    type: "image",
    image: "/images/IMG_2833.JPEG",      // thumbnail in 3D scene
    role: "Open-Source Contributor, Developer",
    tech: ["Git", "GitHub", "C++", "Markdown"],
    link: "https://github.com/DeviceIoControl/CppKeyboardColour/pull/23",
    content: [
        { type: "text", html: "I use a laptop with RGB keyboard lighting, but originally it can only show 1 of 12 static colors. I found a C++ tool to add more life to this, but one of the available effects cycled through colors much faster than I preferred." },
        { type: "image", src: "/images/CPP2.png", alt: "Original idea" },
        { type: "text", html: "After discussing the idea with the maintainer, I decided to implement the feature myself. I forked the repository, explored the codebase, and added support for configurable transition speeds." },
        { type: "image", src: "/images/CPP3.png", alt: "Development screenshot" },
        { type: "image", src: "/images/CPP3.5.png", alt: "Pull request" },
        { type: "text", html: "After receiving review feedback, I improved the implementation by adding limits and better error handling. The contribution was eventually merged into the official project and included in a public release." },
        { type: "image", src: "/images/CPP6.png", alt: "Release with my changes" }
    ]
},

{
    id: "instavid",
    title: "Career Day Promotional Video",
    type: "image",
    image: "/images/vid5.png",      // thumbnail in 3D scene
    role: "Videographer, Editor",
    tech: ["Davinci Resolve"],
    link: "https://www.instagram.com/p/DXdyfH3xVDb/",
    content: [
        { type: "text", html: "I was asked to create a short promotional video during a career event. The goal was to produce a fast-paced social-media-style video centred around collecting as many high-fives as possible. After filming throughout the event, I edited the footage into a short vertical video designed for platforms such as Instagram. Stakeholder feedback led to faster cuts and improved pacing." },
        { type: "image", src: "/images/vid6.png", alt: "Video Timeline" },
        { type: "image", src: "/images/vid4.png", alt: "Final video" }
    ]
},

{
    id: "oldportfolio",
    title: "Old Portfolio",
    type: "image",
    image: "/images/oldport.png",
    // description: "Old",
    role: "Programming, Visual Designer",
    tech: ["HTML", "CSS", "JavaScript"],
    link: "https://i510853.hera.fontysict.net/PortfolioShowcase",
    content: [
        { type: "image", src: "/images/oldport2.png", alt: "Video Timeline" },
        { type: "text", html: "This is my previous portfolio. It's a more static website, where responsiveness is key. On this portfolio I also have some projects that I haven't included in this new portfolio yet." }
    ]
},

{
    id: "newportfolio",
    title: "New Portfolio",
    type: "model",
    image: "/images/newportfolio.png",
    // description: "A gravity-based platformer puzzle game set inside a digital system.",
    role: "Designer, Developer, 3D Artist",
    tech: ["Three.js", "JavaScript", "HTML", "CSS", "Blender", "Vercel"],
    link: "https://www.jannesvdb.nl/",
    content: [
        { type: "text", html: "Welcome! this is the portfolio you are currently visiting. I wanted my portfolio to be more than a collection of pages. Inspired by PlayStation 2 menus and vaporwave aesthetics, I started experimenting with interactive 3D environments that visitors could explore." },
        { type: "image", src: "/images/style.png", alt: "Style inspiration" },
        { type: "image", src: "/images/IMG_1339.JPEG", alt: "Paper prototype" },
        { type: "text", html: "The project became an opportunity to learn Three.js from scratch. I combined Blender models with JavaScript-driven interactions to create an environment that reacts to user input and showcases my work in a unique way." },
        { type: "image", src: "/images/port.gif", alt: "Progress" },
        { type: "text", html: "Although still a work in progress, the project taught me a lot about 3D web development, scene management, and creating interactive user experiences." },
        { type: "image", src: "/images/11.png", alt: "Final portfolio" }
    ]
}

]