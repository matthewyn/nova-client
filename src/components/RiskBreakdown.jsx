import { Card, CardContent } from "@/components/ui/card";
import DotGrid from "@/components/DotGrid";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function RiskBreakdown({ isLoading, transaction }) {
  return (
    <>
      <h2 className="text-xl font-bold text-foreground mb-4">Risk Breakdown</h2>
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
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">
                  Risiko Keseluruhan
                </h3>
                <Progress
                  value={transaction.risk_breakdown?.overall || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  Sebesar {transaction.risk_breakdown?.overall || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Gambaran umum tingkat risiko berdasarkan kombinasi
                  volatilitas, momentum, tren, berita, dan likuiditas saham.
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
                  value={transaction.risk_breakdown?.volatility || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  Sebesar {transaction.risk_breakdown?.volatility || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Mengukur seberapa besar harga berpotensi bergerak naik atau
                  turun dalam waktu singkat. Semakin tinggi nilainya, semakin
                  besar fluktuasi harga yang mungkin terjadi.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Risiko Momentum</h3>
                <Progress
                  value={transaction.risk_breakdown?.momentum || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  Sebesar {transaction.risk_breakdown?.momentum || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Mengukur kekuatan pergerakan harga saat ini. Risiko meningkat
                  ketika momentum mulai melemah dan peluang pembalikan arah
                  menjadi lebih besar.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Risiko Trend</h3>
                <Progress
                  value={transaction.risk_breakdown?.trend || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  Sebesar {transaction.risk_breakdown?.trend || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Mengukur kekuatan tren utama saham. Risiko meningkat ketika
                  harga mulai menunjukkan tanda-tanda pelemahan terhadap arah
                  tren yang sedang berlangsung.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Risiko Berita</h3>
                <Progress
                  value={transaction.risk_breakdown?.news || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  Sebesar {transaction.risk_breakdown?.news || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Menilai tingkat ketidakpastian yang berasal dari berita, aksi
                  korporasi, perubahan regulasi, atau peristiwa lain yang dapat
                  memengaruhi harga saham.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">
                  Risiko Likuiditas
                </h3>
                <Progress
                  value={transaction.risk_breakdown?.liquidity || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  Sebesar {transaction.risk_breakdown?.liquidity || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Mengukur kemudahan masuk dan keluar posisi berdasarkan
                  aktivitas transaksi saham. Likuiditas rendah dapat membuat
                  harga lebih mudah bergerak ekstrem.
                </p>
              </CardContent>
            </Card>
          </div>
          <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mt-4">
            <AlertTriangleIcon />
            <AlertTitle>Catatan Penting</AlertTitle>
            <AlertDescription>
              {transaction.risk_breakdown?.news_reason ||
                "No risk information available"}
            </AlertDescription>
          </Alert>
        </>
      ) : null}
    </>
  );
}

export default RiskBreakdown;
