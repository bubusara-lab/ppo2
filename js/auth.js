var currentUser = null;
var modalMode = 'login';
function getUsers() { try { return JSON.parse(localStorage.getItem('wm_users') || '{}'); } catch (e) { return {}; } }
function saveUsers(u) { localStorage.setItem('wm_users', JSON.stringify(u)); }
function openModal() { document.getElementById('authModal').classList.add('open'); document.getElementById('authError').classList.remove('show'); document.getElementById('authLogin').value = ''; document.getElementById('authPassword').value = ''; }
function closeModal() { document.getElementById('authModal').classList.remove('open'); }
function switchModalTab(mode) {
  modalMode = mode;
  var tabs = document.querySelectorAll('.modal-tab');
  tabs[0].classList.toggle('active', mode === 'login'); tabs[1].classList.toggle('active', mode === 'register');
  document.getElementById('authSubmitBtn').textContent = mode === 'login' ? 'Войти' : 'Зарегистрироваться';
  document.getElementById('modalTitle').textContent = mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт';
  document.getElementById('authError').classList.remove('show');
}
function handleAuth() {
  var login = document.getElementById('authLogin').value.trim();
  var password = document.getElementById('authPassword').value;
  var errEl = document.getElementById('authError');
  if (!login || !password) { errEl.textContent = 'Заполните все поля'; errEl.classList.add('show'); return; }
  var users = getUsers();
  if (modalMode === 'register') {
    if (users[login]) { errEl.textContent = 'Этот логин уже занят'; errEl.classList.add('show'); return; }
    users[login] = password; saveUsers(users); loginUser(login);
  } else {
    if (!users[login] || users[login] !== password) { errEl.textContent = 'Неверный логин или пароль'; errEl.classList.add('show'); return; }
    loginUser(login);
  }
}
function loginUser(login) {
  currentUser = login; closeModal();
  var btn = document.getElementById('headerAuthBtn');
  btn.textContent = login + ' · Выйти'; btn.classList.add('active'); btn.onclick = logoutUser;
  updateRecsVisibility();
}
function logoutUser() {
  currentUser = null;
  var btn = document.getElementById('headerAuthBtn');
  btn.textContent = 'Войти'; btn.classList.remove('active'); btn.onclick = openModal;
  updateRecsVisibility();
}
document.getElementById('authModal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
