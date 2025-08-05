const emojiCategoryMap = {
  vegetables: ["potato", "tomato", "onion", "carrot", "cucumber", "chili", "beans"],
  fruits: ["banana", "apple", "grapes", "orange", "watermelon", "mango", "papaya"],
  grains: ["rice", "flour", "wheat", "bread"],
  dairy: ["milk", "curd", "butter", "cheese"],
  drinks: ["tea", "coffee", "juice", "water"],
  snacks: ["biscuits", "snacks", "chips", "chocolate", "cookies"],
  spices: ["salt", "sugar", "oil", "pepper", "masala"]
};

const categoryEmoji = {
  vegetables: "🥦",
  fruits: "🍎",
  grains: "🌾",
  dairy: "🥛",
  drinks: "🧃",
  snacks: "🍪",
  spices: "🧂"
};

let list = JSON.parse(localStorage.getItem('groceryList')) || [];

const itemInput = document.getElementById('itemInput');
const groceryList = document.getElementById('groceryList');
const summaryText = document.getElementById('summaryText');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const languageSelect = document.getElementById('languageSelect');

let currentLang = localStorage.getItem('language') || 'en';

const translations = {
  en: {
    title: "🛒 My Grocery List",
    placeholder: "Add grocery item...",
    addButton: "+ Add",
    summary: (total, done) => `Total Items: ${total} | Done: ${done}`
  },
  hi: {
    title: "🛒 मेरी किराना सूची",
    placeholder: "किराना वस्तु जोड़ें...",
    addButton: "+ जोड़ें",
    summary: (total, done) => `कुल आइटम: ${total} | पूर्ण: ${done}`
  },
  ta: {
    title: "🛒 என் மளிகைப் பட்டியல்",
    placeholder: "மளிகைப் பொருளைச் சேர்க்கவும்...",
    addButton: "+ சேர்",
    summary: (total, done) => `மொத்தம்: ${total} | முடிந்தது: ${done}`
  }
};

function applyTranslations() {
  const t = translations[currentLang];
  document.querySelector("h2").innerText = t.title;
  itemInput.placeholder = t.placeholder;
  document.querySelector(".input-group button").innerText = t.addButton;
}

function updateStorage() {
  localStorage.setItem('groceryList', JSON.stringify(list));
  renderList();
}

itemInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addItem();
  }
});

function addItem() {
  const text = itemInput.value.trim();
  if (!text) return;

  const lowerText = text.toLowerCase();
  let emoji = "🛒"; // Default emoji

  for (let category in emojiCategoryMap) {
    if (emojiCategoryMap[category].some(item => lowerText.includes(item))) {
      emoji = categoryEmoji[category];
      break;
    }
  }

  const fullText = `${emoji} ${text}`;
  list.push({ text: fullText, done: false });
  itemInput.value = '';
  updateStorage();
}

function toggleItem(index) {
  list[index].done = !list[index].done;
  updateStorage();
}

function deleteItem(index) {
  list.splice(index, 1);
  updateStorage();
}

function renderList() {
  groceryList.innerHTML = '';
  list.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = item.done ? 'done' : '';

    const span = document.createElement('span');
    span.textContent = item.text;
    span.style.cursor = 'pointer';
    span.addEventListener('click', function () {
      toggleItem(idx);
    });

    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.addEventListener('click', function () {
      deleteItem(idx);
    });

    li.appendChild(span);
    li.appendChild(btn);
    groceryList.appendChild(li);
  });

  const total = list.length;
  const done = list.filter(i => i.done).length;
  summaryText.textContent = translations[currentLang].summary(total, done);
}

function changeLanguage() {
  const lang = languageSelect.value;
  currentLang = lang;
  localStorage.setItem('language', lang);
  applyTranslations();
  renderList();
}

function applyDarkModeStatus() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    toggleModeBtn.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    toggleModeBtn.textContent = '🌙 Dark Mode';
  }
}

// Event Listeners
toggleModeBtn.addEventListener('click', function () {
  const isDark = !document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  applyDarkModeStatus();
});

languageSelect.value = currentLang;
languageSelect.addEventListener('change', changeLanguage);

// Initial setup
applyTranslations();
applyDarkModeStatus();
renderList();
