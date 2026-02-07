
export type Personality = 'Strict' | 'Calm' | 'Friendly';
export type Timeline = '3 years' | '5 years' | '10 years';

export interface UserProfile {
  name: string;
  email: string;
  futureYears: Timeline;
  personality: Personality;
  careerGoals: string;
  lifestyleGoals: string;
  createdAt: string;
  lockedUntil: string;
}

export interface UserStats {
  streak: number;
  lastActive: string | null;
  totalCheckIns: number;
}

export interface Memory {
  id: string;
  text: string;
  triggerType: 'Manual' | 'Streak Break' | 'Missed Days' | 'Reverse Regret';
  createdAt: string;
}

export interface DailyLog {
  date: string;
  completed: boolean;
}

export interface AppState {
  user: UserProfile | null;
  stats: UserStats;
  memories: Memory[];
  logs: DailyLog[];
  isAuthenticated: boolean;
}
