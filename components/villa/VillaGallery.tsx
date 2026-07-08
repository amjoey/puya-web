"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

interface VillaGalleryProps {
  images: string[];
  villaName: string;
}

// See UI_UX_SPEC.md > Villa Detail Page > Gallery:
//   Desktop: Large Hero Image + Thumbnail Row
//   Mobile: Swipe Gallery
export function VillaGallery({ images, villaName }: VillaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Mobile: native scroll-snap swipe gallery */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto tablet:hidden">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`${villaName} photo ${index + 1}`}
            className="aspect-4/3 w-[85%] shrink-0 snap-center rounded-xl object-cover"
          />
        ))}
      </div>

      {/* Tablet/Desktop: large hero image + clickable thumbnail row */}
      <div className="hidden tablet:block">
        <img
          src={images[activeIndex]}
          alt={`${villaName} photo ${activeIndex + 1}`}
          className="aspect-16/9 w-full rounded-xl object-cover"
        />
        <div className="mt-3 flex gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1} of ${villaName}`}
              aria-current={index === activeIndex}
              className={cn(
                "aspect-4/3 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                index === activeIndex ? "border-primary" : "border-transparent",
              )}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
