import { create } from 'zustand';
import type { Sample, Patient } from '@shared/schema';

interface SamplesState {
  samples: Sample[];
  selectedSample: Sample | null;
  setSamples: (samples: Sample[]) => void;
  addSample: (sample: Sample) => void;
  updateSample: (id: string, updates: Partial<Sample>) => void;
  setSelectedSample: (sample: Sample | null) => void;
  getSamplesByStatus: (status: string) => Sample[];
}

export const useSamplesStore = create<SamplesState>((set, get) => ({
  samples: [],
  selectedSample: null,
  
  setSamples: (samples: Sample[]) => set({ samples }),
  
  addSample: (sample: Sample) => {
    set((state) => ({
      samples: [sample, ...state.samples]
    }));
  },
  
  updateSample: (id: string, updates: Partial<Sample>) => {
    set((state) => ({
      samples: state.samples.map(sample =>
        sample.id === id ? { ...sample, ...updates } : sample
      )
    }));
  },
  
  setSelectedSample: (sample: Sample | null) => set({ selectedSample: sample }),
  
  getSamplesByStatus: (status: string) => {
    return get().samples.filter(sample => sample.status === status);
  },
}));
