import SparkleIcon from "@/components/SparkleIcon";
import { Card, CardContent } from "@/components/ui/card";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { useEffect, useState, useRef } from "react";
import { getAuthHeader } from "@/utils/token";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

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
  COPPER: { label: "Copper" },
  COMMUNICATION_SERVICES: { label: "Comm. Services" },
  FINANCIALS: { label: "Financials" },
  INDUSTRIALS: { label: "Industrials" },
  MATERIALS: { label: "Materials" },
  UTILITIES: { label: "Utilities" },
};

function formatThemeLabel(theme) {
  return theme
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

const stripeBg = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 2px, transparent 2px, transparent 8px)",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

function AllocationBar({
  label,
  value,
  animate,
  variant = "primary",
  horizontal = false,
}) {
  if (horizontal) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 w-24 shrink-0 text-right leading-tight">
          {label}
        </span>
        <div
          className="relative flex-1 h-8 rounded-xl bg-gray-100 overflow-hidden border border-gray-200/60"
          style={stripeBg}
        >
          {value > 0 ? (
            <div
              className={`h-full rounded-xl flex items-center px-2 ${
                variant === "primary"
                  ? "primary"
                  : variant === "green"
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
              style={{
                width: animate ? `${value}%` : "0%",
                transition: "width 0.85s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              <span className="text-xs font-semibold text-white leading-none whitespace-nowrap">
                {value}%
              </span>
            </div>
          ) : (
            <div className="w-full h-1.5 rounded-r-xl bg-gray-200/80" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-full h-44 rounded-2xl bg-gray-100 overflow-hidden flex flex-col justify-end border border-gray-200/60"
        style={stripeBg}
      >
        {value > 0 ? (
          <div
            className={`w-full rounded-2xl flex items-start p-2 ${
              variant === "primary"
                ? "primary"
                : variant === "green"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
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

function SectorBars({ data, animate, horizontal = false }) {
  const topSet = new Set(data.top_sectors.map((s) => s.sector));
  const combined = [...data.top_sectors, ...data.avoid_sectors].sort(
    (a, b) => b.score - a.score,
  );
  const cols = combined.length;

  if (horizontal) {
    return (
      <div className="flex flex-col gap-2">
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
              horizontal
            />
          );
        })}
      </div>
    );
  }

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
  "/sector-intelligence/current?country=Indonesia",
);
const urlFetchSectorScoresUS = generateApiOrigin(
  "/sector-intelligence/current?country=US",
);
const urlFetchThemeScoreUS = generateApiOrigin("/theme/current?country=US");
const urlFetchThemeScoreIndonesia = generateApiOrigin(
  "/theme/current?country=Indonesia",
);

function Macro() {
  const [capitalFlow, setCapitalFlow] = useState(null);
  const [sectorScoresIndonesia, setSectorScoresIndonesia] = useState(null);
  const [sectorScoresUS, setSectorScoresUS] = useState(null);
  const [themeScoresIndonesia, setThemeScoresIndonesia] = useState(null);
  const [themeScoresUS, setThemeScoresUS] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchCapitalFlow() {
      setIsLoading(true);
      try {
        const [
          capitalFlowResponse,
          sectorScoresIndonesiaResponse,
          sectorScoresUSResponse,
          themeScoresIndonesiaResponse,
          themeScoresUSResponse,
        ] = await Promise.all([
          axios.get(urlFetch, { headers: getAuthHeader() }),
          axios.get(urlFetchSectorScoresIndonesia, {
            headers: getAuthHeader(),
          }),
          axios.get(urlFetchSectorScoresUS, {
            headers: getAuthHeader(),
          }),
          axios.get(urlFetchThemeScoreIndonesia, {
            headers: getAuthHeader(),
          }),
          axios.get(urlFetchThemeScoreUS, {
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
        if (themeScoresIndonesiaResponse.status == 200) {
          const { data } = themeScoresIndonesiaResponse;
          setThemeScoresIndonesia(data);
        }
        if (themeScoresUSResponse.status == 200) {
          const { data } = themeScoresUSResponse;
          setThemeScoresUS(data);
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
  const sortedThemesIndonesia = Array.isArray(themeScoresIndonesia?.themes)
    ? [...themeScoresIndonesia.themes].sort((a, b) => b.score - a.score)
    : [];
  const sortedThemesUS = Array.isArray(themeScoresUS?.themes)
    ? [...themeScoresUS.themes].sort((a, b) => b.score - a.score)
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
            Market Intelligence
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-1">
            Understand where capital is flowing
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Monitor macroeconomic conditions, capital flows, and sector rotation
            across global markets to identify where liquidity is moving and
            which opportunities are gaining momentum.
          </p>

          <div className="mt-12">
            {/* Capital Flow Card */}
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
                    isMobile ? (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-4 w-24 rounded-full shrink-0 bg-gray-200" />
                            <Skeleton className="flex-1 h-8 rounded-xl bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-3"
                          >
                            <Skeleton className="w-full h-44 rounded-2xl bg-gray-200" />
                            <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                            <Skeleton className="h-3 w-12 rounded-full bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    )
                  ) : sortedEntries.length > 0 ? (
                    isMobile ? (
                      <div className="flex flex-col gap-2">
                        {sortedEntries.map(([key, value]) => {
                          const config = ALLOCATION_CONFIG[key];
                          return config ? (
                            <AllocationBar
                              key={key}
                              label={config.label}
                              value={value}
                              animate={animate}
                              horizontal
                            />
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-9 gap-3">
                        {sortedEntries.map(([key, value]) => {
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
                    )
                  ) : (
                    <p className="text-sm text-gray-500">
                      No capital flow data available
                    </p>
                  )}

                  {!isLoading && capitalFlow.summary && (
                    <Alert className="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-50 mt-4">
                      <AlertTriangleIcon />
                      <AlertTitle>Insight Nova AI</AlertTitle>
                      <AlertDescription>{capitalFlow.summary}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              {/* Active Indonesia Themes Card */}
              <Card className="relative">
                <CardContent className="text-left">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Active Indonesia Themes
                        </h2>
                        {!isLoading && sortedThemesIndonesia.length > 0 && (
                          <p className="text-sm text-foreground/70">
                            Top theme:{" "}
                            <span className="font-semibold text-foreground">
                              {formatThemeLabel(sortedThemesIndonesia[0].theme)}
                            </span>
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1 rounded-full border border-green-100">
                        Live
                      </span>
                    </div>

                    {isLoading ? (
                      isMobile ? (
                        <div className="flex flex-col gap-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-4 w-24 rounded-full shrink-0 bg-gray-200" />
                              <Skeleton className="flex-1 h-8 rounded-xl bg-gray-200" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-3"
                            >
                              <Skeleton className="w-full h-44 rounded-2xl bg-gray-200" />
                              <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                              <Skeleton className="h-3 w-12 rounded-full bg-gray-200" />
                            </div>
                          ))}
                        </div>
                      )
                    ) : sortedThemesIndonesia.length > 0 ? (
                      isMobile ? (
                        <div className="flex flex-col gap-2">
                          {sortedThemesIndonesia.map((themeData) => (
                            <AllocationBar
                              key={themeData.theme}
                              label={formatThemeLabel(themeData.theme)}
                              value={Math.round(themeData.score * 10) / 10}
                              animate={animate}
                              horizontal
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns: `repeat(${sortedThemesIndonesia.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {sortedThemesIndonesia.map((themeData) => (
                            <AllocationBar
                              key={themeData.theme}
                              label={formatThemeLabel(themeData.theme)}
                              value={Math.round(themeData.score * 10) / 10}
                              animate={animate}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No theme data available
                      </p>
                    )}

                    {!isLoading &&
                      themeScoresIndonesia &&
                      themeScoresIndonesia.summary && (
                        <Alert className="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-50 mt-4">
                          <AlertTriangleIcon />
                          <AlertTitle>Insight Nova AI</AlertTitle>
                          <AlertDescription>
                            {themeScoresIndonesia.summary}
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active US Themes Card */}
            <div className="mt-4">
              <Card className="relative">
                <CardContent className="text-left">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-1">
                          Active US Themes
                        </h2>
                        {!isLoading && sortedThemesUS.length > 0 && (
                          <p className="text-sm text-foreground/70">
                            Top theme:{" "}
                            <span className="font-semibold text-foreground">
                              {formatThemeLabel(sortedThemesUS[0].theme)}
                            </span>
                          </p>
                        )}
                      </div>
                      <span className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1 rounded-full border border-green-100">
                        Live
                      </span>
                    </div>

                    {isLoading ? (
                      isMobile ? (
                        <div className="flex flex-col gap-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-4 w-24 rounded-full shrink-0 bg-gray-200" />
                              <Skeleton className="flex-1 h-8 rounded-xl bg-gray-200" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-3"
                            >
                              <Skeleton className="w-full h-44 rounded-2xl bg-gray-200" />
                              <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                              <Skeleton className="h-3 w-12 rounded-full bg-gray-200" />
                            </div>
                          ))}
                        </div>
                      )
                    ) : sortedThemesUS.length > 0 ? (
                      isMobile ? (
                        <div className="flex flex-col gap-2">
                          {sortedThemesUS.map((themeData) => (
                            <AllocationBar
                              key={themeData.theme}
                              label={formatThemeLabel(themeData.theme)}
                              value={Math.round(themeData.score * 10) / 10}
                              animate={animate}
                              horizontal
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns: `repeat(${sortedThemesUS.length}, minmax(0, 1fr))`,
                          }}
                        >
                          {sortedThemesUS.map((themeData) => (
                            <AllocationBar
                              key={themeData.theme}
                              label={formatThemeLabel(themeData.theme)}
                              value={Math.round(themeData.score * 10) / 10}
                              animate={animate}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No theme data available
                      </p>
                    )}

                    {!isLoading && themeScoresUS && themeScoresUS.summary && (
                      <Alert className="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-50 mt-4">
                        <AlertTriangleIcon />
                        <AlertTitle>Insight Nova AI</AlertTitle>
                        <AlertDescription>
                          {themeScoresUS.summary}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Indonesia Top Sectors Card */}
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
                    isMobile ? (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-4 w-24 rounded-full shrink-0 bg-gray-200" />
                            <Skeleton className="flex-1 h-8 rounded-xl bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-3"
                          >
                            <Skeleton className="w-full h-44 rounded-2xl bg-gray-200" />
                            <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    )
                  ) : sectorScoresIndonesia ? (
                    <SectorBars
                      data={sectorScoresIndonesia}
                      animate={animate}
                      horizontal={isMobile}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No sector data available
                    </p>
                  )}

                  {!isLoading &&
                    sectorScoresIndonesia &&
                    sectorScoresIndonesia.summary && (
                      <Alert className="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-50 mt-4">
                        <AlertTriangleIcon />
                        <AlertTitle>Insight Nova AI</AlertTitle>
                        <AlertDescription>
                          {sectorScoresIndonesia.summary}
                        </AlertDescription>
                      </Alert>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* US Top Sectors Card */}
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
                    isMobile ? (
                      <div className="flex flex-col gap-3">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-4 w-24 rounded-full shrink-0 bg-gray-200" />
                            <Skeleton className="flex-1 h-8 rounded-xl bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-3"
                          >
                            <Skeleton className="w-full h-44 rounded-2xl bg-gray-200" />
                            <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                          </div>
                        ))}
                      </div>
                    )
                  ) : sectorScoresUS ? (
                    <SectorBars
                      data={sectorScoresUS}
                      animate={animate}
                      horizontal={isMobile}
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No sector data available
                    </p>
                  )}

                  {!isLoading && sectorScoresUS && sectorScoresUS.summary && (
                    <Alert className="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-50 mt-4">
                      <AlertTriangleIcon />
                      <AlertTitle>Insight Nova AI</AlertTitle>
                      <AlertDescription>
                        {sectorScoresUS.summary}
                      </AlertDescription>
                    </Alert>
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
