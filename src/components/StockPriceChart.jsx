import { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { ChartNoAxesCombined } from "lucide-react";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function StockPriceChart({ chartData, equityType }) {
  const isPositive =
    chartData.length >= 2
      ? chartData[chartData.length - 1].equity >= chartData[0].equity
      : true;

  const strokeColor = isPositive ? "#1a6b4a" : "#dc2626";
  const gradientColor = isPositive ? "#22c55e" : "#ef4444";

  const xAxisTickCount = 2;

  const formatXAxis = useCallback((tick) => {
    if (!tick) return "";
    return new Date(tick).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }, []);

  const tickStyle = useMemo(() => ({ fontSize: 12, fill: "#9ca3af" }), []);

  const CustomTooltip = useMemo(
    () =>
      ({ active, payload, label }) => {
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
                {equityType === "IDR" ? "Rp " : "$"}
                {payload[0].value.toLocaleString("id-ID")}
              </p>
            </div>
          );
        }
        return null;
      },
    [],
  );

  const chartMargin = useMemo(
    () => ({ top: 10, right: 0, left: 0, bottom: 0 }),
    [],
  );

  const yAxisDomain = useMemo(() => ["auto", "auto"], []);

  const activeDotConfig = useMemo(
    () => ({ r: 4, fill: strokeColor, strokeWidth: 0 }),
    [strokeColor],
  );

  return (
    <div>
      {chartData.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4 justify-end">
            <div
              className={`w-8 h-2 ${isPositive ? "bg-[#1a6b4a]" : "bg-red-500"} rounded-full`}
            >
              &nbsp;
            </div>
            <h4>Investment Value</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={chartMargin}>
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
                tickCount={xAxisTickCount}
                tickFormatter={formatXAxis}
                axisLine={false}
                tickLine={false}
                tick={tickStyle}
              />
              <YAxis hide domain={yAxisDomain} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotoneX"
                dataKey="equity"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#colorEquity)"
                dot={false}
                activeDot={activeDotConfig}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ChartNoAxesCombined className="h-16 w-16 text-primary/80" />
            </EmptyMedia>

            <EmptyTitle className="text-xl bg-gradient-to-r from-primary via-primary/80 to-blue-500 bg-clip-text text-transparent">
              No price data available
            </EmptyTitle>

            <EmptyDescription className="text-muted-foreground text-base max-w-md mx-auto">
              Please try again later.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

export default memo(StockPriceChart);
