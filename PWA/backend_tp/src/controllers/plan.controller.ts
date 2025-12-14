import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TrainingPlan } from '../models/TrainingPlan';
import formidable from 'formidable';
import { io } from '../server';

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const plan = new TrainingPlan({ ...req.body, ptId: req.user._id });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPlans = async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
    
    let filter: any = {};
    if (req.user.role === 'CLIENT') filter = { clientId: req.user._id };
    if (req.user.role === 'PT') filter = { ptId: req.user._id };

    try {
        const plans = await TrainingPlan.find(filter)
            .sort(sort as string)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        res.json(plans);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const completeWorkout = (req: AuthRequest, res: Response) => {
    const form = formidable({ multiples: false, uploadDir: './uploads', keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json(err);
        
        if (fields.status === 'failed') {
             // io.to(ptId).emit('notification', 'Client failed workout');
             console.log("Sending Socket Toast to PT...");
        }
        res.json({ message: "Workout registered", fields, files });
    });
};