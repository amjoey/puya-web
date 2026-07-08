import { CONTACT_INFO } from "@/lib/constants/contact";

// No-API-key Google Maps embed (query-based iframe) — see PRD.md > Contact
// Page. Swap for an API-key-based embed (GOOGLE_MAPS_API_KEY) if richer
// interaction (custom markers, directions) is needed later.
export function MapEmbed() {
  const query = encodeURIComponent(CONTACT_INFO.address);

  return (
    <iframe
      title="PUYA Beach Villa location"
      src={`https://maps.google.com/maps?q=${query}&output=embed`}
      className="aspect-4/3 w-full rounded-xl border border-border tablet:aspect-16/9"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
