import { ProcessDetail } from './ProcessDetail';
export interface ProcessPhase {
  ID: number;
  title: string;
  processDetails: ProcessDetail[];
  type: string;
  percentage: number;
  phasePercentageCompleted: Boolean;
  sortOrder: number;
}