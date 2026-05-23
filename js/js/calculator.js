function calculateIMT() {
  var h = parseFloat(document.getElementById('height').value);
  var w = parseFloat(document.getElementById('weight').value);
  var age = parseFloat(document.getElementById('age').value);
  var build = getRadioValue('build');
  if (!h || !w || h < 100 || h > 250 || w < 30 || w > 300) { alert('Проверьте данные: рост (100–250 см) и вес (30–300 кг)'); return; }
  if (!age || age < 10 || age > 120) { alert('Проверьте возраст (10–120 лет)'); return; }
  var hm = h / 100;
  var imt = w / (hm * hm);
  var imtR = Math.round(imt * 10) / 10;
  var corr = { thin: -0.05, normal: 0, wide: 0.07 };
  var ideal = Math.round(22.5 * hm * hm * (1 + (corr[build] || 0)));
  var thr = { thin: { low:17.5, high:23.5 }, normal: { low:18.5, high:25 }, wide: { low:19.5, high:27 } }[build] || { low:18.5, high:25 };
  var cat, cls;
  if (imt < thr.low) { cat = 'Дефицит'; cls = 'imt-underweight'; }
  else if (imt < thr.high) { cat = 'Норма'; cls = 'imt-normal'; }
  else if (imt < 30) { cat = 'Избыток'; cls = 'imt-overweight'; }
  else { cat = 'Ожирение'; cls = 'imt-obese'; }
  document.getElementById('imtValue').textContent = imtR;
  document.getElementById('imtValue').className = 'stat-value ' + cls;
  document.getElementById('imtCategory').textContent = cat;
  document.getElementById('imtCategory').className = 'stat-value stat-category ' + cls;
  document.getElementById('idealWeight').textContent = ideal;
  document.getElementById('scalePointer').style.left = Math.min(100, Math.max(0, ((imt-15)/25)*100)) + '%';
  document.getElementById('imtResults').classList.add('visible');
  lastRecs = buildRecs(cat, build, age, w, ideal);
  updateRecsVisibility();
}

function buildRecs(cat, build, age, w, ideal) {
  var diff = Math.round(w - ideal);
  var r = [];
  if (cat === 'Норма') {
    r.push({ icon:'✅', title:'Поддержание веса', text:'Ваш вес в норме. Придерживайтесь сбалансированного питания и регулярной активности.' });
    r.push({ icon:'🥗', title:'Питание', text:'Разнообразный рацион: белок, клетчатка, ненасыщенные жиры. Избегайте ультраобработанных продуктов.' });
    r.push({ icon:'🏃', title:'Активность', text:'Не менее 150 минут умеренной нагрузки в неделю + 2 силовые тренировки.' });
  } else if (cat === 'Дефицит') {
    r.push({ icon:'⚖️', title:'Набор веса', text:'Рекомендуется набрать ~' + Math.abs(diff) + ' кг. Постепенно: +300–500 ккал/день сверх нормы.' });
    r.push({ icon:'🍖', title:'Питание', text:'Больше белка (1.8–2.2 г/кг) и сложных углеводов: крупы, хлеб, бобовые, картофель.' });
    r.push({ icon:'💪', title:'Тренировки', text:'Силовые упражнения 3–4 раза в неделю для набора мышечной массы.' });
    if (age < 20) r.push({ icon:'👨‍⚕️', title:'Консультация', text:'При значительном дефиците рекомендуется обратиться к врачу или диетологу.' });
  } else if (cat === 'Избыток') {
    r.push({ icon:'📉', title:'Снижение веса', text:'Желательно снизить вес на ' + diff + ' кг. Темп: 0.5–1 кг/нед (дефицит ~500 ккал/день).' });
    r.push({ icon:'🥦', title:'Питание', text:'Меньше быстрых углеводов и насыщенных жиров. Больше овощей, белка, клетчатки.' });
    r.push({ icon:'🚶', title:'Активность', text:'Начните с ходьбы 30 мин/день. Плавание и велосипед — отличный старт.' });
  } else {
    r.push({ icon:'🚨', title:'Снижение веса — приоритет', text:'Рекомендуется снизить вес на ' + diff + ' кг. Необходима консультация с врачом.' });
    r.push({ icon:'🥗', title:'Питание', text:'Дефицит 500–750 ккал/день. Исключите сладкие напитки, алкоголь, ультраобработанные продукты.' });
    r.push({ icon:'🏊', title:'Бережная активность', text:'Ходьба и плавание — суставы при лишнем весе требуют щадящего подхода.' });
    r.push({ icon:'👨‍⚕️', title:'Медицинское наблюдение', text:'Проверьте сахар, холестерин, давление. Проконсультируйтесь с терапевтом или эндокринологом.' });
  }
  if (build === 'wide') r.push({ icon:'ℹ️', title:'Учёт телосложения', text:'Для гиперстеников допустимый диапазон ИМТ выше стандартного — учтено в расчёте.' });
  if (build === 'thin') r.push({ icon:'ℹ️', title:'Учёт телосложения', text:'Для астеников норма ИМТ ниже стандартной — учтено в расчёте идеального веса.' });
  return r;
}

function calculateCalories() {
  var h = parseFloat(document.getElementById('cHeight').value);
  var w = parseFloat(document.getElementById('cWeight').value);
  var age = parseFloat(document.getElementById('cAge').value);
  var gender = getRadioValue('cgender');
  var act = parseFloat(getRadioValue('activity'));
  if (!h || !w || h < 100 || h > 250 || w < 30) { alert('Проверьте введённые данные'); return; }
  if (!age || age < 10) { alert('Проверьте возраст'); return; }
  var bmr = gender === 'male' ? 10*w + 6.25*h - 5*age + 5 : 10*w + 6.25*h - 5*age - 161;
  var tdee = Math.round(bmr * act);
  var prot = Math.round(w * 1.8);
  var fatC = Math.round(tdee * 0.25);
  var carbC = tdee - prot*4 - fatC;
  document.getElementById('calMaintain').textContent  = tdee;
  document.getElementById('calDeficit').textContent   = Math.max(1200, tdee - 500);
  document.getElementById('calSurplus').textContent   = tdee + 300;
  document.getElementById('macroProtein').textContent = prot;
  document.getElementById('macroFat').textContent     = Math.round(fatC / 9);
  document.getElementById('macroCarbs').textContent   = Math.round(Math.max(0, carbC) / 4);
  document.getElementById('calResults').classList.add('visible');
}
