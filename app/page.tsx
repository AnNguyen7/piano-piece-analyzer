'use client';

import { useState } from 'react';
import PieceInputForm from '@/components/PieceInputForm';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import { PieceAnalysisRequest, PieceAnalysisResponse } from '@/lib/types';
import { Loader2, Music, Sparkles } from 'lucide-react';

export default function Home() {
  const [analysisData, setAnalysisData] = useState<PieceAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzePiece = async (piece: PieceAnalysisRequest) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const response = await fetch('/api/analyze-piece', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ piece }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze piece');
      }

      const data: PieceAnalysisResponse = await response.json();
      setAnalysisData(data);

      // Scroll to results after generation
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="border-b border-emerald-200 bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Music className="text-white" size={36} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
                CS4680 Prompt Engineering Project
              </p>
              <h1 className="text-4xl font-bold leading-tight">
                Piano Piece Difficulty Analyzer
              </h1>
              <p className="mt-1 text-lg text-emerald-50">
                AI-powered technical analysis to help you choose the right piece
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-8">
          {/* Input Section */}
          <div className="rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-xl">
            <PieceInputForm onAnalyze={handleAnalyzePiece} isLoading={loading} />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-100 to-green-100 p-4">
            <Sparkles className="mt-1 flex-shrink-0 text-emerald-600" size={24} />
            <div>
              <h3 className="font-semibold text-emerald-900">
                How it works: 3 Prompt Engineering Patterns
              </h3>
              <p className="text-sm text-emerald-700">
                <strong>Persona Pattern:</strong> AI acts as expert piano pedagogue •{' '}
                <strong>Few-Shot Pattern:</strong> Learns from example analyses •{' '}
                <strong>Structured Output:</strong> Returns consistent JSON analysis
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4">
              <p className="text-base font-medium text-red-800">{error}</p>
              <p className="mt-1 text-sm text-red-600">
                Try a different song or check your API key configuration.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="rounded-3xl border-2 border-emerald-200 bg-white p-12 text-center shadow-xl">
              <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-emerald-600" />
              <h3 className="text-2xl font-bold text-emerald-900">
                AI is analyzing the piano piece...
              </h3>
              <p className="mt-2 text-base text-emerald-700">
                Using Persona + Few-Shot patterns to analyze technical difficulty
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                This usually takes 10-20 seconds
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysisData && !loading && (
            <div
              id="analysis-results"
              className="rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-xl"
            >
              <AnalysisDisplay analysis={analysisData} />
            </div>
          )}

          {/* Empty State */}
          {!analysisData && !loading && !error && (
            <div className="rounded-3xl border-2 border-emerald-200 bg-white p-12 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500">
                <Music className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">
                Ready to analyze piano pieces!
              </h3>
              <p className="mt-2 text-base text-emerald-700">
                Enter any piano piece and get detailed technical difficulty analysis
              </p>
              <p className="mt-4 text-sm text-emerald-600">
                Try: &quot;Für Elise&quot; or &quot;Moonlight Sonata 3rd Movement&quot;
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-emerald-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center">
          <p className="font-semibold text-emerald-900">
            Built with Next.js 15, TypeScript, Tailwind CSS, and Google Gemini AI
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Prompt Engineering Patterns: Persona • Few-Shot Learning • Structured JSON Output
          </p>
        </div>
      </footer>
    </div>
  );
}
