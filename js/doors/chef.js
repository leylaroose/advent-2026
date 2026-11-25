/* Sternekoch Jan: Zutaten mit der Pfanne fangen, Schokolade & Co. ausweichen */
(function () {
  ADV.css("chef-css", `
  .chf-recipe { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 4px 0 0; }
  .chf-ing { display: flex; align-items: center; gap: 4px; background: #fff; border: 2.5px solid var(--ink); border-radius: 999px; padding: 3px 10px 3px 6px;
    font-family: var(--pixel-font); font-size: 10px; box-shadow: 2px 2px 0 var(--ink); transition: background .3s; }
  .chf-ing span { font-family: system-ui; font-size: 20px; }
  .chf-ing.ok { background: var(--lime); }
  .chf-ing.bump { animation: popOk .3s cubic-bezier(.3,1.7,.5,1); }
  .chf-wrap { position: relative; margin-top: 10px; border: 3px solid var(--ink); border-radius: 16px; overflow: hidden; box-shadow: none; touch-action: none; }
  .chf-wrap canvas { display: block; width: 100%; }
  .chf-hud { position: absolute; left: 10px; right: 10px; top: 8px; display: flex; justify-content: space-between; font-size: 16px; pointer-events: none; }
  .chf-wrap.ouch { animation: ouch .35s; }
  @keyframes ouch { 30% { box-shadow: inset 0 0 0 999px rgba(232,65,74,.35); } }
  .chf-over { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(10,36,24,.72); padding: 0 16px; }
  .chf-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .chf-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); text-shadow: none; }
  .chf-dish { font-size: 90px; text-align: center; margin: 6px 0 0; animation: hop 1.6s ease-in-out infinite; }
  `);

  window.DOOR_TYPES.chef = function (el, day, data, api) {
    const NEED = data.need || [{ icon: "🍝", n: 3 }];
    const BAD = data.bad || ["🍫"];
    const LIVES = data.lives || 3;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="chf-recipe">${NEED.map((g, i) => `<div class="chf-ing" data-i="${i}"><span>${g.icon}</span><b>0/${g.n}</b></div>`).join("")}</div>
      <div class="chf-wrap"><canvas></canvas><div class="chf-hud"><span class="chf-lives"></span><span>${BAD.join(" ")} = 🚫</span></div>
        <div class="chf-over"><p>AB IN DIE KÜCHE!</p><div class="how">${data.how || ""}</div><button class="btn chf-go">👨‍🍳 Los geht's!</button></div>
      </div>
      <div class="chf-after"></div>`;
    const wrap = el.querySelector(".chf-wrap"), cv = wrap.querySelector("canvas"), ctx = cv.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    function fit() {
      const vh = (window.visualViewport && visualViewport.height) || innerHeight;
      W = cv.clientWidth; H = Math.round(Math.max(300, Math.min(W * 1.2, vh - 330, 460)));
      cv.style.height = H + "px"; cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    fit();
    let bag = [], pan = { x: 0 }, items = [], got = [], lives = LIVES, running = false, raf = 0, last = 0, spawnT = 0, t0 = 0, pops = [];
    const panW = () => Math.max(84, W * 0.27);
    const livesTxt = () => { el.querySelector(".chf-lives").textContent = "❤️".repeat(lives) + "🖤".repeat(LIVES - lives); };
    const move = e => { const r = cv.getBoundingClientRect(); pan.x = Math.max(panW() / 2, Math.min(W - panW() / 2, e.clientX - r.left)); };
    wrap.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; move(e); try { wrap.setPointerCapture(e.pointerId); } catch (_) {} });
    wrap.addEventListener("pointermove", e => { if (e.buttons || e.pointerType === "touch") move(e); });

    function updRecipe(i) {
      const chip = el.querySelector(`.chf-ing[data-i="${i}"]`);
      chip.querySelector("b").textContent = `${Math.min(got[i], NEED[i].n)}/${NEED[i].n}`;
      chip.classList.toggle("ok", got[i] >= NEED[i].n);
      chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump");
    }
    function start() {
      items = []; pops = []; got = NEED.map(() => 0); lives = LIVES; livesTxt();
      NEED.forEach((_, i) => updRecipe(i));
      pan.x = W / 2; running = true; t0 = last = performance.now(); spawnT = 0;
      raf = requestAnimationFrame(loop);
    }
    function spawn(now) {
      const missing = NEED.map((g, i) => got[i] < g.n ? i : -1).filter(i => i >= 0);
      if (!bag.length) bag = ADV.shuffle([true, true, false, false, false, false, false]);
      const bad = bag.pop();
      const icon = bad ? BAD[Math.floor(Math.random() * BAD.length)] : NEED[missing.length && Math.random() < 0.8 ? missing[Math.floor(Math.random() * missing.length)] : Math.floor(Math.random() * NEED.length)].icon;
      const sp = H * (0.42 + Math.random() * 0.18 + Math.min(0.25, (now - t0) / 1000 * 0.01));
      items.push({ x: 24 + Math.random() * (W - 48), y: -20, vy: sp, icon, bad, rot: Math.random() * 6, vr: (Math.random() - .5) * 3 });
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      if (now - spawnT > Math.max(400, 700 - (now - t0) / 40)) { spawn(now); spawnT = now; }
      const py = H - 34;
      items = items.filter(it => {
        it.y += it.vy * dt; it.rot += it.vr * dt;
        if (it.y > py - 16 && it.y < py + 10 && Math.abs(it.x - pan.x) < panW() / 2 + 6) {
          if (it.bad) {
            lives--; livesTxt(); wrap.classList.remove("ouch"); void wrap.offsetWidth; wrap.classList.add("ouch");
            pops.push({ x: it.x, y: py - 30, t: "Bäh! 🤢", life: 1 });
            if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
          } else {
            const i = NEED.findIndex(g => g.icon === it.icon);
            got[i]++; updRecipe(i);
            pops.push({ x: it.x, y: py - 30, t: got[i] <= NEED[i].n ? "+1" : "👌", life: 1 });
            if (navigator.vibrate) navigator.vibrate(10);
          }
          return false;
        }
        return it.y < H + 30;
      });
      pops.forEach(p => { p.life -= dt; p.y -= 40 * dt; });
      pops = pops.filter(p => p.life > 0);
      draw();
      if (lives <= 0) return over(false);
      if (NEED.every((g, i) => got[i] >= g.n)) return over(true);
      raf = requestAnimationFrame(loop);
    }
    function draw() {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#fff5df"); g.addColorStop(1, "#ffe6bd");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(19,87,58,.08)";
      for (let x = 0; x < W; x += 28) for (let y = 0; y < H; y += 28) if (((x + y) / 28) % 2 === 0) ctx.fillRect(x, y, 28, 28);
      ctx.fillStyle = "#c98b4a"; ctx.fillRect(0, H - 14, W, 14);
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "32px system-ui, Apple Color Emoji, Segoe UI Emoji";
      items.forEach(it => { ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot * 0.2); ctx.fillText(it.icon, 0, 0); ctx.restore(); });
      // Pfanne
      const py = H - 34, w = panW();
      ctx.fillStyle = "#3a3f44"; ctx.strokeStyle = "#0a2418"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(pan.x + w / 2 - 4, py - 4, w * 0.45, 10, 5); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(pan.x, py, w / 2, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#5b6167"; ctx.beginPath(); ctx.ellipse(pan.x, py - 2, w / 2 - 7, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.font = "bold 18px Fredoka, sans-serif"; ctx.fillStyle = "#13573a";
      pops.forEach(p => { ctx.globalAlpha = Math.max(0, p.life); ctx.fillText(p.t, p.x, p.y); });
      ctx.globalAlpha = 1;
    }
    function over(won) {
      running = false; items = []; draw();
      const o = document.createElement("div"); o.className = "chf-over";
      if (won) {
        o.innerHTML = `<p>${data.dishName || "PASTA À LA JAN"}<br>IST FERTIG!</p><div class="chf-dish">${data.dish || "🍝"}</div>`;
        wrap.appendChild(o);
        ADV.finish(el.querySelector(".chf-after"), day, data, api, { title: data.endTitle || "STERNEKOCH!" });
      } else {
        o.innerHTML = `<p>ZU VIEL SCHOKOLADE<br>IM ESSEN! 🤢</p><button class="btn">🔁 Nochmal kochen</button>`;
        o.querySelector("button").addEventListener("click", () => { o.remove(); start(); });
        wrap.appendChild(o);
      }
    }
    cv.__st = () => ({ items, pan, W, H }); // nur für automatische Tests
    livesTxt(); pan.x = W / 2; draw();
    el.querySelector(".chf-go").addEventListener("click", e => { e.stopPropagation(); e.currentTarget.parentElement.remove(); start(); });
    return () => { running = false; cancelAnimationFrame(raf); };
  };
})();
