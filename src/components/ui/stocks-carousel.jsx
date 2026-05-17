import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { HiArrowUpCircle, HiArrowDownCircle } from "react-icons/hi2";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { generateApiOrigin } from "../../utils/apiOrigin";
import axios from "axios";
import { getAuthHeader } from "../../utils/token";
import { Field, FieldDescription, FieldLabel } from "./field";
import { Input } from "./input";
import { Alert, AlertTitle, AlertDescription } from "./alert";

const VolatilityIcon = ({ riskFactor }) => {
  const barCount = riskFactor === "high" ? 3 : riskFactor === "medium" ? 2 : 1;
  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full",
            i === 0 ? "h-2" : i === 1 ? "h-3" : "h-4",
            i < barCount ? "bg-foreground/80" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
};

const urlFetch = generateApiOrigin("/transaction/new");

export const StocksCarousel = React.forwardRef(
  ({ title, stocks, className, onBuySuccess }, ref) => {
    const scrollContainerRef = React.useRef(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    const [selectedStock, setSelectedStock] = React.useState(null);
    const [selectedStockForTrend, setSelectedStockForTrend] =
      React.useState(null);
    const [investmentValue, setInvestmentValue] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const scroll = (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    React.useEffect(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }, [stocks]);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 14,
        },
      },
    };

    const handleSubmit = async (e) => {
      try {
        setIsLoading(true);

        if (!investmentValue) {
          toast("Nilai investasi harus diisi.", {
            type: "error",
            position: "top-center",
          });
          return;
        }

        const result = await axios.post(
          urlFetch,
          {
            stock_id: selectedStock._id,
            name: selectedStock.name,
            buy_date: new Date().toISOString(),
            sell_date: null,
            buy_price: selectedStock.initial_price,
            sell_price: null,
            equity: Number(investmentValue),
          },
          {
            headers: getAuthHeader(),
          },
        );

        if (result.status === 201) {
          toast("Sukses membeli saham! Transaksi Anda telah tercatat.", {
            type: "success",
            position: "top-center",
          });
          setSelectedStock(null);
          if (onBuySuccess) {
            onBuySuccess();
          }
          return;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == 400) {
            toast(
              "Input tidak valid. Silakan periksa kembali informasi yang dimasukkan.",
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
      <div ref={ref} className={cn("w-full font-sans p-4", className)}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            {title}
          </h2>
          {stocks.length > 0 && (
            <div className="flex items-center gap-2">
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll("left")}
                  aria-label="Scroll left"
                  className="p-1.5 rounded-full bg-background border hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </motion.button>
              )}
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll("right")}
                  aria-label="Scroll right"
                  className="p-1.5 rounded-full bg-background border hover:bg-muted transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </motion.button>
              )}
            </div>
          )}
        </div>
        {stocks.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          >
            <motion.div
              className="flex flex-nowrap gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stocks.map((stock, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex-shrink-0 w-72 bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-foreground/70">
                      {stock.start_date}
                    </span>
                    <VolatilityIcon riskFactor={stock.risk_level} />
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={stock.logo}
                      alt={`${stock.name} logo`}
                      className="h-12 w-12 rounded-md object-cover bg-muted"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg truncate">
                        {stock.name.replace(".JK", "")}
                      </h3>
                      <div className="flex gap-2">
                        <span className="text-sm text-foreground">
                          Rp {stock.initial_price.toLocaleString()}
                        </span>
                        |
                        <span className="text-sm text-foreground flex items-center gap-1">
                          {stock.predicted_pct_change > 0 ? (
                            <HiArrowUpCircle
                              className="inline text-green-500"
                              size={20}
                            />
                          ) : (
                            <HiArrowDownCircle
                              className="inline text-red-500"
                              size={20}
                            />
                          )}
                          {Math.abs(stock.predicted_pct_change)}%
                        </span>
                      </div>
                      <span className="text-sm text-foreground/70">
                        Stop loss:{" "}
                        <span className="text-red-500">
                          Rp {stock.stop_loss.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full gap-2">
                    <Button
                      size="lg"
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedStock(stock)}
                    >
                      Beli
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedStockForTrend(stock)}
                    >
                      Lihat Lebih
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <p className="text-sm text-foreground/70">
            Tidak ada rekomendasi saham untuk hari ini.
          </p>
        )}
        {/* Footer Link */}
        {/* <a
          href="#"
          className="text-sm text-blue-500 hover:underline mt-2 inline-block"
        >
          See all market events ›
        </a> */}

        {/* Stock Detail Modal */}
        <Modal
          isOpen={selectedStock !== null}
          onOpenChange={(isOpen) => !isOpen && setSelectedStock(null)}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Kode Saham: {selectedStock?.name.replace(".JK", "")}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedStock?.logo}
                        alt={`${selectedStock?.name} logo`}
                        className="h-16 w-16 rounded-md object-cover bg-muted"
                      />
                      <div>
                        <p className="text-sm text-foreground/70">Harga Awal</p>
                        <p className="text-lg font-semibold">
                          Rp {selectedStock?.initial_price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-sm text-foreground/70">
                          Prediksi Perubahan
                        </p>
                        <p
                          className={`text-lg font-semibold flex items-center gap-1 ${selectedStock?.predicted_pct_change > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {selectedStock?.predicted_pct_change > 0 ? (
                            <HiArrowUpCircle size={20} />
                          ) : (
                            <HiArrowDownCircle size={20} />
                          )}
                          {Math.abs(selectedStock?.predicted_pct_change)}%
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="text-sm text-foreground/70">Stop Loss</p>
                        <p className="text-lg font-semibold text-red-600">
                          Rp {selectedStock?.stop_loss.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm text-foreground/70">
                        Tanggal Analisis
                      </p>
                      <p className="text-base font-medium">
                        {selectedStock?.start_date}
                      </p>
                    </div>

                    <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                      <AlertTriangleIcon />
                      <AlertTitle>Catatan Penting</AlertTitle>
                      <AlertDescription>
                        Saham dapat disimpan maksimal selama 90 hari setelah
                        tanggal analisis selama harga saham tidak mencapai stop
                        loss atau trailing stop.
                      </AlertDescription>
                    </Alert>

                    <Field>
                      <FieldLabel htmlFor="input-required">
                        Nilai Investasi
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id="input-required"
                        placeholder="Masukkan nilai investasi"
                        required
                        type="number"
                        value={investmentValue}
                        onChange={(e) => setInvestmentValue(e.target.value)}
                      />
                    </Field>

                    <p className="text-sm text-foreground/70">
                      Silakan klik tombol "Beli" untuk memulai investasi pada
                      saham {selectedStock?.name.replace(".JK", "")} sesuai
                      dengan analisis kami.
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    size="lg"
                    onClick={onClose}
                    className="cursor-pointer"
                  >
                    Tutup
                  </Button>
                  <Button
                    color="primary"
                    size="lg"
                    onClick={handleSubmit}
                    className="cursor-pointer"
                  >
                    Beli Sekarang
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Trend Summary Modal */}
        <Modal
          isOpen={selectedStockForTrend !== null}
          onOpenChange={(isOpen) => !isOpen && setSelectedStockForTrend(null)}
          size="lg"
        >
          <ModalContent>
            {(onClose) => {
              const parseSummary = (summaryText) => {
                if (!summaryText) return {};
                const sections = {};
                const lines = summaryText
                  .split("\n")
                  .filter((line) => line.trim());
                lines.forEach((line) => {
                  const match = line.match(/^\s*([A-Z_]+):\s*(.+)/);
                  if (match) {
                    sections[match[1]] = match[2].trim();
                  }
                });
                return sections;
              };

              const summaryData = parseSummary(selectedStockForTrend?.summary);

              return (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Ringkasan Tren:{" "}
                    {selectedStockForTrend?.name.replace(".JK", "")}
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {/* Stock Overview */}
                      <div className="flex items-center gap-4 pb-4 border-b">
                        <img
                          src={selectedStockForTrend?.logo}
                          alt={`${selectedStockForTrend?.name} logo`}
                          className="h-16 w-16 rounded-md object-cover bg-muted"
                        />
                        <div>
                          <p className="text-sm text-foreground/70">
                            Harga Awal
                          </p>
                          <p className="text-lg font-semibold">
                            Rp{" "}
                            {selectedStockForTrend?.initial_price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Summary Sections */}
                      {Object.entries(summaryData).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-3 rounded-lg bg-muted space-y-2"
                        >
                          <p className="text-sm font-semibold text-foreground">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-foreground/70 leading-relaxed">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      size="lg"
                      onClick={onClose}
                      className="cursor-pointer"
                    >
                      Tutup
                    </Button>
                  </ModalFooter>
                </>
              );
            }}
          </ModalContent>
        </Modal>
      </div>
    );
  },
);

StocksCarousel.displayName = "StocksCarousel";
