/*
  FAA COMMERCIAL SPACE TRANSPORTATION — MODULAR DATABASE (STORMWORKS SIMULATION)
  -----------------------------------------------------------------------------
  All three tables in pages/faa-licenses.html are populated from this file.
  Add/remove an object within the corresponding array; no HTML edits needed.

  licensedLaunches: actual launches performed; these are informational rows only,
      and the Date field is NOT a PDF link.
  launchLicenses: active or historical launch licenses with optional PDF links.
  reentryLicenses: reentry authorizations with optional PDF links.

  PDF links are relative to pages/faa-licenses.html, NOT relative to this JS file.
  Example local PDF:  ../assets/pdfs/faa/VOL-SW-2026-001.pdf
  Example remote PDF: https://example.org/sample-license.pdf
  Leave pdf: '' to show a plain license number with no link.

  lastUpdatedUTC is an editable timestamp for the registry, while the orange
  clock on the page always displays the viewer's current UTC+0 time.
  All active records below are FICTIONAL SAMPLE DATA; replace or delete freely.
*/
const faaLicenseRegistry = {
  lastUpdatedUTC: '2026-11-03T23:27:00Z',

/*
  licensedLaunches: [
    {
      date: '2026-10-28',
      company: 'Stormworks Aerospace Program',
      launchVehicle: 'Starship Prototype',
      payload: '150 m Flight Test',
      humanSpaceFlight: 'N',
      launchSite: 'Starbase Simulation Facility',
      stateLocation: 'Texas'
    },
    {
      date: '2026-10-14',
      company: 'Stormworks Aerospace Program',
      launchVehicle: 'Starship Prototype',
      payload: 'Low-Altitude Test',
      humanSpaceFlight: 'N',
      launchSite: 'Starbase Simulation Facility',
      stateLocation: 'Texas'
    }
  ],

  launchLicenses: [
    {
      licenseNumber: 'VOL-SW-2026-001 (Rev 1)',
      company: 'Stormworks Aerospace Program',
      vehicle: 'Starship Prototype',
      launchSite: 'Starbase Simulation Facility',
      stateLocation: 'Texas',
      expirationDate: '2028-10-30',
      pdf: '../assets/pdfs/faa/VOL-SW-2026-001.pdf'
    }
  ],

  reentryLicenses: [
    {
      licenseNumber: 'REV-SW-2026-001',
      company: 'Stormworks Aerospace Program',
      vehicle: 'Starship Prototype',
      reentrySiteLocation: 'Gulf of Mexico Simulation Zone',
      expirationDate: '2028-10-30',
      pdf: '../assets/pdfs/faa/REV-SW-2026-001.pdf'
    }
*/
};
