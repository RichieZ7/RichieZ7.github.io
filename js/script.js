document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const balls = [];
    const radius = 30; // Cursor interaction radius
    const gravity = 0.2; // Gravity constant
    const damping = 0.8; // Damping factor for deformation
    const friction = 0.99; // Friction multiplier (1 = no friction, <1 adds friction)

    // Ball properties
    const ballColors = ['red', 'green', 'blue']; // RGB colors
    const numBalls = ballColors.length; // 3 balls

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        const size = Math.random() * 100 + 50; // Random size between 50px and 150px
        const x = Math.random() * (window.innerWidth - size) + size / 2; // Adjust to center
        const y = Math.random() * (window.innerHeight - size) + size / 2; // Adjust to center
        const color = ballColors[i];

        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = color;
        ball.style.position = "absolute";
        ball.style.borderRadius = "50%";
        ball.style.left = `${x - size / 2}px`;
        ball.style.top = `${y - size / 2}px`;

        body.appendChild(ball);

        balls.push({
            element: ball,
            x, // Center x-coordinate
            y, // Center y-coordinate
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
            const dx = ball.x - mouseX;
            const dy = ball.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ball.radius + radius) {
                const angle = Math.atan2(dy, dx);
                const pushDistance = ball.radius + radius - distance;

                const force = pushDistance * 0.2;
                ball.velocityX += Math.cos(angle) * force;
                ball.velocityY += Math.sin(angle) * force;

                // Apply deformation
                const cos = Math.cos(angle); // Horizontal influence
                const sin = Math.sin(angle); // Vertical influence
                
                const deformation = Math.min(force * 0.05, 0.2);
                ball.scaleX = 1 + deformation;
                ball.scaleY = 1 - deformation;
            }
        });
    });

    function resolveCollision(ball1, ball2) {
        const dx = ball1.x - ball2.x;
        const dy = ball1.y - ball2.y;
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

    // Adjust balls on window resize
    window.addEventListener("resize", () => {
        balls.forEach((ball) => {
            ball.x = Math.random() * (window.innerWidth - ball.size) + ball.radius;
            ball.y = Math.random() * (window.innerHeight - ball.size) + ball.radius;
            ball.element.style.left = `${ball.x - ball.radius}px`;
            ball.element.style.top = `${ball.y - ball.radius}px`;
        });
    });

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
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.velocityX = -ball.velocityX * damping;
                ball.scaleX = 0.8;
                ball.scaleY = 1.2;
            }
            if (ball.x + ball.radius > window.innerWidth) {
                ball.x = window.innerWidth - ball.radius;
                ball.velocityX = -ball.velocityX * damping;
                ball.scaleX = 0.8;
                ball.scaleY = 1.2;
            }
            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.velocityY = -ball.velocityY * damping;
                ball.scaleX = 1.2;
                ball.scaleY = 0.8;
            }
            if (ball.y + ball.radius > window.innerHeight) {
                ball.y = window.innerHeight - ball.radius;
                ball.velocityY = -ball.velocityY * damping;
                ball.scaleX = 1.2;
                ball.scaleY = 0.8;
            }

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(ball, balls[j]);
            }

            ball.scaleX += (1 - ball.scaleX) * 0.1;
            ball.scaleY += (1 - ball.scaleY) * 0.1;


            // Restore to original scale
            // if (Math.abs(1 - ball.scaleX) < 1.03) {
            //     ball.scaleX = 1;
            // }
            // else {
            //     ball.scaleX += (1 - ball.scaleX) * 0.1;
            // }
            // if (Math.abs(1 - ball.scaleY) < 1.03) {
            //     ball.scaleY = 1;
            // }
            // else {
            //     ball.scaleY += (1 - ball.scaleY) * 0.1;
            // }

            // Update position and transformation
            ball.element.style.left = `${ball.x - ball.radius}px`;
            ball.element.style.top = `${ball.y - ball.radius}px`;
            ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();
});
