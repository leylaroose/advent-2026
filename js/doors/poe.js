/* Path of Advent: Weihnachtsmonster laufen nach unten, Jan tippt sie weg. Danach Boss Krampus. */
(function () {
  ADV.css("poa-css", `
  .poa-arena { position: relative; height: min(56svh, 420px); margin-top: 6px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden; box-shadow: none;
    background: linear-gradient(#0d1f17, #1d3a2a); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .poa-arena::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.08) 1.5px, transparent 2px); background-size: 26px 26px; }
  .poa-arena::after { content: "🎁 🎄 🎁 🎄 🎁"; position: absolute; left: 0; right: 0; bottom: 0; height: 44px; padding-top: 4px; text-align: center; font-size: 22px; letter-spacing: 8px; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0, #fff 60%, #e3f3ff 100%); border-top: 3px solid var(--ink); border-radius: 50% 50% 0 0 / 14px 14px 0 0; }
  .poa-heart { filter: drop-shadow(0 0 8px #ff8a8a); }
  .poa-coal { font-size: 34px; }
  .poa-boss.angry { filter: drop-shadow(0 0 22px #ff2020) saturate(1.6); animation: angryShake .2s linear infinite; }
  @keyframes angryShake { 50% { rotate: 6deg; } }
  .poa-arena.ouch { animation: ouch .35s; }
  @keyframes ouch { 30% { box-shadow: inset 0 0 0 999px rgba(232,65,74,.35); } }
  .poa-hud { position: absolute; left: 10px; right: 10px; top: 10px; z-index: 5; display: flex; justify-content: space-between; align-items: center;
    font-family: var(--pixel-font); font-size: 10px; color: var(--lime); text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .poa-hearts { font-size: 14px; letter-spacing: 1px; font-family: system-ui; }
  .poa-mob { position: absolute; width: 60px; height: 60px; margin: -30px 0 0 -30px; border: 0; background: none; padding: 0; font-size: 46px; line-height: 60px; cursor: pointer;
    animation: mobIn .3s cubic-bezier(.3,1.7,.5,1), mobWob .6s ease-in-out .3s infinite; touch-action: manipulation; z-index: 2; }
  .poa-mob .hp { position: absolute; left: 10px; right: 10px; bottom: -2px; height: 6px; background: #400; border: 1px solid #000; border-radius: 3px; overflow: hidden; }
  .poa-mob .hp i { display: block; height: 100%; background: #e8414a; transition: width .1s; }
  .poa-mob.hit { animation: hitFlash .15s; }
  .poa-mob.dead { animation: mobDie .35s forwards; pointer-events: none; }
  @keyframes mobIn { from { transform: scale(0); } }
  @keyframes mobWob { 50% { transform: rotate(8deg); } }
  @keyframes hitFlash { 50% { filter: brightness(3) drop-shadow(0 0 6px #fff); transform: scale(.8); } }
  @keyframes mobDie { to { transform: scale(1.8) rotate(60deg); opacity: 0; } }
  .poa-pop { position: absolute; z-index: 4; white-space: nowrap; pointer-events: none; translate: -50% 0; animation: dropUp 1.2s ease-out forwards; }
  .poa-pop.dmg { font-family: var(--pixel-font); font-size: 12px; color: #fff; text-shadow: 2px 2px 0 #b9252e; }
  .poa-pop.loot { font-family: Georgia, serif; font-size: 13px; padding: 2px 6px; background: rgba(0,0,0,.85); border: 1px solid currentColor; }
  @keyframes dropUp { 0% { transform: translateY(0) scale(.6); opacity: 0; } 15% { transform: translateY(-6px) scale(1); opacity: 1; } 100% { transform: translateY(-44px); opacity: 0; } }
  .poa-boss { position: absolute; width: 120px; height: 120px; margin: -60px 0 0 -60px; border: 0; background: none; padding: 0; font-size: 96px; line-height: 120px; cursor: pointer;
    transition: left 1s ease-in-out, top 1s ease-in-out; filter: drop-shadow(0 0 16px rgba(232,65,74,.9)); animation: mobIn .6s cubic-bezier(.3,1.7,.5,1); z-index: 3; }
  .poa-boss.hit { animation: hitFlash .12s; }
  .poa-bossbar { position: absolute; left: 14px; right: 14px; top: 34px; z-index: 5; display: none; }
  .poa-bossbar.on { display: block; }
  .poa-bossbar .nm { font-family: Georgia, serif; color: #e07b2e; text-align: center; font-size: 15px; text-shadow: 1px 1px 0 #000; }
  .poa-bossbar .bar { height: 12px; border: 2px solid #000; background: #300; margin-top: 3px; }
  .poa-bossbar .bar i { display: block; height: 100%; width: 100%; background: linear-gradient(#ff5a5a, #b9252e); transition: width .12s; }
  .poa-center { position: absolute; inset: 0; z-index: 6; display: grid; place-items: center; align-content: center; gap: 14px; text-align: center; background: rgba(5,10,7,.78); padding: 0 16px; }
  .poa-center p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .poa-center .how { font-family: var(--body); font-weight: 800; font-size: 15px; line-height: 1.45; color: var(--cream); text-shadow: none; }
  .poa-stash { margin-top: 14px; background: #0c0806; border: 2px solid #af6025; border-radius: 6px; padding: 10px 12px; font-family: Georgia, serif; color: #c8c8c8; }
  .poa-stash h4 { margin: 0 0 6px; color: #e07b2e; font-weight: normal; font-size: 17px; text-align: center; }
  .poa-stash div { display: flex; justify-content: space-between; font-size: 15px; padding: 2px 0; }
  `);

  window.DOOR_TYPES.poe = function (el, day, data, api) {
    const MOBS = data.mobs || [{ icon: "🍪", hp: 1 }];
    const LOOT = data.loot || [{ name: "Chaos-Plätzchen", color: "#d9c27a" }];
    const BOSS = data.boss || { icon: "👹", name: "Krampus", hp: 30 };
    const TIME = data.time || 30, LIVES = data.lives || 5;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="poa-arena">
        <div class="poa-hud"><span class="poa-kills">☠ 0</span><span class="poa-hearts"></span><span class="poa-time">⏱ ${TIME}</span></div>
        <div class="poa-bossbar"><div class="nm">${BOSS.name}</div><div class="bar"><i></i></div></div>
        <div class="poa-center"><p>DIE WEIHNACHTSMONSTER<br>GREIFEN AN!</p>
          <div class="how">${data.how || ""}</div>
          <button class="btn poa-go">⚔️ Los geht's!</button></div>
      </div>
      <div class="poa-out"></div>`;
    const arena = el.querySelector(".poa-arena");
    let running = false, kills = 0, lives = LIVES, t0 = 0, last = 0, spawnT = 0, raf = 0, mobs = [];
    let stash = {};
    const timers = [];
    const rnd = (a, b) => a + Math.random() * (b - a);
    const hearts = () => { el.querySelector(".poa-hearts").textContent = "❤️".repeat(lives) + "🖤".repeat(LIVES - lives); };
    hearts();

    function pop(x, y, txt, cls, color) {
      const d = document.createElement("div");
      d.className = "poa-pop " + cls; d.style.left = x + "px"; d.style.top = y + "px"; d.textContent = txt;
      if (color) d.style.color = color;
      arena.appendChild(d); timers.push(setTimeout(() => d.remove(), 1200));
    }
    function spawn(now) {
      const w = arena.clientWidth;
      // ab und zu ein Herz, das Leben zurückgibt
      if (Math.random() < (data.heartRate ?? 0.16)) {
        const b = document.createElement("button");
        b.className = "poa-mob poa-heart"; b.textContent = "❤️";
        const mob = { el: b, x: rnd(36, w - 36), y: 40, hp: 1, max: 1, speed: rnd(60, 80), good: true };
        b.style.left = mob.x + "px"; b.style.top = mob.y + "px";
        b.addEventListener("pointerdown", e => {
          e.preventDefault(); if (!running || mob.hp <= 0) return;
          mob.hp = 0; b.classList.add("dead"); setTimeout(() => b.remove(), 350);
          if (lives < LIVES) { lives++; hearts(); }
          pop(mob.x, mob.y - 30, "+1 ❤️", "dmg");
          if (navigator.vibrate) navigator.vibrate(20);
        });
        arena.appendChild(b); mobs.push(mob); return;
      }
      const m = MOBS[Math.floor(Math.random() * MOBS.length)];
      const b = document.createElement("button");
      b.className = "poa-mob";
      b.innerHTML = `${m.icon}${m.hp > 1 ? `<span class="hp"><i style="width:100%"></i></span>` : ""}`;
      const mob = { el: b, x: rnd(36, w - 36), y: 40, hp: m.hp, max: m.hp, speed: rnd(42, 58) + (now - t0) / 1000 * 1.2 };
      b.style.left = mob.x + "px"; b.style.top = mob.y + "px";
      b.addEventListener("pointerdown", e => {
        e.preventDefault(); if (!running || mob.hp <= 0) return;
        mob.hp--; b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit");
        if (navigator.vibrate) navigator.vibrate(8);
        pop(mob.x, mob.y - 34, "💥", "dmg");
        const bar = b.querySelector(".hp i"); if (bar) bar.style.width = (mob.hp / mob.max * 100) + "%";
        if (mob.hp <= 0) {
          b.classList.add("dead"); kills++; el.querySelector(".poa-kills").textContent = `☠ ${kills}`;
          if (Math.random() < (data.dropRate ?? 0.6)) {
            const l = LOOT[Math.floor(Math.random() * LOOT.length)];
            stash[l.name] = (stash[l.name] || 0) + 1;
            pop(mob.x, mob.y - 20, `${l.icon || ""} ${l.name}`, "loot", l.color);
          }
          timers.push(setTimeout(() => b.remove(), 350));
        }
      });
      arena.appendChild(b); mobs.push(mob);
    }
    const floorY = () => arena.clientHeight - 46;
    function hurt() {
      lives--; hearts(); arena.classList.remove("ouch"); void arena.offsetWidth; arena.classList.add("ouch");
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(50, now - last) / 1000; last = now;
      const left = Math.max(0, Math.ceil(TIME - (now - t0) / 1000));
      el.querySelector(".poa-time").textContent = `⏱ ${left}`;
      const rate = Math.max(650, 950 - (now - t0) / 50);
      const alive = mobs.filter(m => !m.good && m.hp > 0).length;
      if (now - spawnT > rate && alive < (data.maxMobs || 4)) { spawn(now); spawnT = now; }
      mobs = mobs.filter(m => {
        if (m.hp <= 0) return false;
        m.y += m.speed * dt; m.el.style.top = m.y + "px";
        if (m.y >= floorY()) {
          m.el.classList.add("dead"); setTimeout(() => m.el.remove(), 350);
          if (!m.good) hurt();
          return false;
        }
        return true;
      });
      if (lives <= 0) return gameOver();
      if (left === 0) return bossPhase();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      arena.querySelectorAll(".poa-center, .poa-mob, .poa-boss, .poa-coal").forEach(x => x.remove());
      el.querySelector(".poa-bossbar").classList.remove("on");
      running = true; kills = 0; lives = LIVES; mobs = []; stash = {};
      el.querySelector(".poa-kills").textContent = "☠ 0"; hearts();
      t0 = last = performance.now(); spawnT = 0;
      raf = requestAnimationFrame(loop);
    }
    function gameOver(boss) {
      running = false; bossOn = false;
      mobs.forEach(m => m.el.remove()); mobs = [];
      arena.querySelectorAll(".poa-boss, .poa-coal").forEach(x => x.remove());
      timers.forEach(x => { clearTimeout(x); clearInterval(x); });
      const c = document.createElement("div");
      c.className = "poa-center";
      c.innerHTML = boss ? `<p>KRAMPUS WAR<br>ZU STARK!</p><button class="btn">🔁 Nochmal gegen Krampus</button>` : `<p>DIE MONSTER HABEN<br>DIE GESCHENKE ERREICHT!</p><button class="btn">🔁 Nochmal</button>`;
      c.querySelector("button").addEventListener("click", () => { c.remove(); if (boss) { lives = LIVES; hearts(); bossPhase(); } else start(); });
      arena.appendChild(c);
    }
    // Boss: Krampus springt herum und wirft Kohle. Kohle antippen, bevor sie die Geschenke trifft.
    let bossOn = false;
    function bossPhase() {
      running = false;
      mobs.forEach(m => m.el.remove()); mobs = [];
      el.querySelector(".poa-time").textContent = "BOSS!";
      const c = document.createElement("div");
      c.className = "poa-center"; c.innerHTML = `<p>${BOSS.intro || "DER BOSS ERSCHEINT..."}</p><div class="how">${BOSS.how || ""}</div>`;
      arena.appendChild(c);
      if (navigator.vibrate) navigator.vibrate([100, 60, 160]);
      timers.push(setTimeout(() => {
        c.remove(); bossOn = true;
        el.querySelector(".poa-bossbar").classList.add("on");
        el.querySelector(".poa-bossbar .bar i").style.width = "100%";
        el.querySelector(".poa-bossbar .nm").textContent = BOSS.name;
        const b = document.createElement("button");
        b.className = "poa-boss"; b.textContent = BOSS.icon;
        const w = arena.clientWidth, h = arena.clientHeight;
        let hp = BOSS.hp, angry = false;
        const move = () => { b.style.left = rnd(70, w - 70) + "px"; b.style.top = rnd(110, h * 0.55) + "px"; };
        b.style.left = w / 2 + "px"; b.style.top = h * 0.4 + "px";
        let mv = setInterval(move, 1300); timers.push(mv);
        const coals = [];
        const throwCoal = () => {
          if (!bossOn) return;
          const k = document.createElement("button");
          k.className = "poa-mob poa-coal"; k.textContent = "🪨";
          const co = { el: k, x: parseFloat(b.style.left) || w / 2, y: (parseFloat(b.style.top) || h / 2) + 40, vy: angry ? 120 : 90, dead: false };
          k.style.left = co.x + "px"; k.style.top = co.y + "px";
          k.addEventListener("pointerdown", e => { e.preventDefault(); if (co.dead) return; co.dead = true; k.classList.add("dead"); setTimeout(() => k.remove(), 350); pop(co.x, co.y - 30, "💥", "dmg"); if (navigator.vibrate) navigator.vibrate(10); });
          arena.appendChild(k); coals.push(co);
        };
        let th = setInterval(throwCoal, 1500); timers.push(th);
        let lastT = performance.now();
        const coalLoop = now => {
          if (!bossOn) return;
          const dt = Math.min(50, now - lastT) / 1000; lastT = now;
          for (const co of coals) {
            if (co.dead) continue;
            co.y += co.vy * dt; co.el.style.top = co.y + "px";
            if (co.y >= floorY()) { co.dead = true; co.el.classList.add("dead"); setTimeout(() => co.el.remove(), 350); hurt(); if (lives <= 0) return gameOver(true); }
          }
          raf = requestAnimationFrame(coalLoop);
        };
        raf = requestAnimationFrame(coalLoop);
        b.addEventListener("pointerdown", e => {
          e.preventDefault(); if (hp <= 0) return;
          hp--; b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit");
          el.querySelector(".poa-bossbar .bar i").style.width = (hp / BOSS.hp * 100) + "%";
          if (navigator.vibrate) navigator.vibrate(10);
          const r = b.getBoundingClientRect(), ar = arena.getBoundingClientRect();
          pop(r.left - ar.left + r.width / 2 + rnd(-30, 30), r.top - ar.top + 10, "💥", "dmg");
          if (!angry && hp <= BOSS.hp / 2) {
            angry = true; b.classList.add("angry");
            el.querySelector(".poa-bossbar .nm").textContent = BOSS.name + " (WÜTEND!)";
            clearInterval(mv); mv = setInterval(move, 950); timers.push(mv);
            clearInterval(th); th = setInterval(throwCoal, 1100); timers.push(th);
          }
          if (hp <= 0) { bossOn = false; clearInterval(mv); clearInterval(th); coals.forEach(co => co.el.remove()); win(b); }
        });
        arena.appendChild(b);
      }, 2600));
    }
    function win(b) {
      b.style.transition = "transform 1s, opacity 1s"; b.style.transform = "scale(2) rotate(180deg)"; b.style.opacity = "0";
      const BL = data.bossLoot || [];
      BL.forEach(l => { stash[l.name] = (stash[l.name] || 0) + (l.count || 1); });
      ADV.celebrate(arena);
      timers.push(setTimeout(() => {
        const rows = Object.entries(stash).map(([n, k]) => { const l = [...LOOT, ...BL].find(x => x.name === n) || {}; return `<div><span style="color:${l.color || "#c8c8c8"}">${l.icon || ""} ${n}</span><span>×${k}</span></div>`; }).join("");
        el.querySelector(".poa-out").innerHTML = `<div class="poa-stash adv-pop"><h4>Deine Beute (☠ ${kills} Monster)</h4>${rows || "<div>Nichts. Aber du hast gekämpft!</div>"}</div><div class="poa-after"></div>`;
        ADV.finish(el.querySelector(".poa-after"), day, data, api, { title: "KRAMPUS<br>BESIEGT!" });
      }, 900));
    }
    el.querySelector(".poa-go").addEventListener("click", start);
    return () => { running = false; cancelAnimationFrame(raf); timers.forEach(x => { clearTimeout(x); clearInterval(x); }); };
  };
})();
