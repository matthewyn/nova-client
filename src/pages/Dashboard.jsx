import { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource-variable/outfit";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe2,
  Layers3,
  ShieldCheck,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "@/utils/apiClient";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import { useAuth } from "@/contexts/AuthContext";
import { StocksCarousel } from "@/components/ui/stocks-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import Indonesia from "@/assets/indonesia.png";
import USA from "@/assets/usa.png";
import { stocksSector } from "@/utils/stocks";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const urlFetchIndonesia = generateApiOrigin("/stocks/new/ID");
const urlFetchUSA = generateApiOrigin("/stocks/new/US");
const urlFetchRunning = generateApiOrigin("/stocks/running");
const urlFetchCompleted = generateApiOrigin("/stocks/completed");
const urlFetchStatistics = generateApiOrigin("/transaction/statistics");
const urlFetchMacro = generateApiOrigin("/macro/current");
const urlFetchDistribution = generateApiOrigin(
  "/transaction/sector-distribution",
);

const PAGE_SIZE = 5;
const allocationColors = [
  "#0f766e",
  "#0891b2",
  "#4f46e5",
  "#7c3aed",
  "#c2410c",
  "#475569",
];

function formatMetric(value, suffix = "", digits = 2) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return `${Number(value).toFixed(digits)}${suffix}`;
}

function formatPrice(value, country) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  const currency = country === "Indonesia" ? "IDR" : "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: country === "Indonesia" ? 0 : 2,
  }).format(value);
}

function getTargetPrice(stock) {
  if (stock.target_price != null) return stock.target_price;
  if (stock.take_profit != null) return stock.take_profit;
  if (
    stock.initial_price == null ||
    stock.predicted_pct_change == null ||
    !Number.isFinite(Number(stock.initial_price)) ||
    !Number.isFinite(Number(stock.predicted_pct_change))
  ) {
    return null;
  }
  return (
    Number(stock.initial_price) *
    (1 + Number(stock.predicted_pct_change) / 100)
  );
}

function formatDate(value, options = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
}

function toneClass(value, positiveIsGood = true) {
  if (value == null || Number(value) === 0) return "text-slate-700";
  const isGood = positiveIsGood ? Number(value) > 0 : Number(value) < 0;
  return isGood ? "text-emerald-700" : "text-rose-700";
}

function getMacroDescription(type, score) {
  const direction = score >= 15 ? "positive" : score <= -15 ? "negative" : "neutral";
  const descriptions = {
    growth: {
      positive: "Expansion signals remain supportive for cyclical activity.",
      neutral: "Growth is near trend with limited directional conviction.",
      negative: "Forward activity is weakening and warrants defensive review.",
    },
    inflation: {
      positive: "Price pressure remains elevated relative to target conditions.",
      neutral: "Price conditions are broadly stable and near policy targets.",
      negative: "Disinflation is developing across demand and input indicators.",
    },
    liquidity: {
      positive: "Funding and credit conditions are supportive of risk assets.",
      neutral: "Liquidity is balanced without a strong easing or tightening impulse.",
      negative: "Funding conditions are restrictive and capital is becoming selective.",
    },
    risk: {
      positive: "Flows show constructive participation in higher-beta assets.",
      neutral: "Positioning is balanced between risk-taking and defensiveness.",
      negative: "Capital is rotating toward liquidity and defensive exposures.",
    },
  };
  return descriptions[type]?.[direction] || "Awaiting sufficient macro evidence.";
}

function LoadingBlock({ className = "h-24" }) {
  return <Skeleton className={`rounded-2xl bg-slate-200 ${className}`} />;
}

