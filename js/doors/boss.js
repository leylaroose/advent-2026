/* Finale: Endboss. Grinch-Leyla hat alle 23 Türchen in ihrem Sack.
   Treffer auf Grinch-Leyla = ein Türchen fällt heraus. Türchen antippen, bevor es unten ankommt, sonst fliegt es zurück in den Sack.
   Sie wird schneller, teleportiert sich und bekommt am Ende Doppelgänger (nur die grüne ist echt). */
(function () {
  ADV.css("bss-css", `
  .bss-top { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
  .bss-say { flex: 1; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 8px 11px; font-family: var(--display); font-weight: 600; font-size: 16px; min-height: 46px; }
  .bss-say.pop { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  .bss-arena { position: relative; height: min(58svh, 440px); margin-top: 10px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden;
    background: radial-gradient(ellipse at 50% 0, #2f9e5b, #0b3d27 70%); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .bss-arena::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 26px; background: #fff; border-top: 3px solid var(--ink); border-radius: 50% 50% 0 0 / 10px 10px 0 0; pointer-events: none; }
  .bss-hud { position: absolute; left: 10px; right: 10px; top: 8px; z-index: 6; display: flex; justify-content: space-between; align-items: center; font-family: var(--pixel-font); font-size: 11px; color: var(--lime); text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .bss-bar { position: absolute; left: 12px; right: 12px; top: 30px; z-index: 6; height: 12px; border: 2px solid #000; border-radius: 6px; background: #13301f; overflow: hidden; pointer-events: none; }
  .bss-bar i { display: block; height: 100%; width: 0; background: repeating-linear-gradient(90deg, var(--lime) 0 8px, #a5d957 8px 10px); transition: width .2s; }
  .bss-g { position: absolute; width: 92px; height: 92px; margin: -46px 0 0 -46px; border: 0; padding: 0; background: none; cursor: pointer; z-index: 3;
    transition: left var(--mv, .9s) ease-in-out, top var(--mv, .9s) ease-in-out, opacity .25s, transform .25s; }
  .bss-g img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--ink); }
  .bss-g.real img { filter: sepia(1) hue-rotate(55deg) saturate(3) brightness(.95); }
  .bss-g .hat { position: absolute; left: 30px; top: -24px; width: 72px; rotate: 22deg; pointer-events: none; }
  .bss-g .sack { position: absolute; right: -16px; bottom: -6px; font-size: 34px; pointer-events: none; }
  .bss-g.hit img { animation: bssFlash .16s; }
  .bss-g.poof { opacity: 0; transform: scale(.3); pointer-events: none; }
  .bss-g.rage img { box-shadow: 0 0 18px 4px #ff3030; }
  .bss-g.free img { filter: none; }
  @keyframes bssFlash { 50% { filter: brightness(3); transform: scale(.85); } }
  .bss-door { position: absolute; z-index: 4; width: 46px; height: 46px; margin: -23px 0 0 -23px; border: 3px solid var(--ink); border-radius: 9px; padding: 0; cursor: pointer;
    font-family: var(--display); font-weight: 700; font-size: 20px; color: var(--cream); -webkit-text-stroke: 1px var(--ink); paint-order: stroke fill;
    background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,.25) 0 5px, transparent 5px 11px); animation: doorSpin 1.2s linear infinite; }
  @keyframes doorSpin { 50% { rotate: 12deg; } }
  .bss-door.got { animation: doorGot .35s forwards; pointer-events: none; }
  @keyframes doorGot { to { transform: scale(1.8); opacity: 0; } }
  .bss-door.back { transition: left .5s ease-in, top .5s ease-in, transform .5s; transform: scale(.3); pointer-events: none; }
  .bss-pop { position: absolute; z-index: 5; font-family: var(--pixel-font); font-size: 11px; color: #fff; text-shadow: 2px 2px 0 #13573a; pointer-events: none; translate: -50% 0; animation: bssUp 1s ease-out forwards; }
  @keyframes bssUp { to { transform: translateY(-40px); opacity: 0; } }
  .bss-over { position: absolute; inset: 0; z-index: 7; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(5,25,15,.78); padding: 0 16px; }
  .bss-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .bss-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; line-height: 1.45; color: var(--cream); text-shadow: none; }
  `);
  const HAT = `<svg class="hat" viewBox="0 0 100 80"><path d="M8 62 C20 20 60 0 86 18 C74 22 66 34 64 50 Z" fill="#e8414a" stroke="#0a2418" stroke-width="5" stroke-linejoin="round"/><rect x="2" y="54" width="70" height="18" rx="9" fill="#fff" stroke="#0a2418" stroke-width="5"/><circle cx="88" cy="18" r="10" fill="#fff" stroke="#0a2418" stroke-width="5"/></svg>`;
  const COLORS = ["#2f9e5b", "#e8414a", "#ffc83d", "#13573a", "#a6e8bf", "#c9f07a"];

  window.DOOR_TYPES.boss = function (el, day, data, api) {
    const GOAL = 23;
    const T = data.taunts || {};
    const pick = a => a[Math.floor(Math.random() * a.length)];
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="bss-top"><div class="bss-say">${T.start || ""}</div></div>
      <div class="bss-arena">
        <div class="bss-hud"><span class="bss-doors">🚪 0/${GOAL}</span><span class="bss-phase"></span></div>
        <div class="bss-bar"><i></i></div>
        <div class="bss-over"><p>DER ENDBOSS</p><div class="how">${data.how || ""}</div><button class="btn bss-go">⚔️ Los geht's</button></div>
      </div>
      <div class="bss-after"></div>`;
    const ar = el.querySelector(".bss-arena"), say = el.querySelector(".bss-say");
    let sack = [], got = 0, nextNum = 1, running = false, raf = 0, last = 0, doors = [], timers = [], grinches = [];
    const rnd = (a, b) => a + Math.random() * (b - a);
    const talk = t => { say.textContent = t; say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop"); };
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const pop = (x, y, t) => { const d = document.createElement("div"); d.className = "bss-pop"; d.style.left = x + "px"; d.style.top = y + "px"; d.textContent = t; ar.appendChild(d); setTimeout(() => d.remove(), 1000); };
    const phase = () => got >= 17 ? 3 : got >= 8 ? 2 : 1;
    const hud = () => {
      el.querySelector(".bss-doors").textContent = `🚪 ${got}/${GOAL}`;
      el.querySelector(".bss-bar i").style.width = (got / GOAL * 100) + "%";
      el.querySelector(".bss-phase").textContent = ["", "", "SCHNELLER!", "DOPPELGÄNGER!"][phase()];
    };

    function makeGrinch(real) {
      const g = document.createElement("button");
      g.className = "bss-g" + (real ? " real" : "");
      g.innerHTML = `<img src="${real ? data.face : pick(data.decoys || [data.face])}" alt="">${HAT}${real ? '<span class="sack">💰</span>' : ""}`;
      g.style.left = rnd(20, 80) + "%"; g.style.top = rnd(26, 52) + "%";
      g.addEventListener("pointerdown", e => { e.preventDefault(); hitGrinch(g, real); });
      ar.appendChild(g); grinches.push(g);
      return g;
    }
    function relocate(g) { g.style.left = rnd(16, 84) + "%"; g.style.top = rnd(24, 56) + "%"; }
    function teleport(g) { g.classList.add("poof"); later(() => { g.style.setProperty("--mv", "0s"); relocate(g); later(() => { g.style.removeProperty("--mv"); g.classList.remove("poof"); }, 40); }, 260); }
    function behave() {
      if (!running) return;
      const p = phase(), real = grinches.find(g => g.classList.contains("real"));
      // Doppelgänger in Phase 3
      const decoys = grinches.filter(g => !g.classList.contains("real"));
      if (p === 3 && decoys.length < 2) { makeGrinch(false); makeGrinch(false); talk(T.phase3 || "Welche ist die echte? 😈"); }
      grinches.forEach(g => {
        g.style.setProperty("--mv", p === 1 ? ".9s" : ".6s");
        if (p >= 2 && Math.random() < 0.35) teleport(g); else relocate(g);
      });
      if (p >= 2) real.classList.add("rage");
      later(behave, p === 1 ? 1300 : p === 2 ? 1000 : 900);
    }
    function hitGrinch(g, real) {
      if (!running || g.classList.contains("poof")) return;
      g.classList.remove("hit"); void g.offsetWidth; g.classList.add("hit");
      if (navigator.vibrate) navigator.vibrate(10);
      const r = g.getBoundingClientRect(), a = ar.getBoundingClientRect();
      const x = r.left - a.left + r.width / 2, y = r.top - a.top + r.height / 2;
      if (!real) { pop(x, y - 40, "FALSCHE! 😜"); g.classList.add("poof"); later(() => { g.remove(); grinches = grinches.filter(q => q !== g); }, 260); return; }
      if (nextNum > GOAL && !sack.length) return;
      dropDoor(x, y);
      if (Math.random() < 0.3) talk(pick(T.hit || ["Hey! Das ist meins!"]));
      teleport(g); // nach jedem Treffer weicht sie aus
    }
    function dropDoor(x, y) {
      const n = sack.length ? sack.sort((a, b) => a - b).shift() : nextNum++;
      const d = document.createElement("button");
      d.className = "bss-door"; d.textContent = n; d.style.background = COLORS[n % COLORS.length];
      const o = { el: d, n, x: x + rnd(-20, 20), y, vy: -rnd(120, 180), vx: rnd(-60, 60), done: false };
      d.style.left = o.x + "px"; d.style.top = o.y + "px";
      d.addEventListener("pointerdown", e => {
        e.preventDefault(); if (o.done || !running) return;
        o.done = true; d.classList.add("got"); setTimeout(() => d.remove(), 350);
        got++; hud(); pop(o.x, o.y - 30, `+1 🚪`);
        if (navigator.vibrate) navigator.vibrate(18);
        if (got === 8) talk(T.phase2 || "Jetzt werd ich schneller! 😤");
        if (got >= GOAL) win();
      });
      ar.appendChild(d); doors.push(o);
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(50, now - last) / 1000; last = now;
      const floor = ar.clientHeight - 30, W = ar.clientWidth;
      const grav = phase() === 1 ? 220 : phase() === 2 ? 260 : 300;
      for (const o of doors) {
        if (o.done) continue;
        o.vy += grav * dt; o.x = Math.max(24, Math.min(W - 24, o.x + o.vx * dt)); o.y += o.vy * dt;
        o.el.style.left = o.x + "px"; o.el.style.top = o.y + "px";
        if (o.y >= floor) {
          // verpasst: fliegt zurück in den Sack, kommt später nochmal
          o.done = true; sack.push(o.n); o.el.classList.add("back");
          const real = grinches.find(g => g.classList.contains("real"));
          if (real) { o.el.style.left = real.style.left; o.el.style.top = real.style.top; }
          setTimeout(() => o.el.remove(), 500);
          pop(o.x, floor - 30, "Zurück in den Sack!");
          if (Math.random() < 0.5) talk(pick(T.miss || ["Hehe, meins!"]));
        }
      }
      doors = doors.filter(o => !o.done || o.el.isConnected);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      ar.querySelectorAll(".bss-over").forEach(x => x.remove());
      running = true; last = performance.now();
      makeGrinch(true); hud();
      talk(T.go || "Fang mich doch! 😈");
      later(behave, 900);
      raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; }
    function win() {
      stop();
      grinches.filter(g => !g.classList.contains("real")).forEach(g => g.remove());
      const real = grinches.find(g => g.classList.contains("real"));
      if (real) { real.classList.remove("rage", "real"); real.classList.add("free"); if (data.faceWin) real.querySelector("img").src = data.faceWin; real.querySelector(".sack") && real.querySelector(".sack").remove(); real.style.left = "50%"; real.style.top = "45%"; }
      talk(T.final || "Okay, okay! Alle 23 Türchen sind zurück. ❤️");
      ADV.celebrate(ar);
      later(() => ADV.finish(el.querySelector(".bss-after"), day, data, api, { title: data.endTitle || "GESCHAFFT!" }), 900);
      running = false;
    }
    el.querySelector(".bss-go").addEventListener("click", start);
    return () => stop();
  };
})();
