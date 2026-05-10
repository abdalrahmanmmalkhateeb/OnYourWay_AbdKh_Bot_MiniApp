const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

let carsData = {};
let areasData = {};

const state = {
  brand: "",
  model: "",
  year: "",
  city: "",
  area: ""
};

const brandSearch = document.getElementById("brandSearch");
const brandList = document.getElementById("brandList");

const modelSection = document.getElementById("modelSection");
const modelSearch = document.getElementById("modelSearch");
const modelList = document.getElementById("modelList");

const yearSection = document.getElementById("yearSection");
const yearSelect = document.getElementById("yearSelect");

const cityList = document.getElementById("cityList");

const areaSection = document.getElementById("areaSection");
const areaSearch = document.getElementById("areaSearch");
const areaList = document.getElementById("areaList");

const carSummary = document.getElementById("carSummary");
const areaSummary = document.getElementById("areaSummary");

const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

function filterItems(items, query) {
  const q = normalizeText(query);
  if (!q) return items;
  return items.filter(item => normalizeText(item).includes(q));
}

function createButton(label, isActive, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = isActive ? "item-btn active" : "item-btn";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function renderBrandList() {
  brandList.innerHTML = "";

  const brands = Object.keys(carsData).sort();
  const filtered = filterItems(brands, brandSearch.value);

  filtered.forEach(brand => {
    const btn = createButton(brand, state.brand === brand, () => {
      state.brand = brand;
      state.model = "";
      updateUI();
    });

    brandList.appendChild(btn);
  });
}

function renderModelList() {
  modelList.innerHTML = "";

  if (!state.brand) return;

  const models = carsData[state.brand] || [];
  const filtered = filterItems(models, modelSearch.value);

  filtered.forEach(model => {
    const btn = createButton(model, state.model === model, () => {
      state.model = model;
      updateUI();
    });

    modelList.appendChild(btn);
  });
}

function renderYears() {
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1980; year--) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.appendChild(option);
  }
}

function renderCityList() {
  cityList.innerHTML = "";

  const cities = Object.keys(areasData);

  cities.forEach(city => {
    const btn = createButton(city, state.city === city, () => {
      state.city = city;
      state.area = "";
      updateUI();
    });

    cityList.appendChild(btn);
  });
}

function renderAreaList() {
  areaList.innerHTML = "";

  if (!state.city) return;

  const areas = areasData[state.city] || [];
  const filtered = filterItems(areas, areaSearch.value);

  filtered.forEach(area => {
    const btn = createButton(area, state.area === area, () => {
      state.area = area;
      updateUI();
    });

    areaList.appendChild(btn);
  });
}

function updateSummary() {
  const carParts = [];

  if (state.brand) carParts.push(state.brand);
  if (state.model) carParts.push(state.model);
  if (state.year) carParts.push(state.year);

  carSummary.textContent = carParts.length ? carParts.join(" - ") : "غير محدد";

  const areaParts = [];

  if (state.city) areaParts.push(state.city);
  if (state.area) areaParts.push(state.area);

  areaSummary.textContent = areaParts.length ? areaParts.join(" - ") : "غير محدد";
}

function updateSections() {
  modelSection.classList.toggle("hidden", !state.brand);
  yearSection.classList.toggle("hidden", !state.model);
  areaSection.classList.toggle("hidden", !state.city);
}

function updateSubmitState() {
  const isValid =
    state.brand &&
    state.model &&
    state.year &&
    state.city &&
    state.area;

  submitBtn.disabled = !isValid;
}

function updateUI() {
  renderBrandList();
  renderModelList();
  renderCityList();
  renderAreaList();
  updateSections();
  updateSummary();
  updateSubmitState();
}

async function loadData() {
  try {
    const [carsResponse, areasResponse] = await Promise.all([
      fetch("data/cars.json"),
      fetch("data/areas.json")
    ]);

    carsData = await carsResponse.json();
    areasData = await areasResponse.json();

    renderYears();
    updateUI();
  } catch (error) {
    statusEl.textContent = "تعذر تحميل البيانات. تأكد من رفع ملفات data بشكل صحيح.";
    submitBtn.disabled = true;
  }
}

function submitSelection() {
  const payload = {
    type: "vehicle_area_selection",
    brand: state.brand,
    model: state.model,
    year: state.year,
    city: state.city,
    area: state.area
  };

  const data = JSON.stringify(payload);

  if (tg?.sendData) {
    tg.sendData(data);
    tg.close();
  } else {
    navigator.clipboard?.writeText(data);
    statusEl.textContent = "وضع الاختبار: تم نسخ النتيجة. افتح الصفحة من تيليغرام للإرسال للبوت.";
    console.log(data);
  }
}

brandSearch.addEventListener("input", renderBrandList);
modelSearch.addEventListener("input", renderModelList);
areaSearch.addEventListener("input", renderAreaList);

yearSelect.addEventListener("change", () => {
  state.year = yearSelect.value;
  updateUI();
});

submitBtn.addEventListener("click", submitSelection);

loadData();