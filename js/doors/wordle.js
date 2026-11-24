/* Wort des Tages: 5 Buchstaben, 6 Versuche */
(function () {
  ADV.css("wdl-css", `
  .wdl-board { display: grid; gap: 5px; width: clamp(170px, calc(100svh - 470px), 270px); margin: 4px auto 0; }
  .wdl-tip { font-weight: 800; font-size: 15px; margin: 4px 0 6px; color: var(--forest); }
  .wdl-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
  .wdl-row.shake { animation: nope .45s ease-in-out; }
  .wdl-tile { aspect-ratio: 1; border: 3px solid #b9d8c4; border-radius: 10px; background: #fff; display: grid; place-items: center;
    font-family: var(--display); font-weight: 700; font-size: clamp(18px, 6vw, 28px); color: var(--ink); text-transform: uppercase; }
  .wdl-tile.filled { border-color: var(--ink); animation: popOk .15s ease-out; }
  .wdl-tile.g, .wdl-tile.y, .wdl-tile.x { color: #fff; border-color: var(--ink); animation: flip .5s ease-in-out both; }
  .wdl-tile.g { background: var(--leaf); } .wdl-tile.y { background: #e0a91f; } .wdl-tile.x { background: #7d8f85; }
  @keyframes flip { 0% { transform: rotateX(0); } 50% { transform: rotateX(90deg); } 100% { transform: rotateX(0); } }
  .wdl-msg { text-align: center; font-weight: 900; min-height: 1.3em; margin: 6px 0 4px; font-size: 15px; }
  .wdl-kb { display: grid; gap: 6px; margin-top: 4px; user-select: none; -webkit-user-select: none; }
  .wdl-kr { display: flex; gap: 4px; justify-content: center; }
  .wdl-k { flex: 1; max-width: 38px; height: 44px; border: 2.5px solid var(--ink); border-radius: 8px; background: #fff; font-family: var(--display); font-weight: 700;
    font-size: 17px; color: var(--ink); box-shadow: 1px 2px 0 var(--ink); padding: 0; cursor: pointer; touch-action: manipulation; }
  .wdl-k.wide { max-width: 56px; font-size: 18px; }
  .wdl-k.wdl-enter { max-width: 100%; height: 42px; font-size: 17px; background: var(--lime); }
  .wdl-k:active { transform: translateY(2px); box-shadow: none; }
  .wdl-k.g { background: var(--leaf); color: #fff; } .wdl-k.y { background: #e0a91f; color: #fff; } .wdl-k.x { background: #7d8f85; color: #fff; }
  `);

  window.DOOR_TYPES.wordle = function (el, day, data, api) {
    const SOL = (data.solution || "EXILE").toUpperCase();
    const N = SOL.length, TRIES = data.tries || 5;
    el.innerHTML = `
      <p class="lead" style="margin:2px 0">${data.intro || ""}</p>${data.tip ? `<p class="wdl-tip">💡 ${data.tip}</p>` : ""}
      <div class="wdl-board">${Array.from({ length: TRIES }, () => `<div class="wdl-row">${"<div class='wdl-tile'></div>".repeat(N)}</div>`).join("")}</div>
      <p class="wdl-msg"></p>
      <div class="wdl-kb">
        ${["QWERTZUIOP", "ASDFGHJKL", "YXCVBNM>"].map(r => `<div class="wdl-kr">${[...r].map(k =>
          k === ">" ? `<button class="wdl-k wide" data-k="DEL" aria-label="Löschen">⌫</button>` : `<button class="wdl-k" data-k="${k}">${k}</button>`).join("")}</div>`).join("")}
        <div class="wdl-kr"><button class="wdl-k wdl-enter" data-k="ENTER">✓ Wort prüfen</button></div>
      </div>
      <div class="wdl-after"></div>`;
    const rows = [...el.querySelectorAll(".wdl-row")], msg = el.querySelector(".wdl-msg");
    let row = 0, cur = "", over = false, busy = false;
    const keyState = {};
    function draw() { [...rows[row].children].forEach((t, i) => { t.textContent = cur[i] || ""; t.classList.toggle("filled", !!cur[i]); }); }
    function score(g) {
      const res = Array(N).fill("x"), rest = {};
      for (let i = 0; i < N; i++) { if (g[i] === SOL[i]) res[i] = "g"; else rest[SOL[i]] = (rest[SOL[i]] || 0) + 1; }
      for (let i = 0; i < N; i++) if (res[i] !== "g" && rest[g[i]]) { res[i] = "y"; rest[g[i]]--; }
      return res;
    }
    function submit() {
      if (cur.length < N) { rows[row].classList.remove("shake"); void rows[row].offsetWidth; rows[row].classList.add("shake"); msg.textContent = "Zu kurz! 5 Buchstaben."; return; }
      busy = true;
      const res = score(cur), tiles = [...rows[row].children], g = cur;
      res.forEach((r, i) => setTimeout(() => {
        tiles[i].classList.add(r);
        const rank = { x: 0, y: 1, g: 2 };
        if ((rank[r] ?? 0) >= (rank[keyState[g[i]]] ?? -1)) { keyState[g[i]] = r; const k = el.querySelector(`.wdl-k[data-k="${g[i]}"]`); if (k) { k.classList.remove("g", "y", "x"); k.classList.add(r); } }
      }, i * 220));
      const won = g === SOL;
      setTimeout(() => {
        busy = false;
        if (won) {
          over = true; msg.textContent = data.winMsg || "Geschafft!";
          el.querySelector(".wdl-kb").remove();
          ADV.finish(el.querySelector(".wdl-after"), day, data, api);
        } else if (row === TRIES - 1) {
          over = true; msg.innerHTML = `Das Wort war <b>${SOL}</b>.`;
          const b = document.createElement("button"); b.className = "btn"; b.textContent = "🔁 Nochmal";
          b.style.cssText = "display:flex;margin:10px auto 0";
          b.addEventListener("click", () => window.DOOR_TYPES.wordle(el, day, data, api));
          el.querySelector(".wdl-after").appendChild(b);
        } else { row++; cur = ""; msg.textContent = ""; }
      }, N * 220 + 300);
      if (!won && row < TRIES - 1) msg.textContent = "";
    }
    el.querySelectorAll(".wdl-k").forEach(k => k.addEventListener("click", () => {
      if (over || busy) return;
      const v = k.dataset.k;
      if (navigator.vibrate) navigator.vibrate(6);
      if (v === "ENTER") return submit();
      if (v === "DEL") { cur = cur.slice(0, -1); return draw(); }
      if (cur.length < N) { cur += v; draw(); }
    }));
  };
})();
