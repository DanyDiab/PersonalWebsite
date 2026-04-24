const tooltip = document.getElementById("tooltip");
const styles = tooltip.style;
const amp = .03;
const freq = .05;
let elpased = 0;

function scaleTooltip(){
    elpased++;
    let scale =  1 + Math.sin(elpased * freq) * amp;
    styles.setProperty('--scale', scale);
    requestAnimationFrame(scaleTooltip);
}

scaleTooltip();