import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 9999,
  disabled = false,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const parsedValue = Number.parseInt(event.target.value, 10);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    const safeValue = Math.min(Math.max(parsedValue, min), max);
    onChange(safeValue);
  };

  return (
    <div
      className={`inline-flex h-11 items-center overflow-hidden rounded-xl border border-slate-200 bg-white ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-11 items-center justify-center text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Quantity"
        className="h-full w-14 border-x border-slate-200 bg-transparent text-center text-sm font-bold text-slate-900 outline-none"
      />

      <button
        type="button"
        onClick={increase}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className="flex h-full w-11 items-center justify-center text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}