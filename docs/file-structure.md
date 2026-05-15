# File Structure

## Root Files

- `index.html`: static landing page for manual navigation to selector pages.
- `car.html`: markup for brand, model, year inputs, summary, submit button, load error, and browser fallback.
- `car.js`: loads `data/cars.json`, handles car search/selection state, validates the data shape, generates years, and submits `vehicle_selection`.
- `area.html`: markup for city and area inputs, summary, submit button, load error, and browser fallback.
- `area.js`: loads `data/areas.json`, handles city/area search and selection state, validates the data shape, and submits `area_selection`.
- `date.html`: markup for a `datetime-local` input, summary, submit button, and browser fallback.
- `date.js`: validates future date/time selection, derives formatted fields, and submits `datetime_selection`.
- `shared.js`: shared Telegram WebApp initialization, search filtering, option rendering, summary text, payload submission, and browser fallback.
- `style.css`: shared mobile-first styles for all current pages.

## Data Files

- `data/cars.json`: object of car brands to model arrays.
- `data/areas.json`: object of cities to area arrays.

## Generated Or External Files

There is no `package.json`, build output, dependency lockfile, or generated asset directory in the current repo.

## Responsibility Boundaries

The HTML files define DOM targets. The page-specific JS files own state and payload creation. `shared.js` owns reusable UI helpers and Telegram transport. The data files own the selectable values shown by the UI.

Do not move responsibilities into this repo from the Telegram bot. The bot remains responsible for interpreting payloads and enforcing trusted validation.
