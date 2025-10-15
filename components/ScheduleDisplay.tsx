'use client';

import { ScheduleResponse } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import { Calendar, Clock, BookOpen, Lightbulb } from 'lucide-react';

interface ScheduleDisplayProps {
  schedule: ScheduleResponse;
}

export default function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  // AnN fix - Updated to green theme with better text contrast on 15/10
  // Group sessions by date
  const sessionsByDate = schedule.schedule.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, typeof schedule.schedule>);

  const sortedDates = Object.keys(sessionsByDate).sort();

  return (
    <div className="space-y-6">
      {/* Header - AnN fix: Updated to green gradient on 15/10 */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-2">Your Study Schedule</h2>
        <p className="text-green-50">
          {schedule.schedule.length} study sessions planned
        </p>
      </div>

      {/* AI Rationale - AnN fix: Updated styling on 15/10 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="text-emerald-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-emerald-900 mb-1">AI Strategy</h3>
            <p className="text-emerald-800">{schedule.rationale}</p>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <h3 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
          <BookOpen size={18} />
          Study Tips
        </h3>
        <ul className="space-y-1">
          {schedule.tips.map((tip, index) => (
            <li key={index} className="text-teal-800 text-sm flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar View */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar size={20} className="text-gray-900" />
          Calendar View
        </h3>

        {sortedDates.map((date) => (
          <div key={date} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h4 className="font-semibold text-gray-800">{formatDate(date)}</h4>
            </div>

            <div className="divide-y">
              {sessionsByDate[date].map((session) => (
                <div
                  key={session.id}
                  className={`p-4 hover:bg-gray-50 transition ${
                    session.type === 'review'
                      ? 'bg-emerald-50 border-l-4 border-emerald-500'
                      : session.type === 'break'
                      ? 'bg-teal-50 border-l-4 border-teal-500'
                      : 'bg-green-50 border-l-4 border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-gray-600" />
                        <span className="font-semibold text-sm text-gray-900">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </span>
                        <span className="text-xs bg-gray-300 text-gray-800 px-2 py-1 rounded">
                          {session.duration} min
                        </span>
                      </div>

                      <h5 className="font-semibold text-gray-900 mb-1">{session.task}</h5>
                      <p className="text-sm text-gray-600">{session.subject}</p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        session.type === 'review'
                          ? 'bg-emerald-200 text-emerald-800'
                          : session.type === 'break'
                          ? 'bg-teal-200 text-teal-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {session.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats - AnN fix: Updated to green theme on 15/10 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">
            {schedule.schedule.filter((s) => s.type === 'study').length}
          </div>
          <div className="text-sm text-green-800">Study Sessions</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-emerald-700">
            {schedule.schedule.filter((s) => s.type === 'review').length}
          </div>
          <div className="text-sm text-emerald-800">Review Sessions</div>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-teal-700">
            {Math.round(
              schedule.schedule.reduce((acc, s) => acc + s.duration, 0) / 60
            )}h
          </div>
          <div className="text-sm text-teal-800">Total Study Time</div>
        </div>
      </div>
    </div>
  );
}
