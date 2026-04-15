const boidDesc = `2D Flocking Simulation optimized using uniform grids and quadtrees.\n 
In this project, I set out to test the performance of the spatial partioning algorithms under different simulation densities.\n
To demonstrate my findings, I created visualizers and graphs for the presentation. `

const terrainDesc = `Procedural terrain genration tool creted in Unity and published on Steam.\n
I implemented Perlin noise, Fractal Brownian Motion (fBm), and Multi Fractal Ridge Noise from scratch.\n
Optimized the expensive logic for the C# Burst Compiler to improve generation times.
Implemeted texture blending in HLSL shaders.\n
Created a user friendly menu, including a custom file system to import and share terrains.`

const wikiDesc = `A Wikipedia Search Engine imeplemented using Hyperlink Induced Topic Search (HITS) and TF-IDF.\n Managed large databases (~150GB) with one table containing 2.5B rows.\n
Optimized query times using database indexing and caching. Reduced Topic Drift (a well known issue with HITS) using title boosting.`

const projectDatabase = {
    'boids': {
        title: "Boids Spatial Partitioning",
        videoSrc: "videos/boids-demo.mp4", 
        desc: boidDesc,
        tags: ["C#", "Unity", "Algorithm Engineering"],
        githubLink: "https://github.com/danydiab/Boids"
    },
    'terrain': {
        title: "Dany's Terrain Sandbox",
        videoSrc: "videos/terrain-demo.mp4", 
        desc: terrainDesc,
        tags: ["HLSL", "Unity", "Procedural Generation", "C#", "Burst Compilier"],
        githubLink: "https://github.com/DanyDiab/MountainSim" 
    },
    'search': {
        title: "Wikipedia Search Engine",
        videoSrc: "videos/search-demo.mp4", 
        desc: wikiDesc,
        tags: ["Python", "SQLite", "Big Data"],
        githubLink: "https://github.com/danydiab/Wikisearch"
    }
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

    const videoElement = document.getElementById('modalVideo');
    if (videoElement) {
        videoElement.src = data.videoSrc;
    }
    
    const modal = document.getElementById('projectModal');
    const modalInner = document.getElementById('modalInner');
    
    if (modal && modalInner) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modalInner.classList.remove('scale-95');
        });
    }
};

window.closeModal = function() {
    const modal = document.getElementById('projectModal');
    const modalInner = document.getElementById('modalInner');
    const videoElement = document.getElementById('modalVideo');
    
    if (!modal) return; 

    modal.classList.add('opacity-0');
    if (modalInner) modalInner.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        
        if (videoElement) {
            videoElement.pause();
            videoElement.removeAttribute('src'); 
            videoElement.load(); 
        }
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
        }
    });
});