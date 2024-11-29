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
    const maxDeformation = 0.3; // Increased maximum deformation factor
    const speedThreshold = 15; // Speed at which maximum deformation occurs

    // Function to calculate deformation based on speed
    function calculateDeformation(speed, maxDeformation, speedThreshold) {
        const cappedSpeed = Math.min(speed, speedThreshold);
        const deformation = (cappedSpeed / speedThreshold) * maxDeformation;
        return deformation;
    }

    // Get text elements for collision detection
    const textElements = document.querySelectorAll('h1, p, .contact-only');

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
            if (Math.abs(nx) > Math.abs(ny)){
                ball1.scaleX = 1 - deformation;
                ball1.scaleY = 1 + deformation;
                ball2.scaleX = 1 - deformation;
                ball2.scaleY = 1 + deformation;
            }
            else {
                ball1.scaleX = 1 + deformation;
                ball1.scaleY = 1 - deformation;
                ball2.scaleX = 1 + deformation;
                ball2.scaleY = 1 - deformation;
            }
        }
    }

    // Updated Circle-Rectangle Collision Detection Function
    function circleRectCollision(circle, rect) {
        const cx = circle.x;
        const cy = circle.y;
        const r = circle.radius;
        const rx = rect.left;
        const ry = rect.top;
        const rw = rect.width;
        const rh = rect.height;

        // Find the closest point to the circle within the rectangle
        const closestX = Math.max(rx, Math.min(cx, rx + rw));
        const closestY = Math.max(ry, Math.min(cy, ry + rh));

        // Calculate the distance between the circle's center and this closest point
        const distanceX = cx - closestX;
        const distanceY = cy - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        if (distanceSquared < (r * r)) {
            // Collision detected
            const distance = Math.sqrt(distanceSquared);
            // Avoid division by zero
            const nx = distanceX / (distance || 1);
            const ny = distanceY / (distance || 1);
            const penetrationDepth = r - distance;

            return {
                collided: true,
                normalX: nx,
                normalY: ny,
                penetrationDepth: penetrationDepth,
                contactX: closestX,
                contactY: closestY
            };
        } else {
            return {
                collided: false
            };
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
            // Update position
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
    
            // Apply gravity if not at rest
            if (!ball.isAtRest) {
                ball.velocityY += gravity;
            }
    
            // Apply friction
            ball.velocityX *= friction;
            ball.velocityY *= friction;
    
            // Check collisions with walls
            checkWallCollisions(ball);
    
            // Check collision with cursor
            checkCursorCollision(ball);
    
            // Check collision with text elements
            checkTextCollisions(ball);
    
            // Check collisions with other balls
            for (let j = i + 1; j < balls.length; j++) {
                resolveCollision(ball, balls[j]);
            }
    
            // Apply higher friction when at rest
            if (ball.isAtRest) {
                ball.velocityX *= 0.9; // Increase friction to stop horizontal movement
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
    
    // Function to check wall collisions
    function checkWallCollisions(ball) {
        let collided = false;
        let horizontalCollision = false;
    
        // Left wall
        if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.velocityX = -ball.velocityX * damping;
            collided = true;
            horizontalCollision = true;
        }
    
        // Right wall
        if (ball.x + ball.radius >= window.innerWidth) {
            ball.x = window.innerWidth - ball.radius;
            ball.velocityX = -ball.velocityX * damping;
            collided = true;
            horizontalCollision = true;
        }
    
        // Top wall
        if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.velocityY = -ball.velocityY * damping;
            collided = true;
        }
    
        // Bottom wall
        if (ball.y + ball.radius >= window.innerHeight) {
            ball.y = window.innerHeight - ball.radius;
            ball.velocityY = -ball.velocityY * damping;
            collided = true;
        }
    
        if (collided) {
            ball.isAtRest = false;
    
            // Check if ball should come to rest
            checkIfAtRest(ball);

            // Compute deformation
            const speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
            const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
            if (horizontalCollision) {
                // Horizontal collision: ScaleX decreases, ScaleY increases
                ball.scaleX = 1 - deformation * damping;
                ball.scaleY = 1 + deformation * damping;
            } else {
                // Vertical collision: ScaleX increases, ScaleY decreases
                ball.scaleX = 1 + deformation * damping;
                ball.scaleY = 1 - deformation * damping;
            }
        }
    }
    
    // Function to check cursor collision
    function checkCursorCollision(ball) {
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
    
                ball.isAtRest = false;
    
                // Compute deformation based on current speed
                const speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
                const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
    
                if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
                    // Horizontal collision: ScaleX decreases, ScaleY increases
                    ball.scaleX = 1 - deformation * damping * Math.cos(angle);
                    ball.scaleY = 1 + deformation * damping * Math.sin(angle);
                } else {
                    // Vertical collision: ScaleX increases, ScaleY decreases
                    ball.scaleX = 1 + deformation * damping * Math.cos(angle);
                    ball.scaleY = 1 - deformation * damping * Math.sin(angle);
                }
            }
        }
    }
    
    // Function to check collisions with text elements
    function checkTextCollisions(ball) {
        textElements.forEach((textEl) => {
            const rect = textEl.getBoundingClientRect();
    
            const collision = circleRectCollision(ball, rect);
    
            if (collision.collided) {
                // Adjust ball position to prevent overlap
                ball.x += collision.normalX * collision.penetrationDepth;
                ball.y += collision.normalY * collision.penetrationDepth;
    
                // Reflect velocity based on collision normal
                const velocityDotNormal = ball.velocityX * collision.normalX + ball.velocityY * collision.normalY;
                ball.velocityX -= 2 * velocityDotNormal * collision.normalX;
                ball.velocityY -= 2 * velocityDotNormal * collision.normalY;
    
                // Apply damping
                ball.velocityX *= damping;
                ball.velocityY *= damping;
    
                ball.isAtRest = false;
    
                // Check if ball should come to rest
                checkIfAtRest(ball);
    
                // Compute deformation
                const speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
                const deformation = calculateDeformation(speed, maxDeformation, speedThreshold);
    
                if (Math.abs(collision.normalX) > Math.abs(collision.normalY)) {
                    // Horizontal collision: ScaleX decreases, ScaleY increases
                    ball.scaleX = 1 - deformation;
                    ball.scaleY = 1 + deformation;
                } else {
                    // Vertical collision: ScaleX increases, ScaleY decreases
                    ball.scaleX = 1 + deformation;
                    ball.scaleY = 1 - deformation;
                }
            }
        });
    }
    
    // Function to determine if the ball should come to rest
    function checkIfAtRest(ball) {
        const speed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
        if (speed < 1.5) {
            ball.velocityX = 0;
            ball.velocityY = 0;
            ball.isAtRest = true;
        }
    }
    

    updateBalls();

    // Initialize Typed.js for the header
    var typedHeader = new Typed('#typed-header', {
        strings: [", I'm <span class=\"minimalist-underline\">Richard Zhang</span>."],
        typeSpeed: 75,
        startDelay: 1500,
        showCursor: true,
        contentType: 'html',
        onComplete: (self) => {
            // Remove cursor after 1 second
            setTimeout(() => {
                if (self.cursor) {
                    self.cursor.remove();
                }
            }, 1000);
        },
    });

    // Initialize Typed.js for the first paragraph
    var typedParagraph1 = new Typed('#typed-paragraph1', {
        strings: ["I study CS @ <a href=\"https://www.upenn.edu\" class=\"highlight-on-hover\" target=\"_blank\">Penn</a>."],
        typeSpeed: 50,
        startDelay: 5000, // Delay in milliseconds
        showCursor: false,
        contentType: 'html',
        onComplete: (self) => {
            // Remove cursor after 1 second
            setTimeout(() => {
                if (self.cursor) {
                    self.cursor.remove();
                }
            }, 1000);
        },
    });

    // Initialize Typed.js for the second paragraph
    var typedParagraph2 = new Typed('#typed-paragraph2', {
        strings: ["I'm from <a href=\"https://en.wikipedia.org/wiki/Bridgewater_Township,_New_Jersey\" class=\"highlight-on-hover\" target=\"_blank\">Bridgewater</a>, NJ."],
        typeSpeed: 50,
        startDelay: 7000,
        showCursor: false,
        contentType: 'html',
        onComplete: (self) => {
            // Remove cursor after 1 second
            setTimeout(() => {
                if (self.cursor) {
                    self.cursor.remove();
                }
                const contactDiv = document.querySelector('.contact-only');
                contactDiv.style.opacity = 1;
            }, 1000);
        },
    });
});
