import { SessionEntry } from './session.model';

export interface Player {
  readonly id: string;
  readonly alias: string;
  readonly color: string;
  readonly avatar: string;
  readonly notes: string;
  readonly tagIds: string[];
  readonly sessionHistory: SessionEntry[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
