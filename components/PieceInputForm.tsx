'use client';

import { PieceAnalysisRequest } from '@/lib/types';
import { Music } from 'lucide-react';
import { useState } from 'react';

interface PieceInputFormProps {
  onAnalyze: (piece: PieceAnalysisRequest) => void;
  isLoading: boolean;
}

export default function PieceInputForm({ onAnalyze, isLoading }: PieceInputFormProps) {
  const [pieceName, setPieceName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pieceName.trim()) {
      return;
    }

    const piece: PieceAnalysisRequest = {
      id: Date.now().toString(),
      pieceName: pieceName.trim(),
    };

    onAnalyze(piece);
  };

  // Predefined piece examples for quick testing
  const examplePieces = [
    'Für Elise by Beethoven',
    'Clair de Lune by Debussy',
    'Moonlight Sonata 3rd Movement',
    'River Flows in You by Yiruma',
    'Chopin Nocturne Op. 9 No. 2',
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500">
          <Music className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">Piece Analysis</h2>
          <p className="text-base text-emerald-700">
            Get detailed technical difficulty analysis for any piano piece
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Piece Input */}
        <div>
          <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-emerald-700">
            Piano Piece Name
          </label>
          <input
            type="text"
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
            placeholder='e.g., "Moonlight Sonata 3rd Movement" or "Chopin Nocturne Op. 9 No. 2"'
            className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-3 text-base text-emerald-900 placeholder:text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            disabled={isLoading}
            required
          />
          <p className="mt-2 text-sm text-emerald-600">
            Enter the piece name and composer - AI will analyze its technical difficulty
          </p>
        </div>

        {/* Quick Examples */}
        <div>
          <label className="mb-2 block text-sm font-medium uppercase tracking-wide text-emerald-700">
            Quick Examples
          </label>
          <div className="flex flex-wrap gap-2">
            {examplePieces.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPieceName(example)}
                className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <button
          type="submit"
          disabled={isLoading || !pieceName.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:from-emerald-700 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'AI is analyzing...' : 'Analyze Piece'}
        </button>
      </form>
    </div>
  );
}
