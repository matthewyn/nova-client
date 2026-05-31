import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const StatItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

function ScenarioPriceBar({ currentPrice, bullPrice, basePrice, bearPrice }) {
  const min = bearPrice;
  const max = bullPrice;
  const range = max - min;
  const pct = (val) => `${((val - min) / range) * 100}%`;

  return (
    <div style={{ position: "relative", padding: "32px 0 24px" }}>
      <div
        style={{
          height: 4,
          background: "#e2e8f0",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* Bear dot */}
        <div
          style={{
            position: "absolute",
            left: pct(bearPrice),
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#fca5a5",
            border: "1.5px solid #ef4444",
          }}
        />

        {/* Current dot */}
        <div
          style={{
            position: "absolute",
            left: pct(currentPrice),
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "hsl(var(--card))",
            border: "2.5px solid #64748b",
          }}
        />

        {/* Base dot */}
        <div
          style={{
            position: "absolute",
            left: pct(basePrice),
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#94a3b8",
            border: "1.5px solid hsl(var(--muted-foreground))",
          }}
        />

        {/* Bull dot */}
        <div
          style={{
            position: "absolute",
            left: pct(bullPrice),
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#86efac",
            border: "1.5px solid #22c55e",
          }}
        />

        {/* Current callout — above */}
        <div
          style={{
            position: "absolute",
            left: pct(currentPrice),
            bottom: "calc(100% + 10px)",
            transform: "translateX(-50%)",
            background: "#f8fafc",
            border: "0.5px solid #e2e8f0",
            borderRadius: 6,
            padding: "3px 8px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            Sekarang{" "}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "hsl(var(--foreground))",
            }}
          >
            Rp {currentPrice.toLocaleString()}
          </span>
          <div
            style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 1,
              height: 5,
              background: "#cbd5e1",
            }}
          />
        </div>

        {/* Base callout — below */}
        <div
          style={{
            position: "absolute",
            left: pct(basePrice),
            top: "calc(100% + 10px)",
            transform: "translateX(-50%)",
            background: "#f8fafc",
            border: "0.5px solid #e2e8f0",
            borderRadius: 6,
            padding: "3px 8px",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: 1,
              height: 5,
              background: "#cbd5e1",
            }}
          />
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            Base{" "}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "hsl(var(--foreground))",
            }}
          >
            Rp {basePrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bear / Bull floor labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 26,
        }}
      >
        <div>
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            Bear{" "}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#ef4444" }}>
            Rp {bearPrice.toLocaleString()}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
            Bull{" "}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#22c55e" }}>
            Rp {bullPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductRevealCard({
  id,
  name,
  targetPct,
  isMostProbable = false,
  targetPrice,
  image,
  probability,
  reasons = [],
  enableAnimations = true,
  className,
  currentPrice,
  bullPrice,
  basePrice,
  bearPrice,
}) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const containerVariants = {
    rest: {
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
    hover: shouldAnimate
      ? {
          scale: 1.03,
          y: -8,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          },
        }
      : {},
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const overlayVariants = {
    rest: {
      y: "100%",
      opacity: 0,
      filter: "blur(4px)",
    },
    hover: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const contentVariants = {
    rest: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  };

  const buttonVariants_motion = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate
      ? {
          scale: 1.05,
          y: -2,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
          },
        }
      : {},
    tap: shouldAnimate ? { scale: 0.95 } : {},
  };

  const favoriteVariants = {
    rest: { scale: 1, rotate: 0 },
    favorite: {
      scale: [1, 1.3, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      data-slot="product-reveal-card"
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative rounded-2xl border border-border/50 bg-card text-card-foreground overflow-hidden",
        "shadow-lg shadow-black/5 cursor-pointer group",
        className,
      )}
      key={id}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="h-56 w-full object-cover"
          variants={imageVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
        >
          {name}
        </motion.div>
      </div>
      <div className="p-6 space-y-3">
        <div className="space-y-1">
          <motion.h3
            className="text-xl font-bold leading-tight tracking-tight"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {targetPct}%
            </span>
          </div>
          <div className="my-4 h-px w-full bg-border" />
          <div className="flex justify-between">
            <StatItem label="Probabilitas" value={`${probability}%`} />
            <StatItem label="Target" value={`Rp ${targetPrice}`} />
          </div>
          <ScenarioPriceBar
            currentPrice={currentPrice}
            bullPrice={bullPrice}
            basePrice={basePrice}
            bearPrice={bearPrice}
          />
        </div>
      </div>
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-background/96 backdrop-blur-xl flex flex-col justify-end"
      >
        <div className="p-6 space-y-4">
          {/* Product Description */}
          <motion.div variants={contentVariants}>
            <h4 className="font-semibold mb-2">Detail Skenario</h4>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {reasons.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tidak ada alasan yang tersedia.
                </p>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <div className="font-semibold">{probability}%</div>
                <div className="text-muted-foreground">Probabilitas</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-2 text-center">
                <div className="font-semibold">Rp {targetPrice}</div>
                <div className="text-muted-foreground">Target Harga</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
