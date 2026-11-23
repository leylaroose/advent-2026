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
  .chr-stat { margin: 9px 0; opacity: 0; transform: translateX(-20px); transition: opacity .35s, transform .45s cubic-bezier(.3,1.6,.5,1); }
  .chr-stat.on { opacity: 1; transform: none; }
  .chr-stat-row { display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; margin-bottom: 4px; }
  .chr-val { font-family: var(--pixel-font); font-size: 10px; color: var(--lime); }
  .chr-bar { height: 12px; background: #0d3322; border: 2px solid #2f9e5b; border-radius: 4px; overflow: hidden; }
  .chr-fill { height: 100%; width: 0; background: repeating-linear-gradient(90deg, var(--lime) 0 8px, #a5d957 8px 10px);
    transition: width 1.1s cubic-bezier(.2,.9,.3,1); }
  .chr-stat.max .chr-fill { background: repeating-linear-gradient(90deg, var(--gold) 0 8px, #ffb21e 8px 10px); animation: maxGlow .8s steps(2) infinite; }
  @keyframes maxGlow { 50% { filter: brightness(1.35); } }
  .chr-special { margin-top: 18px; background: linear-gradient(135deg, #ffc83d, #ffe08a); color: var(--ink); border: 3px solid var(--ink); border-radius: 14px;
    padding: 12px; text-align: center; box-shadow: 0 0 0 3px var(--gold), 0 0 26px rgba(255,200,61,.6); opacity: 0; transform: scale(.4); }
  .chr-special.on { animation: specialIn .8s cubic-bezier(.3,1.7,.5,1) forwards; }
  @keyframes specialIn { to { opacity: 1; transform: none; } }
  .chr-special .lbl { font-family: var(--pixel-font); font-size: 9px; }
  .chr-special .txt { font-family: var(--display); font-weight: 700; font-size: 22px; margin-top: 6px; }
  .chr-save { display: flex; margin: 18px auto 0; opacity: 0; }
  .chr-save.on { animation: lineIn .6s cubic-bezier(.3,1.6,.5,1) forwards; }
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
      if (i < cls.length) later(tick, 45); else typeEl.classList.add("done");
    };
    later(tick, 500);

    // Werte nacheinander
    const stats = [...root.querySelectorAll(".chr-stat")];
    const start = 600 + cls.length * 45;
    stats.forEach((st, k) => {
      later(() => {
        st.classList.add("on");
        st.querySelector(".chr-fill").style.width = st.querySelector(".chr-fill").dataset.w + "%";
        const v = st.querySelector(".chr-val");
        const to = parseFloat(v.dataset.to);
        if (v.dataset.label) { later(() => { v.textContent = v.dataset.label; }, 700); v.textContent = "..."; }
        else if (!isNaN(to)) {
          const t0 = performance.now();
          const step = now => {
            const p = Math.min(1, (now - t0) / 1000);
            v.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        if (navigator.vibrate) navigator.vibrate(10);
        const r = st.getBoundingClientRect();
        if (st.classList.contains("max")) FX.burst(r.right - 30, r.top + 10, { count: 14, shapes: ["star"], colors: ["#ffc83d", "#c9f07a"], speed: 6, size: 10, life: 60 });
        st.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, start + k * 750);
    });

    const after = start + stats.length * 750 + 600;
    later(() => {
      const sp = root.querySelector(".chr-special");
      sp.classList.add("on");
      sp.scrollIntoView({ block: "center", behavior: "smooth" });
      ADV.celebrate(sp, false);
    }, after);
    later(() => root.querySelector(".chr-save").classList.add("on"), after + 900);

    root.querySelector(".chr-save").addEventListener("click", e => {
      e.currentTarget.remove();
      ADV.finish(root, day, data, api, { title: "GESPEICHERT!" });
    });

    return () => timers.forEach(clearTimeout);
  };
})();
