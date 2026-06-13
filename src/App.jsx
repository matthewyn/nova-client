import { useEffect, useState } from "react";
import GradientMesh from "@/assets/gradient-mesh.jpg";
import Gradient from "@/assets/gradient.jpg";
import {
  HiFire,
  HiBolt,
  HiGift,
  HiExclamationCircle,
  HiMiniStar,
  HiGlobeAsiaAustralia,
  HiMap,
  HiLightBulb,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import Dashboard from "@/assets/dashboard.png";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { proceedToWhatsapp } from "@/utils/proceedToWhatsapp";
import { Sparkles } from "@/components/ui/sparkles";
import { Separator } from "@/components/ui/separator";
import { CircleCheck } from "lucide-react";
import { useTheme } from "next-themes";
import Indonesia from "@/assets/indonesia.png";
import USA from "@/assets/usa.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BlurFade } from "@/components/ui/blur-fade";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Image,
  User,
} from "@heroui/react";
import SparkleIcon from "@/components/SparkleIcon";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CustomChip from "@/components/CustomChip";
import { generateApiOrigin } from "@/utils/apiOrigin";
import axios from "axios";
import { getAuthHeader } from "@/utils/token";
import DotGrid from "@/components/DotGrid";
import { Badge } from "@/components/ui/badge";

const CheckIcon = ({ className = "" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M5 13L9 17L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const items = [
  {
    quarter: "STEP 01",
    title: "Macro Data Agent",
    description:
      "Collects and processes the latest macroeconomic data, including money supply, inflation, interest rates, and other key economic indicators.",
    status: "done",
  },
  {
    quarter: "STEP 02",
    title: "Liquidity Analysis Agent",
    description:
      "Analyzes global liquidity conditions using money supply trends, yield curves, currency strength, commodity prices, and other market signals to identify the current macro regime.",
    status: "done",
  },
  {
    quarter: "STEP 03",
    title: "Sector Rotation Agent",
    description:
      "Identifies capital rotation across asset classes and sectors, including bonds, equities, commodities, precious metals, and other investment opportunities.",
    status: "done",
  },
  {
    quarter: "STEP 04",
    title: "Stock Ranking Agent",
    description:
      "Ranks every sector and identifies the top 5 stocks within each sector based on momentum, valuation, quality, liquidity, earnings strength, and alignment with the current macro regime.",
    status: "done",
  },
];

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
  "Oil & Gas",
  "Energy Shipping",
];
const americanSectors = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer Discretionary",
  "Industrials",
  "Energy",
  "Consumer Staples",
  "Utilities",
  "Materials",
];

const comparisonRows = [
  {
    icon: <HiGlobeAsiaAustralia size={16} />,
    label: "Macro Dashboard",
    free: "Basic",
    pro: "Complete",
    elite: "Complete",
  },
  {
    icon: <HiLightBulb size={16} />,
    label: "Stock Intelligence",
    free: "1/day",
    pro: "Unlimited",
    elite: "Unlimited",
  },
  {
    icon: <HiMap size={16} />,
    label: "Scenario Analysis",
    free: "-",
    pro: "Yes",
    elite: "Yes",
  },
  {
    icon: <HiExclamationCircle size={16} />,
    label: "Risk Modeling",
    free: "-",
    pro: "Yes",
    elite: "Advanced",
  },
  {
    icon: <HiMiniStar size={16} />,
    label: "Early Access Features",
    free: "-",
    pro: "-",
    elite: "Yes",
  },
];

const urlFetch = generateApiOrigin("/midtrans/create-token");

