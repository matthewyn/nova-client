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
    trailing_stop: 8800,
    risk_level: "medium",
    summary: `TREND: Bearish — price has slid sharply since mid/late December with momentum turning negative again.
    MOMENTUM: 10-day momentum remains negative and RSI has fallen from low-50s to the low-30s, signaling weakening demand and continued downside risk.
    MA_STRUCTURE: Price is below MA-50, MA-150, and MA-200 with the moving averages still stacked bearishly (MA-50 < MA-150 < MA-200) and not yet converging upward.
    VOLUME: The selloff prints notably heavier volume on down days (notably 2022-12-20 and 2023-01-05), implying conviction behind the drop rather than a light, weak reversal.
    KEY_LEVELS: Support: 1450, 1520, 1530-1540; Resistance: 1560, 1575, 1600, 1665 (MA-50).
    RISK_FACTORS: RSI near the low-30s raises the chance of a short-term oversold bounce, but the dominant structure (below all MAs) keeps rallies suspect.
    PREDICTION_CONTEXT: DOWN — expect a retest of support around 1450 within 7 days, with further downside toward ~1520 as a failure/retest pivot if selling pressure persists (extended range roughly 1400–1530 if momentum continues lower).`,
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
    trailing_stop: 7200,
    risk_level: "high",
    summary: `TREND: Bearish — price has slid sharply since mid/late December with momentum turning negative again.
    MOMENTUM: 10-day momentum remains negative and RSI has fallen from low-50s to the low-30s, signaling weakening demand and continued downside risk.
    MA_STRUCTURE: Price is below MA-50, MA-150, and MA-200 with the moving averages still stacked bearishly (MA-50 < MA-150 < MA-200) and not yet converging upward.
    VOLUME: The selloff prints notably heavier volume on down days (notably 2022-12-20 and 2023-01-05), implying conviction behind the drop rather than a light, weak reversal.
    KEY_LEVELS: Support: 1450, 1520, 1530-1540; Resistance: 1560, 1575, 1600, 1665 (MA-50).
    RISK_FACTORS: RSI near the low-30s raises the chance of a short-term oversold bounce, but the dominant structure (below all MAs) keeps rallies suspect.
    PREDICTION_CONTEXT: DOWN — expect a retest of support around 1450 within 7 days, with further downside toward ~1520 as a failure/retest pivot if selling pressure persists (extended range roughly 1400–1530 if momentum continues lower).`,
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
    trailing_stop: 8000,
    risk_level: "low",
    summary: `TREND: Bearish — price has slid sharply since mid/late December with momentum turning negative again.
    MOMENTUM: 10-day momentum remains negative and RSI has fallen from low-50s to the low-30s, signaling weakening demand and continued downside risk.
    MA_STRUCTURE: Price is below MA-50, MA-150, and MA-200 with the moving averages still stacked bearishly (MA-50 < MA-150 < MA-200) and not yet converging upward.
    VOLUME: The selloff prints notably heavier volume on down days (notably 2022-12-20 and 2023-01-05), implying conviction behind the drop rather than a light, weak reversal.
    KEY_LEVELS: Support: 1450, 1520, 1530-1540; Resistance: 1560, 1575, 1600, 1665 (MA-50).
    RISK_FACTORS: RSI near the low-30s raises the chance of a short-term oversold bounce, but the dominant structure (below all MAs) keeps rallies suspect.
    PREDICTION_CONTEXT: DOWN — expect a retest of support around 1450 within 7 days, with further downside toward ~1520 as a failure/retest pivot if selling pressure persists (extended range roughly 1400–1530 if momentum continues lower).`,
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
    trailing_stop: 4000,
    risk_level: "medium",
    summary: `TREND: Bearish — price has slid sharply since mid/late December with momentum turning negative again.
    MOMENTUM: 10-day momentum remains negative and RSI has fallen from low-50s to the low-30s, signaling weakening demand and continued downside risk.
    MA_STRUCTURE: Price is below MA-50, MA-150, and MA-200 with the moving averages still stacked bearishly (MA-50 < MA-150 < MA-200) and not yet converging upward.
    VOLUME: The selloff prints notably heavier volume on down days (notably 2022-12-20 and 2023-01-05), implying conviction behind the drop rather than a light, weak reversal.
    KEY_LEVELS: Support: 1450, 1520, 1530-1540; Resistance: 1560, 1575, 1600, 1665 (MA-50).
    RISK_FACTORS: RSI near the low-30s raises the chance of a short-term oversold bounce, but the dominant structure (below all MAs) keeps rallies suspect.
    PREDICTION_CONTEXT: DOWN — expect a retest of support around 1450 within 7 days, with further downside toward ~1520 as a failure/retest pivot if selling pressure persists (extended range roughly 1400–1530 if momentum continues lower).`,
  },
];
