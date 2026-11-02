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
 * COLOR REFERENCES — copy/paste these into any block as needed:
 *   Existing blue button background:  #00457d
 *   FAA header navy blue:           #00457d
 *   White button text:              #ffffff
 *   Example: backgroundColor: '#00457d', color: '#ffffff'
 * Only the block containing the color property is changed.
 */
window.faaModularPageConfig = {
  published: false,

  blocks: [
    {
      type: 'heading',
      text: 'Stakeholder Engagement Updates',
      fontSize: 19,
      color: '#253b51',
      bold: true,
      italic: false,
      underline: false
    },
    {
      type: 'paragraph',
      text: `Public engagement updates for the simulated commercial space program will be posted here.

This is a second paragraph. You can add as many lines and blank lines as needed.`,
      fontSize: 14,
      color: '#34404d',
      bold: false,
      italic: false,
      underline: false
      // Optional: spacingBefore: 10, spacingAfter: 30
    },
    {
      type: 'paragraph',
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
    }
  ]
};
