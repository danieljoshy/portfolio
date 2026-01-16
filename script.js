document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('profileCard');
    const container = document.querySelector('.app-container');
    const orbs = document.querySelectorAll('.floating-orb');

    // Configuration for tilt effect
    const tiltStrength = 15; // Max rotation in degrees
    const parallaxStrength = 20; // Max movement in pixels

    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Calculate normalized position (-1 to 1)
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        // Apply tilt to card
        // RotateX is based on Y position (move up = tilt back)
        // RotateY is based on X position (move right = tilt right)
        requestAnimationFrame(() => {
            card.style.transform = `
                perspective(1000px)
                rotateX(${-yPos * tiltStrength}deg)
                rotateY(${xPos * tiltStrength}deg)
                scale3d(1.02, 1.02, 1.02)
            `;

            // Parallax for orbs (move opposite to mouse)
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                const xOffset = -xPos * parallaxStrength * speed;
                const yOffset = -yPos * parallaxStrength * speed;
                orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
    });

    // Mobile Gyroscope support (optional, requires permission on some devices)
    window.addEventListener('deviceorientation', (e) => {
        const { beta, gamma } = e; // beta: front-back, gamma: left-right

        // Clamp values
        const x = Math.min(Math.max(gamma, -45), 45); // -45 to 45
        const y = Math.min(Math.max(beta, -45), 45);  // -90 to 90 typically, taking subset

        const xPos = x / 45;
        const yPos = (y - 45) / 45; // Offset for holding angle

        card.style.transform = `
            perspective(1000px)
            rotateX(${-yPos * tiltStrength}deg)
            rotateY(${xPos * tiltStrength}deg)
        `;
    });

    // Add haptic feedback simulation on hover for nav items
    const navItems = document.querySelectorAll('.main-nav li a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // navigator.vibrate represents haptic, but rarely works on desktop web
            // We'll visually "pop" it via CSS, which is already handled
        });
    });
});
