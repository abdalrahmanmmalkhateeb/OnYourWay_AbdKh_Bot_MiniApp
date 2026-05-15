(function () {
  const unselectedText = "لم يتم الاختيار";

  // Telegram SDK access stays centralized so page scripts only build payloads.
  function getTelegramApp() {
    return window.Telegram?.WebApp;
  }

  function initTelegram() {
    const app = getTelegramApp();
    app?.ready?.();
    app?.expand?.();
    return app;
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .normalize("NFKD")
      .toLocaleLowerCase("ar");
  }

  // Shared search and option rendering used by the car and area selectors.
  function filterValues(values, query) {
    const term = normalizeText(query);
    if (!term) {
      return values;
    }

    return values.filter((value) => normalizeText(value).includes(term));
  }

  function renderOptions(container, values, selectedValue, onSelect, emptyText) {
    container.replaceChildren();

    if (values.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-list";
      empty.textContent = emptyText;
      container.appendChild(empty);
      return;
    }

    values.forEach((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.textContent = value;
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", String(value === selectedValue));
      button.addEventListener("click", () => onSelect(value));
      container.appendChild(button);
    });
  }

  function setSummaryText(element, value) {
    element.textContent = value || unselectedText;
  }

  async function copyToClipboard(value) {
    if (!navigator.clipboard?.writeText) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  }

  // Browser fallback preserves the exact JSON payload for manual testing outside Telegram.
  async function showBrowserFallback(payload, elements) {
    const json = JSON.stringify(payload);
    const fallbackMessage = "وضع الاختبار: لم يتم فتح الصفحة من داخل Telegram Mini App.";
    elements.output.textContent = json;
    elements.wrapper.hidden = false;

    const copied = await copyToClipboard(json);
    elements.status.textContent = copied
      ? `${fallbackMessage} تم تجهيز JSON للاختبار ونسخه.`
      : `${fallbackMessage} تم تجهيز JSON للاختبار. يمكن نسخه يدوياً.`;

    elements.copyButton.onclick = async () => {
      const didCopy = await copyToClipboard(json);
      elements.status.textContent = didCopy ? "تم نسخ JSON." : "تعذر النسخ التلقائي.";
    };
  }

  // Page scripts define payload fields; this helper only serializes and submits them.
  function submitPayload(payload, fallbackElements) {
    const app = getTelegramApp();
    if (app?.sendData) {
      app.sendData(JSON.stringify(payload));
      app.close?.();
      return;
    }

    showBrowserFallback(payload, fallbackElements);
  }

  window.MiniApp = {
    filterValues,
    initTelegram,
    renderOptions,
    setSummaryText,
    submitPayload,
  };
})();
