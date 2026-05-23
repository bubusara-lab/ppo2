/**
 * ui.js — вкладки, радио-кнопки, тема, рекомендации
 */

var lastRecs = [];

function toggleTheme() {
  var html  = document.documentElement;
  var icon  = document.getElementById('themeIcon');
  var label = document.getElementById('themeLabel');
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    icon.textContent  = '🌙';
    label.textContent = 'Тёмная';
    localStorage.setItem('wm_theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    icon.textContent  = '☀️';
    label.textContent = 'Светлая';
    localStorage.setItem('wm_theme', 'dark');
  }
}

(function () {
  if (localStorage.getItem('wm_theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('themeIcon').textContent  = '🌙';
      document.getElementById('themeLabel').textContent = 'Тёмная';
    });
  }
})();

function switchTab(tab) {
  var tabs = document.querySelectorAll('.tab');
  tabs[0].classList.toggle('active', tab === 'imt');
  tabs[1].classList.toggle('active', tab === 'calories');
  document.getElementById('tabImt').classList.toggle('hidden', tab !== 'imt');
  document.getElementById('tabCalories').classList.toggle('hidden', tab !== 'calories');
}

function selectRadio(el) {
  var group = el.dataset.group;
  document.querySelectorAll('[data-group="' + group + '"]').forEach(function (b) { b.classList.remove('selected'); });
  el.classList.add('selected');
}

function getRadioValue(group) {
  var el = document.querySelector('[data-group="' + group + '"].selected');
  return el ? el.dataset.value : null;
}

function updateRecsVisibility() {
  var locked  = document.getElementById('recsLocked');
  var visible = document.getElementById('recsVisible');
  var badge   = document.getElementById('recsBadge');
  if (!locked || !visible) return;
  if (currentUser && lastRecs.length > 0) {
    locked.classList.add('hidden');
    visible.classList.remove('hidden');
    visible.innerHTML = lastRecs.map(function (r) {
      return '<div class="rec-item"><div class="rec-icon">' + r.icon + '</div><div class="rec-text"><strong>' + r.title + '</strong>' + r.text + '</div></div>';
    }).join('');
    badge.textContent = '✓ Доступно'; badge.classList.remove('locked'); badge.classList.add('free');
  } else if (currentUser) {
    locked.classList.add('hidden'); visible.classList.remove('hidden');
    visible.innerHTML = '<p style="color:var(--muted);font-size:14px;padding:16px 0;">Нажмите «Рассчитать ИМТ», чтобы увидеть рекомендации.</p>';
    badge.textContent = '✓ Доступно'; badge.classList.remove('locked'); badge.classList.add('free');
  } else {
    locked.classList.remove('hidden'); visible.classList.add('hidden');
    badge.textContent = '🔒 Требуется вход'; badge.classList.add('locked'); badge.classList.remove('free');
  }
}
