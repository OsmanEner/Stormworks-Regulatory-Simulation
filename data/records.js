/*
  CAMERON COUNTY — RECORDS (EDIT THIS FILE IN VS CODE)
  ===================================================
  The lists below start EMPTY. Nothing will be published until you add a block.
  To publish a record: copy the example out of its commented section and
  paste it in the matching list. You can add as many blocks as you need.

  For TEXT in orders, use backticks (`text`) so apostrophes and quotation
  marks won't break JavaScript.

  ORDER TYPES:
    'delay'   = 1 paragraph
    'closure' = 4 paragraphs

  Every published order needs a unique id. The link is created automatically.
  Change records.js, save and push to GitHub Pages to publish your changes.
*/

const countyOrderSettings = {
  judgeName: 'Barack H Obama II',
  contactName: 'County Communications Office'
};

const countyRecords = {
  // ================= FULL ROAD / BEACH CLOSURES =================
  closures: [
    /* COPY/PASTE EXAMPLE — remove the comment markers when publishing:
    {
      type: 'Primary Day',
      date: 'Nov 12, 2026',
      time: '12:00 p.m. to 10:00 p.m.',
      status: 'Closure Scheduled. Hwy 4 & Boca Chica will be Closed.'
    },
    */
  ],

  // ================= INTERMITTENT ROAD DELAYS ===================
  delays: [
    {
      type: 'Primary Date',
      date: 'October 28, 2026',
      time: '3:30 a.m. to 5:00 a.m.'
    },
  ],

  // ================== PUBLISHED COUNTY ORDERS ===================
  orders: [
    {
      id: 'CC-2026-001',
      type: 'delay',
      date: 'October 28, 2026',
      title: 'TEMPORARY AND INTERMITTENT STATE HIGHWAY 4 ROAD DELAY',
      paragraphs: [
        `Please be advised that on October 18th, 2026, SpaceX will be conducting transportation operations on Highway 4 near Boca Chica sometime between 3:30 a.m. - 5:00 a.m. The beach and highway 4 will remain open throughout the operation; however, traffic may be delayed for a short duration.`
      ]
    },

    // FULL BEACH CLOSURE ORDER — FOUR text paragraphs
    /* COPY/PASTE EXAMPLE — remove the comment markers when publishing:
    {
      id: 'CC-2026-002',
      type: 'closure',
      date: 'November 12, 2026',
      title: 'TEMPORARY CLOSURE OF BOCA CHICA BEACH AND STATE HIGHWAY 4',
      paragraphs: [
        `First paragraph: authorization and background.`,
        `Second paragraph: affected locations and closure details.`,
        `Third paragraph: additional information or a statement.`,
        `Fourth paragraph: final public information and coordination details.`
      ]
    },
    */
  ]
};
