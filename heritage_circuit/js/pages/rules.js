/* RULES / TERMS PAGE logic. Depends on js/app.js (HeritageApp).
   Agreeing generates the building-entry ticket (once) and saves it, then
   continues to entry-ticket.html, which is the page that actually
   displays it. */

function agreeToTerms() {
  const btn = document.getElementById('agree-btn');
  const agreed = (typeof HeritageI18n !== 'undefined') ? HeritageI18n.t('rules.agreed') : 'Agreed ✓';
  HeritageApp.pulseButtonSuccess(btn, agreed, 'btn-brass', 900);

  const ticketId = '#' + HeritageApp.randomFourDigitId();
  HeritageApp.saveTicket('entry', {
    guest: 'user',
    id: ticketId,
    payload: 'Heritage Circuit | Building Entry | Ticket ' + ticketId
  });

  setTimeout(() => { window.location.href = 'entry-ticket.html'; }, 700);
}
