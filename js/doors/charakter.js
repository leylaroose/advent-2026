/* Level 2: Jans Charakterbogen im RPG-Stil */
(function () {
  ADV.css("chr-css", `
  .chr { margin-top: 8px; }
  .chr-sheet { background: var(--ink); color: var(--cream); border: 3px solid var(--ink); border-radius: 18px; padding: 16px 14px 18px;
    box-shadow: 4px 5px 0 var(--leaf); position: relative; overflow: hidden; }
  .chr-sheet::before { content: ""; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 2px, transparent 2px 4px); }
  .chr-top { display: flex; gap: 14px; align-items: center; }
  .chr-ava { flex: none; width: 86px; height: 86px; border-radius: 14px; background: radial-gradient(circle at 50% 40%, #2f9e5b, #13573a);
    border: 3px solid var(--lime); display: grid; place-items: center; font-size: 50px; box-shadow: 0 0 0 3px var(--ink), 0 0 18px rgba(201,240,122,.45);
    animation: hop 2s ease-in-out infinite; }
  .chr-name { font-family: var(--pixel-font); font-size: 20px; color: var(--lime); text-shadow: 2px 2px 0 #13573a; }
  .chr-class { font-family: var(--pixel-font); font-size: 9px; line-height: 1.7; color: var(--gold); margin-top: 8px; }
  .chr-type { display: inline-block; min-height: 1em; }
  .chr-type::after { content: "▌"; animation: blinkTxt .8s steps(2) infinite; }
  .chr-type.done::after { content: ""; }
  .chr-h { font-family: var(--pixel-font); font-size: 9px; color: var(--mint); letter-spacing: .08em; margin: 18px 0 8px; }
  .chr-stat { margin: 9px 0; }
  .chr-stat.on { animation: statIn .5s cubic-bezier(.3,1.6,.5,1) both; }
  @keyframes statIn { from { opacity: 0; transform: translateX(-24px) scale(.9); } to { opacity: 1; transform: none; } }
  .chr-stat-row { display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-bottom: 4px; }
  .chr-val { font-family: var(--pixel-font); font-size: 10px; color: var(--lime); }
  .chr-bar { height: 12px; background: #0d3322; border: 2px solid #2f9e5b; border-radius: 4px; overflow: hidden; }
  .chr-fill { height: 100%; width: 0; background: repeating-linear-gradient(90deg, var(--lime) 0 8px, #a5d957 8px 10px);
    transition: width 1.1s cubic-bezier(.2,.9,.3,1); }
  .chr-stat.max .chr-fill { background: repeating-linear-gradient(90deg, var(--gold) 0 8px, #ffb21e 8px 10px); animation: maxGlow .8s steps(2) infinite; }
  @keyframes maxGlow { 50% { filter: brightness(1.35); } }
  .chr-special { margin-top: 18px; background: linear-gradient(135deg, #ffc83d, #ffe08a); color: var(--ink); border: 3px solid var(--ink); border-radius: 14px;
    padding: 12px; text-align: center; box-shadow: 0 0 0 3px var(--gold), 0 0 26px rgba(255,200,61,.6); opacity: 0; transform: scale(.4); }
  .chr-special { display: none; }
  .chr-special.on { display: block; animation: specialIn .8s cubic-bezier(.3,1.7,.5,1) forwards; }
  @keyframes specialIn { to { opacity: 1; transform: none; } }
  .chr-special .lbl { font-family: var(--pixel-font); font-size: 9px; }
  .chr-special .txt { font-family: var(--display); font-weight: 700; font-size: 22px; margin-top: 6px; }
  .chr-hug { position: relative; margin-top: 16px; text-align: center; background: #fff; border: 3px solid var(--ink); border-radius: 18px;
    padding: 14px 12px 16px; box-shadow: var(--shadow); overflow: visible; animation: lineIn .6s cubic-bezier(.3,1.6,.5,1) both; }
  .chr-hug-t { font-family: var(--display); font-weight: 700; font-size: 19px; margin: 0 0 12px; color: var(--forest); }
  .chr-hugbtn { width: 112px; height: 112px; border-radius: 50%; border: 4px solid var(--ink); background: radial-gradient(circle at 40% 35%, #ffe08a, #ffc83d);
    font-size: 58px; box-shadow: 4px 5px 0 var(--ink); cursor: pointer; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
    animation: hugPulse 1.2s ease-in-out infinite; transition: transform .1s; }
  .chr-hugbtn.hold { animation: hugShake .15s linear infinite; background: radial-gradient(circle at 40% 35%, #ffd0d4, #e8414a); }
  @keyframes hugPulse { 50% { box-shadow: 4px 5px 0 var(--ink), 0 0 0 10px rgba(255,200,61,.35); } }
  @keyframes hugShake { 50% { rotate: 6deg; } }
  .chr-hugbar { height: 18px; margin: 16px 6px 6px; border: 3px solid var(--ink); border-radius: 999px; background: #ffe9ec; overflow: hidden; }
  .chr-hugfill { height: 100%; width: 0; background: repeating-linear-gradient(-45deg, #e8414a 0 10px, #ff7a82 10px 20px); }
  .chr-hugpct { font-family: var(--pixel-font); font-size: 9px; color: var(--forest); min-height: 1em; }
  .chr-hug.full .chr-hugbtn { animation: popOk .5s ease-in-out 3; }
  .chr-heart { position: absolute; bottom: 90px; font-size: 26px; pointer-events: none; animation: heartUp 1.2s ease-out forwards; }
  @keyframes heartUp { to { transform: translate(var(--dx), -170px) scale(1.4) rotate(20deg); opacity: 0; } }
  .chr-save, .chr-next { display: flex; margin: 18px auto 0; opacity: 0; }
  .chr-save { display: none; }
  .chr-save.on { display: flex; animation: lineIn .6s cubic-bezier(.3,1.6,.5,1) forwards; }
  .chr-next.on { animation: lineIn .6s cubic-bezier(.3,1.6,.5,1) forwards; }
  .chr-stat { display: none; }
  .chr-stat.on { display: block; }
  `);

  window.DOOR_TYPES.charakter = function (el, day, data, api) {
    el.innerHTML = `
      <div class="chr">
        <p class="lead">${data.intro || ""}</p>
        <div class="chr-sheet">
          <div class="chr-top">
            <div class="chr-ava">${data.avatar || "🎮"}</div>
            <div>
              <div class="chr-name">${data.name || "JAN"}</div>
              <div class="chr-class"><span class="chr-type"></span></div>
            </div>
          </div>
          <div class="chr-h">▸ ATTRIBUTE</div>
          <div class="chr-stats">
            ${(data.stats || []).map(s => `
              <div class="chr-stat ${s.max ? "max" : ""}">
                <div class="chr-stat-row"><span>${s.name}</span><span class="chr-val" data-to="${s.value}" data-label="${s.label || ""}">0</span></div>
                <div class="chr-bar"><div class="chr-fill" data-w="${s.percent ?? 100}"></div></div>
              </div>`).join("")}
          </div>
          <div class="chr-special">
            <div class="lbl">★ SPEZIALFÄHIGKEIT FREIGESCHALTET ★</div>
            <div class="txt">${data.special || ""}</div>
          </div>
        </div>
        <button class="btn chr-next chr-save-like">▶ Nächster Wert (1/${(data.stats || []).length})</button>
        <button class="btn chr-save">💾 Charakter speichern</button>
      </div>`;

    const root = el.querySelector(".chr");
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    // Klasse tippt sich ein
    const typeEl = root.querySelector(".chr-type");
    const cls = data.classLine || "";
    let i = 0;
    const tick = () => {
      typeEl.textContent = cls.slice(0, ++i);
      if (i < cls.length) later(tick, 40); else typeEl.classList.add("done");
    };
    later(tick, 500);

    // Werte einzeln per Tipp enthüllen
    const stats = [...root.querySelectorAll(".chr-stat")];
    const nextBtn = root.querySelector(".chr-next");
    let k = 0;
    function reveal() {
      const st = stats[k++];
      st.classList.add("on");
      const fill = st.querySelector(".chr-fill");
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = fill.dataset.w + "%"; }));
      const v = st.querySelector(".chr-val");
      const to = parseFloat(v.dataset.to);
      if (v.dataset.label) { v.textContent = "..."; later(() => { v.textContent = v.dataset.label; }, 700); }
      else if (!isNaN(to)) {
        const t0 = performance.now();
        const step = now => {
          const p = Math.min(1, (now - t0) / 1000);
          v.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
      if (navigator.vibrate) navigator.vibrate(15);
      later(() => {
        const r = st.getBoundingClientRect();
        FX.burst(r.right - 30, r.top + 10, { count: st.classList.contains("max") ? 22 : 12, shapes: ["star"], colors: ["#ffc83d", "#c9f07a"], speed: 6, size: 10, life: 60 });
      }, 500);
      if (k < stats.length) nextBtn.textContent = `▶ Nächster Wert (${k + 1}/${stats.length})`;
      else nextBtn.textContent = "🤗 Spezialfähigkeit laden";
      nextBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    nextBtn.addEventListener("click", () => {
      if (k < stats.length) return reveal();
      nextBtn.remove();
      startHug();
    });

    // Mini-Spiel: Knopf gedrückt halten = Umarmung geben
    function startHug() {
      const box = document.createElement("div");
      box.className = "chr-hug";
      box.innerHTML = `<p class="chr-hug-t">${data.hugText || "Halte den Knopf gedrückt und gib Leyla eine Umarmung!"}</p>
        <button class="chr-hugbtn" aria-label="Umarmung geben">🤗</button>
        <div class="chr-hugbar"><div class="chr-hugfill"></div></div>
        <div class="chr-hugpct">0 %</div>`;
      root.querySelector(".chr-sheet").after(box);
      box.scrollIntoView({ block: "center", behavior: "smooth" });
      const btn = box.querySelector(".chr-hugbtn"), fill = box.querySelector(".chr-hugfill"), pct = box.querySelector(".chr-hugpct");
      let p = 0, holding = false, last = performance.now(), lastHeart = 0, lastBuzz = 0, raf = 0, done = false;
      const down = e => { e.preventDefault(); holding = true; btn.classList.add("hold"); };
      const up = () => { holding = false; btn.classList.remove("hold"); };
      btn.addEventListener("pointerdown", down);
      ["pointerup", "pointerleave", "pointercancel"].forEach(ev => btn.addEventListener(ev, up));
      btn.addEventListener("contextmenu", e => e.preventDefault());
      function heart() {
        const h = document.createElement("span");
        h.className = "chr-heart";
        h.textContent = ["❤️", "💚", "💖", "🤗"][Math.floor(Math.random() * 4)];
        h.style.left = 40 + Math.random() * 20 + "%";
        h.style.setProperty("--dx", (Math.random() - .5) * 140 + "px");
        box.appendChild(h);
        setTimeout(() => h.remove(), 1200);
      }
      function tick(now) {
        const dt = now - last; last = now;
        if (holding) {
          p = Math.min(1, p + dt / 2600);
          if (now - lastHeart > 110) { heart(); lastHeart = now; }
          if (navigator.vibrate && now - lastBuzz > 220) { navigator.vibrate(12); lastBuzz = now; }
        } else p = Math.max(0, p - dt / 3500);
        fill.style.width = p * 100 + "%";
        pct.textContent = Math.round(p * 100) + " %" + (holding && p < 1 ? " · festhalten!" : !holding && p > 0 && p < 1 ? " · nicht loslassen!" : "");
        btn.style.transform = `scale(${1 + p * 0.25})`;
        if (p >= 1 && !done) {
          done = true; up();
          box.classList.add("full");
          pct.textContent = "100 % · UMARMUNG KOMPLETT!";
          const sp = root.querySelector(".chr-special");
          sp.classList.add("on");
          later(() => sp.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
          ADV.celebrate(btn);
          later(() => root.querySelector(".chr-save").classList.add("on"), 1100);
          return;
        }
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      timers.push(setTimeout(() => {}, 0));
      stopHug = () => cancelAnimationFrame(raf);
    }
    let stopHug = () => {};
    later(() => nextBtn.classList.add("on"), 600 + cls.length * 40);

    root.querySelector(".chr-save").addEventListener("click", e => {
      e.currentTarget.remove();
      ADV.finish(root, day, data, api, { title: "GESPEICHERT!" });
    });

    return () => { timers.forEach(clearTimeout); stopHug(); };
  };
})();
