# Telegram WebApp Integration

## Purpose

`shared.js` centralizes the current Telegram WebApp integration and shared UI helpers so the page scripts can focus on state and payload creation.

## SDK Loading

`car.html`, `area.html`, and `date.html` load:

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

before the local deferred scripts. Keep this order so `window.Telegram.WebApp` is available when local code initializes.

`index.html` does not load the Telegram SDK because it is only a local navigation page.

## Shared API

`shared.js` exposes these functions on `window.MiniApp`:

- `initTelegram()`: calls `ready()` and `expand()` when Telegram WebApp is available.
- `filterValues(values, query)`: shared substring filtering for selector pages.
- `renderOptions(container, values, selectedValue, onSelect, emptyText)`: renders button options or an empty-state message.
- `setSummaryText(element, value)`: writes a selected value or the shared unselected text.
- `submitPayload(payload, fallbackElements)`: sends the JSON payload through Telegram or shows browser fallback output.

## Submit Behavior

Inside Telegram:

1. `submitPayload()` calls `Telegram.WebApp.sendData(JSON.stringify(payload))`.
2. It calls `Telegram.WebApp.close()` when available.

Outside Telegram:

1. `submitPayload()` calls the browser fallback.
2. The fallback shows the same `JSON.stringify(payload)` output.
3. It attempts to copy the JSON to the clipboard.
4. The manual copy button remains available.

## Bot Contract

The Mini App does not validate bot state. It only sends the payload selected on the page. The bot must treat WebApp data as untrusted and validate the JSON shape, expected `type`, FSM state, and allowlisted values.

The exact bot-side validation rules are not stored in this repository. [Unknown / Needs human confirmation]

Do not change payload `type` values or field names without a coordinated bot change.
