/* Renders the same printable letter template from the modular records.js data. */
(() => {
  const requestedId = new URLSearchParams(window.location.search).get('id');
  const order = countyRecords.orders.find(item => item.id === requestedId);
  const documentEl = document.getElementById('document');
  const setText = (id, value) => {
    document.getElementById(id).textContent = value ?? '';
  };

  if (!order) {
    documentEl.replaceChildren();
    const error = document.createElement('p');
    error.className = 'order-not-found';
    error.textContent = 'Order not found. Please return to the Cameron County notices page.';
    documentEl.appendChild(error);
  } else {
    const isDelay = order.type.toLowerCase() === 'delay';
    documentEl.classList.add(isDelay ? 'order-delay' : 'order-closure');
    const heading = isDelay
      ? 'TEMPORARY AND INTERMITTENT ROAD DELAY OF A PORTION OF STATE HIGHWAY 4'
      : 'COUNTY’S TEMPORARY CLOSURE OF BOCA CHICA BEACH AND STATE HIGHWAY 4';

    setText('doc-judge', countyOrderSettings.judgeName);
    setText('doc-contact', countyOrderSettings.contactName);
    setText('doc-date', order.date);
    setText('doc-heading', heading);

    const paragraphContainer = document.getElementById('doc-paragraphs');
    const expected = isDelay ? 1 : 4;
    const paragraphs = Array.isArray(order.paragraphs) ? order.paragraphs : [];
    paragraphs.slice(0, expected).forEach(value => {
      const paragraph = document.createElement('p');
      paragraph.textContent = value;
      paragraphContainer.appendChild(paragraph);
    });

    if (paragraphs.length !== expected) {
      console.warn('Order ' + order.id + ' (' + order.type + ') should have ' + expected + ' text paragraph(s).');
    }
    document.title = order.title || heading;
  }

  document.getElementById('print-order').addEventListener('click', event => {
    event.preventDefault();
    window.print();
  });
})();
