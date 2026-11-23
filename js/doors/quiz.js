/* Quiz mit Mehrfachauswahl (Level 5), auch für "Wahr oder falsch" nutzbar */
(function () {
  ADV.css("quiz-css", `
  .qz-q { font-family: var(--display); font-weight: 700; font-size: 24px; line-height: 1.15; color: var(--ink); margin: 6px 0 0; }
  .qz-card { animation: riseIn .5s cubic-bezier(.3,1.5,.5,1) both; }
  .qz-fb { margin-top: 12px; font-weight: 800; font-size: 16px; min-height: 1.2em; }
  .qz-next { margin-top: 14px; }
  .qz-dots { display: flex; gap: 6px; justify-content: center; margin: 4px 0 10px; }
  .qz-dots i { width: 12px; height: 12px; border-radius: 3px; border: 2px solid var(--ink); background: #fff; }
  .qz-dots i.ok { background: var(--lime); } .qz-dots i.no { background: #ffb3b6; } .qz-dots i.cur { background: var(--gold); }
  .qz-score { font-family: var(--pixel-font); font-size: 14px; text-align: center; color: var(--forest); margin-top: 6px; }
  `);

  window.DOOR_TYPES.quiz = function (el, day, data, api) {
    const qs = data.questions || [];
    let i = 0, score = 0;
    const res = [];
    el.innerHTML = `<p class="lead">${data.intro || ""}</p><div class="qz-dots"></div><div class="qz-stage"></div><div class="qz-after"></div>`;
    const dots = el.querySelector(".qz-dots"), stage = el.querySelector(".qz-stage");

    function drawDots() { dots.innerHTML = qs.map((_, k) => `<i class="${k < i ? (res[k] ? "ok" : "no") : k === i ? "cur" : ""}"></i>`).join(""); }

    function show() {
      drawDots();
      const q = qs[i];
      const order = q.shuffle === false ? q.a.map((_, k) => k) : ADV.shuffle(q.a.map((_, k) => k));
      stage.innerHTML = `<div class="qz-card">
        <div class="adv-hud"><span>FRAGE ${i + 1}/${qs.length}</span><span>★ ${score}</span></div>
        <p class="qz-q">${q.q}</p>
        <div class="adv-choices">${order.map(k => `<button class="adv-choice" data-k="${k}">${q.a[k]}</button>`).join("")}</div>
        <p class="qz-fb"></p></div>`;
      stage.querySelectorAll(".adv-choice").forEach(b => b.addEventListener("click", () => pick(+b.dataset.k, b)));
    }

    function pick(k, btn) {
      const q = qs[i];
      const correct = q.all ? true : k === q.correct;
      stage.querySelectorAll(".adv-choice").forEach(b => {
        b.disabled = true;
        if (q.all || +b.dataset.k === q.correct) b.classList.add("right");
      });
      if (!correct) btn.classList.add("wrong");
      res[i] = correct; if (correct) score++;
      const fb = stage.querySelector(".qz-fb");
      fb.innerHTML = (correct ? (q.all ? "Alles richtig! 💚 " : "Richtig! ✨ ") : "Knapp daneben! ") + (q.note || "");
      const r = btn.getBoundingClientRect();
      if (correct) FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 40, speed: 9, size: 9, life: 80 });
      if (navigator.vibrate) navigator.vibrate(correct ? 25 : [30, 30, 30]);
      const nb = document.createElement("button");
      nb.className = "btn qz-next";
      nb.textContent = i + 1 < qs.length ? "Weiter ▶" : "Ergebnis ▶";
      nb.addEventListener("click", () => { i++; i < qs.length ? show() : end(); });
      stage.querySelector(".qz-card").appendChild(nb);
      nb.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function end() {
      drawDots();
      stage.innerHTML = `<p class="qz-score">PUNKTE: ${score}/${qs.length}</p>`;
      const rank = (data.ranks || []).find(r => score >= r.min);
      const d = Object.assign({}, data, { outro: (rank ? rank.text + "<br>" : "") + (data.outro || "") });
      ADV.finish(el.querySelector(".qz-after"), day, d, api, { title: data.endTitle || "BESTANDEN!" });
    }

    show();
  };
})();
