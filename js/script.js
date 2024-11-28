document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 3; // Adjust as needed
    const balls = [];
    const radius = 50;

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        const size = Math.random() * 50 + 100;
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
            scaleX: 1,
            scaleY: 1,
        });
    }

    // Cursor movement
    document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        balls.forEach((ball) => {
            const dx = ball.x + ball.size / 2 - mouseX;
            const dy = ball.y + ball.size / 2 - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                const angle = Math.atan2(dy, dx);
                const pushDistance = radius - distance;

                const force = pushDistance * 0.1;
                ball.velocityX += Math.cos(angle) * force;
                ball.velocityY += Math.sin(angle) * force;

                // Apply deformation based on force
                const deformation = Math.min(force * 0.05, 0.3);
                ball.scaleX = 1 + deformation;
                ball.scaleY = 1 - deformation;
            }
        });
    });

    function updateBalls() {
        balls.forEach((ball, i) => {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Bounce off edges
            if (ball.x < 0) {
                ball.x = 0;
                ball.velocityX = -ball.velocityX;

                // Deform on bounce
                ball.scaleX = 1.3;
                ball.scaleY = 0.7;
            }
            if (ball.x + ball.size > window.innerWidth) {
                ball.x = window.innerWidth - ball.size;
                ball.velocityX = -ball.velocityX;

                ball.scaleX = 1.3;
                ball.scaleY = 0.7;
            }
            if (ball.y < 0) {
                ball.y = 0;
                ball.velocityY = -ball.velocityY;

                ball.scaleX = 0.7;
                ball.scaleY = 1.3;
            }
            if (ball.y + ball.size > window.innerHeight) {
                ball.y = window.innerHeight - ball.size;
                ball.velocityY = -ball.velocityY;

                ball.scaleX = 0.7;
                ball.scaleY = 1.3;
            }

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                const otherBall = balls[j];
                const dx = ball.x + ball.size / 2 - (otherBall.x + otherBall.size / 2);
                const dy = ball.y + ball.size / 2 - (otherBall.y + otherBall.size / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (ball.size + otherBall.size) / 2) {
                    // Simple elastic collision physics
                    const angle = Math.atan2(dy, dx);
                    const overlap = (ball.size + otherBall.size) / 2 - distance;

                    // Separate the balls to prevent overlap
                    ball.x -= Math.cos(angle) * overlap / 2;
                    ball.y -= Math.sin(angle) * overlap / 2;
                    otherBall.x += Math.cos(angle) * overlap / 2;
                    otherBall.y += Math.sin(angle) * overlap / 2;

                    // Swap velocities for a basic elastic collision effect
                    [ball.velocityX, otherBall.velocityX] = [otherBall.velocityX, ball.velocityX];
                    [ball.velocityY, otherBall.velocityY] = [otherBall.velocityY, ball.velocityY];
                }
            }

            // Apply friction
            ball.velocityX *= 0.98;
            ball.velocityY *= 0.98;

            // Restore to original scale
            ball.scaleX += (1 - ball.scaleX) * 0.1;
            ball.scaleY += (1 - ball.scaleY) * 0.1;

            // Update position and transformation
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
            ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();

    // Adjust balls on window resize
    window.addEventListener("resize", () => {
        balls.forEach((ball) => {
            ball.x = Math.random() * (window.innerWidth - ball.size);
            ball.y = Math.random() * (window.innerHeight - ball.size);
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
        });
    });
});
