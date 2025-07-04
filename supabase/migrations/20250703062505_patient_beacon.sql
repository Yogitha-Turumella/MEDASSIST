/*
  # Healthcare Platform Database Schema

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `specialization` (text)
      - `experience_years` (integer)
      - `is_retired` (boolean)
      - `license_number` (text, unique)
      - `verification_status` (text)
      - `rating` (decimal)
      - `location` (text)
      - `education` (text)
      - `languages` (text[])
      - `profile_image` (text)
      - `bio` (text)
      - `consultation_fee` (decimal)
      - `availability` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `patients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `phone` (text)
      - `emergency_contact` (jsonb)
      - `medical_history` (text[])
      - `allergies` (text[])
      - `current_medications` (text[])
      - `insurance_info` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `doctor_id` (uuid, references doctors)
      - `appointment_date` (timestamp)
      - `duration_minutes` (integer)
      - `type` (text) -- 'video', 'in-person', 'phone'
      - `status` (text) -- 'scheduled', 'completed', 'cancelled', 'no-show'
      - `reason` (text)
      - `notes` (text)
      - `prescription` (text)
      - `follow_up_required` (boolean)
      - `video_room_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `symptom_analyses`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `symptoms` (text[])
      - `ai_prediction` (jsonb)
      - `confidence_score` (decimal)
      - `severity_level` (text)
      - `recommended_actions` (text[])
      - `image_analysis` (jsonb)
      - `voice_input` (text)
      - `language` (text)
      - `created_at` (timestamp)

    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `session_type` (text) -- 'symptom_intake', 'general_support', 'emergency'
      - `language` (text)
      - `messages` (jsonb[])
      - `sentiment_analysis` (jsonb)
      - `escalated_to_human` (boolean)
      - `emergency_level` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `medical_images`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `image_url` (text)
      - `image_type` (text) -- 'skin', 'xray', 'mri', 'ct', 'other'
      - `ai_analysis` (jsonb)
      - `doctor_review` (text)
      - `diagnosis_confidence` (decimal)
      - `created_at` (timestamp)

    - `feedback`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, references appointments)
      - `patient_id` (uuid, references patients)
      - `doctor_id` (uuid, references doctors)
      - `rating` (integer)
      - `comment` (text)
      - `sentiment_score` (decimal)
      - `sentiment_analysis` (jsonb)
      - `created_at` (timestamp)

    - `emergency_alerts`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `alert_type` (text)
      - `severity` (text)
      - `symptoms` (text[])
      - `location` (jsonb)
      - `status` (text) -- 'active', 'responded', 'resolved'
      - `response_time` (interval)
      - `assigned_responder` (uuid)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for doctors and patients
    - Add admin policies for emergency responders
*/

-- Create custom types
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE appointment_type AS ENUM ('video', 'in_person', 'phone', 'emergency');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE emergency_status AS ENUM ('active', 'responded', 'resolved', 'false_alarm');

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialization text NOT NULL,
  experience_years integer DEFAULT 0,
  is_retired boolean DEFAULT false,
  license_number text UNIQUE NOT NULL,
  verification_status verification_status DEFAULT 'pending',
  rating decimal(3,2) DEFAULT 0.0,
  location text,
  education text,
  languages text[] DEFAULT ARRAY['English'],
  profile_image text,
  bio text,
  consultation_fee decimal(10,2) DEFAULT 0.0,
  availability jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  date_of_birth date,
  gender text,
  phone text,
  emergency_contact jsonb DEFAULT '{}',
  medical_history text[] DEFAULT ARRAY[]::text[],
  allergies text[] DEFAULT ARRAY[]::text[],
  current_medications text[] DEFAULT ARRAY[]::text[],
  insurance_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  type appointment_type DEFAULT 'video',
  status appointment_status DEFAULT 'scheduled',
  reason text,
  notes text,
  prescription text,
  follow_up_required boolean DEFAULT false,
  video_room_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Symptom analyses table
CREATE TABLE IF NOT EXISTS symptom_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  symptoms text[] NOT NULL,
  ai_prediction jsonb DEFAULT '{}',
  confidence_score decimal(5,2) DEFAULT 0.0,
  severity_level severity_level DEFAULT 'low',
  recommended_actions text[] DEFAULT ARRAY[]::text[],
  image_analysis jsonb DEFAULT '{}',
  voice_input text,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type text DEFAULT 'general_support',
  language text DEFAULT 'en',
  messages jsonb[] DEFAULT ARRAY[]::jsonb[],
  sentiment_analysis jsonb DEFAULT '{}',
  escalated_to_human boolean DEFAULT false,
  emergency_level integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medical images table
CREATE TABLE IF NOT EXISTS medical_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_type text DEFAULT 'other',
  ai_analysis jsonb DEFAULT '{}',
  doctor_review text,
  diagnosis_confidence decimal(5,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  sentiment_score decimal(5,2) DEFAULT 0.0,
  sentiment_analysis jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Emergency alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  severity severity_level DEFAULT 'medium',
  symptoms text[] DEFAULT ARRAY[]::text[],
  location jsonb DEFAULT '{}',
  status emergency_status DEFAULT 'active',
  response_time interval,
  assigned_responder uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors
CREATE POLICY "Doctors can read own profile"
  ON doctors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read verified doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (verification_status = 'verified');

-- RLS Policies for patients
CREATE POLICY "Patients can read own profile"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Patients can update own profile"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Patients can insert own profile"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can read own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- RLS Policies for symptom analyses
CREATE POLICY "Patients can read own analyses"
  ON symptom_analyses FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Patients can create analyses"
  ON symptom_analyses FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- RLS Policies for chat sessions
CREATE POLICY "Users can read own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for medical images
CREATE POLICY "Patients can read own images"
  ON medical_images FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Patients can upload images"
  ON medical_images FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- RLS Policies for feedback
CREATE POLICY "Users can read relevant feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

CREATE POLICY "Patients can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- RLS Policies for emergency alerts
CREATE POLICY "Patients can read own alerts"
  ON emergency_alerts FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

CREATE POLICY "Patients can create alerts"
  ON emergency_alerts FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_verification ON doctors(verification_status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_symptom_analyses_patient ON symptom_analyses(patient_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts(status);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();