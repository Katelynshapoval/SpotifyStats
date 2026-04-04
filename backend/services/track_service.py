import os
import requests
from dotenv import load_dotenv

load_dotenv()

SOUNDSTAT_API = os.getenv("SOUNDSTAT_API")


def get_track_analysis(track_id):
    endpoint = f"https://soundstat.info/api/v1/track/{track_id}"

    try:
        res = requests.get(
            endpoint,
            headers={
                "x-api-key": SOUNDSTAT_API,
                "accept": "application/json",
            },
            timeout=10,
        )
        res.raise_for_status()
        data = res.json()

        features = data.get("features", {})

        return {
            "genre": data.get("genre"),
            "popularity": data.get("popularity"),
            "features": {
                "danceability": features.get("danceability"),
                "energy": features.get("energy"),
                "acousticness": features.get("acousticness"),
                "valence": features.get("valence"),
                "tempo": features.get("tempo"),
            },
        }

    except requests.RequestException as e:
        print(f"SoundStat error for track {track_id}: {e}")
        return None
