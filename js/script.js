document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 5; // Adjust as needed
    const balls = [];

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        const size = Math.random() * 75 + 100;
        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);

        // Random lightness for shades of gray (if desired)
        const lightness = Math.random() * 100;
        const color = `hsl(0, 0%, ${lightness}%)`;

        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = color;
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;

        body.appendChild(ball);

        balls.push({
            element: ball,
            x,
            y,
            size,
            velocityX: Math.random() * 2 - 1,
            velocityY: Math.random() * 2 - 1,
        });
    }

    // Update balls
    function updateBalls() {
        balls.forEach((ball, i) => {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Bounce off edges
            if (ball.x < 0) {
                ball.x = 0;
                ball.velocityX = -ball.velocityX;
            }
            if (ball.x + ball.size > window.innerWidth) {
                ball.x = window.innerWidth - ball.size;
                ball.velocityX = -ball.velocityX;
            }
            if (ball.y < 0) {
                ball.y = 0;
                ball.velocityY = -ball.velocityY;
            }
            if (ball.y + ball.size > window.innerHeight) {
                ball.y = window.innerHeight - ball.size;
                ball.velocityY = -ball.velocityY;
            }

            // Check for collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                const otherBall = balls[j];
                const dx = (ball.x + ball.size / 2) - (otherBall.x + otherBall.size / 2);
                const dy = (ball.y + ball.size / 2) - (otherBall.y + otherBall.size / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (ball.size / 2 + otherBall.size / 2)) {
                    // Resolve collision
                    const nx = dx / distance;
                    const ny = dy / distance;
                    const p = 2 * (ball.velocityX * nx + ball.velocityY * ny -
                        otherBall.velocityX * nx - otherBall.velocityY * ny) /
                        (ball.size + otherBall.size);
                    ball.velocityX -= p * otherBall.size * nx;
                    ball.velocityY -= p * otherBall.size * ny;
                    otherBall.velocityX += p * ball.size * nx;
                    otherBall.velocityY += p * ball.size * ny;
                }
            }

            // Apply friction
            ball.velocityX *= 0.98;
            ball.velocityY *= 0.98;

            // Update position
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();
});
