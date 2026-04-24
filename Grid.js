let brushSize = 1;
const brushIncrementSize = 5;
let imageData, pixels;
const numPoints = 20;

let brushColor = { r: 0, g: 255, b: 255 }; // Default Cyan
let gridColors;

function updateBrushColor(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        brushColor.r = parseInt(result[1], 16);
        brushColor.g = parseInt(result[2], 16);
        brushColor.b = parseInt(result[3], 16);
    }
}

function initGrid(ctx, cols, rows){
    imageData = ctx.createImageData(cols, rows);
    pixels = imageData.data;
    gridColors = new Float32Array(cols * rows * 3);
}

function drawGrid(pixels, imageData) {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const idx = x + y * cols;
            const pixelIndex = idx * 4;
            const colorIndex = idx * 3;
            const intensity = cells.B[idx]; // 0.0 to 1.0
            
            pixels[pixelIndex] = Math.floor(gridColors[colorIndex] * intensity);
            pixels[pixelIndex + 1] = Math.floor(gridColors[colorIndex + 1] * intensity);
            pixels[pixelIndex + 2] = Math.floor(gridColors[colorIndex + 2] * intensity);
            pixels[pixelIndex + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}


function drawPointOnGrid(x, y, nextCells) {
    let halfBrushSize = brushSize / 2.0;

    let startingX = clamp(Math.floor(x - halfBrushSize), 0, cols - 1);
    let startingY = clamp(Math.floor(y - halfBrushSize), 0, rows - 1);

    let endX = clamp(Math.floor(x + halfBrushSize), 0, cols - 1);
    let endY = clamp(Math.floor(y + halfBrushSize), 0, rows - 1);
    
    for (let i = startingX; i <= endX; i++) {
        for (let j = startingY; j <= endY; j++) {
            let idx = i + j * cols;
            nextCells.B[idx] = 1.0;
            
            let colorIndex = idx * 3;
            gridColors[colorIndex] = brushColor.r;
            gridColors[colorIndex + 1] = brushColor.g;
            gridColors[colorIndex + 2] = brushColor.b;
        }
    }
}

function drawLineBetweenPoints(point1, point2, nextCells){
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

        drawPointOnGrid(currX, currY, nextCells);

    }

}


function decreaseBrushSize(){
    if(brushSize == 1) return;
    brushSize -= brushIncrementSize;
    clamp(brushSize,1,100);
}

function increaseBrushSize(){
    brushSize += brushIncrementSize;
    clamp(brushSize,1,100);
}