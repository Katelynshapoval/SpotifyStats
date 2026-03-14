from flask import Flask, request, render_template
from spotify_api import playlist_data

app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html")


@app.route("/sendLink", methods=["POST"])
def send_link():
    playlist_url = request.form["playlist"]

    data = playlist_data(playlist_url)

    print(data)

    return render_template("playlist.html", data=data)


app.run(debug=False)
