import { Card, CardContent } from "@/components/ui/card";
import DotGrid from "@/components/DotGrid";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

function RiskBreakdown({ isLoading, transaction }) {
  return (
    <>
      <h2 className="text-xl font-bold text-foreground mb-4">
        Institutional & Risk Analysis
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <Skeleton className="h-6 w-40 mb-3 bg-white/10 rounded-md" />
                <Skeleton className="h-2 w-full mb-3 bg-white/10 rounded-full" />
                <Skeleton className="h-4 w-24 mb-3 bg-white/10 rounded-md" />
                <Skeleton className="h-3 w-full bg-white/10 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : transaction ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">
                  Institutional Score
                </h3>
                <Progress
                  value={transaction.institutional_score || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  At {transaction.institutional_score.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  A proprietary score derived from macro conditions, sector
                  leadership, capital allocation trends, asset flows, and
                  company fundamentals to measure institutional conviction and
                  investment quality.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Overall Risk</h3>
                <Progress
                  value={transaction.risk_breakdown?.overall || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  At {transaction.risk_breakdown?.overall.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  A comprehensive overview of risk levels based on a combination
                  of volatility, momentum, trend, news, and stock liquidity.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Volatility Risk</h3>
                <Progress
                  value={transaction.risk_breakdown?.volatility || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  At {transaction.risk_breakdown?.volatility.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Measures how large a price can potentially move up or down in
                  a short time. The higher the value, the greater the price
                  fluctuations that may occur.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Momentum Risk</h3>
                <Progress
                  value={transaction.risk_breakdown?.momentum || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  At {transaction.risk_breakdown?.momentum.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Measures the strength of current price movement. Risk
                  increases when momentum begins to weaken and the chance of
                  reversal becomes greater.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Trend Risk</h3>
                <Progress
                  value={transaction.risk_breakdown?.trend || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  At {transaction.risk_breakdown?.trend.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Measures the strength of the stock's main trend. Risk
                  increases when price begins to show signs of weakening against
                  the direction of the current trend.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden">
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <h3 className="text-lg font-semibold mb-2">Liquidity Risk</h3>
                <Progress
                  value={transaction.risk_breakdown?.liquidity || 0}
                  className="h-2 mb-2"
                />
                <p className="text-small text-foreground mb-2">
                  At {transaction.risk_breakdown?.liquidity.toFixed(2) || 0}%
                </p>
                <p className="text-xs text-gray-500">
                  Measures the ease of entering and exiting positions based on
                  stock transaction activity. Low liquidity can make prices move
                  more extremely.
                </p>
              </CardContent>
            </Card>
          </div>
          {/* <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mt-4">
            <AlertTriangleIcon />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              {transaction.risk_breakdown?.news_reason ||
                "No risk information available"}
            </AlertDescription>
          </Alert> */}
        </>
      ) : null}
    </>
  );
}

export default RiskBreakdown;
