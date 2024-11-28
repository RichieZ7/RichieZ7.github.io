// js/script.js

document.addEventListener("DOMContentLoaded", () => {
    const background = document.getElementById("background");

    // Create moving balls
    for (let i = 0; i < 30; i++) {
        const ball = document.createElement("div");
        ball.className = "ball";

        // Randomize ball starting positions
        ball.style.left = `${Math.random() * 100}vw`;
        ball.style.top = `${Math.random() * 100}vh`;

        // Randomize ball size
        const size = Math.random() * 15 + 10;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;

        background.appendChild(ball);
    }

    // Move balls based on cursor
    document.addEventListener("mousemove", (e) => {
        const balls = document.querySelectorAll(".ball");
        balls.forEach((ball, index) => {
            const x = e.clientX / (index + 1);
            const y = e.clientY / (index + 1);
            ball.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});
