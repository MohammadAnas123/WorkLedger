# Work Ledger — Frontend

React + Vite frontend for tracking client jobs, materials (with your markup),
labour charges, printable receipts, and profit reports. Companion to the
**Work Ledger Backend Specification** document (Spring Boot + PostgreSQL).

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Runs entirely on an in-memory mock
database by default — no backend required to try it out.

## Folder structure

```
src/
├── main.jsx                 # React root render
├── App.jsx                  # Top-level route state, renders current page
├── index.css                # Global styles (design tokens, all component CSS)
│
├── api/                     # The ONLY layer that talks to "the backend"
│   ├── client.js            #   fetch wrapper + USE_MOCK switch (see below)
│   ├── mockDb.js            #   in-memory seed data, used while USE_MOCK=true
│   ├── clients.js           #   client CRUD + status transitions
│   ├── materials.js         #   material purchases
│   ├── labour.js             #   labour charges
│   ├── reports.js           #   summary / by-client / by-worktype aggregates
│   ├── receipt.js           #   receipt number generation
│   └── dashboard.js         #   "this month" stat used only on the dashboard
│
├── constants/
│   ├── workTypes.js         # interior / molding / electric / plumbing / other
│   └── cancelReasons.js     # reasons a job can be closed without payment
│
├── utils/
│   ├── format.js            # currency formatting (₹ with Indian grouping)
│   ├── calculations.js      # material/labour total math — mirrors backend §7.1
│   └── date.js              # today's date, report date-range matching
│
├── hooks/
│   └── useToast.js          # small show/hide toast helper
│
├── components/
│   ├── layout/               # TopBar, LoadingState
│   ├── common/               # StatCard, EmptyState, SummaryPill, ModalShell
│   └── client/                # ClientCard, tabs, all add/close modals
│
└── pages/                    # One file per screen/route
    ├── Dashboard.jsx
    ├── NewClientForm.jsx
    ├── ClientDetail.jsx
    ├── ReceiptView.jsx
    └── Reports.jsx
```

## Connecting to the real Spring Boot backend

Everything under `src/api/` is the seam between this frontend and your
backend. To switch over once the backend is running:

1. Open `src/api/client.js` and set:
   ```js
   export const USE_MOCK = false;
   ```
2. Point `.env`'s `VITE_API_BASE_URL` at your running backend
   (default assumes `http://localhost:8080/api`).
3. That's it — every function in `clients.js`, `materials.js`, `labour.js`,
   `reports.js`, and `receipt.js` already has its real `fetch()` call
   written, sitting right next to the mock implementation it replaces.
   No page or component needs to change.

Once you've fully switched over and verified everything works, you can
delete `src/api/mockDb.js` — it has no backend equivalent and exists only
to make the mock mode self-contained.

The exact request/response shape each function expects is documented in
the **Work Ledger Backend Specification** doc, §5 (REST API Specification).
