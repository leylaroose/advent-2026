/* Gemeinsame Helfer für alle Level */
window.DOOR_TYPES = window.DOOR_TYPES || {};
window.ADV = {
  /** CSS eines Level-Typs einmalig einfügen */
  css(id, text) {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id; s.textContent = text; document.head.appendChild(s);
  },
  /** Pixel-Banner "LEVEL X GESCHAFFT!" */
  banner(day, title = "GESCHAFFT!", sub = "") {
    return `<div class="adv-banner">LEVEL ${day}<br>${title}<small>★ ★ ★</small>${sub ? `<span class="adv-banner-sub">${sub}</span>` : ""}</div>`;
  },
  /** Konfetti + Sterne von einem Element aus */
  celebrate(el, big = true) {
    const r = (el || document.body).getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 200);
    FX.burst(x, y, { count: big ? 150 : 60, speed: 15 });
    FX.burst(x, y, { count: 30, shapes: ["star"], colors: ["#ffc83d", "#c9f07a", "#fff5df"], speed: 11, size: 15 });
    if (big) FX.rain(90);
    if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
  },
  /** Scrollt so, dass ein Abschluss-Block komplett (oder ab Oberkante) sichtbar ist */
  reveal(node) {
    const body = node.closest(".sheet-body"); if (!body) return;
    const br = body.getBoundingClientRect(), nr = node.getBoundingClientRect();
    const target = nr.height + 20 < br.height ? body.scrollTop + nr.bottom - br.bottom + 70 : body.scrollTop + nr.top - br.top - 10;
    body.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  },
  /** Button zurück zur Übersicht */
  backBtn(delay = 0) {
    return `<div class="adv-center"><button class="btn adv-back adv-pop" style="animation-delay:${delay}s" onclick="window.closeLevel && window.closeLevel()">🎄 Zurück zur Übersicht</button></div>`;
  },
  shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  },
  /** Kleiner Speicher pro Level (z. B. Checklisten) */
  load(key, fallback) { try { return JSON.parse(localStorage.getItem("advent26-" + key)) ?? fallback; } catch (e) { return fallback; } },
  save(key, val) { try { localStorage.setItem("advent26-" + key, JSON.stringify(val)); } catch (e) {} },
  /** Abschluss-Block: Banner, Nachricht, optional Notiz von Leyla */
  finish(el, day, data, api, opts = {}) {
    const wrap = document.createElement("div");
    wrap.className = "adv-finish";
    // nur zwei Elemente: Banner (mit kurzem Satz) + Nachricht von Leyla
    const msg = data.note || data.outro;
    wrap.innerHTML = `${ADV.banner(day, opts.title)}
      ${msg ? `<div class="adv-note adv-note-final adv-pop" style="animation-delay:.7s">${msg}<span class="from">${window.ADVENT.signoff || ""}</span></div>` : ""}
      ${ADV.backBtn(msg ? 1.2 : .7)}`;
    el.appendChild(wrap);
    if (api && api.complete) api.complete();
    setTimeout(() => { ADV.reveal(wrap); ADV.celebrate(wrap.querySelector(".adv-banner")); }, 120);
    setTimeout(() => ADV.reveal(wrap), 1500); // nochmal, nachdem alles eingeblendet ist
    return wrap;
  }
};
