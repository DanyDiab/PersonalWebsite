
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
const fps = 60;
let dt = 1.1;
let canvas, ctx;


// MOUSE
// x,y
let mousePos = [];
let mouseDelta;
let prevMousePos = [];
// left,right(booleans)
let mouseClicks = [];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    feedRate = .046;
    killRate = .065;

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


    update(cells);
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

    drawLineBetweenPoints(prevMousePos,mousePos, nextCells);
    // drawPointOnGrid(brushSize,mousePos[0],mousePos[1]);
    
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