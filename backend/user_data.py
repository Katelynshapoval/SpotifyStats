import requests


def get_user_profile(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(
        "https://api.spotify.com/v1/me",
        headers=headers
    )
    response.raise_for_status()

    data = response.json()

    return {
        "name": data.get("display_name"),
        "id": data.get("id"),
    }


def get_top_tracks(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get("https://api.spotify.com/v1/me/top/tracks?limit=5", headers=headers)

    response.raise_for_status()

    data = response.json()

    tracks = []

    for item in data["items"]:
        tracks.append({
            "name": item["name"],
            "artist": item["artists"][0]["name"],
            "id": item["id"],
            "image": item["album"]["images"][0]["url"],
        })

    return tracks


def get_top_artists(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get("https://api.spotify.com/v1/me/top/artists?limit=5", headers=headers)

    response.raise_for_status()

    data = response.json()

    artists = []

    for item in data["items"]:
        artists.append({
            "name": item["name"],
            "image": item["images"][0]["url"],
        })

    return artists
