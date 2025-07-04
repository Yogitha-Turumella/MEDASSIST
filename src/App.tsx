import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MultilingualChatBot } from './components/MultilingualChatBot';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { EnhancedSymptomCheckerPage } from './pages/EnhancedSymptomCheckerPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { ContactPage } from './pages/ContactPage';
import { VideoConsultationPage } from './pages/VideoConsultationPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading } = useAuth();

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MedAssist...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onAuthClick={openAuthModal} />
        <main>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/doctors" element={
              <ProtectedRoute>
                <DoctorsPage />
              </ProtectedRoute>
            } />
            <Route path="/symptom-checker" element={
              <ProtectedRoute>
                <SymptomCheckerPage />
              </ProtectedRoute>
            } />
            <Route path="/enhanced-symptom-checker" element={
              <ProtectedRoute>
                <EnhancedSymptomCheckerPage />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <AppointmentPage />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            } />
            <Route path="/video-consultation" element={
              <ProtectedRoute>
                <VideoConsultationPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        
        {/* Only show chatbot for authenticated users */}
        {user && <MultilingualChatBot sessionType="general_support" />}
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </div>
    </Router>
  );
}

export default App;