import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, User, Heart } from 'lucide-react';

interface EmergencyEscalationProps {
  emergencyLevel: number;
  patientLocation?: { lat: number; lng: number; address: string };
  onClose: () => void;
}

export const EmergencyEscalation: React.FC<EmergencyEscalationProps> = ({
  emergencyLevel,
  patientLocation,
  onClose
}) => {
  const [responseTime, setResponseTime] = useState(0);
  const [responderAssigned, setResponderAssigned] = useState(false);
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');

  useEffect(() => {
    // Simulate emergency response system
    const timer = setInterval(() => {
      setResponseTime(prev => prev + 1);
    }, 1000);

    // Simulate responder assignment
    setTimeout(() => {
      setResponderAssigned(true);
      setEstimatedArrival('8-12 minutes');
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const getEmergencyColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-red-600 border-red-700';
      case 3: return 'bg-red-500 border-red-600';
      case 2: return 'bg-orange-500 border-orange-600';
      default: return 'bg-yellow-500 border-yellow-600';
    }
  };

  const getEmergencyLabel = (level: number) => {
    switch (level) {
      case 4: return 'CRITICAL EMERGENCY';
      case 3: return 'HIGH PRIORITY EMERGENCY';
      case 2: return 'MEDIUM PRIORITY';
      default: return 'LOW PRIORITY';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className={`${getEmergencyColor(emergencyLevel)} text-white p-6 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3 animate-pulse" />
              <div>
                <h2 className="text-xl font-bold">{getEmergencyLabel(emergencyLevel)}</h2>
                <p className="text-sm opacity-90">Emergency Response Activated</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatTime(responseTime)}</div>
              <div className="text-xs opacity-90">Response Time</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="text-center">
            {responderAssigned ? (
              <div className="text-green-600">
                <Heart className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Emergency Responder Assigned</h3>
                <p className="text-gray-600">Help is on the way</p>
              </div>
            ) : (
              <div className="text-orange-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-2"></div>
                <h3 className="text-lg font-bold">Locating Nearest Responder</h3>
                <p className="text-gray-600">Please stay calm</p>
              </div>
            )}
          </div>

          {/* Responder Info */}
          {responderAssigned && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-800">Dr. Emergency Response Team</span>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>ETA: {estimatedArrival}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>En route to your location</span>
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          {patientLocation && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Your Location</span>
              </div>
              <p className="text-sm text-blue-700">{patientLocation.address}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-bold text-yellow-800 mb-2">While You Wait:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Stay calm and breathe slowly</li>
              <li>• Do not move unless absolutely necessary</li>
              <li>• Keep your phone nearby</li>
              <li>• If condition worsens, call 911 immediately</li>
              <li>• Someone will contact you shortly</li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="flex space-x-3">
            <a
              href="tel:911"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call 911
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};