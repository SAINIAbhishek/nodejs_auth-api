import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Email';
export const COLLECTION_NAME = 'emails';

export enum EmailStatusEnum {
  SENT = 'SENT', // Email has been successfully sent
  ERROR = 'ERROR', // Email sending encountered an error
  QUEUED = 'QUEUED', // Email is waiting to be sent
}

export default interface Email {
  _id?: Types.ObjectId;
  subject?: string;
  to?: string;
  url?: string;
  content?: string;
  status?: EmailStatusEnum;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}

const EmailSchema = new Schema<Email>(
  {
    subject: {
      type: Schema.Types.String,
      trim: true,
      required: true,
    },
    error: {
      type: Schema.Types.String,
      trim: true,
      select: false,
    },
    status: {
      type: Schema.Types.String,
      enum: EmailStatusEnum,
      default: EmailStatusEnum.QUEUED,
    },
    url: {
      type: Schema.Types.String,
      trim: true,
    },
    content: {
      type: Schema.Types.String,
      trim: true,
      required: true,
    },
    to: {
      type: Schema.Types.String,
      trim: true,
      minlength: 5,
      maxlength: 50,
      required: true,
      lowercase: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

EmailSchema.index({ to: 1 });
EmailSchema.index({ status: 1 });
EmailSchema.index({ createdAt: 1 });
EmailSchema.index({ updatedAt: 1 });

export const EmailModel = model<Email>(
  DOCUMENT_NAME,
  EmailSchema,
  COLLECTION_NAME
);
