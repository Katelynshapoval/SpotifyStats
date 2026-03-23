import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#9955BB", "#FF69B3", "#FFFF99", "#2BD9C6", "#43318F"];

function CustomPieChart({ data, title, dataKey = "value", nameKey = "label" }) {
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
          <PieChart>
            <Pie
              data={coloredData}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="40%"
              outerRadius={70}
              labelLine={false}
              label={({ cx, cy, midAngle, outerRadius, percent }) => {
                const RADIAN = Math.PI / 180;

                const radius = outerRadius + 20;

                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    className="text-sm font-semibold"
                  >
                    {(percent * 100).toFixed(0)}%
                  </text>
                );
              }}
            />

            <Tooltip
              formatter={(value) => `${value} tracks`}
              contentStyle={{
                backgroundColor: "#18181b",
                border: "none",
                borderRadius: "10px",
                color: "white",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

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

export default CustomPieChart;
