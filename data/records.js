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
    {
      type: 'Primary Day',
      date: 'Nov 11, 2026',
      time: '5:00 a.m. to 2:00 p.m.',
      status: 'Road and Beach Open.'
    },
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
      date: 'November 10, 2026',
      title: 'NOVEMBER 10 2026 - TEMPORARY AND INTERMITTENT STATE HIGHWAY 4 ROAD DELAY',
      paragraphs: [
        `Please be advised that on November 10th, 2026, SpaceX will be conducting transportation operations on Highway 4 near Boca Chica sometime between 8:00 a.m. - 9:00 a.m. The beach and highway 4 will remain open throughout the operation; however, traffic may be delayed for a short duration.`
      ]
    },
    {
      id: 'CC-2026-004',
      type: 'closure',
      date: 'November 10, 2026',
      title: 'NOVEMBER 11 2026 - TEMPORARY AND INTERMITTENT STATE HIGHWAY 4 ROAD DELAY',
      paragraphs: [
        `On November 10th, 2026, the Commissioners' Court approved an Order authorizing County Judge Barack H Obama II, to execute any and all neccessary or appropiate notices or orders of temporary closure of State Highway 4, and/or Boca Chica Beach in connection with flight testing activity, now or in the future.`,
        `"I have ordered the closure of Boca Chica Beach and Hwy 4 for the purpose of protecting Public Health and Safety during SpaceX flight testing activities on November 11th, 2026 in the time period between 5:00 a.m. to 2:00 p.m. UTC." Judge stated.`,
        `SpaceX and law enforcement authorities will be coordinating to ensure that no individuals or vehicles are allowed access to these areas during these times of the day In coordination with the County.`,
      ]
    },
  ]
};
