import requests
import os
from dotenv import load_dotenv

load_dotenv()

SOUNDSTAT_API = os.getenv("SOUNDSTAT_API")


def get_track_analysis(track_id):
    return {"hola": "hola"}
    endpoint = f"https://soundstat.info/api/v1/track/{track_id}"

    res = requests.get(
        endpoint,
        headers={
            "x-api-key": SOUNDSTAT_API,
            "accept": "application/json"
        }
    )

    if res.status_code != 200:
        print("SoundStat error:", res.status_code, res.text)
        return None

    return res.json()
