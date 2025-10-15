import { Assignment, UserPreferences } from './types';

/**
 * Three Prompt Engineering Patterns for CS 4680
 * 
 * This demonstrates the patterns from class applied to AI study planning.
 * Each pattern makes the AI's output more reliable and useful.
 */

// PATTERN 1: PERSONA PATTERN
// Give the AI a specific expert role so it knows how to respond
const PERSONA = "Act as an expert study planner who specializes in creating optimized study schedules with spaced repetition.";

// PATTERN 2: FEW-SHOT LEARNING PATTERN  
// Show the AI examples of what good output looks like
const FEW_SHOT_EXAMPLES = `Examples:
Input: Math Exam (10 hours needed, due 2024-01-20)
Output: [{"id":"1","date":"2024-01-15","startTime":"14:00","endTime":"16:00","task":"Study Math Exam","subject":"Math","type":"study","duration":120}, {"id":"2","date":"2024-01-17","startTime":"14:00","endTime":"16:00","task":"Study Math Exam","subject":"Math","type":"study","duration":120}]

Input: History Paper (5 hours needed, due 2024-01-18)
Output: [{"id":"1","date":"2024-01-15","startTime":"10:00","endTime":"12:00","task":"Study History Paper","subject":"History","type":"study","duration":120}, {"id":"2","date":"2024-01-17","startTime":"10:00","endTime":"11:30","task":"Study History Paper","subject":"History","type":"study","duration":90}]`;

// PATTERN 3: STRUCTURED OUTPUT PATTERN
// Force exact JSON format so we can parse the response reliably
const OUTPUT_STRUCTURE = '{"schedule":[{"id":"","date":"","startTime":"","endTime":"","task":"","subject":"","type":"","duration":0}],"rationale":"","tips":[]}';

// Combine all three patterns with user data to create the final prompt
export function generatePrompt(assignments: Assignment[], preferences: UserPreferences): string {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  // Format assignments with ALL details including priority
  const assignmentList = assignments.map((a) =>
    `"${a.name}" (Subject: ${a.subject}, Type: ${a.type}, Due: ${a.deadline}, Hours needed: ${a.estimatedHours}, Priority: ${a.priority})`
  ).join('\n');

  return `${PERSONA}

${FEW_SHOT_EXAMPLES}

Assignments to schedule:
${assignmentList}

Constraints:
- TODAY is ${todayString} (never schedule in the past!)
- Peak hours: ${preferences.peakHours} (schedule ALL sessions within these hours)
- Each session: ${preferences.sessionLength} minutes long
- Break between sessions: ${preferences.breakLength} minutes (if session ends 10:50, next starts 11:00)
- Daily limit: Maximum ${preferences.hoursPerDay} hours per day
- High priority assignments should be scheduled earlier
- Each session duration must be exactly ${preferences.sessionLength} minutes

Required rules:
1. Use format "Study [Assignment Name]" for task names
2. Schedule sessions ONLY during peak hours (${preferences.peakHours})
3. Include ${preferences.breakLength}-minute breaks between consecutive sessions
4. Respect ${preferences.hoursPerDay}h daily limit
5. Add 1 review session before each deadline
6. Use sequential IDs: "1", "2", "3", etc.
7. Each session duration = ${preferences.sessionLength} minutes exactly

IMPORTANT: Keep rationale under 50 words. Provide 3 brief tips (10 words each max).

Return ONLY valid JSON:
${OUTPUT_STRUCTURE}`;
}
