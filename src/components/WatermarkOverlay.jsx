function WatermarkOverlay({ userId, email }) {
  const text = `${email} • ${userId}`;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-50"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <span
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              top: `${row * 18}%`,
              left: `${col * 28 - 5}%`,
              transform: "rotate(-25deg)",
              fontSize: "11px",
              color: "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
              userSelect: "none",
              fontFamily: "monospace",
            }}
          >
            {text}
          </span>
        )),
      )}
    </div>
  );
}

export default WatermarkOverlay;
