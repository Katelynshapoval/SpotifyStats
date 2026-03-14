import requests
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("SPOTIFY_ACCESS_TOKEN")


def playlist_data(url):
    playlist_id = url.split("/")[-1].split("?")[0]
    endpoint = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    r = requests.get(endpoint, headers=headers)
    return r.json()
