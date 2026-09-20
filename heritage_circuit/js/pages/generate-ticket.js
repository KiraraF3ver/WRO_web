const outfitCatalog = {
  nhat_binh: {
    name: "Nhật Bình Phượng Hoàng",
    image: "images/nhat_binh_hero.png",
    colors: [
      { name: "Đỏ Son — Imperial Red", hex: "#a91f2e" },
      { name: "Chàm — Indigo Trim", hex: "#1f3a5c" },
      { name: "Vàng Kim — Gold Trim", hex: "#c49a2e" }
    ]
  },
  giao_linh: {
    name: "Giao Lĩnh Lục Trúc",
    image: "images/giao_linh_hero.png",
    colors: [
      { name: "Lục Trà — Tea Green", hex: "#8fae7f" },
      { name: "Ngà — Ivory Underlayer", hex: "#e4e8d3" },
      { name: "Trúc Vàng — Bamboo Gold", hex: "#bd9a4c" }
    ]
  },
  ngu_than: {
    name: "Ngũ Thân Vân Lam",
    image: "images/ngu_than_hero.png",
    colors: [
      { name: "Lam Sương — Dusty Blue", hex: "#8fa0b3" },
      { name: "Kem — Cream Underskirt", hex: "#e8dfc9" },
      { name: "Ngọc Trai — Pearl Trim", hex: "#c3b89c" }
    ]
  }
};

const settingCatalog = {
  cung_dinh_hue: { name: "Cung Đình Huế", image: "images/setting-cung-dinh-hue.png" }
};

const selectedBooth = HeritageApp.loadState('selected_booth');

function T(key, vars) {
  let s = (typeof HeritageI18n !== 'undefined') ? HeritageI18n.t(key) : key;
  if (vars) { Object.keys(vars).forEach(k => { s = s.replace('{' + k + '}', vars[k]); }); }
  return s;
}

function populateColours(outfitKey) {
  const select = document.getElementById('select-colour');
  if (!outfitKey || !outfitCatalog[outfitKey]) {
    select.innerHTML = '<option value="">' + T('generate.select') + '</option>';
    select.disabled = true;
    return;
  }
  select.disabled = false;
  const outfit = outfitCatalog[outfitKey];
  select.innerHTML = '<option value="">' + T('generate.select') + '</option>' +
    outfit.colors.map(c => `<option value="${c.hex}" data-name="${c.name}">${c.name}</option>`).join('');
}

function onOutfitChange() {
  const key = document.getElementById('select-outfit').value;
  const frame = document.getElementById('preview-frame');
  const img = document.getElementById('preview-image');
  const caption = document.getElementById('preview-name');

  if (key && outfitCatalog[key]) {
    const outfit = outfitCatalog[key];
    img.src = outfit.image;
    img.alt = outfit.name;
    frame.classList.add('has-image');
    caption.textContent = outfit.name;
  } else {
    frame.classList.remove('has-image');
    caption.textContent = T('generate.noOutfit');
  }
  populateColours(key);
  document.getElementById('colour-dot').style.background = 'transparent';
  document.getElementById('colour-label').textContent = '';
  updateSummary();
}

function onSettingChange() {
  const key = document.getElementById('select-setting').value;
  const frame = document.getElementById('setting-frame');
  const img = document.getElementById('setting-image');
  const caption = document.getElementById('setting-name');

  if (key && settingCatalog[key]) {
    const setting = settingCatalog[key];
    img.src = setting.image;
    img.alt = setting.name;
    frame.classList.add('has-image');
    caption.textContent = setting.name;
  } else {
    frame.classList.remove('has-image');
    caption.textContent = T('generate.noSetting');
  }
  updateSummary();
}

