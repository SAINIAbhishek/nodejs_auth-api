import { model, Schema } from 'mongoose';
import { Email, EmailStatusEnum } from '../types/email-type';

const schema = new Schema<Email>(
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

schema.index({ to: 1 });
schema.index({ status: 1 });
schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });

export const DOCUMENT_NAME = 'Email';
export const COLLECTION_NAME = 'emails';

export const EmailModel = model<Email>(DOCUMENT_NAME, schema, COLLECTION_NAME);
