// // document.addEventListener("DOMContentLoaded", () => {
// //     const body = document.body;
// //     const balls = [];
// //     const radius = 50; // Cursor interaction radius
// //     const gravity = 0.2; // Gravity constant
// //     const damping = 0.8; // Damping factor for deformation
// //     const friction = 0.99; // Friction multiplier (1 = no friction, <1 adds friction)
// //     const restThreshold = 0.1; // Velocity threshold to stop bouncing

// //     // Ball properties
// //     const ballColors = ['red', 'green', 'blue']; // RGB colors
// //     const numBalls = ballColors.length; // 3 balls

// //     // Generate balls
// //     for (let i = 0; i < numBalls; i++) {
// //         const ball = document.createElement("div");
// //         ball.classList.add("ball");

// //         const size = Math.random() * 100 + 50; // Random size between 50px and 150px
// //         const x = Math.random() * (window.innerWidth - size);
// //         const y = Math.random() * (window.innerHeight - size);
// //         const color = ballColors[i];

// //         ball.style.width = `${size}px`;
// //         ball.style.height = `${size}px`;
// //         ball.style.backgroundColor = color;
// //         ball.style.left = `${x}px`;
// //         ball.style.top = `${y}px`;

// //         body.appendChild(ball);

// //         balls.push({
// //             element: ball,
// //             x,
// //             y,
// //             size,
// //             radius: size / 2,
// //             velocityX: Math.random() * 2 - 1,
// //             velocityY: Math.random() * 2 - 1,
// //             scaleX: 1,
// //             scaleY: 1,
// //         });
// //     }

// //     // Cursor movement
// //     document.addEventListener("mousemove", (e) => {
// //         const mouseX = e.clientX;
// //         const mouseY = e.clientY;

// //         balls.forEach((ball) => {
// //             const dx = ball.x + ball.radius - mouseX;
// //             const dy = ball.y + ball.radius - mouseY;
// //             const distance = Math.sqrt(dx * dx + dy * dy);

// //             if (distance < radius) {
// //                 const angle = Math.atan2(dy, dx);
// //                 const pushDistance = radius - distance;

// //                 const force = pushDistance * 0.2; // Increased force
// //                 ball.velocityX += Math.cos(angle) * force;
// //                 ball.velocityY += Math.sin(angle) * force;

// //                 // Apply less significant deformation based on force
// //                 const deformation = Math.min(force * 0.05, 0.2); // Reduced deformation
// //                 ball.scaleX = 1 + deformation;
// //                 ball.scaleY = 1 - deformation;
// //             }
// //         });
// //     });

// //     function resolveCollision(ball1, ball2) {
// //         const dx = ball1.x + ball1.radius - (ball2.x + ball2.radius);
// //         const dy = ball1.y + ball1.radius - (ball2.y + ball2.radius);
// //         const distance = Math.sqrt(dx * dx + dy * dy);

// //         if (distance < ball1.radius + ball2.radius) {
// //             // Avoid overlap by adjusting positions
// //             const overlap = ball1.radius + ball2.radius - distance;
// //             const normalX = dx / distance;
// //             const normalY = dy / distance;

// //             ball1.x += (normalX * overlap) / 2;
// //             ball1.y += (normalY * overlap) / 2;
// //             ball2.x -= (normalX * overlap) / 2;
// //             ball2.y -= (normalY * overlap) / 2;

// //             // Swap velocities
// //             [ball1.velocityX, ball2.velocityX] = [ball2.velocityX, ball1.velocityX];
// //             [ball1.velocityY, ball2.velocityY] = [ball2.velocityY, ball1.velocityY];
// //         }
// //     }

// //     function updateBalls() {
// //         // Get precise bounding box for the text block
// //         const textBox = document.querySelector("#background").getBoundingClientRect();

// //         balls.forEach((ball, i) => {
// //             ball.x += ball.velocityX;
// //             ball.y += ball.velocityY;

// //             // Apply gravity
// //             ball.velocityY += gravity;

// //             // Apply friction
// //             ball.velocityX *= friction;
// //             ball.velocityY *= friction;

// //             // Bounce off edges
// //             if (ball.x < 0) {
// //                 ball.x = 0;
// //                 ball.velocityX = -ball.velocityX * damping;
// //                 ball.scaleX = 1.2; // Slight deformation
// //                 ball.scaleY = 0.8;
// //             }
// //             if (ball.x + ball.size > window.innerWidth) {
// //                 ball.x = window.innerWidth - ball.size;
// //                 ball.velocityX = -ball.velocityX * damping;
// //                 ball.scaleX = 1.2;
// //                 ball.scaleY = 0.8;
// //             }
// //             if (ball.y < 0) {
// //                 ball.y = 0;
// //                 ball.velocityY = -ball.velocityY * damping;
// //                 ball.scaleX = 0.8;
// //                 ball.scaleY = 1.2;
// //             }
// //             if (ball.y + ball.size > window.innerHeight) {
// //                 ball.y = window.innerHeight - ball.size;

