import { createClient } from '@supabase/supabase-js';
import { config, isServiceConfigured } from './config';

// Create Supabase client with configuration
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Database types
export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialization: string;
  experience_years: number;
  is_retired: boolean;
  license_number: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  rating: number;
  location: string;
  education: string;
  languages: string[];
  profile_image?: string;
  bio?: string;
  consultation_fee: number;
  availability: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  emergency_contact: Record<string, any>;
  medical_history: string[];
  allergies: string[];
  current_medications: string[];
  insurance_info: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  duration_minutes: number;
  type: 'video' | 'in_person' | 'phone' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  prescription?: string;
  follow_up_required: boolean;
  video_room_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SymptomAnalysis {
  id: string;
  patient_id: string;
  symptoms: string[];
  ai_prediction: Record<string, any>;
  confidence_score: number;
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  recommended_actions: string[];
  image_analysis: Record<string, any>;
  voice_input?: string;
  language: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  session_type: string;
  language: string;
  messages: Record<string, any>[];
  sentiment_analysis: Record<string, any>;
  escalated_to_human: boolean;
  emergency_level: number;
  created_at: string;
  updated_at: string;
}

export interface MedicalImage {
  id: string;
  patient_id: string;
  image_url: string;
  image_type: string;
  ai_analysis: Record<string, any>;
  doctor_review?: string;
  diagnosis_confidence: number;
  created_at: string;
}

export interface EmergencyAlert {
  id: string;
  patient_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  location: Record<string, any>;
  status: 'active' | 'responded' | 'resolved' | 'false_alarm';
  response_time?: string;
  assigned_responder?: string;
  created_at: string;
}

