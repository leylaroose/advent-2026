/* Das große Finale: 3 kurze Runden, danach die Bildergeschichte (wrapped.js) */
(function () {
  ADV.css("fin-css", `
  .fin-round { text-align: center; animation: riseIn .5s cubic-bezier(.3,1.5,.5,1) both; }
  .fin-k { font-family: var(--pixel-font); font-size: 10px; color: var(--leaf); letter-spacing: .08em; margin-top: 6px; }
  .fin-h { font-family: var(--display); font-weight: 700; font-size: 26px; color: var(--forest); margin: 6px 0 2px; }
  .fin-p { font-weight: 800; margin: 0 0 10px; }
  .fin-steps { display: flex; justify-content: center; gap: 8px; margin: 4px 0 6px; }
  .fin-steps i { width: 30px; height: 8px; border-radius: 4px; background: #d9e7de; border: 2px solid var(--ink); }
  .fin-steps i.on { background: var(--lime); } .fin-steps i.cur { background: var(--gold); }
  .fin-bottle { width: 110px; margin: 6px auto 0; display: block; cursor: pointer; touch-action: manipulation; user-select: none; }
  .fin-bottle.jig { animation: finJig .15s; }
  @keyframes finJig { 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
  .fin-bar { height: 18px; max-width: 260px; margin: 10px auto 0; border: 3px solid var(--ink); border-radius: 999px; background: #fff; overflow: hidden; }
  .fin-bar i { display: block; height: 100%; width: 0; background: repeating-linear-gradient(-45deg, #ff9a1f 0 8px, #ffc83d 8px 16px); transition: width .15s; }
  .fin-holes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 300px; margin: 8px auto 0; }
  .fin-hole { position: relative; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 50% 40%, #1d4a33, #0a2418 70%); border: 3px solid var(--ink); box-shadow: inset 0 8px 0 rgba(0,0,0,.35), 0 3px 0 #a6e8bf; overflow: hidden; touch-action: manipulation; }
  .fin-hole img { position: absolute; left: 10%; top: 10%; width: 80%; height: 80%; border-radius: 50%; object-fit: cover; transform: translateY(110%); transition: transform .18s; }
  .fin-hole.up img { transform: none; }
  .fin-hole.hit img { filter: brightness(2); transform: scale(.7); }
  .fin-tree { position: relative; width: 240px; height: 290px; margin: 6px auto 0; }
  .fin-tree svg { width: 100%; height: 100%; }
  .fin-spot { position: absolute; width: 38px; height: 38px; margin: -19px 0 0 -19px; border-radius: 50%; border: 3px dashed #fff; background: rgba(255,255,255,.25);
    animation: playPulse 1s ease-in-out infinite; cursor: pointer; padding: 0; font-size: 26px; line-height: 30px; }
  .fin-spot.done { border: 0; background: none; animation: popOk .4s; }
  .fin-tree.lit svg .lights circle { animation: blink .5s steps(1) infinite; }
  .fin-story-intro { font-weight: 800; text-align: center; margin: 4px 0 0; }
  `);
  const TREE = `<svg viewBox="0 0 240 290"><path d="M120 22 L200 130 H170 L222 220 H18 L70 130 H40 Z" fill="#2f9e5b" stroke="#0a2418" stroke-width="5" stroke-linejoin="round"/>
    <path d="M60 170 Q120 195 182 165 M78 110 Q120 128 162 106" fill="none" stroke="#ffc83d" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>
    <rect x="104" y="220" width="32" height="40" fill="#7a4a21" stroke="#0a2418" stroke-width="5"/>
    <g class="lights">${[[90, 150, "#e8414a"], [150, 140, "#ffc83d"], [120, 190, "#7fd7ff"], [70, 200, "#ffc83d"], [170, 195, "#e8414a"], [110, 90, "#c9f07a"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`).join("")}</g></svg>`;

  window.DOOR_TYPES.final = function (el, day, data, api) {
    el.innerHTML = `<p class="lead">${data.intro || ""}</p><div class="fin-steps"><i></i><i></i><i></i><i></i></div><div class="fin-stage"></div>`;
    const stage = el.querySelector(".fin-stage"), steps = [...el.querySelectorAll(".fin-steps i")];
    const timers = [];
    const step = n => steps.forEach((s, i) => s.className = i < n ? "on" : i === n ? "cur" : "");
    const next = (fn, n) => { step(n); ADV.celebrate(stage, false); timers.push(setTimeout(fn, 900)); };

    // Runde 1: Spezi-Speedrun
    function r1() {
      step(0);
      stage.innerHTML = `<div class="fin-round"><div class="fin-k">RUNDE 1 VON 3</div><div class="fin-h">Spezi-Speedrun</div><p class="fin-p">Wie an Tag 1: Tipp ganz schnell auf die Flasche!</p>
        <img class="fin-bottle" src="img/spezi-flasche.png" alt="Spezi"><div class="fin-bar"><i></i></div></div>`;
      let p = 0; const bot = stage.querySelector(".fin-bottle"), bar = stage.querySelector(".fin-bar i");
      bot.addEventListener("pointerdown", e => {
        e.preventDefault(); if (p >= 1) return;
        p = Math.min(1, p + 0.08); bar.style.width = p * 100 + "%";
        bot.classList.remove("jig"); void bot.offsetWidth; bot.classList.add("jig");
        if (navigator.vibrate) navigator.vibrate(8);
        if (p >= 1) next(r2, 1);
      });
    }
    // Runde 2: Grinch-Leyla fangen
    function r2() {
      stage.innerHTML = `<div class="fin-round"><div class="fin-k">RUNDE 2 VON 3</div><div class="fin-h">Grinch-Leyla ist zurück!</div><p class="fin-p">Fang sie 6 Mal, wenn sie auftaucht. <span class="fin-n">0/6</span></p>
        <div class="fin-holes">${Array.from({ length: 9 }, (_, i) => `<div class="fin-hole" data-i="${i}"><img src="${data.grinch || "img/grinch-leyla.jpg"}" alt=""></div>`).join("")}</div></div>`;
      const holes = [...stage.querySelectorAll(".fin-hole")]; let got = 0, cur = -1, t = 0;
      const pop = () => {
        holes.forEach(h => h.classList.remove("up", "hit"));
        let i; do { i = Math.floor(Math.random() * 9); } while (i === cur);
        cur = i; holes[i].classList.add("up");
        t = setTimeout(pop, 1100); timers.push(t);
      };
      holes.forEach(h => h.addEventListener("pointerdown", e => {
        e.preventDefault();
        if (!h.classList.contains("up") || h.classList.contains("hit")) return;
        h.classList.add("hit"); got++; stage.querySelector(".fin-n").textContent = `${got}/6`;
        if (navigator.vibrate) navigator.vibrate(15);
        clearTimeout(t);
        if (got >= 6) return next(r3, 2);
        t = setTimeout(pop, 350); timers.push(t);
      }));
      timers.push(setTimeout(pop, 500));
    }
    // Runde 3: Baum schmücken
    function r3() {
      const spots = [[78, 152, "🔴"], [162, 150, "🟡"], [120, 112, "🔵"], [58, 196, "⭐"], [184, 198, "🎀"], [120, 172, "🟢"]];
      stage.innerHTML = `<div class="fin-round"><div class="fin-k">RUNDE 3 VON 3</div><div class="fin-h">Schmück unseren Baum</div><p class="fin-p">Tipp auf die leuchtenden Stellen. Zum Schluss kommt der Stern.</p>
        <div class="fin-tree">${TREE}${spots.map(([x, y], i) => `<button class="fin-spot" data-i="${i}" style="left:${x / 240 * 100}%;top:${y / 290 * 100}%"></button>`).join("")}<button class="fin-spot fin-star" style="left:50%;top:7%;display:none"></button></div></div>`;
      let n = 0; const star = stage.querySelector(".fin-star");
      stage.querySelectorAll(".fin-spot:not(.fin-star)").forEach(b => b.addEventListener("click", () => {
        if (b.classList.contains("done")) return;
        b.classList.add("done"); b.textContent = spots[+b.dataset.i][2]; n++;
        if (navigator.vibrate) navigator.vibrate(12);
        if (n === spots.length) star.style.display = "";
      }));
      star.addEventListener("click", () => {
        star.classList.add("done"); star.textContent = "⭐"; star.style.fontSize = "40px";
        stage.querySelector(".fin-tree").classList.add("lit");
        if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
        next(story, 3);
      });
    }
    // Danach: die Bildergeschichte mit Brief
    function story() {
      step(4);
      stage.innerHTML = `<p class="fin-story-intro">${data.storyIntro || ""}</p><div class="fin-wrp"></div>`;
      const d = Object.assign({}, data, { intro: "" });
      const c = window.DOOR_TYPES.wrapped(stage.querySelector(".fin-wrp"), day, d, api);
      if (c) timers.push({ c });
    }
    if (api && api.cleared) story(); else r1();
    return () => timers.forEach(x => { if (x && x.c) x.c(); else clearTimeout(x); });
  };
})();
