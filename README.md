# Spain Persona Frontier

Spain Persona Frontier is a web app for exploring Spanish audience segments through a concrete use case: **device access for practical AI training**.

The project is built around the public dataset **`apol/spain-reference-personas-frontier`** and focuses on a simple but useful question:

**Which audience segments in Spain are better positioned for practical AI training when viewed through the lens of device access?**

## Main idea

Instead of building a generic audience explorer, this project narrows the focus to a specific and actionable use case.

The current version emphasizes:

- selected segment by **region**, **area type**, and **age group**
- estimated segment size
- dominant media channel
- typical profile of the selected segment
- device access and internet intensity as the central use case
- contextual charts for age distribution and media channels

## Data source

This project is based on the Hugging Face dataset:

`apol/spain-reference-personas-frontier`

The current web app uses an aggregated JSON derived from the `persona_core` subset.

## Current use case

**Use case: Device access**

The goal is to inspect Spanish audience segments from the perspective of digital access conditions relevant to practical AI training, especially:

- dominant device access
- internet intensity
- education
- socioeconomic tier
- reading frequency
- top media channel

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Python for dataset inspection and aggregation

## Project structure

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
