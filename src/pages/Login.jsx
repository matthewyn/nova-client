import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Layers3,
  Radar,
} from "lucide-react";
import { Link } from "react-router-dom";
import LoginCard from "@/components/LoginCard";
import Logo from "@/assets/logo.png";
import macroIntelligence from "@/assets/what-you-get/macro-intelligence.webp";
import capitalFlow from "@/assets/what-you-get/capital-flow.webp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const perspectives = [
  {
    quote:
      "Start with the market regime, then narrow the opportunity set with evidence.",
    role: "Portfolio construction",
    context: "A clearer path from context to conviction",
  },
  {
    quote:
      "Bring macro, flows, themes, sectors, and stocks into one repeatable research process.",
    role: "Investment research",
    context: "Less fragmentation across the daily workflow",
  },
  {
    quote:
      "Prioritize the candidates that pass the full research pipeline before deeper review.",
    role: "Opportunity screening",
    context: "More analyst time for the decisions that matter",
  },
];

const marqueeItems = [
  "Macro intelligence",
  "Capital flow",
  "Theme monitoring",
  "Sector rotation",
  "Risk filtering",
  "Stock prioritization",
];

function Login() {
  const pageRef = useRef(null);
  const marqueeRef = useRef(null);
  const [activePerspective, setActivePerspective] = useState(0);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".login-hero-element", {
          y: 28,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });

        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 24,
          repeat: -1,
          ease: "none",
        });

        gsap.utils.toArray(".login-intelligence-image").forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 0.8, opacity: 0.35 },
            {
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: image,
                start: "top 90%",
                end: "center 45%",
                scrub: true,
              },
            },
          );

          gsap.to(image, {
            opacity: 0.2,
            filter: "brightness(0.45)",
            ease: "none",
            scrollTrigger: {
              trigger: image,
              start: "center 25%",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        const words = gsap.utils.toArray(".login-reveal-word");
        gsap.fromTo(
          words,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: ".login-reveal-copy",
              start: "top 82%",
              end: "bottom 48%",
              scrub: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: pageRef },
  );

  const movePerspective = (direction) => {
    setActivePerspective(
      (current) =>
        (current + direction + perspectives.length) % perspectives.length,
    );
  };

  const revealCopy =
    "Nova turns fragmented market information into a structured path from economic context to prioritized investment opportunities.";

  return (
    <main
      ref={pageRef}
      className="login-page w-full max-w-full overflow-x-hidden bg-[#07090d] text-white"
    >
      <section className="relative min-h-screen overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(130,105,255,0.18),transparent_32%),radial-gradient(circle_at_88%_72%,rgba(62,168,255,0.11),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        </div>

        <nav className="login-hero-element relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="grid size-10 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/10">
              <img
                src={Logo}
                alt=""
                className="size-9 object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em]">Nova AI</span>
          </Link>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white hover:text-[#090b10] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Request access
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-20 lg:px-12 lg:pb-32 lg:pt-24">
          <h1 className="login-hero-element max-w-6xl text-balance text-[clamp(3rem,6.4vw,6.8rem)] font-medium leading-[0.93] tracking-[-0.065em]">
            Intelligence before every investment decision.
          </h1>
          <p className="login-hero-element mt-7 max-w-2xl text-pretty text-base leading-7 text-white/58 sm:text-lg">
            Sign in to continue from market context to focused, decision-ready
            research.
          </p>
          <div id="sign-in" className="login-hero-element mt-12 w-full max-w-[31rem]">
            <LoginCard />
          </div>
          <p className="login-hero-element mt-7 text-sm text-white/40">
            Built for focused research, not speculative noise.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-5xl text-balance text-[clamp(2.6rem,5.1vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.055em]">
              Read the market
              <span
                className="mx-3 inline-block h-[0.58em] w-[1.35em] overflow-hidden rounded-full align-[0.04em]"
                aria-hidden="true"
              >
                <img
                  src={macroIntelligence}
                  alt=""
                  className="login-intelligence-image size-full object-cover grayscale contrast-125"
                />
              </span>
              as one connected system.
            </h2>
            <p className="max-w-sm text-base leading-7 text-white/50">
              A unified research environment for the signals that shape an
              institutional investment view.
            </p>
          </div>

          <div className="grid grid-flow-dense grid-cols-1 overflow-hidden rounded-[2rem] border border-white/12 lg:grid-cols-6 lg:grid-rows-2">
            <article className="group relative min-h-[31rem] overflow-hidden border-b border-white/12 lg:col-span-3 lg:row-span-2 lg:border-b-0 lg:border-r">
              <img
                src={capitalFlow}
                alt="Abstract visualization of connected market flows"
                className="login-intelligence-image absolute inset-0 size-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <Radar className="mb-5 size-6 text-violet-300" />
                <h3 className="max-w-md text-3xl font-medium tracking-[-0.04em]">
                  Build context before conviction
                </h3>
                <p className="mt-4 max-w-md leading-7 text-white/58">
                  Connect macro conditions, liquidity, themes, and sector
                  dynamics before prioritizing individual companies.
                </p>
              </div>
            </article>

            <article className="group flex min-h-64 flex-col justify-between overflow-hidden border-b border-white/12 p-8 transition-colors hover:bg-white/[0.04] sm:p-10 lg:col-span-3 lg:row-span-1">
              <div className="flex items-start justify-between gap-6">
                <Layers3 className="size-6 text-sky-300" />
                <span className="text-xs uppercase tracking-[0.16em] text-white/30">
                  Connected system
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-medium tracking-[-0.04em]">
                  One progressive workflow
                </h3>
                <p className="mt-3 max-w-xl leading-7 text-white/50">
                  Move from the broad market environment to a smaller,
                  evidence-backed opportunity set without losing the chain of
                  reasoning.
                </p>
              </div>
            </article>

            {[
              ["Macro", "Frame the regime"],
              ["Sectors", "Rank relative strength"],
              ["Stocks", "Focus deeper review"],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="group min-h-52 overflow-hidden border-b border-white/12 p-7 transition-colors last:border-b-0 hover:bg-white/[0.05] lg:col-span-1 lg:row-span-1 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="block size-1.5 rounded-full bg-violet-300/70" />
                <h3 className="mt-16 text-xl font-medium tracking-[-0.03em]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 py-8">
        <div ref={marqueeRef} className="flex w-max items-center will-change-transform">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center">
              <span className="px-7 text-sm font-medium uppercase tracking-[0.16em] text-white/45 sm:px-10">
                {item}
              </span>
              <span className="size-1 rounded-full bg-violet-400" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <p className="login-reveal-copy mx-auto max-w-6xl text-center text-[clamp(2.5rem,5vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.055em]">
            {revealCopy.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="login-reveal-word inline-block">
                {word}&nbsp;
              </span>
            ))}
          </p>

          <div className="mx-auto mt-28 max-w-5xl border-y border-white/12 py-12 md:mt-40 md:py-16">
            <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="mb-8 flex items-center gap-3 text-sm text-white/40">
                  <ChartNoAxesCombined className="size-4" />
                  <span>{perspectives[activePerspective].role}</span>
                </div>
                <blockquote className="max-w-4xl text-balance text-3xl font-medium leading-tight tracking-[-0.035em] md:text-5xl">
                  {perspectives[activePerspective].quote}
                </blockquote>
                <p className="mt-7 text-sm text-white/40">
                  {perspectives[activePerspective].context}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="Previous perspective"
                  onClick={() => movePerspective(-1)}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-[#07090d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next perspective"
                  onClick={() => movePerspective(1)}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-[#07090d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#f1f0ec] px-5 py-24 text-[#0a0c10] sm:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <h2 className="max-w-4xl text-balance text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.065em]">
              Put better research behind the next decision.
            </h2>
            <Link
              to="/signup"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#0a0c10] px-7 py-4 font-medium text-white transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0c10]"
            >
              Create an account
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-24 flex flex-col gap-5 border-t border-black/15 pt-7 text-sm text-black/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Nova AI. Investment intelligence, structured.</p>
            <div className="flex gap-6">
              <Link to="/terms" className="transition-colors hover:text-black">
                Terms
              </Link>
              <a
                href="mailto:hello@novainvest.ai"
                className="transition-colors hover:text-black"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Login;
