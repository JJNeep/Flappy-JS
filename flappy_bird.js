javascript: (function() {
    var oldPopup = document.getElementById('flappy-js-popup');
    if (oldPopup) oldPopup.remove();
    var backdrop = document.createElement('div');
    backdrop.id = 'flappy-js-popup';
    Object.assign(backdrop.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.25)'
    });
    var popupBox = document.createElement('div');
    Object.assign(popupBox.style, {
        background: '#fff',
        borderRadius: '12px',
        padding: '2em',
        minWidth: '320px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        position: 'relative',
        textAlign: 'center'
    });
    popupBox.innerHTML = '<style>canvas{background:#70c5ce;display:block;margin:0 auto;}</style><button id="popup-close-btn" style="position:absolute;top:10px;right:10px">✕</button><canvas id="gameCanvas" width="320" height="480"></canvas>';
    backdrop.appendChild(popupBox);
    document.body.appendChild(backdrop);
    document.getElementById('popup-close-btn').onclick = function() {
        backdrop.remove();
    };
    backdrop.addEventListener('click', function(e) {
        if (e.target === backdrop) backdrop.remove();
    });
    const key = 'flappyHighScore_' + window.location.hostname;
    let highScore = Number(localStorage.getItem(key) || 0);
    var canvas = document.getElementById('gameCanvas'),
        ctx = canvas.getContext('2d');
    var birdY = canvas.height / 2,
        velocity = 0,
        gravity = .8,
        jump = -12,
        pipes = [{
            x: 400,
            y: 200 * Math.random() + 50
        }],
        score = 0,
        gameOver = !1;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height),
            ctx.fillStyle = "yellow", ctx.beginPath(),
            ctx.arc(60, birdY, 15, 0, 2 * Math.PI),
            ctx.fill(),
            ctx.fillStyle = "green",
            pipes.forEach(function(e) {
                ctx.fillRect(e.x, 0, 40, e.y),
                    ctx.fillRect(e.x, e.y + 150, 40, canvas.height)
            }),
            pipes.forEach(function(e) {
                e.x -= 2,
                    60 === e.x && score++,
                    e.x < 75 && 45 < e.x + 40 && (birdY - 15 < e.y || birdY + 15 > e.y + 160) && (gameOver = !0)
            }),
            pipes[pipes.length - 1].x < 200 && pipes.push({
                x: 400,
                y: 200 * Math.random() + 50
            }),
            pipes[0].x < -40 && pipes.shift(),
            ctx.fillStyle = "black",
            ctx.font = "24px Arial",
            ctx.fillText("Score: " + score, 10, 40),
            ctx.fillText("High: " + highScore, canvas.width - 100, 40),
            velocity += gravity, birdY += velocity,
            (birdY + 15 >= canvas.height || birdY - 15 <= 0) && (gameOver = !0),
            gameOver ? ctx.fillText("Game Over", 90, 240) : requestAnimationFrame(draw),
            score > highScore ? highScore = score : localStorage.setItem('flappyHighScore', highScore)
    }

    var mouseIsDown = !1;

    function jumpHandler(e) {
        if (!gameOver && (e.code === "Space" || e.code === "ArrowUp")) velocity = jump;
    }

    function mouseDown() {
        if (!gameOver && !mouseIsDown) velocity = jump, mouseIsDown = !0;
    }

    function mouseUp() {
        mouseIsDown = !1;
    }

    function mousePressed() {
        if (gameOver) birdY = canvas.height/2, velocity = 0, pipes = [{x:400, y: 200*Math.random()+50}], score = 0, gameOver = false, draw();
    }

    document.addEventListener("keydown", jumpHandler);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("click", mousePressed);
    draw();
    backdrop.addEventListener('remove', function() {
        document.removeEventListener("keydown", jumpHandler);
        canvas.removeEventListener("mousedown", mouseDown);
        canvas.removeEventListener("mouseup", mouseUp);
    });
})();
