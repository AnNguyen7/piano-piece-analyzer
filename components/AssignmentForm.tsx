'use client';

import { Assignment } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface AssignmentFormProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  onRemoveAssignment: (id: string) => void;
}

export default function AssignmentForm({
  assignments,
  onAddAssignment,
  onRemoveAssignment,
}: AssignmentFormProps) {
  const hasAssignments = assignments.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Calculate deadline from "days from now"
    const daysUntilDeadline = parseInt(formData.get('daysUntilDeadline') as string);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + daysUntilDeadline);

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      type: formData.get('type') as Assignment['type'],
      deadline: deadline.toISOString().split('T')[0],
      estimatedHours: parseFloat(formData.get('estimatedHours') as string),
      priority: formData.get('priority') as Assignment['priority'],
    };

    onAddAssignment(newAssignment);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold text-emerald-900">Your Assignments</h2>
          <p className="text-base text-emerald-700">Add assignments for AI to schedule.</p>
        </div>
        {hasAssignments && (
          <span className="text-sm font-medium uppercase tracking-wide text-emerald-600">
            {assignments.length} added
          </span>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-emerald-100 p-4">
        <div>
          <h3 className="text-lg font-semibold text-emerald-900">Add an assignment</h3>
          <p className="text-base text-emerald-700">AI will break these into optimized study sessions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
              Assignment Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Calculus Midterm"
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              placeholder="Math 201"
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
              Type
            </label>
            <select
              name="type"
              required
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
              <option value="project">Project</option>
              <option value="reading">Reading</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
              Due in (days)
            </label>
            <input
              type="number"
              name="daysUntilDeadline"
              required
              min="1"
              max="365"
              placeholder="3"
              defaultValue="3"
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-1 text-sm text-emerald-600">How many days until due?</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
              Total Hours Needed
            </label>
            <input
              type="number"
              name="estimatedHours"
              required
              min="0.5"
              max="100"
              step="0.5"
              placeholder="4"
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-1 text-sm text-emerald-600">Total study time for this assignment</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-emerald-700">
              Priority
            </label>
            <select
              name="priority"
              required
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-base text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 py-2 text-base font-semibold text-white transition hover:bg-emerald-700"
        >
          Add Assignment
        </button>
      </form>

      {hasAssignments && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-emerald-900">Added Assignments</h3>
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3"
            >
              <div className="flex-1 pr-4 text-base">
                <p className="font-medium text-emerald-900">{assignment.name}</p>
                <p className="text-emerald-700">
                  {assignment.subject} • {assignment.type} • Due {new Date(assignment.deadline).toLocaleDateString()} •{' '}
                  {assignment.estimatedHours}h • {assignment.priority} priority
                </p>
              </div>
              <button
                onClick={() => onRemoveAssignment(assignment.id)}
                className="rounded-full p-2 text-red-500 transition hover:bg-red-100/80"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
