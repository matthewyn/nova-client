"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  winRate: {
    label: "Win Rate",
    color: "#22c55e",
  },
  lossRate: {
    label: "Loss Rate",
    color: "#ef4444",
  },
};

export function ChartRadialText({
  winRate = 0,
  totalTrades = 0,
  winningTrades = 0,
  losingTrades = 0,
}) {
  const chartData = [
    {
      name: "Win Rate",
      win: winRate,
      loss: 100 - winRate,
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[192px]"
    >
      <RadialBarChart
        data={chartData}
        innerRadius={60}
        outerRadius={70}
        startAngle={90}
        endAngle={-270}
      >
        <PolarGrid gridType="circle" radialLines={false} stroke="none" />

        <RadialBar dataKey="loss" stackId="a" cornerRadius={0} fill="#ef4444" />

        <RadialBar dataKey="win" stackId="a" cornerRadius={0} fill="#22c55e" />

        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalTrades}
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 18}
                      className="fill-muted-foreground text-xs"
                    >
                      Trades
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
