document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 2; // Adjust as needed
    const balls = [];
    const radius = 50; // Radius for mouse interaction

    // Cache window dimensions
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Variables to store mouse position
    let mouseX = null;
    let mouseY = null;

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const size = Math.random() * 125 + 50; // Size between 50 and 175
        const x = Math.random() * (windowWidth - size);
        const y = Math.random() * (windowHeight - size);

        const ball = document.createElement("div");
        ball.classList.add("ball");

        // Random lightness for shades of gray (if desired)
        const lightness = Math.random() * 100;
        ball.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background-color: hsl(0, 0%, ${lightness}%);
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            will-change: transform;
        `;

        // Initial positioning
        ball.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        body.appendChild(ball);

        balls.push({
            element: ball,
            x,
            y,
            size,
            halfSize: size / 2,
            velocityX: (Math.random() * 2 - 1) * 0.5, // Reduced speed for smoother animation
            velocityY: (Math.random() * 2 - 1) * 0.5,
            scaleX: 1,
            scaleY: 1,
        });
    }

    // Cursor movement
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Update balls
    function updateBalls() {
        balls.forEach((ball) => {
            // Mouse interaction
            if (mouseX !== null && mouseY !== null) {
                const dx = ball.x + ball.halfSize - mouseX;
                const dy = ball.y + ball.halfSize - mouseY;
                const distanceSquared = dx * dx + dy * dy;

                if (distanceSquared < radius * radius) {
                    const distance = Math.sqrt(distanceSquared) || 1;
                    const angle = Math.atan2(dy, dx);
                    const pushDistance = radius - distance;

                    const force = pushDistance * 0.1;
                    const forceX = Math.cos(angle) * force;
                    const forceY = Math.sin(angle) * force;

                    ball.velocityX += forceX;
                    ball.velocityY += forceY;

                    // Apply deformation based on force
                    const deformation = Math.min(force * 0.05, 0.3);
                    ball.scaleX = 1 + deformation;
                    ball.scaleY = 1 - deformation;
                }
            }

            // Update positions
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Bounce off edges
            if (ball.x < 0) {
                ball.x = 0;
                ball.velocityX = Math.abs(ball.velocityX);

                // Deform on bounce
                ball.scaleX = 1.3;
                ball.scaleY = 0.7;
            }
            if (ball.x + ball.size > windowWidth) {
                ball.x = windowWidth - ball.size;
                ball.velocityX = -Math.abs(ball.velocityX);

                ball.scaleX = 1.3;
                ball.scaleY = 0.7;
            }
            if (ball.y < 0) {
                ball.y = 0;
                ball.velocityY = Math.abs(ball.velocityY);

                ball.scaleX = 0.7;
                ball.scaleY = 1.3;
            }
            if (ball.y + ball.size > windowHeight) {
                ball.y = windowHeight - ball.size;
                ball.velocityY = -Math.abs(ball.velocityY);

                ball.scaleX = 0.7;
                ball.scaleY = 1.3;
            }

            // Apply friction
            ball.velocityX *= 0.99;
            ball.velocityY *= 0.99;

            // Restore to original scale
            ball.scaleX += (1 - ball.scaleX) * 0.2;
            ball.scaleY += (1 - ball.scaleY) * 0.2;

            // Update position and transformation
            ball.element.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) scale(${ball.scaleX}, ${ball.scaleY})`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();

    // Adjust balls on window resize
    window.addEventListener("resize", () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        // Ensure balls stay within window bounds
        balls.forEach((ball) => {
            if (ball.x + ball.size > windowWidth) {
                ball.x = windowWidth - ball.size;
                ball.velocityX = -Math.abs(ball.velocityX);
            }
            if (ball.y + ball.size > windowHeight) {
                ball.y = windowHeight - ball.size;
                ball.velocityY = -Math.abs(ball.velocityY);
            }
            ball.element.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) scale(${ball.scaleX}, ${ball.scaleY})`;
        });
    });
});
