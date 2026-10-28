/*
  FAA AIR TRAFFIC — TFR LIST (EDIT THIS FILE IN VS CODE)
  =======================================================
  No TFRs are currently published.

  HOW TO ADD A TFR:
  1. Copy the example block between { and } into records: [ ... ].
  2. Remove the two block-comment marker lines around the example.
  3. Change the six fields, then save and push to GitHub Pages.

  REQUIRED: date, notam, facility, state, type, description.
  Facility is always ZHU; state is always TX for this portal.
  Supported types: AIR SHOWS/SPORTS, HAZARDS, SECURITY,
  SPACE OPERATIONS, SPECIAL, UAS PUBLIC GATHERING, VIP.

  A blue NOTAM number opens its full TFR page only when an EXACT
  matching NOTAM ID is also published in data/tfr-details.js.
  Without a match, the number is blue but not clickable.
  Use backticks (`...`) around long descriptions.
*/
const tfrData = {
  // Set this to the UTC publication timestamp when you add a TFR.
  asOfUTC: '—',

  records: [
    // ============= COPY/PASTE TFR LIST EXAMPLE =============
    /* REMOVE THESE COMMENT MARKERS TO PUBLISH:
    {
      date: '10/28/2026',
      notam: '6/9001',
      facility: 'ZHU',
      state: 'TX',
      type: 'SPACE OPERATIONS',
      description: `BOCA CHICA, TX, Thursday, October 29, 2026 through Friday, October 30, 2026 UTC`
    },
    */
    // ====================================================
  ]
};
