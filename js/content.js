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
      title: "Jans Küche",
      teaser: "Heute geht es um deine Kochkünste. 👨‍🍳",
      intro: "Alles, was du schon für mich gekocht hast. Jedes Gericht gibt es zweimal. Finde die Paare!",
      // Optional statt Emoji ein Foto: { img: "img/memory-1.jpg", text: "..." }
      pairs: [
        { img: "img/essen-schmorbraten.jpg", text: "Schmorbraten mit Knödelwürfeln und Feldsalat. 🤤" },
        { img: "img/essen-gulasch.jpg", text: "Gulasch mit Semmelknödeln." },
        { img: "img/essen-bourguignon.jpg", text: "Bœuf bourguignon auf Bandnudeln. Très chic!" },
        { img: "img/essen-carbonara.jpg", text: "Pasta! (Du weißt, wie man mich glücklich macht.) 🍝" },
        { img: "img/essen-tacos.jpg", text: "Taco-Abend! 🌮" },
        { img: "img/essen-fruehstueck.jpg", text: "Frühstück vom Sternekoch. ☕" },
        { img: "img/essen-kofta.jpg", text: "Köfte mit Joghurt, Walnüssen und Fladenbrot." },
        { img: "img/essen-weihnachten.jpg", text: "Weihnachtsessen mit Rotkohl und Knödeln. 🎄" }
      ],
      outro: "Mein Lieblingsrestaurant? Unser Esstisch. 💚"
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
      type: "tennis",
      title: "Tennis gegen Leyla",
      teaser: "Heute geht's auf den Platz. Gegen mich. 🎾",
      intro: "Matchball! Schlag mich im Tennis: Wer zuerst 5 Punkte hat, gewinnt.",
      photo: "img/leyla-tennis.jpg",
      how: "Zieh deinen grünen Schläger unten mit dem Finger hin und her und spiel den Ball zurück. Triffst du ihn am Rand, fliegt er schräg.",
      face: "img/leyla-grinsen.jpg",
      faces: { mad: "img/leyla-motzig.jpg", smug: "img/leyla-grinsen.jpg", wow: "img/leyla-staunen.jpg" },
      points: 5,
      aiSpeed: 0.9,  // wie schnell Leyla läuft (höher = schwerer)
      aiError: 1.5,  // wie ungenau Leyla zielt (höher = leichter)
      taunts: {
        start: "Na, traust du dich? Ich bin heute in Topform. 🎾",
        janPoint: ["Das war im Aus! 😤", "Netzroller zählt nicht!", "Ich war abgelenkt!", "Der Wind!!", "Ich hab die Sonne in den Augen! 😤", "Grrr."],
        leylaPoint: ["Ass! 😎", "Zu langsam, my love!", "Hehe.", "Das nennt man Technik."],
        leylaWins: "Haha! Revanche gefällig? 😎",
        final: "Okay... du hast gewonnen. Aber nur heute. 😤💚"
      },
      outro: "Spiel, Satz und Sieg!",
      note: "[PLATZHALTER: deine Nachricht, z. B. Du darfst mir ab jetzt beim Tennis Tipps geben. Vielleicht.]"
    },

    14: {
      type: "chef",
      title: "Sternekoch Jan",
      teaser: "Heute wird gekocht. Zumindest auf dem Handy. 👨‍🍳",
      intro: "Koch mir mein Lieblingsessen! Fang die Zutaten mit der Pfanne.",
      how: "Zieh die Pfanne mit dem Finger hin und her. Fang alle Zutaten, die oben stehen. Aber Finger weg von Schokolade und Socken! Du hast 3 Leben.",
      need: [
        { icon: "🍝", n: 3 },
        { icon: "🍅", n: 3 },
        { icon: "🧀", n: 2 },
        { icon: "🌿", n: 2 }
      ],
      bad: ["🍫", "🧦"],
      lives: 3,
      dish: "🍝",
      dishName: "PASTA À LA JAN",
      endTitle: "STERNEKOCH!",
      outro: "Drei Sterne für den Koch! ⭐⭐⭐",
      note: "[PLATZHALTER: deine Nachricht, z. B. Niemand kocht so gut wie du.]"
    },

    15: {
      type: "stack",
      title: "Geschenke-Turm",
      teaser: "Heute brauchst du eine ruhige Hand. 🎁",
      intro: "Der Weihnachtsmann braucht Hilfe beim Stapeln!",
      how: "Das Geschenk schwingt oben hin und her. Tipp, um es fallen zu lassen. Triff den Turm! 8 Geschenke hoch, 3 dürfen danebengehen.",
      goal: 8,
      lives: 3,
      endTitle: "TURM<br>GEBAUT!",
      outro: "Stabil wie wir zwei. 💚",
      note: "[PLATZHALTER: kurze Nachricht von dir]"
    },

    16: {
      type: "scratch",
      title: "Ein Lieblingsmoment",
      teaser: "Heute taut etwas auf. ❄️",
      intro: "Das Foto ist eingefroren. Rubbel das Eis weg!",
      image: "img/uns-see.jpg",
      caption: "[PLATZHALTER: Ort & Datum]",
      endTitle: "AUFGETAUT!",
      outro: "Einer meiner liebsten Momente mit dir.",
      note: "[PLATZHALTER: Was du an diesem Tag/Foto so magst]"
    },

    17: {
      type: "invite",
      title: "Heute kochen wir!",
      teaser: "Heute Abend ist die Küche geöffnet. 👨‍🍳",
      intro: "Eine Einladung ist eingetroffen. Tipp auf den Umschlag!",
      card: {
        kicker: "RESTAURANT CHEZ JAN & LEYLA",
        title: "Heute kochen wir zusammen",
        sub: "Reservierung für 2 Personen. Dresscode: Jogginghose.",
        rows: [
          { k: "WANN", v: "Heute, [PLATZHALTER: Uhrzeit]" },
          { k: "VORSPEISE", v: "[PLATZHALTER]" },
          { k: "HAUPTGANG", v: "[PLATZHALTER: z. B. selbstgemachte Pasta]" },
          { k: "DESSERT", v: "[PLATZHALTER: ohne Schokolade 😉]" },
          { k: "KÜCHENCHEF", v: "Jan (natürlich) ⭐⭐⭐" },
          { k: "SOUS-CHEF & VORKOSTERIN", v: "Leyla" }
        ]
      },
      listTitle: "Die Küchen-Mission",
      listSub: "Heute Abend abhaken:",
      list: [
        { icon: "🛒", text: "Zusammen einkaufen" },
        { icon: "🎶", text: "Weihnachtsplaylist an" },
        { icon: "🕯️", text: "Kerzen anzünden" },
        { icon: "👨‍🍳", text: "Zusammen kochen (ohne Streit 😄)" },
        { icon: "🥂", text: "Anstoßen" }
      ],
      note: "Danke für jeden Abend, an dem du für uns kochst. Heute koche ich mit. 💚"
    },

    18: {
      type: "invite",
      ticket: true,
      title: "Ausflug!",
      teaser: "Heute haben wir beide frei. 🎟️",
      intro: "Wir haben heute beide frei. Und das bedeutet... Tipp aufs Ticket!",
      card: {
        kicker: "🎟️ EINTRITTSKARTE · 2 PERSONEN",
        title: "Weihnachtsmarkt-Tag",
        sub: "Nur gültig mit Leyla.",
        rows: [
          { k: "WO", v: "[PLATZHALTER: welcher Weihnachtsmarkt]" },
          { k: "ABFAHRT", v: "[PLATZHALTER: Uhrzeit]" },
          { k: "MITBRINGEN", v: "Mütze, Handschuhe, Hunger" }
        ]
      },
      listTitle: "Weihnachtsmarkt-Bingo",
      listSub: "Antippen, wenn erledigt. Volles Feld = Überraschung!",
      listStyle: "bingo",
      list: [
        { icon: "🍷", text: "Glühwein" },
        { icon: "🥨", text: "Salzbrezel" },
        { icon: "🎡", text: "Riesenrad" },
        { icon: "📸", text: "Selfie am Baum" },
        { icon: "🌰", text: "Gebrannte Mandeln" },
        { icon: "🎄", text: "Kugel kaufen" },
        { icon: "🎅", text: "Nikolaus sichten" },
        { icon: "🍄", text: "Flammkuchen" },
        { icon: "💋", text: "Kuss unterm Mistelzweig" }
      ],
      note: "[PLATZHALTER: Nachricht für den Abend]"
    },

    19: {
      type: "snow",
      title: "Schneeflocken fangen",
      teaser: "Es schneit! ❄️",
      intro: "Es schneit! Fang genug Flocken für einen Schneemann.",
      how: "Tipp die Schneeflocken an. Goldene zählen dreifach, Kohle zieht 3 ab. 40 Flocken in 30 Sekunden!",
      goal: 40,
      time: 30,
      endTitle: "SCHNEEMANN<br>GEBAUT!",
      outro: "Der schönste Schneemann der Welt. Fast so schön wie du.",
      note: "[PLATZHALTER: kurze Nachricht]"
    },

    20: {
      type: "globe",
      title: "Unsere Schneekugel",
      teaser: "Heute wird geschüttelt. Noch einmal. 🔮",
      intro: "Heute ist mein letzter Tag in Karlsruhe vor Weihnachten. Schüttel die Schneekugel!",
      image: "img/uns-weihnachtsmarkt.jpg",
      base: "Jan & Leyla",
      shakes: 6,
      reunion: "", // [PLATZHALTER: Datum, an dem ihr euch wiederseht, z. B. "2026-12-27"] → zeigt einen Countdown
      reunionText: "Tage, bis wir uns wiedersehen",
      endTitle: "LET IT<br>SNOW!",
      outro: "Ab morgen bin ich weg, aber nur kurz.",
      note: "[PLATZHALTER: Abschiedsnachricht für die Tage, an denen du nicht da bist]"
    },

    21: {
      type: "flappy",
      title: "Flappy Rentier",
      teaser: "Rudolph braucht deine Hilfe! 🦌",
      intro: "Rudolph muss die Geschenke ausliefern. Hilf ihm über die Dächer!",
      how: "Tippen = flattern. Flieg durch die Lücken zwischen den Schornsteinen. 10 Häuser schaffen!",
      goal: 10,
      endTitle: "ALLES<br>AUSGELIEFERT!",
      outro: "Rudolph ist stolz auf dich.",
      note: "[PLATZHALTER: Nachricht von unterwegs, z. B. Ich vermisse dich jetzt schon.]"
    },

    22: {
      type: "quiz",
      title: "Wo war das?",
      teaser: "Heute geht's auf Zeitreise. 📸",
      intro: "Eine Reise durch unser Jahr. Wo war das?",
      questions: [
        { img: "img/nashville-laylas.jpg", q: "Wo war das?", a: ["New Orleans", "Las Vegas", "Nashville"], correct: 2, shuffle: false, note: "Welcome to Nashville! Mit einer Bar, die (fast) so heißt wie ich. 🤠" },
        { img: "img/nashville-chicken.jpg", q: "Und was haben wir hier gegessen?", a: ["BBQ Ribs", "Nashville Hot Chicken", "Burger"], correct: 1, shuffle: false, note: "Scharf. Sehr scharf. 🔥" },
        { img: "img/europapark-atlantis.jpg", q: "In welcher Attraktion entstand dieses Foto?", a: ["Silver Star", "Abenteuer Atlantis", "Piraten in Batavia"], correct: 1, shuffle: false, note: "Dein Gesicht. 😂" },
        { img: "img/sintra-pena.jpg", q: "Welches Schloss ist das?", a: ["Neuschwanstein", "Palácio da Pena in Sintra", "Alhambra"], correct: 1, shuffle: false, note: "Das bunteste Schloss der Welt. 🏰" },
        { img: "img/lissabon-aussicht.jpg", q: "Und in welcher Stadt ist dieser Ausblick?", a: ["Porto", "Barcelona", "Lissabon"], correct: 2, shuffle: false, note: "Lissabon von oben. 🇵🇹" },
        { img: "img/uns-pullis.jpg", q: "Wer hatte den hässlicheren Pulli?", a: ["Jan", "Leyla", "Beide gleich schlimm"], all: true, shuffle: false, note: "Ganz klar: unentschieden. 🎄" }
      ],
      ranks: [
        { min: 6, text: "Perfektes Gedächtnis! 🏆" },
        { min: 3, text: "Gut gemacht! 📸" },
        { min: 0, text: "Wir müssen öfter Fotos anschauen. 😄" }
      ],
      endTitle: "ZEITREISE<br>BEENDET!",
      outro: "Was für ein Jahr mit dir."
    },

    23: {
      type: "lock",
      title: "Das Codeschloss",
      teaser: "Nur noch ein Schloss bis zum Finale. 🔐",
      intro: "Morgen ist das Finale. Aber es ist abgeschlossen! Den Code kennst du aus den letzten Wochen.",
      lockTitle: "FINALE GESPERRT",
      hintTitle: "Die Hinweise:",
      wheels: [
        { hint: "Was hast du an Level 1 geschüttelt?", symbols: ["🎁", "☕", "🥤", "🍷"], answer: 2 },
        { hint: "Wer hat an Level 4 Weihnachten geklaut?", symbols: ["🎅", "😤", "🦌", "⛄"], answer: 1 },
        { hint: "Was haben wir an Level 13 gespielt?", symbols: ["⚽", "🏀", "⛸️", "🎾"], answer: 3 },
        { hint: "Was hast du an Level 14 gekocht?", symbols: ["🍕", "🍝", "🥗", "🍔"], answer: 1 }
      ],
      endTitle: "SCHLOSS<br>GEKNACKT!",
      outro: "Das Finale ist freigeschaltet. Morgen ist es so weit. 🎄"
    },

    24: {
      type: "wrapped",
      title: "Jan & Leyla Wrapped 2026",
      teaser: "Das Finale ist da! 🎄",
      intro: "Frohe Weihnachten, my love! Hier ist unser Jahr.",
      kicker: "JAN & LEYLA",
      cover: "Wrapped 2026",
      slides: [
        { type: "text", kicker: "WRAPPED 2026", title: "Was für ein Jahr.", text: "Lass uns zurückschauen. 💚", burst: true },
        { type: "photo", img: "img/kind-jan-pirat.jpg", kicker: "PLAYER 1", title: "Jan, Pirat seit Tag 1 🏴‍☠️" },
        { type: "photo", img: "img/kind-leyla-belle.jpg", kicker: "PLAYER 2", title: "Leyla, Prinzessin seit Tag 1 👑" },
        { type: "text", title: "Und dann haben sich die beiden getroffen...", text: "Im Büro. Über Teams. 💻" },
        { type: "photo", fit: "contain", img: "img/girlfriend.jpg", kicker: "DER MOMENT", title: "Jan + Leyla = 💑", text: "Du hast mich mit einer selbstgebauten Webseite gefragt. Jetzt kriegst du eine zurück. ❤️", burst: true },
        { type: "photo", img: "img/spezi-kalender-2025.jpg", kicker: "LETZTES JAHR", title: "24 Spezis mit Santa-Hütchen 🎅", text: "Wer hätte gedacht, dass der dieses Jahr noch getoppt wird?" },
        { type: "photo", img: "img/europapark-2025.jpg", title: "Europa-Park, Winter 2025" },
        { type: "stat", kicker: "TOP-STAT", big: "[X]", title: "Europa-Park-Besuche", text: "[PLATZHALTER]" },
        { type: "photo", img: "img/europapark-kuss.jpg", title: "Europa-Park im Winter", text: "Unsere Tradition." },
        { type: "photo", img: "img/nashville-strasse.jpg", kicker: "REISE DES JAHRES", title: "Nashville 🤠", text: "Hot Chicken, Honky Tonks und wir." },
        { type: "stat", kicker: "NEU GELERNT", big: "🔥", title: "Hot Chicken ist wirklich hot." },
        { type: "photo", img: "img/essen-weihnachten.jpg", kicker: "KOCH DES JAHRES", title: "Jan ⭐⭐⭐", text: "Danke für jedes einzelne Essen." },
        { type: "photo", img: "img/lissabon-selfie.jpg", kicker: "REISE DES JAHRES #2", title: "Lissabon 🇵🇹", text: "Rote Dächer, Miradouros und wir." },
        { type: "photo", img: "img/sintra-pena.jpg", title: "Sintra", text: "Unser Märchenschloss." },
        { type: "photo", img: "img/fotobox-kuss.jpg", title: "Fotobox im Time Out Market", text: "Beweisfoto. 💋" },
        { type: "photo", img: "img/tennis-kuss.jpg", kicker: "SPORTART DES JAHRES", title: "Tennis 🎾", text: "Wer gewonnen hat? Egal. 😤💚" },
        { type: "photo", img: "img/padel-kuss.jpg", title: "Und Padel.", text: "Auch egal." },
        { type: "photo", img: "img/uns-weinberg.jpg", title: "Spaziergänge in den Weinbergen" },
        { type: "photo", img: "img/uns-kuscheln.jpg", kicker: "LIEBLINGSORT", title: "Sofa. Mit dir." },
        { type: "photo", img: "img/uns-wiese.jpg", kicker: "SOMMER 2026", title: "Goldene Stunde", text: "[PLATZHALTER]" },
        { type: "photo", img: "img/uns-tanz.jpg", title: "Und dann wurde getanzt.", text: "[PLATZHALTER]" },
        { type: "photo", img: "img/uns-wiese-kuss.jpg", title: "Du & ich", text: "[PLATZHALTER]" },
        { type: "stat", kicker: "MEISTGETRUNKEN", big: "🥤", title: "Spezi", text: "[PLATZHALTER: geschätzte Anzahl] Flaschen. Mindestens." },
        { type: "list", kicker: "TOP 5", title: "Unsere Momente", items: ["[PLATZHALTER]", "[PLATZHALTER]", "[PLATZHALTER]", "[PLATZHALTER]", "[PLATZHALTER]"] },
        { type: "photo", img: "img/uns-weihnachtsmarkt.jpg", title: "Und jetzt: Weihnachten.", text: "Mit dir. 🎄" },
        { type: "stat", kicker: "DEIN TOP-MENSCH 2026", big: "💚", title: "Leyla", text: "Und nächstes Jahr wieder.", burst: true },
        { type: "letter", kicker: "EIN BRIEF FÜR DICH", paragraphs: ["Lieber Jan,", "[PLATZHALTER: dein Brief]", "[PLATZHALTER]"], sign: "Deine Leyla ❤️" }
      ],
      endTitle: "FROHE<br>WEIHNACHTEN!",
      outro: "24 Level geschafft. Du bist der Beste.",
      note: "[PLATZHALTER: optional der Reveal deines Weihnachtsgeschenks]"
    }
  }
};
