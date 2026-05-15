# Car Selection Flow

## Purpose

The car selector lets a user choose a brand, model, and manufacturing year, then returns a `vehicle_selection` payload to the Telegram bot.

## Inputs

- `data/cars.json`, fetched by `car.js` with `cache: "no-store"`.
- User search text in `brandSearch` and `modelSearch`.
- User-selected year from `yearSelect`.

`car.js` accepts `cars.json` only when it is a top-level object and every value is an array. It does not currently validate that every brand/model entry is a non-empty string or that arrays are unique.

## Output Payload

```json
{"type":"vehicle_selection","brand":"...","model":"...","year":"..."}
```

These keys are part of the bot-facing contract. Do not rename `type`, `brand`, `model`, or `year` without changing the bot.

## Flow

1. `MiniApp.initTelegram()` runs on page load.
2. `fillYearOptions()` adds years from the current local year down to `1980`.
3. `loadCars()` fetches and validates `data/cars.json`.
4. Brands are sorted with Arabic locale comparison.
5. Selecting a brand clears any previous model and enables model search.
6. Models for the selected brand are sorted with Arabic locale comparison.
7. The submit button is enabled only when brand, model, and year are all selected.
8. On submit, `MiniApp.submitPayload()` sends or displays the payload.

## Search And Empty States

Search uses `MiniApp.filterValues()`, which trims, normalizes with `NFKD`, lowercases with Arabic locale, and checks substring matches.

If no car search matches exist and the relevant list contains `"Other"`, `car.js` shows `"Other"` as a fallback option for a non-empty query. If `"Other"` is removed from a brand/model list, that fallback disappears.

If loading fails or the JSON shape is invalid, the page shows `loadError` and leaves submit disabled.

## What Can Break

- Changing the object-of-arrays shape of `data/cars.json` breaks `validateCarData()`.
- Removing expected DOM IDs in `car.html` breaks `carElements`.
- Renaming payload keys breaks bot compatibility.
- Changing or removing `"Other"` changes fallback behavior.
- Bot-side accepted vehicle values may differ from this file unless the bot allowlist is kept in sync. [Unknown / Needs human confirmation]
