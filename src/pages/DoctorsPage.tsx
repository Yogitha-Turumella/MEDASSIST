import React, { useState } from 'react';
import { MessageCircle, Calendar, Star, Award, Clock, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';

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
  education: string;
  languages: string[];
}

const mockDoctors: Doctor[] = [
  // General Practitioners & Family Medicine
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'General Practitioner',
    experience: 'Practicing – 3 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Comprehensive primary care with focus on preventive medicine and patient education.',
    location: 'New York, NY',
    education: 'MD - Johns Hopkins University',
    languages: ['English', 'Spanish']
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
    location: 'Los Angeles, CA',
    education: 'MD - Stanford University',
    languages: ['English', 'Mandarin']
  },
  
  // Internal Medicine
  {
    id: 3,
    name: 'Dr. Robert Thompson',
    specialization: 'Internal Medicine',
    experience: 'Retired – 35 years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: true,
    description: 'Former Chief of Internal Medicine with expertise in complex adult diseases.',
    location: 'Boston, MA',
    education: 'MD - Harvard Medical School',
    languages: ['English']
  },
  {
  id: 4,
  name: 'Dr. Emily Rodriguez',
  specialization: 'Internal Medicine',
  experience: 'Practicing – 8 years',
  rating: 4.7,
  image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  isRetired: false,
  description: 'Specialized in diabetes management and cardiovascular disease prevention.',
  location: 'Miami, FL',
  education: 'MD - University of Miami',
  languages: ['English', 'Spanish', 'Portuguese']
  },


  // Cardiologists
  {
    id: 5,
    name: 'Dr. James Wilson',
    specialization: 'Cardiologist',
    experience: 'Retired – 42 years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: true,
    description: 'Renowned cardiac surgeon with expertise in heart disease and interventional procedures.',
    location: 'Seattle, WA',
    education: 'MD - University of Washington',
    languages: ['English']
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
    location: 'Chicago, IL',
    education: 'MD - Northwestern University',
    languages: ['English', 'Korean']
  },

  // Pulmonologists
  {
    id: 7,
    name: 'Dr. David Kumar',
    specialization: 'Pulmonologist',
    experience: 'Practicing – 15 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Expert in respiratory diseases, asthma, and sleep disorders.',
    location: 'Houston, TX',
    education: 'MD - Baylor College of Medicine',
    languages: ['English', 'Hindi']
  },
  {
    id: 8,
    name: 'Dr. Margaret Davis',
    specialization: 'Pulmonologist',
    experience: 'Retired – 28 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: true,
    description: 'Former department head with extensive experience in critical care pulmonology.',
    location: 'Denver, CO',
    education: 'MD - University of Colorado',
    languages: ['English']
  },

  // Gastroenterologists
  {
  id: 9,
  name: 'Dr. Ahmed Hassan',
  specialization: 'Gastroenterologist',
  experience: 'Practicing – 10 years',
  rating: 4.7,
  image: 'https://media.istockphoto.com/id/1731985518/photo/doctor-black-man-and-thinking-of-healthcare-information-paperwork-or-documents-by-window-in.jpg?s=612x612&w=0&k=20&c=-Eg-ofQDVDDZIjFgCb1pysArKbL0b_YZRxlm1z3O7Bk=',
  isRetired: false,
  description: 'Specialist in digestive disorders, inflammatory bowel disease, and endoscopy.',
  location: 'Phoenix, AZ',
  education: 'MD - Mayo Clinic',
  languages: ['English', 'Arabic']
},

  {
    id: 10,
    name: 'Dr. Jennifer Lee',
    specialization: 'Gastroenterologist',
    experience: 'Practicing – 7 years',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/5452116/pexels-photo-5452116.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Focus on liver diseases, hepatitis treatment, and nutritional gastroenterology.',
    location: 'San Francisco, CA',
    education: 'MD - UCSF',
    languages: ['English', 'Korean', 'Japanese']
  },

  // Emergency Medicine
  {
    id: 11,
    name: 'Dr. Mark Rodriguez',
    specialization: 'Emergency Medicine',
    experience: 'Practicing – 6 years',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Emergency physician with expertise in trauma care and critical medicine.',
    location: 'Atlanta, GA',
    education: 'MD - Emory University',
    languages: ['English', 'Spanish']
  },

  // Dermatologists
  {
    id: 12,
    name: 'Dr. Rachel Green',
    specialization: 'Dermatologist',
    experience: 'Practicing – 9 years',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Expert in skin conditions, autoimmune dermatology, and cosmetic procedures.',
    location: 'Dallas, TX',
    education: 'MD - UT Southwestern',
    languages: ['English']
  },

  // Rheumatologists
  {
    id: 13,
    name: 'Dr. Patricia Wong',
    specialization: 'Rheumatologist',
    experience: 'Practicing – 14 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5452280/pexels-photo-5452280.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Specialist in autoimmune diseases, arthritis, and inflammatory conditions.',
    location: 'Portland, OR',
    education: 'MD - Oregon Health & Science University',
    languages: ['English', 'Mandarin']
  },

  // Allergists
  {
    id: 14,
    name: 'Dr. Thomas Brown',
    specialization: 'Allergist',
    experience: 'Retired – 25 years',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: true,
    description: 'Former allergy clinic director with expertise in immunotherapy and food allergies.',
    location: 'Minneapolis, MN',
    education: 'MD - University of Minnesota',
    languages: ['English']
  },

  // Orthopedists
  {
    id: 15,
    name: 'Dr. Kevin Martinez',
    specialization: 'Orthopedist',
    experience: 'Practicing – 11 years',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/5452299/pexels-photo-5452299.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
    location: 'Las Vegas, NV',
    education: 'MD - University of Nevada',
    languages: ['English', 'Spanish']
  },

  // Physical Medicine & Rehabilitation
  {
    id: 16,
    name: 'Dr. Susan Taylor',
    specialization: 'Physical Medicine & Rehabilitation',
    experience: 'Practicing – 13 years',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/5327648/pexels-photo-5327648.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Rehabilitation specialist focusing on pain management and functional recovery.',
    location: 'Nashville, TN',
    education: 'MD - Vanderbilt University',
    languages: ['English']
  },

  // Urgent Care
  {
    id: 17,
    name: 'Dr. Christopher Kim',
    specialization: 'Urgent Care',
    experience: 'Practicing – 4 years',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/5452297/pexels-photo-5452297.jpeg?auto=compress&cs=tinysrgb&w=400',
    isRetired: false,
    description: 'Urgent care physician with experience in acute illness and minor injuries.',
    location: 'San Diego, CA',
    education: 'MD - UC San Diego',
    languages: ['English', 'Korean']
  }
];

