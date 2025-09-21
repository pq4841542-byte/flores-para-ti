document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const contentDisplay = document.getElementById('content-display');
    const messageText = document.getElementById('message-text');
    const backgroundMusic = document.getElementById('background-music');
    const flowerCanvas = document.getElementById('flower-canvas');
    const ctx = flowerCanvas.getContext('2d');
    const starParticlesContainer = document.getElementById('star-particles');
    const cometShowerContainer = document.getElementById('comet-shower');
    const headerContent = document.getElementById('header-content');


    // Datos del contenido para cada paso
    const contentSteps = [
        // La ruta ha sido cambiada de 'audios/' a 'music/'
        { type: 'phrase', text: 'Haz clic para comenzar...', music: 'music/primera.mp3' }, 
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

    // Función para dibujar una flor con el estilo de tu imagen
    function drawFlower(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.shadowColor = '#FFD700'; // Color dorado/amarillo brillante
        ctx.shadowBlur = 15; // Intensidad del brillo
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

        // Dibujar el texto "Flores Para Ti" y el pequeño girasol superior
        ctx.save();
        ctx.font = 'bold 60px Pacifico';
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.textAlign = 'center';
        ctx.fillText('Flores Para Ti', flowerCanvas.width / 2, flowerCanvas.height * 0.15);
        drawFlower(ctx, flowerCanvas.width * 0.78, flowerCanvas.height * 0.13, 0.4);
        ctx.restore();


        requestAnimationFrame(animateFlowers);
    }

    // Función para mostrar el contenido del paso actual
    function displayContent(step) {
        if (!clickEnabled) return;
        clickEnabled = false;

        const currentMessage = document.getElementById('message-text');
        
        // La carta es diferente a los otros pasos
        const isLetter = contentSteps[step].type === 'letter';

        if (currentMessage) {
            currentMessage.classList.remove('visible');
            setTimeout(() => {
                currentMessage.remove();
                showNewContent(contentSteps[step]);
            }, 800);
        } else {
            showNewContent(contentSteps[step]);
        }
        
        // Lógica de transición de flores
        if (!isLetter) {
            flowerCanvas.classList.add('moved-left');
            contentDisplay.classList.add('visible');
        } else {
            // No mover las flores si es el paso de la carta
            flowerCanvas.classList.remove('moved-left');
            contentDisplay.classList.remove('visible');
        }

        backgroundMusic.src = contentSteps[step].music;
        backgroundMusic.play().catch(e => console.log("Error al reproducir música:", e));
        
        setTimeout(() => {
            clickEnabled = true;
        }, 1500);
    }

    function showNewContent(content) {
        contentDisplay.innerHTML = '';
        if (content.type === 'letter') {
            const letter = document.createElement('div');
            letter.id = 'love-letter';
            letter.innerHTML = content.text + '<br><br><span id="thanks-text">¡Gracias!</span>';
            contentDisplay.appendChild(letter);
            contentDisplay.classList.add('visible');
        } else {
            const newParagraph = document.createElement('p');
            newParagraph.id = 'message-text';
            newParagraph.innerHTML = content.text;
            contentDisplay.appendChild(newParagraph);
            void newParagraph.offsetWidth;
            newParagraph.classList.add('visible');
        }
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

    // Lógica del reinicio
    function resetProject() {
        currentStep = 0;
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        
        contentDisplay.innerHTML = '';
        contentDisplay.classList.remove('visible');
        
        flowerCanvas.classList.remove('moved-left');
        
        // Forzar la creación de la etiqueta 'message-text' para el primer paso
        const initialMessage = document.createElement('p');
        initialMessage.id = 'message-text';
        appContainer.appendChild(initialMessage);

        // Volver a iniciar el primer paso
        initialiseProject();
    }

    // Manejador de clics
    appContainer.addEventListener('click', () => {
        if (!clickEnabled) return;

        if (currentStep < contentSteps.length - 1) {
            currentStep++;
            displayContent(currentStep);
        } else {
            // Si es el último paso, reinicia
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
        
        messageText.textContent = contentSteps[0].text;
        messageText.classList.add('visible');
        backgroundMusic.volume = 0.6;
        backgroundMusic.src = contentSteps[0].music;
        backgroundMusic.play().catch(e => console.log("Autoplay de música bloqueado. Haz clic para iniciar."));
    }
    
    // Inicia el proyecto
    initialiseProject();
});