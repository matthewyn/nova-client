import SparkleIcon from "@/components/SparkleIcon";
import { Card, CardContent } from "@/components/ui/card";
import {
  HiFire,
  HiBolt,
  HiGift,
  HiChatBubbleOvalLeftEllipsis,
  HiChartPie,
  HiExclamationCircle,
  HiChartBar,
  HiMiniStar,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { StocksCarousel } from "@/components/ui/stocks-carousel";
import { useEffect, useState } from "react";
import { HiArrowUpCircle, HiArrowDownCircle } from "react-icons/hi2";
import axios from "axios";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthHeader } from "@/utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { exampleStocks } from "@/utils/stocksTemplate";
import StockButton from "@/components/StockButton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CapitalizeFirstLetter from "@/utils/string";
import CustomChip from "@/components/CustomChip";
import StockModal from "@/components/StockModal";

const VolatilityIcon = ({ riskFactor }) => {
  const barCount = riskFactor === "high" ? 3 : riskFactor === "medium" ? 2 : 1;
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-end gap-0.5 h-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-1 rounded-full",
                i === 0 ? "h-2" : i === 1 ? "h-3" : "h-4",
                i < barCount ? "bg-foreground/80" : "bg-muted",
              )}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Risiko: {CapitalizeFirstLetter(riskFactor)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const urlFetch = generateApiOrigin("/stocks/new");
const urlFetchRunning = generateApiOrigin("/stocks/running");
const urlFetchPositions = generateApiOrigin("/transaction/open");

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [runningStocks, setRunningStocks] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockForTrend, setSelectedStockForTrend] = useState(null);
  const [investmentValue, setInvestmentValue] = useState("");
  const navigate = useNavigate();

  const fetchPositions = async () => {
    try {
      const positionsResponse = await axios.get(urlFetchPositions, {
        headers: getAuthHeader(),
      });
      if (positionsResponse.status === 200) {
        const { transactions } = positionsResponse.data;
        setPositions(transactions);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [newStocksResponse, runningStocksResponse, positionsResponse] =
          await Promise.all([
            axios.get(urlFetch, { headers: getAuthHeader() }),
            axios.get(urlFetchRunning, { headers: getAuthHeader() }),
            axios.get(urlFetchPositions, { headers: getAuthHeader() }),
          ]);
        if (newStocksResponse.status === 200) {
          const { stocks } = newStocksResponse.data;
          setStocks(stocks);
        }
        if (runningStocksResponse.status === 200) {
          const { stocks } = runningStocksResponse.data;
          setRunningStocks(stocks);
        }
        if (positionsResponse.status === 200) {
          const { transactions } = positionsResponse.data;
          setPositions(transactions);
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

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);

      if (!investmentValue) {
        toast("Nilai investasi harus diisi.", {
          type: "error",
          position: "top-center",
        });
        return;
      }

      const result = await axios.post(
        urlFetch,
        {
          stock_id: selectedStock.id,
          name: selectedStock.name,
          buy_date: new Date().toISOString(),
          sell_date: null,
          buy_price: selectedStock.initial_price,
          sell_price: null,
          equity: Number(investmentValue),
        },
        {
          headers: getAuthHeader(),
        },
      );

      if (result.status === 201) {
        toast("Sukses membeli saham! Transaksi Anda telah tercatat.", {
          type: "success",
          position: "top-center",
        });
        setSelectedStock(null);
        if (onBuySuccess) {
          onBuySuccess();
        }
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 400) {
          toast(
            "Input tidak valid. Silakan periksa kembali informasi yang dimasukkan.",
            {
              type: "error",
              position: "top-center",
            },
          );
        }

        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="text-center border-y-1 border-gray-200/70 px-8">
        <div className="border-x-1 border-gray-200/70 py-12 px-8">
          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
            <SparkleIcon size={12} />
            Stockpick AI
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Berikut adalah beberapa saham yang sudah dianalisis oleh Stockpick
            AI. Klik untuk melihat detail analisis dan insight yang diberikan
            oleh AI kami.
          </p>
          <div className="mt-12">
            <Card>
              <CardContent className={"text-left"}>
                <div className="w-full bg-background flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-full font-sans p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-foreground">
                          Pilihan Saham Baru
                        </h2>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-shrink-0 w-72 bg-card border rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-12 w-12 rounded-md" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-2/3" />
                              </div>
                            </div>
                            <Skeleton className="h-10 w-full rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <StocksCarousel
                      title="Pilihan Saham Baru"
                      stocks={stocks}
                      onBuySuccess={fetchPositions}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 mt-4 items-stretch">
            <Card className="rounded-r-none">
              <CardContent className={"text-left"}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      Running Trade
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-md" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-3 w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : runningStocks.length > 0 ? (
                      runningStocks.map((stock, index) => (
                        <Card key={index}>
                          <CardContent className={"text-left"}>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-foreground/70">
                                {
                                  new Date(stock.start_date)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </span>
                              <VolatilityIcon riskFactor={stock.risk_level} />
                            </div>
                            <div className="flex gap-3 items-center">
                              <img
                                src={stock.logo}
                                alt={`${stock.name} logo`}
                                className="h-12 w-12 rounded-md"
                              />
                              <div className="flex-1 flex justify-between">
                                <div>
                                  <h3 className="font-semibold text-medium text-foreground">
                                    {stock.name.replace(".JK", "")}
                                  </h3>
                                  <div className="grid grid-cols-3 gap-8">
                                    <div className="text-sm text-foreground">
                                      <p className="font-semibold text-foreground text-medium">
                                        Rp{" "}
                                        {stock.initial_price.toLocaleString()}
                                      </p>
                                      <p>Harga Masuk</p>
                                    </div>
                                    <div className="text-sm text-foreground">
                                      <p className="font-semibold text-foreground text-medium">
                                        Rp {stock.close.toLocaleString()}
                                      </p>
                                      <p>Harga Saat Ini</p>
                                    </div>
                                    <div className="text-sm text-foreground">
                                      <p className="font-semibold text-medium text-red-500">
                                        Rp{" "}
                                        {stock.trailing_stop
                                          ? stock.trailing_stop.toLocaleString()
                                          : Math.floor(
                                              stock.stop_loss,
                                            ).toLocaleString()}
                                      </p>
                                      <p>
                                        {stock.trailing_stop
                                          ? "Trailing Stop"
                                          : "Stop Loss"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p className="flex items-center gap-2 text-sm text-foreground">
                                    Prediksi:{" "}
                                    <span className="flex items-center gap-1">
                                      {stock.predicted_pct_change > 0 ? (
                                        <HiArrowUpCircle
                                          className="inline text-green-500"
                                          size={20}
                                        />
                                      ) : (
                                        <HiArrowDownCircle
                                          className="inline text-red-500"
                                          size={20}
                                        />
                                      )}
                                      {Math.abs(stock.predicted_pct_change)}%
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-2 text-sm text-foreground">
                                    Sekarang:{" "}
                                    <span className="flex items-center gap-1">
                                      {stock.actual_pct_change > 0 ? (
                                        <HiArrowUpCircle
                                          className="inline text-green-500"
                                          size={20}
                                        />
                                      ) : (
                                        <HiArrowDownCircle
                                          className="inline text-red-500"
                                          size={20}
                                        />
                                      )}
                                      {Math.abs(stock.actual_pct_change)}%
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {!positions.some(
                              (pos) => pos.stock_id === stock.id,
                            ) && (
                              <StockButton
                                stock={stock}
                                setSelectedStock={() => setSelectedStock(stock)}
                                setSelectedStockForTrend={() =>
                                  setSelectedStockForTrend(stock)
                                }
                              />
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-foreground/70">
                        Tidak ada running trade dari saham-saham yang sedang
                        dianalisis saat ini.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-l-none">
              <CardContent className={"text-left"}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      Portfolio
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-md" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-3 w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : positions.length > 0 ? (
                      positions.map((stock, index) => (
                        <Card key={index}>
                          <CardContent className={"text-left"}>
                            <div className="flex gap-3 items-center">
                              <img
                                src={stock.logo}
                                alt={`${stock.name} logo`}
                                className="h-12 w-12 rounded-md"
                              />
                              <div className="flex-1 flex justify-between">
                                <div>
                                  <h3 className="font-semibold text-medium text-foreground">
                                    {stock.name.replace(".JK", "")}
                                  </h3>
                                  <p className="text-sm text-foreground">
                                    Harga Masuk: Rp{" "}
                                    {stock.buy_price.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-foreground/70">
                                    Tanggal Masuk:{" "}
                                    {
                                      new Date(stock.buy_date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-foreground/70">
                        Tidak ada posisi yang kamu pegang saat ini.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <StockModal
        investmentValue={investmentValue}
        setInvestmentValue={setInvestmentValue}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        selectedStockForTrend={selectedStockForTrend}
        setSelectedStockForTrend={setSelectedStockForTrend}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default Dashboard;
