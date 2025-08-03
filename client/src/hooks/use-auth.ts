import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api';
import { useToast } from './use-toast';
import { useState, useEffect } from 'react';

export function useAuth() {
  const { user, login: setUser, logout: clearUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already stored in localStorage
    const storedUser = localStorage.getItem('auth-storage');
    if (storedUser) {
      try {
        const authData = JSON.parse(storedUser);
        if (authData.state?.user) {
          setUser(authData.state.user);
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('auth-storage');
      }
    }
    setIsLoading(false);
  }, [setUser]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setError(null);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.firstName || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setError(null);
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.firstName || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    },
  });

  const login = (credentials: { username: string; password: string }) => {
    loginMutation.mutate(credentials);
  };

  const register = (userData: any) => {
    registerMutation.mutate(userData);
  };

  const logout = () => {
    clearUser();
    localStorage.removeItem('user');
    localStorage.removeItem('auth-storage');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error: error || loginMutation.error?.message || registerMutation.error?.message,
    login,
    register,
    logout,
  };
}