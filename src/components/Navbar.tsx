import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from "framer-motion";

const LINKS = [
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "o-projeto", label: "O Projeto" },
  { id: "os-sentidos", label: "Os Sentidos" },
  { id: "ods", label: "ODS" },
  { id: "impacto", label: "Impacto" },
];

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16Z" fill="#4A6741" />
      <path d="M4 20C9 15 14 11 20 4" stroke="#2D5016" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21Z" />
    </svg>
  );
}

function WavyDivider() {
  return (
    <svg viewBox="0 0 200 8" className="my-2 h-2 w-full text-[#4A6741]/30" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 4 Q 25 0 50 4 T 100 4 T 150 4 T 200 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const lastY = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 80);
    const delta = y - lastY.current;
    if (y > 200 && delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
    lastY.current = y;
  });

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      <motion.header
        role="navigation"
        aria-label="Menu principal"
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: hidden ? -140 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22, opacity: { duration: 0.5 } }}
        className="fixed left-1/2 top-4 z-50 w-[min(1100px,calc(100%-1.5rem))] -translate-x-1/2"
      >
        <div
          className="relative flex items-center justify-between rounded-full border px-3 shadow-[0_10px_40px_-12px_rgba(47,68,41,0.25)] backdrop-blur-xl transition-all duration-500 md:px-5"
          style={{
            background: "rgba(255,253,245,0.85)",
            borderColor: "rgba(90,120,60,0.18)",
            paddingTop: scrolled ? "0.55rem" : "0.9rem",
            paddingBottom: scrolled ? "0.55rem" : "0.9rem",
            transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0, scale: scrolled ? 0.88 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 pl-1 pr-2"
            aria-label="Ir ao topo — Semeando Inclusão"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#4A6741]/12">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="hidden font-display text-[15px] font-medium leading-none text-[#2D5016] sm:flex sm:flex-col">
              Semeando
              <span className="text-[11px] tracking-[0.18em] text-[#C4622D]">INCLUSÃO</span>
            </span>
          </motion.button>

          {/* Links */}
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
            className="hidden items-center gap-1 lg:flex"
          >
            {LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <motion.li
                  key={l.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative"
                >
                  <a
                    href={`#${l.id}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => { e.preventDefault(); go(l.id); }}
                    className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[15px] font-medium text-[#5a6b52] transition-colors hover:text-[#2D5016] focus-visible:text-[#2D5016] focus-visible:outline-none"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -15, opacity: 0 }}
                      whileHover={{ scale: 1, rotate: 0, opacity: 1 }}
                      animate={isActive ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      className="inline-block"
                    >
                      <Leaf className="h-3.5 w-3.5" />
                    </motion.span>
                    <span>{l.label}</span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 380, damping: 18 }}
                          className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#C4622D]"
                        />
                      )}
                    </AnimatePresence>
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* CTA */}
          <motion.a
            href="#apoie"
            onClick={(e) => { e.preventDefault(); go("apoie"); }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative hidden overflow-hidden rounded-full px-4 py-2 font-display text-sm font-medium text-[#FFF7E8] shadow-[0_8px_20px_-8px_rgba(196,98,45,0.55)] md:flex md:items-center md:gap-2"
            style={{ background: "linear-gradient(135deg,#C4622D 0%,#E07A45 100%)" }}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <motion.span
              whileHover={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Heart className="h-3.5 w-3.5" />
            </motion.span>
            <span className="relative">Quero Apoiar</span>
          </motion.a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-garden-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#4A6741]/10 lg:hidden"
          >
            <svg viewBox="0 0 32 32" className="h-6 w-6 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <motion.path
                animate={open ? { d: "M8 8 Q 16 16 24 24" } : { d: "M6 11 Q 16 9 26 11" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                animate={open ? { d: "M16 16 Q 16 16 16 16", opacity: 0 } : { d: "M6 16 Q 16 14 26 16", opacity: 1 }}
                transition={{ duration: 0.35 }}
              />
              <motion.path
                animate={open ? { d: "M24 8 Q 16 16 8 24" } : { d: "M6 21 Q 16 19 26 21" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </button>

          {/* progress bar */}
          <motion.span
            style={{ scaleX: progress, transformOrigin: "0% 50%" }}
            className="pointer-events-none absolute -bottom-px left-3 right-3 h-[2px] rounded-full bg-[#C4622D]"
          />
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            id="mobile-garden-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 36px) 40px)" }}
            animate={{ clipPath: "circle(160% at calc(100% - 36px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 36px) 40px)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 overflow-hidden lg:hidden"
            style={{ background: "radial-gradient(ellipse at center, rgba(245,240,230,0.98) 0%, rgba(220,235,210,0.98) 100%)" }}
          >
            {/* pollen */}
            <div className="pointer-events-none absolute inset-0">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="absolute block h-2 w-2 rounded-full bg-[#C4622D]/40"
                  style={{
                    left: `${15 + i * 22}%`,
                    bottom: "-20px",
                    animation: `pollen-rise ${8 + i * 1.5}s linear ${i * 1.2}s infinite`,
                  }}
                />
              ))}
            </div>

            <nav className="relative mx-auto flex h-full max-w-md flex-col justify-center px-8 pb-20 pt-24">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
                className="flex flex-col"
              >
                {LINKS.concat({ id: "apoie", label: "Quero Apoiar" }).map((l, i) => {
                  const isActive = active === l.id;
                  return (
                    <motion.li
                      key={l.id}
                      variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <a
                        href={`#${l.id}`}
                        onClick={(e) => { e.preventDefault(); go(l.id); }}
                        aria-current={isActive ? "page" : undefined}
                        className="group flex items-center gap-3 py-3 font-display text-3xl font-medium text-[#2D5016]"
                      >
                        <motion.span
                          initial={{ scale: 0, rotate: -20 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                          animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="inline-block"
                        >
                          <Leaf className="h-6 w-6" />
                        </motion.span>
                        <span className={l.id === "apoie" ? "text-[#C4622D]" : ""}>{l.label}</span>
                      </a>
                      {i < LINKS.length && <WavyDivider />}
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-10 left-0 right-0 text-center font-display italic text-[#5a6b52]"
              >
                Um jardim para todos 🌿
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pollen-rise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(30px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-nav-motion] { transition: opacity 0.2s ease !important; transform: none !important; }
        }
      `}</style>
    </>
  );
}
