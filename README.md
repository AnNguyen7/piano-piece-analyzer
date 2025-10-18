# Piano Piece Difficulty Analyzer

AI-powered piano piece difficulty analyzer that provides detailed technical breakdowns to help pianists choose appropriate repertoire and understand what skills they need to develop.

## 🎹 What It Does

Enter any piano piece (e.g., "Moonlight Sonata 3rd Movement" or "Für Elise") and get:
- **Technical Breakdown**: 6 categories analyzed (Hand Independence, Rhythm, Tempo, Dexterity, Stretches, Pedaling)
- **Grade Level**: ABRSM/RCM/Henle difficulty rating
- **Prerequisite Skills**: What you need to know before attempting this piece
- **Learning Timeline**: Realistic time estimates for beginner/intermediate/advanced
- **Practice Tips**: Specific advice for mastering this piece
- **Recommended Exercises**: Etudes and drills to build required techniques

## 🧠 Prompt Engineering Patterns (CS4680)

This project demonstrates **3 core prompt engineering patterns**:

1. **Persona Pattern** - AI acts as conservatory-trained piano pedagogy expert with 20+ years experience
2. **Few-Shot Learning** - Learns from detailed example analyses (Für Elise, Moonlight Sonata)
3. **Structured Output** - Returns consistent JSON with technical categories, timelines, and tips

See `lib/prompts.ts` for complete implementation with extensive documentation.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS (emerald theme)
- **AI API**: Google Gemini 2.0 Flash (FREE, no credit card)
- **Icons**: Lucide React

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Add your FREE Gemini API key to .env.local
echo "GOOGLE_GEMINI_API_KEY=your_key_here" > .env.local
# Get free key at: https://aistudio.google.com/app/apikey

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎹 Usage

1. Enter a piano piece name (e.g., "Chopin Nocturne Op. 9 No. 2")
2. Select your current skill level (Beginner/Intermediate/Advanced)
3. Click "Analyze Piece"
4. AI analyzes and returns detailed technical breakdown in ~10-20 seconds

The analysis is tailored to YOUR skill level - the AI will tell you if a piece is too advanced or give you an appropriate learning timeline.

## 📁 Key Files

- `lib/prompts.ts` - **THE STAR FILE** - Contains all 3 prompt patterns with extensive documentation
- `lib/types.ts` - TypeScript interfaces for analysis structure
- `app/api/generate-chords/route.ts` - AI API integration (Gemini & OpenAI support)
- `components/PieceInputForm.tsx` - User input interface
- `components/AnalysisDisplay.tsx` - Beautiful analysis results display

## 🎓 CS4680 Project Requirements

✅ **Problem Solved**: Pianists waste time attempting pieces too hard/easy for their level - this tool provides objective difficulty analysis
✅ **Real-World Use**: Helps students choose appropriate repertoire and create realistic practice plans
✅ **Prompt Patterns**: Persona (piano pedagogue) + Few-Shot (example analyses) + Structured Output (JSON)
✅ **UI/UX**: Clean, modern web interface with emerald green theme
✅ **Demo Ready**: Simple input, comprehensive analysis, tailored to user's skill level

## 📝 Environment Variables

Create `.env.local`:

```env
GOOGLE_GEMINI_API_KEY=your_key_here
AI_PROVIDER=gemini
```

Optional OpenAI support:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
```

## 🌐 Deployment

Deploy to Vercel in 2 minutes:

```bash
npm i -g vercel
vercel
```

Add `GOOGLE_GEMINI_API_KEY` in Vercel dashboard → Settings → Environment Variables.

## 🎹 Example Pieces to Try

**Beginner-Friendly:**
- "Für Elise by Beethoven"
- "River Flows in You by Yiruma"
- "Comptine d'un autre été by Yann Tiersen"

**Intermediate:**
- "Clair de Lune by Debussy"
- "Chopin Nocturne Op. 9 No. 2"
- "Moonlight Sonata 1st Movement"

**Advanced:**
- "Moonlight Sonata 3rd Movement"
- "La Campanella by Liszt"
- "Revolutionary Etude by Chopin"

## 📄 License

MIT - Built for CS4680 Prompt Engineering Final Project
