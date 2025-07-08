import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MultilingualChatBot } from './components/MultilingualChatBot';
import { AuthModal } from './components/AuthModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { useAuth } from './hooks/useAuth';

// Lazy load heavy components
const DoctorsPage = lazy(() => import('./pages/DoctorsPage').then(module => ({ default: module.DoctorsPage })));
const SymptomCheckerPage = lazy(() => import('./pages/SymptomCheckerPage').then(module => ({ default: module.SymptomCheckerPage })));
const EnhancedSymptomCheckerPage = lazy(() => import('./pages/EnhancedSymptomCheckerPage').then(module => ({ default: module.EnhancedSymptomCheckerPage })));
const AppointmentPage = lazy(() => import('./pages/AppointmentPage').then(module => ({ default: module.AppointmentPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const VideoConsultationPage = lazy(() => import('./pages/VideoConsultationPage').then(module => ({ default: module.VideoConsultationPage })));

const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

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
                <Suspense fallback={<PageLoader />}>
                  <DoctorsPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/symptom-checker" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <SymptomCheckerPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/enhanced-symptom-checker" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <EnhancedSymptomCheckerPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <AppointmentPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ContactPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/video-consultation" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <VideoConsultationPage />
                </Suspense>
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