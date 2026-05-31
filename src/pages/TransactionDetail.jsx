import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import StockPriceChart from "@/components/StockPriceChart";
import { HiArrowUpRight } from "react-icons/hi2";
import { PremiumContentGate } from "@/components/PremiumContentGate";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, Info, TrendingUp } from "lucide-react";
import ScenarioAnalysis from "@/components/ScenarioAnalysis";
import DotGrid from "@/components/DotGrid";

const EQUITY = 100000000;

function TransactionDetail() {
  const [transaction, setTransaction] = useState(null);
  const { user, setUser } = useAuth();
  const [equities, setEquities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const description = [
    "Bandingkan proyeksi harga pada tiga skenario berbeda,",
    "bull, base, dan bear, lengkap dengan alasan di balik setiap skenario,",
    "Pahami potensi keuntungan dan risikomu secara menyeluruh.",
  ];

  const bullPrice = transaction?.scenario_analysis?.bull_case?.target_price;
  const basePrice = transaction?.scenario_analysis?.base_case?.target_price;
  const bearPrice = transaction?.scenario_analysis?.bear_case?.target_price;

  const pctReturn =
    transaction && equities.length > 0
      ? (equities[equities.length - 1].equity - EQUITY) / EQUITY
      : 0;

  const scenarioAnalysis = transaction?.scenario_analysis;

  const orderedScenarios = scenarioAnalysis
    ? (() => {
        const scenarios = [
          {
            key: "bull_case",
            label: "Bull Case",
            ...scenarioAnalysis.bull_case,
          },
          {
            key: "base_case",
            label: "Base Case",
            ...scenarioAnalysis.base_case,
          },
          {
            key: "bear_case",
            label: "Bear Case",
            ...scenarioAnalysis.bear_case,
          },
        ];

        const sorted = [...scenarios].sort(
          (a, b) => a.probability - b.probability,
        );

        return [sorted[0], sorted[2], sorted[1]];
      })()
    : [];

  async function fetchData() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        generateApiOrigin(`/transaction/${id}`),
        {
          headers: getAuthHeader(),
        },
      );

      setTransaction(data.transaction);
      setEquities(data.equities);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="bg-gray-50">
      <div className="border-y-1 border-gray-200/70 px-8">
        <div className="border-x-1 border-gray-200/70 py-12 px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            Detail Transaksi
          </h1>
          <Card className="mt-8">
            <CardContent className={"text-left"}>
              <div>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-52 w-full" />
                  </div>
                ) : transaction ? (
                  <div className="w-full p-4">
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-1">
                      Nilai Investasi
                      <HiArrowUpRight size={12} />
                    </h2>
                    <div className="flex items-end gap-1">
                      <p className="font-medium text-foreground text-3xl">
                        Rp{" "}
                        {equities[equities.length - 1].equity.toLocaleString()}
                      </p>
                      <span className="flex items-center gap-1 mb-1">
                        <TrendingUp
                          size={16}
                          className={`${
                            equities[equities.length - 1].equity >= EQUITY
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                        <span
                          className={`text-xs text-foreground ${
                            equities[equities.length - 1].equity >= EQUITY
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {(pctReturn * 100).toFixed(2)}%
                        </span>
                      </span>
                    </div>
                    <StockPriceChart chartData={equities} />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className={"text-left"}>
              <div className="p-4">
                {user ? (
                  <PremiumContentGate
                    userTier={user.tier}
                    previewContent={
                      <ScenarioAnalysis
                        description={description}
                        orderedScenarios={orderedScenarios}
                        transaction={transaction}
                        bullPrice={bullPrice}
                        basePrice={basePrice}
                        bearPrice={bearPrice}
                        isLoading={isLoading}
                      />
                    }
                  >
                    <ScenarioAnalysis
                      description={description}
                      orderedScenarios={orderedScenarios}
                      transaction={transaction}
                      bullPrice={bullPrice}
                      basePrice={basePrice}
                      bearPrice={bearPrice}
                      isLoading={isLoading}
                    />
                  </PremiumContentGate>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <Skeleton className="h-6 w-24 mb-3" />
                          <Skeleton className="h-8 w-full mb-2" />
                          <Skeleton className="h-4 w-32 mb-4" />
                          <Skeleton className="h-10 w-full mb-3" />
                          <Skeleton className="h-4 w-20" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardContent className={"text-left"}>
              <div className="p-4">
                {user ? (
                  <PremiumContentGate
                    userTier={user.tier}
                    previewContent={
                      <>
                        <h2 className="text-xl font-bold text-foreground mb-4">
                          Risk Breakdown
                        </h2>
                        {isLoading ? (
                          <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <Card key={i}>
                                <CardContent className="p-4">
                                  <Skeleton className="h-6 w-32 mb-3" />
                                  <Skeleton className="h-2 w-full mb-3" />
                                  <Skeleton className="h-4 w-20" />
                                </CardContent>
                              </Card>
                            ))}
                            <div className="col-span-3">
                              <Skeleton className="h-24 w-full" />
                            </div>
                          </div>
                        ) : transaction ? (
                          <div className="grid grid-cols-3 gap-4">
                            <Card className="relative overflow-hidden">
                              <DotGrid />
                              <CardContent className="p-4 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">
                                  Resiko Keseluruhan
                                </h3>
                                <Progress
                                  value={
                                    transaction.risk_breakdown?.overall || 0
                                  }
                                  className="h-2 mb-2"
                                />
                                <p className="text-small text-foreground mb-2">
                                  Sebesar{" "}
                                  {transaction.risk_breakdown?.overall || 0}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  Gambaran umum tingkat risiko berdasarkan
                                  kombinasi volatilitas, momentum, tren, berita,
                                  dan likuiditas saham.
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="relative overflow-hidden">
                              <DotGrid />
                              <CardContent className="p-4 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">
                                  Risiko Volatilitas
                                </h3>
                                <Progress
                                  value={
                                    transaction.risk_breakdown?.volatility || 0
                                  }
                                  className="h-2 mb-2"
                                />
                                <p className="text-small text-foreground mb-2">
                                  Sebesar{" "}
                                  {transaction.risk_breakdown?.volatility || 0}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  Mengukur seberapa besar harga berpotensi
                                  bergerak naik atau turun dalam waktu singkat.
                                  Semakin tinggi nilainya, semakin besar
                                  fluktuasi harga yang mungkin terjadi.
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="relative overflow-hidden">
                              <DotGrid />
                              <CardContent className="p-4 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">
                                  Resiko Momentum
                                </h3>
                                <Progress
                                  value={
                                    transaction.risk_breakdown?.momentum || 0
                                  }
                                  className="h-2 mb-2"
                                />
                                <p className="text-small text-foreground mb-2">
                                  Sebesar{" "}
                                  {transaction.risk_breakdown?.momentum || 0}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  Menunjukkan apakah pergerakan harga saat ini
                                  mulai kehilangan tenaga atau masih didukung
                                  oleh kekuatan beli dan jual yang sehat.
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="relative overflow-hidden">
                              <DotGrid />
                              <CardContent className="p-4 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">
                                  Resiko Trend
                                </h3>
                                <Progress
                                  value={transaction.risk_breakdown?.trend || 0}
                                  className="h-2 mb-2"
                                />
                                <p className="text-small text-foreground mb-2">
                                  Sebesar{" "}
                                  {transaction.risk_breakdown?.trend || 0}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  Mengukur kekuatan tren utama saham. Risiko
                                  meningkat ketika harga mulai menunjukkan
                                  tanda-tanda pelemahan terhadap arah tren yang
                                  sedang berlangsung.
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="relative overflow-hidden">
                              <DotGrid />
                              <CardContent className="p-4 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">
                                  Resiko Berita
                                </h3>
                                <Progress
                                  value={transaction.risk_breakdown?.news || 0}
                                  className="h-2 mb-2"
                                />
                                <p className="text-small text-foreground mb-2">
                                  Sebesar{" "}
                                  {transaction.risk_breakdown?.news || 0}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  Menilai tingkat ketidakpastian yang berasal
                                  dari berita, aksi korporasi, perubahan
                                  regulasi, atau peristiwa lain yang dapat
                                  memengaruhi harga saham.
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="relative overflow-hidden">
                              <DotGrid />
                              <CardContent className="p-4 relative z-10">
                                <h3 className="text-lg font-semibold mb-2">
                                  Resiko Likuiditas
                                </h3>
                                <Progress
                                  value={
                                    transaction.risk_breakdown?.liquidity || 0
                                  }
                                  className="h-2 mb-2"
                                />
                                <p className="text-small text-foreground mb-2">
                                  Sebesar{" "}
                                  {transaction.risk_breakdown?.liquidity || 0}%
                                </p>
                                <p className="text-xs text-gray-500">
                                  Mengukur kemudahan masuk dan keluar posisi
                                  berdasarkan aktivitas transaksi saham.
                                  Likuiditas rendah dapat membuat harga lebih
                                  mudah bergerak ekstrem.
                                </p>
                              </CardContent>
                            </Card>
                            <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 col-span-3">
                              <AlertTriangleIcon />
                              <AlertTitle>Catatan Penting</AlertTitle>
                              <AlertDescription>
                                {transaction.risk_breakdown?.news_reason ||
                                  "No risk information available"}
                              </AlertDescription>
                            </Alert>
                          </div>
                        ) : null}
                      </>
                    }
                  >
                    <>
                      <h2 className="text-xl font-bold text-foreground mb-4">
                        Risk Breakdown
                      </h2>
                      {isLoading ? (
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i}>
                              <CardContent className="p-4">
                                <Skeleton className="h-6 w-32 mb-3" />
                                <Skeleton className="h-2 w-full mb-3" />
                                <Skeleton className="h-4 w-20" />
                              </CardContent>
                            </Card>
                          ))}
                          <div className="col-span-3">
                            <Skeleton className="h-24 w-full" />
                          </div>
                        </div>
                      ) : transaction ? (
                        <div className="grid grid-cols-3 gap-4">
                          <Card className="relative overflow-hidden">
                            <DotGrid />
                            <CardContent className="p-4 relative z-10">
                              <h3 className="text-lg font-semibold mb-2">
                                Resiko Keseluruhan
                              </h3>
                              <Progress
                                value={transaction.risk_breakdown?.overall || 0}
                                className="h-2 mb-2"
                              />
                              <p className="text-small text-foreground mb-2">
                                Sebesar{" "}
                                {transaction.risk_breakdown?.overall || 0}%
                              </p>
                              <p className="text-xs text-gray-500">
                                Gambaran umum tingkat risiko berdasarkan
                                kombinasi volatilitas, momentum, tren, berita,
                                dan likuiditas saham.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="relative overflow-hidden">
                            <DotGrid />
                            <CardContent className="p-4 relative z-10">
                              <h3 className="text-lg font-semibold mb-2">
                                Risiko Volatilitas
                              </h3>
                              <Progress
                                value={
                                  transaction.risk_breakdown?.volatility || 0
                                }
                                className="h-2 mb-2"
                              />
                              <p className="text-small text-foreground mb-2">
                                Sebesar{" "}
                                {transaction.risk_breakdown?.volatility || 0}%
                              </p>
                              <p className="text-xs text-gray-500">
                                Mengukur seberapa besar harga berpotensi
                                bergerak naik atau turun dalam waktu singkat.
                                Semakin tinggi nilainya, semakin besar fluktuasi
                                harga yang mungkin terjadi.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="relative overflow-hidden">
                            <DotGrid />
                            <CardContent className="p-4 relative z-10">
                              <h3 className="text-lg font-semibold mb-2">
                                Resiko Momentum
                              </h3>
                              <Progress
                                value={
                                  transaction.risk_breakdown?.momentum || 0
                                }
                                className="h-2 mb-2"
                              />
                              <p className="text-small text-foreground mb-2">
                                Sebesar{" "}
                                {transaction.risk_breakdown?.momentum || 0}%
                              </p>
                              <p className="text-xs text-gray-500">
                                Mengukur kekuatan pergerakan harga saat ini.
                                Risiko meningkat ketika momentum mulai melemah
                                dan peluang pembalikan arah menjadi lebih besar.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="relative overflow-hidden">
                            <DotGrid />
                            <CardContent className="p-4 relative z-10">
                              <h3 className="text-lg font-semibold mb-2">
                                Resiko Trend
                              </h3>
                              <Progress
                                value={transaction.risk_breakdown?.trend || 0}
                                className="h-2 mb-2"
                              />
                              <p className="text-small text-foreground mb-2">
                                Sebesar {transaction.risk_breakdown?.trend || 0}
                                %
                              </p>
                              <p className="text-xs text-gray-500">
                                Mengukur kekuatan tren utama saham. Risiko
                                meningkat ketika harga mulai menunjukkan
                                tanda-tanda pelemahan terhadap arah tren yang
                                sedang berlangsung.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="relative overflow-hidden">
                            <DotGrid />
                            <CardContent className="p-4 relative z-10">
                              <h3 className="text-lg font-semibold mb-2">
                                Resiko Berita
                              </h3>
                              <Progress
                                value={transaction.risk_breakdown?.news || 0}
                                className="h-2 mb-2"
                              />
                              <p className="text-small text-foreground mb-2">
                                Sebesar {transaction.risk_breakdown?.news || 0}%
                              </p>
                              <p className="text-xs text-gray-500">
                                Menilai tingkat ketidakpastian yang berasal dari
                                berita, aksi korporasi, perubahan regulasi, atau
                                peristiwa lain yang dapat memengaruhi harga
                                saham.
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="relative overflow-hidden">
                            <DotGrid />
                            <CardContent className="p-4 relative z-10">
                              <h3 className="text-lg font-semibold mb-2">
                                Resiko Likuiditas
                              </h3>
                              <Progress
                                value={
                                  transaction.risk_breakdown?.liquidity || 0
                                }
                                className="h-2 mb-2"
                              />
                              <p className="text-small text-foreground mb-2">
                                Sebesar{" "}
                                {transaction.risk_breakdown?.liquidity || 0}%
                              </p>
                              <p className="text-xs text-gray-500">
                                Mengukur kemudahan masuk dan keluar posisi
                                berdasarkan aktivitas transaksi saham.
                                Likuiditas rendah dapat membuat harga lebih
                                mudah bergerak ekstrem.
                              </p>
                            </CardContent>
                          </Card>
                          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 col-span-3">
                            <AlertTriangleIcon />
                            <AlertTitle>Catatan Penting</AlertTitle>
                            <AlertDescription>
                              {transaction.risk_breakdown?.news_reason ||
                                "No risk information available"}
                            </AlertDescription>
                          </Alert>
                        </div>
                      ) : null}
                    </>
                  </PremiumContentGate>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="relative overflow-hidden">
                        <DotGrid />
                        <CardContent className="p-4 relative z-10">
                          <Skeleton className="h-6 w-32 mb-3" />
                          <Skeleton className="h-2 w-full mb-3" />
                          <Skeleton className="h-4 w-20" />
                        </CardContent>
                      </Card>
                    ))}
                    <div className="col-span-3">
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetail;
