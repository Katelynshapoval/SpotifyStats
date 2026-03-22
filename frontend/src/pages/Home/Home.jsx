import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiPlayList2Fill } from "react-icons/ri";
import CustomPieChart from "../../components/CustomPieChart";

function Home() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topDecades, setTopDecades] = useState([]);

  // Check auth
  useEffect(() => {
    fetch("http://127.0.0.1:5000/auth/status", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.logged_in));
  }, []);

  // Fetch everything once logged in
  useEffect(() => {
    if (!loggedIn) return;

    const fetchData = async () => {
      const [userRes, tracksRes, artistsRes, decadesRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/user", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/top-tracks", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/top-artists", { credentials: "include" }),
        fetch("http://127.0.0.1:5000/top-decades", { credentials: "include" }),
      ]);

      const userData = await userRes.json();
      const tracksData = await tracksRes.json();
      const artistsData = await artistsRes.json();
      const decadesData = await decadesRes.json();

      console.log(decadesData);

      setUser(userData);
      setTopTracks(tracksData);
      setTopArtists(artistsData);
      setTopDecades(decadesData);
    };

    fetchData();
  }, [loggedIn]);

  // Redirect if not logged in
  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    }
  }, [loggedIn]);

  // Loading state
  if (loggedIn === null || user === null) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-surface-base text-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-alt text-lg font-semibold">
        <img src="logo.ico" alt="logo" className="h-6 w-6" />
        <span>Spotify Stats</span>
      </header>

      <main className="px-4 py-6 flex flex-col items-center gap-8">
        <h1 className="text-2xl">Hello, {user.name}</h1>

        {/* Playlist input */}
        <div className="relative w-full max-w-md">
          <RiPlayList2Fill className="absolute left-3 top-1/2 -translate-y-1/2 text-light text-lg" />
          <input
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-brand outline-none focus:bg-brand-bright transition"
            type="text"
            placeholder="Enter the playlist link"
          />
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
          {/* Top Tracks Card */}
          <div className="card">
            <h2 className="card-title">Top Tracks</h2>

            <div className="flex flex-col gap-3">
              {topTracks.slice(0, 5).map((t, i) => (
                <div key={t.id} className="item">
                  <span className="rank">{i + 1}</span>

                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-md"
                  />

                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-neutral-400">{t.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Artists Card */}
          <div className="card">
            <h2 className="card-title">Top Artists</h2>

            <div className="flex flex-col gap-3">
              {topArtists.slice(0, 5).map((a, i) => (
                <div key={a.id} className="item">
                  <span className="rank">{i + 1}</span>

                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-12 h-12 rounded-full"
                  />

                  <p className="font-medium">{a.name}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Top Decades */}
          <CustomPieChart
            data={topDecades}
            title="Top Decades"
            dataKey="count"
            nameKey="decade"
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
