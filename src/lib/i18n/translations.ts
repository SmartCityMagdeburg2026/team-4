import type { Locale } from "./types";

interface Dict {
  [key: string]: string | Dict;
}

const en: Dict = {
  meta: {
    title: "MAGmagdeburg — Healthcare & Population Intelligence",
    description:
      "How Magdeburg is growing, caring, and adapting — an open-data story about population and healthcare in the city.",
  },
  header: {
    tagline: "Stadt Magdeburg · Open Data",
  },
  nav: {
    overview: "Overview",
    population: "Population",
    emergency: "Emergency",
    healthcare: "Healthcare",
    insights: "Insights",
    risk: "Priority",
    dependency: "Dependency",
  },
  hero: {
    eyebrow: "Healthcare & Population Intelligence",
    title: "Magdeburg is growing — and caring for every district",
    lead: "An open-data look at how the city is evolving: more residents, a strong rescue network, and healthcare access that can be improved where it matters most.",
  },
  sections: {
    overview: {
      eyebrow: "At a Glance",
      title: "Magdeburg in 2024",
      lead: "Six indicators that show a city adding residents, expanding care capacity, and investing in health across districts.",
    },
    population: {
      eyebrow: "Population Trends",
      title: "A city that keeps growing",
      lead: "Magdeburg gained over 12,000 residents since 2010. Migration brings new energy, while longer lives reflect a city people stay in.",
    },
    emergency: {
      eyebrow: "Emergency Services",
      title: "A rescue network that shows up",
      lead: "Thousands of deployments every year — patient transport, emergency medical, and rescue teams keeping the city covered.",
    },
    healthcare: {
      eyebrow: "Healthcare Availability",
      title: "Care across the city",
      lead: "Explore physician access and community health by district. See where care is strong — and where the next improvements can help most.",
    },
    insights: {
      eyebrow: "Population & Healthcare",
      title: "What the data celebrates — and where to focus next",
      lead: "Clear findings from combining demographic, emergency, and healthcare data — honest, actionable, and forward-looking.",
    },
    risk: {
      eyebrow: "The Closing Picture",
      title: "Access isn't one city",
      lead: "The spread between districts is the real story — not another ranked table.",
    },
    dependency: {
      eyebrow: "The Hidden Dependency",
      title: "Migration keeps the city growing",
      lead: "Natural population change is negative every year — migration is the only reason Magdeburg's headline population still rises.",
    },
  },
  dependency: {
    headline: "Population would have declined without migration.",
    netGrowthLabel: "Net population change",
    births: "Births",
    deaths: "Deaths",
    naturalChange: "Natural change",
    netMigration: "Net migration",
    flowLoss: "Population loss",
    flowNatural: "Natural deficit",
    flowGain: "Population gain",
    finalGrowth: "Final population growth",
    conclusion:
      "Without migration, Magdeburg would have continued shrinking despite overall population growth.",
  },
  pressure: {
    title: "Healthcare pressure timeline",
    subtitle: "2010 → 2024 — births shrinking, deaths stable, migration growing, emergency demand rising",
    population: "Population",
    births: "Births",
    deaths: "Deaths",
    migration: "Net migration",
    emergency: "Emergency calls",
    pause: "Pause",
    play: "Play",
    scrub: "Scrub through years",
    hint: "Streams move together as years advance — each line scaled to its own 2010–2024 range.",
  },
  bridges: {
    migration:
      "New residents keep Magdeburg growing — migration added thousands of people in 2024 alone.",
    aging:
      "More people living longer means more care — and Magdeburg's rescue services are there when it counts.",
    access:
      "Healthcare isn't the same everywhere — and that's an opportunity to strengthen the districts that need it most.",
    pattern:
      "Put the pieces together and you see where the city is thriving — and where the next win for public health is clearest.",
    intervention:
      "Smart investment works best when it's local — these priority districts show where to start.",
  },
  footer: {
    subtitle: "Healthcare & Population Intelligence Dashboard",
    dataSource: "Data source",
    lastUpdated: "Last updated",
  },
  kpi: {
    population: { label: "Total Population", changeLabel: "vs. 2023" },
    births: { label: "Births", changeLabel: "vs. 2023" },
    deaths: { label: "Deaths", changeLabel: "vs. 2023" },
    emergency: { label: "Emergency Incidents", changeLabel: "vs. 2023" },
    doctors: { label: "Physicians", changeLabel: "vs. 2022" },
    pharmacies: { label: "Pharmacies", changeLabel: "vs. 2022" },
    jumpTo: "Jump to section →",
  },
  yearRange: {
    all: "All years",
    recent: "2020–2024",
    decade: "2010–2019",
  },
  charts: {
    common: {
      hint: "Hover or click a data point to inspect values",
      selected: "selected",
    },
    population: {
      growth: { title: "Population Growth", subtitle: "Total residents — hover, click to pin a year", label: "Population" },
      age: { title: "Average Age", subtitle: "City-wide mean age in years", label: "Average age" },
      birthsDeaths: {
        title: "Births vs Deaths",
        subtitle: "Toggle series · click bars to inspect",
        births: "Births",
        deaths: "Deaths",
        naturalChange: "Natural change",
      },
      migration: {
        title: "Migration",
        subtitle: "Toggle net migration view",
        in: "Migration in",
        out: "Migration out",
        net: "Net migration",
      },
    },
    emergency: {
      timeline: {
        title: "Emergency Incidents Over Time",
        subtitle: "Drag the brush to zoom · click to pin a year",
        total: "Total incidents",
        notarzt: "Notarzt",
        rescue: "Rescue ops",
      },
      treemap: {
        tabShare: "Proportional mix",
        tabCount: "Raw counts",
        scrub: "Slide to reshape the mix",
      },
      insight: {
        empty: "Hover or click the chart to explore a year’s deployment mix.",
        eyebrow: "Year snapshot",
        deployments: "deployments",
        vsPrior: "vs prior year",
        mix: "Deployment mix",
        transportNote:
          "Patient transport was {pct}% of deployments — {shift} pts {dir} since 2010.",
        risen: "higher",
        fallen: "lower",
      },
      breakdown: {
        title: "Vehicle Type Breakdown",
        subtitle: "2024 share — click a segment",
        share: "Share of total",
      },
      vehicles: {
        title: "Deployment Trends by Vehicle",
        subtitle: "Toggle vehicle types",
        hint: "Hover the stack — the year snapshot above updates when you pin a year on the timeline chart.",
        notarzt: "Notarzt",
        transport: "Transport",
        rescue: "Rescue",
        air: "Air",
      },
      pictogram: {
        deployments: "deployments",
        perCategory: "per category",
        deploymentsIn: "emergency deployments in",
        slideYears: "Slide through years",
      },
      categories: {
        medical: "Emergency Medical",
        transport: "Patient Transport",
        rescue: "Rescue Operations",
        air: "Air Rescue",
      },
    },
    insights: {
      keyFindings: "Key Findings",
      finding: "Finding",
      pressureEyebrow: "Pressure index",
      title: "Trends since 2010",
      subtitle: "Three parallel pressure streams — each indexed to 2010. Slide the year to see which force pulled ahead.",
      baseline: "2010 baseline",
      vsBaseline: "vs 2010",
      slideYears: "Slide through years",
      emergency: "Emergency",
      avgAge: "Avg age",
      physicians: "Physicians / 1k",
      emergencyIndex: "Emergency index",
      ageIndex: "Average age index",
      physiciansIndex: "Physicians index",
      divergencePhysicians:
        "Physician supply leads at {physicians} index ({physiciansDelta} vs 2010) — emergency still at {emergency} ({emergencyDelta})",
      divergenceEmergency:
        "Emergency demand leads at {emergency} index ({emergencyDelta} vs 2010) — physicians at {physicians} ({physiciansDelta})",
      divergenceAge:
        "Aging pressure steady at {age} index ({ageDelta}) — physicians at {physicians}, emergency at {emergency}",
    },
  },
  map: {
    loading: "Loading map…",
    districtAccess: "Care priority",
    hospitals: "Hospitals",
    lens: {
      eyebrow: "Triple lens",
      title: "Access isn't one thing",
      lead: "Toggle three lenses — physicians, patient transport demand, and nearby transit. Districts glow when every active lens is weak.",
      tripleLens: "Triple lens",
      compoundLegend: "Triple gap · {count} districts",
      weak: "Weak on active lenses",
      mixed: "Mixed",
      strong: "Strong access",
      tripleGap: "Triple gap",
      meta: "Transport proxy from {transport} city-wide patient transports · {stops} Magdeburg stops · {radius} km radius",
      rankingTitle: "Compound access index",
      rankingHint: "Each prism refracts three lenses of access. Where every facet is weak, districts converge into a triple gap.",
      indexEyebrow: "Access index",
      indexCount: "districts indexed",
      convergence: "Convergence zone",
      colDistrict: "District",
      colPrism: "Prism",
      colPhysicians: "Physicians",
      colGap: "Gap score",
      gapShort: "gap",
      filterOn: "Lens on",
      filterOff: "Lens off",
      panelTitle: "Lens breakdown",
      toggles: {
        physicians: "Physicians",
        transport: "Transport demand",
        transit: "Transit stops",
      },
      levels: { weak: "Weak", medium: "Mixed", strong: "Strong" },
      popup: {
        physicians: "physicians / 1k",
        transport: "patient transports / yr (est.)",
        transit: "bus/tram stops within radius",
        transitShort: "stops nearby",
      },
    },
    legend: "Bubble size = population · colour = physician density",
    legendRisk: "Bubble size = population · colour = care priority",
    riskLabel: "priority",
    high: "High access",
    medium: "Medium",
    low: "Low access",
    physiciansPer1k: "physicians / 1k",
    aged65: "65+",
    excludedNote:
      "2 districts with fewer than 1,000 residents or no physician registrations in KISS-MD are excluded from access rankings.",
    ranking: {
      title: "District access ranking",
      hint: "Click any row — the map and panel update instantly.",
    },
    chrome: {
      search: "Search districts",
      searchPlaceholder: "Find a district…",
      viewing: "Viewing",
      clear: "Clear selection",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fit: "Fit",
      jump: "Jump",
      mobileHint: "Details in the panel below →",
    },
    panel: {
      title: "District explorer",
      hint: "Click a district on the map or in the list to see physician access, community profile, and care priority at a glance.",
      selected: "Selected district",
      physiciansPer1k: "Physicians per 1,000",
      population: "Population",
      elderly: "Share aged 65+",
      physicians: "Physicians",
      pharmacies: "Pharmacies",
      vulnerability: "Care priority",
      riskRank: "priority",
    },
  },
  closing: {
    eyebrow: "Inequality lens",
    title: "The spread across Magdeburg",
    lead: "Every dot is a district — size is population, color is physician access. Hover the rail to see who sits where.",
    spreadCaption: "from {low} ({lowVal}/1k) to {high} ({highVal}/1k)",
    spectrumLabel: "Physician access spectrum",
    hoverHint: "Hover a dot to read a district",
    cityAvg: "City avg.",
    residents: "residents",
    elderly: "elderly",
    tripleGap: "Triple-gap district",
    tripleGapBody:
      "Weak on physicians, patient transport proxy, and bus access — {ratio}/1k doctors with only {stops} nearby stops.",
    scaleStory: "Scale × vulnerability",
    scaleBody:
      "{residents} residents, {elderly}% elderly, yet only {ratio} physicians per 1,000 — priority #1 by combined need.",
    mapLink: "Open triple-lens map",
    footnote:
      "KISS-MD physician registrations only. The map above ranks compound gaps; this view shows how uneven the whole city is.",
  },
  planner: {
    eyebrow: "Planning tool",
    title: "Where should the next physicians go?",
    lead: "You have a limited budget. Place physicians across priority districts and watch the city-wide picture change — trade-offs included.",
    target: "City-wide average",
    per1k: "physicians per 1,000",
    residents: "residents",
    today: "Today",
    projected: "With investment",
    sliderLabel: "Physicians to add",
    physician: "physician",
    physicians: "physicians",
    gap: "to city avg",
    impact: "Adding {count} physician(s) moves access from {from} → {to} per 1,000 residents.",
    budgetLabel: "Physician budget",
    budgetHint: "Set how many physicians the city can recruit — then place them with +/− or try a scenario.",
    remaining: "Unplaced",
    ladder: "Place by district",
    river: "Your allocation",
    priorityShift: "Priority mix",
    atTarget: "{count} district(s) reach city average",
    roi: "high impact",
    roiHint: "Strong return: smaller population or higher elderly share means each physician reaches more vulnerable residents.",
    need: "{count} needed for full parity · {pct}% closed",
    aboveTarget: "Already at or above city average",
    add: "Add physician to",
    remove: "Remove physician from",
    scenarios: {
      reset: "Clear plan",
      resetHint: "Start over with an empty allocation",
      quickWins: "Quick wins",
      quickWinsHint: "1 physician each to the 8 districts with lowest access",
      elderlyFirst: "Elderly first",
      elderlyFirstHint: "Prioritize districts where aging + low access compound need",
      closeGap: "Close the gap",
      closeGapHint: "Fill districts in priority order until budget runs out",
    },
    outcomes: {
      placed: "Placed",
      ofBudget: "of {total} budget",
      upgraded: "Upgraded",
      districts: "priority levels improved",
      residents: "Residents",
      touched: "in districts receiving physicians",
      avgAccess: "Priority avg.",
    },
  },
  risk: {
    district: "District",
    risk: "Priority",
    elderly: "Elderly share",
    physicians: "Physicians / 1k",
    population: "Population",
    why: "Why",
    footnote:
      "Risk score combines elderly population share, physician density, and district size. Districts without KISS-MD physician registrations are excluded.",
    levels: { High: "High", Medium: "Medium", Low: "Low" },
  },
  narratives: {
    population:
      "Magdeburg grew by 12,804 residents since 2010 — a sign of a city people choose to join and stay in.",
    emergency:
      "Over 53,000 deployments in 2024 — a rescue network that scales with a growing city and keeps communities covered.",
    healthcare:
      "Some districts like Altstadt have exceptional physician access — the map shows where to replicate that success.",
    insights:
      "Net migration of +3,550 in 2024 helped the city grow — new residents are part of Magdeburg's future.",
    risk: "From Cracau to Altstadt, physician access spans more than 30× — inequality is geographic, not abstract.",
  },
  findings: {
    "finding-1": {
      title: "Magdeburg keeps attracting new residents",
      body: "Net migration of +3,550 in 2024 brought fresh energy to the city — population is growing because people choose Magdeburg.",
    },
    "finding-2": {
      title: "A rescue system that scales with the city",
      body: "53,310 emergency deployments in 2024 show a network that responds at scale — patient transport and medical teams reaching every corner.",
    },
    "finding-3": {
      title: "Healthcare wins to build on — and gaps to close",
      body: "Physician density ranges from 0.41 to 13.70 per 1,000 — proof that strong access is possible city-wide with the right focus.",
    },
    "finding-4": {
      title: "Longer lives, stronger communities",
      body: "Average age above 45 reflects more years lived in Magdeburg — a city where people stay, and care systems can plan ahead.",
    },
  },
};

