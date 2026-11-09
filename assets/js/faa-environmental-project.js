/* FAA Environmental Projects — page-local renderer, no global style updates.
 * Uses matching .html and .js basenames for easy duplication on static hosting.
 */
(() => {
  'use strict';
  const target = document.getElementById('faa-env-project-content');
  const error = document.getElementById('faa-env-load-error');
  if (!target || !error) return;

  const baseName = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html$/i, '');
  if (!/^faa-environmental-project-[a-z0-9_-]+$/i.test(baseName)) {
    error.hidden = false;
    return;
  }
  const script = document.createElement('script');
  script.src = `../data/faa-environmental-projects/${baseName}.js`;
  script.addEventListener('load', render);
  script.addEventListener('error', () => { error.hidden = false; });
  document.head.appendChild(script);

  function safeUrl(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    raw = raw.trim();
    if (raw.startsWith('//')) return null;
    const scheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
    if (scheme && !/^https?:/i.test(raw)) return null;
    try {
      const resolved = new URL(raw, document.baseURI);
      if (['https:','http:'].includes(resolved.protocol)) return resolved.href;
      if (!scheme && resolved.protocol === 'file:' && document.baseURI.startsWith('file:')) return resolved.href;
    } catch (_) { /* invalid URL */ }
    return null;
  }

  function setText(id, val) {
    const el=document.getElementById(id);
    if (el) el.textContent = (val === undefined || val === null || val === '') ? '—' : String(val);
  }

  // Use UTC calendar dates throughout. Date.parse on date-only strings is not
  // used: the format and actual calendar day (including leap days) are checked.
  const DAY_MS = 86400000;
  function utcDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const stamp = Date.UTC(year, month - 1, day);
    const date = new Date(stamp);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return stamp;
  }
  function shortDate(stamp) {
    return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(stamp));
  }
  function fullDate(stamp) {
    return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(stamp));
  }
  const timetableClasses = {
    'scheduled':'scheduled', 'in progress':'scheduled', 'completed':'scheduled',
    'extension or delay':'extension', 'delayed':'delayed',
    'paused':'paused', 'planned':'planned'
  };
  function renderTimetable(data) {
    const wrap=document.getElementById('faa-env-timetable');
    const chart=document.getElementById('faa-env-timetable-chart');
    const note=document.getElementById('faa-env-timetable-note');
    if (!wrap || !chart || !note) return;
    wrap.hidden=true;
    chart.replaceChildren();
    note.textContent='';
    if (!data || typeof data !== 'object') return;
    const start=utcDay(data.startDate);
    const end=utcDay(data.endDate);
    if (start===null || end===null || end<start) {
      // Invalid dates must not create broken or misleading timelines.
      note.textContent='Timetable dates must be valid YYYY-MM-DD dates with the end on or after the start.';
      wrap.hidden=false;
      return;
    }
    const days=Math.round((end-start)/DAY_MS)+1; // both calendar dates inclusive
    if (days > 3660) {
      note.textContent='The timetable range must not exceed ten years.';
      wrap.hidden=false;
      return;
    }
    wrap.hidden=false;
    const rowList=Array.isArray(data.actions)?data.actions:[];
    // The scale uses day-precise UTC boundaries, not local time or 30-day months.
    const row=document.createElement('div');
    row.className='faa-env-time-axis faa-env-time-gridrow';
    const left=document.createElement('span'); left.className='faa-env-time-rowlabel';
    left.textContent='';
    const axis=document.createElement('div'); axis.className='faa-env-time-track faa-env-time-axis-track';
    const right=document.createElement('span'); right.className='faa-env-time-statuslabel'; right.textContent='STATUS';
    row.append(left,axis,right);
    chart.appendChild(row);
    const step = days<=12 ? 1 : days<=32 ? 4 : days<=70 ? 7 : days<=150 ? 14 : days<=370 ? 30 : 90;
    // Equal horizontal intervals, including the exact start and end dates.
    // Cap the interval count so labels also fit in the chart's 480px minimum track.
    const intervals=days===1 ? 0 : Math.min(6,Math.max(1,Math.round((days-1)/step)));
    const ticks=intervals ? Array.from({length:intervals+1},(_,i)=>({
      index:Math.round(i*(days-1)/intervals),
      pct:(0.5 + (days-1)*i/intervals)/days*100
    })) : [{index:0,pct:50}];
    for(let n=0;n<ticks.length;n++) {
      const tick=ticks[n];
      const label=document.createElement('span');
      label.className='faa-env-time-tick-label';
      if (n===0)label.classList.add('faa-env-time-tick-first');
      if (n===ticks.length-1)label.classList.add('faa-env-time-tick-last');
      label.textContent=shortDate(start+tick.index*DAY_MS);
      label.style.left=tick.pct+'%';
      axis.appendChild(label);
    }
    // Guidelines follow precisely the same evenly spaced horizontal positions.
    const makeGrid=() => {
      const grid=document.createElement('div');
      grid.className='faa-env-time-grid';
      for(const tick of ticks.slice(1,-1)) {
        const line=document.createElement('i'); line.className='faa-env-time-gridline';
        line.style.left=tick.pct+'%';
        grid.appendChild(line);
      }
      return grid;
    };
    const todayMarkers=[];
    // Use a body-level tooltip instead of a pseudo-element inside the
    // horizontally scrollable chart (which clipped top-row tooltips).
    const tooltip=document.createElement('div');
    tooltip.className='faa-env-time-tooltip';
    tooltip.hidden=true;
    tooltip.setAttribute('role','tooltip');
    document.body.appendChild(tooltip);
    let activeBar=null;
    function positionTooltip() {
      if (!activeBar || tooltip.hidden) return;
      const rect=activeBar.getBoundingClientRect();
      const scrollRect=chart.parentElement.getBoundingClientRect();
      if (rect.bottom<scrollRect.top || rect.top>scrollRect.bottom ||
          rect.right<scrollRect.left || rect.left>scrollRect.right) {
        tooltip.hidden=true;
        activeBar=null;
        return;
      }
      const pad=12, gap=8;
      const width=tooltip.offsetWidth, height=tooltip.offsetHeight;
      tooltip.style.left=Math.max(pad,Math.min(rect.left,window.innerWidth-width-pad))+'px';
      const above=rect.top-height-gap;
      const below=rect.bottom+gap;
      let top=above>=pad ? above : below;
      top=Math.max(pad,Math.min(top,window.innerHeight-height-pad));
      tooltip.style.top=top+'px';
    }
    function showTooltip(bar,fields) {
      activeBar=bar;
      // Build each label/value pair as text nodes: labels are bold, while
      // their corresponding project-data values stay regular-weight.
      const groups=fields.map(([label,value])=>{
        const group=document.createElement('div');
        group.className='faa-env-time-tooltip-field';
        const name=document.createElement('div');
        name.className='faa-env-time-tooltip-label';
        name.textContent=label;
        const content=document.createElement('div');
        content.className='faa-env-time-tooltip-value';
        content.textContent=value;
        group.append(name,content);
        return group;
      });
      tooltip.replaceChildren(...groups);
      tooltip.hidden=false;
      positionTooltip();
    }
    function hideTooltip() {activeBar=null;tooltip.hidden=true;}
    window.addEventListener('scroll',positionTooltip,true);
    window.addEventListener('resize',positionTooltip);
    let firstTrack=null;
    for (const item of rowList) {
      if (!item || typeof item !== 'object' || typeof item.title !== 'string') continue;
      // Backwards compatible: the original startDate/endDate/status fields
      // still create one bar. For a multi-color action, add a `periods` array:
      // [{status:'In Progress',startDate:'YYYY-MM-DD',endDate:'YYYY-MM-DD'},
      //  {status:'Delayed',startDate:'YYYY-MM-DD',endDate:'YYYY-MM-DD'}]
      // Each period owns its dates and its own tooltip; no existing data is edited.
      const hasPeriods=Array.isArray(item.periods) && item.periods.length>0;
      const rawPeriods=hasPeriods ? item.periods : [item];
      const periods=rawPeriods.map(period=>{
        if (!period || typeof period !== 'object') return null;
        const from=utcDay(period.startDate),to=utcDay(period.endDate);
        if (from===null || to===null || to<from) return null;
        const label=String(period.status || item.status || 'Scheduled').trim();
        const type=timetableClasses[label.toLowerCase()];
        return type ? {data:period,from,to,type,label} : null;
      }).filter(Boolean).sort((a,b)=>a.from-b.from);
      if (!periods.length) continue;
      const line=document.createElement('div'); line.className='faa-env-time-gridrow faa-env-time-row';
      const name=document.createElement('span'); name.className='faa-env-time-rowlabel';
      name.textContent=item.title;
      if (!firstTrack) name.classList.add('faa-env-time-overall');
      const track=document.createElement('div'); track.className='faa-env-time-track faa-env-time-row-track';
      if (!firstTrack) {firstTrack=track;line.classList.add('faa-env-time-first-row');}
      track.appendChild(makeGrid());
      // Place the marker UNDER the bars. The bar's z-index always wins.
      const today=document.createElement('i');today.className='faa-env-time-today-line';
      today.setAttribute('aria-hidden','true');
      track.appendChild(today);todayMarkers.push(today);
      for (const period of periods) {
        const {from,to,type,label}=period;
        const visibleStart=Math.max(from,start),visibleEnd=Math.min(to,end);
        if (visibleStart>visibleEnd) continue;
        const bar=document.createElement('div');
        bar.className='faa-env-time-bar faa-env-time-bar-'+type;
        const leftPct=(visibleStart-start)/(days*DAY_MS)*100;
        const widthPct=(visibleEnd-visibleStart+DAY_MS)/(days*DAY_MS)*100;
        bar.style.left=leftPct+'%';bar.style.width=widthPct+'%';
        const delayInfo=(typeof period.data.delayInfo==='string' && period.data.delayInfo.trim())
          ? period.data.delayInfo.trim()
          : ((typeof item.delayInfo==='string' && item.delayInfo.trim())
              ? item.delayInfo.trim() : 'None reported');
        // A segmented action shows each section's actual dates and status on hover.
        // Single-period legacy actions retain their original statusText behavior.
        const visibleStatus=(typeof period.data.statusText==='string' && period.data.statusText.trim())
          ? period.data.statusText.trim()
          : (hasPeriods ? label : ((typeof item.statusText==='string' && item.statusText.trim())
              ? item.statusText.trim() : label));
        const tooltipFields=[
          ['ACTION',item.title],
          ['START DATE',`${fullDate(from)} (UTC)`],
          ['END DATE',`${fullDate(to)} (UTC)`],
          ['STATUS',visibleStatus],
          ['EXTENSION / DELAY',delayInfo]
        ];
        bar.setAttribute('aria-label',tooltipFields.map(([key,value])=>`${key}: ${value}`).join(', '));
        bar.tabIndex=0;
        bar.addEventListener('mouseenter',()=>showTooltip(bar,tooltipFields));
        bar.addEventListener('mouseleave',hideTooltip);
        bar.addEventListener('focus',()=>showTooltip(bar,tooltipFields));
        bar.addEventListener('blur',hideTooltip);
        track.appendChild(bar);
      }
      const finalPeriod=periods[periods.length-1];
      const visibleRowStatus=(typeof item.statusText==='string' && item.statusText.trim())
        ? item.statusText.trim()
        : ((hasPeriods && typeof finalPeriod.data.statusText==='string' && finalPeriod.data.statusText.trim())
            ? finalPeriod.data.statusText.trim()
            : (hasPeriods ? finalPeriod.label : String(item.status || 'Scheduled')));
      const status=document.createElement('span');status.className='faa-env-time-status';
      status.appendChild(document.createTextNode(visibleRowStatus));
      if (visibleRowStatus.toLowerCase()==='completed') {
        const check=document.createElement('span');
        check.className='faa-env-time-completed-check';
        check.textContent='✓';
        check.setAttribute('aria-hidden','true');
        status.appendChild(check);
      }
      line.append(name,track,status);
      chart.appendChild(line);
    }
    if (!firstTrack) {
      const empty=document.createElement('p');empty.className='faa-env-time-empty';
      empty.textContent='No timetable actions have been added.';
      chart.appendChild(empty);
    }
    // Align the first-row label, downward CSS triangle, and vertical line at
    // the same fraction of the UTC range; place the caption BELOW the first
    // bar, with a reserved extra strip above subsequent rows.
    const arrow=document.createElement('span');arrow.className='faa-env-time-today-arrow';
    arrow.setAttribute('aria-hidden','true');
    const todayLabel=document.createElement('span');todayLabel.className='faa-env-time-today-caption';
    todayLabel.textContent='TODAY';
    (firstTrack || axis).append(todayLabel,arrow);
    // Keep time calculations based on UTC days (no local TZ/DST adjustment).
    let timer;
    function refreshToday() {
      const now=Date.now();
      const inRange=now>=start && now<end+DAY_MS;
      const pct=Math.max(0,Math.min(100,(now-start)/(days*DAY_MS)*100));
      for(const marker of todayMarkers) {
        marker.hidden=!inRange;
        if(inRange) marker.style.left=pct+'%';
      }
      todayLabel.hidden=!inRange;
      arrow.hidden=!inRange;
      if(inRange) {
        // Caption moves with marker; clamp the label at extreme edges to
        // avoid clipping without changing the exact vertical-line position.
        todayLabel.style.setProperty('--faa-env-today-pct',pct+'%');
        arrow.style.left=pct+'%';
        note.textContent='';
      } else {
        note.textContent=`Current UTC date is outside the displayed ${fullDate(start)} – ${fullDate(end)} range.`;
      }
    }
    refreshToday();
    timer=window.setInterval(refreshToday,60000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden)refreshToday();
    });
    // This renderer is called once per project-page load.
  }

  function render() {
    const d = window.faaEnvironmentalProject;
    if (!d || typeof d !== 'object') { error.hidden=false; return; }
    setText('faa-env-title',d.title);
    document.title = `${d.title || 'Environmental Project'} — FAA Simulation`;
    setText('faa-env-status',d.status);
    setText('faa-env-completion',d.estimatedCompletionDate);
    setText('faa-env-sector',d.sector);
    setText('faa-env-category',d.category);
    setText('faa-env-agency',d.leadAgency);
    const siteLink=document.getElementById('faa-env-site-link');
    siteLink.textContent = d.projectWebsiteLabel || 'Stakeholder Engagement';
    siteLink.href = safeUrl(d.projectWebsite) || 'faa-stakeholder-engagement.html';
    const total = Math.max(0,Math.floor(Number(d.processesTotal)||0));
    const done = Math.min(total,Math.max(0,Math.floor(Number(d.processesCompleted)||0)));
    const progress = document.getElementById('faa-env-progress');
    const countLabel = document.createElement('span');
    countLabel.className = 'faa-env-progress-copy';
    countLabel.textContent = `${done}\nout of\n${total}`;
    progress.replaceChildren(countLabel);
    progress.setAttribute('aria-label', `${done} out of ${total} environmental processes completed`);
    // V67: per-project rich description blocks. Older `description` arrays are
    // still accepted unchanged when `descriptionBlocks` is not present.
    const descriptions=document.getElementById('faa-env-description-text');
    descriptions.replaceChildren();
    const blocks = Array.isArray(d.descriptionBlocks)
      ? d.descriptionBlocks
      : (Array.isArray(d.description) ? d.description : [d.description])
          .filter(value => typeof value === 'string' && value.trim())
          .map(text => ({type:'paragraph',text}));
    const validColor = value => typeof value === 'string' &&
      (/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?$/.test(value) ||
       /^(?:black|white|red|blue|navy|gray|grey|green|orange|purple)$/i.test(value));
    const applyStyle = (el, block) => {
      if (validColor(block.color)) el.style.color = block.color;
      const size = Number(block.fontSize);
      if (block.fontSize !== undefined && Number.isFinite(size) && size >= 8 && size <= 72)
        el.style.fontSize = `${size}px`;
      if (typeof block.bold === 'boolean') el.style.fontWeight = block.bold ? '700' : '400';
      if (typeof block.italic === 'boolean') el.style.fontStyle = block.italic ? 'italic' : 'normal';
      if (typeof block.underline === 'boolean')
        el.style.textDecoration = block.underline ? 'underline' : 'none';
      for (const [key, prop] of [['spacingBefore','marginTop'],['spacingAfter','marginBottom']]) {
        if (typeof block[key] === 'number' && Number.isFinite(block[key]) && block[key] >= 0 && block[key] <= 500)
          el.style[prop] = `${block[key]}px`;
      }
      if (block.type === 'button' && validColor(block.backgroundColor)) {
        el.style.setProperty('--faa-env-button-background', block.backgroundColor);
        el.style.setProperty('--faa-env-button-hover',
          `color-mix(in srgb, ${block.backgroundColor} 88%, white)`);
      }
    };
    // PDF names are single files in the dedicated environmental-project folder.
    // No '../' paths, URL schemes, or arbitrary remote URLs via the pdf field.
    const pdfUrl = value => {
      if (typeof value !== 'string' || !/^[a-zA-Z0-9_ .()-]+\.pdf$/i.test(value) || value.includes('..')) return null;
      return `../assets/pdfs/faa/environmental-projects/${encodeURIComponent(value)}`;
    };
    const fragment=document.createDocumentFragment();
    for (const block of blocks) {
      if (!block || typeof block !== 'object') continue;
      if (block.type === 'divider') {
        const hr=document.createElement('hr');
        hr.className='faa-env-description-divider';
        applyStyle(hr,block);
        fragment.appendChild(hr);
        continue;
      }
      if (!['heading','paragraph','link','button'].includes(block.type) || typeof block.text !== 'string') continue;
      const isLink = block.type === 'link' || block.type === 'button';
      const href = isLink ? (block.pdf !== undefined ? pdfUrl(block.pdf) : safeUrl(block.url)) : null;
      if (isLink && !href) continue;
      const tag = block.type === 'heading' ? 'h3' : (isLink ? 'a' : 'p');
      const el=document.createElement(tag);
      el.className=`faa-env-description-block faa-env-description-${block.type}`;
      el.textContent=block.text;
      if (href) {
        el.href=href;
        if (block.pdf !== undefined || /\.pdf(?:[?#]|$)/i.test(href)) {
          el.target='_blank';
          el.rel='noopener noreferrer';
        } else if (/^https?:/i.test(href) && new URL(href).origin !== location.origin) {
          el.rel='noopener noreferrer';
        }
      }
      applyStyle(el,block);
      fragment.appendChild(el);
    }
    descriptions.appendChild(fragment);
    renderTimetable(d.permittingTimetable);
    const related=Array.isArray(d.relatedProjects)?d.relatedProjects:[];
    const relatedWrap=document.getElementById('faa-env-related');
    const relatedLinks=document.getElementById('faa-env-related-links');
    for (const item of related) {
      if (!item || typeof item.text !== 'string') continue;
      const url=safeUrl(item.url);
      if (!url) continue;
      const p=document.createElement('p');
      const a=document.createElement('a');
      a.textContent=item.text;
      a.href=url;
      p.appendChild(a);
      relatedLinks.appendChild(p);
    }
    relatedWrap.hidden=!relatedLinks.children.length;

    target.hidden=false;
  }
})();
