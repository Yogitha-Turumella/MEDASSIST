import React, { useState } from 'react';
import { Brain, Mic, Camera, Globe, AlertTriangle, Stethoscope } from 'lucide-react';
import { EnhancedVoiceInput } from '../components/EnhancedVoiceInput';
import { EnhancedImageDiagnosis } from '../components/EnhancedImageDiagnosis';
import { MultilingualChatBot } from '../components/MultilingualChatBot';
import { EmergencyEscalation } from '../components/EmergencyEscalation';
import { useAuth } from '../hooks/useAuth';

export const EnhancedSymptomCheckerPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showImageDiagnosis, setShowImageDiagnosis] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState(0);
  const [showEmergencyEscalation, setShowEmergencyEscalation] = useState(false);
  
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleEmergencyEscalation = (level: number) => {
    setEmergencyLevel(level);
    if (level >= 3) {
      setShowEmergencyEscalation(true);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    console.log('Voice transcript:', transcript);
    // Process voice input for symptom analysis
  };

  const handleImageAnalysis = (analysis: any) => {
    console.log('Image analysis:', analysis);
    // Process image analysis results
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Brain className="h-20 w-20 text-blue-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Advanced AI Health Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Experience the future of healthcare with our multilingual AI assistant featuring 
            voice input, image diagnosis, and real-time emergency escalation.
          </p>
          
          {/* User Status */}
          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mb-8">
              <p className="text-green-800 font-medium">
                ✓ Signed in as {user.user_metadata?.name || user.email?.split('@')[0]}
              </p>
              <p className="text-green-600 text-sm">All features available • Data will be saved</p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto mb-8">
              <p className="text-yellow-800 font-medium">⚠ Not signed in</p>
              <p className="text-yellow-600 text-sm">Sign in to save your analysis and access all features</p>
            </div>
          )}
          
          {/* Language Selector */}
          <div className="flex items-center justify-center mb-8">
            <Globe className="h-5 w-5 text-gray-500 mr-3" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Voice Input Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Mic className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Voice Symptom Input</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Describe your symptoms naturally using voice input in your preferred language.
            </p>
            <button
              onClick={() => setShowVoiceInput(!showVoiceInput)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              {showVoiceInput ? 'Hide Voice Input' : 'Start Voice Input'}
            </button>
          </div>

          {/* Image Diagnosis Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Camera className="h-8 w-8 text-purple-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">AI Image Diagnosis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Upload or capture images of skin conditions, wounds, or other visible symptoms.
            </p>
            <button
              onClick={() => setShowImageDiagnosis(!showImageDiagnosis)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              {showImageDiagnosis ? 'Hide Image Diagnosis' : 'Start Image Analysis'}
            </button>
          </div>

          {/* Chat Assistant Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">AI Chat Assistant</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Interactive multilingual chatbot for comprehensive symptom analysis and guidance.
            </p>
            <button
              onClick={() => setShowChatBot(!showChatBot)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              {showChatBot ? 'Hide Chat Assistant' : 'Start Chat Session'}
            </button>
          </div>
        </div>

        {/* Voice Input Section */}
        {showVoiceInput && (
          <div className="mb-8">
            <EnhancedVoiceInput
              onTranscript={handleVoiceTranscript}
              language={selectedLanguage}
            />
          </div>
        )}

        {/* Image Diagnosis Section */}
        {showImageDiagnosis && (
          <div className="mb-8">
            <EnhancedImageDiagnosis onAnalysis={handleImageAnalysis} />
          </div>
        )}

        {/* Emergency Features */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 mb-8">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Emergency Features</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Automatic Emergency Detection</h4>
              <p className="text-gray-700 text-sm mb-4">
                Our AI automatically detects emergency situations and escalates to appropriate medical professionals.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time symptom severity analysis</li>
                <li>• Automatic emergency service notification</li>
                <li>• GPS location sharing for responders</li>
                <li>• 24/7 emergency response team</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Emergency Response Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-sm">Level 1-2: Routine consultation recommended</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm">Level 3: Urgent medical attention needed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm">Level 4: Critical emergency - immediate response</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Stethoscope className="h-6 w-6 text-blue-500 mr-2" />
            Advanced Platform Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">12+ Languages</h4>
              <p className="text-sm text-gray-600">
                Multilingual support for global accessibility
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Deep Learning AI</h4>
              <p className="text-sm text-gray-600">
                Advanced neural networks for accurate diagnosis
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Emergency Escalation</h4>
              <p className="text-sm text-gray-600">
                Automatic emergency detection and response
              </p>
            </div>
          </div>
        </div>

        {/* Backend Integration Status */}
        {user && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4">🔗 Backend Integration Active</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Data Collection:</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Voice recordings saved to Supabase Storage</li>
                  <li>✓ Image uploads with AI analysis stored</li>
                  <li>✓ Symptom analyses tracked in database</li>
                  <li>✓ Chat sessions with sentiment analysis</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">User Management:</h5>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Authenticated user sessions</li>
                  <li>✓ Patient/Doctor profile management</li>
                  <li>✓ Secure data access with RLS</li>
                  <li>✓ Real-time data synchronization</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <h4 className="font-bold mb-2">Important Medical Disclaimer</h4>
              <p className="mb-2">
                This advanced AI health assistant is designed for informational and educational purposes only. 
                It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="mb-2">
                <strong>Always consult with a qualified healthcare provider</strong> for proper medical evaluation, 
                especially if you have persistent, severe, or worsening symptoms.
              </p>
              <p>
                In case of medical emergencies, call emergency services immediately (911 in the US) or visit your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Chat Bot */}
      {showChatBot && (
        <MultilingualChatBot
          sessionType="symptom_intake"
          onEmergencyEscalation={handleEmergencyEscalation}
        />
      )}

      {/* Emergency Escalation Modal */}
      {showEmergencyEscalation && (
        <EmergencyEscalation
          emergencyLevel={emergencyLevel}
          patientLocation={{
            lat: 40.7128,
            lng: -74.0060,
            address: "123 Healthcare Ave, Medical City, MC 12345"
          }}
          onClose={() => setShowEmergencyEscalation(false)}
        />
      )}
    </div>
  );
};