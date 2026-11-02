/*
 * FAA Environmental Project details — independent page data (SIMULATION ONLY)
 *
 * Create another project WITHOUT editing the shared renderer:
 *  1. Copy pages/faa-environmental-project-001.html to
 *          pages/faa-environmental-project-002.html
 *  2. Copy THIS data file to data/faa-environmental-projects/
 *          faa-environmental-project-002.js
 *  3. Edit that JS file; add a link to the new HTML filename in
 *          data/faa-stakeholder-engagement.js (published: true to show it).
 *
 * HTML basename and JS basename must match. Other pages are unaffected.
 * 'descriptionBlocks' supports unlimited individually styled paragraphs, headings,
 * links, buttons (including local PDFs), and dividers; see examples below.
 * PDF files belong in assets/pdfs/faa/environmental-projects/ (filename only).
 * 'relatedProjects' optionally links separate project pages to one another.
 * All examples below are fictional, NOT the real SpaceX environmental review.
 */
window.faaEnvironmentalProject = {
  title: 'Starship Prototype Ground and Flight Test Program — Environmental Review',
  projectWebsite: 'faa-stakeholder-engagement.html',
  projectWebsiteLabel: 'Stakeholder Engagement',
  status: 'IN PROGRESS',
  estimatedCompletionDate: 'To be determined',
  processesCompleted: 0,
  processesTotal: 3,
  sector: 'Aviation',
  category: 'Commercial Space Transportation',
  leadAgency: 'Federal Aviation Administration (Simulation)',
  // MODULAR DESCRIPTION BLOCKS — exactly like Stakeholder Engagement.
  // Supported types: 'heading', 'paragraph', 'link', 'button', 'divider'.
  // For ANY text/button: fontSize (8-72 px), color, bold, italic, underline.
  // Any block: spacingBefore / spacingAfter (0-500 pixels); omitted = default.
  // Buttons additionally accept backgroundColor (defaults to FAA navy #00457d).
  // Link/button destinations: url: 'other-page.html' or https://...
  // To open a PDF from the environmental-project PDF folder instead, set
  // pdf: 'Your-File.pdf' on a link or button; it opens in a new browser tab.
  // Use backticks for multiline paragraphs and intentional blank lines.
  // COLOR REFERENCES: FAA NAVY #00457d | LINK BLUE #0964ac | WHITE #ffffff.
  descriptionBlocks: [
    {
      type: 'paragraph',
      text: `The proposed action concerns a fictional Starship prototype ground-testing and initial suborbital flight-test program conducted within Stormworks. This page tracks the simulated environmental review and permitting process.`,
      fontSize: 15,
      color: '#213047',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `The proposal may be revised as technical and environmental evaluations progress. All operations, dates, approvals, and project data shown here are for game simulation only.`,
      fontSize: 15,
      color: '#213047',
      bold: false,
      italic: false,
      underline: false
      // Optional: spacingBefore: 10, spacingAfter: 30
    },
    {
      type: 'button',
      text: 'Open Sample Environmental Document (PDF)',
      pdf: 'Environmental-Project-SAMPLE.pdf',
      backgroundColor: '#00457d',
      color: '#ffffff',
      fontSize: 14,
      bold: true,
      italic: false,
      underline: false,
      spacingBefore: 6,
      spacingAfter: 18
    },
    // Example text link to another page:
    // { type: 'link', text: 'Stakeholder Engagement', url: 'faa-stakeholder-engagement.html', underline: true },
    // Example divider: { type: 'divider', spacingBefore: 10, spacingAfter: 12 },
    // Example bold heading: { type: 'heading', text: 'Documents', fontSize: 19, bold: true },
  ],
  // PERMITTING TIMETABLE — EDIT THESE TWO DATES TO SET THE GRAPH SCALE.
  // Dates use YYYY-MM-DD, UTC. Both dates are included in the displayed range.
  // The light-blue TODAY line uses the viewer's real UTC time and updates every minute.
  // Actions can be any number of rows, with their own start/end dates.
  // 'status' controls the SLIDER STYLE: Scheduled, Extension or Delay, Paused, Planned.
  // 'statusText' controls the independently editable RIGHT-HAND STATUS LABEL.
  // Optional 'delayInfo' appears when hovering/focusing a slider (with dates).
  // Omitting statusText displays the same text as status; omitting delayInfo means None reported.
  // All example activities and dates are fictional Stormworks planning data.
  permittingTimetable: {
    startDate: '2026-10-15',  // GRAPH START — CHANGE THIS
    endDate: '2026-11-30',    // GRAPH END — CHANGE THIS
    actions: [
      { title: 'Overall Project Timetable', startDate: '2026-10-18', endDate: '2026-11-25', status: 'Scheduled', statusText: 'In Progress' },
      { title: 'Environmental Assessment', startDate: '2026-10-19', endDate: '2026-11-17', status: 'Scheduled', statusText: 'In Progress' },
      { title: 'Technical Review Extension', startDate: '2026-11-02', endDate: '2026-11-10', status: 'Extension or Delay', statusText: 'Delayed', delayInfo: 'Technical review extension (fictional).' },
      { title: 'Agency Consultation', startDate: '2026-11-08', endDate: '2026-11-19', status: 'Planned' },
      { title: 'Review Hold', startDate: '2026-11-20', endDate: '2026-11-23', status: 'Paused' }
    ]
  },

  // Optional links to other project HTML pages (leave [] for no section).
  relatedProjects: [
    // { text: 'Second project', url: 'faa-environmental-project-002.html' }
  ]
};
