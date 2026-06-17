import SparkleIcon from "@/components/SparkleIcon";
import { Card, CardContent } from "@/components/ui/card";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { useEffect, useState, useRef } from "react";
import { getAuthHeader } from "@/utils/token";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

const ALLOCATION_CONFIG = {
  CASH: { label: "Cash" },
  USD: { label: "USD" },
  GOLD: { label: "Gold" },
  COMMODITIES: { label: "Commodities" },
  US_TREASURY: { label: "US Treasury" },
  ID_BOND: { label: "ID Bond" },
  US_EQUITY: { label: "US Equity" },
  ID_EQUITY: { label: "ID Equity" },
  REIT: { label: "REIT" },
};

const SECTOR_CONFIG = {
  GOLD: { label: "Gold" },
  OIL_GAS: { label: "Oil & Gas" },
  COAL: { label: "Coal" },
  NICKEL: { label: "Nickel" },
  CPO: { label: "CPO" },
  ENERGY_SHIPPING: { label: "Energy Ship" },
  CONSUMER_STAPLES: { label: "Con. Staples" },
  BANKING: { label: "Banking" },
  HEALTHCARE: { label: "Healthcare" },
  TELECOM: { label: "Telecom" },
  INFRASTRUCTURE: { label: "Infra" },
  PROPERTY: { label: "Property" },
  CONSUMER_DISCRETIONARY: { label: "Con. Disc." },
  TECHNOLOGY: { label: "Technology" },
  ENERGY: { label: "Energy" },
  FINANCIALS: { label: "Financials" },
  INDUSTRIALS: { label: "Industrials" },
  MATERIALS: { label: "Materials" },
  UTILITIES: { label: "Utilities" },
};

const stripeBg = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 8px)",
};

function AllocationBar({ label, value, animate, variant = "primary" }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-full h-44 rounded-2xl bg-gray-100 overflow-hidden flex flex-col justify-end border border-gray-200/60"
        style={stripeBg}
      >
        {value > 0 ? (
          <div
            className={`w-full rounded-2xl flex items-start p-2 ${variant === "primary" ? "primary" : variant === "green" ? "bg-green-500" : "bg-red-500"}`}
            style={{
              height: animate ? `${value}%` : "0%",
              transition: "height 0.85s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <span className="text-xs font-semibold text-white leading-none">
              {value}%
            </span>
          </div>
        ) : (
          <div className="w-full h-1.5 rounded-b-2xl bg-gray-200/80" />
        )}
      </div>

      <span className="text-xs text-center leading-tight">{label}</span>
    </div>
  );
}

function SectorBars({ data, animate }) {
  const topSet = new Set(data.top_sectors.map((s) => s.sector));
  const combined = [...data.top_sectors, ...data.avoid_sectors].sort(
    (a, b) => b.score - a.score,
  );
  console.log("Combined sectors:", combined);
  const cols = combined.length;
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {combined.map(({ sector, score }) => {
        const config = SECTOR_CONFIG[sector];
        if (!config) return null;
        return (
          <AllocationBar
            key={sector}
            label={config.label}
            value={Math.round(score * 10) / 10}
            animate={animate}
            variant={topSet.has(sector) ? "green" : "red"}
          />
        );
      })}
    </div>
  );
}

const urlFetch = generateApiOrigin("/capital-flow/current");
const urlFetchSectorScoresIndonesia = generateApiOrigin(
  "/sector-rotation/current?country=Indonesia",
);
const urlFetchSectorScoresUS = generateApiOrigin(
  "/sector-rotation/current?country=US",
);

