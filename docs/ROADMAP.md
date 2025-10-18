# BHC Markets — Product and Engineering Roadmap

This roadmap outlines how to evolve the current React+Vite trading UI into a production‑grade, high‑trust platform for end users to trade multiple financial instruments. It is organized by phases with concrete deliverables and success criteria.

## Principles
- Trust by design: security, compliance, transparency, robust status and error handling.
- Performance and reliability: low latency market data, resilient order workflow, graceful degradation.
- Customer experience: clean, accessible, fast, and helpful UX with guardrails and education.
- Measurable progress: clear milestones, metrics, and testable acceptance criteria.

---

## Phase 0 — Foundations (Current → 2 weeks)
Goal: Solid UX scaffold, design system, local mocks, and developer platform.

Deliverables:
- Frontend architecture
  - Routing, global state (Redux Toolkit or Zustand), query/data cache (TanStack Query), feature flagging.
  - Theming + design tokens, dark/light modes, responsive layout, a11y baseline.
  - Error boundaries, global toast/notification system, skeleton loaders.
- Data and trading mocks
  - Mock market data service (websocket simulator) for quotes, OHLCV, order book snapshots.
  - Mock trading service (REST) for login, account, portfolio, orders, positions, funding.
- DevEx & Quality
  - CI (GitHub Actions): lint, typecheck, unit tests, build.
  - E2E baseline (Playwright/Cypress) covering auth + place paper order + cancel.
  - Monitoring: basic web vitals (LCP/CLS/TTI) and error reporting (Sentry or OpenTelemetry).

Success criteria:
- Developers can run the app, see streaming mock quotes, place paper orders end‑to‑end within the local simulator, and E2E tests pass in CI.

---

## Phase 1 — MVP (4–8 weeks)
Goal: Real market data, paper trading, onboarding, and production‑ready hosting.

Deliverables:
- Data feeds
  - Vendor integration for quotes and historical data (e.g., Polygon.io, Tiingo, Finnhub, Twelve Data, Alpaca Market Data).
  - Realtime streaming (websocket), snapshot REST fallbacks, exponential backoff, circuit breaker.
  - Local cache + edge cache (CDN) for static symbol metadata and reference data.
- Trading (paper)
  - Broker sandbox integration (e.g., Alpaca paper, Tradier sandbox). Order lifecycle: new/accepted/filled/partial/rejected/canceled.
  - Idempotent order submission, client order IDs, clock skew handling, and time‑in‑force policies.
  - Portfolio PnL, positions, and transaction history (using broker APIs + local derived state).
- Accounts & onboarding
  - Auth (passwordless magic link or OAuth with broker), session management, CSRF protection.
  - KYC/AML simulation flows and doc upload stubs for later production.
- Hosting & operations
  - Deploy on Vercel/Netlify for FE, mock backend on Fly.io/Render/Heroku. IaC (Terraform) for long‑term parity.
  - SLOs: uptime target 99.9% for FE, latency thresholds for core flows.

Success criteria:
- Users can sign in, fund a paper account, stream quotes, place/cancel/modify orders in sandbox, and track positions.

---

## Phase 2 — Beta (8–16 weeks)
Goal: Regulated readiness, real brokers for cash equities, support, and observability.

Deliverables:
- Broker/order routing
  - Integrate at least one production broker (e.g., Alpaca live, Interactive Brokers via TWS/Gateway/FIX). Support equities first.
  - FIX/REST adapter abstraction with a provider layer; retries, timeouts, transient error classification, and reconciliation jobs.
  - Trading halts, market states, circuit breaker events, corporate actions handling.
- Risk & controls
  - Pre‑trade checks (buying power, pattern day trading, instrument restrictions), kill‑switch and session throttles.
  - Post‑trade reconciliation and exception management dashboard.
- Compliance & security
  - KYC/AML using vendor (e.g., Alloy, Persona), sanctions screening, PEP lists.
  - Secure PII flow: at‑rest encryption (KMS), in‑transit TLS, secrets management (Vault/Parameter Store), role‑based access.
  - Audit logging, tamper‑evident storage, retention policies.
