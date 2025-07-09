/**
 * Environment Configuration for MedAssist Healthcare Platform
 * 
 * This file centralizes all environment variable access and provides
 * type-safe configuration management with validation.
 */

interface Config {
  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // AI Services
  ai: {
    openaiApiKey: string;
    googleCloudApiKey: string;
    visionApiKey: string;
  };
  
  // Video Consultation
  video: {
    agoraAppId: string;
  };
  
  // Communication Services
  communication: {
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    sendgridApiKey?: string;
  };
  
  // Maps and Location
  maps: {
    googleMapsApiKey?: string;
  };
  
  // Payment Processing
  payment: {
    stripePublishableKey?: string;
  };
  
  // Development Settings
  development: {
    nodeEnv: string;
    debugMode: boolean;
    apiBaseUrl: string;
  };
  
  // Security
  security: {
    encryptionKey?: string;
    jwtSecret?: string;
  };
}

/**
 * Get environment variable with optional fallback
 */
const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] || fallback;
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

/**
 * Get required environment variable (throws error if not set)
 */
const getRequiredEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
};

/**
 * Validate that all required environment variables are present
 */
const validateRequiredConfig = (): void => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OPENAI_API_KEY',
    'VITE_GOOGLE_CLOUD_API_KEY',
    'VITE_VISION_API_KEY',
    'VITE_AGORA_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
    console.warn('Please check your .env file and ensure all required variables are set.');
    console.warn('The application will run in demo mode with limited functionality.');
  }
};

/**
 * Application configuration object
 */
export const config: Config = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL', 'https://placeholder.supabase.co'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', 'placeholder-key'),
  },
  
  ai: {
    openaiApiKey: getEnvVar('VITE_OPENAI_API_KEY', ''),
    googleCloudApiKey: getEnvVar('VITE_GOOGLE_CLOUD_API_KEY', ''),
    visionApiKey: getEnvVar('VITE_VISION_API_KEY', ''),
  },
  
  video: {
    agoraAppId: getEnvVar('VITE_AGORA_APP_ID', ''),
  },
  
  communication: {
    twilioAccountSid: getEnvVar('VITE_TWILIO_ACCOUNT_SID'),
    twilioAuthToken: getEnvVar('VITE_TWILIO_AUTH_TOKEN'),
    sendgridApiKey: getEnvVar('VITE_SENDGRID_API_KEY'),
  },
  
  maps: {
    googleMapsApiKey: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
  },
  
  payment: {
    stripePublishableKey: getEnvVar('VITE_STRIPE_PUBLISHABLE_KEY'),
  },
  
  development: {
    nodeEnv: getEnvVar('VITE_NODE_ENV', 'development'),
    debugMode: getEnvVar('VITE_DEBUG_MODE', 'false') === 'true',
    apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000'),
  },
  
  security: {
    encryptionKey: getEnvVar('VITE_ENCRYPTION_KEY'),
    jwtSecret: getEnvVar('VITE_JWT_SECRET'),
  },
};

/**
 * Check if the application is in development mode
 */
export const isDevelopment = (): boolean => {
  return config.development.nodeEnv === 'development';
};

/**
 * Check if debug mode is enabled
 */
export const isDebugMode = (): boolean => {
  return config.development.debugMode;
};

/**
 * Check if a service is properly configured
 */
export const isServiceConfigured = (service: keyof Config): boolean => {
  switch (service) {
    case 'supabase':
      return !!(config.supabase.url && 
                config.supabase.anonKey && 
                config.supabase.url !== 'https://placeholder.supabase.co' &&
                config.supabase.url.includes('.supabase.co') &&
                config.supabase.anonKey.startsWith('eyJ'));
    case 'ai':
      return !!(config.ai.openaiApiKey || config.ai.googleCloudApiKey || config.ai.visionApiKey);
    case 'video':
      return !!config.video.agoraAppId;
    case 'communication':
      return !!(config.communication.twilioAccountSid || config.communication.sendgridApiKey);
    case 'maps':
      return !!config.maps.googleMapsApiKey;
    case 'payment':
      return !!config.payment.stripePublishableKey;
    default:
      return false;
  }
};

/**
 * Get configuration status for debugging
 */
export const getConfigStatus = () => {
  return {
    supabase: isServiceConfigured('supabase'),
    ai: isServiceConfigured('ai'),
    video: isServiceConfigured('video'),
    communication: isServiceConfigured('communication'),
    maps: isServiceConfigured('maps'),
    payment: isServiceConfigured('payment'),
    development: isDevelopment(),
    debug: isDebugMode(),
  };
};

/**
 * Log configuration status (only in development)
 */
export const logConfigStatus = (): void => {
  if (isDevelopment() && isDebugMode()) {
    console.log('🔧 MedAssist Configuration Status:', getConfigStatus());
  }
};

// Validate configuration on module load
if (isDevelopment()) {
  validateRequiredConfig();
  logConfigStatus();
}

// Export individual service configurations for convenience
export const supabaseConfig = config.supabase;
export const aiConfig = config.ai;
export const videoConfig = config.video;
export const communicationConfig = config.communication;
export const mapsConfig = config.maps;
export const paymentConfig = config.payment;
export const developmentConfig = config.development;
export const securityConfig = config.security;