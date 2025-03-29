// app/api/save-questions/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { planetId, questions } = await request.json();
    const filePath = path.join(process.cwd(), 'data', 'questions.json');
    
    // Create data directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Read existing data or create new file
    let existingData = {};
    if (fs.existsSync(filePath)) {
      existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // Update with new questions
    const updatedData = {
      ...existingData,
      [planetId]: questions
    };

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving questions:', error);
    return NextResponse.json(
      { error: 'Failed to save questions' },
      { status: 500 }
    );
  }
}