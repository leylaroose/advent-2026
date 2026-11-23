/* "Such was in der Wohnung"-Level (Nikolaus, später auch für den POE-Korb nutzbar) */
(function () {
  ADV.css("find-css", `
  .fnd { text-align: center; }
  .fnd-boot { width: 150px; margin: 10px auto 0; display: block; animation: bootHop 1.4s ease-in-out infinite; transform-origin: 50% 100%; filter: drop-shadow(4px 5px 0 var(--ink)); }
  @keyframes bootHop { 0%,100% { transform: rotate(-6deg) translateY(0); } 40% { transform: rotate(5deg) translateY(-14px); } 60% { transform: rotate(-3deg) translateY(0) scale(1.05,.95); } }
  .fnd-hint { margin: 18px 0 0; text-align: left; }
  .fnd-hint .lbl { font-family: var(--pixel-font); font-size: 9px; color: var(--leaf); display: block; margin-bottom: 6px; }
  .fnd-more { margin-top: 12px; }
  .fnd-found { margin-top: 18px; }
  `);

  const boot = `<svg class="fnd-boot" viewBox="0 0 160 170">
    <path d="M40 20 H100 V110 Q100 120 112 122 L140 128 Q156 132 154 148 L152 160 H30 Q24 160 24 150 V40 Q24 20 40 20Z" fill="#e8414a" stroke="#0a2418" stroke-width="6" stroke-linejoin="round"/>
    <rect x="18" y="8" width="94" height="30" rx="12" fill="#fff" stroke="#0a2418" stroke-width="6"/>
    <circle cx="40" cy="23" r="4" fill="#d9f3e3"/><circle cx="62" cy="20" r="3" fill="#d9f3e3"/><circle cx="88" cy="25" r="4" fill="#d9f3e3"/>
    <path d="M30 150 H152" stroke="#0a2418" stroke-width="6"/>
    <path d="M60 60 l6 12 13 2 -10 9 3 13 -12 -7 -12 7 3 -13 -10 -9 13 -2z" fill="#ffc83d" stroke="#0a2418" stroke-width="3" stroke-linejoin="round"/>
  </svg>`;

  window.DOOR_TYPES.find = function (el, day, data, api) {
    const hints = data.hints || [];
    el.innerHTML = `
      <div class="fnd">
        ${data.icon === "boot" ? boot : `<span class="adv-big-emoji">${data.icon || "🎁"}</span>`}
        <p class="adv-msg">${data.intro || ""}</p>
        <div class="adv-note fnd-hint"><span class="lbl">HINWEIS 1/${hints.length}</span><span class="fnd-txt">${hints[0] || ""}</span></div>
        ${hints.length > 1 ? `<button class="btn secondary fnd-more">💡 Noch ein Hinweis</button>` : ""}
        <div><button class="btn fnd-found">${data.foundLabel || "🎉 Gefunden!"}</button></div>
        <div class="fnd-after"></div>
      </div>`;
    let h = 0;
    const more = el.querySelector(".fnd-more");
    if (more) more.addEventListener("click", () => {
      h = Math.min(h + 1, hints.length - 1);
      el.querySelector(".fnd-txt").textContent = hints[h];
      el.querySelector(".fnd-hint .lbl").textContent = `HINWEIS ${h + 1}/${hints.length}`;
      el.querySelector(".fnd-hint").animate([{ transform: "scale(.9) rotate(-3deg)" }, { transform: "none" }], { duration: 350, easing: "cubic-bezier(.3,1.7,.5,1)" });
      if (h === hints.length - 1) more.remove();
    });
    el.querySelector(".fnd-found").addEventListener("click", e => {
      e.currentTarget.remove();
      if (more && more.isConnected) more.remove();
      ADV.finish(el.querySelector(".fnd-after"), day, data, api, { title: data.endTitle });
    });
  };
})();
