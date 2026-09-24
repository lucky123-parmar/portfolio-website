import { useEffect, useRef } from "react";
import { config } from "../config";
import "./styles/HeroPortrait.css";

const HeroPortrait = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = 0;
    let currentY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let rafId: number;
    let isMouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isMouseActive = true;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = (time: number) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      let targetRotateY = 0;
      let targetRotateX = 0;
      let targetTranslateX = 0;
      let targetTranslateY = 0;

      if (isMouseActive) {
        const normX = (mouseX - centerX) / (window.innerWidth / 2);
        const normY = (mouseY - centerY) / (window.innerHeight / 2);

        // Calculate 3D tilt angles (up to 25 degrees)
        targetRotateY = normX * 22;
        targetRotateX = -normY * 18;
        targetTranslateX = normX * 18;
        targetTranslateY = normY * 14;
      } else {
        // Idle gentle 3D breathing/floating
        targetRotateY = Math.sin(time * 0.0012) * 4;
        targetRotateX = Math.cos(time * 0.001) * 3;
        targetTranslateY = Math.sin(time * 0.0015) * 8;
      }

      currentRotateX = lerp(currentRotateX, targetRotateX, 0.08);
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.08);
      currentX = lerp(currentX, targetTranslateX, 0.08);
      currentY = lerp(currentY, targetTranslateY, 0.08);

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 20px)`;
      }

      if (sheenRef.current && isMouseActive) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const sheenX = ((mouseX - rect.left) / rect.width) * 100;
          const sheenY = ((mouseY - rect.top) / rect.height) * 100;
          sheenRef.current.style.background = `radial-gradient(circle at ${sheenX.toFixed(1)}% ${sheenY.toFixed(1)}%, rgba(255, 255, 255, 0.28) 0%, rgba(194, 164, 255, 0.12) 40%, transparent 70%)`;
          sheenRef.current.style.opacity = "1";
        }
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(-50% + ${(-currentX * 1.4).toFixed(2)}px), calc(-50% + ${(-currentY * 1.4).toFixed(2)}px)) scale(${1 + Math.abs(currentRotateY) * 0.01})`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="hero-3d-portrait-container" ref={containerRef}>
      {/* Dynamic 3D Aura / Background Glow */}
      <div className="hero-3d-glow" ref={glowRef}></div>
      <div className="hero-3d-ring"></div>

      {/* Interactive 3D Card following Cursor */}
      <div className="hero-3d-card" ref={cardRef}>
        <div className="hero-3d-sheen" ref={sheenRef}></div>
        <img
          src={config.developer.avatar || "/images/lucky.jpg"}
          alt={config.developer.fullName}
          className="hero-3d-img"
          loading="eager"
          fetchPriority="high"
        />
        <div className="hero-3d-badge">
          <span className="badge-pulse"></span>
          <span>Open to Opportunities</span>
        </div>
      </div>
    </div>
  );
};

export default HeroPortrait;
