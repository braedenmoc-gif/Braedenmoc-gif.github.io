export type ProductSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type Product = {
  slug: string;
  id: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  cover: { hue: string; label: string };
  accent: string;
  shortDescription: string;
  longDescription: string;
  who: string;
  benefits: string[];
  sections: ProductSection[];
  preview: string[];
  faqs: { q: string; a: string }[];
  format: string;
  pages: string;
  badge?: string;
  isBundle?: boolean;
  includes?: string[];
};

export type WeekObjective = {
  week: number;
  title: string;
  focus: string;
  objective: string;
  activities: string[];
  deliverable: string;
};

export const pillars = [
  { name: 'Mechanics', desc: 'Repeatable throwing fundamentals' },
  { name: 'Footwork', desc: 'Platform, pocket, and roll mechanics' },
  { name: 'Film Study', desc: 'Read defenses and grade your game' },
  { name: 'Decision-Making', desc: 'Progressions, timing, situations' },
  { name: 'Leadership', desc: 'Command, presence, preparation' },
];

export const weeks: WeekObjective[] = [
  {
    week: 1,
    title: 'Mechanics & Foundational Footwork',
    focus: 'Establish your base',
    objective:
      'Build the foundational movement patterns every quarterback rep starts from — grip, carriage, hips-lead throwing, and base footwork.',
    activities: [
      'Baseline test: accuracy, drop timing, and a mechanics video',
      'Grip, carriage, and hips-lead throwing',
      'Three-step and five-step footwork',
      'Mechanics checkpoint and platform throws at three levels',
    ],
    deliverable: 'Week 1 scorecard + mechanics checkpoint',
  },
  {
    week: 2,
    title: 'Pocket Movement & Throwing Accuracy',
    focus: 'Layer movement onto your base',
    objective:
      'Add pocket movement and translate it into accurate throwing at all three levels of the field.',
    activities: [
      'Climb, slide, reset, and escape movements',
      'Accuracy ladders at short, intermediate, and deep',
      'Slide and reset under a rushing defender',
      'Off-platform throws and an accuracy test on moving targets',
    ],
    deliverable: 'Week 2 scorecard + accuracy test',
  },
  {
    week: 3,
    title: 'Reading Defenses & Decision-Making',
    focus: 'Sharpen your eyes',
    objective:
      'Develop pre-snap recognition, coverage shell identification, and progression discipline — the work that turns a thrower into a decision-maker.',
    activities: [
      'Pre-snap identification and one-high vs. two-high reads',
      'Situational decisions and timing windows',
      'Pressure recognition and hot reads',
      'A decision test and film or QB Lab work',
    ],
    deliverable: 'Week 3 scorecard + decision test',
  },
  {
    week: 4,
    title: 'Game-Speed Integration & Evaluation',
    focus: 'Put it together at game speed',
    objective:
      'Integrate everything from the first three weeks at game speed, with a final assessment that grades growth across all four pillars.',
    activities: [
      'Tempo circuit and pocket integration',
      'Pressure throws and the two-minute drill',
      'Red zone and third-down package',
      'A deload day, then the final assessment against your day-1 numbers',
    ],
    deliverable: 'Final assessment + offseason continuation plan',
  },
];

