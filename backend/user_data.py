from collections import Counter

import requests
from utils import get_headers

BASE_URL = "https://api.spotify.com/v1"


def get_user_profile(access_token):
    res = requests.get(f"{BASE_URL}/me", headers=get_headers(access_token))
    res.raise_for_status()
    data = res.json()

    return {
        "name": data.get("display_name"),
        "id": data.get("id"),
    }


def get_top_tracks(access_token):
    res = requests.get(
        f"{BASE_URL}/me/top/tracks?limit=10",
        headers=get_headers(access_token)
    )
    res.raise_for_status()
    data = res.json()

    return [
        {
            "name": item["name"],
            "artist": item["artists"][0]["name"] if item["artists"] else None,
            "id": item["id"],
            "image": item["album"]["images"][0]["url"] if item["album"]["images"] else None,
        }
        for item in data.get("items", [])
    ]


def get_top_artists(access_token):
    res = requests.get(
        f"{BASE_URL}/me/top/artists?limit=5",
        headers=get_headers(access_token)
    )
    res.raise_for_status()
    data = res.json()

    return [
        {
            "name": item["name"],
            "image": item["images"][0]["url"] if item["images"] else None,
        }
        for item in data.get("items", [])
    ]


def get_top_decades(access_token):
    res = requests.get(
        f"{BASE_URL}/me/top/tracks?limit=50",
        headers=get_headers(access_token)
    )
    res.raise_for_status()

    tracks = res.json().get("items", [])

    decades = []

    for track in tracks:
        album = track.get("album", {})
        release_date = album.get("release_date")

        if not release_date:
            continue

        year = int(release_date[:4])
        decade = (year // 10) * 10
        decades.append(decade)

    counter = Counter(decades)

    return [
        {"decade": f"{dec}s", "count": count}
        for dec, count in counter.most_common(5)
    ]
