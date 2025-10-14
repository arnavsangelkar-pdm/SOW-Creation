"use client";

import { PricingTable as PricingType } from "@/lib/schema";
import { calculateTotalCost } from "@/lib/utils";

interface PricingTableProps {
  pricing: PricingType;
}

export function PricingTable({ pricing }: PricingTableProps) {
  const total = calculateTotalCost(pricing);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pricing Model</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {pricing.model === "TM"
              ? "Time & Materials"
              : pricing.model === "Fixed"
              ? "Fixed Price"
              : "Hybrid"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            ${total.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            {pricing.model === "TM" ? "Estimated Total" : "Total"}
          </p>
        </div>
      </div>

      {pricing.tm && (
        <div className="space-y-4">
          <h4 className="font-medium">Time & Materials Breakdown</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 text-sm font-medium">
                  Role
                </th>
                <th className="text-right py-2 px-2 text-sm font-medium">
                  Rate
                </th>
                <th className="text-right py-2 px-2 text-sm font-medium">
                  Est. Hours
                </th>
                <th className="text-right py-2 px-2 text-sm font-medium">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.tm.roles.map((role) => {
                const hours = pricing.tm?.estHoursByRole[role.role] || 0;
                const subtotal = hours * role.rate;

                return (
                  <tr key={role.role} className="border-b">
                    <td className="py-2 px-2 text-sm">{role.role}</td>
                    <td className="py-2 px-2 text-sm text-right">
                      ${role.rate}/{role.currency}
                    </td>
                    <td className="py-2 px-2 text-sm text-right">{hours}</td>
                    <td className="py-2 px-2 text-sm text-right font-medium">
                      ${subtotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pricing.fixed && pricing.fixed.breakdown && (
        <div className="space-y-4">
          <h4 className="font-medium">Fixed Price Breakdown</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 text-sm font-medium">
                  Item
                </th>
                <th className="text-right py-2 px-2 text-sm font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.fixed.breakdown.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-2 text-sm">{item.item}</td>
                  <td className="py-2 px-2 text-sm text-right font-medium">
                    ${item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pricing.notes && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">{pricing.notes}</p>
        </div>
      )}
    </div>
  );
}

