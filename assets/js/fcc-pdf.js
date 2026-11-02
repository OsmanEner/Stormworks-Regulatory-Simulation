/* Local, dependency-free PDF export for the FCC application detail page only.
   Produces a downloadable, selectable-text, multi-page PDF without a print dialog. */
(() => {
  'use strict';
  const link = document.getElementById('fcc-application-download');
  if (!link) return;

  // PDF standard font encoding is WinAnsi; normalize non-ASCII punctuation.
  function clean(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2013\u2014\u2212]/g, '-')
      .replace(/\u2022/g, '*')
      .replace(/\u00b0/g, ' deg')
      .replace(/\u00a0/g, ' ')
      .replace(/[^\x20-\x7e\n]/g, '?');
  }
  const quote = value => '(' + clean(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)') + ')';
  const byId = id => (document.getElementById(id)?.textContent || '—').trim() || '—';
  const rgb = hex => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b].map(v => v.toFixed(4)).join(' ');
  };
  const encoder = new TextEncoder();
  const toBytes = v => typeof v === 'string' ? encoder.encode(v) : v;

  function createDocument(sealJpeg) {
    const W = 595.28, H = 841.89, M = 42, available = W - M * 2;
    const pages = [];
    const measuring = document.createElement('canvas').getContext('2d');
    let commands, y;
    const textWidth = (text, size, bold) => {
      measuring.font = `${bold ? 700 : 400} ${size}px Arial`;
      return measuring.measureText(clean(text)).width;
    };
    const rect = (x, top, width, height, fill) => commands.push(`${rgb(fill)} rg ${x.toFixed(2)} ${(H - top - height).toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f\n`);
    const stroke = (x, top, width, height, color) => commands.push(`${rgb(color)} RG 0.7 w ${x.toFixed(2)} ${(H - top - height).toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S\n`);
    const rule = (x1, top, x2, color) => commands.push(`${rgb(color)} RG 0.7 w ${x1.toFixed(2)} ${(H - top).toFixed(2)} m ${x2.toFixed(2)} ${(H - top).toFixed(2)} l S\n`);
    const write = (text, x, top, size = 10, bold = false, color = '#26384a') => {
      commands.push(`BT /${bold ? 'FB' : 'FR'} ${size.toFixed(1)} Tf ${rgb(color)} rg 1 0 0 1 ${x.toFixed(2)} ${(H - top).toFixed(2)} Tm ${quote(text)} Tj ET\n`);
    };
    function newPage() {
      commands = [];
      pages.push(commands);
      y = 48;
    }
    function room(h) {
      if (y + h > H - 60) newPage();
    }
    function wrap(line, maxWidth, size, bold) {
      if (!line.trim()) return [''];
      const words = line.split(/(\s+)/).filter(Boolean);
      const lines = [];
      let current = '';
      for (let token of words) {
        // Preserve spacing in regular lines, but don't start wrapped lines with spaces.
        if (!current && /^\s+$/.test(token)) continue;
        while (token && textWidth(token, size, bold) > maxWidth) {
          let splitAt = 1;
          while (splitAt < token.length && textWidth(token.slice(0, splitAt + 1), size, bold) <= maxWidth) splitAt++;
          if (current) { lines.push(current.trimEnd()); current = ''; }
          lines.push(token.slice(0, splitAt));
          token = token.slice(splitAt);
        }
        if (!token) continue;
        if (current && textWidth(current + token, size, bold) > maxWidth) {
          lines.push(current.trimEnd());
          current = token.trimStart();
        } else current += token;
      }
      if (current) lines.push(current.trimEnd());
      return lines.length ? lines : [''];
    }
    function paragraph(text, options = {}) {
      const x = options.x ?? M + 15;
      const width = options.width ?? available - 30;
      const size = options.size ?? 10.5;
      const lh = options.lineHeight ?? 16;
      const bold = options.bold ?? false;
      const color = options.color ?? '#26384a';
      for (const original of String(text || '—').replace(/\r\n?/g, '\n').split('\n')) {
        for (const line of wrap(original, width, size, bold)) {
          room(lh);
          if (line) write(line, x, y + size, size, bold, color);
          y += lh;
        }
      }
    }
    function section(title) {
      room(63);
      rect(M, y, available, 29, '#f0f3f6');
      rule(M, y + 29, W - M, '#d1dbe3');
      write(title, M + 14, y + 19.5, 11.8, true, '#003c6f');
      y += 43;
    }
    function fieldGrid(fields) {
      const gap = 26, cellWidth = (available - 30 - gap) / 2;
      for (let i = 0; i < fields.length; i += 2) {
        const left = fields[i], right = fields[i + 1];
        const each = [left, right].filter(Boolean);
        const layouts = each.map(([label, value]) => {
          const labelWidth = 105, valueWidth = cellWidth - labelWidth - 10;
          return {labelLines: wrap(label, labelWidth, 9.5, true), valueLines: String(value || '—').split(/\r?\n/).flatMap(t => wrap(t, valueWidth, 10, false))};
        });
        const height = Math.max(23, ...layouts.map(k => Math.max(k.labelLines.length, k.valueLines.length) * 14 + 5));
        room(height + 2);
        each.forEach((_, n) => {
          const layout = layouts[n];
          const x = M + 15 + n * (cellWidth + gap);
          layout.labelLines.forEach((t, j) => write(t, x, y + 10 + j * 14, 9.5, true));
          layout.valueLines.forEach((t, j) => write(t, x + 115, y + 10 + j * 14, 10));
        });
        y += height;
      }
      y += 12;
    }
    newPage();
    rect(M, y, available, 65, '#e7f0f6');
    stroke(M, y, available, 65, '#b3c1ce');
    rect(M, y + 63, available, 2, '#00457d');
    write(byId('fcc-application-title-text'), M + 15, y + 37, 16, true, '#003d70');
    if (sealJpeg) {
      commands.push(`q 46 0 0 46 ${(W - M - 60).toFixed(2)} ${(H - y - 55).toFixed(2)} cm /Seal Do Q\n`);
    } else {
      rect(W - M - 59, y + 12, 46, 46, '#064879');
      write('FCC', W - M - 52, y + 42, 17, true, '#ffffff');
    }
    y += 81;

    section('General Information');
    fieldGrid([
      ['Call Sign:', byId('fcc-detail-call-sign')], ['File Number:', byId('fcc-detail-file-number')],
      ['Licensee:', byId('fcc-detail-licensee')], ['FCC Registration Number (FRN):', byId('fcc-detail-frn')],
      ['License Type:', byId('fcc-detail-type')], ['Status:', byId('fcc-detail-status')],
      ['Class of Station:', byId('fcc-detail-class-of-station')],
      ['Effective Date:', byId('fcc-detail-effective-date')]
    ]);
    section('Explanation');
    paragraph('Please explain in the area below why an STA is necessary:', {bold:true, size:10.5});
    y += 9;
    paragraph(byId('fcc-detail-explanation'));
    y += 20;
    section('Purpose of Operation');
    paragraph('Please explain the purpose of the operation:', {bold:true, size:10.5});
    y += 9;
    paragraph(byId('fcc-detail-purpose-of-operation'));
    y += 20;
    section('Requested Period of Operation');
    fieldGrid([
      ['Operation Start Date:', byId('fcc-detail-operation-start-date')],
      ['Operation End Date:', byId('fcc-detail-operation-end-date')]
    ]);
    section('Manufacturer');
    paragraph('List below transmitting equipment to be installed (if experimental, so state) if additional rows are required, please submit equipment list as an exhibit:', {bold:true, size:10.5});
    y += 9;
    const equipmentRows = [...document.querySelectorAll('#fcc-detail-manufacturers tr')].map(row =>
      [...row.querySelectorAll('td')].map(cell => cell.textContent.trim() || '—'));
    // Widths total the inner document area; repeat column headings if a new page is needed.
    const equipmentWidths = [184, 142, 85, available - 30 - 184 - 142 - 85];
    const equipmentHeaders = ['Manufacturer', 'Model Number', 'No. of Units', 'Experimental'];
    function equipmentHeader() {
      room(35);
      const top = y;
      let x = M + 15;
      equipmentHeaders.forEach((label, index) => {
        wrap(label, equipmentWidths[index] - 7, 9.3, true)
          .forEach((line, j) => write(line, x, top + 10 + j * 12, 9.3, true));
        x += equipmentWidths[index];
      });
      y += 33;
      rule(M + 15, y - 3, W - M - 15, '#d1dbe3');
    }
    equipmentHeader();
    for (const values of equipmentRows) {
      const wrapped = equipmentWidths.map((width, index) =>
        String(values[index] ?? '—').split(/\r?\n/).flatMap(line => wrap(line, width - 8, 10, false)));
      const rowHeight = Math.max(24, ...wrapped.map(lines => lines.length * 14 + 7));
      if (y + rowHeight > H - 60) { newPage(); equipmentHeader(); }
      let x = M + 15;
      wrapped.forEach((lines, index) => {
        lines.forEach((line, j) => write(line, x, y + 11 + j * 14, 10));
        x += equipmentWidths[index];
      });
      y += rowHeight;
    }
    y += 12;
    section('Station Location');
    const stationEntries = [...document.querySelectorAll('#fcc-detail-station-locations .fcc-station-entry')];
    const stationBasics = ['City', 'State', 'Latitude', 'Longitude', 'Mobile', 'Radius of Operation'];
    const stationQuestions = [
      'Datum:',
      'Is a directional antenna (other than radar) used?',
      'Exhibit submitted:',
      '(a) Width of beam in degrees at the half-power point:',
      '(b) Orientation in horizontal plane:',
      '(c) Orientation in vertical plane:',
      'Will the antenna extend more than 6 meters above the ground, or if mounted on an existing building, will it extend more than 6 meters above the building, or will the proposed antenna be mounted on an existing structure other than a building?',
      '(a) Overall height above ground to tip of antenna in meters:',
      '(b) Elevation of ground at antenna site above mean sea level in meters:',
      '(c) Distance to nearest aircraft landing area in kilometers:',
      '(d) List any natural formations or existing man-made structures (hills, trees, water tanks, towers, etc.) which, in the opinion of the applicant, would tend to shield the antenna from aircraft:'
    ];
    stationEntries.forEach((entry, index) => {
      room(70);
      if (index) { rule(M + 15, y, W - M - 15, '#d1dbe3'); y += 12; }
      write(`Station ${index + 1}`, M + 15, y + 11, 10.5, true, '#003c6f');
      y += 23;
      const basicValues = [...entry.querySelectorAll('.fcc-station-basics tbody td')]
        .map(cell => cell.textContent.trim() || '—');
      fieldGrid(stationBasics.map((label, i) => [label + ':', basicValues[i] || '—']));
      const values = [...entry.querySelectorAll('.fcc-station-facts dd')]
        .map(cell => cell.textContent.trim() || '—');
      stationQuestions.forEach((label, i) => {
        // Label and value are kept in the same paragraph; long questions wrap safely.
        paragraph(`${label}  ${values[i] || '—'}`, {size:9.4, lineHeight:13.2});
      });
      // Show only the three requested fields from each station's frequency rows.
      // The power, ERP, modulation, tolerance and emission columns remain excluded.
      const stationFrequencyRows = [...entry.querySelectorAll('.fcc-station-frequency-table tbody tr')]
        .map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim() || '—'));
      const frequencyHeaders = ['Action', 'Frequency', 'Station Class'];
      const frequencyWidths = [115, 255, available - 30 - 115 - 255];
      function frequencyHeader() {
        room(32);
        let x = M + 15;
        frequencyHeaders.forEach((label, col) => {
          write(label, x, y + 11, 9.7, true);
          x += frequencyWidths[col];
        });
        y += 23;
      }
      y += 8;
      frequencyHeader();
      for (const values of stationFrequencyRows) {
        const columns = frequencyWidths.map((width, col) =>
          wrap(String(values[col] || '—'), width - 9, 9.4, false));
        const rowHeight = Math.max(21, ...columns.map(lines => lines.length * 13 + 5));
        if (y + rowHeight > H - 60) { newPage(); frequencyHeader(); }
        let x = M + 15;
        columns.forEach((lines, col) => {
          lines.forEach((line, j) => write(line, x, y + 10 + j * 13, 9.4));
          x += frequencyWidths[col];
        });
        y += rowHeight;
      }
      y += 13;
    });
    pages.forEach((page, i) => {
      commands = page;
      rule(M, H - 46, W - M, '#d1dbe3');
      write('Stormworks only - For game simulation only - not real', M, H - 31, 8, false, '#6c7580');
      write(`${i + 1} / ${pages.length}`, W - M - 24, H - 31, 8, false, '#6c7580');
    });

    // Assemble a standards-compliant PDF, including an optional embedded FCC emblem.
    const objects = [null];
    const reserve = () => { objects.push(null); return objects.length - 1; };
    const catalogRef = reserve(), pagesRef = reserve(), normalRef = reserve(), boldRef = reserve();
    const sealRef = sealJpeg ? reserve() : 0;
    objects[normalRef] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
    objects[boldRef] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
    if (sealJpeg) {
      objects[sealRef] = [
        `<< /Type /XObject /Subtype /Image /Width 256 /Height 256 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${sealJpeg.length} >>\nstream\n`,
        sealJpeg, '\nendstream'
      ];
    }
    const pageRefs = [];
    pages.forEach(page => {
      const stream = toBytes(page.join(''));
      const contentRef = reserve();
      const pageRef = reserve();
      objects[contentRef] = [`<< /Length ${stream.length} >>\nstream\n`, stream, '\nendstream'];
      objects[pageRef] = `<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /FR ${normalRef} 0 R /FB ${boldRef} 0 R >> ${sealRef ? `/XObject << /Seal ${sealRef} 0 R >>` : ''} >> /Contents ${contentRef} 0 R >>`;
      pageRefs.push(pageRef);
    });
    objects[pagesRef] = `<< /Type /Pages /Count ${pageRefs.length} /Kids [${pageRefs.map(ref => `${ref} 0 R`).join(' ')}] >>`;
    objects[catalogRef] = `<< /Type /Catalog /Pages ${pagesRef} 0 R >>`;
    const blocks = [], offsets = [0];
    let size = 0;
    function put(part) { const b = toBytes(part); blocks.push(b); size += b.length; }
    put('%PDF-1.4\n%FCC Simulation\n');
    for (let i = 1; i < objects.length; i++) {
      offsets[i] = size;
      put(`${i} 0 obj\n`);
      const parts = Array.isArray(objects[i]) ? objects[i] : [objects[i]];
      parts.forEach(put);
      put('\nendobj\n');
    }
    const xrefStart = size;
    put(`xref\n0 ${objects.length}\n0000000000 65535 f \n`);
    for (let i = 1; i < objects.length; i++) put(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
    put(`trailer\n<< /Size ${objects.length} /Root ${catalogRef} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
    const result = new Uint8Array(size);
    let offset = 0;
    blocks.forEach(block => { result.set(block, offset); offset += block.length; });
    return new Blob([result], {type:'application/pdf'});
  }

  async function getEmblemJpeg() {
    const seal = document.querySelector('.fcc-application-seal');
    if (!seal) return null;
    if (!seal.complete) await new Promise(resolve => {
      seal.addEventListener('load', resolve, {once:true});
      seal.addEventListener('error', resolve, {once:true});
    });
    if (!seal.naturalWidth) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#e7f0f6'; ctx.fillRect(0, 0, 256, 256);
      ctx.drawImage(seal, 0, 0, 256, 256);
      const encoded = canvas.toDataURL('image/jpeg', 0.93).split(',')[1];
      const binary = atob(encoded);
      return Uint8Array.from(binary, char => char.charCodeAt(0));
    } catch (_) { return null; }
  }

  link.addEventListener('click', async event => {
    event.preventDefault();
    if (document.getElementById('fcc-application-document')?.hidden) return;
    try {
      const sealJpeg = await getEmblemJpeg();
      const pdf = createDocument(sealJpeg);
      const name = byId('fcc-detail-call-sign').replace(/[^A-Za-z0-9-]/g, '_');
      const href = URL.createObjectURL(pdf);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = `FCC-Application-${name}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 2000);
    } catch (error) {
      console.error('Unable to generate the FCC application PDF:', error);
      window.alert('Unable to download the PDF. Please try again.');
    }
  });
})();
