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

const stripeBg = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 8px)",
};

function AllocationBar({ label, value, animate }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-full h-44 rounded-2xl bg-gray-100 overflow-hidden flex flex-col justify-end border border-gray-200/60"
        style={stripeBg}
      >
        {value > 0 ? (
          <div
            className="w-full rounded-2xl flex items-start p-2 primary"
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

      <span>{label}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Macro;
