const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");
let imageData,pixels;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cellData = {
    A: 0,
    B: 0
};

let rows,cols;
const fps = 60;
let dt = 1;

const Da = 1.0;
const Db = 0.5;

let feedRate,killRate;
let nextCells;

// x,y
let mousePos = []
// left,right booleans
let mouseClicks = []

let brushSize = 3;


let clearPressed = false;

init();

function init(){
    initMouseEvents();
    rows = 100;
    cols = 100;

    feedRate = .055;
    killRate = .062;

    canvas.width = cols;
    canvas.height = rows;

    imageData = ctx.createImageData(cols, rows);
    pixels = imageData.data;
    let cells = Array.from({ length: rows }, () => {
    return Array.from({ length: cols }, () => {
        return { A: 1.0, B: 0.0 };
        });
    });

    nextCells = Array.from({ length: rows }, () => {
        return Array.from({ length: cols }, () => {
            return { A: 1.0, B: 0.0 };
        });
    });

    update(cells);
}


function getLaplacian(x,y,grid, type){
    let sum = 0;

    xMinus1Wrapped = x - 1 >= 0 ? x - 1 : cols - 1;
    yMinus1Wrapped = y - 1 >= 0 ? y - 1: rows - 1;

    xPlus1Wrapped = x + 1 < cols ? x + 1 : 0;
    yPlus1Wrapped = y + 1 < rows ? y + 1 : 0;

    sum += grid[x][y][type] * -1.0;

    sum += grid[xMinus1Wrapped][y][type] * 0.2;
    sum += grid[xPlus1Wrapped][y][type] * 0.2;
    sum += grid[x][yMinus1Wrapped][type] * 0.2;
    sum += grid[x][yPlus1Wrapped][type] * 0.2;

    sum += grid[xMinus1Wrapped][yMinus1Wrapped][type] * 0.05;
    sum += grid[xPlus1Wrapped][yMinus1Wrapped][type] * 0.05;
    sum += grid[xPlus1Wrapped][yPlus1Wrapped][type] * 0.05;
    sum += grid[xMinus1Wrapped][yPlus1Wrapped][type] * 0.05;

    return sum;
}

async function updateCells(cells){
    
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let currCell = cells[i][j];

            let A = currCell.A;
            let B = currCell.B;
            
            let ABB = A*B*B;
            let lapacianA = getLaplacian(i,j,cells, "A");
            let lapacianB = getLaplacian(i,j,cells, "B");


            let newA = A + (Da * lapacianA - ABB + feedRate * (1.0 - A)) * dt;
            let newB = B + (Db * lapacianB + ABB - (killRate + feedRate) * B) * dt;

            currCell.A = newA;
            currCell.B = newB;

            nextCells[i][j].A = Math.max(0, Math.min(1, newA));
            nextCells[i][j].B = Math.max(0, Math.min(1, newB)); 
        }
    }
}


function drawGrid(cells) {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = cells[x][y];
            const pixelIndex = (x + y * cols) * 4;
            const intensity = Math.floor(cell.B * 255);
            pixels[pixelIndex + 0] = 0;
            pixels[pixelIndex + 1] = intensity;
            pixels[pixelIndex + 2] = intensity;
            pixels[pixelIndex + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

function clamp(num, min, max){
    return Math.min(Math.max(num, min), max);
}


function initMouseEvents(){
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();


        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        
        mousePos[0] = clamp(x, 0, rows - 1);
        mousePos[1] = clamp(y, 0, cols - 1);

        let buttons = event.buttons;
        const leftClick = buttons === 1;
        const rightClick = buttons === 2;
    
        mouseClicks[0] = leftClick;
        mouseClicks[1] = rightClick;

    });
}

// adds chemical B centered mouse position
function addDropOnMouse(cells){
    // if !left clicked pressed
    if(!mouseClicks[0]) return;

    let halfBrushSize = brushSize / 2;

    // center the brush stroke about the mouse Pos
    let startingPos = [clamp(Math.floor(mousePos[0] - halfBrushSize), 0, cols - 1), clamp(Math.floor(mousePos[1] - halfBrushSize), 0, rows - 1)];
    let endPos = [clamp(Math.floor(mousePos[0] + halfBrushSize), 0, cols - 1), clamp(Math.floor(mousePos[1] + halfBrushSize), 0, rows - 1)];
    for(let i = startingPos[0]; i < endPos[0]; i++){
        for(let j = startingPos[1]; j < endPos[1]; j++){
            nextCells[i][j].B = 1.0;
        }
    }
}

function clearCanvas(){
    if(!clearPressed) return;

    nextCells = Array.from({ length: rows }, () => {
        return Array.from({ length: cols }, () => {
            return { A: 1.0, B: 0.0 };
        });
    });
    clearPressed = false;
}

function clearBtnPress(){
    clearPressed = true
}

function increaseBrushSize(){
    brushSize++;
}

function decreaseBrushSize(){
    if(brushSize == 1) return;
    brushSize--;
    
}

async function update(cells) {
    frameCount = 0;
    while(true){
        frameCount++;
        updateCells(cells);
        
        drawGrid(cells);
        clearCanvas();
        addDropOnMouse(cells);

        let temp = cells;
        cells = nextCells;
        nextCells = temp;
        await sleep(1/fps * 1000);

    }
}
