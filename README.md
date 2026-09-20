# 🧾 Your Life in Receipts

> **Turn your fragmented digital exhaust into an interconnected, interactive narrative constellation.**

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Flow](https://img.shields.io/badge/@xyflow/react-12.x-FF0072?logo=react&logoColor=white)](https://reactflow.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

## 🌟 Overview

**Your Life in Receipts** is a personal digital archaeology platform that ingests multi-stream activity data—music streams, payment transactions, recurring expenses, GPS check-ins, and personal notes—and automatically synthesizes them into meaningful life chapters, synchronized moments, and interactive graph constellations.

Instead of looking at isolated bank statements or music history in siloes, **Your Life in Receipts** uncovers hidden correlations:
- *What song was playing when you bought that late-night coffee?*
- *What notes were written during a creative sprint at your favorite café?*
- *How did your habits and soundtrack evolve across different seasons of life?*

---

## ✨ Key Features

- **🌐 Multi-Stream Data Ingestion**: Unified normalization pipeline across Spotify tracks, bank transactions, recurring subscriptions, GPS check-ins, and markdown notes.
- **⚡ Heuristic Connection Scoring Engine**: Multi-factor scoring algorithm evaluating temporal proximity, geographic overlap, semantic tag intersection, and cross-category synergies.
- **✨ Synchronized Life Moments**: Automated clustering algorithm grouping high-density, multi-modal events occurring within localized timeframes into narrative moments.
- **📖 Narrative Life Chapters**: Chronological era generator extracting distinct life phases with dominant themes, top environments, and focus stats.
- **🌌 Interactive Constellation & Graph Views**:
  - **Constellation Canvas**: Custom responsive canvas visualization of data points and radiant connection lines.
  - **Connection Graph**: Full node-link diagram powered by `@xyflow/react` with custom node renderers, filters, and relationship strength badges.
- **📊 Automated Behavioral Insights**: Algorithmic detection of night-owl habits, soundtrack correlation, focus anchors, and spend dynamics.
- **📱 Responsive & Dark-Themed UI**: Modern dark interface styled with Tailwind CSS, Lucide icons, and micro-animations with Framer Motion.

---

## 📂 Complete Codebase Structure

```text
FrontendArena/
├── .gitignore                      # Git ignore rules for node_modules, build output & OS files
├── index.html                      # Root HTML entry template with fonts and metadata
├── package.json                    # Dependencies, scripts, and project metadata
├── package-lock.json               # Locked dependency tree
├── postcss.config.js               # PostCSS configuration with Tailwind CSS & Autoprefixer
├── tailwind.config.js              # Custom Tailwind theme, colors, fonts, and animations
├── vite.config.js                  # Vite bundler configuration with React plugin
├── src/
│   ├── main.jsx                    # Application entry point rendering <App /> to DOM
│   ├── App.jsx                     # Root application container, state store & page router
│   ├── index.css                   # Global styles, Tailwind directives, custom scrollbars
│   │
│   ├── data/                       # Raw source mock datasets
│   │   ├── spotify.json            # Track listens, artists, duration, timestamp, device
│   │   ├── transactions.json       # Merchant transactions, amounts, payment methods, locations
│   │   ├── expenses.json           # Recurring utility, housing & subscription expenses
│   │   ├── locations.json          # GPS check-ins with coordinates, place names, categories
│   │   └── notes.json              # Thought captures, tags, mood, markdown content
│   │
│   ├── utils/                      # Core data transformation & analytics algorithms
│   │   ├── normalizeData.js        # Normalizes heterogeneous raw data into uniform receipt schema
│   │   ├── connections.js          # Relationship scoring engine & moment clustering algorithm
│   │   ├── insights.js             # Automated statistical analysis & behavioral story generation
│   │   └── chapters.js             # Chronological life phase / narrative era generator
│   │
│   ├── pages/                      # Top-level view controllers
│   │   ├── Home.jsx                # Landing view with hero, KPI metrics, preview canvas & insights
│   │   ├── Explore.jsx             # Grid & list view of all receipts with category filters & search
│   │   ├── Connections.jsx         # Interactive React Flow node-link relationship graph
│   │   └── Chapters.jsx            # Narrative timeline of life eras and highlighted moments
│   │
│   └── components/                 # Modular, reusable UI components
│       ├── Navbar.jsx              # Global navigation bar with view switching & metrics ticker
│       ├── ReceiptCard.jsx         # Card component representing an individual receipt item
│       ├── ReceiptDetailModal.jsx  # Detailed inspection modal displaying metadata & linked bonds
│       ├── MomentStoryModal.jsx    # Immersive story view for multi-event synchronized moments
│       ├── ChapterCard.jsx         # Visual summary card for a chronological life chapter
│       ├── InsightCard.jsx         # Visual card displaying auto-generated behavioral statistics
│       ├── LifeConstellation.jsx   # Custom 2D canvas plotting receipts and radiant connection lines
│       ├── ConnectionGraph.jsx     # Node-link graph canvas using @xyflow/react
│       ├── FilterBar.jsx           # Search input and category filter chips
│       └── StatsCard.jsx           # Metric display card with trends and badge indicators
```

---

## 🏗️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Data Layer
        S[spotify.json]
        T[transactions.json]
        E[expenses.json]
        L[locations.json]
        N[notes.json]
    end

    subgraph Normalization Pipeline
        NORM[normalizeData.js: getNormalizedReceipts]
    end

    subgraph Analytical Engines
        CONN[connections.js: scoreConnection & getAllConnections]
        MOM[connections.js: getLifeMoments]
        INS[insights.js: generateInsights]
        CHAP[chapters.js: getLifeChapters]
    end

    subgraph State & Views
        APP[App.jsx State Root]
        HOME[Home.jsx]
        EXPLORE[Explore.jsx]
        GRAPH[Connections.jsx]
        CHAPS[Chapters.jsx]
        MODALS[ReceiptDetailModal & MomentStoryModal]
    end

    Data Layer --> NORM
    NORM --> APP
    APP --> CONN
    APP --> MOM
    APP --> INS
    APP --> CHAP
    APP --> HOME & EXPLORE & GRAPH & CHAPS
    HOME & EXPLORE & GRAPH & CHAPS --> MODALS
```

---

## 🧮 Relationship Scoring Algorithm

Connections between any two receipts ($R_1$ and $R_2$) are calculated in [`src/utils/connections.js`](file:///c:/Users/akash/OneDrive/Desktop/FrontendArena/src/utils/connections.js) using the following weighted rule set:

| Factor | Condition | Score Weight | Description |
| :--- | :--- | :---: | :--- |
| **Time Delta** | $\Delta t \le 15\text{ min}$ | `+4` | Immediate temporal co-occurrence |
| **Time Delta** | $15 < \Delta t \le 30\text{ min}$ | `+2` | Close temporal co-occurrence |
| **Time Delta** | $30 < \Delta t \le 120\text{ min}$ | `+1` | Same session co-occurrence |
| **Date Match** | Same calendar date | `+2` | Same-day relationship |
| **Location** | Exact venue name match | `+4` | Occurred at identical venue |
| **City** | Same city match | `+1` | Occurred in same metropolitan area |
| **Thematic Tags** | Shared keywords in `tags[]` | `+3` | Semantic / contextual overlap |
| **Cross-Activity** | Cross-domain synergy (e.g., Music + Food) | `+2` | Activity synergy bonus |

### Connection Strength Classification:
- **Score $\ge 6$**: 🟢 `Strong connection`
- **Score $4 \le \text{Score} < 6$**: 🟡 `Possible connection`
- **Score $2 \le \text{Score} < 4$**: ⚪ `Same-day relationship`
- **Score $< 2$**: Discarded (No significant correlation)

---

## 📦 Unified Receipt Schema

Every data source is normalized into a standard shape:

```typescript
interface NormalizedReceipt {
  id: string;                    // Unique identifier
  type: 'music' | 'purchase' | 'expense' | 'place' | 'note';
  title: string;                 // Track name, Merchant, Place name, Note title
  description: string;           // Detailed description or summary
  date: string;                  // 'YYYY-MM-DD'
  time: string;                  // 'HH:MM'
  datetime: string;              // Full ISO 8601 string
  timestampMs: number;           // Unix epoch in milliseconds
  location: {
    name?: string;
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  } | null;
  amount: number | null;         // Numerical financial cost (if applicable)
  currency: string | null;       // 'USD', etc.
  category: string;              // 'Music', 'Food & Dining', 'Places', etc.
  metadata: Record<string, any>; // Original domain-specific fields
  icon: string;                  // Lucide icon name
  tags: string[];                // Search and semantic comparison keywords
}
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akashkumar6205/FrontendArena.git
   cd FrontendArena
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with hot module replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready static assets into `dist/`. |
| `npm run preview` | Locally serves the production build from `dist/` for testing. |

---

## ☁️ Deployment (Vercel)

This project is optimized for zero-config deployment on [Vercel](https://vercel.com/):

1. Import your GitHub repository into Vercel.
2. Ensure the build settings are detected as:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (or `node node_modules/vite/bin/vite.js build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click **Deploy**.

---

## 📄 License

This project is licensed under the [MIT License](file:///c:/Users/akash/OneDrive/Desktop/FrontendArena/LICENSE).
