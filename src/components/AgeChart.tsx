import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ChartDatum } from "../types/persona";

type AgeChartProps = {
  data: ChartDatum[];
};

export default function AgeChart({ data }: AgeChartProps) {
  return (
    <section className="rounded-[28px] border border-[#bfe8f3] bg-[#d9f0ec] p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#121b33]">Age distribution</h2>
        <p className="mt-1 text-sm text-[#4b6275]">
          Estimated cohort size by age group.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#d7e7ee" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#4b6275", fontSize: 13 }}
              axisLine={{ stroke: "#b7dce8" }}
              tickLine={{ stroke: "#b7dce8" }}
            />
            <YAxis
              tick={{ fill: "#4b6275", fontSize: 13 }}
              axisLine={{ stroke: "#b7dce8" }}
              tickLine={{ stroke: "#b7dce8" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f7fbfc",
                border: "1px solid #bfe8f3",
                borderRadius: "16px",
                color: "#121b33",
              }}
              cursor={{ fill: "rgba(14, 165, 234, 0.08)" }}
            />
            <Bar dataKey="value" fill="#0ea5ea" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}