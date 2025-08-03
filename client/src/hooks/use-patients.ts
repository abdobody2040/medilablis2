import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './use-toast';
import type { Patient } from '@/types';

export interface PatientsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function usePatients(params: PatientsQueryParams = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { page = 1, limit = 50, search } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  const patientsQuery = useQuery({
    queryKey: ['/api/patients', page, limit, search],
    queryFn: async () => {
      const response = await fetch(`/api/patients?${queryParams}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch patients');
      return response.json();
    },
  });

  const searchPatientsQuery = useQuery({
    queryKey: ['/api/patients', 'search'],
    queryFn: async ({ queryKey }) => {
      const [, , searchTerm] = queryKey;
      if (!searchTerm) return [];
      
      const response = await fetch(`/api/patients?search=${searchTerm}`, { 
        credentials: 'include' 
      });
      if (!response.ok) throw new Error('Failed to search patients');
      return response.json();
    },
    enabled: false, // Only run when explicitly called
  });

  const createPatientMutation = useMutation({
    mutationFn: async (patientData: any) => {
      const response = await apiRequest('POST', '/api/patients', patientData);
      return response.json();
    },
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      toast({
        title: "Patient registered",
        description: `${newPatient.firstName} ${newPatient.lastName} has been registered successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to register patient",
        description: error.message,
      });
    },
  });

  const getPatientQuery = (id: string) => useQuery({
    queryKey: ['/api/patients', id],
    queryFn: async ({ queryKey }) => {
      const [, patientId] = queryKey;
      const response = await fetch(`/api/patients/${patientId}`, { 
        credentials: 'include' 
      });
      if (!response.ok) throw new Error('Failed to fetch patient');
      return response.json();
    },
    enabled: !!id,
  });

  const searchPatients = (searchTerm: string) => {
    return queryClient.fetchQuery({
      queryKey: ['/api/patients', 'search', searchTerm],
      queryFn: async () => {
        const response = await fetch(`/api/patients?search=${searchTerm}`, { 
          credentials: 'include' 
        });
        if (!response.ok) throw new Error('Failed to search patients');
        return response.json();
      },
    });
  };

  return {
    patients: patientsQuery.data || [],
    isLoading: patientsQuery.isLoading,
    error: patientsQuery.error,
    createPatient: createPatientMutation.mutate,
    isCreating: createPatientMutation.isPending,
    getPatient: getPatientQuery,
    searchPatients,
  };
}
