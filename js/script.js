document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 10; // Adjust as needed
    const balls = [];
    const radius = 50;

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        const size = Math.random() * 50 + 75; // Ball size
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
            radius: size / 2,
            velocityX: Math.random() * 2 - 1,
            velocityY: Math.random() * 2 - 1,
        });
    }

    function resolveCollision(ball1, ball2) {
        const dx = ball1.x + ball1.radius - (ball2.x + ball2.radius);
        const dy = ball1.y + ball1.radius - (ball2.y + ball2.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Avoid overlap by separating balls
        const overlap = ball1.radius + ball2.radius - distance;
        const normalX = dx / distance;
        const normalY = dy / distance;

        ball1.x += (normalX * overlap) / 2;
        ball1.y += (normalY * overlap) / 2;
        ball2.x -= (normalX * overlap) / 2;
        ball2.y -= (normalY * overlap) / 2;

        // Calculate new velocities based on masses (proportional to size)
        const mass1 = ball1.radius ** 2;
        const mass2 = ball2.radius ** 2;

        const relativeVelocityX = ball2.velocityX - ball1.velocityX;
        const relativeVelocityY = ball2.velocityY - ball1.velocityY;
        const dotProduct = relativeVelocityX * normalX + relativeVelocityY * normalY;

        if (dotProduct > 0) return; // Balls are moving apart

        const collisionScale = (2 * dotProduct) / (mass1 + mass2);
        const impulseX = collisionScale * normalX;
        const impulseY = collisionScale * normalY;

        ball1.velocityX += impulseX * mass2;
        ball1.velocityY += impulseY * mass2;
        ball2.velocityX -= impulseX * mass1;
        ball2.velocityY -= impulseY * mass1;
    }

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

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                const otherBall = balls[j];
                const dx = ball.x + ball.radius - (otherBall.x + otherBall.radius);
                const dy = ball.y + ball.radius - (otherBall.y + otherBall.radius);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < ball.radius + otherBall.radius) {
                    resolveCollision(ball, otherBall);
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
