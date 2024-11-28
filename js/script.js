document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const numBalls = 5; // Adjust as needed
    const balls = [];
    const radius = 50; // Cursor interaction radius

    // Generate balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.classList.add("ball");

        const size = Math.random() * 50 + 100; // Ball size
        const x = Math.random() * (window.innerWidth - size);
        const y = Math.random() * (window.innerHeight - size);

        // Random lightness for shades of gray (e.g., 20% to 80% lightness)
        const lightness = Math.random() * 60 + 20; // Range: 20% to 80%
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

    function resolveCollision(ball1, ball2) {
        const dx = ball1.x + ball1.radius - (ball2.x + ball2.radius);
        const dy = ball1.y + ball1.radius - (ball2.y + ball2.radius);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball1.radius + ball2.radius) {
            // Simple velocity swap
            const angle = Math.atan2(dy, dx);
            const sine = Math.sin(angle);
            const cosine = Math.cos(angle);

            const v1x = ball1.velocityX * cosine + ball1.velocityY * sine;
            const v2x = ball2.velocityX * cosine + ball2.velocityY * sine;

            ball1.velocityX = v2x;
            ball2.velocityX = v1x;

            const v1y = ball1.velocityY * cosine - ball1.velocityX * sine;
            const v2y = ball2.velocityY * cosine - ball2.velocityX * sine;

            ball1.velocityY = v2y;
            ball2.velocityY = v1y;
        }
    }

    function updateBalls() {
        const textBox = document.querySelector("#background").getBoundingClientRect();

        balls.forEach((ball, i) => {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Bounce off edges
            if (ball.x < 0 || ball.x + ball.size > window.innerWidth) {
                ball.velocityX = -ball.velocityX;
            }
            if (ball.y < 0 || ball.y + ball.size > window.innerHeight) {
                ball.velocityY = -ball.velocityY;
            }

            // Bounce off text box
            if (
                ball.x + ball.size > textBox.left &&
                ball.x < textBox.right &&
                ball.y + ball.size > textBox.top &&
                ball.y < textBox.bottom
            ) {
                if (ball.x + ball.radius < textBox.left || ball.x + ball.radius > textBox.right) {
                    ball.velocityX = -ball.velocityX;
                }
                if (ball.y + ball.radius < textBox.top || ball.y + ball.radius > textBox.bottom) {
                    ball.velocityY = -ball.velocityY;
                }
            }

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(ball, balls[j]);
            }

            // Update position
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();
});

// document.addEventListener("DOMContentLoaded", () => {
//     const body = document.body;
//     const numBalls = 5; // Adjust as needed
//     const balls = [];
//     const radius = 50; // Cursor interaction radius

//     // Generate balls
//     for (let i = 0; i < numBalls; i++) {
//         const ball = document.createElement("div");
//         ball.classList.add("ball");

//         const size = Math.random() * 50 + 100; // Ball size
//         const x = Math.random() * (window.innerWidth - size);
//         const y = Math.random() * (window.innerHeight - size);

//         // Random lightness for shades of gray (e.g., 20% to 80% lightness)
//         const lightness = Math.random() * 60 + 20; // Range: 20% to 80%
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
//             radius: size / 2,
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
//             const dx = ball.x + ball.radius - mouseX;
//             const dy = ball.y + ball.radius - mouseY;
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

//     function resolveCollision(ball1, ball2) {
//         const dx = ball1.x + ball1.radius - (ball2.x + ball2.radius);
//         const dy = ball1.y + ball1.radius - (ball2.y + ball2.radius);
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         // Avoid overlap by separating balls
//         const overlap = ball1.radius + ball2.radius - distance;
//         const normalX = dx / distance;
//         const normalY = dy / distance;

//         ball1.x += (normalX * overlap) / 2;
//         ball1.y += (normalY * overlap) / 2;
//         ball2.x -= (normalX * overlap) / 2;
//         ball2.y -= (normalY * overlap) / 2;

//         // Calculate new velocities based on masses (proportional to size)
//         const mass1 = ball1.radius ** 2;
//         const mass2 = ball2.radius ** 2;

//         const relativeVelocityX = ball2.velocityX - ball1.velocityX;
//         const relativeVelocityY = ball2.velocityY - ball1.velocityY;
//         const dotProduct = relativeVelocityX * normalX + relativeVelocityY * normalY;

//         if (dotProduct > 0) return; // Balls are moving apart

//         const collisionScale = (2 * dotProduct) / (mass1 + mass2);
//         const impulseX = collisionScale * normalX;
//         const impulseY = collisionScale * normalY;

//         ball1.velocityX += impulseX * mass2;
//         ball1.velocityY += impulseY * mass2;
//         ball2.velocityX -= impulseX * mass1;
//         ball2.velocityY -= impulseY * mass1;
//     }

//     function updateBalls() {
//         // Get all letters on the page
//         const letters = Array.from(document.querySelectorAll("p, h1, h2, h3, span")).flatMap((el) =>
//             Array.from(el.textContent).map((_, i) => el.getBoundingClientRect())
//         );

//         balls.forEach((ball, i) => {
//             ball.x += ball.velocityX;
//             ball.y += ball.velocityY;

//             // Bounce off edges
//             if (ball.x < 0) {
//                 ball.x = 0;
//                 ball.velocityX = -ball.velocityX;
//             }
//             if (ball.x + ball.size > window.innerWidth) {
//                 ball.x = window.innerWidth - ball.size;
//                 ball.velocityX = -ball.velocityX;
//             }
//             if (ball.y < 0) {
//                 ball.y = 0;
//                 ball.velocityY = -ball.velocityY;
//             }
//             if (ball.y + ball.size > window.innerHeight) {
//                 ball.y = window.innerHeight - ball.size;
//                 ball.velocityY = -ball.velocityY;
//             }

//             // Check collisions with other balls
//             for (let j = i + 1; j < balls.length; j++) {
//                 const otherBall = balls[j];
//                 const dx = ball.x + ball.radius - (otherBall.x + otherBall.radius);
//                 const dy = ball.y + ball.radius - (otherBall.y + otherBall.radius);
//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < ball.radius + otherBall.radius) {
//                     resolveCollision(ball, otherBall);
//                 }
//             }

//             // Check collisions with letters
//             letters.forEach((letter) => {
//                 const letterX = letter.left;
//                 const letterY = letter.top;
//                 const letterWidth = letter.width;
//                 const letterHeight = letter.height;

//                 // Check if ball overlaps letter bounding box
//                 if (
//                     ball.x + ball.size > letterX &&
//                     ball.x < letterX + letterWidth &&
//                     ball.y + ball.size > letterY &&
//                     ball.y < letterY + letterHeight
//                 ) {
//                     // Bounce off letter
//                     if (ball.x + ball.radius < letterX || ball.x + ball.radius > letterX + letterWidth) {
//                         ball.velocityX = -ball.velocityX;
//                     }
//                     if (ball.y + ball.radius < letterY || ball.y + ball.radius > letterY + letterHeight) {
//                         ball.velocityY = -ball.velocityY;
//                     }
//                 }
//             });

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
