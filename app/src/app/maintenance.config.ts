/** Flip to true and deploy to take the whole marketing site down to a maintenance page. */
export const MAINTENANCE_MODE = false;

const DEV_VIEW_STORAGE_KEY = 'wbskt-dev-view';

/** Off by default, so customers see the maintenance page. Run
 * `localStorage.setItem('wbskt-dev-view', 'true')` in devtools (then reload) in a
 * specific browser to preview the real site there while everyone else sees maintenance. */
export function isDevViewEnabled(): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem(DEV_VIEW_STORAGE_KEY) === 'true';
}
