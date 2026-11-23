/* Memory mit Symbolen eures Jahres */
(function () {
  ADV.css("mem-css", `
  .mem-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: min(100%, 360px); margin: 6px auto 0; perspective: 800px; }
  .mem-card { position: relative; aspect-ratio: 1; border: 0; padding: 0; background: none; cursor: pointer; transform-style: preserve-3d;
    transition: transform .45s cubic-bezier(.3,1.4,.5,1); }
  .mem-card.up, .mem-card.done { transform: rotateY(180deg); }
  .mem-face { position: absolute; inset: 0; border: 3px solid var(--ink); border-radius: 12px; box-shadow: 2px 3px 0 var(--ink); backface-visibility: hidden;
    -webkit-backface-visibility: hidden; display: grid; place-items: center; }
  .mem-back { background: var(--leaf); background-image: repeating-linear-gradient(-45deg, #3fb56c 0 6px, transparent 6px 13px); }
  .mem-back::after { content: "?"; font-family: var(--pixel-font); font-size: 16px; color: var(--cream); text-shadow: 2px 2px 0 var(--ink); }
  .mem-front { background: #fff; transform: rotateY(180deg); font-size: clamp(28px, 9vw, 40px); }
  .mem-front img { width: 100%; height: 100%; object-fit: cover; border-radius: 9px; }
  .mem-card.done .mem-front { background: var(--lime); animation: popOk .5s ease-in-out; }
  .mem-cap { min-height: 2.6em; text-align: center; font-family: var(--display); font-weight: 600; font-size: 18px; color: var(--forest); margin: 12px 0 0; }
  .mem-cap.pop { animation: popOk .4s cubic-bezier(.3,1.7,.5,1); }
  `);

  window.DOOR_TYPES.memory = function (el, day, data, api) {
    const pairs = data.pairs || [];
    const deck = ADV.shuffle([...pairs.keys(), ...pairs.keys()]);
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="adv-hud"><span class="mem-found">PAARE: 0/${pairs.length}</span><span class="mem-moves">ZÜGE: 0</span></div>
      <div class="mem-grid">${deck.map((k, i) => `<button class="mem-card" data-k="${k}" data-i="${i}" aria-label="Karte"><span class="mem-face mem-back"></span><span class="mem-face mem-front">${pairs[k].img ? `<img src="${pairs[k].img}" alt="">` : pairs[k].icon}</span></button>`).join("")}</div>
      <p class="mem-cap">Finde die Paare!</p>
      <div class="mem-after"></div>`;
    const cards = [...el.querySelectorAll(".mem-card")], cap = el.querySelector(".mem-cap");
    let open = [], lock = false, moves = 0, found = 0;
    const timers = [];
    cards.forEach(c => c.addEventListener("click", () => {
      if (lock || c.classList.contains("up") || c.classList.contains("done")) return;
      c.classList.add("up"); open.push(c);
      if (navigator.vibrate) navigator.vibrate(8);
      if (open.length < 2) return;
      moves++; el.querySelector(".mem-moves").textContent = `ZÜGE: ${moves}`;
      const [a, b] = open; open = [];
      if (a.dataset.k === b.dataset.k) {
        timers.push(setTimeout(() => {
          a.classList.add("done"); b.classList.add("done");
          found++; el.querySelector(".mem-found").textContent = `PAARE: ${found}/${pairs.length}`;
          cap.textContent = pairs[a.dataset.k].text; cap.classList.remove("pop"); void cap.offsetWidth; cap.classList.add("pop");
          const r = b.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 30, speed: 8, size: 8, life: 70 });
          if (navigator.vibrate) navigator.vibrate(30);
          if (found === pairs.length) timers.push(setTimeout(() => ADV.finish(el.querySelector(".mem-after"), day, data, api), 700));
        }, 350));
      } else {
        lock = true;
        timers.push(setTimeout(() => { a.classList.remove("up"); b.classList.remove("up"); lock = false; }, 900));
      }
    }));
    return () => timers.forEach(clearTimeout);
  };
})();