export const products: Product[] = [
  {
    slug: 'quarterback-playbook',
    id: 'sku_playbook_001',
    name: 'The Quarterback Playbook',
    tagline: 'How to play the position, from the details to the lows',
    price: 24,
    cover: { hue: 'from-electric via-electricdark to-[#0c1430]', label: 'PLAYBOOK' },
    accent: '#3B82F6',
    shortDescription:
      'A complete guide to being a quarterback: 16 chapters on the job, mindset, mechanics, footwork, accuracy, reading defenses, decisions, the line of scrimmage, preparation, game day, adversity, and leadership, with a short four-week practice program at the back.',
    longDescription:
      'The Quarterback Playbook is written as a quarterback who has been through the highs and the lows. It covers the whole position: what the job actually is, mindset and standards, mechanics, footwork and the pocket, accuracy and ball placement, reading defenses, decisions and situations, the line of scrimmage, play-action and the run game, film study and weekly preparation, your body, game day, adversity and persistence, leadership, and a long list of small details. Every chapter ends with work to do that week and space for your own notes. A short four-week practice program with a drill library, baseline tests, and a scorecard turns the ideas into reps.',
    who: 'High school and college quarterbacks who want to understand the whole position, not just run drills, and who are willing to do the work.',
    benefits: [
      '16 chapters on the craft, the preparation, the mindset, and the job itself',
      'What each skill should look like, plus the common mistakes',
      'A chapter on adversity, persistence, and bouncing back from bad games',
      'A weekly work list and notes space at the end of every chapter',
      'A short four-week practice program with ten core drills at the back',
      'Baseline tests and a day-1 vs. day-26 scorecard',
    ],
    sections: [
      {
        title: 'Part 1 — The Job and the Mindset',
        body: 'What a quarterback actually is, what coaches and teammates need from you, and the habits of mind that decide how you handle everything else.',
        bullets: ['What a quarterback actually is', 'Standards, confidence, and ownership', 'A starting-point self-rating you revisit at the end'],
      },
      {
        title: 'Part 2 — The Craft',
        body: 'The skills, broken into pieces you can check yourself against.',
        bullets: [
          'Mechanics: grip, stance, carriage, delivery, release, finish',
          'Footwork and the pocket: drops, platform, climb, slide, reset',
          'Accuracy and ball placement against coverage',
          'Reading defenses, progressions, and pressure',
          'Decisions: risk, ball security, and situational football',
          'The line of scrimmage: cadence, protections, and audibles',
          'Play-action, the run game, and the quarterback as a runner',
        ],
      },
      {
        title: 'Part 3 — Preparation',
        body: 'How to prepare during the week, take care of your body, and handle game day.',
        bullets: ['Film study and the weekly rhythm', 'Arm care, sleep, nutrition basics, and practice habits', 'Game day routine, from the night before to after the game'],
      },
      {
        title: 'Part 4 — Adversity and Leadership',
        body: 'The part most guides skip: bad games, losing the job, injuries, and how to keep going, plus leading your teammates and thinking long term.',
        bullets: ['A reset routine for bad games', 'Backup and bench situations', 'Leadership: line, receivers, coaches, and the huddle', 'The long game: moving up a level and choosing a program'],
      },
      {
        title: 'Part 5 — The Little Details',
        body: 'A checklist of small details grouped by situation: before the snap, in the pocket, on the throw, on the move, and in different weather.',
        bullets: ['Before the snap and in the pocket', 'On the throw and on the move', 'Weather and conditions', 'Your own personal list'],
      },
      {
        title: 'Part 6 — The Practice Program',
        body: 'A short four-week program that puts the chapters into reps. It is the back of the book, not the whole book.',
        bullets: ['A 28-day schedule at a glance', 'Ten core drills with cues and common errors', 'Baseline tests and solo options', 'A day-1 vs. day-26 scorecard'],
      },
    ],
    preview: [
      'Chapter layout: intro, what it should look like, common mistakes, work for the week',
      'The pre-snap checklist and coverage table',
      'The reset routine for bad games',
      'Drill entry: purpose, setup, cues, mistakes, progression',
    ],
    faqs: [
      {
        q: 'Is this a training program or a guide?',
        a: 'Mostly a guide. Most of the book is about how to play the position: the craft, preparation, mindset, and adversity. A short four-week practice program at the back turns it into reps.',
      },
      {
        q: 'Do I need a coach to use it?',
        a: 'No. It is written for self-directed quarterbacks. A coach who can watch you throw will always help, and the book does not replace one.',
      },
      {
        q: 'What format is it?',
        a: 'A 47-page downloadable PDF you can print or use on any device. Each chapter ends with a notes space you can write in.',
      },
    ],
    format: 'Downloadable PDF',
    pages: '47 pages',
    badge: 'Featured Program',
  },
  {
    slug: 'qb-film-room-guide',
    id: 'sku_filmroom_002',
    name: 'QB Film Room Guide',
    tagline: 'Develop your football IQ one frame at a time',
    price: 19,
    cover: { hue: 'from-[#1c2230] via-[#10131a] to-[#0c0f15]', label: 'FILM ROOM' },
    accent: '#A9ADB4',
    shortDescription:
      'A 43-page guide to reading defenses: 20 coverage looks with diagrams, pre-snap and post-snap keys, pressure indicators, route concepts against each coverage, progression rules, and film-grading worksheets you reuse every week.',
    longDescription:
      'The Film Room Guide teaches you how to watch film as a quarterback. It covers eight coverages with diagrams, the pre-snap and post-snap keys for each, how to spot pressure, six route concepts and where the ball goes against each coverage, and a repeatable film-study routine with three printable worksheets. Twenty practice looks with answers let you test yourself, and a one-page cheat sheet goes in your bag. It is honest about the limits of pre-snap reads: not every coverage can be identified before the snap, so it teaches you to confirm after it. Use it alone or with the free QB Lab and the Playbook.',
    who: 'Quarterbacks who want to improve pre-snap recognition, learn coverage concepts, and build a repeatable film-study routine.',
    benefits: [
      'Eight coverages broken down one per page: Cover 0, 1, 2, Tampa 2, 3, 4, 6, and 2-Man',
      'Pre-snap looks, post-snap keys, strengths, weaknesses, and concepts that beat each one',
      'A man-or-zone checklist for confirming the coverage after the snap',
      'Pressure recognition: what the box, the safeties, and the second level tell you',
      'Six route concepts with diagrams and a concept-versus-coverage chart',
      'Progression, timing, and situational football chapters',
      'Three printable worksheets: pre-snap checklist, play-by-play grading, opponent scouting',
      'Twenty practice looks with answers, plus a one-page cheat sheet',
    ],
    sections: [
      { title: 'How a Quarterback Reads a Defense', body: 'A repeatable order for every snap: pre-snap picture, post-snap confirmation, then the throw. It also shows where pre-snap certainty ends and why you confirm after the snap.' },
      { title: 'The Language of the Defense', body: 'The terms you need (shells, leverage, apex, rotation) and how depth and width of each defender tell you what the coverage is likely to be.' },
      { title: 'Man or Zone?', body: 'The post-snap clues that separate man from zone, and what each one means for where the ball goes.' },
      {
        title: 'The Coverage Library',
        body: 'Eight coverages, one per page, each with a diagram, the look, your keys, strengths, weaknesses, and the concepts that attack it.',
        bullets: [
          'Cover 0 — man with no deep safety',
          'Cover 1 — man with one deep safety',
          'Cover 2 and Tampa 2 — two deep halves, and the middle linebacker difference',
          'Cover 3 — three deep thirds',
          'Cover 4 — quarters',
          'Cover 6 — quarters to one side, halves to the other',
          '2-Man — man underneath with two safeties over the top',
        ],
      },
      { title: 'Pressure', body: 'How to see a blitz coming from alignment and rotation, and what to do with the ball when you do.' },
      { title: 'Route Concepts and Where the Ball Goes', body: 'Four verticals, mesh, stick, flood, levels, and curl-flat, each with a diagram, followed by a concept-versus-coverage chart.' },
      { title: 'Progressions, Timing, and Situations', body: 'How to read in order, when to hitch or move, and how down, distance, field position, and clock change what you should expect.' },
      { title: 'Film Workflow, Worksheets, and Practice Looks', body: 'A film-study routine you can repeat, three printable worksheets, twenty practice looks with an answer key, and a one-page cheat sheet for your bag.' },
    ],
    preview: [
      'One-page coverage cheat sheet',
      'Pre-snap checklist worksheet',
      'Play-by-play grading worksheet',
      'Twenty practice looks with answers',
    ],
    faqs: [
      {
        q: 'Do I need film to use this?',
        a: 'You will get the most out of it with game or practice film for the worksheets, but you can learn the coverages from the diagrams and test yourself with the twenty practice looks first.',
      },
      {
        q: 'Is this only for advanced QBs?',
        a: 'No. It starts with the fundamentals of pre-snap identification and builds to advanced concepts. Anyone who wants to learn how to read a defense can use it.',
      },
      {
        q: 'Can I use this with the Playbook?',
        a: 'Yes. The Playbook develops your physical and decision-making reps on the field, and its week 3 film work lines up with this guide. They also work separately.',
      },
    ],
    format: 'Downloadable PDF',
    pages: '43 pages',
  },
  {
    slug: 'offseason-qb-training-journal',
    id: 'sku_journal_003',
    name: 'Offseason QB Training Journal',
    tagline: 'Track what you measure, improve what you track',
    price: 12,
    cover: { hue: 'from-[#0f1a14] via-[#0a0f0c] to-[#070a08]', label: 'JOURNAL' },
    accent: '#5BBF9C',
    shortDescription:
      'A 46-page training journal built for a 12-week offseason: baseline test, twelve two-page weekly spreads, four-week reviews, six in-season game-week pages, a total-volume tracker, a one-line session log, and a mental-rep script.',
    longDescription:
      'The Offseason Journal is a printable 12-week training log you can use alongside the Playbook or on its own. You start with a baseline test and self-ratings. Each week has a plan with four measurable goals and a daily log of session type, minutes, throws, RPE, sleep, and soreness, then a second page with an accuracy test grid, footwork self-grade, film log, and habit tracker. Every four weeks a review page and retest checklist show what moved. Six game-week pages cover the season, and the back pages hold a total-volume tracker, a one-line-per-session log, a two-minute mental-rep script, and a pre-practice checklist.',
    who: 'Any quarterback who wants to track an offseason and see measurable progress week over week.',
    benefits: [
      'Baseline test and self-ratings to start from',
      'Twelve weekly spreads: four measurable goals and a daily log',
      'Accuracy test grid by depth and zone, plus a footwork self-grade',
      'Film log and habit tracker every week',
      'Sleep, soreness, and RPE tracked daily to manage load',
      'Three four-week reviews with a retest checklist, then an offseason close-out',
      'Six in-season game-week pages',
      'Total-volume tracker, one-line session log, mental-rep script, and pre-practice checklist',
    ],
    sections: [
      { title: 'Start Here and Baseline', body: 'How to use the journal, the habits to keep consistent, an offseason starting-point test, and a 1-to-5 honest self-rating.' },
      { title: 'Weekly Plan and Daily Log', body: 'Four measurable goals (mechanical, film, physical, mental) and a daily log of session type, minutes, throws, RPE, sleep, and soreness, with a two-minute mental rep to start each week.' },
      { title: 'Weekly Spread, Page Two', body: 'An accuracy test by depth and zone, a footwork self-grade, a film log, and a habit tracker for the week.' },
      { title: 'Four-Week Reviews', body: 'A zoom-out page and retest checklist after weeks 4, 8, and 12 (5-10-5, 10-yard sprint, broad jump) so you can see what changed.' },
      { title: 'Close It Out and Game Week', body: 'An offseason summary page, then six game-week pages with a scouting snapshot for in-season use.' },
      { title: 'Logs and Scripts', body: 'A total-volume tracker, a one-line-per-session log, a mental-rep script, and a pre-practice checklist.' },
    ],
    preview: [
      'Weekly plan with four goals and a daily log',
      'Accuracy test grid and footwork self-grade',
      'Four-week review and retest checklist',
      'Pre-practice checklist',
    ],
    faqs: [
      {
        q: 'Is this reusable?',
        a: 'The journal is a 12-week dated layout, so each offseason you print a fresh copy. Your purchase lets you print as many copies as you need for your own use.',
      },
      {
        q: 'Do I need the Playbook to use it?',
        a: 'No, it works on its own. If you run both, log your Playbook sessions in the Journal daily log.',
      },
      {
        q: 'What if I prefer digital tracking?',
        a: 'The journal is a PDF, so you can print it or fill it on a tablet with any PDF annotation app.',
      },
    ],
    format: 'Downloadable PDF',
    pages: '47 pages',
  },
  {
    slug: 'complete-qb-development-bundle',
    id: 'sku_bundle_004',
    name: 'Complete QB Development Bundle',
    tagline: 'Everything you need to develop this offseason',
    price: 45,
    compareAt: 55,
    cover: { hue: 'from-electric via-[#0c1430] to-nearblack', label: 'BUNDLE' },
    accent: '#3B82F6',
    shortDescription:
      'The Playbook, Film Room Guide, and Offseason Journal together — a complete 136-page development system for $45, $10 less than buying each separately ($55).',
    longDescription:
      'The Bundle gives you the complete development picture: a complete guide to playing quarterback, a film-study guide that sharpens your recognition and decision-making, and a 12-week journal that turns your offseason into measurable progress. Three products designed to work together, for $10 less than buying each separately.',
    who: 'Quarterbacks who are serious about a complete, structured offseason and want every tool at once.',
    benefits: [
      'All three products in one download',
      'A complete guide to the position (The Quarterback Playbook)',
      'A complete film-study system (Film Room Guide)',
      'A 12-week offseason tracking journal (Journal)',
      'Save $10 vs buying each product individually',
    ],
    sections: [
      {
        title: 'What is included',
        body: 'Three downloadable PDFs delivered together after purchase:',
        bullets: [
          'The Quarterback Playbook — $24 value',
          'QB Film Room Guide — $19 value',
          'Offseason QB Training Journal — $12 value',
          'Total individual value: $55',
        ],
      },
    ],
    preview: [
      'Playbook preview',
      'Film Room Guide preview',
      'Journal preview',
    ],
    faqs: [
      {
        q: 'Do I get all three files?',
        a: 'Yes. After purchase you receive download links for all three PDFs.',
      },
      {
        q: 'Is it cheaper than buying separately?',
        a: 'Yes. Individually the three products cost $55; the bundle is $45, saving you $10.',
      },
    ],
    format: 'Downloadable PDF (3 files)',
    pages: '136 pages total',
    isBundle: true,
    includes: [
      'quarterback-playbook',
      'qb-film-room-guide',
      'offseason-qb-training-journal',
    ],
  },
];