function MacroContext({ macroRegime, isLoading }) {
  const dimensions = macroRegime
    ? [
        { key: "growth", label: "Growth", score: macroRegime.scores?.growth },
        { key: "inflation", label: "Inflation", score: macroRegime.scores?.inflation },
        { key: "liquidity", label: "Liquidity", score: macroRegime.scores?.liquidity },
        { key: "risk", label: "Risk appetite", score: macroRegime.scores?.risk },
      ]
    : [];

  return (
    <article className="relative overflow-hidden rounded-2xl bg-[#0b1618] p-5 text-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.8)] sm:p-6 lg:col-span-5">
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/65">Current market context</p>
            <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-2xl font-semibold tracking-[-0.035em]">Macro regime</h2>
          </div>
          <Globe2 className="size-6 text-cyan-200/70" />
        </div>

        {isLoading ? (
          <div className="mt-5 space-y-3">
            <LoadingBlock className="h-20 bg-white/10" />
            <LoadingBlock className="h-52 bg-white/10" />
          </div>
        ) : macroRegime ? (
          <>
            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
              <div className="bg-[#0d1b1e] p-4">
                <p className="text-xs text-white/45">Regime</p>
                <p className="mt-2 text-lg font-semibold text-white">{macroRegime.regime}</p>
              </div>
              <div className="bg-[#0d1b1e] p-4">
                <p className="text-xs text-white/45">Model confidence</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">{formatMetric(macroRegime.confidence, "/100", 0)}</p>
              </div>
            </div>

            <div className="mt-4 flex min-h-52 overflow-hidden rounded-xl border border-white/10 bg-white/10">
              {dimensions.map((item) => (
                <div
                  key={item.key}
                  className="group flex min-w-0 flex-1 flex-col justify-between overflow-hidden bg-[#0d1b1e] p-3 transition-[flex,background-color] duration-500 ease-out hover:flex-[2.6] hover:bg-[#12262a] focus:flex-[2.6] focus:bg-[#12262a] focus:outline-none sm:p-4"
                  tabIndex={0}
                >
                  <div>
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-white/45 group-hover:text-cyan-200 group-focus:text-cyan-200">{item.label}</p>
                    <p className="mt-3 font-['Outfit_Variable',sans-serif] text-xl font-semibold tracking-[-0.04em]">{formatMetric(item.score, "", 0)}</p>
                  </div>
                  <div className="mt-5">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-300 transition-[width] duration-700"
                        style={{ width: `${Math.min(Math.max((Number(item.score) + 100) / 2, 0), 100)}%` }}
                      />
                    </div>
                    <p className="mt-3 hidden min-w-40 text-xs leading-5 text-white/50 group-hover:block group-focus:block">{getMacroDescription(item.key, item.score)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-8 text-sm leading-6 text-white/50">Macro context is not available for the current account.</p>
        )}
      </div>
    </article>
  );
}

function OpportunitySet({ stocks, isLoading, user }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.35)] lg:col-span-7">
      <WatermarkOverlay userId={user?.user_id} email={user?.email} />
      <div className="relative flex flex-col gap-3 border-b border-slate-200 px-1 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Prioritized research queue</p>
          <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-2xl font-semibold tracking-[-0.035em] text-slate-950">Opportunity set</h2>
          <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">Newly surfaced candidates across supported markets, prepared for analyst review.</p>
        </div>
        <p className="text-sm font-medium text-slate-500">{stocks.length} candidates in view</p>
      </div>

      <div className="relative mt-1 min-h-64">
        {isLoading ? (
          <div className="grid grid-flow-dense grid-cols-1 gap-3 p-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => <LoadingBlock key={index} className="h-48" />)}
          </div>
        ) : stocks.length ? (
          <StocksCarousel title="Cross-market candidates" stocks={stocks} />
        ) : (
          <div className="flex min-h-72 items-center justify-center text-sm text-slate-500">No candidates currently pass the research pipeline.</div>
        )}
      </div>
    </article>
  );
}

function AllocationPanel({ sectors, countries, isLoading }) {
  const totalSectors = sectors.reduce((sum, item) => sum + item.count, 0);
  const totalCountries = countries.reduce((sum, item) => sum + item.count, 0);
  const countryMeta = {
    Indonesia: { name: "Indonesia", image: Indonesia },
    US: { name: "United States", image: USA },
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-4">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Active exposure</p>
          <h3 className="mt-2 font-['Outfit_Variable',sans-serif] text-xl font-semibold tracking-[-0.03em] text-slate-950">Allocation context</h3>
        </div>
        <Layers3 className="size-5 text-slate-400" />
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3"><LoadingBlock className="h-8" /><LoadingBlock className="h-44" /></div>
      ) : sectors.length ? (
        <>
          <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-slate-100">
            {sectors.map((item, index) => (
              <div
                key={item.sector}
                style={{
                  width: `${totalSectors ? (item.count / totalSectors) * 100 : 0}%`,
                  backgroundColor: allocationColors[index % allocationColors.length],
                }}
              />
            ))}
          </div>
          <div className="mt-4 space-y-2.5">
            {sectors.slice(0, 6).map((item, index) => (
              <div key={item.sector} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: allocationColors[index % allocationColors.length] }} />
                  <span className="truncate text-slate-600">{stocksSector[item.sector] || item.sector}</span>
                </div>
                <span className="font-semibold text-slate-900">{formatMetric(totalSectors ? (item.count / totalSectors) * 100 : 0, "%", 0)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Market split</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {countries.map((item) => {
                const meta = countryMeta[item.country] || { name: item.country };
                return (
                  <div key={item.country} className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      {meta.image ? <img src={meta.image} alt="" className="size-5 object-contain" /> : null}
                      <span className="truncate text-xs text-slate-500">{meta.name}</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-950">{formatMetric(totalCountries ? (item.count / totalCountries) * 100 : 0, "%", 0)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="mt-8 text-sm leading-6 text-slate-500">Exposure will appear when positions enter active monitoring.</p>
      )}
    </aside>
  );
}

function ActiveMonitoring({ stocks, isLoading, page, totalPages, setPage, user }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-8">
      <WatermarkOverlay userId={user?.user_id} email={user?.email} />
      <div className="relative flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Portfolio surveillance</p>
          <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-2xl font-semibold tracking-[-0.035em] text-slate-950">Active monitoring</h2>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">Candidates under observation, ordered by the platform’s research priority.</p>
        </div>
        <Link to="/dashboard/transactions" className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-cyan-700">Full ledger <ArrowUpRight className="ml-2 size-4" /></Link>
      </div>

      <div className="relative mt-2 divide-y divide-slate-200">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid gap-3 py-4 sm:grid-cols-5">
              {Array.from({ length: 5 }).map((__, cell) => <LoadingBlock key={cell} className="h-10" />)}
            </div>
          ))
        ) : stocks.length ? (
          stocks.map((stock, index) => (
            <Link
              key={stock.id || `${stock.name}-${index}`}
              to={`/dashboard/transactions/${stock.id}`}
              className="group grid items-center gap-3 py-4 transition-colors hover:bg-slate-50 sm:grid-cols-[1.25fr_1fr_1fr_1fr_auto] sm:px-2"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{(page - 1) * PAGE_SIZE + index + 1}</span>
                <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {stock.logo ? <img src={stock.logo} alt="" className="h-full w-full object-contain p-1.5 transition-transform duration-700 ease-out group-hover:scale-105" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{stock.name?.replace(".JK", "")}</p>
                  <p className="mt-1 text-xs text-slate-500">{stock.country}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400">Current / entry</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatPrice(stock.close, stock.country)}</p>
                <p className="mt-0.5 text-xs text-slate-400">{formatPrice(stock.initial_price, stock.country)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Target / stop</p>
                <p className="mt-1 text-sm font-semibold text-emerald-700">{formatPrice(getTargetPrice(stock), stock.country)}</p>
                <p className="mt-0.5 text-xs font-medium text-rose-700">{formatPrice(stock.stop_loss, stock.country)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Realized movement</p>
                <p className={`mt-1 text-sm font-semibold ${toneClass(stock.pct_gain)}`}>{formatMetric(stock.pct_gain, "%")}</p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Forecast</p>
                  <p className={`mt-1 text-sm font-semibold ${toneClass(stock.predicted_pct_change)}`}>{formatMetric(stock.predicted_pct_change, "%")}</p>
                </div>
                <ChevronRight className="size-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" />
              </div>
            </Link>
          ))
        ) : (
          <p className="py-14 text-center text-sm text-slate-500">No positions currently require active monitoring.</p>
        )}
      </div>

      <div className="relative mt-3 flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-xs text-slate-500">Page {page} of {Math.max(totalPages, 1)}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page <= 1} className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white disabled:pointer-events-none disabled:opacity-35" aria-label="Previous page"><ChevronLeft className="size-4" /></button>
          <button type="button" onClick={() => setPage((current) => Math.min(current + 1, totalPages))} disabled={page >= totalPages} className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:bg-slate-950 hover:text-white disabled:pointer-events-none disabled:opacity-35" aria-label="Next page"><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </article>
  );
}

function MetricCard({ label, value, context, icon: Icon, tone = "neutral" }) {
  const tones = {
    positive: "bg-[#dff8f1] text-emerald-950",
    negative: "bg-[#fff0ed] text-rose-950",
    dark: "bg-[#0b1618] text-white",
    neutral: "bg-white text-slate-950",
  };
  return (
    <div className={`group min-h-40 p-5 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-5">
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${tone === "dark" ? "text-white/45" : "text-slate-500"}`}>{label}</p>
        <Icon className={`size-5 ${tone === "dark" ? "text-cyan-200" : "text-slate-400"}`} />
      </div>
      <p className="mt-5 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{value}</p>
      <p className={`mt-3 text-xs leading-5 ${tone === "dark" ? "text-white/45" : "text-slate-500"}`}>{context}</p>
    </div>
  );
}

function PerformanceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0b1618]/95 p-4 text-xs text-white shadow-2xl backdrop-blur-xl">
      <p className="text-white/45">{formatDate(label)}</p>
      <p className="mt-2 font-semibold">Equity {formatMetric(payload[0]?.value, "", 2)}</p>
    </div>
  );
}

