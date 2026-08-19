import { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource-variable/outfit";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Gauge,
  Globe2,
  Layers3,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import axios from "@/utils/apiClient";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import CapitalFlowArt from "@/assets/what-you-get/capital-flow.webp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ALLOCATION_CONFIG = {
  CASH: "Cash",
  USD: "USD",
  GOLD: "Gold",
  COMMODITIES: "Commodities",
  US_TREASURY: "US Treasury",
  ID_BOND: "Indonesia Bond",
  US_EQUITY: "US Equity",
  ID_EQUITY: "Indonesia Equity",
  REIT: "REIT",
};

const SECTOR_CONFIG = {
  GOLD: "Gold",
  COAL: "Coal",
  NICKEL: "Nickel",
  CPO: "CPO",
  ENERGY_SHIPPING: "Energy Shipping",
  CONSUMER_STAPLES: "Consumer Staples",
  BANKING: "Banking",
  HEALTHCARE: "Healthcare",
  TELECOM: "Telecommunication",
  INFRASTRUCTURE: "Infrastructure",
  PROPERTY: "Property",
  CONSUMER_DISCRETIONARY: "Consumer Discretionary",
  TECHNOLOGY: "Technology",
  ENERGY: "Energy",
  COPPER: "Copper",
  COMMUNICATION_SERVICES: "Communication Services",
  FINANCIALS: "Financials",
  INDUSTRIALS: "Industrials",
  TRANSPORTATION: "Transportation",
  MATERIALS: "Materials",
  UTILITIES: "Utilities",
};

const urlFetchCapitalFlow = generateApiOrigin("/capital-flow/current");
const urlFetchSectorIndonesia = generateApiOrigin(
  "/sector-intelligence/current?country=Indonesia",
);
const urlFetchSectorUS = generateApiOrigin(
  "/sector-intelligence/current?country=US",
);
const urlFetchThemeUS = generateApiOrigin("/theme/current?country=US");
const urlFetchThemeIndonesia = generateApiOrigin(
  "/theme/current?country=Indonesia",
);

function formatThemeLabel(theme = "") {
  return theme
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatScore(value, digits = 1) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return Number(value).toFixed(digits);
}

function formatDate(value) {
  if (!value) return "Latest available snapshot";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest available snapshot";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function clampScore(value) {
  return Math.min(Math.max(Number(value) || 0, 0), 100);
}

function LoadingPanel({ className = "h-72" }) {
  return <Skeleton className={`rounded-2xl bg-slate-200 ${className}`} />;
}

function MacroHeader({ date, summary }) {
  const headerRef = useRef(null);
  const summaryRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".macro-header-item",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
          },
        );

        const words = gsap.utils.toArray(".macro-reveal-word");
        gsap.fromTo(
          words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.025,
            ease: "none",
            scrollTrigger: {
              trigger: summaryRef.current,
              start: "top 90%",
              end: "bottom 55%",
              scrub: 0.6,
            },
          },
        );
      });
      return () => media.revert();
    },
    { scope: headerRef },
  );

  const brief =
    summary ||
    "Connect capital preference, durable themes, and sector leadership before narrowing the opportunity set.";

  return (
    <header
      ref={headerRef}
      className="relative overflow-hidden border-b border-white/10 bg-[#071011] px-5 py-7 text-white sm:px-8 lg:px-10 lg:py-9"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(45,212,191,0.16),transparent_28%),radial-gradient(circle_at_8%_90%,rgba(99,102,241,0.1),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-[96rem] grid-flow-dense items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="macro-header-item flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/55">
            <Globe2 className="size-4" />
            Macro research workspace
          </div>
          <h1 className="macro-header-item mt-4 max-w-5xl font-['Outfit_Variable',sans-serif] text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
            Macro and
            <span
              aria-hidden="true"
              className="mx-3 inline-block h-[0.55em] w-[1.3em] rounded-full bg-cover bg-center align-[0.04em] ring-1 ring-white/20"
              style={{ backgroundImage: `url(${CapitalFlowArt})` }}
            />
            capital-flow intelligence.
          </h1>
        </div>

        <div className="macro-header-item border-l border-white/10 pl-5 lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
            Snapshot date
          </p>
          <p className="mt-2 text-sm font-medium text-white/80">
            {formatDate(date)}
          </p>
          <p ref={summaryRef} className="mt-4 text-sm leading-6 text-white/55">
            {brief.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="macro-reveal-word inline-block pr-[0.25em]"
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </header>
  );
}

