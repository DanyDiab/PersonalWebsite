
// simuation
const cellData = {
    A: 0,
    B: 0
};
let rows, cols;
const Da = 1.0;
const Db = 0.5;
let feedRate, killRate;
let nextCells, cells;


// general
const fps = 120;
let dt = 1.1;
let canvas, ctx;


// MOUSE
// x,y
let mousePos = [];
let mouseDelta;
let prevMousePos = [];
// left,right(booleans)
let mouseClicks = [];


init();


function grabFromHTML(){
    canvas = document.getElementById("simulationCanvas");
    ctx = canvas.getContext("2d");
}

function init() {
    grabFromHTML();
    initMouseEvents();

    rows = 500;
    cols = 500;
    initGrid(ctx, cols, rows);

    feedRate = .0353;
    killRate = .06;

    canvas.width = cols;
    canvas.height = rows;
    
    const size = rows * cols;
    
    cells = {
        A: new Float32Array(size).fill(1.0),
        B: new Float32Array(size).fill(0.0)
    };

    nextCells = {
        A: new Float32Array(size).fill(1.0),
        B: new Float32Array(size).fill(0.0)
    };

    update();
    drawPointOnGrid(cols / 2, rows / 2, cells);

}

function clearGrid() {
    cells.A.fill(1.0);
    cells.B.fill(0.0);
    nextCells.A.fill(1.0);
    nextCells.B.fill(0.0);
}

function getLaplacian(x, y, grid, type) {
    let sum = 0;

    const xMinus1Wrapped = x - 1 >= 0 ? x - 1 : cols - 1;
    const yMinus1Wrapped = y - 1 >= 0 ? y - 1 : rows - 1;

    const xPlus1Wrapped = x + 1 < cols ? x + 1 : 0;
    const yPlus1Wrapped = y + 1 < rows ? y + 1 : 0;

    const arr = grid[type];

    sum += arr[x + y * cols] * -1.0;

    sum += arr[xMinus1Wrapped + y * cols] * 0.2;
    sum += arr[xPlus1Wrapped + y * cols] * 0.2;
    sum += arr[x + yMinus1Wrapped * cols] * 0.2;
    sum += arr[x + yPlus1Wrapped * cols] * 0.2;

    sum += arr[xMinus1Wrapped + yMinus1Wrapped * cols] * 0.05;
    sum += arr[xPlus1Wrapped + yMinus1Wrapped * cols] * 0.05;
    sum += arr[xPlus1Wrapped + yPlus1Wrapped * cols] * 0.05;
    sum += arr[xMinus1Wrapped + yPlus1Wrapped * cols] * 0.05;

    return sum;
}

function updateColors(newB, B, x, y, idx){
    let colorIndex = idx * 3;

    if (newB < 0.01) {
        gridColors[colorIndex] = 0;
        gridColors[colorIndex + 1] = 0;
        gridColors[colorIndex + 2] = 0;
        return;
    }

    const xMinus1 = x - 1 >= 0 ? x - 1 : cols - 1;
    const yMinus1 = y - 1 >= 0 ? y - 1 : rows - 1;
    const xPlus1 = x + 1 < cols ? x + 1 : 0;
    const yPlus1 = y + 1 < rows ? y + 1 : 0;
    
    const neighbors = [
        xMinus1 + y * cols,
        xPlus1 + y * cols,
        x + yMinus1 * cols,
        x + yPlus1 * cols,
        xMinus1 + yMinus1 * cols,
        xPlus1 + yMinus1 * cols,
        xMinus1 + yPlus1 * cols,
        xPlus1 + yPlus1 * cols
    ];
    
    let rSum = 0, gSum = 0, bSum = 0, weightSum = 0;
    
    for (let i = 0; i < 8; i++) {
        let n = neighbors[i];
        let nB = cells.B[n];
        if (nB <= 0.01) continue;
        let ncIdx = n * 3;
        let nR = localColors[ncIdx];
        let nG = localColors[ncIdx + 1];
        let nBColor = localColors[ncIdx + 2];
        
        // Exclude black pixels from the weighted average
        if (nR <= 0 && nG <= 0 && nBColor <= 0) continue;
        rSum += nR * nB;
        gSum += nG * nB;
        bSum += nBColor * nB;
        weightSum += nB;
        
    }

    if (weightSum <= 0) return;
    let avgR = rSum / weightSum;
    let avgG = gSum / weightSum;
    let avgB = bSum / weightSum;

    let r1 = localColors[colorIndex];
    let g1 = localColors[colorIndex + 1];
    let b1 = localColors[colorIndex + 2];

    if (r1 === 0 && g1 === 0 && b1 === 0) {
        localColors[colorIndex] = avgR;
        localColors[colorIndex + 1] = avgG;
        localColors[colorIndex + 2] = avgB;
    } else {
        let blend = 0.05; 
        localColors[colorIndex] = r1 + (avgR - r1) * blend;
        localColors[colorIndex + 1] = g1 + (avgG - g1) * blend;
        localColors[colorIndex + 2] = b1 + (avgB - b1) * blend;
    }
    
}

