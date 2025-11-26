(function () {
    'use strict';

    // ---------- Utility & Data ----------
    var inventory = { wood: 0, stick: 0, iron_ore: 0, iron_ingot: 0, pickaxe: 0 };

    var items = {
        wood: { name: 'Дерево', craftingTime: 1000, requiredItems: [], failProbability: 0.05 },
        stick: { name: 'Палка', craftingTime: 1200, requiredItems: ['wood'], failProbability: 0.05 },
        iron_ore: { name: 'Железная руда', craftingTime: 1500, requiredItems: [], failProbability: 0.08 },
        iron_ingot: { name: 'Железный слиток', craftingTime: 2000, requiredItems: ['iron_ore'], failProbability: 0.15 },
        pickaxe: { name: 'Кирка', craftingTime: 2500, requiredItems: ['stick', 'iron_ingot'], failProbability: 0.12 }
    };

    var logEl = null;
    var invEl = null;

    function log(msg) {
        if (!logEl) return;
        var time = new Date().toLocaleTimeString();
        var p = document.createElement('div');
        p.textContent = '[' + time + '] ' + msg;
        logEl.insertBefore(p, logEl.firstChild);
    }

    function updateInventoryUI() {
        if (!invEl) return;
        invEl.innerHTML = '';
        Object.keys(inventory).forEach(function (key) {
            var div = document.createElement('div');
            div.className = 'item';
            div.innerHTML =
                '<div><strong>' + items[key].name + '</strong></div>' +
                '<div>Кол-во: <span class="count">' + inventory[key] + '</span></div>';
            invEl.appendChild(div);
        });
    }

    // ---------- Resolve: job() ----------
    function job() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve('работа сделана');
            }, 2000);
        });
    }

    // ---------- getData factory ----------
    function getData(errorProbability, baseStr) {
        var local = 'Синтетические данные: ' + String(baseStr);
        return function (num) {
            var parsed = Number(num);
            if (Number.isNaN(parsed)) {
                return null;
            }
            var rnd = Math.random();
            if (rnd < errorProbability) {
                return null;
            }
            return local;
        };
    }

    // ---------- Craft ----------
    function craftOne(itemKey) {
        return new Promise(function (resolve) {
            var def = items[itemKey];
            log('Начало создания: ' + def.name);

            setTimeout(function () {
                var fail = Math.random() < def.failProbability;

                if (fail) {
                    log('Неудача при создании: ' + def.name);
                    resolve({ success: false, item: itemKey });
                } else {
                    inventory[itemKey] += 1;
                    updateInventoryUI();
                    log('Успех: ' + def.name);
                    resolve({ success: true, item: itemKey });
                }
            }, def.craftingTime);
        });
    }

    async function craftWithDependencies(itemKey) {
        var def = items[itemKey];

        if (!def.requiredItems || def.requiredItems.length === 0) {
            return craftOne(itemKey);
        }

        var needed = [];

        def.requiredItems.forEach(function (req) {
            if (inventory[req] < 1) {
                needed.push(req);
            }
        });

        for (var i = 0; i < needed.length; i++) {
            var dep = needed[i];
            log('Создание зависимости: ' + items[dep].name);
            var result = await craftWithDependencies(dep);

            if (!result.success) {
                log('Зависимость не создана: ' + items[dep].name);
                return { success: false, item: itemKey };
            }
        }

        def.requiredItems.forEach(function (req) {
            inventory[req] -= 1;
        });

        updateInventoryUI();
        return craftOne(itemKey);
    }

    // ---------- DOM ----------
    document.addEventListener('DOMContentLoaded', function () {
        logEl = document.getElementById('craftLog');
        invEl = document.getElementById('inventory');

        updateInventoryUI();
        log('Система крафта готова');

        // Resolve
        var jobBtn = document.getElementById('jobBtn');
        var jobOutput = document.getElementById('jobOutput');

        jobBtn.addEventListener('click', function () {
            jobOutput.textContent = 'Выполняется...';
            job().then(function (msg) {
                jobOutput.textContent = msg;
            });
        });

        // getData
        var getDataBtn = document.getElementById('getDataBtn');
        var getDataOutput = document.getElementById('getDataOutput');

        getDataBtn.addEventListener('click', function () {
            var prob = parseFloat(document.getElementById('prob').value);
            var dataStr = document.getElementById('dataStr').value;
            var arg = document.getElementById('numArg').value;

            if (isNaN(prob) || prob < 0 || prob > 1) prob = 0.5;

            var fn = getData(prob, dataStr);
            var result = fn(arg);

            getDataOutput.textContent = result === null
                ? 'Результат: null'
                : 'Результат: ' + result;
        });

        // Craft buttons
        document.querySelectorAll('.craftBtn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.dataset.item;
                craftWithDependencies(item);
            });
        });
    });
})();