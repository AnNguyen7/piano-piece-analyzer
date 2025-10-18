import { NextRequest, NextResponse } from 'next/server';
import { generatePrompt } from '@/lib/prompts';
import { PieceAnalysisRequest, PieceAnalysisResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: { piece: PieceAnalysisRequest } = await req.json();
    const { piece } = body;

    // Validate input
    if (!piece || !piece.pieceName || piece.pieceName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter a piano piece name' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GOOGLE_GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      console.error('No API key configured');
      return NextResponse.json(
        { error: 'AI API key is not configured. Please add GOOGLE_GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Generate the prompt using our patterns
    const prompt = generatePrompt(piece);

    // Check which AI provider to use
    const provider = process.env.AI_PROVIDER || 'gemini';
    console.log(`Analyzing piano piece using ${provider.toUpperCase()} API for: ${piece.pieceName}`);

    let responseText: string;

    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      // OpenAI (GPT-4o-mini)
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a piano pedagogy expert. Return only valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3, // Lower temperature for more consistent analysis
          max_tokens: 4000
        })
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      responseText = openaiData.choices[0].message.content;
      console.log('OpenAI response received');

    } else {
      // Gemini (default) - Free
      if (!process.env.GOOGLE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3, // Lower for consistent analysis
            maxOutputTokens: 8000, // Large enough for detailed analysis
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      console.log('Gemini raw response:', JSON.stringify(geminiData, null, 2));

      // Check if response was blocked by safety filters
      if (!geminiData.candidates || geminiData.candidates.length === 0) {
        console.error('No candidates in Gemini response. Possible safety filter block.');
        throw new Error('Gemini API returned no results. The content may have been filtered.');
      }

      // Check if candidate has content
      if (!geminiData.candidates[0].content || !geminiData.candidates[0].content.parts) {
        console.error('Gemini candidate missing content:', geminiData.candidates[0]);
        throw new Error('Gemini response missing content. Check finishReason: ' + (geminiData.candidates[0].finishReason || 'unknown'));
      }

      responseText = geminiData.candidates[0].content.parts[0].text;
      console.log('Gemini response received successfully');
    }

    // Parse the JSON response
    let analysisData: PieceAnalysisResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      analysisData = JSON.parse(cleanedResponse);
      console.log('Successfully parsed analysis data for:', analysisData.pieceName);

      // Validate required fields
      if (!analysisData.pieceName || !analysisData.technicalBreakdown || analysisData.technicalBreakdown.length === 0) {
        throw new Error('Invalid analysis data structure');
      }

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, responseText);
      return NextResponse.json(
        {
          error: 'Failed to parse analysis data. AI response was not valid JSON.',
          details: responseText.substring(0, 200)
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Error analyzing piano piece:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to analyze piano piece', details: message },
      { status: 500 }
    );
  }
}
