document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const balls = [];
    const radius = 50; // Cursor interaction radius
    const gravity = 0.2; // Gravity constant
    const damping = 0.8; // Damping factor for deformation
    const friction = 0.99; // Friction multiplier (1 = no friction, <1 adds friction)
    const restThreshold = 0.1; // Velocity threshold to stop bouncing

    // Ball properties
    const ballColors = ['red', 'green', 'blue']; // RGB colors
    const numBalls = ballColors.length; // 3 balls

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        const size = Math.random() * 100 + 50; // Random size between 50px and 150px
        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);
        const color = ballColors[i];

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
            radius: size / 2,
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
            const dx = ball.x + ball.radius - mouseX;
            const dy = ball.y + ball.radius - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                const angle = Math.atan2(dy, dx);
                const pushDistance = radius - distance;

                const force = pushDistance * 0.2; // Increased force
                ball.velocityX += Math.cos(angle) * force;
                ball.velocityY += Math.sin(angle) * force;

                // Apply less significant deformation based on force
                const deformation = Math.min(force * 0.05, 0.2); // Reduced deformation
                ball.scaleX = 1 + deformation;
                ball.scaleY = 1 - deformation;
            }
        });
    });

    function resolveCollision(ball1, ball2) {
        const dx = ball1.x + ball1.radius - (ball2.x + ball2.radius);
        const dy = ball1.y + ball1.radius - (ball2.y + ball2.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball1.radius + ball2.radius) {
            // Avoid overlap by adjusting positions
            const overlap = ball1.radius + ball2.radius - distance;
            const normalX = dx / distance;
            const normalY = dy / distance;

            ball1.x += (normalX * overlap) / 2;
            ball1.y += (normalY * overlap) / 2;
            ball2.x -= (normalX * overlap) / 2;
            ball2.y -= (normalY * overlap) / 2;

            // Swap velocities
            [ball1.velocityX, ball2.velocityX] = [ball2.velocityX, ball1.velocityX];
            [ball1.velocityY, ball2.velocityY] = [ball2.velocityY, ball1.velocityY];
        }
    }

    function updateBalls() {
        balls.forEach((ball, i) => {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Apply gravity
            ball.velocityY += gravity;

            // Apply friction
            ball.velocityX *= friction;
            ball.velocityY *= friction;

            // Bounce off edges
            if (ball.x < 0) {
                ball.x = 0;
                ball.velocityX = -ball.velocityX * damping;
            }
            if (ball.x + ball.size > window.innerWidth) {
                ball.x = window.innerWidth - ball.size;
                ball.velocityX = -ball.velocityX * damping;
            }
            if (ball.y < 0) {
                ball.y = 0;
                ball.velocityY = -ball.velocityY * damping;
            }
            if (ball.y + ball.size > window.innerHeight) {
                ball.y = window.innerHeight - ball.size;

                // Stop vertical motion if velocity is below the rest threshold
                if (Math.abs(ball.velocityY) < restThreshold) {
                    ball.velocityY = 0;
                    ball.scaleX = 1; // Reset scale
                    ball.scaleY = 1; // Reset scale
                } else {
                    ball.velocityY = -ball.velocityY * damping;
                }
            }

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(ball, balls[j]);
            }

            // Restore to original scale if not already reset
            if (Math.abs(ball.velocityY) >= restThreshold) {
                ball.scaleX += (1 - ball.scaleX) * 0.1;
                ball.scaleY += (1 - ball.scaleY) * 0.1;
            }

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
