
// Floating particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Apply styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = opacity;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    // Add to container
    particlesContainer.appendChild(particle);
    }
    
    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(10px, 10px); }
        50% { transform: translate(5px, -5px); }
        75% { transform: translate(-5px, 5px); }
    }
    `;
    document.head.appendChild(style);
}

// Initialize particles
createParticles();

