import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import type { HomeBannerType } from "../../../apis/home-api/home-type";

export default function CarouselCustom({ data }: { data: HomeBannerType[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
  }, [api]);

  return (
    <Carousel
      className="w-full rounded-lg overflow-hidden shadow-lg group"
      plugins={[
        Autoplay({
          delay: 5500,
        }),
      ]}
      opts={{
        align: "center",
        loop: false,
      }}
      setApi={setApi}
    >
      <CarouselContent>
        {data?.map((baner) => (
          <CarouselItem key={baner.id}>
            <div className="h-80">
              <img
                src={baner.imageUrl}
                alt={baner.name}
                className="w-full h-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {data?.length > 1 && (
        <>
          <CarouselPrevious className="hidden group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-black/50 cursor-pointer" />
          <CarouselNext className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-black/50 cursor-pointer" />
          <div className="flex justify-center mt-4 space-x-2 absolute bottom-4 w-full">
            {data?.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? "bg-primary scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </Carousel>
  );
}