// //                 // Stop vertical motion if velocity is below the rest threshold
// //                 if (Math.abs(ball.velocityY) < restThreshold) {
// //                     ball.velocityY = 0;
// //                 } else {
// //                     ball.velocityY = -ball.velocityY * damping;
// //                 }

// //                 ball.scaleX = 0.8;
// //                 ball.scaleY = 1.2;
// //             }

// //             // Bounce off the text box edges
// //             if (
// //                 ball.x + ball.radius > textBox.left &&
// //                 ball.x - ball.radius < textBox.right &&
// //                 ball.y + ball.radius > textBox.top &&
// //                 ball.y - ball.radius < textBox.bottom
// //             ) {
// //                 if (ball.x < textBox.left || ball.x + ball.size > textBox.right) {
// //                     ball.velocityX = -ball.velocityX * damping;
// //                 }
// //                 if (ball.y < textBox.top || ball.y + ball.size > textBox.bottom) {
// //                     ball.velocityY = -ball.velocityY * damping;
// //                 }
// //             }

// //             // Check collisions with other balls
// //             for (let j = i + 1; j < balls.length; j++) {
// //                 resolveCollision(ball, balls[j]);
// //             }

// //             // Restore to original scale
// //             ball.scaleX += (1 - ball.scaleX) * 0.1;
// //             ball.scaleY += (1 - ball.scaleY) * 0.1;

// //             // Update position and transformation
// //             ball.element.style.left = `${ball.x}px`;
// //             ball.element.style.top = `${ball.y}px`;
// //             ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
// //         });

// //         requestAnimationFrame(updateBalls);
// //     }

// //     updateBalls();

// //     // Adjust balls on window resize
// //     window.addEventListener("resize", () => {
// //         balls.forEach((ball) => {
// //             ball.x = Math.random() * (window.innerWidth - ball.size);
// //             ball.y = Math.random() * (window.innerHeight - ball.size);
// //             ball.element.style.left = `${ball.x}px`;
// //             ball.element.style.top = `${ball.y}px`;
// //         });
// //     });
// // });

// document.addEventListener("DOMContentLoaded", () => {
//     const body = document.body;
//     const balls = [];
//     const radius = 50; // Cursor interaction radius
//     const gravity = 0.2; // Gravity constant
//     const damping = 0.8; // Damping factor for deformation
//     const friction = 0.99; // Friction multiplier (1 = no friction, <1 adds friction)
//     const restThreshold = 0.1; // Velocity threshold to stop bouncing

//     // Ball properties
//     const ballColors = ['red', 'green', 'blue']; // RGB colors
//     const numBalls = ballColors.length; // 3 balls

//     // Generate balls
//     for (let i = 0; i < numBalls; i++) {
//         const ball = document.createElement("div");
//         ball.classList.add("ball");

//         const size = Math.random() * 100 + 50; // Random size between 50px and 150px
//         const x = Math.random() * (window.innerWidth - size);
//         const y = Math.random() * (window.innerHeight - size);
//         const color = ballColors[i];

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
//             atRest: false, // New property
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
//                 ball.atRest = false; // Reset atRest status

//                 const angle = Math.atan2(dy, dx);
//                 const pushDistance = radius - distance;

//                 const force = pushDistance * 0.2; // Increased force
//                 ball.velocityX += Math.cos(angle) * force;
//                 ball.velocityY += Math.sin(angle) * force;

//                 // Apply less significant deformation based on force
//                 const deformation = Math.min(force * 0.05, 0.2); // Reduced deformation
//                 ball.scaleX = 1 + deformation;
//                 ball.scaleY = 1 - deformation;
//             }
//         });
//     });

//     function resolveCollision(ball1, ball2) {
//         const dx = ball1.x + ball1.radius - (ball2.x + ball2.radius);
//         const dy = ball1.y + ball1.radius - (ball2.y + ball2.radius);
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
//         }
//     }

//     function wrapWordsInSpans() {
//         const background = document.querySelector("#background");
//         const walker = document.createTreeWalker(background, NodeFilter.SHOW_TEXT, null, false);

//         let node;
//         while ((node = walker.nextNode())) {
//             const text = node.textContent;
//             const words = text.split(/(\s+)/); // Split text, including spaces

