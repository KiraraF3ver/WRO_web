/* ENTRY TICKET PAGE logic. Depends on js/app.js (HeritageApp).
   The entry ticket itself is generated once, in js/pages/rules.js, right
   after the person agrees to the terms — this page just displays whatever
   was saved (guest name + ticket ID), so the same ID persists across every
   future visit. The QR graphic is a static image (images/qr-entry.png),
   not generated from the ticket data. Falls back to a demo ID only if this
   page is opened directly with nothing saved yet. */

function renderTicket() {
  const ticket = HeritageApp.loadTicket('entry') || {
    guest: 'user',
    id: '#' + HeritageApp.randomFourDigitId()
  };

  document.getElementById('ticket-user').textContent = ticket.guest || 'user';
  document.getElementById('ticket-id').textContent = ticket.id;
  document.getElementById('ticket-id-stub').textContent = ticket.id;
}

renderTicket();