function Macro() {
  const [capitalFlow, setCapitalFlow] = useState(null);
  const [sectorScoresIndonesia, setSectorScoresIndonesia] = useState(null);
  const [sectorScoresUS, setSectorScoresUS] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    async function fetchCapitalFlow() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(urlFetch, {
          headers: getAuthHeader(),
        });
        const [
          capitalFlowResponse,
          sectorScoresIndonesiaResponse,
          sectorScoresUSResponse,
        ] = await Promise.all([
          axios.get(urlFetch, { headers: getAuthHeader() }),
          axios.get(urlFetchSectorScoresIndonesia, {
            headers: getAuthHeader(),
          }),
          axios.get(urlFetchSectorScoresUS, {
            headers: getAuthHeader(),
          }),
        ]);
        if (capitalFlowResponse.status == 200) {
          const { data } = capitalFlowResponse;
          setCapitalFlow(data);
          requestAnimationFrame(() => {
            setTimeout(() => setAnimate(true), 60);
          });
        }
        if (sectorScoresIndonesiaResponse.status == 200) {
          const { data } = sectorScoresIndonesiaResponse;
          setSectorScoresIndonesia(data);
        }
        if (sectorScoresUSResponse.status == 200) {
          const { data } = sectorScoresUSResponse;
          setSectorScoresUS(data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
          console.error("Status code:", error.response?.status);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCapitalFlow();
  }, []);

  const sortedEntries = capitalFlow?.scores
    ? Object.entries(capitalFlow.scores).sort(([, a], [, b]) => b - a)
    : [];

  const topAsset =
    sortedEntries.length > 0
      ? ALLOCATION_CONFIG[sortedEntries[0][0]]?.label
      : null;

  return (
    <div className="bg-gray-50 select-none">
      <div className="text-center border-y border-gray-200/70 px-8">
        <div className="border-x border-gray-200/70 py-12 px-8">
          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
            <SparkleIcon size={12} />
            Macro Analysis
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-1">
            Macro Analysis
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Analyze the macroeconomic landscape with our comprehensive
            dashboard.
          </p>

          <div className="mt-12">
            <Card className="relative">
              <CardContent className="text-left">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">
                        Capital Flow
                      </h2>
                      {!isLoading && topAsset && (
                        <p className="text-sm text-foreground/70">
                          Top performer:{" "}
                          <span className="font-semibold text-foreground">
                            {topAsset}
                          </span>
                        </p>
                      )}
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1 rounded-full border border-green-100">
                      Live
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-9 gap-4">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-3"
                        >
                          <Skeleton className="w-full h-44 rounded-2xl" />
                          <Skeleton className="h-3 w-16 rounded-full" />
                          <Skeleton className="h-3 w-12 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : sortedEntries.length > 0 ? (
                    <div className="grid grid-cols-9 gap-3">
                      {sortedEntries.map(([key, value], i) => {
                        const config = ALLOCATION_CONFIG[key];
                        return config ? (
                          <AllocationBar
                            key={key}
                            label={config.label}
                            value={value}
                            animate={animate}
                          />
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No capital flow data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="relative mt-4">
              <CardContent className="text-left">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">
                        Indonesia Top Sectors
                      </h2>
                      {!isLoading && sectorScoresIndonesia && (
                        <p className="text-sm text-foreground/70">
                          Regime:{" "}
                          <span className="font-semibold text-foreground">
                            {sectorScoresIndonesia.regime}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-green-600">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500" />
                        Top
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-red-500">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" />
                        Avoid
                      </span>
                      <span className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1 rounded-full border border-green-100">
                        Live
                      </span>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-7 gap-4">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-3"
                        >
                          <Skeleton className="w-full h-44 rounded-2xl" />
                          <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : sectorScoresIndonesia ? (
                    <SectorBars
                      data={sectorScoresIndonesia}
                      animate={animate}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No sector data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="relative mt-4">
              <CardContent className="text-left">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">
                        US Top Sectors
                      </h2>
                      {!isLoading && sectorScoresUS && (
                        <p className="text-sm text-foreground/70">
                          Regime:{" "}
                          <span className="font-semibold text-foreground">
                            {sectorScoresUS.regime}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-green-600">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500" />
                        Top
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-red-500">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" />
                        Avoid
                      </span>
                      <span className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1 rounded-full border border-green-100">
                        Live
                      </span>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-7 gap-4">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-3"
                        >
                          <Skeleton className="w-full h-44 rounded-2xl" />
                          <Skeleton className="h-3 w-16 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : sectorScoresUS ? (
                    <SectorBars data={sectorScoresUS} animate={animate} />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No sector data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Macro;
