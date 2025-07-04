import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmergencyRequest {
  patientId: string
  alertType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  symptoms: string[]
  location?: {
    lat: number
    lng: number
    address: string
  }
  emergencyLevel: number
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

    const emergencyData: EmergencyRequest = await req.json()

    // Create emergency alert
    const { data: alertData, error: alertError } = await supabaseClient
      .from('emergency_alerts')
      .insert({
        patient_id: emergencyData.patientId,
        alert_type: emergencyData.alertType,
        severity: emergencyData.severity,
        symptoms: emergencyData.symptoms,
        location: emergencyData.location || {},
        status: 'active'
      })
      .select()

    if (alertError) throw alertError

    // Determine response protocol based on emergency level
    const responseProtocol = await determineResponseProtocol(emergencyData.emergencyLevel, emergencyData.severity)

    // Simulate emergency response system
    if (emergencyData.emergencyLevel >= 3) {
      await notifyEmergencyServices(emergencyData)
      await assignEmergencyResponder(alertData[0].id)
    }

    // Send notifications
    await sendEmergencyNotifications(emergencyData, responseProtocol)

    return new Response(
      JSON.stringify({ 
        success: true,
        alertId: alertData[0].id,
        responseProtocol,
        estimatedResponseTime: responseProtocol.estimatedResponseTime,
        instructions: responseProtocol.instructions
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

async function determineResponseProtocol(emergencyLevel: number, severity: string) {
  const protocols = {
    4: { // Critical
      responseType: 'immediate_emergency',
      estimatedResponseTime: '3-5 minutes',
      responderType: 'paramedic_team',
      instructions: [
        'Emergency services have been notified',
        'Paramedic team is being dispatched',
        'Stay calm and do not move unless necessary',
        'Keep airways clear if conscious',
        'If unconscious, check for pulse and breathing'
      ]
    },
    3: { // High
      responseType: 'urgent_medical',
      estimatedResponseTime: '8-12 minutes',
      responderType: 'medical_team',
      instructions: [
        'Medical team is being dispatched',
        'Stay in current location',
        'Monitor vital signs if possible',
        'Prepare medical history and current medications',
        'Have someone stay with you if possible'
      ]
    },
    2: { // Medium
      responseType: 'scheduled_urgent',
      estimatedResponseTime: '30-60 minutes',
      responderType: 'nurse_practitioner',
      instructions: [
        'Urgent care appointment being scheduled',
        'Monitor symptoms closely',
        'Avoid strenuous activities',
        'Take prescribed medications as directed',
        'Call back if symptoms worsen'
      ]
    },
    1: { // Low
      responseType: 'routine_followup',
      estimatedResponseTime: '2-4 hours',
      responderType: 'healthcare_advisor',
      instructions: [
        'Healthcare advisor will contact you',
        'Continue monitoring symptoms',
        'Follow home care recommendations',
        'Schedule routine appointment if needed',
        'Contact us if you have concerns'
      ]
    }
  }

  return protocols[emergencyLevel as keyof typeof protocols] || protocols[1]
}

async function notifyEmergencyServices(emergencyData: EmergencyRequest) {
  // Simulate emergency services notification
  console.log('🚨 EMERGENCY SERVICES NOTIFIED 🚨')
  console.log('Patient ID:', emergencyData.patientId)
  console.log('Emergency Level:', emergencyData.emergencyLevel)
  console.log('Location:', emergencyData.location)
  console.log('Symptoms:', emergencyData.symptoms)
  
  // In production, this would integrate with:
  // - 911 dispatch systems
  // - Hospital emergency departments
  // - Ambulance services
  // - Emergency medical services APIs
}

async function assignEmergencyResponder(alertId: string) {
  // Simulate responder assignment
  const responders = [
    'EMT-001-John-Smith',
    'EMT-002-Sarah-Johnson', 
    'EMT-003-Michael-Brown',
    'PARAMEDIC-001-Lisa-Davis'
  ]
  
  const assignedResponder = responders[Math.floor(Math.random() * responders.length)]
  
  console.log('Emergency responder assigned:', assignedResponder)
  console.log('Alert ID:', alertId)
  
  // In production, this would:
  // - Query available responders by location
  // - Check responder qualifications and availability
  // - Assign based on proximity and expertise
  // - Send dispatch notifications to responder devices
}

async function sendEmergencyNotifications(emergencyData: EmergencyRequest, protocol: any) {
  // Simulate various notification channels
  
  // SMS notifications
  console.log('📱 SMS sent to patient emergency contacts')
  
  // Email notifications
  console.log('📧 Email sent to healthcare providers')
  
  // Push notifications
  console.log('🔔 Push notification sent to patient app')
  
  // Hospital notifications
  if (emergencyData.emergencyLevel >= 3) {
    console.log('🏥 Hospital emergency department notified')
  }
  
  // Family notifications
  console.log('👨‍👩‍👧‍👦 Emergency contacts notified')
  
  // In production, this would integrate with:
  // - Twilio for SMS
  // - SendGrid for email
  // - Firebase for push notifications
  // - Hospital information systems
  // - Emergency contact databases
}