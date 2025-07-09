import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, authService, dataService } from '../lib/supabase';

export interface AuthUser extends User {
  profile?: any;
  userType?: 'patient' | 'doctor';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Add timeout to prevent infinite loading
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 8000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (session?.user) {
          try {
            await loadUserProfile(session.user);
          } catch (profileError) {
            console.warn('Profile loading failed, continuing with basic auth:', profileError);
            setUser(session.user as AuthUser);
          }
        }
      } catch (error) {
        console.warn('Error getting initial session (using offline mode):', error.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            setUser(null);
            setProfile(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      const userType = authUser.user_metadata?.user_type || 'patient';
      
      let userProfile = null;
      try {
        if (userType === 'patient') {
          userProfile = await dataService.getPatientProfile(authUser.id);
        } else {
          userProfile = await dataService.getDoctorProfile(authUser.id);
        }
      } catch (profileError) {
        console.log('Profile not found, user can still use basic features');
      }

      const enhancedUser: AuthUser = {
        ...authUser,
        profile: userProfile,
        userType
      };

      setUser(enhancedUser);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Still set the user even if profile loading fails
      setUser(authUser as AuthUser);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; userType: 'patient' | 'doctor' }) => {
    setLoading(true);
    try {
      // Add timeout to prevent infinite loading
      const signUpPromise = authService.signUp(email, password, userData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign up timeout - please try again')), 15000)
      );
      
      const result = await Promise.race([signUpPromise, timeoutPromise]);
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Add timeout to prevent infinite loading
      const signInPromise = authService.signIn(email, password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in timeout - please check your connection and try again')), 12000)
      );
      
      const result = await Promise.race([signInPromise, timeoutPromise]);
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Add timeout for sign out
      const signOutPromise = authService.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 8000)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      setUser(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isPatient: user?.userType === 'patient',
    isDoctor: user?.userType === 'doctor'
  };
};