function PerformanceAnalytics({ statistics, completedStocks, isLoading }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          gsap.fromTo(card, { autoAlpha: 0.4, y: 90, scale: 0.95 }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 90%", end: "top 50%", scrub: 0.8 },
          });
          if (index < cardsRef.current.length - 1) {
            gsap.to(card, {
              scale: 0.98,
              autoAlpha: 0.32,
              ease: "none",
              scrollTrigger: { trigger: cardsRef.current[index + 1], start: "top 78%", end: "top 42%", scrub: 0.8 },
            });
          }
        });
      });
      return () => media.revert();
    },
    { scope: sectionRef },
  );

  const equityCurve = statistics?.equity_curve || [];
  const monthlyPerformance = statistics?.monthly_performance || [];
  const directionPerformance = statistics?.direction_performance || [];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#071011] px-5 py-10 text-white sm:px-8 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(45,212,191,0.13),transparent_28%),radial-gradient(circle_at_92%_82%,rgba(99,102,241,0.1),transparent_30%)]" />
      <div className="relative mx-auto max-w-[96rem]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="max-w-xl text-sm leading-6 text-cyan-100/60">Closed-position evidence is separated into outcomes, return quality, downside behavior, consistency, and period attribution.</p>
            <h2 className="mt-3 max-w-5xl font-['Outfit_Variable',sans-serif] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">Performance, with the risk context intact.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/45 lg:text-right">Historical model outcomes are research evidence, not a guarantee of future performance.</p>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <LoadingBlock key={index} className="h-48 bg-white/10" />)}
          </div>
        ) : statistics ? (
          <div className="mt-8 space-y-5 lg:space-y-7">
            <article
              ref={(node) => { cardsRef.current[0] = node; }}
              className="dashboard-stack-card sticky top-20 overflow-hidden rounded-2xl border border-white/10 bg-[#0d181b]/95 p-2 shadow-[0_32px_90px_-45px_rgba(0,0,0,0.9)] backdrop-blur-xl will-change-transform"
            >
              <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-[1.35rem] bg-slate-200 sm:grid-cols-2 lg:grid-cols-12">
                <div className="lg:col-span-3"><MetricCard label="Win rate" value={formatMetric(statistics.winrate, "%", 1)} context={`${statistics.winning_trades} wins · ${statistics.losing_trades} losses · ${statistics.breakeven_trades} flat`} icon={Target} tone="positive" /></div>
                <div className="lg:col-span-3"><MetricCard label="Compounded return" value={formatMetric(statistics.compounded_return, "%", 1)} context={`Simple aggregate return: ${formatMetric(statistics.total_return, "%")}`} icon={TrendingUp} tone="dark" /></div>
                <div className="lg:col-span-3"><MetricCard label="Maximum drawdown" value={formatMetric(statistics.max_drawdown, "%", 1)} context={`Recovery factor: ${formatMetric(statistics.recovery_factor, "", 2)}`} icon={ShieldCheck} tone="negative" /></div>
                <div className="lg:col-span-3"><MetricCard label="Profit factor" value={formatMetric(statistics.profit_factor, "", 2)} context={`Gross profit / gross loss across ${statistics.total_trades} outcomes`} icon={Activity} /></div>
              </div>
            </article>

            <article
              ref={(node) => { cardsRef.current[1] = node; }}
              className="dashboard-stack-card sticky top-24 overflow-hidden rounded-2xl border border-white/10 bg-[#0d181b]/95 p-2 shadow-[0_32px_90px_-45px_rgba(0,0,0,0.9)] backdrop-blur-xl will-change-transform"
            >
              <div className="grid min-h-[29rem] gap-px overflow-hidden rounded-[1.1rem] bg-white/10 lg:grid-cols-12">
                <div className="bg-[#101d20] p-5 sm:p-6 lg:col-span-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/60">Compounded outcome path</p>
                      <h3 className="mt-3 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em]">Equity and drawdown</h3>
                    </div>
                    <p className="text-xs text-white/40">Base equity: 100</p>
                  </div>
                  <div className="mt-6 h-[20rem] w-full">
                    {equityCurve.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={equityCurve} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                          <defs><linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#67e8f9" stopOpacity={0.42} /><stop offset="100%" stopColor="#67e8f9" stopOpacity={0} /></linearGradient></defs>
                          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={48} />
                          <YAxis tick={{ fill: "rgba(255,255,255,0.38)", fontSize: 11 }} tickLine={false} axisLine={false} />
                          <Tooltip content={<PerformanceTooltip />} />
                          <Area type="monotone" dataKey="equity" stroke="#67e8f9" strokeWidth={2} fill="url(#equityFill)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/40">Equity history is not available.</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col bg-[#0b1618] p-5 sm:p-6 lg:col-span-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Return quality</p>
                  <div className="mt-4 divide-y divide-white/10">
                    {[
                      ["Average return", formatMetric(statistics.avg_return_per_trade, "%")],
                      ["Median return", formatMetric(statistics.median_return_per_trade, "%")],
                      ["Expectancy", formatMetric(statistics.expectancy, "%")],
                      ["Return volatility", formatMetric(statistics.return_volatility, "%")],
                      ["Average win", formatMetric(statistics.average_win, "%")],
                      ["Average loss", formatMetric(statistics.average_loss, "%")],
                      ["Payoff ratio", formatMetric(statistics.payoff_ratio, "", 2)],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-5 py-3"><span className="text-sm text-white/45">{label}</span><span className="text-sm font-semibold text-white">{value}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article
              ref={(node) => { cardsRef.current[2] = node; }}
              className="dashboard-stack-card sticky top-28 overflow-hidden rounded-2xl border border-white/10 bg-[#f4f7f6] p-2 text-slate-950 shadow-[0_32px_90px_-45px_rgba(0,0,0,0.9)] will-change-transform"
            >
              <div className="grid gap-px overflow-hidden rounded-[1.25rem] bg-slate-200 lg:grid-cols-12">
                <div className="bg-white p-5 sm:p-6 lg:col-span-7">
                  <div className="flex items-start justify-between gap-6">
                    <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Period attribution</p><h3 className="mt-3 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em]">Monthly consistency</h3></div>
                    <BarChart3 className="size-5 text-slate-400" />
                  </div>
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[36rem] text-left text-sm">
                      <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.1em] text-slate-400">
                        <tr><th className="pb-4 font-semibold">Period</th><th className="pb-4 text-right font-semibold">Trades</th><th className="pb-4 text-right font-semibold">Win rate</th><th className="pb-4 text-right font-semibold">Avg return</th><th className="pb-4 text-right font-semibold">Total return</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {monthlyPerformance.map((period) => (
                          <tr key={period.period}>
                            <td className="py-4 font-semibold text-slate-900">{period.period}</td>
                            <td className="py-4 text-right text-slate-500">{period.total_trades}</td>
                            <td className="py-4 text-right font-medium text-slate-700">{formatMetric(period.winrate, "%", 1)}</td>
                            <td className={`py-4 text-right font-semibold ${toneClass(period.avg_return_per_trade)}`}>{formatMetric(period.avg_return_per_trade, "%")}</td>
                            <td className={`py-4 text-right font-semibold ${toneClass(period.total_return)}`}>{formatMetric(period.total_return, "%")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#e6f8f4] p-5 sm:p-6 lg:col-span-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800/60">Consistency and extremes</p>
                  <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-emerald-950/10">
                    <div className="bg-[#e6f8f4] p-5"><Clock3 className="size-5 text-emerald-800/60" /><p className="mt-5 text-2xl font-semibold">{formatMetric(statistics.average_holding_days, "d", 1)}</p><p className="mt-1 text-xs text-emerald-950/55">Average holding period</p></div>
                    <div className="bg-[#e6f8f4] p-5"><Activity className="size-5 text-emerald-800/60" /><p className="mt-5 text-2xl font-semibold">{statistics.max_consecutive_wins}</p><p className="mt-1 text-xs text-emerald-950/55">Longest winning sequence</p></div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-white/70 p-5"><div className="flex items-center justify-between gap-4"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Best outcome</span><TrendingUp className="size-4 text-emerald-700" /></div><p className="mt-3 text-lg font-semibold text-emerald-800">{statistics.best_trade || "—"}</p><p className="mt-1 text-xs text-slate-500">{formatDate(statistics.best_trade_details?.end_date)}</p></div>
                    <div className="rounded-2xl bg-white/70 p-5"><div className="flex items-center justify-between gap-4"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Worst outcome</span><TrendingDown className="size-4 text-rose-700" /></div><p className="mt-3 text-lg font-semibold text-rose-800">{statistics.worst_trade || "—"}</p><p className="mt-1 text-xs text-slate-500">{formatDate(statistics.worst_trade_details?.end_date)}</p></div>
                  </div>
                  {directionPerformance.length ? (
                    <div className="mt-7 border-t border-emerald-950/10 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-950/45">Direction attribution</p>
                      <div className="mt-4 space-y-3">
                        {directionPerformance.map((direction) => (
                          <div key={direction.direction} className="flex items-center justify-between text-sm"><span className="capitalize text-emerald-950/60">{direction.direction}</span><span className="font-semibold text-emerald-950">{direction.total_trades} trades · {formatMetric(direction.winrate, "%", 1)}</span></div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">Performance analytics are unavailable.</p>
        )}

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-12">
          <div className="bg-[#d8faf4] p-6 text-[#071011] lg:col-span-7">
            <p className="font-['Outfit_Variable',sans-serif] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">Audit the evidence behind every completed outcome.</p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-950/60">Review entries, exits, forecasts, and realized results in the full transaction ledger.</p>
          </div>
          <div className="flex flex-col justify-center gap-3 bg-[#0d181b] p-6 sm:flex-row sm:items-center lg:col-span-5">
            <Link to="/dashboard/transactions" className="inline-flex min-h-13 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">Review transaction ledger <ArrowRight className="ml-3 size-4" /></Link>
            <Link to="/dashboard/macro" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Open macro workspace</Link>
          </div>
        </div>

        {completedStocks.length ? (
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">Latest closed outcomes</p>
            <div className="mt-5 grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
              {completedStocks.slice(0, 5).map((stock) => (
                <Link key={stock.id} to={`/dashboard/transactions/${stock.id}`} className="group bg-[#0d181b] p-5 transition-colors hover:bg-[#132428]">
                  <div className="flex items-center justify-between gap-4"><span className="font-semibold">{stock.name?.replace(".JK", "")}</span><ArrowUpRight className="size-4 text-white/30 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-200" /></div>
                  <p className={`mt-4 text-lg font-semibold ${Number(stock.pct_gain) >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatMetric(stock.pct_gain, "%")}</p>
                  <p className="mt-1 text-xs text-white/35">{formatDate(stock.end_date)}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Dashboard() {
  const [stocksIndonesia, setStocksIndonesia] = useState([]);
  const [stocksUSA, setStocksUSA] = useState([]);
  const [runningStocks, setRunningStocks] = useState([]);
  const [completedStocks, setCompletedStocks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [macroRegime, setMacroRegime] = useState(null);
  const [sectorDistributions, setSectorDistributions] = useState([]);
  const [countryDistributions, setCountryDistributions] = useState([]);
  const [isOverviewLoading, setIsOverviewLoading] = useState(true);
  const [isPositionsLoading, setIsPositionsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOverview() {
      setIsOverviewLoading(true);
      try {
        const [indonesiaResponse, usaResponse, completedResponse, statisticsResponse, macroResponse, distributionsResponse] = await Promise.all([
          axios.get(urlFetchIndonesia, { headers: getAuthHeader() }),
          axios.get(urlFetchUSA, { headers: getAuthHeader() }),
          axios.get(urlFetchCompleted, { headers: getAuthHeader(), params: { page: 1, page_size: PAGE_SIZE } }),
          axios.get(urlFetchStatistics, { headers: getAuthHeader() }),
          axios.get(urlFetchMacro, { headers: getAuthHeader() }),
          axios.get(urlFetchDistribution, { headers: getAuthHeader() }),
        ]);

        setStocksIndonesia(indonesiaResponse.data?.stocks || []);
        setStocksUSA(usaResponse.data?.stocks || []);
        setCompletedStocks(completedResponse.data?.stocks || []);
        setStatistics(statisticsResponse.data || null);
        setMacroRegime(macroResponse.data || null);
        setSectorDistributions(distributionsResponse.data?.sectors || []);
        setCountryDistributions(distributionsResponse.data?.countries || []);
      } catch (error) {
        if (axios.isAxiosError(error)) console.error("Dashboard request failed with status:", error.response?.status);
      } finally {
        setIsOverviewLoading(false);
      }
    }
    fetchOverview();
  }, []);

  useEffect(() => {
    async function fetchPositions() {
      setIsPositionsLoading(true);
      try {
        const { data } = await axios.get(urlFetchRunning, { headers: getAuthHeader(), params: { page, page_size: PAGE_SIZE } });
        setRunningStocks(data?.stocks || []);
        setTotalPages(Math.max(Math.ceil((data?.total || 0) / PAGE_SIZE), 1));
      } catch (error) {
        if (axios.isAxiosError(error)) console.error("Running stocks request failed with status:", error.response?.status);
      } finally {
        setIsPositionsLoading(false);
      }
    }
    fetchPositions();
  }, [page]);

  const opportunityStocks = useMemo(() => [...stocksIndonesia, ...stocksUSA], [stocksIndonesia, stocksUSA]);

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-[#f2f5f4] font-['Outfit_Variable',sans-serif] text-slate-950">
      <section id="opportunity-set" className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[96rem]">
          <div className="grid grid-flow-dense grid-cols-1 gap-4 lg:grid-cols-12">
            <OpportunitySet stocks={opportunityStocks} isLoading={isOverviewLoading} user={user} />
            <MacroContext macroRegime={macroRegime} isLoading={isOverviewLoading} />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#e9efed] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-6 max-w-3xl">
            <p className="text-sm leading-6 text-slate-500">Monitor the candidates already in motion and understand concentration before opening security-level detail.</p>
            <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">One active book. Clear research priority.</h2>
          </div>
          <div className="grid grid-flow-dense grid-cols-1 gap-4 lg:grid-cols-12">
            <ActiveMonitoring stocks={runningStocks} isLoading={isPositionsLoading} page={page} totalPages={totalPages} setPage={setPage} user={user} />
            <AllocationPanel sectors={sectorDistributions} countries={countryDistributions} isLoading={isOverviewLoading} />
          </div>
        </div>
      </section>

      <PerformanceAnalytics statistics={statistics} completedStocks={completedStocks} isLoading={isOverviewLoading} />

      <div className="border-t border-slate-200 bg-white px-5 py-5 sm:px-8 lg:px-10">
        <p className="mx-auto max-w-[96rem] text-xs leading-5 text-slate-400">Nova AI provides research and decision-intelligence support. It does not replace institutional due diligence, mandate constraints, or professional judgment. Historical outcomes do not guarantee future results.</p>
      </div>
    </main>
  );
}

export default Dashboard;
