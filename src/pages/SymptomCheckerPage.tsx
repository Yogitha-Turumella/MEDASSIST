import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Stethoscope, Brain, Home, Shield, UserCheck, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Symptom {
  id: string;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
  isRetired: boolean;
  description: string;
  location: string;
}

interface PredictionResult {
  disease: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
  homeRemedies: string[];
  precautions: string[];
  whenToSeeDoctor: string[];
  suggestedDoctors: string[];
  recommendedDoctorIds: number[];
  urgency: 'routine' | 'soon' | 'immediate';
}

const availableSymptoms: Symptom[] = [
  { id: 'fever', name: 'Fever' },
  { id: 'headache', name: 'Headache' },
  { id: 'cough', name: 'Cough' },
  { id: 'sore_throat', name: 'Sore Throat' },
  { id: 'runny_nose', name: 'Runny Nose' },
  { id: 'body_ache', name: 'Body Ache' },
  { id: 'fatigue', name: 'Fatigue' },
  { id: 'nausea', name: 'Nausea' },
  { id: 'vomiting', name: 'Vomiting' },
  { id: 'diarrhea', name: 'Diarrhea' },
  { id: 'chest_pain', name: 'Chest Pain' },
  { id: 'shortness_breath', name: 'Shortness of Breath' },
  { id: 'dizziness', name: 'Dizziness' },
  { id: 'rash', name: 'Skin Rash' },
  { id: 'joint_pain', name: 'Joint Pain' },
  { id: 'stomach_pain', name: 'Stomach Pain' },
  { id: 'back_pain', name: 'Back Pain' },
  { id: 'muscle_pain', name: 'Muscle Pain' },
  { id: 'loss_appetite', name: 'Loss of Appetite' },
  { id: 'weight_loss', name: 'Weight Loss' },
  { id: 'night_sweats', name: 'Night Sweats' },
  { id: 'constipation', name: 'Constipation' },
  { id: 'bloating', name: 'Bloating' },
  { id: 'heartburn', name: 'Heartburn' },
];

// Doctors data matching the DoctorsPage
const doctorsData: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'General Practitioner',
    experience: 'Practicing – 3 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Comprehensive primary care with focus on preventive medicine and patient education.',
    location: 'New York, NY'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Family Medicine',
    experience: 'Practicing – 5 years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Family-centered care for patients of all ages, from newborns to seniors.',
    location: 'Los Angeles, CA'
  },
  {
    id: 5,
    name: 'Dr. James Wilson',
    specialization: 'Cardiologist',
    experience: 'Retired – 42 years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: true,
    description: 'Renowned cardiac surgeon with expertise in heart disease and interventional procedures.',
    location: 'Seattle, WA'
  },
  {
    id: 6,
    name: 'Dr. Lisa Park',
    specialization: 'Cardiologist',
    experience: 'Practicing – 12 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Interventional cardiologist specializing in minimally invasive heart procedures.',
    location: 'Chicago, IL'
  },
  {
    id: 7,
    name: 'Dr. David Kumar',
    specialization: 'Pulmonologist',
    experience: 'Practicing – 15 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Expert in respiratory diseases, asthma, and sleep disorders.',
    location: 'Houston, TX'
  },
  {
    id: 9,
    name: 'Dr. Ahmed Hassan',
    specialization: 'Gastroenterologist',
    experience: 'Practicing – 10 years',
    rating: 4.7,
    image: 'https://media.istockphoto.com/id/1731985518/photo/doctor-black-man-and-thinking-of-healthcare-information-paperwork-or-documents-by-window-in.jpg?s=612x612&w=0&k=20&c=-Eg-ofQDVDDZIjFgCb1pysArKbL0b_YZRxlm1z3O7Bk=',
    isRetired: false,
    description: 'Specialist in digestive disorders, inflammatory bowel disease, and endoscopy.',
    location: 'Phoenix, AZ'
  },
  {
    id: 11,
    name: 'Dr. Mark Rodriguez',
    specialization: 'Emergency Medicine',
    experience: 'Practicing – 6 years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Emergency physician with expertise in trauma care and critical medicine.',
    location: 'Atlanta, GA'
  },
  {
    id: 12,
    name: 'Dr. Rachel Green',
    specialization: 'Dermatologist',
    experience: 'Practicing – 9 years',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Expert in skin conditions, autoimmune dermatology, and cosmetic procedures.',
    location: 'Dallas, TX'
  }
];

