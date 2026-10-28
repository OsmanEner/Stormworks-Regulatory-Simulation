/* The only editable TFR detail data lives in data/tfr-details.js. */
(() => {
  'use strict';
  const id = new URLSearchParams(location.search).get('notam');
  const content = document.getElementById('tfr-notice-main');
  const data = typeof tfrDetails === 'object' && tfrDetails ? tfrDetails : {};
  const list = typeof tfrData !== 'undefined' && Array.isArray(tfrData.records) ? tfrData.records : [];
  const hasId = id && Object.prototype.hasOwnProperty.call(data, id);
  const record = hasId ? list.find(item => item.notam === id) : null;
  const notice = record ? data[id] : null;
  if (!notice) {
    const empty = document.createElement('p');
    empty.className = 'tfr-detail-not-found';
    empty.textContent = 'No published detail page for this NOTAM.';
    content.append(empty);
    return;
  }

  // Download the exact currently opened NOTAM as standalone, well-formed XML.
  // This is a simulation export, not the FAA's official XML/AIXM schema.
  const xmlLink = document.getElementById('tfr-detail-download-xml');
  if (xmlLink) {
    const xmlEscape = value => String(value == null ? '' : value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    const tag = (name, value, indent = '    ') =>
      indent + '<' + name + '>' + xmlEscape(value) + '</' + name + '>';

    xmlLink.addEventListener('click', event => {
      event.preventDefault();
      const doc = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<temporaryFlightRestriction>',
        tag('notamNumber', id, '  '),
        tag('fdcNumber', 'FDC ' + id, '  '),
        '  <listRecord>',
        ...['date', 'notam', 'facility', 'state', 'type', 'description']
          .map(key => tag(key, record[key])),
        '  </listRecord>',
        '  <noticeDetails>',
        ...[
          ['issueDate',notice.issueDate],
          ['location',notice.location],
          ['beginningDateAndTime',notice.beginning],
          ['endingDateAndTime',notice.ending],
          ['reasonForNotam',notice.reason],
          ['type',notice.type],
          ['replacedNotams','N/A'],
          ['pilotsMayContact','HOUSTON (ZHU) ARTCC, 281-230-5560']
        ].map(([key,value]) => tag(key,value)),
        '  </noticeDetails>',
        '  <affectedArea>',
        ...[
          ['center',notice.center],
          ['radius',notice.radius],
          ['altitude',notice.altitude],
          ['effectiveFrom',notice.effectiveFrom],
          ['effectiveTo',notice.effectiveTo]
        ].map(([key,value]) => tag(key,value)),
        '  </affectedArea>',
        '  <operatingRestrictions>',
        tag('requirements','No pilots may operate an aircraft in the areas covered by this NOTAM (except as described).'),
        '  </operatingRestrictions>',
        '  <otherInformation>',
        ...[
          ['artcc','ZHU - Houston Center'],
          ['pointOfContact',notice.pointOfContact],
          ['contactTelephone',notice.contactTelephone],
          ['authority','Title 14 CFR section 91.137(a)(1)']
        ].map(([key,value]) => tag(key,value)),
        '  </otherInformation>',
        '</temporaryFlightRestriction>'
      ].join('\n') + '\n';
      const blob = new Blob([doc], {type:'application/xml;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'FDC-' + id.replace(/[^A-Za-z0-9_-]/g, '-') + '.xml';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  document.title = 'FDC ' + id + ' — TFR Notice';
  const asText = value => String(value == null ? '' : value);
  const element = (tag, cls, value, parent) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value != null) node.textContent = asText(value);
    if (parent) parent.appendChild(node);
    return node;
  };
  const section = (name) => element('section','tfr-detail-section',null,content);
  const bar = (parent,label,value) => {
    const row = element('div','tfr-detail-blue-heading',null,parent);
    element('span','',label,row);
    if (value !== undefined) element('strong','',value,row);
    return row;
  };
  const infoRow = (parent,label,value) => {
    const row = element('div','tfr-detail-info-row',null,parent);
    element('div','tfr-detail-info-label',label,row);
    element('div','tfr-detail-info-value',value,row);
    return row;
  };
  const line = (parent,label,value) => {
    const row = element('div','tfr-detail-sub-row',null,parent);
    element('div','tfr-detail-sub-label',label,row);
    element('div','tfr-detail-sub-value',value,row);
    return row;
  };

  // NOTAM number and information
  const overview = section('NOTAM details');
  bar(overview, 'NOTAM Number :', 'FDC ' + id);
  const info = element('div','tfr-detail-info',null,overview);
  infoRow(info,'Issue Date :', notice.issueDate);
  infoRow(info,'Location :', notice.location);
  infoRow(info,'Beginning Date and Time :', notice.beginning);
  infoRow(info,'Ending Date and Time :', notice.ending);
  infoRow(info,'Reason for NOTAM :', notice.reason);
  infoRow(info,'Type :', notice.type);
  infoRow(info,'Replaced NOTAM(s) :', 'N/A');
  infoRow(info,'Pilots May Contact :', 'HOUSTON (ZHU) ARTCC, 281-230-5560');

  // Affected area and time interval
  const area = section();
  bar(area,'Affected Area(s)');
  const areaBody = element('div','tfr-detail-area',null,area);
  element('strong','tfr-detail-area-title','Airspace Definition:',areaBody);
  const areaRows = element('div','tfr-detail-area-rows',null,areaBody);
  line(areaRows,'Center:', notice.center);
  line(areaRows,'Radius:', notice.radius);
  line(areaRows,'Altitude:', notice.altitude);
  const effective = element('div','tfr-detail-effective',null,area);
  element('strong','','Effective Date(s):',effective);
  const dates = element('div','tfr-detail-date-values',null,effective);
  element('div','','From ' + asText(notice.effectiveFrom),dates);
  element('div','','To ' + asText(notice.effectiveTo),dates);

  // Operating restrictions: fixed, not editable through tfr-details.js.
  const restriction = section();
  bar(restriction,'Operating Restrictions and Requirements');
  element('p','tfr-detail-restrictions-text','No pilots may operate an aircraft in the areas covered by this NOTAM (except as described).',restriction);

  // Fixed authority, with only point-of-contact fields editable.
  const other = section();
  bar(other,'Other Information:');
  const otherBody = element('div','tfr-detail-other',null,other);
  infoRow(otherBody,'ARTCC:', 'ZHU - Houston Center');
  const poc = infoRow(otherBody,'Point of Contact:',notice.pointOfContact);
  element('div','tfr-detail-contact-phone','Telephone ' + asText(notice.contactTelephone),poc.querySelector('.tfr-detail-info-value'));
  infoRow(otherBody,'Authority:', 'Title 14 CFR section 91.137(a)(1)');
})();
