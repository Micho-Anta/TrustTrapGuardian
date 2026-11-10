import React, { Component, Suspense, useState } from "react";

// Muat komponen Particles secara lazy
const LazyParticles = React.lazy(() => import("./Particles"));

// Error boundary sederhana untuk menangkap kegagalan WebGL atau chunk chunk loading
class ParticlesErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Tangani error secara senyap tanpa merusak halaman
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

/**
 * BackgroundFx: Komponen pembungkus latar belakang partikel dekoratif.
 * Hanya dirender pada perangkat yang memadai, desktop (>= 640px), tanpa prefers-reduced-motion,
 * dan eksklusif saat tab "Recognize" aktif.
 */
export default function BackgroundFx({ active = false }) {
  // Hitung kondisi kapabilitas perangkat sekali saat mount
  const [shouldEnable] = useState(() => {
    if (typeof window === "undefined") return false;

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.innerWidth < 640;

    const isLowPower =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 4;

    return !reducedMotion && !isMobile && !isLowPower;
  });

  if (!shouldEnable || !active) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <div style={{ width: "100%", height: "100%" }}>
        <ParticlesErrorBoundary>
          <Suspense fallback={null}>
            <LazyParticles
              particleColors={["#5df0a8", "#3a6cff", "#9fb4ff"]}
              particleCount={120}
              particleSpread={10}
              speed={0.15}
              particleBaseSize={120}
              sizeRandomness={0.8}
              glow={1.0}
              twinkle={0.5}
              drift="up"
              driftSpeed={0.4}
              moveParticlesOnHover={false}
              clickBurst={false}
              pixelRatio={1.5}
              opacity={0.5}
            />
          </Suspense>
        </ParticlesErrorBoundary>
      </div>
    </div>
  );
}
