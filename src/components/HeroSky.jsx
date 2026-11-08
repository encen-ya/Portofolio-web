import { useEffect, useRef } from "react";
import { createHeroSky } from "../lib/hero-sky";

export default function HeroSky() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cleanup = createHeroSky(canvasRef.current);
    return cleanup;
  }, []);

  return <canvas ref={canvasRef} className="hero__sky" aria-hidden="true" />;
}