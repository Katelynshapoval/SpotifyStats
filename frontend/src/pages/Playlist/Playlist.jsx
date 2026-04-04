import { RiPlayList2Fill } from "react-icons/ri";
import { IoSendOutline } from "react-icons/io5";
import { useState } from "react";
import "./Playlist.css";
function Playlist() {
  const [playlistInput, setPlaylistInput] = useState("");
  const [playlistData, setPlaylistData] = useState(null);
  const handleSubmit = () => {
    fetch("http://127.0.0.1:5000/playlist", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: playlistInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaylistData(data);
        setPlaylistInput("");
      });
  };
  return (
    <div className="flex flex-col items-center text-white">
      {/* INPUT */}
      <div className="flex items-stretch">
        <div className="relative w-120">
          <RiPlayList2Fill className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
          <input
            className="w-full pl-10 pr-3 py-3 rounded-l-lg bg-[#1e1e1e] border border-neutral-700 outline-none focus:border-green-500 transition"
            type="text"
            value={playlistInput}
            onChange={(e) => setPlaylistInput(e.target.value)}
            placeholder="Enter playlist link"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 bg-green-500 hover:bg-green-400 text-black rounded-r-lg transition cursor-pointer"
        >
          <IoSendOutline className="text-xl" />
        </button>
      </div>

      {playlistData && (
        <main className="mt-10 w-full max-w-2xl flex flex-col gap-6 items-center">
          {/* TITLE */}
          <h1 className="text-3xl font-semibold">{playlistData.name}</h1>

          {/* IMAGE */}
          {playlistData.image && (
            <img
              className="w-40 h-40 object-cover rounded-lg shadow-lg"
              src={playlistData.image}
              alt="Playlist"
            />
          )}

          {/* STATS */}
          <div className="flex flex-wrap justify-center gap-5">
            {[
              { label: "Tracks", value: playlistData.total_tracks },
              { label: "Total Duration", value: playlistData.total_duration },
              { label: "Avg Duration", value: playlistData.avg_duration },
              {
                label: "Artist Diversity",
                value: `${playlistData.artist_diversity}%`,
              },
              {
                label: "Top Artist Share",
                value: `${playlistData.artist_concentration}%`,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="w-[140px] sm:w-[160px] p-4 rounded-xl bg-[#121212] border border-neutral-800 shadow-md hover:border-green-500 transition"
              >
                <p className="text-sm text-neutral-400">{item.label}</p>
                <h2 className="text-xl font-semibold text-green-400 mt-1">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default Playlist;
