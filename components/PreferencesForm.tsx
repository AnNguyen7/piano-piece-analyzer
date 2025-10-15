'use client';

import { UserPreferences } from '@/lib/types';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onUpdate: (preferences: UserPreferences) => void;
}

export default function PreferencesForm({ preferences, onUpdate }: PreferencesFormProps) {
  // AnN fix - Simplified to use dropdown for peak hours on 15/10
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // AnN fix - Handle number conversion safely to avoid NaN errors on 15/10
    let parsedValue: string | number = value;
    if (name.includes('Length') || name === 'hoursPerDay') {
      const num = parseFloat(value);
      parsedValue = isNaN(num) ? preferences[name as keyof UserPreferences] as number : num;
    }

    onUpdate({
      ...preferences,
      [name]: parsedValue,
    });
  };

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-xl font-semibold text-emerald-900">Study Preferences</h2>
        <p className="text-base text-emerald-700">
          Shape the persona-driven prompt with your peak hours and pacing.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
            Peak Study Hours
          </label>
          <select
            name="peakHours"
            value={preferences.peakHours}
            onChange={handleChange}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="06:00-09:00">6:00 AM - 9:00 AM (Early Morning)</option>
            <option value="09:00-12:00">9:00 AM - 12:00 PM (Morning)</option>
            <option value="12:00-15:00">12:00 PM - 3:00 PM (Afternoon)</option>
            <option value="15:00-18:00">3:00 PM - 6:00 PM (Late Afternoon)</option>
            <option value="18:00-21:00">6:00 PM - 9:00 PM (Evening)</option>
            <option value="21:00-24:00">9:00 PM - 12:00 AM (Night)</option>
            <option value="22:00-02:00">10:00 PM - 2:00 AM (Late Night Owl)</option>
            <option value="23:00-03:00">11:00 PM - 3:00 AM (Midnight Grinder)</option>
          </select>
          <p className="mt-1 text-sm text-emerald-600">When you focus best.</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Session Length (minutes)
          </label>
          <select
            name="sessionLength"
            value={preferences.sessionLength}
            onChange={handleChange}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="25">25 min (Pomodoro)</option>
            <option value="50">50 min (Standard)</option>
            <option value="90">90 min (Deep Work)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Break Length (minutes)
          </label>
          <select
            name="breakLength"
            value={preferences.breakLength}
            onChange={handleChange}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Max Hours Per Day
          </label>
          <input
            type="number"
            name="hoursPerDay"
            value={preferences.hoursPerDay}
            onChange={handleChange}
            min="1"
            max="12"
            step="0.5"
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <p className="mt-1 text-sm text-emerald-600">Daily study limit</p>
        </div>
      </div>
    </div>
  );
}
