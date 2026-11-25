/* Finale: Weihnachts-Hüpfspiel. Hochspringen bis ganz oben, dort wartet Grinch-Leyla mit dem Türchen-Sack.
   Steuerung: Finger ziehen (oder Handy neigen). Boss von unten anspringen = Treffer. Socken ausweichen. */
(function () {
  ADV.css("dj-css", `
  .dj-wrap { position: relative; margin-top: 8px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .dj-wrap canvas { display: block; width: 100%; }
  .dj-hud { position: absolute; left: 10px; right: 10px; top: 8px; z-index: 5; display: flex; justify-content: space-between; align-items: center; font-family: var(--pixel-font); font-size: 10px; color: #fff; text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .dj-hud .l { font-family: system-ui; font-size: 13px; }
  .dj-meter { position: absolute; right: 8px; top: 30px; bottom: 12px; width: 10px; z-index: 5; border: 2px solid #000; border-radius: 6px; background: rgba(255,255,255,.25); overflow: hidden; pointer-events: none; }
  .dj-meter i { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: linear-gradient(var(--gold), var(--lime)); }
  .dj-boss { position: absolute; left: 0; top: 0; width: 78px; height: 78px; z-index: 4; pointer-events: none; display: none; }
  .dj-boss img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--ink); filter: sepia(1) hue-rotate(55deg) saturate(3) brightness(.95); }
  .dj-boss.free img { filter: none; }
  .dj-boss .hat { position: absolute; left: 26px; top: -22px; width: 62px; rotate: 22deg; }
  .dj-boss .sack { position: absolute; right: -14px; bottom: -6px; font-size: 30px; }
  .dj-boss.hit img { animation: djFlash .2s; }
  @keyframes djFlash { 50% { filter: brightness(3); transform: scale(.85); } }
  .dj-bhp { position: absolute; left: 50%; bottom: 8px; translate: -50% 0; z-index: 5; display: none; font-family: var(--pixel-font); font-size: 10px; color: #fff; text-shadow: 2px 2px 0 #000; pointer-events: none; white-space: nowrap; }
  .dj-over { position: absolute; inset: 0; z-index: 7; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(5,20,30,.78); padding: 0 16px; }
  .dj-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .dj-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; line-height: 1.45; color: var(--cream); }
  .dj-say { background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 8px 11px; font-family: var(--display); font-weight: 600; font-size: 16px; min-height: 44px; margin-top: 4px; }
  .dj-say.pop { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  `);
  const HAT = `<svg class="hat" viewBox="0 0 100 80"><path d="M8 62 C20 20 60 0 86 18 C74 22 66 34 64 50 Z" fill="#e8414a" stroke="#0a2418" stroke-width="5" stroke-linejoin="round"/><rect x="2" y="54" width="70" height="18" rx="9" fill="#fff" stroke="#0a2418" stroke-width="5"/><circle cx="88" cy="18" r="10" fill="#fff" stroke="#0a2418" stroke-width="5"/></svg>`;

  window.DOOR_TYPES.jump = function (el, day, data, api) {
    const T = data.taunts || {};
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const BOSS_HP = data.bossHp || 5, LIVES = data.lives || 3;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="dj-say">${T.start || ""}</div>
      <div class="dj-wrap"><canvas></canvas>
        <div class="dj-hud"><span class="dj-txt">⬆ 0 %</span><span class="l dj-lives"></span></div>
        <div class="dj-meter"><i></i></div>
        <div class="dj-bhp"></div>
        <div class="dj-boss"><img src="${data.face}" alt="">${HAT}<span class="sack">💰</span></div>
        <div class="dj-over"><p>AB NACH OBEN!</p><div class="how">${data.how || ""}</div><button class="btn dj-go">🎄 Los!</button></div>
      </div>
      <div class="dj-after"></div>`;
    const wrap = el.querySelector(".dj-wrap"), cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const bossEl = el.querySelector(".dj-boss"), say = el.querySelector(".dj-say");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    const vh = (window.visualViewport && visualViewport.height) || innerHeight;
    const sh = el.closest(".sheet");
    const slide = sh ? new DOMMatrix(getComputedStyle(sh).transform).m42 : 0;
    const topY = cv.getBoundingClientRect().top - slide;
    const W = cv.clientWidth, H = Math.round(Math.max(360, Math.min(W * 1.5, vh - topY - 18, 560)));
    cv.style.height = H + "px"; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const G = H * 2.6, JUMP = H * 1.28, PW = 70, PH = 14, R = 17;
    const CLIMB = H * (data.climbScreens || 7);
    const janImg = new Image(); janImg.src = data.player || "";
    const talk = t => { say.textContent = t; say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop"); };
    const rnd = (a, b) => a + Math.random() * (b - a);
    let p, plats, socks, camY, lives, running = false, raf = 0, last = 0, phase = "climb", boss, startY, best, fingerX = null, tilt = null, sockT = 0, inv = 0, t = 0;
    const stars = Array.from({ length: 50 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .4 }));

    function genClimb() {
      plats = [{ x: W / 2 - 60, y: H - 30, w: 120, type: "n" }];
      let y = H - 30;
      while (y > -CLIMB) {
        y -= rnd(H * 0.1, H * 0.2);
        const prog = (H - 30 - y) / CLIMB;
        const type = Math.random() < 0.08 ? "spring" : prog > 0.3 && Math.random() < 0.3 ? "move" : "n";
        plats.push({ x: rnd(8, W - PW - 8), y, w: PW, type, dx: type === "move" ? (Math.random() < .5 ? -1 : 1) * W * rnd(.18, .3) : 0 });
        // ab und zu eine zerbrechliche Eisplatte als Bonus (nicht nötig zum Weiterkommen)
        if (prog > 0.45 && Math.random() < 0.25) plats.push({ x: rnd(8, W - PW - 8), y: y - rnd(10, H * 0.06), w: PW, type: "ice" });
      }
    }
    function genArena() {
      const top = camY;
      plats = plats.filter(q => q.y > top + H * 0.72 && q.y < top + H);
      for (let i = 0; i < 3; i++) {
        const y = top + H * (0.8 - i * 0.15);
        plats.push({ x: rnd(8, W - PW - 8), y, w: PW + 10, type: i % 2 ? "move" : "n", dx: W * 0.22 * (i % 2 ? 1 : -1) });
      }
      plats.push({ x: W / 2 - 70, y: top + H - 20, w: 140, type: "n", floor: true });
    }
    function reset() {
      p = { x: W / 2, y: H - 30 - R, vx: 0, vy: -JUMP };
      camY = 0; startY = p.y; best = 0; socks = []; lives = LIVES; phase = "climb"; boss = null; inv = 0; t = 0;
      genClimb(); hud();
      bossEl.style.display = "none"; el.querySelector(".dj-bhp").style.display = "none";
    }
    const hud = () => {
      el.querySelector(".dj-lives").textContent = "❤️".repeat(lives) + "🖤".repeat(LIVES - lives);
      if (phase === "climb") { const pr = Math.min(1, best / CLIMB); el.querySelector(".dj-txt").textContent = `⬆ ${Math.round(pr * 100)} %`; el.querySelector(".dj-meter i").style.height = pr * 100 + "%"; }
      else { el.querySelector(".dj-txt").textContent = "BOSS!"; el.querySelector(".dj-bhp").textContent = "GRINCH-LEYLA " + "💚".repeat(boss.hp) + "🖤".repeat(BOSS_HP - boss.hp); }
    };

    // Steuerung: Finger irgendwo ziehen, Figur folgt horizontal
    const setFinger = e => { const r = cv.getBoundingClientRect(); fingerX = e.clientX - r.left; };
    wrap.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; setFinger(e); try { wrap.setPointerCapture(e.pointerId); } catch (_) {} });
    wrap.addEventListener("pointermove", e => { if (fingerX !== null || e.pointerType === "touch") setFinger(e); });
    ["pointerup", "pointercancel"].forEach(ev => wrap.addEventListener(ev, () => { fingerX = null; }));
    const onTilt = e => { if (e.gamma != null) tilt = e.gamma; };

    function loseLife() {
      lives--; inv = 1.2; hud();
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
      wrap.animate([{ transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 250 });
      if (lives <= 0) return over();
      // auf sicherer Plattform weiter
      const safe = plats.filter(q => q.type !== "ice" && q.y - camY > H * 0.5 && q.y - camY < H - 10).sort((a, b) => b.y - a.y)[0];
      if (safe) { p.x = safe.x + safe.w / 2; p.y = safe.y - R; } else { p.y = camY + H - 60; }
      p.vy = -JUMP;
    }
    function step(dt) {
      t += dt;
      // horizontal
      if (fingerX !== null) p.x += (fingerX - p.x) * Math.min(1, dt * 12);
      else if (tilt !== null) p.x += Math.max(-35, Math.min(35, tilt)) / 35 * W * 1.3 * dt;
      if (p.x < -R) p.x = W + R; if (p.x > W + R) p.x = -R;
      // vertikal
      const prevY = p.y;
      p.vy += G * dt; p.y += p.vy * dt;
      for (const q of plats) {
        if (q.type === "move") { q.x += q.dx * dt; if (q.x < 6 || q.x > W - q.w - 6) { q.dx *= -1; q.x = Math.max(6, Math.min(W - q.w - 6, q.x)); } }
        if (q.gone) continue;
        if (p.vy > 0 && prevY + R <= q.y + 2 && p.y + R >= q.y && p.x > q.x - 8 && p.x < q.x + q.w + 8) {
          if (q.type === "ice") { q.gone = true; q.fall = 0; continue; }
          p.y = q.y - R; p.vy = q.type === "spring" ? -JUMP * 1.6 : -JUMP;
          if (navigator.vibrate) navigator.vibrate(q.type === "spring" ? 25 : 6);
        }
      }
      plats.forEach(q => { if (q.gone) q.fall += dt; });
      if (phase === "climb") {
        if (p.y - camY < H * 0.42) camY = p.y - H * 0.42;
        best = Math.max(best, startY - p.y); hud();
        plats = plats.filter(q => q.y - camY < H + 40 && !(q.gone && q.fall > 1));
        if (best >= CLIMB) startBoss();
      } else bossStep(dt);
      if (inv > 0) inv -= dt;
      if (p.y - camY > H + 30) loseLife();
    }
    function startBoss() {
      phase = "boss"; genArena();
      boss = { x: W / 2, y: camY + H * 0.27, hp: BOSS_HP, dir: 1, sp: W * 0.28 };
      bossEl.style.display = "block"; el.querySelector(".dj-bhp").style.display = "block";
      talk(T.boss || "Da bist du ja endlich! 😈");
      hud(); sockT = 1.2;
      if (navigator.vibrate) navigator.vibrate([80, 40, 120]);
    }
    function bossStep(dt) {
      boss.x += boss.dir * boss.sp * dt;
      if (boss.x < 50 || boss.x > W - 50) { boss.dir *= -1; boss.x = Math.max(50, Math.min(W - 50, boss.x)); }
      // Socken werfen
      sockT -= dt;
      if (sockT <= 0) {
        const n = boss.hp <= 2 ? 3 : boss.hp <= 3 ? 2 : 1;
        for (let i = 0; i < n; i++) socks.push({ x: boss.x + (i - (n - 1) / 2) * 50, y: boss.y + 30, vy: H * 0.35, vx: (i - (n - 1) / 2) * W * 0.12 });
        sockT = boss.hp <= 2 ? 1.3 : 1.7;
      }
      socks.forEach(s => { s.y += s.vy * dt; s.x += s.vx * dt; });
      socks = socks.filter(s => {
        if (inv <= 0 && Math.hypot(s.x - p.x, s.y - p.y) < R + 14) { loseLife(); talk(pick(T.sockHit || ["Socken-Treffer! 😎"])); return false; }
        return s.y - camY < H + 30;
      });
      // Treffer: von unten in Leyla springen
      if (p.vy < 0 && Math.hypot(boss.x - p.x, boss.y - p.y) < 39 + R) {
        boss.hp--; p.vy = JUMP * 0.4; hud();
        bossEl.classList.remove("hit"); void bossEl.offsetWidth; bossEl.classList.add("hit");
        const r = cv.getBoundingClientRect(); FX.burst(r.left + boss.x, r.top + boss.y - camY, { count: 30, speed: 9, size: 8, life: 60 });
        if (navigator.vibrate) navigator.vibrate(30);
        boss.sp *= 1.18; boss.dir = p.x < boss.x ? 1 : -1;
        if (boss.hp <= 0) return win();
        talk(pick(T.hit || ["Au! 😤"]));
      }
    }
    function draw() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0b1f33"); g.addColorStop(1, "#1d4b5f");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      stars.forEach(s => { const y = ((s.y - camY * 0.15) % H + H) % H; ctx.globalAlpha = .5 + .5 * Math.abs(Math.sin(t * 2 + s.x)); ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const q of plats) {
        const y = q.y - camY + (q.gone ? q.fall * q.fall * 400 : 0);
        if (y < -30 || y > H + 30) continue;
        ctx.globalAlpha = q.gone ? Math.max(0, 1 - q.fall * 1.5) : 1;
        ctx.fillStyle = q.type === "ice" ? "#bfe3f5" : q.type === "move" ? "#c9623f" : "#7a4a21";
        ctx.beginPath(); ctx.roundRect(q.x, y, q.w, PH, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(q.x - 2, y - 5, q.w + 4, 8, 5); ctx.fill(); ctx.stroke();
        if (q.type === "spring") { ctx.font = "24px system-ui, Apple Color Emoji, Segoe UI Emoji"; ctx.fillText("🎁", q.x + q.w / 2, y - 16); }
        ctx.globalAlpha = 1;
      }
      ctx.font = "26px system-ui, Apple Color Emoji, Segoe UI Emoji";
      socks.forEach(s => ctx.fillText("🧦", s.x, s.y - camY));
      // Jan
      ctx.save(); ctx.translate(p.x, p.y - camY);
      if (inv > 0 && Math.floor(inv * 10) % 2) ctx.globalAlpha = .35;
      if (janImg.complete && janImg.naturalWidth) {
        // Körper: grüner Pulli + Beine, die beim Springen mitwippen
        const leg = Math.max(-1, Math.min(1, p.vy / JUMP)) * 4;
        ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-6, 20); ctx.lineTo(-8, 28 + leg); ctx.moveTo(6, 20); ctx.lineTo(8, 28 - leg); ctx.stroke();
        ctx.fillStyle = "#2f9e5b"; ctx.beginPath(); ctx.roundRect(-13, 4, 26, 18, 7); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-12, 9); ctx.lineTo(-20, p.vy < 0 ? 0 : 14); ctx.moveTo(12, 9); ctx.lineTo(20, p.vy < 0 ? 0 : 14); ctx.stroke();
        // Kopf
        ctx.save(); ctx.beginPath(); ctx.arc(0, -12, 18, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(janImg, -18, -30, 36, 36); ctx.restore();
        ctx.beginPath(); ctx.arc(0, -12, 18, 0, Math.PI * 2); ctx.stroke();
        // Mütze
        ctx.fillStyle = "#e8414a"; ctx.beginPath(); ctx.moveTo(-14, -24); ctx.quadraticCurveTo(-4, -46, 18, -40); ctx.quadraticCurveTo(8, -34, 10, -24); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(-16, -28, 30, 7, 4); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(19, -40, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else { ctx.font = "36px system-ui, Apple Color Emoji, Segoe UI Emoji"; ctx.fillText("🧑‍🎄", 0, -2); }
      ctx.restore();
      if (boss) { bossEl.style.transform = `translate(${boss.x - 39}px, ${boss.y - camY - 39}px)`; }
      if (phase === "climb" && best > CLIMB * 0.85) { ctx.font = "bold 16px Fredoka, sans-serif"; ctx.fillStyle = "#ffc83d"; ctx.fillText("Gleich oben... 😈", W / 2, 46); }
    }
    function loop(now) {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      if (running) step(dt);
      draw();
      if (running) raf = requestAnimationFrame(loop);
    }
    function over() {
      running = false;
      const checkpoint = phase === "boss";
      const o = document.createElement("div"); o.className = "dj-over";
      o.innerHTML = `<p>${checkpoint ? "GRINCH-LEYLA<br>HAT GEWONNEN!" : "RUNTERGEFALLEN!"}</p><button class="btn">${checkpoint ? "🔁 Nochmal gegen den Boss" : "🔁 Nochmal"}</button>`;
      o.querySelector("button").addEventListener("click", e => {
        e.stopPropagation(); o.remove();
        if (checkpoint) { lives = LIVES; boss.hp = BOSS_HP; boss.sp = W * 0.28; socks = []; inv = 1; genArena(); p.x = W / 2; p.y = camY + H - 20 - R; p.vy = -JUMP; hud(); }
        else reset();
        running = true; last = performance.now(); raf = requestAnimationFrame(loop);
      });
      wrap.appendChild(o);
      if (checkpoint) talk(T.leylaWins || "Haha! Nochmal? 😎");
    }
    function win() {
      running = false;
      bossEl.classList.add("free"); bossEl.querySelector(".sack").remove();
      if (data.faceWin) bossEl.querySelector("img").src = data.faceWin;
      talk(T.final || "Okay, okay! Alle 23 Türchen sind zurück. ❤️");
      const r = cv.getBoundingClientRect();
      for (let i = 0; i < 4; i++) setTimeout(() => FX.burst(r.left + boss.x, r.top + boss.y - camY, { count: 50, speed: 13 }), i * 200);
      ADV.celebrate(wrap);
      setTimeout(() => ADV.finish(el.querySelector(".dj-after"), day, data, api, { title: data.endTitle || "GESCHAFFT!" }), 900);
    }
    cv.__st = () => ({ p, plats, camY, phase, boss, socks, W, H, JUMP, G }); // nur für automatische Tests
    reset(); draw();
    el.querySelector(".dj-go").addEventListener("click", e => {
      e.stopPropagation(); e.currentTarget.parentElement.remove();
      const DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === "function") DOE.requestPermission().then(r => { if (r === "granted") addEventListener("deviceorientation", onTilt); }).catch(() => {});
      else if (DOE) addEventListener("deviceorientation", onTilt);
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    });
    return () => { running = false; cancelAnimationFrame(raf); removeEventListener("deviceorientation", onTilt); };
  };
})();
