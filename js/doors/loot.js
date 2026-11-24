/* Loot-Drop im Action-RPG-Stil: Item fällt mit Lichtstrahl, Antippen zeigt Tooltip */
(function () {
  ADV.css("lt-css", `
  .lt-scene { position: relative; height: min(56svh, 400px); margin-top: 6px; border: 3px solid var(--ink); border-radius: 18px; overflow: hidden; box-shadow: none;
    background: radial-gradient(ellipse at 50% 85%, #3b2a1a 0%, #1a120b 55%, #0c0806 100%); }
  .lt-scene::before { content: ""; position: absolute; inset: 0; background:
    radial-gradient(circle at 20% 80%, rgba(255,140,40,.15), transparent 30%), radial-gradient(circle at 85% 75%, rgba(255,140,40,.12), transparent 25%); }
  .lt-beam { position: absolute; left: 50%; bottom: 22%; width: 46px; height: 0; translate: -50% 0; border-radius: 30px 30px 0 0;
    background: linear-gradient(to top, rgba(255,166,64,.85), rgba(255,166,64,0)); filter: blur(2px); transition: height 1s cubic-bezier(.2,1,.3,1) .7s; }
  .lt-scene.dropped .lt-beam { height: 78%; animation: beamPulse 1.6s ease-in-out 1.8s infinite; }
  @keyframes beamPulse { 50% { opacity: .65; } }
  .lt-item { position: absolute; left: 50%; bottom: 22%; translate: -50% 0; width: 92px; height: 92px; display: grid; place-items: center; font-size: 62px;
    transform: translateY(-110vh) rotate(-30deg); filter: drop-shadow(0 0 14px rgba(255,166,64,.9)); cursor: pointer; border: 0; background: none; padding: 0; }
  .lt-scene.dropped .lt-item { animation: drop .9s cubic-bezier(.5,0,.75,0) forwards, bob 2s ease-in-out 1.6s infinite; }
  @keyframes drop { 70% { transform: translateY(0) rotate(10deg); } 85% { transform: translateY(-26px) rotate(-6deg); } 100% { transform: translateY(0) rotate(0); } }
  @keyframes bob { 50% { transform: translateY(-8px); } }
  .lt-label { position: absolute; left: 50%; bottom: 10%; translate: -50% 0; white-space: nowrap; font-family: Georgia, "Times New Roman", serif; font-size: 15px;
    color: #af6025; background: rgba(0,0,0,.85); border: 1px solid #af6025; padding: 4px 10px; opacity: 0; transition: opacity .4s 1.7s; cursor: pointer; }
  .lt-scene.dropped .lt-label { opacity: 1; }
  .lt-hint { position: absolute; left: 0; right: 0; top: 12px; text-align: center; font-family: var(--pixel-font); font-size: 9px; color: #e8c79a; opacity: 0;
    transition: opacity .4s 2.2s; }
  .lt-scene.dropped .lt-hint { opacity: 1; animation: blinkTxt 1.2s steps(2) 2.6s infinite; }
  .lt-tip { margin: 14px auto 0; max-width: 360px; background: rgba(8,6,4,.96); border: 2px solid #af6025; font-family: Georgia, "Times New Roman", serif;
    text-align: center; color: #c8c8c8; box-shadow: 0 0 0 2px #000, 0 8px 24px rgba(0,0,0,.4); animation: lineIn .5s cubic-bezier(.3,1.6,.5,1) both; }
  .lt-head { background: linear-gradient(#3a2414, #1f130a); border-bottom: 1px solid #af6025; padding: 8px 10px 6px; }
  .lt-name { color: #e07b2e; font-size: 21px; line-height: 1.15; }
  .lt-base { color: #e07b2e; font-size: 15px; }
  .lt-sec { padding: 8px 12px; border-bottom: 1px solid #5a3a20; font-size: 15px; line-height: 1.45; }
  .lt-sec:last-child { border-bottom: 0; }
  .lt-prop { color: #9a9a9a; } .lt-prop b { color: #fff; font-weight: normal; }
  .lt-mod { color: #8888ff; }
  .lt-flav { color: #af6025; font-style: italic; }
  .lt-where { margin-top: 16px; }
  `);

  window.DOOR_TYPES.loot = function (el, day, data, api) {
    const it = data.item || {};
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="lt-scene">
        <div class="lt-hint">ANTIPPEN ZUM AUFHEBEN</div>
        <div class="lt-beam"></div>
        <button class="lt-item" aria-label="Item">${it.icon || "🧺"}</button>
        <div class="lt-label">${it.name || ""}</div>
      </div>
      <div class="lt-out"></div>`;
    const scene = el.querySelector(".lt-scene");
    const t = setTimeout(() => {
      scene.classList.add("dropped");
      setTimeout(() => { const r = scene.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height * 0.75, { count: 50, colors: ["#ffa640", "#ffd27a", "#fff1c9", "#af6025"], shapes: ["circle", "star"], speed: 9, size: 8, life: 80 }); if (navigator.vibrate) navigator.vibrate([40, 30, 80]); }, 850);
    }, 400);
    let shown = false;
    function show() {
      if (shown) return; shown = true;
      el.querySelector(".lt-out").innerHTML = `
        <div class="lt-tip">
          <div class="lt-head"><div class="lt-name">${it.name || ""}</div><div class="lt-base">${it.base || ""}</div></div>
          ${it.props ? `<div class="lt-sec">${it.props.map(p => `<div class="lt-prop">${p}</div>`).join("")}</div>` : ""}
          <div class="lt-sec">${(it.mods || []).map(m => `<div class="lt-mod">${m}</div>`).join("")}</div>
          ${it.flavor ? `<div class="lt-sec lt-flav">${it.flavor}</div>` : ""}
        </div>
        <div class="adv-note lt-where adv-pop" style="animation-delay:.5s">📍 ${data.where || ""}</div>
        <div class="adv-center"><button class="btn adv-pop lt-got" style="animation-delay:.9s">🧺 Gefunden!</button></div>
        <div class="lt-after"></div>`;
      el.querySelector(".lt-tip").scrollIntoView({ block: "start", behavior: "smooth" });
      el.querySelector(".lt-got").addEventListener("click", e => { e.currentTarget.remove(); ADV.finish(el.querySelector(".lt-after"), day, data, api, { title: "LOOT<br>GESICHERT!" }); });
    }
    el.querySelector(".lt-item").addEventListener("click", show);
    el.querySelector(".lt-label").addEventListener("click", show);
    return () => clearTimeout(t);
  };
})();
