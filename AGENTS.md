# Repository Guidelines

## Project Structure & Module Organization

This is a React 19 SPA built with Vite. Code lives in `src/`: route screens are in `src/pages/`, components in `src/components/`, layouts in `src/layouts/`, auth state in `src/contexts/`, and utilities in `src/utils/` or `src/lib/`. Put imported media in `src/assets/`; files that must retain their public URL belong in `public/`. Routing is configured in `src/main.jsx`, while the landing page is assembled in `src/App.jsx`. Production output goes to `dist/` and should not be edited manually.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependency versions recorded in `package-lock.json`.
- `npm run dev` starts Vite on a network-accessible development server with hot reload.
- `npm run lint` checks all JavaScript and JSX with the repository's ESLint rules.
- `npm run build` creates an optimized production bundle in `dist/`.
- `npm run preview` serves the production bundle locally for a final smoke test.

Run lint and build before opening a pull request.

## Coding Style & Naming Conventions

Use modern ES modules and JSX. Follow the existing formatting: two-space indentation, semicolons, double quotes, and trailing commas in multiline structures. Name React components and their files in PascalCase (`StockPriceChart.jsx`), hooks with a `use` prefix, and utility modules/functions in camelCase. Prefer the `@/` alias for imports from `src/`. Keep route components focused on page composition and extract reusable UI into `src/components/`. ESLint enforces recommended JavaScript, React Hooks, and Vite Fast Refresh rules.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. For every change, run `npm run lint` and `npm run build`, then manually verify affected routes and responsive states through `npm run dev`. If introducing tests, add the test runner and its npm script in the same change; use descriptive `*.test.jsx` filenames colocated with the code under test.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Fix hero component layout` and `Change dashboard image preview`. Keep each commit narrowly scoped and explain non-obvious decisions in the body. Pull requests should include a concise problem-and-solution description, testing performed, linked issues when applicable, and before/after screenshots or recordings for visual changes. Call out new environment variables or deployment changes explicitly.

## Configuration & Security

The API base URL is read from `VITE_BACKEND_API`. Keep environment-specific values in local `.env` files, never commit secrets, and remember that any `VITE_` value is exposed to the browser bundle.

## Business Model

### Website Purpose

The Nova AI website is the primary product and business-facing surface for an AI investment intelligence platform. Its purpose is to communicate institutional credibility, explain the business value of the platform clearly, demonstrate how Nova improves the investment research workflow, and convert qualified prospects into product users, pilot discussions, or enterprise sales conversations.

Design and copy should prioritize business outcomes over technical complexity. The website should help an investment professional quickly understand who Nova is for, what problem it solves, how it fits into an investment workflow, and why it is worth evaluating. Avoid positioning Nova as a generic AI stock picker, trading bot, or speculative prediction product. The experience should feel appropriate for professional investment teams, including pension funds, securities firms, asset managers, research teams, and other institutional investors.

### What Is Nova AI

Nova AI is an AI Investment Intelligence Platform designed to help investment teams move from market information to structured investment decisions more efficiently. It brings macroeconomic analysis, liquidity and capital-flow intelligence, investment-theme monitoring, sector rotation, stock prioritization, risk filtering, and AI-assisted forecasting into a unified research workflow.

Nova should be positioned primarily as a research and decision-intelligence platform rather than only as a stock prediction platform. Prediction is one capability within a broader system. The core value proposition is to reduce time spent gathering and processing fragmented market information, standardize parts of the research process, expand research coverage, and give analysts and portfolio managers a structured starting point for identifying and evaluating investment opportunities.

### What the Platform Does

Nova converts a large amount of market and investment data into a progressively narrower set of decision-relevant insights:

1. **Macro Intelligence** — Monitors macroeconomic indicators across supported markets and organizes them into a structured view of the economic environment.
2. **Liquidity and Capital Flow** — Evaluates where capital is being allocated across assets and markets to provide context for investment opportunities.
3. **Theme Intelligence** — Tracks emerging and persistent investment themes such as AI infrastructure, reindustrialization, energy security, and other market-specific themes using evidence including capital expenditure, earnings, flows, persistence, and acceleration.
4. **Sector Rotation** — Combines macro conditions, sector characteristics, liquidity, and theme exposure to identify and rank sectors with relatively attractive conditions.
5. **Stock Prioritization** — Scores stocks using Nova's Institutional Score, which incorporates factors such as capital flow, asset allocation, sector strength, fundamentals, and technical characteristics, then ranks candidates within the opportunity set.
6. **Forecasting and Risk Filtering** — Applies forecasting and risk controls to further evaluate candidates, including filtering opportunities that do not meet the platform's expected-return or risk criteria.
7. **Investment Recommendations** — Surfaces a small set of high-conviction candidates so analysts can focus their attention on the opportunities that pass the full research pipeline rather than manually screening the entire universe.

The website should communicate this workflow as a progression from **market data → investment intelligence → prioritized opportunities → better-informed investment decisions**. Technical methodology can be used as supporting evidence of rigor, but it should not dominate primary marketing copy. Lead with customer problems, workflow improvements, measurable outcomes, and institutional use cases; explain the underlying models and scoring methodology when deeper technical credibility is useful.
