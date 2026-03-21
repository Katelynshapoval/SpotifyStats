import { FaSpotify } from "react-icons/fa";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base px-8 ">
      <div className="w-full max-w-md bg-neutral-800 text-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-neutral-400">
            You need to log in to see your stats 🎧
          </p>
        </div>

        <img
          className="h-40 object-contain"
          src="/img/musicCat.png"
          alt="Music cat illustration"
        />

        <button className="w-full flex items-center justify-center gap-3 bg-green-500 text-black font-semibold py-3 rounded-full hover:bg-green-400 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer">
          <FaSpotify className="text-lg" />
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

export default Login;
