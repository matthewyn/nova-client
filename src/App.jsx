import { useEffect, useRef, useState } from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EtherealBeamsHero from "@/components/ui/ethereal-beams-hero";
import Dashboard from "@/assets/dashboard.png";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, CircleCheck, RotateCw } from "lucide-react";
import { useTheme } from "next-themes";
import Indonesia from "@/assets/indonesia.png";
import USA from "@/assets/usa.png";
import { BlurFade } from "@/components/ui/blur-fade";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import {
  Accordion,
  AccordionItem,
  Chip,
  Image,
} from "@heroui/react";
import SparkleIcon from "@/components/SparkleIcon";
import { useAuth } from "@/contexts/AuthContext";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { getAuthHeader } from "@/utils/token";
import MacroIntelligenceArt from "@/assets/what-you-get/macro-intelligence.webp";
import CapitalFlowArt from "@/assets/what-you-get/capital-flow.webp";
import SectorRotationArt from "@/assets/what-you-get/sector-rotation.webp";
import RiskAnalysisArt from "@/assets/what-you-get/risk-analysis.webp";
import PositionSizingArt from "@/assets/what-you-get/position-sizing.webp";
import ScenarioAnalysisArt from "@/assets/what-you-get/scenario-analysis.webp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const intelligenceFeatures = [
  {
    id: "item-1",
    title: "Macro Intelligence",
    signal: "Read the regime",
    summary:
      "Understand the current market environment through macroeconomic trends, inflation, interest rates, liquidity, and market regime analysis before making investment decisions.",
    image: MacroIntelligenceArt,
    alt: "Connected market signals orbiting a central macro regime model",
  },
  {
    id: "item-2",
    title: "Capital Flow Analysis",
    signal: "Follow smart money",
    summary:
      "Track where institutional capital is moving across sectors, asset classes, and investment themes to uncover emerging opportunities ahead of the broader market.",
    image: CapitalFlowArt,
    alt: "Luminous capital streams flowing between asset-class structures",
  },
  {
    id: "item-3",
    title: "Sector & Theme Rotation",
    signal: "Find emerging strength",
    summary:
      "Discover sectors and long-term investment themes gaining institutional attention, helping you focus on where capital is flowing—not where it has already gone.",
    image: SectorRotationArt,
    alt: "Rotating sector towers with emerging market leaders illuminated",
  },
  {
    id: "item-4",
    title: "Institutional & Risk Analysis",
    signal: "Measure conviction",
    summary:
      "Evaluate every investment using institutional conviction and a multi-dimensional risk framework covering liquidity, volatility, trend strength, and momentum.",
    image: RiskAnalysisArt,
    alt: "Institutional conviction balanced against layered market risk",
  },
  {
    id: "item-5",
    title: "Smart Position Sizing",
    signal: "Control every entry",
    summary:
      "Determine the appropriate position size based on your risk profile, portfolio allocation, and the current market environment to improve risk-adjusted returns.",
    image: PositionSizingArt,
    alt: "Capital blocks measured and allocated into a balanced portfolio",
  },
  {
    id: "item-6",
    title: "Scenario Analysis",
    signal: "Prepare for outcomes",
    summary:
      "Prepare for multiple market outcomes with AI-generated Bull, Base, and Bear scenarios, allowing you to understand potential opportunities and risks before entering a position.",
    image: ScenarioAnalysisArt,
    alt: "One market signal branching into upside, base, and downside paths",
  },
];

const intelligenceSignals = [
  "Macro regime",
  "Liquidity shifts",
  "Sector rotation",
  "Institutional conviction",
  "Position sizing",
  "Bull · Base · Bear",
];

