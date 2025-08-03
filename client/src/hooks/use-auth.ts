import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { authApi, type LoginCredentials, type RegisterData } from '@/lib/auth';
import { useToast } from './use-toast';
import { useState, useEffect } from 'react';

export function useAuth() {
  const { user, setUser, clearUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, [setUser]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      try {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setError(null);
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.firstName}!`,
        });
        // Redirect to dashboard after successful login
        window.location.href = '/';
      } catch (error) {
        console.error('Login success handler failed:', error);
        setError('Login succeeded but failed to save user data');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: 'Login succeeded but failed to save user data',
        });
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      const errorMessage = error?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      try {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setError(null);
         toast({
          title: "Registration successful",
          description: `Welcome to MedLab LIS, ${data.user.firstName}!`,
        });
        // Redirect to dashboard after successful registration
        window.location.href = '/';
      } catch (error) {
        console.error('Registration success handler failed:', error);
        setError('Registration succeeded but failed to save user data');
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: 'Registration succeeded but failed to save user data',
        });
      }
    },
    onError: (error: any) => {
      console.error('Registration failed:', error);
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
    },
  });

  const handleLogin = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('user');
    authApi.logout();
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isLoading: loginMutation.isPending || registerMutation.isPending || isLoading,
    error,
  };
}