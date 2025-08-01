import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSamplesStore } from '@/store/samples-store';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from './use-toast';
import type { Sample } from '@/types';

export function useSamples() {
  const queryClient = useQueryClient();
  const { samples, setSamples, addSample, updateSample } = useSamplesStore();
  const { toast } = useToast();

  const samplesQuery = useQuery({
    queryKey: ['/api/samples'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0], { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch samples');
      const data = await response.json();
      setSamples(data);
      return data;
    },
  });

  const createSampleMutation = useMutation({
    mutationFn: async (sampleData: any) => {
      const response = await apiRequest('POST', '/api/samples', sampleData);
      return response.json();
    },
    onSuccess: (newSample) => {
      addSample(newSample);
      queryClient.invalidateQueries({ queryKey: ['/api/samples'] });
      toast({
        title: "Sample created",
        description: `Sample ${newSample.sampleId} has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create sample",
        description: error.message,
      });
    },
  });

  const updateSampleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Sample> }) => {
      const response = await apiRequest('PATCH', `/api/samples/${id}`, updates);
      return response.json();
    },
    onSuccess: (updatedSample) => {
      updateSample(updatedSample.id, updatedSample);
      queryClient.invalidateQueries({ queryKey: ['/api/samples'] });
      toast({
        title: "Sample updated",
        description: `Sample ${updatedSample.sampleId} has been updated.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to update sample",
        description: error.message,
      });
    },
  });

  const samplesByStatusQuery = useQuery({
    queryKey: ['/api/samples', 'by-status'],
    queryFn: async () => {
      const response = await fetch('/api/samples?status=pending', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch samples by status');
      return response.json();
    },
  });

  return {
    samples,
    isLoading: samplesQuery.isLoading,
    error: samplesQuery.error,
    createSample: createSampleMutation.mutate,
    updateSample: updateSampleMutation.mutate,
    isCreating: createSampleMutation.isPending,
    isUpdating: updateSampleMutation.isPending,
    samplesByStatus: samplesByStatusQuery.data || [],
  };
}
