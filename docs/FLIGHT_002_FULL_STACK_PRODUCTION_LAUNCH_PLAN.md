# Flight 002 — Full-Stack Production Launch Plan

Doctrine: **Diagnose → Rank → Execute → Verify**

Purpose: close the gap between built capability and a live, trustworthy revenue system. This plan applies the seven project-planning disciplines to AIKAGAN/AutonomaX and makes production acceptance—not code completion—the finish line.

## 1. SMART objective

By **2026-09-08 23:59 Europe/Istanbul**, establish one verified end-to-end production lane on `aikagan.com` that allows a first-time EN/TR visitor to:

1. arrive through a measurable public route;
2. understand the offer without prior AIKAGAN history;
3. complete a free diagnostic;
4. leave and restore the diagnostic result without re-entering answers;
5. receive personalized, evidence-disciplined guidance and DIY actions;
6. save/share the result or request tailored implementation;
7. enter a bounded commercial engagement only through a verified payment/contract gate;
8. receive a traceable QA-approved delivery;
9. provide acceptance/revision evidence; and
10. have the commercial outcome recorded in the durable income/mission ledger.

### Launch success KPIs
- P0 production defects: **0 open**
- EN/TR critical-path smoke tests: **100% pass**
- Broken customer-facing links on critical path: **0**
- Paid checkout routes bypassing commercial/fulfillment gate: **0**
- Durable analytics for pageview → diagnostic → request → checkout intent → verified purchase → fulfillment → acceptance: **100% of critical events represented**
- Seed/manual/test/simulated records recognized as verified revenue: **0**
- First external diagnostic completion: **required for market proof**
- First external qualified implementation request/reply: **required for demand proof**
- First provider-verified paid order: **commercial milestone; not a prerequisite for technical launch**
- First accepted paid delivery: **revenue-lane proof**

## 2. Stakeholders and scope

### Accountable
- Captain / Board: priorities, commercial release decisions, exceptional spend, material scope changes.
- Mission PM: schedule, WIP, evidence, gates, dependencies, daily close.

### Responsible cells
- AIKAGAN Web / Release Ops — public EN/TR experience, routing, Vercel release.
- Market Intelligence / Creator Flight Ops — qualified demand and prospect evidence.
- Commercial / Sales Office — offer, scope, pricing release, contract/payment transition.
- Golden Delivery / Fulfillment — order evidence, package handoff, delivery traceability.
- TekraQual / QA — factuality, completeness, rights, acceptance criteria, release checks.
- Revenue Analyst / Profit OS — durable funnel, verified revenue/cost/outcome truth.
- Security/Data Steward — client permissions, provenance, confidentiality, retention.

### In scope
- `laziestlarry/aikagan-web` customer-facing production surface.
- `laziestlarry/autonomax-agency-ops` mission/governance evidence.
- Revenue Leak Scan and Flight 002 entry journey.
- Turkish localization and canonical `/tr` journey.
- Functional share/invite and result persistence.
- Contact/implementation request handoff.
- Payment routes only when fulfillment release gate is satisfied.
- Durable income/funnel/health telemetry.
- One bounded delivery/acceptance path.
- UTOPIA-001 graduation path after first accepted engagement.

### Explicitly out of scope until evidence justifies activation
- New predictive ML platform.
- New paid Google Cloud/always-on infrastructure.
- Public deployment of every legacy app.
- Unverified certification/endorsement claims.
- Full Alexandria ingestion before client permission.
- Autonomous actions beyond explicit approval thresholds.
- Scaling paid traffic into an unproven funnel.

## 3. WBS and production gates

### G0 — Baseline and release truth
- Verify current production commit and domain aliases.
- Verify `/api/health`, durable income reality/funnel endpoints, provider readiness, CAPI, KV, analytics and fulfillment state.
- Inventory all critical customer links and paid endpoints.
- Freeze unrelated public-feature work.

**Acceptance:** one timestamped baseline with production SHA, health state, known defects and durable commercial counters.

### G1 — Conversion-integrity patch
- Make `/tr` navigation deterministically Turkish on desktop/mobile.
- Replace agreed Turkish copy/CTAs.
- Remove internal-history language from first-time customer journey.
- Disable/replace broken AutonomaX and customer-workspace links until verified functional.
- Persist Revenue Leak Scan answers/result locally; restore on return.
- Add `Back to my results` / Turkish equivalent and `Start new scan` controls.
- Upgrade result to executive summary + top 3 personalized findings + why it matters + evidence discipline + DIY check + improvement action + implementation CTA.
- Make `/tr/network` share/invite functional or remove the promise.
- Remove/hide stale affiliate prices/statistics from public decision surfaces until commercial pricing is approved.

