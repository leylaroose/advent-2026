/* Einladung / Ticket mit Checkliste: für Kochabend (Restaurant-Menü) und Ausflug (Ticket + Bingo) */
(function () {
  ADV.css("inv-css", `
  .inv-env { position: relative; width: min(92%, 340px); margin: 14px auto 0; cursor: pointer; }
  .inv-env .flap { height: 0; }
  .inv-card { position: relative; background: #fffdf6; border: 3px solid var(--ink); border-radius: 14px; box-shadow: 5px 6px 0 var(--ink); padding: 20px 18px 18px;
    text-align: center; transform-origin: 50% 0; }
  .inv-card.closed { padding: 0; height: 200px; overflow: hidden; background: var(--red); background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,.12) 0 10px, transparent 10px 22px); }
  .inv-card.closed::after { content: "✉️"; position: absolute; inset: 0; display: grid; place-items: center; font-size: 76px; animation: hop 1.4s ease-in-out infinite; }
  .inv-seal { position: absolute; left: 50%; bottom: 14px; translate: -50% 0; font-family: var(--pixel-font); font-size: 9px; color: #fff; text-shadow: 1px 1px 0 var(--ink); z-index: 2; }
  .inv-card.open { animation: unfold .7s cubic-bezier(.3,1.5,.5,1); }
  @keyframes unfold { from { transform: rotateX(-80deg) scale(.8); opacity: 0; } }
  .inv-kick { font-family: var(--pixel-font); font-size: 9px; color: var(--leaf); letter-spacing: .1em; }
  .inv-h { font-family: var(--display); font-weight: 700; font-size: 30px; line-height: 1.05; color: var(--ink); margin: 8px 0 4px; }
  .inv-sub { font-weight: 800; color: var(--forest); margin: 0 0 12px; }
  .inv-rows { border-top: 2px dashed #c8d8cc; margin-top: 10px; }
  .inv-row { padding: 10px 0; border-bottom: 2px dashed #c8d8cc; }
  .inv-row .k { display: block; font-family: var(--pixel-font); font-size: 8px; color: #7d8f85; letter-spacing: .1em; margin-bottom: 4px; }
  .inv-row .v { font-family: var(--display); font-weight: 600; font-size: 19px; color: var(--ink); }
  .inv-ticket { position: relative; background: var(--lime); border-radius: 14px; }
  .inv-ticket::before, .inv-ticket::after { content: ""; position: absolute; top: 50%; width: 26px; height: 26px; border-radius: 50%; background: var(--cream);
    border: 3px solid var(--ink); translate: 0 -50%; }
  .inv-ticket::before { left: -16px; } .inv-ticket::after { right: -16px; }
  .inv-list h3 { font-family: var(--display); font-weight: 700; font-size: 24px; color: var(--forest); text-align: center; margin: 22px 0 2px; }
  .inv-list .sub { text-align: center; font-weight: 800; margin: 0 0 8px; }
  .inv-bingo { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .inv-cell { aspect-ratio: 1; border: 3px solid var(--ink); border-radius: 14px; background: #fff; box-shadow: 2px 3px 0 var(--ink); display: grid; place-items: center;
    align-content: center; gap: 2px; padding: 4px; font: inherit; font-weight: 800; font-size: 12px; line-height: 1.15; color: var(--ink); cursor: pointer; }
  .inv-cell b { font-size: 26px; font-weight: normal; }
  .inv-cell.done { background: var(--lime); animation: popOk .4s cubic-bezier(.3,1.7,.5,1); }
  .inv-cell.done::after { content: "✓"; position: absolute; }
  .inv-check { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; font: inherit; font-weight: 800; font-size: 16px; color: var(--ink);
    background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 10px 12px; margin: 8px 0; box-shadow: 2px 3px 0 var(--ink); cursor: pointer; }
  .inv-check .bx { margin-left: auto; flex: none; width: 28px; height: 28px; border: 3px solid var(--ink); border-radius: 8px; display: grid; place-items: center; }
  .inv-check.done { background: var(--lime); } .inv-check.done .bx { background: var(--leaf); color: #fff; }
  .inv-prog { text-align: center; font-family: var(--pixel-font); font-size: 10px; color: var(--forest); margin: 10px 0 0; }
  `);

  window.DOOR_TYPES.invite = function (el, day, data, api) {
    const c = data.card || {};
    const list = data.list || [];
    const bingo = data.listStyle === "bingo";
    const key = "list-" + day;
    el.innerHTML = `
      <p class="lead">${data.intro || ""}</p>
      <div class="inv-env"><div class="inv-card closed"><span class="inv-seal">ANTIPPEN ZUM ÖFFNEN</span></div></div>
      <div class="inv-rest"></div>`;
    const card = el.querySelector(".inv-card");
    card.addEventListener("click", function open() {
      card.removeEventListener("click", open);
      card.className = "inv-card open" + (data.ticket ? " inv-ticket" : "");
      card.innerHTML = `<div class="inv-kick">${c.kicker || ""}</div><div class="inv-h">${c.title || ""}</div><p class="inv-sub">${c.sub || ""}</p>
        <div class="inv-rows">${(c.rows || []).map(r => `<div class="inv-row"><span class="k">${r.k}</span><span class="v">${r.v}</span></div>`).join("")}</div>`;
      ADV.celebrate(card, false);
      if (api && api.complete) api.complete();
      const saved = ADV.load(key, []);
      el.querySelector(".inv-rest").innerHTML = list.length ? `<div class="inv-list adv-pop" style="animation-delay:.5s"><h3>${data.listTitle || ""}</h3><p class="sub">${data.listSub || ""}</p>
        ${bingo ? `<div class="inv-bingo">${list.map((x, i) => `<button class="inv-cell ${saved.includes(i) ? "done" : ""}" data-i="${i}"><b>${x.icon}</b>${x.text}</button>`).join("")}</div>`
          : list.map((x, i) => `<button class="inv-check ${saved.includes(i) ? "done" : ""}" data-i="${i}"><span>${x.icon || ""}</span><span>${x.text}</span><span class="bx">${saved.includes(i) ? "✓" : ""}</span></button>`).join("")}
        <p class="inv-prog"></p><div class="inv-reward"></div></div>` : "";
      const rest = el.querySelector(".inv-rest");
      const upd = fresh => {
        const items = [...rest.querySelectorAll("[data-i]")], d = items.filter(x => x.classList.contains("done")).length;
        const prog = rest.querySelector(".inv-prog"); if (prog) prog.textContent = `${d}/${items.length} ${bingo ? "FELDER" : "ERLEDIGT"}`;
        const rw = rest.querySelector(".inv-reward");
        if (rw && d === items.length && items.length) {
          if (!rw.innerHTML) { rw.innerHTML = `<div class="adv-note adv-note-final adv-pop">${data.note || ""}<span class="from">${window.ADVENT.signoff || ""}</span></div>${ADV.backBtn(.6)}`; if (fresh) ADV.celebrate(rw); }
        } else if (rw) rw.innerHTML = "";
      };
      rest.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => {
        b.classList.toggle("done");
        const bx = b.querySelector(".bx"); if (bx) bx.textContent = b.classList.contains("done") ? "✓" : "";
        if (b.classList.contains("done")) { const r = b.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 20, speed: 7, size: 7, life: 60 }); if (navigator.vibrate) navigator.vibrate(15); }
        ADV.save(key, [...rest.querySelectorAll("[data-i].done")].map(x => +x.dataset.i));
        upd(true);
      }));
      upd(false);
      if (!list.length) rest.innerHTML = `<div class="adv-note adv-note-final adv-pop" style="animation-delay:.6s">${data.note || ""}<span class="from">${window.ADVENT.signoff || ""}</span></div>${ADV.backBtn(1)}`;
    });
  };
})();
