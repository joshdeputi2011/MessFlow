// =========================================================
// PROODLE NON VEG MESS - FRONTEND
// The menu is stored as Python-style data. The browser uses a
// small parser for this limited dictionary format; it does NOT
// execute arbitrary Python code.
// =========================================================
const API_URL = "https://kjpvl9mjta.execute-api.us-east-1.amazonaws.com";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ---------- Default monthly menu ----------
// Update DEFAULT_MENU_CODE when you want the public GitHub Pages menu
// to change for everyone. Update DEFAULT_MENU_VERSION at the same time.
const DEFAULT_MENU_VERSION = "2026-10-v1";
const DEFAULT_MENU_CODE = `MENU = {
    'month': 'October',
    'year': 2026,
    'odd_week': {
        'Monday': {
            'breakfast': {'main': 'Idli + Sambar', 'egg': 'Masala Omelette'},
            'lunch': {'main': 'Rice + Sambar + Beans Poriyal', 'type': 'veg'},
            'snacks': {'main': 'Tea + Biscuit', 'type': 'veg'},
            'dinner': {'main': 'Chapati + Chana Masala', 'type': 'veg'}
        },
        'Tuesday': {
            'breakfast': {'main': 'Ven Pongal + Chutney', 'egg': 'Boiled Egg'},
            'lunch': {'main': 'Lemon Rice + Vegetable Kurma', 'type': 'veg'},
            'snacks': {'main': 'Samosa + Tea', 'type': 'veg'},
            'dinner': {'main': 'Veg Pulao + Raita', 'type': 'veg'}
        },
        'Wednesday': {
            'breakfast': {'main': 'Dosa + Chutney', 'egg': 'Egg Bhurji'},
            'lunch': {'main': 'Rice + Dal + Potato Roast', 'type': 'veg'},
            'snacks': {'main': 'Banana + Tea', 'type': 'veg'},
            'dinner': {'main': 'Chapati + Dal Tadka', 'type': 'veg'}
        },
        'Thursday': {
            'breakfast': {'main': 'Upma + Chutney', 'egg': 'Masala Omelette'},
            'lunch': {'main': 'Rice + Rajma + Cabbage Poriyal', 'type': 'veg'},
            'snacks': {'main': 'Bread Pakoda + Tea', 'type': 'veg'},
            'dinner': {'main': 'Idiyappam + Vegetable Stew', 'type': 'veg'}
        },
        'Friday': {
            'breakfast': {'main': 'Poori + Potato Masala', 'egg': 'Boiled Egg'},
            'lunch': {'main': 'Veg Biryani + Raita', 'type': 'veg'},
            'snacks': {'main': 'Sundal + Tea', 'type': 'veg'},
            'dinner': {'main': 'Parotta + Chicken Gravy', 'type': 'nonveg'}
        },
        'Saturday': {
            'breakfast': {'main': 'Idli + Chutney', 'egg': 'Egg Omelette'},
            'lunch': {'main': 'Curd Rice + Veg Fry', 'type': 'veg'},
            'snacks': {'main': 'Cake + Tea', 'type': 'veg'},
            'dinner': {'main': 'Tomato Rice + Paneer', 'type': 'veg'}
        },
        'Sunday': {
            'breakfast': {'main': 'Aloo Paratha + Curd', 'egg': 'Egg Toast'},
            'lunch': {'main': 'Chicken Biryani + Raita', 'type': 'nonveg'},
            'snacks': {'main': 'Juice + Veg Puffs', 'type': 'veg'},
            'dinner': {'main': 'Dosa + Chutney', 'type': 'veg'}
        }
    },
    'even_week': {
        'Monday': {
            'breakfast': {'main': 'Poori + Chana Masala', 'egg': 'Egg Bhurji'},
            'lunch': {'main': 'Rice + Mor Kuzhambu + Beans', 'type': 'veg'},
            'snacks': {'main': 'Tea + Murukku', 'type': 'veg'},
            'dinner': {'main': 'Chapati + Mixed Veg Kurma', 'type': 'veg'}
        },
        'Tuesday': {
            'breakfast': {'main': 'Dosa + Sambar', 'egg': 'Boiled Egg'},
            'lunch': {'main': 'Rice + Chole + Carrot Poriyal', 'type': 'veg'},
            'snacks': {'main': 'Bonda + Tea', 'type': 'veg'},
            'dinner': {'main': 'Veg Noodles + Manchurian', 'type': 'veg'}
        },
        'Wednesday': {
            'breakfast': {'main': 'Idli + Sambar', 'egg': 'Masala Omelette'},
            'lunch': {'main': 'Rice + Keerai Kootu + Beetroot', 'type': 'veg'},
            'snacks': {'main': 'Fruit + Tea', 'type': 'veg'},
            'dinner': {'main': 'Parotta + Egg Gravy', 'type': 'nonveg'}
        },
        'Thursday': {
            'breakfast': {'main': 'Upma + Chutney', 'egg': 'Egg Toast'},
            'lunch': {'main': 'Rice + Sambar + Cauliflower Fry', 'type': 'veg'},
            'snacks': {'main': 'Biscuit + Tea', 'type': 'veg'},
            'dinner': {'main': 'Chapati + Paneer Butter Masala', 'type': 'veg'}
        },
        'Friday': {
            'breakfast': {'main': 'Pongal + Chutney', 'egg': 'Boiled Egg'},
            'lunch': {'main': 'Chicken Biryani + Onion Raita', 'type': 'nonveg'},
            'snacks': {'main': 'Samosa + Tea', 'type': 'veg'},
            'dinner': {'main': 'Dosa + Sambar', 'type': 'veg'}
        },
        'Saturday': {
            'breakfast': {'main': 'Aloo Paratha + Curd', 'egg': 'Masala Omelette'},
            'lunch': {'main': 'Rice + Dal + Veg Fry', 'type': 'veg'},
            'snacks': {'main': 'Cake + Tea', 'type': 'veg'},
            'dinner': {'main': 'Chapati + Mushroom Masala', 'type': 'veg'}
        },
        'Sunday': {
            'breakfast': {'main': 'Masala Dosa + Chutney', 'egg': 'Egg Sandwich'},
            'lunch': {'main': 'Fish Curry + Rice + Poriyal', 'type': 'nonveg'},
            'snacks': {'main': 'Juice + Puffs', 'type': 'veg'},
            'dinner': {'main': 'Idiyappam + Coconut Milk', 'type': 'veg'}
        }
    },
    'overrides': {
        '2026-10-07': {
            'breakfast': {'main': 'Idli + Sambar', 'egg': 'Masala Omelette'},
            'lunch': {'main': 'Chicken Biryani + Raita', 'type': 'nonveg'},
            'snacks': {'main': 'Tea + Biscuit', 'type': 'veg'},
            'dinner': {'main': 'Chapati + Paneer Gravy', 'type': 'veg'}
        }
    }
}`;

