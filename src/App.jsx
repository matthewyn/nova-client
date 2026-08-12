import { useEffect, useRef, useState } from "react";
import "@fontsource-variable/outfit";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Indonesia from "@/assets/indonesia.png";
import USA from "@/assets/usa.png";
import { BlurFade } from "@/components/ui/blur-fade";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import {
  Accordion,
  AccordionItem,
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

const marketCoverage = [
  {
    name: "Indonesia",
    code: "IDX",
    flag: Indonesia,
    flagAlt: "Indonesian flag",
    description:
      "Local sector structure, domestic consumption, resource value chains, and infrastructure-led themes in one connected view.",
    sectors: indonesiaSectors,
    image: SectorRotationArt,
    imageAlt: "Sector intelligence map for the Indonesian equity market",
    themeGroups: [
      {
        title: "Digital economy",
        themes: ["Indonesia Digitalization", "Indonesia Consumer"],
      },
      {
        title: "Industrial value",
        themes: ["Indonesia Hilirization", "Infrastructure Logistics"],
      },
      {
        title: "Domestic resilience",
        themes: ["Indonesia Gold", "Indonesia Healthcare"],
      },
    ],
  },
  {
    name: "United States",
    code: "NYSE · NASDAQ",
    flag: USA,
    flagAlt: "United States flag",
    description:
      "Global technology leadership, industrial investment, critical infrastructure, and defensive demand across the U.S. market.",
    sectors: americanSectors,
    image: CapitalFlowArt,
    imageAlt: "Capital-flow intelligence across the United States equity market",
    themeGroups: [
      {
        title: "Productivity",
        themes: [
          "AI Infrastructure",
          "Industrial Automation",
          "Reindustrialization",
        ],
      },
      {
        title: "Critical systems",
        themes: [
          "Grid Modernization",
          "Supply Chain Resilience",
          "Energy Security",
          "Defense Modernization",
        ],
      },
      {
        title: "Secular demand",
        themes: [
          "Healthcare Innovation",
          "Copper Supercycle",
          "Gold Safe Haven",
        ],
      },
    ],
  },
];

function SectorCoverageSection() {
  const [activeMarket, setActiveMarket] = useState(0);
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const panelRef = useRef(null);
  const visualRef = useRef(null);
  const market = marketCoverage[activeMarket];

  const selectMarket = (index) => {
    setActiveMarket((index + marketCoverage.length) % marketCoverage.length);
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          visualRef.current,
          { autoAlpha: 0.35, scale: 0.82 },
          {
            autoAlpha: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: visualRef.current,
              start: "top 88%",
              end: "center 52%",
              scrub: 0.8,
            },
          },
        );

        gsap.to(visualRef.current, {
          autoAlpha: 0.25,
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: visualRef.current,
            start: "bottom 45%",
            end: "bottom 12%",
            scrub: 0.8,
          },
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

  useGSAP(
    () => {
      gsap.fromTo(
        panelRef.current?.children || [],
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power3.out",
        },
      );
    },
    { scope: panelRef, dependencies: [activeMarket] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-gray-200/80 bg-[#eef3f1] px-5 py-28 text-gray-950 sm:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute -left-52 top-24 size-[36rem] rounded-full bg-cyan-300/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-56 bottom-20 size-[40rem] rounded-full bg-indigo-300/20 blur-[150px]" />

      <div className="relative mx-auto grid max-w-[96rem] grid-flow-dense grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div
          ref={introRef}
          className="self-start lg:col-span-5 lg:flex lg:min-h-[calc(100vh-5.5rem)] lg:flex-col lg:justify-center"
        >
          <p className="max-w-md text-sm leading-6 text-gray-600">
            Nova monitors different market structures through one consistent
            research framework, so regional context never gets lost in the
            comparison.
          </p>
          <h2 className="mt-7 max-w-6xl font-['Outfit_Variable',sans-serif] text-[clamp(3.45rem,12vw,6rem)] font-semibold leading-[0.9] tracking-[-0.065em] lg:text-[clamp(4rem,5.25vw,6rem)]">
            Two markets. One
            <span
              aria-hidden="true"
              className="mx-2 inline-block h-[0.55em] w-[1.4em] rounded-full bg-cover bg-center align-[0.04em] ring-1 ring-gray-950/10 sm:mx-3"
              style={{ backgroundImage: `url(${SectorRotationArt})` }}
            />
            connected opportunity map.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-7 text-gray-600">
            Move from national market structure to sectors and durable themes
            without changing tools or rebuilding the research process.
          </p>

          <div className="mt-10 flex items-center justify-between border-t border-gray-950/15 pt-6">
            <div className="flex items-center">
              {marketCoverage.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => selectMarket(index)}
                  aria-label={`Show ${item.name} coverage`}
                  aria-pressed={activeMarket === index}
                  className={`relative -ml-2 flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 transition duration-500 first:ml-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 ${
                    activeMarket === index
                      ? "z-10 scale-110 border-gray-950 bg-white shadow-lg"
                      : "border-[#eef3f1] bg-white opacity-55 hover:z-10 hover:scale-105 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.flag}
                    alt=""
                    className="size-7 rounded-full object-cover"
                  />
                </button>
              ))}
              <p className="ml-5 font-['Outfit_Variable',sans-serif] text-sm font-semibold">
                {market.name}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => selectMarket(activeMarket - 1)}
                aria-label="Previous market"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-gray-950/15 text-gray-950 transition duration-300 hover:-translate-x-0.5 hover:bg-gray-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => selectMarket(activeMarket + 1)}
                aria-label="Next market"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-gray-950 text-white transition duration-300 hover:translate-x-0.5 hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div ref={panelRef} className="space-y-5 lg:col-span-7">
          <article className="group overflow-hidden rounded-[2rem] bg-gray-950 p-3 text-white shadow-[0_35px_100px_-50px_rgba(15,23,42,0.7)] sm:p-4">
            <div
              ref={visualRef}
              className="relative min-h-[25rem] overflow-hidden rounded-[1.35rem] will-change-transform sm:min-h-[31rem]"
            >
              <img
                key={market.image}
                src={market.image}
                alt={market.imageAlt}
                className="absolute inset-0 h-full w-full object-cover opacity-75 contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-left sm:p-10">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      {market.code}
                    </p>
                    <h3 className="mt-3 font-['Outfit_Variable',sans-serif] text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                      {market.name}
                    </h3>
                  </div>
                  <img
                    src={market.flag}
                    alt={market.flagAlt}
                    className="size-12 rounded-full border border-white/30 object-cover shadow-xl sm:size-14"
                  />
                </div>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
                  {market.description}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-gray-950/10 bg-white/80 p-7 text-left backdrop-blur-xl sm:p-9">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-cyan-700">
                  Research universe
                </p>
                <h3 className="mt-3 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em]">
                  Sector coverage
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                {market.sectors.length} sector groups monitored
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {market.sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-gray-950/10 bg-[#f3f6f5] px-4 py-2 text-sm font-medium text-gray-700 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-600/35 hover:bg-cyan-50 hover:text-cyan-800"
                >
                  {sector}
                </span>
              ))}
            </div>
          </article>

          <div className="flex min-h-[28rem] flex-col gap-px overflow-hidden rounded-[2rem] border border-gray-950/10 bg-gray-950/10 md:flex-row">
            {market.themeGroups.map((group, index) => (
              <article
                key={group.title}
                className={`group flex min-h-64 flex-1 flex-col justify-between overflow-hidden p-7 text-left transition-[flex,background-color] duration-700 ease-out hover:flex-[1.75] sm:p-8 ${
                  index === 1
                    ? "bg-[#d9f5f2]"
                    : index === 2
                      ? "bg-gray-950 text-white"
                      : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="max-w-[10rem] font-['Outfit_Variable',sans-serif] text-2xl font-semibold leading-tight tracking-[-0.035em]">
                    {group.title}
                  </h3>
                  <ArrowUpRight className="size-5 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <ul className="mt-14 space-y-3">
                  {group.themes.map((themeName) => (
                    <li
                      key={themeName}
                      className={`border-t pt-3 text-sm leading-5 ${
                        index === 2
                          ? "border-white/15 text-white/65"
                          : "border-gray-950/10 text-gray-600"
                      }`}
                    >
                      {themeName}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatPerformanceValue(value, suffix = "", digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toFixed(digits)}${suffix}`;
}

function formatTradePrice(stock, value) {
  if (value == null || Number.isNaN(Number(value))) return "—";

  const prefix = stock.country === "Indonesia" ? "Rp " : "$";
  return `${prefix}${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

function TradeOutcome({ value }) {
  const isWin = value > 0;
  const isLoss = value < 0;

  return (
    <span
      className={`inline-flex min-w-20 items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${
        isWin
          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
          : isLoss
            ? "border-rose-300 bg-rose-50 text-rose-800"
            : "border-gray-300 bg-gray-100 text-gray-700"
      }`}
    >
      {isWin ? "Win" : isLoss ? "Loss" : "Break-even"}
    </span>
  );
}

function RealTradePerformanceSection({
  completedStocks,
  isLoading,
  statistics,
}) {
  const [activeTrade, setActiveTrade] = useState(0);
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const stackCardRefs = useRef([]);
  const currentTrade = completedStocks?.[activeTrade] ?? null;

  const selectTrade = (index) => {
    if (!completedStocks?.length) return;
    setActiveTrade(
      (index + completedStocks.length) % completedStocks.length,
    );
  };

  const performanceMetrics = [
    {
      label: "Average return / trade",
      value: formatPerformanceValue(
        statistics?.averageReturnPerTrade,
        "%",
        2,
      ),
      context: "Mean realized return across completed positions.",
    },
    {
      label: "Profit factor",
      value: formatPerformanceValue(statistics?.profitFactor, "", 2),
      context: "Gross gains relative to gross losses.",
    },
    {
      label: "Total return",
      value: formatPerformanceValue(statistics?.totalReturn, "%", 2),
      context: "Cumulative outcome from recorded closed trades.",
    },
  ];

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: visualRef.current,
              start: "top 88%",
              end: "bottom 16%",
              scrub: 0.8,
            },
          })
          .fromTo(
            visualRef.current,
            { autoAlpha: 0.35, scale: 0.82 },
            { autoAlpha: 1, scale: 1, duration: 0.55, ease: "none" },
          )
          .to(visualRef.current, {
            autoAlpha: 0.25,
            scale: 0.96,
            duration: 0.45,
            ease: "none",
          });

        stackCardRefs.current.forEach((card, index) => {
          if (!card) return;

          gsap.fromTo(
            card,
            { autoAlpha: 0.45, y: 88, scale: 0.95 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 50%",
                scrub: 0.8,
              },
            },
          );

          if (index < stackCardRefs.current.length - 1) {
            gsap.to(card, {
              scale: 0.975,
              autoAlpha: 0.45,
              ease: "none",
              scrollTrigger: {
                trigger: stackCardRefs.current[index + 1],
                start: "top 76%",
                end: "top 44%",
                scrub: 0.8,
              },
            });
          }
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/10 bg-[#080b0c] px-5 py-28 text-white sm:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_8%_76%,rgba(16,185,129,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[96rem]">
        <header className="mx-auto max-w-6xl text-center">
          <p className="mx-auto max-w-2xl text-sm leading-6 text-cyan-100/55">
            Completed positions are recorded against their realized market
            outcomes, creating an evidence trail that can be reviewed trade by
            trade.
          </p>
          <h2 className="mt-7 max-w-6xl font-['Outfit_Variable',sans-serif] text-[clamp(3.35rem,10vw,6.6rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
            Performance you can
            <span
              aria-hidden="true"
              className="mx-2 inline-block h-[0.55em] w-[1.35em] rounded-full bg-cover bg-center align-[0.04em] opacity-90 ring-1 ring-white/15 sm:mx-3"
              style={{ backgroundImage: `url(${RiskAnalysisArt})` }}
            />
            inspect, not just a claim.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/50">
            Summary metrics update as positions close. The ledger below keeps
            the entry, target, risk level, and final outcome visible together.
          </p>
        </header>

        <div className="mt-20 space-y-20 md:mt-28 lg:space-y-32">
          <article
            ref={(node) => {
              stackCardRefs.current[0] = node;
            }}
            className="performance-stack-card overflow-hidden rounded-[2rem] border border-white/10 bg-[#101516]/95 p-3 shadow-[0_45px_140px_-55px_rgba(0,0,0,0.95)] backdrop-blur-xl will-change-transform sm:p-4 lg:sticky lg:top-24"
          >
            <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-[1.35rem] bg-white/10 lg:grid-cols-12">
              <div className="flex min-h-[27rem] flex-col justify-between bg-[#d8faf4] p-7 text-gray-950 sm:p-10 lg:col-span-7 lg:min-h-[31rem]">
                <div className="flex items-start justify-between gap-6">
                  <p className="max-w-xs text-xs font-semibold uppercase tracking-[0.17em] text-emerald-800">
                    Realized win rate
                  </p>
                  <p className="text-right text-sm text-gray-600">
                    {statistics?.winningTrades ?? 0} wins<br />
                    {statistics?.losingTrades ?? 0} losses
                  </p>
                </div>

                {isLoading ? (
                  <Skeleton className="h-28 w-64 rounded-3xl bg-emerald-900/10" />
                ) : (
                  <p className="font-['Outfit_Variable',sans-serif] text-[clamp(5.5rem,15vw,10rem)] font-semibold leading-[0.72] tracking-[-0.08em]">
                    {formatPerformanceValue(statistics?.winRate, "%", 1)}
                  </p>
                )}

                <div className="flex flex-col gap-3 border-t border-gray-950/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-['Outfit_Variable',sans-serif] text-xl font-semibold tracking-[-0.025em]">
                    {statistics?.totalTrades ?? 0} completed trades
                  </p>
                  <p className="text-sm text-gray-600">Updated automatically</p>
                </div>
              </div>

              <div className="group relative min-h-[27rem] overflow-hidden bg-gray-950 lg:col-span-5 lg:min-h-[31rem]">
                <div
                  ref={visualRef}
                  className="absolute inset-0 overflow-hidden will-change-transform"
                >
                  <img
                    src={RiskAnalysisArt}
                    alt="Layered risk analysis supporting recorded trade outcomes"
                    className="h-full w-full object-cover opacity-65 contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/25 to-cyan-300/5" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.17em] text-cyan-300">
                    Evidence, not projection
                  </p>
                  <p className="mt-4 max-w-sm font-['Outfit_Variable',sans-serif] text-3xl font-semibold leading-tight tracking-[-0.04em]">
                    Closed trades stay visible after the recommendation.
                  </p>
                </div>
              </div>

              <div className="flex min-h-72 flex-col bg-white lg:col-span-12 lg:flex-row">
                {performanceMetrics.map((metric, index) => (
                  <div
                    key={metric.label}
                    className="group flex flex-1 flex-col justify-between border-gray-200 p-7 text-gray-950 transition-[flex,background-color] duration-700 ease-out hover:flex-[1.45] hover:bg-cyan-50 sm:p-9 lg:border-r lg:last:border-r-0"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <p className="max-w-[10rem] text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        {metric.label}
                      </p>
                      <span className="font-['Outfit_Variable',sans-serif] text-sm text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="mt-12 h-14 w-36 rounded-2xl bg-gray-200" />
                    ) : (
                      <p className="mt-12 font-['Outfit_Variable',sans-serif] text-5xl font-semibold tracking-[-0.055em] sm:text-6xl">
                        {metric.value}
                      </p>
                    )}
                    <p className="mt-6 max-w-xs text-sm leading-6 text-gray-500">
                      {metric.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article
            ref={(node) => {
              stackCardRefs.current[1] = node;
            }}
            className="performance-stack-card overflow-hidden rounded-[2rem] border border-gray-200 bg-[#f5f7f6] p-3 text-gray-950 shadow-[0_45px_140px_-55px_rgba(0,0,0,0.9)] will-change-transform sm:p-4 lg:sticky lg:top-28"
          >
            <div className="rounded-[1.35rem] bg-white px-5 py-7 sm:px-8 sm:py-9">
              <div className="flex flex-col gap-5 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.17em] text-cyan-700">
                    Completed positions
                  </p>
                  <h3 className="mt-3 font-['Outfit_Variable',sans-serif] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                    The trade ledger
                  </h3>
                </div>
                <p className="max-w-md text-left text-sm leading-6 text-gray-500 sm:text-right">
                  Historical results describe recorded outcomes and do not
                  guarantee future performance.
                </p>
              </div>

              <div className="py-7 lg:hidden">
                {isLoading ? (
                  <div className="space-y-5 rounded-[1.5rem] bg-gray-100 p-6">
                    <Skeleton className="h-12 w-44 rounded-xl bg-gray-200" />
                    <Skeleton className="h-28 w-full rounded-2xl bg-gray-200" />
                  </div>
                ) : currentTrade ? (
                  <div className="rounded-[1.5rem] bg-gray-950 p-6 text-white">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentTrade.logo}
                          alt={`${currentTrade.name} logo`}
                          className="size-11 rounded-xl bg-white object-cover"
                        />
                        <div>
                          <p className="font-['Outfit_Variable',sans-serif] text-xl font-semibold">
                            {currentTrade.name.replace(".JK", "")}
                          </p>
                          <p className="text-xs text-white/45">
                            {currentTrade.country}
                          </p>
                        </div>
                      </div>
                      <TradeOutcome value={currentTrade.pct_gain} />
                    </div>
                    <p
                      className={`mt-8 font-['Outfit_Variable',sans-serif] text-5xl font-semibold tracking-[-0.055em] ${
                        currentTrade.pct_gain > 0
                          ? "text-emerald-300"
                          : currentTrade.pct_gain < 0
                            ? "text-rose-300"
                            : "text-white"
                      }`}
                    >
                      {currentTrade.pct_gain.toFixed(2)}%
                    </p>
                    <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-xs">
                      <div>
                        <p className="text-white/40">Entry</p>
                        <p className="mt-2 font-medium">
                          {formatTradePrice(
                            currentTrade,
                            currentTrade.initial_price,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/40">Target</p>
                        <p className="mt-2 font-medium">
                          {formatTradePrice(
                            currentTrade,
                            currentTrade.initial_price +
                              (currentTrade.initial_price *
                                currentTrade.predicted_pct_change) /
                                100,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/40">Risk floor</p>
                        <p className="mt-2 font-medium">
                          {formatTradePrice(
                            currentTrade,
                            currentTrade.stop_loss,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-[1.5rem] bg-gray-100 p-8 text-center text-sm text-gray-500">
                    No completed trades at this time.
                  </p>
                )}

                {completedStocks?.length > 1 && !isLoading && (
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {completedStocks.slice(0, 5).map((stock, index) => (
                        <button
                          key={stock.id}
                          type="button"
                          onClick={() => selectTrade(index)}
                          aria-label={`Show ${stock.name.replace(".JK", "")}`}
                          className={`relative flex size-10 cursor-pointer overflow-hidden rounded-full border-2 border-white bg-white transition duration-300 hover:z-10 hover:-translate-y-1 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                            activeTrade === index ? "z-10 -translate-y-1" : ""
                          }`}
                        >
                          <img
                            src={stock.logo}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => selectTrade(activeTrade - 1)}
                        aria-label="Previous completed trade"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition hover:bg-gray-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                      >
                        <ArrowLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => selectTrade(activeTrade + 1)}
                        aria-label="Next completed trade"
                        className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-gray-950 text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                      >
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <Table className="text-left">
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-transparent">
                      <TableHead className="h-14 min-w-52 text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Stock
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Entry
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Target
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Risk floor
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Realized
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                        Outcome
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <TableRow key={index} className="h-20 border-gray-100">
                          {Array.from({ length: 6 }).map((__, cellIndex) => (
                            <TableCell key={cellIndex}>
                              <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : completedStocks?.length ? (
                      completedStocks.map((stock) => {
                        const targetPrice =
                          stock.initial_price +
                          (stock.initial_price * stock.predicted_pct_change) /
                            100;

                        return (
                          <TableRow
                            key={stock.id}
                            className="group h-20 border-gray-100 transition-colors hover:bg-cyan-50/60"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="overflow-hidden rounded-xl bg-gray-100">
                                  <img
                                    src={stock.logo}
                                    alt={`${stock.name} logo`}
                                    className="size-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                  />
                                </div>
                                <div>
                                  <p className="font-['Outfit_Variable',sans-serif] font-semibold text-gray-950">
                                    {stock.name.replace(".JK", "")}
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-400">
                                    {stock.country}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-gray-700">
                              {formatTradePrice(stock, stock.initial_price)}
                            </TableCell>
                            <TableCell className="font-medium text-gray-700">
                              {formatTradePrice(stock, targetPrice)}
                            </TableCell>
                            <TableCell className="font-medium text-gray-700">
                              {formatTradePrice(stock, stock.stop_loss)}
                            </TableCell>
                            <TableCell
                              className={`font-['Outfit_Variable',sans-serif] text-lg font-semibold ${
                                stock.pct_gain > 0
                                  ? "text-emerald-700"
                                  : stock.pct_gain < 0
                                    ? "text-rose-700"
                                    : "text-gray-600"
                              }`}
                            >
                              {stock.pct_gain.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right">
                              <TradeOutcome value={stock.pct_gain} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-16 text-center text-sm text-gray-500"
                        >
                          No completed trades at this time.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const urlFetchStatistics = generateApiOrigin("/transaction/statistics");
const urlFetchCompleted = generateApiOrigin("/stocks/completed");

function App() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [completedStocks, setCompletedStocks] = useState([]);
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

        <SectorCoverageSection />

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <RealTradePerformanceSection
          completedStocks={completedStocks}
          isLoading={isLoading}
          statistics={statistics}
        />

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
