import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CapitalizeFirstLetter from "@/utils/string";

const VolatilityIcon = ({ riskFactor }) => {
  const barCount = riskFactor === "high" ? 3 : riskFactor === "medium" ? 2 : 1;
  return (
    <Tooltip>
      <TooltipTrigger>
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
      </TooltipTrigger>
      <TooltipContent>
        <p>Risiko: {CapitalizeFirstLetter(riskFactor)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const StocksCarousel = React.forwardRef(
  ({ title, stocks, className }, ref) => {
    const scrollContainerRef = React.useRef(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    const [selectedStock, setSelectedStock] = React.useState(null);
    const [selectedStockForTrend, setSelectedStockForTrend] =
      React.useState(null);
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
                      {new Date(stock.start_date).toISOString().split("T")[0]}
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
                            <FaCaretUp
                              className="inline text-green-500"
                              size={20}
                            />
                          ) : (
                            <FaCaretDown
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
      </div>
    );
  },
);

StocksCarousel.displayName = "StocksCarousel";
