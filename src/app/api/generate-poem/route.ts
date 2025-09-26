import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface PoemRequest {
  character: string
  location: string
  event: string
  emotion: string
  language: string
}

interface GeneratedPoem {
  title: string
  stanzas: string[]
  illuminated: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PoemRequest = await request.json()
    const { character, location, event, emotion, language } = body

    // Validate input
    if (!character || !location || !event || !emotion) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Create prompt based on language
    const prompt = language === 'chinese' 
      ? createChinesePrompt(character, location, event, emotion)
      : createEnglishPrompt(character, location, event, emotion)

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a master medieval poet specializing in creating authentic illuminated manuscripts. Your poems must follow strict medieval poetic forms and use archaic language appropriate for the time period.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const poemText = completion.choices[0]?.message?.content || ''
    
    // Parse the generated poem into structured format
    const poem = parsePoem(poemText, character, location, event, emotion, language)

    return NextResponse.json(poem)
  } catch (error) {
    console.error('Error generating poem:', error)
    return NextResponse.json(
      { error: 'Failed to generate poem' },
      { status: 500 }
    )
  }
}

function createEnglishPrompt(character: string, location: string, event: string, emotion: string): string {
  return `Create an authentic medieval poem with the following specifications:

Character: ${character}
Location: ${location}
Event: ${event}
Emotion: ${emotion}

Requirements:
1. Write in archaic English with medieval diction (use words like "thee", "thou", "hath", "doth", "verily", etc.)
2. Structure as 4-line stanzas with cross-rhyme pattern (ABAB)
3. Include vivid medieval imagery and symbolism
4. Create a compelling title that reflects the theme
5. Use elevated, poetic language suitable for illuminated manuscripts
6. Each stanza should be a complete thought that builds the narrative
7. Include at least 3 stanzas

Format your response as:
Title: [poem title]
[stanza 1]
[stanza 2]
[stanza 3]

Example structure:
Title: The Knight's Lament
Upon the castle walls so high
The noble knight doth stand and sigh
His love hath gone beyond the sky
And leaves him there to wonder why

In forest dark where shadows creep
The hero's sword begins to weep
For battles fought in dungeons deep
Where ancient secrets they would keep`

}

function createChinesePrompt(character: string, location: string, event: string, emotion: string): string {
  return `Create an authentic classical Chinese poem with the following specifications:

Character: ${character}
Location: ${location}
Event: ${event}
Emotion: ${emotion}

Requirements:
1. Write in Classical Chinese with traditional poetic forms
2. Structure as 4-line stanzas (quatrain form)
3. Use traditional Chinese imagery and symbolism
4. Create a title in classical Chinese style
5. Use elevated, poetic language suitable for classical poetry
6. Each stanza should be a complete thought that builds the narrative
7. Include at least 3 stanzas
8. Follow traditional Chinese poetic conventions and rhythm

Format your response as:
Title: [poem title in Chinese]
[stanza 1]
[stanza 2]
[stanza 3]

Example structure:
Title: 骑士悲歌
城堡高耸入云端
骑士独立叹苍天
爱人已逝随风去
留下孤独在人间`
}

function parsePoem(poemText: string, character: string, location: string, event: string, emotion: string, language: string): GeneratedPoem {
  const lines = poemText.trim().split('\n')
  
  // Extract title
  let title = ''
  const titleMatch = poemText.match(/Title:\s*(.+)/i)
  if (titleMatch) {
    title = titleMatch[1].trim()
  } else {
    // Generate a default title based on the inputs
    const titles = {
      english: {
        hero: { battle: 'The Hero\'s Valor', love: 'The Hero\'s Heart', treachery: 'The Hero\'s Betrayal' },
        noble: { battle: 'The Noble Quest', love: 'The Noble Courtship', treachery: 'The Noble Deceit' },
        commoner: { battle: 'The Common Struggle', love: 'The Common Heart', treachery: 'The Common Betrayal' }
      },
      chinese: {
        hero: { battle: '英雄之战', love: '英雄之心', treachery: '英雄之叛' },
        noble: { battle: '贵族征途', love: '贵族情缘', treachery: '贵族诡计' },
        commoner: { battle: '平民抗争', love: '平民情愫', treachery: '平民背叛' }
      }
    }
    title = titles[language][character][event] || 'Medieval Tale'
  }

  // Extract stanzas (filter out title line and empty lines)
  const stanzas: string[] = []
  let currentStanza: string[] = []
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.toLowerCase().startsWith('title:')) {
      currentStanza.push(trimmedLine)
      if (currentStanza.length === 4) {
        stanzas.push(currentStanza.join(' '))
        currentStanza = []
      }
    }
  }

  // Add any remaining lines as a final stanza
  if (currentStanza.length > 0) {
    stanzas.push(currentStanza.join(' '))
  }

  // If no stanzas were parsed, create default ones
  if (stanzas.length === 0) {
    stanzas.push('A tale of old, in parchment writ')
    stanzas.push('Of noble deeds and courage fit')
    stanzas.push('Through castle halls and forest deep')
    stanzas.push('The ancient secrets they would keep')
  }

  return {
    title,
    stanzas,
    illuminated: stanzas[0]?.charAt(0) || 'A'
  }
}