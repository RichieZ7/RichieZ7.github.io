// document.addEventListener("DOMContentLoaded", () => {
//     const body = document.body;
//     const balls = [];
//     const radius = 15; // Cursor interaction radius
//     const gravity = 0.2; // Gravity constant
//     const damping = 0.8; // Damping factor for deformation
//     const friction = 0.99; // Friction multiplier (1 = no friction, <1 adds friction)
//     let mouseX = null;
//     let mouseY = null;

//     // Ball properties
//     const ballColors = ['red', 'green', 'blue']; // RGB colors
//     const numBalls = ballColors.length; // 3 balls

//     // Generate balls
//     for (let i = 0; i < numBalls; i++) {
//         const ball = document.createElement("div");
//         ball.classList.add("ball");
//         const size = Math.random() * 100 + 50; // Random size between 50px and 150px
//         const x = Math.random() * (window.innerWidth - size) + size / 2; // Adjust to center
//         const y = Math.random() * (window.innerHeight - size) + size / 2; // Adjust to center
//         const color = ballColors[i];

//         ball.style.width = `${size}px`;
//         ball.style.height = `${size}px`;
//         ball.style.backgroundColor = color;
//         ball.style.position = "absolute";
//         ball.style.borderRadius = "50%";
//         ball.style.left = `${x - size / 2}px`;
//         ball.style.top = `${y - size / 2}px`;

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
//         mouseX = e.clientX;
//         mouseY = e.clientY;
//     });

//     // Ball Collisions
//     function resolveCollision(ball1, ball2) {
//         const dx = ball1.x - ball2.x;
//         const dy = ball1.y - ball2.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < ball1.radius + ball2.radius) {
//             // Avoid overlap by adjusting positions
//             const overlap = ball1.radius + ball2.radius - distance;
//             const normalX = dx / distance;
//             const normalY = dy / distance;

//             ball1.x += (normalX * overlap) / 2;
//             ball1.y += (normalY * overlap) / 2;
//             ball2.x -= (normalX * overlap) / 2;
//             ball2.y -= (normalY * overlap) / 2;

//             // Swap velocities
//             [ball1.velocityX, ball2.velocityX] = [ball2.velocityX, ball1.velocityX];
//             [ball1.velocityY, ball2.velocityY] = [ball2.velocityY, ball1.velocityY];

//             // Apply deformation based on collision angle
//             const angle = Math.atan2(dy, dx);
//             const deformation = 0.2; // Deformation factor
//             const absCos = Math.abs(Math.cos(angle)); // Horizontal influence
//             const absSin = Math.abs(Math.sin(angle)); // Vertical influence

//             ball1.scaleX = 1 + deformation * absCos;
//             ball1.scaleY = 1 + deformation * absSin;
//             ball2.scaleX = 1 + deformation * absCos;
//             ball2.scaleY = 1 + deformation * absSin;
//         }
//     }

//     // Adjust balls on window resize
//     window.addEventListener("resize", () => {
//         balls.forEach((ball) => {
//             ball.x = Math.random() * (window.innerWidth - ball.size) + ball.radius;
//             ball.y = Math.random() * (window.innerHeight - ball.size) + ball.radius;
//             ball.element.style.left = `${ball.x - ball.radius}px`;
//             ball.element.style.top = `${ball.y - ball.radius}px`;
//         });
//     });

//     function updateBalls() {
//         balls.forEach((ball, i) => {
//             ball.x += ball.velocityX;
//             ball.y += ball.velocityY;

//             // Apply gravity
//             ball.velocityY += gravity;

//             // Apply friction
//             ball.velocityX *= friction;
//             ball.velocityY *= friction;

//             // Bounce off edges
//             if (ball.x - ball.radius < 0) {
//                 ball.x = ball.radius;
//                 ball.velocityX = -ball.velocityX * damping;
//                 ball.scaleX = 0.8;
//                 ball.scaleY = 1.2;
//             }
//             if (ball.x + ball.radius > window.innerWidth) {
//                 ball.x = window.innerWidth - ball.radius;
//                 ball.velocityX = -ball.velocityX * damping;
//                 ball.scaleX = 0.8;
//                 ball.scaleY = 1.2;
//             }
//             if (ball.y - ball.radius < 0) {
//                 ball.y = ball.radius;
//                 ball.velocityY = -ball.velocityY * damping;
//                 ball.scaleX = 1.2;
//                 ball.scaleY = 0.8;
//             }
//             if (ball.y + ball.radius > window.innerHeight) {
//                 ball.y = window.innerHeight - ball.radius;
//                 ball.velocityY = -ball.velocityY * damping;
//                 ball.scaleX = 1.2;
//                 ball.scaleY = 0.8;
//             }