const MEAL_META = {
  breakfast: { label: "Breakfast", icon: "☀️", short: "Morning" },
  lunch: { label: "Lunch", icon: "🍛", short: "Midday" },
  snacks: { label: "Snacks", icon: "☕", short: "Evening" },
  dinner: { label: "Dinner", icon: "🌙", short: "Night" }
};

const savedDefaultVersion = localStorage.getItem("proodle-default-menu-version");
if (savedDefaultVersion && savedDefaultVersion !== DEFAULT_MENU_VERSION) {
  localStorage.removeItem("proodle-menu-code");
}
localStorage.setItem("proodle-default-menu-version", DEFAULT_MENU_VERSION);

let currentMenu;
let currentSelectedDay = 1;

// ---------- Theme ----------
const savedTheme = localStorage.getItem("messflow-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

$("#themeToggle").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("messflow-theme", next);
});

// ---------- Tabs ----------
$$(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".panel").forEach((p) => p.classList.remove("active"));

    button.classList.add("active");
    $(`#${button.dataset.tab}Panel`).classList.add("active");

    if (button.dataset.tab === "admin") loadSummary();
    if (button.dataset.tab === "menu") renderMenuArea();
  });
});

// ---------- Choice controls ----------
$$("#mealChoices .choice").forEach((button) => {
  button.addEventListener("click", () => {
    $$("#mealChoices .choice").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    $("#meal").value = button.dataset.value;
  });
});

