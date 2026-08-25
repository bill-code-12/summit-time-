import React, { useEffect } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../lib/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        try {
          const idToken = await authService.getIdToken(firebaseUser);
          const userProfile = await authService.getUserProfile(firebaseUser.uid);

          // Store token and user profile
          setToken(idToken);
          if (userProfile) {
            setUser({
              id: firebaseUser.uid,
              name: userProfile.name,
              email: userProfile.email,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      } else {
        // User is logged out
        setUser(null);
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setToken]);

  return <>{children}</>;
};
