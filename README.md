# Piano Piece Difficulty Analyzer

AI-powered difficulty analyzer that helps pianists choose appropriate repertoire through objective technical analysis.

## Overview

Enter any piano piece and receive detailed analysis including:
- Technical breakdown across 6 categories (Hand Independence, Rhythm, Tempo, Dexterity, Stretches, Pedaling)
- Grade level (ABRSM/RCM/Henle)
- Prerequisite skills required
- Learning timeline for beginner/intermediate/advanced levels
- Piece-specific practice tips
- Recommended exercises

## Prompt Engineering Patterns (CS4680)

This project demonstrates three core prompt engineering patterns:

1. **Persona Pattern** - AI acts as conservatory-trained piano pedagogy expert
2. **Few-Shot Learning** - Learns from detailed example analyses
3. **Structured Output** - Enforces consistent JSON schema

Implementation details in `lib/prompts.ts`

## Tech Stack

- Next.js 15 with TypeScript
- Tailwind CSS
- Google Gemini 2.5 Flash API (free)
- Lucide React icons

## Quick Start

```bash
npm install

# Add API key to .env.local
echo "GOOGLE_GEMINI_API_KEY=your_key_here" > .env.local

npm run dev
```

Get free API key at https://aistudio.google.com/app/apikey

## Key Files

- `lib/prompts.ts` - Three prompt engineering patterns
- `lib/types.ts` - TypeScript interfaces
- `app/api/generate-chords/route.ts` - API integration
- `components/PieceInputForm.tsx` - Input form
- `components/AnalysisDisplay.tsx` - Results display

## Environment Variables

Create `.env.local`:

```env
GOOGLE_GEMINI_API_KEY=your_key_here
AI_PROVIDER=gemini
```

## Example Pieces

**Beginner**: Für Elise, River Flows in You
**Intermediate**: Clair de Lune, Chopin Nocturne Op. 9 No. 2
**Advanced**: Moonlight Sonata 3rd Movement, La Campanella

## License

MIT - CS4680 Prompt Engineering Final Project
