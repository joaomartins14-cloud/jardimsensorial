import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/logo.png";

// ====== imagens fotográficas ======
import imgProblemaOverwhelmed from "@/assets/garden/problema-overwhelmed.jpg";
import imgProblemaCadeirante from "@/assets/garden/problema-cadeirante.jpg";
import imgProblemaPraca from "@/assets/garden/problema-praca.jpg";
import imgDiagAssai from "@/assets/garden/Screenshot_20260611_163437_Gallery.jpg.jpeg";
import imgDiagCriancas from "@/assets/garden/diagnostico-criancas.jpg";
import imgIdeiaMaos from "@/assets/garden/ideia-maos.jpg";
import imgIdeiaJardim from "@/assets/garden/ideia-jardim.jpg";
import imgHotLavanda from "@/assets/garden/hotspot-lavanda.jpg";
import imgHotTexturas from "@/assets/garden/hotspot-texturas.jpg";
import imgHotGramineas from "@/assets/garden/hotspot-gramineas.jpg";
import imgHotCalma from "@/assets/garden/hotspot-calma.jpg";
import imgHotEquilibrio from "@/assets/garden/hotspot-equilibrio.jpg";
import imgHotPancs from "@/assets/garden/hotspot-pancs.jpg";
import imgHotChuva from "@/assets/garden/hotspot-chuva.jpg";
import imgNatPes from "@/assets/garden/natureza-pes.jpg";
import imgPlantaLavanda from "@/assets/garden/planta-lavanda.jpg";
import imgPlantaHortela from "@/assets/garden/planta-hortela.jpg";
import imgPlantaStachys from "@/assets/garden/planta-stachys.jpg";
import imgPlantaPennisetum from "@/assets/garden/planta-pennisetum.jpg";
import imgPlantaPancs from "@/assets/garden/planta-pancs.jpg";
import imgOds3 from "@/assets/garden/ods-3.jpg";
import imgOds4 from "@/assets/garden/ods-4.jpg";
import imgOds10 from "@/assets/garden/ods-10.jpg";
import imgOds11 from "@/assets/garden/ods-11.jpg";
import imgOds17 from "@/assets/garden/ods-17.jpg";
import imgParcPrefeitura from "@/assets/garden/parc-prefeitura.jpg";
import imgParcApae from "@/assets/garden/parc-apae.jpg";
import imgParcEscolas from "@/assets/garden/parc-escolas.jpg";
import imgParcComunidade from "@/assets/garden/parc-comunidade.jpg";
import imgCtaMaos from "@/assets/garden/cta-maos.jpg";

// ============ Pollen Canvas ============
function Pollen() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0;
    const resize = () => { w = c.width = c.offsetWidth * devicePixelRatio; h = c.height = c.offsetHeight * devicePixelRatio; };
    resize(); window.addEventListener("resize", resize);
    const N = 60;
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (1 + Math.random() * 2.5) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      a: 0.3 + Math.random() * 0.5,
      col: ["#C4724A", "#E8C56A", "#9B8EC4", "#4A6741"][Math.floor(Math.random() * 4)],
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.2;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = p.col + Math.floor(p.a * 255).toString(16).padStart(2, "0");
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >{children}</motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now(); const dur = 1800;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(Math.floor(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick); io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("pt-BR")}{suffix}</span>;
}

// ============ Hotspot data ============
type Hotspot = {
  id: string; img: string; title: string; sense: string; body: string;
  color: string; x: number; y: number; pulse: number; calm?: boolean;
};
const HOTSPOTS: Hotspot[] = [
  { id: "lavanda", img: imgHotLavanda, title: "Canteiro da Lavanda & Alecrim", sense: "Olfato", body: "Aromas calmantes para a mente agitada. Lavanda, alecrim e hortelã — plantas neurosseguras.", color: "#9B8EC4", x: 22, y: 22, pulse: 2 },
  { id: "texturas", img: imgHotTexturas, title: "Caminho das Texturas", sense: "Tato", body: "Pedras polidas, madeira, areia e folhas aveludadas (Stachys byzantina). Norma NBR 9050.", color: "#7BA7BC", x: 16, y: 52, pulse: 3 },
  { id: "gramineas", img: imgHotGramineas, title: "Canteiro Elevado — Gramíneas", sense: "Tato & Audição", body: "Tocar e ouvir a natureza. Acessível para cadeirantes. Som ambiente ativável.", color: "#4A6741", x: 38, y: 60, pulse: 2.5 },
  { id: "calma", img: imgHotCalma, title: "Canto da Calma — Nicho", sense: "Regulação", body: "Silêncio que abraça. Interior de tronco oco iluminado. Pranchas PECS disponíveis.", color: "#4A7BA7", x: 78, y: 20, pulse: 4, calm: true },
  { id: "equilibrio", img: imgHotEquilibrio, title: "Tronco do Equilíbrio", sense: "Propriocepção", body: "Sentir o corpo no espaço. Troncos para pular, redes baixas. NBR 16071.", color: "#C4724A", x: 82, y: 56, pulse: 2.6 },
  { id: "pancs", img: imgHotPancs, title: "Horta de PANCs", sense: "Paladar", body: "Plantar e provar com segurança — plantas alimentícias não convencionais.", color: "#7AB87A", x: 28, y: 82, pulse: 2.4 },
  { id: "chuva", img: imgHotChuva, title: "Jardim de Chuva", sense: "Sustentabilidade", body: "Água da chuva irrigando o jardim. Aprender ciclo da água brincando.", color: "#87CEEB", x: 60, y: 84, pulse: 3 },
];

