
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function normalizeVector(vec){
    let x = vec[0];
    let y = vec[1];

    let dx = x * x;
    let dy = y * y;

    let sqLen = dx + dy;

    let invMag = 1 / Math.sqrt(sqLen);

    let normlizedX = x * invMag;
    let normlizedY = y * invMag;

    return [normlizedX,normlizedY];
}


function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}



