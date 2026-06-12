import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";

const Garden = lazy(() => import("@/components/Garden"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jardim Sensorial Inclusivo de Assaí — Semeando Inclusão" },
      { name: "description", content: "Um lugar onde todos os amigos podem brincar. Projeto de inclusão, afeto e natureza para Assaí — pelas Alunas do 6º Ano." },
      { property: "og:title", content: "Jardim Sensorial Inclusivo de Assaí" },
      { property: "og:description", content: "Semeando inclusão, afeto e bem-estar em Assaí/PR." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Manrope:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    let lenis: any;
    let raf = 0;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    })();
    return () => { cancelAnimationFrame(raf); lenis?.destroy?.(); };
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#F5F0E8] font-display text-2xl text-[#4A6741]">semeando…</div>}>
        <Garden />
      </Suspense>
    </>
  );
}
