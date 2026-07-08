const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Dynamic route segments that are really DB primary keys (booking/payment/
// promotion IDs) get fed straight into a `.eq("id", value)` query. A
// malformed value still reaches the database today and fails there
// (caught by the page's error state) — this lets the page fail fast with
// a precise 404 instead of a generic "unable to load" message, and skips
// a guaranteed-fail round trip to the database.
export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}