//             if (words.length > 1) {
//                 const fragment = document.createDocumentFragment();
//                 words.forEach((word) => {
//                     if (/\s+/.test(word)) {
//                         fragment.appendChild(document.createTextNode(word));
//                     } else {
//                         const span = document.createElement("span");
//                         span.className = "word";
//                         span.textContent = word;
//                         fragment.appendChild(span);
//                     }
//                 });
//                 node.parentNode.replaceChild(fragment, node);
//             }
//         }
//     }

//     wrapWordsInSpans();

//     let wordRects = [];

//     function updateWordRects() {
//         wordRects = [];
//         const wordSpans = document.querySelectorAll("#background .word");
//         wordSpans.forEach((span) => {
//             const rect = span.getBoundingClientRect();
//             wordRects.push({
//                 left: rect.left,
//                 right: rect.right,
//                 top: rect.top,
//                 bottom: rect.bottom,
//             });
//         });
//     }

//     updateWordRects();

//     // Adjust balls on window resize and update wordRects
//     window.addEventListener("resize", () => {
//         updateWordRects();
//         balls.forEach((ball) => {
//             ball.x = Math.random() * (window.innerWidth - ball.size);
//             ball.y = Math.random() * (window.innerHeight - ball.size);
//             ball.element.style.left = `${ball.x}px`;
//             ball.element.style.top = `${ball.y}px`;
//         });
//     });

//     function checkCollisionWithWords(ball) {
//         for (let i = 0; i < wordRects.length; i++) {
//             const rect = wordRects[i];

//             // Simple AABB (Axis-Aligned Bounding Box) collision detection
//             if (
//                 ball.x + ball.size > rect.left &&
//                 ball.x < rect.right &&
//                 ball.y + ball.size > rect.top &&
//                 ball.y < rect.bottom
//             ) {
//                 // Determine collision side
//                 const ballCenterX = ball.x + ball.radius;
//                 const ballCenterY = ball.y + ball.radius;
//                 const rectCenterX = (rect.left + rect.right) / 2;
//                 const rectCenterY = (rect.top + rect.bottom) / 2;

//                 const dx = ballCenterX - rectCenterX;
//                 const dy = ballCenterY - rectCenterY;

//                 if (Math.abs(dx) > Math.abs(dy)) {
//                     // Horizontal collision
//                     ball.velocityX = -ball.velocityX * damping;
//                     ball.x += ball.velocityX;
//                 } else {
//                     // Vertical collision
//                     ball.velocityY = -ball.velocityY * damping;
//                     ball.y += ball.velocityY;
//                 }

//                 // Apply deformation
//                 ball.scaleX = 1.2;
//                 ball.scaleY = 0.8;
//             }
//         }
//     }

//     function updateBalls() {
//         balls.forEach((ball, i) => {
//             if (!ball.atRest) {
//                 ball.x += ball.velocityX;
//                 ball.y += ball.velocityY;

//                 // Apply gravity
//                 ball.velocityY += gravity;

//                 // Apply friction
//                 ball.velocityX *= friction;
//                 ball.velocityY *= friction;
//             }

//             // Bounce off edges
//             if (ball.x < 0) {
//                 ball.x = 0;
//                 ball.velocityX = -ball.velocityX * damping;
//                 ball.scaleX = 1.2; // Slight deformation
//                 ball.scaleY = 0.8;
//             }
//             if (ball.x + ball.size > window.innerWidth) {
//                 ball.x = window.innerWidth - ball.size;
//                 ball.velocityX = -ball.velocityX * damping;
//                 ball.scaleX = 1.2;
//                 ball.scaleY = 0.8;
//             }
//             if (ball.y < 0) {
//                 ball.y = 0;
//                 ball.velocityY = -ball.velocityY * damping;
//                 ball.scaleX = 0.8;
//                 ball.scaleY = 1.2;
//             }
//             if (ball.y + ball.size > window.innerHeight) {
//                 ball.y = window.innerHeight - ball.size;

//                 if (Math.abs(ball.velocityY) < restThreshold) {
//                     ball.velocityY = 0;
//                     ball.velocityX = 0; // Also stop horizontal movement
//                     ball.atRest = true; // Ball comes to rest
//                     ball.scaleX = 1;
//                     ball.scaleY = 1;
//                 } else {
//                     ball.velocityY = -ball.velocityY * damping;
//                     ball.scaleX = 0.8;
//                     ball.scaleY = 1.2;
//                 }
//             }

//             // Check collisions with other balls
//             for (let j = i + 1; j < balls.length; j++) {
//                 resolveCollision(ball, balls[j]);
//             }

//             // Check collision with words
//             checkCollisionWithWords(ball);

//             // Restore to original scale
//             if (!ball.atRest) {
//                 ball.scaleX += (1 - ball.scaleX) * 0.1;
//                 ball.scaleY += (1 - ball.scaleY) * 0.1;
//             }

