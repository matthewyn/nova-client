import { useRef, useState } from "react";
import "@fontsource-variable/outfit";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import Logo from "@/assets/logo.png";
import MacroIntelligenceArt from "@/assets/what-you-get/macro-intelligence.webp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const researchPrinciples = [
  {
    statement: "Research should make evidence easier to review, not harder to audit.",
    context: "Structured intelligence",
  },
  {
    statement: "Conviction becomes useful when risk boundaries remain explicit.",
    context: "Decision discipline",
  },
  {
    statement: "A narrower opportunity set gives analysts more time for deeper work.",
    context: "Research efficiency",
  },
];

const footerGroups = [
  {
    title: "Platform",
    className: "lg:flex-[3]",
    links: [
      { label: "Research workflow", href: "/#what-you-get" },
      { label: "How Nova works", href: "/#how-nova-works" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Access",
    className: "lg:flex-[2]",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/signup" },
      { label: "Contact", href: "mailto:ceo.novainvest@gmail.com" },
    ],
  },
  {
    title: "Governance",
    className: "lg:flex-[2]",
    links: [
      { label: "Terms", to: "/terms" },
      { label: "Risk disclosure", href: "#risk-disclosure" },
      { label: "Methodology", href: "/#how-nova-works" },
    ],
  },
];

function FooterLink({ item }) {
  const className = "group/link flex items-center justify-between gap-3 py-2.5 text-sm text-white/48 transition-colors hover:text-white";
  const content = (
    <>
      <span>{item.label}</span>
      <ArrowUpRight className="size-3.5 shrink-0 translate-y-1 opacity-0 transition-all duration-300 group-hover/link:translate-y-0 group-hover/link:opacity-100" />
    </>
  );

  return item.to ? (
    <Link to={item.to} className={className}>{content}</Link>
  ) : (
    <a href={item.href} className={className}>{content}</a>
  );
}

function Footer() {
  const footerRef = useRef(null);
  const visualRef = useRef(null);
  const [principleIndex, setPrincipleIndex] = useState(0);
  const principle = researchPrinciples[principleIndex];
  const headingWords = "Move from market noise to decision-ready intelligence.".split(" ");

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".footer-reveal-word",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: ".footer-cta",
              start: "top 92%",
              end: "top 46%",
              scrub: true,
            },
          },
        );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          })
          .fromTo(
            visualRef.current,
            { scale: 0.8, opacity: 0.3 },
            { scale: 1, opacity: 1, duration: 0.65, ease: "none" },
          )
          .to(visualRef.current, {
            scale: 0.96,
            opacity: 0.2,
            filter: "grayscale(1) brightness(.6)",
            duration: 0.35,
            ease: "none",
          });
      });

      return () => media.revert();
    },
    { scope: footerRef },
  );

  const showPrinciple = (direction) => {
    setPrincipleIndex((current) => (
      current + direction + researchPrinciples.length
    ) % researchPrinciples.length);
  };

  return (
    <footer ref={footerRef} className="relative w-full max-w-full overflow-x-hidden bg-[#071113] font-['Outfit_Variable',sans-serif] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.11),transparent_28%),radial-gradient(circle_at_88%_68%,rgba(99,102,241,0.09),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto max-w-[96rem] px-5 pb-6 pt-24 sm:px-8 md:pt-32 lg:px-10 lg:pt-40">
        <section className="footer-cta grid grid-flow-dense items-end gap-12 border-b border-white/10 pb-20 lg:grid-cols-12 lg:gap-16 lg:pb-28">
          <div className="lg:col-span-8">
            <p className="max-w-xl text-sm leading-6 text-cyan-100/55">
              Institutional research infrastructure for teams that need a clearer path from fragmented market evidence to focused investment decisions.
            </p>
            <h2 className="mt-8 max-w-5xl font-['Outfit_Variable',sans-serif] text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.86] tracking-[-0.065em]">
              {headingWords.map((word, index) => (
                <span key={`${word}-${index}`} className="footer-reveal-word mr-[0.2em] inline-block">{word}</span>
              ))}
              <span
                ref={visualRef}
                aria-hidden="true"
                className="ml-1 inline-block h-[0.58em] w-[1.35em] overflow-hidden rounded-full bg-cover bg-center align-[0.04em] ring-1 ring-white/15 sm:ml-3"
                style={{ backgroundImage: `url(${MacroIntelligenceArt})` }}
              />
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup" className="group inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#dff7ef] px-6 text-sm font-semibold text-emerald-950 transition-transform duration-300 hover:-translate-y-0.5">
                Explore Nova AI
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a href="mailto:ceo.novainvest@gmail.com" className="inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/8">
                Discuss institutional access
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm sm:p-6 lg:col-span-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200/55">Nova research standard</p>
              <ShieldCheck className="size-4 text-cyan-200/50" />
            </div>
            <blockquote key={principleIndex} className="mt-8 min-h-28 text-xl font-medium leading-7 tracking-[-0.025em] text-white/88">
              “{principle.statement}”
            </blockquote>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              <div><p className="text-xs text-white/35">{principle.context}</p><p className="mt-1 text-[10px] text-white/20">{principleIndex + 1} / {researchPrinciples.length}</p></div>
              <div className="flex gap-2">
                <button type="button" onClick={() => showPrinciple(-1)} aria-label="Previous research principle" className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/55 transition-colors hover:bg-white hover:text-[#071113]"><ChevronLeft className="size-4" /></button>
                <button type="button" onClick={() => showPrinciple(1)} aria-label="Next research principle" className="flex size-9 items-center justify-center rounded-full bg-white text-[#071113] transition-transform hover:scale-105"><ChevronRight className="size-4" /></button>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid grid-flow-dense gap-px overflow-hidden border-b border-white/10 bg-white/10 lg:grid-cols-12">
          <div className="bg-[#071113] py-10 pr-0 sm:pr-8 lg:col-span-5 lg:py-14">
            <Link to="/" className="group inline-flex items-center gap-3">
              <span className="flex size-11 overflow-hidden rounded-xl bg-white p-2"><img src={Logo} alt="" className="size-full object-contain transition-transform duration-700 ease-out group-hover:scale-105" /></span>
              <span><span className="block text-xl font-semibold tracking-[-0.04em]">Nova AI</span><span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">Investment intelligence</span></span>
            </Link>
            <p className="mt-7 max-w-md text-sm leading-6 text-white/42">A research and decision-intelligence platform built to help professional investment teams structure evidence, prioritize opportunities, and preserve risk context.</p>
            <div className="mt-8 flex gap-2">
              <a href="https://www.instagram.com/novainvest.ai/" target="_blank" rel="noopener noreferrer" aria-label="Nova AI on Instagram" className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors hover:bg-white hover:text-[#071113]"><FaInstagram className="size-4" /></a>
              <a href="mailto:ceo.novainvest@gmail.com" aria-label="Email Nova AI" className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/45 transition-colors hover:bg-white hover:text-[#071113]"><Mail className="size-4" /></a>
            </div>
          </div>

          <nav className="flex flex-col gap-px bg-white/10 lg:col-span-7 lg:flex-row" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title} className={`group flex min-h-52 min-w-0 flex-col bg-[#071113] px-0 py-10 transition-[flex,padding] duration-500 ease-out lg:px-8 lg:py-14 lg:hover:flex-[3.5] ${group.className}`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/28">{group.title}</p>
                <div className="mt-6 flex flex-1 flex-col justify-end border-t border-white/8 pt-3 transition-[padding] duration-500 group-hover:pt-6">
                  {group.links.map((item) => <FooterLink key={item.label} item={item} />)}
                </div>
              </div>
            ))}
          </nav>
        </section>

        <div id="risk-disclosure" className="grid gap-6 py-7 text-xs leading-5 text-white/30 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-4xl">Nova AI provides research and decision-support information. It does not guarantee profits, investment outcomes, success rates, or future prediction accuracy. Investment decisions remain subject to market risk and independent professional judgment.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end"><span>© {new Date().getFullYear()} Nova AI</span><Link to="/terms" className="transition-colors hover:text-white">Terms & Conditions</Link></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
