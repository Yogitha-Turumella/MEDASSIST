import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, Stethoscope, ArrowRight } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image: string;
  isRetired: boolean;
  location: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'General Practitioner',
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'New York, NY'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Family Medicine',
    image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'Los Angeles, CA'
  },
  {
    id: 5,
    name: 'Dr. James Wilson',
    specialization: 'Cardiologist',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: true,
    location: 'Seattle, WA'
  },
  {
    id: 6,
    name: 'Dr. Lisa Park',
    specialization: 'Cardiologist',
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'Chicago, IL'
  },
  {
    id: 7,
    name: 'Dr. David Kumar',
    specialization: 'Pulmonologist',
    image: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'Houston, TX'
  },
  {
    id: 9,
    name: 'Dr. Ahmed Hassan',
    specialization: 'Gastroenterologist',
    image: 'https://images.pexels.com/photos/5452207/pexels-photo-5452207.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'Phoenix, AZ'
  },
  {
    id: 11,
    name: 'Dr. Mark Rodriguez',
    specialization: 'Emergency Medicine',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'Atlanta, GA'
  },
  {
    id: 12,
    name: 'Dr. Rachel Green',
    specialization: 'Dermatologist',
    image: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    location: 'Dallas, TX'
  }
];

const timeSlots: TimeSlot[] = [
  { time: '9:00 AM', available: true },
  { time: '9:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true },
  { time: '2:00 PM', available: true },
  { time: '2:30 PM', available: true },
  { time: '3:00 PM', available: false },
  { time: '3:30 PM', available: true },
  { time: '4:00 PM', available: true },
  { time: '4:30 PM', available: true },
];

export const AppointmentPage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preSelectedCondition, setPreSelectedCondition] = useState('');
  const [bookingSource, setBookingSource] = useState('');

  // Check if user came from symptom checker or doctor browsing
  useEffect(() => {
    const selectedDoctorId = localStorage.getItem('selectedDoctorId');
    const medicalCondition = localStorage.getItem('medicalCondition');
    const source = localStorage.getItem('bookingSource');
    
    if (selectedDoctorId) {
      const doctor = mockDoctors.find(d => d.id === parseInt(selectedDoctorId));
      if (doctor) {
        setSelectedDoctor(doctor);
      }
      localStorage.removeItem('selectedDoctorId');
    }
    
    if (medicalCondition) {
      setPreSelectedCondition(medicalCondition);
      setPatientInfo(prev => ({ 
        ...prev, 
        reason: medicalCondition
      }));
      localStorage.removeItem('medicalCondition');
    }

    if (source) {
      setBookingSource(source);
      localStorage.removeItem('bookingSource');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsBooked(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setPatientInfo({ name: '', email: '', phone: '', reason: '' });
    setIsBooked(false);
    setPreSelectedCondition('');
    setBookingSource('');
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Your appointment has been successfully booked. You will receive a confirmation email shortly.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Appointment Details:</h3>
              <div className="space-y-2">
                <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
                <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Patient:</strong> {patientInfo.name}</p>
                <p><strong>Contact:</strong> {patientInfo.email}</p>
                {preSelectedCondition && (
                  <p><strong>Reason:</strong> {preSelectedCondition}</p>
                )}
              </div>
            </div>

            <button
              onClick={resetForm}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
          <p className="text-xl text-gray-600">
            Schedule your consultation with our experienced healthcare professionals
          </p>
          
          {/* Source Indicator */}
          {selectedDoctor && (
            <div className="mt-6 bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-emerald-500 mr-2" />
                <p className="text-emerald-800 font-medium">
                  {bookingSource === 'symptom-checker' ? (
                    <>Pre-selected from symptom analysis: <span className="font-bold">{preSelectedCondition}</span></>
                  ) : bookingSource === 'doctor-browsing' ? (
                    <>Pre-selected from doctor browsing: <span className="font-bold">{selectedDoctor.name}</span></>
                  ) : (
                    <>Doctor pre-selected: <span className="font-bold">{selectedDoctor.name}</span></>
                  )}
                </p>
              </div>
              <div className="flex items-center justify-center mt-2">
                <ArrowRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-700 text-sm">Proceeding directly to date selection</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Doctor */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Step 1: Select a Doctor
                {selectedDoctor && (
                  <span className="ml-2 text-sm font-normal text-emerald-600">
                    ✓ {bookingSource === 'symptom-checker' ? 'Pre-selected from symptom analysis' : 
                        bookingSource === 'doctor-browsing' ? 'Pre-selected from doctor browsing' : 
                        'Pre-selected'}
                  </span>
                )}
              </h2>
              
              {selectedDoctor && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center">
                    <LazyImage
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedDoctor.name}</h3>
                      <p className="text-emerald-600 font-semibold">{selectedDoctor.specialization}</p>
                      <p className="text-gray-600 text-sm">{selectedDoctor.location}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(null)}
                      className="ml-auto text-gray-500 hover:text-gray-700 text-sm underline"
                    >
                      Change Doctor
                    </button>
                  </div>
                </div>
              )}
              
              {!selectedDoctor && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockDoctors.map(doctor => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className="p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 border-gray-200 hover:border-sky-300"
                    >
                      <LazyImage
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full mx-auto mb-3"
                      />
                      <h3 className="font-semibold text-center mb-1">{doctor.name}</h3>
                      <p className="text-sm text-sky-600 text-center font-medium">{doctor.specialization}</p>
                      <p className="text-xs text-gray-500 text-center mt-1">{doctor.location}</p>
                      {doctor.isRetired && (
                        <div className="text-center mt-2">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Retired Expert
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Select Date */}
            {selectedDoctor && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Step 2: Select Date
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {getAvailableDates().map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          selectedDate === dateStr
                            ? 'border-sky-500 bg-sky-500 text-white'
                            : 'border-gray-200 hover:border-sky-300 text-gray-700'
                        }`}
                      >
                        <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div>{date.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Select Time */}
            {selectedDate && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Step 3: Select Time
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedTime === slot.time
                          ? 'border-sky-500 bg-sky-500 text-white'
                          : slot.available
                          ? 'border-gray-200 hover:border-sky-300 text-gray-700'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Patient Information */}
            {selectedTime && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Step 4: Patient Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={patientInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={patientInfo.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={patientInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      name="reason"
                      value={patientInfo.reason}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Brief description of your health concern..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {patientInfo.name && patientInfo.email && patientInfo.phone && (
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Booking Appointment...
                    </div>
                  ) : (
                    'Confirm Appointment'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};