// =========================================================
// MESSFLOW FRONTEND CONFIGURATION
// After creating API Gateway, paste the Invoke URL below.
// Example: https://abc123.execute-api.ap-south-1.amazonaws.com
// Leave the placeholder unchanged to use local demo mode.
// =========================================================
const API_URL = "https://kjpvl9mjta.execute-api.us-east-1.amazonaws.com";

const isLive = API_URL.startsWith("https://");
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const connectionBadge = $("#connectionBadge");
connectionBadge.textContent = isLive ? "AWS connected" : "Demo mode";
connectionBadge.className = `status-badge ${isLive ? "live" : "demo"}`;

// ---------- Dates ----------
function toLocalISODate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
$("#mealDate").value = toLocalISODate(tomorrow);
$("#adminDate").value = toLocalISODate(tomorrow);

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

// ---------- Demo data ----------
const demoStoreKey = "messflow-demo-responses";

function getDemoRows() {
  const rows = JSON.parse(localStorage.getItem(demoStoreKey) || "[]");

  // Seed a few demo responses once, so the dashboard is not empty.
  if (!rows.length) {
    const date = $("#mealDate").value;
    const seeded = [
      ["23BEE101","YES"], ["23BEE102","YES"], ["23BEE103","NO"],
      ["23BEE104","YES"], ["23BEE105","YES"], ["23BEE106","YES"],
      ["23BEE107","NO"], ["23BEE108","YES"], ["23BEE109","YES"],
      ["23BEE110","YES"], ["23BEE111","NO"], ["23BEE112","YES"]
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
    if (isLive) {
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

  const mealLabel = (data.meal || $("#adminMeal").value);
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
    const data = isLive
      ? await apiFetch(`/summary?date=${encodeURIComponent(date)}&meal=${encodeURIComponent(meal)}`)
      : demoSummary(date, meal);

    renderSummary(data);
    status.textContent = isLive ? "Live AWS data" : "Demo data";
  } catch (error) {
    console.error(error);
    status.textContent = "Error";
    toast(error.message || "Could not load summary.", true);
  }
}

$("#refreshSummary").addEventListener("click", loadSummary);
$("#adminDate").addEventListener("change", loadSummary);
$("#adminMeal").addEventListener("change", loadSummary);

// Initial demo state
getDemoRows();
