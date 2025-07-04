import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Globe, Mic, Image, AlertTriangle } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { ImageDiagnosis } from './ImageDiagnosis';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  emergencyLevel?: number;
}

interface MultilingualChatBotProps {
  sessionType?: 'symptom_intake' | 'general_support' | 'emergency';
  onEmergencyEscalation?: (level: number) => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export const MultilingualChatBot: React.FC<MultilingualChatBotProps> = ({
  sessionType = 'general_support',
  onEmergencyEscalation
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [showImageDiagnosis, setShowImageDiagnosis] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message in selected language
    const welcomeMessage = getWelcomeMessage(selectedLanguage, sessionType);
    setMessages([{
      id: '1',
      text: welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
      language: selectedLanguage
    }]);
  }, [selectedLanguage, sessionType]);

  const getWelcomeMessage = (lang: string, type: string): string => {
    const messages = {
      en: {
        symptom_intake: "Hello! I'm MedAssist AI, your multilingual healthcare assistant. I can help analyze your symptoms using text, voice, or images. Please describe your symptoms or use the voice/image options below.",
        general_support: "Hello! I'm MedAssist AI. I can help you with website navigation, booking appointments, finding doctors, and general healthcare guidance. How can I assist you today?",
        emergency: "🚨 EMERGENCY MODE ACTIVATED 🚨\nI'm here to help with your urgent medical situation. Please describe your emergency clearly. If this is life-threatening, call emergency services immediately!"
      },
      es: {
        symptom_intake: "¡Hola! Soy MedAssist AI, tu asistente de salud multilingüe. Puedo ayudar a analizar tus síntomas usando texto, voz o imágenes. Por favor describe tus síntomas o usa las opciones de voz/imagen a continuación.",
        general_support: "¡Hola! Soy MedAssist AI. Puedo ayudarte con la navegación del sitio web, reservar citas, encontrar médicos y orientación general de salud. ¿Cómo puedo ayudarte hoy?",
        emergency: "🚨 MODO DE EMERGENCIA ACTIVADO 🚨\nEstoy aquí para ayudar con tu situación médica urgente. Por favor describe tu emergencia claramente. ¡Si esto es potencialmente mortal, llama a los servicios de emergencia inmediatamente!"
      },
      fr: {
        symptom_intake: "Bonjour ! Je suis MedAssist AI, votre assistant de santé multilingue. Je peux aider à analyser vos symptômes en utilisant du texte, de la voix ou des images. Veuillez décrire vos symptômes ou utiliser les options voix/image ci-dessous.",
        general_support: "Bonjour ! Je suis MedAssist AI. Je peux vous aider avec la navigation du site web, la prise de rendez-vous, la recherche de médecins et les conseils de santé généraux. Comment puis-je vous aider aujourd'hui ?",
        emergency: "🚨 MODE D'URGENCE ACTIVÉ 🚨\nJe suis là pour vous aider avec votre situation médicale urgente. Veuillez décrire votre urgence clairement. Si c'est potentiellement mortel, appelez immédiatement les services d'urgence !"
      }
    };

    return messages[lang as keyof typeof messages]?.[type as keyof typeof messages.en] || messages.en[type as keyof typeof messages.en];
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    // Simulate translation - in production, use Google Translate API or similar
    if (targetLang === 'en') return text;
    
    const translations: Record<string, Record<string, string>> = {
      es: {
        "How can I help you today?": "¿Cómo puedo ayudarte hoy?",
        "I understand you're experiencing symptoms.": "Entiendo que estás experimentando síntomas.",
        "Please consult a doctor for proper diagnosis.": "Por favor consulta a un médico para un diagnóstico adecuado."
      },
      fr: {
        "How can I help you today?": "Comment puis-je vous aider aujourd'hui ?",
        "I understand you're experiencing symptoms.": "Je comprends que vous ressentez des symptômes.",
        "Please consult a doctor for proper diagnosis.": "Veuillez consulter un médecin pour un diagnostic approprié."
      }
    };

    return translations[targetLang]?.[text] || text;
  };

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'satisfied', 'thank'];
    const negativeWords = ['bad', 'terrible', 'awful', 'pain', 'hurt', 'emergency', 'urgent'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasNegative) return 'negative';
    if (hasPositive) return 'positive';
    return 'neutral';
  };

  const detectEmergencyLevel = (text: string): number => {
    const emergencyKeywords = {
      critical: ['heart attack', 'stroke', 'unconscious', 'not breathing', 'severe bleeding', 'overdose'],
      high: ['chest pain', 'difficulty breathing', 'severe pain', 'emergency', 'urgent', 'help'],
      medium: ['pain', 'hurt', 'sick', 'fever', 'nausea'],
      low: ['tired', 'headache', 'cough', 'cold']
    };

    const lowerText = text.toLowerCase();
    
    if (emergencyKeywords.critical.some(keyword => lowerText.includes(keyword))) return 4;
    if (emergencyKeywords.high.some(keyword => lowerText.includes(keyword))) return 3;
    if (emergencyKeywords.medium.some(keyword => lowerText.includes(keyword))) return 2;
    if (emergencyKeywords.low.some(keyword => lowerText.includes(keyword))) return 1;
    
    return 0;
  };

  const getChatResponse = async (userMessage: string, language: string): Promise<string> => {
    // Simulate AI response based on session type and language
    const responses = {
      en: {
        symptom_intake: [
          "I understand you're experiencing symptoms. Can you tell me more about when they started and how severe they are?",
          "Based on what you've described, I recommend consulting with a healthcare professional. Would you like me to help you find a suitable doctor?",
          "These symptoms could indicate several conditions. For a proper diagnosis, please schedule an appointment with a doctor. I can help you book one."
        ],
        general_support: [
          "I can help you with that! Let me guide you through the process.",
          "For the best assistance with your healthcare needs, I recommend using our appointment booking system.",
          "Our platform offers comprehensive healthcare services. Would you like me to explain any specific feature?"
        ],
        emergency: [
          "This sounds like a serious situation. If you're experiencing life-threatening symptoms, please call emergency services immediately (911).",
          "I'm escalating this to our emergency response team. Please stay calm and follow these immediate steps:",
          "Emergency protocols activated. Help is being dispatched to your location."
        ]
      }
    };

    const responseList = responses.en[sessionType as keyof typeof responses.en];
    const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];
    
    return await translateText(randomResponse, language);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const sentiment = analyzeSentiment(inputText);
    const emergencyLvl = detectEmergencyLevel(inputText);
    
    if (emergencyLvl >= 3) {
      setEmergencyLevel(emergencyLvl);
      onEmergencyEscalation?.(emergencyLvl);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage,
      sentiment,
      emergencyLevel: emergencyLvl
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await getChatResponse(inputText, selectedLanguage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: await translateText("I apologize, but I'm having trouble responding right now. Please try again or contact our support team.", selectedLanguage),
        sender: 'bot',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText(prev => prev + ' ' + transcript);
  };

  const handleImageAnalysis = (analysis: any) => {
    const imageMessage: Message = {
      id: Date.now().toString(),
      text: `Image analysis result: ${analysis.analysis.condition} (${analysis.analysis.confidence}% confidence). ${analysis.analysis.recommendations.join(' ')}`,
      sender: 'bot',
      timestamp: new Date(),
      language: selectedLanguage
    };
    setMessages(prev => [...prev, imageMessage]);
    setShowImageDiagnosis(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'border-l-green-400';
      case 'negative': return 'border-l-red-400';
      default: return 'border-l-blue-400';
    }
  };

  const getEmergencyIndicator = (level?: number) => {
    if (!level || level === 0) return null;
    
    const colors = ['', 'text-yellow-500', 'text-orange-500', 'text-red-500', 'text-red-600'];
    const labels = ['', 'Low', 'Medium', 'High', 'Critical'];
    
    return (
      <div className={`flex items-center text-xs ${colors[level]} mt-1`}>
        <AlertTriangle className="h-3 w-3 mr-1" />
        {labels[level]} Priority
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 ${
          emergencyLevel >= 3 ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
        {emergencyLevel >= 3 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            !
          </div>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[700px]'
    }`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`text-white p-4 flex items-center justify-between ${
          emergencyLevel >= 3 ? 'bg-red-500' : 'bg-gradient-to-r from-sky-500 to-emerald-500'
        }`}>
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">MedAssist AI</h3>
              <p className="text-xs text-sky-100">
                {languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="text-white hover:text-sky-200 transition-colors"
              title="Change language"
            >
              <Globe className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-sky-200 transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-sky-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Language Selector */}
        {showLanguageSelector && !isMinimized && (
          <div className="bg-gray-50 border-b border-gray-200 p-2 max-h-32 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguageSelector(false);
                  }}
                  className={`p-2 rounded text-xs transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-sky-500 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-sky-500 text-white' 
                        : emergencyLevel >= 3 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-lg p-3 border-l-4 ${
                      message.sender === 'user'
                        ? 'bg-sky-500 text-white border-l-sky-600'
                        : `bg-white text-gray-800 border border-gray-200 ${getSentimentColor(message.sentiment)}`
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${
                          message.sender === 'user' ? 'text-sky-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {getEmergencyIndicator(message.emergencyLevel)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      emergencyLevel >= 3 ? 'bg-red-500' : 'bg-emerald-500'
                    } text-white`}>
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Input */}
            {showVoiceInput && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  language={selectedLanguage}
                  isListening={isListening}
                  onListeningChange={setIsListening}
                />
              </div>
            )}

            {/* Image Diagnosis */}
            {showImageDiagnosis && (
              <div className="p-4 border-t border-gray-200 bg-white max-h-96 overflow-y-auto">
                <ImageDiagnosis onAnalysis={handleImageAnalysis} />
              </div>
            )}

            {/* Input Controls */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* Feature Buttons */}
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => setShowVoiceInput(!showVoiceInput)}
                  className={`p-2 rounded-lg transition-colors ${
                    showVoiceInput ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowImageDiagnosis(!showImageDiagnosis)}
                  className={`p-2 rounded-lg transition-colors ${
                    showImageDiagnosis ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Image diagnosis"
                >
                  <Image className="h-4 w-4" />
                </button>
              </div>

              {/* Text Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedLanguage === 'es' ? 'Escribe tu mensaje...' : 
                             selectedLanguage === 'fr' ? 'Tapez votre message...' : 
                             'Type your message...'}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    emergencyLevel >= 3 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-sky-500 hover:bg-sky-600'
                  } disabled:bg-gray-300 disabled:cursor-not-allowed text-white`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};