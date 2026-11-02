/* FAA Commercial Space Transportation registry — FAA Licenses page ONLY.
   Safe rendering via textContent; no HTML interpolation from editable record data. */
(() => {
  'use strict';
  const data = typeof faaLicenseRegistry === 'object' ? faaLicenseRegistry : {};
  const head = document.getElementById('faa-lic-head');
  const body = document.getElementById('faa-lic-body');
  const table = document.querySelector('.faa-lic-table');
  const buttons = Array.from(document.querySelectorAll('.faa-lic-tab'));
  if (!head || !body || !table || !buttons.length) return;

  const layouts = {
    licensedLaunches: {
      title:'Licensed Launches',
      fields:[['date','Date'],['company','Company'],['launchVehicle','Launch Vehicle'],
              ['payload','Payload'],['humanSpaceFlight','Human Space Flight'],
              ['launchSite','Launch Site'],['stateLocation','State/Location']]
    },
    launchLicenses: {
      title:'Launch Licenses',
      fields:[['licenseNumber','License Number'],['company','Company'],['vehicle','Vehicle'],
              ['launchSite','Launch Site'],['stateLocation','State/Location'],
              ['expirationDate','Expiration Date']]
    },
    reentryLicenses: {
      title:'Reentry Licenses',
      fields:[['licenseNumber','License Number'],['company','Company'],['vehicle','Vehicle'],
              ['reentrySiteLocation','Reentry Site Location'],['expirationDate','Expiration Date']]
    }
  };
  const updated = document.getElementById('faa-lic-last-updated');
  if (updated) {
    const raw = String(data.lastUpdatedUTC ?? '').trim();
    if (/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(raw) && !Number.isNaN(Date.parse(raw))) {
      updated.textContent = 'Last updated: ' + new Intl.DateTimeFormat('en-US', {
        timeZone:'UTC',month:'2-digit',day:'2-digit',year:'numeric',
        hour:'2-digit',minute:'2-digit',hourCycle:'h23'
      }).format(new Date(raw)) + ' UTC';
    } else { updated.textContent = 'Last updated: ' + (raw || '—'); }
  }
  const state = {view:'licensedLaunches', key:'', descending:false};
  const asText = v => v == null ? '' : String(v);

  // URL must be relative/site-root, http(s), or a hash-free local PDF file.
  // Unsupported schemes such as javascript: are never placed into an anchor.
  function safePdfUrl(v) {
    const value = asText(v).trim();
    if (!value || /[\\\x00-\x1f]/.test(value)) return '';
    if (/^(?:https?:\/\/)/i.test(value)) return value;
    if (/^(?:\.{1,2}\/|\/|[a-zA-Z0-9_-])/.test(value) && !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith('//')) {
      return value;
    }
    return '';
  }
  function cell(row, key, view) {
    const td = document.createElement('td');
    const raw = asText(row?.[key]);
    if (key === 'licenseNumber' && view !== 'licensedLaunches') {
      const url = safePdfUrl(row?.pdf);
      if (url) {
        const link = document.createElement('a');
        link.className = 'faa-lic-pdf-link';
        link.textContent = raw || '—';
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.title = 'View license PDF';
        td.append(link);
      } else {
        td.textContent = raw || '—';
      }
    } else {
      td.textContent = raw || '—';
    }
    return td;
  }
  function render() {
    const view = layouts[state.view];
    buttons.forEach(button => {
      const chosen = button.dataset.view === state.view;
      button.classList.toggle('is-active',chosen);
      button.setAttribute('aria-pressed',chosen?'true':'false');
    });
    table.setAttribute('aria-label',view.title);
    head.replaceChildren();
    body.replaceChildren();
    const heading = document.createElement('tr');
    for (const [field,name] of view.fields) {
      const th = document.createElement('th');
      th.scope='col';
      const control=document.createElement('button');
      control.type='button';
      control.className='faa-lic-sort';
      control.textContent=name;
      control.setAttribute('aria-label','Sort by '+name);
      if (field === state.key) th.setAttribute('aria-sort',state.descending?'descending':'ascending');
      control.addEventListener('click',()=>{
        if(state.key===field) state.descending=!state.descending;
        else {state.key=field;state.descending=false;}
        render();
      });
      th.append(control);
      heading.append(th);
    }
    head.append(heading);
    const rows=Array.isArray(data[state.view])?data[state.view].slice():[];
    if (state.key) {
      rows.sort((a,b)=>asText(a?.[state.key]).localeCompare(asText(b?.[state.key]),undefined,{numeric:true,sensitivity:'base'})*(state.descending?-1:1));
    } else if (state.view==='licensedLaunches') {
      rows.sort((a,b)=>asText(b?.date).localeCompare(asText(a?.date)));
    }
    if (!rows.length) {
      const tr=document.createElement('tr');
      const td=document.createElement('td');
      td.colSpan=view.fields.length;
      td.className='faa-lic-empty';
      td.textContent='No '+view.title.toLowerCase()+' have been published.';
      tr.append(td);
      body.append(tr);
    } else {
      for(const record of rows) {
        const tr=document.createElement('tr');
        for(const [field] of view.fields) tr.append(cell(record,field,state.view));
        body.append(tr);
      }
    }
  }
  buttons.forEach(button=>button.addEventListener('click',()=>{
    if (!Object.hasOwn(layouts,button.dataset.view)) return;
    state.view=button.dataset.view;
    state.key='';
    state.descending=false;
    render();
  }));
  render();
})();
