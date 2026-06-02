import SparkleIcon from "@/components/SparkleIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Chip } from "@heroui/react";
import {
  HiOutlineInformationCircle,
  HiArrowUpRight,
  HiArrowDownRight,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { StocksCarousel } from "@/components/ui/stocks-carousel";
import { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import axios from "axios";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthHeader } from "@/utils/token";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CapitalizeFirstLetter from "@/utils/string";
import StockModal from "@/components/StockModal";
import { Divider } from "@heroui/react";
import { ChartRadialText } from "@/components/ui/chart-radial-text";
import DotGrid from "@/components/DotGrid";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, Info } from "lucide-react";

const urlFetch = generateApiOrigin("/stocks/new");
const urlFetchRunning = generateApiOrigin("/stocks/running");
const urlFetchCompleted = generateApiOrigin("/stocks/completed");
const urlFetchStatistics = generateApiOrigin("/transaction/statistics");

const EQUITY = 100000000;

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [runningStocks, setRunningStocks] = useState([]);
  const [completedStocks, setCompletedStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStockForTrend, setSelectedStockForTrend] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [
          newStocksResponse,
          runningStocksResponse,
          completedStocksResponse,
          statisticsResponse,
        ] = await Promise.all([
          axios.get(urlFetch, { headers: getAuthHeader() }),
          axios.get(urlFetchRunning, { headers: getAuthHeader() }),
          axios.get(urlFetchCompleted, {
            headers: getAuthHeader(),
            params: { page: 1, page_size: 5 },
          }),
          axios.get(urlFetchStatistics, { headers: getAuthHeader() }),
        ]);
        if (newStocksResponse.status === 200) {
          const { stocks } = newStocksResponse.data;
          setStocks(stocks);
        }
        if (runningStocksResponse.status === 200) {
          const { stocks } = runningStocksResponse.data;
          setRunningStocks(stocks);
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
          } = statisticsResponse.data;
          setStatistics({
            winRate: winrate,
            totalTrades: total_trades,
            winningTrades: winning_trades,
            losingTrades: losing_trades,
            profitFactor: profit_factor,
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
    <div className="bg-gray-50">
      <div className="text-center border-y-1 border-gray-200/70 px-8">
        <div className="border-x-1 border-gray-200/70 py-12 px-8">
          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
            <SparkleIcon size={12} />
            Stock Intelligence
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-1">Dashboard</h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Berikut adalah saham yang saat ini berada dalam cakupan analisis
            Nova AI. Analisis diperbarui setiap hari berdasarkan perubahan data
            dan kondisi pasar. Silakan cek secara berkala untuk melihat insight
            terbaru.
          </p>
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mt-12">
            <AlertTriangleIcon />
            <AlertTitle>Disclaimer Investasi</AlertTitle>
            <AlertDescription>
              Nova AI menyediakan analisis berbasis data dan machine learning
              untuk tujuan informasi dan edukasi. Informasi yang ditampilkan
              bukan merupakan rekomendasi investasi atau ajakan membeli maupun
              menjual saham. Seluruh keputusan investasi dan risiko yang timbul
              menjadi tanggung jawab pengguna. Kinerja historis tidak menjamin
              hasil di masa mendatang.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Card>
              <CardContent className={"text-left"}>
                <div className="w-full bg-background flex items-center justify-center">
                  {isLoading ? (
                    <div className="w-full font-sans p-4">
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
                    <StocksCarousel title="Insight Terbaru" stocks={stocks} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 mt-4 items-stretch">
            <Card className="rounded-r-none">
              <CardContent className={"text-left"}>
                <div className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-7 w-32 mb-4" />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Saham Yang Sedang Dipantau
                    </h2>
                  )}
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
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
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
                                  Rp {stock.close.toLocaleString()}
                                </p>
                                <span className="flex items-center gap-1">
                                  {stock.actual_pct_change > 0 ? (
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
                                  {Math.abs(stock.actual_pct_change).toFixed(2)}
                                  %
                                </span>
                              </div>
                            </div>
                            <Divider className="my-3" />
                            <div className="grid grid-cols-3 gap-8">
                              <div className="text-sm text-foreground">
                                <p className="font-semibold text-foreground text-medium">
                                  Rp {stock.initial_price.toLocaleString()}
                                </p>
                                <p>Harga Masuk</p>
                              </div>
                              <div className="text-sm text-foreground">
                                <p className="font-semibold text-foreground text-medium">
                                  Rp{" "}
                                  {Math.floor(
                                    stock.initial_price +
                                      (stock.initial_price *
                                        stock.predicted_pct_change) /
                                        100,
                                  ).toLocaleString()}
                                </p>
                                <p>Estimasi Target</p>
                              </div>
                              <div className="text-sm text-foreground">
                                <p className="font-semibold text-medium text-red-500">
                                  Rp{" "}
                                  {stock.trailing_stop
                                    ? Math.floor(
                                        stock.trailing_stop,
                                      ).toLocaleString()
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
                                      Prediksi:{" "}
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
                                      Risiko:{" "}
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
                                    Pantau
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
                  {isLoading ? (
                    <Skeleton className="h-7 w-28 mb-4" />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Portfolio
                    </h2>
                  )}
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
                    ) : (
                      <p className="text-sm text-foreground/70">
                        Fitur portfolio saat ini masih dalam pengembangan.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 items-stretch">
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className={"text-left relative z-10"}>
                <div className="p-4 flex gap-8">
                  <div className="flex-1 flex flex-col gap-4">
                    <div>
                      {isLoading ? (
                        <Skeleton className="h-7 w-20 mb-2" />
                      ) : (
                        <h2 className="text-xl font-bold text-foreground">
                          Win Rate
                        </h2>
                      )}
                      {isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-16" />
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
                        <Skeleton className="h-7 w-28 mb-2" />
                      ) : (
                        <h2 className="text-xl font-bold text-fo-xltext-xlround">
                          Profit Factor
                        </h2>
                      )}
                      {isLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-16" />
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
                      <div className="flex flex-col gap-4">
                        <Skeleton className="h-36 w-36 rounded-full" />
                        <div className="flex justify-between">
                          <Skeleton className="h-12 w-16 rounded-lg" />
                          <Skeleton className="h-12 w-16 rounded-lg" />
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
              </CardContent>
            </Card>
            <Card>
              <CardContent className={"text-left"}>
                <div className="p-4">
                  {isLoading ? (
                    <Skeleton className="h-7 w-40" />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Distribusi Sektor
                    </h2>
                  )}
                  <div className="flex flex-col gap-4 mt-4">
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
                    ) : (
                      (() => {
                        const sectorMap = {};
                        let totalEquity = 0;

                        runningStocks.forEach((stock) => {
                          const sector = stocksSector[stock.name] ?? "Lainnya";
                          const equity = EQUITY;
                          sectorMap[sector] = (sectorMap[sector] ?? 0) + equity;
                          totalEquity += equity;
                        });

                        const sectors = Object.entries(sectorMap).sort(
                          (a, b) => b[1] - a[1],
                        );

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

                        if (sectors.length === 0) {
                          return (
                            <p className="text-sm text-foreground/70">
                              Tidak ada posisi yang sedang berjalan saat ini.
                            </p>
                          );
                        }

                        return (
                          <>
                            <div className="flex w-full h-2 rounded-full overflow-hidden mb-5 gap-0.5">
                              {sectors.map(([sector, value], i) => {
                                const pct =
                                  totalEquity > 0
                                    ? (value / totalEquity) * 100
                                    : 0;
                                return (
                                  <div
                                    key={sector}
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor:
                                        SECTOR_COLORS[i % SECTOR_COLORS.length],
                                    }}
                                    className="h-full rounded-sm"
                                    title={`${sector}: ${pct.toFixed(1)}%`}
                                  />
                                );
                              })}
                            </div>

                            <Card>
                              <CardContent className="flex flex-col gap-3">
                                {sectors.map(([sector, value], i) => {
                                  const pct =
                                    totalEquity > 0
                                      ? (value / totalEquity) * 100
                                      : 0;
                                  return (
                                    <div
                                      key={sector}
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
                                            {sector}
                                          </p>
                                          <p className="text-xs text-foreground/60">
                                            {pct.toFixed(0)}%
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-foreground">
                                        Rp {value.toLocaleString("id-ID")}
                                      </p>
                                    </div>
                                  );
                                })}
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
                    <Skeleton className="h-7 w-40" />
                  ) : (
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Riwayat Analisis
                    </h2>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-24">Saham</TableHead>
                        <TableHead>Keuntungan</TableHead>
                        <TableHead>Tanggal Keluar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="flex gap-2 items-center">
                              <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                              <Skeleton className="h-4 w-3/4 flex-1" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
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
                              Rp{" "}
                              {(
                                (stock.pct_gain * EQUITY) /
                                100
                              ).toLocaleString()}
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
                            Tidak ada trade yang sudah selesai saat ini.
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
