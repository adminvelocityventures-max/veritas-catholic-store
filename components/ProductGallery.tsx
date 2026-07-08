"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const safe = images.length > 0 ? images : [];

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {safe.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
          {safe.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 bg-cream border transition-colors ${
                i === active ? "border-oxblood" : "border-line hover:border-gold-soft"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 aspect-square bg-cream border border-line">
        {safe[active] && (
          <Image
            src={safe[active]}
            alt={title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-contain p-8"
          />
        )}
      </div>
    </div>
  );
}
