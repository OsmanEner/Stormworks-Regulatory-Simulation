/*
  CAMERON COUNTY — RECORDS (EDIT THIS FILE IN VS CODE)
  ===================================================
  Current published delay and order records are saved below.
  To publish more records: copy the example out of its commented section
  and paste it in the matching list. You can add as many blocks as needed.

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
      date: 'Nov 09, 2026',
      time: '12:00 p.m. to 10:00 p.m.',
      status: 'Closure Scheduled. Hwy 4 & Boca Chica will be Closed.'
    },
    */
  ],

  // ================= INTERMITTENT ROAD DELAYS ===================
  delays: [
      {
      type: 'Primary Day',
      date: 'Nov 10, 2026',
      time: '08:00 a.m. to 09:00 a.m.',
    },
  ],

  // ================== PUBLISHED COUNTY ORDERS ===================
  orders: [

    // FULL BEACH CLOSURE ORDER — FOUR text paragraphs
    {
      id: 'CC-2026-003',
      type: 'delay',
      date: 'November 09, 2026',
      title: 'NOVEMBER 09 2026 - TEMPORARY AND INTERMITTENT STATE HIGHWAY 4 ROAD DELAY',
      paragraphs: [
        `Please be advised that on November 10th, 2026, SpaceX will be conducting transportation operations on Highway 4 near Boca Chica sometime between 8:00 a.m. - 9:00 a.m. The beach and highway 4 will remain open throughout the operation; however, traffic may be delayed for a short duration.`
      ]
    },
  ]
};
