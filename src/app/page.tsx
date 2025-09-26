'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Feather, Scroll } from 'lucide-react'

interface PoemData {
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

export default function Home() {
  const [poemData, setPoemData] = useState<PoemData>({
    character: '',
    location: '',
    event: '',
    emotion: '',
    language: 'english'
  })
  
  const [generatedPoem, setGeneratedPoem] = useState<GeneratedPoem | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)

  const handleGenerate = async () => {
    if (!poemData.character || !poemData.location || !poemData.event || !poemData.emotion) {
      return
    }

    setIsGenerating(true)
    setIsRevealing(false)
    
    try {
      const response = await fetch('/api/generate-poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poemData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate poem')
      }

      const poem = await response.json()
      setGeneratedPoem(poem)
      
      // Trigger reveal animation
      setTimeout(() => setIsRevealing(true), 100)
    } catch (error) {
      console.error('Error generating poem:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderIlluminatedLetter = (letter: string) => {
    return (
      <span className="illuminated-letter relative inline-block">
        <span className="text-6xl md:text-8xl font-bold text-amber-800 dark:text-amber-600">
          {letter}
        </span>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-amber-600 rounded-full opacity-20"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-800 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 -left-3 w-4 h-12 bg-green-800 rounded-full opacity-15 transform -rotate-45"></div>
          <div className="absolute top-1/2 -right-3 w-4 h-12 bg-blue-800 rounded-full opacity-15 transform rotate-45"></div>
        </div>
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-amber-950 parchment-texture">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Feather className="w-8 h-8 text-amber-800 dark:text-amber-200" />
            <h1 className="text-4xl md:text-6xl font-bold text-amber-900 dark:text-amber-100 gothic-font">
              Medieval Poetry Generator
            </h1>
            <Scroll className="w-8 h-8 text-amber-800 dark:text-amber-200" />
          </div>
          <p className="text-lg text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
            Craft authentic medieval-style poems with illuminated manuscripts. Choose your character, location, event, and emotion to weave tales of chivalry and romance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card className="bg-amber-100/80 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700 backdrop-blur-sm medieval-border medieval-shadow parchment-stain">
            <CardHeader className="illuminated-border rounded-t-lg">
              <CardTitle className="text-2xl text-amber-900 dark:text-amber-100 gothic-font text-center">
                Craft Your Tale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="character" className="text-amber-800 dark:text-amber-200 font-medium">
                  Character
                </Label>
                <Select value={poemData.character} onValueChange={(value) => setPoemData({...poemData, character: value})}>
                  <SelectTrigger className="bg-white/50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-100">
                    <SelectValue placeholder="Choose your character" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="noble">Noble</SelectItem>
                    <SelectItem value="commoner">Commoner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-amber-800 dark:text-amber-200 font-medium">
                  Location
                </Label>
                <Select value={poemData.location} onValueChange={(value) => setPoemData({...poemData, location: value})}>
                  <SelectTrigger className="bg-white/50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-100">
                    <SelectValue placeholder="Choose your location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="castle">Castle</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="village">Village</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event" className="text-amber-800 dark:text-amber-200 font-medium">
                  Event
                </Label>
                <Select value={poemData.event} onValueChange={(value) => setPoemData({...poemData, event: value})}>
                  <SelectTrigger className="bg-white/50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-100">
                    <SelectValue placeholder="Choose your event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="battle">Battle</SelectItem>
                    <SelectItem value="love">Love</SelectItem>
                    <SelectItem value="treachery">Treachery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emotion" className="text-amber-800 dark:text-amber-200 font-medium">
                  Emotion
                </Label>
                <Select value={poemData.emotion} onValueChange={(value) => setPoemData({...poemData, emotion: value})}>
                  <SelectTrigger className="bg-white/50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-100">
                    <SelectValue placeholder="Choose your emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joy">Joy</SelectItem>
                    <SelectItem value="sorrow">Sorrow</SelectItem>
                    <SelectItem value="rage">Rage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-amber-800 dark:text-amber-200 font-medium">
                  Language
                </Label>
                <Select value={poemData.language} onValueChange={(value) => setPoemData({...poemData, language: value})}>
                  <SelectTrigger className="bg-white/50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-600 text-amber-900 dark:text-amber-100">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!poemData.character || !poemData.location || !poemData.event || !poemData.emotion || isGenerating}
                className="w-full bg-amber-700 hover:bg-amber-800 text-amber-50 dark:bg-amber-600 dark:hover:bg-amber-700 dark:text-amber-50 font-medium py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Weaving your tale...
                  </>
                ) : (
                  <>
                    <Feather className="mr-2 h-4 w-4" />
                    Generate Poem
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Poem Display */}
          <Card className="bg-amber-100/80 dark:bg-amber-900/80 border-amber-300 dark:border-amber-700 backdrop-blur-sm medieval-border medieval-shadow parchment-stain">
            <CardHeader className="illuminated-border rounded-t-lg">
              <CardTitle className="text-2xl text-amber-900 dark:text-amber-100 gothic-font text-center">
                Illuminated Manuscript
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedPoem ? (
                <div className={`poem-container ${isRevealing ? 'reveal-animation' : ''}`}>
                  <div className="poem-scroll max-h-96 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold text-center mb-6 text-amber-900 dark:text-amber-100 gothic-font illuminated-title">
                      {generatedPoem.title}
                    </h2>
                    
                    <div className="space-y-6 text-amber-800 dark:text-amber-200 leading-relaxed">
                      {generatedPoem.stanzas.map((stanza, index) => (
                        <div key={index} className="stanza">
                          <div className="flex flex-wrap gap-2">
                            {stanza.split('').map((char, charIndex) => {
                              if (charIndex === 0 && index === 0) {
                                return renderIlluminatedLetter(char)
                              }
                              return (
                                <span 
                                  key={charIndex} 
                                  className={`inline-block ${charIndex === 0 ? 'ml-2' : ''} ${isRevealing ? 'ink-bleed' : ''}`}
                                  style={{ 
                                    animationDelay: isRevealing ? `${(index * 16 + charIndex) * 50}ms` : '0ms'
                                  }}
                                >
                                  {char}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-amber-600 dark:text-amber-400">
                  <Scroll className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your illuminated poem will appear here</p>
                  <p className="text-sm mt-2">Fill in the details and click generate to begin</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .parchment-texture {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(180, 140, 90, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(160, 120, 80, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(200, 160, 100, 0.1) 0%, transparent 50%);
          background-size: 200px 200px, 150px 150px, 100px 100px;
          position: relative;
        }
        
        .parchment-texture::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(139, 90, 43, 0.03) 2px,
              rgba(139, 90, 43, 0.03) 4px
            );
          pointer-events: none;
        }

        .gothic-font {
          font-family: 'Times New Roman', Georgia, serif;
          letter-spacing: 0.05em;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .illuminated-letter {
          position: relative;
          display: inline-block;
          line-height: 1;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(180, 140, 90, 0.2);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 90, 43, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 90, 43, 0.7);
        }

        .reveal-animation {
          animation: scrollUnfold 2s ease-out;
        }

        @keyframes scrollUnfold {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ink-bleed {
          animation: inkBleed 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes inkBleed {
          0% {
            opacity: 0;
            transform: scale(0.8);
            filter: blur(2px);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        .illuminated-title {
          position: relative;
          display: inline-block;
          text-shadow: 
            2px 2px 4px rgba(139, 69, 19, 0.3),
            0 0 10px rgba(212, 175, 55, 0.2);
          background: linear-gradient(45deg, #8B4513, #D2691E, #CD853F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          padding: 0 1rem;
        }

        .illuminated-title::before {
          content: '❦';
          position: absolute;
          left: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8B4513;
          font-size: 1.5rem;
          opacity: 0.7;
        }

        .illuminated-title::after {
          content: '❧';
          position: absolute;
          right: -1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8B4513;
          font-size: 1.5rem;
          opacity: 0.7;
        }

        .stanza {
          line-height: 2;
          margin-bottom: 1.5rem;
          text-align: justify;
          position: relative;
          padding: 1rem;
          border-left: 3px solid rgba(139, 69, 19, 0.2);
          background: linear-gradient(90deg, rgba(139, 69, 19, 0.05), transparent);
        }

        .stanza::before {
          content: '¶';
          position: absolute;
          left: -1rem;
          top: 0.5rem;
          color: #8B4513;
          font-size: 1.2rem;
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}