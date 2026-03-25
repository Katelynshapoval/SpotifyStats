import { RiPlayList2Fill } from "react-icons/ri";
import { IoSendOutline } from "react-icons/io5";
function Playlist() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-stretch">
        <div className="relative w-100">
          <RiPlayList2Fill className="absolute left-3 top-1/2 -translate-y-1/2 text-light text-lg" />
          <input
            className="w-full pl-10 pr-3 py-3 rounded-l-lg bg-brand outline-none focus:bg-brand-bright transition"
            type="text"
            placeholder="Enter the playlist link"
          />
        </div>

        <button className="flex items-center px-4 bg-brand-bright cursor-pointer hover:text-black transition-all duration-150 ease-in-out rounded-r-lg">
          <IoSendOutline className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default Playlist;
