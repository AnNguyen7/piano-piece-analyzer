'use client';

import { PieceAnalysisResponse } from '@/lib/types';
import { CheckCircle2, AlertCircle, Clock, Lightbulb, Dumbbell } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: PieceAnalysisResponse;
}

export default function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  // Helper function to get color for difficulty level
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'very high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header: Piece Info */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-6 border border-emerald-200">
        <h2 className="text-3xl font-bold text-emerald-900">{analysis.pieceName}</h2>
        <p className="text-xl text-emerald-700 mt-1">{analysis.composer}</p>
        <div className="flex gap-4 mt-4">
          <span className="inline-block rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white">
            {analysis.gradeLevel}
          </span>
          <span className="inline-block rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white">
            {analysis.estimatedDifficulty}
          </span>
        </div>
      </div>

      {/* Technical Breakdown */}
      <div className="rounded-xl border border-emerald-200 bg-white p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <AlertCircle size={24} className="text-emerald-600" />
          Technical Breakdown
        </h3>
        <div className="space-y-3">
          {analysis.technicalBreakdown.map((category, index) => (
            <div key={index} className="border border-emerald-100 rounded-lg p-4 hover:bg-emerald-50 transition">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-emerald-900">{category.category}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(category.difficulty)}`}>
                  {category.difficulty}
                </span>
              </div>
              <p className="text-sm text-emerald-700">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisite Skills */}
      <div className="rounded-xl border border-emerald-200 bg-white p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <CheckCircle2 size={24} className="text-emerald-600" />
          Prerequisite Skills
        </h3>
        <ul className="space-y-2">
          {analysis.prerequisiteSkills.map((skill, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={14} />
              </span>
              <span className="text-emerald-800">{skill}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Learning Timeline */}
      <div className="rounded-xl border border-emerald-200 bg-white p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <Clock size={24} className="text-emerald-600" />
          Learning Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="font-semibold text-emerald-900 mb-2">Beginner</h4>
            <p className="text-sm text-emerald-700">{analysis.learningTimeline.beginner}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="font-semibold text-emerald-900 mb-2">Intermediate</h4>
            <p className="text-sm text-emerald-700">{analysis.learningTimeline.intermediate}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="font-semibold text-emerald-900 mb-2">Advanced</h4>
            <p className="text-sm text-emerald-700">{analysis.learningTimeline.advanced}</p>
          </div>
        </div>
      </div>

      {/* Practice Tips */}
      <div className="rounded-xl border border-emerald-200 bg-white p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <Lightbulb size={24} className="text-emerald-600" />
          Practice Tips
        </h3>
        <ul className="space-y-2">
          {analysis.practiceTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <Lightbulb size={14} />
              </span>
              <span className="text-emerald-800">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Exercises */}
      <div className="rounded-xl border border-emerald-200 bg-white p-6">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
          <Dumbbell size={24} className="text-emerald-600" />
          Recommended Exercises
        </h3>
        <ul className="space-y-2">
          {analysis.recommendedExercises.map((exercise, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Dumbbell size={14} />
              </span>
              <span className="text-emerald-800">{exercise}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
