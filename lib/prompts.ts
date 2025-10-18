import { PieceAnalysisRequest } from './types';

/**
 * Three Prompt Engineering Patterns for CS 4680
 *
 * PATTERN 1: PERSONA PATTERN - Expert role for credible analysis
 * PATTERN 2: FEW-SHOT LEARNING - Show examples of good analysis
 * PATTERN 3: STRUCTURED OUTPUT - Enforce consistent JSON format
 */

// =============================================================================
// PATTERN 1: PERSONA PATTERN
// =============================================================================
// Give the AI a specific expert role with relevant experience
const PERSONA = `Act as a highly experienced piano pedagogy expert and conservatory-trained pianist with 20+ years of teaching experience. You specialize in analyzing classical and contemporary piano repertoire, breaking down technical requirements, and creating realistic learning roadmaps for students at all levels. Your analysis helps students choose appropriate pieces and understand what skills they need to develop.`;

// =============================================================================
// PATTERN 2: FEW-SHOT LEARNING PATTERN
// =============================================================================
// Show the AI examples of excellent difficulty analysis output
const FEW_SHOT_EXAMPLES = `Examples of correct piano piece difficulty analysis format:

Input: "Für Elise" by Beethoven (Student Level: Beginner)
Output: {"pieceName":"Für Elise","composer":"Ludwig van Beethoven","gradeLevel":"ABRSM Grade 3-4","estimatedDifficulty":"Late Beginner / Early Intermediate","technicalBreakdown":[{"category":"Hand Independence","difficulty":"Moderate","description":"Right hand melody with left hand alberti bass patterns"},{"category":"Rhythm Complexity","difficulty":"Low","description":"Mostly eighth notes and sixteenth notes in simple patterns"},{"category":"Tempo Requirements","difficulty":"Moderate","description":"Moderato tempo (120 BPM) - not too demanding"},{"category":"Finger Dexterity","difficulty":"Moderate","description":"Fast passages in middle section require even fingering"},{"category":"Hand Stretches","difficulty":"Low","description":"Maximum stretch of one octave, comfortable for most hands"},{"category":"Pedal Technique","difficulty":"Low","description":"Optional pedal usage, not essential for beginners"}],"prerequisiteSkills":["Solid knowledge of basic scales (C major, A minor)","Ability to play hands together with simple accompaniment","Basic dynamic control (p, mf, f)","Familiarity with alberti bass patterns"],"learningTimeline":{"beginner":"3-6 months with consistent daily practice","intermediate":"1-2 months to polish and memorize","advanced":"1-2 weeks to learn, focus on interpretation"},"practiceTips":["Start with hands separately, especially the tricky middle section","Practice alberti bass pattern in left hand until automatic","Use metronome starting at 60 BPM, gradually increase to 120 BPM","Break the piece into 3 sections: A-B-A structure"],"recommendedExercises":["Hanon Exercise #1 for finger evenness","C major and A minor scales, both hands, 2 octaves","Alberti bass drills in different keys","Czerny Op. 599 exercises for similar patterns"]}

Input: "Moonlight Sonata 3rd Movement" by Beethoven (Student Level: Intermediate)
Output: {"pieceName":"Moonlight Sonata 3rd Movement","composer":"Ludwig van Beethoven","gradeLevel":"ABRSM Grade 8 / Diploma Level","estimatedDifficulty":"Advanced","technicalBreakdown":[{"category":"Hand Independence","difficulty":"Very High","description":"Right hand rapid arpeggios while left hand plays strong melodic bass"},{"category":"Rhythm Complexity","difficulty":"High","description":"Presto agitato with constant triplet figurations and polyrhythms"},{"category":"Tempo Requirements","difficulty":"Very High","description":"Presto agitato (188 BPM) - extremely fast and relentless"},{"category":"Finger Dexterity","difficulty":"Very High","description":"Continuous rapid arpeggios require exceptional finger strength and speed"},{"category":"Hand Stretches","difficulty":"Moderate","description":"Some tenths in left hand, may require rolling for smaller hands"},{"category":"Pedal Technique","difficulty":"High","description":"Sophisticated pedaling required to maintain clarity at high speed"}],"prerequisiteSkills":["Mastery of all major and minor scales, arpeggios at high speed","Strong octave technique in both hands","Experience with advanced Romantic repertoire (Chopin, Liszt)","Excellent stamina and endurance for 7+ minute piece","Advanced pedaling technique"],"learningTimeline":{"beginner":"Not recommended - wait 5+ years and build technique first","intermediate":"6-12 months of intensive practice required","advanced":"2-4 months to learn, refine, and memorize"},"practiceTips":["Build speed gradually - start at 60 BPM and increase by 4 BPM weekly","Practice right hand arpeggios in rhythmic patterns (long-short-short)","Work on left hand leaps and octaves separately for accuracy","Record yourself to check clarity at faster tempos"],"recommendedExercises":["Czerny Op. 740 (Art of Finger Dexterity)","Hanon #39 (Tremolo exercise) for rapid repeated notes","Brahms 51 Exercises - arpeggio patterns","Scales in triplets, both hands, 4 octaves"]}`;

// =============================================================================
// PATTERN 3: STRUCTURED OUTPUT PATTERN
// =============================================================================
// Define exact JSON schema that AI must follow for consistent parsing
const OUTPUT_STRUCTURE = `{
  "pieceName": "",
  "composer": "",
  "gradeLevel": "",
  "estimatedDifficulty": "",
  "technicalBreakdown": [
    {
      "category": "",
      "difficulty": "",
      "description": ""
    }
  ],
  "prerequisiteSkills": [],
  "learningTimeline": {
    "beginner": "",
    "intermediate": "",
    "advanced": ""
  },
  "practiceTips": [],
  "recommendedExercises": []
}`;

// =============================================================================
// COMBINE ALL THREE PATTERNS INTO FINAL PROMPT
// =============================================================================
export function generatePrompt(request: PieceAnalysisRequest): string {
  return `${PERSONA}

${FEW_SHOT_EXAMPLES}

Piano piece to analyze:
"${request.pieceName}"

ANALYSIS REQUIREMENTS:
1. Identify the full piece name and composer
2. Assign a grade level (use ABRSM, RCM, or Henle scale if applicable)
3. Provide estimated difficulty (Beginner/Early Intermediate/Intermediate/Late Intermediate/Advanced/Professional)
4. Technical breakdown must include EXACTLY these 6 categories:
   - Hand Independence
   - Rhythm Complexity
   - Tempo Requirements
   - Finger Dexterity
   - Hand Stretches
   - Pedal Technique
   For each category, rate difficulty (Low/Moderate/High/Very High) and give specific description
5. List 4-5 prerequisite skills needed before attempting this piece
6. Provide realistic learning timeline for 3 skill levels (beginner/intermediate/advanced)
7. Give 4-5 practical practice tips specific to THIS piece
8. Recommend 4-5 exercises or etudes that build the required techniques

IMPORTANT OUTPUT RULES:
- Return ONLY valid JSON (no markdown, no code blocks, no extra text)
- Keep descriptions concise (under 100 characters each)
- Be honest about difficulty - don't sugarcoat advanced pieces
- Provide learning timelines for ALL three levels (beginner/intermediate/advanced)
- For pieces too advanced for beginners, clearly state "Not recommended" in beginner timeline
- For easy pieces, indicate quick learning times for intermediate/advanced students

JSON STRUCTURE TO FOLLOW:
${OUTPUT_STRUCTURE}`;
}
