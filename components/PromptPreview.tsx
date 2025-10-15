import { Assignment, UserPreferences } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface PromptPreviewProps {
  assignments: Assignment[];
  preferences: UserPreferences;
}

export function PromptPreview({ assignments, preferences }: PromptPreviewProps) {
  const subjects =
    assignments.length > 0
      ? Array.from(new Set(assignments.map((assignment) => assignment.subject))).join(', ')
      : 'Tell me which courses you are working on';

  const hoursText =
    preferences.hoursPerDay > 0
      ? `${preferences.hoursPerDay} hour${preferences.hoursPerDay === 1 ? '' : 's'}`
      : 'How many hours can you study each day?';

  const nextDeadline = assignments
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];

  const goalText = nextDeadline
    ? `${nextDeadline.name} due ${formatDate(nextDeadline.deadline)}`
    : 'What is your upcoming goal or exam?';

  const contextLines = [
    `Peak focus window: ${preferences.peakHours}`,
    `Preferred session length: ${preferences.sessionLength} minutes`,
    `Break length: ${preferences.breakLength} minutes`,
  ];

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-semibold text-emerald-900">Prompt Outline</h3>
      <div className="space-y-3 text-base text-emerald-800">
        <div className="space-y-2">
          <div>
            <span className="font-semibold text-emerald-900">What subjects are you studying?</span>
            <p className="mt-1 text-emerald-700">{subjects}</p>
          </div>
          <div>
            <span className="font-semibold text-emerald-900">How many hours per day can you dedicate?</span>
            <p className="mt-1 text-emerald-700">{hoursText}</p>
          </div>
          <div>
            <span className="font-semibold text-emerald-900">What is your target exam or goal?</span>
            <p className="mt-1 text-emerald-700">{goalText}</p>
          </div>
          <div>
            <span className="font-semibold text-emerald-900">Anything else to include?</span>
            <p className="mt-1 text-emerald-700">
              {assignments.length > 0
                ? contextLines.join(' • ')
                : 'Share peak hours, preferred session lengths, or study style.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