function ScoreBar({ label, score, tone = "cyan", rank }) {
  const colors = {
    cyan: "bg-cyan-600",
    positive: "bg-emerald-600",
    negative: "bg-rose-500",
    violet: "bg-violet-600",
  };

  return (
    <div className="group grid items-center gap-3 sm:grid-cols-[1.25rem_minmax(7rem,10rem)_1fr_2.5rem]">
      <span className="hidden text-[0.65rem] font-semibold text-slate-300 sm:block">
        {String(rank).padStart(2, "0")}
      </span>
      <span className="truncate text-xs font-medium text-slate-600">{label}</span>
      <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-out ${colors[tone]}`}
          style={{ width: `${clampScore(score)}%` }}
        />
      </div>
      <span className="text-right text-xs font-semibold tabular-nums text-slate-900">
        {formatScore(score)}
      </span>
    </div>
  );
}

function CapitalPreference({ entries, topAsset, isLoading }) {
  return (
    <section className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto grid max-w-[96rem] grid-flow-dense gap-4 lg:grid-cols-12">
        <article className="relative overflow-hidden rounded-2xl bg-[#0b1618] p-5 text-white lg:col-span-4 lg:p-6">
          <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/60">
                    Cross-asset preference
                  </p>
                  <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-2xl font-semibold tracking-[-0.035em]">
                    Capital flow
                  </h2>
                </div>
                <CircleDollarSign className="size-5 text-cyan-200/65" />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/50">
                Relative allocation signals across liquidity, defensive assets,
                duration, and equity risk.
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="text-xs text-white/35">Strongest current preference</p>
              <p className="mt-2 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em] text-cyan-100">
                {topAsset || "Awaiting data"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] lg:col-span-8 lg:p-6">
          <div className="flex items-end justify-between gap-5 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Relative signal strength
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">
                Asset-class ranking
              </h3>
            </div>
            <Gauge className="size-5 text-slate-400" />
          </div>

          {isLoading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-7 rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : entries.length ? (
            <div className="mt-5 grid grid-flow-dense grid-cols-1 gap-x-8 gap-y-3 xl:grid-cols-2">
              {entries.map(([key, score], index) => (
                <ScoreBar
                  key={key}
                  label={ALLOCATION_CONFIG[key] || formatThemeLabel(key)}
                  score={score}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-slate-500">
              No capital-flow snapshot is available.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

function ThemeMarket({ market, themes, summary, tone }) {
  const toneStyles = {
    indonesia: {
      accent: "text-cyan-700",
      bar: "cyan",
      surface: "bg-[#e8f8f5]",
    },
    us: {
      accent: "text-violet-700",
      bar: "violet",
      surface: "bg-[#f0effb]",
    },
  }[tone];

  return (
    <article
      className={`group flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-5 transition-[flex] duration-500 ease-out hover:flex-[1.4] focus-within:flex-[1.4] lg:p-6 ${toneStyles.surface}`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${toneStyles.accent}`}>
            {market} market
          </p>
          <h3 className="mt-2 font-['Outfit_Variable',sans-serif] text-2xl font-semibold tracking-[-0.035em] text-slate-950">
            Theme leadership
          </h3>
        </div>
        <Layers3 className="size-5 text-slate-500" />
      </div>

      <div className="mt-6 space-y-3">
        {themes.slice(0, 6).map((theme, index) => (
          <ScoreBar
            key={theme.theme}
            label={formatThemeLabel(theme.theme)}
            score={theme.score}
            tone={toneStyles.bar}
            rank={index + 1}
          />
        ))}
        {!themes.length ? (
          <p className="py-8 text-sm text-slate-500">No theme signals available.</p>
        ) : null}
      </div>

      {summary ? (
        <p className="mt-6 border-t border-slate-900/10 pt-4 text-xs leading-5 text-slate-600">
          {summary}
        </p>
      ) : null}
    </article>
  );
}

