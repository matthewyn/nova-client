import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { HiArrowUpCircle, HiArrowDownCircle } from "react-icons/hi2";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function StockModal({ selectedStockForTrend, setSelectedStockForTrend }) {
  const { user, setUser } = useAuth();

  return (
    <>
      {/* Trend Summary Modal */}
      <Modal
        isOpen={selectedStockForTrend !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedStockForTrend(null)}
        size="lg"
      >
        <ModalContent className="relative">
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
                <WatermarkOverlay userId={user?.user_id} email={user?.email} />
                <ModalHeader className="flex flex-col gap-1">
                  Trend Summary:{" "}
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
                          Starting Price
                        </p>
                        <p className="text-lg font-semibold">
                          {selectedStockForTrend?.name.endsWith(".JK")
                            ? "Rp "
                            : "$"}
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
                    Close
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
}

export default StockModal;
