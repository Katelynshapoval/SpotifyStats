import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#9955BB", "#FF69B3", "#FFFF99", "#2BD9C6", "#43318F"];

function CustomBarChart({
  data,
  title,
  dataKey = "value",
  nameKey = "label",
  unit = "tracks",
}) {
  const coloredData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="w-full h-[350px] bg-neutral-900 rounded-2xl shadow-lg p-5 flex">
      {/* Chart */}
      <div className="flex-1">
        {title && (
          <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={coloredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />

            <XAxis
              dataKey={nameKey}
              stroke="#aaa"
              tick={{ fill: "#ccc", fontSize: 12 }}
            />

            <YAxis
              stroke="#aaa"
              tick={{ fill: "#ccc", fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip
              formatter={(value, name, props) => {
                const label = props.payload?.[nameKey];

                if (unit === "%") {
                  return [`${label}: ${value}%`, ""];
                }

                return [`${label}: ${value} track${value > 1 ? "s" : ""}`, ""];
              }}
              labelFormatter={() => ""}
              separator=""
              contentStyle={{
                backgroundColor: "#18181b",
                border: "none",
                borderRadius: "10px",
                color: "white",
              }}
              itemStyle={{ color: "#fff" }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />

            <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
              {coloredData.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col justify-center gap-3 ml-6">
        {coloredData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-sm text-white">{entry[nameKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomBarChart;
