/* ================= ACCESS LAYER ================= */

function grantAccess() {
    document.getElementById("msg").innerHTML = "Mengonfirmasi identitas...";
    setTimeout(() => {
        document.getElementById("layer1").style.opacity = 0;
        setTimeout(() => {
            document.getElementById("layer1").style.display = "none";
            document.getElementById("layer2").style.display = "block";
            startGame();
        }, 700);
    }, 900);
}

function denyAccess() {
    document.getElementById("msg").innerHTML = "Akses ditolak.";
}

/* ===================== GAME CODE ===================== */

function startGame() {

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 700;

    const playerImg = new Image();
    playerImg.src = "img/player.png";

    const enemyImg = new Image();
    enemyImg.src = "img/enemy.png";

    /* === Ukuran terbaru === */
    const PLAYER_SCALE = 0.25;
    const ENEMY_SCALE  = 0.3;

    let ship = { x: 230, y: 620, w: 0, h: 0 };
    let bullets = [];
    let enemies = [];
    let stars = [];
    let keys = {};
    let shootPressed = false;

    let score = 0;

    /* === STARFIELD === */
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 0.5 + Math.random() * 1.5
        });
    }

    /* === Controls === */
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    document.getElementById("leftBtn").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
    document.getElementById("leftBtn").addEventListener("touchend", () => keys["ArrowLeft"] = false);

    document.getElementById("rightBtn").addEventListener("touchstart", () => keys["ArrowRight"] = true);
    document.getElementById("rightBtn").addEventListener("touchend", () => keys["ArrowRight"] = false);

    document.getElementById("shootBtn").addEventListener("touchstart", () => shootPressed = true);
    document.getElementById("shootBtn").addEventListener("touchend", () => shootPressed = false);

    /* === Shooting (LOVE bullets) === */
    setInterval(() => {
        if (shootPressed || keys[" "]) {
            bullets.push({ 
                x: ship.x + ship.w/2 - 10,
                y: ship.y - 10,
                w: 20,
                h: 20
            });
        }
    }, 200);

    /* === Enemy spawn === */
    setInterval(() => {
        if (enemyImg.complete) {
            enemies.push({
                x: Math.random() * (canvas.width - enemyImg.width * ENEMY_SCALE),
                y: -80,
                w: enemyImg.width * ENEMY_SCALE,
                h: enemyImg.height * ENEMY_SCALE,
                speed: 2 + Math.random() * 2
            });
        }
    }, 900);

    /* === Efek "AWWW!" === */
    function spawnHitText(x, y) {
        const txt = document.createElement("div");
        txt.className = "hitText";
        txt.innerText = "AWWW!";
        txt.style.left = (canvas.offsetLeft + x) + "px";
        txt.style.top = (canvas.offsetTop + y) + "px";
        document.body.appendChild(txt);

        setTimeout(() => txt.remove(), 600);
    }

    /* === REWARD TEXT "AKU SAYANG BEBEB!!!" === */
    function spawnRewardText() {
        const txt = document.createElement("div");
        txt.className = "rewardText";
        txt.innerText = "AKU SAYANG BEBEB!!! ❤️";

        txt.style.left = "50%";
        txt.style.top = "40%";

        document.body.appendChild(txt);

        setTimeout(() => txt.remove(), 1500);
    }

    /* =============== GAME LOOP =============== */
    function update() {

        /* Player size set once */
        if (playerImg.complete && ship.w === 0) {
            ship.w = playerImg.width * PLAYER_SCALE;
            ship.h = playerImg.height * PLAYER_SCALE;
        }

        /* Stars */
        stars.forEach(s => {
            s.y += s.speed;
            if (s.y > canvas.height) {
                s.y = -5;
                s.x = Math.random() * canvas.width;
            }
        });

        /* Player movement */
        if (keys["ArrowLeft"] && ship.x > 0) ship.x -= 5;
        if (keys["ArrowRight"] && ship.x < canvas.width - ship.w) ship.x += 5;

        /* Bullets movement */
        bullets.forEach(b => b.y -= 8);

        /* Enemies */
        enemies.forEach(e => e.y += e.speed);

        /* Collision (LOVE bullet hit enemy) */
        bullets.forEach((b, bi) => {
            enemies.forEach((e, ei) => {
                if (b.x < e.x + e.w &&
                    b.x + b.w > e.x &&
                    b.y < e.y + e.h &&
                    b.y + b.h > e.y) {

                    spawnHitText(e.x + e.w/2, e.y + e.h/2);

                    /* SCORE UPDATE */
                    score += 100;
                    document.getElementById("scoreDisplay").innerText = "Score: " + score;

                    /* REWARD SETIAP 1000 POIN */
                    if (score % 1000 === 0) {
                        spawnRewardText();
                    }

                    enemies.splice(ei, 1);
                    bullets.splice(bi, 1);
                }
            });
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Stars */
        ctx.fillStyle = "#0ff";
        stars.forEach(s => ctx.fillRect(s.x, s.y, 2, 2));

        /* Player */
        ctx.drawImage(playerImg, ship.x, ship.y, ship.w, ship.h);

        /* Peluru LOVE */
        ctx.font = "26px Arial";
        ctx.fillStyle = "#ff2ec6";
        bullets.forEach(b => ctx.fillText("💗", b.x, b.y));

        /* Enemies */
        enemies.forEach(e => {
            ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h);
        });
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    loop();
}
