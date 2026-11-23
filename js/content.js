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
        { name: "Sternekoch", label: "⭐⭐⭐", percent: 100 },
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
        { q: "Wo war unser erstes Treffen?", a: ["In einem Comedy-Keller in der Innenstadt", "Im Kino", "Auf dem Weihnachtsmarkt", "Beim Bowling"], correct: 0, note: "Lachen verbindet. 😄" },
        { q: "Wo haben wir angefangen, uns zu schreiben?", a: ["In Teams", "Auf WhatsApp", "Auf Instagram", "Per Brieftaube"], correct: 0, note: "Romantik über Firmen-Software. 💼" },
        { q: "Was waren wir, bevor wir zusammengekommen sind?", a: ["Kollegen und Freunde", "Fremde", "Nachbarn", "Erzfeinde"], correct: 0 },
        { q: "Was ist mein Lieblingsessen?", a: ["Nudeln", "Pizza", "Salat", "Alles, was Jan kocht"], correct: 3, note: "Alles, was du kochst, Sternekoch! 👨‍🍳" },
        { q: "Was war dein Adventskalender letztes Jahr?", a: ["24 Spezis mit Santa-Hütchen", "24 Schoko-Nikoläuse", "24 Paar Socken", "Ein ganz normaler Schokokalender"], correct: 0, note: "Schokolade? Bei dir? Niemals. 😉" },
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
      intro: "4 Fotos aus unserer Wohnung. Was ist das und wo ist das? Je weniger du rauszoomst, desto mehr Punkte bekommst du.",
      rounds: [
        // Antworten erscheinen in genau dieser Reihenfolge; correct = Position der richtigen (0 = oben)
        // x/y = Stelle in Prozent, auf die am Anfang gezoomt wird
        { img: "img/zoom-messer.jpg", x: 48, y: 30, q: "Was ist das und wo ist das?", a: ["Die Säge im Keller", "Der Kamm im Bad", "Die Messerleiste in der Küche"], correct: 2, solution: "Die Messerleiste in der Küche!" },
        { img: "img/zoom-pflanze.jpg", x: 48, y: 42, q: "Was ist das und wo ist das?", a: ["Die Pflanze in deinem Arbeitszimmer", "Die Pflanze im Schlafzimmer", "Der Brokkoli im Kühlschrank"], correct: 1, solution: "Die Pflanze im Schlafzimmer!" },
        { img: "img/zoom-kranz.jpg", x: 51, y: 47, q: "Was ist das und wo ist das?", a: ["Ein Tannenzapfen im Wald", "Die Pflanze im Wohnzimmer", "Der Adventskranz im Esszimmer"], correct: 2, solution: "Unser Adventskranz im Esszimmer! 🕯️" },
        { img: "img/zoom-stuhl.jpg", x: 60, y: 57, q: "Was ist das und wo ist das?", a: ["Das Sofa im Wohnzimmer", "Ein Stuhl im Esszimmer", "Der Bürostuhl in Leylas Arbeitszimmer"], correct: 1, solution: "Ein Stuhl im Esszimmer!" }
      ],
      outro: "Adlerauge! 🦅"
    },

    8: {
      type: "quiz",
      title: "Emoji-Kino",
      teaser: "Heute wird geraten: Welcher Film ist das?",
      intro: "Popcorn bereit? 🍿 Welcher Film oder welche Serie steckt hinter den Emojis?",
      questions: [
        { q: "🧙‍♂️💍🌋👣", big: true, a: ["Der Hobbit", "Der Herr der Ringe", "Harry Potter", "Game of Thrones"], correct: 1 },
        { q: "⚽🇺🇸🥨📋💛", big: true, sub: "Kleiner Tipp: Die haben wir zusammen geschaut.", a: ["Ted Lasso", "Bend It Like Beckham", "Schitt's Creek", "The Office"], correct: 0, note: "BELIEVE! 💛" },
        { q: "🔨⚡👱‍♂️🌈", big: true, a: ["Iron Man", "Thor", "Captain America", "Doctor Strange"], correct: 1 },
        { q: "🦝🌳🚀🎶📼", big: true, a: ["Avatar", "Star Wars", "Guardians of the Galaxy", "Ant-Man"], correct: 2, note: "I am Groot. 🌳" },
        { q: "🧤💎💎💎💎💎💎🫰", big: true, a: ["Avengers: Infinity War", "Black Panther", "Spider-Man: No Way Home", "Thor: Ragnarok"], correct: 0, note: "*snap* 🫰" },
        { q: "👦🏠✈️🪤🎄", big: true, a: ["Der Grinch", "Tatsächlich... Liebe", "Kevin – Allein zu Haus", "Der Polarexpress"], correct: 2 }
      ],
      ranks: [
        { min: 6, text: "Volle Punktzahl! Cineast! 🎬" },
        { min: 4, text: "Solide! 🍿" },
        { min: 0, text: "Okay, wir haben einen Filmabend nötig. 😄" }
      ],
      endTitle: "ABSPANN!",
      outro: "Nächster Filmabend: du suchst aus, ich mach Popcorn. 🍿"
    },

    9: {
      type: "memory",
      title: "Unser Memory",
      teaser: "Heute brauchst du ein gutes Gedächtnis.",
      intro: "8 Paare aus unserem Jahr. Finde sie alle!",
      // Optional statt Emoji ein Foto: { img: "img/memory-1.jpg", text: "..." }
      pairs: [
        { icon: "🥤", text: "Spezi: dein Lebenselixier." },
        { icon: "💻", text: "Teams: wo alles anfing." },
        { icon: "🎤", text: "Der Comedy-Keller: unser erstes Treffen." },
        { icon: "🎢", text: "Europa-Park: Tradition!" },
        { icon: "🍝", text: "Nudeln. Und Pizza. Beides." },
        { icon: "🥨", text: "Salzbrezeln statt Schokolade." },
        { icon: "🖥️", text: "Zocken am PC." },
        { icon: "🎾", text: "Tennis (und motzige Leyla 😤)." }
      ],
      outro: "Gutes Gedächtnis! Mit dir merk ich mir einfach alles gern. 💚"
    },

    10: {
      type: "wordle",
      title: "Wordle",
      teaser: "Fünf Buchstaben, sechs Versuche.",
      intro: "Das Wordle des Tages, diesmal mit einem <b>englischen</b> Wort: 5 Buchstaben, 6 Versuche. Grün = richtiger Platz, gelb = Buchstabe kommt vor, aber woanders. Kleiner Tipp: Es hat mit morgen zu tun. 👀",
      solution: "EXILE",
      winMsg: "EXILE! Na, klingelt's? 👀",
      outro: "Morgen erscheint etwas, worauf du lange gewartet hast..."
    },

    11: {
      type: "loot",
      title: "Loot-Drop!",
      teaser: "Heute droppt etwas Legendäres.",
      intro: "Heute erscheint Path of Exile 2 in Version 1.0. Und genau jetzt droppt etwas für dich...",
      item: {
        icon: "🧺",
        name: "Korb des ewigen Grinds",
        base: "Legendärer Geschenkkorb",
        props: ["Gegenstandsstufe: <b>100</b>", "Benötigt: <b>Jan, Level 99</b>"],
        mods: [
          "+100% Zocken ohne schlechtes Gewissen",
          "Immun gegen Haushalt für 48 Stunden",
          "+5 auf alle Spezi-Resistenzen",
          "Kann von Leyla nicht unterbrochen werden",
          "[PLATZHALTER: Inhalt des Korbs als Mod, z. B. +1 Snack-Vorrat]"
        ],
        flavor: "Wer den Korb öffnet, kehrt erst nach dem Endgame zurück."
      },
      where: "[PLATZHALTER: Wo steht der echte Korb? z. B. Fundort: hinter dem Sofa im Wohnzimmer]",
      note: "Heute Abend gehört der PC dir. Ich bring dir Snacks. 💚"
    },

    12: {
      type: "poe",
      title: "Path of Advent",
      teaser: "Die Weihnachtsmonster greifen an!",
      intro: "Die Weihnachtsmonster wollen an die Geschenke! Bist du bereit, Jan?",
      how: "Tipp die Monster an, bevor sie unten bei den Geschenken ankommen. Manche brauchen mehrere Treffer. Du hast 5 Leben. Halte 30 Sekunden durch, dann kommt der Boss.",
      time: 30,
      lives: 5,
      mobs: [
        { icon: "🍪", hp: 1 },
        { icon: "🧝", hp: 2 },
        { icon: "⛄", hp: 3 },
        { icon: "🦌", hp: 2 }
      ],
      loot: [
        { name: "Chaos-Plätzchen", color: "#d9c27a" },
        { name: "Glühwein-Orb", color: "#e8414a" },
        { name: "Spekulatius der Erhabenheit", color: "#ffd27a" },
        { name: "Zimtstern des Göttlichen", color: "#c9f07a" },
        { name: "Lebkuchen-Splitter", color: "#c8c8c8" }
      ],
      boss: { icon: "👹", name: "Krampus, Schrecken der Adventszeit", hp: 30, intro: "DER BODEN BEBT...<br>KRAMPUS ERSCHEINT!", how: "Tipp ihn so oft an, wie du kannst!" },
      bossLoot: [{ name: "Spezi des Spiegels", color: "#7fd7ff", count: 1 }],
      outro: "Weihnachten ist sicher!",
      note: "[PLATZHALTER: deine Nachricht als Belohnung]"
    },

    13: {
      type: "quiz",
      title: "Wahr oder falsch?",
      teaser: "Wie gut kennst du mich wirklich?",
      intro: "Ein paar Aussagen über mich. Wahr oder falsch?",
      questions: [
        { q: "Ich brauche ewig, um mich fertig zu machen.", a: ["Wahr", "Falsch"], correct: 1, shuffle: false, note: "Ich bin schnell! Du musst nie lange warten. 😌" },
        { q: "Ich werde beim Tennis manchmal motzig.", a: ["Wahr", "Falsch"], correct: 0, shuffle: false, note: "Ertappt. 😤🎾" },
        { q: "Mein Lieblingsessen ist Salat.", a: ["Wahr", "Falsch"], correct: 1, shuffle: false, note: "Pizza und Nudeln, bitte. 🍕🍝" },
        { q: "[PLATZHALTER: Aussage über dich]", a: ["Wahr", "Falsch"], correct: 0, shuffle: false, note: "[PLATZHALTER: Auflösung]" },
        { q: "[PLATZHALTER: Aussage über dich]", a: ["Wahr", "Falsch"], correct: 1, shuffle: false, note: "[PLATZHALTER: Auflösung]" },
        { q: "[PLATZHALTER: Aussage über dich]", a: ["Wahr", "Falsch"], correct: 0, shuffle: false, note: "[PLATZHALTER: Auflösung]" },
        { q: "Ich liebe dich.", a: ["Wahr", "Falsch"], all: true, shuffle: false, note: "Die einzige Aussage, bei der es nur eine Antwort gibt. 💚" }
      ],
      ranks: [
        { min: 7, text: "Du kennst mich in- und auswendig! 🏆" },
        { min: 4, text: "Nicht schlecht! 💪" },
        { min: 0, text: "Hmm, da müssen wir nochmal ran. 😏" }
      ],
      endTitle: "DURCHSCHAUT!",
      outro: "Du kennst mich einfach. 💚"
    },

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
