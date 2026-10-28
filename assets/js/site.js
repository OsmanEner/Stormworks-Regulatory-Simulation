/* Basic table and document-link display. No admin panel or online database. */
(() => {
  if (!document.getElementById('closure-rows')) return;

  const addCell = (row, value) => {
    const cell = document.createElement('td');
    cell.textContent = value;
    row.appendChild(cell);
  };

  function populateTable(targetId, records, fields, emptyText) {
    const tbody = document.getElementById(targetId);
    tbody.replaceChildren();
    if (!records.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = fields.length;
      cell.className = 'no-notices';
      cell.textContent = emptyText;
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }
    records.forEach(record => {
      const row = document.createElement('tr');
      fields.forEach(field => addCell(row, record[field] || '—'));
      tbody.appendChild(row);
    });
  }

  populateTable('closure-rows', countyRecords.closures, ['type', 'date', 'time', 'status'], 'No closures listed.');
  populateTable('delay-rows', countyRecords.delays, ['type', 'date', 'time'], 'No road delays listed.');

  const search = document.getElementById('county-search');
  if (search) {
    search.addEventListener('input', () => {
      const term = search.value.trim().toLowerCase();
      document.querySelectorAll('#order-links p').forEach(p => {
        p.hidden = !p.textContent.toLowerCase().includes(term);
      });
    });
  }

  const container = document.getElementById('order-links');
  container.replaceChildren();
  if (!countyRecords.orders.length) {
    container.textContent = 'No county orders published.';
  } else {
    countyRecords.orders.forEach(order => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = 'order.html?id=' + encodeURIComponent(order.id);
      a.textContent = order.title || ((order.type === 'delay' ? 'TEMPORARY AND INTERMITTENT ROAD DELAY' : 'TEMPORARY CLOSURE OF BOCA CHICA BEACH AND STATE HIGHWAY 4') + ' — ' + order.date.toUpperCase());
      p.appendChild(a);
      container.appendChild(p);
    });
  }
})();
