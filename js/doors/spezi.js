/* Türchen 1: Spezi-Hommage. Handy schütteln (oder tippen), bis Hütchen und Deckel wegfliegen. */
(function () {
  const css = `
  .spz { text-align: center; padding-top: 4px; }
  .spz-intro { margin: 6px 0 0; }
  .spz-stage { position: relative; height: 380px; margin: 4px auto 0; width: 100%; max-width: 320px; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .spz-stage::before { /* Lichtkranz */
    content: ""; position: absolute; left: 50%; top: 46%; width: 300px; height: 300px; translate: -50% -50%;
    background: repeating-conic-gradient(rgba(255,200,61,.28) 0 10deg, transparent 10deg 20deg);
    border-radius: 50%; mask: radial-gradient(circle, #000 30%, transparent 70%); -webkit-mask: radial-gradient(circle, #000 30%, transparent 70%);
    animation: spin 18s linear infinite;
  }
  .spz-bottle { position: absolute; left: 50%; bottom: 6px; height: 360px; translate: -50% 0; transform-origin: 50% 92%;
    animation: spzIdle 2.2s ease-in-out infinite; cursor: pointer; overflow: visible; }
  @keyframes spzIdle { 0%,100% { rotate: -3deg; } 50% { rotate: 3deg; } }
  .spz-bottle.jiggle { animation: spzJiggle .28s ease-in-out; }
  @keyframes spzJiggle {
    0%,100% { rotate: 0deg; translate: -50% 0; }
    25% { rotate: calc(-1deg * var(--amp)); translate: calc(-50% - 1px * var(--amp)) -4px; }
    75% { rotate: calc(1deg * var(--amp)); translate: calc(-50% + 1px * var(--amp)) -2px; }
  }
  .spz-bottle.blown { animation: spzRecoil .6s cubic-bezier(.3,1.6,.5,1); }
  @keyframes spzRecoil { 0% { scale: 1; } 30% { scale: 1.06 .9; } 100% { scale: 1; } }
  .spz-hat, .spz-cap { transform-box: fill-box; transform-origin: 50% 100%; }
  .spz-hat { animation: hatBob 1.6s ease-in-out infinite; }
  @keyframes hatBob { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  .spz-bottle.blown .spz-hat { animation: hatFly 1.5s cubic-bezier(.2,.7,.4,1) forwards; }
  .spz-bottle.blown .spz-cap { animation: capFly 1.3s cubic-bezier(.2,.7,.4,1) forwards; }
  @keyframes hatFly { to { transform: translate(-260px, -620px) rotate(-700deg) scale(.7); opacity: 0; } }
  @keyframes capFly { to { transform: translate(190px, -700px) rotate(900deg); opacity: 0; } }
  .spz-bubble { animation: rise var(--t) linear infinite; animation-delay: var(--dl); }
  @keyframes rise { from { transform: translateY(0); opacity: 0; } 15% { opacity: .9; } to { transform: translateY(-250px); opacity: 0; } }
  .spz-bubbles { opacity: var(--fizz, .25); transition: opacity .3s; }
  .spz-meter { margin: 10px auto 0; max-width: 300px; }
  .spz-meter-label { display: flex; justify-content: space-between; font-family: var(--display); font-weight: 700; font-size: 15px; margin-bottom: 6px; }
  .spz-bar { height: 26px; border: 3px solid var(--ink); border-radius: 999px; background: #fff; overflow: hidden; box-shadow: 3px 3px 0 var(--ink); }
  .spz-fill { height: 100%; width: 0%; background: repeating-linear-gradient(-45deg, #ff9a1f 0 10px, #ffc83d 10px 20px); border-right: 3px solid var(--ink);
    transition: width .25s cubic-bezier(.3,1.5,.5,1); animation: barMove .6s linear infinite; background-size: 28px 28px; }
  @keyframes barMove { to { background-position: 28px 0; } }
  .spz-hint { margin: 14px 0 0; font-weight: 800; min-height: 1.4em; }
  .spz-hint b { display: inline-block; animation: hop 1s ease-in-out infinite; }
  .spz-start { margin-top: 16px; }
  .spz-reveal { display: none; margin-top: 8px; }
  .spz.done .spz-reveal { display: block; }
  .spz.done .spz-controls { display: none; }
  .spz-line { font-family: var(--display); font-weight: 700; font-size: 26px; line-height: 1.15; margin: 12px 0; opacity: 0; color: var(--forest);
    animation: lineIn .7s cubic-bezier(.3,1.6,.5,1) forwards; }
  .spz-line.big { font-size: 32px; color: var(--ink); background: var(--lime); border: 3.5px solid var(--ink); border-radius: 20px; padding: 14px 12px; box-shadow: var(--shadow); rotate: -2deg; }
  .spz-fridge { display: inline-block; font-size: 64px; animation: fridge 1.2s ease-in-out infinite; }
  @keyframes fridge { 0%,100% { rotate: -8deg; scale: 1; } 50% { rotate: 8deg; scale: 1.12; } }
  @keyframes lineIn { from { opacity: 0; transform: translateY(30px) scale(.7) rotate(-6deg); } to { opacity: 1; transform: none; } }
  .spz-again { margin-top: 18px; }
  `;

  const bottleSVG = `
  <svg class="spz-bottle" viewBox="-40 -80 240 540" aria-label="Spezi-Flasche mit Partyhütchen">
    <defs>
      <linearGradient id="spzGlass" x1="0" x2="1">
        <stop offset="0" stop-color="#3a1805"/><stop offset=".35" stop-color="#7a3a10"/><stop offset=".6" stop-color="#5a280a"/><stop offset="1" stop-color="#2b1003"/>
      </linearGradient>
      <linearGradient id="spzLabel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffe14a"/><stop offset="1" stop-color="#ffb21e"/>
      </linearGradient>
      <clipPath id="spzBody"><path d="M67,72 L67,150 C67,175 28,190 28,225 L28,408 Q28,424 44,424 L116,424 Q132,424 132,408 L132,225 C132,190 93,175 93,150 L93,72 Z"/></clipPath>
      <clipPath id="spzLab"><rect x="28" y="252" width="104" height="120"/></clipPath>
    </defs>
    <ellipse cx="80" cy="430" rx="62" ry="9" fill="#0a2418" opacity=".25"/>
    <path d="M67,72 L67,150 C67,175 28,190 28,225 L28,408 Q28,424 44,424 L116,424 Q132,424 132,408 L132,225 C132,190 93,175 93,150 L93,72 Z" fill="url(#spzGlass)"/>
    <g clip-path="url(#spzBody)">
      <g class="spz-bubbles">
        ${Array.from({ length: 16 }, (_, i) => `<circle class="spz-bubble" cx="${38 + (i * 37) % 86}" cy="${410 - (i % 4) * 8}" r="${2 + (i % 3)}" fill="#ffd9a8" style="--t:${1.6 + (i % 5) * 0.35}s;--dl:${-(i * 0.23)}s"/>`).join("")}
      </g>
      <rect x="40" y="200" width="11" height="200" rx="5" fill="#fff" opacity=".22"/>
      <rect x="72" y="80" width="6" height="80" rx="3" fill="#fff" opacity=".2"/>
    </g>
    <!-- Etikett -->
    <g clip-path="url(#spzLab)">
      <rect x="28" y="252" width="104" height="120" fill="url(#spzLabel)"/>
      <path d="M20 300 Q45 280 70 300 T120 300 T170 300 V380 H20Z" fill="#ff8a1e"/>
      <path d="M20 330 Q45 312 70 330 T120 330 T170 330 V380 H20Z" fill="#e8312a"/>
      <path d="M20 352 Q45 338 70 352 T120 352 T170 352 V380 H20Z" fill="#2f9e5b"/>
    </g>
    <rect x="28" y="252" width="104" height="120" fill="none" stroke="#0a2418" stroke-width="3"/>
    <text x="80" y="300" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="34" fill="#fff" stroke="#0a2418" stroke-width="5" paint-order="stroke" transform="rotate(-8 80 290)">Spezi</text>
    <text x="80" y="364" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="10" fill="#fff5df" letter-spacing="1">EDITION JAN</text>
    <!-- Halsetikett -->
    <path d="M67 104 H93 V134 H67 Z" fill="#ff8a1e" stroke="#0a2418" stroke-width="2.5"/>
    <path d="M80 126 C70 118 72 110 77 111 C79 111 80 113 80 114 C80 113 81 111 83 111 C88 110 90 118 80 126Z" fill="#e8312a"/>
    <path d="M67,72 L67,150 C67,175 28,190 28,225 L28,408 Q28,424 44,424 L116,424 Q132,424 132,408 L132,225 C132,190 93,175 93,150 L93,72 Z" fill="none" stroke="#0a2418" stroke-width="5" stroke-linejoin="round"/>
    <!-- Kronkorken -->
    <g class="spz-cap">
      <path d="M62 60 H98 V72 L95 76 L91 72 L87 76 L83 72 L79 76 L75 72 L71 76 L67 72 L64 76 L62 72 Z" fill="#ffc83d" stroke="#0a2418" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="62" y="55" width="36" height="8" rx="3" fill="#ffe08a" stroke="#0a2418" stroke-width="3.5"/>
    </g>
    <!-- Partyhütchen -->
    <g class="spz-hat">
      <path d="M50 58 L80 -38 L110 58 Z" fill="#2f9e5b" stroke="#0a2418" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M60 26 L100 26 L104 38 L56 38 Z M70 -6 L90 -6 L93 4 L67 4 Z" fill="#c9f07a"/>
      <circle cx="68" cy="48" r="4" fill="#ffc83d"/><circle cx="92" cy="50" r="4" fill="#e8414a"/><circle cx="80" cy="14" r="3.5" fill="#e8414a"/>
      <path d="M50 58 L80 -38 L110 58 Z" fill="none" stroke="#0a2418" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M44 60 Q80 70 116 60" fill="none" stroke="#e8414a" stroke-width="7" stroke-linecap="round"/>
      <path d="M44 60 Q80 70 116 60" fill="none" stroke="#0a2418" stroke-width="2" stroke-linecap="round" opacity=".5"/>
      <g transform="translate(80 -42)">
        <circle r="13" fill="#ffc83d" stroke="#0a2418" stroke-width="4"/>
        <path d="M-6 -4 L6 4 M-6 4 L6 -4 M0 -7 V7" stroke="#e8414a" stroke-width="3" stroke-linecap="round"/>
      </g>
    </g>
  </svg>`;

  window.DOOR_TYPES.spezi = function (el, day, data) {
    if (!document.getElementById("spz-css")) {
      const s = document.createElement("style"); s.id = "spz-css"; s.textContent = css; document.head.appendChild(s);
    }
    el.innerHTML = `
      <div class="spz">
        <p class="lead spz-intro">${data.intro || "Schüttel dein Handy!"}</p>
        <div class="spz-stage">${bottleSVG}</div>
        <div class="spz-controls">
          <div class="spz-meter">
            <div class="spz-meter-label"><span>Sprudel-O-Meter</span><span class="spz-pct">0 %</span></div>
            <div class="spz-bar"><div class="spz-fill"></div></div>
          </div>
          <button class="btn spz-start">📳 Los, schütteln!</button>
          <p class="spz-hint"></p>
        </div>
        <div class="spz-reveal">
          ${(data.lines || []).map((l, i, arr) => `<p class="spz-line ${i === arr.length - 1 ? "big" : ""}" style="animation-delay:${0.2 + i * 0.9}s">${l}${i === arr.length - 1 ? '<br><span class="spz-fridge">🧊</span>' : ""}</p>`).join("")}
          <button class="btn secondary spz-again" style="opacity:0;animation:lineIn .6s ${0.4 + (data.lines || []).length * 0.9}s forwards">🔁 Nochmal schütteln</button>
        </div>
      </div>`;

    const root = el.querySelector(".spz");
    const bottle = root.querySelector(".spz-bottle");
    const fill = root.querySelector(".spz-fill");
    const pct = root.querySelector(".spz-pct");
    const hint = root.querySelector(".spz-hint");
    const startBtn = root.querySelector(".spz-start");
    const bubbles = root.querySelector(".spz-bubbles");

    let progress = 0, done = false, listening = false, lastShake = 0, motionSeen = false;
    let last = null;

    function setProgress(p) {
      progress = Math.min(1, p);
      fill.style.width = (progress * 100).toFixed(0) + "%";
      pct.textContent = Math.round(progress * 100) + " %";
      bubbles.style.setProperty("--fizz", (0.25 + progress * 0.75).toFixed(2));
      if (progress >= 1 && !done) blow();
    }

    function jiggle(strength) {
      bottle.style.setProperty("--amp", (4 + progress * 14) * strength);
      bottle.classList.remove("jiggle"); void bottle.getBoundingClientRect(); bottle.classList.add("jiggle");
      const r = bottle.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height * 0.25, { count: 4 + Math.round(progress * 8), colors: ["#fff", "#ffe1b8", "#ffd2a0"], shapes: ["circle"], speed: 5 + progress * 4, spread: 70, gravity: 0.15, size: 7, life: 50, outline: true });
    }

    function shake(amount, strength = 1) {
      if (done) return;
      const now = Date.now();
      if (now - lastShake < 110) return;
      lastShake = now;
      jiggle(strength);
      if (navigator.vibrate) navigator.vibrate(15);
      setProgress(progress + amount);
    }

    function onMotion(e) {
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a || a.x == null) return;
      motionSeen = true;
      if (last) {
        const d = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z);
        if (d > 16) shake(Math.min(0.09, d / 400), Math.min(1.6, d / 25));
      }
      last = { x: a.x, y: a.y, z: a.z };
    }

    function listen() {
      if (listening) return;
      listening = true;
      addEventListener("devicemotion", onMotion);
      hint.innerHTML = "<b>Schütteln, schütteln, schütteln!</b>";
      setTimeout(() => {
        if (!motionSeen && !done) hint.innerHTML = "Kein Bewegungssensor? <b>Tipp einfach ganz oft auf die Flasche!</b>";
      }, 1800);
    }

    startBtn.addEventListener("click", async () => {
      startBtn.style.display = "none";
      const DME = window.DeviceMotionEvent;
      if (DME && typeof DME.requestPermission === "function") {
        try {
          const res = await DME.requestPermission();
          if (res === "granted") listen();
          else hint.innerHTML = "Okay, dann eben so: <b>Tipp ganz oft auf die Flasche!</b>";
        } catch (e) {
          hint.innerHTML = "<b>Tipp ganz oft auf die Flasche!</b>";
        }
      } else if (DME) {
        listen();
      } else {
        hint.innerHTML = "<b>Tipp ganz oft auf die Flasche!</b>";
      }
    });

    // Tippen als Fallback (funktioniert immer)
    bottle.addEventListener("pointerdown", e => { e.preventDefault(); shake(0.1, 1.1); });

    function blow() {
      done = true;
      removeEventListener("devicemotion", onMotion);
      bottle.classList.remove("jiggle");
      bottle.classList.add("blown");
      if (navigator.vibrate) navigator.vibrate([90, 50, 160]);
      const r = bottle.getBoundingClientRect();
      const neckX = r.left + r.width * 0.5, neckY = r.top + r.height * 0.24;
      // Sprudel-Fontäne
      let n = 0;
      const iv = setInterval(() => {
        FX.burst(neckX, neckY, { count: 22, colors: ["#fff", "#ffe9c9", "#ffcf8a", "#c67a2b"], shapes: ["circle"], speed: 17, spread: 34, angle: -90, gravity: 0.38, size: 10, life: 110, outline: true });
        if (++n > 9) clearInterval(iv);
      }, 70);
      setTimeout(() => {
        FX.burst(neckX, neckY, { count: 180, speed: 19 });
        FX.rain(140);
      }, 350);
      setTimeout(() => {
        root.classList.add("done");
        root.querySelector(".spz-reveal").scrollIntoView({ behavior: "smooth", block: "start" });
      }, 1300);
    }

    root.querySelector(".spz-again").addEventListener("click", () => {
      window.DOOR_TYPES.spezi(el, day, data);
      el.querySelector(".spz-start").click();
    });

    return () => removeEventListener("devicemotion", onMotion);
  };
})();
