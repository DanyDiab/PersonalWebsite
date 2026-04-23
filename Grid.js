let brushSize = 1;
const brushIncrementSize = 5;
let imageData, pixels;
const numPoints = 10;

function initGrid(ctx, cols, rows){
    imageData = ctx.createImageData(cols, rows);
    pixels = imageData.data;
}

function drawGrid(pixels, imageData) {
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


function drawPointOnGrid(x, y, nextCells) {
    let halfBrushSize = brushSize / 2.0;

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