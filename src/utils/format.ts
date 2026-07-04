/**
 * Formats a number as Indian Rupees, e.g. 123456.7 -> "₹1,23,456.70"
 */
export function formatCurrency(value: number, opts?: { signed?: boolean }): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);

  const sign = value < 0 ? "-" : opts?.signed && value > 0 ? "+" : "";
  return `${sign}₹${formatted}`;
}

/**
 * Formats a token quantity, trimming to a sensible number of significant
 * digits so extremely small (dust) balances don't render as 0.
 */
export function formatQuantity(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);

  if (abs < 0.0001) {
    return value.toExponential(2);
  }
  if (abs < 1) {
    return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  }
  if (abs < 1000) {
    return value.toFixed(4);
  }
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

export function formatPrice(value: number): string {
  if (value === 0) return "₹0";
  if (Math.abs(value) < 0.01) {
    return `₹${value.toExponential(2)}`;
  }
  return formatCurrency(value);
}