function updateSummary() {
  const key = document.getElementById('select-outfit').value;
  const outfit = outfitCatalog[key];
  const size = document.getElementById('select-size').value;
  const form = document.getElementById('select-form').value;
  const colourSelect = document.getElementById('select-colour');
  const colourOption = colourSelect.options[colourSelect.selectedIndex];
  const colourName = colourOption ? colourOption.getAttribute('data-name') : '';
  const colourHex = (colourOption && colourOption.value) ? colourOption.value : 'transparent';

  document.getElementById('colour-dot').style.background = colourHex;
  document.getElementById('colour-label').textContent = colourName || '';

  setSummaryField('sum-outfit', outfit ? outfit.name : '');
  setSummaryField('sum-size', size);
  setSummaryField('sum-colour', colourName);
  setSummaryField('sum-form', form ? (form === 'Nữ' ? T('generate.formFemale') : T('generate.formMale')) : '');

  const settingKey = document.getElementById('select-setting').value;
  const setting = settingCatalog[settingKey];
  setSummaryField('sum-setting', setting ? setting.name : '');

  document.getElementById('qr-card').classList.remove('show');
  document.getElementById('generate-btn').style.display = '';
}

function setSummaryField(id, value) {
  const el = document.getElementById(id);
  if (value) { el.textContent = value; el.classList.remove('unset'); } 
  else { el.textContent = T('generate.unset'); el.classList.add('unset'); }
}

function allFieldsSet() {
  return document.getElementById('select-outfit').value &&
         document.getElementById('select-size').value &&
         document.getElementById('select-colour').value &&
         document.getElementById('select-form').value &&
         document.getElementById('select-setting').value;
}

function generateTicket() {
  if (!selectedBooth) { HeritageApp.showToast(T('generate.chooseBoothFirst')); return; }
  if (!allFieldsSet()) { HeritageApp.showToast(T('generate.selectAll')); return; }

  const key = document.getElementById('select-outfit').value;
  const size = document.getElementById('select-size').value;
  const form = document.getElementById('select-form').value;
  const settingKey = document.getElementById('select-setting').value;
  const colourSelect = document.getElementById('select-colour');
  
  const colorIndex = colourSelect.selectedIndex - 1; 
  const ticketId = HeritageApp.randomFourDigitId();
  const timeframe = fifteenMinuteWindow();

  // Compressed payload for faster scanning
  const compressedTicket = {
    i: ticketId,
    b: selectedBooth.num,
    o: key,
    s: size,
    c: colorIndex,
    f: form === 'Nữ' ? 1 : 0, 
    st: settingKey,
    t: timeframe
  };

  const qrPayload = JSON.stringify(compressedTicket);
  renderQrCode(qrPayload);

  document.getElementById('qr-id').textContent = '#' + ticketId;
  const timeEl = document.getElementById('qr-time');
  if (timeEl) timeEl.textContent = T('generate.timeframe') + ': ' + timeframe;
  document.getElementById('qr-card').classList.add('show');
  document.getElementById('qr-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('generate-btn').style.display = 'none';
  HeritageApp.showToast(T('generate.ticketGenerated'));
}

function fifteenMinuteWindow() {
  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const later = new Date(now.getTime() + 15 * 60 * 1000);
  const fmt = d => pad(d.getHours()) + ':' + pad(d.getMinutes());
  return fmt(now) + ' - ' + fmt(later);
}

function renderQrCode(text) {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  if (typeof QRCode === 'undefined' || !QRCode.toCanvas) {
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (ctx) { canvas.width = 200; canvas.height = 200; ctx.fillStyle = '#232735'; ctx.font = '12px monospace'; ctx.fillText('QR lib not loaded', 20, 100); }
    return;
  }
  QRCode.toCanvas(canvas, text, {
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'M', // Lowered to M for less dense dots
    color: { dark: '#232735', light: '#ffffff' }
  }, function (err) { if (err) { console.error('QR error', err); } });
}

if (selectedBooth) { document.getElementById('booth-note').textContent = T('generate.boothNote', { n: selectedBooth.num, name: T('queue.boothName') }); } 
else { document.getElementById('booth-note').textContent = T('generate.noBoothNote'); }
populateColours(null);
updateSummary();