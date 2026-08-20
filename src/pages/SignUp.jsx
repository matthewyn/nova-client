import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";
import SignUpCard from "@/components/SignUpCard";
import scenarioAnalysis from "@/assets/what-you-get/scenario-analysis.webp";
import sectorRotation from "@/assets/what-you-get/sector-rotation.webp";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const researchPrinciples = [
  {
    title: "Begin with context",
    copy: "Understand the market environment before narrowing the opportunity set.",
  },
  {
    title: "Follow the evidence",
    copy: "Connect capital flows, themes, sectors, fundamentals, and risk signals.",
  },
  {
    title: "Focus the decision",
    copy: "Prioritize the candidates that merit deeper analyst attention.",
  },
];

const perspectives = [
  {
    quote: "A research workspace should make complexity navigable, not hide it.",
    context: "Structured intelligence for investment teams",
  },
  {
    quote: "The strongest investment view begins with a clear chain of evidence.",
    context: "Context, prioritization, and disciplined review",
  },
  {
    quote: "Better coverage matters when it leads to better-focused decisions.",
    context: "Expand the research lens without adding noise",
  },
];

const marqueeItems = [
  "Market context",
  "Theme intelligence",
  "Capital allocation",
  "Sector leadership",
  "Risk discipline",
  "Focused research",
];

function NovaBrand() {
  return (
    <Link
      to="/"
      aria-label="Nova AI home"
      className="group flex items-center gap-3.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[0.85rem] border border-white/15 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-500 group-hover:border-cyan-200/45 group-hover:bg-white/[0.11]">
        <span className="absolute -right-3 -top-3 size-7 rounded-full bg-cyan-300/35 blur-lg transition-transform duration-700 group-hover:scale-150" />
        <svg
          viewBox="0 0 44 44"
          aria-hidden="true"
          className="relative size-full transition-transform duration-700 ease-out group-hover:scale-105"
        >
          <defs>
            <linearGradient id="signup-nova-mark" x1="9" y1="34" x2="35" y2="10">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#a5f3fc" />
            </linearGradient>
          </defs>
          <path
            d="M11 31.5V12.5L33 31.5V12.5"
            fill="none"
            stroke="url(#signup-nova-mark)"
            strokeWidth="3.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="33" cy="12.5" r="2.25" fill="#a5f3fc" />
        </svg>
      </span>
      <span className="flex flex-col text-left">
        <span className="text-[1.08rem] font-semibold leading-none tracking-[-0.035em] text-white">
          NOVA
        </span>
        <span className="mt-1.5 hidden text-[0.56rem] font-medium uppercase leading-none tracking-[0.2em] text-white/38 sm:block">
          Investment intelligence
        </span>
      </span>
    </Link>
  );
}

