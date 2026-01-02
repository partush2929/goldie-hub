
export interface Milestone {
  id: string;
  focusArea: string;
  status: 'In Progress' | 'Mastered' | 'Scheduled';
  recentProgress: string;
  icon: string;
  color: 'blue' | 'purple' | 'orange' | 'green';
}

export interface Apartment {
  id: string;
  title: string;
  price: string;
  specs: string;
  img: string;
  status: 'Touring' | 'Applied' | 'Contacted' | 'Viewed';
  statusIcon: string;
  statusColor: string;
  petTag: string;
  petIcon: string;
  createdAt: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  img?: string;
  type: 'video' | 'pdf' | 'article';
}

export interface DailyLogEntry {
  time: string;
  label: string;
  type: 'Meal' | 'Sleep' | 'Pee' | 'Poop';
  detail?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}
