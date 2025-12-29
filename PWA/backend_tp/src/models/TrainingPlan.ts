import { Schema, model, Document, Types } from 'mongoose';

export interface IPlan extends Document {
  clientId: Types.ObjectId;
  ptId: Types.ObjectId;
  dayOfWeek: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    videoLink?: string;
  }>;
  isCompleted: boolean;
  feedback?: string;
  completionImage?: string;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ptId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dayOfWeek: { type: Number, required: true },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    videoLink: String
  }],
  isCompleted: { type: Boolean, default: false },
  feedback: String,
  completionImage: String
}, { timestamps: true });

export const TrainingPlan = model<IPlan>('TrainingPlan', PlanSchema);