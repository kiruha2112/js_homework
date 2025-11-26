'use strict';

function VersionManager(initial) {
  if (!initial || initial.trim() === '') initial = '0.0.1';
  const parts = initial.split('.');
  if (
    parts.length !== 3 ||
    parts.some(p => !/^\d+$/.test(p))
  ) {
    throw new Error('Некорректный формат версии!');
  }

  this._major = parseInt(parts[0], 10);
  this._minor = parseInt(parts[1], 10);
  this._patch = parseInt(parts[2], 10);
  this._history = [];
}

VersionManager.prototype._pushHistory = function() {
  this._history.push([this._major, this._minor, this._patch]);
};

VersionManager.prototype.major = function() {
  this._pushHistory();
  this._major += 1;
  this._minor = 0;
  this._patch = 0;
  return this;
};

VersionManager.prototype.minor = function() {
  this._pushHistory();
  this._minor += 1;
  this._patch = 0;
  return this;
};

VersionManager.prototype.patch = function() {
  this._pushHistory();
  this._patch += 1;
  return this;
};

VersionManager.prototype.rollback = function() {
  if (this._history.length === 0) {
    throw new Error('Невозможно выполнить откат!');
  }
  const prev = this._history.pop();
  [this._major, this._minor, this._patch] = prev;
  return this;
};

VersionManager.prototype.release = function() {
  return `${this._major}.${this._minor}.${this._patch}`;
};

