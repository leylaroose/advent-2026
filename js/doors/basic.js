/* Registry für Türchen-Typen + Platzhalter-Typ "bald" */
window.DOOR_TYPES = window.DOOR_TYPES || {};

window.DOOR_TYPES.bald = function (el, day, data) {
  el.innerHTML = `
    <div class="card" style="text-align:center;margin-top:18px">
      <div style="font-size:64px;animation:hop 2s ease-in-out infinite;display:inline-block">🎁</div>
      <p class="lead">Hier kommt Türchen ${day}.</p>
      <p>Inhalt folgt (Entwurf).</p>
    </div>`;
};