export const DoctorsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'young' | 'retired'>('all');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const specializations = Array.from(new Set(mockDoctors.map(doctor => doctor.specialization))).sort();

  const filteredDoctors = mockDoctors.filter(doctor => {
    const ageFilter = filter === 'all' || 
                     (filter === 'young' && !doctor.isRetired) || 
                     (filter === 'retired' && doctor.isRetired);
    
    const specFilter = specializationFilter === 'all' || doctor.specialization === specializationFilter;
    
    const searchFilter = debouncedSearchTerm === '' || 
                        doctor.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        doctor.specialization.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                        doctor.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    
    return ageFilter && specFilter && searchFilter;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    // Store the selected doctor and source for the appointment page
    localStorage.setItem('selectedDoctorId', doctor.id.toString());
    localStorage.setItem('bookingSource', 'doctor-browsing');
    localStorage.setItem('medicalCondition', `General consultation with ${doctor.specialization}`);
    navigate('/appointments');
  };

  const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative">
        <LazyImage
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-56"
        />
        {doctor.isRetired && (
          <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Retired Expert
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(doctor.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-gray-700 text-sm font-medium">({doctor.rating})</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
        <div className="flex items-center mb-2">
          <Stethoscope className="h-4 w-4 text-sky-500 mr-2" />
          <span className="text-sky-600 font-semibold">{doctor.specialization}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-600 text-sm">{doctor.experience}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{doctor.description}</p>
        
        <div className="mb-3">
          <p className="text-gray-500 text-sm"><strong>Education:</strong> {doctor.education}</p>
          <p className="text-gray-500 text-sm"><strong>Location:</strong> {doctor.location}</p>
          <p className="text-gray-500 text-sm">
            <strong>Languages:</strong> {doctor.languages.join(', ')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </button>
          <button
            onClick={() => handleBookAppointment(doctor)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with experienced young doctors and retired specialists who care about your health
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Search Doctors</label>
              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Experience</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    filter === 'all'
                      ? 'bg-sky-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Doctors ({mockDoctors.length})
                </button>
                <button
                  onClick={() => setFilter('young')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    filter === 'young'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Young Doctors ({mockDoctors.filter(d => !d.isRetired).length})
                </button>
                <button
                  onClick={() => setFilter('retired')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    filter === 'retired'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Retired Experts ({mockDoctors.filter(d => d.isRetired).length})
                </button>
              </div>
            </div>

            {/* Specialization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Filter by Specialization</label>
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} 
            {specializationFilter !== 'all' && ` specializing in ${specializationFilter}`}
            {filter !== 'all' && ` (${filter === 'young' ? 'actively practicing' : 'retired experts'})`}
          </p>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading doctors..." />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        )}

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No doctors found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {/* Specialization Guide */}
        <div className="mt-16 bg-gradient-to-br from-sky-50 to-emerald-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">When to See Each Specialist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">General Practitioner</h3>
              <p className="text-sm text-gray-600">Routine checkups, common illnesses, preventive care, referrals</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cardiologist</h3>
              <p className="text-sm text-gray-600">Heart problems, chest pain, high blood pressure, heart disease</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Pulmonologist</h3>
              <p className="text-sm text-gray-600">Breathing problems, asthma, lung diseases, persistent cough</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Gastroenterologist</h3>
              <p className="text-sm text-gray-600">Digestive issues, stomach pain, nausea, bowel problems</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Dermatologist</h3>
              <p className="text-sm text-gray-600">Skin conditions, rashes, allergic reactions, skin cancer</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Emergency Medicine</h3>
              <p className="text-sm text-gray-600">Urgent care, severe symptoms, accidents, immediate attention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};