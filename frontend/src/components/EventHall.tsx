"use client";

import Image from "next/image";
import { memo, useState, useEffect, useCallback } from "react";
import { SlideLeftButton } from "./utility/Button/SlideLeftButton";
import { SlideRightButton } from "./utility/Button/SlideRightButton";

interface GalleryImage {
  id: number;
  title: string;
  image_url: string;
}

const EventCard = memo(
  ({ imgSrc, isActive }: { imgSrc: string; isActive: boolean }) => (
    <div
      className={`event-card has-before hover:shine transition-opacity duration-700 ${
        isActive ? "opacity-100" : "opacity-0 absolute inset-0"
      }`}
    >
      <div
        className="card-banner img-holder"
        style={{ "--width": "400", "--height": "500" } as React.CSSProperties}
      >
        <div className="relative w-full h-[500px]">
          <Image
            src={imgSrc}
            fill
            alt="Event Hall Images"
            className="object-cover w-full h-full"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  )
);

EventCard.displayName = "EventCard";

export const EventHall = memo(() => {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch gallery images
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gallery");
        const json = await res.json();
        setGallery(json.data || json);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const nextSlide = useCallback(() => {
    if (gallery.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % gallery.length);
  }, [gallery]);

  const prevSlide = useCallback(() => {
    if (gallery.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery]);

  const pauseAutoSlide = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAutoSlide = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Auto slide
  useEffect(() => {
    if (isPaused || gallery.length === 0) return;

    const intervalId = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(intervalId);
  }, [isPaused, nextSlide, gallery]);

  if (gallery.length === 0) {
    return <p className="text-center mt-20">Loading gallery...</p>;
  }

  return (
    <section className="section event bg-black-10">
      <div className="custom-container">
        <p className="section-subtitle label-2 text-center">New Event Hall</p>
        <h2 className="section-title headline-1 text-center">
          Book For An Event
        </h2>

        <div className="relative w-full max-w-none">
          <div className="relative overflow-hidden">
            <div className="relative h-[500px] w-full">
              {gallery.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                    index === currentSlide
                      ? "translate-x-0"
                      : index < currentSlide
                      ? "-translate-x-full"
                      : "translate-x-full"
                  }`}
                >
                  <EventCard
                    imgSrc={event.image_url}
                    isActive={index === currentSlide}
                  />
                </div>
              ))}
            </div>
          </div>

          <SlideLeftButton
            onClick={prevSlide}
            onMouseOver={pauseAutoSlide}
            onMouseOut={resumeAutoSlide}
          />

          <SlideRightButton
            onClick={nextSlide}
            onMouseOver={pauseAutoSlide}
            onMouseOut={resumeAutoSlide}
          />
        </div>
      </div>
    </section>
  );
});

EventHall.displayName = "EventHall";