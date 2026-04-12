# Spain Persona Frontier

Spain Persona Frontier is a React + TypeScript web app that explores Spanish audience segments through a concrete use case: **device access for practical AI training**.

Instead of acting as a generic persona explorer, the app is intentionally focused on a single operational question:

**How does device access shape the suitability of different audience segments in Spain for practical AI training?**

## Current focus

The current version is built around a specific use case:

**Use case: Device access**

The app lets the user inspect filtered audience segments and understand them through:

- selected segment by **region**, **area type**, and **age group**
- estimated size of the filtered segment
- dominant media channel
- typical profile of the segment
- device access and internet intensity as the central analytical lens
- age and media-channel charts for context

## Data source

This project is based on the Hugging Face dataset:

- `apol/spain-reference-personas-frontier`

The current app uses an aggregated JSON derived from the `persona_core` subset.

## Why this project exists

This project was shaped around a product constraint: make the app **specific**, **real**, and tied to a **clear use case** rather than building a broad exploratory dashboard.

The present approach balances two layers:

- **cards that attack the use case**
- **cards and charts that provide context**

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Python for dataset inspection and aggregation

## Repository structure

```text
spain-persona-webapp/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ AgeChart.tsx
│  │  ├─ ChannelChart.tsx
│  │  ├─ FilterBar.tsx
│  │  └─ SnapshotCard.tsx
│  ├─ data/
│  │  ├─ mockPersonaData.ts
│  │  └─ realPersonaData.json
│  ├─ services/
│  │  └─ personaService.ts
│  ├─ types/
│  │  └─ persona.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ BuildRealPersonaData.py
├─ ListPersonaCoreColumns.py
├─ LoadDataset.py
└─ README.md
```

## Local development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Python scripts

The repository includes Python scripts used to inspect and transform the source dataset.

### `LoadDataset.py`

Loads the Hugging Face dataset and prints sample information.

Example:

```bash
py -3.14 LoadDataset.py
```

### `ListPersonaCoreColumns.py`

Lists the available columns in the `persona_core` subset and can be used to inspect the field space before deciding what to aggregate.

Example:

```bash
py -3.14 ListPersonaCoreColumns.py
```

### `BuildRealPersonaData.py`

Builds `realPersonaData.json` from the `persona_core` subset.

The current aggregation groups records by:

- `region`
- `urban_rural`
- `age_group`

and exports segment-level fields such as:

- size
- trust
- price sensitivity
- top issue
- top channel signals
- gender top
- device access top
- internet intensity top
- education top
- socioeconomic tier top
- reading frequency top

Example:

```bash
py -3.14 BuildRealPersonaData.py
```

After generating the file, copy the resulting JSON into:

```text
src/data/realPersonaData.json
```

## Current interface logic

The current UI is organized around three layers:

### 1. Filters

The user filters by:

- region
- area type
- age group

### 2. Summary cards

The app currently surfaces:

- selected segment
- estimated size
- top channel
- typical profile

### 3. Use case block

A dedicated block highlights:

- device access
- internet intensity

This is the central product thesis of the current version.

### 4. Context charts

Two charts provide supporting context:

- age distribution
- media channels

## Notes on data interpretation

Some values shown in the UI are direct aggregations from the dataset, while others are dominant values within the selected segment.

For example:

- **Top channel** is derived from aggregated media-source signals
- **Typical profile** summarizes dominant gender, education, socioeconomic tier, and reading frequency
- **Device access focus** is centered on dominant device access and internet intensity for the selected segment

## Status

Current status: **first functional version**

Implemented:

- working React app
- filters by region, area type, and age group
- real aggregated data
- use-case-oriented layout
- custom card and chart styling
- charts for age and media channels

Planned next steps:

- deploy directly from GitHub
- continue refining the case-use framing
- decide whether to keep expanding the app around `device_access` or pivot to another single core indicator

## Author

Raul Santos