$$(".attendance").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".attendance").forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    $("#response").value = button.dataset.value;
  });
});

// ---------- Toast ----------
let toastTimer;
function toast(message, error = false) {
  const el = $("#toast");
  el.textContent = message;
  el.className = `toast show ${error ? "error" : ""}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.className = "toast"), 3200);
}

// ---------- Dates ----------
function toLocalISODate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

const todayISO = toLocalISODate(new Date());
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
$("#mealDate").value = toLocalISODate(tomorrow);
$("#adminDate").value = toLocalISODate(tomorrow);

// ---------- Demo attendance data ----------
const demoStoreKey = "messflow-demo-responses";

function getDemoRows() {
  const rows = JSON.parse(localStorage.getItem(demoStoreKey) || "[]");
  if (!rows.length) {
    const date = $("#mealDate").value;
    const seeded = [
      ["23BEE101", "YES"], ["23BEE102", "YES"], ["23BEE103", "NO"],
      ["23BEE104", "YES"], ["23BEE105", "YES"], ["23BEE106", "YES"],
      ["23BEE107", "NO"], ["23BEE108", "YES"], ["23BEE109", "YES"],
      ["23BEE110", "YES"], ["23BEE111", "NO"], ["23BEE112", "YES"]
    ].map(([studentId, response]) => ({
      studentId, date, meal: "dinner", response
    }));
    localStorage.setItem(demoStoreKey, JSON.stringify(seeded));
    return seeded;
  }
  return rows;
}

function saveDemoResponse(payload) {
  const rows = getDemoRows();
  const index = rows.findIndex(
    (r) => r.studentId === payload.studentId &&
           r.date === payload.date &&
           r.meal === payload.meal
  );

  if (index >= 0) rows[index] = payload;
  else rows.push(payload);

  localStorage.setItem(demoStoreKey, JSON.stringify(rows));
}

function demoSummary(date, meal) {
  const rows = getDemoRows().filter((r) => r.date === date && r.meal === meal);
  const yes = rows.filter((r) => r.response === "YES").length;
  const no = rows.filter((r) => r.response === "NO").length;

  return {
    date,
    meal,
    yes,
    no,
    total: rows.length,
    recommendedServings: Math.ceil(yes * 1.05)
  };
}

// ---------- API ----------
const useRemoteBackend = API_URL.startsWith("https://");

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with HTTP ${response.status}`);
  }
  return data;
}

// ---------- Submit response ----------
$("#responseForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    studentId: $("#studentId").value.trim().toUpperCase(),
    date: $("#mealDate").value,
    meal: $("#meal").value,
    response: $("#response").value
  };

  if (!payload.response) {
    toast("Choose YES or NO before submitting.", true);
    return;
  }

  const button = $("#submitBtn");
  button.disabled = true;
  button.firstElementChild.textContent = "Saving...";

  try {
    if (useRemoteBackend) {
      await apiFetch("/response", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    } else {
      saveDemoResponse(payload);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    toast(`Response saved: ${payload.meal} → ${payload.response}`);
    $("#adminDate").value = payload.date;
    $("#adminMeal").value = payload.meal;
  } catch (error) {
    console.error(error);
    toast(error.message || "Could not save the response.", true);
  } finally {
    button.disabled = false;
    button.firstElementChild.textContent = "Submit response";
  }
});

