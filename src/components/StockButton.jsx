import { Button } from "@/components/ui/button";

function StockButton({ stock, setSelectedStock, setSelectedStockForTrend }) {
  return (
    <div className="flex w-full gap-2 mt-4">
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
  );
}

export default StockButton;
