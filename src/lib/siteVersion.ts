/*
  Lets visitors view the site in any of its earlier looks (see /process).
  The choice lives on <html data-version> and in localStorage; an inline script
  in the root layout re-applies it before first paint on every page load.
*/

export type SiteVersion = 'v1' | 'v2' | 'v3' | 'v4';

const KEY = 'site-version';
const EVENT = 'site-version-change';

export function getSiteVersion(): SiteVersion {
  if (typeof document === 'undefined') return 'v4';
  return (document.documentElement.dataset.version as SiteVersion | undefined) ?? 'v4';
}

export function setSiteVersion(version: SiteVersion) {
  const root = document.documentElement;
  try {
    if (version === 'v4') {
      delete root.dataset.version;
      localStorage.removeItem(KEY);
    } else {
      root.dataset.version = version;
      localStorage.setItem(KEY, version);
    }
  } catch {
    // Storage can be unavailable (private mode); the theme still applies for this page.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeSiteVersion(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/** Inline, pre-paint: restore a chosen version so pages never flash the default theme. */
export const restoreVersionScript =
  "try{var v=localStorage.getItem('site-version');if(v==='v1'||v==='v2'||v==='v3'){document.documentElement.dataset.version=v}}catch(e){}";
