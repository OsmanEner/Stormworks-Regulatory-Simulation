/* FCC individual license/application detail, one JS file per call sign. */
(() => {
  'use strict';
  const documentNode = document.getElementById('fcc-application-document');
  if (!documentNode) return;

  // The call sign comes from the table entry and names the file.
  const callSign = (new URLSearchParams(window.location.search).get('callSign') || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]+$/.test(callSign) || callSign === '-') return;

  const file = document.createElement('script');
  file.src = '../data/fcc-applications/' + encodeURIComponent(callSign) + '.js';
  file.onload = () => {
    file.remove();
    const data = window.fccApplication;
    if (!data || typeof data !== 'object') return;
    const tableRecords = typeof fccLicenseData !== 'undefined' && Array.isArray(fccLicenseData.records)
      ? fccLicenseData.records : [];
    const tableRow = tableRecords.find(row => String(row.callSign || '').trim().toUpperCase() === callSign) || {};
    // Common table fields automatically carry through unless overwritten here.
    const asText = key => (typeof data[key] === 'string' && data[key].trim())
      ? data[key] : (typeof tableRow[key] === 'string' ? tableRow[key] : '');
    const fieldIds = {
      fileNumber: 'fcc-detail-file-number', licensee: 'fcc-detail-licensee',
      frn: 'fcc-detail-frn', type: 'fcc-detail-type', status: 'fcc-detail-status',
      classOfStation: 'fcc-detail-class-of-station',
      effectiveDate: 'fcc-detail-effective-date'
    };
    document.getElementById('fcc-detail-call-sign').textContent = callSign;
    for (const [key, id] of Object.entries(fieldIds)) {
      const el = document.getElementById(id);
      // Show every field, including those not yet filled in.
      el.textContent = asText(key).trim() || '—';
    }
    // These are freeform, multiline responses; preserve all line breaks and blank lines.
    const multilineFields = {
      explanation: 'fcc-detail-explanation',
      purposeOfOperation: 'fcc-detail-purpose-of-operation'
    };
    for (const [key, id] of Object.entries(multilineFields)) {
      // Existing applications that used `purpose` will also work without migration.
      const value = key === 'purposeOfOperation'
        ? (asText('purposeOfOperation').trim() ? asText('purposeOfOperation') : asText('purpose'))
        : asText(key);
      const text = value.replace(/\r\n?/g, '\n');
      document.getElementById(id).textContent = text.trim() ? text : '—';
    }
    // Old application JS files may still use grantDate/expirationDate: fall back to
    // those values so already-published application data is not lost.
    const periodDates = [
      ['operationStartDate', 'grantDate', 'fcc-detail-operation-start-date'],
      ['operationEndDate', 'expirationDate', 'fcc-detail-operation-end-date']
    ];
    for (const [key, previousKey, id] of periodDates) {
      document.getElementById(id).textContent =
        (asText(key).trim() || asText(previousKey).trim() || '—');
    }
    // Editable transmitting equipment list. Keep the heading and four columns
    // visible even before any equipment rows have been added to the JS file.
    const manufacturerBody = document.getElementById('fcc-detail-manufacturers');
    if (manufacturerBody) {
      manufacturerBody.replaceChildren();
      const items = Array.isArray(data.manufacturers) ? data.manufacturers : [];
      const rows = items.length ? items : [{}];
      for (const item of rows) {
        const row = document.createElement('tr');
        for (const key of ['manufacturer', 'modelNumber', 'numberOfUnits', 'experimental']) {
          const cell = document.createElement('td');
          const value = item && item[key] !== undefined && item[key] !== null
            ? String(item[key]).trim() : '';
          cell.textContent = value || '—';
          row.appendChild(cell);
        }
        manufacturerBody.appendChild(row);
      }
    }
    // Each station location is one object in the application's stationLocations array.
    // Include Action / Frequency / Station Class rows, but no transmitter/ERP columns.
    const stationList = document.getElementById('fcc-detail-station-locations');
    if (stationList) {
      stationList.replaceChildren();
      const locations = Array.isArray(data.stationLocations) ? data.stationLocations : [];
      for (const station of locations.length ? locations : [{}]) {
        const entry = document.createElement('div');
        entry.className = 'fcc-station-entry';
        const basicScroll = document.createElement('div');
        basicScroll.className = 'fcc-station-basics-scroll';
        const basics = document.createElement('table');
        basics.className = 'fcc-station-basics';
        const thead = document.createElement('thead');
        const headingRow = document.createElement('tr');
        const tbody = document.createElement('tbody');
        const valueRow = document.createElement('tr');
        const value = key => station && station[key] !== undefined && station[key] !== null
          ? String(station[key]).trim() || '—' : '—';
        for (const [key, label] of [
          ['city', 'City'], ['state', 'State'], ['latitude', 'Latitude'],
          ['longitude', 'Longitude'], ['mobile', 'Mobile'],
          ['radiusOfOperation', 'Radius of Operation']
        ]) {
          const head = document.createElement('th');
          head.scope = 'col';
          head.textContent = label;
          headingRow.appendChild(head);
          const cell = document.createElement('td');
          cell.textContent = value(key);
          valueRow.appendChild(cell);
        }
        thead.appendChild(headingRow);
        tbody.appendChild(valueRow);
        basics.append(thead, tbody);
        basicScroll.appendChild(basics);
        entry.appendChild(basicScroll);
        const facts = document.createElement('dl');
        facts.className = 'fcc-station-facts';
        for (const [key, label] of [
          ['datum', 'Datum:'],
          ['directionalAntenna', 'Is a directional antenna (other than radar) used?'],
          ['exhibitSubmitted', 'Exhibit submitted:'],
          ['beamWidthDegrees', '(a) Width of beam in degrees at the half-power point:'],
          ['horizontalOrientation', '(b) Orientation in horizontal plane:'],
          ['verticalOrientation', '(c) Orientation in vertical plane:'],
          ['exceedsSixMeters', 'Will the antenna extend more than 6 meters above the ground, or if mounted on an existing building, will it extend more than 6 meters above the building, or will the proposed antenna be mounted on an existing structure other than a building?'],
          ['antennaHeightMeters', '(a) Overall height above ground to tip of antenna in meters:'],
          ['groundElevationMeters', '(b) Elevation of ground at antenna site above mean sea level in meters:'],
          ['nearestAircraftLandingAreaKm', '(c) Distance to nearest aircraft landing area in kilometers:'],
          ['shieldingStructures', '(d) List any natural formations or existing man-made structures (hills, trees, water tanks, towers, etc.) which, in the opinion of the applicant, would tend to shield the antenna from aircraft:']
        ]) {
          const row = document.createElement('div');
          const term = document.createElement('dt');
          term.textContent = label;
          const definition = document.createElement('dd');
          definition.textContent = value(key);
          row.append(term, definition);
          facts.appendChild(row);
        }
        entry.appendChild(facts);
        // An independent, repeatable list for each station location. Only the
        // three columns outside the reference image's black rectangle are used.
        const frequencyScroll = document.createElement('div');
        frequencyScroll.className = 'fcc-station-frequencies-scroll';
        const frequencyTable = document.createElement('table');
        frequencyTable.className = 'fcc-station-frequency-table';
        frequencyTable.setAttribute('aria-label', 'Station action, frequency and class');
        const frequencyHead = document.createElement('thead');
        const frequencyHeading = document.createElement('tr');
        for (const label of ['Action', 'Frequency', 'Station Class']) {
          const th = document.createElement('th');
          th.scope = 'col';
          th.textContent = label;
          frequencyHeading.appendChild(th);
        }
        frequencyHead.appendChild(frequencyHeading);
        const frequencyBody = document.createElement('tbody');
        const rows = station && Array.isArray(station.frequencyEntries) && station.frequencyEntries.length
          ? station.frequencyEntries : [{}];
        for (const frequencyEntry of rows) {
          const tr = document.createElement('tr');
          for (const key of ['action', 'frequency', 'stationClass']) {
            const td = document.createElement('td');
            const raw = frequencyEntry && frequencyEntry[key] != null
              ? String(frequencyEntry[key]).trim() : '';
            td.textContent = raw || '—';
            tr.appendChild(td);
          }
          frequencyBody.appendChild(tr);
        }
        frequencyTable.append(frequencyHead, frequencyBody);
        frequencyScroll.appendChild(frequencyTable);
        entry.appendChild(frequencyScroll);
        stationList.appendChild(entry);
      }
    }
    const title = asText('title').trim() || 'FCC License / Application Details';
    document.getElementById('fcc-application-title-text').textContent = title;
    document.title = title + ' — ' + callSign + ' | FCC (Simulation)';
    documentNode.hidden = false;
    const downloadLink = document.getElementById('fcc-application-download');
    if (downloadLink) downloadLink.hidden = false;
  };
  file.onerror = () => { file.remove(); };
  document.head.appendChild(file);
})();
