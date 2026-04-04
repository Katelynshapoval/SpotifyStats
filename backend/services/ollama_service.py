import requests
import json
import os

CACHE_FILE = os.path.join(
    os.path.dirname(__file__),
    "../cache/topTracks.json"
)

OLLAMA_URL = "http://localhost:11434/api/generate"


def get_tracks_from_cache():
    if not os.path.exists(CACHE_FILE):
        return []

    try:
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []


def build_prompt(tracks):
    simplified = [
        {
            "artist": t.get("artist"),
            "genre": t.get("analysis", {}).get("genre") if t.get("analysis") else None,
        }
        for t in tracks
    ]

    return f"""
You are a sharp, funny music critic with subtle Gen Z humor.

You are roasting someone's music taste based on their listening data.
Focus on THEIR PERSONALITY, not the music itself.

Music data:
{simplified}

ROAST STYLE:
- 1–2 sentences only
- Focus on the PERSON, not the playlist
- Infer personality, habits, or identity
- Make it feel slightly uncomfortably accurate
- Do NOT describe artists, songs, or genres directly

BAD (never do this):
- "This playlist is like..."
- "Nickelback + Bon Jovi..."
- "Your music sounds like..."

GOOD:
- "You seem like the type of person who..."
- "This feels like someone who..."
- "Your personality screams..."

If you mention specific artists, genres, or songs, the answer is WRONG. Regenerate internally.

Examples (KEEP THIS TONE EXACT):

Example 1:
"Is this supposed to be a vibe, or did you just throw your childhood CDs in random order?"

Example 2:
"Pretty sure this is the musical equivalent of texting 'k'—confusing and kind of sad."

Example 3:
"Is this a playlist or a hostage situation for my ears?"

---

INSIGHT STYLE (VERY IMPORTANT):

You MUST follow this EXACT structure and tone:

Era: High school nostalgia  
Vibe: Melancholic daydream  
Trait: Thinking every heartbreak is Shakespeare-level tragedy  

Era: Summer of 'I hate everyone'  
Vibe: Angry energy  
Trait: Using playlists to validate that society personally wronged you  

Era: First college party  
Vibe: Chaotic hype  
Trait: Thinking being loud makes you interesting  

Era: Mid-20s burnout  
Vibe: Existential dread  
Trait: Acting like skipping responsibilities is 'living authentically'  

Era: Sleep-deprived student  
Vibe: Chaotic grind  
Trait: Thinking a study playlist makes you a genius  

Era: First job blues  
Vibe: Lowkey panic  
Trait: Complaining about life while listening to motivational playlists you'll ignore  

RULES:
- Keep each field SHORT (max 5–6 words)
- Write like labels, not full sentences
- Slight irony, not jokes
- Avoid generic phrases like "nostalgia music"
- Do NOT repeat the same wording across fields

---

Return ONLY valid JSON:

{{
  "roast": "max 2 sentences",
  "animal": "2 words max",
  "vibe": "short label like examples",
  "era": "short phrase like examples",
  "toxic_trait": "short ironic phrase like examples"
}}
"""


def get_roast():
    tracks = get_tracks_from_cache()

    if not tracks:
        return {"error": "No track data available"}

    prompt = build_prompt(tracks)

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "minimax-m2.5:cloud",
            "prompt": prompt,
            "stream": False
        }
    )

    if response.status_code != 200:
        return {"error": "Ollama request failed"}

    data = response.json()

    try:
        return json.loads(data.get("response", "{}"))
    except Exception:
        return {
            "raw": data.get("response")
        }
