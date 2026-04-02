import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

function Home() {
  const navigate = useNavigate();

  // Auth + user data
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  // Main datasets
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topDecades, setTopDecades] = useState([]);

  // Check auth status on load
  useEffect(() => {
    fetch("http://127.0.0.1:5000/auth/status", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.logged_in));
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    const fetchData = async () => {
      const [userRes, artistsRes, decadesRes, tracksRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/user", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/top-artists", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/top-decades", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/top-tracks", { credentials: "include" }),
      ]);

      const userData = await userRes.json();
      const artistsData = await artistsRes.json();
      const decadesData = await decadesRes.json();
      const tracksData = await tracksRes.json();

      setUser(userData);
      setTopTracks(tracksData);
      setTopArtists(artistsData);
      setTopDecades(decadesData);
    };

    fetchData();
  }, [loggedIn]);

  // Redirect if not logged in
  useEffect(() => {
    if (loggedIn === false) navigate("/login");
  }, [loggedIn]);

  // Loading state
  if (loggedIn === null || user === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Loading</p>
      </div>
    );
  }

  // Helper: average of array
  const avg = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // Only tracks with usable audio data
  const validTracks = topTracks.filter((t) => t.analysis?.features);

  // Top genres (counted + formatted)
  const topGenres = Object.values(
    topTracks.reduce((acc, track) => {
      let genre = track.analysis?.genre;
      if (!genre) return acc;

      // Capitalize (handles multi-word)
      genre = genre
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      if (!acc[genre]) acc[genre] = { label: genre, value: 0 };
      acc[genre].value += 1;

      return acc;
    }, {}),
  );

  // Average audio profile (converted to %)
  const audioFeatures = (() => {
    if (!validTracks.length) return [];

    const sum = validTracks.reduce(
      (acc, t) => {
        const f = t.analysis.features;
        acc.danceability += f.danceability;
        acc.energy += f.energy;
        acc.acousticness += f.acousticness;
        acc.valence += f.valence;
        return acc;
      },
      { danceability: 0, energy: 0, acousticness: 0, valence: 0 },
    );

    const count = validTracks.length;

    return [
      {
        label: "Danceability",
        value: Math.round((sum.danceability / count) * 100),
      },
      { label: "Energy", value: Math.round((sum.energy / count) * 100) },
      {
        label: "Acoustic",
        value: Math.round((sum.acousticness / count) * 100),
      },
      { label: "Mood", value: Math.round((sum.valence / count) * 100) },
    ];
  })();

  // KPI values (averages)
  const kpis = {
    energy: avg(validTracks.map((t) => t.analysis.features.energy)),
    dance: avg(validTracks.map((t) => t.analysis.features.danceability)),
    valence: avg(validTracks.map((t) => t.analysis.features.valence)),
    popularity: avg(
      topTracks
        .filter((t) => t.analysis?.popularity)
        .map((t) => t.analysis.popularity),
    ),
  };

  // Mood classification based on valence
  const moodData = (() => {
    let happy = 0,
      neutral = 0,
      sad = 0;

    topTracks.forEach((t) => {
      const v = t.analysis?.features?.valence;
      if (v == null) return;

      if (v > 0.66) happy++;
      else if (v > 0.33) neutral++;
      else sad++;
    });

    return [
      { label: "Happy", value: happy },
      { label: "Neutral", value: neutral },
      { label: "Sad", value: sad },
    ];
  })();

  // Tempo grouped into buckets
  const tempoBuckets = (() => {
    let slow = 0,
      medium = 0,
      fast = 0;

    topTracks.forEach((t) => {
      const tempo = t.analysis?.features?.tempo;
      if (!tempo) return;

      if (tempo < 90) slow++;
      else if (tempo < 130) medium++;
      else fast++;
    });

    return [
      { label: "Slow (<90 BPM)", value: slow },
      { label: "Medium (90–130)", value: medium },
      { label: "Fast (130+)", value: fast },
    ];
  })();

  return (
    <main className="px-4 flex flex-col items-center gap-10 w-full">
      {/* Overview stats */}
      <section className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-white mb-4">Overview</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Energy" value={`${(kpis.energy * 100).toFixed(0)}%`} />
          <Stat
            label="Danceability"
            value={`${(kpis.dance * 100).toFixed(0)}%`}
          />
          <Stat
            label="Happiness"
            value={`${(kpis.valence * 100).toFixed(0)}%`}
          />
          <Stat label="Popularity" value={kpis.popularity.toFixed(0)} />
        </div>
      </section>

      {/* Library (tracks + artists) */}
      <section className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-white mb-4">Library</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card">
            <h2 className="card-title">Top Tracks</h2>

            <div className="flex flex-col gap-3">
              {topTracks.slice(0, 10).map((t, i) => (
                <div key={t.id} className="item">
                  <span className="rank">{i + 1}</span>
                  <img src={t.image} className="w-12 h-12 rounded-md" />
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-neutral-400">{t.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card">
              <h2 className="card-title">Top Artists</h2>

              {topArtists.slice(0, 5).map((a, i) => (
                <div key={a.id} className="item">
                  <span className="rank">{i + 1}</span>
                  <img src={a.image} className="w-12 h-12 rounded-full" />
                  <p>{a.name}</p>
                </div>
              ))}
            </div>

            <CustomPieChart
              data={topDecades}
              title="Top Decades"
              dataKey="count"
              nameKey="decade"
            />
          </div>
        </div>
      </section>

      {/* Charts / insights */}
      <section className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-white mb-4">
          Listening Insights
        </h1>

        <div className="flex flex-col gap-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CustomBarChart data={topGenres} title="Top Genres" />
            </div>

            <CustomPieChart data={moodData} title="Mood Distribution" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CustomBarChart
                data={audioFeatures}
                title="Sound Profile (%)"
                unit="%"
              />
            </div>

            <CustomPieChart data={tempoBuckets} title="Tempo Distribution" />
          </div>
        </div>
      </section>
    </main>
  );
}

// Small reusable stat card
const Stat = ({ label, value }) => (
  <div className="card text-center">
    <p className="text-sm text-neutral-400">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Home;