// Enhanced AI prediction function with specific doctor recommendations
const predictDisease = (symptoms: string[]): PredictionResult => {
  const predictions: { [key: string]: PredictionResult } = {
    // Respiratory conditions - recommend Pulmonologist + General Practitioner
    'fever,headache,cough,sore_throat': {
      disease: 'Common Cold/Flu',
      confidence: 88,
      severity: 'low',
      description: 'Based on your symptoms, you likely have a viral upper respiratory infection (common cold or flu). This is typically self-limiting and resolves within 7-10 days.',
      homeRemedies: [
        'Drink plenty of warm fluids (herbal tea, warm water with honey)',
        'Gargle with warm salt water (1/2 tsp salt in 1 cup warm water)',
        'Use a humidifier or breathe steam from hot shower',
        'Get adequate rest (8+ hours of sleep)',
        'Consume vitamin C rich foods (citrus fruits, berries)',
        'Try ginger tea for nausea and throat irritation'
      ],
      precautions: [
        'Wash hands frequently with soap for 20 seconds',
        'Avoid close contact with others to prevent spread',
        'Cover mouth and nose when coughing or sneezing',
        'Disinfect frequently touched surfaces',
        'Avoid smoking and secondhand smoke',
        'Stay hydrated and maintain good nutrition'
      ],
      whenToSeeDoctor: [
        'Fever above 103°F (39.4°C) or lasting more than 3 days',
        'Difficulty breathing or persistent chest pain',
        'Severe headache or neck stiffness',
        'Symptoms worsen after initial improvement',
        'Signs of dehydration (dizziness, dry mouth, little urination)'
      ],
      suggestedDoctors: ['General Practitioner', 'Family Medicine', 'Pulmonologist'],
      recommendedDoctorIds: [1, 2, 7], // Dr. Sarah Johnson, Dr. Michael Chen, Dr. David Kumar
      urgency: 'routine'
    },

    'cough,shortness_breath,chest_pain': {
      disease: 'Respiratory Infection/Bronchitis',
      confidence: 82,
      severity: 'medium',
      description: 'Your symptoms suggest a lower respiratory tract infection, possibly bronchitis. This condition involves inflammation of the bronchial tubes.',
      homeRemedies: [
        'Use a cool-mist humidifier to ease breathing',
        'Drink warm liquids like herbal tea or broth',
        'Try honey (1-2 teaspoons) to soothe cough',
        'Practice deep breathing exercises',
        'Elevate your head while sleeping',
        'Avoid irritants like smoke and strong odors'
      ],
      precautions: [
        'Get plenty of rest to help your body fight infection',
        'Avoid strenuous activities until symptoms improve',
        'Stay away from smoke and air pollution',
        'Maintain good hygiene to prevent spread',
        'Monitor your breathing and oxygen levels',
        'Keep rescue inhaler nearby if you have asthma'
      ],
      whenToSeeDoctor: [
        'Persistent cough lasting more than 3 weeks',
        'Coughing up blood or thick, discolored mucus',
        'High fever (above 101°F) with breathing difficulties',
        'Severe chest pain or tightness',
        'Wheezing or difficulty catching your breath'
      ],
      suggestedDoctors: ['Pulmonologist', 'General Practitioner', 'Emergency Medicine'],
      recommendedDoctorIds: [7, 1, 11], // Dr. David Kumar, Dr. Sarah Johnson, Dr. Mark Rodriguez
      urgency: 'soon'
    },

    'chest_pain,shortness_breath': {
      disease: 'Possible Cardiac Issue',
      confidence: 75,
      severity: 'high',
      description: 'Chest pain with shortness of breath could indicate a serious cardiac condition. This combination requires immediate medical evaluation to rule out heart attack or other cardiac emergencies.',
      homeRemedies: [
        'Sit upright and try to stay calm',
        'Loosen tight clothing around chest and neck',
        'Take slow, deep breaths',
        'If prescribed, take nitroglycerin as directed',
        'Chew aspirin (if not allergic) while waiting for help'
      ],
      precautions: [
        'Do not ignore chest pain - seek immediate help',
        'Avoid physical exertion or stress',
        'Do not drive yourself to the hospital',
        'Have someone stay with you',
        'Keep emergency contacts readily available',
        'Follow up with cardiology after emergency care'
      ],
      whenToSeeDoctor: [
        'ANY chest pain with shortness of breath - seek immediate care',
        'Pain radiating to arm, jaw, or back',
        'Sweating, nausea, or lightheadedness with chest pain',
        'Crushing or pressure-like chest pain',
        'Symptoms lasting more than a few minutes'
      ],
      suggestedDoctors: ['Emergency Medicine', 'Cardiologist'],
      recommendedDoctorIds: [11, 5, 6], // Dr. Mark Rodriguez, Dr. James Wilson, Dr. Lisa Park
      urgency: 'immediate'
    },

    'nausea,vomiting,diarrhea': {
      disease: 'Gastroenteritis (Stomach Flu)',
      confidence: 85,
      severity: 'medium',
      description: 'Your symptoms indicate gastroenteritis, commonly called stomach flu. This is usually caused by viral or bacterial infection affecting the digestive system.',
      homeRemedies: [
        'Stay hydrated with clear fluids (water, clear broths, electrolyte solutions)',
        'Follow BRAT diet: Bananas, Rice, Applesauce, Toast',
        'Sip ginger tea or chew ginger to reduce nausea',
        'Try peppermint tea for stomach soothing',
        'Eat small, frequent meals when appetite returns',
        'Use probiotics after symptoms improve'
      ],
      precautions: [
        'Wash hands frequently, especially after bathroom use',
        'Avoid dairy products temporarily',
        'Stay away from fatty, spicy, or high-fiber foods',
        'Disinfect surfaces and avoid preparing food for others',
        'Rest and avoid strenuous activities',
        'Monitor for signs of dehydration'
      ],
      whenToSeeDoctor: [
        'Signs of severe dehydration (dizziness, dry mouth, no urination)',
        'Blood in vomit or stool',
        'High fever (above 102°F) with stomach symptoms',
        'Severe abdominal pain or cramping',
        'Symptoms persist for more than 3 days'
      ],
      suggestedDoctors: ['Gastroenterologist', 'General Practitioner', 'Family Medicine'],
      recommendedDoctorIds: [9, 1, 2], // Dr. Ahmed Hassan, Dr. Sarah Johnson, Dr. Michael Chen
      urgency: 'soon'
    },

    'rash,joint_pain': {
      disease: 'Autoimmune/Allergic Reaction',
      confidence: 72,
      severity: 'medium',
      description: 'The combination of rash and joint pain could indicate an autoimmune condition, allergic reaction, or viral infection. Further evaluation is needed for proper diagnosis.',
      homeRemedies: [
        'Apply cool, damp cloths to affected skin areas',
        'Use gentle, fragrance-free moisturizers',
        'Take cool baths with oatmeal or baking soda',
        'Avoid known allergens and irritants',
        'Wear loose, breathable clothing',
        'Try over-the-counter antihistamines for itching'
      ],
      precautions: [
        'Avoid scratching or rubbing the rash',
        'Use mild, unscented soaps and detergents',
        'Protect skin from sun exposure',
        'Keep a diary of potential triggers',
        'Avoid new cosmetics or skincare products',
        'Monitor for signs of infection'
      ],
      whenToSeeDoctor: [
        'Rash spreads rapidly or covers large areas',
        'Joint pain is severe or affects multiple joints',
        'Fever accompanies rash and joint pain',
        'Difficulty breathing or swallowing',
        'Signs of infection (pus, red streaks, warmth)'
      ],
      suggestedDoctors: ['Dermatologist', 'General Practitioner'],
      recommendedDoctorIds: [12, 1], // Dr. Rachel Green, Dr. Sarah Johnson
      urgency: 'soon'
    }
  };

  // Enhanced matching algorithm
  const symptomKey = symptoms.sort().join(',');
  
  // Check for exact matches first
  if (predictions[symptomKey]) {
    return predictions[symptomKey];
  }
  
  // Check for partial matches with scoring
  let bestMatch: PredictionResult | null = null;
  let bestScore = 0;
  
  for (const [key, prediction] of Object.entries(predictions)) {
    const keySymptoms = key.split(',');
    const matchCount = keySymptoms.filter(symptom => symptoms.includes(symptom)).length;
    const score = (matchCount / keySymptoms.length) * (matchCount / symptoms.length);
    
    if (score > bestScore && matchCount >= 2) {
      bestScore = score;
      bestMatch = {
        ...prediction,
        confidence: Math.max(60, Math.round(prediction.confidence * score))
      };
    }
  }
  
  if (bestMatch) {
    return bestMatch;
  }
  
  // Symptom-specific predictions for single or uncommon combinations
  if (symptoms.includes('chest_pain') || symptoms.includes('shortness_breath')) {
    return {
      disease: 'Cardiovascular Concern',
      confidence: 70,
      severity: 'high',
      description: 'Chest pain or breathing difficulties require medical evaluation to rule out serious conditions.',
      homeRemedies: ['Rest in comfortable position', 'Avoid strenuous activity', 'Stay calm and breathe slowly'],
      precautions: ['Seek immediate medical attention', 'Do not drive yourself', 'Have emergency contacts ready'],
      whenToSeeDoctor: ['Immediately for chest pain or breathing difficulties'],
      suggestedDoctors: ['Emergency Medicine', 'Cardiologist'],
      recommendedDoctorIds: [11, 5, 6],
      urgency: 'immediate'
    };
  }
  
  // Default comprehensive prediction
  return {
    disease: 'General Health Concern',
    confidence: 68,
    severity: 'low',
    description: 'Based on your symptoms, you may have a common health condition. While many conditions can be managed with home care, professional medical evaluation is recommended for proper diagnosis.',
    homeRemedies: [
      'Get adequate rest and sleep (7-9 hours)',
      'Stay well hydrated with water and clear fluids',
      'Eat nutritious, balanced meals',
      'Practice stress management techniques',
      'Gentle exercise as tolerated',
      'Monitor symptoms and keep a health diary'
    ],
    precautions: [
      'Maintain good hygiene practices',
      'Avoid known triggers or irritants',
      'Follow a healthy lifestyle',
      'Take medications as prescribed',
      'Monitor symptoms for changes',
      'Seek medical advice if symptoms worsen'
    ],
    whenToSeeDoctor: [
      'Symptoms persist for more than a week',
      'Symptoms significantly worsen',
      'New concerning symptoms develop',
      'Symptoms interfere with daily activities',
      'You have underlying health conditions'
    ],
    suggestedDoctors: ['General Practitioner', 'Family Medicine'],
    recommendedDoctorIds: [1, 2], // Dr. Sarah Johnson, Dr. Michael Chen
    urgency: 'routine'
  };
};

