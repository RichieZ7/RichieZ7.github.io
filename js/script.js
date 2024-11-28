document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 1000; // Number of balls
    const balls = [];
    const radius = 50; // Reduced radius around the cursor
    const driftSpeed = 2; // Speed of drifting after a push

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

        // Store ball properties and add random velocity for drifting
        balls.push({
            element: ball,
            x,
            y,
            size,
            velocityX: Math.random() * 2 - 1, // Random X velocity
            velocityY: Math.random() * 2 - 1, // Random Y velocity
        });
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

                // Push the ball
                ball.velocityX += Math.cos(angle) * pushDistance * 0.1;
                ball.velocityY += Math.sin(angle) * pushDistance * 0.1;
            }
        });
    });

    // Update ball positions and handle drifting
    function updateBalls() {
        balls.forEach((ball) => {
            // Apply velocity to position
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Bounce off edges
            if (ball.x < 0 || ball.x + ball.size > window.innerWidth) {
                ball.velocityX = -ball.velocityX; // Reverse X velocity
            }
            if (ball.y < 0 || ball.y + ball.size > window.innerHeight) {
                ball.velocityY = -ball.velocityY; // Reverse Y velocity
            }

            // Apply friction to slow down drifting
            ball.velocityX *= 0.98;
            ball.velocityY *= 0.98;

            // Update ball's position in the DOM
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
        });

        // Schedule the next update
        requestAnimationFrame(updateBalls);
    }

    // Start the animation loop
    updateBalls();

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
