export type QueueCategory =
  | 'hospital'
  | 'office'
  | 'canteen'
  | 'railway'
  | 'bus'
  | 'service_center'
  | 'bank'
  | 'college';

export type QueueStatus = 'active' | 'paused' | 'closed';

export type TokenStatus = 'waiting' | 'approaching' | 'almost' | 'serving' | 'completed' | 'skipped' | 'cancelled';

export interface Counter {
  id: number;
  name: string;
  staffName: string;
  currentServingToken: number | null;
  status: 'active' | 'busy' | 'break';
}

export interface WaitingToken {
  tokenNumber: number;
  userName: string;
  phone?: string;
  partySize: number;
  joinedAt: string;
  status: TokenStatus;
  counterAssigned?: number;
}

export interface Queue {
  queueId: string;
  organizationName: string;
  location: string;
  serviceName: string;
  category: QueueCategory;
  currentToken: number;
  lastToken: number;
  activeCounters: number;
  averageServiceTime: number; // in minutes
  status: QueueStatus;
  counters: Counter[];
  waitingList: WaitingToken[];
  maxCapacity?: number;
  operatingHours?: string;
}

export interface UserActiveToken {
  tokenNumber: number;
  queueId: string;
  userName: string;
  phone?: string;
  partySize: number;
  joinedAt: string;
  status: TokenStatus;
  estimatedWaitTime: number;
  peopleAhead: number;
  counterAssigned?: number;
  notifiedStates: {
    approaching: boolean;
    almost: boolean;
    serving: boolean;
  };
}

export interface AppNotification {
  notificationId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'progress' | 'warning' | 'alert' | 'success';
  tokenNumber?: number;
  queueId?: string;
}

export interface QueueAnalytics {
  totalServedToday: number;
  averageWaitTimeMinutes: number;
  averageServiceTimeMinutes: number;
  peakHours: { hour: string; count: number }[];
  abandonmentRate: number;
  dailyVolume: number;
}
