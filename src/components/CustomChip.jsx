import { Chip } from "@heroui/react";

function CustomChip({ color, text, prefix }) {
  return color === "green" ? (
    <Chip
      size="sm"
      className="font-bold bg-green-500/10 border border-green-500"
    >
      <span className="font-bold">
        {prefix} <span className="text-green-700">{text}</span>
      </span>
    </Chip>
  ) : (
    <Chip size="sm" className="font-bold bg-red-500/10 border border-red-500">
      <span className="font-bold">
        {prefix} <span className="text-red-700">{text}</span>
      </span>
    </Chip>
  );
}

export default CustomChip;
