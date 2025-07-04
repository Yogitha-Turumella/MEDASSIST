import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Square, Play, Pause } from 'lucide-react';
import { dataService } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

export const EnhancedVoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  language = 'en-US',
  isListening = false,
  onListeningChange
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { user, profile } = useAuth();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(interimTranscript);

        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        onListeningChange?.(false);
        setIsRecording(false);
      };

      recognition.onend = () => {
        onListeningChange?.(false);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [language, onTranscript, onListeningChange]);

  const startRecording = async () => {
    try {
      // Start speech recognition
      if (recognitionRef.current && !isListening) {
        setTranscript('');
        setInterimTranscript('');
        recognitionRef.current.start();
        onListeningChange?.(true);
      }

      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      onListeningChange?.(false);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const saveVoiceRecording = async () => {
    if (!audioBlob || !user || !profile) {
      alert('Please sign in and record audio first');
      return;
    }

    try {
      // Convert blob to file
      const audioFile = new File([audioBlob], `voice-${Date.now()}.wav`, { type: 'audio/wav' });
      
      // Upload to Supabase Storage
      const audioUrl = await dataService.uploadImage(audioFile, 'voice-recordings');
      
      // Save voice input with transcript
      await dataService.saveSymptomAnalysis({
        patient_id: profile.id,
        symptoms: transcript ? [transcript] : [],
        voice_input: transcript,
        language: language.split('-')[0],
        ai_prediction: {
          source: 'voice_input',
          transcript,
          audio_url: audioUrl
        },
        confidence_score: 85,
        severity_level: 'low',
        recommended_actions: ['Voice input recorded successfully']
      });

      alert('Voice recording saved successfully!');
    } catch (error) {
      console.error('Error saving voice recording:', error);
      alert('Failed to save voice recording');
    }
  };

  const clearRecording = () => {
    setTranscript('');
    setInterimTranscript('');
    setAudioBlob(null);
    setAudioUrl('');
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center text-gray-500 text-sm">
        <MicOff className="h-4 w-4 mr-2" />
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Mic className="h-6 w-6 text-green-500 mr-2" />
        Voice Symptom Input
      </h3>

      {!user && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please sign in to save your voice recordings and analysis.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          
          {isRecording && (
            <div className="flex items-center text-red-600">
              <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
              <span className="font-medium">Recording...</span>
              <div className="ml-3 flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Live Transcript */}
        {(transcript || interimTranscript) && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Live Transcript:</h4>
            <div className="text-sm">
              <span className="text-gray-900">{transcript}</span>
              <span className="text-gray-500 italic">{interimTranscript}</span>
            </div>
          </div>
        )}

        {/* Audio Playback */}
        {audioUrl && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Recorded Audio:</h4>
            <div className="flex items-center space-x-4">
              <button
                onClick={playAudio}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="flex-1"
                controls
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(transcript || audioBlob) && (
          <div className="flex space-x-3">
            {user && (
              <button
                onClick={saveVoiceRecording}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                Save Recording
              </button>
            )}
            <button
              onClick={clearRecording}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">How to use Voice Input:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Click the microphone button to start recording</li>
            <li>• Speak clearly about your symptoms</li>
            <li>• The system will transcribe your speech in real-time</li>
            <li>• Click stop when finished</li>
            <li>• Review and save your recording</li>
          </ul>
        </div>

        {/* Language Info */}
        <div className="text-center text-sm text-gray-600">
          <p>Current language: <span className="font-medium">{language}</span></p>
          <p>Supported languages: English, Spanish, French, German, and more</p>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}