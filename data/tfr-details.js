/*
  FAA AIR TRAFFIC — FULL TFR DETAILS (EDIT THIS FILE IN VS CODE)
  ============================================================== 
  No detailed TFR pages are currently published.

  HOW TO ADD A DETAIL PAGE:
  1. Copy the commented block below, including the NOTAM key.
  2. Remove the two block-comment marker lines around the example.
  3. Edit the fields and save. The key (example: '6/9001') MUST
     exactly match the notam field in data/tfr-records.js.

  All section titles, standard restrictions, ARTCC, and authority
  are fixed in the template; only these data fields are editable.
  For text with apostrophes, use backticks (`...`).
*/
const tfrDetails = {
  // =========== COPY/PASTE FULL TFR DETAIL EXAMPLE ===========

  '11/9001': {
    issueDate: 'Tuesday 3, 2026 at 23:33 UTC',
    location: 'BOCA CHICA, Texas near BROWNSVILLE, TX',
    beginning: 'Monday 9, 2026 at 0001 UTC',
    ending: 'Monday 9, 2026 at 2355 UTC',
    reason: 'Starship Engine Static Fire',
    type: 'Space Operations',

    center: `Near Boca Chica, Texas`,
    radius: '8 nautical miles',
    altitude: 'From the surface up to and including 13000 feet MSL',

    effectiveFrom: 'Monday 9, 2026 at 0001 UTC',
    effectiveTo: 'Monday 9, 2026 at 2355 UTC',

    pointOfContact: 'Stormworks SpaceX',
    contactTelephone: '+1 202-555-0147'
  },
};
