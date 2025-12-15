import { Schema, model, Document, Types } from 'mongoose';

export interface IPlan extends Document {
  // Alterámos de 'string' para 'Types.ObjectId' para coincidir com o Schema
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
}

const PlanSchema = new Schema<IPlan>({
  // Agora o TypeScript já aceita que isto seja um ObjectId
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