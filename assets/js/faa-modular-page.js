/*
 * Reusable content renderer for FAA informational pages (V58).
 * This script only modifies #faa-modular-content and #faa-modular-unpublished.
 * It never modifies the existing page heading, divider, headers or other pages.
 */
(() => {
  const content = document.getElementById('faa-modular-content');
  const unpublished = document.getElementById('faa-modular-unpublished');
  if (!content || !unpublished) return;

  const config = window.faaModularPageConfig;
  if (!config || config.published !== true) {
    content.hidden = true;
    unpublished.hidden = false;
    return;
  }

  // Accept ordinary web links and safe relative links when the site is opened
  // directly from a downloaded folder (file://). Explicit file:// and all
  // executable/data URL schemes stay disallowed.
  const safeUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return null;
    const raw = value.trim();
    if (raw.startsWith('//')) return null;
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
    if (hasScheme && !/^https?:/i.test(raw)) return null;
    try {
      const target = new URL(raw, document.baseURI);
      if (target.protocol === 'http:' || target.protocol === 'https:') return target.href;
      if (target.protocol === 'file:' && !hasScheme && document.baseURI.startsWith('file:')) {
        return target.href;
      }
    } catch (_) { /* Invalid URL: omit the link. */ }
    return null;
  };

  // Restrict user-entered colors to simple CSS colors; leave invalid values untouched.
  const validColor = value => typeof value === 'string' &&
    (/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?$/.test(value) ||
     /^(?:black|white|red|blue|navy|gray|grey|green|orange|purple)$/i.test(value));

  const textStyles = (element, block) => {
    if (validColor(block.color)) element.style.color = block.color;
    // Only buttons accept backgroundColor; color continues to control text color.
    if (block.type === 'button' && validColor(block.backgroundColor)) {
      element.style.setProperty('--faa-modular-button-background', block.backgroundColor);
      element.style.setProperty('--faa-modular-button-hover',
        `color-mix(in srgb, ${block.backgroundColor} 88%, white)`);
    }
    const size = Number(block.fontSize);
    if (Number.isFinite(size) && size >= 8 && size <= 72) {
      element.style.fontSize = `${size}px`;
    }
    // These settings apply independently to headings, paragraphs, links, and buttons.
    if (typeof block.bold === 'boolean') {
      element.style.fontWeight = block.bold ? '700' : '400';
    }
    if (typeof block.italic === 'boolean') {
      element.style.fontStyle = block.italic ? 'italic' : 'normal';
    }
    if (typeof block.underline === 'boolean') {
      element.style.textDecoration = block.underline ? 'underline' : 'none';
    }
  };

  // Optional per-block spacing in pixels. Explicit zero is allowed; omitted
  // properties retain each block's original CSS margins. Applied to every
  // content type, including divider blocks. Invalid values are ignored.
  const applySpacing = (element, block) => {
    for (const [property, cssProperty] of [
      ['spacingBefore', 'marginTop'],
      ['spacingAfter', 'marginBottom']
    ]) {
      const value = block[property];
      if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 500) {
        element.style[cssProperty] = `${value}px`;
      }
    }
  };

  const fragment = document.createDocumentFragment();
  for (const block of Array.isArray(config.blocks) ? config.blocks : []) {
    if (!block || typeof block !== 'object') continue;
    if (block.type === 'divider') {
      const hr = document.createElement('hr');
      hr.className = 'faa-modular-divider';
      applySpacing(hr, block);
      fragment.appendChild(hr);
      continue;
    }
    if (!['heading', 'paragraph', 'link', 'button'].includes(block.type)) continue;
    if (typeof block.text !== 'string') continue;

    const isLink = block.type === 'link' || block.type === 'button';
    const url = isLink ? safeUrl(block.url) : null;
    if (isLink && !url) continue;
    const tag = block.type === 'heading' ? 'h2' : (isLink ? 'a' : 'p');
    const element = document.createElement(tag);
    element.className = `faa-modular-block faa-modular-${block.type}`;
    element.textContent = block.text;
    if (url) {
      element.href = url;
      if (new URL(url).origin !== window.location.origin) {
        element.rel = 'noopener noreferrer';
      }
    }
    textStyles(element, block);
    applySpacing(element, block);
    fragment.appendChild(element);
  }

  content.replaceChildren(fragment);
  content.hidden = false;
  unpublished.hidden = true;
})();