//             // Check collision with cursor
//             if (mouseX !== null && mouseY !== null) {
//                 const dx = ball.x - mouseX;
//                 const dy = ball.y - mouseY;
//                 const distance = Math.sqrt(dx * dx + dy * dy);

//             if (distance < ball.radius + radius) {
//                 const angle = Math.atan2(dy, dx);
//                 const pushDistance = ball.radius + radius - distance;

//                 const force = pushDistance * 0.2;
//                 ball.velocityX += Math.cos(angle) * force;
//                 ball.velocityY += Math.sin(angle) * force;

//                 // Apply deformation based on angle
//                 const absCos = Math.cos(angle);
//                 const absSin = Math.sin(angle);
//                 ball.scaleX = 1 + 0.2 * absCos;
//                 ball.scaleY = 1 + 0.2 * absSin;
//             }
//         }

//             // Check collisions with other balls
//             for (let j = i + 1; j < balls.length; j++) {
//                 resolveCollision(ball, balls[j]);
//             }

//             ball.scaleX += (1 - ball.scaleX) * 0.1;
//             ball.scaleY += (1 - ball.scaleY) * 0.1;

//             // Update position and transformation
//             ball.element.style.left = `${ball.x - ball.radius}px`;
//             ball.element.style.top = `${ball.y - ball.radius}px`;
//             ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
//         });

//         requestAnimationFrame(updateBalls);
//     }

//     updateBalls();
// });

// document.addEventListener("DOMContentLoaded", () => {
//     const body = document.body;
//     const balls = [];
//     const radius = 15; // Cursor interaction radius
//     const gravity = 0.2; // Gravity constant
//     const damping = 0.8; // Damping factor for deformation
//     const friction = 0.99; // Friction multiplier (1 = no friction, <1 adds friction)
//     let mouseX = null;
//     let mouseY = null;

//     // Ball properties
//     const ballColors = ['red', 'green', 'blue']; // RGB colors
//     const numBalls = ballColors.length; // 3 balls

//     // Maximum deformation parameters
//     const maxDeformation = 0.2; // Maximum deformation factor
//     const speedThreshold = 10; // Speed at which maximum deformation occurs

//     // Function to calculate deformation based on speed
//     function calculateDeformation(speed, maxDeformation, speedThreshold) {
//         const cappedSpeed = Math.min(speed, speedThreshold);
//         const deformation = (cappedSpeed / speedThreshold) * maxDeformation;
//         return deformation;
//     }

//     // Generate balls
//     for (let i = 0; i < numBalls; i++) {
//         const ball = document.createElement("div");
//         ball.classList.add("ball");
//         const size = Math.random() * 100 + 50; // Random size between 50px and 150px
//         const x = Math.random() * (window.innerWidth - size) + size / 2; // Adjust to center
//         const y = Math.random() * (window.innerHeight - size) + size / 2; // Adjust to center
//         const color = ballColors[i];

//         ball.style.width = `${size}px`;
//         ball.style.height = `${size}px`;
//         ball.style.backgroundColor = color;
//         ball.style.position = "absolute";
//         ball.style.borderRadius = "50%";
//         ball.style.left = `${x - size / 2}px`;
//         ball.style.top = `${y - size / 2}px`;

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
//         mouseX = e.clientX;
//         mouseY = e.clientY;
//     });

//     // Ball Collisions
//     function resolveCollision(ball1, ball2) {
//         const dx = ball1.x - ball2.x;
//         const dy = ball1.y - ball2.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < ball1.radius + ball2.radius) {
//             // Avoid overlap by adjusting positions
//             const overlap = ball1.radius + ball2.radius - distance;
//             const nx = dx / distance;
//             const ny = dy / distance;

//             ball1.x += (nx * overlap) / 2;
//             ball1.y += (ny * overlap) / 2;
//             ball2.x -= (nx * overlap) / 2;
//             ball2.y -= (ny * overlap) / 2;

//             // Swap velocities
//             [ball1.velocityX, ball2.velocityX] = [ball2.velocityX, ball1.velocityX];
//             [ball1.velocityY, ball2.velocityY] = [ball2.velocityY, ball1.velocityY];

//             // Compute relative velocity along the normal
//             const dvx = ball1.velocityX - ball2.velocityX;
//             const dvy = ball1.velocityY - ball2.velocityY;
//             const relativeVelocity = dvx * nx + dvy * ny;

//             // Compute deformation based on relative velocity
//             const deformation = calculateDeformation(Math.abs(relativeVelocity), maxDeformation, speedThreshold);

//             // Apply deformation
//             ball1.scaleX = 1 + deformation * Math.abs(nx);
//             ball1.scaleY = 1 + deformation * Math.abs(ny);
//             ball2.scaleX = 1 + deformation * Math.abs(nx);
//             ball2.scaleY = 1 + deformation * Math.abs(ny);
//         }
//     }

