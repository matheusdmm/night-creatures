# Night Creatures

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

A character sheet builder for **Vampire: The Masquerade V5**.  
No account. Just the darkness.

## Features

- Create and manage multiple vampire characters
- Full V5 sheet — Attributes, Skills, Disciplines, Advantages, Humanity, Trackers
- Dice roller with Hunger dice and success counting
- Sheet validation against V5 rules
- Character creation guide with clan banes, compulsions, and step-by-step allocation

## Stack

| Layer    | Tech                         |
|----------|------------------------------|
| Frontend | React 19 + TypeScript + Vite |
| Styling  | Tailwind CSS                 |
| Backend  | FastAPI + Uvicorn            |
| Deploy   | Vercel                       |

## Getting Started

**Prerequisites:** Node.js, pnpm, Python 3.11+

```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
pip install -r api/requirements.txt
```

```bash
# Run frontend (http://localhost:5173)
pnpm dev

# Run backend (http://localhost:8000)
pnpm backend
```

Vite proxies `/api/*` to the FastAPI server automatically in development.

## License

This project is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — free to share and adapt, with attribution, for non-commercial use only.

## Disclaimer

*Vampire: The Masquerade* is owned by Paradox Interactive. Night Creatures is an unofficial fan tool with no affiliation.
