import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { technology } = await request.json();

    console.log('Calling Claude API with technology:', technology);

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Analyze ${technology} using McLuhan's tetrad of media effects. Structure your response exactly like this:

<tetrad_analysis>
<enhancement>
[Write a paragraph about what ${technology} enhances or intensifies in society and human behavior]
</enhancement>

<obsolescence>
[Write a paragraph about what ${technology} makes obsolete or pushes out of prominence]
</obsolescence>

<retrieval>
[Write a paragraph about what ${technology} brings back or retrieves from the past]
</retrieval>

<reversal>
[Write a paragraph about what ${technology} becomes when pushed to its extremes]
</reversal>
</tetrad_analysis>

Be insightful and profound in McLuhan's style. Consider effects on human senses, social interactions, and cultural patterns. Uncover hidden impacts.`
        }]
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API Error Response:', {
        status: claudeResponse.status,
        statusText: claudeResponse.statusText,
        headers: Object.fromEntries(claudeResponse.headers.entries()),
        body: errorText
      });
      
      return NextResponse.json(
        { error: `Claude API Error: ${claudeResponse.status} ${claudeResponse.statusText}` },
        { status: claudeResponse.status }
      );
    }

    const data = await claudeResponse.json();
    console.log('Claude API Response:', data);

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected Claude API response structure:', data);
      return NextResponse.json(
        { error: 'Invalid response structure from Claude API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: data.content[0].text });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}