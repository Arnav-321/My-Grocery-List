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
  let doneCount = 0;

  list.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = item.done ? 'checked' : '';
    li.innerHTML = `
      <span onclick="toggleItem(${index})">${item.text}</span>
      <button class="delete-btn" onclick="deleteItem(${index})">🗑</button>
    `;
    groceryList.appendChild(li);
    if (item.done) doneCount++;
  });

  summaryText.innerText = `Total Items: ${list.length} | Done: ${doneCount}`;
}

renderList();

// Dark mode toggle
const toggleModeBtn = document.getElementById('toggleModeBtn');

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  toggleModeBtn.textContent = '☀️ Light Mode';
}

toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleModeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('darkMode', isDark);
});