export const faqs = [
  {
    q: 'Who are these resources for?',
    a: 'High school and college quarterbacks who want structured, detailed development tools. The programs assume you have a football and access to a field; the film and journal work can be done anywhere.',
  },
  {
    q: 'Are these physical products?',
    a: 'No. All products are downloadable PDFs. You receive secure download links after purchase and can print them or use them on any device.',
  },
  {
    q: 'How long do I have access?',
    a: 'Once you download the files, they are yours to keep and reuse. The Journal is designed to be printed and reused for as many offseasons as you want.',
  },
  {
    q: 'Do I need a coach to use the Playbook?',
    a: 'No. The Playbook is written for self-directed athletes. Every day has clear objectives, drills, and checkpoints. A coach can help, but is not required.',
  },
  {
    q: 'Can I buy the bundle later?',
    a: 'Yes, but you will save more by buying the bundle up front. The bundle is $45 vs $55 for all three products separately.',
  },
  {
    q: 'What if I am not satisfied?',
    a: 'If a product is not what you expected, contact us within 14 days of purchase and we will make it right.',
  },
];

export const heroImages = {
  primary: 'https://images.pexels.com/photos/140039/pexels-photo-140039.jpeg',
  throwing: 'https://images.pexels.com/photos/13401812/pexels-photo-13401812.jpeg',
  prepass: 'https://images.pexels.com/photos/14664731/pexels-photo-14664731.jpeg',
  training: 'https://images.pexels.com/photos/4700756/pexels-photo-4700756.jpeg',
  stadium: 'https://images.pexels.com/photos/1646735/pexels-photo-1646735.jpeg',
  night: 'https://images.pexels.com/photos/2682296/pexels-photo-2682296.jpeg',
  huddle: 'https://images.pexels.com/photos/1147453/pexels-photo-1147453.jpeg',
  coach: 'https://images.pexels.com/photos/1618081/pexels-photo-1618081.jpeg',
  field: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg',
  action: 'https://images.pexels.com/photos/163226/football-quarterback-running-back-action-163226.jpeg',
};

export const imgSrc = (url: string, w = 1600, h = 900) =>
  `${url}?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
