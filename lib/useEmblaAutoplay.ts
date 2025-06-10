// lib/useEmblaAutoplay.ts
"use client"

import Autoplay from "embla-carousel-autoplay"

export const useEmblaAutoplay = () => {
  return Autoplay({ delay: 2000 })
}
