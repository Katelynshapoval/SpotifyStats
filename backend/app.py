from flask import Flask, redirect, request, session, render_template
from auth import get_auth_url, get_tokens
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "super_secret_key"


@app.route("/")
def index():
    logged_in = "access_token" in session
    return render_template("index.html", logged_in=logged_in)


@app.route("/me")
def me():
    if "access_token" in session:
        return {"logged_in": True}
    return {"logged_in": False}


@app.route("/login")
def login():
    return redirect(get_auth_url())


@app.route("/callback")
def callback():
    code = request.args.get("code")

    if not code:
        return "Error: No code provided"

    tokens = get_tokens(code)

    session["access_token"] = tokens["access_token"]
    session["refresh_token"] = tokens.get("refresh_token")

    return redirect("http://localhost:5173")


@app.route("/sendLink", methods=["POST"])
def send_link():
    if "access_token" not in session:
        return redirect("/login")

    playlist_url = request.form.get("playlist")
    return f"Playlist received: {playlist_url}"


if __name__ == "__main__":
    app.run(debug=True)
