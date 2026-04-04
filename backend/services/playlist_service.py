import requests
from backend.utils.utils import get_headers


def playlist_data(access_token, url):
    playlist_id = url.split("/")[-1].split("?")[0]
    headers = get_headers(access_token)

    # Playlist metadata
    meta = requests.get(
        f"https://api.spotify.com/v1/playlists/{playlist_id}",
        headers=headers
    ).json()

    name = meta.get("name")
    image = meta.get("images", [{}])[0].get("url")

    # Tracks
    endpoint = f"https://api.spotify.com/v1/playlists/{playlist_id}/items"

    total_tracks = 0
    total_duration = 0
    artist_counts = {}

    while endpoint:
        data = requests.get(endpoint, headers=headers).json()

        for item in data["items"]:
            track = item.get("track") or item.get("item")
            if not track:
                continue

            total_tracks += 1
            total_duration += track.get("duration_ms", 0)

            for artist in track.get("artists", []):
                artist_counts[artist["name"]] = artist_counts.get(artist["name"], 0) + 1

        endpoint = data.get("next")

    # Metrics
    avg_duration = total_duration / total_tracks if total_tracks else 0
    artist_diversity = (len(artist_counts) / total_tracks) if total_tracks else 0
    top_artist = max(artist_counts.values()) if artist_counts else 0
    artist_concentration = top_artist / total_tracks if total_tracks else 0

    return {
        "name": name,
        "image": image,
        "total_tracks": total_tracks,
        "total_duration": format_duration(total_duration),
        "avg_duration": format_duration(avg_duration),
        "artist_diversity": round(artist_diversity * 100, 1),
        "artist_concentration": round(artist_concentration * 100, 1),
    }


def format_duration(ms):
    minutes = (ms // 1000) // 60
    hours = minutes // 60

    return f"{minutes} min" if hours == 0 else f"{hours}h {minutes % 60}min"
