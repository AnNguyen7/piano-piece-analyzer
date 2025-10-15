import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No API key found' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    
    // Try different model names
    const modelsToTry = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'models/gemini-pro'];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        
        return NextResponse.json({ 
          success: true, 
          workingModel: modelName,
          message: 'API key works!',
          testResponse: text 
        });
      } catch (err) {
        console.log(`Model ${modelName} failed:`, err instanceof Error ? err.message : String(err));
        continue;
      }
    }
    
    return NextResponse.json({ 
      error: 'None of the models worked',
      triedModels: modelsToTry
    }, { status: 500 });
  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json({ 
      error: 'API test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
