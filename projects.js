const boidDesc = `2D Flocking Simulation optimized using uniform grids and quadtrees.
In this project, I set out to test the performance of the spatial partitioning algorithms under different simulation densities.
To demonstrate my findings, I created visualizers and graphs for the presentation.
Created a 12-page report based on findings`

const terrainDesc = `Procedural terrain generation tool created in Unity and published on Steam.
I implemented Perlin noise, Fractal Brownian Motion (fBm), and Multi Fractal Ridge Noise from scratch
Optimized the expensive logic for the C# Burst Compiler to improve generation times.
Implemented texture blending in HLSL shaders.\n
Created a user-friendly menu, including a custom file system to import and share terrains.`

const wikiDesc = `A Wikipedia Search Engine implemented using Hyperlink Induced Topic Search (HITS) and TF-IDF. Managed large databases (~150GB) with one table containing 2.5B rows.
Optimized query times using database indexing and caching. Reduced Topic Drift (a well-known issue with HITS) using title boosting.`

const engineDesc = `A lightweight, high-performance 3D minigame engine built from scratch using C and OpenGL (FreeGLUT).
Implemented a hierarchical scene graph and a flexible component-based "Behavior" system for modular game logic.
Features include a custom .obj parser, Phong-based materials, and a custom 3D vector math library.
Demonstrated with a submarine-themed underwater environment featuring fish and dynamic terrain.`

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
        tags: ["HLSL", "Unity", "Procedural Generation", "C#", "Burst Compiler"],
        githubLink: "https://github.com/DanyDiab/MountainSim",
        steamLink: "https://store.steampowered.com/app/4204400/Danys_Terrain_Sandbox/" 
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
        githubLink: "https://github.com/danydiab/Wikisearch"
    }
};

let currentImages = [];
let currentImageIndex = 0;
let slideshowInterval = null;

let elModalImage, elSlideshowCounter, elModalTitle, elModalDesc, elModalTags, elModalGithubBtn, elProjectModal, elModalInner;

function gramFromHTML() {
    elModalImage = document.getElementById('modalImage');
    elSlideshowCounter = document.getElementById('slideshowCounter');
    elModalTitle = document.getElementById('modalTitle');
    elModalDesc = document.getElementById('modalDesc');
    elModalTags = document.getElementById('modalTags');
    elModalGithubBtn = document.getElementById('modalGithubBtn');
    elProjectModal = document.getElementById('projectModal');
    elModalInner = document.getElementById('modalInner');
}

function updateSlideshow() {
    if (UI.modalImage && currentImages.length > 0) {
        UI.modalImage.src = currentImages[currentImageIndex];
        if (UI.slideshowCounter) {
            UI.slideshowCounter.innerText = `${currentImageIndex + 1} / ${currentImages.length}`;
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

    if (UI.modalTitle) UI.modalTitle.innerText = data.title;
    if (UI.modalDesc) UI.modalDesc.innerText = data.desc;
    
    if (UI.modalTags) {
        UI.modalTags.innerHTML = ''; 
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-blue-300';
            span.innerText = tag;
            UI.modalTags.appendChild(span);
        });
    }

    if (UI.modalGithubBtn) {
        if (data.githubLink && data.githubLink !== "") {
            UI.modalGithubBtn.href = data.githubLink;
            UI.modalGithubBtn.classList.remove('hidden');
        } else {
            UI.modalGithubBtn.classList.add('hidden');
        }
    }

    if (UI.modalSteamBtn) {
        if (data.steamLink && data.steamLink !== "") {
            UI.modalSteamBtn.href = data.steamLink;
            UI.modalSteamBtn.classList.remove('hidden');
        } else {
            UI.modalSteamBtn.classList.add('hidden');
        }
    }

    // Initialize slideshow
    currentImages = data.images || [];
    currentImageIndex = 0;
    updateSlideshow();
    
    if (UI.projectModal && UI.modalInner) {
        UI.projectModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            UI.projectModal.classList.remove('opacity-0');
            UI.projectModal.classList.remove('pointer-events-none');
            UI.projectModal.classList.add('pointer-events-auto');
            UI.modalInner.classList.remove('scale-95');
        });
    }
};

window.closeModal = function() {
    if (!UI.projectModal) return; 

    UI.projectModal.classList.add('opacity-0');
    UI.projectModal.classList.add('pointer-events-none');
    if (UI.modalInner) UI.modalInner.classList.add('scale-95');
        
    setTimeout(() => {
        UI.projectModal.classList.add('hidden');
        currentImages = [];
        currentImageIndex = 0;
    }, 300);
};

document.addEventListener('DOMContentLoaded', () => {    
    if (UI.projectModal) {
        UI.projectModal.addEventListener('click', (e) => {
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