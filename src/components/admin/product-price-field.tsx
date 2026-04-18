"use client";

import { useState, useTransition } from "react";
import { updateProductPrice } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductPriceFieldProps = {
  productId: string;
  productSlug: string;
  initialPrice: number;
};

export function ProductPriceField({ productId, productSlug, initialPrice }: ProductPriceFieldProps) {
  const [value, setValue] = useState(String(initialPrice));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setError(null);
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      setError("Enter a whole number.");
      return;
    }
    startTransition(async () => {
      const result = await updateProductPrice(productId, productSlug, parsed);
      if (!result.success) {
        setError(result.error === "INVALID_PRICE" ? "Price must be a positive integer (PKR)." : result.error);
        return;
      }
      setValue(String(parsed));
    });
  };

  return (
    <div className="flex min-w-0 max-w-56 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={10_000_000}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-9 w-full min-w-0 text-xs"
          aria-label="Price in PKR"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="display-kicker shrink-0 text-[10px]"
          disabled={isPending}
          onClick={save}
        >
          Save
        </Button>
      </div>
      {error ? <p className="text-[10px] text-error">{error}</p> : null}
    </div>
  );
}
