// =========================
// OORU - shootingStar.js
// Debugged & Copy-Paste Ready
// =========================

const shootingStarCanvas = document.getElementById("shootingStarCanvas");

if (shootingStarCanvas) {

    const ctx = shootingStarCanvas.getContext("2d");
    let shootingStars = [];

    function resizeCanvas() {
        shootingStarCanvas.width = window.innerWidth;
        shootingStarCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createShootingStar() {

        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight * 0.3;

        const angle = Math.PI / 4 + Math.random() * (Math.PI / 4);

        const speed = 8 + Math.random() * 12;
        const length = 60 + Math.random() * 80;
        const hue = 200 + Math.random() * 40;

        return {
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: length,
            life: 1,
            decay: 0.008 + Math.random() * 0.012,
            hue: hue,
            trail: []
        };
    }

    function launchShootingStar() {
        shootingStars.push(createShootingStar());
    }

    function updateShootingStars() {

        for (let i = shootingStars.length - 1; i >= 0; i--) {

            const s = shootingStars[i];

            s.trail.push({ x: s.x, y: s.y });

            if (s.trail.length > 15) {
                s.trail.shift();
            }

            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.05;

            s.life -= s.decay;

            if (
                s.life <= 0 ||
                s.x > window.innerWidth + 100 ||
                s.y > window.innerHeight + 100
            ) {
                shootingStars.splice(i, 1);
            }
        }
    }

    function drawShootingStars() {

        ctx.clearRect(
            0,
            0,
            shootingStarCanvas.width,
            shootingStarCanvas.height
        );

        for (const s of shootingStars) {

            for (let i = 0; i < s.trail.length; i++) {

                const point = s.trail[i];

                const alpha =
                    (i / s.trail.length) * s.life * 0.6;

                const size =
                    1 + (i / s.trail.length) * 2;

                ctx.beginPath();
                ctx.arc(
                    point.x,
                    point.y,
                    size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `hsla(${s.hue},80%,80%,${alpha})`;

                ctx.fill();
            }

            const headSize = 2 + s.life * 2;

            const gradient = ctx.createRadialGradient(
                s.x,
                s.y,
                0,
                s.x,
                s.y,
                headSize * 3
            );

            gradient.addColorStop(
                0,
                `hsla(${s.hue},100%,100%,${s.life})`
            );

            gradient.addColorStop(
                0.3,
                `hsla(${s.hue},90%,85%,${s.life * 0.6})`
            );

            gradient.addColorStop(
                1,
                `hsla(${s.hue},80%,70%,0)`
            );

            ctx.beginPath();
            ctx.arc(
                s.x,
                s.y,
                headSize * 3,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
                s.x,
                s.y,
                headSize * 0.5,
                0,
                Math.PI * 2
            );
            ctx.fillStyle =
                `rgba(255,255,255,${s.life})`;
            ctx.fill();
        }
    }

    function animateShootingStars() {

        updateShootingStars();
        drawShootingStars();

        requestAnimationFrame(
            animateShootingStars
        );
    }

    animateShootingStars();

    // Manual trigger
    window.launchShootingStar = launchShootingStar;

    // Automatic ambient shooting stars
    setInterval(() => {
        if (Math.random() < 0.7) {
            launchShootingStar();
        }
    }, 12000);

}
