import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateTotalCost(pricing: any): number {
  if (pricing.model === "Fixed" && pricing.fixed) {
    return pricing.fixed.total;
  }

  if (pricing.tm && pricing.tm.roles && pricing.tm.estHoursByRole) {
    let total = 0;
    pricing.tm.roles.forEach((role: any) => {
      const hours = pricing.tm.estHoursByRole[role.role] || 0;
      total += hours * role.rate;
    });
    return total;
  }

  return 0;
}

