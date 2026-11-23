/* Schneeflocken fangen: Flocken antippen, goldene zählen dreifach, Kohlestücke kosten Punkte. Ziel in X Sekunden. */
(function () {
  ADV.css("snw-css", `
  .snw-arena { position: relative; height: min(56svh, 430px); margin-top: 8px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow);
    background: linear-gradient(#0b2a3a, #1e4f6b 60%, #d9f3e3); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .snw-hud { position: absolute; left: 10px; right: 10px; top: 10px; z-index: 5; display: flex; justify-content: space-between; font-family: var(--pixel-font); font-size: 10px; color: #fff;
    text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .snw-bar { position: absolute; left: 10px; right: 10px; top: 30px; height: 10px; z-index: 5; border: 2px solid #000; border-radius: 6px; background: rgba(255,255,255,.3); overflow: hidden; pointer-events: none; }
  .snw-bar i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #a6e8bf, #fff); transition: width .2s; }
  .snw-f { position: absolute; width: 56px; height: 56px; margin: -28px 0 0 -28px; border: 0; background: none; padding: 0; font-size: 34px; line-height: 56px; cursor: pointer;
    filter: drop-shadow(0 0 6px rgba(255,255,255,.8)); touch-action: manipulation; }
  .snw-f.gold { filter: drop-shadow(0 0 10px #ffc83d) sepia(1) saturate(4) hue-rotate(5deg) brightness(1.1); font-size: 40px; }
  .snw-f.coal { filter: none; font-size: 30px; }
  .snw-f.pop { animation: snwPop .3s forwards; pointer-events: none; }
  @keyframes snwPop { to { transform: scale(2); opacity: 0; } }
  .snw-pts { position: absolute; z-index: 4; font-family: var(--pixel-font); font-size: 12px; color: #fff; text-shadow: 2px 2px 0 #000; pointer-events: none; translate: -50% 0; animation: dropUp 1s ease-out forwards; }
  @keyframes dropUp { to { transform: translateY(-40px); opacity: 0; } }
  .snw-man { position: absolute; left: 50%; bottom: 6px; translate: -50% 0; font-size: calc(24px + var(--grow, 0) * 40px); transition: font-size .3s; pointer-events: none; z-index: 1; }
  .snw-over { position: absolute; inset: 0; z-index: 6; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(5,20,30,.72); padding: 0 16px; }
  .snw-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: #fff; text-shadow: 2px 2px 0 #000; }
  .snw-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); }
  `);

  window.DOOR_TYPES.snow = function (el, day, data, api) {
    const GOAL = data.goal || 40, TIME = data.time || 30;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="snw-arena">
        <div class="snw-hud"><span class="snw-s">❄ 0/${GOAL}</span><span class="snw-t">⏱ ${TIME}</span></div>
        <div class="snw-bar"><i></i></div>
        <div class="snw-man">⛄</div>
        <div class="snw-over"><p>ES SCHNEIT!</p><div class="how">${data.how || ""}</div><button class="btn snw-go">❄️ Los!</button></div>
      </div>
      <div class="snw-after"></div>`;
    const ar = el.querySelector(".snw-arena");
    let score = 0, running = false, raf = 0, t0 = 0, last = 0, spawnT = 0, flakes = [];
    const rnd = (a, b) => a + Math.random() * (b - a);
    function upd() {
      el.querySelector(".snw-s").textContent = `❄ ${Math.max(0, score)}/${GOAL}`;
      el.querySelector(".snw-bar i").style.width = Math.min(100, Math.max(0, score) / GOAL * 100) + "%";
      el.querySelector(".snw-man").style.setProperty("--grow", Math.min(1, Math.max(0, score) / GOAL));
    }
    function pts(x, y, t) { const d = document.createElement("div"); d.className = "snw-pts"; d.style.left = x + "px"; d.style.top = y + "px"; d.textContent = t; ar.appendChild(d); setTimeout(() => d.remove(), 1000); }
    function spawn() {
      const r = Math.random(), kind = r < 0.12 ? "gold" : r < 0.27 ? "coal" : "flake";
      const b = document.createElement("button");
      b.className = "snw-f " + (kind === "flake" ? "" : kind); b.textContent = kind === "coal" ? "🪨" : "❄️";
      const f = { el: b, x: rnd(30, ar.clientWidth - 30), y: 50, vy: rnd(70, 130), sway: rnd(0, 6), kind, dead: false };
      b.addEventListener("pointerdown", e => {
        e.preventDefault(); if (!running || f.dead) return;
        f.dead = true; b.classList.add("pop"); setTimeout(() => b.remove(), 300);
        const v = kind === "gold" ? 3 : kind === "coal" ? -3 : 1; score += v;
        pts(f.x, f.y - 20, v > 0 ? `+${v}` : `${v}`);
        if (navigator.vibrate) navigator.vibrate(kind === "coal" ? [30, 20, 30] : 8);
        upd();
        if (score >= GOAL) win();
      });
      ar.appendChild(b); flakes.push(f);
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const left = Math.max(0, Math.ceil(TIME - (now - t0) / 1000));
      el.querySelector(".snw-t").textContent = `⏱ ${left}`;
      if (now - spawnT > 330) { spawn(); spawnT = now; }
      flakes = flakes.filter(f => {
        if (f.dead) return false;
        f.y += f.vy * dt; f.sway += dt * 2; f.el.style.left = f.x + Math.sin(f.sway) * 18 + "px"; f.el.style.top = f.y + "px";
        if (f.y > ar.clientHeight + 30) { f.el.remove(); return false; }
        return true;
      });
      if (left === 0) return lose();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      ar.querySelectorAll(".snw-over, .snw-f").forEach(x => x.remove());
      score = 0; flakes = []; upd(); running = true; t0 = last = performance.now(); raf = requestAnimationFrame(loop);
    }
    function lose() {
      running = false; flakes.forEach(f => f.el.remove()); flakes = [];
      const o = document.createElement("div"); o.className = "snw-over";
      o.innerHTML = `<p>ZEIT UM!<br>❄ ${Math.max(0, score)}/${GOAL}</p><button class="btn">🔁 Nochmal</button>`;
      o.querySelector("button").addEventListener("click", start); ar.appendChild(o);
    }
    function win() {
      running = false; flakes.forEach(f => f.el.remove()); flakes = [];
      ADV.celebrate(ar);
      ADV.finish(el.querySelector(".snw-after"), day, data, api, { title: data.endTitle || "SCHNEEMANN<br>GEBAUT!" });
    }
    el.querySelector(".snw-go").addEventListener("click", start);
    return () => { running = false; cancelAnimationFrame(raf); };
  };
})();
