document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 10; // Adjust as needed
    const balls = [];
    const radius = 50; // Radius for mouse interaction

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

        const size = Math.random() * 125 + 50; // Size between 50 and 175
        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);

        // Random lightness for shades of gray (if desired)
        const lightness = Math.random() * 100;
        const color = `hsl(0, 0%, ${lightness}%)`;

        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.backgroundColor = color;
        ball.style.position = 'absolute';

        // Initial positioning
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

            // Restore to original scale
            ball.scaleX += (1 - ball.scaleX) * 0.1;
            ball.scaleY += (1 - ball.scaleY) * 0.1;

            // Update position and transformation
            ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px) scale(${ball.scaleX}, ${ball.scaleY})`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();

    // Update letter positions and adjust balls on window resize
    window.addEventListener("resize", () => {
        updateLetters();
        // Ensure balls stay within window bounds
        balls.forEach((ball) => {
            if (ball.x + ball.size > window.innerWidth) {
                ball.x = window.innerWidth - ball.size;
                ball.velocityX = -Math.abs(ball.velocityX);
            }
            if (ball.y + ball.size > window.innerHeight) {
                ball.y = window.innerHeight - ball.size;
                ball.velocityY = -Math.abs(ball.velocityY);
            }
            ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px) scale(${ball.scaleX}, ${ball.scaleY})`;
        });
    });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const body = document.body;
//     const numBalls = 3; // Adjust as needed
//     const balls = [];
//     const radius = 50;

//     // Generate balls
//     for (let i = 0; i < numBalls; i++) {
//         const ball = document.createElement("div");
//         ball.classList.add("ball");

//         const size = Math.random() * 50 + 100;
//         const x = Math.random() * (window.innerWidth - size);
//         const y = Math.random() * (window.innerHeight - size);

//         // Random lightness for shades of gray (if desired)
//         const lightness = Math.random() * 100;
//         const color = `hsl(0, 0%, ${lightness}%)`;

//         ball.style.width = `${size}px`;
//         ball.style.height = `${size}px`;
//         ball.style.backgroundColor = color;
//         ball.style.left = `${x}px`;
//         ball.style.top = `${y}px`;

//         body.appendChild(ball);

//         balls.push({
//             element: ball,
//             x,
//             y,
//             size,
//             velocityX: Math.random() * 2 - 1,
//             velocityY: Math.random() * 2 - 1,
//             scaleX: 1,
//             scaleY: 1,
//         });
//     }

//     // Cursor movement
//     document.addEventListener("mousemove", (e) => {
//         const mouseX = e.clientX;
//         const mouseY = e.clientY;

//         balls.forEach((ball) => {
//             const dx = ball.x + ball.size / 2 - mouseX;
//             const dy = ball.y + ball.size / 2 - mouseY;
//             const distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance < radius) {
//                 const angle = Math.atan2(dy, dx);
//                 const pushDistance = radius - distance;

//                 const force = pushDistance * 0.1;
//                 ball.velocityX += Math.cos(angle) * force;
//                 ball.velocityY += Math.sin(angle) * force;

//                 // Apply deformation based on force
//                 const deformation = Math.min(force * 0.05, 0.3);
//                 ball.scaleX = 1 + deformation;
//                 ball.scaleY = 1 - deformation;
//             }
//         });
//     });

//     function updateBalls() {
//         balls.forEach((ball) => {
//             ball.x += ball.velocityX;
//             ball.y += ball.velocityY;

//             // Bounce off edges
//             if (ball.x < 0) {
//                 ball.x = 0;
//                 ball.velocityX = -ball.velocityX;

//                 // Deform on bounce
//                 ball.scaleX = 1.3;
//                 ball.scaleY = 0.7;
//             }
//             if (ball.x + ball.size > window.innerWidth) {
//                 ball.x = window.innerWidth - ball.size;
//                 ball.velocityX = -ball.velocityX;

//                 ball.scaleX = 1.3;
//                 ball.scaleY = 0.7;
//             }
//             if (ball.y < 0) {
//                 ball.y = 0;
//                 ball.velocityY = -ball.velocityY;

//                 ball.scaleX = 0.7;
//                 ball.scaleY = 1.3;
//             }
//             if (ball.y + ball.size > window.innerHeight) {
//                 ball.y = window.innerHeight - ball.size;
//                 ball.velocityY = -ball.velocityY;

//                 ball.scaleX = 0.7;
//                 ball.scaleY = 1.3;
//             }

//             // Apply friction
//             ball.velocityX *= 0.98;
//             ball.velocityY *= 0.98;

//             // Restore to original scale
//             ball.scaleX += (1 - ball.scaleX) * 0.1;
//             ball.scaleY += (1 - ball.scaleY) * 0.1;

//             // Update position and transformation
//             ball.element.style.left = `${ball.x}px`;
//             ball.element.style.top = `${ball.y}px`;
//             ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
//         });

//         requestAnimationFrame(updateBalls);
//     }

//     updateBalls();

//     // Adjust balls on window resize
//     window.addEventListener("resize", () => {
//         balls.forEach((ball) => {
//             ball.x = Math.random() * (window.innerWidth - ball.size);
//             ball.y = Math.random() * (window.innerHeight - ball.size);
//             ball.element.style.left = `${ball.x}px`;
//             ball.element.style.top = `${ball.y}px`;
//         });
//     });
// });