/* ATCSCC webinar details: reads data/atcscc-webinars/<NUMBER>.js */
(() => {
  'use strict';
  const container = document.getElementById('atcscc-webinar-document');
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get('id') || '';
  if (!/^\d{3,}$/.test(id)) return;

  const file = document.createElement('script');
  file.src = '../data/atcscc-webinars/' + encodeURIComponent(id) + '.js';
  file.onload = () => {
    file.remove();
    const data = window.atcsccWebinar;
    if (!data || typeof data !== 'object') return;
    const asString = key => typeof data[key] === 'string' ? data[key] : '';
    // Backtick multiline text often inherits VS Code's automatic indentation.
    // Strip only an indentation margin common to ALL nonblank continuation lines,
    // preserving extra spaces for aligned FAA-style data columns and blank lines.
    const advisoryText = key => {
      const raw = asString(key).replace(/\r\n?/g, '\n');
      const lines = raw.split('\n');
      const nonblankContinuation = lines.slice(1).filter(line => line.trim());
      if (!nonblankContinuation.length) return raw;
      const commonIndent = Math.min(...nonblankContinuation.map(line => (line.match(/^[ \t]*/) || [''])[0].length));
      if (!commonIndent) return raw;
      return lines.map((line, i) => i > 0 && line.trim() ? line.slice(commonIndent) : line).join('\n');
    };
    const set = (nodeId, text) => {
      const element = document.getElementById(nodeId);
      if (element) element.textContent = text;
    };
    set('atcscc-webinar-header-title', asString('headerTitle') || 'ATCSCC Advisory');
    set('atcscc-webinar-title', asString('title'));
    set('atcscc-webinar-event-time', asString('eventTime'));
    set('atcscc-webinar-description', advisoryText('description'));
    set('atcscc-webinar-operations', advisoryText('operations'));
    set('atcscc-webinar-next-time', asString('nextPlanningWebinar'));
    set('atcscc-webinar-next-text', advisoryText('nextPlanningText'));
    container.hidden = false;
    document.title = (asString('title') || 'ATCSCC Advisory ' + id) + ' | NASS';
  };
  file.onerror = () => { file.remove(); };
  document.head.appendChild(file);
})();
