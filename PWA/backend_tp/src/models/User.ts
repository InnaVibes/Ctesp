import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'ADMIN' | 'PT' | 'CLIENT';
  isValidated: boolean;
  ptId?: Types.ObjectId;
  profileImage?: string;
  themePreference?: 'light' | 'dark';
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'PT', 'CLIENT'], default: 'CLIENT' },
  isValidated: { type: Boolean, default: false }, // PTs requerem validação do Admin
  ptId: { type: Schema.Types.ObjectId, ref: 'User' },
  profileImage: { type: String },
  themePreference: { type: String, enum: ['light', 'dark'], default: 'light' }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);