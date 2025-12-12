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

    const PLAYER_SCALE = 1.35;
    const ENEMY_SCALE  = 1.25;

    let ship = { x: 230, y: 620, w: 0, h: 0 };
    let bullets = [];
    let enemies = [];
    let stars = [];
    let keys = {};
    let shootPressed = false;
    let score = 0;

    /* Starfield */
    for (let i = 0; i < 120; i++) {
        stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.5 + Math.random() * 1.5 });
    }

    /* Controls */
    document.addEventListener("keydown", e => keys[e.key] = true);
    document.addEventListener("keyup", e => keys[e.key] = false);

    document.getElementById("leftBtn").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
    document.getElementById("leftBtn").addEventListener("touchend", () => keys["ArrowLeft"] = false);
    document.getElementById("rightBtn").addEventListener("touchstart", () => keys["ArrowRight"] = true);
    document.getElementById("rightBtn").addEventListener("touchend", () => keys["ArrowRight"] = false);
    document.getElementById("shootBtn").addEventListener("touchstart", () => shootPressed = true);
    document.getElementById("shootBtn").addEventListener("touchend", () => shootPressed = false);

    /* Shooting LOVE */
    setInterval(() => {
        if (shootPressed || keys[" "]) {
            bullets.push({ x: ship.x + ship.w/2 - 10, y: ship.y - 10, w: 20, h: 20 });
        }
    }, 200);

    /* Enemy spawn */
    setInterval(() => {
        if (enemyImg.complete) {
            enemies.push({ x: Math.random() * (canvas.width - enemyImg.width * ENEMY_SCALE), y: -80, w: enemyImg.width * ENEMY_SCALE, h: enemyImg.height * ENEMY_SCALE, speed: 2 + Math.random() * 2 });
        }
    }, 900);

    /* Hit effect */
    function spawnHitText(x, y) {
        const txt = document.createElement("div");
        txt.className = "hitText";
        txt.innerText = "AWWW!";
        txt.style.left = (canvas.offsetLeft + x) + "px";
        txt.style.top = (canvas.offsetTop + y) + "px";
        document.body.appendChild(txt);
        setTimeout(() => txt.remove(), 600);
    }

    /* Reward effect */
    function spawnRewardText() {
        const txt = document.createElement("div");
        txt.className = "rewardText";
        txt.innerText = "AKU SAYANG BEBEB!!! ❤️";
        txt.style.left = "50%";
        txt.style.top = "40%";
        document.body.appendChild(txt);
        setTimeout(() => txt.remove(), 1500);
    }

    /* Double-tap zoom prevent */
    let lastTouch = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouch <= 300) event.preventDefault();
        lastTouch = now;
    }, false);

    /* GAME LOOP */
    function update() {
        if (playerImg.complete && ship.w === 0) {
            ship.w = playerImg.width * PLAYER_SCALE;
            ship.h = playerImg.height * PLAYER_SCALE;
        }

        stars.forEach(s => { s.y += s.speed; if (s.y > canvas.height) { s.y = -5; s.x = Math.random() * canvas.width; } });

        if (keys["ArrowLeft"] && ship.x > 0) ship.x -= 5;
        if (keys["ArrowRight"] && ship.x < canvas.width - ship.w) ship.x += 5;

        bullets.forEach(b => b.y -= 8);
        enemies.forEach(e => e.y += e.speed);

        bullets.forEach((b, bi) => {
            enemies.forEach((e, ei) => {
                if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                    spawnHitText(e.x + e.w/2, e.y + e.h/2);
                    score += 100;
                    document.getElementById("scoreDisplay").innerText = "Score: " + score;
                    if (score % 1000 === 0) spawnRewardText();
                    enemies.splice(ei,1);
                    bullets.splice(bi,1);
                }
            });
        });
    }

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#0ff";
        stars.forEach(s => ctx.fillRect(s.x,s.y,2,2));
        ctx.drawImage(playerImg, ship.x, ship.y, ship.w, ship.h);
        ctx.font = "26px Arial"; ctx.fillStyle = "#ff2ec6";
        bullets.forEach(b => ctx.fillText("💗", b.x, b.y));
        enemies.forEach(e => ctx.drawImage(enemyImg, e.x, e.y, e.w, e.h));
    }

    function loop() { update(); draw(); requestAnimationFrame(loop); }
    loop();
}
