// Wraps a data-loading call with the try/catch → loadError boolean pattern
// repeated across nearly every Server Component page in this app (admin
// dashboard pages, the public booking flow, the availability calendar).
// Preserves exact existing semantics: on any failure, `data` is the
// caller-supplied fallback and `error` is true — including the
// Promise.all "all-or-nothing" case, since the whole `fetcher` call
// (which may itself be `() => Promise.all([...])`) is one try/catch unit.
export async function safeFetch<T>(
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<{ data: T; error: boolean }> {
  try {
    return { data: await fetcher(), error: false };
  } catch {
    return { data: fallback, error: true };
  }
}
