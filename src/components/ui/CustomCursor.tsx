"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const INTERACTIVE_SELECTOR =
  "a, button, input, select, textarea, summary, .year-slider, [data-pictogram-row], [data-cursor-groove], [role='button'], [role='link'], [role='tab'], [data-cursor-interactive]";

const HORSE_OFFSET = { x: 18, y: 12 };

function isInteractiveTarget(el: Element | null): boolean {
  if (!el) return false;
  return !!el.closest(INTERACTIVE_SELECTOR);
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const horseRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const horse = useRef({ x: 0, y: 0 });
  const prevHorse = useRef({ x: 0, y: 0 });
  const interactive = useRef(false);
  const hoverCandidate = useRef(false);
  const hoverStable = useRef(0);
  const hoverCheck = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    let frame = 0;

    const placeDot = (x: number, y: number) => {
      if (!dotRef.current) return;
      const scale = interactive.current ? 1.15 : 1;
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const setInteractive = (active: boolean) => {
      if (interactive.current === active) return;
      interactive.current = active;
      horseRef.current?.classList.toggle("custom-cursor-horse--interactive", active);
      dotRef.current?.classList.toggle("custom-cursor-dot--interactive", active);
      ringRef.current?.classList.toggle("custom-cursor-ring--interactive", active);
      placeDot(mouse.current.x, mouse.current.y);
    };

    const show = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
      if (horseRef.current) horseRef.current.style.opacity = "1";
    };

    const hide = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (horseRef.current) horseRef.current.style.opacity = "0";
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      placeDot(e.clientX, e.clientY);
      show();

      const now = performance.now();
      if (now - hoverCheck.current > 48) {
        hoverCheck.current = now;
        const el = e.target instanceof Element ? e.target : null;
        const hit = isInteractiveTarget(el);
        if (hit === hoverCandidate.current) {
          hoverStable.current += 1;
        } else {
          hoverCandidate.current = hit;
          hoverStable.current = 0;
        }
        if (hoverStable.current >= 1) {
          setInteractive(hit);
        }
      }
    };

    const loop = () => {
      const ringLerp = interactive.current ? 0.35 : 0.22;
      const horseLerp = interactive.current ? 0.3 : 0.2;

      const ringX = ring.current.x + (mouse.current.x - ring.current.x) * ringLerp;
      const ringY = ring.current.y + (mouse.current.y - ring.current.y) * ringLerp;
      ring.current = { x: ringX, y: ringY };

      const horseGoalX = mouse.current.x + HORSE_OFFSET.x;
      const horseGoalY = mouse.current.y + HORSE_OFFSET.y;
      const horseX = horse.current.x + (horseGoalX - horse.current.x) * horseLerp;
      const horseY = horse.current.y + (horseGoalY - horse.current.y) * horseLerp;
      const vx = horseX - prevHorse.current.x;
      const tilt = Math.max(-8, Math.min(8, vx * 0.9));

      horse.current = { x: horseX, y: horseY };
      prevHorse.current = { x: horseX, y: horseY };

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (horseRef.current) {
        horseRef.current.style.transform = `translate3d(${horseX}px, ${horseY}px, 0) rotate(${tilt}deg)`;
      }

      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" style={{ opacity: 0 }} aria-hidden />
      <div ref={dotRef} className="custom-cursor-dot" style={{ opacity: 0 }} aria-hidden />
      <div ref={horseRef} className="custom-cursor-horse" style={{ opacity: 0 }} aria-hidden>
        <div className="custom-cursor-horse-inner">
          <Image
            src="/images/cursor/cursorlogo.png"
            alt=""
            width={32}
            height={32}
            priority
            draggable={false}
          />
        </div>
      </div>
    </>
  );
}
