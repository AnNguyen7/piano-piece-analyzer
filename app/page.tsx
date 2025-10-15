'use client';

import { useState } from 'react';
import AssignmentForm from '@/components/AssignmentForm';
import PreferencesForm from '@/components/PreferencesForm';
import ScheduleDisplay from '@/components/ScheduleDisplay';
import { PromptPreview } from '@/components/PromptPreview';
import { Assignment, UserPreferences, ScheduleResponse } from '@/lib/types';
import { Loader2, Calendar, Info } from 'lucide-react';

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    peakHours: '09:00-12:00',
    sessionLength: 50,
    breakLength: 10,
    hoursPerDay: 4,
  });
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddAssignment = (assignment: Assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleGenerateSchedule = async () => {
    if (assignments.length === 0) {
      setError('Please add at least one assignment');
      return;
    }

    setLoading(true);
    setError(null);
    setSchedule(null);

    try {
      const response = await fetch('/api/generate-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignments,
          preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate schedule');
      }

      const data: ScheduleResponse = await response.json();
      setSchedule(data);

      // Scroll to schedule after generation
      setTimeout(() => {
        document.getElementById('schedule-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-gradient-to-r from-emerald-400 to-green-300 text-emerald-950">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/60">
            <Calendar className="text-emerald-700" size={28} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">CS4680 Prompt Engineering MVP</p>
            <h1 className="text-3xl font-bold leading-tight text-emerald-900">AI Study Planner Studio</h1>
            <p className="text-emerald-800">
              Craft structured prompts on the left, watch AI generate a personalized plan on the right.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="space-y-6">
          {/* Input Forms Section */}
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                <AssignmentForm
                  assignments={assignments}
                  onAddAssignment={handleAddAssignment}
                  onRemoveAssignment={handleRemoveAssignment}
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <PreferencesForm preferences={preferences} onUpdate={setPreferences} />
                </div>
                <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
                  <PromptPreview assignments={assignments} preferences={preferences} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleGenerateSchedule}
                disabled={loading || assignments.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-emerald-700 hover:to-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  'Generate Study Plan'
                )}
              </button>

              {assignments.length === 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
                  <Info className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-800">
                    Add at least one assignment so AI has context to schedule.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-base text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* AI Generated Schedule Section */}
          <section className="relative">
            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-white/95 text-center p-8 backdrop-blur-sm">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-600" />
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">AI is generating your schedule...</h3>
                <p className="text-base text-emerald-700 mb-3">
                  Using Persona + Few-Shot patterns to craft your personalized plan
                </p>
                <p className="text-sm text-emerald-600">
                  ⏱️ This usually takes a few seconds
                </p>
              </div>
            )}

            <div
              id="schedule-section"
              className="min-h-[320px] rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm"
            >
              {schedule ? (
                <ScheduleDisplay schedule={schedule} />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-emerald-700">
                  <h3 className="mb-3 text-xl font-semibold text-emerald-900">
                    Your AI-crafted schedule will appear here
                  </h3>
                  <p className="text-base">
                    Gather assignments, set your preferences, and press &ldquo;Generate Study Plan&rdquo; to see
                    the AI&apos;s structured response using our persona and few-shot patterns.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-emerald-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-emerald-800">
          <p className="font-medium">Built with Next.js 14, Tailwind CSS, and Generative AI</p>
          <p className="text-emerald-700">Prompt patterns: Persona, Few-Shot, Structured JSON Output</p>
        </div>
      </footer>
    </div>
  );
}
