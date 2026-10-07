"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const controlClassName =
  "static inset-auto start-auto end-auto my-0 translate-none";

export function GameGalleryCarousel({ urls }: { urls: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api || paused || urls.length < 2) return;
    const id = window.setInterval(() => api.scrollNext(), 3500);
    return () => window.clearInterval(id);
  }, [api, paused, urls.length]);

  if (urls.length === 0) return null;

  return (
    <section
      className="flex flex-col gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          direction: "rtl",
          loop: urls.length > 1,
        }}
        className="w-full"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">تصاویر بازی</h2>
          {urls.length > 1 ? (
            <div className="flex items-center gap-2">
              <CarouselPrevious className={controlClassName} />
              <CarouselNext className={controlClassName} />
            </div>
          ) : null}
        </div>

        <CarouselContent>
          {urls.map((url) => (
            <CarouselItem
              key={url}
              className="basis-full sm:basis-1/2"
            >
              <div className="overflow-hidden rounded-xl border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="aspect-video w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
