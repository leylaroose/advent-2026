/* Grinch-Duell: Tic-Tac-Toe gegen Grinch-Leyla. Wer zuerst 2 Runden gewinnt. */
(function () {
  ADV.css("ttt-css", `
  .ttt-top { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
  .ttt-ava { position: relative; flex: none; width: 92px; height: 104px; }
  .ttt-face { position: absolute; left: 4px; bottom: 0; width: 84px; height: 84px; border-radius: 50%; overflow: hidden; border: 3.5px solid var(--ink);
    background: #8bd17c; box-shadow: 3px 4px 0 var(--ink); }
  .ttt-face img { width: 100%; height: 100%; object-fit: cover; filter: sepia(1) hue-rotate(55deg) saturate(2.6) brightness(.95) contrast(1.1); }
  .ttt-face img.raw { filter: none; }
  .ttt-hat { position: absolute; left: 18px; top: -4px; width: 78px; transform: rotate(18deg); filter: drop-shadow(2px 3px 0 var(--ink)); }
  .ttt-ava.taunt { animation: tauntWob .5s ease-in-out 2; }
  @keyframes tauntWob { 0%,100% { rotate: 0deg; } 25% { rotate: -8deg; } 75% { rotate: 8deg; } }
  .ttt-say { position: relative; flex: 1; background: #fff; border: 3px solid var(--ink); border-radius: 16px; padding: 10px 12px; box-shadow: 3px 4px 0 var(--ink);
    font-family: var(--display); font-weight: 600; font-size: 17px; line-height: 1.25; min-height: 58px; display: flex; align-items: center; }
  .ttt-say::before { content: ""; position: absolute; left: -11px; top: 50%; width: 16px; height: 16px; translate: 0 -50%; rotate: 45deg; background: #fff;
    border-left: 3px solid var(--ink); border-bottom: 3px solid var(--ink); }
  .ttt-say.pop { animation: popOk .35s cubic-bezier(.3,1.7,.5,1); }
  .ttt-score { display: flex; justify-content: space-between; align-items: center; margin: 14px 2px 8px; font-family: var(--pixel-font); font-size: 10px; color: var(--forest); }
  .ttt-score b { font-size: 16px; color: var(--ink); }
  .ttt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: min(100%, 320px); margin: 0 auto; }
  .ttt-cell { aspect-ratio: 1; border: 3px solid var(--ink); border-radius: 14px; background: #fff; box-shadow: 3px 4px 0 var(--ink); font-size: clamp(38px, 12vw, 54px);
    display: grid; place-items: center; cursor: pointer; transition: transform .1s, background .2s; padding: 0; }
  .ttt-cell:active { transform: translate(2px, 3px); box-shadow: 1px 1px 0 var(--ink); }
  .ttt-cell span { animation: markIn .35s cubic-bezier(.3,1.8,.5,1); }
  @keyframes markIn { from { transform: scale(0) rotate(-40deg); } to { transform: none; } }
  .ttt-cell.win { background: var(--lime); animation: popOk .5s ease-in-out infinite; }
  .ttt-cell.lose { background: #c8f0b0; }
  .ttt-next { display: flex; margin: 14px auto 0; }
  `);

  const HAT = `<svg class="ttt-hat" viewBox="0 0 100 80"><path d="M8 62 C20 20 60 0 86 18 C74 22 66 34 64 50 Z" fill="#e8414a" stroke="#0a2418" stroke-width="5" stroke-linejoin="round"/>
    <rect x="2" y="54" width="70" height="18" rx="9" fill="#fff" stroke="#0a2418" stroke-width="5"/><circle cx="88" cy="18" r="10" fill="#fff" stroke="#0a2418" stroke-width="5"/></svg>`;
  // gezeichneter Platzhalter, bis Leylas Selfie da ist
  const FACE = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#7cc46a"/>
    <path d="M26 36 L44 44 M74 36 L56 44" stroke="#0a2418" stroke-width="6" stroke-linecap="round"/>
    <circle cx="38" cy="52" r="7" fill="#fff8b0" stroke="#0a2418" stroke-width="3"/><circle cx="62" cy="52" r="7" fill="#fff8b0" stroke="#0a2418" stroke-width="3"/>
    <circle cx="39" cy="53" r="3" fill="#c0392b"/><circle cx="61" cy="53" r="3" fill="#c0392b"/>
    <path d="M32 74 Q52 84 70 68" fill="none" stroke="#0a2418" stroke-width="5" stroke-linecap="round"/></svg>`);

  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winner = b => { for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[1]] === b[l[2]]) return { p: b[l[0]], l }; return b.every(Boolean) ? { p: "draw" } : null; };

  function minimax(b, me) {
    const w = winner(b);
    if (w) return { s: w.p === "G" ? 10 : w.p === "J" ? -10 : 0 };
    let best = { s: me === "G" ? -99 : 99 };
    b.forEach((v, i) => {
      if (v) return;
      b[i] = me; const r = minimax(b, me === "G" ? "J" : "G"); b[i] = null;
      if (me === "G" ? r.s > best.s : r.s < best.s) best = { s: r.s, i };
    });
    return best;
  }

  window.DOOR_TYPES.ttt = function (el, day, data, api) {
    const J = data.janMark || "🎄", G = data.grinchMark || "😤";
    const T = data.taunts || {};
    const pick = a => a[Math.floor(Math.random() * a.length)];
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="ttt-top">
        <div class="ttt-ava"><div class="ttt-face"><img src="${data.face || FACE}" class="${data.face ? "" : "raw"}" alt="Grinch-Leyla"></div>${HAT}</div>
        <div class="ttt-say"></div>
      </div>
      <div class="ttt-score"><span>JAN ${J} <b class="sj">0</b></span><span>BEST OF 3</span><span><b class="sg">0</b> ${G} ${data.grinchName || "GRINCH-LEYLA"}</span></div>
      <div class="ttt-grid">${Array.from({ length: 9 }, (_, i) => `<button class="ttt-cell" data-i="${i}"></button>`).join("")}</div>
      <div class="ttt-ctrl"></div>
      <div class="ttt-after"></div>`;
    const say = el.querySelector(".ttt-say"), ava = el.querySelector(".ttt-ava");
    const cells = [...el.querySelectorAll(".ttt-cell")];
    let board, busy, sj = 0, sg = 0, round = 0, done = false;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    function talk(t) { say.textContent = t; say.classList.remove("pop"); void say.offsetWidth; say.classList.add("pop"); ava.classList.remove("taunt"); void ava.offsetWidth; ava.classList.add("taunt"); }

    function newRound() {
      board = Array(9).fill(null); busy = false; round++;
      cells.forEach(c => { c.innerHTML = ""; c.className = "ttt-cell"; c.disabled = false; });
      el.querySelector(".ttt-ctrl").innerHTML = "";
      talk(round === 1 ? (T.start || "Weihnachten gehört MIR! Du fängst an.") : pick(T.round || ["Nächste Runde. Diesmal bist du dran!"]));
    }
    function place(i, who) {
      board[i] = who;
      cells[i].innerHTML = `<span>${who === "J" ? J : G}</span>`;
      cells[i].disabled = true;
      if (navigator.vibrate) navigator.vibrate(10);
    }
    function grinchMove() {
      const free = board.map((v, i) => v ? null : i).filter(v => v !== null);
      // Grinch-Leyla ist schlagbar: manchmal unaufmerksam
      const sloppy = Math.random() < (data.mistakes ?? 0.35);
      const i = sloppy ? pick(free) : minimax(board.slice(), "G").i;
      place(i, "G");
      if (Math.random() < 0.45) talk(pick(T.move || ["Hehe.", "Na, nervös?", "Pff."]));
      check();
    }
    function check() {
      const w = winner(board);
      if (!w) return false;
      busy = true;
      cells.forEach(c => c.disabled = true);
      if (w.l) w.l.forEach(i => cells[i].classList.add(w.p === "J" ? "win" : "lose"));
      if (w.p === "J") { sj++; talk(pick(T.janWins || ["Das war pures Glück!"])); const r = el.querySelector(".ttt-grid").getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 70, speed: 11 }); }
      else if (w.p === "G") { sg++; talk(pick(T.grinchWins || ["HA! Weihnachten bleibt bei mir!"])); }
      else talk(pick(T.draw || ["Unentschieden. Langweilig!"]));
      el.querySelector(".sj").textContent = sj; el.querySelector(".sg").textContent = sg;
      if (sj >= 2) { later(win, 900); return true; }
      const btn = document.createElement("button");
      btn.className = "btn ttt-next";
      btn.textContent = sg >= 2 ? "🔁 Revanche!" : "Nächste Runde ▶";
      btn.addEventListener("click", () => { if (sg >= 2) { sj = 0; sg = 0; round = 0; el.querySelector(".sj").textContent = 0; el.querySelector(".sg").textContent = 0; } newRound(); });
      el.querySelector(".ttt-ctrl").appendChild(btn);
      later(() => btn.scrollIntoView({ block: "nearest", behavior: "smooth" }), 200);
      return true;
    }
    cells.forEach(c => c.addEventListener("click", () => {
      const i = +c.dataset.i;
      if (busy || done || board[i]) return;
      place(i, "J");
      if (check()) return;
      busy = true;
      later(() => { busy = false; grinchMove(); }, 650);
    }));
    function win() {
      done = true;
      talk(T.final || "Na gut... du hast gewonnen. Hier hast du Weihnachten zurück. 💚");
      ADV.finish(el.querySelector(".ttt-after"), day, data, api, { title: "GRINCH<br>BESIEGT!" });
    }
    newRound();
    return () => timers.forEach(clearTimeout);
  };
})();