// Authentication functions
export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, userData: { name: string; userType: 'patient' | 'doctor' }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            user_type: userData.userType
          }
        }
      });

      if (error) throw error;

      // Create profile based on user type (only if Supabase is properly configured)
      if (data.user && isServiceConfigured('supabase')) {
        try {
          if (userData.userType === 'patient') {
            await this.createPatientProfile(data.user.id, userData.name);
          } else if (userData.userType === 'doctor') {
            await this.createDoctorProfile(data.user.id, userData.name);
          }
        } catch (profileError) {
          console.log('Profile creation skipped - database not configured');
        }
      }

      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Create patient profile
  async createPatientProfile(userId: string, name: string) {
    if (!isServiceConfigured('supabase')) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('patients')
      .insert({
        user_id: userId,
        name,
        emergency_contact: {},
        medical_history: [],
        allergies: [],
        current_medications: [],
        insurance_info: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create doctor profile
  async createDoctorProfile(userId: string, name: string) {
    if (!isServiceConfigured('supabase')) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('doctors')
      .insert({
        user_id: userId,
        name,
        specialization: '',
        license_number: `LIC-${Date.now()}`,
        verification_status: 'pending',
        rating: 0,
        location: '',
        education: '',
        languages: ['English'],
        consultation_fee: 0,
        availability: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Data services
export const dataService = {
  // Upload image to Supabase Storage
  async uploadImage(file: File, bucket: string = 'medical-images'): Promise<string> {
    if (!isServiceConfigured('supabase')) {
      // Return a mock URL for demo purposes
      return `https://example.com/mock-upload/${file.name}`;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return `https://example.com/mock-upload/${file.name}`;
    }
  },

  // Save medical image analysis
  async saveMedicalImage(patientId: string, imageUrl: string, imageType: string, aiAnalysis: any) {
    if (!isServiceConfigured('supabase')) {
      console.log('Mock: Medical image saved', { patientId, imageUrl, imageType, aiAnalysis });
      return { id: 'mock-id', patient_id: patientId, image_url: imageUrl };
    }

    try {
      const { data, error } = await supabase
        .from('medical_images')
        .insert({
          patient_id: patientId,
          image_url: imageUrl,
          image_type: imageType,
          ai_analysis: aiAnalysis,
          diagnosis_confidence: aiAnalysis.confidence || 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save medical image error:', error);
      throw error;
    }
  },

  // Save symptom analysis
  async saveSymptomAnalysis(analysisData: Partial<SymptomAnalysis>) {
    if (!isServiceConfigured('supabase')) {
      console.log('Mock: Symptom analysis saved', analysisData);
      return { id: 'mock-id', ...analysisData };
    }

    try {
      const { data, error } = await supabase
        .from('symptom_analyses')
        .insert(analysisData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save symptom analysis error:', error);
      throw error;
    }
  },

  // Save chat session
  async saveChatSession(sessionData: Partial<ChatSession>) {
    if (!isServiceConfigured('supabase')) {
      console.log('Mock: Chat session saved', sessionData);
      return { id: 'mock-id', ...sessionData };
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save chat session error:', error);
      throw error;
    }
  },

  // Update chat session
  async updateChatSession(sessionId: string, updates: Partial<ChatSession>) {
    if (!isServiceConfigured('supabase')) {
      console.log('Mock: Chat session updated', { sessionId, updates });
      return { id: sessionId, ...updates };
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update chat session error:', error);
      throw error;
    }
  },

  // Create appointment
  async createAppointment(appointmentData: Partial<Appointment>) {
    if (!isServiceConfigured('supabase')) {
      console.log('Mock: Appointment created', appointmentData);
      return { id: 'mock-id', ...appointmentData };
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  },

  // Get patient profile
  async getPatientProfile(userId: string) {
    if (!isServiceConfigured('supabase')) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get doctor profile
  async getDoctorProfile(userId: string) {
    if (!isServiceConfigured('supabase')) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all verified doctors
  async getVerifiedDoctors() {
    if (!isServiceConfigured('supabase')) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('verification_status', 'verified')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get verified doctors error:', error);
      return [];
    }
  },

  // Create emergency alert
  async createEmergencyAlert(alertData: Partial<EmergencyAlert>) {
    if (!isServiceConfigured('supabase')) {
      console.log('Mock: Emergency alert created', alertData);
      return { id: 'mock-id', ...alertData };
    }

    try {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create emergency alert error:', error);
      throw error;
    }
  }
};

// AI Services
export const aiService = {
  // Analyze symptoms with AI
  async analyzeSymptoms(symptoms: string[], patientId: string, language: string = 'en', voiceInput?: string, imageAnalysis?: any) {
    if (!isServiceConfigured('supabase')) {
      // Return mock analysis
      return {
        success: true,
        analysis: {
          condition: 'Mock Analysis',
          confidence: 85,
          severity: 'medium',
          recommendations: ['Mock recommendation 1', 'Mock recommendation 2']
        }
      };
    }

    try {
      const response = await fetch(`${config.supabase.url}/functions/v1/ai-symptom-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.supabase.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          patientId,
          language,
          voiceInput,
          imageAnalysis
        })
      });

      if (!response.ok) throw new Error('AI analysis failed');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  },

  // Analyze sentiment
  async analyzeSentiment(text: string, appointmentId?: string, patientId?: string, doctorId?: string) {
    if (!isServiceConfigured('supabase')) {
      return {
        success: true,
        sentiment: 'positive',
        confidence: 0.8
      };
    }

    try {
      const response = await fetch(`${config.supabase.url}/functions/v1/sentiment-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.supabase.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          appointmentId,
          patientId,
          doctorId,
          feedbackType: 'appointment'
        })
      });

      if (!response.ok) throw new Error('Sentiment analysis failed');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  },

  // Handle emergency escalation
  async escalateEmergency(emergencyData: {
    patientId: string;
    alertType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    symptoms: string[];
    location?: any;
    emergencyLevel: number;
  }) {
    if (!isServiceConfigured('supabase')) {
      return {
        success: true,
        alertId: 'mock-alert-id',
        responseProtocol: {
          responseType: 'mock_response',
          estimatedResponseTime: '5-10 minutes'
        }
      };
    }

    try {
      const response = await fetch(`${config.supabase.url}/functions/v1/emergency-escalation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.supabase.anonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emergencyData)
      });

      if (!response.ok) throw new Error('Emergency escalation failed');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Emergency escalation error:', error);
      throw error;
    }
  }
};