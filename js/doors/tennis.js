/* Tennis gegen Leyla: Pong von oben gesehen. Jan unten (Finger ziehen), Leyla oben. Wer zuerst X Punkte hat. */
(function () {
  ADV.css("ten-css", `
  .ten-photo { width: 120px; margin: 4px auto 0; border: 3px solid var(--ink); border-radius: 14px; overflow: hidden; box-shadow: 3px 4px 0 var(--ink); rotate: -3deg; }
  .ten-photo img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; display: block; }
  .ten-top { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
  .ten-face { flex: none; width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 3px solid var(--ink); box-shadow: 2px 3px 0 var(--ink); }
  .ten-face img { width: 100%; height: 100%; object-fit: cover; }
  .ten-face.mad { animation: tauntWob .45s ease-in-out 2; }
  @keyframes tauntWob { 25% { rotate: -10deg; } 75% { rotate: 10deg; } }
  .ten-say { position: relative; flex: 1; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 8px 11px; box-shadow: 2px 3px 0 var(--ink);
    font-family: var(--display); font-weight: 600; font-size: 16px; line-height: 1.25; min-height: 48px; display: flex; align-items: center; }
  .ten-say::before { content: ""; position: absolute; left: -10px; top: 50%; width: 14px; height: 14px; translate: 0 -50%; rotate: 45deg; background: #fff;
    border-left: 3px solid var(--ink); border-bottom: 3px solid var(--ink); }
  .ten-say.pop { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  .ten-wrap { position: relative; margin-top: 10px; border: 3px solid var(--ink); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); touch-action: none; }
  .ten-wrap canvas { display: block; width: 100%; }
  .ten-score { position: absolute; right: 10px; top: 50%; translate: 0 -50%; display: grid; gap: 6px; text-align: center; font-family: var(--pixel-font); font-size: 10px;
    color: #fff; text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .ten-score b { font-size: 18px; display: block; }
  .ten-over { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(10,36,24,.72); padding: 0 16px; }
  .ten-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .ten-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); text-shadow: none; }
  `);

  window.DOOR_TYPES.tennis = function (el, day, data, api) {
    const WIN = data.points || 5;
    const T = data.taunts || {};
    const pick = a => a[Math.floor(Math.random() * a.length)];
    el.innerHTML = `
      ${data.photo ? `<div class="ten-photo"><img src="${data.photo}" alt=""></div>` : ""}<p class="lead">${data.intro || ""}</p>
      <div class="ten-top"><div class="ten-face"><img src="${data.face}" alt="Leyla"></div><div class="ten-say">${T.start || ""}</div></div>
      <div class="ten-wrap"><canvas></canvas>
        <div class="ten-score"><span>LEYLA<b class="sl">0</b></span><span>JAN<b class="sj">0</b></span></div>
        <div class="ten-over"><p>AUFSCHLAG JAN!</p><div class="how">${data.how || ""}</div><button class="btn ten-go">🎾 Los!</button></div>
      </div>
      <div class="ten-after"></div>`;
    const wrap = el.querySelector(".ten-wrap"), cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const say = el.querySelector(".ten-say"), face = el.querySelector(".ten-face");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    function fit() {
      const vh = (window.visualViewport && visualViewport.height) || innerHeight;
      W = cv.clientWidth; H = Math.round(Math.max(300, Math.min(W * 1.25, vh - 300, 470)));
      cv.style.height = H + "px"; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    fit();
    const PW = () => W * 0.26, PH = 12;
    let jan = { x: 0 }, ley = { x: 0 }, ball = null, sj = 0, sl = 0, running = false, raf = 0, last = 0, serveTo = 1, pause = 0;
    const timers = [];
    const F = data.faces || {};
    const faceImg = face.querySelector("img");
    function setFace(k) { if (F[k]) faceImg.src = F[k]; }
    function talk(t, mad) {
      say.textContent = t; say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop");
      if (mad) { face.classList.remove("mad"); void face.offsetWidth; face.classList.add("mad"); }
    }
    function serve() {
      const sp = H * 0.62; // px pro Sekunde
      const ang = (Math.random() * 0.8 - 0.4);
      ball = { x: W / 2, y: H / 2, vx: Math.sin(ang) * sp, vy: Math.cos(ang) * sp * serveTo, r: 9, speed: sp };
      pause = 0.6;
    }
    function reset() { jan.x = ley.x = W / 2; sj = sl = 0; el.querySelector(".sj").textContent = 0; el.querySelector(".sl").textContent = 0; serveTo = -1; serve(); }

    const move = e => {
      const r = cv.getBoundingClientRect();
      jan.x = Math.max(PW() / 2, Math.min(W - PW() / 2, e.clientX - r.left));
    };
    wrap.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; move(e); try { wrap.setPointerCapture(e.pointerId); } catch (_) {} });
    wrap.addEventListener("pointermove", e => { if (e.buttons || e.pointerType === "touch") move(e); });

    function point(janScored) {
      if (janScored) { sj++; setFace("mad"); talk(pick(T.janPoint || ["Das war im Aus!"]), true); if (navigator.vibrate) navigator.vibrate(30); const r = cv.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + 30, { count: 40, speed: 9, size: 8, life: 70 }); }
      else { sl++; setFace("smug"); talk(pick(T.leylaPoint || ["Ass! 😎"])); if (navigator.vibrate) navigator.vibrate([20, 30, 20]); }
      el.querySelector(".sj").textContent = sj; el.querySelector(".sl").textContent = sl;
      serveTo = janScored ? 1 : -1;
      if (sj >= WIN) return end(true);
      if (sl >= WIN) return end(false);
      serve();
    }
    function end(janWon) {
      running = false; ball = null; draw();
      const o = document.createElement("div"); o.className = "ten-over";
      if (janWon) {
        setFace("wow"); talk(T.final || "Okay... du hast gewonnen. 😤💚", true);
        o.innerHTML = `<p>SPIEL, SATZ<br>UND SIEG JAN!</p>`;
        wrap.appendChild(o);
        ADV.finish(el.querySelector(".ten-after"), day, data, api, { title: "MATCH<br>GEWONNEN!" });
      } else {
        setFace("smug"); talk(T.leylaWins || "Haha! Revanche gefällig? 😎");
        o.innerHTML = `<p>LEYLA GEWINNT<br>${sl}:${sj}</p><button class="btn">🔁 Revanche</button>`;
        o.querySelector("button").addEventListener("click", () => { o.remove(); reset(); running = true; last = performance.now(); raf = requestAnimationFrame(loop); });
        wrap.appendChild(o);
      }
    }
    function step(dt) {
      // Leyla-KI: folgt dem Ball, aber mit begrenzter Geschwindigkeit und kleinem Zielfehler
      const aiSpeed = W * (data.aiSpeed || 0.95);
      const target = ball && ball.vy < 0 ? ball.x + (ley.err || 0) : W / 2;
      const d = target - ley.x;
      ley.x += Math.sign(d) * Math.min(Math.abs(d), aiSpeed * dt);
      ley.x = Math.max(PW() / 2, Math.min(W - PW() / 2, ley.x));
      if (!ball) return;
      if (pause > 0) { pause -= dt; return; }
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.x < ball.r) { ball.x = ball.r; ball.vx *= -1; }
      if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx *= -1; }
      const jy = H - 26, ly = 26;
      const hit = (pad, py, dir) => {
        if (Math.abs(ball.y - py) < PH / 2 + ball.r && Math.abs(ball.x - pad.x) < PW() / 2 + ball.r && Math.sign(ball.vy) === -dir) {
          const off = (ball.x - pad.x) / (PW() / 2); // -1..1
          ball.speed = Math.min(H * 1.5, ball.speed * 1.06);
          const ang = off * 0.95;
          ball.vx = Math.sin(ang) * ball.speed; ball.vy = Math.cos(ang) * ball.speed * dir;
          ball.y = py + dir * (PH / 2 + ball.r + 1);
          if (navigator.vibrate && dir === -1) navigator.vibrate(8);
          ley.err = (Math.random() - 0.5) * PW() * (data.aiError || 1.5);
          return true;
        }
        return false;
      };
      hit(jan, jy, -1); hit(ley, ly, 1);
      if (ball.y > H + 20) point(false);
      else if (ball.y < -20) point(true);
    }
    function draw() {
      ctx.fillStyle = "#2f8f55"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#3aa865"; ctx.fillRect(W * 0.1, 10, W * 0.8, H - 20);
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 3;
      ctx.strokeRect(W * 0.1, 10, W * 0.8, H - 20);
      ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.25); ctx.lineTo(W * 0.5, H * 0.75);
      ctx.moveTo(W * 0.1, H * 0.25); ctx.lineTo(W * 0.9, H * 0.25); ctx.moveTo(W * 0.1, H * 0.75); ctx.lineTo(W * 0.9, H * 0.75); ctx.stroke();
      // Netz
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke(); ctx.setLineDash([]);
      // Schläger
      const pad = (x, y, c) => { ctx.fillStyle = c; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - PW() / 2, y - PH / 2, PW(), PH, 6); ctx.fill(); ctx.stroke(); };
      pad(ley.x, 26, "#e8414a"); pad(jan.x, H - 26, "#c9f07a");
      if (ball) {
        ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.arc(ball.x + 3, ball.y + 4, ball.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#e6f53b"; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ball.x - 4, ball.y, ball.r * .8, -1, 1); ctx.stroke();
      }
    }
    function loop(now) {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      if (running) step(dt);
      draw();
      if (running) raf = requestAnimationFrame(loop);
    }
    cv.__st = () => ({ ball, jan, ley, W, H }); // nur für automatische Tests
    reset(); ball = null; draw();
    el.querySelector(".ten-go").addEventListener("click", e => {
      e.stopPropagation(); e.currentTarget.parentElement.remove();
      reset(); running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    });
    return () => { running = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  };
})();
