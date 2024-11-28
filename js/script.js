// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 1000; // Number of balls
    const balls = [];
    const radius = 100; // Radius around cursor where balls can't be

    // Generate random balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        // Random size (10px to 30px)
        const size = Math.random() * 20 + 10;

        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        // Random color
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // Apply styles to the ball
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = color;
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;

        // Add ball to the body
        body.appendChild(ball);
        balls.push({ element: ball, x, y, size });
    }

    // Cursor movement
    document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        balls.forEach((ball) => {
            const dx = ball.x - mouseX;
            const dy = ball.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If the ball is within the radius, push it away
            if (distance < radius) {
                const angle = Math.atan2(dy, dx);
                const pushDistance = radius - distance;

                // Move the ball
                ball.x += Math.cos(angle) * pushDistance;
                ball.y += Math.sin(angle) * pushDistance;

                // Update the ball's position
                ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
            }
        });
    });

    // Adjust balls when the window is resized
    window.addEventListener("resize", () => {
        balls.forEach((ball) => {
            ball.x = Math.random() * window.innerWidth;
            ball.y = Math.random() * window.innerHeight;
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
        });
    });
});
