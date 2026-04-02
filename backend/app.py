import json
import os

from flask import Flask, redirect, request, session
from flask_cors import CORS

from auth import get_auth_url, get_tokens
from backend.services.user_service import get_user_profile, get_top_tracks, get_top_artists, get_top_decades
from backend.services.playlist_service import playlist_data
from backend.services.track_service import get_track_analysis
from backend.services.ollama_service import get_roast

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])
app.secret_key = "super_secret_key"


# Check if user is logged in
@app.route("/auth/status")
def status():
    return {"logged_in": "access_token" in session}


# Redirect user to Spotify login page
@app.route("/login")
def login():
    return redirect(get_auth_url())


# Handle Spotify callback and store tokens in session
@app.route("/callback")
def callback():
    code = request.args.get("code")

    if not code:
        return {"error": "No code provided"}, 400

    tokens = get_tokens(code)

    session["access_token"] = tokens["access_token"]
    session["refresh_token"] = tokens.get("refresh_token")

    return redirect("http://127.0.0.1:5173")


# Fetch logged-in user's Spotify profile data
@app.route("/user")
def user():
    if "access_token" not in session:
        return {"error": "Not logged in"}, 401

    return get_user_profile(session["access_token"])


# Fetch user's top tracks
@app.route("/top-tracks")
def top_tracks():
    if "access_token" not in session:
        return redirect("/login")

    CACHE_FILE = "cache/topTracks.json"

    # 1. If cache exists and is not empty - return it
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r") as f:
                data = json.load(f)

                if data:  # not empty
                    print("Returning cached data")
                    return data
        except Exception as e:
            print("Failed to read cache:", e)

    # 2. Otherwise fetch from Spotify
    print("Fetching from Spotify API")
    data = get_top_tracks(session["access_token"])

    # 3. Save to cache
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print("Failed to write cache:", e)

    return data


# Fetch user's top artists
@app.route("/top-artists")
def top_artists():
    if "access_token" not in session:
        return redirect("/login")

    return get_top_artists(session["access_token"])


# Fetch user's top decades
@app.route("/top-decades")
def top_decades():
    if "access_token" not in session:
        return redirect("/login")

    return get_top_decades(session["access_token"])


# Handle playlist input
@app.route("/playlist", methods=["POST"])
def playlist():
    if "access_token" not in session:
        return redirect("/login")

    data = request.get_json()
    url = data.get("url")

    return playlist_data(session["access_token"], url)


# Fetch user's top tracks' analysis
@app.route("/top-tracks-analysis")
def top_tracks_analysis():
    if "access_token" not in session:
        return redirect("/login")

    return get_track_analysis(session["access_token"])


# Roast with ollama
@app.route("/roast")
def roast():
    if "access_token" not in session:
        return {"error": "Not logged in"}, 401

    return get_roast()


if __name__ == "__main__":
    app.run(debug=True)
