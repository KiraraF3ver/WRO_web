/* QUEUE PAGE logic. Depends on js/app.js (HeritageApp).
   Two-step flow on this page:
     1. registerQueue() — join the general waiting line
     2. selectBooth()   — pick an empty (available) booth once registered
   Step 3 (choosing an outfit and generating the ticket) lives on its own
   page, generate-ticket.html — proceedToGenerate() just saves which booth
   was chosen so that page can read it after navigating there.
*/

const generalQueue = [
  { user: "Trần Hữu Phước", time: "09:12" },
  { user: "Nguyễn Thị Mai", time: "09:18" },
  { user: "Lê Văn Khoa", time: "09:24" }
];

const booths = [
  { num: 1, name: "VR Booth", status: "available" },
  { num: 2, name: "VR Booth", status: "available" },
  { num: 3, name: "VR Booth", status: "occupied" },
  { num: 4, name: "VR Booth", status: "occupied" }
];

const CURRENT_USER = "user";
let registered = false;
let selectedBooth = null;

/* Translate helper — falls back to the key if i18n isn't loaded.
   Values in `vars` replace {placeholders} in the returned string. */
function T(key, vars) {
  let s = (typeof HeritageI18n !== 'undefined') ? HeritageI18n.t(key) : key;
  if (vars) { Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); }); }
  return s;
}

function renderQueueList() {
  const list = document.getElementById('queue-list');
  list.innerHTML = generalQueue.map((entry, i) => {
    const isYou = entry.user === CURRENT_USER;
    return `<div class="queue-row${isYou ? ' is-you' : ''}">
      <span class="queue-pos">#${i + 1}</span>
      <span class="queue-user">${entry.user}</span>
      <span class="queue-time">${entry.time}</span>
    </div>`;
  }).join('');
}

function registerQueue() {
  if (registered) {
    HeritageApp.showToast(T('queue.alreadyReg'));
    return;
  }
  registered = true;
  generalQueue.push({ user: CURRENT_USER, time: HeritageApp.nowTimeString() });

  const card = document.getElementById('register-card');
  card.classList.add('done');
  card.innerHTML = `
    <div class="register-status">
      <span class="register-dot"></span>
      <span>${T('queue.registeredPos', { n: generalQueue.length })}</span>
    </div>
    <div class="queue-list" id="queue-list"></div>
  `;
  renderQueueList();

  document.getElementById('booth-section').classList.add('show');
  HeritageApp.showToast(T('queue.registeredToast', { n: generalQueue.length }));
}

function renderBooths() {
  const grid = document.getElementById('booth-grid');
  grid.innerHTML = booths.map(b => {
    const isSelected = selectedBooth && selectedBooth.num === b.num;
    const cls = ['booth', b.status, isSelected ? 'selected' : ''].filter(Boolean).join(' ');
    return `<div class="${cls}" data-num="${b.num}" onclick="selectBooth(${b.num})">
      <div class="booth-num">${b.num}</div>
      <div class="booth-name">${T('queue.boothWord')} ${b.num}</div>
      <div class="booth-purpose">${T('queue.boothName')}</div>
    </div>`;
  }).join('');
}

function selectBooth(num) {
  const booth = booths.find(b => b.num === num);
  if (!booth) return;

  if (booth.status === 'occupied') {
    HeritageApp.showToast(T('queue.boothOccupied', { n: num }));
    return;
  }

  selectedBooth = booth;
  renderBooths();
  document.getElementById('generate-section').classList.add('show');
}

function proceedToGenerate() {
  if (!selectedBooth) {
    HeritageApp.showToast(T('queue.chooseFirst'));
    return false;
  }
  HeritageApp.saveState('selected_booth', selectedBooth);
  // let the <a href="generate-ticket.html"> navigate normally
}

renderBooths();
