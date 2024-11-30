import { Types } from 'mongoose';

export enum EmailStatusEnum {
  SENT = 'SENT', // Email has been successfully sent
  ERROR = 'ERROR', // Email sending encountered an error
  QUEUED = 'QUEUED', // Email is waiting to be sent
}

export type Email = {
  _id?: Types.ObjectId;
  subject: string;
  to: string;
  url?: string;
  content: string;
  status?: EmailStatusEnum;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
};
