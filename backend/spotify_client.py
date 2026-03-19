from collections import Counter

import requests
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("SPOTIFY_ACCESS_TOKEN")


def playlist_data(url):
    playlist_id = url.split("/")[-1].split("?")[0]
    endpoint = f"https://api.spotify.com/v1/playlists/{playlist_id}/items"

    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    r = requests.get(endpoint, headers=headers)
    print("Status:", r.status_code)
    print(r.text)

    try:
        data = r.json()
        print("JSON parsed successfully")
        print(data.keys())
        return data
    except Exception as e:
        print("JSON parsing failed:", e)
        return None


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
