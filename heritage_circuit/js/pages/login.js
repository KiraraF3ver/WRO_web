/* LOGIN PAGE logic. Depends on js/app.js (HeritageApp) and js/i18n.js
   (HeritageI18n) being loaded first. */

function submitLogin(event) {
  event.preventDefault();
  const btn = document.getElementById('login-btn');
  // Confirmation label follows the currently selected language.
  const welcome = (typeof HeritageI18n !== 'undefined') ? HeritageI18n.t('login.welcome') : 'Welcome ✓';
  HeritageApp.pulseButtonSuccess(btn, welcome, 'btn-brass', 1200);
  // After the confirmation pulse, continue on to the terms/rules step.
  setTimeout(() => { window.location.href = 'rules.html'; }, 900);
}
