function convertTemperature(value, direction) {
    if (direction === 'toC') {
      return `${((value - 32) * 5/9)} C`;
    } else if (direction === 'toF') {
      return `${(value * 9/5 + 32)} F`;
    } else {
      return 'Неверное направление';
    }
  }

  console.log('Задание 1. Конвертация температуры');
  console.log(convertTemperature(32, 'toC'));
  console.log(convertTemperature(10, 'toF'));

  function triangle(a, b, c) {
    if (a + b > c && a + c > b && b + c > a) {
      const perimeter = a + b + c;
      const s = perimeter / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const ratio = perimeter / area;
      console.log('треугольник существует');
      console.log('периметр =', perimeter);
      console.log('Площадь =', area);
      console.log('Соотношение =', ratio);
    } else {
      console.log('треугольника не существует');
    }
  }

  console.log('Задание 1. Треугольник');
  triangle(3, 4, 5);
  triangle(1, 2, 3);

  console.log('Задание 2. Fizz-Buzz');
  const n = 15;
  for (let i = 0; i <= n; i++) {
    let output = '';
    if (i % 2 === 0) output += 'buzz';
    if (i % 2 !== 0) output += 'fizz';
    if (i % 5 === 0) output += (output ? ' ' : '') + 'fizz buzz';
    console.log(i, output);
  }

  console.log('Задание 3. Елка');
  function tree(height = 10) {
    let output = '';
    for (let i = 1; i <= height; i++) {
      output += (i % 2 ? '*'.repeat(i) : '#'.repeat(i)) + '\n';
    }
    output += '||';
    console.log(output);
  }
  tree();

  console.log('Задание 3. Деление');
  function checkDivision(n, x, y) {
    console.log(`n = ${n}, x = ${x}, y = ${y} =>`, n % x === 0 && n % y === 0);
  }
  checkDivision(3, 1, 3);
  checkDivision(12, 2, 6);
  checkDivision(100, 5, 3);
  checkDivision(12, 7, 5);

  function countSandwiches(ingredients) {
    return Math.min(Math.floor(ingredients.bread / 2), ingredients.cheese);
  }
  console.log('Задание 4. Сэндвичи');
  console.log(countSandwiches({bread: 5, cheese: 6})); // 2

  function absValue(x) {
    return x < 0 ? -x : x;
  }
  console.log('Задание 5. Абсолютное значение');
  console.log(absValue(-2));
  console.log(absValue(100));
  console.log(absValue(0));

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  console.log('Задание 6. Случайные числа');
  console.log(randomNumber(0, 10));
  console.log(randomNumber(-10, 10));

  function sampleArray(arr, count) {
    let result = [];
    for (let i = 0; i < count; i++) {
      result.push(arr[randomNumber(0, arr.length - 1)]);
    }
    return result;
  }
  console.log('Задание 7. Случайные значения массива');
  console.log(sampleArray([1,2,3,4], 2));
  console.log(sampleArray([1,2,3,4], 3));

  function myFilterArray(arr, filterFn) {
    const result = [];
    for (let item of arr) {
      if (filterFn(item)) result.push(item);
    }
    return result;
  }
  function isFirstV(name) {
    return name.startsWith('V');
  }
  console.log('Задание 8. Фильтрация массива');
  console.log(myFilterArray(['Short', 'VeryLong'], isFirstV));

  function toBeCloseTo(num1, num2) {
    return Math.abs(num1 - num2) < Number.EPSILON;
  }
  console.log('Задание 9. Сравнение чисел с плавающей запятой');
  console.log(toBeCloseTo(0.1 + 0.2, 0.3));
  console.log(toBeCloseTo(0.1 + 0.2, 0.3000000001));