export const SymptomCheckerPage: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const filteredSymptoms = availableSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = predictDisease(selectedSymptoms);
      setPrediction(result);
      setIsLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setPrediction(null);
    setSearchTerm('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'text-blue-600 bg-blue-50';
      case 'soon': return 'text-orange-600 bg-orange-50';
      case 'immediate': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleBookAppointment = (doctorId: number) => {
    // Store the selected doctor and condition for the appointment page
    localStorage.setItem('selectedDoctorId', doctorId.toString());
    localStorage.setItem('medicalCondition', prediction?.disease || '');
    navigate('/appointments');
  };

  const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="ml-1 text-gray-700 text-sm font-medium">{doctor.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h4>
        <div className="flex items-center mb-2">
          <Stethoscope className="h-4 w-4 text-sky-500 mr-1" />
          <span className="text-sky-600 font-semibold text-sm">{doctor.specialization}</span>
        </div>
        
        <p className="text-gray-600 text-xs mb-2">{doctor.experience}</p>
        <p className="text-gray-500 text-xs mb-3">{doctor.location}</p>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => handleBookAppointment(doctor.id)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm font-medium"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book Now
          </button>
          <Link
            to="/doctors"
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm font-medium"
          >
            <UserCheck className="h-4 w-4 mr-1" />
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-sky-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Symptom Checker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI system analyzes your symptoms to provide comprehensive health insights, 
            home remedies, and connects you directly with the right specialists for your condition.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {!prediction ? (
            <>
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Symptoms ({selectedSymptoms.length}):</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(symptomId => {
                      const symptom = availableSymptoms.find(s => s.id === symptomId);
                      return (
                        <span
                          key={symptomId}
                          className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                        >
                          {symptom?.name}
                          <button
                            onClick={() => toggleSymptom(symptomId)}
                            className="ml-2 text-sky-600 hover:text-sky-800"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Symptoms Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Symptoms:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredSymptoms.map(symptom => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-25'
                      }`}
                    >
                      {symptom.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <div className="text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={selectedSymptoms.length === 0 || isLoading}
                  className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing Symptoms...
                    </div>
                  ) : (
                    'Analyze Symptoms'
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Comprehensive Results */
            <div>
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                <p className="text-gray-600">Here's your comprehensive health assessment and recommended doctors</p>
              </div>

              {/* Main Diagnosis */}
              <div className="bg-gradient-to-br from-sky-50 to-emerald-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{prediction.disease}</h3>
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity.toUpperCase()} SEVERITY
                    </div>
                    <div className="text-sm text-gray-600">Confidence:</div>
                    <div className="text-2xl font-bold text-sky-600">{prediction.confidence}%</div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">{prediction.description}</p>
                
                <div className={`mt-4 p-3 rounded-lg ${getUrgencyColor(prediction.urgency)}`}>
                  <p className="font-semibold">
                    Recommended Action: {prediction.urgency === 'immediate' ? 'Seek immediate medical attention' : 
                                       prediction.urgency === 'soon' ? 'Schedule appointment within 1-2 days' : 
                                       'Routine consultation recommended'}
                  </p>
                </div>
              </div>

              {/* Recommended Doctors Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="h-6 w-6 text-emerald-500 mr-2" />
                  Recommended Doctors for Your Condition
                </h3>
                <p className="text-gray-600 mb-6">
                  Based on your symptoms, these specialists are best suited to help with your condition:
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prediction.recommendedDoctorIds.map(doctorId => {
                    const doctor = doctorsData.find(d => d.id === doctorId);
                    return doctor ? <DoctorCard key={doctor.id} doctor={doctor} /> : null;
                  })}
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Home Remedies */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <Home className="h-6 w-6 text-green-500 mr-2" />
                    Home Remedies & Self-Care
                  </h4>
                  <ul className="space-y-3">
                    {prediction.homeRemedies.map((remedy, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-green-500 mr-3 mt-1">•</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Precautions */}
                <div className="bg-amber-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <Shield className="h-6 w-6 text-amber-500 mr-2" />
                    Precautions & Prevention
                  </h4>
                  <ul className="space-y-3">
                    {prediction.precautions.map((precaution, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-amber-500 mr-3 mt-1">•</span>
                        <span>{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* When to See Doctor */}
                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                    When to See a Doctor
                  </h4>
                  <ul className="space-y-3">
                    {prediction.whenToSeeDoctor.map((warning, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-red-500 mr-3 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Specialists */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <Stethoscope className="h-6 w-6 text-blue-500 mr-2" />
                    Specialist Types Needed
                  </h4>
                  <ul className="space-y-3">
                    {prediction.suggestedDoctors.map((doctor, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-3 mt-1">•</span>
                        <span className="font-medium">{doctor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/doctors"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-center flex items-center justify-center"
                >
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Browse All Doctors
                </Link>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  New Analysis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <h4 className="font-bold mb-2">Important Medical Disclaimer</h4>
              <p className="mb-2">
                This AI symptom checker is designed for informational and educational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="mb-2">
                <strong>Always consult with a qualified healthcare provider</strong> for proper medical evaluation, especially if you have persistent, severe, or worsening symptoms.
              </p>
              <p>
                In case of medical emergencies, call emergency services immediately (911 in the US) or visit your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};