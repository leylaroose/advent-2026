/* Schiebepuzzle (Level 4 leicht, später Level 20 schwer) */
(function () {
  ADV.css("sld-css", `
  .sld-board { position: relative; width: min(100%, 340px); aspect-ratio: 1; margin: 6px auto 0; border: 3.5px solid var(--ink); border-radius: 16px;
    background: #0d3322; box-shadow: var(--shadow); overflow: hidden; touch-action: manipulation; }
  .sld-tile { position: absolute; border-radius: 8px; box-shadow: inset 0 0 0 2px rgba(10,36,24,.55); background-repeat: no-repeat;
    transition: left .16s ease-out, top .16s ease-out; cursor: pointer; }
  .sld-tile.hint::after { content: attr(data-n); position: absolute; left: 5px; top: 3px; font-family: var(--pixel-font); font-size: 9px; color: #fff;
    text-shadow: 1px 1px 0 #000, -1px -1px 0 #000; }
  .sld-board.solved .sld-tile { box-shadow: none; border-radius: 0; }
  .sld-full { position: absolute; inset: 0; background-size: cover; opacity: 0; transition: opacity .6s; pointer-events: none; }
  .sld-board.peek .sld-full, .sld-board.solved .sld-full { opacity: 1; }
  .sld-tools { display: flex; gap: 10px; justify-content: center; margin-top: 14px; flex-wrap: wrap; }
  `);

  window.DOOR_TYPES.slide = function (el, day, data, api) {
    const N = data.grid || 3;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="adv-hud"><span class="sld-moves">ZÜGE: 0</span><span>${N}×${N}</span></div>
      <div class="sld-board"><div class="sld-full" style="background-image:url('${data.image}')"></div></div>
      <div class="sld-tools">
        <button class="btn secondary sld-peek">👀 Vorlage (gedrückt halten)</button>
        <button class="btn secondary sld-num">🔢 Zahlen an/aus</button>
      </div>
      <div class="sld-after"></div>`;

    const board = el.querySelector(".sld-board");
    const movesEl = el.querySelector(".sld-moves");
    let pos = [...Array(N * N).keys()]; // pos[tile] = Feld; letztes Teil ist die Lücke
    const EMPTY = N * N - 1;
    let moves = 0, solved = false;
    const tiles = [];

    for (let t = 0; t < N * N - 1; t++) {
      const d = document.createElement("div");
      d.className = "sld-tile";
      d.dataset.n = t + 1;
      d.style.backgroundImage = `url('${data.image}')`;
      d.style.backgroundSize = `${N * 100}% ${N * 100}%`;
      d.style.backgroundPosition = `${(t % N) / (N - 1) * 100}% ${Math.floor(t / N) / (N - 1) * 100}%`;
      d.addEventListener("click", () => tryMove(t));
      board.appendChild(d);
      tiles.push(d);
    }

    function layout() {
      const gap = 3, size = (board.clientWidth - gap * (N + 1)) / N;
      tiles.forEach((d, t) => {
        const p = pos[t];
        d.style.width = d.style.height = size + "px";
        d.style.left = gap + (p % N) * (size + gap) + "px";
        d.style.top = gap + Math.floor(p / N) * (size + gap) + "px";
      });
    }
    const adj = (a, b) => (Math.abs(a % N - b % N) + Math.abs(Math.floor(a / N) - Math.floor(b / N))) === 1;

    function tryMove(t, silent) {
      if (solved) return false;
      if (!adj(pos[t], pos[EMPTY])) {
        if (!silent) { tiles[t].animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 180 }); }
        return false;
      }
      [pos[t], pos[EMPTY]] = [pos[EMPTY], pos[t]];
      if (!silent) {
        moves++; movesEl.textContent = `ZÜGE: ${moves}`;
        if (navigator.vibrate) navigator.vibrate(8);
        layout(); check();
      }
      return true;
    }

    // Mischen durch zufällige gültige Züge (immer lösbar)
    let last = -1;
    for (let i = 0; i < (N === 3 ? 160 : 400); i++) {
      const cands = tiles.map((_, t) => t).filter(t => t !== last && adj(pos[t], pos[EMPTY]));
      const t = cands[Math.floor(Math.random() * cands.length)];
      tryMove(t, true); last = t;
    }
    if (pos.every((p, t) => p === t)) { const t = tiles.findIndex((_, t) => adj(pos[t], pos[EMPTY])); tryMove(t, true); }
    layout();

    function check() {
      if (!pos.every((p, t) => p === t)) return;
      solved = true;
      board.classList.add("solved");
      el.querySelector(".sld-tools").remove();
      setTimeout(() => ADV.finish(el.querySelector(".sld-after"), day, data, api), 500);
    }

    const peek = el.querySelector(".sld-peek");
    const on = e => { e.preventDefault(); board.classList.add("peek"); };
    const off = () => board.classList.remove("peek");
    peek.addEventListener("pointerdown", on);
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => peek.addEventListener(ev, off));
    el.querySelector(".sld-num").addEventListener("click", () => tiles.forEach(d => d.classList.toggle("hint")));

    const ro = new ResizeObserver(layout); ro.observe(board);
    return () => ro.disconnect();
  };
})();