// ============ ODS data ============
const ODS = [
  { n: 3, color: "#4CAF50", img: imgOds3, title: "Saúde e Bem-Estar", quote: "O jardim cuida do corpo e da mente", body: "Estimulação sensorial reduz ansiedade, melhora desenvolvimento motor e emocional.", tag: "Meta 3.4 — Saúde mental e bem-estar" },
  { n: 4, color: "#E53935", img: imgOds4, title: "Educação de Qualidade", quote: "Uma sala de aula que respira", body: "Conecta APAE e escolas em atividades pedagógicas ao ar livre, inclusivas.", tag: "Meta 4.5 — Educação inclusiva" },
  { n: 10, color: "#E91E8C", img: imgOds10, title: "Redução das Desigualdades", quote: "Brincar é direito de todos", body: "Lei 13.146/2015 transformada em realidade concreta em Assaí.", tag: "Meta 10.2 — Inclusão social" },
  { n: 11, color: "#FF9800", img: imgOds11, title: "Cidades Sustentáveis", quote: "Assaí pioneira no Norte Pioneiro", body: "Meta 11.7 ONU: espaços públicos inclusivos, seguros e verdes.", tag: "Meta 11.7 — Espaços universais" },
  { n: 17, color: "#1565C0", img: imgOds17, title: "Parcerias", quote: "Nada disso é feito sozinho", body: "Prefeitura, APAE, escolas, UEL, UTFPR e comunidade unidos.", tag: "Meta 17.17 — Parcerias multissetoriais" },
];

function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
          className="inline-block mr-[0.25em]"
        >{w}</motion.span>
      ))}
    </span>
  );
}

