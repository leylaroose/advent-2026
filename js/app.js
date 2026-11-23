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
  for (let i = 0; i < 26; i++) {
    const s = document.createElement("i");
    s.className = "star";
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--s:${8 + Math.random() * 16}px;--d:${2 + Math.random() * 3}s;--delay:${-Math.random() * 5}s;--c:${Math.random() < .25 ? "#a6e8bf" : "#ffc83d"}`;
    sky.appendChild(s);
  }

  const lights = $(".lights");
  const bulbColors = ["#ffc83d", "#e8414a", "#c9f07a", "#7fd7ff", "#ff9de1"];
  const nb = Math.max(9, Math.round(innerWidth / 34));
  for (let i = 0; i < nb; i++) {
    const t = (i + 0.5) / nb;
    const b = document.createElement("i");
    b.className = "bulb";
    const sag = Math.sin(t * Math.PI) * 22;
    b.style.cssText = `left:calc(${t * 100}% - 6px);top:${sag + 3}px;--c:${bulbColors[i % bulbColors.length]};--d:${0.9 + (i % 3) * 0.35}s;--delay:${-(i * 0.27)}s;rotate:${(t - 0.5) * -40}deg`;
    lights.appendChild(b);
  }

  const trees = $(".trees");
  const treeSVG = c => `<svg viewBox="0 0 60 90"><path d="M30 2 L50 34 H40 L56 58 H42 L58 80 H2 L18 58 H4 L20 34 H10 Z" fill="${c}" stroke="#0a2418" stroke-width="3.5" stroke-linejoin="round"/><rect x="25" y="79" width="10" height="10" fill="#7a4a21" stroke="#0a2418" stroke-width="3"/><circle cx="30" cy="4" r="5" fill="#ffc83d" stroke="#0a2418" stroke-width="2.5"/></svg>`;
  [[4, 56, 46], [16, 44, 34], [74, 52, 42], [88, 40, 54], [56, 30, 28]].forEach(([l, b, w], i) => {
    const t = document.createElement("div");
    t.className = "tree";
    t.style.cssText = `--l:${l}%;--b:${b}px;--w:${w}px;--d:${2.6 + i * 0.4}s;--delay:${-i * 0.7}s`;
    t.innerHTML = treeSVG(["#2f9e5b", "#13573a", "#2f9e5b", "#13573a", "#3fb56c"][i]);
    trees.appendChild(t);
  });

  $("#recipient").textContent = A.recipient;
  $("#sign").textContent = A.signature;

  // ---------- Türchen verteilen ----------
  const STYLES = [
    { c1: "#2f9e5b", c2: "#3fb56c", n: "#fff5df", p: "stripes" },
    { c1: "#fff5df", c2: "#a6e8bf", n: "#2f9e5b", p: "dots" },
    { c1: "#13573a", c2: "#1d6b48", n: "#c9f07a", p: "check" },
    { c1: "#e8414a", c2: "#f06a71", n: "#fff5df", p: "stripes" },
    { c1: "#a6e8bf", c2: "#8fd8ab", n: "#13573a", p: "zigzag" },
    { c1: "#c9f07a", c2: "#b4df60", n: "#13573a", p: "dots" },
    { c1: "#0b3d27", c2: "#2f9e5b", n: "#ffc83d", p: "stars" },
    { c1: "#ffc83d", c2: "#ffd970", n: "#b9252e", p: "hstripes" },
    { c1: "#fff5df", c2: "#f5b7ba", n: "#e8414a", p: "check" },
    { c1: "#2f9e5b", c2: "#278a4f", n: "#fff5df", p: "zigzag" },
    { c1: "#13573a", c2: "#a6e8bf", n: "#fff5df", p: "dots" },
    { c1: "#a6e8bf", c2: "#fff5df", n: "#0b3d27", p: "stripes" }
  ];
  const BIG = new Set([1, 24, 6, 11, 18]);
  const rnd = seeded(2026);
  const order = Array.from({ length: 24 }, (_, i) => i + 1);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const doorMeta = {};
  order.forEach((d, idx) => {
    const style = STYLES[(d * 7) % STYLES.length];
    doorMeta[d] = {
      idx, style,
      scale: BIG.has(d) ? 0.86 + rnd() * 0.06 : 0.6 + rnd() * 0.2,
      jx: rnd(), jy: rnd(),
      rot: (rnd() - 0.5) * 16,
      dur: 2.2 + rnd() * 1.6,
      delay: -rnd() * 4,
      ribbon: rnd() < 0.3 ? (rnd() < 0.5 ? "v" : "vh") : "",
      snow: rnd() < 0.35
    };
  });

  const cal = $("#calendar");
  const doorEls = {};
  function buildDoors() {
    cal.innerHTML = "";
    const W = cal.clientWidth;
    const cols = 3, rows = 8;
    const cellW = W / cols, cellH = cellW * 0.98;
    cal.style.height = rows * cellH + 20 + "px";
    const td = todayDay();
    for (let d = 1; d <= 24; d++) {
      const m = doorMeta[d];
      const r = Math.floor(m.idx / cols), c = m.idx % cols;
      const size = Math.min(cellW * m.scale, cellH * 0.94);
      const x = c * cellW + (cellW - size) * (0.15 + m.jx * 0.7);
      const y = r * cellH + (cellH - size) * (0.1 + m.jy * 0.8) + 10;
      const b = document.createElement("button");
      b.className = "door";
      b.dataset.day = d;
      b.dataset.pattern = m.style.p;
      if (m.snow) b.dataset.snow = "";
      b.style.cssText = `--x:${x}px;--y:${y}px;--size:${size}px;--rot:${m.rot}deg;--dur:${m.dur}s;--delay:${m.delay}s;--c1:${m.style.c1};--c2:${m.style.c2};--n:${m.style.n}`;
      const bands = m.ribbon ? `<span class="band"></span>${m.ribbon === "vh" ? '<span class="band h"></span>' : ""}` : "";
      b.innerHTML = `<span class="box"><span class="inside"><span class="num-small">${d}</span></span><span class="lid">${bands}<span class="num">${d}</span></span></span>`;
      const openable = isOpenable(d);
      b.setAttribute("aria-label", `Türchen ${d}, ${opened.has(d) ? "offen" : openable ? "bereit" : "noch zu"}`);
      if (opened.has(d)) b.classList.add("opened");
      if (d === td && !opened.has(d)) {
        b.classList.add("today");
        b.insertAdjacentHTML("beforeend", '<span class="tag">HEUTE</span>');
      }
      b.addEventListener("click", () => onDoor(d));
      cal.appendChild(b);
      doorEls[d] = b;
    }
  }

  function updateStatus() {
    const s = $("#status");
    const first = sleepsUntil(1);
    const td = todayDay();
    if (first > 0) s.textContent = `Noch ${first} Mal schlafen bis zum ersten Türchen!`;
    else if (td && !opened.has(td)) s.textContent = `Türchen ${td} wartet auf dich! ✨`;
    else if (td) s.textContent = `Morgen gibt's das nächste Türchen 🎄`;
    else s.textContent = "Frohe Weihnachten! 🎄";
    const missed = [];
    for (let d = 1; d <= 24; d++) if (isOpenable(d) && !opened.has(d) && d !== td) missed.push(d);
    if (missed.length && first <= 0) s.textContent += ` Nachholen: ${missed.length === 1 ? "Türchen " + missed[0] : missed.length + " Türchen"}`;
  }

  // ---------- Interaktion ----------
  let bubbleEl = null, bubbleTimer = null;
  function showBubble(d, text) {
    if (bubbleEl) bubbleEl.remove();
    clearTimeout(bubbleTimer);
    const el = doorEls[d];
    const r = el.getBoundingClientRect(), cr = cal.getBoundingClientRect();
    bubbleEl = document.createElement("div");
    bubbleEl.className = "bubble";
    bubbleEl.textContent = text;
    cal.appendChild(bubbleEl);
    const bw = bubbleEl.offsetWidth;
    let left = r.left - cr.left + r.width / 2;
    left = Math.max(bw / 2 + 8, Math.min(cr.width - bw / 2 - 8, left));
    bubbleEl.style.left = left + "px";
    bubbleEl.style.top = r.top - cr.top - 14 + "px";
    const me = bubbleEl;
    bubbleTimer = setTimeout(() => { me.classList.add("out"); setTimeout(() => me.remove(), 300); }, 2200);
  }

  function onDoor(d) {
    const el = doorEls[d];
    if (!isOpenable(d)) {
      el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope");
      if (navigator.vibrate) navigator.vibrate(40);
      showBubble(d, sleepText(sleepsUntil(d)));
      const r = el.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 14, colors: ["#ffffff", "#dff5ea"], shapes: ["circle"], speed: 5, gravity: 0.08, size: 7, life: 60 });
      return;
    }
    if (opened.has(d)) { openSheet(d); return; }
    el.classList.add("opening");
    el.classList.remove("today");
    el.querySelector(".tag")?.remove();
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
    $("#sheetDay").textContent = `Türchen ${d} · ${wd}, ${d}. Dez`;
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
  buildDoors();
  updateStatus();
  let lastW = innerWidth;
  addEventListener("resize", () => { if (Math.abs(innerWidth - lastW) > 30) { lastW = innerWidth; buildDoors(); } });

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
