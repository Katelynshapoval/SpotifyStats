import requests
import os
from dotenv import load_dotenv
from werkzeug.datastructures import Authorization

load_dotenv()

TOKEN = os.getenv("SPOTIFY_ACCESS_TOKEN")


def playlist_data(url):
    playlist_id = "54ZA9LXFvvFujmOVWXpHga"
    endpoint = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    r = requests.get(endpoint, headers=headers)
    return r.json()


print(playlist_data(""))
