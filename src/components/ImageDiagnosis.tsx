import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Eye, Brain, AlertTriangle } from 'lucide-react';
import Webcam from 'react-webcam';

interface ImageDiagnosisProps {
  onAnalysis: (analysis: ImageAnalysisResult) => void;
  patientId?: string;
}

interface ImageAnalysisResult {
  imageUrl: string;
  analysis: {
    condition: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    recommendations: string[];
    requiresDoctor: boolean;
    urgency: 'routine' | 'soon' | 'immediate';
  };
}

export const ImageDiagnosis: React.FC<ImageDiagnosisProps> = ({ onAnalysis, patientId }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imageType, setImageType] = useState<string>('skin');
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageTypes = [
    { value: 'skin', label: 'Skin Condition', description: 'Rashes, moles, lesions, wounds' },
    { value: 'eye', label: 'Eye Condition', description: 'Redness, discharge, irritation' },
    { value: 'throat', label: 'Throat/Mouth', description: 'Sore throat, oral lesions' },
    { value: 'wound', label: 'Wound/Injury', description: 'Cuts, bruises, swelling' },
    { value: 'other', label: 'Other', description: 'General medical imaging' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setShowCamera(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate AI image analysis - in production, this would call your AI service
      const mockAnalysis = await simulateImageAnalysis(selectedImage, imageType);
      onAnalysis({
        imageUrl: selectedImage,
        analysis: mockAnalysis
      });
    } catch (error) {
      console.error('Image analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateImageAnalysis = async (imageUrl: string, type: string): Promise<ImageAnalysisResult['analysis']> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const analyses = {
      skin: {
        condition: 'Possible Dermatitis',
        confidence: 78,
        severity: 'medium' as const,
        recommendations: [
          'Keep the affected area clean and dry',
          'Apply a gentle, fragrance-free moisturizer',
          'Avoid scratching or rubbing the area',
          'Consider over-the-counter hydrocortisone cream',
          'Monitor for changes in size, color, or texture'
        ],
        requiresDoctor: true,
        urgency: 'soon' as const
      },
      eye: {
        condition: 'Conjunctivitis (Pink Eye)',
        confidence: 85,
        severity: 'medium' as const,
        recommendations: [
          'Wash hands frequently and avoid touching eyes',
          'Use clean, warm compresses on closed eyes',
          'Avoid wearing contact lenses',
          'Do not share towels or pillowcases',
          'Clean discharge gently with warm water'
        ],
        requiresDoctor: true,
        urgency: 'soon' as const
      },
      throat: {
        condition: 'Throat Inflammation',
        confidence: 72,
        severity: 'low' as const,
        recommendations: [
          'Gargle with warm salt water',
          'Stay hydrated with warm liquids',
          'Use throat lozenges or honey',
          'Avoid irritants like smoke',
          'Rest your voice'
        ],
        requiresDoctor: false,
        urgency: 'routine' as const
      },
      wound: {
        condition: 'Minor Laceration',
        confidence: 90,
        severity: 'low' as const,
        recommendations: [
          'Clean the wound gently with water',
          'Apply antibiotic ointment if available',
          'Cover with a sterile bandage',
          'Keep the wound dry and clean',
          'Monitor for signs of infection'
        ],
        requiresDoctor: false,
        urgency: 'routine' as const
      },
      other: {
        condition: 'Requires Professional Assessment',
        confidence: 60,
        severity: 'medium' as const,
        recommendations: [
          'Consult with a healthcare professional',
          'Provide detailed symptom history',
          'Monitor any changes',
          'Keep the area clean if applicable',
          'Document any associated symptoms'
        ],
        requiresDoctor: true,
        urgency: 'soon' as const
      }
    };

    return analyses[type as keyof typeof analyses] || analyses.other;
  };

  const resetImage = () => {
    setSelectedImage(null);
    setShowCamera(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Eye className="h-6 w-6 text-purple-500 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">AI Image Diagnosis</h3>
      </div>

      {/* Image Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What type of condition are you showing?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {imageTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setImageType(type.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                imageType === type.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="font-medium text-gray-900">{type.label}</div>
              <div className="text-sm text-gray-600">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Capture/Upload */}
      {!selectedImage && !showCamera && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowCamera(true)}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Take Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {showCamera && (
        <div className="space-y-4">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setShowCamera(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={capturePhoto}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Capture Photo
            </button>
            <button
              onClick={() => setShowCamera(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Selected Image */}
      {selectedImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Medical condition"
              className="w-full max-h-96 object-contain rounded-lg border"
            />
            <button
              onClick={resetImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={analyzeImage}
            disabled={isAnalyzing}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Analyzing Image...
              </div>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Analyze with AI
              </>
            )}
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">AI Image Analysis Disclaimer</p>
            <p>
              This AI analysis is for informational purposes only and should not replace professional medical diagnosis. 
              Always consult with a qualified healthcare provider for proper medical evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};