
export enum Region {
  NORTH = 'North',
  SOUTH = 'South',
  EAST = 'East',
  WEST = 'West',
  CENTRAL = 'Central',
}

export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
}

export interface Surveyor {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  region: Region;
  idNumber: string;
  createdAt: Date;
  status: SyncStatus;
}

export interface SurveyRegularResponse {
  id?: number;
  step1: Record<string, any>;
  step2: Record<string, any>;
  step3: Record<string, any>;
  step4: Record<string, any>;
  createdAt: Date;
  status: SyncStatus;
}

export interface SurveyEventResponse {
    id?: number;
    eventDate: string;
    location: string;
    step1: Record<string, any>;
    step2: Record<string, any>;
    step3: Record<string, any>;
    createdAt: Date;
    status: SyncStatus;
}

export type SurveyResponse = SurveyRegularResponse | SurveyEventResponse;
