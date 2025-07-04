import React from 'react';
import { Heart, Award, Users, Shield, Clock, Stethoscope } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Heart className="h-20 w-20 text-sky-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About MedAssist</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            MedAssist is a revolutionary healthcare platform that connects patients with experienced doctors, 
            featuring AI-powered symptom checking and integrated multilingual assistance.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
            To make quality healthcare accessible to everyone by bridging the gap between patients and healthcare providers 
            through innovative technology, AI-powered diagnostics, and seamless communication tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Doctors</h3>
            <p className="text-gray-600">
              Connect with both young practicing doctors and experienced retired specialists 
              who bring decades of medical expertise.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Diagnostics</h3>
            <p className="text-gray-600">
              Advanced AI symptom checker with voice input, image diagnosis, and 
              multilingual support for accurate health assessments.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Availability</h3>
            <p className="text-gray-600">
              Round-the-clock support with emergency escalation protocols and 
              immediate response systems for critical situations.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Multilingual Support</h3>
            <p className="text-gray-600">
              Comprehensive healthcare assistance in 12+ languages with 
              real-time translation and cultural sensitivity.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Patient-Centered Care</h3>
            <p className="text-gray-600">
              Personalized healthcare experiences with comprehensive patient profiles, 
              medical history tracking, and tailored recommendations.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              HIPAA-compliant platform with enterprise-grade security, 
              encrypted communications, and strict privacy controls.
            </p>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl p-8 mb-12 text-white text-center">
          <Award className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Award-Winning Innovation</h2>
          <p className="text-xl text-sky-100 mb-2">🏆 3rd Place Winner</p>
          <p className="text-lg text-sky-100">Avinya2k24 Hackathon for Innovative Healthcare Solutions</p>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Frontend Technologies</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• React 18 with TypeScript for robust development</li>
                <li>• Tailwind CSS for modern, responsive design</li>
                <li>• Vite for fast development and optimized builds</li>
                <li>• React Router for seamless navigation</li>
                <li>• Lucide React for beautiful, consistent icons</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Backend & AI</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Supabase for real-time database and authentication</li>
                <li>• Advanced AI models for symptom analysis</li>
                <li>• WebRTC for video consultations</li>
                <li>• Voice recognition and image processing APIs</li>
                <li>• Multilingual NLP for global accessibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Values */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Making healthcare accessible to everyone, regardless of location, 
                language, or technical expertise.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Continuously advancing healthcare technology to improve patient 
                outcomes and healthcare delivery.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                Building trust through transparency, security, and reliable 
                healthcare services that patients can depend on.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-6">
            Have questions about MedAssist? We'd love to hear from you.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">support@medassist.com</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Address</h4>
              <p className="text-gray-600">123 Healthcare Ave, Medical City</p>
            </div>
          </div>
        </div>

        {/* Sign Up CTA */}
        <div className="mt-12 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-yellow-800 mb-3">Ready to Experience Better Healthcare?</h3>
            <p className="text-yellow-700 mb-4">
              Sign up today to access our full range of healthcare services, AI-powered diagnostics, 
              and connect with experienced medical professionals.
            </p>
            <p className="text-sm text-yellow-600">
              Please sign in to access all MedAssist features and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};