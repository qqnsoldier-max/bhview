# BHC Markets — Implementation Plan (B‑Book, Redis Fan‑out, Postgres PnL)

This plan translates the roadmap into a concrete, incremental path tailored to your current setup: a data puller that writes JSON, with the goal to push into Redis, then fan‑out to the frontend; fully in‑house B‑book with trades stored in Postgres and PnL surfaced in the UI.

---

## 0) Guiding principles
- Trust and safety by default: explicit statuses, auditability, and graceful failure modes.
- Deterministic, testable: market simulator and order simulator enable repeatable tests.
- Simple first: local mocks over the network until vendor decisions are finalized.

---

## 1) Market data pipeline (local → Redis → WS → FE)

1. Ingestor (existing script)
   - Normalize a minimal tick schema: `{ symbol, price, size?, t }` where `t` is server unix ms.
   - Write latest snapshot to Redis key `md:snap:{SYMBOL}` (JSON or Hash) and push ticks to `md:stream:{SYMBOL}` (Redis Stream) or a Pub/Sub channel `md:pub:{SYMBOL}`.
   - Keep JSON history files as a fallback and for batch tests (already in your repo).

2. Distributor (Node service)
   - Subscribes to Redis Pub/Sub or XREADs from Streams.
   - Emits WebSocket messages to FE clients. Suggested WS event envelopes:
     - `connection` for status: `{ type: "connection", status: "connected|reconnecting|idle", attempts }`
     - `tick` for prices: `{ type: "tick", symbol, price, t }`
     - `heartbeat` every 5s: `{ type: "heartbeat", t }`
   - Add backoff and health endpoints.

3. Frontend consumption (this repo)
   - WebSocket manager with auto‑reconnect and listeners.
   - Zustand store caches last price per symbol, connection status, last heartbeat.
   - UI components (Ticker, QuoteStrip, Chart) subscribe to store.

Milestones
- M1: Mock WS in FE (local timer) to unblock UI flows.
- M2: Replace with real WS from Distributor against Redis Pub/Sub.
- M3: Chart OHLC from an aggregated candle stream (server‑side aggregation every 1s/5s/1m).

---

## 2) B‑book order simulator and lifecycle

1. Order API (BFF) endpoints (REST):
   - POST `/orders` to place: body `{ clientOrderId, symbol, side, qty, type, limitPrice?, tif }` → returns `{ orderId, status: "accepted" }`.
   - GET `/orders/:id` to fetch, GET `/orders` to list.
   - POST `/orders/:id/cancel` → `{ status: "canceled" }`.

2. Matching logic (simulator):
   - For market/limit, fill against the latest mid or bid/ask from Redis snapshot, with configurable spread simulation.
   - Partial fills based on a simple liquidity model (e.g., max size per tick). Generate fills over time via a job queue.
   - States: `new → accepted → (partially_filled)* → filled | canceled | rejected`.

3. Persistence (Postgres schemas)
   - accounts(id, user_id, currency, balance, created_at)
   - orders(id, client_order_id, account_id, symbol, side, type, qty, limit_price, tif, status, created_at, updated_at)
   - executions(id, order_id, fill_qty, fill_price, ts)
   - positions(id, account_id, symbol, qty, avg_price, updated_at)
   - transactions(id, account_id, type, amount, currency, ts, meta)
   - audit_logs(id, entity, entity_id, action, actor, ts, data)

4. Derived updates
   - On fill: upsert position with VWAP; write execution; update buying power; append audit trail.
   - Reconcile positions nightly from executions.

---

## 3) PnL and portfolio

- Realized PnL: sum(executions) for closed quantity vs cost basis.
- Unrealized PnL: `(markPrice - avg_price) * position_qty` using latest Redis snapshot.
- Account equity: cash + unrealized PnL. Buying power rules configurable.
- Expose `/portfolio` endpoint to FE with computed fields; cache 1s.

---

## 4) Frontend deliverables (this repo)

- State & data
  - Zustand store for realtime connection and ticks (already scaffolded).
  - TanStack Query for REST endpoints (orders, portfolio).
- Components
  - MarketTicker (done), QuoteTable, OrderTicket, PositionsTable, PnLBar.
  - Chart with lightweight‑charts; subscribe to candle stream.
- UX trust builders
  - Status/incident banner, latency badge, last update timestamp, clear error toasts.

---

## 5) Ops, security, and testing

- Telemetry: FE web vitals + error reporting (Sentry) initially.
- CI: lint, unit tests, build; later add E2E place/cancel order against simulator.
- Secrets: never commit; use env vars with a typed config module.
- Backups & retention for Postgres; Redis persistence for snapshot keys.

---

## 6) Sequenced milestones (2–4 week sprints)

1. Sprint A (this week)
   - FE mock WS → live MarketTicker and a basic QuoteTable.
   - Document Redis channels/keys and WS protocol.
2. Sprint B
   - Distributor service bridging Redis → WS.
   - Order simulator endpoints + FE OrderTicket wired via Query.
3. Sprint C
   - Postgres schemas + migrations; executions drive positions; portfolio endpoint.
   - PnL surfaces in FE with badges and breakdown.
4. Sprint D
   - Replace mock data with real vendor feed; harden reconnect, backpressure, and alerts.

Success criteria
- p95 WS reconnect < 2s; tick gap < 2s; first order to accepted < 300ms in local.
- E2E: place market order, see position and PnL update, cancel an open limit order.

---

## Appendix — Redis keying and WS message examples

- Keys
  - `md:snap:AAPL` → `{ price, bid, ask, t }`
  - `md:pub:AAPL` → Pub/Sub channel publishing `{ symbol, price, t }`
- WS frames
```
{ "type": "connection", "status": "connected", "attempts": 0 }
{ "type": "tick", "symbol": "AAPL", "price": 221.45, "t": 1734567890123 }
{ "type": "heartbeat", "t": 1734567895000 }
```