function ThemeIntelligence({ indonesia, us, isLoading }) {
  return (
    <section className="border-y border-slate-200 bg-[#e9efed] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[96rem]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Persistent investment narratives
            </p>
            <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Theme intelligence
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-5 text-slate-500 sm:text-right">
            Compare evidence-backed themes across both supported markets without
            separating the research workflow.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-flow-dense grid-cols-1 gap-4 lg:grid-cols-2">
            <LoadingPanel />
            <LoadingPanel />
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row">
            <ThemeMarket
              market="Indonesia"
              themes={indonesia.themes}
              summary={indonesia.summary}
              tone="indonesia"
            />
            <ThemeMarket
              market="United States"
              themes={us.themes}
              summary={us.summary}
              tone="us"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function SectorList({ title, sectors, tone }) {
  const positive = tone === "positive";
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {positive ? (
          <TrendingUp className="size-4 text-emerald-700" />
        ) : (
          <TrendingDown className="size-4 text-rose-700" />
        )}
        <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </h4>
      </div>
      <div className="space-y-3">
        {sectors.map((item, index) => (
          <ScoreBar
            key={item.sector}
            label={SECTOR_CONFIG[item.sector] || formatThemeLabel(item.sector)}
            score={item.score}
            tone={tone}
            rank={index + 1}
          />
        ))}
        {!sectors.length ? (
          <p className="py-5 text-xs text-slate-400">No sectors meet this threshold.</p>
        ) : null}
      </div>
    </div>
  );
}

function SectorMarketCard({ data, market }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_-50px_rgba(15,23,42,0.4)] lg:p-6">
      <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
            {market}
          </p>
          <h3 className="mt-2 font-['Outfit_Variable',sans-serif] text-2xl font-semibold tracking-[-0.035em] text-slate-950">
            Sector conditions
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Regime</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {data?.regime || "Unknown"}
          </p>
        </div>
      </div>

      {data ? (
        <>
          <div className="mt-5 grid grid-flow-dense gap-7 xl:grid-cols-2">
            <SectorList title="Research priority" sectors={data.top_sectors || []} tone="positive" />
            <SectorList title="Risk-filtered" sectors={data.avoid_sectors || []} tone="negative" />
          </div>
          {data.summary ? (
            <p className="mt-6 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
              {data.summary}
            </p>
          ) : null}
        </>
      ) : (
        <p className="py-12 text-center text-sm text-slate-500">
          No sector-intelligence snapshot is available.
        </p>
      )}
    </article>
  );
}

