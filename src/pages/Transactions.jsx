import { useEffect, useMemo, useRef, useState } from "react";
import "@fontsource-variable/geist";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity, ArrowLeft, ArrowRight,
  ChevronLeft, ChevronRight, Filter, Gauge, Search, ShieldCheck,
  Target, TrendingDown, TrendingUp, X,
} from "lucide-react";
import axios from "@/utils/apiClient";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const urlFetch = generateApiOrigin("/transaction");
const PAGE_SIZE = 20;
const transactionPageRequests = new Map();

function fetchTransactionPage(page) {
  const requestKey = `${page}:${PAGE_SIZE}`;
  const pendingRequest = transactionPageRequests.get(requestKey);
  if (pendingRequest) return pendingRequest;

  const request = axios.get(urlFetch, {
    headers: getAuthHeader(),
    params: { page, page_size: PAGE_SIZE },
  });
  transactionPageRequests.set(requestKey, request);

  const clearRequest = () => {
    if (transactionPageRequests.get(requestKey) === request) {
      transactionPageRequests.delete(requestKey);
    }
  };
  request.then(clearRequest, clearRequest);

  return request;
}

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatPrice(value, country) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: country === "Indonesia" ? "IDR" : "USD",
    maximumFractionDigits: country === "Indonesia" ? 0 : 2,
  }).format(Number(value));
}

function formatReturn(value) {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  return `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(2)}%`;
}

function getTarget(transaction) {
  if (transaction.target_price != null) return transaction.target_price;
  if (transaction.take_profit != null) return transaction.take_profit;
  const entry = Number(transaction.initial_price);
  const change = Number(transaction.predicted_pct_change);
  return Number.isFinite(entry) && Number.isFinite(change) ? entry * (1 + change / 100) : null;
}

function returnTone(value) {
  if (Number(value) > 0) return "text-emerald-700";
  if (Number(value) < 0) return "text-rose-700";
  return "text-slate-500";
}

function TransactionRow({ transaction, user, closingId, onClose }) {
  const running = transaction.type === "running";
  const symbol = transaction.name?.replace(".JK", "") || "Unknown";
  return (
    <div className="transaction-row group border-b border-slate-200 py-4 pl-4 pr-6 transition-colors hover:bg-slate-50 sm:pl-5 sm:pr-8">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(170px,1.4fr)_minmax(105px,.8fr)_repeat(3,minmax(92px,.8fr))_minmax(90px,.65fr)_minmax(176px,auto)]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {transaction.logo ? <img src={transaction.logo} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <span className="flex size-full items-center justify-center text-xs font-bold text-slate-500">{symbol.slice(0, 2)}</span>}
          </div>
          <div className="min-w-0"><p className="truncate font-semibold text-slate-950">{symbol}</p><p className="mt-1 truncate text-xs text-slate-400">{transaction.country || "Market unavailable"}</p></div>
        </div>
        <div><span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${running ? "border-cyan-200 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-slate-100 text-slate-600"}`}>{running ? "Active" : "Completed"}</span><p className="mt-1 text-xs text-slate-400">{formatDate(transaction.start_date)}</p></div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 md:contents">
          {[
            ["Entry", formatPrice(transaction.initial_price, transaction.country), "text-slate-800"],
            ["Target", formatPrice(getTarget(transaction), transaction.country), "text-emerald-700"],
            ["Stop", formatPrice(transaction.stop_loss, transaction.country), "text-rose-700"],
          ].map(([label, value, tone]) => (
            <div key={label} className="min-w-0 bg-white p-3 md:bg-transparent md:p-0">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 md:hidden">{label}</p>
              <p className={`truncate text-sm font-semibold tabular-nums ${tone}`}>{value}</p>
            </div>
          ))}
          <div className="min-w-0 bg-white p-3 md:bg-transparent md:p-0">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 md:hidden">Return</p>
            <p className={`truncate text-sm font-bold tabular-nums ${returnTone(transaction.pct_gain)}`}>{formatReturn(transaction.pct_gain)}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 md:justify-start md:pr-1">
          <Link to={`/dashboard/transactions/${transaction.id}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100">Review <ArrowRight className="size-3.5" /></Link>
          {running && user?.role === "admin" && <button type="button" disabled={closingId === transaction.id} onClick={() => onClose(transaction.id)} className="mr-4 h-9 rounded-lg bg-rose-700 px-3 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-50 lg:mr-6">{closingId === transaction.id ? "Closing" : "Close"}</button>}
        </div>
      </div>
    </div>
  );
}

