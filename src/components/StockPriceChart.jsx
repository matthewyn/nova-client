import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";

function StockPriceChart({ chartData }) {
  const isPositive =
    chartData.length >= 2
      ? chartData[chartData.length - 1].equity >= chartData[0].equity
      : true;

  const strokeColor = isPositive ? "#1a6b4a" : "#dc2626";
  const gradientColor = isPositive ? "#22c55e" : "#ef4444";

  const xAxisTicks =
    chartData.length > 0
      ? [chartData[0].date, chartData[chartData.length - 1].date]
      : [];

  const formatXAxis = (tick) => {
    if (!tick) return "";
    return new Date(tick).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
          <p className="text-gray-500 text-xs">
            {new Date(label).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="font-semibold text-gray-900">
            Rp {payload[0].value.toLocaleString("id-ID")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {chartData.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4 justify-end">
            <div className="w-8 h-2 bg-[#1a6b4a] rounded-full">&nbsp;</div>
            <h4>Nilai Investasi</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={gradientColor}
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradientColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                ticks={xAxisTicks}
                tickFormatter={formatXAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotoneX"
                dataKey="equity"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#colorEquity)"
                dot={false}
                activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className="text-sm text-foreground/60 text-center py-8">
          Tidak ada data harga tersedia.
        </p>
      )}
    </div>
  );
}

export default StockPriceChart;