function App() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
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

  const getPlanPrice = (planId) => {
    if (user?.country === "Indonesia") {
      return planId === "pro" ? 1000000 : planId === "elite" ? 3000000 : 0;
    } else {
      return planId === "pro" ? 99.99 : planId === "elite" ? 199.99 : 0;
    }
  };

  const plans = [
    {
      id: "trial",
      badge: "TRIAL ~ Explore Market Intelligence",
      tagline: "Retail investor",
      name: "who wants to understand the market better",
      price: 0,
      icon: <HiGift size={16} className="text-white" />,
      iconBg: "bg-gray-800",
      featured: false,
      includedLabel: "What's included",
      features: [
        "Basic Macro Dashboard",
        "Sector Rotation Analysis",
        "1 Stock Intelligence Report per day",
        "Portfolio summary",
      ],
      buttonLabel: "Start Free",
      isDisabled: user !== null,
    },
    {
      id: "pro",
      badge: "PRO ~ Macro & Quant Intelligence",
      tagline: "Active investor",
      name: "who wants to make data-driven decisions",
      price: 1000000,
      icon: <HiFire size={16} className="text-white" />,
      iconBg: "bg-cyan-400",
      featured: true,
      includedLabel: "All Free features, plus",
      features: [
        "Unlimited Stock Intelligence",
        "Complete Macro Dashboard",
        "Risk Modeling & Position Sizing",
        "Scenario Analysis",
        "AI Market Intelligence Report",
      ],
      buttonLabel: "Start Pro",
      isDisabled: user && user.tier == "pro",
    },
    {
      id: "elite",
      badge: "ELITE ~ Institutional Intelligence",
      tagline: "Serious investor",
      name: "who wants professional-level framework",
      price: 3000000,
      icon: <HiBolt size={16} className="text-white" />,
      iconBg: "bg-gray-800",
      featured: false,
      includedLabel: "All Pro features, plus",
      features: [
        "Advanced Forecast Engine",
        "Advanced Risk Modeling",
        "Early access to new features and models",
      ],
      buttonLabel: "Start Elite",
      isDisabled: true,
    },
  ];

  const words = [
    {
      text: "Understand the market faster.",
      className: "text-4xl font-semibold text-cyan-400 leading-tight mb-4",
    },
  ];

  // const handleSubmit = async (e) => {
  //   try {
  //     e.preventDefault();
  //     setIsLoading(true);

  //     const response = await axios.post(
  //       urlFetch,
  //       {
  //         price: 1000000,
  //       },
  //       {
  //         headers: getAuthHeader(),
  //       },
  //     );

  //     if (response.status === 201) {
  //       window.snap.pay(response.data.token);
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.status === 500) {
  //         toast("Terjadi kesalahan pada server. Silakan coba lagi nanti.", {
  //           type: "error",
  //           position: "top-center",
  //         });
  //       }

  //       console.error("Server error:", error.response?.data);
  //       console.error("Status code:", error.response?.status);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
  //   const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  //   const script = document.createElement("script");
  //   script.src = snapScript;
  //   script.setAttribute("data-client-key", clientKey);
  //   document.body.appendChild(script);
  //   script.async = true;

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Pricing header */}
      <div>
        <div className="px-8">
          <div className="relative bg-white px-10 py-12 overflow-hidden border-x-1 border-gray-200/70">
            <DotGrid />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
                <SparkleIcon size={12} />
                Pricing
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
                AI-powered investing.
              </h1>
              <TypewriterEffectSmooth words={words} />
              <p className="text-sm text-gray-400 leading-relaxed">
                Nova AI (Neural Optimized Valuation Agent) is a quantitative
                investment intelligence platform that combines macroeconomic
                analysis, capital flow, sector rotation, and AI reasoning to
                help investors understand what's happening in the market before
                making investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="grid grid-cols-3 border border-gray-200/70">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={plan.featured ? "" : "bg-gray-300/20"}
                style={
                  plan.featured
                    ? {
                        backgroundImage: `url(${GradientMesh})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                {/* Top section */}
                <div className="m-2 bg-white p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{plan.badge}</p>
                      <p className="text-gray-400 text-xl">{plan.tagline}</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {plan.name}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${plan.iconBg}`}>
                      {plan.icon}
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {user?.country === "Indonesia" ? "Rp. " : "$"}
                      {Number(getPlanPrice(plan.id)).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">/month</span>
                  </div>
                  <Button
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                      plan.featured
                        ? "bg-gray-900 text-white hover:bg-gray-700"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    as={Link}
                    to={user ? "#" : "/signup"}
                    isDisabled={plan.isDisabled}
                    onClick={
                      plan.id === "pro"
                        ? user
                          ? () => proceedToWhatsapp(user)
                          : undefined
                        : undefined
                    }
                  >
                    {plan.buttonLabel}
                  </Button>
                </div>

                {/* Features section */}
                <div className={`p-6 flex-1 rounded-b-xl`}>
                  <p
                    className={`text-xs mb-4 font-medium ${plan.featured ? "text-blue-200" : "text-gray-400"}`}
                  >
                    {plan.includedLabel}
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <CheckIcon
                          className={
                            plan.featured
                              ? "text-cyan-300 flex-shrink-0"
                              : "text-gray-400 flex-shrink-0"
                          }
                        />
                        <span
                          className={`text-sm ${plan.featured ? "text-white" : "text-gray-500"}`}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        {/* Compare plans section */}
        <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70">
            <ContainerScroll>
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
                <SparkleIcon size={12} />
                Compare plans
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Get deeper investment insights
              </h2>
              <h2 className="text-4xl font-bold text-cyan-400 mb-4">with AI</h2>
              {/* Comparison table */}
              <div className="mt-12">
                {/* Header */}
                <div className="grid grid-cols-4">
                  <div className="p-4" />
                  {[
                    { label: "FREE", key: "free" },
                    { label: "PRO", key: "pro" },
                    { label: "ELITE", key: "elite" },
                  ].map((col, i) => (
                    <div
                      key={col.key}
                      className={`p-4 text-center text-sm font-semibold text-gray-700}`}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>

                {comparisonRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-4 border-b border-gray-200/70`}
                  >
                    <div className="p-4 flex items-center gap-2.5">
                      <span className="text-base">{row.icon}</span>
                      <span className="text-sm text-gray-600 font-medium">
                        {row.label}
                      </span>
                    </div>
                    {[row.free, row.pro, row.elite].map((val, i) => (
                      <div
                        key={i}
                        className={`p-4 text-center text-sm text-gray-500`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ContainerScroll>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <div className="text-center border-y-1 border-gray-200/70 px-8 overflow-hidden">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              How Nova AI Works
            </div>
            <BlurFade delay={0.15} inView>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Nova AI doesn't start from stocks
              </h2>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-cyan-400">
                  but from market understanding
                </span>
              </h2>
            </BlurFade>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Instead of focusing on which stocks are performing well today,
              Nova AI analyzes where capital is flowing, which sectors are
              attracting investment, and whether those trends are likely to
              persist.
            </p>
            <div className="relative mt-12">
              <div className="absolute left-0 right-0 top-4 h-px bg-border" />
              <div className="flex justify-between gap-4">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative pt-8 text-center w-1/4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`absolute left-1/2 top-2 -translate-x-1/2 h-4 w-4 rounded-full flex items-center justify-center ${
                        item.status === "done" || item.status === "in-progress"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-background" />
                    </motion.div>

                    <Badge
                      variant={
                        item.status === "done" || item.status === "in-progress"
                          ? "default"
                          : "outline"
                      }
                      className="mb-1 text-[11px]"
                    >
                      {item.quarter}
                    </Badge>

                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mx-auto max-w-4xl mt-12 px-6 xl:px-0">
              <div className="relative flex flex-col items-center border border-red-500">
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-red-500 text-white" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-red-500 text-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-red-500 text-white" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-red-500 text-white" />

                <Image
                  src={Dashboard}
                  alt="Dashboard preview"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              Performa Nova AI
            </div>
            <BlurFade delay={0.15} inView>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Designed to recognize
              </h2>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-cyan-400">
                  forming trend
                </span>
              </h2>
            </BlurFade>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Nova AI helps recognize trend changes earlier and maintains
              focus on positions showing relative strength.
            </p>
            <Carousel className="mt-12">
              <CarouselContent>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Alamtri Minerals Indonesia Tbk. (ADMR)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="green"
                            text="13,33%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="30,7%" prefix="3Y:" />
                        </div>
                      </div>
                      <Image src={Admr} alt="Admr performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Adaro Energy Tbk. (ADRO)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip color="green" text="32%" prefix="YTD:" />
                          <CustomChip color="green" text="63,8%" prefix="3Y:" />
                          <CustomChip color="green" text="427%" prefix="5Y:" />
                          <CustomChip color="green" text="950%" prefix="10Y:" />
                        </div>
                      </div>
                      <Image src={Adro} alt="Adaro performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Bumi Resources Tbk. (BUMI)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="red"
                            text="-15,55%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="22,5%" prefix="3Y:" />
                          <CustomChip color="green" text="204%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Bumi} alt="Bumi performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Indika Energy Tbk. (INDY)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="green"
                            text="24,8%"
                            prefix="YTD:"
                          />
                          <CustomChip
                            color="green"
                            text="36,98%"
                            prefix="3Y:"
                          />
                          <CustomChip color="green" text="96%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Indy} alt="Indy performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Pantai Indah Kapuk Dua Tbk. (PANI)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="red"
                            text="-16,98%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="396%" prefix="3Y:" />
                          <CustomChip color="green" text="1121%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Pani} alt="Pani performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Bumi Resources Minerals Tbk. (BRMS)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="red"
                            text="-29,32%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="161%" prefix="3Y:" />
                          <CustomChip color="green" text="269%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Brms} alt="Brms performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div> */}

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
              Below are the sectors currently covered by Nova AI across the
              Indonesian and U.S. equity markets.
            </p>
            <div className="mt-12 flex max-w-1/2 mx-auto gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <img src={Indonesia} alt="Indonesia" className="h-6 w-6" />
                    <p>Indonesia</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-4">
                    {indonesiaSectors.map((sector, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CircleCheck className="size-4" />
                        <span>{sector}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <img src={USA} alt="USA" className="h-6 w-6" />
                    <p>United States</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-4">
                    {americanSectors.map((sector, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CircleCheck className="size-4" />
                        <span>{sector}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
    </div>
  );
}

export default App;
