const areaState = {
  areas: {},
  city: "",
  area: "",
};

const areaCollator = new Intl.Collator("ar", { numeric: true });

const areaElements = {
  loadError: document.getElementById("loadError"),
  citySearch: document.getElementById("citySearch"),
  cityList: document.getElementById("cityList"),
  areaSearch: document.getElementById("areaSearch"),
  areaList: document.getElementById("areaList"),
  summaryCity: document.getElementById("summaryCity"),
  summaryArea: document.getElementById("summaryArea"),
  submitButton: document.getElementById("submitButton"),
  fallback: {
    wrapper: document.getElementById("browserFallback"),
    status: document.getElementById("fallbackStatus"),
    output: document.getElementById("fallbackOutput"),
    copyButton: document.getElementById("copyButton"),
  },
};

MiniApp.initTelegram();
loadAreas();

areaElements.citySearch.addEventListener("input", () => {
  if (areaElements.citySearch.value !== areaState.city) {
    clearCitySelection();
  }
  renderCities();
});

areaElements.areaSearch.addEventListener("input", () => {
  if (areaElements.areaSearch.value !== areaState.area) {
    areaState.area = "";
    updateAreaSummary();
  }
  renderAreas();
});

areaElements.submitButton.addEventListener("click", () => {
  MiniApp.submitPayload(
    {
      type: "area_selection",
      city: areaState.city,
      area: areaState.area,
    },
    areaElements.fallback,
  );
});

async function loadAreas() {
  try {
    const response = await fetch("data/areas.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`areas.json returned ${response.status}`);
    }

    const data = await response.json();
    validateAreaData(data);
    areaState.areas = data;
    renderCities();
    updateAreaSummary();
  } catch (error) {
    console.error(error);
    areaElements.loadError.hidden = false;
    areaElements.submitButton.disabled = true;
  }
}

function validateAreaData(data) {
  const valid =
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.values(data).every((areas) => Array.isArray(areas));

  if (!valid) {
    throw new Error("areas.json must be an object of city arrays");
  }
}

function renderCities() {
  const cities = Object.keys(areaState.areas).sort((a, b) => areaCollator.compare(a, b));
  const matches = MiniApp.filterValues(cities, areaElements.citySearch.value);
  MiniApp.renderOptions(
    areaElements.cityList,
    matches,
    areaState.city,
    selectCity,
    "لا توجد مدن مطابقة.",
  );
}

function renderAreas() {
  if (!areaState.city) {
    areaElements.areaList.replaceChildren();
    return;
  }

  const areas = [...areaState.areas[areaState.city]].sort((a, b) => areaCollator.compare(a, b));
  const matches = MiniApp.filterValues(areas, areaElements.areaSearch.value);
  MiniApp.renderOptions(
    areaElements.areaList,
    matches,
    areaState.area,
    selectArea,
    "لا توجد مناطق مطابقة.",
  );
}

function selectCity(city) {
  areaState.city = city;
  areaState.area = "";
  areaElements.citySearch.value = city;
  areaElements.areaSearch.value = "";
  areaElements.areaSearch.disabled = !city;
  areaElements.areaSearch.placeholder = city ? "ابحث عن المنطقة" : "اختر المدينة أولاً";
  renderAreas();
  updateAreaSummary();
}

function clearCitySelection() {
  areaState.city = "";
  areaState.area = "";
  areaElements.areaSearch.value = "";
  areaElements.areaSearch.disabled = true;
  areaElements.areaSearch.placeholder = "اختر المدينة أولاً";
  areaElements.areaList.replaceChildren();
  updateAreaSummary();
}

function selectArea(area) {
  areaState.area = area;
  areaElements.areaSearch.value = area;
  updateAreaSummary();
}

function updateAreaSummary() {
  MiniApp.setSummaryText(areaElements.summaryCity, areaState.city);
  MiniApp.setSummaryText(areaElements.summaryArea, areaState.area);
  areaElements.submitButton.disabled = !(areaState.city && areaState.area);
}
