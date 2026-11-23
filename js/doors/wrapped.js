/* Finale: "Jan & Leyla Wrapped" als Story zum Durchtippen (wie Instagram/Spotify-Stories) */
(function () {
  ADV.css("wrp-css", `
  .wrp { position: relative; margin: 6px auto 0; width: min(100%, 380px); aspect-ratio: 9 / 15; max-height: 72svh; border: 3px solid var(--ink); border-radius: 22px; overflow: hidden;
    box-shadow: var(--shadow); background: #0b3d27; color: #fff; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
  .wrp-bars { position: absolute; left: 10px; right: 10px; top: 10px; z-index: 5; display: flex; gap: 4px; }
  .wrp-bars i { flex: 1; height: 4px; border-radius: 2px; background: rgba(255,255,255,.35); overflow: hidden; }
  .wrp-bars i b { display: block; height: 100%; width: 0; background: #fff; }
  .wrp-bars i.done b { width: 100%; }
  .wrp-bars i.cur b { animation: wrpBar var(--dur) linear forwards; }
  .wrp.paused .wrp-bars i.cur b { animation-play-state: paused; }
  @keyframes wrpBar { to { width: 100%; } }
  .wrp-slide { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 40px 22px 30px; text-align: center; animation: wrpIn .5s cubic-bezier(.3,1.4,.5,1); }
  @keyframes wrpIn { from { opacity: 0; transform: scale(1.06); } }
  .wrp-slide.photo { justify-content: flex-end; background-size: cover; background-position: center; }
  .wrp-slide.photo::before { content: ""; position: absolute; inset: 0; background: linear-gradient(transparent 40%, rgba(0,0,0,.75)); }
  .wrp-slide > * { position: relative; }
  .wrp-slide.contain > .wrp-blur { position: absolute; inset: -20px; background-size: cover; background-position: center; filter: blur(16px) brightness(.6); }
  .wrp-slide.contain > .wrp-img { position: absolute; left: 0; right: 0; top: 16%; width: 100%; max-height: 52%; object-fit: contain; }
  .wrp-k { font-family: var(--pixel-font); font-size: 10px; letter-spacing: .1em; color: var(--lime); margin-bottom: 10px; }
  .wrp-h { font-family: var(--display); font-weight: 700; font-size: clamp(30px, 9vw, 42px); line-height: 1.05; }
  .wrp-big { font-family: var(--display); font-weight: 700; font-size: clamp(70px, 24vw, 110px); line-height: 1; color: var(--lime); text-shadow: 4px 5px 0 rgba(0,0,0,.3); animation: wrpPop .7s cubic-bezier(.3,1.7,.5,1) .15s both; }
  @keyframes wrpPop { from { transform: scale(.3); opacity: 0; } }
  .wrp-t { font-weight: 800; font-size: 18px; line-height: 1.4; margin-top: 12px; }
  .wrp-list { text-align: left; margin-top: 16px; display: grid; gap: 8px; }
  .wrp-list div { display: flex; gap: 12px; align-items: center; font-family: var(--display); font-weight: 600; font-size: 20px; animation: wrpIn .5s both; }
  .wrp-list span { font-family: var(--pixel-font); font-size: 14px; color: var(--lime); width: 26px; }
  .wrp-letter { background: var(--cream); color: var(--ink); text-align: left; justify-content: flex-start; overflow-y: auto; padding-top: 34px; }
  .wrp-letter .wrp-k { color: var(--leaf); }
  .wrp-letter p { font-size: 16px; line-height: 1.55; font-weight: 700; margin: 0 0 12px; }
  .wrp-letter .sig { font-family: var(--display); font-size: 22px; color: var(--red); }
  .wrp-tapl, .wrp-tapr { position: absolute; top: 0; bottom: 0; z-index: 4; }
  .wrp-tapl { left: 0; width: 30%; } .wrp-tapr { right: 0; width: 70%; }
  .wrp-letter ~ .wrp-tapl, .wrp-letter ~ .wrp-tapr { bottom: 60px; }
  .wrp-hint { text-align: center; font-weight: 800; font-size: 14px; margin: 10px 0 0; color: var(--forest); }
  .wrp-start { position: absolute; inset: 0; z-index: 6; display: grid; place-items: center; align-content: center; gap: 18px; text-align: center; padding: 20px;
    background: radial-gradient(circle at 50% 30%, #2f9e5b, #0b3d27); }
  `);
  const BG = ["#0b3d27", "#e8414a", "#13573a", "#b9252e", "#2f9e5b", "#0a2418"];

  window.DOOR_TYPES.wrapped = function (el, day, data, api) {
    const S = data.slides || [];
    el.innerHTML = `<p class="lead">${data.intro || ""}</p>
      <div class="wrp"><div class="wrp-bars">${S.map(() => "<i><b></b></i>").join("")}</div><div class="wrp-stage"></div>
        <div class="wrp-tapl"></div><div class="wrp-tapr"></div>
        <div class="wrp-start"><div class="wrp-k">${data.kicker || ""}</div><div class="wrp-h">${data.cover || ""}</div><button class="btn wrp-go">▶ Abspielen</button></div></div>
      <p class="wrp-hint">Tippen = weiter · links tippen = zurück · gedrückt halten = Pause</p>
      <div class="wrp-after"></div>`;
    const box = el.querySelector(".wrp"), stage = el.querySelector(".wrp-stage"), bars = [...el.querySelectorAll(".wrp-bars i")];
    let i = -1, timer = 0, started = false, finished = false, remain = 0, t0 = 0;
    function show(n) {
      clearTimeout(timer);
      i = Math.max(0, Math.min(S.length - 1, n));
      const s = S[i], dur = (s.dur || (s.type === "letter" ? 0 : 5)) * 1000;
      bars.forEach((b, k) => { b.className = k < i ? "done" : k === i ? "cur" : ""; b.style.setProperty("--dur", dur + "ms"); });
      let html = "";
      if (s.type === "photo" && s.fit === "contain") html = `<div class="wrp-slide photo contain"><div class="wrp-blur" style="background-image:url('${s.img}')"></div><img class="wrp-img" src="${s.img}" alt="">${s.kicker ? `<div class="wrp-k">${s.kicker}</div>` : ""}<div class="wrp-h">${s.title || ""}</div>${s.text ? `<div class="wrp-t">${s.text}</div>` : ""}</div>`;
      else if (s.type === "photo") html = `<div class="wrp-slide photo" style="background-image:url('${s.img}')">${s.kicker ? `<div class="wrp-k">${s.kicker}</div>` : ""}<div class="wrp-h">${s.title || ""}</div>${s.text ? `<div class="wrp-t">${s.text}</div>` : ""}</div>`;
      else if (s.type === "stat") html = `<div class="wrp-slide" style="background:${s.bg || BG[i % BG.length]}"><div class="wrp-k">${s.kicker || ""}</div><div class="wrp-big">${s.big}</div><div class="wrp-h" style="font-size:26px">${s.title || ""}</div>${s.text ? `<div class="wrp-t">${s.text}</div>` : ""}</div>`;
      else if (s.type === "list") html = `<div class="wrp-slide" style="background:${s.bg || BG[i % BG.length]}"><div class="wrp-k">${s.kicker || ""}</div><div class="wrp-h">${s.title || ""}</div><div class="wrp-list">${s.items.map((x, k) => `<div style="animation-delay:${.2 + k * .25}s"><span>${k + 1}</span>${x}</div>`).join("")}</div></div>`;
      else if (s.type === "letter") html = `<div class="wrp-slide wrp-letter"><div class="wrp-k">${s.kicker || ""}</div>${s.paragraphs.map(p => `<p>${p}</p>`).join("")}<p class="sig">${s.sign || ""}</p></div>`;
      else html = `<div class="wrp-slide" style="background:${s.bg || BG[i % BG.length]}">${s.kicker ? `<div class="wrp-k">${s.kicker}</div>` : ""}<div class="wrp-h">${s.title || ""}</div>${s.text ? `<div class="wrp-t">${s.text}</div>` : ""}</div>`;
      stage.innerHTML = html;
      if (s.burst) { const r = box.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 60, speed: 11 }); }
      if (i === S.length - 1 && !finished) { finished = true; bars.forEach(b => b.className = "done"); setTimeout(end, 400); }
      remain = dur; t0 = performance.now();
      if (dur) timer = setTimeout(() => show(i + 1), dur);
    }
    function end() {
      ADV.finish(el.querySelector(".wrp-after"), day, data, api, { title: data.endTitle || "FROHE<br>WEIHNACHTEN!" });
    }
    el.querySelector(".wrp-go").addEventListener("click", e => { e.currentTarget.parentElement.remove(); started = true; show(0); });
    let skipClick = false;
    el.querySelector(".wrp-tapr").addEventListener("click", () => { if (skipClick) return (skipClick = false); if (started && i < S.length - 1) show(i + 1); });
    el.querySelector(".wrp-tapl").addEventListener("click", () => { if (skipClick) return (skipClick = false); if (started) show(i - 1); });
    let pressT = 0;
    box.addEventListener("pointerdown", () => { pressT = setTimeout(() => { if (!started) return; box.classList.add("paused"); clearTimeout(timer); remain -= performance.now() - t0; }, 250); });
    box.addEventListener("pointerup", () => { clearTimeout(pressT); if (box.classList.contains("paused")) { skipClick = true; box.classList.remove("paused"); t0 = performance.now(); if (remain > 0) timer = setTimeout(() => show(i + 1), remain); } });
    return () => clearTimeout(timer);
  };
})();
