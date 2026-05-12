import SparkleIcon from "../components/SparkleIcon";
import { Card, CardContent } from "../components/ui/card";
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
import { StocksCarousel } from "../components/ui/stocks-carousel";
import { useEffect, useState } from "react";
import axios from "axios";
import { generateApiOrigin } from "../utils/apiOrigin";
import { Skeleton } from "../components/ui/skeleton";
import { getAuthHeader } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const urlFetch = generateApiOrigin("/stocks/today");

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axios.get(urlFetch, {
          headers: getAuthHeader(),
        });
        if (response.status === 200) {
          const { stocks } = response.data;
          setStocks(stocks);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Server error:", error.response?.data);
          console.error("Status code:", error.response?.status);

          if (error.response?.status === 403) {
            toast(
              "Fitur ini hanya tersedia untuk pengguna pro ke atas. Silakan upgrade untuk mengaksesnya.",
              {
                type: "error",
                position: "top-center",
              },
            );
            navigate("/");
            return;
          }
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
                          Aset Populer
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
                    <StocksCarousel title="Aset Populer" stocks={stocks} />
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

export default Dashboard;
