/* Finale: Endbosskampf. Grinch-Leyla hat alle 23 Türchen geklaut. Jan holt sie zurück.
   Boss antippen = Schaden. Was sie wirft (Socken, Kohle) wegtippen, bevor es unten ankommt. ❤️ einsammeln. */
(function () {
  ADV.css("bss-css", `
  .bss-top { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
  .bss-say { flex: 1; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 8px 11px; font-family: var(--display); font-weight: 600; font-size: 16px; min-height: 46px; }
  .bss-say.pop { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  .bss-arena { position: relative; height: min(58svh, 440px); margin-top: 10px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden;
    background: radial-gradient(ellipse at 50% 0, #2f9e5b, #0b3d27 70%); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .bss-arena::after { content: "🎄 🎁 🎄 🎁 🎄"; position: absolute; left: 0; right: 0; bottom: 0; height: 40px; padding-top: 4px; text-align: center; font-size: 20px; letter-spacing: 8px;
    background: #fff; border-top: 3px solid var(--ink); border-radius: 50% 50% 0 0 / 12px 12px 0 0; pointer-events: none; }
  .bss-arena.ouch { animation: bssOuch .35s; }
  @keyframes bssOuch { 30% { box-shadow: inset 0 0 0 999px rgba(232,65,74,.35); } }
  .bss-hud { position: absolute; left: 10px; right: 10px; top: 8px; z-index: 6; display: flex; justify-content: space-between; align-items: center; font-family: var(--pixel-font); font-size: 10px; color: var(--lime); text-shadow: 2px 2px 0 #000; pointer-events: none; }
  .bss-hearts { font-family: system-ui; font-size: 13px; }
  .bss-bar { position: absolute; left: 12px; right: 12px; top: 30px; z-index: 6; height: 12px; border: 2px solid #000; border-radius: 6px; background: #300; overflow: hidden; pointer-events: none; }
  .bss-bar i { display: block; height: 100%; width: 100%; background: linear-gradient(#ff5a5a, #b9252e); transition: width .12s; }
  .bss-boss { position: absolute; top: 56px; width: 104px; height: 104px; margin-left: -52px; border: 0; padding: 0; background: none; cursor: pointer; z-index: 3; transition: left .9s ease-in-out; }
  .bss-boss img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--ink); filter: sepia(1) hue-rotate(55deg) saturate(3) brightness(.95); }
  .bss-boss .hat { position: absolute; left: 34px; top: -26px; width: 80px; rotate: 22deg; pointer-events: none; }
  .bss-boss.hit img { animation: hitFlash .14s; }
  .bss-boss.rage img { filter: sepia(1) hue-rotate(55deg) saturate(4) brightness(.9) drop-shadow(0 0 14px #ff2020); }
  .bss-boss.rage { animation: rageShake .2s linear infinite; }
  .bss-boss.free img { filter: none; }
  @keyframes rageShake { 50% { rotate: 6deg; } }
  @keyframes hitFlash { 50% { filter: brightness(3); transform: scale(.88); } }
  .bss-p { position: absolute; z-index: 4; width: 54px; height: 54px; margin: -27px 0 0 -27px; border: 0; background: none; padding: 0; font-size: 36px; line-height: 54px; cursor: pointer; }
  .bss-p.dead { animation: bssDie .3s forwards; pointer-events: none; }
  @keyframes bssDie { to { transform: scale(1.8); opacity: 0; } }
  .bss-pop { position: absolute; z-index: 5; font-family: var(--pixel-font); font-size: 11px; color: #fff; text-shadow: 2px 2px 0 #b9252e; pointer-events: none; translate: -50% 0; animation: bssUp 1s ease-out forwards; }
  @keyframes bssUp { to { transform: translateY(-40px); opacity: 0; } }
  .bss-over { position: absolute; inset: 0; z-index: 7; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(5,25,15,.78); padding: 0 16px; }
  .bss-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .bss-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; line-height: 1.45; color: var(--cream); text-shadow: none; }
  .bss-gift { display: block; margin: 18px auto 0; border: 0; background: none; font-size: 110px; cursor: pointer; animation: hop 1.2s ease-in-out infinite; filter: drop-shadow(0 0 24px #ffc83d); }
  .bss-gift-t { text-align: center; font-family: var(--display); font-weight: 700; font-size: 22px; color: var(--forest); margin: 0; }
  .bss-letter { background: #fffdf6; border: 3px solid var(--ink); border-radius: 16px; padding: 18px 16px; margin-top: 16px; animation: lineIn .7s cubic-bezier(.3,1.6,.5,1) both; }
  .bss-letter .k { font-family: var(--pixel-font); font-size: 9px; color: var(--leaf); letter-spacing: .1em; margin-bottom: 10px; }
  .bss-letter p { font-weight: 700; font-size: 16px; line-height: 1.55; margin: 0 0 12px; }
  .bss-letter .sig { font-family: var(--display); font-size: 22px; color: var(--red); text-align: right; }
  `);
  const HAT = `<svg class="hat" viewBox="0 0 100 80"><path d="M8 62 C20 20 60 0 86 18 C74 22 66 34 64 50 Z" fill="#e8414a" stroke="#0a2418" stroke-width="5" stroke-linejoin="round"/><rect x="2" y="54" width="70" height="18" rx="9" fill="#fff" stroke="#0a2418" stroke-width="5"/><circle cx="88" cy="18" r="10" fill="#fff" stroke="#0a2418" stroke-width="5"/></svg>`;

  window.DOOR_TYPES.boss = function (el, day, data, api) {
    const HP = data.hp || 40, LIVES = data.lives || 5, DOORS = 23;
    const T = data.taunts || {};
    const pick = a => a[Math.floor(Math.random() * a.length)];
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="bss-top"><div class="bss-say">${T.start || ""}</div></div>
      <div class="bss-arena">
        <div class="bss-hud"><span class="bss-doors">🚪 0/${DOORS}</span><span class="bss-hearts"></span></div>
        <div class="bss-bar"><i></i></div>
        <button class="bss-boss" style="left:50%"><img src="${data.face}" alt="Grinch-Leyla">${HAT}</button>
        <div class="bss-over"><p>DER ENDBOSS</p><div class="how">${data.how || ""}</div><button class="btn bss-go">⚔️ Kampf starten</button></div>
      </div>
      <div class="bss-after"></div>`;
    const ar = el.querySelector(".bss-arena"), boss = el.querySelector(".bss-boss"), say = el.querySelector(".bss-say");
    let hp = HP, lives = LIVES, running = false, raf = 0, last = 0, ps = [], timers = [], phase = 1;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const talk = t => { say.textContent = t; say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop"); };
    const hud = () => {
      el.querySelector(".bss-hearts").textContent = "❤️".repeat(lives) + "🖤".repeat(LIVES - lives);
      el.querySelector(".bss-bar i").style.width = (hp / HP * 100) + "%";
      el.querySelector(".bss-doors").textContent = `🚪 ${Math.round((HP - hp) / HP * DOORS)}/${DOORS}`;
    };
    const pop = (x, y, t) => { const d = document.createElement("div"); d.className = "bss-pop"; d.style.left = x + "px"; d.style.top = y + "px"; d.textContent = t; ar.appendChild(d); setTimeout(() => d.remove(), 1000); };
    const bossX = () => parseFloat(boss.style.left) / 100 * ar.clientWidth;
    hud();

    function move() { if (!running) return; boss.style.left = rnd(18, 82) + "%"; timers.push(setTimeout(move, phase === 3 ? 700 : phase === 2 ? 1000 : 1300)); }
    function throwIt() {
      if (!running) return;
      const good = Math.random() < 0.14;
      const icon = good ? "❤️" : phase === 1 ? "🧦" : pick(["🧦", "🪨"]);
      const b = document.createElement("button"); b.className = "bss-p"; b.textContent = icon;
      const p = { el: b, x: good ? rnd(30, ar.clientWidth - 30) : bossX(), y: 150, vy: good ? 70 : rnd(70, 90) + phase * 18, good, dead: false };
      b.style.left = p.x + "px"; b.style.top = p.y + "px";
      b.addEventListener("pointerdown", e => {
        e.preventDefault(); if (p.dead || !running) return;
        p.dead = true; b.classList.add("dead"); setTimeout(() => b.remove(), 300);
        if (good) { if (lives < LIVES) lives++; hud(); pop(p.x, p.y - 26, "+1 ❤️"); } else pop(p.x, p.y - 26, "💥");
        if (navigator.vibrate) navigator.vibrate(10);
      });
      ar.appendChild(b); ps.push(p);
      timers.push(setTimeout(throwIt, phase === 3 ? 750 : phase === 2 ? 1000 : 1300));
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(50, now - last) / 1000; last = now;
      const floor = ar.clientHeight - 44;
      for (const p of ps) {
        if (p.dead) continue;
        p.y += p.vy * dt; p.el.style.top = p.y + "px";
        if (p.y >= floor) {
          p.dead = true; p.el.classList.add("dead"); setTimeout(() => p.el.remove(), 300);
          if (!p.good) {
            lives--; hud(); ar.classList.remove("ouch"); void ar.offsetWidth; ar.classList.add("ouch");
            if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
            if (lives <= 0) return lose();
          }
        }
      }
      ps = ps.filter(p => !p.dead || p.el.isConnected);
      raf = requestAnimationFrame(loop);
    }
    boss.addEventListener("pointerdown", e => {
      e.preventDefault(); if (!running) return;
      hp--; hud(); boss.classList.remove("hit"); void boss.offsetWidth; boss.classList.add("hit");
      if (navigator.vibrate) navigator.vibrate(8);
      pop(bossX() + rnd(-30, 30), 70, "💥");
      if (phase === 1 && hp <= HP * 0.66) { phase = 2; talk(T.phase2 || "Jetzt wird's ernst! 😤"); }
      if (phase === 2 && hp <= HP * 0.33) { phase = 3; boss.classList.add("rage"); talk(T.phase3 || "GRRR! Meine Türchen!! 😡"); }
      else if (Math.random() < 0.15) talk(pick(T.hit || ["Au!"]));
      if (hp <= 0) win();
    });
    function start() {
      ar.querySelectorAll(".bss-over, .bss-p").forEach(x => x.remove());
      timers.forEach(clearTimeout); timers = []; ps = [];
      hp = HP; lives = LIVES; phase = 1; boss.classList.remove("rage", "free"); hud();
      running = true; last = performance.now();
      talk(T.go || "Die Türchen gehören MIR!");
      timers.push(setTimeout(move, 400)); timers.push(setTimeout(throwIt, 900));
      raf = requestAnimationFrame(loop);
    }
    function stop() { running = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; ar.querySelectorAll(".bss-p").forEach(x => x.remove()); ps = []; }
    function lose() {
      stop();
      const o = document.createElement("div"); o.className = "bss-over";
      o.innerHTML = `<p>GRINCH-LEYLA<br>GEWINNT DIESE RUNDE!</p><button class="btn">🔁 Nochmal kämpfen</button>`;
      o.querySelector("button").addEventListener("click", start); ar.appendChild(o);
      talk(T.leylaWins || "Haha! Nochmal? 😎");
    }
    function win() {
      stop();
      boss.classList.remove("rage"); boss.classList.add("free");
      if (data.faceWin) boss.querySelector("img").src = data.faceWin;
      el.querySelector(".bss-doors").textContent = `🚪 ${DOORS}/${DOORS}`;
      talk(T.final || "Okay, okay! Hier sind deine Türchen zurück. ❤️");
      ADV.celebrate(ar);
      const after = el.querySelector(".bss-after");
      after.innerHTML = `<p class="bss-gift-t">Ein letztes Geschenk wartet noch...</p><button class="bss-gift" aria-label="Geschenk öffnen">🎁</button>`;
      setTimeout(() => ADV.reveal(after), 600);
      after.querySelector(".bss-gift").addEventListener("click", () => {
        const L = data.letter || {};
        after.innerHTML = `<div class="bss-letter"><div class="k">${L.kicker || "EIN BRIEF FÜR DICH"}</div>${(L.paragraphs || []).map(p => `<p>${p}</p>`).join("")}<p class="sig">${L.sign || ""}</p></div><div class="bss-fin"></div>`;
        ADV.celebrate(after);
        setTimeout(() => after.querySelector(".bss-letter").scrollIntoView({ block: "start", behavior: "smooth" }), 200);
        ADV.finish(after.querySelector(".bss-fin"), day, data, api, { title: data.endTitle || "FROHE<br>WEIHNACHTEN, JAN!", noScroll: true });
      });
    }
    el.querySelector(".bss-go").addEventListener("click", start);
    return () => stop();
  };
})();
