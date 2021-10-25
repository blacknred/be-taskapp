import { IUser } from '../../users/interfaces/user.interface';

export interface IPushSubscription {
  endpoint: string;
  expirationTime?: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export type IAuth = {
  user: Pick<IUser, 'id' | 'roles' | 'email'>;
  pushSubscriptions: IPushSubscription[];
};
