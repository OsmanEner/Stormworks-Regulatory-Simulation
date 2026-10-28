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
  judgeName: 'Alex Morgan',
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
    /* COPY/PASTE EXAMPLE — remove the comment markers when publishing:
    {
      type: 'Primary Date',
      date: 'Nov 10, 2026',
      time: '9:00 a.m. to 12:00 p.m.'
    },
    */
  ],

  // ================== PUBLISHED COUNTY ORDERS ===================
  orders: [
    // ROAD DELAY ORDER — one text paragraph
    /* COPY/PASTE EXAMPLE — remove the comment markers when publishing:
    {
      id: 'CC-2026-001',
      type: 'delay',
      date: 'November 10, 2026',
      title: 'TEMPORARY AND INTERMITTENT STATE HIGHWAY 4 ROAD DELAY',
      paragraphs: [
        `Your road delay information goes here.`
      ]
    },
    */

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
