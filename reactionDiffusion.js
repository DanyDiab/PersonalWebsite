const canvasElement = document.getElementById("simulationCanvas");
const ctx = canvasElement.getContext("2d");
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

init();

function init(){
    rows = 100;
    cols = 100;

    feedRate = .055;
    killRate = .062;

    canvasElement.width = cols;
    canvasElement.height = rows;

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

    for (let i = 45; i < 55; i++) {
        for (let j = 45; j < 55; j++) {
            cells[i][j].B = 1.0;
        }
    }

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

async function update(cells) {
    frameCount = 0;
    while(true){
        frameCount++;
        updateCells(cells);
        drawGrid(cells);

        let temp = cells;
        cells = nextCells;
        nextCells = temp;
        await sleep(1/fps * 1000);

    }
}