async function updateCells() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const idx = x + y * cols;

            let A = cells.A[idx];
            let B = cells.B[idx];
            
            let ABB = A * B * B;
            let lapacianA = getLaplacian(x, y, cells, "A");
            let lapacianB = getLaplacian(x, y, cells, "B");

            let newA = A + (Da * lapacianA - ABB + feedRate * (1.0 - A)) * dt;
            let newB = B + (Db * lapacianB + ABB - (killRate + feedRate) * B) * dt;

            nextCells.A[idx] = Math.max(0, Math.min(1, newA));
            nextCells.B[idx] = Math.max(0, Math.min(1, newB)); 

            updateColors(newB, B, x, y, idx);

        }
    }
<<<<<<< Updated upstream
=======

    cells.A = localA;
    cells.B = localB;

    nextCells.A = nextA;
    nextCells.B = nextB; 
    gridColors = localColors;   
>>>>>>> Stashed changes
}



function initMouseEvents() {
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        mousePos[0] = clamp(Math.floor(x), 0, cols - 1);
        mousePos[1] = clamp(Math.floor(y), 0, rows - 1);

        let buttons = event.buttons;
        const leftClick = (buttons & 1) === 1;
        const rightClick = (buttons & 2) === 2;
    
        mouseClicks[0] = leftClick;
        mouseClicks[1] = rightClick;
    });

    window.addEventListener('mousedown', (event) => {
        let buttons = event.buttons;
        mouseClicks[0] = (buttons & 1) === 1;
        mouseClicks[1] = (buttons & 2) === 2;
    });

    window.addEventListener('mouseup', () => {
        mouseClicks[0] = false;
        mouseClicks[1] = false;
    });
}

function updateMosLastPos(){
    prevMousePos[0] = mousePos[0];
    prevMousePos[1] = mousePos[1];
}

function addDropOnMouse() {
    if (!mouseClicks[0]) return;

<<<<<<< Updated upstream
    // Don't draw if the modal is open
    const modal = document.getElementById('projectModal');
=======
>>>>>>> Stashed changes
    if (modal && !modal.classList.contains('hidden')) return;

    drawLineBetweenPoints(prevMousePos, mousePos, nextCells);
}

async function update() {
    let frameCount = 0;
    while (true) {
        frameCount++;
        updateCells();
        addDropOnMouse();
        updateMosLastPos();
        drawGrid(pixels, imageData);

        let temp = cells;
        cells = nextCells;
        nextCells = temp;
        await sleep(1 / fps * 1000);
    }
}

function updateFeedRate(value) {
    feedRate = parseFloat(value);
    const label = document.getElementById('feedRateVal');
    if (label) {
        label.innerText = feedRate.toFixed(4);
    }
}

function updateKillRate(value) {
    killRate = parseFloat(value);
    const label = document.getElementById('killRateVal');
    if (label) {
        label.innerText = killRate.toFixed(4);
    }
}

function setPreset(name) {
    let newFeed, newKill;
    if (name === 'mitosis') {
        newFeed = 0.0367;
        newKill = 0.0649;
    } else if (name === 'coral') {
        newFeed = 0.0545;
        newKill = 0.0620;
    }
    
    if (newFeed !== undefined && newKill !== undefined) {
        const feedSlider = document.getElementById('feedRateSlider');
        const killSlider = document.getElementById('killRateSlider');
        
        if (feedSlider) feedSlider.value = newFeed;
        if (killSlider) killSlider.value = newKill;
        
        updateFeedRate(newFeed);
        updateKillRate(newKill);
    }
}