"use client";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// import newYorkTrends from "./exampleData";
import { GoogleTrendsAPIResponse } from "./APIResponseTypes";

export default function MyChart({
  data,
}: {
  data: GoogleTrendsAPIResponse[];
}): JSX.Element {
  const tickFormatter = (value: string, index: number) => {
    const limit = 10; // put your maximum character
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="termName" tickFormatter={tickFormatter} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="avgRankValue"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="avgScoreValue"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