// ---------- Dashboard ----------
function renderSummary(data) {
  const yes = Number(data.yes || 0);
  const no = Number(data.no || 0);
  const total = Number(data.total || 0);
  const servings = Number(data.recommendedServings || 0);
  const yesPct = total ? Math.round((yes / total) * 100) : 0;
  const noPct = total ? 100 - yesPct : 0;

  $("#yesCount").textContent = yes;
  $("#noCount").textContent = no;
  $("#totalCount").textContent = total;
  $("#servingsCount").textContent = servings;
  $("#yesPercent").textContent = `${yesPct}%`;
  $("#noPercent").textContent = `${noPct}%`;
  $("#yesBar").style.width = `${yesPct}%`;
  $("#noBar").style.width = `${noPct}%`;

  const mealLabel = data.meal || $("#adminMeal").value;
  $("#summaryTitle").textContent = `${mealLabel[0].toUpperCase() + mealLabel.slice(1)} demand`;

  $("#recommendationText").textContent = total
    ? `${yes} students confirmed they are eating. Prepare approximately ${servings} servings, including the 5% safety buffer.`
    : "No responses have been recorded for this meal yet.";
}

async function loadSummary() {
  const date = $("#adminDate").value;
  const meal = $("#adminMeal").value;
  const status = $("#summaryStatus");
  status.textContent = "Loading…";

  try {
    const data = useRemoteBackend
      ? await apiFetch(`/summary?date=${encodeURIComponent(date)}&meal=${encodeURIComponent(meal)}`)
      : demoSummary(date, meal);

    renderSummary(data);
    status.textContent = useRemoteBackend ? "Live data" : "Demo data";
  } catch (error) {
    console.error(error);
    status.textContent = "Error";
    toast(error.message || "Could not load summary.", true);
  }
}

$("#refreshSummary").addEventListener("click", loadSummary);
$("#adminDate").addEventListener("change", loadSummary);
$("#adminMeal").addEventListener("change", loadSummary);

// =========================================================
// MENU ENGINE
// =========================================================
function stripPrefix(source) {
  const firstBrace = source.indexOf("{");
  const lastBrace = source.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) throw new Error("Menu code must contain one dictionary starting with { and ending with }.");
  return source.slice(firstBrace, lastBrace + 1);
}

