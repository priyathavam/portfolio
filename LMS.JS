// Basic app implementing: theme toggle, login (mock), localStorage books,
// add/remove books, borrow/return dates, search, filter, sort, export CSV & PDF

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, fallback) => JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback));

// ---------- state ----------
let books = load('books', []);
let currentUser = load('user', null);

// ---------- elements ----------
const loginSection = $('loginSection');
const mainSection = $('mainSection');
const loginBtn = $('loginBtn');
const loginUser = $('loginUser');
const loginPass = $('loginPass');
const logoutBtn = $('logoutBtn');
const roleLabel = $('roleLabel');
const welcome = $('welcome');

const addBookBtn = $('addBookBtn');
const titleEl = $('title');
const authorEl = $('author');
const categoryEl = $('category');
const borrowDateEl = $('borrowDate');
const returnDateEl = $('returnDate');

const searchInput = $('searchInput');
const filterCategory = $('filterCategory');
const sortSelect = $('sortSelect');

const exportCsvBtn = $('exportCsv');
const exportPdfBtn = $('exportPdf');
const themeToggle = $('themeToggle');
const themeLabel = $('themeLabel');

const bookList = $('bookList');
const bookCount = $('bookCount');

// ---------- auth (mock) ----------
function showUIForUser(user) {
  if (!user) {
    loginSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
    return;
  }
  loginSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  roleLabel.textContent = user.role === 'admin' ? 'Admin' : 'User';
  welcome.textContent = `Welcome, ${user.username} (${user.role})`;
  render();
}

loginBtn.addEventListener('click', () => {
  const u = loginUser.value.trim(); const p = loginPass.value.trim();
  if ((u==='admin' && p==='admin123') || (u==='user' && p==='user123')) {
    const role = u==='admin' ? 'admin' : 'user';
    currentUser = { username: u, role };
    save('user', currentUser);
    showUIForUser(currentUser);
  } else alert('Invalid credentials. Try admin/admin123 or user/user123');
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  save('user', null);
  showUIForUser(null);
});

// ---------- theme ----------
function setTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeLabel.textContent = isDark ? 'Dark' : 'Light';
  themeToggle.checked = isDark;
  save('theme', isDark);
}
themeToggle.addEventListener('change', () => setTheme(themeToggle.checked));
setTheme(load('theme', false));

// ---------- book logic ----------
function updateStorage() { save('books', books); bookCount.textContent = `Total Books: ${books.length}`; }

function addBook() {
  if(!titleEl.value.trim() || !authorEl.value.trim()) { alert('Fill title & author'); return; }
  const b = {
    id: Date.now(),
    title: titleEl.value.trim(),
    author: authorEl.value.trim(),
    category: categoryEl.value || 'Other',
    borrowDate: borrowDateEl.value || null,
    returnDate: returnDateEl.value || null,
    createdAt: new Date().toISOString(),
    status: borrowDateEl.value ? 'Borrowed' : 'Available'
  };
  books.push(b);
  updateStorage();
  render();
  titleEl.value='';authorEl.value='';categoryEl.value='';borrowDateEl.value='';returnDateEl.value='';
}

function removeBook(id) {
  if (!currentUser || currentUser.role !== 'admin') {
    if (!confirm('Only admin can delete. Are you admin?')) return;
  }
  books = books.filter(b => b.id !== id);
  updateStorage();
  render();
}

function toggleStatus(id) {
  books = books.map(b => b.id===id ? {...b, status: b.status==='Available' ? 'Borrowed' : 'Available'} : b);
  updateStorage();
  render();
}

// ---------- filtering, searching, sorting ----------
function getFilteredSorted() {
  const q = searchInput.value.trim().toLowerCase();
  let arr = books.slice();

  // filter category
  if (filterCategory.value) arr = arr.filter(b => b.category === filterCategory.value);

  // search
  if (q) arr = arr.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));

  // sort
  const s = sortSelect.value;
  if (s === 'title-asc') arr.sort((a,b)=>a.title.localeCompare(b.title));
  else if (s === 'title-desc') arr.sort((a,b)=>b.title.localeCompare(a.title));
  else if (s === 'author-asc') arr.sort((a,b)=>a.author.localeCompare(b.author));
  else if (s === 'author-desc') arr.sort((a,b)=>b.author.localeCompare(a.author));
  else if (s === 'date-new') arr.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
  else if (s === 'date-old') arr.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));

  return arr;
}

// highlight helper
function highlight(text, q) {
  if (!q) return text;
  const regex = new RegExp(q, 'gi');
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

function render() {
  updateStorage();
  const arr = getFilteredSorted();
  bookList.innerHTML = '';
  if (arr.length === 0) {
    bookList.innerHTML = '<p class="hint">No books found</p>';
    return;
  }
  const q = searchInput.value.trim();
  arr.forEach(b => {
    const div = document.createElement('div');
    div.className = 'book-card';
    div.innerHTML = `
      <h3>${highlight(escapeHtml(b.title), q)}</h3>
      <div class="book-meta">by ${escapeHtml(b.author)} • ${b.category}</div>
      <div>Borrow: ${b.borrowDate || '-' } | Return: ${b.returnDate || '-'}</div>
      <div class="book-actions">
        <button class="small-btn status-btn" onclick="toggleStatus(${b.id})">${b.status === 'Available' ? 'Mark Borrowed' : 'Mark Available'}</button>
        <button class="small-btn remove-btn" onclick="removeBook(${b.id})">Remove</button>
      </div>
    `;
    bookList.appendChild(div);
  });
}

// simple HTML escape
function escapeHtml(str){ return String(str).replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'}[s])) }

// ---------- export CSV & PDF ----------
function exportCSV() {
  const arr = getFilteredSorted();
  if (!arr.length) return alert('No books to export');
  const header = ['id','title','author','category','status','borrowDate','returnDate','createdAt'];
  const rows = arr.map(b => header.map(k => `"${(b[k]||'').toString().replace(/"/g,'""')}"`).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'books.csv'; document.body.appendChild(a); a.click(); a.remove();
}

async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const arr = getFilteredSorted();
  if (!arr.length) return alert('No books to export');
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text('Library Books Export', 14, 18);
  let y = 28;
  for (const b of arr) {
    doc.text(`- ${b.title} | ${b.author} | ${b.category} | ${b.status}`, 14, y);
    y += 8;
    if (y > 280) { doc.addPage(); y = 20; }
  }
  doc.save('books.pdf');
}

// ---------- events ----------
addBookBtn.addEventListener('click', addBook);
searchInput.addEventListener('input', render);
filterCategory.addEventListener('change', render);
sortSelect.addEventListener('change', render);
exportCsvBtn.addEventListener('click', exportCSV);
exportPdfBtn.addEventListener('click', exportPDF);

// expose functions to global for inline onclicks
window.removeBook = removeBook;
window.toggleStatus = toggleStatus;

// ---------- initial load ----------
showUIForUser(currentUser);

// ---------- optional: simple API example for MongoDB (client-side snippet) ----------
/*
  To use MongoDB you typically have a backend (Node/Express) that talks to MongoDB Atlas.
  Example client-side fetch (replace URL with your server route):

  // Client: send new book to backend
  fetch('https://your-server.com/api/books', {
    method: 'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(newBook)
  }).then(r=>r.json()).then(data => { /* refresh list * / });

  // Server: Node/Express example (not included as file here)
*/

