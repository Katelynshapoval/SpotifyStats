import os

import requests
from dotenv import load_dotenv, set_key

ENV_FILE = ".env"

load_dotenv(ENV_FILE)

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
TOKEN_URL = "https://accounts.spotify.com/api/token"


def refresh_access_token():
    response = requests.post(TOKEN_URL,
                             data={"grant_type": "client_credentials"},
                             auth=(CLIENT_ID, CLIENT_SECRET))
    response.raise_for_status()
    access_token = response.json()["access_token"]

    # Save token back to .env
    set_key(ENV_FILE, "SPOTIFY_ACCESS_TOKEN", access_token)

    print("Access token updated in .env")


if __name__ == "__main__":
    refresh_access_token()