const de: Dict = {
  meta: {
    title: "MAGmagdeburg — Gesundheits- & Bevölkerungsanalyse",
    description:
      "Wie Magdeburg wächst, versorgt und sich weiterentwickelt — eine Open-Data-Story über Bevölkerung und Gesundheit.",
  },
  header: {
    tagline: "Stadt Magdeburg · Open Data",
  },
  nav: {
    overview: "Überblick",
    population: "Bevölkerung",
    emergency: "Rettungsdienst",
    healthcare: "Gesundheit",
    insights: "Erkenntnisse",
    risk: "Priorität",
    dependency: "Abhängigkeit",
  },
  hero: {
    eyebrow: "Gesundheits- & Bevölkerungsanalyse",
    title: "Magdeburg wächst — und versorgt jeden Stadtteil",
    lead: "Open Data zeigt, wie sich die Stadt entwickelt: mehr Einwohner, ein starkes Rettungsnetz und Gesundheitsversorgung, die dort ausgebaut werden kann, wo sie am meisten hilft.",
  },
  sections: {
    overview: {
      eyebrow: "Auf einen Blick",
      title: "Magdeburg 2024",
      lead: "Sechs Indikatoren für eine Stadt, die wächst, versorgt und in Gesundheit investiert.",
    },
    population: {
      eyebrow: "Bevölkerungstrends",
      title: "Eine Stadt, die weiter wächst",
      lead: "Seit 2010 kamen über 12.000 Einwohner hinzu. Zuwanderung bringt neue Energie — längere Lebensjahre zeigen, dass Menschen in Magdeburg bleiben.",
    },
    emergency: {
      eyebrow: "Rettungsdienst",
      title: "Ein Rettungsnetz, das da ist",
      lead: "Tausende Einsätze pro Jahr — Patiententransport, Notfallmedizin und Rettungsteams für die ganze Stadt.",
    },
    healthcare: {
      eyebrow: "Gesundheitsversorgung",
      title: "Versorgung in der ganzen Stadt",
      lead: "Ärztzugang und Gesundheitsprofil nach Stadtteil erkunden. Sehen, wo Versorgung stark ist — und wo der nächste Ausbau am meisten bringt.",
    },
    insights: {
      eyebrow: "Bevölkerung & Gesundheit",
      title: "Was die Daten zeigen — und wohin der Fokus gehört",
      lead: "Klare Erkenntnisse aus Demografie, Rettungsdienst und Gesundheit — ehrlich, handlungsorientiert und zukunftsgerichtet.",
    },
    risk: {
      eyebrow: "Das Schlussbild",
      title: "Zugang ist nicht überall gleich",
      lead: "Die Spanne zwischen Stadtteilen ist die eigentliche Geschichte — keine weitere Rangliste.",
    },
    dependency: {
      eyebrow: "Die verborgene Abhängigkeit",
      title: "Migration hält die Stadt wachsend",
      lead: "Die natürliche Bevölkerungsbewegung ist jedes Jahr negativ — nur Zuwanderung erklärt, warum die Gesamtbevölkerung noch steigt.",
    },
  },
  dependency: {
    headline: "Ohne Migration wäre die Bevölkerung geschrumpft.",
    netGrowthLabel: "Netto-Bevölkerungsveränderung",
    births: "Geburten",
    deaths: "Sterbefälle",
    naturalChange: "Natürliche Veränderung",
    netMigration: "Netto-Migration",
    flowLoss: "Bevölkerungsverlust",
    flowNatural: "Natürliches Defizit",
    flowGain: "Bevölkerungsgewinn",
    finalGrowth: "Bevölkerungswachstum gesamt",
    conclusion:
      "Ohne Migration wäre Magdeburg trotz scheinbaren Gesamtwachstums weiter geschrumpft.",
  },
  pressure: {
    title: "Zeitstrahl Gesundheitsdruck",
    subtitle: "2010 → 2024 — Geburten sinken, Sterbefälle stabil, Migration wächst, Rettungsnachfrage steigt",
    population: "Bevölkerung",
    births: "Geburten",
    deaths: "Sterbefälle",
    migration: "Netto-Migration",
    emergency: "Rettungseinsätze",
    pause: "Pause",
    play: "Abspielen",
    scrub: "Jahre durchblättern",
    hint: "Alle Ströme bewegen sich gleichzeitig — jede Linie auf ihren eigenen Bereich 2010–2024 skaliert.",
  },
  bridges: {
    migration:
      "Neue Einwohner halten Magdeburg wachsend — allein 2024 kamen Tausende durch Zuwanderung hinzu.",
    aging:
      "Mehr Lebensjahre bedeuten mehr Versorgung — und Magdeburgs Rettungsdienst ist dafür da.",
    access:
      "Gesundheitsversorgung ist nicht überall gleich — eine Chance, die Stadtteile zu stärken, die es am meisten brauchen.",
    pattern:
      "Zusammen betrachtet zeigt sich, wo die Stadt stark ist — und wo der nächste Gesundheitsgewinn am klarsten liegt.",
    intervention:
      "Kluge Investition wirkt am besten lokal — diese Prioritäts-Stadtteile zeigen, wo man anfangen kann.",
  },
  footer: {
    subtitle: "Dashboard für Gesundheits- & Bevölkerungsanalyse",
    dataSource: "Datenquelle",
    lastUpdated: "Zuletzt aktualisiert",
  },
  kpi: {
    population: { label: "Gesamtbevölkerung", changeLabel: "ggü. 2023" },
    births: { label: "Geburten", changeLabel: "ggü. 2023" },
    deaths: { label: "Sterbefälle", changeLabel: "ggü. 2023" },
    emergency: { label: "Rettungseinsätze", changeLabel: "ggü. 2023" },
    doctors: { label: "Ärzte", changeLabel: "ggü. 2022" },
    pharmacies: { label: "Apotheken", changeLabel: "ggü. 2022" },
    jumpTo: "Zum Abschnitt →",
  },
  yearRange: {
    all: "Alle Jahre",
    recent: "2020–2024",
    decade: "2010–2019",
  },
  charts: {
    common: {
      hint: "Datenpunkt anklicken oder darüberfahren",
      selected: "ausgewählt",
    },
    population: {
      growth: { title: "Bevölkerungsentwicklung", subtitle: "Gesamtbevölkerung — Hover, Klick zum Fixieren", label: "Bevölkerung" },
      age: { title: "Durchschnittsalter", subtitle: "Stadtweites Mittelalter in Jahren", label: "Durchschnittsalter" },
      birthsDeaths: {
        title: "Geburten vs. Sterbefälle",
        subtitle: "Serien umschalten · Balken anklicken",
        births: "Geburten",
        deaths: "Sterbefälle",
        naturalChange: "Natürliche Veränderung",
      },
      migration: {
        title: "Migration",
        subtitle: "Netto-Migration ein-/ausblenden",
        in: "Zuzug",
        out: "Wegzug",
        net: "Netto-Migration",
      },
    },
    emergency: {
      timeline: {
        title: "Rettungseinsätze im Zeitverlauf",
        subtitle: "Brush zum Zoomen · Klick zum Fixieren",
        total: "Einsätze gesamt",
        notarzt: "Notarzt",
        rescue: "Rettungseinsätze",
      },
      treemap: {
        tabShare: "Anteile",
        tabCount: "Absolute Zahlen",
        scrub: "Schieben — Mix formt sich neu",
      },
      insight: {
        empty: "Über die Grafik fahren oder klicken, um die Einsatz-Mischung eines Jahres zu sehen.",
        eyebrow: "Jahres-Snapshot",
        deployments: "Einsätze",
        vsPrior: "ggü. Vorjahr",
        mix: "Einsatz-Mix",
        transportNote:
          "Krankentransport war {pct}% der Einsätze — {shift} Pkt. {dir} seit 2010.",
        risen: "höher",
        fallen: "niedriger",
      },
      breakdown: {
        title: "Aufschlüsselung nach Fahrzeugtyp",
        subtitle: "Anteil 2024 — Segment anklicken",
        share: "Anteil am Gesamt",
      },
      vehicles: {
        title: "Einsatztrends nach Fahrzeug",
        subtitle: "Fahrzeugtypen umschalten",
        hint: "Über den Stack fahren — der Jahres-Snapshot oben aktualisiert sich, wenn Sie ein Jahr in der Zeitgrafik fixieren.",
        notarzt: "Notarzt",
        transport: "Transport",
        rescue: "Rettung",
        air: "Luft",
      },
      pictogram: {
        deployments: "Einsätze",
        perCategory: "pro Kategorie",
        deploymentsIn: "Rettungseinsätze im Jahr",
        slideYears: "Durch die Jahre schieben",
      },
      categories: {
        medical: "Notfallmedizin",
        transport: "Patiententransport",
        rescue: "Rettungseinsätze",
        air: "Luftrettung",
      },
    },
    insights: {
      keyFindings: "Zentrale Erkenntnisse",
      finding: "Erkenntnis",
      pressureEyebrow: "Druckindex",
      title: "Trends seit 2010",
      subtitle: "Drei parallele Druckströme — jeweils auf 2010 indexiert. Jahr schieben, um zu sehen, welche Kraft vorzieht.",
      baseline: "Basis 2010",
      vsBaseline: "vs. 2010",
      slideYears: "Jahre durchblättern",
      emergency: "Rettungsdienst",
      avgAge: "Ø Alter",
      physicians: "Ärzte / 1k",
      emergencyIndex: "Rettungsindex",
      ageIndex: "Altersindex",
      physiciansIndex: "Ärzteindex",
      divergencePhysicians:
        "Ärzteangebot führt bei Index {physicians} ({physiciansDelta} vs. 2010) — Rettung bei {emergency} ({emergencyDelta})",
      divergenceEmergency:
        "Rettungsnachfrage führt bei Index {emergency} ({emergencyDelta} vs. 2010) — Ärzte bei {physicians} ({physiciansDelta})",
      divergenceAge:
        "Alterungsdruck stabil bei Index {age} ({ageDelta}) — Ärzte bei {physicians}, Rettung bei {emergency}",
    },
  },
  map: {
    loading: "Karte wird geladen…",
    districtAccess: "Versorgungspriorität",
    hospitals: "Krankenhäuser",
    lens: {
      eyebrow: "Dreifach-Linse",
      title: "Zugang ist nicht eindimensional",
      lead: "Drei Linsen umschalten — Ärzte, Krankentransport-Bedarf und Nahverkehr. Stadtteile leuchten auf, wenn jede aktive Linse schwach ist.",
      tripleLens: "Dreifach-Linse",
      compoundLegend: "Dreifach-Lücke · {count} Stadtteile",
      weak: "Schwach (aktive Linsen)",
      mixed: "Gemischt",
      strong: "Starker Zugang",
      tripleGap: "Dreifach-Lücke",
      meta: "Transport-Proxy aus {transport} stadtweiten Krankentransporten · {stops} Magdeburg-Haltestellen · {radius} km Radius",
      rankingTitle: "Zusammengesetzter Zugangsindex",
      rankingHint: "Jedes Prisma bündelt drei Zugangslinsen. Wo jede Facette schwach ist, entsteht eine Dreifach-Lücke.",
      indexEyebrow: "Zugangsindex",
      indexCount: "Stadtteile indexiert",
      convergence: "Konvergenzzone",
      colDistrict: "Stadtteil",
      colPrism: "Prisma",
      colPhysicians: "Ärzte",
      colGap: "Lücken-Score",
      gapShort: "Lücke",
      filterOn: "Linse an",
      filterOff: "Linse aus",
      panelTitle: "Linsen-Übersicht",
      toggles: {
        physicians: "Ärzte",
        transport: "Transportbedarf",
        transit: "ÖPNV-Haltestellen",
      },
      levels: { weak: "Schwach", medium: "Gemischt", strong: "Stark" },
      popup: {
        physicians: "Ärzte / 1k",
        transport: "Krankentransporte / J. (geschätzt)",
        transit: "Bus-/Tram-Haltestellen im Radius",
        transitShort: "Haltestellen",
      },
    },
    legend: "Blasengröße = Bevölkerung · Farbe = Ärztdichte",
    legendRisk: "Blasengröße = Bevölkerung · Farbe = Versorgungspriorität",
    riskLabel: "Priorität",
    high: "Hoher Zugang",
    medium: "Mittel",
    low: "Niedrig",
    physiciansPer1k: "Ärzte / 1k",
    aged65: "65+",
    excludedNote:
      "2 Stadtteile mit weniger als 1.000 Einwohnern oder ohne KISS-MD-Arztregistrierungen sind von Zugangsrankings ausgeschlossen.",
    ranking: {
      title: "Stadtteil-Zugangsranking",
      hint: "Zeile anklicken — Karte und Panel aktualisieren sich sofort.",
    },
    chrome: {
      search: "Stadtteile suchen",
      searchPlaceholder: "Stadtteil finden…",
      viewing: "Ansicht",
      clear: "Auswahl aufheben",
      zoomIn: "Hineinzoomen",
      zoomOut: "Herauszoomen",
      fit: "Einpassen",
      jump: "Sprung",
      mobileHint: "Details im Panel unten →",
    },
    panel: {
      title: "Stadtteil-Explorer",
      hint: "Klicken Sie auf einen Stadtteil in der Karte oder Liste, um Ärztzugang, Stadtteilprofil und Versorgungspriorität zu sehen.",
      selected: "Ausgewählter Stadtteil",
      physiciansPer1k: "Ärzte pro 1.000",
      population: "Bevölkerung",
      elderly: "Anteil 65+",
      physicians: "Ärzte",
      pharmacies: "Apotheken",
      vulnerability: "Versorgungspriorität",
      riskRank: "Priorität",
    },
  },
  closing: {
    eyebrow: "Ungleichheits-Linse",
    title: "Die Spanne in Magdeburg",
    lead: "Jeder Punkt ist ein Stadtteil — Größe ist Bevölkerung, Farbe ist Ärztzugang. Über die Leiste fahren, um zu sehen, wer wo steht.",
    spreadCaption: "von {low} ({lowVal}/1.000) bis {high} ({highVal}/1.000)",
    spectrumLabel: "Spektrum Ärztzugang",
    hoverHint: "Punkt anklicken oder darüberfahren",
    cityAvg: "Stadt-Ø",
    residents: "Einwohner",
    elderly: "Ältere",
    tripleGap: "Dreifach-Lücke",
    tripleGapBody:
      "Schwach bei Ärzten, Krankentransport-Proxy und Busanbindung — {ratio}/1.000 Ärzte, nur {stops} Haltestellen in der Nähe.",
    scaleStory: "Größe × Vulnerabilität",
    scaleBody:
      "{residents} Einwohner, {elderly}% Ältere, nur {ratio} Ärzte pro 1.000 — Priorität #1 nach kombiniertem Bedarf.",
    mapLink: "Drei-Linsen-Karte öffnen",
    footnote:
      "Nur KISS-MD-Ärzteregistrierungen. Die Karte oben rankt zusammengesetzte Lücken; diese Ansicht zeigt die Ungleichheit in der ganzen Stadt.",
  },
  planner: {
    eyebrow: "Planungstool",
    title: "Wohin mit den nächsten Ärzten?",
    lead: "Begrenztes Budget, echte Abwägungen: Verteilen Sie Ärzte auf Prioritäts-Stadtteile und sehen Sie sofort die Wirkung auf die Stadt.",
    target: "Stadtweiter Durchschnitt",
    per1k: "Ärzte pro 1.000",
    residents: "Einwohner",
    today: "Heute",
    projected: "Mit Investition",
    sliderLabel: "Ärzte hinzufügen",
    physician: "Arzt",
    physicians: "Ärzte",
    gap: "zum Ø",
    impact: "{count} Arzt/Ärzte hinzufügen ändert den Zugang von {from} → {to} pro 1.000 Einwohner.",
    budgetLabel: "Ärzte-Budget",
    budgetHint: "Legen Sie fest, wie viele Ärzte die Stadt gewinnen kann — dann per +/− verteilen oder ein Szenario wählen.",
    remaining: "Offen",
    ladder: "Verteilung pro Stadtteil",
    river: "Ihre Verteilung",
    priorityShift: "Prioritäts-Mix",
    atTarget: "{count} Stadtteil(e) erreichen den Stadtdurchschnitt",
    roi: "hohe Wirkung",
    roiHint: "Starker Hebel: kleinere Bevölkerung oder höherer Älterenanteil — jeder Arzt erreicht mehr vulnerable Einwohner.",
    need: "{count} für volle Parität nötig · {pct}% geschlossen",
    aboveTarget: "Bereits auf oder über Stadtdurchschnitt",
    add: "Arzt hinzufügen in",
    remove: "Arzt entfernen aus",
    scenarios: {
      reset: "Plan löschen",
      resetHint: "Neu beginnen ohne Verteilung",
      quickWins: "Schnelle Erfolge",
      quickWinsHint: "Je 1 Arzt in die 8 Stadtteile mit geringstem Zugang",
      elderlyFirst: "Ältere zuerst",
      elderlyFirstHint: "Stadtteile mit hohem Älterenanteil und geringem Zugang priorisieren",
      closeGap: "Lücke schließen",
      closeGapHint: "Nach Priorität auffüllen, bis das Budget leer ist",
    },
    outcomes: {
      placed: "Platziert",
      ofBudget: "von {total} Budget",
      upgraded: "Verbessert",
      districts: "Prioritätsstufen gestiegen",
      residents: "Einwohner",
      touched: "in Stadtteilen mit neuen Ärzten",
      avgAccess: "Ø Priorität",
    },
  },
  risk: {
    district: "Stadtteil",
    risk: "Priorität",
    elderly: "Anteil Ältere",
    physicians: "Ärzte / 1k",
    population: "Bevölkerung",
    why: "Warum",
    footnote:
      "Der Risikoscore kombiniert Anteil älterer Bevölkerung, Ärztdichte und Stadtteilgröße. Stadtteile ohne KISS-MD-Arztregistrierungen sind ausgeschlossen.",
    levels: { High: "Hoch", Medium: "Mittel", Low: "Niedrig" },
  },
  narratives: {
    population:
      "Seit 2010 wuchs Magdeburg um 12.804 Einwohner — ein Zeichen dafür, dass Menschen die Stadt wählen und bleiben.",
    emergency:
      "Über 53.000 Einsätze in 2024 — ein Rettungsnetz, das mit einer wachsenden Stadt Schritt hält.",
    healthcare:
      "Stadtteile wie die Altstadt zeigen, was starke Ärzteversorgung leisten kann — die Karte zeigt, wo man das replizieren kann.",
    insights:
      "Netto-Zuwanderung von +3.550 in 2024 half der Stadt zu wachsen — neue Einwohner sind Teil von Magdeburgs Zukunft.",
    risk: "Von Cracau bis Altstadt spannt der Ärztzugang mehr als das 30-Fache — Ungleichheit ist räumlich, nicht abstrakt.",
  },
  findings: {
    "finding-1": {
      title: "Magdeburg gewinnt weiter neue Einwohner",
      body: "Netto-Zuwanderung von +3.550 in 2024 brachte neue Energie — die Stadt wächst, weil Menschen Magdeburg wählen.",
    },
    "finding-2": {
      title: "Ein Rettungsnetz im Stadtmaßstab",
      body: "53.310 Einsätze in 2024 zeigen ein System, das flächendeckend reagiert — Transport und Notfallteams in jedem Stadtteil.",
    },
    "finding-3": {
      title: "Erfolge ausbauen — Lücken schließen",
      body: "Ärztdichte von 0,41 bis 13,70 pro 1.000 — der Beweis, dass starke Versorgung stadtteilübergreifend möglich ist.",
    },
    "finding-4": {
      title: "Länger leben, stärkere Gemeinschaften",
      body: "Ein Durchschnittsalter über 45 bedeutet mehr Lebensjahre in Magdeburg — eine Stadt, in der Menschen bleiben.",
    },
  },
};

export const translations: Record<Locale, Dict> = { en, de };

function resolve(dict: Dict, key: string): string | undefined {
  const parts = key.split(".");
  let current: string | Dict = dict;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function translate(locale: Locale, key: string): string {
  return resolve(translations[locale], key) ?? resolve(translations.en, key) ?? key;
}

export type TFunction = (key: string) => string;

export function createT(locale: Locale): TFunction {
  return (key: string) => translate(locale, key);
}
