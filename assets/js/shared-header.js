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
        <i class="fa-solid fa-phone phone-icon" aria-hidden="true"></i>
        <span>+1 202-555-0147</span>
      </span>
      <div class="topbar-language" aria-label="Language: English">
        <img class="language-flag" src="${portalBase}assets/images/us-flag.svg" alt="">
        <span class="language-name">English</span>
        <i class="fa-solid fa-chevron-down language-chevron" aria-hidden="true"></i>
      </div>
      <form class="topbar-search" role="search" aria-label="Site search">
        <input type="search" id="county-search" placeholder="Search..." aria-label="Search notices and agencies">
        <button type="submit" class="topbar-search-submit" aria-label="Search"><i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i></button>
      </form>
      <span class="topbar-social" aria-label="Social icons"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i><i class="fa-brands fa-instagram" aria-hidden="true"></i></span>
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
