from collections import Counter

import requests
import os
from dotenv import load_dotenv

from utils import get_headers

load_dotenv()

TOKEN = os.getenv("SPOTIFY_ACCESS_TOKEN")


def playlist_data(access_token, url):
    playlist_id = url.split("/")[-1].split("?")[0]

    headers = get_headers(access_token)

    # Playlist data
    meta_res = requests.get(
        f"https://api.spotify.com/v1/playlists/{playlist_id}",
        headers=headers
    )
    meta_res.raise_for_status()
    meta = meta_res.json()

    playlist_name = meta.get("name")
    playlist_image = None

    images = meta.get("images", [])
    if images:
        playlist_image = images[0].get("url")

    # Songs

    endpoint = f"https://api.spotify.com/v1/playlists/{playlist_id}/items"

    total_tracks = 0
    total_duration = 0
    artist_counts = {}

    while endpoint:
        res = requests.get(endpoint, headers=headers)
        res.raise_for_status()
        data = res.json()

        for item in data["items"]:
            print(item)
            track = item.get("item")
            if not track:
                continue

            total_tracks += 1
            total_duration += track.get("duration_ms", 0)

            for artist in track.get("artists", []):
                name = artist["name"]
                artist_counts[name] = artist_counts.get(name, 0) + 1

        endpoint = data["next"]

    # Final metrics
    avg_duration = total_duration / total_tracks if total_tracks else 0
    unique_artists = len(artist_counts)
    artist_diversity = unique_artists / total_tracks if total_tracks else 0
    top_artist_tracks = max(artist_counts.values()) if artist_counts else 0
    artist_concentration = top_artist_tracks / total_tracks if total_tracks else 0

    return {
        "name": playlist_name,
        "image": playlist_image,
        "total_tracks": total_tracks,
        "total_duration": format_duration(total_duration),
        "avg_duration": format_duration(avg_duration),
        "artist_diversity": round(artist_diversity * 100, 1),
        "artist_concentration": round(artist_concentration * 100, 1),
    }


def format_duration(ms):
    seconds = ms // 1000
    minutes = seconds // 60
    hours = minutes // 60

    if hours == 0:
        return f"{minutes} min"
    else:
        remaining_minutes = minutes % 60
        return f"{hours}h {remaining_minutes}min"


def clean_playlist_data(data):
    cleaned_tracks = []

    if not data or "items" not in data:
        return cleaned_tracks

    for item in data["items"]:
        track = item.get("track")

        if not track:
            continue

        cleaned_tracks.append({
            "track_name": track["name"],
            "artist": track["artists"][0]["name"],
            "artist_id": track["artists"][0]["id"],
            "album": track["album"]["name"],
            "duration_min": track["duration_ms"] / 60000,
            "popularity": track["popularity"],
            "explicit": track["explicit"],
        })

    return cleaned_tracks


def get_top_artists(cleaned_tracks):
    artists = [track["artist"] for track in cleaned_tracks]
    counts = Counter(artists)

    # get top 10
    top = counts.most_common(10)

    labels = [artist for artist, _ in top]
    values = [count for _, count in top]

    return labels, values
