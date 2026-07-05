import SparkleIcon from "@/components/SparkleIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Chip, Image } from "@heroui/react";
import {
  HiOutlineInformationCircle,
  HiArrowUpRight,
  HiArrowDownRight,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { BipolarProgress } from "@/components/ui/bipolar-progress";
import { StocksCarousel } from "@/components/ui/stocks-carousel";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import axios from "axios";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { Skeleton } from "@/components/ui/skeleton";
import Indonesia from "@/assets/indonesia.png";
import USA from "@/assets/usa.png";
import { getAuthHeader } from "@/utils/token";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CapitalizeFirstLetter from "@/utils/string";
import StockModal from "@/components/StockModal";
import { Divider } from "@heroui/react";
import { ChartRadialText } from "@/components/ui/chart-radial-text";
import DotGrid from "@/components/DotGrid";
import { useAuth } from "@/contexts/AuthContext";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { stocksSector } from "@/utils/stocks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, Info } from "lucide-react";

const urlFetchIndonesia = generateApiOrigin("/stocks/new/ID");
const urlFetchUSA = generateApiOrigin("/stocks/new/US");
const urlFetchRunning = generateApiOrigin("/stocks/running");
const urlFetchCompleted = generateApiOrigin("/stocks/completed");
const urlFetchStatistics = generateApiOrigin("/transaction/statistics");
const urlFetchMacro = generateApiOrigin("/macro/current");
const urlFetchDistribution = generateApiOrigin(
  "/transaction/sector-distribution",
);

function getGrowthDescription(score) {
  if (score >= 50)
    return "Economic activity is accelerating. Business expansion, employment, and demand indicators point to above-trend growth.";
  if (score >= 15)
    return "Growth remains healthy. Economic indicators suggest steady expansion with supportive business conditions.";
  if (score >= -15)
    return "Growth is near trend. Economic activity shows limited acceleration or slowdown.";
  if (score >= -50)
    return "Growth momentum is weakening. Leading indicators suggest softer demand and slower economic expansion.";
  return "Economic activity is contracting. Recessionary pressures and weakening demand are becoming more evident.";
}

function getInflationDescription(score) {
  if (score >= 50)
    return "Inflation pressures are elevated. Prices, wages, and input costs continue to rise above target levels.";
  if (score >= 15)
    return "Inflation remains moderately above target but appears manageable.";
  if (score >= -15)
    return "Inflation is close to central bank targets with relatively stable price conditions.";
  if (score >= -50)
    return "Inflation pressures are easing as price growth moderates across the economy.";
  return "Disinflation or deflation risks are emerging as pricing power and demand weaken.";
}

function getLiquidityDescription(score) {
  if (score >= 50)
    return "Financial conditions are highly accommodative. Liquidity is abundant and credit availability is strong.";
  if (score >= 15)
    return "Liquidity conditions are supportive. Funding markets and credit channels remain healthy.";
  if (score >= -15)
    return "Liquidity conditions are balanced with no significant tightening or easing pressures.";
  if (score >= -50)
    return "Liquidity is becoming tighter as funding costs rise and credit conditions become more restrictive.";
  return "Liquidity conditions are restrictive. Access to capital and credit is increasingly constrained.";
}

function getRiskDescription(score) {
  if (score >= 50)
    return "Investors are actively embracing risk. Capital flows favor equities, growth assets, and cyclical sectors.";
  if (score >= 15)
    return "Risk appetite remains constructive with investors showing confidence in market conditions.";
  if (score >= -15)
    return "Market sentiment is balanced with no clear preference for risk-taking or defensiveness.";
  if (score >= -50)
    return "Risk appetite is fading as investors rotate toward defensive assets and safer sectors.";
  return "Risk aversion dominates markets. Capital flows favor cash, bonds, and defensive positioning.";
}

function Dashboard() {
  const [stocksIndonesia, setStocksIndonesia] = useState([]);
  const [stocksUSA, setStocksUSA] = useState([]);
  const [runningStocks, setRunningStocks] = useState([]);
  const [completedStocks, setCompletedStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStockForTrend, setSelectedStockForTrend] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [macroRegime, setMacroRegime] = useState(null);
  const [sectorDistributions, setSectorDistributions] = useState(null);
  const [countryDistributions, setCountryDistributions] = useState(null);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          newStocksResponseIndonesia,
          newStocksResponseUSA,
          completedStocksResponse,
          statisticsResponse,
          macroResponse,
          distributionsResponse,
        ] = await Promise.all([
          axios.get(urlFetchIndonesia, { headers: getAuthHeader() }),
          axios.get(urlFetchUSA, { headers: getAuthHeader() }),
          axios.get(urlFetchCompleted, {
            headers: getAuthHeader(),
            params: { page: 1, page_size: PAGE_SIZE },
          }),
          axios.get(urlFetchStatistics, { headers: getAuthHeader() }),
          axios.get(urlFetchMacro, { headers: getAuthHeader() }),
          axios.get(urlFetchDistribution, { headers: getAuthHeader() }),
        ]);
        if (newStocksResponseIndonesia.status === 200) {
          const { stocks } = newStocksResponseIndonesia.data;
          const sortedStocks = stocks.sort(
            (a, b) =>
              (b.institutional_score ?? 0) - (a.institutional_score ?? 0),
          );
          setStocksIndonesia(sortedStocks);
        }
        if (newStocksResponseUSA.status === 200) {
          const { stocks } = newStocksResponseUSA.data;
          const sortedStocks = stocks.sort(
            (a, b) =>
              (b.institutional_score ?? 0) - (a.institutional_score ?? 0),
          );
          setStocksUSA(sortedStocks);
        }
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
            total_return: total_return,
            avg_return_per_trade: avg_return_per_trade,
            best_trade: best_trade,
            worst_trade: worst_trade,
          });
        }
        if (macroResponse.status === 200) {
          setMacroRegime(macroResponse.data);
        }
        if (distributionsResponse.status === 200) {
          const { data } = distributionsResponse;
          setSectorDistributions(data.sectors);
          setCountryDistributions(data.countries);
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

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(urlFetchRunning, {
          headers: getAuthHeader(),
          params: { page: page, page_size: PAGE_SIZE },
        });

        const sortedStocks = data.stocks.sort(
          (a, b) => (b.institutional_score ?? 0) - (a.institutional_score ?? 0),
        );
        setRunningStocks(sortedStocks);
        setTotalPages(Math.ceil(data.total / PAGE_SIZE));
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
  }, [page]);

  return (
    <div className="bg-gray-50 select-none">
      <div className="text-center border-y-1 border-gray-200/70 px-8">
        <div className="border-x-1 border-gray-200/70 py-12 px-8">
          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
            <SparkleIcon size={12} />
            Stock Intelligence
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Here are the stocks currently covered by Nova AI analysis. Analysis
            is updated daily based on data changes and market conditions. Please
            check regularly to see the latest insights.
          </p>
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mt-12">
            <AlertTriangleIcon />
            <AlertTitle>Investment Disclaimer</AlertTitle>
            <AlertDescription>
              Nova AI provides data-driven and machine learning-based analysis
              for informational and educational purposes. The information
              displayed is not investment advice or a solicitation to buy or
              sell stocks. All investment decisions and associated risks are the
              responsibility of the user. Past performance does not guarantee
              future results.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Card className="relative">
              <WatermarkOverlay userId={user?.user_id} email={user?.email} />
              <CardContent className={"text-left"}>
                <div className="w-full bg-background flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-full font-sans p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-card border border-gray-200 rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-4 w-20 bg-gray-200 rounded-md" />
                            </div>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-12 w-12 rounded-md bg-gray-200 flex-shrink-0" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4 bg-gray-200 rounded-md" />
                                <Skeleton className="h-4 w-1/2 bg-gray-200 rounded-md" />
                                <Skeleton className="h-3 w-2/3 bg-gray-200 rounded-md" />
                              </div>
                            </div>
                            <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <StocksCarousel
                      title="Latest Insights (Indonesia Stocks)"
                      stocks={stocksIndonesia}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <Card className="relative">
              <WatermarkOverlay userId={user?.user_id} email={user?.email} />
              <CardContent className={"text-left"}>
                <div className="w-full bg-background flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-full font-sans p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-card border border-gray-200 rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-4 w-20 bg-gray-200 rounded-md" />
                            </div>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-12 w-12 rounded-md bg-gray-200 flex-shrink-0" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4 bg-gray-200 rounded-md" />
                                <Skeleton className="h-4 w-1/2 bg-gray-200 rounded-md" />
                                <Skeleton className="h-3 w-2/3 bg-gray-200 rounded-md" />
                              </div>
                            </div>
                            <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <StocksCarousel
                      title="Latest Insights (US Stocks)"
                      stocks={stocksUSA}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 mt-4 items-stretch">
            <Card className="md:rounded-r-none relative order-2 md:order-1 mt-4 md:mt-0">
              <WatermarkOverlay userId={user?.user_id} email={user?.email} />
              <CardContent className={"text-left"}>
                <div className="p-4">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-7 w-32 mb-4" />
                      <div className="space-y-2 mb-4">
                        <Skeleton className="h-4 w-full bg-gray-200 rounded-md" />
                        <Skeleton className="h-4 w-3/4 bg-gray-200 rounded-md" />
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-foreground mb-4">
                        Running Trades
                      </h2>
                      <p className="text-sm text-foreground/70 mb-4">
                        This section displays all active investment ideas
                        currently monitored by Nova AI, ranked by Institutional
                        Score.
                      </p>
                    </>
                  )}
                  <div className="flex flex-col gap-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-md bg-gray-200 flex-shrink-0" />
                                <Skeleton className="h-5 w-32 bg-gray-200 rounded-md" />
                              </div>
                              <div className="text-right space-y-1">
                                <Skeleton className="h-5 w-20 bg-gray-200 rounded-md" />
                                <Skeleton className="h-4 w-16 bg-gray-200 rounded-md" />
                              </div>
                            </div>
                            <Skeleton className="h-px w-full bg-gray-200" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {Array.from({ length: 3 }).map((_, j) => (
                                <div key={j} className="space-y-1">
                                  <Skeleton className="h-4 w-20 bg-gray-200 rounded-md" />
                                  <Skeleton className="h-3 w-24 bg-gray-200 rounded-md" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : runningStocks.length > 0 ? (
                      runningStocks.map((stock, index) => (
                        <Card key={index}>
                          <CardContent className={"text-left"}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                {index < 3 ? (
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-semibold text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                                    {index + 1}
                                  </div>
                                ) : null}
                                <img
                                  src={stock.logo}
                                  alt={`${stock.name} logo`}
                                  className="h-10 w-10 rounded-md"
                                />
                                <h3 className="font-semibold text-medium text-foreground">
                                  {stock.name.replace(".JK", "")}
                                </h3>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground text-medium">
                                  {stock.name.endsWith(".JK") ? "Rp " : "$"}
                                  {stock.close.toLocaleString()}
                                </p>
                                <span className="flex items-center gap-1">
                                  {stock.pct_gain > 0 ? (
                                    <FaCaretUp
                                      className="inline text-green-500"
                                      size={20}
                                    />
                                  ) : (
                                    <FaCaretDown
                                      className="inline text-red-500"
                                      size={20}
                                    />
                                  )}
                                  {Math.abs(stock.pct_gain).toFixed(2)}%
                                </span>
                              </div>
                            </div>
                            <Divider className="my-3" />
                            <div className="grid grid-cols-3 gap-8">
                              <div className="text-sm text-foreground">
                                <p className="font-semibold text-foreground text-medium">
                                  {stock.name.endsWith(".JK") ? "Rp " : "$"}
                                  {stock.initial_price.toLocaleString()}
                                </p>
                                <p>Entry Price</p>
                              </div>
                              <div className="text-sm text-foreground">
                                <p className="font-semibold text-foreground text-medium">
                                  {stock.name.endsWith(".JK") ? "Rp " : "$"}
                                  {(
                                    stock.initial_price +
                                    (stock.initial_price *
                                      stock.predicted_pct_change) /
                                      100
                                  ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </p>
                                <p>Estimated Target</p>
                              </div>
                              <div className="text-sm text-foreground">
                                <p className="font-semibold text-medium text-red-500">
                                  {stock.name.endsWith(".JK") ? "Rp " : "$"}
                                  {stock.stop_loss.toLocaleString()}
                                </p>
                                <p>Stop Loss</p>
                              </div>
                            </div>
                            <Divider className="my-3 mb-5" />
                            <div className="grid grid-cols-3 gap-8 items-center">
                              {stock.status ? (
                                <Chip
                                  className="bg-indigo-500/20 text-indigo-500 col-span-2"
                                  radius="sm"
                                >
                                  {stock.status}
                                </Chip>
                              ) : (
                                <>
                                  <div>
                                    <p className="text-sm text-foreground font-semibold">
                                      Prediction:{" "}
                                    </p>
                                    <span className="flex items-center gap-1">
                                      {stock.predicted_pct_change > 0 ? (
                                        <FaCaretUp
                                          className="inline text-green-500"
                                          size={20}
                                        />
                                      ) : (
                                        <FaCaretDown
                                          className="inline text-red-500"
                                          size={20}
                                        />
                                      )}
                                      {Math.abs(
                                        stock.predicted_pct_change,
                                      ).toFixed(2)}
                                      %
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-sm text-foreground font-semibold">
                                      Risk:{" "}
                                    </p>
                                    <span>
                                      {CapitalizeFirstLetter(stock.risk_level)}
                                    </span>
                                  </div>
                                </>
                              )}

                              <div className="flex gap-2">
                                <Link
                                  to={`/dashboard/transactions/${stock.id}`}
                                  className="flex-1"
                                >
                                  <Button
                                    size="lg"
                                    className="cursor-pointer w-full"
                                    variant={
                                      stock.predicted_pct_change < 0
                                        ? "destructive"
                                        : "default"
                                    }
                                  >
                                    Monitor
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="icon-lg"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    setSelectedStockForTrend(stock)
                                  }
                                >
                                  <HiOutlineInformationCircle size={20} />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-foreground/70">
                        No running trades from stocks currently being analyzed.
                      </p>
                    )}
                  </div>
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={
                            page === 1 ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              isActive={pageNum === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNum);
                              }}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) setPage(page + 1);
                          }}
                          className={
                            page === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
            <Card className="md:rounded-l-none order-1">
              <CardContent className={"text-left"}>
                <div className="p-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-7 w-40 mb-4 bg-gray-200 rounded-md" />
                      <Skeleton className="h-16 w-full bg-gray-200 rounded-lg" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24 bg-gray-200 rounded-md" />
                          <Skeleton className="h-8 w-20 bg-gray-200 rounded-md" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16 bg-gray-200 rounded-md" />
                          <Skeleton className="h-10 w-28 bg-gray-200 rounded-lg" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="p-4 border border-gray-200 rounded-lg space-y-2 bg-white"
                          >
                            <Skeleton className="h-6 w-24 bg-gray-200 rounded-md" />
                            <Skeleton className="h-2 w-full bg-gray-200 rounded-full" />
                            <Skeleton className="h-8 w-16 bg-gray-200 rounded-md" />
                            <Skeleton className="h-12 w-full bg-gray-200 rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : macroRegime ? (
                    <>
                      <h2 className="text-xl font-bold text-foreground mb-3">
                        Macro Regime Summary
                      </h2>
                      <p className="text-sm text-foreground/70 mb-4">
                        This section provides an overview of the current macro
                        regime based on the Nova AI framework. Growth,
                        inflation, liquidity, and risk indicators are combined
                        to assess the overall investment environment and market
                        positioning.
                      </p>
                      <div className="flex gap-2 mb-6">
                        <div className="flex-1">
                          <p className="mb-2">Risk On Percentage</p>
                          <p>
                            <span className="font-semibold text-foreground text-3xl">
                              {macroRegime.confidence.toFixed(0)}
                            </span>
                            /100
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="mb-3">Regime</p>
                          <Chip
                            color="primary"
                            radius="sm"
                            size="lg"
                            variant="faded"
                          >
                            {macroRegime.regime}
                          </Chip>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Card className="relative overflow-hidden">
                          <DotGrid />
                          <CardContent className="relative z-10">
                            <h3 className="text-lg font-semibold mb-2">
                              Growth
                            </h3>
                            <BipolarProgress
                              value={macroRegime.scores.growth}
                              className="h-2 mb-2"
                            />
                            <p className="text-small text-foreground mb-2">
                              <span className="font-semibold text-foreground text-3xl">
                                {macroRegime.scores.growth.toFixed(0)}
                              </span>
                              /100
                            </p>
                            <p className="text-xs text-gray-500">
                              {getGrowthDescription(macroRegime.scores.growth)}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                          <DotGrid />
                          <CardContent className="relative z-10">
                            <h3 className="text-lg font-semibold mb-2">
                              Inflation
                            </h3>
                            <BipolarProgress
                              value={macroRegime.scores.inflation}
                              className="h-2 mb-2"
                            />
                            <p className="text-small text-foreground mb-2">
                              <span className="font-semibold text-foreground text-3xl">
                                {macroRegime.scores.inflation.toFixed(0)}
                              </span>
                              /100
                            </p>
                            <p className="text-xs text-gray-500">
                              {getInflationDescription(
                                macroRegime.scores.inflation,
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                          <DotGrid />
                          <CardContent className="relative z-10">
                            <h3 className="text-lg font-semibold mb-2">
                              Liquidity
                            </h3>
                            <BipolarProgress
                              value={macroRegime.scores.liquidity}
                              className="h-2 mb-2"
                            />
                            <p className="text-small text-foreground mb-2">
                              <span className="font-semibold text-foreground text-3xl">
                                {macroRegime.scores.liquidity.toFixed(0)}
                              </span>
                              /100
                            </p>
                            <p className="text-xs text-gray-500">
                              {getLiquidityDescription(
                                macroRegime.scores.liquidity,
                              )}
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="relative overflow-hidden">
                          <DotGrid />
                          <CardContent className="relative z-10">
                            <h3 className="text-lg font-semibold mb-2">Risk</h3>
                            <BipolarProgress
                              value={macroRegime.scores.risk}
                              className="h-2 mb-2"
                            />
                            <p className="text-small text-foreground mb-2">
                              <span className="font-semibold text-foreground text-3xl">
                                {macroRegime.scores.risk.toFixed(0)}
                              </span>
                              /100
                            </p>
                            <p className="text-xs text-gray-500">
                              {getRiskDescription(macroRegime.scores.risk)}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : (
                    <h1>Macro Regime Summary</h1>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4 items-stretch">
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className={"text-left relative z-10"}>
                <div className="p-4">
                  <div className="flex gap-8">
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        {isLoading ? (
                          <Skeleton className="h-7 w-20 mb-2 bg-gray-200 rounded-md" />
                        ) : (
                          <h2 className="text-xl font-bold text-foreground">
                            Win Rate
                          </h2>
                        )}
                        {isLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-16 bg-gray-200 rounded-md" />
                          </div>
                        ) : statistics ? (
                          <p className="text-green-500 font-semibold text-xl flex items-center gap-1">
                            {statistics.winRate.toFixed(1)}%{" "}
                            {statistics.winRate >= 0 ? (
                              <HiArrowUpRight
                                className="text-green-500"
                                size={16}
                              />
                            ) : statistics.winRate < 0 ? (
                              <HiArrowDownRight
                                className="text-red-500"
                                size={16}
                              />
                            ) : null}
                          </p>
                        ) : null}
                      </div>
                      <Divider />
                      <div>
                        {isLoading ? (
                          <Skeleton className="h-7 w-28 mb-2 bg-gray-200 rounded-md" />
                        ) : (
                          <h2 className="text-xl font-bold text-fo-xltext-xlround">
                            Profit Factor
                          </h2>
                        )}
                        {isLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-16 bg-gray-200 rounded-md" />
                          </div>
                        ) : statistics ? (
                          <p className="font-semibold text-xl">
                            {statistics.profitFactor.toFixed(2)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-40">
                      {isLoading ? (
                        <div className="flex flex-col gap-4 items-center justify-center">
                          <Skeleton className="h-36 w-36 rounded-full bg-gray-200" />
                          <div className="flex justify-center gap-4">
                            <Skeleton className="h-12 w-16 rounded-lg bg-gray-200" />
                            <Skeleton className="h-12 w-16 rounded-lg bg-gray-200" />
                          </div>
                        </div>
                      ) : statistics ? (
                        <>
                          <div className="w-40 h-40 flex-shrink-0">
                            <ChartRadialText
                              winRate={statistics.winRate}
                              totalTrades={statistics.totalTrades}
                            />
                          </div>
                          <div className="flex justify-between">
                            <div className="text-center">
                              <p className="font-semibold text-lg text-green-500">
                                {statistics.winningTrades}
                              </p>
                              <p>Wins</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-lg text-red-500">
                                {statistics.losingTrades}
                              </p>
                              <p>Losses</p>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={`w-full border-t border-dashed border-default-300 my-4`}
                  />
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                          <Skeleton className="h-6 w-28 mb-2 bg-gray-200 rounded-md" />
                          <Skeleton className="h-7 w-24 bg-gray-200 rounded-md" />
                        </div>
                      ))}
                    </div>
                  ) : statistics ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h2 className="text-medium font-semibold text-foreground">
                          Total Return
                        </h2>
                        <p
                          className={`font-semibold text-medium flex items-center gap-1 ${statistics.total_return >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {statistics.total_return.toFixed(2)}%{" "}
                          {statistics.total_return >= 0 ? (
                            <HiArrowUpRight
                              className="text-green-500"
                              size={12}
                            />
                          ) : statistics.total_return < 0 ? (
                            <HiArrowDownRight
                              className="text-red-500"
                              size={12}
                            />
                          ) : null}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-medium font-bold text-foreground">
                          Avg Return/Trade
                        </h2>
                        <p
                          className={`font-semibold text-medium flex items-center gap-1 ${statistics.avg_return_per_trade >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {statistics.avg_return_per_trade.toFixed(2)}%{" "}
                          {statistics.avg_return_per_trade >= 0 ? (
                            <HiArrowUpRight
                              className="text-green-500"
                              size={12}
                            />
                          ) : statistics.avg_return_per_trade < 0 ? (
                            <HiArrowDownRight
                              className="text-red-500"
                              size={12}
                            />
                          ) : null}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-medium font-bold text-foreground">
                          Best Trade
                        </h2>
                        <p className="text-green-500 font-semibold text-medium flex items-center gap-1">
                          {statistics.best_trade}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-medium font-bold text-foreground">
                          Worst Trade
                        </h2>
                        <p className="text-red-500 font-semibold text-medium flex items-center gap-1">
                          {statistics.worst_trade
                            ? statistics.worst_trade
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className={"text-left"}>
                <div className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-7 w-40 bg-gray-200 rounded-md" />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Sector Distribution
                    </h2>
                  )}
                  <div className="flex flex-col gap-4 mt-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-2 w-full rounded-full bg-gray-200" />
                        <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-3 w-3 rounded-sm bg-gray-200 flex-shrink-0" />
                                <Skeleton className="h-4 w-24 bg-gray-200 rounded-md" />
                              </div>
                              <Skeleton className="h-4 w-8 bg-gray-200 rounded-md" />
                            </div>
                          ))}
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
                          {Array.from({ length: 2 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-6 bg-gray-200 rounded-md flex-shrink-0" />
                                <Skeleton className="h-4 w-24 bg-gray-200 rounded-md" />
                              </div>
                              <Skeleton className="h-4 w-8 bg-gray-200 rounded-md" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      (() => {
                        const SECTOR_COLORS = [
                          "#22c55e",
                          "#6366f1",
                          "#a855f7",
                          "#ef4444",
                          "#f59e0b",
                          "#14b8a6",
                          "#3b82f6",
                          "#f97316",
                        ];

                        const sectors = sectorDistributions || [];
                        const totalSectorCount = sectors.reduce(
                          (sum, item) => sum + item.count,
                          0,
                        );

                        if (sectors.length === 0) {
                          return (
                            <p className="text-sm text-foreground/70">
                              No active positions at this time.
                            </p>
                          );
                        }

                        return (
                          <>
                            <div className="flex w-full h-2 rounded-full overflow-hidden mb-5 gap-0.5">
                              {sectors.map((item, i) => {
                                const pct =
                                  totalSectorCount > 0
                                    ? (item.count / totalSectorCount) * 100
                                    : 0;
                                return (
                                  <div
                                    key={item.sector}
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor:
                                        SECTOR_COLORS[i % SECTOR_COLORS.length],
                                    }}
                                    className="h-full rounded-sm"
                                    title={`${item.sector}: ${pct.toFixed(1)}%`}
                                  />
                                );
                              })}
                            </div>

                            <Card>
                              <CardContent className="flex flex-col gap-3">
                                {sectors.map((item, i) => {
                                  const pct =
                                    totalSectorCount > 0
                                      ? (item.count / totalSectorCount) * 100
                                      : 0;
                                  return (
                                    <div
                                      key={item.sector}
                                      className="flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span
                                          className="w-3 h-3 rounded-sm flex-shrink-0"
                                          style={{
                                            backgroundColor:
                                              SECTOR_COLORS[
                                                i % SECTOR_COLORS.length
                                              ],
                                          }}
                                        />
                                        <div>
                                          <p className="text-sm font-semibold text-foreground">
                                            {stocksSector[item.sector]}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-foreground">
                                        {pct.toFixed(0)}%
                                      </p>
                                    </div>
                                  );
                                })}
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="flex flex-col gap-3">
                                {(() => {
                                  const countries = countryDistributions || [];
                                  const totalCountryCount = countries.reduce(
                                    (sum, item) => sum + item.count,
                                    0,
                                  );

                                  const countryMap = {
                                    Indonesia: {
                                      image: Indonesia,
                                      color: "#ef4444",
                                    },
                                    US: { image: USA, color: "#3b82f6" },
                                  };

                                  return countries.map((item) => {
                                    const pct =
                                      totalCountryCount > 0
                                        ? (item.count / totalCountryCount) * 100
                                        : 0;
                                    const countryConfig =
                                      countryMap[item.country];

                                    return (
                                      <div
                                        key={item.country}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          {countryConfig ? (
                                            <Image
                                              src={countryConfig.image}
                                              alt={item.country}
                                              className="h-6 w-6"
                                            />
                                          ) : null}
                                          <div>
                                            <p className="text-sm font-semibold text-foreground">
                                              {item.country === "Indonesia"
                                                ? "Indonesia"
                                                : item.country === "US"
                                                  ? "United States"
                                                  : item.country}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-sm text-foreground">
                                          {pct.toFixed(0)}%
                                        </p>
                                      </div>
                                    );
                                  });
                                })()}
                              </CardContent>
                            </Card>
                          </>
                        );
                      })()
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className={"text-left"}>
                <div className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-7 w-40 bg-gray-200 rounded-md" />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Trade History
                    </h2>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-24">Stock</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Exit Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="flex gap-2 items-center">
                              <Skeleton className="h-8 w-8 rounded-md flex-shrink-0 bg-gray-200" />
                              <Skeleton className="h-4 w-3/4 flex-1 bg-gray-200 rounded-md" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32 bg-gray-200 rounded-md" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16 bg-gray-200 rounded-md" />
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
                            <TableCell
                              className={`${stock.pct_gain >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {stock.pct_gain.toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              {
                                new Date(stock.end_date)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            No completed trades at this time.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <StockModal
        selectedStockForTrend={selectedStockForTrend}
        setSelectedStockForTrend={setSelectedStockForTrend}
      />
    </div>
  );
}

export default Dashboard;
