import { useEffect, useRef, useState } from "react";
import "@fontsource-variable/geist";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Gauge,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import axios from "@/utils/apiClient";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import StockPriceChart from "@/components/StockPriceChart";
import { PremiumContentGate } from "@/components/PremiumContentGate";
import ScenarioAnalysis from "@/components/ScenarioAnalysis";
import RiskBreakdown from "@/components/RiskBreakdown";
import RecommendedSizing from "@/components/RecommendedSizing";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import DotGrid from "@/components/DotGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function getRecommendedRiskPercentage(riskLevel) {
  if (riskLevel === "low") return 1.5;
  if (riskLevel === "medium") return 1;
  return 0.75;
}

function formatPrice(value, country) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: country === "Indonesia" ? "IDR" : "USD",
    maximumFractionDigits: country === "Indonesia" ? 0 : 2,
  }).format(Number(value));
}

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function AnalysisSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="relative overflow-hidden bg-white p-5">
          <DotGrid />
          <div className="relative z-10">
            <Skeleton className="mb-4 h-5 w-28" />
            <Skeleton className="mb-3 h-2 w-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TransactionDetail() {
  const [transaction, setTransaction] = useState(null);
  const [equities, setEquities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [startEquity, setStartEquity] = useState(0);
  const [riskPercentage, setRiskPercentage] = useState(1);
  const { user } = useAuth();
  const { id } = useParams();
  const pageRef = useRef(null);

  useEffect(() => {
    let isCurrent = true;

    async function fetchData() {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.get(generateApiOrigin(`/transaction/${id}`), {
          headers: getAuthHeader(),
        });
        if (!isCurrent) return;
        const nextTransaction = data?.transaction || null;
        setTransaction(nextTransaction);
        setEquities(Array.isArray(data?.equities) ? data.equities : []);
        setStartEquity(nextTransaction?.country === "Indonesia" ? 100000000 : 10000);
      } catch (requestError) {
        if (!isCurrent) return;
        setError("This transaction record could not be loaded. Please return to the ledger and try again.");
        if (axios.isAxiosError(requestError)) {
          console.error("Transaction detail request failed with status:", requestError.response?.status);
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".detail-hero-element", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
        });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".detail-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .fromTo(
            ".detail-security-mark",
            { scale: 0.8, opacity: 0.35 },
            { scale: 1, opacity: 1, duration: 0.45, ease: "none" },
          )
          .to(".detail-security-mark", {
            opacity: 0.2,
            filter: "grayscale(1) brightness(.55)",
            duration: 0.55,
            ease: "none",
          });
        gsap.to(".detail-marquee-track", {
          xPercent: -50,
          duration: 24,
          repeat: -1,
          ease: "none",
        });
        gsap.utils.toArray(".detail-stack-card").forEach((card, index) => {
          gsap.fromTo(
            card,
            { y: 70, scale: 0.97, opacity: 0.25 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 96%",
                end: "top 68%",
                scrub: true,
              },
            },
          );
          gsap.set(card, { zIndex: index + 1 });
        });
      });
      return () => media.revert();
    },
    { scope: pageRef, dependencies: [isLoading, Boolean(transaction)], revertOnUpdate: true },
  );

  const description = [
    "Compare price projections across bull, base, and bear outcomes.",
    "Review the evidence and probability assigned to each scenario.",
    "Understand potential upside and downside before sizing exposure.",
  ];
  const scenarioAnalysis = transaction?.scenario_analysis;
  const orderedScenarios = scenarioAnalysis
    ? [
        { key: "bull_case", label: "Bull Case", ...scenarioAnalysis.bull_case },
        { key: "base_case", label: "Base Case", ...scenarioAnalysis.base_case },
        { key: "bear_case", label: "Bear Case", ...scenarioAnalysis.bear_case },
      ].sort((a, b) => a.probability - b.probability)
    : [];
  const arrangedScenarios = orderedScenarios.length
    ? [orderedScenarios[0], orderedScenarios[2], orderedScenarios[1]]
    : [];
  const latestEquity = equities.at(-1)?.equity;
  const initialEquity = transaction?.country === "Indonesia" ? 100000000 : 10000;
  const pctReturn = latestEquity != null ? (latestEquity - initialEquity) / initialEquity : null;
  const isPositive = pctReturn == null || pctReturn >= 0;
  const symbol = transaction?.name?.replace(".JK", "") || "Transaction";
  const status = transaction?.type === "running" ? "Active" : "Completed";
  const targetPrice = transaction?.target_price ?? transaction?.take_profit ?? scenarioAnalysis?.base_case?.target_price;
  const recommendedRiskPercentage = getRecommendedRiskPercentage(transaction?.risk_level);

  const analysisNav = [
    { href: "#scenarios", icon: BarChart3, title: "Scenario range", copy: "Bull, base, and bear outcomes" },
    { href: "#risk", icon: ShieldCheck, title: "Risk evidence", copy: "Institutional and market signals" },
    { href: "#sizing", icon: WalletCards, title: "Position sizing", copy: "Translate conviction into exposure" },
  ];

  const scenarioContent = (
    <ScenarioAnalysis
      description={description}
      orderedScenarios={arrangedScenarios}
      transaction={transaction}
      bullPrice={scenarioAnalysis?.bull_case?.target_price}
      basePrice={scenarioAnalysis?.base_case?.target_price}
      bearPrice={scenarioAnalysis?.bear_case?.target_price}
      isLoading={isLoading}
      equityType={transaction?.country === "Indonesia" ? "IDR" : "USD"}
    />
  );
  const riskContent = <RiskBreakdown transaction={transaction} isLoading={isLoading} />;
  const sizingContent = (
    <RecommendedSizing
      transaction={transaction}
      startEquity={startEquity}
      setStartEquity={setStartEquity}
      riskPercentage={riskPercentage}
      setRiskPercentage={setRiskPercentage}
      recommendedRiskPercentage={recommendedRiskPercentage}
      isLoading={isLoading}
      scenarioAnalysis={scenarioAnalysis}
      equityType={transaction?.country === "Indonesia" ? "IDR" : "USD"}
    />
  );

  return (
    <main ref={pageRef} className="w-full max-w-full overflow-x-hidden bg-[#f4f6f5] font-['Geist_Variable',sans-serif] text-slate-950">
      <nav className="border-b border-white/10 bg-[#0b1618] px-5 py-4 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4">
          <Link to="/dashboard/transactions" className="group inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-white">
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Transaction ledger
          </Link>
          <div className="flex items-center gap-3 text-xs text-white/45">
            <span className="hidden sm:inline">Decision intelligence</span>
            <span className="size-1 rounded-full bg-cyan-300" />
            <span>Record {id}</span>
          </div>
        </div>
      </nav>

      <header className="detail-hero relative overflow-hidden bg-[#0b1618] px-5 pb-16 pt-10 text-white sm:px-8 lg:px-10 lg:pb-20 lg:pt-14">
        <div className="absolute -right-24 -top-40 size-[34rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute -bottom-44 left-[15%] size-[28rem] rounded-full bg-emerald-300/5 blur-3xl" />
        <div className="relative mx-auto grid max-w-[96rem] items-end gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="detail-hero-element flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/70"><Activity className="size-4" />Investment decision record</div>
            <h1 className="detail-hero-element mt-6 max-w-5xl font-['Satoshi','Geist_Variable',sans-serif] text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.065em]">
              Review <span className="detail-security-mark mx-1 inline-flex size-[0.72em] translate-y-[0.04em] items-center justify-center overflow-hidden rounded-[0.18em] border border-white/15 bg-white/10 align-baseline text-[0.24em] tracking-normal sm:mx-2">{transaction?.logo ? <img src={transaction.logo} alt="" className="size-full object-cover grayscale transition-transform duration-700 hover:scale-105" /> : symbol.slice(0, 2)}</span> {symbol} with context.
            </h1>
            <p className="detail-hero-element mt-6 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">A single view of portfolio outcome, scenario probability, risk evidence, and position sizing for an auditable investment decision.</p>
          </div>
          <div className="detail-hero-element border-l border-white/15 pl-6">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] ${status === "Active" ? "text-cyan-200" : "text-white/55"}`}><span className={`size-2 rounded-full ${status === "Active" ? "bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.8)]" : "bg-white/35"}`} />{status}</span>
              <span className="text-xs text-white/35">{formatDate(transaction?.start_date)}</span>
            </div>
            <div className="mt-7 flex items-end justify-between gap-4">
              <div><p className="text-xs text-white/40">Portfolio value</p>{isLoading ? <Skeleton className="mt-2 h-9 w-44 bg-white/10" /> : <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] tabular-nums">{formatPrice(latestEquity, transaction?.country)}</p>}</div>
              {pctReturn != null && <span className={`mb-1 flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-emerald-300" : "text-rose-300"}`}>{isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}{pctReturn > 0 ? "+" : ""}{(pctReturn * 100).toFixed(2)}%</span>}
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-hidden border-b border-slate-200 bg-white py-3" aria-hidden="true">
        <div className="detail-marquee-track flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {["Macro context", "Institutional score", "Risk filter", "Scenario range", "Position sizing"].map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:px-10">
                  <span className="mr-6 size-1 rounded-full bg-cyan-600 sm:mr-10" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <section className="px-5 py-20 sm:px-8 lg:px-10"><div className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"><TrendingDown className="mx-auto size-6 text-rose-700" /><h2 className="mt-4 text-xl font-semibold">Record unavailable</h2><p className="mt-2 text-sm leading-6 text-slate-500">{error}</p><Link to="/dashboard/transactions" className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0b1618] px-4 text-sm font-semibold text-white">Return to ledger <ArrowRight className="size-4" /></Link></div></section>
      ) : (
        <>
          <section className="detail-overview px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto grid max-w-[96rem] grid-flow-dense gap-5 xl:grid-cols-12">
              <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-52px_rgba(15,23,42,.35)] xl:col-span-8">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">Portfolio outcome</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Value since recommendation</h2></div><div className="flex items-center gap-2 text-xs text-slate-400"><span className={`h-2 w-8 rounded-full ${isPositive ? "bg-emerald-600" : "bg-rose-600"}`} />Investment value</div></div>
                <div className="p-5 sm:p-6"><StockPriceChart chartData={equities} equityType={transaction?.country === "Indonesia" ? "IDR" : "USD"} /></div>
              </article>
              <aside className="overflow-hidden rounded-2xl bg-[#dff7ef] p-6 text-emerald-950 xl:col-span-4">
                <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/55">Decision parameters</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Defined before exposure.</h2></div><Target className="size-5 opacity-50" /></div>
                <div className="mt-8 grid grid-flow-dense grid-cols-2 gap-px overflow-hidden rounded-xl border border-emerald-950/10 bg-emerald-950/10">
                  {[["Entry", formatPrice(transaction?.initial_price, transaction?.country), Activity], ["Target", formatPrice(targetPrice, transaction?.country), Target], ["Stop", formatPrice(transaction?.stop_loss, transaction?.country), ShieldCheck], ["Risk", transaction?.risk_level ? `${transaction.risk_level} risk` : "—", Gauge]].map(([label, value, Icon]) => <div key={label} className="bg-white/70 p-4"><Icon className="size-4 opacity-45" /><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-45">{label}</p><p className="mt-1 text-sm font-semibold capitalize tabular-nums">{value}</p></div>)}
                </div>
                <div className="mt-5 flex items-center gap-4 border-t border-emerald-950/10 pt-5 text-xs text-emerald-950/55"><span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{transaction?.country || "Market unavailable"}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(transaction?.start_date)}</span></div>
              </aside>
            </div>
          </section>

          <section className="px-5 pb-8 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-[96rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:flex-row">{analysisNav.map(({ href, icon: Icon, title, copy }) => <a key={href} href={href} className="group flex min-h-28 flex-1 items-center gap-4 bg-white p-5 transition-[flex,background-color] duration-500 hover:flex-[1.35] hover:bg-slate-50"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#0b1618] group-hover:text-white"><Icon className="size-5" /></span><span className="min-w-0"><span className="block font-semibold">{title}</span><span className="mt-1 block truncate text-xs text-slate-400 group-hover:text-slate-500">{copy}</span></span><ArrowRight className="ml-auto size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" /></a>)}</div></section>

          <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
            <div className="mx-auto max-w-[96rem] space-y-6">
              <article id="scenarios" className="detail-stack-card scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_-60px_rgba(15,23,42,.4)]"><div className="border-b border-slate-200 px-5 py-4 sm:px-6"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">Outcome range</p><BarChart3 className="size-4 text-slate-300" /></div></div><div className="relative p-5 sm:p-6">{user ? <PremiumContentGate userTier={user.tier} previewContent={scenarioContent}>{scenarioContent}</PremiumContentGate> : <AnalysisSkeleton />}<WatermarkOverlay userId={user?.user_id} email={user?.email} /></div></article>
              <article id="risk" className="detail-stack-card scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_-60px_rgba(15,23,42,.4)]"><div className="border-b border-slate-200 px-5 py-4 sm:px-6"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Research evidence</p><ShieldCheck className="size-4 text-slate-300" /></div></div><div className="relative p-5 sm:p-6">{user ? <PremiumContentGate userTier={user.tier} previewContent={riskContent}>{riskContent}</PremiumContentGate> : <AnalysisSkeleton />}<WatermarkOverlay userId={user?.user_id} email={user?.email} /></div></article>
              <article id="sizing" className="detail-stack-card scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_-60px_rgba(15,23,42,.4)]"><div className="border-b border-slate-200 px-5 py-4 sm:px-6"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-800">Exposure discipline</p><WalletCards className="size-4 text-slate-300" /></div></div><div className="relative p-5 sm:p-6">{user ? <PremiumContentGate userTier={user.tier} previewContent={sizingContent}>{sizingContent}</PremiumContentGate> : <AnalysisSkeleton />}<WatermarkOverlay userId={user?.user_id} email={user?.email} /></div></article>
            </div>
          </section>

          <section className="bg-[#0b1618] px-5 py-14 text-white sm:px-8 lg:px-10"><div className="mx-auto flex max-w-[96rem] flex-col justify-between gap-8 md:flex-row md:items-end"><div><Sparkles className="size-5 text-cyan-300" /><h2 className="mt-5 max-w-3xl font-['Satoshi','Geist_Variable',sans-serif] text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Keep this recommendation in the full decision context.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Compare the position with the rest of the portfolio before changing exposure or closing the record.</p></div><Link to="/dashboard/transactions" className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-[#0b1618]">Review transaction ledger <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link></div></section>
        </>
      )}
    </main>
  );
}

export default TransactionDetail;
