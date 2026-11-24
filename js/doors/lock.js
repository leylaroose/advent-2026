/* Codeschloss: Jedes Rad zeigt Symbole, die richtige Kombi kommt aus früheren Leveln. */
(function () {
  ADV.css("lck-css", `
  .lck-outer { position: relative; width: min(100%, 340px); margin: 74px auto 0; }
  .lck-outer .lck-shackle { z-index: 0; }
  .lck-box { position: relative; z-index: 1; margin: 0 auto; width: min(100%, 340px); background: linear-gradient(#3a2414, #1f130a); border: 4px solid var(--ink); border-radius: 22px;
    padding: 64px 14px 18px; box-shadow: none; }
  .lck-shackle { position: absolute; left: 50%; top: -58px; width: 130px; height: 110px; translate: -50% 0; border: 18px solid #c8c8c8; border-bottom: 0; border-radius: 70px 70px 0 0;
    box-shadow: inset 0 0 0 3px var(--ink), 0 0 0 3px var(--ink); transition: transform .7s cubic-bezier(.3,1.6,.5,1); z-index: -1; }
  .lck-outer.open .lck-shackle { transform: translateY(-30px) rotate(-18deg); transform-origin: 85% 100%; }
  .lck-title { position: absolute; left: 0; right: 0; top: 18px; text-align: center; font-family: var(--pixel-font); font-size: 10px; color: #ffc83d; letter-spacing: .1em; }
  .lck-wheels { display: grid; grid-template-columns: repeat(var(--n), 1fr); gap: 8px; }
  .lck-w { display: grid; grid-template-rows: 34px 74px 34px; border: 3px solid var(--ink); border-radius: 14px; background: #fff; overflow: hidden; box-shadow: inset 0 6px 10px rgba(0,0,0,.25); }
  .lck-w button { border: 0; background: #e6efe9; font-size: 16px; cursor: pointer; color: var(--ink); }
  .lck-w button:active { background: var(--lime); }
  .lck-sym { display: grid; place-items: center; font-size: 40px; border-block: 2px solid #c8d8cc; overflow: hidden; }
  .lck-sym img { max-width: 86%; max-height: 66px; object-fit: contain; }
  .lck-sym img.green { filter: sepia(1) hue-rotate(55deg) saturate(3) brightness(.95); }
  .lck-sym img.face { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--ink); }
  .lck-sym.spin { animation: symSpin .2s ease-out; }
  @keyframes symSpin { from { transform: translateY(-14px); opacity: .3; } }
  .lck-box.wrong { animation: nope .45s ease-in-out; }
  .lck-box.open .lck-w { border-color: var(--leaf); background: var(--lime); }
  .lck-try { display: flex; margin: 16px auto 0; }
  .lck-hints { margin-top: 18px; }
  .lck-hint { background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 10px 12px; margin: 8px 0; box-shadow: 2px 3px 0 var(--ink); font-weight: 800; font-size: 15px; display: flex; gap: 10px; }
  .lck-hint b { font-family: var(--pixel-font); font-size: 10px; color: var(--leaf); flex: none; padding-top: 3px; }
  `);

  window.DOOR_TYPES.lock = function (el, day, data, api) {
    const wheels = data.wheels || [];
    const pos = wheels.map(() => 0);
    const sym = v => /^img\//.test(v) ? `<img src="${v}" alt="" class="${/leyla|grinch/.test(v) ? "face" : ""} ${/grinch/.test(v) ? "green" : ""}">` : v;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="lck-outer"><div class="lck-shackle"></div><div class="lck-box" style="--n:${wheels.length}"><div class="lck-title">${data.lockTitle || "FINALE GESPERRT"}</div>
        <div class="lck-wheels">${wheels.map((w, i) => `<div class="lck-w"><button data-i="${i}" data-d="-1" aria-label="hoch">▲</button><div class="lck-sym">${sym(w.symbols[0])}</div><button data-i="${i}" data-d="1" aria-label="runter">▼</button></div>`).join("")}</div>
      </div></div>
      <button class="btn lck-try">🔓 Öffnen</button>
      <div class="lck-hints"><p class="lead" style="margin:0">${data.hintTitle || "Die Hinweise:"}</p>
        ${wheels.map((w, i) => `<div class="lck-hint"><b>RAD ${i + 1}</b><span>${w.hint}</span></div>`).join("")}</div>
      <div class="lck-after"></div>`;
    const box = el.querySelector(".lck-box"), syms = [...el.querySelectorAll(".lck-sym")];
    el.querySelectorAll(".lck-w button").forEach(b => b.addEventListener("click", () => {
      if (box.classList.contains("open")) return;
      const i = +b.dataset.i, n = wheels[i].symbols.length;
      pos[i] = (pos[i] + +b.dataset.d + n) % n;
      syms[i].innerHTML = sym(wheels[i].symbols[pos[i]]);
      syms[i].classList.remove("spin"); void syms[i].offsetWidth; syms[i].classList.add("spin");
      if (navigator.vibrate) navigator.vibrate(6);
    }));
    el.querySelector(".lck-try").addEventListener("click", e => {
      const ok = wheels.every((w, i) => pos[i] === w.answer);
      if (!ok) {
        box.classList.remove("wrong"); void box.offsetWidth; box.classList.add("wrong");
        if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
        return;
      }
      box.classList.add("open"); el.querySelector(".lck-outer").classList.add("open"); e.currentTarget.remove(); el.querySelector(".lck-hints").remove();
      ADV.finish(el.querySelector(".lck-after"), day, data, api, { title: data.endTitle || "SCHLOSS<br>GEKNACKT!" });
    });
  };
})();
