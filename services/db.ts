// Fix: Use the default import for Dexie when extending the class. The named import `{ Dexie }` was likely a type-only import, which breaks inheritance.
import Dexie, { type Table } from 'dexie';
import type { Surveyor, SurveyRegularResponse, SurveyEventResponse } from '../types';

export class SurveySyncDB extends Dexie {
  surveyors!: Table<Surveyor>;
  surveyRegularResponses!: Table<SurveyRegularResponse>;
  surveyEventResponses!: Table<SurveyEventResponse>;

  constructor() {
    super('SurveySyncDB');
    this.version(1).stores({
      surveyors: '++id, fullName, email, idNumber, createdAt, status',
      surveyRegularResponses: '++id, createdAt, status',
      surveyEventResponses: '++id, createdAt, status',
    });
  }
}

export const db = new SurveySyncDB();