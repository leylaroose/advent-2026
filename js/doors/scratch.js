/* Freirubbeln: Ein Polaroid (oder anderes Bild) ist zugefroren, mit dem Finger frei rubbeln */
(function () {
  ADV.css("scr-css", `
  .scr-pola { position: relative; width: min(84%, 320px); margin: 12px auto 0; background: #fff; padding: 14px 14px 44px; border: 3px solid var(--ink);
    box-shadow: none; rotate: -2.5deg; }
  .scr-photo { position: relative; aspect-ratio: 1; overflow: hidden; background: #ddd; }
  .scr-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .scr-photo canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: grab; }
  .scr-cap { position: absolute; left: 0; right: 0; bottom: 12px; text-align: center; font-family: "Caveat", "Segoe Print", "Bradley Hand", cursive;
    font-size: 24px; color: #333; opacity: 0; transition: opacity .8s; }
  .scr-pola.done .scr-cap { opacity: 1; }
  .scr-pola.done { animation: polaPop .6s cubic-bezier(.3,1.7,.5,1); }
  @keyframes polaPop { 50% { transform: scale(1.06) rotate(2deg); } }
  .scr-pct { text-align: center; font-family: var(--pixel-font); font-size: 10px; color: var(--forest); margin-top: 14px; }
  .scr-tape { position: absolute; top: -14px; left: 50%; width: 90px; height: 26px; translate: -50% 0; rotate: 3deg; background: rgba(201,240,122,.75); border: 2px solid rgba(10,36,24,.3); }
  `);

  window.DOOR_TYPES.scratch = function (el, day, data, api) {
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="scr-pola"><div class="scr-tape"></div>
        <div class="scr-photo"><img src="${data.image}" alt=""><canvas></canvas></div>
        ${data.caption ? `<div class="scr-cap">${data.caption}</div>` : ""}
      </div>
      <p class="scr-pct">👆 RUBBEL MIT DEM FINGER!</p>
      <div class="scr-after"></div>`;
    const pola = el.querySelector(".scr-pola"), cv = el.querySelector(".scr-photo canvas"), ctx = cv.getContext("2d");
    const pct = el.querySelector(".scr-pct");
    let done = false;
    function paint() {
      const r = cv.getBoundingClientRect();
      cv.width = r.width; cv.height = r.height;
      const g = ctx.createLinearGradient(0, 0, cv.width, cv.height);
      g.addColorStop(0, "#dff3ff"); g.addColorStop(.5, "#bfe3f5"); g.addColorStop(1, "#e9f7ff");
      ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
      // Eisblumen
      ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.6;
      for (let i = 0; i < 26; i++) {
        const x = Math.random() * cv.width, y = Math.random() * cv.height, s = 10 + Math.random() * 24;
        for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); ctx.stroke(); }
      }
      ctx.fillStyle = "rgba(19,87,58,.55)"; ctx.font = "bold 22px Fredoka, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("❄ freirubbeln ❄", cv.width / 2, cv.height / 2);
    }
    requestAnimationFrame(() => requestAnimationFrame(paint));
    let down = false, lastP = null, n = 0;
    function rub(e) {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = "round"; ctx.lineWidth = 46;
      ctx.beginPath(); ctx.moveTo(lastP ? lastP.x : x, lastP ? lastP.y : y); ctx.lineTo(x, y); ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      lastP = { x, y };
      if (++n % 8 === 0) check();
      if (navigator.vibrate && n % 6 === 0) navigator.vibrate(4);
    }
    function check() {
      if (done) return;
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let clear = 0, tot = 0;
      for (let i = 3; i < d.length; i += 64) { tot++; if (d[i] < 40) clear++; }
      const p = clear / tot;
      pct.textContent = `${Math.round(Math.min(p / 0.6, 1) * 100)} % FREI`;
      if (p > 0.6 && !done) finish();
    }
    function finish() {
      done = true;
      cv.style.transition = "opacity .8s"; cv.style.opacity = "0";
      pola.classList.add("done"); pct.remove();
      setTimeout(() => ADV.finish(el.querySelector(".scr-after"), day, data, api, { title: data.endTitle || "FREIGERUBBELT!" }), 600);
    }
    cv.addEventListener("pointerdown", e => { e.preventDefault(); down = true; lastP = null; try { cv.setPointerCapture(e.pointerId); } catch (_) {} rub(e); });
    cv.addEventListener("pointermove", e => { if (down || e.buttons || e.pointerType === "touch") rub(e); });
    ["pointerup", "pointercancel"].forEach(ev => cv.addEventListener(ev, () => { down = false; lastP = null; check(); }));
  };
})();
