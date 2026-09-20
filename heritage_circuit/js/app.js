/* ==========================================================================
   HERITAGE CIRCUIT — shared app utilities
   Small helpers reused by page-specific scripts in js/pages/*.js.
   Load this before any page script.
   ========================================================================== */

const HeritageApp = (function () {

  /** Show a bottom toast message. Expects a <div class="toast" id="toast"> on the page. */
  let toastTimer = null;
  function showToast(message, duration = 2200) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  /** Generate a random 4-digit ticket/order ID, e.g. 4821 */
  function randomFourDigitId() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  /** Current time formatted as HH:MM (24h) */
  function nowTimeString() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return hh + ':' + mm;
  }

  /** Briefly flip a button to a "success" label/class, then revert. */
  function pulseButtonSuccess(btnEl, successLabel, successClass = 'btn-brass', duration = 1600) {
    if (!btnEl) return;
    const original = btnEl.textContent;
    const hadDark = btnEl.classList.contains('btn-dark');
    btnEl.classList.remove('btn-dark');
    btnEl.classList.add(successClass);
    btnEl.textContent = successLabel;
    setTimeout(() => {
      btnEl.classList.remove(successClass);
      if (hadDark) btnEl.classList.add('btn-dark');
      btnEl.textContent = original;
    }, duration);
  }

  /** Generic keyed storage — used for anything that needs to survive a
   *  navigation between pages (tickets, in-progress selections, etc.).
   *  Falls back to null if nothing is saved or storage is unavailable. */
  const STORAGE_PREFIX = 'hc_';
  function saveState(key, value) {
    try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); } catch (e) { /* storage unavailable, ignore */ }
  }
  function loadState(key) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function clearState(key) {
    try { localStorage.removeItem(STORAGE_PREFIX + key); } catch (e) { /* ignore */ }
  }

  /** Persist a ticket by kind ('entry' for building-entry passes,
   *  'booth' for the merged outfit + booth ticket from the queue flow),
   *  so a page further down the flow can read it after navigation.
   *  Thin wrapper around saveState/loadState for readability at call sites. */
  function saveTicket(kind, ticket) { saveState('ticket_' + kind, ticket); }
  function loadTicket(kind) { return loadState('ticket_' + kind); }

  return {
    showToast,
    randomFourDigitId,
    nowTimeString,
    pulseButtonSuccess,
    saveState,
    loadState,
    clearState,
    saveTicket,
    loadTicket
  };
})();
