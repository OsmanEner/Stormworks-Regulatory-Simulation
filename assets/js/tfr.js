/* FAA TFR table. No online editor or back end — records come from tfr-records.js. */
(() => {
  'use strict';
  const tbody = document.getElementById('tfr-rows');
  if (!tbody) return;
  const data = typeof tfrData !== 'undefined' ? tfrData : {asOfUTC:'—', records:[]};
  const details = typeof tfrDetails !== 'undefined' ? tfrDetails : {};
  const records = Array.isArray(data.records) ? data.records : [];
  const typeSelect = document.getElementById('tfr-type');
  const search = document.getElementById('tfr-search');
  const total = document.getElementById('tfr-total');
  document.getElementById('tfr-as-of').textContent = data.asOfUTC || '—';
  let sortField = 'date';
  let sortDirection = -1;

  function visibleRecords() {
    const needle = search.value.trim().toLowerCase();
    const selectedType = typeSelect.value;
    return records.filter(record => {
      if (String(record.facility).toUpperCase() !== 'ZHU') return false;
      if (String(record.state).toUpperCase() !== 'TX') return false;
      if (selectedType && record.type !== selectedType) return false;
      return !needle || ['date','notam','facility','state','type','description']
        .some(key => String(record[key] || '').toLowerCase().includes(needle));
    }).sort((a,b) => {
      const aa = sortField === 'date' ? Date.parse(a.date) : String(a[sortField] || '').toLowerCase();
      const bb = sortField === 'date' ? Date.parse(b.date) : String(b[sortField] || '').toLowerCase();
      if (aa < bb) return -sortDirection;
      if (aa > bb) return sortDirection;
      return 0;
    });
  }

  function cell(row, text, extraClass) {
    const td = document.createElement('td');
    td.textContent = text == null ? '' : String(text);
    if (extraClass) td.className = extraClass;
    row.appendChild(td);
    return td;
  }
  function render() {
    const filtered = visibleRecords();
    total.textContent = filtered.length;
    tbody.replaceChildren();
    filtered.forEach(record => {
      const row = document.createElement('tr');
      cell(row, record.date);
      // The blue NOTAM number is the ONLY route to its matching detail page.
      // Keep unmatched numbers blue but inert (no link, click handler or message).
      const notamCell = cell(row, '', 'tfr-notam');
      const hasDetails = Object.prototype.hasOwnProperty.call(details, record.notam);
      const notamText = document.createElement(hasDetails ? 'a' : 'span');
      notamText.className = hasDetails ? 'tfr-notam-link' : 'tfr-notam-text';
      notamText.textContent = record.notam == null ? '' : String(record.notam);
      if (hasDetails) {
        notamText.href = 'tfr-notice.html?notam=' + encodeURIComponent(record.notam);
        notamText.setAttribute('aria-label', 'Open TFR NOTAM ' + record.notam);
      }
      notamCell.appendChild(notamText);
      cell(row, record.facility);
      cell(row, record.state);
      cell(row, record.type);
      cell(row, record.description, 'tfr-description');
      // FAA-style list + magnifier icons are purely decorative, never clickable.
      const zoomCell = document.createElement('td');
      zoomCell.className = 'tfr-zoom-cell';
      const icons = document.createElement('span');
      icons.className = 'tfr-zoom-icons';
      icons.setAttribute('aria-hidden', 'true');
      icons.innerHTML = '<i class="fa-regular fa-rectangle-list"></i><i class="fa-solid fa-magnifying-glass"></i>';
      zoomCell.appendChild(icons);
      row.appendChild(zoomCell);
      tbody.appendChild(row);
    });
  }

  typeSelect.addEventListener('change', render);
  search.addEventListener('input', render);
  document.querySelectorAll('.tfr-table th[data-sort] button').forEach(button => {
    button.addEventListener('click', () => {
      const field = button.closest('th').dataset.sort;
      if (field === sortField) sortDirection *= -1;
      else { sortField = field; sortDirection = 1; }
      render();
    });
  });

  // Download currently visible records in JSON / XML, from this local file.
  function download(ext, mime, content) {
    const blob = new Blob([content], {type:mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tfr-list.' + ext;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  const xmlEscape = text => String(text == null ? '' : text)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  document.getElementById('tfr-json').addEventListener('click', event => {
    event.preventDefault();
    download('json', 'application/json', JSON.stringify(visibleRecords(), null, 2));
  });
  document.getElementById('tfr-xml').addEventListener('click', event => {
    event.preventDefault();
    const fields = ['date','notam','facility','state','type','description'];
    const lines = visibleRecords().map(r => '  <tfr>\n' + fields.map(k => '    <' + k + '>' + xmlEscape(r[k]) + '</' + k + '>').join('\n') + '\n  </tfr>');
    download('xml', 'application/xml', '<?xml version="1.0" encoding="UTF-8"?>\n<tfrs>\n' + lines.join('\n') + '\n</tfrs>\n');
  });
  render();
})();
