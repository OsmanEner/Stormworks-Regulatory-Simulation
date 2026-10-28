/*
  SHARED WHITE HEADER — SPACEFLIGHT REGULATORY PORTAL
  --------------------------------------------------
  Edit this file once to change the top bar on ALL pages.
  The language display is visual only. The phone number uses a fictional
  555-01xx number rather than a real government contact number.
*/
(() => {
  const target = document.getElementById('utility-header');
  if (!target) return;
  const portalBase = document.body.classList.contains('portal-page') ? '' : '../';
  target.className = 'county-topbar';
  target.innerHTML = `
    <div class="county-topbar-inner">
      <span class="topbar-address">Stormworks Regulatory Portal</span>
      <span class="topbar-phone">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="phone-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.96.35 1.89.68 2.78a2 2 0 0 1-.45 2.11L9.09 10.9a16 16 0 0 0 4.01 4.01l1.27-1.22a2 2 0 0 1 2.11-.45c.89.33 1.82.56 2.78.68A2 2 0 0 1 22 16.92z"/></svg>
        <span>+1 202-555-0147</span>
      </span>
      <div class="topbar-language" aria-label="Language: English">
        <img class="language-flag" src="${portalBase}assets/images/us-flag.svg" alt="">
        <span class="language-name">English</span>
        <svg class="language-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <form class="topbar-search" role="search" aria-label="Site search">
        <input type="search" id="county-search" placeholder="Search..." aria-label="Search notices and agencies">
        <button type="submit" class="topbar-search-submit" aria-label="Search"><svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg></button>
      </form>
      <span class="topbar-social" aria-label="Social icons">f&nbsp;&nbsp;◎</span>
    </div>`;

  const input = target.querySelector('#county-search');
  const form = target.querySelector('.topbar-search');
  const isCounty = document.body.classList.contains('county-page');
  const isPortal = document.body.classList.contains('portal-page');
  const dir = document.getElementById('agency-directory');
  const params = new URLSearchParams(window.location.search);
  if (isPortal && params.has('search')) input.value = params.get('search') || '';

  const applyDirectoryFilter = () => {
    if (!dir) return;
    const needle = input.value.trim().toLowerCase();
    dir.querySelectorAll('.agency-directory-item').forEach(item => {
      item.hidden = !item.textContent.toLowerCase().includes(needle);
    });
    const visible = Array.from(dir.querySelectorAll('.agency-directory-item')).some(item => !item.hidden);
    const empty = document.getElementById('directory-no-results');
    if (empty) empty.hidden = visible;
  };
  if (isPortal) {
    input.addEventListener('input', applyDirectoryFilter);
    applyDirectoryFilter();
  }
  // On the county page, site.js already filters the published order links.
  // On other pages, a search is sent to the agency directory.
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (isPortal) {
      applyDirectoryFilter();
    } else if (!isCounty) {
      window.location.href = portalBase + 'index.html?search=' + encodeURIComponent(input.value.trim());
    }
  });
})();
