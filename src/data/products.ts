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
  payhipUrl: string;
  highlight?: { eyebrow: string; title: string; body: string; bullets: string[] };
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
    payhipUrl: 'https://payhip.com/b/tqyef',
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
    payhipUrl: 'https://payhip.com/b/cGrYT',
    format: 'Downloadable PDF',
    pages: '43 pages',
  },
  {
    slug: 'quarterback-journal',
    id: 'sku_journal_003',
    name: 'The Quarterback Journal',
    tagline: 'Beyond the game: master your mindset, build your confidence, define your legacy',
    price: 19,
    cover: { hue: 'from-[#0f1a14] via-[#0a0f0c] to-[#070a08]', label: 'JOURNAL' },
    accent: '#5BBF9C',
    shortDescription:
      'A 47-page mental performance and personal development workbook for quarterbacks: confidence, pressure, mistakes, leadership, discipline, and a full section on understanding and managing anxiety, including a 14-day anxiety workbook and a 30-day challenge.',
    longDescription:
      'The Quarterback Journal is built around one idea: becoming a great quarterback starts with developing the person behind the player. It combines self-assessment, mental toughness, confidence, leadership, and discipline with a practical, plain-language section on the mind beyond football: overthinking, anxiety, emotional control, relationships, setbacks, and identity. The anxiety chapter explains what anxiety is, the anxiety cycle, breathing, grounding, and muscle relaxation, thought records and gradual exposure from cognitive behavioral therapy, the lifestyle habits that affect anxiety, and when to get professional support. A 14-day anxiety workbook turns it into daily practice. It is an educational resource and not a replacement for professional mental health care.',
    who: 'High school and college quarterbacks, and any young athlete who deals with pressure, self-doubt, anxiety, or adversity and wants practical tools, not just motivation.',
    benefits: [
      'A full anxiety chapter with the anxiety cycle, breathing, grounding, thought records, and a fear ladder',
      'A 14-day anxiety workbook: one skill, exercise, and reflection per day',
      'A 30-day mental development challenge, 5 to 15 minutes a day',
      'Confidence, pressure, mistakes, self-doubt, focus, and visualization',
      'Leadership, discipline, being a backup, and a 90-day roadmap',
      'Twelve reusable templates: daily check-in, game prep, postgame, and more',
      'Written by a college quarterback, with real references',
    ],
    highlight: {
      eyebrow: 'The anxiety section',
      title: 'Understand it. Practice skills. Know when to get help.',
      body: 'The heart of this journal is a dedicated section on anxiety and the overactive mind, written in plain language for athletes. It teaches skills, not quick fixes, and it is honest about when to talk to a professional.',
      bullets: [
        'What anxiety is, why it happens, and the physical signs',
        'The anxiety cycle, with a diagram you can use',
        'Breathing, grounding (5-4-3-2-1), muscle relaxation, and mindfulness',
        'CBT-based thought records and balanced thinking',
        'Gradual exposure: how to face fears in small, safe steps',
        'Sleep, caffeine, and other habits that affect anxiety',
        'When to seek support, and a crisis note with the 988 Lifeline',
        'A 14-day anxiety workbook to practice it all',
      ],
    },
    sections: [
      { title: 'Part I: Know Yourself', body: 'Identity beyond the jersey, strengths and weaknesses, personal standards, purpose and values, and self-awareness, with worksheets for each.' },
      { title: 'Part II: The Competitive Mind', body: 'Real confidence, handling pressure, mental toughness, responding to mistakes, overcoming self-doubt, focus, visualization, and building your own mental performance routine.' },
      { title: 'Part III: Building the Quarterback', body: 'Leading without a title, earning trust, discipline, consistency, being a backup, ownership, goal-setting, being a teammate, and a 90-day roadmap.' },
      { title: 'Part IV: The Mind Beyond Football', body: 'Thoughts and overthinking, the full anxiety chapter, a 14-day anxiety workbook, confidence without validation, emotional intelligence, relationships, setbacks, and becoming more than an athlete.' },
      { title: 'Part V: The Daily Work and the 30-Day Challenge', body: 'Twelve reusable templates (daily check-in, weekly reflection, practice evaluation, game preparation, postgame reflection, confidence, stress and anxiety, habits, goals, monthly assessment, leadership, end of season) and a 30-day mental development challenge with a tracker.' },
    ],
    preview: [
      'The anxiety cycle diagram',
      'A thought record and a fear ladder',
      'A day from the 14-day anxiety workbook',
      'A chapter layout: lesson, what it looks like, mistakes, how to apply it, reflection',
    ],
    faqs: [
      {
        q: 'Is this therapy or medical advice?',
        a: 'No. It is an educational resource that teaches skills commonly used to manage stress and anxiety. It does not replace professional mental health care, and it says when to reach out for help.',
      },
      {
        q: 'Do I have to play football to use it?',
        a: 'Football gives it its examples, but most of the lessons, especially the anxiety chapter, the 14-day workbook, and the 30-day challenge, apply to anyone.',
      },
      {
        q: 'Do I need the Playbook to use it?',
        a: 'No. The Playbook teaches the position and the Journal develops the person. They work well together, and each works on its own.',
      },
      {
        q: 'What format is it?',
        a: 'A 47-page downloadable PDF you can print or fill in on a tablet with any PDF annotation app.',
      },
    ],
    payhipUrl: 'https://payhip.com/b/WIx93',
    format: 'Downloadable PDF',
    pages: '47 pages',
  },
  {
    slug: 'complete-qb-development-bundle',
    id: 'sku_bundle_004',
    name: 'Complete QB Development Bundle',
    tagline: 'Everything you need to develop this offseason',
    price: 52,
    compareAt: 62,
    cover: { hue: 'from-electric via-[#0c1430] to-nearblack', label: 'BUNDLE' },
    accent: '#3B82F6',
    shortDescription:
      'The Playbook, Film Room Guide, and Quarterback Journal together — a complete 137-page development system for $52, $10 less than buying each separately ($62).',
    longDescription:
      'The Bundle gives you the complete development picture: a complete guide to playing quarterback, a film-study guide that sharpens your recognition and decision-making, and a mental-performance journal with a full anxiety section. Three products designed to work together, for $10 less than buying each separately.',
    who: 'Quarterbacks who are serious about a complete, structured offseason and want every tool at once.',
    benefits: [
      'All three products in one download',
      'A complete guide to the position (The Quarterback Playbook)',
      'A complete film-study system (Film Room Guide)',
      'A mental performance journal with an anxiety workbook (The Quarterback Journal)',
      'Save $10 vs buying each product individually',
    ],
    sections: [
      {
        title: 'What is included',
        body: 'Three downloadable PDFs delivered together after purchase:',
        bullets: [
          'The Quarterback Playbook — $24 value',
          'QB Film Room Guide — $19 value',
          'The Quarterback Journal — $19 value',
          'Total individual value: $62',
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
        a: 'Yes. Individually the three products cost $62; the bundle is $52, saving you $10.',
      },
    ],
    payhipUrl: 'https://payhip.com/b/QwLey',
    format: 'Downloadable PDF (3 files)',
    pages: '137 pages total',
    isBundle: true,
    includes: [
      'quarterback-playbook',
      'qb-film-room-guide',
      'quarterback-journal',
    ],
  },
];

export const faqs = [
  {
    q: 'Who are these resources for?',
    a: 'High school and college quarterbacks who want structured, detailed development tools. The practice section of the Playbook assumes you have a football and access to a field; the film and journal work can be done anywhere.',
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
    a: 'No. The Playbook is written for self-directed athletes. It explains the position chapter by chapter, with notes on what each skill should look like, and ends with a 28-day practice schedule. A coach can help, but is not required.',
  },
  {
    q: 'Can I buy the bundle later?',
    a: 'Yes, but you will save more by buying the bundle up front. The bundle is $52 vs $62 for all three products separately.',
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