function pythonishToJSON(source) {
  let text = stripPrefix(source.trim());
  text = text
    .replace(/#.*$/gm, "")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null")
    .replace(/'/g, '"')
    .replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(text);
}

function validateMenu(menu) {
  if (!menu || !menu.month || !menu.year) throw new Error("Menu needs month and year.");
  if (!menu.odd_week || !menu.even_week) throw new Error("Menu needs odd_week and even_week patterns.");

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  [menu.odd_week, menu.even_week].forEach((pattern) => {
    weekdays.forEach((day) => {
      if (!pattern[day]?.breakfast?.egg) {
        throw new Error(`Breakfast on ${day} must include an egg item.`);
      }
    });
  });

  if (!menu.overrides) menu.overrides = {};
  Object.entries(menu.overrides).forEach(([date, entry]) => {
    if (entry.breakfast && !entry.breakfast.egg) {
      throw new Error(`Override ${date} must include an egg item for breakfast.`);
    }
  });

  return menu;
}

function parseMenuCode(source) {
  return validateMenu(pythonishToJSON(source));
}

function activeMenuCode() {
  return localStorage.getItem("proodle-menu-code") || DEFAULT_MENU_CODE;
}

function loadMenuFromStorage() {
  try {
    currentMenu = parseMenuCode(activeMenuCode());
  } catch (error) {
    console.error(error);
    currentMenu = parseMenuCode(DEFAULT_MENU_CODE);
    localStorage.removeItem("proodle-menu-code");
  }
}

function monthIndex(monthName) {
  const index = new Date(`${monthName} 1, ${currentMenu.year}`).getMonth();
  if (Number.isNaN(index)) throw new Error(`Unknown month name: ${monthName}`);
  return index;
}

function daysInCurrentMonth() {
  return new Date(currentMenu.year, monthIndex(currentMenu.month) + 1, 0).getDate();
}

function isoForDay(day) {
  const month = String(monthIndex(currentMenu.month) + 1).padStart(2, "0");
  return `${currentMenu.year}-${month}-${String(day).padStart(2, "0")}`;
}

function dateForDay(day) {
  return new Date(currentMenu.year, monthIndex(currentMenu.month), day);
}

function weekOfMonth(day) {
  const firstDay = new Date(currentMenu.year, monthIndex(currentMenu.month), 1).getDay();
  return Math.floor((day + firstDay - 1) / 7) + 1;
}

function weekTypeForDay(day) {
  return weekOfMonth(day) % 2 === 0 ? "even_week" : "odd_week";
}

function dayName(date) {
  return date.toLocaleDateString("en-IN", { weekday: "long" });
}

function shortDateLabel(date) {
  return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

function menuForDay(day) {
  const dateKey = isoForDay(day);
  const weekday = dayName(dateForDay(day));
  const pattern = weekTypeForDay(day);
  const base = currentMenu[pattern][weekday] || currentMenu.odd_week[weekday];
  const override = currentMenu.overrides?.[dateKey];
  return {
    weekday,
    dateKey,
    pattern,
    weekNumber: weekOfMonth(day),
    meals: { ...base, ...(override || {}) },
    hasOverride: Boolean(override)
  };
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mealItemMarkup(mealKey, meal) {
  const meta = MEAL_META[mealKey];
  const main = escapeHTML(meal.main || "Menu update pending");
  const type = meal.type === "nonveg" ? "nonveg" : "veg";
  const nonVegBadge = type === "nonveg" ? `<span class="nonveg-badge">NON-VEG</span>` : "";
  const eggBadge = mealKey === "breakfast" && meal.egg ? `<span class="egg-badge">🥚 ${escapeHTML(meal.egg)}</span>` : "";
  return `
    <div class="menu-main-line">${main}</div>
    ${eggBadge}
    ${nonVegBadge}
    <div class="meal-mini-label">${meta.short}</div>
  `;
}

function renderMenuWheel() {
  const data = menuForDay(currentSelectedDay);
  const date = dateForDay(currentSelectedDay);
  const weekLabel = data.pattern === "odd_week" ? "ODD WEEK" : "EVEN WEEK";

  $("#selectedMenuDate").textContent = shortDateLabel(date);
  $("#daySummaryTitle").textContent = `${data.weekday} · ${currentSelectedDay} ${currentMenu.month}`;
  $("#weekTypeBadge").textContent = weekLabel;
  $("#weekTypeBadge").className = `week-type-badge ${data.pattern === "even_week" ? "even" : "odd"}`;

  const wheel = $("#menuWheel");
  wheel.innerHTML = `
    <div class="wheel-halo"></div>
    <button class="meal-segment breakfast ${data.meals.breakfast?.type === "nonveg" ? "nonveg" : ""}" type="button" data-meal="breakfast">
      <span class="meal-segment-icon">☀️</span>
      <span class="meal-segment-title">Breakfast</span>
      <span class="meal-segment-main">${escapeHTML(data.meals.breakfast?.main || "Menu update pending")}</span>
      ${data.meals.breakfast?.egg ? `<span class="egg-badge compact">🥚 ${escapeHTML(data.meals.breakfast.egg)}</span>` : ""}
    </button>
    <button class="meal-segment lunch ${data.meals.lunch?.type === "nonveg" ? "nonveg" : ""}" type="button" data-meal="lunch">
      <span class="meal-segment-icon">🍛</span>
      <span class="meal-segment-title">Lunch</span>
      <span class="meal-segment-main">${escapeHTML(data.meals.lunch?.main || "Menu update pending")}</span>
      ${data.meals.lunch?.type === "nonveg" ? `<span class="nonveg-badge compact">NON-VEG</span>` : ""}
    </button>
    <button class="meal-segment snacks ${data.meals.snacks?.type === "nonveg" ? "nonveg" : ""}" type="button" data-meal="snacks">
      <span class="meal-segment-icon">☕</span>
      <span class="meal-segment-title">Snacks</span>
      <span class="meal-segment-main">${escapeHTML(data.meals.snacks?.main || "Menu update pending")}</span>
    </button>
    <button class="meal-segment dinner ${data.meals.dinner?.type === "nonveg" ? "nonveg" : ""}" type="button" data-meal="dinner">
      <span class="meal-segment-icon">🌙</span>
      <span class="meal-segment-title">Dinner</span>
      <span class="meal-segment-main">${escapeHTML(data.meals.dinner?.main || "Menu update pending")}</span>
      ${data.meals.dinner?.type === "nonveg" ? `<span class="nonveg-badge compact">NON-VEG</span>` : ""}
    </button>
    <div class="wheel-center">
      <small>DAY</small>
      <strong>${currentSelectedDay}</strong>
      <span>${data.weekday.slice(0, 3).toUpperCase()}</span>
    </div>
  `;

  $$(".meal-segment").forEach((button) => {
    button.addEventListener("click", () => {
      const meal = button.dataset.meal;
      $("#meal").value = meal;
      $$("#mealChoices .choice").forEach((choice) => choice.classList.toggle("active", choice.dataset.value === meal));
      document.querySelector("#studentPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      toast(`${MEAL_META[meal].label} selected for ${shortDateLabel(date)}.`);
    });
  });

  const summaryList = $("#daySummaryList");
  summaryList.innerHTML = ["breakfast", "lunch", "snacks", "dinner"].map((mealKey) => {
    const meal = data.meals[mealKey] || {};
    const isNonVeg = meal.type === "nonveg";
    return `
      <div class="summary-meal-row ${isNonVeg ? "summary-nonveg" : ""}">
        <div class="summary-meal-name"><span>${MEAL_META[mealKey].icon}</span><strong>${MEAL_META[mealKey].label}</strong></div>
        <div class="summary-meal-content">
          <span>${escapeHTML(meal.main || "Menu update pending")}</span>
          ${mealKey === "breakfast" && meal.egg ? `<small>🥚 Egg: ${escapeHTML(meal.egg)}</small>` : ""}
          ${isNonVeg ? `<span class="nonveg-badge">NON-VEG</span>` : ""}
        </div>
      </div>
    `;
  }).join("");

  if (data.hasOverride) {
    $("#menuSubtitle").textContent = `This date has a custom menu override · ${weekLabel.toLowerCase()} pattern underneath.`;
  } else {
    $("#menuSubtitle").textContent = `Move through the month, then hover a meal slice to reveal the full plate.`;
  }
}

function renderDayGrid() {
  const days = daysInCurrentMonth();
  $("#sliderStart").textContent = "1";
  $("#sliderEnd").textContent = String(days);
  $("#menuDateSlider").max = String(days);
  $("#menuDateSlider").value = String(currentSelectedDay);

  $("#menuDayGrid").innerHTML = Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const date = dateForDay(day);
    const weekday = date.toLocaleDateString("en-IN", { weekday: "short" });
    const isToday = isoForDay(day) === todayISO;
    const active = day === currentSelectedDay;
    const override = Boolean(currentMenu.overrides?.[isoForDay(day)]);
    return `
      <button class="menu-day-cell ${active ? "active" : ""} ${isToday ? "today" : ""} ${override ? "override" : ""}" type="button" data-day="${day}" aria-label="${escapeHTML(shortDateLabel(date))}">
        <span>${day}</span>
        <small>${weekday}</small>
        ${isToday ? `<em>TODAY</em>` : override ? `<em>EDITED</em>` : ""}
      </button>
    `;
  }).join("");

  $$(".menu-day-cell").forEach((button) => {
    button.addEventListener("click", () => setSelectedMenuDay(Number(button.dataset.day)));
  });
}

function weekTableMarkup(patternKey) {
  const pattern = currentMenu[patternKey] || {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return `
    <div class="week-table-scroll">
      <table class="week-table">
        <thead>
          <tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Snacks</th><th>Dinner</th></tr>
        </thead>
        <tbody>
          ${days.map((day) => {
            const row = pattern[day] || {};
            return `
              <tr>
                <th>${day}</th>
                <td><span class="week-main">${escapeHTML(row.breakfast?.main || "—")}</span>${row.breakfast?.egg ? `<small class="egg-line">🥚 ${escapeHTML(row.breakfast.egg)}</small>` : ""}</td>
                <td class="${row.lunch?.type === "nonveg" ? "week-nonveg" : ""}"><span class="week-main">${escapeHTML(row.lunch?.main || "—")}</span>${row.lunch?.type === "nonveg" ? `<span class="nonveg-badge mini">NON-VEG</span>` : ""}</td>
                <td><span class="week-main">${escapeHTML(row.snacks?.main || "—")}</span></td>
                <td class="${row.dinner?.type === "nonveg" ? "week-nonveg" : ""}"><span class="week-main">${escapeHTML(row.dinner?.main || "—")}</span>${row.dinner?.type === "nonveg" ? `<span class="nonveg-badge mini">NON-VEG</span>` : ""}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMenuArea() {
  $("#menuMonthTitle").textContent = `${currentMenu.month} ${currentMenu.year}`;
  if (!currentSelectedDay || currentSelectedDay > daysInCurrentMonth()) currentSelectedDay = 1;
  $("#sliderDayReadout").textContent = `DAY ${currentSelectedDay}`;
  renderDayGrid();
  renderMenuWheel();
  $("#oddWeekTable").innerHTML = weekTableMarkup("odd_week");
  $("#evenWeekTable").innerHTML = weekTableMarkup("even_week");
  $("#menuCodeEditor").value = activeMenuCode();
}

function setSelectedMenuDay(day) {
  currentSelectedDay = Math.min(Math.max(day, 1), daysInCurrentMonth());
  $("#menuDateSlider").value = String(currentSelectedDay);
  $("#sliderDayReadout").textContent = `DAY ${currentSelectedDay}`;
  renderDayGrid();
  renderMenuWheel();
}

$("#menuDateSlider").addEventListener("input", (event) => {
  setSelectedMenuDay(Number(event.target.value));
});

$("#todayMenuBtn").addEventListener("click", () => {
  const date = new Date();
  const currentMonthIndex = monthIndex(currentMenu.month);
  if (date.getFullYear() === currentMenu.year && date.getMonth() === currentMonthIndex) {
    setSelectedMenuDay(date.getDate());
  } else {
    setSelectedMenuDay(1);
    toast(`Today's date is outside the loaded ${currentMenu.month} ${currentMenu.year} menu.`);
  }
});

$("#applyMenuCode").addEventListener("click", () => {
  const code = $("#menuCodeEditor").value.trim();
  try {
    currentMenu = parseMenuCode(code);
    localStorage.setItem("proodle-menu-code", code);
    currentSelectedDay = 1;
    const date = new Date();
    if (date.getFullYear() === currentMenu.year && date.getMonth() === monthIndex(currentMenu.month)) {
      currentSelectedDay = date.getDate();
    }
    renderMenuArea();
    toast(`${currentMenu.month} ${currentMenu.year} menu applied and saved on this device.`);
  } catch (error) {
    console.error(error);
    toast(`Menu code error: ${error.message}`, true);
  }
});

$("#resetMenuCode").addEventListener("click", () => {
  localStorage.removeItem("proodle-menu-code");
  currentMenu = parseMenuCode(DEFAULT_MENU_CODE);
  currentSelectedDay = 1;
  renderMenuArea();
  toast("Saved menu code reset to the built-in monthly template.");
});

// ---------- Initial state ----------
getDemoRows();
loadMenuFromStorage();
{
  const today = new Date();
  if (today.getFullYear() === currentMenu.year && today.getMonth() === monthIndex(currentMenu.month)) {
    currentSelectedDay = today.getDate();
  }
  $("#menuDateSlider").value = String(currentSelectedDay);
  renderMenuArea();
}
