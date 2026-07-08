import { Star } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface RatingStarsProps {
  rating: number;
  max?: number;
  className?: string;
}

export function RatingStars({ rating, max = 5, className }: RatingStarsProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "size-4",
            index < Math.round(rating)
              ? "fill-warning text-warning"
              : "fill-none text-border",
          )}
        />
      ))}
    </div>
  );
}
