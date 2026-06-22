const audio = document.getElementById("bg-audio");
const video = document.getElementById("hero-video");
const stops = [10.5, 19.25, 25.16, 33.22];
let currentStopIndex = 0;
let isAnimating = false;

// Interacción inicial para desbloquear audio/video
document.addEventListener('click', () => {
    video.muted = false;
    audio.muted = false;
    audio.play().catch(e => console.log("Audio esperando interacción"));
    video.play().catch(e => console.log("Video esperando interacción"));
}, { once: true });

// Scroll
window.addEventListener('wheel', (e) => {
    // Si ya estamos animando o el scroll es hacia arriba, ignoramos
    if (e.deltaY <= 0 || isAnimating) return;

    // Solo si estamos por debajo del límite de paradas
    if (currentStopIndex < stops.length) {
        isAnimating = true;

        // Intentar reproducir ambos solo si están pausados
        const playPromises = [];
        if (audio.paused) playPromises.push(audio.play());
        if (video.paused) playPromises.push(video.play());

        Promise.all(playPromises).then(() => {
            let monitor = setInterval(() => {
                if (video.currentTime >= stops[currentStopIndex]) {
                    video.pause();
                    audio.pause(); // También pausamos el audio si quieres que se sincronicen
                    currentStopIndex++;
                    isAnimating = false;
                    clearInterval(monitor);
                }
            }, 50);
        }).catch(err => {
            console.error("Error de reproducción:", err);
            isAnimating = false; // Resetear en caso de error
        });
    }
});