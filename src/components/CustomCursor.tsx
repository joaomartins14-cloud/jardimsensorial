import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let ax = mx, ay = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(var(--s,1))`;

      const t = e.target as HTMLElement;
      const clickable = t.closest("a,button,[data-cursor='link']");
      const calm = t.closest("[data-zone='calm']");
      if (dotRef.current) {
        dotRef.current.style.setProperty("--s", clickable ? "1.6" : "1");
        dotRef.current.style.background = calm ? "#7BA7BC" : clickable ? "#C4724A" : "#4A6741";
      }
      if (auraRef.current) {
        auraRef.current.style.animationDuration = calm ? "3.5s" : clickable ? "1.8s" : "2.8s";
        auraRef.current.style.borderColor = calm ? "rgba(123,167,188,0.5)" : clickable ? "rgba(196,114,74,0.5)" : "rgba(74,103,65,0.4)";
      }
    };

    const loop = () => {
      ax += (mx - ax) * 0.12;
      ay += (my - ay) * 0.12;
      if (auraRef.current) auraRef.current.style.transform = `translate(${ax - 14}px, ${ay - 14}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 850);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div ref={auraRef} className="absolute left-0 top-0 h-7 w-7">
        <div
          className="h-full w-full rounded-full border-[1.5px]"
          style={{ borderColor: "rgba(74,103,65,0.4)", animation: "auraBreath 2.8s ease-in-out infinite" }}
        />
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full transition-[background,transform] duration-150"
        style={{ background: "#4A6741" }}
      />
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute block h-8 w-8 rounded-full border-2"
          style={{
            left: r.x - 16, top: r.y - 16,
            borderColor: "rgba(74,103,65,0.6)",
            animation: "ripple 0.8s ease-out forwards",
          }}
        />
      ))}
      <style>{`
        @keyframes auraBreath { 0%,100%{transform:scale(1)} 50%{transform:scale(1.35)} }
        @keyframes ripple { from{opacity:.65;transform:scale(1)} to{opacity:0;transform:scale(3)} }
      `}</style>
    </div>
  );
}
