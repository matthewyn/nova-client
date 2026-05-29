import { Lock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SparkleIcon from "@/components/SparkleIcon";
import { VolatilityAnalysis } from "@/components/VolatilityAnalysis";

function ContentGate() {
  const navigate = useNavigate();

  return (
    <Card className="mt-2 text-center">
      <CardContent className="p-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Lock size={18} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Buka Analisis Volatilitas AI
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Upgrade untuk membuka simulasi skenario market yang lebih tajam,
          analisis volatilitas, dan insight risiko berbasis AI.
        </p>
        <Button className="w-full mb-2" onClick={() => navigate("/upgrade")}>
          <SparkleIcon />
          Upgrade ke Pro
        </Button>
      </CardContent>
    </Card>
  );
}

export function PremiumContentGate({ userTier, children, previewContent }) {
  if (userTier === "pro") {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {previewContent && (
        <div className="relative overflow-hidden max-h-48 pointer-events-none select-none">
          <div className="blur-sm opacity-60 pt-4">{previewContent}</div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
        </div>
      )}

      <ContentGate />
    </div>
  );
}
