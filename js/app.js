(function () {
  const A = window.ADVENT;
  const YEAR = A.year;
  const $ = s => document.querySelector(s);

  // ---------- Datum (Europe/Berlin) ----------
  const params = new URLSearchParams(location.search);
  function berlinToday() {
    const o = params.get("datum");
    if (o && /^\d{4}-\d{2}-\d{2}$/.test(o)) return o;
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date());
  }
  const pad = n => String(n).padStart(2, "0");
  const toUTC = s => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const daysBetween = (a, b) => Math.round((toUTC(b) - toUTC(a)) / 864e5);
  const unlockDate = d => `${YEAR}-12-${pad(d)}`;
  let today = berlinToday();
  const sleepsUntil = d => daysBetween(today, unlockDate(d));
  const isOpenable = d => sleepsUntil(d) <= 0;
  const sleepText = n => n === 1 ? "Noch 1 Mal schlafen 😴" : `Noch ${n} Mal schlafen 😴`;
  const todayDay = () => {
    const n = daysBetween(`${YEAR}-12-01`, today);
    return n >= 0 && n < 24 ? n + 1 : null;
  };

  // ---------- Gespeicherter Zustand ----------
  const KEY = "advent26-opened";
  // ?reset=1 setzt alle geöffneten Level zurück (zum Testen)
  if (params.has("reset")) {
    try { localStorage.removeItem(KEY); } catch (e) {}
    params.delete("reset");
    const q = params.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : "") + location.hash);
  }
  let opened = new Set();
  try { opened = new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch (e) {}
  function markOpened(d) {
    opened.add(d);
    try { localStorage.setItem(KEY, JSON.stringify([...opened])); } catch (e) {}
  }

  // ---------- Deko: Sterne, Lichterkette, Bäume ----------
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const sky = $(".sky");
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("i");
    s.className = "star";
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--s:${8 + Math.random() * 14}px;--d:${2 + Math.random() * 3}s;--delay:${-Math.random() * 5}s;--c:${Math.random() < .25 ? "#a6e8bf" : "#ffc83d"}`;
    sky.appendChild(s);
  }

  const lights = $(".lights");
  const bulbColors = ["#ffc83d", "#e8414a", "#c9f07a", "#7fd7ff", "#ff9de1"];
  function buildLights() {
    const W = innerWidth;
    const nb = Math.max(8, Math.round(W / 36));
    const sagAt = t => Math.sin(t * Math.PI) * 20 + 4;
    let d = `M 0 ${sagAt(0)}`;
    for (let i = 1; i <= 40; i++) { const t = i / 40; d += ` L ${t * W} ${sagAt(t)}`; }
    let html = `<svg viewBox="0 0 ${W} 30" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#0a2418" stroke-width="2.5"/></svg>`;
    for (let i = 0; i < nb; i++) {
      const t = (i + 0.5) / nb;
      if (Math.abs(t - 0.5) < 0.1) continue; // Platz für die Schleife
      html += `<i class="bulb" style="left:${t * W - 5.5}px;top:${sagAt(t) + 4}px;--c:${bulbColors[i % bulbColors.length]};--d:${0.9 + (i % 3) * 0.35}s;--delay:${-(i * 0.27)}s;rotate:${(t - 0.5) * -36}deg"></i>`;
    }
    lights.innerHTML = html;
  }

  const trees = $(".trees");
  const treeSVG = c => `<svg viewBox="0 0 60 90"><path d="M30 2 L50 34 H40 L56 58 H42 L58 80 H2 L18 58 H4 L20 34 H10 Z" fill="${c}" stroke="#0a2418" stroke-width="3.5" stroke-linejoin="round"/><rect x="25" y="79" width="10" height="10" fill="#7a4a21" stroke="#0a2418" stroke-width="3"/><circle cx="30" cy="4" r="5" fill="#ffc83d" stroke="#0a2418" stroke-width="2.5"/></svg>`;
  [[3, 60, 40], [14, 52, 30], [76, 58, 36], [88, 46, 48], [55, 44, 24]].forEach(([l, b, w], i) => {
    const t = document.createElement("div");
    t.className = "tree";
    t.style.cssText = `--l:${l}%;--b:${b}px;--w:${w}px;--d:${2.6 + i * 0.4}s;--delay:${-i * 0.7}s`;
    t.innerHTML = treeSVG(["#2f9e5b", "#13573a", "#2f9e5b", "#13573a", "#3fb56c"][i]);
    trees.appendChild(t);
  });

  // Überschrift: jede Zeile ein Eintrag, die letzte in Akzentfarbe
  const lines = A.title || ["Für", A.recipient];
  $("#title").innerHTML = lines.map((l, i) =>
    `<span class="line${i === lines.length - 1 ? " accent" : ""}">${l.split(" ").map(w => `<span class="w">${w}</span>`).join(" ")}</span>`).join("");
  $("#pill").textContent = A.pill || "";
  $("#sign").textContent = A.signature;

  // ---------- Türchen verteilen ----------
  const STYLES = [
    { c1: "#2f9e5b", c2: "#3fb56c", n: "#fff5df", p: "stripes" },
    { c1: "#fff5df", c2: "#a6e8bf", n: "#2f9e5b", p: "dots" },
    { c1: "#13573a", c2: "#1d6b48", n: "#c9f07a", p: "check" },
    { c1: "#e8414a", c2: "#f06a71", n: "#fff5df", p: "stripes" },
    { c1: "#a6e8bf", c2: "#8fd8ab", n: "#13573a", p: "vstripes" },
    { c1: "#c9f07a", c2: "#b4df60", n: "#13573a", p: "dots" },
    { c1: "#fff5df", c2: "#ffc83d", n: "#13573a", p: "stars" },
    { c1: "#ffc83d", c2: "#ffd970", n: "#b9252e", p: "hstripes" },
    { c1: "#fff5df", c2: "#f5b7ba", n: "#e8414a", p: "check" },
    { c1: "#2f9e5b", c2: "#278a4f", n: "#fff5df", p: "zigzag" },
    { c1: "#13573a", c2: "#a6e8bf", n: "#fff5df", p: "dots" },
    { c1: "#e6f7ec", c2: "#c4ead2", n: "#13573a", p: "vstripes" }
  ];
  const BIG = new Set([1, 24, 6, 11, 18, 3]);
  const rnd = seeded(2026);
  const order = Array.from({ length: 24 }, (_, i) => i + 1);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const doorMeta = {};
  order.forEach((d, idx) => {
    const big = BIG.has(d);
    doorMeta[d] = {
      idx,
      style: STYLES[(d * 7) % STYLES.length],
      scale: big ? 0.8 : 0.6 + rnd() * 0.14,
      jx: rnd(), jy: rnd(),
      rot: (rnd() - 0.5) * (big ? 8 : 14),
      dur: 2.2 + rnd() * 1.6,
      delay: -rnd() * 4,
      ribbon: rnd() < 0.35 ? (rnd() < 0.5 ? "v" : "vh") : ""
    };
  });

  const cal = $("#calendar");
  const hero = $("#hero");
  const doorEls = {};
  function buildDoors() {
    cal.querySelectorAll(".door").forEach(e => e.remove());
    const W = cal.clientWidth;
    const PAD = 14;
    const cols = 3, rows = 8;
    const cellW = (W - PAD * 2) / cols, cellH = cellW * 0.96;
    cal.style.height = rows * cellH + 24 + "px";
    const td = todayDay();
    for (let d = 1; d <= 24; d++) {
      const m = doorMeta[d];
      const r = Math.floor(m.idx / cols), c = m.idx % cols;
      const size = cellW * m.scale;
      const foot = size * 1.2; // Platz für Drehung + Wippen
      const x = PAD + c * cellW + (cellW - size) / 2 + (m.jx - 0.5) * Math.max(0, cellW - foot);
      const y = 16 + r * cellH + (cellH - size) / 2 + (m.jy - 0.5) * Math.max(0, cellH - foot);
      const b = document.createElement("button");
      b.className = "door";
      b.dataset.day = d;
      b.dataset.pattern = m.style.p;
      b.style.cssText = `--x:${x}px;--y:${y}px;--size:${size}px;--rot:${m.rot}deg;--dur:${m.dur}s;--delay:${m.delay}s;--c1:${m.style.c1};--c2:${m.style.c2};--n:${m.style.n}`;
      const bands = m.ribbon ? `<span class="band"></span>${m.ribbon === "vh" ? '<span class="band h"></span>' : ""}` : "";
      b.innerHTML = `<span class="box"><span class="inside"><span class="clear">CLEAR</span><span class="star-in"></span><span class="num-small">${d}</span></span><span class="lid">${bands}<span class="lvl">LVL</span><span class="num">${d}</span></span></span>`;
      const openable = isOpenable(d);
      b.setAttribute("aria-label", `Level ${d}, ${opened.has(d) ? "geschafft" : openable ? "bereit" : "gesperrt"}`);
      if (opened.has(d)) b.classList.add("opened");
      if (d === td && !opened.has(d)) b.classList.add("today");
      b.addEventListener("click", () => onDoor(d));
      cal.appendChild(b);
      doorEls[d] = b;
    }
  }

  function updateStatus() {
    const s = $("#status");
    const first = sleepsUntil(1);
    const td = todayDay();
    let missed = 0;
    for (let d = 1; d <= 24; d++) if (isOpenable(d) && !opened.has(d) && d !== td) missed++;
    if (first > 0) s.textContent = first === 1 ? "Noch 1 Mal schlafen bis Level 1! 🎮" : `Noch ${first} Mal schlafen bis Level 1! 🎮`;
    else if (td && !opened.has(td)) s.textContent = `Level ${td} ist frei! Wo ist es? 👀`;
    else if (td && missed) s.textContent = `Noch ${missed} Level zum Nachholen 👀`;
    else if (td) s.textContent = "Level geschafft! Morgen geht's weiter 🎄";
    else s.textContent = "Frohe Weihnachten, Player 1! 🎄";
    const n = opened.size;
    $("#xpText").textContent = `${n}/24`;
    requestAnimationFrame(() => { $("#xpFill").style.width = (n / 24 * 100) + "%"; });
  }

  // ---------- Interaktion ----------
  let bubbleEl = null, bubbleTimer = null;
  function showBubble(d, text) {
    if (bubbleEl) bubbleEl.remove();
    clearTimeout(bubbleTimer);
    const r = doorEls[d].getBoundingClientRect();
    bubbleEl = document.createElement("div");
    bubbleEl.className = "bubble";
    bubbleEl.textContent = text;
    document.body.appendChild(bubbleEl);
    const bw = bubbleEl.offsetWidth, bh = bubbleEl.offsetHeight;
    const cx = r.left + r.width / 2;
    const left = Math.max(8, Math.min(innerWidth - bw - 8, cx - bw / 2));
    const above = r.top - bh - 16 > 8;
    bubbleEl.style.left = left + "px";
    bubbleEl.style.top = (above ? r.top - bh - 14 : r.bottom + 14) + "px";
    bubbleEl.style.setProperty("--tail-x", Math.max(16, Math.min(bw - 16, cx - left)) + "px");
    if (!above) bubbleEl.classList.add("below");
    const me = bubbleEl;
    bubbleTimer = setTimeout(() => { me.classList.add("out"); setTimeout(() => me.remove(), 300); }, 2200);
  }

  function onDoor(d) {
    const el = doorEls[d];
    if (!isOpenable(d)) {
      el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope");
      if (navigator.vibrate) navigator.vibrate(40);
      showBubble(d, "🔒 " + sleepText(sleepsUntil(d)));
      const r = el.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 14, colors: ["#ffffff", "#dff5ea"], shapes: ["circle"], speed: 5, gravity: 0.08, size: 7, life: 60 });
      return;
    }
    if (opened.has(d)) { openSheet(d); return; }
    el.classList.add("opening");
    el.classList.remove("today");
    if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    const r = el.getBoundingClientRect();
    setTimeout(() => {
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 140, speed: 16 });
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 26, shapes: ["star"], colors: ["#ffc83d", "#c9f07a"], speed: 10, size: 16 });
    }, 250);
    setTimeout(() => {
      el.classList.remove("opening");
      el.classList.add("opened");
      markOpened(d);
      updateStatus();
      openSheet(d);
    }, 900);
  }

  const sheet = $("#sheet"), scrim = $("#scrim");
  const WD = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  let cleanup = null;
  function openSheet(d) {
    const data = A.days[d] || { type: "bald", title: `Türchen ${d}` };
    const wd = WD[new Date(toUTC(unlockDate(d))).getUTCDay()];
    $("#sheetDay").textContent = `LEVEL ${d} · ${wd.slice(0, 2).toUpperCase()} ${d}.12.`;
    $("#sheetTitle").textContent = data.title;
    const body = $("#sheetBody");
    body.innerHTML = "";
    body.scrollTop = 0;
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    const render = window.DOOR_TYPES[data.type] || window.DOOR_TYPES.bald;
    sheet.hidden = false;
    document.body.classList.add("sheet-open");
    scrim.classList.add("show");
    void sheet.offsetWidth;
    sheet.classList.remove("show"); void sheet.offsetWidth;
    sheet.classList.add("show");
    cleanup = render(body, d, data, { year: YEAR }) || null;
    if (location.hash !== "#" + d) history.replaceState(null, "", location.pathname + location.search + "#" + d);
  }
  function closeSheet() {
    sheet.classList.remove("show");
    scrim.classList.remove("show");
    document.body.classList.remove("sheet-open");
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    history.replaceState(null, "", location.pathname + location.search);
    setTimeout(() => { if (!sheet.classList.contains("show")) sheet.hidden = true; }, 650);
  }
  $("#closeSheet").addEventListener("click", closeSheet);
  scrim.addEventListener("click", closeSheet);
  addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("show")) closeSheet(); });

  // ---------- Start ----------
  buildLights();
  buildDoors();
  updateStatus();
  let lastW = innerWidth, lastH = innerHeight;
  addEventListener("resize", () => {
    if (Math.abs(innerWidth - lastW) > 30) {
      lastW = innerWidth; lastH = innerHeight; buildLights(); buildDoors();
    }
  });

  // Mitternacht (Berlin) überschreiten, ohne neu zu laden
  setInterval(() => {
    const t = berlinToday();
    if (t !== today) { today = t; buildDoors(); updateStatus(); }
  }, 60000);

  // Direktlink #5 öffnet Türchen 5 (z. B. aus der Morgen-Mail)
  const h = parseInt(location.hash.slice(1), 10);
  if (h >= 1 && h <= 24) {
    setTimeout(() => {
      doorEls[h].scrollIntoView({ block: "center", behavior: "smooth" });
      setTimeout(() => onDoor(h), 500);
    }, 600);
  }
})();
