/* FCC license list, filtered/sorted entirely from data/fcc-license-records.js. */
(() => {
  'use strict';
  const body = document.getElementById('fcc-rows');
  if (!body) return;
  const source = typeof fccLicenseData !== 'undefined' ? fccLicenseData : { records: [], asOfUTC: '—' };
  const records = Array.isArray(source.records) ? source.records : [];
  const $ = id => document.getElementById(id);
  $('fcc-as-of').textContent = source.asOfUTC || '—';
  const filters = {
    licensee: $('fcc-licensee'),
    type: $('fcc-type'),
    state: $('fcc-state'),
    status: $('fcc-status'),
    query: $('fcc-query')
  };
  let sortKey = 'fileNumber';
  let sortDir = 1;
  const val = (record, key) => String(record[key] ?? '');
  const lower = value => String(value).trim().toLowerCase();

  function visibleRecords() {
    const licensee = lower(filters.licensee.value);
    const q = lower(filters.query.value);
    return records.filter(record => {
      if (licensee && !lower(record.licensee).includes(licensee)) return false;
      // Texas is the only permitted state on this simulation's FCC page.
      if (lower(record.state) !== 'tx') return false;
      for (const key of ['type', 'status']) {
        if (filters[key].value && lower(record[key]) !== lower(filters[key].value)) return false;
      }
      if (q && !['fileNumber', 'callSign', 'licensee', 'state', 'type', 'status']
          .some(key => lower(val(record, key)).includes(q))) return false;
      return true;
    }).sort((a, b) => sortDir * val(a, sortKey).localeCompare(val(b, sortKey), undefined, {numeric: true}));
  }

  function cell(row, content, className) {
    const td = document.createElement('td');
    if (className) td.className = className;
    if (content instanceof Node) td.appendChild(content);
    else td.textContent = content == null ? '' : String(content);
    row.appendChild(td);
    return td;
  }

  function render() {
    const shown = visibleRecords();
    $('fcc-total').textContent = shown.length;
    body.replaceChildren();
    for (const r of shown) {
      const tr = document.createElement('tr');
      // A published call sign is the filename of the separate detail JS.
      // The file number is the blue link; it opens ONLY when that JS exists.
      const callSign = val(r, 'callSign').trim().toUpperCase();
      const canLookUp = /^[A-Z0-9-]+$/.test(callSign) && callSign !== '-';
      const file = document.createElement(canLookUp ? 'a' : 'span');
      file.textContent = val(r, 'fileNumber');
      file.className = canLookUp ? 'fcc-file-link' : 'fcc-file-text';
      if (canLookUp) {
        file.href = 'fcc-license.html?callSign=' + encodeURIComponent(callSign);
        file.setAttribute('aria-label', 'Open license or application ' + val(r, 'fileNumber'));
        file.addEventListener('click', event => {
          event.preventDefault();
          // The portal is hosted as static files; no backend/index is needed.
          // Probe for the per-callsign JS on click, like the ATCSCC webinars.
          // Missing files have no visual effect and never navigate.
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const check = document.createElement('script');
          check.src = '../data/fcc-applications/' + encodeURIComponent(callSign) + '.js';
          check.onload = () => { check.remove(); window.location.assign(file.href); };
          check.onerror = () => { check.remove(); };
          document.head.appendChild(check);
        });
      }
      cell(tr, file, 'fcc-file-cell');
      cell(tr, val(r, 'callSign'));
      cell(tr, val(r, 'licensee'));
      cell(tr, val(r, 'state'));
      cell(tr, val(r, 'type'));
      cell(tr, val(r, 'status'));
      const icon = document.createElement('span');
      icon.className = 'fcc-details-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<i class="fa-regular fa-rectangle-list"></i>';
      cell(tr, icon, 'fcc-details-cell');
      body.appendChild(tr);
    }
  }

  Object.values(filters).forEach(control => control.addEventListener('input', render));
  Object.values(filters).forEach(control => control.addEventListener('change', render));
  document.querySelectorAll('.fcc-table th[data-sort] button').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.closest('th').dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = 1; }
      render();
    });
  });

  function saveFile(extension, mime, contents) {
    const url = URL.createObjectURL(new Blob([contents], {type: mime}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fcc-license-list.' + extension;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  const escapeXml = value => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  $('fcc-json').addEventListener('click', event => {
    event.preventDefault();
    saveFile('json', 'application/json', JSON.stringify(visibleRecords(), null, 2));
  });
  $('fcc-xml').addEventListener('click', event => {
    event.preventDefault();
    const fields = ['fileNumber', 'callSign', 'licensee', 'state', 'type', 'status'];
    const rows = visibleRecords().map(r =>
      '  <license>\n' + fields.map(k => '    <' + k + '>' + escapeXml(r[k]) + '</' + k + '>').join('\n') + '\n  </license>');
    saveFile('xml', 'application/xml', '<?xml version="1.0" encoding="UTF-8"?>\n<licenses>\n' + rows.join('\n') + '\n</licenses>\n');
  });

  render();
})();
