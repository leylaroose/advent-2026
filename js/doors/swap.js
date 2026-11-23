/* Tausch-Puzzle: zwei Teile antippen (oder eins aufs andere ziehen), sie tauschen die Plätze. Richtige Teile rasten ein. */
(function () {
  ADV.css("swp-css", `
  .swp-board { position: relative; width: min(100%, 340px); aspect-ratio: 1; margin: 6px auto 0; border: 3.5px solid var(--ink); border-radius: 16px;
    background: #0d3322; box-shadow: var(--shadow); overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .swp-tile { position: absolute; border-radius: 8px; background-repeat: no-repeat; box-shadow: inset 0 0 0 2px rgba(10,36,24,.6);
    transition: left .25s cubic-bezier(.3,1.4,.5,1), top .25s cubic-bezier(.3,1.4,.5,1), transform .15s, box-shadow .2s; cursor: pointer; }
  .swp-tile.sel { transform: scale(.9); box-shadow: inset 0 0 0 4px var(--gold), 0 0 14px 4px rgba(255,200,61,.8); z-index: 3; }
  .swp-tile.drag { transition: none; z-index: 5; transform: scale(1.08); box-shadow: 0 8px 18px rgba(0,0,0,.45), inset 0 0 0 3px var(--gold); }
  .swp-tile.ok { cursor: default; box-shadow: inset 0 0 0 0 transparent; }
  .swp-tile.ok.flash { animation: okFlash .6s ease-out; }
  @keyframes okFlash { 0% { box-shadow: inset 0 0 0 5px var(--lime), 0 0 18px 6px rgba(201,240,122,.9); } 100% { box-shadow: inset 0 0 0 0 transparent; } }
  .swp-board.solved .swp-tile { border-radius: 0; }
  .swp-full { position: absolute; inset: 0; background-size: cover; opacity: 0; transition: opacity .6s; pointer-events: none; z-index: 6; }
  .swp-board.peek .swp-full, .swp-board.solved .swp-full { opacity: 1; }
  .swp-tools { display: flex; justify-content: center; margin-top: 14px; }
  `);

  window.DOOR_TYPES.swap = function (el, day, data, api) {
    const N = data.grid || 3, COUNT = N * N;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="adv-hud"><span class="swp-count">RICHTIG: 0/${COUNT}</span><span>${N}×${N}</span></div>
      <div class="swp-board"><div class="swp-full" style="background-image:url('${data.image}')"></div></div>
      <div class="swp-tools"><button class="btn secondary swp-peek">👀 Vorlage (gedrückt halten)</button></div>
      <div class="swp-after"></div>`;
    const board = el.querySelector(".swp-board");
    const countEl = el.querySelector(".swp-count");
    // place[cell] = Teil, das gerade auf diesem Feld liegt
    let place = ADV.shuffle([...Array(COUNT).keys()]);
    while (place.filter((t, c) => t === c).length > 1) place = ADV.shuffle(place); // höchstens 1 Teil schon richtig
    const tiles = [];
    for (let t = 0; t < COUNT; t++) {
      const d = document.createElement("div");
      d.className = "swp-tile";
      d.style.backgroundImage = `url('${data.image}')`;
      d.style.backgroundSize = `${N * 100}% ${N * 100}%`;
      d.style.backgroundPosition = `${(t % N) / (N - 1) * 100}% ${Math.floor(t / N) / (N - 1) * 100}%`;
      d.dataset.t = t;
      board.appendChild(d); tiles.push(d);
    }
    let size = 0, gap = 3, solved = false, sel = null;
    function layout() {
      size = (board.clientWidth - gap * (N + 1)) / N;
      place.forEach((t, c) => {
        const d = tiles[t];
        if (d.classList.contains("drag")) return;
        d.style.width = d.style.height = size + "px";
        d.style.left = gap + (c % N) * (size + gap) + "px";
        d.style.top = gap + Math.floor(c / N) * (size + gap) + "px";
      });
    }
    function refresh(flash) {
      let ok = 0;
      place.forEach((t, c) => {
        const good = t === c;
        if (good) { ok++; if (!tiles[t].classList.contains("ok")) { tiles[t].classList.add("ok"); if (flash) { tiles[t].classList.add("flash"); setTimeout(() => tiles[t].classList.remove("flash"), 650); } } }
        else tiles[t].classList.remove("ok");
      });
      countEl.textContent = `RICHTIG: ${ok}/${COUNT}`;
      if (ok === COUNT && !solved) {
        solved = true;
        board.classList.add("solved");
        el.querySelector(".swp-tools").remove();
        setTimeout(() => ADV.finish(el.querySelector(".swp-after"), day, data, api), 500);
      }
    }
    function swap(a, b) {
      const ca = place.indexOf(a), cb = place.indexOf(b);
      [place[ca], place[cb]] = [place[cb], place[ca]];
      if (navigator.vibrate) navigator.vibrate(12);
      layout(); refresh(true);
    }
    const cellAt = (x, y) => {
      const r = board.getBoundingClientRect();
      const c = Math.floor((x - r.left) / (r.width / N)), rr = Math.floor((y - r.top) / (r.height / N));
      return c >= 0 && c < N && rr >= 0 && rr < N ? rr * N + c : -1;
    };

    let drag = null;
    board.addEventListener("pointerdown", e => {
      const d = e.target.closest(".swp-tile");
      if (!d || solved || d.classList.contains("ok")) return;
      e.preventDefault();
      drag = { t: +d.dataset.t, x: e.clientX, y: e.clientY, l: parseFloat(d.style.left), tp: parseFloat(d.style.top), moved: false };
      try { board.setPointerCapture(e.pointerId); } catch (_) {}
    });
    board.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 10) { drag.moved = true; tiles[drag.t].classList.add("drag"); if (sel !== null) { tiles[sel].classList.remove("sel"); sel = null; } }
      if (drag.moved) { tiles[drag.t].style.left = drag.l + dx + "px"; tiles[drag.t].style.top = drag.tp + dy + "px"; }
    });
    board.addEventListener("pointerup", e => {
      if (!drag) return;
      const t = drag.t, moved = drag.moved; drag = null;
      tiles[t].classList.remove("drag");
      if (moved) {
        const c = cellAt(e.clientX, e.clientY);
        const other = c >= 0 ? place[c] : -1;
        if (other >= 0 && other !== t && !tiles[other].classList.contains("ok")) swap(t, other); else layout();
        return;
      }
      // Tippen: erstes Teil auswählen, zweites tauscht
      if (sel === null) { sel = t; tiles[t].classList.add("sel"); }
      else if (sel === t) { tiles[t].classList.remove("sel"); sel = null; }
      else { tiles[sel].classList.remove("sel"); const a = sel; sel = null; swap(a, t); }
    });
    board.addEventListener("pointercancel", () => { if (drag) { tiles[drag.t].classList.remove("drag"); drag = null; layout(); } });

    const peek = el.querySelector(".swp-peek");
    const on = e => { e.preventDefault(); board.classList.add("peek"); };
    const off = () => board.classList.remove("peek");
    peek.addEventListener("pointerdown", on);
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => peek.addEventListener(ev, off));

    layout(); refresh(false);
    const ro = new ResizeObserver(layout); ro.observe(board);
    return () => ro.disconnect();
  };
})();
