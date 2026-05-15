# Sensitive Rules

These rules protect the current Mini App and bot integration contract.

## Do Not Change Casually

- Payload `type` values:
  - `vehicle_selection`
  - `area_selection`
  - `datetime_selection`
- Payload field names:
  - `brand`, `model`, `year`
  - `city`, `area`
  - `datetime`, `date`, `time`
- Static entry filenames:
  - `car.html`
  - `area.html`
  - `date.html`
- Data file locations:
  - `data/cars.json`
  - `data/areas.json`
- Telegram SDK load order in selector pages.

## Security And Trust Boundary

Telegram Mini App payloads are client-controlled. The bot must not trust them only because they came from this UI. Bot-side validation should confirm payload shape, current conversation state, and accepted values.

The exact bot-side enforcement is outside this repository. [Unknown / Needs human confirmation]

## Data Consistency

Changing `data/cars.json` or `data/areas.json` affects what the Mini App can submit. If the bot has its own allowlists or cached runtime state, users can select values that the bot rejects.

Before publishing data changes, confirm whether the bot consumes mirrored files, hardcoded values, or deployed cached state. [Unknown / Needs human confirmation]

## Local Testing

Keep the browser fallback in `shared.js`. It is the current lightweight way to inspect the exact JSON payload outside Telegram without changing business logic.
