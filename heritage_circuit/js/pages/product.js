/* PRODUCT PAGE logic — shared by all three costume pages.
   Depends on js/app.js (HeritageApp). */

function openPage(name) {
  const el = document.getElementById('view-' + name);
  el.classList.add('active');
  el.scrollTop = 0;
}

function closePage() {
  document.querySelectorAll('.view-detail.active').forEach(el => el.classList.remove('active'));
}
