
import { Apartment, ChecklistItem } from './types';
import { apartments as initialApartments } from './mockData';

const APARTMENTS_KEY = 'goldie_hub_apartments';
const CHECKLIST_KEY = 'goldie_hub_checklist';

export const storage = {
  getApartments: (): Apartment[] => {
    const data = localStorage.getItem(APARTMENTS_KEY);
    if (!data) return initialApartments.map(a => ({ ...a, createdAt: Date.now() }));
    return JSON.parse(data);
  },

  saveApartment: (apt: Apartment) => {
    const current = storage.getApartments();
    const updated = [apt, ...current];
    localStorage.setItem(APARTMENTS_KEY, JSON.stringify(updated));
    return updated;
  },

  getChecklist: (): ChecklistItem[] => {
    const data = localStorage.getItem(CHECKLIST_KEY);
    if (!data) return [
      { id: 'prep-1', title: 'Before Arrival', content: 'Setup the crate in the bedroom, puppy-proof the living room (hide cords!), and buy high-value treats.', completed: false },
      { id: 'prep-2', title: 'First Night Plan', content: 'Place a snuggle puppy toy in the crate. Set alarms for 2 AM and 5 AM potty breaks.', completed: false },
      { id: 'prep-3', title: 'Vet & Health', content: 'Schedule first wellness exam. Bring vaccination records from breeder.', completed: false }
    ];
    return JSON.parse(data);
  },

  saveChecklist: (items: ChecklistItem[]) => {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
  }
};
