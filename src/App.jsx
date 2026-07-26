import { useEffect, useState } from "react";
import GradientMesh from "@/assets/gradient-mesh.jpg";
import Gradient from "@/assets/gradient.jpg";
import { CardSpotlight } from "@/components/ui/card-spotlight";
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
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EtherealBeamsHero from "@/components/ui/ethereal-beams-hero";
import Dashboard from "@/assets/dashboard.png";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { proceedToWhatsapp } from "@/utils/proceedToWhatsapp";
import { Sparkles } from "@/components/ui/sparkles";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, RotateCw } from "lucide-react";
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
import { getAuthHeader } from "@/utils/token";
import DotGrid from "@/components/DotGrid";
import { Badge } from "@/components/ui/badge";
import { Gallery6 } from "@/components/blocks/gallery6";
import Macro from "@/assets/macro.png";
import CapitalFlow from "@/assets/capital-flow.png";
import Sectors from "@/assets/sectors.png";
import Risk from "@/assets/risk.png";
import PositionSizing from "@/assets/position-sizing.png";
import ScenarioAnalysis from "@/assets/scenario-analysis.png";

const demoData = {
  heading: "Featured Projects",
  demoUrl: "https://www.shadcnblocks.com",
  items: [
    {
      id: "item-1",
      title: "Macro Intelligence",
      summary:
        "Understand the current market environment through macroeconomic trends, inflation, interest rates, liquidity, and market regime analysis before making investment decisions.",
      image: Macro,
    },
    {
      id: "item-2",
      title: "Capital Flow Analysis",
      summary:
        "Track where institutional capital is moving across sectors, asset classes, and investment themes to uncover emerging opportunities ahead of the broader market.",
      image: CapitalFlow,
    },
    {
      id: "item-3",
      title: "Sector & Theme Rotation",
      summary:
        "Discover sectors and long-term investment themes gaining institutional attention, helping you focus on where capital is flowing—not where it has already gone.",
      image: Sectors,
    },
    {
      id: "item-4",
      title: "Institutional & Risk Analysis",
      summary:
        "Evaluate every investment using institutional conviction and a multi-dimensional risk framework covering liquidity, volatility, trend strength, and momentum.",
      image: Risk,
    },
    {
      id: "item-5",
      title: "Smart Position Sizing",
      summary:
        "Determine the appropriate position size based on your risk profile, portfolio allocation, and the current market environment to improve risk-adjusted returns.",
      image: PositionSizing,
    },
    {
      id: "item-6",
      title: "Scenario Analysis",
      summary:
        "Prepare for multiple market outcomes with AI-generated Bull, Base, and Bear scenarios, allowing you to understand potential opportunities and risks before entering a position.",
      image: ScenarioAnalysis,
    },
  ],
};

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
      "Ranks every sector and identifies the top 6 stocks within each sector based on momentum, valuation, quality, liquidity, earnings strength, and alignment with the current macro regime.",
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
  "Energy",
  "Consumer Staples",
  "Utilities",
  "Materials",
  "Copper",
  "Gold",
  "Communication Services",
];

const urlFetch = generateApiOrigin("/midtrans/create-token");

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
  const { user, setUser } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
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

        {/* What you'll get */}
        <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              What You'll Get
            </div>
            <BlurFade delay={0.15} inView>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Everything you need to
              </h2>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-cyan-400">invest with confidence</span>
              </h2>
            </BlurFade>
            <p className="text-sm text-gray-400 max-w-lg mx-auto">
              Nova AI combines institutional research, macroeconomic analysis,
              capital flow intelligence, and AI-powered market insights into a
              single platform—helping you understand market conditions, identify
              high-quality opportunities, and manage risk with greater
              confidence.
            </p>
            <Gallery6 {...demoData} />
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
            {/* Desktop: horizontal timeline */}
            <div className="relative mt-12 hidden md:block">
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

            {/* Mobile: vertical timeline */}
            <div className="relative mt-12 flex flex-col gap-0 md:hidden max-w-sm mx-auto w-full">
              {/* Vertical line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative pl-10 pb-8 last:pb-0 text-left"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  {/* Dot on the vertical line */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`absolute left-0 top-1 h-4 w-4 rounded-full flex items-center justify-center ${
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
                  "Indonesia Gold",
                  "Indonesia Coal Export",
                  "Nickel Export",
                  "Indonesia Customer",
                  "Indonesia Digitalization",
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
                  "Gold Safe Heaven",
                  "Reinsdustrialization",
                  "Energy Security",
                  "Power Grid",
                  "Defense",
                  "Data Center",
                  "Nuclear",
                  "Copper Supercycle",
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
    </div>
  );
}

export default App;
