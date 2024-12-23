import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { assistants, memories, userInput } = await req.json();

    // Process each assistant in sequence
    let currentResponse = userInput;
    for (const assistant of assistants) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          ...memories.map((memory: string) => ({
            role: "system" as const,
            content: memory
          })),
          {
            role: "system",
            content: assistant.instructions
          },
          {
            role: "user",
            content: currentResponse
          }
        ]
      });

      currentResponse = completion.choices[0].message.content || '';
    }

    return NextResponse.json({ response: currentResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}