import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SymptomAnalysisRequest {
  symptoms: string[]
  patientId: string
  language: string
  voiceInput?: string
  imageAnalysis?: any
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

    const { symptoms, patientId, language, voiceInput, imageAnalysis }: SymptomAnalysisRequest = await req.json()

    // Enhanced AI analysis combining multiple inputs
    const aiPrediction = await performAdvancedAnalysis(symptoms, voiceInput, imageAnalysis, language)

    // Store analysis in database
    const { data, error } = await supabaseClient
      .from('symptom_analyses')
      .insert({
        patient_id: patientId,
        symptoms,
        ai_prediction: aiPrediction,
        confidence_score: aiPrediction.confidence,
        severity_level: aiPrediction.severity,
        recommended_actions: aiPrediction.recommendations,
        image_analysis: imageAnalysis || {},
        voice_input: voiceInput,
        language
      })
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: data[0],
        prediction: aiPrediction 
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

async function performAdvancedAnalysis(
  symptoms: string[], 
  voiceInput?: string, 
  imageAnalysis?: any, 
  language: string = 'en'
) {
  // Simulate advanced AI analysis
  // In production, this would integrate with OpenAI, Google Cloud AI, or custom ML models
  
  const combinedSymptoms = [...symptoms]
  
  // Add voice-derived symptoms
  if (voiceInput) {
    const voiceSymptoms = extractSymptomsFromVoice(voiceInput)
    combinedSymptoms.push(...voiceSymptoms)
  }

  // Add image-derived symptoms
  if (imageAnalysis?.condition) {
    combinedSymptoms.push(imageAnalysis.condition)
  }

  // Advanced symptom analysis
  const analysis = analyzeSymptomCombination(combinedSymptoms)
  
  // Adjust confidence based on multiple input sources
  let confidenceBoost = 0
  if (voiceInput) confidenceBoost += 10
  if (imageAnalysis) confidenceBoost += 15
  
  analysis.confidence = Math.min(95, analysis.confidence + confidenceBoost)

  // Translate results if needed
  if (language !== 'en') {
    analysis.condition = await translateText(analysis.condition, language)
    analysis.recommendations = await Promise.all(
      analysis.recommendations.map(rec => translateText(rec, language))
    )
  }

  return analysis
}

function extractSymptomsFromVoice(voiceInput: string): string[] {
  // Simple keyword extraction - in production, use NLP
  const symptomKeywords = [
    'pain', 'ache', 'fever', 'cough', 'headache', 'nausea', 
    'dizziness', 'fatigue', 'rash', 'swelling', 'bleeding'
  ]
  
  const foundSymptoms: string[] = []
  const lowerInput = voiceInput.toLowerCase()
  
  symptomKeywords.forEach(keyword => {
    if (lowerInput.includes(keyword)) {
      foundSymptoms.push(keyword)
    }
  })
  
  return foundSymptoms
}

function analyzeSymptomCombination(symptoms: string[]) {
  // Enhanced analysis logic
  const symptomPatterns = {
    'respiratory': {
      keywords: ['cough', 'shortness_breath', 'chest_pain', 'fever'],
      conditions: [
        { name: 'Upper Respiratory Infection', confidence: 85, severity: 'medium' },
        { name: 'Bronchitis', confidence: 75, severity: 'medium' },
        { name: 'Pneumonia', confidence: 65, severity: 'high' }
      ]
    },
    'cardiac': {
      keywords: ['chest_pain', 'shortness_breath', 'dizziness', 'fatigue'],
      conditions: [
        { name: 'Cardiac Concern', confidence: 80, severity: 'high' },
        { name: 'Angina', confidence: 70, severity: 'high' }
      ]
    },
    'gastrointestinal': {
      keywords: ['nausea', 'vomiting', 'diarrhea', 'stomach_pain'],
      conditions: [
        { name: 'Gastroenteritis', confidence: 85, severity: 'medium' },
        { name: 'Food Poisoning', confidence: 75, severity: 'medium' }
      ]
    }
  }

  // Find best matching pattern
  let bestMatch = null
  let maxScore = 0

  for (const [category, pattern] of Object.entries(symptomPatterns)) {
    const matchCount = pattern.keywords.filter(keyword => 
      symptoms.some(symptom => symptom.includes(keyword))
    ).length
    
    const score = matchCount / pattern.keywords.length
    if (score > maxScore && matchCount >= 2) {
      maxScore = score
      bestMatch = pattern.conditions[0]
    }
  }

  if (bestMatch) {
    return {
      condition: bestMatch.name,
      confidence: Math.round(bestMatch.confidence * maxScore),
      severity: bestMatch.severity,
      recommendations: generateRecommendations(bestMatch.name, bestMatch.severity),
      urgency: bestMatch.severity === 'high' ? 'immediate' : 
               bestMatch.severity === 'medium' ? 'soon' : 'routine'
    }
  }

  // Default analysis
  return {
    condition: 'General Health Concern',
    confidence: 70,
    severity: 'low',
    recommendations: [
      'Monitor symptoms closely',
      'Stay hydrated and rest',
      'Consult healthcare provider if symptoms persist',
      'Seek immediate care if symptoms worsen'
    ],
    urgency: 'routine'
  }
}

function generateRecommendations(condition: string, severity: string): string[] {
  const recommendations = {
    'Upper Respiratory Infection': [
      'Rest and stay hydrated',
      'Use humidifier or steam inhalation',
      'Gargle with warm salt water',
      'Take over-the-counter pain relievers as needed',
      'Avoid smoking and secondhand smoke'
    ],
    'Cardiac Concern': [
      'Seek immediate medical attention',
      'Avoid physical exertion',
      'Take prescribed medications as directed',
      'Monitor blood pressure if possible',
      'Call emergency services if symptoms worsen'
    ],
    'Gastroenteritis': [
      'Stay hydrated with clear fluids',
      'Follow BRAT diet (Bananas, Rice, Applesauce, Toast)',
      'Avoid dairy and fatty foods',
      'Rest and avoid strenuous activities',
      'Seek medical care if dehydration occurs'
    ]
  }

  return recommendations[condition as keyof typeof recommendations] || [
    'Monitor symptoms',
    'Stay hydrated',
    'Rest adequately',
    'Consult healthcare provider'
  ]
}

async function translateText(text: string, targetLanguage: string): Promise<string> {
  // Simulate translation - in production, use Google Translate API
  const translations: Record<string, Record<string, string>> = {
    'es': {
      'Upper Respiratory Infection': 'Infección Respiratoria Superior',
      'Rest and stay hydrated': 'Descansa y mantente hidratado',
      'Seek immediate medical attention': 'Busca atención médica inmediata'
    },
    'fr': {
      'Upper Respiratory Infection': 'Infection Respiratoire Supérieure',
      'Rest and stay hydrated': 'Reposez-vous et restez hydraté',
      'Seek immediate medical attention': 'Consultez immédiatement un médecin'
    }
  }

  return translations[targetLanguage]?.[text] || text
}