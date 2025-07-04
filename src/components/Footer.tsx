import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-sky-400" />
              <span className="text-2xl font-bold">MedAssist</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting patients with experienced doctors for quality healthcare. 
              Your health is our priority, and we're here to assist you 24/7.
            </p>
            <div className="bg-gradient-to-r from-sky-500 to-emerald-500 p-4 rounded-lg">
              <p className="text-white font-semibold mb-1">🏆 Achievement Highlight</p>
              <p className="text-sky-100 text-sm">
                MedAssist won 3rd place at Avinya2k24 Hackathon for innovative healthcare solutions
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-sky-400 transition-colors">Home</a></li>
              <li><a href="/doctors" className="text-gray-300 hover:text-sky-400 transition-colors">Find Doctors</a></li>
              <li><a href="/symptom-checker" className="text-gray-300 hover:text-sky-400 transition-colors">Symptom Checker</a></li>
              <li><a href="/appointments" className="text-gray-300 hover:text-sky-400 transition-colors">Book Appointment</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sky-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-sky-400" />
                <span className="text-gray-300">support@medassist.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span className="text-gray-300">123 Healthcare Ave, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 MedAssist. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};