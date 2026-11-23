/*
  ============================================================
  INHALTE DES ADVENTSKALENDERS
  Hier kannst du jederzeit alles ändern. Texte in "..." ersetzen.
  [PLATZHALTER] = muss noch von Leyla gefüllt werden.

  Vorschau mit anderem Datum: an die Adresse ?datum=2026-12-05 anhängen
  Fortschritt zurücksetzen:   &reset=1 anhängen
  ============================================================
*/
window.ADVENT = {
  year: 2026,
  recipient: "Jan",
  from: "Leyla",
  // Überschrift auf der Startseite: jede Zeile ein Eintrag (letzte Zeile wird hellgrün)
  pill: "JANS",
  title: ["Road to", "Christmas"],
  signature: "mit Liebe gecodet von Claude & Leyla",
  signoff: "Leyla ❤️",

  days: {
    1: {
      type: "spezi",
      title: "Prost, Adventszeit!",
      teaser: "Heute wird geschüttelt, nicht gerührt.",
      intro: "Tipp auf die Flasche und dann: Handy schütteln, bis sie aufgeht!",
      lines: [
        "Letztes Jahr gab's 24 davon.",
        "Dieses Jahr wird's digital."
      ],
      rewardIcon: "🧊",
      reward: "1× Spezi, eiskalt",
      rewardWhere: "Abholort: dein Kühlschrank. Los, nachschauen!"
    },

    2: {
      type: "charakter",
      title: "Dein Charakterbogen",
      teaser: "Heute wird dein Charakter enthüllt.",
      intro: "Jeder gute Held hat einen Charakterbogen. Hier ist deiner:",
      avatar: "😎",
      name: "JAN",
      classLine: "KLASSE: LOVE OF MY LIFE & BEST FRIEND · LVL 99",
      stats: [
        { name: "Liebevoll", value: 100, max: true },
        { name: "Unterstützend", value: 100, max: true },
        { name: "Herzensgut", label: "MAX", max: true },
        { name: "Geduldig, auch wenn Leyla motzig und launisch ist", value: 100, max: true },
        { name: "Kuschelig", label: "MAX", max: true },
        { name: "Sternekoch", label: "★★★", percent: 100 },
        { name: "Spezi-süchtig", label: "24/24", percent: 100 },
        { name: "Salzbrezel-verliebt", label: "100 %", percent: 100 }
      ],
      special: "Heilt Leylas schlechte Laune per Umarmung (Cooldown: 0 Sekunden)",
      note: "Ich würde keinen anderen Player wählen als dich."
    },

    3: {
      type: "coaster",
      title: "It's Rollercoaster Time!",
      teaser: "Heute geht's nach Rust!",
      intro: "Sammle 5 Glühwein und 3 Sterne als Einstimmung auf den Europa-Park. Tippen = springen.",
      need: { "🍷": 5, "⭐": 3 },
      missionTitle: "Deine Mission für heute",
      missionSub: "Antippen zum Abhaken, direkt im Park. Wenn alles erledigt ist, wartet eine Überraschung.",
      mission: [
        { icon: "🍷", text: "Den besten Glühwein im Park küren" },
        { icon: "📸", text: "Foto im Nordischen Winterdorf vor dem Weihnachtsbaum" },
        { icon: "⛸️", text: "Eine Eisshow anschauen" },
        { icon: "🎡", text: "Riesenrad fahren, wenn es dunkel ist" }
      ],
      missionReward: "Mission erfüllt, my love! Ich hoffe, wir setzen die Tradition mit unseren Europa-Park-Besuchen fort, bis wir alt und schrumpelig sind. Obwohl, das bist du ja schon. Haha 😜"
    },

    4: {
      type: "ttt",
      title: "Grinch-Duell",
      teaser: "Grinch-Leyla hat Weihnachten geklaut!",
      intro: "Grinch-Leyla hat Weihnachten geklaut! Schlag sie im Tic-Tac-Toe: Wer zuerst 2 Runden gewinnt.",
      face: "img/grinch-leyla.jpg",
      grinchName: "GRINCH-LEYLA",
      janMark: "🎄",
      grinchMark: "😤",
      mistakes: 0.35, // wie oft Grinch-Leyla unaufmerksam ist (0 = unschlagbar)
      taunts: {
        start: "Weihnachten gehört MIR! Na los, du fängst an.",
        round: ["Nächste Runde. Diesmal mach ich dich fertig!", "Okay, jetzt wird's ernst.", "Ich war nur kurz abgelenkt. Weiter!"],
        move: ["Hehe.", "Na, nervös?", "Pff.", "Das hast du nicht kommen sehen!", "Ich bin heute motzig UND schlau."],
        janWins: ["Das war pures Glück!", "Grrr. Zufall!", "Ich hab dich gewinnen lassen. Absichtlich!"],
        grinchWins: ["HA! Weihnachten bleibt bei mir!", "Zu leicht. 😤"],
        draw: ["Unentschieden. Langweilig!", "Patt. Wir sind halt beide gut."],
        final: "Na gut... du hast gewonnen. Hier hast du Weihnachten zurück. 💚"
      },
      outro: "Weihnachten ist gerettet!",
      note: "Okay, du hast gewonnen. Aber nur, weil ich dich liebe. 😤💚"
    },

    5: {
      type: "quiz",
      title: "Wie gut kennst du uns?",
      teaser: "Heute wird's ein Quiz. Bist du bereit?",
      intro: "7 Fragen über uns. Mal sehen, ob du aufgepasst hast.",
      questions: [
        { q: "Wo war unser erstes Date?", a: ["In einem Comedy-Keller in der Innenstadt", "Im Kino", "Auf dem Weihnachtsmarkt", "Beim Bowling"], correct: 0, note: "Lachen verbindet. 😄" },
        { q: "Wo haben wir angefangen, uns zu schreiben?", a: ["In Teams", "Auf WhatsApp", "Auf Instagram", "Per Brieftaube"], correct: 0, note: "Romantik über Firmen-Software. 💼" },
        { q: "Was waren wir, bevor wir zusammengekommen sind?", a: ["Kollegen und Freunde", "Fremde", "Nachbarn", "Erzfeinde"], correct: 0 },
        { q: "Was ist mein Lieblingsessen?", a: ["Pizza", "Nudeln", "Beides, natürlich", "Salat"], correct: 2, note: "Pizza UND Nudeln. Man muss sich nicht entscheiden. 🍕🍝" },
        { q: "Was war dein Adventskalender letztes Jahr?", a: ["24 Spezis mit Partyhütchen", "24 Schoko-Nikoläuse", "24 Paar Socken", "Ein ganz normaler Schokokalender"], correct: 0, note: "Schokolade? Bei dir? Niemals. 😉" },
        { q: "Was ist unser Insider?", a: ["Unser Handschlag", "Ein geheimes Codewort", "Ein Tanz", "Ein Lied"], correct: 0 },
        { q: "Was mag ich am meisten an dir?", a: ["Dass du so kind bist", "Dass du immer supportive bist", "Dass du so liebevoll bist", "Dass du mein bester Freund bist"], all: true, shuffle: false, note: "Hier gibt's keine falsche Antwort. Es ist alles davon." }
      ],
      ranks: [
        { min: 7, text: "Volle Punktzahl! Beziehungs-Profi. 🏆" },
        { min: 5, text: "Starke Leistung! 💪" },
        { min: 0, text: "Okay, wir müssen definitiv mehr Zeit miteinander verbringen. 😏" }
      ],
      endTitle: "BESTANDEN!",
      outro: "Quiz bestanden, Blödijan. 💚"
    },

    6: {
      type: "find",
      title: "Der Nikolaus war da!",
      teaser: "Ho ho ho! Heute Nacht war jemand in der Wohnung.",
      icon: "boot",
      intro: "Ho ho ho! Heute Nacht hat jemand etwas für dich versteckt. Keine Sorge: keine Schokolade. 🥨",
      hints: [
        "[PLATZHALTER Hinweis 1: z. B. Dort, wo dein Tag morgens anfängt...]",
        "[PLATZHALTER Hinweis 2]",
        "[PLATZHALTER Hinweis 3: fast schon die Lösung]"
      ],
      foundLabel: "🥨 Gefunden!",
      endTitle: "GEFUNDEN!",
      outro: "Frohen Nikolaus, mein Süßer!",
      note: "[PLATZHALTER: kleiner Nikolaus-Gruß]"
    },

    7: {
      type: "zoom",
      title: "Zoom-Rätsel",
      teaser: "Heute musst du ganz genau hinschauen.",
      intro: "Was ist auf den Fotos? Je weniger du rauszoomst, desto mehr Sterne gibt's.",
      rounds: [
        // [PLATZHALTER: eigene Fotos; x/y = Stelle in Prozent, auf die gezoomt wird]
        { img: "img/platzhalter-zoom-1.svg", x: 50, y: 58, q: "Was ist das?", a: ["Dein Controller", "Eine Fernbedienung", "Ein Toaster"], correct: 0, solution: "Dein Controller!" },
        { img: "img/platzhalter-zoom-2.svg", x: 50, y: 55, q: "Und das?", a: ["Eine Kaffeetasse", "Ein Blumentopf", "Ein Spezi-Glas"], correct: 0, solution: "Kaffee, natürlich." },
        { img: "img/platzhalter-zoom-3.svg", x: 50, y: 50, q: "Und zum Schluss?", a: ["Ein Weihnachtsbaum", "Brokkoli", "Ein Tannenzapfen"], correct: 0, solution: "Oh Tannenbaum!" }
      ],
      outro: "Adlerauge! 🦅",
      note: "[PLATZHALTER: optionaler Satz]"
    },

    8: { type: "bald", title: "Emoji-Kino", teaser: "Heute wird geraten: Welcher Film ist das?" },
    9: { type: "bald", title: "Memory", teaser: "Heute brauchst du ein gutes Gedächtnis." },
    10: { type: "bald", title: "Wort des Tages", teaser: "Fünf Buchstaben, sechs Versuche." },
    11: { type: "bald", title: "Loot-Drop!", teaser: "Heute droppt etwas Legendäres." },
    12: { type: "bald", title: "Path of Advent", teaser: "Die Weihnachtsmonster greifen an!" },
    13: { type: "bald", title: "Wahr oder falsch?", teaser: "Wie gut kennst du mich wirklich?" },
    14: { type: "bald", title: "Hör mal", teaser: "Heute gibt's was auf die Ohren." },
    15: { type: "bald", title: "Geschenke stapeln", teaser: "Ruhige Hand gefragt!" },
    16: { type: "bald", title: "Ein Foto von uns", teaser: "Heute gibt's ein Lieblingsfoto." },
    17: { type: "bald", title: "Heute kochen wir", teaser: "Heute Abend wird gekocht!" },
    18: { type: "bald", title: "Ausflug: Weihnachtsmarkt", teaser: "Heute haben wir beide frei!" },
    19: { type: "bald", title: "Schneeflocken fangen", teaser: "Es schneit! Fang so viele, wie du kannst." },
    20: { type: "bald", title: "Das schwere Puzzle", teaser: "Heute wird's knifflig." },
    21: { type: "bald", title: "Rentier-Rennen", teaser: "Die Rentiere sind los!" },
    22: { type: "bald", title: "Unsere Playlist 2026", teaser: "Heute gibt's was zu hören." },
    23: { type: "bald", title: "Das Codeschloss", teaser: "Nur noch ein Schloss bis zum Finale." },
    24: { type: "bald", title: "Jan & Leyla Wrapped 2026", teaser: "Das Finale ist da!" }
  }
};
