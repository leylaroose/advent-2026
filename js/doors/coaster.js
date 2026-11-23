/* Level 3: Europa-Park. Achterbahn-Minispiel, danach Tagesmission zum Abhaken. */
(function () {
  ADV.css("cst-css", `
  .cst-wrap { position: relative; margin-top: 8px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow);
    background: #0b2a1c; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .cst-wrap canvas { display: block; width: 100%; height: 300px; }
  .cst-hud { position: absolute; left: 10px; right: 10px; top: 10px; display: flex; justify-content: space-between; pointer-events: none;
    font-family: var(--pixel-font); font-size: 11px; color: var(--lime); text-shadow: 2px 2px 0 var(--ink); }
  .cst-tap { position: absolute; left: 0; right: 0; bottom: 14px; text-align: center; pointer-events: none;
    font-family: var(--pixel-font); font-size: 10px; color: var(--cream); text-shadow: 2px 2px 0 var(--ink); animation: blinkTxt 1s steps(2) infinite; }
  .cst-start { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(10,36,24,.55); }
  .cst-mission { margin-top: 6px; }
  .cst-mission h3 { font-family: var(--display); font-weight: 700; font-size: 26px; color: var(--forest); margin: 16px 0 4px; text-align: center; }
  .cst-sub { text-align: center; font-weight: 800; margin: 0 0 10px; }
  .cst-item { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; font: inherit; font-weight: 800; font-size: 17px; color: var(--ink);
    background: #fff; border: 3px solid var(--ink); border-radius: 16px; padding: 12px; margin: 10px 0; box-shadow: 3px 4px 0 var(--ink); cursor: pointer;
    transition: background .25s, transform .12s; }
  .cst-item:active { transform: translate(2px, 3px); box-shadow: 1px 1px 0 var(--ink); }
  .cst-item .ico { font-size: 28px; flex: none; }
  .cst-item .box { flex: none; margin-left: auto; width: 32px; height: 32px; border: 3px solid var(--ink); border-radius: 9px; display: grid; place-items: center;
    font-size: 20px; background: #fff; }
  .cst-item.done { background: var(--lime); }
  .cst-item.done .box { background: var(--leaf); color: #fff; animation: popOk .4s cubic-bezier(.3,1.7,.5,1); }
  .cst-item.done .txt { opacity: .75; }
  .cst-prog { font-family: var(--pixel-font); font-size: 10px; text-align: center; color: var(--forest); margin: 8px 0; }
  `);

  window.DOOR_TYPES.coaster = function (el, day, data, api) {
    const GOAL = data.goal || 10;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="cst-wrap">
        <canvas></canvas>
        <div class="cst-hud"><span class="cst-score">★ 0/${GOAL}</span><span>WODAN-EXPRESS</span></div>
        <div class="cst-tap" hidden>TIPPEN = SPRINGEN</div>
        <div class="cst-start"><button class="btn">🎢 Einsteigen!</button></div>
      </div>
      <div class="cst-after"></div>`;

    const wrap = el.querySelector(".cst-wrap");
    const cv = wrap.querySelector("canvas");
    const ctx = cv.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 300;
    function fit() { W = cv.clientWidth; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
    fit();

    const track = x => H * 0.66 + Math.sin(x * 0.011) * 42 + Math.sin(x * 0.027 + 1) * 18;
    let scroll = 0, speed = 3.2, running = false, over = false, raf = 0, frame = 0;
    const cartX = () => W * 0.28;
    let cy = track(cartX()), vy = 0, grounded = true;
    let items = [], pops = [], score = 0;
    const stars = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random() * 0.55, r: Math.random() * 1.6 + .4, t: Math.random() * 6 }));

    function jump() {
      if (!running) return;
      if (grounded) { vy = -9.8; grounded = false; if (navigator.vibrate) navigator.vibrate(12); }
    }
    wrap.addEventListener("pointerdown", e => { if (!e.target.closest("button")) jump(); });

    function spawn() {
      const wx = scroll + W + 30;
      const high = Math.random() < 0.6;
      items.push({ wx, y: track(W + 30) - (high ? 85 + Math.random() * 40 : 26), kind: Math.random() < 0.5 ? "⭐" : "🍷", bob: Math.random() * 6 });
    }

    function drawWheel(t) {
      const cx = W * 0.8, cyw = H * 0.36, R = 70;
      ctx.save(); ctx.translate(cx, cyw);
      ctx.strokeStyle = "rgba(166,232,191,.35)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 10; i++) {
        const a = t * 0.004 + i * Math.PI / 5;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke();
        ctx.fillStyle = ["#ffc83d", "#e8414a", "#c9f07a", "#7fd7ff"][i % 4];
        ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(t * 0.05 + i));
        ctx.beginPath(); ctx.arc(Math.cos(a) * R, Math.sin(a) * R, 5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, H); ctx.moveTo(0, 0); ctx.lineTo(40, H); ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#08251a"); g.addColorStop(1, "#13573a");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.03 + s.t));
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      drawWheel(frame);
      // Tannen im Hintergrund
      for (let i = 0; i < 9; i++) {
        const x = ((i * 90 - scroll * 0.3) % (W + 90) + W + 90) % (W + 90) - 45;
        ctx.fillStyle = "#0e3f29"; ctx.beginPath(); ctx.moveTo(x, H - 30); ctx.lineTo(x + 22, H - 95 - (i % 3) * 14); ctx.lineTo(x + 44, H - 30); ctx.fill();
      }
      // Schienen + Stützen
      ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
      for (let x = -((scroll) % 28); x < W + 28; x += 28) { ctx.beginPath(); ctx.moveTo(x, track(x) + 4); ctx.lineTo(x, H); ctx.stroke(); }
      ctx.lineWidth = 6; ctx.strokeStyle = "#e8414a";
      ctx.beginPath();
      for (let x = 0; x <= W; x += 6) { const y = track(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = "#0a2418"; ctx.stroke();
      // Items
      ctx.font = "26px system-ui, Apple Color Emoji, Segoe UI Emoji"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const it of items) { const sx = it.wx - scroll; ctx.fillText(it.kind, sx, it.y + Math.sin(frame * 0.08 + it.bob) * 4); }
      // Wagen
      const x = cartX();
      const ang = Math.atan2(track(x + 4) - track(x - 4), 8);
      ctx.save(); ctx.translate(x, cy - 14); ctx.rotate(grounded ? ang : ang * 0.4 + vy * 0.02);
      ctx.fillStyle = "#c9f07a"; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(-24, -12, 48, 24, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#0a2418"; ctx.beginPath(); ctx.arc(-13, 13, 5, 0, Math.PI * 2); ctx.arc(13, 13, 5, 0, Math.PI * 2); ctx.fill();
      // Passagiere mit Mützen
      for (const [px, c] of [[-9, "#e8414a"], [9, "#2f9e5b"]]) {
        ctx.fillStyle = "#ffd7b0"; ctx.beginPath(); ctx.arc(px, -18, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(px - 7, -21); ctx.lineTo(px + 7, -21); ctx.lineTo(px + 3, -34); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(px + 3, -35, 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      // +1 Effekte
      ctx.font = "bold 16px Fredoka, sans-serif";
      for (const p of pops) { ctx.globalAlpha = p.life / 40; ctx.fillStyle = "#ffc83d"; ctx.fillText("+1", p.x, p.y); }
      ctx.globalAlpha = 1;
    }

    function step() {
      frame++;
      if (running) {
        scroll += speed;
        speed = Math.min(5.2, speed + 0.0015);
        if (frame % 62 === 0) spawn();
        const ty = track(cartX());
        if (!grounded) {
          vy += 0.42; cy += vy;
          if (cy >= ty) { cy = ty; vy = 0; grounded = true; }
        } else cy = ty;
        for (const it of items) {
          const sx = it.wx - scroll;
          if (!it.got && Math.abs(sx - cartX()) < 28 && Math.abs(it.y - (cy - 20)) < 32) {
            it.got = true; score++;
            pops.push({ x: sx, y: it.y, life: 40 });
            el.querySelector(".cst-score").textContent = `★ ${score}/${GOAL}`;
            if (navigator.vibrate) navigator.vibrate(18);
            if (score >= GOAL) win();
          }
        }
        items = items.filter(it => !it.got && it.wx - scroll > -40);
      }
      for (const p of pops) { p.y -= 1; p.life--; }
      pops = pops.filter(p => p.life > 0);
      draw();
      if (!over || pops.length) raf = requestAnimationFrame(step);
    }

    wrap.querySelector(".cst-start .btn").addEventListener("click", e => {
      e.stopPropagation();
      wrap.querySelector(".cst-start").remove();
      wrap.querySelector(".cst-tap").hidden = false;
      running = true;
    });
    raf = requestAnimationFrame(step);

    function win() {
      running = false; over = true;
      wrap.querySelector(".cst-tap").hidden = true;
      ADV.celebrate(wrap);
      if (api && api.complete) api.complete();
      setTimeout(showMission, 700);
    }

    function showMission() {
      const after = el.querySelector(".cst-after");
      const saved = ADV.load("mission-" + day, []);
      const list = data.mission || [];
      after.innerHTML = `
        ${ADV.banner(day, "MISSION<br>COMPLETE!")}
        <div class="cst-mission adv-pop" style="animation-delay:.5s">
          <h3>${data.missionTitle || "Deine Mission für heute"}</h3>
          <p class="cst-sub">${data.missionSub || ""}</p>
          ${list.map((m, i) => `<button class="cst-item ${saved.includes(i) ? "done" : ""}" data-i="${i}"><span class="ico">${m.icon}</span><span class="txt">${m.text}</span><span class="box">${saved.includes(i) ? "✓" : ""}</span></button>`).join("")}
          <p class="cst-prog"></p>
          <div class="cst-reward"></div>
          ${ADV.backBtn()}
        </div>`;
      const body = el.closest(".sheet-body");
      if (body) body.scrollTo({ top: after.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 10, behavior: "smooth" });
      const prog = after.querySelector(".cst-prog");
      const update = (fresh) => {
        const done = after.querySelectorAll(".cst-item.done").length;
        prog.textContent = `${done}/${list.length} ERLEDIGT`;
        const rw = after.querySelector(".cst-reward");
        if (done === list.length && list.length) {
          if (!rw.innerHTML) {
            rw.innerHTML = `<div class="adv-note adv-pop">${data.missionReward || ""}<span class="from">${window.ADVENT.signoff || ""}</span></div>`;
            if (fresh) ADV.celebrate(rw);
          }
        } else rw.innerHTML = "";
      };
      after.querySelectorAll(".cst-item").forEach(b => b.addEventListener("click", () => {
        b.classList.toggle("done");
        const on = b.classList.contains("done");
        b.querySelector(".box").textContent = on ? "✓" : "";
        if (on) { const r = b.getBoundingClientRect(); FX.burst(r.right - 30, r.top + r.height / 2, { count: 24, speed: 7, size: 8, life: 70 }); if (navigator.vibrate) navigator.vibrate(20); }
        ADV.save("mission-" + day, [...after.querySelectorAll(".cst-item.done")].map(x => +x.dataset.i));
        update(true);
      }));
      update(false);
    }

    // Schon geschafft? Dann direkt Mission zeigen, Spiel bleibt spielbar
    if (api && api.cleared) setTimeout(showMission, 0);

    return () => { cancelAnimationFrame(raf); over = true; };
  };
})();
