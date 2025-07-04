import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SentimentAnalysisRequest {
  text: string
  appointmentId?: string
  patientId?: string
  doctorId?: string
  feedbackType: 'appointment' | 'chat' | 'general'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { text, appointmentId, patientId, doctorId, feedbackType }: SentimentAnalysisRequest = await req.json()

    // Perform sentiment analysis
    const sentimentResult = await analyzeSentiment(text)
    
    // Extract key themes and emotions
    const themeAnalysis = await extractThemes(text)
    
    // Generate actionable insights
    const insights = await generateInsights(sentimentResult, themeAnalysis, feedbackType)

    // Store analysis results
    if (appointmentId && feedbackType === 'appointment') {
      await storeFeedbackSentiment(supabaseClient, {
        appointmentId,
        patientId,
        doctorId,
        text,
        sentimentResult,
        themeAnalysis,
        insights
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        sentiment: sentimentResult,
        themes: themeAnalysis,
        insights,
        recommendations: insights.recommendations
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function analyzeSentiment(text: string) {
  // Advanced sentiment analysis
  const positiveWords = [
    'excellent', 'amazing', 'wonderful', 'fantastic', 'great', 'good', 'helpful',
    'professional', 'caring', 'thorough', 'knowledgeable', 'satisfied', 'happy',
    'pleased', 'recommend', 'thank', 'appreciate', 'comfortable', 'confident',
    'effective', 'efficient', 'friendly', 'patient', 'understanding', 'skilled'
  ]
  
  const negativeWords = [
    'terrible', 'awful', 'horrible', 'bad', 'poor', 'disappointing', 'rude',
    'unprofessional', 'late', 'rushed', 'dismissive', 'unsatisfied', 'unhappy',
    'frustrated', 'waste', 'complaint', 'angry', 'confused', 'worried', 'scared',
    'painful', 'uncomfortable', 'ineffective', 'slow', 'expensive', 'difficult'
  ]

  const emotionWords = {
    joy: ['happy', 'pleased', 'satisfied', 'delighted', 'grateful'],
    trust: ['confident', 'comfortable', 'secure', 'reliable', 'professional'],
    fear: ['scared', 'worried', 'anxious', 'nervous', 'concerned'],
    anger: ['angry', 'frustrated', 'annoyed', 'upset', 'mad'],
    sadness: ['sad', 'disappointed', 'unhappy', 'depressed', 'discouraged'],
    surprise: ['surprised', 'shocked', 'amazed', 'unexpected', 'sudden']
  }

  const words = text.toLowerCase().split(/\s+/)
  
  let positiveScore = 0
  let negativeScore = 0
  const emotions: Record<string, number> = {}
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++
    if (negativeWords.includes(word)) negativeScore++
    
    Object.entries(emotionWords).forEach(([emotion, emotionWordList]) => {
      if (emotionWordList.includes(word)) {
        emotions[emotion] = (emotions[emotion] || 0) + 1
      }
    })
  })

  const totalWords = words.length
  const sentimentScore = (positiveScore - negativeScore) / Math.max(totalWords, 1)
  
  let sentiment: 'positive' | 'neutral' | 'negative'
  let confidence: number
  
  if (sentimentScore > 0.1) {
    sentiment = 'positive'
    confidence = Math.min(0.95, 0.6 + Math.abs(sentimentScore))
  } else if (sentimentScore < -0.1) {
    sentiment = 'negative'
    confidence = Math.min(0.95, 0.6 + Math.abs(sentimentScore))
  } else {
    sentiment = 'neutral'
    confidence = 0.7
  }

  return {
    sentiment,
    score: sentimentScore,
    confidence,
    emotions,
    positiveWords: positiveScore,
    negativeWords: negativeScore,
    wordCount: totalWords
  }
}

async function extractThemes(text: string) {
  const themes = {
    communication: ['communication', 'explain', 'listen', 'understand', 'clear', 'confusing'],
    professionalism: ['professional', 'respectful', 'courteous', 'rude', 'inappropriate'],
    timeliness: ['time', 'wait', 'late', 'prompt', 'quick', 'slow', 'delayed'],
    effectiveness: ['effective', 'helpful', 'useless', 'beneficial', 'treatment', 'cure'],
    facility: ['clean', 'dirty', 'comfortable', 'crowded', 'quiet', 'noisy'],
    staff: ['nurse', 'receptionist', 'staff', 'team', 'friendly', 'helpful'],
    cost: ['expensive', 'cheap', 'affordable', 'cost', 'price', 'insurance'],
    accessibility: ['accessible', 'parking', 'location', 'convenient', 'difficult']
  }

  const lowerText = text.toLowerCase()
  const themeScores: Record<string, number> = {}
  
  Object.entries(themes).forEach(([theme, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (lowerText.split(keyword).length - 1)
    }, 0)
    themeScores[theme] = score
  })

  // Get top themes
  const sortedThemes = Object.entries(themeScores)
    .filter(([_, score]) => score > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)

  return {
    primaryThemes: sortedThemes.map(([theme, score]) => ({ theme, score })),
    allScores: themeScores
  }
}

async function generateInsights(sentimentResult: any, themeAnalysis: any, feedbackType: string) {
  const insights = {
    overallAssessment: '',
    keyStrengths: [] as string[],
    areasForImprovement: [] as string[],
    recommendations: [] as string[],
    urgencyLevel: 'low' as 'low' | 'medium' | 'high',
    followUpRequired: false
  }

  // Overall assessment
  if (sentimentResult.sentiment === 'positive') {
    insights.overallAssessment = 'Patient expresses satisfaction with the healthcare experience'
    insights.keyStrengths = ['Positive patient experience', 'Good service delivery']
  } else if (sentimentResult.sentiment === 'negative') {
    insights.overallAssessment = 'Patient expresses dissatisfaction requiring attention'
    insights.areasForImprovement = ['Patient satisfaction', 'Service quality']
    insights.urgencyLevel = sentimentResult.confidence > 0.8 ? 'high' : 'medium'
    insights.followUpRequired = true
  } else {
    insights.overallAssessment = 'Mixed or neutral feedback requiring review'
  }

  // Theme-based insights
  themeAnalysis.primaryThemes.forEach(({ theme, score }: { theme: string; score: number }) => {
    if (sentimentResult.sentiment === 'positive') {
      insights.keyStrengths.push(`Strong performance in ${theme}`)
    } else if (sentimentResult.sentiment === 'negative') {
      insights.areasForImprovement.push(`Improvement needed in ${theme}`)
    }
  })

  // Emotion-based insights
  const dominantEmotion = Object.entries(sentimentResult.emotions)
    .sort(([_, a], [__, b]) => (b as number) - (a as number))[0]

  if (dominantEmotion) {
    const [emotion, intensity] = dominantEmotion
    if (emotion === 'fear' || emotion === 'anger') {
      insights.urgencyLevel = 'high'
      insights.followUpRequired = true
      insights.recommendations.push('Immediate follow-up required due to patient emotional state')
    }
  }

  // Generate specific recommendations
  if (feedbackType === 'appointment') {
    if (sentimentResult.sentiment === 'negative') {
      insights.recommendations.push(
        'Schedule follow-up call with patient',
        'Review appointment process for improvements',
        'Consider additional training for staff'
      )
    } else if (sentimentResult.sentiment === 'positive') {
      insights.recommendations.push(
        'Share positive feedback with team',
        'Use as case study for best practices'
      )
    }
  }

  return insights
}

async function storeFeedbackSentiment(supabaseClient: any, data: any) {
  const { error } = await supabaseClient
    .from('feedback')
    .update({
      sentiment_score: data.sentimentResult.score,
      sentiment_analysis: {
        sentiment: data.sentimentResult.sentiment,
        confidence: data.sentimentResult.confidence,
        emotions: data.sentimentResult.emotions,
        themes: data.themeAnalysis,
        insights: data.insights
      }
    })
    .eq('appointment_id', data.appointmentId)

  if (error) {
    console.error('Error storing sentiment analysis:', error)
  }
}