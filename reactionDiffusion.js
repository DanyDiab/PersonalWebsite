const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
let imageData, pixels;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cellData = {
    A: 0,
    B: 0
};

let rows, cols;
const fps = 60;
let dt = 1.1;

const Da = 1.0;
const Db = 0.5;

let feedRate, killRate;
let nextCells, cells;

// x,y
let mousePos = [];
let mouseDelta;
let prevMousePos = [];
// left,right booleans
let mouseClicks = [];

let brushSize = 30;

init();

function init() {
    initMouseEvents();
    rows = 1000;
    cols = 1000;

    feedRate = .046;
    killRate = .065;

    canvas.width = cols;
    canvas.height = rows;

    imageData = ctx.createImageData(cols, rows);
    pixels = imageData.data;
    
    const size = rows * cols;
    
    cells = {
        A: new Float32Array(size).fill(1.0),
        B: new Float32Array(size).fill(0.0)
    };

    nextCells = {
        A: new Float32Array(size).fill(1.0),
        B: new Float32Array(size).fill(0.0)
    };


    update(cells);
}

function clearGrid() {
    cells.A.fill(1.0);
    cells.B.fill(0.0);
    nextCells.A.fill(1.0);
    nextCells.B.fill(0.0);
}

function decreaseBrushSize(){
    if(brushSize == 1) return;

    brushSize--;
}

function increaseBrushSize(){
    brushSize++;
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
        }
    }
}

function drawGrid() {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const idx = x + y * cols;
            const pixelIndex = idx * 4;
            const intensity = Math.floor(cells.B[idx] * 255);
            pixels[pixelIndex + 0] = 0;
            pixels[pixelIndex + 1] = intensity;
            pixels[pixelIndex + 2] = intensity;
            pixels[pixelIndex + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function initMouseEvents() {
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        mousePos[0] = clamp(Math.floor(x), 0, cols - 1);
        mousePos[1] = clamp(Math.floor(y), 0, rows - 1);

        let buttons = event.buttons;
        const leftClick = buttons === 1;
        const rightClick = buttons === 2;
    
        mouseClicks[0] = leftClick;
        mouseClicks[1] = rightClick;
    });
}

function updateMosLastPos(){
    prevMousePos[0] = mousePos[0];
    prevMousePos[1] = mousePos[1];
}

function addDropOnMouse() {
    if (!mouseClicks[0]) return;

    drawLineBetweenPoints(prevMousePos,mousePos);
    // drawPointOnGrid(brushSize,mousePos[0],mousePos[1]);
    
}


function drawPointOnGrid(size, x, y) {
    let halfBrushSize = size / 2.0;

    let startingX = clamp(Math.floor(x - halfBrushSize), 0, cols - 1);
    let startingY = clamp(Math.floor(y - halfBrushSize), 0, rows - 1);

    let endX = clamp(Math.floor(x + halfBrushSize), 0, cols - 1);
    let endY = clamp(Math.floor(y + halfBrushSize), 0, rows - 1);
    
    for (let i = startingX; i <= endX; i++) {
        for (let j = startingY; j <= endY; j++) {
            nextCells.B[i + j * cols] = 1.0;
        }
    }
}


function drawLineBetweenPoints(point1, point2){
    let numPoints = 50;
    let dx = Math.abs(Math.floor(point2[0] - point1[0]));
    let dy = Math.abs(Math.floor(point2[1] - point1[1]));

    let delta = dx + dy;

    let dirX = point2[0] - point1[0];
    let dirY = point2[1] - point1[1];
    let dir =  normalizeVector([dirX, dirY]);


    let moved = dir.map(x => x * delta);


    for(let i = 0; i < numPoints; i++){
        let percent = i / numPoints;
        let currX = (point1[0]  * (1 - percent) + point2[0] * percent);
        let currY = (point1[1]  * (1 - percent) + point2[1] * percent);

        drawPointOnGrid(brushSize,currX, currY);

    }

}

async function update() {
    let frameCount = 0;
    while (true) {
        frameCount++;
        updateCells();
        addDropOnMouse();
        updateMosLastPos();
        drawGrid();

        let temp = cells;
        cells = nextCells;
        nextCells = temp;
        await sleep(1 / fps * 1000);
    }
}