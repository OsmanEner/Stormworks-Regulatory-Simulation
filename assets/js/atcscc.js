/* NASS / ATCSCC Operations Plan table — static GitHub Pages data only. */
(() => {
  'use strict';
  const rows = document.getElementById('atcscc-rows');
  if (!rows) return;

  const dateNode = document.getElementById('atcscc-next-table');
  const header = document.getElementById('atcscc-table-title');
  const notices = typeof atcsccAdvisories !== 'undefined' && Array.isArray(atcsccAdvisories)
    ? atcsccAdvisories : [];

  // Use the one date variable in atcscc-records.js; never depend on the viewer's timezone.
  const nextDate = typeof nextWebinarTable === 'string' ? new Date(nextWebinarTable) : new Date(NaN);
  const formatDate = date => new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  }).format(date);
  const pad = value => String(value).padStart(2, '0');

  // Blue table heading is now independently editable in atcscc-records.js.
  header.textContent = (typeof atcsccTableTitle === 'string' && atcsccTableTitle.trim())
    ? atcsccTableTitle : 'ATCSCC OPERATIONS PLANS';

  if (!Number.isNaN(nextDate.getTime())) {
    dateNode.textContent = 'NEXT WEBINAR TABLE: ' + formatDate(nextDate) +
      ' AT ' + pad(nextDate.getUTCHours()) + ':' + pad(nextDate.getUTCMinutes()) + ' UTC';
  } else {
    dateNode.textContent = 'NEXT WEBINAR TABLE: TO BE ANNOUNCED';
  }

  function sentAt(record) {
    // MM/DD/YY or MM/DD/YYYY, plus HH:MM UTC.
    const date = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\s*$/.exec(String(record.date || ''));
    const time = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(String(record.sendTime || ''));
    if (!date || !time) return -Infinity;
    const year = +date[3] < 100 ? 2000 + (+date[3]) : +date[3];
    const month = +date[1], day = +date[2], hour = +time[1], minute = +time[2];
    const utc = Date.UTC(year, month - 1, day, hour, minute);
    const validated = new Date(utc);
    if (validated.getUTCFullYear() !== year || validated.getUTCMonth() !== month - 1 ||
        validated.getUTCDate() !== day || validated.getUTCHours() !== hour ||
        validated.getUTCMinutes() !== minute) return -Infinity;
    return utc;
  }

  function textCell(row, text, extraClass) {
    const td = document.createElement('td');
    if (extraClass) td.className = extraClass;
    td.textContent = text == null ? '' : String(text);
    row.appendChild(td);
    return td;
  }

  rows.replaceChildren();
  const sorted = notices.slice().sort((a,b) => sentAt(b) - sentAt(a) ||
    String(b.number || '').localeCompare(String(a.number || ''), 'en', {numeric:true}));
  if (sorted.length === 0) {
    const tr = document.createElement('tr');
    const td = textCell(tr, 'No Operations Plans have been published.', 'atcscc-empty');
    td.colSpan = 5;
    rows.appendChild(tr);
    return;
  }

  for (const item of sorted) {
    const tr = document.createElement('tr');
    const number = textCell(tr, '', 'atcscc-number');
    const numberLink = document.createElement('a');
    numberLink.className = 'atcscc-number-link';
    numberLink.textContent = item.number == null ? '' : String(item.number);
    numberLink.href = 'atcscc-webinar.html?id=' + encodeURIComponent(String(item.number || ''));
    numberLink.title = 'Operations Plan ' + (item.number || '');
    numberLink.addEventListener('click', event => {
      event.preventDefault();
      // GitHub Pages is static: look for a corresponding JS file when clicked.
      // If it isn't there, the click has NO visible effect (no popup/message).
      const id = String(item.number || '');
      if (!/^\d{3,}$/.test(id)) return;
      const check = document.createElement('script');
      check.src = '../data/atcscc-webinars/' + encodeURIComponent(id) + '.js';
      check.onload = () => {
        check.remove();
        window.location.assign(numberLink.href);
      };
      check.onerror = () => { check.remove(); };
      document.head.appendChild(check);
    });
    number.appendChild(numberLink);
    textCell(tr, item.controlElement);
    textCell(tr, item.date);
    textCell(tr, 'OPERATIONS PLAN');
    const send = document.createElement('td');
    send.className = 'atcscc-send';
    const d = document.createElement('span');
    d.textContent = item.date || '';
    const t = document.createElement('span');
    t.textContent = item.sendTime || '';
    send.append(d,t);
    tr.appendChild(send);
    rows.appendChild(tr);
  }
})();
