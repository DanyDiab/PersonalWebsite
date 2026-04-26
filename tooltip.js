const drawHint = document.getElementById("drawHint");

if (drawHint) {
    // Fade out after 5 seconds
    setTimeout(() => {
        drawHint.style.opacity = "0";
        setTimeout(() => {
            drawHint.remove();
        }, 1000);
    }, 5000);

    // Also remove immediately if user clicks anywhere
    window.addEventListener('mousedown', () => {
        if (drawHint) {
            drawHint.style.opacity = "0";
            setTimeout(() => {
                drawHint.remove();
            }, 1000);
        }
    }, { once: true });
}
