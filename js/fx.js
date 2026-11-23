/* Schnee im Hintergrund + Konfetti/Partikel-Explosionen */
(function () {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function fit(c) {
    c.width = innerWidth * DPR;
    c.height = innerHeight * DPR;
  }

  // ---------- Schnee ----------
  const snow = document.getElementById("snow");
  const sctx = snow.getContext("2d");
  let flakes = [];
  function makeFlakes() {
    fit(snow);
    const n = Math.round(Math.min(90, innerWidth / 5));
    flakes = Array.from({ length: n }, () => ({
      x: Math.random() * snow.width,
      y: Math.random() * snow.height,
      r: (Math.random() * 2.4 + 1) * DPR,
      vy: (Math.random() * 0.6 + 0.35) * DPR,
      sway: Math.random() * Math.PI * 2,
      vs: Math.random() * 0.02 + 0.008,
      a: Math.random() * 0.5 + 0.45
    }));
  }
  function drawSnow() {
    sctx.clearRect(0, 0, snow.width, snow.height);
    for (const f of flakes) {
      f.y += f.vy;
      f.sway += f.vs;
      f.x += Math.sin(f.sway) * 0.5 * DPR;
      if (f.y > snow.height + 5) { f.y = -5; f.x = Math.random() * snow.width; }
      sctx.globalAlpha = f.a;
      sctx.fillStyle = "#fff";
      sctx.beginPath();
      sctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      sctx.fill();
    }
    requestAnimationFrame(drawSnow);
  }
  makeFlakes();
  addEventListener("resize", makeFlakes);
  requestAnimationFrame(drawSnow);

  // ---------- Konfetti ----------
  const fx = document.getElementById("fx");
  const ctx = fx.getContext("2d");
  fit(fx);
  addEventListener("resize", () => fit(fx));
  let parts = [];
  let running = false;

  const PALETTE = ["#2f9e5b", "#a6e8bf", "#c9f07a", "#ffc83d", "#e8414a", "#fff5df", "#13573a"];

  function star(c, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    c.closePath();
  }

  function loop() {
    ctx.clearRect(0, 0, fx.width, fx.height);
    parts = parts.filter(p => p.life > 0 && p.y < fx.height + 40);
    for (const p of parts) {
      p.vy += p.g;
      p.vx *= p.drag; p.vy *= p.drag;
      p.x += p.vx; p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / 30);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = "#0a2418";
      ctx.lineWidth = 1.5 * DPR;
      if (p.shape === "rect") {
        const w = p.size, h = p.size * 0.55 * Math.abs(Math.cos(p.rot * 2) + 0.2);
        ctx.fillRect(-w / 2, -h / 2, w, h);
      } else if (p.shape === "star") {
        star(ctx, p.size * 0.7); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
        if (p.outline) ctx.stroke();
      }
      ctx.restore();
    }
    if (parts.length) requestAnimationFrame(loop);
    else { running = false; ctx.clearRect(0, 0, fx.width, fx.height); }
  }

  /**
   * Partikel-Explosion an Bildschirm-Koordinaten (CSS-Pixel).
   * opts: count, colors, shapes, speed, spread (Grad), angle (Grad, -90 = nach oben), gravity, size, life
   */
  function burst(x, y, opts = {}) {
    const o = Object.assign({
      count: 90, colors: PALETTE, shapes: ["rect", "rect", "circle", "star"], speed: 13,
      spread: 360, angle: -90, gravity: 0.32, size: 11, life: 170, drag: 0.985, outline: false
    }, opts);
    for (let i = 0; i < o.count; i++) {
      const a = (o.angle + (Math.random() - 0.5) * o.spread) * Math.PI / 180;
      const s = o.speed * (0.35 + Math.random() * 0.75) * DPR;
      parts.push({
        x: x * DPR, y: y * DPR,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        g: o.gravity * DPR * (0.7 + Math.random() * 0.6),
        drag: o.drag,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
        size: o.size * (0.6 + Math.random() * 0.8) * DPR,
        color: o.colors[(Math.random() * o.colors.length) | 0],
        shape: o.shapes[(Math.random() * o.shapes.length) | 0],
        life: o.life * (0.7 + Math.random() * 0.5),
        outline: o.outline
      });
    }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  /** Konfettiregen von oben über die ganze Breite */
  function rain(count = 120) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => burst(Math.random() * innerWidth, -20, {
        count: 1, speed: 3, angle: 90, spread: 60, gravity: 0.12, life: 400
      }), i * 12);
    }
  }

  window.FX = { burst, rain };
})();
