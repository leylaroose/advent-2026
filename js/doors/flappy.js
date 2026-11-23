/* Flappy Rentier: Tippen = flattern, durch die Lücken zwischen den Schornsteinen fliegen. */
(function () {
  ADV.css("flp-css", `
  .flp-wrap { position: relative; margin-top: 8px; border: 3px solid var(--ink); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .flp-wrap canvas { display: block; width: 100%; }
  .flp-hud { position: absolute; left: 0; right: 0; top: 10px; text-align: center; font-family: var(--pixel-font); font-size: 14px; color: #fff; text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .flp-over { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(10,26,40,.7); padding: 0 16px; }
  .flp-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: #fff; text-shadow: 2px 2px 0 #000; }
  .flp-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); }
  `);

  window.DOOR_TYPES.flappy = function (el, day, data, api) {
    const GOAL = data.goal || 10;
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
    let bird, pipes, score, running = false, raf = 0, last = 0, t = 0, started = false;
    const GAP = () => H * 0.34, PWD = 58, SPEED = W * 0.42;
    const stars = Array.from({ length: 40 }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.7, r: Math.random() * 1.5 + .4 }));
    function reset() { bird = { y: H * 0.45, vy: 0 }; pipes = []; score = 0; t = 0; started = false; hud(); }
    const hud = () => { el.querySelector(".flp-hud").textContent = `🏠 ${score}/${GOAL}`; };
    function flap() { if (!running) return; started = true; bird.vy = -H * 0.95; if (navigator.vibrate) navigator.vibrate(6); }
    wrap.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; e.preventDefault(); flap(); });
    function addPipe() { const m = H * 0.12 + Math.random() * (H * 0.76 - GAP()); pipes.push({ x: W + 20, top: m, passed: false }); }
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
        const bx = W * 0.28, r = 15;
        const hit = bird.y > H - 22 || bird.y < 0 || pipes.some(p => bx + r > p.x && bx - r < p.x + PWD && (bird.y - r < p.top || bird.y + r > p.top + GAP()));
        if (hit && running) crash();
      } else if (running) bird.y = H * 0.45 + Math.sin(t * 4) * 8;
      draw();
      if (running) raf = requestAnimationFrame(loop);
    }
    function draw() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0b1f33"); g.addColorStop(1, "#1d4b5f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff"; stars.forEach(s => { ctx.globalAlpha = .5 + .5 * Math.abs(Math.sin(t * 2 + s.x)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff8c9"; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.15, 26, 0, Math.PI * 2); ctx.fill();
      (pipes || []).forEach(p => {
        const draw1 = (y, h, top) => {
          ctx.fillStyle = "#a8432f"; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
          ctx.fillRect(p.x, y, PWD, h); ctx.strokeRect(p.x, y, PWD, h);
          ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1.5;
          for (let yy = y + 10; yy < y + h; yy += 14) { ctx.beginPath(); ctx.moveTo(p.x, yy); ctx.lineTo(p.x + PWD, yy); ctx.stroke(); }
          ctx.fillStyle = "#fff"; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
          const cy = top ? y + h - 14 : y; ctx.beginPath(); ctx.roundRect(p.x - 6, cy, PWD + 12, 14, 6); ctx.fill(); ctx.stroke();
        };
        draw1(0, p.top, true); draw1(p.top + GAP(), H - p.top - GAP(), false);
      });
      ctx.fillStyle = "#e9f7ff"; ctx.fillRect(0, H - 18, W, 18);
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
