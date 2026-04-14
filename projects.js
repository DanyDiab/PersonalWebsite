// 1. The Project Database
const projectDatabase = {
    'boids': {
        title: "Boids Spatial Partitioning",
        videoSrc: "videos/boids-demo.mp4", 
        desc: "A flocking simulation heavily optimized using uniform grids and quadtrees. By porting spatial partitioning methods, I was able to handle massive entity counts efficiently without hitting O(N^2) bottlenecks. I also conducted and published an algorithm engineering study determining that the optimal uniform grid cell size is exactly half the interaction radius.",
        tags: ["C#", "Unity", "Algorithm Engineering"],
        githubLink: "https://github.com/danydiab/boids-simulation" // <-- Add your real link here
    },
    'terrain': {
        title: "Dany's Terrain Sandbox",
        videoSrc: "videos/terrain-demo.mp4", 
        desc: "A procedural terrain generation tool that I packaged and published on Steam. It utilizes custom HLSL shaders, Fractal Brownian Motion (fBm), and Ridge noise for real-time 3D mountain range simulation, giving users an interactive canvas to sculpt landscapes.",
        tags: ["HLSL", "Unity", "Procedural Generation", "Steamworks"],
        githubLink: "" // <-- Leave blank to hide the button
    },
    'search': {
        title: "Wikipedia Search Engine",
        videoSrc: "videos/search-demo.mp4", 
        desc: "A custom search engine analyzing a massive Wikipedia database. I implemented Hubs and Authorities (HITS) scoring to map link authority, alongside Term Frequency-Inverse Document Frequency (TF-IDF) algorithms to parse and rank raw text relevance.",
        tags: ["Python", "SQLite", "Data Structures"],
        githubLink: "https://github.com/danydiab/wiki-search-engine" // <-- Add your real link here
    }
};

// 2. Open Modal Logic (Attached to window so HTML can always trigger it)
window.openModal = function(projectId) {
    const data = projectDatabase[projectId];
    if (!data) return;

    // Safely inject text
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;
    
    // Safely inject tags
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

    // Safely handle GitHub Button
    const githubBtn = document.getElementById('modalGithubBtn');
    if (githubBtn) {
        if (data.githubLink && data.githubLink !== "") {
            githubBtn.href = data.githubLink;
            githubBtn.classList.remove('hidden');
        } else {
            githubBtn.classList.add('hidden');
        }
    }

    // Safely load video
    const videoElement = document.getElementById('modalVideo');
    if (videoElement) {
        videoElement.src = data.videoSrc;
    }
    
    // Animate Modal In
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

// 3. Close Modal Logic (Bulletproofed)
window.closeModal = function() {
    const modal = document.getElementById('projectModal');
    const modalInner = document.getElementById('modalInner');
    const videoElement = document.getElementById('modalVideo');
    
    // If modal doesn't exist, kill the function to prevent a crash
    if (!modal) return; 

    // Trigger Fade Out
    modal.classList.add('opacity-0');
    if (modalInner) modalInner.classList.add('scale-95');
    
    // Wait for CSS transition
    setTimeout(() => {
        modal.classList.add('hidden');
        
        // Safely kill the video so it doesn't play audio in the background
        if (videoElement) {
            videoElement.pause();
            videoElement.removeAttribute('src'); 
            videoElement.load(); 
        }
    }, 300);
};

// 4. Global Event Listeners (Wrapped in DOMContentLoaded to ensure HTML exists first)
document.addEventListener('DOMContentLoaded', () => {
    
    // Close on background click
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'projectModal') {
                window.closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeModal();
        }
    });
});