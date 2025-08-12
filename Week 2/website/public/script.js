// script.js
const form = document.getElementById('nameForm');
const input = document.getElementById('nameInput');
const list = document.getElementById('namesList');
const countBadge = document.getElementById('count');
const clearBtn = document.getElementById('clearBtn');

// Replace with your server endpoint running in VS Code environment
const API_URL = 'http://localhost:3000/names';

async function fetchNames() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    render(data);
  } catch (err) {
    console.error('Error fetching names:', err);
  }
}

async function addName(name) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchNames();
  } catch (err) {
    console.error('Error adding name:', err);
  }
}

async function clearNames() {
  try {
    await fetch(API_URL, { method: 'DELETE' });
    fetchNames();
  } catch (err) {
    console.error('Error clearing names:', err);
  }
}

function render(names) {
  list.innerHTML = '';
  names.forEach((n, i) => {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = n;
    li.appendChild(text);
    list.appendChild(li);
  });
  countBadge.textContent = names.length;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addName(value);
  input.value = '';
  input.focus();
});

clearBtn.addEventListener('click', () => {
  if (confirm('Clear all submitted names?')) {
    clearNames();
  }
});

// Initial load
fetchNames();
