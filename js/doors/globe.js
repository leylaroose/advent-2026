/* Schneekugel: Foto in einer Schneekugel. Handy schütteln (oder Kugel antippen), dann schneit es und eine Botschaft erscheint. */
(function () {
  ADV.css("glb-css", `
  .glb { position: relative; width: min(82%, 300px); margin: 10px auto 0; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .glb-ball { position: relative; aspect-ratio: 1; border-radius: 50%; overflow: hidden; border: 4px solid var(--ink); box-shadow: inset -14px -18px 30px rgba(255,255,255,.35), inset 10px 10px 30px rgba(0,0,0,.15), 4px 6px 0 var(--ink);
    background: #cfe9f5; cursor: pointer; }
  .glb-ball img { position: absolute; left: 12%; top: 14%; width: 76%; height: 76%; object-fit: cover; border-radius: 50%; }
  .glb-frost { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #ffffff, #dff2fb 60%, #bfe3f5); transition: opacity .4s;
    display: grid; place-items: center; }
  .glb-frost::after { content: "❄️"; font-size: 64px; opacity: .8; animation: spin 8s linear infinite; }
  .glb-ball canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .glb-ball::after { content: ""; position: absolute; left: 16%; top: 10%; width: 28%; height: 16%; border-radius: 50%; background: rgba(255,255,255,.55); rotate: -30deg; filter: blur(2px); }
  .glb-base { width: 78%; height: 54px; margin: -10px auto 0; background: linear-gradient(#e8414a, #b9252e); border: 4px solid var(--ink); border-radius: 10px 10px 18px 18px;
    box-shadow: 4px 5px 0 var(--ink); display: grid; place-items: center; font-family: var(--display); font-weight: 700; color: #fff; font-size: 17px; position: relative; z-index: 2; }
  .glb.shake .glb-ball { animation: glbShake .4s ease-in-out; }
  @keyframes glbShake { 25% { transform: rotate(-8deg) translateX(-6px); } 75% { transform: rotate(8deg) translateX(6px); } }
  .glb-hint { text-align: center; font-weight: 900; margin: 14px 0 0; }
  .glb-hint b { display: inline-block; animation: hop 1s ease-in-out infinite; }
  .glb-msg { display: none; }
  .glb-count { text-align: center; margin-top: 16px; }
  .glb-count .n { font-family: var(--pixel-font); font-size: 26px; color: var(--leaf); text-shadow: 2px 2px 0 var(--ink); }
  .glb-count .l { font-weight: 800; }
  `);

  window.DOOR_TYPES.globe = function (el, day, data, api) {
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="glb"><div class="glb-ball"><img src="${data.image}" alt=""><div class="glb-frost"></div><canvas></canvas></div><div class="glb-base">${data.base || ""}</div></div>
      <p class="glb-hint"><b>👆 Tipp auf die Kugel</b> und schüttel dein Handy!</p>
      <div class="glb-after"></div>`;
    const g = el.querySelector(".glb"), cv = g.querySelector("canvas"), ctx = cv.getContext("2d");
    let flakes = [], raf = 0, energy = 0, shakes = 0, done = false, asked = false, last = null;
    const DPR = Math.min(devicePixelRatio || 1, 2);
    function size() { const r = cv.getBoundingClientRect(); cv.width = r.width * DPR; cv.height = r.height * DPR; }
    requestAnimationFrame(size);
    function stir(n) {
      energy = Math.min(1, energy + 0.35);
      for (let i = 0; i < n; i++) flakes.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * 6 * DPR, vy: (Math.random() - .8) * 5 * DPR, r: (1.5 + Math.random() * 2.5) * DPR });
      if (flakes.length > 260) flakes.splice(0, flakes.length - 260);
      g.classList.remove("shake"); void g.offsetWidth; g.classList.add("shake");
      if (navigator.vibrate) navigator.vibrate(15);
      shakes++;
      const fr = g.querySelector(".glb-frost"); if (fr) fr.style.opacity = Math.max(0, 1 - shakes / (data.shakes || 12));
      if (shakes >= (data.shakes || 12) && !done) reveal();
    }
    function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#fff";
      flakes.forEach(f => {
        f.vx *= 0.985; f.vy = f.vy * 0.985 + 0.05 * DPR; f.x += f.vx; f.y += f.vy;
        if (f.y > cv.height - f.r) { f.y = cv.height - f.r; f.vy = 0; f.vx *= .8; }
        if (f.x < 0 || f.x > cv.width) f.vx *= -1;
        ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    function onMotion(e) {
      const a = e.accelerationIncludingGravity; if (!a || a.x == null) return;
      if (last) { const d = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z); if (d > 16) stir(18); }
      last = { x: a.x, y: a.y, z: a.z };
    }
    function askMotion() {
      if (asked) return; asked = true;
      const DME = window.DeviceMotionEvent;
      if (DME && typeof DME.requestPermission === "function") DME.requestPermission().then(r => { if (r === "granted") addEventListener("devicemotion", onMotion); }).catch(() => {});
      else if (DME) addEventListener("devicemotion", onMotion);
    }
    const ball = g.querySelector(".glb-ball");
    ball.addEventListener("pointerdown", () => stir(20));
    ball.addEventListener("click", askMotion);
    function reveal() {
      done = true;
      el.querySelector(".glb-hint").remove();
      const after = el.querySelector(".glb-after");
      ADV.finish(after, day, data, api, { title: data.endTitle || "LET IT SNOW!" });
      if (data.reunion) {
        const days = Math.max(0, Math.round((Date.UTC(...data.reunion.split("-").map((v, i) => i === 1 ? v - 1 : +v)) - Date.now()) / 864e5));
        const c = document.createElement("div"); c.className = "glb-count adv-pop"; c.style.animationDelay = ".4s";
        c.innerHTML = `<div class="n">${days}</div><div class="l">${data.reunionText || "Tage, bis wir uns wiedersehen"}</div>`;
        after.querySelector(".adv-banner").after(c);
      }
    }
    return () => { cancelAnimationFrame(raf); removeEventListener("devicemotion", onMotion); };
  };
})();