function SectorIntelligence({ indonesia, us, isLoading }) {
  const sectionRef = useRef(null);
  const introRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          ScrollTrigger.create({
            trigger: introRef.current,
            endTrigger: sectionRef.current,
            start: "top top+=88",
            end: "bottom bottom",
            pin: introRef.current,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        },
      );
      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[96rem] grid-flow-dense gap-6 lg:grid-cols-12">
        <div ref={introRef} className="self-start lg:col-span-4">
          <div className="rounded-2xl bg-[#0b1618] p-5 text-white lg:p-6">
            <BarChart3 className="size-5 text-cyan-200/65" />
            <h2 className="mt-5 font-['Outfit_Variable',sans-serif] text-3xl font-semibold leading-[0.95] tracking-[-0.045em]">
              Sector rotation across two market structures.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/50">
              Priority sectors pass the current macro, liquidity, and theme
              conditions. Risk-filtered sectors warrant reduced research priority.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10">
              <div className="bg-[#0d1b1e] p-4">
                <p className="text-xs text-white/35">Indonesia priority</p>
                <p className="mt-2 text-xl font-semibold text-cyan-100">
                  {indonesia?.top_sectors?.length || 0}
                </p>
              </div>
              <div className="bg-[#0d1b1e] p-4">
                <p className="text-xs text-white/35">US priority</p>
                <p className="mt-2 text-xl font-semibold text-cyan-100">
                  {us?.top_sectors?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-8">
          {isLoading ? (
            <>
              <LoadingPanel className="h-96" />
              <LoadingPanel className="h-96" />
            </>
          ) : (
            <>
              <SectorMarketCard data={indonesia} market="Indonesia" />
              <SectorMarketCard data={us} market="United States" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AnalystBriefing({ briefings }) {
  const [activeBriefing, setActiveBriefing] = useState(0);
  const briefing = briefings[activeBriefing];

  const selectBriefing = (direction) => {
    setActiveBriefing(
      (current) => (current + direction + briefings.length) % briefings.length,
    );
  };

  return (
    <section className="border-t border-white/10 bg-[#071011] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[96rem] grid-flow-dense overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-12">
        <div className="bg-[#d8faf4] p-6 text-[#071011] lg:col-span-4">
          <ShieldAlert className="size-5 text-emerald-800/65" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/55">
            Analyst briefing
          </p>
          <h2 className="mt-2 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em]">
            Preserve the narrative behind the score.
          </h2>
        </div>

        <div className="flex min-h-64 flex-col justify-between bg-[#0d181b] p-6 lg:col-span-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/60">
              {briefing.label}
            </p>
            <p className="mt-5 max-w-3xl font-['Outfit_Variable',sans-serif] text-2xl font-medium leading-snug tracking-[-0.025em] text-white/90">
              {briefing.summary}
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
            <p className="text-xs text-white/35">
              {activeBriefing + 1} of {briefings.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectBriefing(-1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous briefing"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => selectBriefing(1)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next briefing"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-[96rem] flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/dashboard"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
        >
          Return to opportunity dashboard
          <ArrowRight className="ml-2 size-4" />
        </Link>
        <Link
          to="/dashboard/transactions"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Review transaction evidence
          <ArrowUpRight className="ml-2 size-4" />
        </Link>
      </div>
    </section>
  );
}

function Macro() {
  const [capitalFlow, setCapitalFlow] = useState(null);
  const [sectorScoresIndonesia, setSectorScoresIndonesia] = useState(null);
  const [sectorScoresUS, setSectorScoresUS] = useState(null);
  const [themeScoresIndonesia, setThemeScoresIndonesia] = useState(null);
  const [themeScoresUS, setThemeScoresUS] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMacroIntelligence() {
      setIsLoading(true);
      try {
        const responses = await Promise.allSettled([
          axios.get(urlFetchCapitalFlow, { headers: getAuthHeader() }),
          axios.get(urlFetchSectorIndonesia, { headers: getAuthHeader() }),
          axios.get(urlFetchSectorUS, { headers: getAuthHeader() }),
          axios.get(urlFetchThemeIndonesia, { headers: getAuthHeader() }),
          axios.get(urlFetchThemeUS, { headers: getAuthHeader() }),
        ]);

        const [capital, sectorIndonesia, sectorUS, themeIndonesia, themeUS] =
          responses;

        if (capital.status === "fulfilled") setCapitalFlow(capital.value.data);
        if (sectorIndonesia.status === "fulfilled") {
          setSectorScoresIndonesia(sectorIndonesia.value.data);
        }
        if (sectorUS.status === "fulfilled") setSectorScoresUS(sectorUS.value.data);
        if (themeIndonesia.status === "fulfilled") {
          setThemeScoresIndonesia(themeIndonesia.value.data);
        }
        if (themeUS.status === "fulfilled") setThemeScoresUS(themeUS.value.data);

        const rejected = responses.find((response) => response.status === "rejected");
        if (rejected && axios.isAxiosError(rejected.reason)) {
          console.error(
            "Macro intelligence request failed with status:",
            rejected.reason.response?.status,
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMacroIntelligence();
  }, []);

  const capitalEntries = useMemo(
    () =>
      capitalFlow?.scores
        ? Object.entries(capitalFlow.scores).sort(([, a], [, b]) => b - a)
        : [],
    [capitalFlow],
  );

  const indonesiaThemes = useMemo(
    () =>
      Array.isArray(themeScoresIndonesia?.themes)
        ? [...themeScoresIndonesia.themes].sort((a, b) => b.score - a.score)
        : [],
    [themeScoresIndonesia],
  );

  const usThemes = useMemo(
    () =>
      Array.isArray(themeScoresUS?.themes)
        ? [...themeScoresUS.themes].sort((a, b) => b.score - a.score)
        : [],
    [themeScoresUS],
  );

  const topAsset = capitalEntries.length
    ? ALLOCATION_CONFIG[capitalEntries[0][0]] ||
      formatThemeLabel(capitalEntries[0][0])
    : null;

  const briefings = [
    {
      label: "Capital-flow interpretation",
      summary:
        capitalFlow?.summary ||
        "Capital-flow narrative is unavailable for the current snapshot.",
    },
    {
      label: "Indonesia theme interpretation",
      summary:
        themeScoresIndonesia?.summary ||
        "Indonesia theme narrative is unavailable for the current snapshot.",
    },
    {
      label: "United States theme interpretation",
      summary:
        themeScoresUS?.summary ||
        "United States theme narrative is unavailable for the current snapshot.",
    },
    {
      label: "Indonesia sector interpretation",
      summary:
        sectorScoresIndonesia?.summary ||
        "Indonesia sector narrative is unavailable for the current snapshot.",
    },
    {
      label: "United States sector interpretation",
      summary:
        sectorScoresUS?.summary ||
        "United States sector narrative is unavailable for the current snapshot.",
    },
  ];

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-[#f2f5f4] font-['Outfit_Variable',sans-serif] text-slate-950">
      <MacroHeader date={capitalFlow?.date} summary={capitalFlow?.summary} />
      <CapitalPreference
        entries={capitalEntries}
        topAsset={topAsset}
        isLoading={isLoading}
      />
      <ThemeIntelligence
        indonesia={{
          themes: indonesiaThemes,
          summary: themeScoresIndonesia?.summary,
        }}
        us={{ themes: usThemes, summary: themeScoresUS?.summary }}
        isLoading={isLoading}
      />
      <SectorIntelligence
        indonesia={sectorScoresIndonesia}
        us={sectorScoresUS}
        isLoading={isLoading}
      />
      <AnalystBriefing briefings={briefings} />
    </main>
  );
}

export default Macro;