// ============ Page ============
export default function Garden() {
  const [active, setActive] = useState<Hotspot | null>(null);
  const [openOds, setOpenOds] = useState<typeof ODS[number] | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const horizRef = useRef<HTMLDivElement>(null);
  const horizTrack = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: horizRef, offset: ["start start", "end end"] });
  const xTrack = useTransform(hp, [0, 1], ["0%", "-300vw"]);

  const SENTIDOS = [
    { c: "#9B8EC4", t: "Olfato & Paladar", q: "Cheirinhos que acalmam a mente.", img: imgHotLavanda, alt: "Macro de lavanda e alecrim sob luz dourada do entardecer" },
    { c: "#7BA7BC", t: "Tato", q: "Descobrir o mundo com segurança.", img: imgNatPes, alt: "Pés descalços de criança sobre pedras molhadas com bokeh suave" },
    { c: "#4A6741", t: "Audição & Refúgio", q: "Silêncio quando o barulho for muito forte.", img: imgHotCalma, alt: "Interior aconchegante de nicho de madeira com luz quente filtrada" },
    { c: "#C4724A", t: "Propriocepção", q: "Sentir o próprio corpo no espaço.", img: imgHotEquilibrio, alt: "Criança sorrindo equilibrando-se sobre tronco em jardim verde" },
  ];

  const PLANTAS = [
    { n: "Lavanda & Alecrim", s: "Olfato calmante", c: "#9B8EC4", img: imgPlantaLavanda, alt: "Detalhe botânico de lavanda e alecrim em fundo creme", span: "col-span-6 md:col-span-4", h: "h-72 md:h-96", off: "md:mt-0" },
    { n: "Hortelã", s: "Paladar & Olfato", c: "#7AB87A", img: imgPlantaHortela, alt: "Folhas de hortelã frescas com orvalho em fundo creme", span: "col-span-6 md:col-span-3", h: "h-60 md:h-72", off: "md:mt-24" },
    { n: "Stachys byzantina", s: "Tato aveludado", c: "#C4724A", img: imgPlantaStachys, alt: "Folhas aveludadas prateadas de Stachys byzantina em fundo creme", span: "col-span-6 md:col-span-5", h: "h-72 md:h-80", off: "md:mt-12" },
    { n: "Pennisetum", s: "Audição do vento", c: "#E8C56A", img: imgPlantaPennisetum, alt: "Espiga dourada e fofa de capim-do-texas em fundo bege", span: "col-span-6 md:col-span-4 md:col-start-2", h: "h-60 md:h-80", off: "md:mt-16" },
    { n: "Horta PANCs", s: "Paladar + Sustentabilidade", c: "#4A6741", img: imgPlantaPancs, alt: "Conjunto de plantas alimentícias não convencionais com flores comestíveis", span: "col-span-12 md:col-span-6", h: "h-64 md:h-96", off: "md:mt-0" },
  ];

  const PARCERIAS = [
    { c: "#4A6741", t: "O Terreno", d: "Prefeitura de Assaí — espaço público destinado.", img: imgParcPrefeitura, alt: "Fachada de prédio da Prefeitura em cidade do interior do Paraná" },
    { c: "#7BA7BC", t: "A Sabedoria", d: "APAE — experiência clínica e pedagógica.", img: imgParcApae, alt: "Criança concentrada em atividade terapêutica com materiais coloridos" },
    { c: "#E8C56A", t: "As Mãos à Obra", d: "Escolas + Rotary + Comunidade.", img: imgParcEscolas, alt: "Sala de aula iluminada com crianças trabalhando juntas em mesinhas" },
    { c: "#9B8EC4", t: "Comunidade", d: "Mutirões de plantio + UEL + UTFPR.", img: imgParcComunidade, alt: "Várias mãos plantando uma muda em terra escura num mutirão" },
  ];

  return (
    <main className="paper relative min-h-screen bg-[#F5F0E8] text-[#2f4429]">
      {/* ===== 1. HERO ===== */}
      <section ref={heroRef} className="relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-20 h-[60vh] w-[60vh] rounded-full bg-[#4A6741]/25 blur-3xl" />
          <div className="absolute top-10 right-0 h-[55vh] w-[55vh] rounded-full bg-[#9B8EC4]/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[50vh] w-[50vh] rounded-full bg-[#C4724A]/20 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-[40vh] w-[40vh] rounded-full bg-[#7BA7BC]/25 blur-3xl" />
        </div>
        <Pollen />

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
          <motion.img
            src={logo}
            alt="Logo Semeando Inclusão — três crianças entre plantas e símbolos sensoriais"
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="mb-8 h-48 w-48 rounded-full object-cover shadow-[0_30px_80px_-30px_rgba(74,103,65,0.55)] md:h-60 md:w-60"
            fetchPriority="high"
          />
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-[#2f4429] md:text-7xl lg:text-[5.5rem]">
            <Words text="Um lugar onde todos" />
            <br />
            <em className="not-italic text-[#C4724A]"><Words text="os amigos podem brincar." /></em>
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-8 max-w-2xl text-lg text-[#5b6b52] md:text-xl">
              Um projeto de inclusão, afeto e natureza para Assaí — pelas Alunas do 6º Ano.
            </p>
          </Reveal>
          <Reveal delay={0.8}>
            <a
              href="#problema"
              data-cursor="link"
              className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#7BA7BC] px-8 py-4 text-base font-medium text-[#F5F0E8] shadow-[0_20px_50px_-15px_rgba(123,167,188,0.7)] transition-transform hover:scale-105"
            >
              Entre no Jardim
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Reveal>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-[#5b6b52]/60">
            role para descobrir
          </div>
        </motion.div>
      </section>

      {/* ===== 2. PROBLEMA ===== */}
      <section id="problema" className="relative px-6 py-32 md:py-44">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#9B8EC4]">02 — O Problema</p>
          </Reveal>
          <Reveal>
            <h2 className="max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">
              Toda criança tem o direito de brincar. <em className="not-italic text-[#C4724A]">Mas nem todas conseguem.</em>
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <figure className="relative aspect-[4/5] overflow-hidden blob">
                <img src={imgProblemaOverwhelmed} alt="Criança com expressão de sobrecarga sensorial, mãos cobrindo os ouvidos numa praça barulhenta ao entardecer" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f1a14]/90 via-[#2f1a14]/40 to-transparent p-8 text-[#F5F0E8] flex flex-col items-center justify-end pb-40 text-center">
                  <p className="font-display text-2xl md:text-3xl">Sobrecarga sensorial</p>
                  <p className="mt-1 text-sm opacity-90">Crianças com TEA e TDAH ficam sufocadas pelo barulho.</p>
                </div>
              </figure>
            </Reveal>
            <Reveal delay={0.15}>
              <figure className="relative aspect-[4/5] overflow-hidden blob-2">
                <img src={imgProblemaCadeirante} alt="Criança cadeirante de costas diante de longa escada sem rampa em luz natural quente" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2f1a14]/90 via-[#2f1a14]/40 to-transparent p-8 text-[#F5F0E8] flex flex-col items-center justify-end pb-40 text-center">
                  <p className="font-display text-2xl md:text-3xl">Barreiras invisíveis</p>
                  <p className="mt-1 text-sm opacity-90">Sem rampa, sem brincadeira. Sem brincadeira, sem infância.</p>
                </div>
              </figure>
            </Reveal>
          </div>

          {/* praça cinza + balões */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Reveal>
              <figure className="relative h-64 overflow-hidden blob-3 md:col-span-1">
                <img src={imgProblemaPraca} alt="Praça pública vazia de concreto cinza com brinquedo metálico e sem natureza" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a25]/85 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-[#F5F0E8] flex flex-col items-center justify-end pb-25 text-center">
                  <p className="font-display text-xl">A praça comum</p>
                  <p className="text-xs opacity-80">Concreto, ferro, sem afeto.</p>
                </figcaption>
              </figure>
            </Reveal>
            {[
              { c: "#9B8EC4", t: "TEA/TDAH geram sobrecarga sensorial" },
              { c: "#E8C56A", t: "Resultado: isolamento em casa" },
            ].map((b, i) => (
              <Reveal key={i} delay={(i + 1) * 0.12}>
                <div className={`${i % 2 === 0 ? "blob" : "blob-3"} h-64 p-8 backdrop-blur-sm flex items-center`} style={{ background: `${b.c}33` }}>
                  <p className="font-display text-2xl leading-snug" style={{ color: b.c === "#E8C56A" ? "#8a6a1a" : b.c }}>{b.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. DIAGNÓSTICO ===== */}
      <section id="diagnostico" className="relative overflow-hidden px-6 py-32 md:py-44">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A6741]/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#4A6741]">03 — Diagnóstico</p></Reveal>
          <Reveal><h2 className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">Os números nos chamam. <em className="not-italic text-[#4A6741]">Assaí pode responder.</em></h2></Reveal>

          <div className="mt-24 grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-display text-[18vw] leading-[0.85] text-[#4A6741] md:text-[14rem]">
                <Counter to={14} suffix="," />
                <Counter to={4} suffix=" mi" />
              </p>
              <p className="mt-2 text-lg text-[#5b6b52]">brasileiros com deficiência (Censo 2022 — 7,3% da população).</p>
            </div>
            <div className="md:col-span-5 md:pl-8">
              <p className="font-display text-5xl text-[#C4724A] md:text-7xl"><Counter to={2} suffix="," /><Counter to={4} suffix=" mi" /></p>
              <p className="mt-2 text-base text-[#5b6b52]">com Transtorno do Espectro Autista.</p>
            </div>
          </div>

          {/* Paraná + crianças */}
          <Reveal>
            <figure className="mt-24 relative h-[60vh] overflow-hidden blob-2">
              <img src={imgDiagCriancas} alt="Crianças brasileiras diversas brincando juntas ao ar livre, uma usa cadeira de rodas" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f4429]/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col justify-center p-10 text-[#F5F0E8]">
                <p className="font-display text-7xl md:text-9xl"><Counter to={133} /> mil</p>
                <p className="mt-2 text-base opacity-90">paranaenses com deficiência intelectual.</p>
              </figcaption>
            </figure>
          </Reveal>

          {/* Assaí aérea */}
          <Reveal>
            <figure className="mt-12 relative h-[70vh] overflow-hidden blob">
              <img src={imgDiagAssai} alt="Vista aérea de Assaí no Paraná ao entardecer com telhados de cerâmica e campos verdes" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a25]/85 via-[#1f2a25]/30 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-10 text-center text-[#F5F0E8] md:p-16">
                <p className="font-display text-6xl md:text-8xl"><Counter to={13797} /></p>
                <p className="mt-3 text-lg opacity-80">habitantes em Assaí/PR</p>
                <p className="mx-auto mt-6 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
                  "Nossa cidade tem APAE e pode liderar pelo exemplo."
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ===== 4. PRAÇA vs JARDIM ===== */}
      <section className="relative overflow-hidden px-6 py-32 md:py-44">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#C4724A]">04 — A virada</p></Reveal>
          <Reveal><h2 className="max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">Do concreto cinza ao <em className="not-italic text-[#4A6741]">jardim que floresce.</em></h2></Reveal>

          <div className="relative mt-20 grid gap-4 md:grid-cols-2">
            <Reveal>
              <figure className="relative aspect-square overflow-hidden blob">
                <img src={imgProblemaPraca} alt="Praça vazia de concreto sem natureza" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover grayscale" />
                <div className="absolute inset-0 bg-[#2f2f2a]/30" />
                <figcaption className="relative p-10 text-[#F5F0E8] flex flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl">A Praça Comum</p>
                  <ul className="mt-6 space-y-3 opacity-90">
                    <li>— Muito barulho</li>
                    <li>— Brinquedos inacessíveis</li>
                    <li>— Chão duro, pouca natureza</li>
                    <li>— Sem zonas de descanso sensorial</li>
                  </ul>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.15}>
              <figure className="relative aspect-square overflow-hidden blob-2">
                <img src={imgIdeiaJardim} alt="Caminho de madeira sinuoso por jardim sensorial com lavanda e gramíneas" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A6741]/40 via-transparent to-[#9B8EC4]/30" />
                <figcaption className="relative p-10 text-[#F5F0E8] flex flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl drop-shadow-lg">O Jardim Sensorial</p>
                  <ul className="mt-6 space-y-3 drop-shadow">
                    <li>+ Zonas de calma</li>
                    <li>+ Rampas e pisos seguros</li>
                    <li>+ Texturas, cheiros, muito verde</li>
                    <li>+ Cantinhos para regular emoções</li>
                  </ul>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal>
            <p className="mt-16 max-w-3xl font-display text-3xl leading-snug text-[#2f4429] md:text-4xl">
              "O Jardim não é apenas um parque. <em className="not-italic text-[#C4724A]">É um espaço de terapia, educação e inclusão.</em>"
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== 5. A IDEIA ===== */}
      <section id="o-projeto" className="relative px-6 py-4 md:py-6">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#7AB87A]">05 — A ideia</p></Reveal>
          <div className="grid items-center gap-16 md:grid-cols-2">
            <Reveal>
              <figure className="relative aspect-[4/5] overflow-hidden blob">
                <img src={imgIdeiaMaos} alt="Mão de adulto guiando suavemente a mão de uma criança para tocar uma folha aveludada em jardim sensorial" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f2a25]/80 to-transparent p-8 text-[#F5F0E8] flex flex-col items-center justify-end pb-40 text-center">
                  <p className="font-display text-xl">Mão na mão, sentido por sentido.</p>
                </div>
              </figure>
            </Reveal>
            <div>
              <Reveal><h2 className="font-display text-4xl leading-[1.05] md:text-6xl">Plantamos uma semente. <em className="not-italic text-[#C4724A]">Ela cresce com a cidade.</em></h2></Reveal>
              <div className="mt-10 space-y-6">
                {[
                  { c: "#4A6741", t: "ACESSÍVEL", d: "400 m² sem barreiras físicas, rampas suaves, pisos seguros (NBR 9050 + NBR 16071)." },
                  { c: "#9B8EC4", t: "COMUNITÁRIO", d: "Escolas + APAE + famílias + Rotary construindo juntos." },
                  { c: "#7BA7BC", t: "TERAPÊUTICO", d: "Inspirado no Jardim das Sensações de Curitiba e em pesquisas da UFPR 2026." },
                ].map((b, i) => (
                  <Reveal key={i} delay={i * 0.12}>
                    <div className="blob-3 p-6" style={{ background: `${b.c}22` }}>
                      <p className="font-display text-xl tracking-wide" style={{ color: b.c }}>{b.t}</p>
                      <p className="mt-2 text-sm text-[#2f4429]/80">{b.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. MAPA INTERATIVO ===== */}
      <section className="relative overflow-hidden px-6 py-32 md:py-44">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#4A6741]">06 — Mapa do Jardim</p></Reveal>
          <Reveal><h2 className="max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">Toque um cantinho. <em className="not-italic text-[#C4724A]">Descubra um sentido.</em></h2></Reveal>

          <div className="relative mt-16 aspect-[16/10] w-full overflow-hidden blob bg-gradient-to-br from-[#e8e0c8] via-[#dce8c8] to-[#c8d8b8]">
            <img src={imgIdeiaJardim} alt="Vista do jardim sensorial com caminho de madeira entre lavanda e gramíneas" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E8]/40 via-transparent to-[#F5F0E8]/30" />

            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                data-cursor="link"
                data-zone={h.calm ? "calm" : undefined}
                onClick={() => setActive(h)}
                aria-label={`${h.title} — ${h.sense}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span
                  className="absolute inset-0 -m-3 rounded-full"
                  style={{ background: h.color, opacity: 0.4, animation: `pulse ${h.pulse}s ease-in-out infinite` }}
                />
                <span
                  className="relative block h-16 w-16 overflow-hidden rounded-full shadow-xl ring-4 ring-[#F5F0E8] transition-transform duration-500 group-hover:scale-150 md:h-20 md:w-20"
                  style={{ boxShadow: `0 10px 30px -8px ${h.color}aa` }}
                >
                  <img src={h.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2f4429] px-3 py-1 text-[11px] text-[#F5F0E8] opacity-0 transition-opacity group-hover:opacity-100">
                  {h.title.split("—")[0]}
                </span>
              </button>
            ))}
            <style>{`@keyframes pulse {0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.8);opacity:0}}`}</style>
          </div>
        </div>

        {/* modal */}
        <AnimatePresence>
          {active && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setActive(null)}
                className="fixed inset-0 z-40 bg-[#2f4429]/40 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                data-zone={active.calm ? "calm" : undefined}
                className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-hidden bg-[#F5F0E8] shadow-2xl flex flex-col"
                role="dialog" aria-label={active.title}
              >
                <div className="relative h-40 overflow-hidden flex-shrink-0">
                  <img src={active.img} alt={active.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8] via-transparent to-transparent" />
                  <button data-cursor="link" onClick={() => setActive(null)} aria-label="Fechar" className="absolute right-4 top-4 rounded-full bg-[#F5F0E8]/90 p-2 text-[#2f4429] hover:bg-[#F5F0E8]">✕</button>
                </div>
                <div className="px-6 py-4 md:px-8 flex flex-col gap-3">
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: active.color }}>{active.sense}</p>
                  <h3 className="mt-2 font-display text-3xl leading-tight">{active.title}</h3>
                  <p className="mt-6 text-base leading-relaxed text-[#2f4429]/85">{active.body}</p>
                  <div className="mt-8 blob-3 p-5" style={{ background: `${active.color}1f` }}>
                    <p className="text-xs uppercase tracking-widest text-[#2f4429]/60">Áudio da planta</p>
                    <div className="mt-3 grid h-20 w-20 place-items-center rounded-lg bg-[#2f4429] text-[10px] text-[#F5F0E8]">QR</div>
                  </div>
                  <p className="mt-6 text-xs text-[#2f4429]/60">Espaço acessível conforme NBR 9050 e NBR 16071.</p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ===== 7. SCROLL HORIZONTAL — sentidos com fotos ===== */}
      <section id="os-sentidos" ref={horizRef} className="relative h-[900vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div ref={horizTrack} style={{ x: xTrack }} className="flex h-full w-[400vw]">
            {SENTIDOS.map((p, i) => (
              <div key={i} className="relative flex h-full w-screen flex-col items-center justify-end overflow-hidden px-12 pb-24 text-center">
                <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${p.c}ee 0%, ${p.c}66 45%, transparent 80%)` }} />
                <div className="relative z-10 text-[#F5F0E8]">
                  <p className="text-xs uppercase tracking-[0.5em] text-[#F5F0E8]/80">{String(i + 1).padStart(2, "0")} / 04</p>
                  <h3 className="mt-4 font-display text-6xl md:text-8xl drop-shadow-2xl">{p.t}</h3>
                  <p className="mx-auto mt-6 max-w-xl font-display text-2xl italic md:text-3xl drop-shadow-lg">"{p.q}"</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 8. PLANTAS ===== */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#7AB87A]">08 — Plantas terapêuticas</p></Reveal>
          <Reveal><h2 className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">Cada folha tem <em className="not-italic text-[#4A6741]">um propósito.</em></h2></Reveal>

          <div className="relative mt-20 grid grid-cols-12 gap-4 md:gap-8">
            {PLANTAS.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`group relative overflow-hidden ${i % 2 === 0 ? "blob" : "blob-2"} ${p.span} ${p.h} ${p.off}`}
              >
                <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f1a14]/90 via-[#2f1a14]/30 to-transparent p-5 text-[#F5F0E8] flex flex-col items-center justify-end text-center pb-8 transition-all duration-500">
                  <p className="font-display text-xl">{p.n}</p>
                  <p className="text-xs opacity-85">{p.s}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. ODS DOMINÓS ===== */}
      <section id="ods" className="relative overflow-hidden px-6 py-32 md:py-44">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#C4724A]">09 — Agenda 2030</p></Reveal>
          <Reveal><h2 className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">Cinco ODS. <em className="not-italic text-[#C4724A]">Um único jardim.</em></h2></Reveal>

          <div className="relative mt-20 flex flex-wrap items-end justify-center gap-3 md:gap-6">
            {ODS.map((o, i) => (
              <motion.button
                key={o.n}
                data-cursor="link"
                onClick={() => setOpenOds(o)}
                initial={{ rotate: -90, y: -200, opacity: 0 }}
                whileInView={{ rotate: -8 + (i % 2) * 16, y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2, type: "spring", damping: 12, stiffness: 100 }}
                whileHover={{ scale: 1.07, rotate: 0 }}
                aria-label={`ODS ${o.n} — ${o.title}`}
                className="relative h-56 w-36 overflow-hidden rounded-2xl shadow-2xl md:h-64 md:w-44"
                style={{ boxShadow: `0 25px 55px -12px ${o.color}99, 0 0 0 4px ${o.color}` }}
              >
                <img src={o.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${o.color}f0, ${o.color}33 60%, transparent)` }} />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center text-[#F5F0E8]">
                  <p className="text-[10px] uppercase tracking-widest opacity-90">ODS</p>
                  <p className="font-display text-5xl leading-none drop-shadow">{o.n}</p>
                  <p className="mt-2 text-[11px] leading-tight opacity-95">{o.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {openOds && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setOpenOds(null)}
                className="fixed inset-0 z-40 bg-[#2f4429]/50 backdrop-blur-md" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden blob-2 bg-[#F5F0E8] shadow-2xl"
                role="dialog" aria-label={`ODS ${openOds.n}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={openOds.img} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${openOds.color}cc, transparent 70%)` }} />
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute -bottom-0.5 left-0 right-0 h-8 w-full">
                    <path d="M0 40 Q100 0 200 40 T400 40 L400 80 L0 80Z" fill="#F5F0E8" />
                  </svg>
                  <p className="absolute right-6 top-3 font-display text-[7rem] leading-none text-[#F5F0E8]/30">{openOds.n}</p>
                </div>
                <div className="p-8 md:p-10">
                  <p className="text-xs uppercase tracking-widest" style={{ color: openOds.color }}>ODS {openOds.n}</p>
                  <h3 className="mt-2 font-display text-3xl">{openOds.title}</h3>
                  <p className="mt-4 font-display text-xl italic text-[#2f4429]/80">"{openOds.quote}"</p>
                  <p className="mt-4 text-base leading-relaxed text-[#2f4429]/85">{openOds.body}</p>
                  <p className="mt-6 inline-block rounded-full px-4 py-1.5 text-xs" style={{ background: `${openOds.color}22`, color: openOds.color }}>{openOds.tag}</p>
                  <div className="mt-8 flex items-center justify-between">
                    <a href="https://brasil.un.org/pt-br/sdgs" target="_blank" rel="noreferrer" data-cursor="link" className="text-sm underline" style={{ color: openOds.color }}>Saiba mais — Agenda 2030 ONU →</a>
                    <button data-cursor="link" onClick={() => setOpenOds(null)} className="rounded-full p-2 hover:bg-[#2f4429]/10">✕</button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* ===== 10. PARCERIAS ===== */}
      <section className="relative px-6 py-16 md:py-22">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#9B8EC4]">10 — Parcerias</p></Reveal>
          <Reveal><h2 className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">A mochila com <em className="not-italic text-[#C4724A]">tudo que precisamos.</em></h2></Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {PARCERIAS.map((b, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className={`group relative h-72 overflow-hidden ${i % 2 ? "blob-3" : "blob"} md:h-96`}>
                  <img src={b.img} alt={b.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a25]/90 via-[#1f2a25]/30 to-transparent" />
                  <figcaption className="absolute inset-0 p-7 text-[#F5F0E8] flex flex-col items-center justify-end text-center pb-10" style={{ borderBottom: `4px solid ${b.c}` }}>
                    <p className="font-display text-2xl" style={{ color: b.c }}>{b.t}</p>
                    <p className="mt-1 text-sm opacity-90">{b.d}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-16 blob bg-gradient-to-r from-[#E8C56A]/40 to-[#C4724A]/40 p-10 text-center">
              <p className="font-display text-3xl text-[#2f4429] md:text-4xl">R$ 35.000 a R$ 80.000 <span className="text-[#5b6b52]">para começar.</span></p>
              <p className="mt-3 text-sm text-[#5b6b52]">Materiais reciclados, plantas locais, mão de obra comunitária.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== 11. IMPACTO ===== */}
      <section id="impacto" className="relative px-6 py-32 md:py-44">
        <div className="mx-auto max-w-6xl">
          <Reveal><p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#7AB87A]">11 — Impacto</p></Reveal>
          <Reveal><h2 className="max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">Termômetros de <em className="not-italic text-[#C4724A]">felicidade.</em></h2></Reveal>

          <div className="mt-16 space-y-10">
            {[
              { t: "Regulação emocional", v: 85, g: "linear-gradient(90deg,#9B8EC4,#7BA7BC,#4A6741)" },
              { t: "Amizade & convivência", v: 92, g: "linear-gradient(90deg,#E8C56A,#C4724A,#7AB87A)" },
              { t: "Pertencimento comunitário", v: 78, g: "linear-gradient(90deg,#7BA7BC,#9B8EC4,#4A6741)" },
            ].map((b, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-display text-2xl">{b.t}</p>
                    <p className="text-sm text-[#5b6b52]">meta: {b.v}%</p>
                  </div>
                  <div className="relative h-6 overflow-hidden rounded-full bg-[#e8e0d2]">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${b.v}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
                      className="h-full rounded-full" style={{ background: b.g }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal><p className="mt-12 max-w-2xl font-display text-2xl text-[#2f4429]/80">"Vamos acompanhar tudo de perto com os professores!"</p></Reveal>
        </div>
      </section>

      {/* ===== 12. CTA FINAL ===== */}
      <section id="apoie" className="relative overflow-hidden px-6 py-32 md:py-44">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-[40vh] w-[40vh] rounded-full bg-[#4A6741]/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-[40vh] w-[40vh] rounded-full bg-[#C4724A]/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative mx-auto h-[55vh] w-full max-w-3xl overflow-hidden blob-2"
          >
            <img src={imgCtaMaos} alt="Mãos diversas de adulto e criança segurando uma muda viva com terra e raízes, luz quente natural" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a25]/55 via-transparent to-transparent" />
          </motion.div>
          <Reveal><h2 className="mt-10 font-display text-4xl leading-[1.05] md:text-7xl">Assaí pode ser a <em className="not-italic text-[#C4724A]">pioneira</em> no Norte Pioneiro.</h2></Reveal>
          <Reveal delay={0.2}><p className="mx-auto mt-8 max-w-2xl text-lg text-[#5b6b52]">Este não é apenas um projeto de escola. É um legado real para a 4ª Jornada dos Desafios ODS.</p></Reveal>
          <Reveal delay={0.4}>
            <a href="#top" data-cursor="link"
              className="mt-12 inline-flex items-center gap-3 rounded-full bg-[#4A6741] px-10 py-5 text-lg font-medium text-[#F5F0E8] shadow-[0_25px_60px_-15px_rgba(74,103,65,0.7)] transition-transform hover:scale-105">
              Vamos plantar inclusão juntos?
            </a>
          </Reveal>
        </div>
      </section>

      {/* ===== 13. FOOTER ===== */}
      <footer className="relative bg-[#2f4429] px-6 py-20 text-[#F5F0E8]">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Semeando Inclusão" className="h-16 w-auto rounded-full object-cover" />
            <div>
              <p className="font-display text-xl leading-tight">Semeando<br />Inclusão</p>
              <p className="text-xs opacity-70">Alunas do 6º Ano — Assaí/PR</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">Orientação</p>
            <p className="mt-3 font-display text-lg">Profª Sara Thais Barros Martins</p>
            <p className="text-sm opacity-80">Arq. Urbanista · Esp. Educação Especial</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-70">Ideathon</p>
            <p className="mt-3 font-display text-lg">Assaí 2026</p>
            <p className="text-sm opacity-80">4ª Jornada dos Desafios ODS</p>
            <p className="mt-1 text-xs opacity-60">Secretaria de Inovação de Assaí — Vale do Sol</p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-[#F5F0E8]/15 pt-6 text-center text-xs opacity-60">
          Feito com afeto, natureza e muita pesquisa. © 2026
        </div>
      </footer>
    </main>
  );
}
