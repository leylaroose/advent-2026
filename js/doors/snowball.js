/* Schneeballschlacht gegen Leyla: Leyla taucht hinter Schneewällen auf (antippen = Treffer).
   Wirft sie zurück, fliegt ein Schneeball auf Jan zu: antippen, bevor er trifft. */
(function () {
  ADV.css("sbl-css", `
  .sbl-top { display: flex; align-items: center; gap: 10px; margin-top: 4px; min-height: 52px; }
  .sbl-say { position: relative; flex: 1; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 8px 11px; font-family: var(--display); font-weight: 600; font-size: 16px; }
  .sbl-say.pop { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  .sbl-arena { position: relative; height: min(52svh, 400px); margin-top: 10px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden;
    background: linear-gradient(#bfe3f5, #e9f7ff 70%); touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .sbl-hud { position: absolute; left: 10px; right: 10px; top: 8px; z-index: 6; display: flex; justify-content: space-between; font-family: var(--pixel-font); font-size: 10px; color: var(--ink); pointer-events: none; }
  .sbl-slot { position: absolute; bottom: 0; width: 33.33%; height: 62%; }
  .sbl-face { position: absolute; left: 50%; bottom: 40%; width: 78px; height: 78px; margin-left: -39px; border-radius: 50%; overflow: hidden; border: 3px solid var(--ink);
    transform: translateY(120%); transition: transform .18s ease-out; z-index: 1; cursor: pointer; }
  .sbl-face img { width: 100%; height: 100%; object-fit: cover; }
  .sbl-slot.up .sbl-face { transform: none; }
  .sbl-slot.hit .sbl-face { transform: rotate(-12deg); }
  .sbl-slot.hit .sbl-face::after { content: ""; position: absolute; inset: 10% 0 30% 20%; background: radial-gradient(circle, #fff 45%, transparent 47%), radial-gradient(circle at 30% 70%, #fff 30%, transparent 32%); }
  .sbl-wall { position: absolute; left: 6%; right: 6%; bottom: 0; height: 42%; background: #fff; border: 3px solid var(--ink); border-bottom: 0; border-radius: 40px 40px 0 0; z-index: 2;
    box-shadow: inset 0 -10px 0 #d6ecf7; }
  .sbl-ball { position: absolute; z-index: 4; width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff, #d6ecf7); border: 3px solid var(--ink);
    padding: 0; cursor: pointer; transition: transform var(--t) linear, left var(--t) linear, top var(--t) linear; }
  .sbl-ball.go { transform: scale(3.4); }
  .sbl-ball.pop { transition: transform .2s, opacity .2s; transform: scale(4); opacity: 0; pointer-events: none; }
  .sbl-splat { position: absolute; inset: 0; z-index: 5; pointer-events: none; background: radial-gradient(circle at 50% 55%, rgba(255,255,255,.95) 25%, rgba(255,255,255,.6) 40%, transparent 60%);
    opacity: 0; transition: opacity .8s; }
  .sbl-splat.on { opacity: 1; transition: none; }
  .sbl-over { position: absolute; inset: 0; z-index: 7; display: grid; place-items: center; align-content: center; gap: 12px; text-align: center; background: rgba(10,36,24,.72); padding: 0 16px; }
  .sbl-over p { margin: 0; font-family: var(--pixel-font); font-size: 12px; line-height: 1.8; color: var(--lime); text-shadow: 2px 2px 0 #000; }
  .sbl-over .how { font-family: var(--body); font-weight: 800; font-size: 15px; color: var(--cream); text-shadow: none; }
  `);

  window.DOOR_TYPES.snowball = function (el, day, data, api) {
    const GOAL = data.goal || 8, LIVES = data.lives || 3;
    const F = data.faces || {}, T = data.taunts || {};
    const pick = a => a[Math.floor(Math.random() * a.length)];
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="sbl-top"><div class="sbl-say">${T.start || ""}</div></div>
      <div class="sbl-arena">
        <div class="sbl-hud"><span class="sbl-score">❄ 0/${GOAL}</span><span class="sbl-lives"></span></div>
        ${[0, 1, 2].map(i => `<div class="sbl-slot" data-i="${i}" style="left:${i * 33.33}%"><div class="sbl-face"><img src="${F.normal}" alt=""></div><div class="sbl-wall"></div></div>`).join("")}
        <div class="sbl-splat"></div>
        <div class="sbl-over"><p>SCHNEEBALLSCHLACHT!</p><div class="how">${data.how || ""}</div><button class="btn sbl-go">❄️ Los!</button></div>
      </div>
      <div class="sbl-after"></div>`;
    const ar = el.querySelector(".sbl-arena"), say = el.querySelector(".sbl-say");
    const slots = [...el.querySelectorAll(".sbl-slot")];
    let score = 0, lives = LIVES, running = false, cur = -1, timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    const hud = () => { el.querySelector(".sbl-score").textContent = `❄ ${score}/${GOAL}`; el.querySelector(".sbl-lives").textContent = "❤️".repeat(lives) + "🖤".repeat(LIVES - lives); };
    const talk = t => { say.textContent = t; say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop"); };
    const setFace = (s, k) => { s.querySelector("img").src = F[k] || F.normal; };
    hud();

    function peek() {
      if (!running) return;
      slots.forEach(s => s.classList.remove("up", "hit"));
      let i; do { i = Math.floor(Math.random() * 3); } while (i === cur);
      cur = i; const s = slots[i]; setFace(s, "normal"); s.classList.add("up");
      const stay = Math.max(600, 1000 - score * 45);
      // manchmal wirft sie zurück
      if (Math.random() < 0.65) later(() => { if (running && s.classList.contains("up") && !s.classList.contains("hit")) throwBall(s); }, stay * 0.45);
      later(() => { s.classList.remove("up"); later(peek, 350); }, stay);
    }
    function throwBall(s) {
      const r = s.getBoundingClientRect(), a = ar.getBoundingClientRect();
      const b = document.createElement("button");
      b.className = "sbl-ball"; b.setAttribute("aria-label", "Schneeball");
      const dur = Math.max(650, 1050 - score * 40);
      b.style.setProperty("--t", dur + "ms");
      b.style.left = r.left - a.left + r.width / 2 + "px"; b.style.top = a.height * 0.45 + "px";
      ar.appendChild(b);
      let blocked = false;
      b.addEventListener("pointerdown", e => { e.preventDefault(); blocked = true; b.classList.add("pop"); later(() => b.remove(), 250); if (navigator.vibrate) navigator.vibrate(10); });
      requestAnimationFrame(() => requestAnimationFrame(() => { b.classList.add("go"); b.style.left = a.width / 2 + "px"; b.style.top = a.height * 0.6 + "px"; }));
      talk(pick(T.throw || ["Achtung! ❄️"]));
      later(() => {
        if (blocked || !running) { b.remove(); return; }
        b.remove(); lives--; hud();
        const sp = ar.querySelector(".sbl-splat"); sp.classList.add("on"); later(() => sp.classList.remove("on"), 60);
        if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
        talk(pick(T.leylaHit || ["Volltreffer! 😎"]));
        if (lives <= 0) lose();
      }, dur);
    }
    slots.forEach(s => s.querySelector(".sbl-face").addEventListener("pointerdown", e => {
      e.preventDefault();
      if (!running || !s.classList.contains("up") || s.classList.contains("hit")) return;
      s.classList.add("hit"); setFace(s, "mad"); score++; hud();
      if (navigator.vibrate) navigator.vibrate(15);
      const r = s.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height * 0.4, { count: 22, colors: ["#fff", "#dff2fb"], shapes: ["circle"], speed: 7, size: 9, life: 50 });
      talk(pick(T.janHit || ["Hey!! 😤"]));
      if (score >= GOAL) win();
    }));
    function start() {
      ar.querySelectorAll(".sbl-over, .sbl-ball").forEach(x => x.remove());
      timers.forEach(clearTimeout); timers = [];
      score = 0; lives = LIVES; hud(); running = true; cur = -1;
      later(peek, 500);
    }
    function stop() { running = false; timers.forEach(clearTimeout); timers = []; ar.querySelectorAll(".sbl-ball").forEach(x => x.remove()); }
    function lose() {
      stop();
      const o = document.createElement("div"); o.className = "sbl-over";
      o.innerHTML = `<p>EINGESCHNEIT! ⛄<br>❄ ${score}/${GOAL}</p><button class="btn">🔁 Revanche</button>`;
      o.querySelector("button").addEventListener("click", start); ar.appendChild(o);
      talk(T.leylaWins || "Haha, gewonnen! Revanche? 😎");
    }
    function win() {
      stop();
      slots.forEach(s => s.classList.remove("up", "hit"));
      const s = slots[1]; setFace(s, "wow"); s.classList.add("up");
      talk(T.final || "Okay, ich ergebe mich! ❤️");
      ADV.finish(el.querySelector(".sbl-after"), day, data, api, { title: data.endTitle || "SCHNEEBALL-<br>SCHLACHT GEWONNEN!" });
    }
    el.querySelector(".sbl-go").addEventListener("click", start);
    return () => stop();
  };
})();
