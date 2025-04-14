import gsap from "gsap"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface AnimationConfig {
  energyLineCount?: number;
  duration?: number;
}

const defaultConfig: AnimationConfig = {
  energyLineCount: 8,
  duration: 1.2,
};

const createEnergyLines = (count: number) => {
  return Array.from({ length: count }).map(() => {
    const line = document.createElement("div");
    line.className = "energy-line";
    document.body.appendChild(line);
    return line;
  });
};

const animateEnergyLines = (lines: HTMLDivElement[]) => {
  lines.forEach((line, index) => {
    gsap.set(line, {
      position: "fixed",
      top: "random(0, 100)%",
      left: "-100px",
      width: "random(150, 300)px",
      height: "2px",
      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
      zIndex: 11,
      opacity: 0,
      rotation: "random(-20, 20)",
      filter: "blur(1px)",
    });

    gsap.to(line, {
      duration: 1,
      opacity: 0.8,
      x: "calc(100vw + 300px)",
      delay: index * 0.1,
      ease: "power2.inOut",
      onComplete: () => line.remove(),
    });
  });
};

const createGlowEffect = (color: string) => {
  const glowOverlay = document.createElement("div");
  glowOverlay.className = "glow-overlay";
  glowOverlay.style.background = `radial-gradient(circle, ${color}40 0%, transparent 70%)`;
  document.body.appendChild(glowOverlay);
  return glowOverlay;
};

export const animatePageIn = (config: AnimationConfig = {}) => {
  const { duration = defaultConfig.duration! } = config;
  const banners = [
    document.getElementById("banner-1"),
    document.getElementById("banner-2"),
    document.getElementById("banner-3"),
    document.getElementById("banner-4"),
  ];

  if (banners.every(banner => banner)) {
    const tl = gsap.timeline();

    // Initial state
    tl.set(banners, {
      yPercent: 0,
      background: "#1a1a1a",
    });

    // Main animation
    tl.to(banners, {
      yPercent: 100,
      stagger: 0.2,
      ease: "power4.inOut",
      duration: duration,
    });

    // Add glow effect
    const glowOverlay = createGlowEffect("#6a6a6a");
    gsap.fromTo(glowOverlay, 
      {
        opacity: 0.8,
        scale: 1.2,
      },
      {
        opacity: 0,
        scale: 1,
        duration: duration,
        ease: "power2.out",
        onComplete: () => glowOverlay.remove()
      }
    );
  }
};

export const animatePageOut = (href: string, router: AppRouterInstance, config: AnimationConfig = {}) => {
  const { 
    energyLineCount = defaultConfig.energyLineCount!, 
    duration = defaultConfig.duration!
  } = config;
  
  const banners = [
    document.getElementById("banner-1"),
    document.getElementById("banner-2"),
    document.getElementById("banner-3"),
    document.getElementById("banner-4"),
  ];

  if (banners.every(banner => banner)) {
    const tl = gsap.timeline();

    // Create and animate energy lines
    const energyLines = createEnergyLines(energyLineCount);
    animateEnergyLines(energyLines);

    // Main animation
    tl.set(banners, {
      yPercent: -100,
      background: "#1a1a1a",
    }).to(banners, {
      yPercent: 0,
      stagger: 0.2,
      ease: "power4.inOut",
      duration: duration,
      onComplete: () => {
        router.push(href);
      },
    });

    // Add shockwave effect
    const shockwave = document.createElement("div");
    shockwave.className = "shockwave";
    shockwave.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.5)40 0%, transparent 70%)`;
    document.body.appendChild(shockwave);

    gsap.fromTo(shockwave,
      {
        scale: 0,
        opacity: 0.8,
      },
      {
        scale: 2.5,
        opacity: 0,
        duration: duration,
        ease: "power2.out",
        onComplete: () => shockwave.remove()
      }
    );
  }
};
