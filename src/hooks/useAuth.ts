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
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
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
      const result = await authService.signUp(email, password, userData);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signIn(email, password);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
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