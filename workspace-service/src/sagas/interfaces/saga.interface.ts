import { ObjectID } from 'typeorm';
import { IAgent } from '../../workspaces/interfaces/agent.interface';

export interface ISaga {
  id: ObjectID;
  name: string;
  description?: string;
  creator: IAgent;
  createdAt: Date;
  expiresAt?: Date;
}