**Acceptance:** anonymous EN/TR browser journey passes with no dead ends, lost result or contradictory commercial promise.

### G2 — Lead/request capture
- Define durable event for completed diagnostic.
- Define durable event for save/share/invite.
- Define implementation-request record with source, locale, diagnostic context, consent/contact route, status and evidence refs.
- Ensure contact success state is clear and recoverable.

**Acceptance:** one controlled non-commercial test can be traced end-to-end and is explicitly classified TEST, not a lead/revenue success.

### G3 — Commercial release gate
- Define one bounded implementation offer from diagnosed gap.
- Lock scope, exclusions, delivery SLA, revision/acceptance rule and refund/support route.
- Approve price before exposing it publicly.
- Ensure every provider-specific/manual checkout endpoint delegates to the same release gate.
- Keep commerce maintenance-gated until fulfillment smoke test passes.

**Acceptance:** no checkout bypass; test/sandbox behavior cannot create verified revenue; production payment path has deterministic provider/order evidence.

### G4 — Fulfillment and acceptance
- Map order → BOM/template/assets → production owner → TekraQual QA → delivery token/location → customer notification → acceptance/revision closure.
- Prove package access and re-access.
- Record delivery and acceptance separately.

**Acceptance:** controlled fulfillment smoke test passes without recognizing test revenue; rollback/recovery path documented.

### G5 — Production launch
- Deploy approved `aikagan-web` release to Vercel.
- Verify canonical EN and `/tr` paths, mobile/desktop, analytics, forms, share, links, gated checkout, success/failure states.
- Verify health and durable telemetry after deployment.

**Acceptance:** 100% critical-path smoke pass and zero P0 defects.

### G6 — Qualified traffic
- Start with owned/free/permissioned targeted distribution.
- Flight #001: 25 evidence-qualified creators → top 5 Audience Weather briefs → legitimate delivery.
- UTOPIA-001: recruit first external account through useful diagnostic/brief rather than generic promotion.
- Do not optimize raw pageviews independently of qualified funnel movement.

**Acceptance:** external qualified diagnostic/request/reply evidence. Sends and visits alone do not pass.

### G7 — Verified revenue lane
- Provider-verified payment/order.
- Produce bounded engagement.
- QA pass.
- Traceable delivery.
- Acceptance/revision closure.
- Record verified revenue and direct cost.

**Acceptance:** one real external customer crosses paid order → delivery → acceptance.

### G8 — Sustain / key-account graduation
- Offer justified next engagement based on evidence.
- With permission: Alexandria → BI/MI/SI → BizOps → AutonomaX execution cell → Profit OS → Larry executive brief.
- Record continuation decision and unit economics before scaling infrastructure.

## 4. Resources and budget

### Existing assets first
- Vercel-hosted `aikagan-web`.
- GitHub repositories/actions/issues.
- Existing KV/analytics/CAPI/payment-provider integrations where healthy.
- Existing Revenue Leak Scan, Flight 002, Creator Reward, TekraQual, Alexandria, BizOps, YouTube AI, Golden Delivery and Profit OS assets.
- Existing AI/model/tool connectors and human Captain approval.

### Budget rule
Default incremental infrastructure budget: **$0 until a committed workflow cannot be fulfilled with existing capacity**.

Any new recurring expense requires:
1. named customer/job or measurable bottleneck;
2. monthly cost;
3. expected gross-profit contribution or required reliability benefit;
4. cheaper alternative considered;
5. Captain approval.

## 5. Timeline and dependencies

### D0 — 2026-09-02: Baseline + conversion patch start
G0 complete; patch branch/PR contains all known UX integrity defects.

### D1 — 2026-09-03: Conversion integrity
G1 complete; EN/TR browser QA pass.

### D2 — 2026-09-04: Durable request + commercial contract
G2 complete; G3 offer/scope/payment gate ready but paid release remains blocked until G4.

### D3 — 2026-09-05: Fulfillment proof
G4 controlled smoke test passes; no test revenue recognized.

