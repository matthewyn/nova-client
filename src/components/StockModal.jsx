import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import WatermarkOverlay from "@/components/WatermarkOverlay";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const parseSummary = (summaryText) => {
  if (!summaryText) return {};

  const sections = {};
  let currentKey = null;
  let currentValue = [];

  const saveCurrentSection = () => {
    if (!currentKey) return;
    sections[currentKey] = currentValue.join("\n").trim();
  };

  String(summaryText)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((line) => {
      const headerMatch = line.match(/^\s*([A-Z][A-Z0-9_]{2,}):\s*(.*)$/);

      if (headerMatch) {
        saveCurrentSection();
        currentKey = headerMatch[1];
        currentValue = headerMatch[2] ? [headerMatch[2].trim()] : [];
        return;
      }

      if (currentKey) {
        currentValue.push(line.trim());
      }
    });

  saveCurrentSection();

  return sections;
};

function StockModal({ selectedStockForTrend, setSelectedStockForTrend }) {
  const { user } = useAuth();

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
            const summaryData = parseSummary(selectedStockForTrend?.summary);
            const summaryEntries = Object.entries(summaryData);

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
                          {selectedStockForTrend?.country === "Indonesia"
                            ? "Rp "
                            : "$"}
                          {selectedStockForTrend?.initial_price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Summary Sections */}
                    {summaryEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 rounded-lg bg-muted space-y-2"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                          {value}
                        </p>
                      </div>
                    ))}

                    {!summaryEntries.length && selectedStockForTrend?.summary && (
                      <div className="p-3 rounded-lg bg-muted space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          Summary
                        </p>
                        <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                          {selectedStockForTrend.summary}
                        </p>
                      </div>
                    )}
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
