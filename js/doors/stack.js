/* Geschenke stapeln: Ein Geschenk schwingt am Haken, Tippen lässt es fallen. Turm aus X Geschenken bauen. */
(function () {
  ADV.css("stk-css", `
  .stk-wrap { position: relative; margin-top: 8px; border: 3px solid var(--ink); border-radius: 16px; overflow: hidden; box-shadow: none; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .stk-wrap canvas { display: block; width: 100%; }
  .stk-hud { position: absolute; left: 10px; right: 10px; top: 8px; display: flex; justify-content: space-between; font-family: var(--pixel-font); font-size: 10px; color: var(--ink); pointer-events: none; }
  .stk-over { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(10,36,24,.72); padding: 0 16px; }
  .stk-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .stk-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); }
  `);
  const COLORS = [["#e8414a", "#fff5df"], ["#2f9e5b", "#ffc83d"], ["#ffc83d", "#e8414a"], ["#a6e8bf", "#13573a"], ["#c9f07a", "#e8414a"], ["#fff5df", "#2f9e5b"], ["#13573a", "#ffc83d"]];

  window.DOOR_TYPES.stack = function (el, day, data, api) {
    const GOAL = data.goal || 8;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="stk-wrap"><canvas></canvas><div class="stk-hud"><span class="stk-n">🎁 0/${GOAL}</span><span class="stk-l"></span></div>
        <div class="stk-over"><p>DER GESCHENKE-TURM</p><div class="how">${data.how || ""}</div><button class="btn stk-go">🎁 Los!</button></div></div>
      <div class="stk-after"></div>`;
    const wrap = el.querySelector(".stk-wrap"), cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const vh = (window.visualViewport && visualViewport.height) || innerHeight;
    W = cv.clientWidth; H = Math.round(Math.max(320, Math.min(W * 1.3, vh - 300, 480)));
    cv.style.height = H + "px"; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const LIVES = data.lives || 3;
    let tower, cur, falling, lives, running = false, raf = 0, last = 0, t = 0, cam = 0, camT = 0;
    const BW = () => W * 0.34, BH = 34;
    function newGift() { cur = { w: BW() * (0.8 + Math.random() * 0.3), c: COLORS[Math.floor(Math.random() * COLORS.length)], phase: Math.random() * 6 }; }
    function start() {
      tower = [{ x: W / 2, w: BW() * 1.2, y: H - 20 - BH / 2, c: ["#c98b4a", "#7a4a21"], base: true }];
      lives = LIVES; falling = null; cam = camT = 0; newGift(); hud();
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    }
    const hud = () => { el.querySelector(".stk-n").textContent = `🎁 ${tower.length - 1}/${GOAL}`; el.querySelector(".stk-l").textContent = "❤️".repeat(lives) + "🖤".repeat(LIVES - lives); };
    const hookX = () => W / 2 + Math.sin(t * (1.6 + (tower.length - 1) * 0.12) + cur.phase) * (W * 0.34);
    wrap.addEventListener("pointerdown", e => {
      if (!running || falling || e.target.closest("button")) return;
      falling = { x: hookX(), y: 70 - cam, w: cur.w, c: cur.c, vy: 0 };
      if (navigator.vibrate) navigator.vibrate(8);
    });
    function drawGift(x, y, w, c, rot = 0) {
      ctx.save(); ctx.translate(x, y + cam); ctx.rotate(rot);
      ctx.fillStyle = c[0]; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(-w / 2, -BH / 2, w, BH, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = c[1]; ctx.fillRect(-5, -BH / 2 + 1.5, 10, BH - 3); ctx.strokeRect(-5, -BH / 2 + 1.5, 10, BH - 3);
      ctx.beginPath(); ctx.ellipse(-8, -BH / 2 - 4, 8, 5, -0.4, 0, Math.PI * 2); ctx.ellipse(8, -BH / 2 - 4, 8, 5, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    function loop(now) {
      const dt = Math.min(0.033, (now - last) / 1000); last = now; t += dt;
      cam += (camT - cam) * Math.min(1, dt * 5);
      if (falling) {
        falling.vy += 1400 * dt; falling.y += falling.vy * dt;
        const top = tower[tower.length - 1];
        if (falling.y + BH / 2 >= top.y - BH / 2) {
          const overlap = Math.min(falling.x + falling.w / 2, top.x + top.w / 2) - Math.max(falling.x - falling.w / 2, top.x - top.w / 2);
          if (overlap > Math.min(falling.w, top.w) * 0.35) {
            tower.push({ x: falling.x, w: falling.w, y: top.y - BH, c: falling.c });
            if (navigator.vibrate) navigator.vibrate(15);
            const r = cv.getBoundingClientRect(); FX.burst(r.left + falling.x, r.top + top.y - BH + cam, { count: 16, speed: 6, size: 7, life: 50 });
            const hTop = tower[tower.length - 1].y;
            if (hTop + camT < H * 0.45) camT = H * 0.45 - hTop;
            falling = null; hud();
            if (tower.length - 1 >= GOAL) return win();
            newGift();
          } else {
            falling.miss = true;
          }
        }
        if (falling && falling.miss && falling.y + cam > H + 40) {
          lives--; falling = null; hud(); wrap.animate([{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 250 });
          if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
          if (lives <= 0) return lose();
          newGift();
        }
      }
      draw();
      if (running) raf = requestAnimationFrame(loop);
    }
    function draw() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#bfeccf"); g.addColorStop(1, "#fff5df");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.7)";
      for (let i = 0; i < 30; i++) { const x = (i * 97) % W, y = ((i * 61 + t * 30 * (1 + i % 3)) % H); ctx.beginPath(); ctx.arc(x, y, 2 + i % 3, 0, Math.PI * 2); ctx.fill(); }
      if (tower) tower.forEach(b => b.base ? (ctx.fillStyle = "#7a4a21", ctx.fillRect(b.x - b.w / 2, b.y - BH / 2 + cam, b.w, BH + 40)) : drawGift(b.x, b.y, b.w, b.c));
      if (running && !falling && cur) {
        const x = hookX();
        ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(x, 50); ctx.stroke();
        drawGift(x, 70 - cam, cur.w, cur.c, (x - W / 2) / W * 0.4);
      }
      if (falling) drawGift(falling.x, falling.y, falling.w, falling.c, falling.miss ? falling.vy / 900 : 0);
    }
    function win() {
      running = false; draw();
      const o = document.createElement("div"); o.className = "stk-over"; o.innerHTML = `<p>${GOAL} GESCHENKE<br>HOCH! 🎄</p>`; wrap.appendChild(o);
      ADV.finish(el.querySelector(".stk-after"), day, data, api, { title: data.endTitle || "TURM<br>GEBAUT!" });
    }
    function lose() {
      running = false; draw();
      const o = document.createElement("div"); o.className = "stk-over";
      o.innerHTML = `<p>DER TURM WACKELT...<br>🎁 ${tower.length - 1}/${GOAL}</p><button class="btn">🔁 Nochmal</button>`;
      o.querySelector("button").addEventListener("click", () => { o.remove(); start(); }); wrap.appendChild(o);
    }
    cv.__st = () => ({ cur, tower, falling, hookX: running && cur ? hookX() : null }); // nur für automatische Tests
    tower = null; draw();
    el.querySelector(".stk-go").addEventListener("click", e => { e.stopPropagation(); e.currentTarget.parentElement.remove(); start(); });
    return () => { running = false; cancelAnimationFrame(raf); };
  };
})();
