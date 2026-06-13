import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import DotGrid from "@/components/DotGrid";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangleIcon,
  TrendingDown,
  TrendingUpDown,
  TrendingUp,
} from "lucide-react";
import { FeatureCard } from "@/components/blocks/grid-feature-cards";

function get_max_risk_percentage(risk_level) {
  if (risk_level === "low") {
    return 3;
  }

  if (risk_level === "medium") {
    return 2;
  }

  return 1;
}

function AnimatedContainer({ className, delay = 0.1, children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RecommendedSizing({
  isLoading,
  transaction,
  startEquity,
  setStartEquity,
  riskPercentage,
  setRiskPercentage,
  scenarioAnalysis,
  equityType,
}) {
  const riskLevel = transaction?.risk_level || "medium";
  const riskPerShare =
    transaction && transaction?.initial_price && transaction?.stop_loss
      ? Math.abs(transaction.initial_price - transaction.stop_loss)
      : 0;
  const maxLoss = (riskPercentage / 100) * startEquity;
  const recommendedPositionSize =
    riskPerShare > 0 ? Math.floor(maxLoss / riskPerShare) : 0;
  const recommendedInvestment = transaction
    ? recommendedPositionSize * transaction.initial_price
    : 0;
  const bullImpact =
    (recommendedInvestment * (scenarioAnalysis?.bull_case?.target_pct || 0)) /
    100;
  const baseImpact =
    (recommendedInvestment * (scenarioAnalysis?.base_case?.target_pct || 0)) /
    100;
  const bearImpact =
    (recommendedInvestment * (scenarioAnalysis?.bear_case?.target_pct || 0)) /
    100;
  const features = [
    {
      title: "Bull Case",
      icon: TrendingUp,
      impact: bullImpact,
      targetPct: scenarioAnalysis?.bull_case?.target_pct,
    },
    {
      title: "Base Case",
      icon: TrendingUpDown,
      impact: baseImpact,
      targetPct: scenarioAnalysis?.base_case?.target_pct,
    },
    {
      title: "Bear Case",
      icon: TrendingDown,
      impact: bearImpact,
      targetPct: scenarioAnalysis?.bear_case?.target_pct,
    },
  ];

  return (
    <>
      <h2 className="text-xl font-bold text-foreground mb-4">
        Recommended Position Sizing
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="relative overflow-hidden text-white border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] backdrop-blur-xl"
            >
              <DotGrid />
              <CardContent className="p-4 relative z-10">
                <Skeleton className="h-6 w-24 mb-3 bg-white/10" />
                <Skeleton className="h-4 w-16 bg-white/10" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : transaction ? (
        <div className="grid grid-cols-4 gap-4">
          <Card className="relative overflow-hidden text-white border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] relative backdrop-blur-xl">
            <DotGrid />
            <CardContent className="p-4 relative z-10">
              <h3 className="text-xl font-semibold">
                {equityType === "IDR" ? "Rp " : "$"}
                {startEquity.toLocaleString()}
              </h3>
              <p className="text-lg text-white/70">Starting Capital</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden text-white border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] relative backdrop-blur-xl">
            <DotGrid />
            <CardContent className="p-4 relative z-10">
              <h3 className="text-xl font-semibold">
                {riskPercentage.toFixed(1)}%
              </h3>
              <p className="text-lg text-white/70">Risk Per Trade</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden text-white border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] relative backdrop-blur-xl">
            <DotGrid />
            <CardContent className="p-4 relative z-10">
              <h3 className="text-xl font-semibold">
                {equityType === "IDR" ? "Rp " : "$"}
                {recommendedInvestment.toLocaleString()}
              </h3>
              <p className="text-lg text-white/70">Recommended Investment</p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden text-white border border-white/10 bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101] relative backdrop-blur-xl">
            <DotGrid />
            <CardContent className="p-4 relative z-10">
              <h3 className="text-xl font-semibold">
                {equityType === "IDR" ? "Rp " : "$"}
                {maxLoss.toLocaleString()}
              </h3>
              <p className="text-lg text-white/70">Maximum Loss</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
      <div className="grid grid-cols-3 mt-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Portfolio Allocation
          </h2>
          <div className="my-3">
            <div
              className="relative h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20"
              role="progressbar"
              aria-valuenow={(recommendedInvestment / startEquity) * 100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress bar showing ${(recommendedInvestment / startEquity) * 100}% completion`}
            >
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((recommendedInvestment / startEquity) * 100, 100)}%`,
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Risk per Trade</h2>
          <div className="my-3">
            <Slider
              value={[riskPercentage]}
              onValueChange={(value) => setRiskPercentage(value[0])}
              max={get_max_risk_percentage(riskLevel)}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              {riskPercentage.toFixed(1)}%
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Starting Capital
          </h2>
          <div className="my-3">
            <Slider
              value={[startEquity]}
              onValueChange={(value) => setStartEquity(value[0])}
              max={1000000000}
              min={1000000}
              step={1000000}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              {equityType === "IDR" ? "Rp " : "$"}
              {startEquity.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {transaction && (
        <Alert className="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-50 mt-4">
          <AlertTriangleIcon />
          <AlertTitle>Insight Nova AI</AlertTitle>
          <AlertDescription>
            With a {transaction.risk_level?.toUpperCase()} risk level and stop
            loss at {equityType === "IDR" ? "Rp " : "$"}
            {transaction.stop_loss?.toLocaleString()}, Nova recommends a maximum
            position size of {equityType === "IDR" ? "Rp " : "$"}
            {recommendedInvestment.toLocaleString()} to keep maximum loss under{" "}
            {riskPercentage.toFixed(1)}% of your investment capital.
          </AlertDescription>
        </Alert>
      )}
      <h2 className="text-xl font-bold text-foreground mt-6">
        Impact in Different Scenarios
      </h2>
      <div className="flex flex-col gap-4 mt-4">
        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
        >
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} equityType={equityType} />
          ))}
        </AnimatedContainer>
      </div>
    </>
  );
}

export default RecommendedSizing;