function WhatYouGetSection() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const marqueeRef = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 24,
          ease: "none",
          repeat: -1,
        });

        gsap.utils.toArray(".intelligence-visual").forEach((visual) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: visual,
                start: "top 88%",
                end: "bottom 12%",
                scrub: 0.8,
              },
            })
            .fromTo(
              visual,
              { autoAlpha: 0.35, scale: 0.82 },
              { autoAlpha: 1, scale: 1, duration: 0.55, ease: "none" },
            )
            .to(visual, {
              autoAlpha: 0.2,
              scale: 0.96,
              duration: 0.45,
              ease: "none",
            });
        });
      });

      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top+=96",
            end: "bottom bottom-=96",
            pin: introRef.current,
            pinSpacing: false,
          });
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-gray-200/70 bg-[#f4f6f7] px-5 py-28 sm:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute -left-48 top-1/4 size-[34rem] rounded-full bg-cyan-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-56 bottom-20 size-[40rem] rounded-full bg-violet-300/15 blur-[140px]" />

      <div className="relative mx-auto grid max-w-[96rem] gap-16 lg:grid-cols-12 lg:gap-10 xl:gap-16">
        <div ref={introRef} className="self-start lg:col-span-4">
          <p className="mb-7 max-w-sm text-sm font-medium leading-relaxed text-gray-500">
            One connected intelligence system, designed to turn noisy market
            data into decisions you can act on.
          </p>
          <h2 className="max-w-5xl font-heading text-[clamp(3.15rem,12vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-gray-950 lg:text-[clamp(3.5rem,4vw,5rem)]">
            See the market
            <span
              aria-hidden="true"
              className="mx-2 inline-block h-[0.58em] w-[1.45em] rounded-full bg-cover bg-center align-[0.05em] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] sm:mx-3"
              style={{ backgroundImage: `url(${MacroIntelligenceArt})` }}
            />
            before the move.
          </h2>
          <p className="mt-8 max-w-md text-base leading-7 text-gray-600">
            Nova AI connects macro context, capital flows, institutional
            signals, and risk into one clear investment workflow.
          </p>

          <div className="mt-10 overflow-hidden border-y border-gray-300/80 py-4">
            <div
              ref={marqueeRef}
              aria-hidden="true"
              className="flex w-max will-change-transform"
            >
              {[...intelligenceSignals, ...intelligenceSignals].map(
                (signal, index) => (
                  <span
                    key={`${signal}-${index}`}
                    className="flex items-center whitespace-nowrap pr-8 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500"
                  >
                    <span className="mr-8 size-1.5 rounded-full bg-cyan-500" />
                    {signal}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gray-200 shadow-[0_32px_100px_-48px_rgba(15,23,42,0.35)] sm:grid-cols-2 lg:col-span-8 xl:grid-cols-12">
          {intelligenceFeatures.map((item, index) => {
            const isDark = index === 0 || index === 4;

            return (
              <article
                key={item.id}
                className={`group relative flex min-h-[29rem] flex-col overflow-hidden p-4 sm:min-h-[31rem] xl:col-span-4 ${
                  isDark ? "bg-gray-950 text-white" : "bg-white text-gray-950"
                }`}
              >
                <div className="intelligence-visual relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-gray-100 will-change-transform">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 via-transparent to-white/5" />
                </div>

                <div className="flex flex-1 flex-col px-2 pb-2 pt-7">
                  <div className="flex items-start justify-between gap-4">
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                        isDark ? "text-cyan-300" : "text-cyan-600"
                      }`}
                    >
                      {item.signal}
                    </p>
                    <ArrowUpRight
                      className={`size-5 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 ${
                        isDark ? "text-white" : "text-gray-950"
                      }`}
                    />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.035em]">
                    {item.title}
                  </h3>
                  <div className="grid flex-1 grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p
                        className={`pt-4 text-sm leading-6 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const workflowStages = [
  {
    signal: "Market context",
    title: "Read the economic regime",
    description:
      "Nova continuously organizes inflation, rates, growth, currencies, and liquidity into a coherent view of the environment shaping risk assets.",
    outcome: "A structured macro view, before security selection begins.",
    image: MacroIntelligenceArt,
    imageAlt: "Macro intelligence signals arranged around a market regime model",
  },
  {
    signal: "Capital movement",
    title: "Trace where liquidity is moving",
    description:
      "Capital flows, asset allocation, and persistent investment themes reveal where institutional attention is building across markets.",
    outcome: "Emerging demand becomes visible before it becomes consensus.",
    image: CapitalFlowArt,
    imageAlt: "Capital streams flowing between global asset classes",
  },
  {
    signal: "Opportunity map",
    title: "Rank sectors with improving conditions",
    description:
      "Nova combines macro fit, liquidity, sector characteristics, and theme exposure to identify the areas with the strongest relative setup.",
    outcome: "A broad market is reduced to a focused opportunity set.",
    image: SectorRotationArt,
    imageAlt: "Sector structures rotating toward areas of relative strength",
  },
  {
    signal: "Decision focus",
    title: "Prioritize the candidates worth reviewing",
    description:
      "Institutional Score, fundamentals, technical strength, forecasting, and risk filters narrow the field to a small set of high-conviction candidates.",
    outcome: "Analysts spend time evaluating decisions, not screening noise.",
    image: RiskAnalysisArt,
    imageAlt: "Investment candidates passing through institutional risk filters",
  },
];

const workflowSignals = [
  "Macro regime",
  "Liquidity",
  "Themes",
  "Sector strength",
  "Institutional Score",
  "Risk filters",
];

function HowNovaWorksSection() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const marqueeRef = useRef(null);
  const cardRefs = useRef([]);

  const focusStage = (index) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });

        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          gsap.fromTo(
            card,
            { autoAlpha: 0.45, y: 96, scale: 0.94 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                end: "top 48%",
                scrub: 0.8,
              },
            },
          );

          if (index < cardRefs.current.length - 1) {
            gsap.to(card, {
              scale: 0.965,
              autoAlpha: 0.35,
              ease: "none",
              scrollTrigger: {
                trigger: cardRefs.current[index + 1],
                start: "top 72%",
                end: "top 38%",
                scrub: 0.8,
              },
            });
          }
        });
      });

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
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/10 bg-[#071012] px-5 py-28 text-white sm:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_88%_72%,rgba(99,102,241,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.75)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto max-w-[96rem]">
        <div className="mb-16 overflow-hidden border-y border-white/10 py-4 md:mb-24">
          <div
            ref={marqueeRef}
            aria-hidden="true"
            className="flex w-max will-change-transform"
          >
            {[...workflowSignals, ...workflowSignals].map((signal, index) => (
              <span
                key={`${signal}-${index}`}
                className="flex items-center whitespace-nowrap pr-10 text-xs font-medium uppercase tracking-[0.18em] text-white/45"
              >
                <span className="mr-10 h-px w-8 bg-cyan-300/70" />
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-flow-dense grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          <div
            ref={introRef}
            className="self-start lg:col-span-4 lg:flex lg:min-h-[calc(100vh-5.5rem)] lg:flex-col lg:justify-center"
          >
            <p className="max-w-sm text-sm leading-6 text-cyan-200/70">
              Nova begins above the stock level, where market context and
              capital movement explain why an opportunity deserves attention.
            </p>
            <h2 className="mt-7 max-w-5xl font-heading text-[clamp(3.4rem,12vw,5.75rem)] font-semibold leading-[0.9] tracking-[-0.065em] lg:text-[clamp(3.75rem,5vw,5.75rem)]">
              From market
              <span
                aria-hidden="true"
                className="mx-2 inline-block h-[0.56em] w-[1.35em] rounded-full bg-cover bg-center align-[0.04em] ring-1 ring-white/20 sm:mx-3"
                style={{ backgroundImage: `url(${CapitalFlowArt})` }}
              />
              noise to investment conviction.
            </h2>
            <p className="mt-8 max-w-md text-base leading-7 text-white/55">
              Each layer narrows the universe, preserving the evidence that
              matters and removing the work that does not.
            </p>

            <div
              className="mt-10 hidden h-20 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:flex"
              aria-label="Jump to a workflow stage"
            >
              {workflowStages.map((stage, index) => (
                <button
                  key={stage.signal}
                  type="button"
                  onClick={() => focusStage(index)}
                  className="group flex min-w-0 flex-1 cursor-pointer items-end overflow-hidden bg-[#0b1619] p-3 text-left transition-[flex,background-color] duration-500 ease-out hover:flex-[2.2] hover:bg-[#102328] focus-visible:flex-[2.2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300"
                >
                  <span className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/45 transition-colors group-hover:text-cyan-200 group-focus-visible:text-cyan-200">
                    {stage.signal}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:col-span-8 lg:space-y-24">
            {workflowStages.map((stage, index) => (
              <article
                key={stage.title}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="group sticky top-24 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d181b]/95 p-3 shadow-[0_40px_100px_-45px_rgba(0,0,0,0.9)] backdrop-blur-xl will-change-transform sm:p-4"
                style={{ top: `${6 + index * 1.5}rem` }}
              >
                <div className="grid min-h-[32rem] overflow-hidden rounded-[1.2rem] bg-[#101d20] md:grid-cols-2">
                  <div className="relative min-h-72 overflow-hidden md:min-h-full">
                    <img
                      src={stage.image}
                      alt={stage.imageAlt}
                      className="h-full w-full object-cover opacity-80 contrast-125 grayscale-[0.25] transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071012] via-transparent to-cyan-300/5 md:bg-gradient-to-r md:from-transparent md:to-[#101d20]" />
                    <span className="absolute left-5 top-5 font-heading text-6xl font-semibold tracking-[-0.06em] text-white/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between p-7 text-left sm:p-9 md:p-10">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.17em] text-cyan-300">
                        {stage.signal}
                      </p>
                      <h3 className="mt-5 font-heading text-3xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-4xl">
                        {stage.title}
                      </h3>
                      <p className="mt-6 text-sm leading-7 text-white/55 sm:text-base">
                        {stage.description}
                      </p>
                    </div>

                    <div className="mt-12 border-t border-white/10 pt-6">
                      <p className="text-sm font-medium leading-6 text-white/85">
                        {stage.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white p-2 shadow-[0_40px_120px_-45px_rgba(34,211,238,0.32)] sm:p-3">
              <div className="overflow-hidden rounded-[1.15rem] bg-gray-100">
                <Image
                  src={Dashboard}
                  alt="Nova AI dashboard showing prioritized investment intelligence"
                  className="w-full transition-transform duration-700 ease-out hover:scale-[1.015]"
                />
              </div>
              <div className="flex flex-col gap-3 px-4 py-5 text-left sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="font-heading text-lg font-semibold tracking-[-0.02em] text-gray-950">
                  One workspace. A traceable path from signal to decision.
                </p>
                <p className="text-sm text-gray-500">Built for focused review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const indonesiaSectors = [
  "Property",
  "Consumer Staples",
  "Consumer Discretionary",
  "Technology",
  "Healthcare",
  "Coal",
  "Nickel",
  "Gold",
  "Infrastructure",
  "Telecommunication",
  "CPO",
  "Energy",
  "Energy Shipping",
  "Banking",
];
const americanSectors = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer Discretionary",
  "Industrials",
  "Transportation",
  "Energy",
  "Consumer Staples",
  "Utilities",
  "Materials",
  "Copper",
  "Gold",
  "Communication Services",
];

function FlipSectorCard({
  flagSrc,
  flagAlt,
  title,
  sectors,
  backTitle,
  backPoints,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex-1 [perspective:1500px]">
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={() => setIsFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={`Flip ${title} card`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped((f) => !f);
          }
        }}
      >
        {/* Front */}
        <Card className="h-full [backface-visibility:hidden]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <img src={flagSrc} alt={flagAlt} className="h-6 w-6" />
              <p>{title}</p>
              <RotateCw className="size-3.5 text-gray-300 ml-1" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            <ul className="space-y-4">
              {sectors.map((sector, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CircleCheck className="size-4" />
                  <span>{sector}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <img src={flagSrc} alt={flagAlt} className="h-6 w-6" />
              <p>{backTitle}</p>
              <RotateCw className="size-3.5 text-gray-300 ml-1" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            <ul className="space-y-4 text-left">
              {backPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CircleCheck className="size-4 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const urlFetchStatistics = generateApiOrigin("/transaction/statistics");
const urlFetchCompleted = generateApiOrigin("/stocks/completed");

function App() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [completedStocks, setCompletedStocks] = useState([]);
  const { theme } = useTheme();
  const PAGE_SIZE = 10;
  const faqItems = [
    {
      title: "Does the founder use this AI directly?",
      content:
        "Yes. Nova AI is also used directly by the founder in investment transactions. The platform is designed to help retail investors get access to the same technology used by professionals, so they can make more informed and structured investment decisions.",
    },
    {
      title: "Is this AI signal 100% accurate?",
      content:
        "No. Markets remain risky and no system is always right. Nova AI doesn't aim to predict the market perfectly, but rather helps users make more structured decisions based on data, probability, and risk management.",
    },
    {
      title: "Do I have to stare at the screen all day?",
      content:
        "No. Nova AI helps filter the market and provides important insights so users only need to look at pre-analyzed stock options, not monitor all market movements manually.",
    },
    {
      title: "Does Nova AI always find opportunities every day?",
      content:
        "Not always. Nova AI is not designed to force searching for opportunities every day. The system first evaluates macroeconomic conditions, liquidity, market sentiment, and market regime before providing insights. In less favorable conditions, Nova AI may recommend being more cautious or even not investing at the moment.",
    },
    {
      title:
        "What makes Nova AI different from free indicators on the internet?",
      content:
        "Nova AI doesn't rely on just one or two technical indicators. The system combines macroeconomic analysis, global liquidity, market regime detection, risk modeling, market data, and AI reasoning in one integrated framework. The goal is not just to find stocks that might go up, but to understand market conditions behind every investment decision.",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [completedStocksResponse, statisticsResponse] = await Promise.all(
          [
            axios.get(urlFetchCompleted, {
              headers: getAuthHeader(),
              params: { page: 1, page_size: PAGE_SIZE },
            }),
            axios.get(urlFetchStatistics, { headers: getAuthHeader() }),
          ],
        );
        if (completedStocksResponse.status === 200) {
          const { stocks } = completedStocksResponse.data;
          setCompletedStocks(stocks);
        }
        if (statisticsResponse.status === 200) {
          const {
            winrate,
            total_trades,
            winning_trades,
            losing_trades,
            profit_factor,
            total_return,
            avg_return_per_trade,
            best_trade,
            worst_trade,
          } = statisticsResponse.data;
          setStatistics({
            winRate: winrate,
            totalTrades: total_trades,
            winningTrades: winning_trades,
            losingTrades: losing_trades,
            profitFactor: profit_factor,
            totalReturn: total_return,
            averageReturnPerTrade: avg_return_per_trade,
            bestTrade: best_trade,
            worstTrade: worst_trade,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50">
      {/* Hero / Pricing header */}
      <div>
        <div className="px-8">
          <EtherealBeamsHero
            user={user}
            statistics={statistics}
            isLoading={isLoading}
          />
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <WhatYouGetSection />

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <HowNovaWorksSection />

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        {/* <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              Testimoni
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1">
              Investing feels clearer with
            </h2>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-cyan-400">the right guidance</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Real experiences from people using AI to
              invest wisely, not emotionally
            </p>
            <div className="grid grid-cols-4 mt-12 gap-4">
              <Card
                style={{
                  backgroundImage: `url(${Gradient})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="text-white"
              >
                <CardContent className={"text-left"}>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <HiMiniStar
                          key={i}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                  </div>
                  <p className="mt-3">
                    "Usually I have to open many applications and read news
                    one by one. Now Nova directly gives me a market summary and
                    easy-to-understand stock insights."
                  </p>
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                      radius: "md",
                    }}
                    description="Investor Saham Retail"
                    name="Andi Pratama"
                    className="mt-20"
                  />
                </CardContent>
              </Card>
              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent className={"text-left"}>
                    <User
                      avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        radius: "md",
                      }}
                      description="Karyawan Swasta"
                      name="Kevin Wijaya"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className={"text-left"}>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <HiMiniStar
                            key={i}
                            className="h-5 w-5 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                    </div>
                    <p className="mt-20">
                      "The AI forecasting feature helps me screen stocks faster
                      without having to analyze everything manually."
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent className={"text-left"}>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <HiMiniStar
                            key={i}
                            className="h-5 w-5 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                    </div>
                    <p className="mt-20">
                      "I like it because the insights provided are not too
                      complex. Perfect for retail investors who want to learn
                      to understand the market."
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className={"text-left"}>
                    <User
                      avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        radius: "md",
                      }}
                      description="Mahasiswa"
                      name="Felicia Tan"
                    />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className={"text-left"}>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <HiMiniStar
                          key={i}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                  </div>
                  <p className="mt-3">
                    "Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem error facere quasi accusantium earum laboriosam
                    architecto facilis deserunt consequatur."
                  </p>
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                      radius: "md",
                    }}
                    description="Product Designer"
                    name="Jane Doe"
                    className="mt-20"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div> */}

        <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 pt-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              Sector Coverage
            </div>
            <BlurFade delay={0.15} inView>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Covers various sectors
              </h2>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-cyan-400">and investment themes</span>
              </h2>
            </BlurFade>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Nova AI continuously tracks capital flows across more than 600
              Indonesian and U.S. stocks, helping investors identify which
              sectors and investment themes are attracting liquidity in the
              current market environment.
            </p>
            <div className="mt-12 flex md:max-w-1/2 mx-auto gap-4">
              <FlipSectorCard
                flagSrc={Indonesia}
                flagAlt="Indonesia"
                title="Indonesia"
                sectors={indonesiaSectors}
                backTitle="Themes we track"
                backPoints={[
                  "Indonesia Digitalization",
                  "Indonesia Hilirization",
                  "Indonesia Gold",
                  "Infrastructure Logistics",
                  "Indonesia Consumer",
                  "Indonesia Healthcare",
                ]}
              />
              <FlipSectorCard
                flagSrc={USA}
                flagAlt="USA"
                title="United States"
                sectors={americanSectors}
                backTitle="Themes we track"
                backPoints={[
                  "AI Infrastructure",
                  "Grid Modernization",
                  "Industrial Automation",
                  "Reindustrialization",
                  "Supply Chain Resilience",
                  "Energy Security",
                  "Defense Modernization",
                  "Healthcare Innovation",
                  "Copper Supercycle",
                  "Gold Safe Haven",
                ]}
              />
            </div>
            <div className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
              <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40" />
              <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-zinc-900/20 dark:border-white/20 bg-white dark:bg-zinc-900" />
              <Sparkles
                density={1200}
                className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
                color={theme === "dark" ? "#ffffff" : "#000000"}
              />
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        {/* Real trade performance */}
        <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              Real Trade Performance
            </div>
            <BlurFade delay={0.15} inView>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Every completed trade,
              </h2>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-cyan-400">
                  measured with transparency
                </span>
              </h2>
            </BlurFade>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Every completed position is recorded and tracked using its actual
              market outcome. Below are the latest closed trades generated by
              Nova AI, along with key performance metrics that update
              automatically as new positions are completed.
            </p>
            <div className="mt-12 max-w-2/3 mx-auto">
              <Table className="mb-6 text-left">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="min-w-28 md:min-w-24">
                      Stock
                    </TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>TP</TableHead>
                    <TableHead>SL</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="h-16">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl bg-gray-200" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-24 rounded-full bg-gray-200" />
                              <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24 rounded-full bg-gray-200" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20 rounded-full bg-gray-200" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20 rounded-full bg-gray-200" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full bg-gray-200" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20 rounded-full bg-gray-200" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : completedStocks && completedStocks.length > 0 ? (
                    completedStocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="flex gap-2 items-center">
                          <img
                            src={stock.logo}
                            alt={`${stock.name} logo`}
                            className="h-8 w-8 rounded-md"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {stock.name.replace(".JK", "")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {stock.country === "Indonesia" ? "Rp " : "$"}
                          {stock.initial_price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {stock.country === "Indonesia" ? "Rp " : "$"}
                          {(
                            stock.initial_price +
                            (stock.initial_price * stock.predicted_pct_change) /
                              100
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          {stock.country === "Indonesia" ? "Rp " : "$"}
                          {stock.stop_loss.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {stock.pct_gain > 0 ? (
                            <span className="text-green-500 font-semibold">
                              {stock.pct_gain.toFixed(2)}%
                            </span>
                          ) : stock.pct_gain < 0 ? (
                            <span className="text-red-500 font-semibold">
                              {stock.pct_gain.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-gray-500 font-semibold">
                              {stock.pct_gain.toFixed(2)}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {stock.pct_gain > 0 ? (
                            <Chip
                              size="sm"
                              className="font-bold bg-green-500/10 border border-green-500"
                            >
                              <span className="font-bold text-green-700">
                                Win
                              </span>
                            </Chip>
                          ) : stock.pct_gain < 0 ? (
                            <Chip
                              size="sm"
                              className="font-bold bg-red-500/10 border border-red-500"
                            >
                              <span className="font-bold text-red-700">
                                Loss
                              </span>
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              className="font-bold bg-gray-500/10 border border-gray-500"
                            >
                              <span className="font-bold text-gray-700">
                                Break-even
                              </span>
                            </Chip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No completed trades at this time.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {isLoading ? (
                <div className="space-y-5 rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
                  <div className="space-y-3">
                    <Skeleton className="mx-auto h-4 w-32 rounded-full bg-gray-200" />
                    <Skeleton className="mx-auto h-8 w-48 rounded-xl bg-gray-200" />
                    <Skeleton className="mx-auto h-4 w-40 rounded-full bg-gray-200" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-20 rounded-2xl bg-gray-200" />
                    <Skeleton className="h-20 rounded-2xl bg-gray-200" />
                    <Skeleton className="h-20 rounded-2xl bg-gray-200" />
                  </div>
                </div>
              ) : (
                <CardSpotlight>
                  <h3 className="text-xl font-bold text-white">Total Trades</h3>
                  <p className="text-lg font-bold leading-8 mt-2 text-white/80 sm:text-xl lg:text-3xl">
                    {statistics?.winningTrades ?? 0} Winning /{" "}
                    {statistics?.totalTrades ?? 0} Total
                  </p>
                  <p className="text-xl font-bold text-green-500/80 mt-2">
                    ={" "}
                    {statistics?.winRate != null
                      ? `${statistics.winRate.toFixed(1)}%`
                      : "0.0%"}{" "}
                    Win Rate
                  </p>
                  <h3 className="text-xl font-bold text-white mt-3">
                    Average Return / Trade
                  </h3>
                  <p className="text-xl font-bold text-green-500/80 mt-2">
                    {statistics?.averageReturnPerTrade != null
                      ? `${statistics.averageReturnPerTrade.toFixed(2)}%`
                      : "0.00%"}{" "}
                    Average Return
                  </p>
                  <h3 className="text-xl font-bold text-white mt-3">
                    Profit Factor
                  </h3>
                  <p className="text-xl font-bold text-green-500/80 mt-2">
                    {statistics?.profitFactor != null
                      ? statistics.profitFactor.toFixed(2)
                      : "0.00"}
                  </p>
                </CardSpotlight>
              )}
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
                <SparkleIcon size={12} />
                FAQ
              </div>
              <BlurFade delay={0.15} inView>
                <h2 className="text-4xl font-bold text-gray-900 mb-1">
                  Everything you might
                </h2>
              </BlurFade>
              <BlurFade delay={0.15 * 2} inView>
                <h2 className="text-4xl font-bold mb-4 text-cyan-400">
                  want to know
                </h2>
              </BlurFade>
              <p className="text-sm text-gray-400 max-w-lg mx-auto">
                We believe informed investors make better decisions. Here are
                answers to the most frequently asked questions we hear.
              </p>
            </div>
            <div className="max-w-4/5 mx-auto mt-8">
              <Accordion>
                {" "}
                {faqItems.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    aria-label={faq.title}
                    title={faq.title}
                  >
                    {" "}
                    {faq.content}{" "}
                  </AccordionItem>
                ))}{" "}
              </Accordion>
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70">
            <HeroGeometric
              title="From picking stocks to understanding the market"
              paragraph="It's like having a personal investment intelligence assistant that shows you where capital is flowing, which sectors are attracting liquidity, and where the next opportunities may emerge."
            />
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>
      </div>
    </main>
  );
}

export default App;
