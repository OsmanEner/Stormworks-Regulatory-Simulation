/*
  FCC LICENSE SEARCH — PUBLIC TABLE RECORDS
  -----------------------------------------
  Publish an entry here to add it to the main FCC license search table.

  Individual license/application detail pages are stored separately in:
      data/fcc-applications/<CALLSIGN>.js

  Example: for callSign: 'WB9XCZ', copy TEMPLATE.js to WB9XCZ.js.
  The blue File Number opens that page ONLY if the matching JS file exists.
  Without a matching JS file, clicking the File Number does nothing.

  Available fields:
    fileNumber - application/license number displayed as the blue link
    callSign   - corresponding detail JS filename, without .js; use letters/numbers/-
    licensee   - the organization holding/applying for the license
    state      - TX only; the FCC page remains Texas-only
    type       - Regular, Experimental, STA, Other
    status     - Active, Granted, Pending, Expired, Cancelled

  A ready-to-test WB9XCZ record is published below, with a matching
  data/fcc-applications/WB9XCZ.js application file.
*/
const fccLicenseData = {
  asOfUTC: '—',
  records: [
    /*
    {
      fileNumber: '1234-EX-ST-2026',
      callSign: 'AD8XBY',
      licensee: 'Space Exploration Technologies Corp.',
      state: 'TX',
      type: 'STA',
      status: 'Granted'
    },
    */
  ]
};
