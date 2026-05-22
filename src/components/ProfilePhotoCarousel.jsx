import { useState } from "react";

const placeholderPhotos = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop",
];

export default function ProfilePhotoCarousel({ photos, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayPhotos = photos?.length > 0 ? photos : placeholderPhotos;
  const currentPhoto = displayPhotos[currentIndex];
  const src = typeof currentPhoto === "string" ? currentPhoto : currentPhoto?.src;
  const alt = typeof currentPhoto === "string" ? "Profile" : currentPhoto?.alt || "Profile";
  const objectPosition = typeof currentPhoto === "string" ? "center" : currentPhoto?.objectPosition || "center";

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ objectPosition }}
      />

      {/* Dots */}
      <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5">
        {displayPhotos.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      {displayPhotos.length > 1 && (
        <>
          <div
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((p) => (p === 0 ? displayPhotos.length - 1 : p - 1)); }}
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
          />
          <div
            onClick={(e) => { e.stopPropagation(); setCurrentIndex((p) => (p === displayPhotos.length - 1 ? 0 : p + 1)); }}
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
          />
        </>
      )}
    </div>
  );
}