//             // Update position and transformation
//             ball.element.style.left = `${ball.x}px`;
//             ball.element.style.top = `${ball.y}px`;
//             ball.element.style.transform = `scale(${ball.scaleX}, ${ball.scaleY})`;
//         });

//         requestAnimationFrame(updateBalls);
//     }

//     updateBalls();
// });


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
            atRest: false, // New property
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
                ball.atRest = false; // Reset atRest status

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

    function wrapWordsInSpans() {
        const background = document.querySelector("#background");
        const walker = document.createTreeWalker(background, NodeFilter.SHOW_TEXT, null, false);

        let node;
        while ((node = walker.nextNode())) {
            const text = node.textContent;
            const words = text.split(/(\s+)/); // Split text, including spaces

            if (words.length > 1) {
                const fragment = document.createDocumentFragment();
                words.forEach((word) => {
                    if (/\s+/.test(word)) {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const span = document.createElement("span");
                        span.className = "word";
                        span.textContent = word;
                        fragment.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(fragment, node);
            }
        }
    }

    wrapWordsInSpans();

    let wordRects = [];

    function updateWordRects() {
        wordRects = [];
        const wordSpans = document.querySelectorAll("#background .word");
        wordSpans.forEach((span) => {
            const rect = span.getBoundingClientRect();
            wordRects.push({
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
            });
        });
    }

    updateWordRects();

    // Adjust balls on window resize and update wordRects
    window.addEventListener("resize", () => {
        updateWordRects();
        balls.forEach((ball) => {
            ball.x = Math.random() * (window.innerWidth - ball.size);
            ball.y = Math.random() * (window.innerHeight - ball.size);
            ball.element.style.left = `${ball.x}px`;
            ball.element.style.top = `${ball.y}px`;
        });
    });

    function checkCollisionWithWords(ball) {
        for (let i = 0; i < wordRects.length; i++) {
            const rect = wordRects[i];

            // Simple AABB (Axis-Aligned Bounding Box) collision detection
            if (
                ball.x + ball.size > rect.left &&
                ball.x < rect.right &&
                ball.y + ball.size > rect.top &&
                ball.y < rect.bottom
            ) {
                // Determine collision side
                const ballCenterX = ball.x + ball.radius;
                const ballCenterY = ball.y + ball.radius;
                const rectCenterX = (rect.left + rect.right) / 2;
                const rectCenterY = (rect.top + rect.bottom) / 2;

                const dx = ballCenterX - rectCenterX;
                const dy = ballCenterY - rectCenterY;

                if (Math.abs(dx) > Math.abs(dy)) {
                    // Horizontal collision
                    ball.velocityX = -ball.velocityX * damping;
                    ball.x += ball.velocityX;
                } else {
                    // Vertical collision
                    ball.velocityY = -ball.velocityY * damping;
                    ball.y += ball.velocityY;
                }

                // Apply deformation
                ball.scaleX = 1.2;
                ball.scaleY = 0.8;
            }
        }
    }

    function updateBalls() {
        balls.forEach((ball, i) => {
            if (!ball.atRest) {
                ball.x += ball.velocityX;
                ball.y += ball.velocityY;

                // Apply gravity
                ball.velocityY += gravity;

                // Apply friction
                ball.velocityX *= friction;
                ball.velocityY *= friction;
            } else {
                // Ensure the ball stays on the ground
                ball.y = window.innerHeight - ball.size;
            }

            // Bounce off edges
            if (ball.x < 0) {
                ball.x = 0;
                ball.velocityX = -ball.velocityX * damping;
                ball.scaleX = 1.2; // Slight deformation
                ball.scaleY = 0.8;
            }
            if (ball.x + ball.size > window.innerWidth) {
                ball.x = window.innerWidth - ball.size;
                ball.velocityX = -ball.velocityX * damping;
                ball.scaleX = 1.2;
                ball.scaleY = 0.8;
            }
            if (ball.y < 0) {
                ball.y = 0;
                ball.velocityY = -ball.velocityY * damping;
                ball.scaleX = 0.8;
                ball.scaleY = 1.2;
            }
            if (ball.y + ball.size > window.innerHeight) {
                ball.y = window.innerHeight - ball.size;

                if (Math.abs(ball.velocityY) < restThreshold) {
                    ball.velocityY = 0;
                    ball.velocityX = 0; // Also stop horizontal movement
                    ball.atRest = true; // Ball comes to rest
                    ball.scaleX = 1;
                    ball.scaleY = 1;
                } else {
                    ball.velocityY = -ball.velocityY * damping;
                    ball.scaleX = 0.8;
                    ball.scaleY = 1.2;
                }
            }

            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(ball, balls[j]);
            }

            // Check collision with words
            checkCollisionWithWords(ball);

            // Restore to original scale
            if (!ball.atRest) {
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
});
