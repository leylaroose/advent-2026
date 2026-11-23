/* Zoom-Rätsel: stark rangezoomtes Foto, Schritt für Schritt rauszoomen, Lösung wählen */
(function () {
  ADV.css("zm-css", `
  .zm-frame { position: relative; width: min(100%, 340px); aspect-ratio: 1; margin: 4px auto 0; border: 3.5px solid var(--ink); border-radius: 18px;
    overflow: hidden; box-shadow: var(--shadow); background: #0d3322; }
  .zm-frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .9s cubic-bezier(.3,1.2,.4,1); }
  .zm-lens { position: absolute; right: 10px; top: 10px; font-family: var(--pixel-font); font-size: 10px; color: #fff; background: rgba(10,36,24,.75);
    padding: 6px 8px; border-radius: 8px; border: 2px solid var(--ink); }
  .zm-out { display: flex; margin: 12px auto 0; }
  .zm-sol { font-family: var(--display); font-weight: 700; font-size: 20px; color: var(--forest); text-align: center; margin: 10px 0 0; min-height: 1.2em; }
  `);
  const LEVELS = [7, 4, 2.2, 1];
  const POINTS = [3, 2, 1, 1];

  window.DOOR_TYPES.zoom = function (el, day, data, api) {
    const rounds = data.rounds || [];
    let r = 0, z = 0, total = 0, locked = false;
    el.innerHTML = `<p class="lead">${data.intro || ""}</p><div class="zm-stage"></div><div class="zm-after"></div>`;
    const stage = el.querySelector(".zm-stage");

    function apply() {
      const img = stage.querySelector("img"), rd = rounds[r];
      img.style.transformOrigin = `${rd.x ?? 50}% ${rd.y ?? 50}%`;
      img.style.transform = `scale(${LEVELS[z]})`;
      stage.querySelector(".zm-lens").textContent = `🔍 ${LEVELS[z]}×`;
      const out = stage.querySelector(".zm-out");
      if (out) out.disabled = z >= LEVELS.length - 1;
    }

    function show() {
      z = 0; locked = false;
      const rd = rounds[r];
      const order = ADV.shuffle(rd.a.map((_, k) => k));
      stage.innerHTML = `
        <div class="adv-hud"><span>RÄTSEL ${r + 1}/${rounds.length}</span><span>★ ${total}</span></div>
        <div class="zm-frame"><img src="${rd.img}" alt=""><span class="zm-lens"></span></div>
        <button class="btn secondary zm-out">🔍 Rauszoomen (weniger Punkte)</button>
        <p class="qz-q" style="font-family:var(--display);font-weight:700;font-size:22px;margin:14px 0 0">${rd.q || "Was ist das?"}</p>
        <div class="adv-choices">${order.map(k => `<button class="adv-choice" data-k="${k}">${rd.a[k]}</button>`).join("")}</div>
        <p class="zm-sol"></p>`;
      stage.querySelector(".zm-out").addEventListener("click", () => { if (z < LEVELS.length - 1) { z++; apply(); } });
      stage.querySelectorAll(".adv-choice").forEach(b => b.addEventListener("click", () => pick(+b.dataset.k, b)));
      requestAnimationFrame(apply);
    }

    function pick(k, btn) {
      if (locked) return;
      const rd = rounds[r];
      if (k !== rd.correct) {
        btn.classList.add("wrong"); btn.disabled = true;
        if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
        if (z < LEVELS.length - 1) { z++; apply(); }
        return;
      }
      locked = true;
      const pts = POINTS[z]; total += pts;
      btn.classList.add("right");
      stage.querySelectorAll(".adv-choice").forEach(b => b.disabled = true);
      z = LEVELS.length - 1; apply();
      stage.querySelector(".zm-out").remove();
      stage.querySelector(".zm-sol").textContent = `+${pts} ★ ${rd.solution || ""}`;
      const fr = stage.querySelector(".zm-frame").getBoundingClientRect();
      FX.burst(fr.left + fr.width / 2, fr.top + fr.height / 2, { count: 60, speed: 11 });
      const nb = document.createElement("button");
      nb.className = "btn qz-next"; nb.style.marginTop = "12px";
      nb.textContent = r + 1 < rounds.length ? "Nächstes Rätsel ▶" : "Ergebnis ▶";
      nb.addEventListener("click", () => { r++; r < rounds.length ? show() : end(); });
      stage.appendChild(nb);
      setTimeout(() => nb.scrollIntoView({ block: "nearest", behavior: "smooth" }), 300);
    }

    function end() {
      const max = rounds.length * POINTS[0];
      stage.innerHTML = `<p class="qz-score" style="font-family:var(--pixel-font);font-size:14px;text-align:center;color:var(--forest)">★ ${total}/${max} PUNKTE</p>`;
      ADV.finish(el.querySelector(".zm-after"), day, data, api);
    }

    show();
  };
})();
