import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiPlayList2Fill } from "react-icons/ri";

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    fetch("http://127.0.0.1:5000/auth/status", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(data.logged_in);
      });
  }, []);

  // Fetch user data ONLY if logged in
  useEffect(() => {
    if (!loggedIn) return;

    fetch("http://127.0.0.1:5000/user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;

    fetch("http://127.0.0.1:5000/top-tracks", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTopTracks(data);
      });
  }, [loggedIn]);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    }
  }, [loggedIn]);

  // Prevent rendering until auth + user data are ready
  if (loggedIn === null || user === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-surface-alt text-lg font-semibold">
        <img src="logo.ico" alt="logo" className="h-6 w-6" />
        <span>Spotify Stats</span>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center gap-6 px-4 py-6">
        <h1 className="text-2xl text-center">Hello, {user.name}</h1>

        {/* Playlist input */}
        <div className="relative w-full max-w-md">
          <RiPlayList2Fill className="absolute left-3 top-1/2 -translate-y-1/2 text-light text-lg pointer-events-none" />

          <input
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-brand outline-none transition-all duration-150 focus:bg-brand-bright"
            type="text"
            placeholder="Enter the playlist link"
          />
        </div>

        {/* User stats */}
        <div className="flex flex-col gap-3">
          {/* Top tracks */}
          <div className="text-center text-xl mb-4">Top 5 tracks</div>
          {topTracks.map((t, i) => (
            <div key={t.id} className="flex items-center gap-4">
              {/* Rank */}
              <span className="w-6 text-right">{i + 1}</span>

              {/* Image */}
              <img src={t.image} alt={t.name} className="w-12 h-12 rounded" />

              {/* Text */}
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-neutral-400">{t.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
