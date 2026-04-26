if (UI.drawHint) {
    // Fade out after 5 seconds
    setTimeout(() => {
        UI.drawHint.style.opacity = "0";
        setTimeout(() => {
            UI.drawHint.remove();
        }, 1000);
    }, 5000);

    // Also remove immediately if user clicks anywhere
    window.addEventListener('mousedown', () => {
        if (UI.drawHint) {
            UI.drawHint.style.opacity = "0";
            setTimeout(() => {
                UI.drawHint.remove();
            }, 1000);
        }
    }, { once: true });
}