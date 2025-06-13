function startParticles(canvas) {
  const ctx = canvas.getContext('2d');
  
  // Force canvas to match actual screen dimensions
  const rect = canvas.getBoundingClientRect();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Set canvas style to ensure it covers full screen
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  
  const questionMarks = [];
  const count = 80; // Reduced count for better performance
  
  // Initialize particles across ENTIRE screen area
  for (let i = 0; i < count; i++) {
    questionMarks.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height, // Start at random Y positions across full height
      size: Math.random() * 16 + 10,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.3 + 0.2
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    questionMarks.forEach(q => {
      ctx.globalAlpha = q.opacity;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = `${q.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText("?", q.x, q.y);
      
      // Move particle down
      q.y += q.speed;
      
      // Reset particle when it goes off screen
      if (q.y > canvas.height + 50) {
        q.y = -50;
        q.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

// Initialize when Reveal.js is ready
Reveal.on('ready', function(event) {
  setTimeout(() => {
    const canvas = document.querySelector('#question-canvas');
    if (canvas) {
      startParticles(canvas);
    }
  }, 100); // Small delay to ensure everything is loaded
});

// Reinitialize on slide change
Reveal.on('slidechanged', function(event) {
  const canvas = event.currentSlide.querySelector('#question-canvas');
  if (canvas) {
    setTimeout(() => {
      startParticles(canvas);
    }, 100);
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  const canvas = document.querySelector('#question-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

function initGlowCursor() {
    // Create the cursor element
    const cursor = document.createElement('div');
    cursor.className = 'glow-cursor';
    document.body.appendChild(cursor);
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Optional: Add click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// Initialize cursor when the page loads
document.addEventListener('DOMContentLoaded', initGlowCursor);

// Background music auto-play
function initBackgroundMusic() {
    const audio = document.getElementById('background-music');
    
    if (audio) {
        // Set volume (0.0 to 1.0)
        audio.volume = 0.002; // Adjust this value (30% volume)
        
        // Try to play automatically
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Background music started');
            }).catch(error => {
                console.log('Autoplay prevented by browser. Music will start on first user interaction.');
                
                // Fallback: Start music on first user interaction
                const startMusic = () => {
                    audio.play();
                    document.removeEventListener('click', startMusic);
                    document.removeEventListener('keydown', startMusic);
                };
                
                document.addEventListener('click', startMusic);
                document.addEventListener('keydown', startMusic);
            });
        }
    }
}

// Initialize music when Reveal.js is ready
Reveal.on('ready', function(event) {
    initBackgroundMusic();
});