### D4 — 2026-09-06: Production release
G5 deployed and verified; P0=0.

### D5 — 2026-09-07: Qualified distribution
G6 starts: first 5 creator briefs and UTOPIA-001 recruitment assets delivered through legitimate routes.

### D6 — 2026-09-08: Evidence close
Review external diagnostic/request/reply/order/delivery evidence; choose continue/repair/kill/scale by actual funnel movement.

### Critical dependency chain
Conversion integrity → durable lead/request capture → bounded commercial contract → fulfillment proof → production release → qualified traffic → verified order → accepted delivery → graduation.

Parallel work is allowed only when it cannot invalidate an upstream gate.

## 6. Risk register

| Risk | Impact | Mitigation / fallback |
|---|---|---|
| Broken/contradictory customer journey | High | Link crawl + EN/TR browser smoke before traffic |
| Diagnostic loses user work | High | local/session persistence + restore control |
| Stale pricing/affiliate signals | High | hide until approved commercial release |
| Checkout bypasses maintenance gate | Critical | one shared server-side gate; endpoint inventory test |
| Payment succeeds but delivery fails | Critical | keep paid commerce gated until fulfillment smoke passes; recovery/refund path |
| Test/manual data counted as revenue | Critical | durable source classification + provider-order requirement |
| Traffic grows without qualified demand | Medium | optimize diagnostic/request/reply, not pageviews |
| Creator analysis implies private data | High | OBSERVED/INFERRED/HYPOTHESIS labels; permission boundary |
| Client data leaks across accounts | Critical | provenance + tenancy/classification + least privilege |
| Scope expands into legacy-app rebuild | High | legacy apps are capability suppliers; activate only against current job |
| Cloud cost creep | High | $0 default; Captain approval for recurring spend |
| Deployment regression | High | PR/build checks, production smoke, rollback to last known-good SHA |
| Unsupported certification/readiness claims | High | readiness/QA language only; no external certification claim |

## 7. Communication and monitoring

### Daily PM cadence
**Morning intake:** durable health/funnel + active missions + blockers → max 3 missions.

**Midday gate review:** only evidence attempting to cross current gates; reject simulated progress.

**Evening close:**
`date | prod_sha | health | gate | p0_defects | qualified | diagnostics | requests | replies | checkout_intents | verified_orders | verified_revenue | deliveries | acceptances | recurring | cost | blocker | owner | next_action | evidence_refs`

### Board dashboard hierarchy
1. Verified gross profit.
2. Qualified demand → diagnostic → request/reply → verified order.
3. Order → QA delivery → acceptance → continuation.
4. Reliability/guardrails: health, P0 defects, refunds/rework, cycle time, cost.
5. Raw traffic only as supporting context.

## Weak-point assessment against the seven planning disciplines

1. **Goals/objectives — AMBER:** strong mission language existed, but launch success was spread across issues and lacked one dated end-to-end production definition. This plan supplies it.
2. **Stakeholders/scope — AMBER:** roles exist in Creator Rescue/UTOPIA, but customer-facing web, commercial release, fulfillment and data governance were not bound into one RACI/scope. Now bounded.
3. **WBS — GREEN/AMBER:** detailed gates exist, but were distributed across Issues #5/#6/#8/#9/#10. This plan creates one dependency-ordered launch WBS.
4. **Resources/budget — AMBER:** strong no-cost doctrine exists, but recurring-spend approval economics were not explicit. Now defined.
5. **Timeline/dependencies — RED:** this was the largest planning weakness. Rich gates existed without a single dated critical path. D0–D6 now provides one.
6. **Risks — AMBER:** many risks were recognized reactively; this plan converts them into a pre-launch risk register with fallbacks.
7. **Communication/monitoring — GREEN/AMBER:** durable telemetry and PM cadence exist, but need one executive row linking production SHA, gate, funnel, delivery, economics and evidence. Format now defined.

## Launch definition of done

The **technical production launch** is complete only when G0–G5 pass.

The **commercial revenue lane** is proven only when a real external customer crosses G6→G7 with provider-verified payment, QA-approved delivery and acceptance/revision closure.

The **Utopia/Genesis model** is proven only when that evidence justifies and earns permission for a deeper G8 engagement.

Until then, use `ready`, `tested`, `deployed`, `paid`, `delivered`, `accepted`, and `profitable` as separate evidence states; never collapse them into one claim.