
import { Apartment, ChecklistItem, DailyLogEntry, Milestone, GalleryPhoto } from './types';
import { 
  apartments as initialApartments, 
  milestones as initialMilestones,
  dailyTimeline as initialLogs 
} from './mockData';

const KEYS = {
  APARTMENTS: 'goldie_db_apartments',
  CHECKLIST: 'goldie_db_checklist',
  LOGS: 'goldie_db_logs',
  MILESTONES: 'goldie_db_milestones',
  GALLERY: 'goldie_db_gallery'
};

export const db = {
  // Apartments Collection
  apartments: {
    get: (): Apartment[] => {
      const data = localStorage.getItem(KEYS.APARTMENTS);
      if (!data) return initialApartments;
      return JSON.parse(data);
    },
    add: (apt: Apartment) => {
      const current = db.apartments.get();
      const updated = [apt, ...current];
      localStorage.setItem(KEYS.APARTMENTS, JSON.stringify(updated));
      return updated;
    },
    update: (id: string, updates: Partial<Apartment>) => {
      const current = db.apartments.get();
      const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
      localStorage.setItem(KEYS.APARTMENTS, JSON.stringify(updated));
      return updated;
    },
    remove: (id: string) => {
      const updated = db.apartments.get().filter(a => a.id !== id);
      localStorage.setItem(KEYS.APARTMENTS, JSON.stringify(updated));
      return updated;
    }
  },

  // Daily Logs Collection
  logs: {
    get: (): DailyLogEntry[] => {
      const data = localStorage.getItem(KEYS.LOGS);
      if (!data) return initialLogs;
      return JSON.parse(data);
    },
    add: (entry: DailyLogEntry) => {
      const current = db.logs.get();
      const updated = [entry, ...current];
      localStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
      return updated;
    },
    remove: (id: string) => {
      const updated = db.logs.get().filter(l => l.id !== id);
      localStorage.setItem(KEYS.LOGS, JSON.stringify(updated));
      return updated;
    }
  },

  // Milestones Collection
  milestones: {
    get: (): Milestone[] => {
      const data = localStorage.getItem(KEYS.MILESTONES);
      if (!data) return initialMilestones;
      return JSON.parse(data);
    },
    add: (m: Milestone) => {
      const current = db.milestones.get();
      const updated = [...current, m];
      localStorage.setItem(KEYS.MILESTONES, JSON.stringify(updated));
      return updated;
    },
    update: (id: string, updates: Partial<Milestone>) => {
      const current = db.milestones.get();
      const updated = current.map(m => 
        m.id === id ? { ...m, ...updates } : m
      );
      localStorage.setItem(KEYS.MILESTONES, JSON.stringify(updated));
      return updated;
    },
    remove: (id: string) => {
      const updated = db.milestones.get().filter(m => m.id !== id);
      localStorage.setItem(KEYS.MILESTONES, JSON.stringify(updated));
      return updated;
    }
  },

  // Gallery Collection
  gallery: {
    get: (): GalleryPhoto[] => {
      const data = localStorage.getItem(KEYS.GALLERY);
      if (!data) return [];
      return JSON.parse(data);
    },
    add: (photo: GalleryPhoto) => {
      const current = db.gallery.get();
      const updated = [photo, ...current];
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(updated));
      return updated;
    },
    remove: (id: string) => {
      const updated = db.gallery.get().filter(p => p.id !== id);
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(updated));
      return updated;
    }
  }
};
