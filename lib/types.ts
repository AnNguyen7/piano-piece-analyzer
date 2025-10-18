// Piano Piece Difficulty Analyzer Types - CS4680 Prompt Engineering Project

// Input from user
export interface PieceAnalysisRequest {
  id: string;
  pieceName: string; // "Moonlight Sonata 3rd Movement" or "Chopin Nocturne Op. 9 No. 2"
}

// Technical breakdown for each category
export interface TechnicalCategory {
  category: string; // "Hand Independence", "Rhythm Complexity", etc.
  difficulty: 'Low' | 'Moderate' | 'High' | 'Very High';
  description: string; // Specific details about this technical aspect
}

// Learning timeline by skill level
export interface LearningTimeline {
  beginner: string; // e.g., "Not recommended - too advanced"
  intermediate: string; // e.g., "6-12 months of intensive practice"
  advanced: string; // e.g., "2-4 months to learn and polish"
}

// AI Response structure
export interface PieceAnalysisResponse {
  pieceName: string; // "Moonlight Sonata 3rd Movement"
  composer: string; // "Ludwig van Beethoven"
  gradeLevel: string; // "ABRSM Grade 8" or "RCM Level 10"
  estimatedDifficulty: string; // "Advanced" or "Late Intermediate"
  technicalBreakdown: TechnicalCategory[]; // 6 categories of analysis
  prerequisiteSkills: string[]; // Skills needed before attempting
  learningTimeline: LearningTimeline; // Time estimates by level
  practiceTips: string[]; // 4-5 specific practice tips
  recommendedExercises: string[]; // 4-5 exercises to build technique
}
