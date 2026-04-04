import { useState } from "react";
import { FaMusic, FaPaw, FaFire, FaClock, FaSkull } from "react-icons/fa";

function Roast() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleRoast = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/roast", {
        credentials: "include",
      });
      const json = await res.json();
      setData(json);
    } catch {
      setData({ error: "Failed to roast" });
    }

    setLoading(false);
  };

  return (
    <main className="px-4 flex flex-col items-center gap-10 w-full text-white">
      {!data && (
        <section className="w-full max-w-5xl flex flex-col items-center text-center gap-6 mt-10">
          {/* Title */}
          <h1 className="text-4xl font-bold flex items-center gap-3">
            AI Roast
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-400 max-w-md text-sm">
            Let AI judge your music taste... brutally.
          </p>

          {/* Cat image */}
          <div className="relative">
            <img
              src="/img/angry_cat.png"
              alt="angry cat"
              className="w-40 sm:w-52 rounded-xl shadow-lg border border-neutral-800"
            />
          </div>

          {/* Button */}
          {!data && (
            <button
              onClick={handleRoast}
              className="mt-4 px-8 py-3 rounded-full bg-green-500 text-black font-semibold transition-colors duration-150 hover:opacity-85 cursor-pointer"
            >
              {loading ? "Thinking..." : "Roast me"}
            </button>
          )}
        </section>
      )}
      {data && (
        <section className="w-full max-w-4xl flex flex-col items-center gap-8">
          {/* Roast result */}
          <div className="w-full p-6 rounded-xl bg-[#121212] border border-neutral-800 text-center">
            <h2 className="text-lg font-semibold text-green-400 mb-3">
              Your Roast
            </h2>

            <p className="text-neutral-300 leading-relaxed">
              {data.roast || "No roast available"}
            </p>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <Insight icon={<FaPaw />} label="Animal" value={data.animal} />
            <Insight icon={<FaFire />} label="Vibe" value={data.vibe} />
            <Insight icon={<FaClock />} label="Era" value={data.era} />
            <Insight
              icon={<FaSkull />}
              label="Toxic Trait"
              value={data.toxic_trait}
            />
          </div>

          {/* Reset */}
          <button
            onClick={() => setData(null)}
            className="text-sm text-neutral-400 hover:text-white transition cursor-pointer"
          >
            Roast again
          </button>
        </section>
      )}
    </main>
  );
}

function Insight({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-[#121212] border border-neutral-800 flex flex-col items-center text-center gap-2 shadow-md hover:border-green-500 transition">
      <div className="text-green-400 text-lg">{icon}</div>

      <p className="text-xs uppercase text-neutral-500 tracking-wide">
        {label}
      </p>

      <p className="text-sm font-medium text-white leading-snug">
        {value || "-"}
      </p>
    </div>
  );
}

export default Roast;
