export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-EG").format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function formatAssociationType(type: string | null): string {
  if (type === "agricultural_credit") return "الائتمان الزراعي";
  if (type === "agricultural_reform") return "الإصلاح الزراعي";
  return "-";
}
