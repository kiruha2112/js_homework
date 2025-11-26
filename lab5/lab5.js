var CONFIG = {
    imagesUrl: 'http://labcolor.space/images',
    tempUrl: 'http://labcolor.space/temp',
    maxRetries: 3,
    retryDelay: 700
  };
  
  var themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', function () {
    var isLight = document.documentElement.classList.toggle('theme-light');
    if (!isLight) { document.documentElement.classList.add('theme-dark'); }
    try { localStorage.setItem('lab5-theme', isLight ? 'light' : 'dark'); } catch (e) {}
    themeBtn.setAttribute('aria-pressed', String(isLight));
  });
  
  var toasts = document.getElementById('toasts');
  function showToast(text, type) {
    var t = document.createElement('div');
    t.className = 'toast ' + (type === 'error' ? 'error' : 'info');
    t.setAttribute('role', 'status');
    t.innerHTML = '<div>' + text + '</div><button aria-label="Закрыть">×</button>';
    t.querySelector('button').addEventListener('click', function () { hideToast(t); });
    toasts.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    if (type !== 'error') { setTimeout(function () { hideToast(t); }, 4000); }
  }
  function hideToast(el) { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 220); }
  
  function fetchJsonWithRetry(url, opts, tries) {
    tries = tries || 1;
    return fetch(url, opts).then(function (res) {
      if (!res.ok) { throw new Error('HTTP ' + res.status); }
      return res.json();
    }).catch(function (err) {
      if (tries < CONFIG.maxRetries) {
        return new Promise(function (resolve) {
          setTimeout(function () { resolve(fetchJsonWithRetry(url, opts, tries + 1)); }, CONFIG.retryDelay);
        });
      }
      throw err;
    });
  }
  
  var gallery = document.getElementById('gallery');
  var gLoader = document.getElementById('gLoader');
  var gEmpty = document.getElementById('gEmpty');
  var reloadBtn = document.getElementById('reload');
  
  function renderGallery(items) {
    gallery.innerHTML = '';
    items.forEach(function (it) {
      var card = document.createElement('div');
      card.className = 'card';
  
      var img = document.createElement('img');
      img.className = 'img';
      img.src = it.url;
      img.alt = it.alt || 'image';
  
      var cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = it.description || 'Описание отсутствует';
  
      card.appendChild(img);
      card.appendChild(cap);
      gallery.appendChild(card);
    });
  }
  
  function loadGallery() {
    gallery.innerHTML = '';
    gEmpty.hidden = true;
    gLoader.hidden = false;
    fetchJsonWithRetry(CONFIG.imagesUrl, { cache: 'no-store' }, 1).then(function (data) {
      gLoader.hidden = true;
      if (!Array.isArray(data) || data.length === 0) {
        gEmpty.hidden = false;
        if (!Array.isArray(data)) { showToast('Ошибка данных от сервера', 'error'); }
        return;
      }
      renderGallery(data);
    }).catch(function () {
      gLoader.hidden = true;
      showToast('Не удалось загрузить изображения', 'error');
    });
  }
  reloadBtn.addEventListener('click', loadGallery);
  document.addEventListener('DOMContentLoaded', loadGallery);
  
  var form = document.getElementById('tempForm');
  var room = document.getElementById('room');
  var temperature = document.getElementById('temperature');
  var send = document.getElementById('send');
  
  function setErr(elem, text) {
    var id = elem.getAttribute('aria-describedby');
    if (!id) { return; }
    var el = document.getElementById(id);
    if (!el) { return; }
    if (!text) { el.hidden = true; el.textContent = ''; } else { el.hidden = false; el.textContent = text; }
  }
  
  room.addEventListener('blur', function () { setErr(room, room.checkValidity() ? '' : 'Поле обязательно'); });
  temperature.addEventListener('blur', function () { setErr(temperature, temperature.checkValidity() ? '' : 'Поле обязательно'); });
  
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    if (!room.checkValidity()) { setErr(room, 'Поле обязательно'); ok = false; }
    if (!temperature.checkValidity()) { setErr(temperature, 'Поле обязательно'); ok = false; }
    if (!ok) { (room.checkValidity() ? temperature : room).focus(); return; }
  
    send.disabled = true;
    var payload = {
        class: room.value,
        temp: Number(temperature.value)
      };
  
    fetch(CONFIG.tempUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
    })
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        if (data.status === 'ok') {
        showToast(data.message, 'info');
        form.reset();
        } else {
        showToast(data.message, 'error');
        }
    })
    .catch(function () {
        showToast('Ошибка сети', 'error');
    })
    .finally(function () {
        send.disabled = false;
    });
}); 