- Support & trust
  - In‑app status page, incident banners, order audit trail, downloadable statements, dispute workflow.

Success criteria:
- Controlled beta users can trade live equities with full audit trails; platform passes security review and basic compliance checks.

---

## Phase 3 — GA and Differentiation (16–28 weeks)
Goal: Scale, polish, and unique edge.

Options for differentiation:
- UX excellence: ultra‑fast UI, instant search/command palette, keyboard‑first workflows, and world‑class charts.
- Smart guardrails: contextual risk nudges, what‑if PnL, exposure caps, and built‑in education/explainability.
- Social/automation: signal following with controls, strategy templates, API keys/webhooks for power users.
- Insights: portfolio health, factor exposures, tax‑aware analytics, goal tracking.

Platform hardening:
- Multi‑region deploy, active‑active for FE, DR plan for BE, load testing, chaos drills.
- FinOps and cost controls, perf budgets, and dependency review program.

---

## Architecture Overview
- Frontend (this repo)
  - React + Vite + React Router; State: Redux Toolkit or Zustand; Data: TanStack Query.
  - Component library: Radix UI/Headless UI + styled components or Tailwind; A11y first.
  - Realtime via websockets, reconnection logic; service module per domain (marketData, trading, accounts).
- Backend (to add)
  - API gateway/BFF (Node/TypeScript, NestJS/Express/Fastify). Auth, rate limiting, anti‑replay.
  - Market data adapter(s) + cache; Order routing adapters (FIX/REST) with queueing and outbox pattern.
  - DB: Postgres for core, Redis for cache; S3/GCS for logs/statements; Kafka/NATS for events.
- Observability and QA
  - OpenTelemetry traces + logs + metrics; dashboards and alerts.
  - Test pyramid: unit, contract (Pact), integration, E2E. Market simulator for deterministic tests.

---

## Security & Compliance Checklist (non‑exhaustive)
- Data protection: TLS 1.2+, HSTS, CSP, Subresource Integrity; PII encryption, key rotation.
- Access control: SSO for admins, RBAC, MFA enforcement.
- Secrets: KMS/Parameter Store, no secrets in code/CI logs.
- Audit: append‑only audit logs, clock sync (NTP), immutable storage options.
- Compliance: KYC/AML vendor, SOC2 controls, GDPR/CCPA user data rights flows.

---

## Immediate Next Steps for This Repo
1) Convert to TypeScript baseline, enable strict mode.
2) Introduce state + data layer
   - Install Redux Toolkit or Zustand + TanStack Query.
   - Create services: marketData (mock ws), trading (mock REST), accounts (mock REST).
3) Add UI primitives and patterns
   - Global Layout, error boundary, notifications, loading states, and A11y checks.
4) Testing and CI
   - Jest/Vitest unit tests, Playwright E2E for login → place/cancel order in mocks. GitHub Actions pipeline.
5) Product surface
   - Markets page with streaming quotes and charts; Orders ticket; Portfolio with PnL.

Create GitHub issues for each item and track in a project board.

---

## Vendor Options
- Data: Polygon.io, Tiingo, Finnhub, Twelve Data, Alpaca Market Data, Binance (crypto), Coinbase Advanced.
- Brokers: Alpaca, Interactive Brokers, Tradier, Coinbase, Kraken.
- Identity & Compliance: Auth0/Clerk, Persona/Alloy, ComplyAdvantage.
- Observability: Sentry, Datadog, Grafana Cloud, OpenTelemetry.

---

## Success Metrics
- Reliability: FE error rate < 0.5%, p95 market data gap < 2s, order submission p95 < 600ms to ack.
- Growth: Signup conversion, onboarding completion, first trade success rate.
- UX: Web vitals within good thresholds; task completion time for common flows.

---

## Glossary
- BFF: Backend For Frontend
- FIX: Financial Information eXchange protocol
- KYC/AML: Know Your Customer / Anti‑Money Laundering
- PnL: Profit and Loss
