# utils.py

# Requires:
# pip install simple-justwatch-python-api

from simplejustwatchapi.justwatch import search, offers_for_countries
from typing import List, Optional, NamedTuple


class StreamingOffer(NamedTuple):
    service_name: str
    icon_url: str
    offer_url: str


def get_au_streaming_offers_for_film(
    title: str,
    max_search_results: int = 5,
) -> Optional[List[StreamingOffer]]:
    """
    Search JustWatch (Australia) for the film and return a
    deduplicated list of FLATRATE (subscription) streaming services.
    """
    entries = search(title, country="AU", language="en", count=max_search_results, best_only=True)
    if not entries:
        return None

    entry = entries[0]
    node_id = entry.entry_id

    offers_by_country = offers_for_countries(node_id, {"AU"}, language="en", best_only=True)
    offers = offers_by_country.get("AU", [])
    flatrate = [
        o for o in offers
        if o.monetization_type in ["FLATRATE", "ADS"]
        and o.package
        and o.package.icon
    ]
    if not flatrate:
        return None

    seen = {}
    for offer in flatrate:
        name = offer.package.name.strip()
        if name not in seen:
            seen[name] = StreamingOffer(
                service_name=name,
                icon_url=offer.package.icon,
                offer_url=offer.url,
            )

    return list(seen.values())


# Optional CLI test
if __name__ == "__main__":
    film = "Triangle of Sadness"
    services = get_au_streaming_offers_for_film(film)
    if services:
        print(f"{film} is available on:")
        for s in services:
            print(f" - {s.service_name}: {s.offer_url}")
    else:
        print(f"No streaming info found for {film}")
