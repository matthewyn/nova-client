import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Button } from "@/components/ui/button";

function StockModal({
  investmentValue,
  setInvestmentValue,
  selectedStock,
  selectedStockForTrend,
  handleSubmit,
}) {
  return (
    <>
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
                      {
                        new Date(selectedStock?.start_date)
                          .toISOString()
                          .split("T")[0]
                      }
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
                    saham {selectedStock?.name.replace(".JK", "")} sesuai dengan
                    analisis kami.
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
                        <p className="text-sm text-foreground/70">Harga Awal</p>
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
    </>
  );
}

export default StockModal;
