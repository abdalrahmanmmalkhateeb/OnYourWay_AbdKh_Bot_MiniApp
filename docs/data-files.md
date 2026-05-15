# Data Files

## Purpose

The `data/` directory contains static JSON allowlists consumed by the selector pages.

## cars.json

Current structure:

```json
{
  "Brand": ["Model", "Other"]
}
```

`car.js` requires a top-level object where every value is an array. It does not require each array to include `"Other"`, but when `"Other"` exists it can be shown as a fallback for a non-empty search with no matches.

The selected values are submitted as:

```json
{"type":"vehicle_selection","brand":"Brand","model":"Model","year":"2026"}
```

## areas.json

Current structure:

```json
{
  "City": ["Area"]
}
```

`area.js` requires a top-level object where every value is an array. There is no `"Other"` fallback for areas.

The selected values are submitted as:

```json
{"type":"area_selection","city":"City","area":"Area"}
```

## Loading Behavior

Both data files are fetched with `cache: "no-store"` so the selector pages try to read fresh static JSON when opened.

If fetch fails, HTTP status is not OK, or JSON validation fails, the page shows its load error and keeps submit disabled.

## Compatibility Rules

The visible values in these JSON files should stay compatible with whatever the Telegram bot accepts. This repository cannot confirm the current deployed bot allowlists. [Unknown / Needs human confirmation]

Do not change the JSON shape unless the page scripts and bot validation are updated together.
