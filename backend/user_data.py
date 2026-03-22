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
