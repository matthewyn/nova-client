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

function Dashboard() {
  const stocksData = [
    {
      name: "BBCA",
      date: "2h ago",
      returnPct: 15,
      summary:
        "BBCA menunjukkan tren positif dengan potensi pertumbuhan yang kuat. Analisis teknikal menunjukkan adanya pola bullish yang dapat memberikan peluang bagi investor untuk mendapatkan keuntungan. Namun, perlu diingat bahwa pasar saham selalu memiliki risiko, dan penting untuk melakukan riset lebih lanjut sebelum membuat keputusan investasi.",
      riskFactor: "medium",
      price: 6430,
      stopLoss: 6000,
      logo: "https://github.com/shadcn.png",
    },
    {
      name: "PTRO",
      date: "2h ago",
      returnPct: 15,
      summary:
        "BBCA menunjukkan tren positif dengan potensi pertumbuhan yang kuat. Analisis teknikal menunjukkan adanya pola bullish yang dapat memberikan peluang bagi investor untuk mendapatkan keuntungan. Namun, perlu diingat bahwa pasar saham selalu memiliki risiko, dan penting untuk melakukan riset lebih lanjut sebelum membuat keputusan investasi.",
      riskFactor: "medium",
      price: 6430,
      stopLoss: 6000,
      logo: "https://github.com/shadcn.png",
    },
    {
      name: "ADMR",
      date: "2h ago",
      returnPct: 15,
      summary:
        "BBCA menunjukkan tren positif dengan potensi pertumbuhan yang kuat. Analisis teknikal menunjukkan adanya pola bullish yang dapat memberikan peluang bagi investor untuk mendapatkan keuntungan. Namun, perlu diingat bahwa pasar saham selalu memiliki risiko, dan penting untuk melakukan riset lebih lanjut sebelum membuat keputusan investasi.",
      riskFactor: "medium",
      price: 6430,
      stopLoss: 6000,
      logo: "https://github.com/shadcn.png",
    },
    {
      name: "PANI",
      date: "2h ago",
      returnPct: 15,
      summary:
        "BBCA menunjukkan tren positif dengan potensi pertumbuhan yang kuat. Analisis teknikal menunjukkan adanya pola bullish yang dapat memberikan peluang bagi investor untuk mendapatkan keuntungan. Namun, perlu diingat bahwa pasar saham selalu memiliki risiko, dan penting untuk melakukan riset lebih lanjut sebelum membuat keputusan investasi.",
      riskFactor: "medium",
      price: 6430,
      stopLoss: 6000,
      logo: "https://github.com/shadcn.png",
    },
    {
      name: "HRTA",
      date: "2h ago",
      returnPct: 15,
      summary:
        "BBCA menunjukkan tren positif dengan potensi pertumbuhan yang kuat. Analisis teknikal menunjukkan adanya pola bullish yang dapat memberikan peluang bagi investor untuk mendapatkan keuntungan. Namun, perlu diingat bahwa pasar saham selalu memiliki risiko, dan penting untuk melakukan riset lebih lanjut sebelum membuat keputusan investasi.",
      riskFactor: "medium",
      price: 6430,
      stopLoss: 6000,
      logo: "https://github.com/shadcn.png",
    },
    {
      name: "BUMI",
      date: "2h ago",
      returnPct: 15,
      summary:
        "BBCA menunjukkan tren positif dengan potensi pertumbuhan yang kuat. Analisis teknikal menunjukkan adanya pola bullish yang dapat memberikan peluang bagi investor untuk mendapatkan keuntungan. Namun, perlu diingat bahwa pasar saham selalu memiliki risiko, dan penting untuk melakukan riset lebih lanjut sebelum membuat keputusan investasi.",
      riskFactor: "medium",
      price: 6430,
      stopLoss: 6000,
      logo: "https://github.com/shadcn.png",
    },
  ];

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
                  <StocksCarousel title="Aset Populer" stocks={stocksData} />
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
