document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const contentDisplay = document.getElementById('content-display');
    const backgroundMusic = document.getElementById('background-music');
    const flowerCanvas = document.getElementById('flower-canvas');
    const ctx = flowerCanvas.getContext('2d');
    const starParticlesContainer = document.getElementById('star-particles');
    const cometShowerContainer = document.getElementById('comet-shower');
    const headerContent = document.getElementById('header-content');

    // Datos del contenido para cada paso
    const contentSteps = [
        { type: 'phrase', text: 'Flores Para Ti', music: 'music/primera.mp3' }, 
        { type: 'phrase', text: 'En cada flor, una nota de amor.', music: 'music/cancion1.mp3' },
        { type: 'phrase', text: 'Tu sonrisa es mi jardín favorito.', music: 'music/cancion2.mp3' },
        { type: 'phrase', text: 'Contigo, el tiempo se detiene...', music: 'music/cancion3.mp3' },
        { 
            type: 'letter', 
            text: `Mi amor eterno,
            <br><br>
            Cada día a tu lado es un regalo, una aventura que supera cualquier sueño.
            <br><br>
            Eres el sol que ilumina mis mañanas y la luna que me acompaña en la noche.
            <br><br>
            Gracias por ser tú.`, 
            music: 'music/cancion_final.mp3' 
        }
    ];

    let currentStep = 0;
    let clickEnabled = true;

    // Función para dibujar una flor
    function drawFlower(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.shadowColor = '#FFD700'; 
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFD700';
        const numPetals = 10;
        const petalLength = 50;
        const petalWidth = 20;
        const petalOffset = 20;
        for (let i = 0; i < numPetals; i++) {
            const angle = (i * Math.PI * 2) / numPetals;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.roundRect(petalOffset, -petalWidth / 2, petalLength, petalWidth, 10);
            ctx.fillStyle = '#FFC107';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#614800';
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#A0522D';
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(0, 80);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#4CAF50';
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(-20, 50, 10, 30, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#66BB6A';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(20, 60, 10, 30, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = '#66BB6A';
        ctx.fill();
        ctx.restore();
    }

    // Animación de las flores en el canvas principal
    function animateFlowers() {
        ctx.clearRect(0, 0, flowerCanvas.width, flowerCanvas.height);
        const baseY = flowerCanvas.height * 0.85; 
        const flowerPositions = [
            { x: flowerCanvas.width / 2, y: baseY - 100, scale: 1 },
            { x: flowerCanvas.width * 0.4, y: baseY - 50, scale: 0.9 },
            { x: flowerCanvas.width * 0.6, y: baseY - 50, scale: 0.9 },
            { x: flowerCanvas.width * 0.35, y: baseY - 150, scale: 0.95 },
            { x: flowerCanvas.width * 0.65, y: baseY - 150, scale: 0.95 },
            { x: flowerCanvas.width * 0.5, y: baseY - 200, scale: 1.1 },
        ];
        flowerPositions.forEach(pos => {
            drawFlower(ctx, pos.x, pos.y, pos.scale); 
        });

        requestAnimationFrame(animateFlowers);
    }
    
    // Función para mostrar el contenido del paso actual
    function displayContent(step) {
        if (!clickEnabled) return;
        clickEnabled = false;

        contentDisplay.innerHTML = '';
        const content = contentSteps[step];
        backgroundMusic.src = content.music;
        backgroundMusic.play().catch(e => console.log("Error al reproducir música:", e));

        if (content.type === 'letter') {
            const letter = document.createElement('div');
            letter.id = 'love-letter';
            letter.innerHTML = content.text + '<br><br><span id="thanks-text">¡Gracias!</span>';
            contentDisplay.appendChild(letter);
        } else {
            const newParagraph = document.createElement('p');
            newParagraph.id = 'message-text';
            newParagraph.innerHTML = content.text;
            contentDisplay.appendChild(newParagraph);
            void newParagraph.offsetWidth;
            newParagraph.classList.add('visible');
        }

        flowerCanvas.classList.add('moved-left');
        contentDisplay.classList.add('visible');

        setTimeout(() => {
            clickEnabled = true;
        }, 1500);
    }
    
    // Generar y animar partículas de estrellas y cometas
    function createStarParticles() { 
        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 5 + 2;
            star.style.width = star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const duration = Math.random() * 5 + 3;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starParticlesContainer.appendChild(star);
        }
    }

    // Lógica de reinicio y manejo de clics
    function resetProject() {
        currentStep = 0;
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        
        contentDisplay.innerHTML = '';
        contentDisplay.classList.remove('visible');
        
        flowerCanvas.classList.remove('moved-left');
        
        const initialText = document.createElement('p');
        initialText.id = 'initial-text';
        contentDisplay.appendChild(initialText);

        initialiseProject();
    }
    
    // Manejador de clics
    appContainer.addEventListener('click', () => {
        if (!clickEnabled) return;

        if (currentStep < contentSteps.length - 1) {
            currentStep++;
            displayContent(currentStep);
        } else {
            resetProject();
        }
    });

    // Redimensionar el canvas
    const resizeCanvas = () => {
        flowerCanvas.width = window.innerWidth;
        flowerCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Función de inicialización
    function initialiseProject() {
        animateFlowers();
        createStarParticles();
        
        const initialText = document.createElement('p');
        initialText.id = 'initial-text';
        initialText.textContent = contentSteps[0].text;
        contentDisplay.appendChild(initialText);

        backgroundMusic.volume = 0.6;
        backgroundMusic.src = contentSteps[0].music;
        backgroundMusic.play().catch(e => console.log("Autoplay de música bloqueado. Haz clic para iniciar."));
    }
    
    // Inicia el proyecto
    initialiseProject();
});
