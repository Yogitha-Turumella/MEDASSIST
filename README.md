# MedAssist Healthcare Platform

A comprehensive healthcare website connecting patients with doctors, featuring AI-powered symptom checking and integrated ChatGPT assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database and authentication)
- API keys for various services (see Environment Setup)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd medassist-healthcare
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your actual API keys:
   ```env
   # Required - Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Required - AI Services
   VITE_OPENAI_API_KEY=sk-your_openai_api_key
   VITE_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
   VITE_VISION_API_KEY=your_vision_api_key
   
   # Required - Video Consultation
   VITE_AGORA_APP_ID=your_agora_app_id
   ```

3. **Database Setup**
   - Create a Supabase project
   - Run the migration file: `supabase/migrations/20250703062505_patient_beacon.sql`
   - Set up Row Level Security policies

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

### Required Services

| Service | Purpose | Required |
|---------|---------|----------|
| **Supabase** | Database, Authentication, Storage | ✅ Yes |
| **OpenAI** | ChatGPT integration, AI responses | ✅ Yes |
| **Google Cloud** | Voice recognition, Translation | ✅ Yes |
| **Vision API** | Image analysis, Medical imaging | ✅ Yes |
| **Agora.io** | Video consultation calls | ✅ Yes |

### Optional Services

| Service | Purpose | Required |
|---------|---------|----------|
| **Twilio** | SMS notifications, Emergency alerts | ❌ Optional |
| **SendGrid** | Email notifications | ❌ Optional |
| **Google Maps** | Location services | ❌ Optional |
| **Stripe** | Payment processing | ❌ Optional |

### Getting API Keys

#### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy `URL` and `anon public` key

#### 2. OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account and add billing
3. Go to API Keys section
4. Create new secret key

#### 3. Google Cloud Setup
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable APIs: Speech-to-Text, Translation, Vision
4. Create service account and download key

#### 4. Agora.io Setup
1. Go to [agora.io](https://www.agora.io)
2. Create account and project
3. Get App ID from project dashboard

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Navbar.tsx      # Navigation component
│   ├── ProtectedRoute.tsx # Route protection
│   └── ...
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── AboutPage.tsx   # Public about page
│   ├── DoctorsPage.tsx # Doctor directory
│   └── ...
├── lib/                # Core utilities
│   ├── config.ts       # Environment configuration
│   ├── supabase.ts     # Database client
│   └── ...
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
└── utils/              # Utility functions
    └── openai.ts       # OpenAI integration
```

## 🔐 Authentication & Access Control

### Access Levels
- **Public**: Home page, About page
- **Authenticated**: All medical features, AI tools, appointments

### User Types
- **Patients**: Book appointments, use symptom checker
- **Doctors**: Manage appointments, view patient data

## 🤖 AI Features

### 1. Symptom Checker
- Text-based symptom selection
- AI-powered disease prediction
- Confidence scoring and recommendations

### 2. Enhanced AI Assistant
- **Voice Input**: Speech-to-text symptom description
- **Image Diagnosis**: Upload photos for AI analysis
- **Multilingual Chat**: 12+ language support
- **Emergency Detection**: Automatic escalation

### 3. ChatBot Integration
- Real-time ChatGPT responses
- Healthcare-focused conversations
- Sentiment analysis
- Emergency protocol activation

## 📱 Core Features

### 🏥 Healthcare Services
- **Doctor Directory**: Browse young doctors and retired specialists
- **AI Symptom Checker**: Get preliminary health assessments
- **Appointment Booking**: Schedule consultations with preferred doctors
- **Video Consultations**: HD video calls with doctors
- **Secure Messaging**: Communicate with healthcare providers
- **24/7 Support**: Round-the-clock assistance

### 🤖 AI-Powered Features
- **Intelligent Assistant**: ChatGPT-powered healthcare companion
- **Voice Recognition**: Natural language symptom input
- **Image Analysis**: Medical image diagnosis
- **Emergency Detection**: Automatic emergency escalation
- **Multilingual Support**: 12+ languages with real-time translation

### 📊 Advanced Analytics
- **Sentiment Analysis**: Patient feedback analysis
- **Emergency Escalation**: Automatic response protocols
- **Health Tracking**: Comprehensive patient profiles
- **Performance Metrics**: Doctor and service analytics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure all required environment variables are set in your production environment:

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Production AI Services
VITE_OPENAI_API_KEY=sk-your_production_openai_key
# ... other production keys
```

## 🏆 Awards & Recognition

**3rd Place Winner** at Avinya2k24 Hackathon for innovative healthcare solutions

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Configuration Status
The app includes built-in configuration validation:
- Check browser console for configuration status
- Missing API keys will show warnings
- Fallback modes available for development

## 📞 Support

For technical support or questions:
- **Email**: support@medassist.com
- **Phone**: +1 (555) 123-4567
- **Emergency**: Call 911 for medical emergencies

## 🔒 Security & Privacy

- HIPAA-compliant data handling
- End-to-end encryption for video calls
- Secure authentication with Supabase
- Row-level security for database access
- Privacy-first design principles

## 🌟 Future Enhancements

- Real-time health monitoring
- Wearable device integration
- Advanced AI diagnostics
- Telemedicine expansion
- Mobile app development
- Insurance integration

---

*MedAssist - Your Healthcare Companion* 🏥