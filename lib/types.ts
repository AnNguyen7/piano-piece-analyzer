export interface Assignment {
  id: string;
  name: string;
  subject: string;
  type: 'exam' | 'assignment' | 'project' | 'reading';
  deadline: string; // ISO date string
  estimatedHours: number;
  priority: 'high' | 'medium' | 'low';
}

export interface UserPreferences {
  peakHours: string; // e.g., "09:00-12:00"
  sessionLength: number; // minutes (25, 50, 90)
  breakLength: number; // minutes (5, 10, 15)
  hoursPerDay: number;
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  task: string;
  subject: string;
  type: 'study' | 'break' | 'review';
  duration: number; // minutes
}

export interface ScheduleResponse {
  schedule: StudySession[];
  rationale: string;
  tips: string[];
}

export interface ScheduleRequest {
  assignments: Assignment[];
  preferences: UserPreferences;
}