function SignUp() {
  const pageRef = useRef(null);
  const marqueeRef = useRef(null);
  const [activePerspective, setActivePerspective] = useState(0);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".signup-hero-element", {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });

        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 26,
          repeat: -1,
          ease: "none",
        });

        gsap.utils.toArray(".signup-intelligence-image").forEach((image) => {
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
                end: "center 48%",
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
              start: "center 24%",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        gsap.fromTo(
          gsap.utils.toArray(".signup-reveal-word"),
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: ".signup-reveal-copy",
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
    "Build a repeatable research process that moves from broad market context to the opportunities worth your attention.";

  return (
    <main
      ref={pageRef}
      className="signup-page w-full max-w-full overflow-x-hidden bg-[#071013] text-white"
    >
      <section className="relative min-h-screen overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(50,200,210,0.15),transparent_32%),radial-gradient(circle_at_12%_75%,rgba(77,126,255,0.12),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        </div>

        <nav className="signup-hero-element relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <NovaBrand />
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-5 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:bg-white hover:text-[#071013] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Client sign in
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-5 pb-24 pt-14 text-center sm:px-8 sm:pt-20 lg:px-12 lg:pb-32 lg:pt-24">
          <h1 className="signup-hero-element max-w-6xl text-balance text-[clamp(3rem,6.2vw,6.7rem)] font-medium leading-[0.93] tracking-[-0.065em]">
            Build your investment intelligence workspace.
          </h1>
          <p className="signup-hero-element mt-7 max-w-2xl text-pretty text-base leading-7 text-white/58 sm:text-lg">
            Create your account to turn fragmented market signals into a
            clearer, structured research process.
          </p>
          <div className="signup-hero-element mt-12 w-full max-w-[37rem]">
            <SignUpCard />
          </div>
          <p className="signup-hero-element mt-7 max-w-md text-sm leading-6 text-white/40">
            Account verification protects access to your private research
            workspace.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-5xl text-balance text-[clamp(2.6rem,5vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.055em]">
              Research with the whole
              <span
                className="mx-3 inline-block h-[0.58em] w-[1.35em] overflow-hidden rounded-full align-[0.04em]"
                aria-hidden="true"
              >
                <img
                  src={sectorRotation}
                  alt=""
                  className="signup-intelligence-image size-full object-cover grayscale contrast-125"
                />
              </span>
              market in view.
            </h2>
            <p className="max-w-sm text-base leading-7 text-white/50">
              Nova connects the layers of institutional research so each
              decision retains its context.
            </p>
          </div>

          <div className="grid grid-flow-dense grid-cols-1 overflow-hidden rounded-[2rem] border border-white/12 lg:grid-cols-6 lg:grid-rows-2">
            <article className="group relative min-h-[31rem] overflow-hidden border-b border-white/12 lg:col-span-3 lg:row-span-2 lg:border-b-0 lg:border-r">
              <img
                src={scenarioAnalysis}
                alt="Abstract scenario intelligence visualization"
                className="signup-intelligence-image absolute inset-0 size-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071013] via-[#071013]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <Compass className="mb-5 size-6 text-cyan-200" />
                <h3 className="max-w-md text-3xl font-medium tracking-[-0.04em]">
                  Move from signals to direction
                </h3>
                <p className="mt-4 max-w-md leading-7 text-white/58">
                  Frame the environment, understand the drivers, and focus
                  deeper research where the evidence is strongest.
                </p>
              </div>
            </article>

            <article className="group flex min-h-64 flex-col justify-between overflow-hidden border-b border-white/12 p-8 transition-colors hover:bg-white/[0.04] sm:p-10 lg:col-span-3 lg:row-span-1">
              <div className="flex items-start justify-between gap-6">
                <Layers3 className="size-6 text-blue-300" />
                <span className="text-xs uppercase tracking-[0.16em] text-white/30">
                  Progressive research
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-medium tracking-[-0.04em]">
                  One connected opportunity pipeline
                </h3>
                <p className="mt-3 max-w-xl leading-7 text-white/50">
                  Start broad with market intelligence, then progressively
                  narrow toward prioritized opportunities and risk-aware review.
                </p>
              </div>
            </article>

            {researchPrinciples.map((principle) => (
              <article
                key={principle.title}
                className="group min-h-52 overflow-hidden border-b border-white/12 p-7 transition-colors last:border-b-0 hover:bg-white/[0.05] lg:col-span-1 lg:row-span-1 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <Check className="size-4 text-cyan-200/75" />
                <h3 className="mt-14 text-xl font-medium tracking-[-0.03em]">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {principle.copy}
                </p>
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
              <span className="size-1 rounded-full bg-cyan-300" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <p className="signup-reveal-copy mx-auto max-w-6xl text-center text-[clamp(2.5rem,5vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.055em]">
            {revealCopy.split(" ").map((word, index) => (
              <span key={`${word}-${index}`} className="signup-reveal-word inline-block">
                {word}&nbsp;
              </span>
            ))}
          </p>

          <div className="mx-auto mt-28 max-w-5xl border-y border-white/12 py-12 md:mt-40 md:py-16">
            <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
              <div>
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
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-[#071013] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next perspective"
                  onClick={() => movePerspective(1)}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white hover:text-[#071013] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#dff5f2] px-5 py-24 text-[#071013] sm:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <h2 className="max-w-4xl text-balance text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.065em]">
              Already part of Nova?
            </h2>
            <Link
              to="/login"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#071013] px-7 py-4 font-medium text-white transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#071013]"
            >
              Sign in to your workspace
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-24 flex flex-col gap-5 border-t border-black/15 pt-7 text-sm text-black/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Nova AI. Investment intelligence, structured.</p>
            <div className="flex gap-6">
              <Link to="/terms" className="transition-colors hover:text-black">
                Terms
              </Link>
              <a href="mailto:ceo.novainvest@gmail.com" className="transition-colors hover:text-black">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default SignUp;
