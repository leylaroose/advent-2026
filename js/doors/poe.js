/* Path of Advent: Weihnachtsmonster wegtippen, Fake-Currency sammeln, am Ende Boss Krampus */
(function () {
  ADV.css("poa-css", `
  .poa-arena { position: relative; height: min(58svh, 430px); margin-top: 6px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden; box-shadow: var(--shadow);
    background: radial-gradient(ellipse at 50% 100%, #2b3b2f, #101a14 70%); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .poa-arena::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.08) 1.5px, transparent 2px); background-size: 26px 26px; }
  .poa-hud { position: absolute; left: 10px; right: 10px; top: 10px; z-index: 5; display: flex; justify-content: space-between; font-family: var(--pixel-font); font-size: 10px;
    color: var(--lime); text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .poa-mob { position: absolute; width: 58px; height: 58px; margin: -29px 0 0 -29px; border: 0; background: none; padding: 0; font-size: 44px; cursor: pointer;
    animation: mobIn .3s cubic-bezier(.3,1.7,.5,1), mobWob 1s ease-in-out .3s infinite; touch-action: manipulation; }
  .poa-mob .hp { position: absolute; left: 8px; right: 8px; bottom: -4px; height: 5px; background: #400; border: 1px solid #000; }
  .poa-mob .hp i { display: block; height: 100%; background: #e8414a; transition: width .1s; }
  .poa-mob.hit { animation: hitFlash .15s; }
  .poa-mob.dead { animation: mobDie .3s forwards; pointer-events: none; }
  @keyframes mobIn { from { transform: scale(0); } }
  @keyframes mobWob { 50% { transform: translateY(-4px) rotate(4deg); } }
  @keyframes hitFlash { 50% { filter: brightness(3) drop-shadow(0 0 6px #fff); transform: scale(.85); } }
  @keyframes mobDie { to { transform: scale(1.6) rotate(40deg); opacity: 0; } }
  .poa-drop { position: absolute; z-index: 4; white-space: nowrap; font-family: Georgia, serif; font-size: 13px; padding: 2px 6px; background: rgba(0,0,0,.8);
    border: 1px solid currentColor; pointer-events: none; animation: dropUp 1.3s ease-out forwards; translate: -50% 0; }
  @keyframes dropUp { 0% { transform: translateY(0) scale(.6); opacity: 0; } 15% { transform: translateY(-6px) scale(1); opacity: 1; } 100% { transform: translateY(-46px); opacity: 0; } }
  .poa-boss { position: absolute; width: 120px; height: 120px; margin: -60px 0 0 -60px; border: 0; background: none; padding: 0; font-size: 96px; cursor: pointer;
    transition: left 1.1s ease-in-out, top 1.1s ease-in-out; filter: drop-shadow(0 0 16px rgba(232,65,74,.9)); animation: mobIn .6s cubic-bezier(.3,1.7,.5,1); }
  .poa-boss.hit { animation: hitFlash .12s; }
  .poa-bossbar { position: absolute; left: 14px; right: 14px; top: 34px; z-index: 5; display: none; }
  .poa-bossbar.on { display: block; }
  .poa-bossbar .nm { font-family: Georgia, serif; color: #e07b2e; text-align: center; font-size: 15px; text-shadow: 1px 1px 0 #000; }
  .poa-bossbar .bar { height: 12px; border: 2px solid #000; background: #300; margin-top: 3px; }
  .poa-bossbar .bar i { display: block; height: 100%; width: 100%; background: linear-gradient(#ff5a5a, #b9252e); transition: width .12s; }
  .poa-center { position: absolute; inset: 0; z-index: 6; display: grid; place-items: center; align-content: center; gap: 14px; text-align: center; background: rgba(5,10,7,.6); }
  .poa-center p { margin: 0; font-family: var(--pixel-font); font-size: 13px; line-height: 1.7; color: var(--lime); text-shadow: 2px 2px 0 #000; padding: 0 12px; }
  .poa-stash { margin-top: 14px; background: #0c0806; border: 2px solid #af6025; border-radius: 6px; padding: 10px 12px; font-family: Georgia, serif; color: #c8c8c8; }
  .poa-stash h4 { margin: 0 0 6px; color: #e07b2e; font-weight: normal; font-size: 17px; text-align: center; }
  .poa-stash div { display: flex; justify-content: space-between; font-size: 15px; padding: 2px 0; }
  `);

  window.DOOR_TYPES.poe = function (el, day, data, api) {
    const MOBS = data.mobs || [{ icon: "🍪", hp: 1 }, { icon: "🧝", hp: 2 }, { icon: "⛄", hp: 3 }];
    const LOOT = data.loot || [{ name: "Chaos-Plätzchen", color: "#d9c27a" }];
    const BOSS = data.boss || { icon: "👹", name: "Krampus", hp: 40 };
    const TIME = data.time || 60;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="poa-arena">
        <div class="poa-hud"><span class="poa-kills">☠ 0</span><span class="poa-time">⏱ ${TIME}</span></div>
        <div class="poa-bossbar"><div class="nm">${BOSS.name}</div><div class="bar"><i></i></div></div>
        <div class="poa-center"><p>DIE WEIHNACHTSMONSTER<br>GREIFEN AN!</p><button class="btn poa-go">⚔️ Los geht's!</button></div>
      </div>
      <div class="poa-out"></div>`;
    const arena = el.querySelector(".poa-arena");
    let running = false, kills = 0, t0 = 0, spawnT = 0, raf = 0, phase = "mobs";
    const stash = {};
    const timers = [];
    const rnd = (a, b) => a + Math.random() * (b - a);

    function dropLoot(x, y) {
      if (Math.random() > (data.dropRate ?? 0.7)) return;
      const l = LOOT[Math.floor(Math.random() * LOOT.length)];
      stash[l.name] = (stash[l.name] || 0) + 1;
      const d = document.createElement("div");
      d.className = "poa-drop"; d.style.left = x + "px"; d.style.top = y - 30 + "px"; d.style.color = l.color; d.textContent = l.name;
      arena.appendChild(d); timers.push(setTimeout(() => d.remove(), 1300));
    }
    function spawn() {
      const m = MOBS[Math.floor(Math.random() * MOBS.length)];
      const w = arena.clientWidth, h = arena.clientHeight;
      const b = document.createElement("button");
      b.className = "poa-mob"; b.textContent = m.icon;
      let hp = m.hp; const max = m.hp;
      b.innerHTML = `${m.icon}${max > 1 ? `<span class="hp"><i style="width:100%"></i></span>` : ""}`;
      b.style.left = rnd(40, w - 40) + "px"; b.style.top = rnd(70, h - 40) + "px";
      b.addEventListener("pointerdown", e => {
        e.preventDefault(); if (!running) return;
        hp--; b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit");
        if (navigator.vibrate) navigator.vibrate(8);
        const bar = b.querySelector(".hp i"); if (bar) bar.style.width = (hp / max * 100) + "%";
        if (hp <= 0) {
          b.classList.add("dead"); kills++; el.querySelector(".poa-kills").textContent = `☠ ${kills}`;
          dropLoot(parseFloat(b.style.left), parseFloat(b.style.top));
          timers.push(setTimeout(() => b.remove(), 300));
        }
      });
      arena.appendChild(b);
      timers.push(setTimeout(() => { if (b.isConnected && !b.classList.contains("dead")) { b.classList.add("dead"); setTimeout(() => b.remove(), 300); } }, rnd(2600, 4200)));
    }
    function loop(now) {
      if (!running) return;
      const left = Math.max(0, Math.ceil(TIME - (now - t0) / 1000));
      el.querySelector(".poa-time").textContent = `⏱ ${left}`;
      const rate = 900 - Math.min(450, (now - t0) / 100); // wird schneller
      if (now - spawnT > rate && arena.querySelectorAll(".poa-mob:not(.dead)").length < 7) { spawn(); spawnT = now; }
      if (left === 0) return bossPhase();
      raf = requestAnimationFrame(loop);
    }
    function bossPhase() {
      phase = "boss";
      arena.querySelectorAll(".poa-mob").forEach(m => m.remove());
      el.querySelector(".poa-time").textContent = "BOSS!";
      const c = document.createElement("div");
      c.className = "poa-center"; c.innerHTML = `<p>${BOSS.intro || "DER BOSS ERSCHEINT..."}</p>`;
      arena.appendChild(c);
      if (navigator.vibrate) navigator.vibrate([100, 60, 160]);
      timers.push(setTimeout(() => {
        c.remove();
        el.querySelector(".poa-bossbar").classList.add("on");
        const b = document.createElement("button");
        b.className = "poa-boss"; b.textContent = BOSS.icon;
        const w = arena.clientWidth, h = arena.clientHeight;
        const move = () => { b.style.left = rnd(70, w - 70) + "px"; b.style.top = rnd(130, h - 70) + "px"; };
        b.style.left = w / 2 + "px"; b.style.top = h / 2 + 20 + "px";
        let hp = BOSS.hp;
        const mv = setInterval(move, 1300); timers.push(mv);
        b.addEventListener("pointerdown", e => {
          e.preventDefault(); if (hp <= 0) return;
          hp--; b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit");
          el.querySelector(".poa-bossbar .bar i").style.width = (hp / BOSS.hp * 100) + "%";
          if (navigator.vibrate) navigator.vibrate(10);
          const r = b.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 6, colors: ["#ff5a5a", "#ffd27a"], shapes: ["circle"], speed: 6, size: 6, life: 30 });
          if (hp <= 0) { clearInterval(mv); win(b); }
        });
        arena.appendChild(b);
      }, 1800));
    }
    function win(b) {
      running = false;
      b.style.transition = "transform 1s, opacity 1s"; b.style.transform = "scale(2) rotate(180deg)"; b.style.opacity = "0";
      const BL = data.bossLoot || [];
      BL.forEach(l => { stash[l.name] = (stash[l.name] || 0) + (l.count || 1); });
      ADV.celebrate(arena);
      timers.push(setTimeout(() => {
        const c = document.createElement("div");
        c.className = "poa-center"; c.innerHTML = `<p>${BOSS.name.toUpperCase()}<br>BESIEGT!</p>`;
        arena.appendChild(c);
        const rows = Object.entries(stash).map(([n, k]) => { const l = [...LOOT, ...BL].find(x => x.name === n) || {}; return `<div><span style="color:${l.color || "#c8c8c8"}">${n}</span><span>×${k}</span></div>`; }).join("");
        el.querySelector(".poa-out").innerHTML = `<div class="poa-stash adv-pop"><h4>Deine Beute (☠ ${kills} Monster)</h4>${rows || "<div>Nichts. Aber du hast gekämpft!</div>"}</div><div class="poa-after"></div>`;
        ADV.finish(el.querySelector(".poa-after"), day, data, api, { title: "KRAMPUS<br>BESIEGT!" });
      }, 900));
    }
    el.querySelector(".poa-go").addEventListener("click", e => {
      e.currentTarget.parentElement.remove();
      running = true; t0 = performance.now(); spawnT = 0;
      raf = requestAnimationFrame(loop);
    });
    return () => { running = false; cancelAnimationFrame(raf); timers.forEach(x => { clearTimeout(x); clearInterval(x); }); };
  };
})();