// --- UI Binding ---
document.addEventListener('DOMContentLoaded', () => {
  let vm = null;
  const vi = document.getElementById('version-input');
  const vcreate = document.getElementById('version-create');
  const vcontrols = document.getElementById('version-controls');
  const vout = document.getElementById('version-output');

  function renderVersion() {
    vout.textContent = vm.release();
  }

  vcreate.addEventListener('click', () => {
    try {
      vm = new VersionManager(vi.value.trim());
      vi.value = '';
      vcontrols.style.display = 'block';
      renderVersion();
    } catch (e) {
      alert(e.message);
    }
  });

  document.getElementById('v-major').addEventListener('click', () => {
    try { vm.major(); renderVersion(); } catch(e) { alert(e.message); }
  });
  document.getElementById('v-minor').addEventListener('click', () => {
    try { vm.minor(); renderVersion(); } catch(e) { alert(e.message); }
  });
  document.getElementById('v-patch').addEventListener('click', () => {
    try { vm.patch(); renderVersion(); } catch(e) { alert(e.message); }
  });
  document.getElementById('v-rollback').addEventListener('click', () => {
    try { vm.rollback(); renderVersion(); } catch(e) { alert(e.message); }
  });
  document.getElementById('v-release').addEventListener('click', () => {
    try { alert(vm.release()); } catch(e) { alert(e.message); }
  });
});


  class Rectangle {
    constructor(width, height) {
      this.width = Number(width);
      this.height = Number(height);
    }
  
    area() {
      return this.width * this.height;
    }
  
    perimeter() {
      return 2 * (this.width + this.height);
    }
  }
  
  class Square extends Rectangle {
    constructor(side) {
      super(side, side);
    }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const rw = document.getElementById('rect-w');
    const rh = document.getElementById('rect-h');
    const rout = document.getElementById('rect-output');
  
    function renderRect(type, value, kind) {
      rout.textContent = `Тип: ${kind}\n${type}: ${value}`;
    }
  
    document.getElementById('rect-calc-area').addEventListener('click', function () {
      const w = Number(rw.value);
      const h = Number(rh.value);
      if (!isFinite(w) || !isFinite(h)) {
        rout.textContent = 'Введите числовые ширину и высоту';
        return;
      }
      const obj = (w === h) ? new Square(w) : new Rectangle(w, h);
      renderRect('Площадь', obj.area(), (obj instanceof Square) ? 'Квадрат' : 'Прямоугольник');
    });
  
    document.getElementById('rect-calc-perim').addEventListener('click', function () {
      const w = Number(rw.value);
      const h = Number(rh.value);
      if (!isFinite(w) || !isFinite(h)) {
        rout.textContent = 'Введите числовые ширину и высоту';
        return;
      }
      const obj = (w === h) ? new Square(w) : new Rectangle(w, h);
      renderRect('Периметр', obj.perimeter(), (obj instanceof Square) ? 'Квадрат' : 'Прямоугольник');
    });
  });
  class Temperature {
    constructor(celsius) {
      this._validate(celsius);
      this._c = Number(celsius);
    }
  
    _validate(value) {
      const v = Number(value);
      if (!isFinite(v) || v < -273.16 || v > 1.41e32) {
        throw new Error('Неверное значение температуры');
      }
    }
  
    get celsius() {
      return this._c;
    }
  
    set celsius(val) {
      this._validate(val);
      this._c = Number(val);
    }
  
    toKelvin() {
      return Math.round((this._c + 273.15) * 100) / 100;
    }
  
    toFahrenheit() {
      return Math.round(((this._c * 9/5) + 32) * 100) / 100;
    }
  
    toString() {
      return `${this.toKelvin()} K (${this._c.toFixed(2)} °C)`;
    }
  
    static add(t1, t2) {
      if (!(t1 instanceof Temperature) || !(t2 instanceof Temperature)) {
        throw new Error('Аргументы должны быть Temperature');
      }
      return new Temperature(t1.celsius + t2.celsius);
    }
  
    static sub(t1, t2) {
      if (!(t1 instanceof Temperature) || !(t2 instanceof Temperature)) {
        throw new Error('Аргументы должны быть Temperature');
      }
      return new Temperature(t1.celsius - t2.celsius);
    }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const t1 = document.getElementById('t1');
    const t2 = document.getElementById('t2');
    const t1display = document.getElementById('t1-display');
    const t2display = document.getElementById('t2-display');
    const tresult = document.getElementById('t-result');
  
    function formatTemp(tempObj, unit) {
      if (!(tempObj instanceof Temperature)) return '—';
      switch (unit) {
        case 'K': return tempObj.toKelvin().toFixed(2) + ' K';
        case 'F': return tempObj.toFahrenheit().toFixed(2) + ' °F';
        default: return tempObj.celsius.toFixed(2) + ' °C';
      }
    }
  
    function updateDisplays() {
      try {
        const a = new Temperature(Number(t1.value));
        const b = new Temperature(Number(t2.value));
        const u1 = document.querySelector('input[name="unit1"]:checked').value;
        const u2 = document.querySelector('input[name="unit2"]:checked').value;
        t1display.textContent = formatTemp(a, u1);
        t2display.textContent = formatTemp(b, u2);
      } catch (e) {
        if (t1.value === '') t1display.textContent = '';
        if (t2.value === '') t2display.textContent = '';
      }
    }
  
    t1.addEventListener('input', updateDisplays);
    t2.addEventListener('input', updateDisplays);
    document.getElementsByName('unit1').forEach(el => el.addEventListener('change', updateDisplays));
    document.getElementsByName('unit2').forEach(el => el.addEventListener('change', updateDisplays));
  
    document.getElementById('t-add').addEventListener('click', function () {
      try {
        const A = new Temperature(Number(t1.value));
        const B = new Temperature(Number(t2.value));
        const R = Temperature.add(A, B);
        tresult.textContent = 'Результат (°C): ' + R.celsius.toFixed(2) + '\n' + R.toString();
      } catch (e) {
        alert(e.message);
      }
    });
  
    document.getElementById('t-sub').addEventListener('click', function () {
      try {
        const A = new Temperature(Number(t1.value));
        const B = new Temperature(Number(t2.value));
        const R = Temperature.sub(A, B);
        tresult.textContent = 'Результат (°C): ' + R.celsius.toFixed(2) + '\n' + R.toString();
      } catch (e) {
        alert(e.message);
      }
    });
  });
  class Subject {
    constructor() {
      this.observers = [];
    }
  
    subscribe(observer) {
      this.observers.push(observer);
    }
  
    unsubscribe(observer) {
      this.observers = this.observers.filter(o => o !== observer);
    }
  
    notify(data) {
      this.observers.forEach(observer => observer.update(data));
    }
  }
  
  class RpsObserver {
    constructor(targets) {
      this.targets = targets;
      this.p1wins = 0;
      this.p2wins = 0;
      this.rounds = 0;
    }
  
    update(event) {
      this.rounds += 1;
      const p1 = event.player1;
      const p2 = event.player2;
  
      const win = RpsObserver._winner(p1, p2);
      if (win === 1) this.p1wins++;
      if (win === 2) this.p2wins++;
  
      this.targets.history.insertAdjacentHTML(
        'beforeend',
        `<div>Раунд ${this.rounds}: ${p1} — ${p2}${win===1? ' → Игрок 1' : win===2? ' → Игрок 2' : ' → Ничья'}</div>`
      );
      this.targets.history.scrollTop = this.targets.history.scrollHeight;
      this.targets.p1wins.textContent = String(this.p1wins);
      this.targets.p2wins.textContent = String(this.p2wins);
      this.targets.rounds.textContent = String(this.rounds);
    }
  
    static _winner(p1, p2) {
      const map = { 'Камень': 0, 'Ножницы': 1, 'Бумага': 2 };
      if (!map.hasOwnProperty(p1) || !map.hasOwnProperty(p2)) return 0;
      if (p1 === p2) return 0;
      if ((map[p1] + 1) % 3 === map[p2]) return 2;
      return 1;
    }
  }
  
  class RpsController {
    constructor(subject) {
      this.subject = subject;
      this.es = null;
    }
  
    start(url) {
      if (this.es) return;
      this.es = new EventSource(url);
      this.es.addEventListener('round', ev => {
        try {
          const data = JSON.parse(ev.data);
          this.subject.notify(data);
        } catch (e) {
          console.error(e);
        }
      });
      this.es.onerror = e => {
        console.error('SSE error', e);
      };
    }
  
    stop() {
      if (!this.es) return;
      this.es.close();
      this.es = null;
    }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const start = document.getElementById('rps-start');
    const stop = document.getElementById('rps-stop');
    const historyEl = document.getElementById('rps-history');
    const p1winsEl = document.getElementById('p1-wins');
    const p2winsEl = document.getElementById('p2-wins');
    const roundsEl = document.getElementById('round-count');
  
    const subj = new Subject();
    const observer = new RpsObserver({
      history: historyEl,
      p1wins: p1winsEl,
      p2wins: p2winsEl,
      rounds: roundsEl
    });
    subj.subscribe(observer);
  
    const controller = new RpsController(subj);
    const SSE_URL = 'http://95.163.242.125:80/rps/stream';
  
    start.addEventListener('click', () => {
      try {
        controller.start(SSE_URL);
        start.disabled = true;
        stop.disabled = false;
      } catch (e) {
        alert('Ошибка при запуске SSE: ' + e.message);
      }
    });
  
    stop.addEventListener('click', () => {
      controller.stop();
      start.disabled = false;
      stop.disabled = true;
    });
  });