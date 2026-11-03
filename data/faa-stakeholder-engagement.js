/*
 * FAA Stakeholder Engagement — modular page content
 * Set published to true to show the blocks below.
 * Set published to false to show the original "No stakeholder engagement information has been published." message.
 * The main Stakeholder Engagement heading and blue horizontal rule always stay visible.
 *
 * Use type: 'heading' | 'paragraph' | 'link' | 'button' | 'divider'.
 * All text uses the SAME Open Sans font as the existing FAA pages.
 * Optional per-block style: color (TEXT), fontSize (pixels), bold, italic, underline (true/false).
 * Optional spacing on ANY block: spacingBefore and spacingAfter (0–500 px).
 * These control the gap above/below ONLY that block, including links, buttons,
 * headings, paragraphs, and dividers. Both are optional; omitting them keeps
 * the existing spacing. Spacing between adjacent blocks is additive.
 * Example: spacingBefore: 10, spacingAfter: 30,
 * Buttons additionally support backgroundColor (BUTTON BACKGROUND).
 * bold/italic/underline work identically on headings, paragraphs, links and buttons.
 * Links and buttons need a url, e.g. "faa-licenses.html" or "https://example.org".
 * Use backticks for text spanning multiple lines or paragraphs.
 * 
 *  {
 *  type: 'paragraph',
      text: 'Example highlighted notice — edit or remove this block.',
      color: '#a12a2a',
      fontSize: 14,
      bold: true,
      italic: false,
      underline: false
    },
    {
      type: 'link',
      text: 'View FAA Licenses',
      url: 'faa-licenses.html',
      bold: false,
      italic: false,
      underline: true
    },
    {
      // Opens the independent environmental project page, not the main directory.
      type: 'link',
      text: 'View Ground Testing Environmental Review Project',
      url: 'faa-environmental-project-001.html',
      color: '#0964ac',
      fontSize: 14,
      bold: false,
      italic: false,
      underline: true
    },
    {
      type: 'button',
      text: 'Open FAA Licenses',
      url: 'faa-licenses.html',
      backgroundColor: '#00457d', // Current button blue / FAA navy; change independently per button.
      color: '#ffffff',            // Button text color (optional).
      bold: true,
      italic: false,
      underline: false
      Optional: spacingBefore: 10, spacingAfter: 30
    }
 *
 * COLOR REFERENCES — copy/paste these into any block as needed:
 *   Existing blue button background:  #00457d
 *   FAA header navy blue:           #00457d
 *   White button text:              #ffffff
 *   Example: backgroundColor: '#00457d', color: '#ffffff'
 * Only the block containing the color property is changed.
 */
window.faaModularPageConfig = {
  published: true,

  blocks: [
    {
      type: 'paragraph',
      text: `SpaceX proposes to conduct Starship operations from the Boca Chica Launch Site in Cameron County, Texas. SpaceX must apply for and obtain an experimental permit(s) and/or a vehicle operator license from the Office of Commercial Space Transportation to operate the Starship launch vehicle. The FAA's evaluation of a permit or license application includes a review of publi safety issues.`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'heading',
      text: `Environmental Documents in Progress and Completed`,
      fontSize: 30,
      color: '#253B51',
      bold: true,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `In Progress: Scoping Period, Notice of Intent to Prepare a Programmatic Environmental Assessment for proposed SpaceX Starship operations at the Boca Chica Launch Site.`,
      fontSize: 16,
      color: '#253B51',
      bold: true,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `The FAA is announcing its intent to prepare a programmatic Environmental Assessment, open a public scoping period and hold public scoping meetings for SpaceX's proposal to conduct operations regarding the Starship launch vehicle at the Boca Chica Launch Site.`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `The Proposed Action would be implemented in two phases:`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `     • Phase 1 would include ground operations of the Starship launch vehicle in preparation for future flight operations. Operations could occur at any ㅤㅤ date or time of the week.`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `     • Phase 2 would include flight testing operations of the Starship launch vehicle. Operations could occur at any date or time of the week.`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `The FAA will hold one public scoping virtual meeting:`,
      fontSize: 16,
      color: '#253B51',
      bold: true,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `     • Friday, November 6th, 2026; one virtual meeting with comments available on Discord throughout the entire day`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `At the virtual meeting, FAA will provide on Discord a preliminary presentation into the proccesses. Attendees can provide comments in Private Messages afterwards.`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `In progress: Environmental Assessment for SpaceX Starship operations at Boca Chica, Texas`,
      fontSize: 16,
      color: '#253B51',
      bold: true,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `The relevant links of this Environmental Assessment can be found below:`,
      fontSize: 16,
      color: '#253B51',
      bold: false,
      italic: false,
      underline: false
    },
    {
      type: 'link',
      text: '     • Starship Launch Vehicle Operations Project',
      url: 'faa-environmental-project-001.html',
      color: '#00457d',
      fontSize: 16,
      bold: false,
      italic: false,
      underline: false
    },
  ]
};