//     // Adjust balls on window resize
//     window.addEventListener("resize", () => {
//         balls.forEach((ball) => {
//             ball.x = Math.random() * (window.innerWidth - ball.size) + ball.radius;
//             ball.y = Math.random() * (window.innerHeight - ball.size) + ball.radius;
//             ball.element.style.left = `${ball.x - ball.radius}px`;
//             ball.element.style.top = `${ball.y - ball.radius}px`;
//         });
//     });

//     function updateBalls() {
//         balls.forEach((ball, i) => {
//             ball.x += ball.velocityX;
//             ball.y += ball.velocityY;

//             // Apply gravity
//             ball.velocityY += gravity;

//             // Apply friction
//             ball.velocityX *= friction;
//             ball.velocityY *= friction;

//             // Bounce off edges
//             if (ball.x - ball.radius < 0) {
//                 ball.x = ball.radius;
//                 ball.velocityX = -ball.velocityX * damping;

//                 const speed = Math.abs(ball.velocityX);
//                 const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
//                 ball.scaleX = 1 - deformation;
//                 ball.scaleY = 1 + deformation;
//             }
//             if (ball.x + ball.radius > window.innerWidth) {
//                 ball.x = window.innerWidth - ball.radius;
//                 ball.velocityX = -ball.velocityX * damping;

//                 const speed = Math.abs(ball.velocityX);
//                 const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
//                 ball.scaleX = 1 - deformation;
//                 ball.scaleY = 1 + deformation;
//             }
//             if (ball.y - ball.radius < 0) {
//                 ball.y = ball.radius;
//                 ball.velocityY = -ball.velocityY * damping;

//                 const speed = Math.abs(ball.velocityY);
//                 const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
//                 ball.scaleX = 1 + deformation;
//                 ball.scaleY = 1 - deformation;
//             }
//             if (ball.y + ball.radius > window.innerHeight) {
//                 ball.y = window.innerHeight - ball.radius;
//                 ball.velocityY = -ball.velocityY * damping;

//                 const speed = Math.abs(ball.velocityY);
//                 const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
//                 ball.scaleX = 1 + deformation;
//                 ball.scaleY = 1 - deformation;
//             }

//             // Check collision with cursor
//             if (mouseX !== null && mouseY !== null) {
//                 const dx = ball.x - mouseX;
//                 const dy = ball.y - mouseY;
//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < ball.radius + radius) {
//                     const angle = Math.atan2(dy, dx);
//                     const pushDistance = ball.radius + radius - distance;

//                     const force = pushDistance * 0.2;
//                     ball.velocityX += Math.cos(angle) * force;
//                     ball.velocityY += Math.sin(angle) * force;

//                     // Compute deformation based on current speed
//                     const speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
//                     const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);

//                     ball.scaleX = 1 + deformation * Math.abs(Math.cos(angle));
//                     ball.scaleY = 1 + deformation * Math.abs(Math.sin(angle));
//                 }
//             }

//             // Check collisions with other balls
//             for (let j = i + 1; j < balls.length; j++) {
//                 resolveCollision(ball, balls[j]);
//             }

//             // Gradually return to normal size
//             ball.scaleX += (1 - ball.scaleX) * 0.1;
//             ball.scaleY += (1 - ball.scaleY) * 0.1;

//             // Update position and transformation
//             ball.element.style.left = `${ball.x - ball.radius}px`;
//             ball.element.style.top = `${ball.y - ball.radius}px`;
//             ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
//         });

//         requestAnimationFrame(updateBalls);
//     }

//     updateBalls();
// });



