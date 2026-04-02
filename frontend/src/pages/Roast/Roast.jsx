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
    <main className="px-4 flex flex-col items-center gap-10 w-full">
      <section className="w-full max-w-5xl flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <FaMusic className="text-green-400" />
          AI Roast
        </h1>

        {!data && (
          <button
            onClick={handleRoast}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-full font-medium transition"
          >
            {loading ? "Thinking..." : "Roast me"}
          </button>
        )}

        {data && (
          <div className="w-full flex flex-col items-center gap-8">
            {/* Roast */}
            <div className="card w-full max-w-3xl text-center">
              <h2 className="card-title">Your Roast</h2>
              <p className="text-neutral-300 leading-relaxed">{data.roast}</p>
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
          </div>
        )}
      </section>
    </main>
  );
}

function Insight({ icon, label, value }) {
  return (
    <div className="card flex flex-col items-center text-center gap-2">
      <div className="text-green-400">{icon}</div>

      <p className="text-xs uppercase text-neutral-500">{label}</p>

      <p className="text-sm font-medium text-white leading-snug">
        {value || "-"}
      </p>
    </div>
  );
}

export default Roast;
