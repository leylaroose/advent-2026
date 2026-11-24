/* Rette den Schneemann: Buchstaben raten. Jeder Fehler lässt den Schneemann ein Stück schmelzen. */
(function () {
  ADV.css("hng-css", `
  .hng-man { position: relative; height: 150px; margin: 4px auto 0; width: 150px; }
  .hng-man svg { width: 100%; height: 100%; overflow: visible; }
  .hng-man .part { transition: opacity .5s, transform .6s; transform-box: fill-box; transform-origin: 50% 100%; }
  .hng-man .part.gone { opacity: 0; transform: scaleY(.2) translateY(30px); }
  .hng-sun { position: absolute; right: -6px; top: -4px; font-size: 34px; opacity: calc(var(--m) / 6); transition: opacity .5s; }
  .hng-word { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 14px; margin: 14px 0 6px; }
  .hng-w { display: flex; gap: 4px; }
  .hng-l { width: 24px; height: 34px; border-bottom: 3px solid var(--ink); display: grid; place-items: center; font-family: var(--display); font-weight: 700; font-size: 24px; color: var(--forest); }
  .hng-l.show { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  .hng-lives { text-align: center; font-family: var(--pixel-font); font-size: 10px; color: var(--forest); margin: 2px 0 8px; }
  .hng-kb { display: grid; gap: 6px; user-select: none; -webkit-user-select: none; }
  .hng-kr { display: flex; gap: 4px; justify-content: center; }
  .hng-k { flex: 1; max-width: 36px; height: 44px; border: 2.5px solid var(--ink); border-radius: 8px; background: #fff; font-family: var(--display); font-weight: 700;
    font-size: 17px; color: var(--ink); box-shadow: 1px 2px 0 var(--ink); padding: 0; cursor: pointer; }
  .hng-k.ok { background: var(--leaf); color: #fff; } .hng-k.no { background: #c9d3cd; color: #7d8f85; box-shadow: none; }
  .hng-k[disabled] { cursor: default; }
  `);

  const SNOWMAN = `<svg viewBox="0 0 120 130">
    <ellipse cx="60" cy="124" rx="44" ry="6" fill="#0a2418" opacity=".15"/>
    <g class="part p0"><circle cx="60" cy="98" r="28" fill="#fff" stroke="#0a2418" stroke-width="4"/></g>
    <g class="part p1"><circle cx="60" cy="56" r="21" fill="#fff" stroke="#0a2418" stroke-width="4"/><circle cx="60" cy="50" r="3" fill="#0a2418"/><circle cx="60" cy="62" r="3" fill="#0a2418"/></g>
    <g class="part p2"><path d="M40 56 L14 44 M80 56 L106 44" stroke="#7a4a21" stroke-width="4" stroke-linecap="round"/></g>
    <g class="part p3"><circle cx="60" cy="24" r="16" fill="#fff" stroke="#0a2418" stroke-width="4"/><circle cx="54" cy="21" r="2.5" fill="#0a2418"/><circle cx="66" cy="21" r="2.5" fill="#0a2418"/></g>
    <g class="part p4"><path d="M60 26 L76 30 L60 31 Z" fill="#ff8a1e" stroke="#0a2418" stroke-width="2"/></g>
    <g class="part p5"><rect x="44" y="2" width="32" height="8" rx="3" fill="#e8414a" stroke="#0a2418" stroke-width="3"/><path d="M48 4 Q60 -16 72 4" fill="#e8414a" stroke="#0a2418" stroke-width="3"/><path d="M44 38 Q60 44 76 38 L78 46 L72 46 L72 56 L66 56 L66 46 L44 44 Z" fill="#2f9e5b" stroke="#0a2418" stroke-width="3" stroke-linejoin="round"/></g>
  </svg>`;

  window.DOOR_TYPES.hangman = function (el, day, data, api) {
    const PH = (data.phrase || "FROHE WEIHNACHTEN").toUpperCase();
    const MAX = 6;
    const letters = new Set([...PH].filter(c => /[A-ZÄÖÜ]/.test(c)));
    const guessed = new Set();
    let miss = 0, over = false;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="hng-man" style="--m:0">${SNOWMAN}<span class="hng-sun">☀️</span></div>
      <div class="hng-lives"></div>
      <div class="hng-word">${PH.split(" ").map(w => `<span class="hng-w">${[...w].map(c => `<span class="hng-l" data-c="${c}"></span>`).join("")}</span>`).join("")}</div>
      <div class="hng-kb">${["QWERTZUIOPÜ", "ASDFGHJKLÖÄ", "YXCVBNM"].map(r => `<div class="hng-kr">${[...r].map(k => `<button class="hng-k" data-k="${k}">${k}</button>`).join("")}</div>`).join("")}</div>
      <div class="hng-after"></div>`;
    const man = el.querySelector(".hng-man");
    const lives = () => { el.querySelector(".hng-lives").textContent = `SCHNEEMANN: ${"⛄".repeat(MAX - miss)}${"💧".repeat(miss)}`; };
    lives();
    function guess(k, btn) {
      if (over || guessed.has(k)) return;
      guessed.add(k); btn.disabled = true;
      if (letters.has(k)) {
        btn.classList.add("ok");
        el.querySelectorAll(`.hng-l[data-c="${k}"]`).forEach(l => { l.textContent = k; l.classList.add("show"); });
        if (navigator.vibrate) navigator.vibrate(12);
        if ([...letters].every(c => guessed.has(c))) win();
      } else {
        btn.classList.add("no"); miss++;
        man.style.setProperty("--m", miss);
        man.querySelector(".p" + (MAX - miss)).classList.add("gone");
        lives();
        if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
        if (miss >= MAX) lose();
      }
    }
    el.querySelectorAll(".hng-k").forEach(b => b.addEventListener("click", () => guess(b.dataset.k, b)));
    function win() {
      over = true;
      el.querySelector(".hng-kb").remove();
      ADV.finish(el.querySelector(".hng-after"), day, data, api, { title: data.endTitle || "SCHNEEMANN<br>GERETTET!" });
    }
    function lose() {
      over = true;
      el.querySelectorAll(".hng-l").forEach(l => { l.textContent = l.dataset.c; });
      const b = document.createElement("button");
      b.className = "btn"; b.style.cssText = "display:flex;margin:14px auto 0"; b.textContent = "🔁 Neuer Schneemann";
      b.addEventListener("click", () => window.DOOR_TYPES.hangman(el, day, data, api));
      el.querySelector(".hng-kb").replaceWith(b);
    }
  };
})();
