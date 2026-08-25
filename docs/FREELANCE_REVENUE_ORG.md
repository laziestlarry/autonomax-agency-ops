# AutonomaX Freelance Revenue Organization

## Mission
Convert qualified remote/freelance demand into truthful, fast, QA-controlled paid delivery using existing Kagan/AIKAGAN/AutonomaX capabilities and reusable assets.

## Human authority
Kagan remains the approval authority for:
- external application/proposal submission;
- contract acceptance;
- regulated professional representations;
- price commitments outside pre-approved bands;
- final client delivery when material professional judgment is involved.

## Departments / agents

### 1. Scout — Opportunity Intelligence
Inputs: job boards, freelance marketplaces, referrals, partner leads.
Outputs: normalized opportunities with source URL, budget, geography and deadline.
Rejects: inaccessible geography, obvious scams, unpaid speculative work, mismatched professional licensing.

### 2. Qualifier — Bid Economics
Scores: skills evidence, reusable-asset fit, speed to first milestone, payment confidence, competition risk and regulated risk.
Default qualification threshold: 65/100.

### 3. Solution Matcher — Asset Arbitrage
Maps each qualified opportunity to existing assets: CAD/3D patterns, business documents, AutonomaX workflows, AIKAGAN proof pages, proposal templates and code modules.
Rule: reuse is disclosed internally and adapted materially to client requirements; never represent generic output as bespoke proof.

### 4. Bid Builder — Proposal Operations
Produces one small valuable first milestone, delivery window, fixed price and acceptance criteria.
External submission remains human-approved.

### 5. Delivery Cell — Production
Lanes:
- CAD / 3D / architectural support;
- business strategy / research / documentation;
- AI automation / agents / workflows;
- remote-role practical assignments.

### 6. QA Guardian
Required before delivery completion:
- input/version/unit verification;
- functional or geometry review;
- deliverable-format validation;
- assumptions recorded;
- no unrelated secrets/client data;
- editable/native source included if promised;
- regulated/stamped work not implied without the qualified professional.

### 7. Revenue Controller
Revenue recognition only after a positive payment amount and evidence identifier are recorded. Proposals, wins, milestones awaiting release and invoices are not revenue.

## State machine
`discovered → qualified → approved → proposed → won → delivering → qa → delivered → paid`

Loss can be recorded from any active commercial stage.

## API
- `GET /ops/freelance/status`
- `GET /ops/freelance/opportunities?stage=&lane=&minScore=`
- `POST /ops/freelance/opportunities`
- `POST /ops/freelance/opportunities/:id/approve`
- `POST /ops/freelance/opportunities/:id/proposal`
- `POST /ops/freelance/opportunities/:id/won`
- `POST /ops/freelance/opportunities/:id/delivery`
- `POST /ops/freelance/opportunities/:id/delivered`
- `POST /ops/freelance/opportunities/:id/payment`
- `POST /ops/freelance/opportunities/:id/lost`

## Operating cadence
1. Scout continuously collects only public or authorized opportunities.
2. Qualifier ranks by expected cash velocity, not prestige.
3. Kagan approves the short list.
4. Bid Builder prepares a tailored first milestone.
5. Kagan submits through the authenticated platform/account.
6. Won work enters Delivery Cell.
7. QA Guardian blocks completion without QA evidence.
8. Revenue Controller blocks revenue recognition without payment evidence.

## Emergency cash priority
1. Small paid CAD/3D/technical milestones.
2. Small business-document/analysis deliverables.
3. AI automation milestones with clear acceptance criteria.
4. Larger remote roles and strategic engagements in parallel.

No paid advertising or new infrastructure is required for this module.
