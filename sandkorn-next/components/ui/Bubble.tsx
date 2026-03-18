import type { BubbleKey } from "@/types/company";

const BUBBLE_STYLES: Record<
  BubbleKey,
  { bg: string; text: string; label: string }
> = {
  war: { bg: "#fee2e2", text: "#b91c1c", label: "War funding" },
  pol: { bg: "#fef3c7", text: "#92400e", label: "Political funding" },
  data: { bg: "#ede9fe", text: "#5b21b6", label: "Data exploitation" },
  labour: { bg: "#fce7f3", text: "#9d174d", label: "Labour violations" },
  env: { bg: "#d1fae5", text: "#065f46", label: "Environmental damage" },
  tax: { bg: "#e0e7ff", text: "#3730a3", label: "Tax avoidance" },
  settler: { bg: "#fee2e2", text: "#7f1d1d", label: "Settler economy" },
  mis: { bg: "#fef9c3", text: "#713f12", label: "Misinformation" },
  animal: { bg: "#ecfdf5", text: "#065f46", label: "Animal welfare" },
  indig: { bg: "#fdf4ff", text: "#701a75", label: "Indigenous rights" },
};

interface BubbleProps {
  type: BubbleKey;
}

export function Bubble({ type }: BubbleProps) {
  const s = BUBBLE_STYLES[type];
  return (
    <p
      className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[9px] font-medium whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </p>
  );
}
