# Mini App Overview

This repository is a static Telegram Mini App surface for selection pages used by the OnYourWay Telegram bot. It has no build step, server code, database, or framework in the current implementation.

## Current Entry Pages

- `index.html`: local landing page with links to the available selectors. It does not initialize Telegram WebApp APIs.
- `car.html`: car selector page. It loads Telegram's WebApp SDK, `shared.js`, and `car.js`.
- `area.html`: city/area selector page. It loads Telegram's WebApp SDK, `shared.js`, and `area.js`.
- `date.html`: date/time selector page. It loads Telegram's WebApp SDK, `shared.js`, and `date.js`.

## Shared Flow

1. A selector page initializes Telegram through `MiniApp.initTelegram()`.
2. Page-specific JavaScript loads or derives available values.
3. The user selects the required fields.
4. The submit button stays disabled until the required fields are present.
5. The page sends a JSON payload with `Telegram.WebApp.sendData(JSON.stringify(payload))`.
6. If the page is opened outside Telegram, the same JSON is shown in the browser fallback instead of being sent.

## Compatibility Boundaries

The Mini App only constructs payloads. Bot-side state handling, validation, and persistence are outside this repository. Do not rename payload `type` values or field names without updating and validating the bot.

Current payload shapes produced by this repo:

```json
{"type":"vehicle_selection","brand":"...","model":"...","year":"..."}
{"type":"area_selection","city":"...","area":"..."}
{"type":"datetime_selection","datetime":"YYYY-MM-DD HH:MM","date":"YYYY-MM-DD","time":"HH:MM"}
```

The exact Telegram bot handlers and FSM states consuming these payloads are not present in this repository. [Unknown / Needs human confirmation]

## What Can Break

- Removing the Telegram SDK script before local scripts can make `window.Telegram.WebApp` unavailable inside Telegram.
- Changing data keys or payload keys can break bot parsing.
- Changing `data/cars.json` or `data/areas.json` without keeping bot-side allowlists compatible can make the UI show values the bot rejects.
- Removing the browser fallback makes manual local testing harder and can hide payload regressions.
