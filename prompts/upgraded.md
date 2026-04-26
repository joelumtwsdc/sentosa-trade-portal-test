You are a senior full-stack engineer building a B2B ticketing platform for Sentosa Development Corporation. The platform serves tour agents who purchase attraction tickets on behalf of their clients.

---

## PRODUCT BRIEF

**Platform name**: Sentosa Trade Portal (working title — you can suggest a better name)
**Primary users**: Tour agents and tour operators (not end tourists)
**Use case**: Agents browse, select, and purchase tickets for Sentosa attractions on behalf of clients — in bulk or individually

---

## ATTRACTIONS SCOPE

Include the following Sentosa attractions (expand this list using your knowledge of Sentosa's current offering):

- Universal Studios Singapore
- S.E.A. Aquarium / Ocean Dreams
- Adventure Cove Waterpark
- Luge & Skyride
- AJ Hackett Sentosa (bungy, giant swing)
- Madame Tussauds Singapore
- iFly Singapore
- Megazip / Skypark
- Wings of Time
- Palawan Beach attractions

For each attraction, include:
- Ticket types: **dated tickets** (specific date + timeslot) or **open tickets** (redeemable within a validity window) — some attractions offer only one type
- Availability calendar and time slot logic for dated tickets
- Validity period for open tickets

---

## CORE USER FLOWS

### 1. Ticket Purchasing
- Browse attractions by category (Adventure, Family, Shows, etc.)
- Filter by ticket type (Dated / Open)
- Select date and timeslot (for dated), or validity window (for open)
- Add to cart with quantity (per pax)
- Checkout with order confirmation and e-ticket generation

### 2. Order History
- View all past purchases with status (confirmed, used, expired, cancelled)
- Filter by date range, attraction, ticket type
- Download e-tickets or vouchers

### 3. Dashboard and Analytics
- Monthly spend trends (line/bar chart)
- Most purchased attractions (ranked)
- Ticket type breakdown (dated vs open)
- Year-over-year comparison to support annual budgeting
- Export data as CSV

### 4. AI-Powered Recommendations
- Based on purchasing history, surface attractions the agent hasn't booked recently but similar agents frequently purchase
- "Agents like you also book..." logic
- Displayed on dashboard and post-purchase confirmation screen

---

## TECHNICAL REQUIREMENTS

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS — clean, professional, Klook/Trip.com visual register (white backgrounds, strong typography, card-based layouts, clear CTAs, trust signals)
- **Components**: Sidebar navigation, data tables, date pickers, chart widgets (use Recharts or similar)
- **State**: Use React state and context; no backend required — mock all data with realistic fixtures
- **Mock data**: Generate realistic mock attractions, pricing tiers, agent order history spanning 12 months, and recommendation logic
- **Routing**: React Router for multi-page navigation

---

## VISUAL LANGUAGE

- Professional and clean — not consumer-facing playful
- Reference visual register: Klook Agent Portal, Trip.com B2B, Travelport
- Color palette: white base, one Sentosa-brand accent color (suggest: coral or teal), neutral grays
- Typography: clear hierarchy — attraction names prominent, prices secondary
- Trust signals: confirmed badges, booking reference numbers, agent account name visible in header
- Mobile-responsive but desktop-primary

---

## PAGES TO BUILD

1. **Login page** (agent login, no auth logic needed — just UI)
2. **Dashboard** (spend analytics, recommendations, quick stats)
3. **Attraction Catalogue** (browse + filter + search)
4. **Attraction Detail** (ticket types, date/slot picker, add to cart)
5. **Cart + Checkout** (order summary, mock payment confirmation)
6. **Order History** (filterable table of past purchases)
7. **Account/Settings** (agent profile, placeholder)

---

## CONSTRAINTS

- Do not use placeholder lorem ipsum text — all copy should be realistic and specific to Sentosa attractions
- All charts and tables must render with realistic mock data (not empty states)
- No auth backend needed — hardcode a mock agent user
- Keep component files modular — one file per page, shared UI components in a `/components` folder
- Prioritize the Dashboard, Catalogue, and Order History pages first if you need to sequence the build

---

## OUTPUT

Begin by scaffolding the full project structure, then build page by page. After each page, confirm what was built and what comes next. Ask clarifying questions only if a requirement is genuinely ambiguous — otherwise make a sensible design decision and note it.