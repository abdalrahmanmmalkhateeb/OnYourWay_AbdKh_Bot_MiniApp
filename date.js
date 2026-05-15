// Date/time selection page state and payload construction.
// Keep the submitted keys compatible with the Telegram bot: type, datetime, date, time.
const dateState = {
  datetime: "",
  date: "",
  time: "",
  display: "",
};

const dateElements = {
  dateTimeInput: document.getElementById("dateTimeInput"),
  summaryDateTime: document.getElementById("summaryDateTime"),
  submitButton: document.getElementById("submitButton"),
  fallback: {
    wrapper: document.getElementById("browserFallback"),
    status: document.getElementById("fallbackStatus"),
    output: document.getElementById("fallbackOutput"),
    copyButton: document.getElementById("copyButton"),
  },
};

const minimumDateTime = getNextMinuteDate();

MiniApp.initTelegram();
dateElements.dateTimeInput.min = toDateTimeLocalValue(minimumDateTime);
updateDateSummary();

dateElements.dateTimeInput.addEventListener("input", () => {
  setSelectedDateTime(dateElements.dateTimeInput.value);
});

dateElements.submitButton.addEventListener("click", () => {
  MiniApp.submitPayload(
    {
      type: "datetime_selection",
      datetime: dateState.datetime,
      date: dateState.date,
      time: dateState.time,
    },
    dateElements.fallback,
  );
});

// Accepts only valid future datetime-local values and derives the bot payload fields.
function setSelectedDateTime(value) {
  const selectedDate = parseDateTimeLocalValue(value);

  if (!selectedDate || selectedDate < minimumDateTime) {
    dateState.datetime = "";
    dateState.date = "";
    dateState.time = "";
    dateState.display = "";
    updateDateSummary();
    return;
  }

  dateState.date = padDatePart(selectedDate.getFullYear(), 4) +
    `-${padDatePart(selectedDate.getMonth() + 1)}-${padDatePart(selectedDate.getDate())}`;
  dateState.time = `${padDatePart(selectedDate.getHours())}:${padDatePart(selectedDate.getMinutes())}`;
  dateState.datetime = `${dateState.date} ${dateState.time}`;
  dateState.display = formatDisplayDateTime(selectedDate);
  updateDateSummary();
}

function updateDateSummary() {
  MiniApp.setSummaryText(dateElements.summaryDateTime, dateState.display);
  dateElements.submitButton.disabled = !dateState.datetime;
}

function parseDateTimeLocalValue(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match.map(Number);
  const parsed = new Date(year, month - 1, day, hour, minute, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    return null;
  }

  return parsed;
}

function getNextMinuteDate() {
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);
  return now;
}

function toDateTimeLocalValue(date) {
  return `${padDatePart(date.getFullYear(), 4)}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
}

function padDatePart(value, size = 2) {
  return String(value).padStart(size, "0");
}

function formatDisplayDateTime(date) {
  return new Intl.DateTimeFormat("ar-SY", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}
