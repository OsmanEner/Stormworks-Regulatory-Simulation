/* NASS UTC clock — always displays UTC+0 regardless of visitor timezone.
   Uses the browser's current system time (normally synced by the OS).
   No API keys or time service required, compatible with GitHub Pages. */
(() => {
  'use strict';
  const clock = document.getElementById('nass-utc-clock');
  if (!clock) return;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pad = n => String(n).padStart(2, '0');
  function update() {
    const now = new Date();
    const hours = now.getUTCHours();
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    clock.textContent = `Current: ${months[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()} ${hour12}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} ${ampm} GMT+0`;
    clock.dateTime = now.toISOString();
  }
  update();
  setInterval(update, 1000);
})();
