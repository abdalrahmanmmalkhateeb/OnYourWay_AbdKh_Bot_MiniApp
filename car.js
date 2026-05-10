const carState = {
  cars: {},
  brand: "",
  model: "",
  year: "",
};

const carElements = {
  loadError: document.getElementById("loadError"),
  brandSearch: document.getElementById("brandSearch"),
  brandList: document.getElementById("brandList"),
  modelSearch: document.getElementById("modelSearch"),
  modelList: document.getElementById("modelList"),
  yearSelect: document.getElementById("yearSelect"),
  summaryBrand: document.getElementById("summaryBrand"),
  summaryModel: document.getElementById("summaryModel"),
  summaryYear: document.getElementById("summaryYear"),
  submitButton: document.getElementById("submitButton"),
  fallback: {
    wrapper: document.getElementById("browserFallback"),
    status: document.getElementById("fallbackStatus"),
    output: document.getElementById("fallbackOutput"),
    copyButton: document.getElementById("copyButton"),
  },
};

MiniApp.initTelegram();
fillYearOptions();
loadCars();

carElements.brandSearch.addEventListener("input", () => {
  if (carElements.brandSearch.value !== carState.brand) {
    clearBrandSelection();
  }
  renderBrands();
});

carElements.modelSearch.addEventListener("input", () => {
  if (carElements.modelSearch.value !== carState.model) {
    carState.model = "";
    updateCarSummary();
  }
  renderModels();
});

carElements.yearSelect.addEventListener("change", () => {
  carState.year = carElements.yearSelect.value;
  updateCarSummary();
});

carElements.submitButton.addEventListener("click", () => {
  MiniApp.submitPayload(
    {
      type: "vehicle_selection",
      brand: carState.brand,
      model: carState.model,
      year: carState.year,
    },
    carElements.fallback,
  );
});

async function loadCars() {
  try {
    const response = await fetch("data/cars.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`cars.json returned ${response.status}`);
    }

    const data = await response.json();
    validateCarData(data);
    carState.cars = data;
    renderBrands();
    updateCarSummary();
  } catch (error) {
    console.error(error);
    carElements.loadError.hidden = false;
    carElements.submitButton.disabled = true;
  }
}

function validateCarData(data) {
  const valid =
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.values(data).every((models) => Array.isArray(models));

  if (!valid) {
    throw new Error("cars.json must be an object of brand arrays");
  }
}

function fillYearOptions() {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1980; year -= 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    carElements.yearSelect.appendChild(option);
  }
}

function renderBrands() {
  const brands = Object.keys(carState.cars).sort((a, b) => a.localeCompare(b, "ar"));
  const matches = MiniApp.filterValues(brands, carElements.brandSearch.value);
  MiniApp.renderOptions(
    carElements.brandList,
    matches,
    carState.brand,
    selectBrand,
    "لا توجد شركات مطابقة.",
  );
}

function renderModels() {
  if (!carState.brand) {
    carElements.modelList.replaceChildren();
    return;
  }

  const models = [...carState.cars[carState.brand]].sort((a, b) => a.localeCompare(b, "ar"));
  const matches = MiniApp.filterValues(models, carElements.modelSearch.value);
  MiniApp.renderOptions(
    carElements.modelList,
    matches,
    carState.model,
    selectModel,
    "لا توجد موديلات مطابقة.",
  );
}

function selectBrand(brand) {
  carState.brand = brand;
  carState.model = "";
  carElements.brandSearch.value = brand;
  carElements.modelSearch.value = "";
  carElements.modelSearch.disabled = !brand;
  carElements.modelSearch.placeholder = brand ? "ابحث عن الموديل" : "اختر الشركة أولاً";
  renderModels();
  updateCarSummary();
}

function clearBrandSelection() {
  carState.brand = "";
  carState.model = "";
  carElements.modelSearch.value = "";
  carElements.modelSearch.disabled = true;
  carElements.modelSearch.placeholder = "اختر الشركة أولاً";
  carElements.modelList.replaceChildren();
  updateCarSummary();
}

function selectModel(model) {
  carState.model = model;
  carElements.modelSearch.value = model;
  updateCarSummary();
}

function updateCarSummary() {
  MiniApp.setSummaryText(carElements.summaryBrand, carState.brand);
  MiniApp.setSummaryText(carElements.summaryModel, carState.model);
  MiniApp.setSummaryText(carElements.summaryYear, carState.year);
  carElements.submitButton.disabled = !(carState.brand && carState.model && carState.year);
}
