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

export default DotGrid;
