import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { VideoConsultation } from '../components/VideoConsultation';
import { FeedbackSentiment } from '../components/FeedbackSentiment';

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  scheduledTime: string;
  duration: number;
  type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'in_progress' | 'completed';
}

export const VideoConsultationPage: React.FC = () => {
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);

  // Mock appointment data
  useEffect(() => {
    const mockAppointment: Appointment = {
      id: 'apt_123',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialization: 'General Practitioner',
      patientName: 'John Doe',
      scheduledTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      duration: 30,
      type: 'video',
      status: 'scheduled'
    };
    setCurrentAppointment(mockAppointment);
  }, []);

  const startVideoCall = () => {
    setIsInCall(true);
    if (currentAppointment) {
      setCurrentAppointment({
        ...currentAppointment,
        status: 'in_progress'
      });
    }
  };

  const endVideoCall = () => {
    setIsInCall(false);
    if (currentAppointment) {
      setCurrentAppointment({
        ...currentAppointment,
        status: 'completed'
      });
      setShowFeedback(true);
    }
  };

  const handleFeedbackSubmit = (feedbackData: any) => {
    console.log('Feedback submitted:', feedbackData);
    setShowFeedback(false);
  };

  if (isInCall && currentAppointment) {
    return (
      <VideoConsultation
        appointmentId={currentAppointment.id}
        isDoctor={isDoctor}
        onEndCall={endVideoCall}
      />
    );
  }

  if (showFeedback && currentAppointment) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeedbackSentiment
            appointmentId={currentAppointment.id}
            doctorId="doc_123"
            patientId="pat_123"
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Video className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Consultation</h1>
          <p className="text-xl text-gray-600">
            Connect with your healthcare provider through secure video calls
          </p>
        </div>

        {currentAppointment ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Appointment Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Appointment</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Stethoscope className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">{currentAppointment.doctorName}</p>
                      <p className="text-gray-600">{currentAppointment.doctorSpecialization}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Patient</p>
                      <p className="text-gray-600">{currentAppointment.patientName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Date & Time</p>
                      <p className="text-gray-600">
                        {new Date(currentAppointment.scheduledTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Duration</p>
                      <p className="text-gray-600">{currentAppointment.duration} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    currentAppointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    currentAppointment.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentAppointment.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isDoctor}
                      onChange={(e) => setIsDoctor(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Join as Doctor</span>
                  </label>
                </div>
              </div>

              {currentAppointment.status === 'scheduled' && (
                <div className="text-center">
                  <button
                    onClick={startVideoCall}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center mx-auto"
                  >
                    <Video className="h-6 w-6 mr-3" />
                    Start Video Consultation
                  </button>
                  <p className="text-sm text-gray-500 mt-3">
                    Make sure your camera and microphone are working properly
                  </p>
                </div>
              )}
            </div>

            {/* Pre-call Checklist */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4">Before Your Video Call</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Technical Requirements</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Stable internet connection</li>
                    <li>• Working camera and microphone</li>
                    <li>• Updated web browser</li>
                    <li>• Quiet, well-lit environment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Prepare for Your Visit</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• List of current medications</li>
                    <li>• Symptom details and timeline</li>
                    <li>• Insurance information ready</li>
                    <li>• Questions for your doctor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Scheduled Appointments</h2>
            <p className="text-gray-600 mb-6">
              You don't have any video consultations scheduled at the moment.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              Schedule an Appointment
            </button>
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">HD Video Quality</h3>
            <p className="text-sm text-gray-600">
              Crystal clear video calls with adaptive quality based on your connection
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-600">
              HIPAA-compliant platform ensuring your medical information stays private
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Availability</h3>
            <p className="text-sm text-gray-600">
              Access healthcare professionals around the clock for urgent consultations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};