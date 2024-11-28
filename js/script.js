document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 2; // Adjust as needed
    const balls = [];
    const textContainer = document.getElementById("background");
    const textElements = textContainer.querySelectorAll("h1, p");

    // Collect letters and their positions
    let letters = [];
    function updateLetters() {
        letters = [];
        textElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            letters.push({
                rect: {
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom,
                    width: rect.width,
                    height: rect.height,
                    x: rect.x,
                    y: rect.y,
                },
            });
        });
    }
    updateLetters();

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

        // Use transform for positioning
        ball.style.transform = `translate(${x}px, ${y}px)`;

        body.appendChild(ball);

        balls.push({
            element: ball,
            x,
            y,
            size,
            halfSize: size / 2,
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
                const dx = (ball.x + ball.halfSize) - (otherBall.x + otherBall.halfSize);
                const dy = (ball.y + ball.halfSize) - (otherBall.y + otherBall.halfSize);
                const distanceSquared = dx * dx + dy * dy;
                const minDistance = ball.halfSize + otherBall.halfSize;

                if (distanceSquared < minDistance * minDistance) {
                    // Resolve collision
                    const distance = Math.sqrt(distanceSquared) || 1;
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

            // Check for collisions with letters
            letters.forEach((letter) => {
                const rect = letter.rect;
                if (
                    ball.x + ball.size > rect.left &&
                    ball.x < rect.right &&
                    ball.y + ball.size > rect.top &&
                    ball.y < rect.bottom
                ) {
                    // Determine collision side
                    const overlapX = (ball.x + ball.halfSize) - (rect.left + rect.width / 2);
                    const overlapY = (ball.y + ball.halfSize) - (rect.top + rect.height / 2);
                    if (Math.abs(overlapX) > Math.abs(overlapY)) {
                        ball.velocityX = -ball.velocityX;
                        ball.x += ball.velocityX; // Move ball out of collision
                    } else {
                        ball.velocityY = -ball.velocityY;
                        ball.y += ball.velocityY; // Move ball out of collision
                    }
                }
            });

            // Apply friction
            ball.velocityX *= 0.98;
            ball.velocityY *= 0.98;

            // Update position using CSS transform
            ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();

    // Update letter positions on resize
    window.addEventListener("resize", () => {
        updateLetters();
    });
});
