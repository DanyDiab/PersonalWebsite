const boidDesc = `2D Flocking Simulation optimized using uniform grids and quadtrees.\n 
In this project, I set out to test the performance of the spatial partioning algorithms under different simulation densities.\n
To demonstrate my findings, I created visualizers and graphs for the presentation. \n Created a 12 page report based on findings`

const terrainDesc = `Procedural terrain genration tool creted in Unity and published on Steam.\n
I implemented Perlin noise, Fractal Brownian Motion (fBm), and Multi Fractal Ridge Noise from scratch.\n
Optimized the expensive logic for the C# Burst Compiler to improve generation times.
Implemeted texture blending in HLSL shaders.\n
Created a user friendly menu, including a custom file system to import and share terrains.`

const wikiDesc = `A Wikipedia Search Engine imeplemented using Hyperlink Induced Topic Search (HITS) and TF-IDF.\n Managed large databases (~150GB) with one table containing 2.5B rows.\n
Optimized query times using database indexing and caching. Reduced Topic Drift (a well known issue with HITS) using title boosting.`

const engineDesc = `A lightweight, high-performance 3D minigame engine built from scratch using C and OpenGL (FreeGLUT).\n
Implemented a hierarchical scene graph and a flexible component-based "Behavior" system for modular game logic.
Features include a custom .obj parser, Phong-based materials, and a custom 3D vector math library.\n
Demonstrated with a submarine-themed underwater environment featuring fish and dynamic terrain.`


const LsystemDesc = `
A high-performance procedural modeling engine built from scratch in C++ and OpenGL designed to interpret formal string-rewriting grammars for 3D and 2D organic structure generation.\n\nKey Features:\n
    - Advanced Grammar Parser: Built a custom parser capable of evaluating both stochastic (probabilistic)and parametric production rules to generate intricate, varied branching structures.\n
    - Modern OpenGL Pipeline: Implemented robust low-level graphics management using raw Vertex Array Objects (VAOs) and Vertex Buffer Objects (VBOs).\n
    - GPU Instanced Cylinder Rendering: Optimized the rendering architecture to draw thousands of independent mesh geometries efficiently within a single draw call, maximizing GPU throughput.\n
    - Organic Simulation Behaviors: Integrated complex spatial tracking including quaternion-based 
turtle rotations, environmental tropism, and surface-alignment ($ command) support.;`

const projectDatabase = {
    'engine': {
        title: "Custom 3D Minigame Engine",
        images: ["files/GameEngine/GameEngine1.png",
            "files/GameEngine/GameEngine2.png",
            "files/GameEngine/GameEngine3.png",
            "files/GameEngine/GameEngine4.png",
            "files/GameEngine/GameEngine5.png"
        ],
        desc: engineDesc,
        tags: ["C", "OpenGL", "Graphics Engineering", "Game Engine"],
        githubLink: ""
    },
    'boids': {
        title: "Boids Spatial Partitioning",
        images: ["files/Boids/Boid1.png",
            "files/Boids/Boid2.png",
            "files/Boids/Boid3.png",
            "files/Boids/GeneralPerformance.png",
            "files/Boids/BestCulling.png",
        ], 
        desc: boidDesc,
        tags: ["C#", "Unity", "Algorithm Engineering"],
        githubLink: "https://github.com/danydiab/Boids"
    },
    'terrain': {
        title: "Dany's Terrain Sandbox",
        images: [
            "files/MountainExmaples/6.png",
            "files/MountainExmaples/8.png",
            "files/MountainExmaples/7.png",
            "files/MountainExmaples/9.png",
            "files/MountainExmaples/10.png",
            "files/MountainExmaples/5.png",
            "files/MountainExmaples/11.png",
            "files/MountainExmaples/12.png",
            "files/MountainExmaples/13.png"
        ],
        desc: terrainDesc,
        tags: ["HLSL", "Unity", "Procedural Generation", "C#", "Burst Compilier"],
        githubLink: "https://github.com/DanyDiab/MountainSim" 
    },
    'search': {
        title: "Wikipedia Search Engine",
        images: ["files/WikiSearch/LargestCities1.png",
                "files/WikiSearch/LargestCities2.png",
                "files/WikiSearch/MachineLearning1.png",
                "files/WikiSearch/MachineLearning2.png",
                "files/WikiSearch/PrimeMinister.png",
                "files/WikiSearch/PrimeMinister2.png",


        ],
        desc: wikiDesc,
        tags: ["Python", "SQLite", "Big Data"],
        githubLink: "https://github.com/danydiab/Wikisearch",

    },
    'Lsystem' :{
        title: "L-System Parser and Renderer",
        desc: LsystemDesc,
        tags: ["C++", "GPU Instancing", "Quaternions", "OpenGL"],
        images: ["files/Lsystem/1.png",
                "files/Lsystem/2.png",
                "files/Lsystem/3.png",
                "files/Lsystem/4.png",
                "files/Lsystem/5.png",
                "files/Lsystem/6.png",
                "files/Lsystem/7.png",
                "files/Lsystem/8.png",
                "files/Lsystem/9.png",
        ],
        githubLink: "https://github.com/DanyDiab/LSystem" 
    }
};

let currentImages = [];
let currentImageIndex = 0;
let slideshowInterval = null;

function updateSlideshow() {
    const imgEl = document.getElementById('modalImage');
    const counterEl = document.getElementById('slideshowCounter');
    if (imgEl && currentImages.length > 0) {
        imgEl.src = currentImages[currentImageIndex];
        if (counterEl) {
            counterEl.innerText = `${currentImageIndex + 1} / ${currentImages.length}`;
        }
    }
}


window.nextImage = function() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateSlideshow();
};

window.prevImage = function() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateSlideshow();
};

window.openModal = function(projectId) {
    const data = projectDatabase[projectId];
    if (!data) return;

    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;
    
    const tagsContainer = document.getElementById('modalTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = ''; 
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-blue-300';
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });
    }

    const githubBtn = document.getElementById('modalGithubBtn');
    if (githubBtn) {
        if (data.githubLink && data.githubLink !== "") {
            githubBtn.href = data.githubLink;
            githubBtn.classList.remove('hidden');
        } else {
            githubBtn.classList.add('hidden');
        }
    }

    // Initialize slideshow
    currentImages = data.images || [];
    currentImageIndex = 0;
    updateSlideshow();
    
    const modal = document.getElementById('projectModal');
    const modalInner = document.getElementById('modalInner');
    
    if (modal && modalInner) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.classList.remove('pointer-events-none');
            modal.classList.add('pointer-events-auto');
            modalInner.classList.remove('scale-95');
        });
    }
};

window.closeModal = function() {
    const modal = document.getElementById('projectModal');
    const modalInner = document.getElementById('modalInner');
    
    if (!modal) return; 

    modal.classList.add('opacity-0');
    modal.classList.add('pointer-events-none');
    if (modalInner) modalInner.classList.add('scale-95');
        
    setTimeout(() => {
        modal.classList.add('hidden');
        currentImages = [];
        currentImageIndex = 0;
    }, 300);
};

document.addEventListener('DOMContentLoaded', () => {
    
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') {
                window.closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeModal();
        } else if (e.key === 'ArrowRight') {
            window.nextImage();
        } else if (e.key === 'ArrowLeft') {
            window.prevImage();
        }
    });
});