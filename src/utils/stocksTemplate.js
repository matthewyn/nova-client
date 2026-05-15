/**
 * Stock template structure for StocksCarousel component
 * Use this as a reference for the expected data format
 */

export const stockTemplate = {
  name: "String - Stock name (e.g., 'BBCA.JK')",
  start_date: "String - Date in format YYYY-MM-DD",
  logo: "String - URL to stock logo image",
  initial_price: "Number - Initial stock price in Rupiah",
  predicted_pct_change:
    "Number - Predicted percentage change (positive or negative)",
  stop_loss: "Number - Stop loss price in Rupiah",
};

/**
 * Example usage:
 * const stocks = [
 *   {
 *     name: "BBCA.JK",
 *     start_date: "2026-05-15",
 *     logo: "https://example.com/bbca-logo.png",
 *     initial_price: 9150,
 *     predicted_pct_change: 5.2,
 *     stop_loss: 8500,
 *   },
 *   {
 *     name: "BMRI.JK",
 *     start_date: "2026-05-15",
 *     logo: "https://example.com/bmri-logo.png",
 *     initial_price: 7500,
 *     predicted_pct_change: -2.1,
 *     stop_loss: 7000,
 *   },
 * ];
 */

export const exampleStocks = [
  {
    _id: "1",
    name: "ADMR.JK",
    start_date: "2026-05-15",
    logo: "https://assets.stockbit.com/logos/companies/ADMR.png",
    initial_price: 9150,
    predicted_pct_change: 5.2,
    actual_pct_change: 4.8,
    stop_loss: 8500,
  },
  {
    _id: "2",
    name: "PANI.JK",
    start_date: "2026-05-15",
    logo: "https://assets.stockbit.com/logos/companies/PANI.png",
    initial_price: 7500,
    predicted_pct_change: -2.1,
    actual_pct_change: -1.5,
    stop_loss: 7000,
  },
  {
    _id: "3",
    name: "PTRO.JK",
    start_date: "2026-05-15",
    logo: "https://assets.stockbit.com/logos/companies/PTRO.png",
    initial_price: 8200,
    predicted_pct_change: 3.8,
    actual_pct_change: 4.0,
    stop_loss: 7800,
  },
  {
    _id: "4",
    name: "BRMS.JK",
    start_date: "2026-05-15",
    logo: "https://assets.stockbit.com/logos/companies/BRMS.png",
    initial_price: 4150,
    predicted_pct_change: -1.5,
    actual_pct_change: -1.0,
    stop_loss: 3900,
  },
];
