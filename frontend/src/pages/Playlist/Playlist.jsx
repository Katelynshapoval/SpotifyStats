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
    <div className="flex flex-col items-center">
      <div className="flex items-stretch">
        <div className="relative w-100">
          <RiPlayList2Fill className="absolute left-3 top-1/2 -translate-y-1/2 text-light text-lg" />
          <input
            className="w-full pl-10 pr-3 py-3 rounded-l-lg bg-brand outline-none focus:bg-brand-bright transition"
            type="text"
            value={playlistInput}
            onChange={(e) => setPlaylistInput(e.target.value)}
            placeholder="Enter the playlist link"
          />
        </div>

        <button
          onClick={() => handleSubmit()}
          className="flex items-center px-4 bg-brand-bright cursor-pointer hover:text-black transition-all duration-150 ease-in-out rounded-r-lg"
        >
          <IoSendOutline className="text-xl" />
        </button>
      </div>
      {playlistData && (
        <main className="mt-8 w-full max-w-2xl flex flex-col gap-5">
          <h1 className="text-3xl text-center">{playlistData.name}</h1>
          {playlistData.image && (
            <img
              className="w-1/3 m-auto"
              src={playlistData.image}
              alt="Playlist Image"
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tracks */}
            <div className="dataCell">
              <p>Tracks</p>
              <h2>{playlistData.total_tracks}</h2>
            </div>

            {/* Total Duration */}
            <div className="dataCell">
              <p>Total Duration</p>
              <h2>{playlistData.total_duration}</h2>
            </div>

            {/* Avg Duration */}
            <div className="dataCell">
              <p>Avg Duration</p>
              <h2>{playlistData.avg_duration}</h2>
            </div>

            {/* Artist Diversity */}
            <div className="dataCell">
              <p>Artist Diversity</p>
              <h2>{playlistData.artist_diversity}%</h2>
            </div>

            {/* Artist Concentration */}
            <div className="dataCell">
              <p>Top Artist Share</p>
              <h2>{playlistData.artist_concentration}%</h2>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Playlist;
