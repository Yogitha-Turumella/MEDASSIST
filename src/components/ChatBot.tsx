import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  apiKey?: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm MedAssist AI, your healthcare companion. I can help you with:\n\n• Website navigation and features\n• General health information\n• Understanding our services\n• Booking appointments\n• Finding the right doctor\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated ChatGPT API call - replace with actual OpenAI API integration
  const getChatGPTResponse = async (userMessage: string): Promise<string> => {
    // This is a simulation - in production, you would call the OpenAI API
    const responses = {
      'how to book appointment': "To book an appointment on MedAssist:\n\n1. Click 'Book Appointment' from the homepage\n2. Select your preferred doctor from our list\n3. Choose an available date from the calendar\n4. Pick a time slot that works for you\n5. Fill in your personal information\n6. Confirm your appointment\n\nYou'll receive a confirmation email once booked!",
      
      'find doctor': "Finding a doctor on MedAssist is easy:\n\n1. Go to 'Find Doctors' page\n2. Filter by:\n   • Young Doctors (actively practicing)\n   • Retired Doctors (experienced specialists)\n3. View doctor profiles with specializations\n4. Check ratings and experience\n5. Click 'Message' or 'Book' to connect\n\nWe have specialists in cardiology, pediatrics, dermatology, and more!",
      
      'symptom checker': "Our AI Symptom Checker helps identify potential health issues:\n\n1. Visit the 'Symptom Checker' page\n2. Search and select your symptoms\n3. Click 'Analyze Symptoms'\n4. Get AI-powered predictions with confidence levels\n5. Receive personalized recommendations\n6. See suggested specialist types\n\nRemember: This is for guidance only. Always consult a doctor for proper diagnosis!",
      
      'contact support': "You can reach our support team through:\n\n• Contact page form for general inquiries\n• Phone: +1 (555) 123-4567 (24/7 emergency)\n• Email: support@medassist.com\n• Video consultation for immediate help\n\nFor medical emergencies, always call 911 first!",
      
      'website features': "MedAssist offers comprehensive healthcare services:\n\n🏥 **Core Features:**\n• Doctor directory with young & retired specialists\n• AI-powered symptom analysis\n• Easy appointment booking\n• Secure messaging with doctors\n• 24/7 support availability\n\n🎯 **Specialties:**\n• Cardiology, Pediatrics, Dermatology\n• Internal Medicine, Gynecology, Orthopedics\n\n🏆 **Award-winning platform** - 3rd place at Avinya2k24 Hackathon!"
    };

    // Simple keyword matching for demo
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key.replace(/\s+/g, '')) || 
          key.split(' ').some(word => lowerMessage.includes(word))) {
        return response;
      }
    }

    // Default healthcare-focused response
    if (lowerMessage.includes('health') || lowerMessage.includes('medical') || 
        lowerMessage.includes('doctor') || lowerMessage.includes('appointment')) {
      return "I'd be happy to help with your healthcare question! MedAssist connects you with experienced doctors for consultations, offers AI symptom checking, and provides easy appointment booking.\n\nFor specific medical advice, I recommend:\n1. Using our Symptom Checker for initial assessment\n2. Booking a consultation with our specialists\n3. Contacting our 24/7 support for urgent concerns\n\nWhat specific aspect would you like to know more about?";
    }

    return "Thank you for your question! I'm here to help with MedAssist website features and general healthcare guidance.\n\nI can assist you with:\n• Navigating our website\n• Booking appointments\n• Finding doctors\n• Using the symptom checker\n• Understanding our services\n\nCould you please be more specific about what you'd like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await getChatGPTResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble responding right now. Please try again or contact our support team at support@medassist.com for immediate assistance.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How to book an appointment?",
    "Find a doctor",
    "How does symptom checker work?",
    "Contact support",
    "Website features"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">MedAssist AI</h3>
              <p className="text-xs text-sky-100">Healthcare Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-sky-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
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

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(question);
                        handleSendMessage();
                      }}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about MedAssist..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
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