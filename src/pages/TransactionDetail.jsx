import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { generateApiOrigin } from "@/utils/apiOrigin";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { getAuthHeader } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import StockPriceChart from "@/components/StockPriceChart";
import { HiArrowUpRight, HiArrowDownRight } from "react-icons/hi2";
import { PremiumContentGate } from "@/components/PremiumContentGate";
import { useAuth } from "@/contexts/AuthContext";
import { ProductRevealCard } from "@/components/ui/product-reveal-card";
import { toast } from "sonner";

const projects = [
  {
    title: "Matthias Leidinger",
    description:
      "Originally hailing from Austria, Berlin-based photographer Matthias Leindinger is a young creative brimming with talent and ideas.",
    link: "https://images.unsplash.com/photo-1605106702842-01a887a31122?q=80&w=500&auto=format&fit=crop",
    color: "#5196fd",
  },
  {
    title: "Clément Chapillon",
    description:
      "This is a story on the border between reality and imaginary, about the contradictory feelings that the insularity of a rocky, arid, and wild territory provokes”—so French photographer Clément.",
    link: "https://images.unsplash.com/photo-1605106250963-ffda6d2a4b32?w=500&auto=format&fit=crop&q=60",
    color: "#8f89ff",
  },
  {
    title: "Zissou",
    description:
      "Though he views photography as a medium for storytelling, Zissou’s images don’t insist on a narrative. Both crisp and ethereal.",
    link: "https://images.unsplash.com/photo-1605106901227-991bd663255c?w=500&auto=format&fit=crop",
    color: "#13006c",
  },
  {
    title: "Mathias Svold and Ulrik Hasemann",
    description:
      "The coastlines of Denmark are documented in tonal colors in a pensive new series by Danish photographers Ulrik Hasemann and Mathias Svold; an ongoing project investigating how humans interact with and disrupt the Danish coast.",
    link: "https://images.unsplash.com/photo-1605106715994-18d3fecffb98?w=500&auto=format&fit=crop&q=60",
    color: "#ed649e",
  },
  {
    title: "Mark Rammers",
    description:
      "Dutch photographer Mark Rammers has shared with IGNANT the first chapter of his latest photographic project, ‘all over again’—captured while in residency at Hektor, an old farm in Los Valles, Lanzarote.",
    link: "https://images.unsplash.com/photo-1506792006437-256b665541e2?w=500&auto=format&fit=crop",
    color: "#fd521a",
  },
];

const EQUITY = 100000000;

function TransactionDetail() {
  const [transaction, setTransaction] = useState(null);
  const { user, setUser } = useAuth();
  const [equities, setEquities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const pctReturn =
    transaction && equities.length > 0
      ? (equities[equities.length - 1].equity - EQUITY) / EQUITY
      : 0;

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

  const handleClose = async (e) => {
    try {
      setIsLoading(true);

      const result = await axios.post(
        generateApiOrigin(`/transaction/${id}/close`),
        {},
        {
          headers: getAuthHeader(),
        },
      );

      if (result.status === 200) {
        toast("Sukses menutup transaksi! Transaksi Anda telah tercatat.", {
          type: "success",
          position: "top-center",
        });
        await fetchData();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast(
            "Terjadi kesalahan saat menutup transaksi. Silakan coba lagi nanti.",
            {
              type: "error",
              position: "top-center",
            },
          );
        }
        console.error("Server error:", error.response?.data);
        console.error("Status code:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                  transaction.type === "open" ? (
                    <div className="flex">
                      <div className="w-1/5 border-r-1 border-gray-200/70 pr-4">
                        <Button
                          size="lg"
                          className="cursor-pointer w-full"
                          variant="destructive"
                          onClick={handleClose}
                        >
                          Jual
                        </Button>
                      </div>
                      <div className="p-4 flex-1">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-1">
                          Nilai Investasi
                          <HiArrowUpRight size={12} />
                        </h2>
                        <div className="flex items-end gap-1">
                          <p className="font-medium text-foreground text-3xl">
                            Rp{" "}
                            {equities[
                              equities.length - 1
                            ].equity.toLocaleString()}
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
                    </div>
                  ) : (
                    <div className="w-full p-4">
                      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-1">
                        Nilai Investasi
                        <HiArrowUpRight size={12} />
                      </h2>
                      <div className="flex items-end gap-1">
                        <p className="font-medium text-foreground text-3xl">
                          Rp{" "}
                          {equities[
                            equities.length - 1
                          ].equity.toLocaleString()}
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
                  )
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
                    previewContent={<StockPriceChart chartData={equities} />}
                  >
                    <ProductRevealCard />
                  </PremiumContentGate>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-10 rounded-full mx-auto" />
                    <Skeleton className="h-6 w-48 mx-auto" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ Stacking card OUTSIDE all containers */}
      {user && user.tier === "premium" && <Component projects={projects} />}
    </div>
  );
}

export default TransactionDetail;
