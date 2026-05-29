// src/components/VolatilityAnalysis.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calculator,
} from "lucide-react";

function useVolatility(ticker) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ticker) return;
    setIsLoading(true);
    axios
      .get(generateApiOrigin(`/volatility/${ticker}`), {
        headers: getAuthHeader(),
      })
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [ticker]);

  return { data, isLoading };
}

function MetricCard({ label, value, sub, highlight }) {
  return (
    <div
      className={`rounded-xl p-3 ${highlight ? "bg-white border border-gray-200" : "bg-gray-50"}`}
    >
      <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function RiskBadge({ risk }) {
  const map = {
    low: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[risk] ?? map.medium}`}
    >
      {risk?.charAt(0).toUpperCase() + risk?.slice(1)}
    </span>
  );
}

function VolatilityTab({ ticker, initialPrice }) {
  const { data: vol, isLoading } = useVolatility(ticker);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
      </div>
    );
  }

  if (!vol) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="ATR-14"
          value={`Rp ${Math.round(vol.atr_14).toLocaleString("id-ID")}`}
          sub="Average True Range"
        />
        <MetricCard
          label="ATR %"
          value={`${vol.atr_pct.toFixed(2)}%`}
          sub="dari harga saat ini"
        />
        <MetricCard
          label="Vol 30h"
          value={`${vol.hist_vol_30d.toFixed(1)}%`}
          sub="historical (annualized)"
        />
        <MetricCard
          label="Max Drawdown"
          value={`${vol.max_drawdown.toFixed(1)}%`}
          sub="1 tahun terakhir"
          highlight
        />
        <MetricCard
          label="Sharpe Ratio"
          value={vol.sharpe_ratio.toFixed(2)}
          sub="risk-adjusted return"
        />
        <MetricCard
          label="Beta vs IHSG"
          value={vol.beta_ihsg.toFixed(2)}
          sub="sensitivitas pasar"
        />
        <MetricCard
          label="Avg Daily Range"
          value={`${vol.avg_daily_range_pct.toFixed(1)}%`}
          sub="High–Low / Close"
        />
        <div className="rounded-xl p-3 bg-gray-50">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">
            Risk level
          </p>
          <RiskBadge risk={vol.risk_level} />
          <p className="text-[11px] text-gray-400 mt-1.5">
            {vol.risk_level === "low" && "Cocok untuk konservatif"}
            {vol.risk_level === "medium" && "Manajemen risiko ketat"}
            {vol.risk_level === "high" && "Hanya trader berpengalaman"}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 space-y-1.5">
        <p className="font-medium text-gray-800 text-sm mb-2">Interpretasi</p>
        <p>
          {vol.beta_ihsg > 1.5
            ? `Beta ${vol.beta_ihsg.toFixed(2)} — saham ini bergerak lebih agresif dari IHSG. Keuntungan lebih besar saat pasar naik, tapi kerugian juga lebih dalam saat pasar turun.`
            : vol.beta_ihsg < 0.8
              ? `Beta ${vol.beta_ihsg.toFixed(2)} — saham ini relatif defensif terhadap pergerakan IHSG.`
              : `Beta ${vol.beta_ihsg.toFixed(2)} — pergerakan saham cukup sejalan dengan IHSG.`}
        </p>
        <p>
          {vol.sharpe_ratio > 1
            ? `Sharpe ratio ${vol.sharpe_ratio.toFixed(2)} menunjukkan return yang baik relatif terhadap risikonya.`
            : vol.sharpe_ratio > 0
              ? `Sharpe ratio ${vol.sharpe_ratio.toFixed(2)} — return positif tapi tipis setelah disesuaikan risiko.`
              : `Sharpe ratio negatif — return belum cukup mengompensasi risiko yang diambil.`}
        </p>
      </div>
    </div>
  );
}

function ScenarioTab({ ticker, initialPrice, stopLoss, direction }) {
  const { data: vol } = useVolatility(ticker);

  const [equity, setEquity] = useState(10_000_000);
  const [entry, setEntry] = useState(initialPrice ?? 1000);
  const [sl, setSl] = useState(
    stopLoss ?? Math.round((initialPrice ?? 1000) * 0.92),
  );
  const [tp, setTp] = useState(Math.round((initialPrice ?? 1000) * 1.15));
  const [dir, setDir] = useState(direction ?? "long");
  const [result, setResult] = useState(null);

  const fmt = (n) => Math.round(n).toLocaleString("id-ID");
  const fmtK = (n) =>
    Math.abs(n) >= 1_000_000 ? (n / 1_000_000).toFixed(1) + " jt" : fmt(n);

  const slPct = (((sl - entry) / entry) * 100).toFixed(1);
  const tpPct = (((tp - entry) / entry) * 100).toFixed(1);

  function calculate() {
    if (!vol) return;
    const lotSize = 100;
    const shares = Math.floor(equity / entry / lotSize) * lotSize;
    const lots = shares / lotSize;
    const riskPerShare = dir === "long" ? entry - sl : sl - entry;
    const rewardPerShare = dir === "long" ? tp - entry : entry - tp;

    const maxLoss = shares * riskPerShare;
    const maxProfit = shares * rewardPerShare;
    const rr = rewardPerShare / (riskPerShare || 1);

    const txCostPct = 0.007;
    const bePct = ((txCostPct * entry) / (riskPerShare || 1)) * 100;

    const riskInATR = riskPerShare / (vol.atr_14 || 1);
    const rewardInATR = rewardPerShare / (vol.atr_14 || 1);
    const probWin = riskInATR / (riskInATR + rewardInATR);
    const probLoss = 1 - probWin;
    const ev = probWin * maxProfit - probLoss * maxLoss;
    const daysEst = Math.max(
      1,
      Math.round(Math.abs(rewardPerShare) / (vol.atr_14 || 1)),
    );

    setResult({
      shares,
      lots,
      maxLoss,
      maxProfit,
      rr,
      bePct,
      probWin,
      probLoss,
      ev,
      daysEst,
    });
  }

  const priceMin = Math.round((initialPrice ?? 500) * 0.5);
  const priceMax = Math.round((initialPrice ?? 500) * 2.5);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {["long", "short"].map((d) => (
          <button
            key={d}
            onClick={() => setDir(d)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${
              dir === d
                ? d === "long"
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-red-50 border-red-300 text-red-700"
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}
          >
            {d === "long" ? "↑ Long (beli)" : "↓ Short (jual)"}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">Modal (Rp)</label>
        <input
          type="number"
          value={equity}
          onChange={(e) => setEquity(+e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          step={1_000_000}
        />
      </div>

      <div className="space-y-4">
        {[
          {
            label: "Entry price",
            val: entry,
            set: setEntry,
            color: "text-blue-600",
          },
          { label: "Stop loss", val: sl, set: setSl, color: "text-red-500" },
          {
            label: "Take profit",
            val: tp,
            set: setTp,
            color: "text-green-600",
          },
        ].map(({ label, val, set, color }) => (
          <div key={label}>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-gray-500">{label}</label>
              <span className={`text-xs font-semibold ${color}`}>
                Rp {fmt(val)}
              </span>
            </div>
            <Slider
              min={priceMin}
              max={priceMax}
              step={Math.max(1, Math.round((initialPrice ?? 500) * 0.005))}
              value={[val]}
              onValueChange={([v]) => set(v)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-gray-50 px-4 py-3 flex gap-6 text-xs text-gray-500 flex-wrap">
        <span>
          <span className="font-medium text-green-600">TP</span>{" "}
          {+tpPct > 0 ? "+" : ""}
          {tpPct}%
        </span>
        <span>
          <span className="font-medium text-blue-600">Entry</span> Rp{" "}
          {fmt(entry)}
        </span>
        <span>
          <span className="font-medium text-red-500">SL</span> {slPct}%
        </span>
      </div>

      <Button onClick={calculate} className="w-full" disabled={!vol}>
        <Calculator size={15} className="mr-2" />
        Hitung skenario
      </Button>

      {result && (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-50 border border-green-100 p-3">
              <p className="text-[11px] text-green-600 uppercase tracking-wide mb-1">
                Profit maks
              </p>
              <p className="text-xl font-semibold text-green-700">
                Rp {fmtK(result.maxProfit)}
              </p>
              <p className="text-[11px] text-green-500 mt-0.5">
                +{((result.maxProfit / equity) * 100).toFixed(1)}% dari modal
              </p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-100 p-3">
              <p className="text-[11px] text-red-500 uppercase tracking-wide mb-1">
                Loss maks
              </p>
              <p className="text-xl font-semibold text-red-600">
                Rp {fmtK(result.maxLoss)}
              </p>
              <p className="text-[11px] text-red-400 mt-0.5">
                -{((result.maxLoss / equity) * 100).toFixed(1)}% dari modal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="Risk/Reward"
              value={`1 : ${result.rr.toFixed(2)}`}
              sub="ideal ≥ 1:2"
            />
            <MetricCard
              label="Jumlah lot"
              value={`${result.lots} lot`}
              sub={`${result.shares.toLocaleString("id-ID")} lembar`}
            />
            <MetricCard
              label="Win probability"
              value={`${(result.probWin * 100).toFixed(1)}%`}
              sub="gamblers ruin est."
            />
            <MetricCard
              label="Est. hari ke target"
              value={`${result.daysEst} hari`}
              sub="berbasis ATR"
            />
          </div>

          <div
            className={`rounded-xl p-4 ${result.ev >= 0 ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Expected Value</p>
                <p
                  className={`text-2xl font-semibold ${result.ev >= 0 ? "text-green-700" : "text-red-600"}`}
                >
                  {result.ev >= 0 ? "+" : "−"} Rp {fmtK(Math.abs(result.ev))}
                </p>
              </div>
              <div className="text-right">
                {result.ev >= 0 ? (
                  <TrendingUp size={28} className="text-green-400" />
                ) : (
                  <TrendingDown size={28} className="text-red-400" />
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  {result.ev >= 0
                    ? "Layak dipertimbangkan"
                    : "Pertimbangkan ulang"}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Win {(result.probWin * 100).toFixed(0)}%</span>
                <span>Lose {(result.probLoss * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full bg-red-200 overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${(result.probWin * 100).toFixed(0)}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center">
            Win probability menggunakan gamblers ruin approximation. Bukan
            jaminan return. Selalu gunakan manajemen risiko.
          </p>
        </div>
      )}
    </div>
  );
}

export function VolatilityAnalysis({
  ticker,
  initialPrice,
  stopLoss,
  direction,
}) {
  return (
    <Tabs defaultValue="volatility" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="volatility" className="flex-1">
          Analisis Volatilitas
        </TabsTrigger>
        <TabsTrigger value="scenario" className="flex-1">
          Simulasi Skenario
        </TabsTrigger>
      </TabsList>
      <TabsContent value="volatility">
        <VolatilityTab ticker={ticker} initialPrice={initialPrice} />
      </TabsContent>
      <TabsContent value="scenario">
        <ScenarioTab
          ticker={ticker}
          initialPrice={initialPrice}
          stopLoss={stopLoss}
          direction={direction}
        />
      </TabsContent>
    </Tabs>
  );
}
