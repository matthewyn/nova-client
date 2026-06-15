import { cn } from "@/lib/utils";

export function BipolarProgress({
  value = 0,
  max = 100,
  className,
  indicatorClassName,
  ...props
}) {
  const clamped = Math.max(-max, Math.min(max, value));

  const fillPct = (Math.abs(clamped) / max) * 50;

  const isPositive = clamped >= 0;

  return (
    <div
      data-slot="progress"
      className={cn(
        "bg-muted relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/40 z-10" />

      {isPositive && (
        <div
          className={cn(
            "absolute top-0 left-1/2 h-full bg-green-500 transition-all rounded-r-full",
            indicatorClassName,
          )}
          style={{ width: `${fillPct}%` }}
        />
      )}

      {!isPositive && (
        <div
          className={cn(
            "absolute top-0 right-1/2 h-full bg-red-500 transition-all rounded-l-full",
            indicatorClassName,
          )}
          style={{ width: `${fillPct}%` }}
        />
      )}
    </div>
  );
}
