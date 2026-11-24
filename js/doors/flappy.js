/* Flappy Rentier: Tippen = flattern, durch die Lücken zwischen den Schornsteinen fliegen. */
(function () {
  ADV.css("flp-css", `
  .flp-wrap { position: relative; margin-top: 8px; border: 3px solid var(--ink); border-radius: 16px; overflow: hidden; box-shadow: none; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .flp-wrap canvas { display: block; width: 100%; }
  .flp-hud { position: absolute; left: 0; right: 0; top: 10px; text-align: center; font-family: var(--pixel-font); font-size: 14px; color: #fff; text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .flp-over { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(10,26,40,.7); padding: 0 16px; }
  .flp-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: #fff; text-shadow: 2px 2px 0 #000; }
  .flp-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); }
  `);

  window.DOOR_TYPES.flappy = function (el, day, data, api) {
    const GOAL = data.goal || 7;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="flp-wrap"><canvas></canvas><div class="flp-hud">🏠 0/${GOAL}</div>
        <div class="flp-over"><p>FLIEG, RENTIER, FLIEG!</p><div class="how">${data.how || ""}</div><button class="btn flp-go">🦌 Abheben!</button></div></div>
      <div class="flp-after"></div>`;
    const wrap = el.querySelector(".flp-wrap"), cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    const vh = (window.visualViewport && visualViewport.height) || innerHeight;
    const W = cv.clientWidth, H = Math.round(Math.max(320, Math.min(W * 1.3, vh - 300, 480)));
    cv.style.height = H + "px"; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    let drawn = false, bird, pipes, score, running = false, raf = 0, last = 0, t = 0, started = false;
    const GAP = () => H * 0.36, PWD = 64, SPEED = W * 0.40;
    const stars = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.5 + .4 }));
    function reset() { bird = { y: H * 0.45, vy: 0 }; pipes = []; score = 0; t = 0; started = false; hud(); }
    const hud = () => { el.querySelector(".flp-hud").textContent = `🏠 ${score}/${GOAL}`; };
    function flap() { if (!running) return; started = true; bird.vy = -H * 0.95; if (navigator.vibrate) navigator.vibrate(6); }
    wrap.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; e.preventDefault(); flap(); });
    function addPipe() {
      const lo = H * 0.12, hi = H * 0.88 - GAP(), prev = pipes.length ? pipes[pipes.length - 1].top : (lo + hi) / 2;
      let m, n = 0; do { m = lo + Math.random() * (hi - lo); } while (Math.abs(m - prev) < H * 0.16 && ++n < 20); // immer deutlich andere Höhe
      pipes.push({ x: W + 20, top: m, passed: false });
    }
    function loop(now) {
      const dt = Math.min(0.033, (now - last) / 1000); last = now; t += dt;
      if (running && started) {
        bird.vy += H * 2.6 * dt; bird.y += bird.vy * dt;
        if (!pipes.length || pipes[pipes.length - 1].x < W - W * 0.62) addPipe();
        pipes.forEach(p => {
          p.x -= SPEED * dt;
          if (!p.passed && p.x + PWD < W * 0.28) { p.passed = true; score++; hud(); if (navigator.vibrate) navigator.vibrate(12); if (score >= GOAL) return win(); }
        });
        pipes = pipes.filter(p => p.x > -PWD - 10);
        const bx = W * 0.28, r = 11, inset = 6; // großzügige Trefferfläche
        const hit = bird.y > H - 6 || pipes.some(p => bx + r > p.x + inset && bx - r < p.x + PWD - inset && (bird.y - r < p.top - 4 || bird.y + r > p.top + GAP() + 10));
        if (bird.y < 12) { bird.y = 12; bird.vy = Math.max(0, bird.vy); }
        if (hit && running) crash();
      } else if (running) bird.y = H * 0.45 + Math.sin(t * 4) * 8;
      draw();
      if (running && !started) { ctx.font = "bold 18px Fredoka, sans-serif"; ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText("👆 Einmal tippen zum Starten", W / 2, H * 0.68); }
      if (running) raf = requestAnimationFrame(loop);
    }
    function draw() {
      drawn = true;
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0b1f33"); g.addColorStop(1, "#1d4b5f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff"; stars.forEach(s => { ctx.globalAlpha = .5 + .5 * Math.abs(Math.sin(t * 2 + s.x)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff8c9"; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.15, 26, 0, Math.PI * 2); ctx.fill();
      (pipes || []).forEach(p => {
        // oben: hängende Tannengirlande mit Kugeln
        const gx = p.x + PWD / 2, gb = p.top - 6;
        ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
        ctx.fillStyle = "#1f7a4c"; ctx.fillRect(p.x + 10, 0, PWD - 20, gb); ctx.strokeRect(p.x + 10, -3, PWD - 20, gb + 3);
        ctx.fillStyle = "#2f9e5b";
        for (let yy = 6; yy < gb; yy += 14) { ctx.beginPath(); ctx.moveTo(p.x + 6, yy + 10); ctx.lineTo(gx, yy - 2); ctx.lineTo(p.x + PWD - 6, yy + 10); ctx.closePath(); ctx.fill(); ctx.stroke(); }
        [["#e8414a", -14], ["#ffc83d", 0], ["#7fd7ff", 14]].forEach(([c, dx], i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(gx + dx, gb - 2 + (i % 2) * 6, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); });
        // unten: Haus mit verschneitem Dach
        const hy = p.top + GAP(), roof = 30;
        ctx.fillStyle = "#c9623f"; ctx.fillRect(p.x + 4, hy + roof, PWD - 8, H - hy - roof); ctx.strokeRect(p.x + 4, hy + roof, PWD - 8, H - hy - roof);
        ctx.fillStyle = "#e8414a"; ctx.beginPath(); ctx.moveTo(p.x - 6, hy + roof + 2); ctx.lineTo(p.x + PWD / 2, hy); ctx.lineTo(p.x + PWD + 6, hy + roof + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(p.x - 2, hy + roof - 4); ctx.lineTo(p.x + PWD / 2, hy + 2); ctx.lineTo(p.x + PWD + 2, hy + roof - 4); ctx.lineTo(p.x + PWD - 10, hy + roof - 8); ctx.lineTo(p.x + PWD / 2, hy + 10); ctx.lineTo(p.x + 10, hy + roof - 8); ctx.closePath(); ctx.fill();
        for (let wy = hy + roof + 14; wy < H - 20; wy += 34) { ctx.fillStyle = "#ffd970"; ctx.fillRect(p.x + 14, wy, 14, 14); ctx.fillRect(p.x + PWD - 28, wy, 14, 14); ctx.strokeRect(p.x + 14, wy, 14, 14); ctx.strokeRect(p.x + PWD - 28, wy, 14, 14); }
      });
      if (bird) { ctx.save(); ctx.translate(W * 0.28, bird.y); ctx.rotate(Math.max(-0.5, Math.min(0.9, (bird.vy || 0) / (H * 1.6)))); ctx.scale(-1, 1);
        ctx.font = "36px system-ui, Apple Color Emoji, Segoe UI Emoji"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🦌", 0, 0);
        ctx.fillStyle = "#e8414a"; ctx.beginPath(); ctx.arc(-15, 2, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    }
    function crash() {
      running = false; if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      const o = document.createElement("div"); o.className = "flp-over";
      o.innerHTML = `<p>AUTSCH! 🦌💫<br>🏠 ${score}/${GOAL}</p><button class="btn">🔁 Nochmal</button>`;
      o.querySelector("button").addEventListener("click", e => { e.stopPropagation(); o.remove(); reset(); running = true; last = performance.now(); raf = requestAnimationFrame(loop); });
      wrap.appendChild(o);
    }
    function win() {
      running = false; ADV.celebrate(wrap);
      ADV.finish(el.querySelector(".flp-after"), day, data, api, { title: data.endTitle || "SICHER<br>GELANDET!" });
    }
    cv.__st = () => ({ bird, pipes, H, W, GAP: GAP() }); // nur für automatische Tests
    reset(); draw();
    el.querySelector(".flp-go").addEventListener("click", e => { e.stopPropagation(); e.currentTarget.parentElement.remove(); running = true; last = performance.now(); raf = requestAnimationFrame(loop); });
    return () => { running = false; cancelAnimationFrame(raf); };
  };
})();
