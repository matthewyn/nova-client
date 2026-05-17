import { useState } from "react";
import GradientMesh from "./assets/gradient-mesh.jpg";
import Gradient from "./assets/gradient.jpg";
import Brms from "./assets/brms.png";
import Admr from "./assets/admr.png";
import Pani from "./assets/pani.png";
import Bumi from "./assets/bumi.png";
import Adro from "./assets/adro.png";
import Indy from "./assets/indy.png";
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
import { TypewriterEffectSmooth } from "./components/ui/typewriter-effect";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import { Card, CardContent } from "./components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";
import { BlurFade } from "./components/ui/blur-fade";
import { HeroGeometric } from "./components/ui/shape-landing-hero";
import Footer from "./components/Footer";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Image,
  User,
} from "@heroui/react";
import SparkleIcon from "./components/SparkleIcon";
import { Logos3 } from "./components/blocks/logos3";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CustomChip from "./components/CustomChip";

const CheckIcon = ({ className = "" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M5 13L9 17L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const comparisonRows = [
  {
    icon: <HiChatBubbleOvalLeftEllipsis size={16} />,
    label: "Akses Chat AI",
    free: "Analisis terbatas",
    pro: "Analisis pasar tanpa batas",
    elite: "Priority quant intelligence",
  },
  {
    icon: <HiChartPie size={16} />,
    label: "Analisis Portofolio",
    free: "Tracking dasar",
    pro: "Analisis portofolio lengkap",
    elite: "AI risk modeling",
  },
  {
    icon: <HiExclamationCircle size={16} />,
    label: "Risk Intelligence",
    free: "-",
    pro: "Analisis risiko portofolio",
    elite: "Simulasi volatilitas & skenario",
  },
  {
    icon: <HiChartBar size={16} />,
    label: "Konteks Pasar",
    free: "Summary dasar",
    pro: "Insight AI",
    elite: "Forecasting analysis mendalam",
  },
  {
    icon: <HiMiniStar size={16} />,
    label: "Fitur Akses Awal",
    free: "-",
    pro: "-",
    elite: "Ya",
  },
];

// Dot grid background pattern (decorative)
const DotGrid = () => (
  <div
    className="absolute right-0 top-0 w-1/2 h-full overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 400"
      preserveAspectRatio="xMaxYMin meet"
    >
      {Array.from({ length: 20 }).map((_, row) =>
        Array.from({ length: 30 }).map((_, col) => {
          const x = col * 17 + 10;
          const y = row * 17 + 10;
          const distFromTopRight = Math.sqrt(
            Math.pow(col - 29, 2) + Math.pow(row, 2),
          );
          const opacity = Math.max(0, 1 - distFromTopRight / 18) * 0.35;
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="3"
              height="3"
              rx="1"
              fill="#a78bfa"
              opacity={opacity}
            />
          );
        }),
      )}
    </svg>
  </div>
);

const demoData = {
  heading: "Trusted by these companies",
  logos: [
    {
      id: "logo-1",
      description: "Ptro",
      image: "https://assets.stockbit.com/logos/companies/PTRO.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-2",
      description: "Pani",
      image: "https://assets.stockbit.com/logos/companies/PANI.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-3",
      description: "Antm",
      image: "https://assets.stockbit.com/logos/companies/ANTM.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-4",
      description: "Brms",
      image: "https://assets.stockbit.com/logos/companies/BRMS.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-5",
      description: "Admr",
      image: "https://assets.stockbit.com/logos/companies/ADMR.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-6",
      description: "Bumi",
      image: "https://assets.stockbit.com/logos/companies/BUMI.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-7",
      description: "Adro",
      image: "https://assets.stockbit.com/logos/companies/ADRO.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-8",
      description: "Medc",
      image: "https://assets.stockbit.com/logos/companies/MEDC.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-9",
      description: "Indy",
      image: "https://assets.stockbit.com/logos/companies/INDY.png",
      className: "h-12 w-auto",
    },
    {
      id: "logo-10",
      description: "Ptba",
      image: "https://assets.stockbit.com/logos/companies/PTBA.png",
      className: "h-12 w-auto",
    },
  ],
};

function App() {
  const { user, setUser } = useAuth();
  const faqItems = [
    {
      title: "Apakah AI ini juga dipakai langsung oleh Foundernya?",
      content:
        "Ya. Nova AI juga digunakan langsung dalam proses transaksi investasi oleh foundernya. Platform ini dirancang untuk membantu investor retail mendapatkan akses ke teknologi yang sama yang digunakan oleh profesional, sehingga mereka dapat membuat keputusan investasi yang lebih terinformasi dan terstruktur.",
    },
    {
      title: "Apakah sinyal AI ini 100% akurat?",
      content:
        "Tidak. Market tetap memiliki risiko dan tidak ada sistem yang selalu benar. Nova AI dirancang untuk meningkatkan probabilitas dan membantu pengguna membaca momentum serta risiko dengan lebih objektif.",
    },
    {
      title: "Apakah saya harus terus menatap layar seharian?",
      content:
        "Tidak. Nova AI membantu menyaring market dan memberikan insight penting sehingga pengguna hanya perlu melihat pilihan saham yang sudah dianalisis, bukan harus memantau semua pergerakan market secara manual.",
    },
    {
      title: "Apakah setiap hari AI akan memberikan rekomendasi saham?",
      content:
        "Nova AI memberikan analisis dan insight berdasarkan kondisi market terkini. Jadi, frekuensi rekomendasi bisa bervariasi tergantung pada dinamika pasar dan peluang yang terdeteksi oleh sistem.",
    },
    {
      title:
        "Apa yang membuat Nova AI berbeda dari indikator gratis di internet?",
      content:
        "Nova AI tidak hanya menggunakan satu indikator teknikal, tetapi menggabungkan LLM, analisis struktur pasar, risk modeling, dan context intelligence dalam satu sistem terintegrasi.",
    },
    {
      title:
        "Saham apa saja yang dianalisis AI ini? Apakah termasuk saham gorengan?",
      content:
        "Nova AI fokus pada beberapa pilihan saham Indonesia yang memiliki likuiditas dan data market yang memadai untuk dianalisis. Model juga dirancang untuk menghindari kondisi market yang terlalu spekulatif atau tidak stabil.",
    },
  ];

  const plans = [
    {
      id: "trial",
      badge: "TRIAL ~ Jelajahi Quant Intelligence",
      tagline: "Investor retail",
      name: "yang baru mulai dengan AI",
      price: 0,
      icon: <HiGift size={16} className="text-white" />,
      iconBg: "bg-gray-800",
      featured: false,
      includedLabel: "Yang termasuk",
      features: [
        "Stockpick AI terbatas (5 saham pertama)",
        "Insight saham dasar",
        "Ringkasan portofolio",
      ],
      buttonLabel: "Mulai Gratis",
      isDisabled: user !== null,
    },
    {
      id: "pro",
      badge: "PRO ~ AI Market Intelligence",
      tagline: "Investor aktif",
      name: "yang membutuhkan insight lebih dalam",
      price: 1000000,
      icon: <HiFire size={16} className="text-white" />,
      iconBg: "bg-cyan-400",
      featured: true,
      includedLabel: "Semua fitur Free, ditambah",
      features: [
        "Stockpick AI tanpa batas",
        "Konteks pasar terkini dan luas",
        "Analisis risiko portofolio",
        "Penjelasan tren pasar",
      ],
      buttonLabel: "Mulai Pro",
      isDisabled: user && user.tier == "pro",
    },
    {
      id: "elite",
      badge: "ELITE ~ Analisis Tingkat Quant",
      tagline: "Investor serius",
      name: "yang ingin insight lebih tajam",
      price: 3000000,
      icon: <HiBolt size={16} className="text-white" />,
      iconBg: "bg-gray-800",
      featured: false,
      includedLabel: "Semua fitur Pro, ditambah",
      features: [
        "Forecast AI dengan analisis lebih mendalam",
        "Analisis volatilitas & simulasi skenario",
        "Insight market premium",
        "Akses awal ke fitur dan model terbaru",
      ],
      buttonLabel: "Mulai Elite",
      isDisabled: true,
    },
  ];

  const words = [
    {
      text: "Dibangun untuk pasar Indonesia",
      className: "text-4xl font-semibold text-cyan-400 leading-tight mb-4",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Pricing header */}
      <div>
        <div className="px-8">
          <div className="relative bg-white px-10 py-12 overflow-hidden border-x-1 border-gray-200/70">
            <DotGrid />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
                <SparkleIcon size={12} />
                Harga
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
                Investasi berbasis AI.
              </h1>
              <TypewriterEffectSmooth words={words} />
              <p className="text-sm text-gray-400 leading-relaxed">
                Nova AI (Neural Optimized Valuation Agent) adalah AI investment
                intelligence yang dirancang untuk membantu investor memahami
                market Indonesia melalui forecasting saham, analisis risiko, dan
                insight berbasis data secara lebih cepat dan efisien.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="grid grid-cols-3 border border-gray-200/70">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={plan.featured ? "" : "bg-gray-300/20"}
                style={
                  plan.featured
                    ? {
                        backgroundImage: `url(${GradientMesh})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                {/* Top section */}
                <div className="m-2 bg-white p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{plan.badge}</p>
                      <p className="text-gray-400 text-xl">{plan.tagline}</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {plan.name}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${plan.iconBg}`}>
                      {plan.icon}
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      Rp. {Number(plan.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">/bulan</span>
                  </div>
                  <Button
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                      plan.featured
                        ? "bg-gray-900 text-white hover:bg-gray-700"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    as={Link}
                    to="/signup"
                    isDisabled={plan.isDisabled}
                  >
                    {plan.buttonLabel}
                  </Button>
                </div>

                {/* Features section */}
                <div className={`p-6 flex-1 rounded-b-xl`}>
                  <p
                    className={`text-xs mb-4 font-medium ${plan.featured ? "text-blue-200" : "text-gray-400"}`}
                  >
                    {plan.includedLabel}
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <CheckIcon
                          className={
                            plan.featured
                              ? "text-cyan-300 flex-shrink-0"
                              : "text-gray-400 flex-shrink-0"
                          }
                        />
                        <span
                          className={`text-sm ${plan.featured ? "text-white" : "text-gray-500"}`}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        {/* Compare plans section */}
        <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70">
            <ContainerScroll>
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
                <SparkleIcon size={12} />
                Bandingkan paket
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Dapatkan insight investasi
              </h2>
              <h2 className="text-4xl font-bold text-cyan-400 mb-4">
                lebih dalam dengan AI
              </h2>
              {/* Comparison table */}
              <div className="mt-12">
                {/* Header */}
                <div className="grid grid-cols-4">
                  <div className="p-4" />
                  {[
                    { label: "GRATIS", key: "free" },
                    { label: "PRO", key: "pro" },
                    { label: "ELITE", key: "elite" },
                  ].map((col, i) => (
                    <div
                      key={col.key}
                      className={`p-4 text-center text-sm font-semibold text-gray-700}`}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>

                {comparisonRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-4 border-b border-gray-200/70`}
                  >
                    <div className="p-4 flex items-center gap-2.5">
                      <span className="text-base">{row.icon}</span>
                      <span className="text-sm text-gray-600 font-medium">
                        {row.label}
                      </span>
                    </div>
                    {[row.free, row.pro, row.elite].map((val, i) => (
                      <div
                        key={i}
                        className={`p-4 text-center text-sm text-gray-500`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ContainerScroll>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              Performa Nova AI
            </div>
            <BlurFade delay={0.15} inView>
              <h2 className="text-4xl font-bold text-gray-900 mb-1">
                Dibangun untuk mengikuti
              </h2>
            </BlurFade>
            <BlurFade delay={0.15 * 2} inView>
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-cyan-400">kekuatan tren market</span>
              </h2>
            </BlurFade>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Nova AI membantu mendeteksi pelemahan tren lebih awal sekaligus
              membiarkan posisi yang kuat terus berjalan agar potensi keuntungan
              dapat berkembang lebih optimal.
            </p>
            <Carousel className="mt-12">
              <CarouselContent>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Alamtri Minerals Indonesia Tbk. (ADMR)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="green"
                            text="13,33%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="30,7%" prefix="3Y:" />
                        </div>
                      </div>
                      <Image src={Admr} alt="Admr performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Adaro Energy Tbk. (ADRO)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip color="green" text="32%" prefix="YTD:" />
                          <CustomChip color="green" text="63,8%" prefix="3Y:" />
                          <CustomChip color="green" text="427%" prefix="5Y:" />
                          <CustomChip color="green" text="950%" prefix="10Y:" />
                        </div>
                      </div>
                      <Image src={Adro} alt="Adaro performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Bumi Resources Tbk. (BUMI)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="red"
                            text="-15,55%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="22,5%" prefix="3Y:" />
                          <CustomChip color="green" text="204%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Bumi} alt="Bumi performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Indika Energy Tbk. (INDY)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="green"
                            text="24,8%"
                            prefix="YTD:"
                          />
                          <CustomChip
                            color="green"
                            text="36,98%"
                            prefix="3Y:"
                          />
                          <CustomChip color="green" text="96%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Indy} alt="Indy performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Pantai Indah Kapuk Dua Tbk. (PANI)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="red"
                            text="-16,98%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="396%" prefix="3Y:" />
                          <CustomChip color="green" text="1121%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Pani} alt="Pani performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card className="p-4">
                    <CardContent className={"text-left"}>
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-xl">
                          Bumi Resources Minerals Tbk. (BRMS)
                        </h3>
                        <div className="flex gap-2">
                          <CustomChip
                            color="red"
                            text="-29,32%"
                            prefix="YTD:"
                          />
                          <CustomChip color="green" text="161%" prefix="3Y:" />
                          <CustomChip color="green" text="269%" prefix="5Y:" />
                        </div>
                      </div>
                      <Image src={Brms} alt="Brms performance" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        {/* <div className="text-center border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
              <SparkleIcon size={12} />
              Testimoni
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1">
              Berinvestasi terasa lebih jelas dengan
            </h2>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-cyan-400">bimbingan yang tepat</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Pengalaman nyata dari orang-orang menggunakan AI untuk
              berinvestasi secara bijak, bukan emosional
            </p>
            <div className="grid grid-cols-4 mt-12 gap-4">
              <Card
                style={{
                  backgroundImage: `url(${Gradient})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="text-white"
              >
                <CardContent className={"text-left"}>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <HiMiniStar
                          key={i}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                  </div>
                  <p className="mt-3">
                    "Biasanya saya harus buka banyak aplikasi dan baca berita
                    satu-satu. Sekarang Nova langsung kasih ringkasan market dan
                    insight saham yang mudah dipahami."
                  </p>
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                      radius: "md",
                    }}
                    description="Investor Saham Retail"
                    name="Andi Pratama"
                    className="mt-20"
                  />
                </CardContent>
              </Card>
              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent className={"text-left"}>
                    <User
                      avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        radius: "md",
                      }}
                      description="Karyawan Swasta"
                      name="Kevin Wijaya"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className={"text-left"}>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <HiMiniStar
                            key={i}
                            className="h-5 w-5 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                    </div>
                    <p className="mt-20">
                      "Fitur AI forecasting-nya membantu saya lebih cepat
                      screening saham tanpa harus analisa semuanya manual."
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
                <Card>
                  <CardContent className={"text-left"}>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <HiMiniStar
                            key={i}
                            className="h-5 w-5 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                    </div>
                    <p className="mt-20">
                      "Saya suka karena insight yang diberikan tidak terlalu
                      rumit. Cocok untuk investor retail yang ingin belajar
                      memahami market."
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className={"text-left"}>
                    <User
                      avatarProps={{
                        src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                        radius: "md",
                      }}
                      description="Mahasiswa"
                      name="Felicia Tan"
                    />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardContent className={"text-left"}>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <HiMiniStar
                          key={i}
                          className="h-5 w-5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                  </div>
                  <p className="mt-3">
                    "Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem error facere quasi accusantium earum laboriosam
                    architecto facilis deserunt consequatur."
                  </p>
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                      radius: "md",
                    }}
                    description="Product Designer"
                    name="Jane Doe"
                    className="mt-20"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div> */}

        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="text-center">
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Beberapa saham pilihan yang dianalisis Nova AI.
              </p>
            </div>
            <Logos3 {...demoData} />
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70 py-12 px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full mb-5">
                <SparkleIcon size={12} />
                Tanya Jawab
              </div>
              <BlurFade delay={0.15} inView>
                <h2 className="text-4xl font-bold text-gray-900 mb-1">
                  Semua yang mungkin
                </h2>
              </BlurFade>
              <BlurFade delay={0.15 * 2} inView>
                <h2 className="text-4xl font-bold mb-4 text-cyan-400">
                  Anda ingin tahu
                </h2>
              </BlurFade>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Kami percaya investor yang terinformasi membuat keputusan lebih
                baik. Berikut adalah jawaban untuk pertanyaan yang paling sering
                kami dengar.
              </p>
            </div>
            <div className="max-w-4/5 mx-auto mt-8">
              <Accordion>
                {" "}
                {faqItems.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    aria-label={faq.title}
                    title={faq.title}
                  >
                    {" "}
                    {faq.content}{" "}
                  </AccordionItem>
                ))}{" "}
              </Accordion>
            </div>
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>

        <div className="border-y-1 border-gray-200/70 px-8">
          <div className="border-x-1 border-gray-200/70">
            <HeroGeometric
              title="Mulailah berinvestasi dengan penuh perhatian"
              paragraph="Pendamping investasi yang tenang dan didukung AI, dirancang untuk membantu Anda merencanakan, melacak, dan memahami uang Anda tanpa gangguan."
            />
          </div>
        </div>

        <div className="px-8">
          <div className="border-x-1 border-gray-200/70">&nbsp;</div>
        </div>
      </div>
    </div>
  );
}

export default App;