document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const balls = [];
    const radius = 15; // Cursor interaction radius
    const gravity = 0.2; // Gravity constant
    const damping = 0.8; // Damping factor for deformation
    const friction = 0.98; // Friction multiplier (1 = no friction, <1 adds friction)
    let mouseX = null;
    let mouseY = null;

    // Ball properties
    const ballColors = ['red', 'green', 'blue']; // RGB colors
    const numBalls = ballColors.length; // 3 balls

    // Maximum deformation parameters
    const maxDeformation = 0.5; // Increased maximum deformation factor
    const speedThreshold = 10; // Speed at which maximum deformation occurs

    // Function to calculate deformation based on speed
    function calculateDeformation(speed, maxDeformation, speedThreshold) {
        const cappedSpeed = Math.min(speed, speedThreshold);
        const deformation = (cappedSpeed / speedThreshold) * maxDeformation;
        return deformation;
    }

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
            x,
            y,
            size,
            radius: size / 2,
            velocityX: Math.random() * 2 - 1,
            velocityY: Math.random() * 2 - 1,
            scaleX: 1,
            scaleY: 1,
            isAtRest: false, // New property to track if the ball is at rest
        });
    }

    // Cursor movement
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Ball Collisions
    function resolveCollision(ball1, ball2) {
        const dx = ball1.x - ball2.x;
        const dy = ball1.y - ball2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball1.radius + ball2.radius) {
            // Avoid overlap by adjusting positions
            const overlap = ball1.radius + ball2.radius - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            ball1.x += (nx * overlap) / 2;
            ball1.y += (ny * overlap) / 2;
            ball2.x -= (nx * overlap) / 2;
            ball2.y -= (ny * overlap) / 2;

            // Swap velocities
            [ball1.velocityX, ball2.velocityX] = [ball2.velocityX, ball1.velocityX];
            [ball1.velocityY, ball2.velocityY] = [ball2.velocityY, ball1.velocityY];

            // Set balls to not at rest
            ball1.isAtRest = false;
            ball2.isAtRest = false;

            // Compute relative velocity along the normal
            const dvx = ball1.velocityX - ball2.velocityX;
            const dvy = ball1.velocityY - ball2.velocityY;
            const relativeVelocity = dvx * nx + dvy * ny;

            // Compute deformation based on relative velocity
            const deformation = calculateDeformation(Math.abs(relativeVelocity), maxDeformation, speedThreshold);

            // Apply deformation
            ball1.scaleX = 1 + deformation * Math.abs(nx);
            ball1.scaleY = 1 + deformation * Math.abs(ny);
            ball2.scaleX = 1 + deformation * Math.abs(nx);
            ball2.scaleY = 1 + deformation * Math.abs(ny);
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

            // Apply gravity if not at rest
            if (!ball.isAtRest) {
                ball.velocityY += gravity;
            }

            // Apply friction
            ball.velocityX *= friction;
            ball.velocityY *= friction;

            // Bounce off left wall
            if (ball.x - ball.radius <= 0) {
                ball.x = ball.radius;
                ball.velocityX = -ball.velocityX * damping;
                ball.isAtRest = false;

                const speed = Math.abs(ball.velocityX);
                const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
                ball.scaleX = 1 - deformation;
                ball.scaleY = 1 + deformation;
            }

            // Bounce off right wall
            if (ball.x + ball.radius >= window.innerWidth) {
                ball.x = window.innerWidth - ball.radius;
                ball.velocityX = -ball.velocityX * damping;
                ball.isAtRest = false;

                const speed = Math.abs(ball.velocityX);
                const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
                ball.scaleX = 1 - deformation;
                ball.scaleY = 1 + deformation;
            }

            // Bounce off top wall
            if (ball.y - ball.radius <= 0) {
                ball.y = ball.radius;
                ball.velocityY = -ball.velocityY * damping;
                ball.isAtRest = false;

                const speed = Math.abs(ball.velocityY);
                const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
                ball.scaleX = 1 + deformation;
                ball.scaleY = 1 - deformation;
            }

            // Bounce off bottom wall
            if (ball.y + ball.radius >= window.innerHeight) {
                ball.y = window.innerHeight - ball.radius;

                if (Math.abs(ball.velocityY) < 1) {
                    // Ball is considered at rest
                    ball.velocityY = 0;
                    ball.isAtRest = true;
                } else {
                    ball.velocityY = -ball.velocityY * damping;
                    ball.isAtRest = false;
                }

                const speed = Math.abs(ball.velocityY);
                const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
                ball.scaleX = 1 + deformation;
                ball.scaleY = 1 - deformation;
            } else {
                ball.isAtRest = false;
            }

            // Apply higher friction when at rest
            if (ball.isAtRest) {
                ball.velocityX *= 0.9; // Increase friction to stop horizontal movement
            }

            // Check collision with cursor
            if (mouseX !== null && mouseY !== null) {
                const dx = ball.x - mouseX;
                const dy = ball.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < ball.radius + radius) {
                    const angle = Math.atan2(dy, dx);
                    const pushDistance = ball.radius + radius - distance;

                    const force = pushDistance * 0.2;
                    ball.velocityX += Math.cos(angle) * force;
                    ball.velocityY += Math.sin(angle) * force;

                    // Set ball to not at rest
                    ball.isAtRest = false;

                    // Compute deformation based on current speed
                    const speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
                    const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);

                    ball.scaleX = 1 + deformation * Math.abs(Math.cos(angle));
                    ball.scaleY = 1 + deformation * Math.abs(Math.sin(angle));
                }
            }

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(ball, balls[j]);
            }

            // Gradually return to normal size
            ball.scaleX += (1 - ball.scaleX) * 0.1;
            ball.scaleY += (1 - ball.scaleY) * 0.1;

            // Update position and transformation
            ball.element.style.left = `${ball.x - ball.radius}px`;
            ball.element.style.top = `${ball.y - ball.radius}px`;
            ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
        });

        requestAnimationFrame(updateBalls);
    }

    updateBalls();
});
