from flask import Flask, redirect, request, session, render_template
from flask_cors import CORS

from auth import get_auth_url, get_tokens
from user_data import get_user_profile

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])
app.secret_key = "super_secret_key"


# Check if user is logged in
@app.route("/me")
def me():
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
@app.route("/profile")
def profile():
    if "access_token" not in session:
        return {"error": "Not logged in"}, 401

    return get_user_profile(session["access_token"])


# Handle playlist input
@app.route("/sendLink", methods=["POST"])
def send_link():
    if "access_token" not in session:
        return redirect("/login")

    playlist_url = request.form.get("playlist")
    return {"message": "Playlist received", "url": playlist_url}


if __name__ == "__main__":
    app.run(debug=True)
