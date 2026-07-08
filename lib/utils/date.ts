// Date helpers (e.g. weekday/weekend classification for pricing).
// TODO: implement (see PROJECT_ANALYSIS.md §6 pricing edge case)

// Parses the "YYYY-MM" calendar nav query param, falling back to the
// current month for missing/invalid values.
export function parseMonthParam(monthParam: string | undefined): { year: number; month: number } {
  const match = monthParam ? /^(\d{4})-(\d{2})$/.exec(monthParam) : null;
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    if (month >= 0 && month <= 11) {
      return { year, month };
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}
