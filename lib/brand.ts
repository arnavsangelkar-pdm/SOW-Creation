import { OrgBrand } from "./schema";

export const DEFAULT_BRAND: OrgBrand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Apex Consulting",
  primaryColor: process.env.NEXT_PUBLIC_BRAND_COLOR || "#6366f1",
  secondaryColor: "#8b5cf6",
  tone: "consultative",
};

export function getBrandStyles(brand: OrgBrand = DEFAULT_BRAND) {
  return {
    "--brand-primary": brand.primaryColor || DEFAULT_BRAND.primaryColor,
    "--brand-secondary": brand.secondaryColor || DEFAULT_BRAND.secondaryColor,
  } as React.CSSProperties;
}