function Pager({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-xs text-slate-500">Page <b className="text-slate-800">{page}</b> of {totalPages}</p>
      <div className="flex gap-2">
        <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onChange(page - 1)} className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-35"><ChevronLeft className="size-4" /></button>
        <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => onChange(page + 1)} className="flex size-9 items-center justify-center rounded-lg bg-[#0b1618] text-white disabled:opacity-35"><ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [focusIndex, setFocusIndex] = useState(0);
  const { user } = useAuth();
  const pageRef = useRef(null);

  useEffect(() => {
    let isCurrentEffect = true;

    async function fetchData() {
      setIsLoading(true); setError("");
      try {
        const { data } = await fetchTransactionPage(page);
        if (!isCurrentEffect) return;
        const records = Array.isArray(data?.transactions) ? data.transactions : [];
        const count = Number(data?.total) || records.length;
        setTransactions(records); setTotalPages(Math.max(1, Math.ceil(count / PAGE_SIZE))); setFocusIndex(0);
      } catch (requestError) {
        if (!isCurrentEffect) return;
        setError("The transaction ledger could not be loaded. Please try again shortly.");
        if (axios.isAxiosError(requestError)) console.error("Transactions request failed with status:", requestError.response?.status);
      } finally {
        if (isCurrentEffect) setIsLoading(false);
      }
    }
    fetchData();

    return () => {
      isCurrentEffect = false;
    };
  }, [page]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return transactions.filter((item) => (status === "all" || item.type === status) && (!search || `${item.name || ""} ${item.country || ""}`.toLowerCase().includes(search)));
  }, [query, status, transactions]);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray(".transaction-row").forEach((row, index) => gsap.fromTo(row, { y: Math.min(32 + index * 2, 48), scale: 0.985, opacity: 0.35 }, { y: 0, scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: row, start: "top 94%", end: "top 72%", scrub: true } }));
    });
    return () => media.revert();
  }, { scope: pageRef, dependencies: [filtered.length, isLoading], revertOnUpdate: true });

  async function handleClose(id) {
    setClosingId(id);
    try {
      await axios.post(generateApiOrigin(`/transaction/${id}/close`), {}, { headers: getAuthHeader() });
      setTransactions((previous) => previous.map((item) => item.id === id ? { ...item, type: "completed" } : item));
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) console.error("Close transaction request failed with status:", requestError.response?.status);
    } finally { setClosingId(null); }
  }

  const focusRecords = filtered.slice(0, 5);
  const focused = focusRecords[focusIndex] || focusRecords[0];

  return (
    <main ref={pageRef} className="w-full max-w-full overflow-x-hidden bg-[#f4f6f5] text-slate-950">
      <header className="relative overflow-hidden border-b border-slate-200 bg-[#0b1618] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-12">
        <div className="absolute -right-20 -top-36 size-[30rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-[96rem] flex-col items-center text-center">
          <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 self-start text-xs font-semibold text-white/55 hover:text-white"><ArrowLeft className="size-4" /> Portfolio intelligence</Link>
          <h1 className="max-w-5xl font-['Satoshi','Geist_Variable',sans-serif] text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[0.9] tracking-[-0.055em]">Transaction oversight</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">Review active recommendations, risk boundaries, and realized outcomes in one auditable decision ledger.</p>
          <div className="mt-7 flex gap-3"><a href="#ledger" className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#0b1618]">Review ledger <ArrowRight className="size-4" /></a><Link to="/dashboard" className="inline-flex h-10 items-center rounded-lg border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/10">Dashboard</Link></div>
        </div>
      </header>

      <section id="ledger" className="scroll-mt-24 px-5 py-7 sm:px-8 lg:px-10"><div className="mx-auto grid max-w-[96rem] grid-flow-dense gap-5 min-[1800px]:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-52px_rgba(15,23,42,.35)]">
          <div className="border-b border-slate-200 p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">Decision ledger</p><h2 className="mt-2 font-['Satoshi','Geist_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em]">Recommendations and outcomes</h2><p className="mt-2 text-sm text-slate-500">Showing {filtered.length} of {transactions.length} records on this page.</p></div><div className="flex gap-2">
            <label className="relative"><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input value={query} onChange={(event) => { setQuery(event.target.value); setFocusIndex(0); }} placeholder="Search security" className="h-10 w-44 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-cyan-600" /></label>
            <label className="relative"><Filter className="absolute left-3 top-3 size-4 text-slate-400" /><select value={status} onChange={(event) => { setStatus(event.target.value); setFocusIndex(0); }} className="h-10 appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-7 text-sm outline-none"><option value="all">All status</option><option value="running">Active</option><option value="completed">Completed</option></select></label>
          </div></div></div>
          <div className="hidden grid-cols-[minmax(170px,1.4fr)_minmax(105px,.8fr)_repeat(3,minmax(92px,.8fr))_minmax(90px,.65fr)_minmax(176px,auto)] gap-4 border-b border-slate-200 bg-slate-50 py-3 pl-5 pr-8 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 md:grid"><span>Security</span><span>Status</span><span>Entry</span><span>Target</span><span>Stop</span><span>Return</span><span>Action</span></div>
          {error ? <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><TrendingDown className="size-6 text-rose-700" /><p className="mt-3 text-sm text-slate-600">{error}</p></div> : isLoading ? Array.from({ length: 7 }, (_, index) => <div key={index} className="flex items-center gap-4 border-b border-slate-200 p-5"><Skeleton className="size-11 rounded-xl" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-9 w-24" /></div>) : filtered.length ? filtered.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} user={user} closingId={closingId} onClose={handleClose} />) : <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><Activity className="size-6 text-slate-400" /><p className="mt-3 font-semibold">No matching transactions</p><button type="button" onClick={() => { setQuery(""); setStatus("all"); }} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800">Reset filters <X className="size-4" /></button></div>}
          <Pager page={page} totalPages={totalPages} onChange={setPage} />
        </div>

        <aside className="self-start"><div className="overflow-hidden rounded-2xl bg-[#dff7ef] p-6 text-emerald-950"><div className="flex justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/55">Records in focus</p><h2 className="mt-2 font-['Satoshi','Geist_Variable',sans-serif] text-2xl font-semibold tracking-[-0.04em]">Review one decision at a time.</h2></div><Gauge className="size-5 shrink-0 opacity-55" /></div>
          {focused ? <div className="mt-6"><div className="relative h-48">{focusRecords.map((record, index) => { const offset = (index - focusIndex + focusRecords.length) % focusRecords.length; return <div key={record.id} className="absolute inset-x-0 rounded-2xl border border-emerald-950/10 bg-white p-5 shadow-xl transition-all duration-500" style={{ transform: `translateY(${Math.min(offset, 2) * 10}px) scale(${1 - Math.min(offset, 2) * 0.035})`, zIndex: 10 - offset, opacity: offset > 2 ? 0 : 1 }}><div className="flex justify-between"><div><p className="text-lg font-bold text-slate-950">{record.name?.replace(".JK", "")}</p><p className="text-xs text-slate-400">{record.country}</p></div><p className={`font-bold ${returnTone(record.pct_gain)}`}>{formatReturn(record.pct_gain)}</p></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><div><p className="text-slate-400">Target</p><b className="text-emerald-700">{formatPrice(getTarget(record), record.country)}</b></div><div><p className="text-slate-400">Stop</p><b className="text-rose-700">{formatPrice(record.stop_loss, record.country)}</b></div></div><Link to={`/dashboard/transactions/${record.id}`} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-900">Open record <ArrowRight className="size-3" /></Link></div>; })}</div><div className="mt-5 flex items-center justify-between"><p className="text-xs opacity-55">{focusIndex + 1} / {focusRecords.length}</p><div className="flex gap-2"><button type="button" aria-label="Previous record" onClick={() => setFocusIndex((focusIndex - 1 + focusRecords.length) % focusRecords.length)} className="flex size-9 items-center justify-center rounded-full border border-emerald-950/20"><ChevronLeft className="size-4" /></button><button type="button" aria-label="Next record" onClick={() => setFocusIndex((focusIndex + 1) % focusRecords.length)} className="flex size-9 items-center justify-center rounded-full bg-emerald-950 text-white"><ChevronRight className="size-4" /></button></div></div></div> : <p className="mt-6 text-sm opacity-60">Matching records will appear here.</p>}
        </div><div className="mt-5 grid grid-flow-dense grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">{[[Target,"Defined exits","Targets and stops stay paired."],[ShieldCheck,"Risk context","Boundaries remain explicit."],[Activity,"Live lifecycle","Active and completed stay distinct."],[TrendingUp,"Outcome review","Returns remain comparable."]].map(([Icon,title,copy]) => <div key={title} className="bg-white p-4"><Icon className="size-4 text-slate-400" /><p className="mt-4 text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p></div>)}</div></aside>
      </div></section>

    </main>
  );
}

export default Transactions;
