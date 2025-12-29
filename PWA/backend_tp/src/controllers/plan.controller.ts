import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TrainingPlan } from '../models/TrainingPlan';
import { User } from '../models/User';
import formidable from 'formidable';
import { io } from '../server';
import { Types } from 'mongoose';

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.body;
    const ptId = req.user._id; 

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    // Verificar se o cliente já tem PT. Se tiver, deve ser o mesmo que está a criar o plano.
    if (client.ptId) {
      if (client.ptId.toString() !== ptId.toString()) {
        return res.status(403).json({ 
          message: "Este cliente já está associado a outro Personal Trainer. A alteração requer autorização do Admin." 
        });
      }
    } else {
      // Associação automática na primeira atribuição de plano
      client.ptId = ptId;
      await client.save();
    }

    // Validação: Limite de 10 exercícios por sessão
    if (req.body.exercises && req.body.exercises.length > 10) {
        return res.status(400).json({ message: "O limite é de 10 exercícios por sessão." });
    }

    const plan = new TrainingPlan({ 
        ...req.body, 
        ptId: ptId 
    });
    
    await plan.save();
    res.status(201).json(plan);

  } catch (err) {
    console.error("Erro ao criar plano:", err);
    res.status(500).json({ error: "Erro interno ao criar plano de treino." });
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
      
      const { id } = req.params; 
      const rawStatus = fields.status;
      const statusValue = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
      
      try {
          const isCompleted = statusValue === 'completed';
          
          // Tratamento da imagem de prova
          const completionImage = files.image 
          ? (Array.isArray(files.image) ? files.image[0].filepath : (files.image as any).filepath) 
          : undefined;
          
          const feedback = Array.isArray(fields.feedback) ? fields.feedback[0] : fields.feedback;

          const updatedPlan = await TrainingPlan.findByIdAndUpdate(
              id, 
              { 
                  isCompleted: isCompleted,
                  completionImage: completionImage,
                  feedback: feedback
              }, 
              { new: true } 
          );

          if (!updatedPlan) {
              return res.status(404).json({ message: "Plano não encontrado" });
          }

          // Notificar PT se o treino falhou ou foi concluído
          if (statusValue === 'failed' || !isCompleted) {
                io.to(updatedPlan.ptId.toString()).emit('toast', {
                    type: 'warning',
                    message: `O cliente ${req.user.username} falhou o treino.`,
                });
          }

          res.json({ message: "Estado do treino atualizado com sucesso", plan: updatedPlan });

      } catch (dbError) {
          console.error(dbError);
          res.status(500).json({ error: "Erro ao atualizar a base de dados" });
      }
  });
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    let targetClientId: string = req.user._id;

    // Se for PT, usa o ID do cliente passado no parâmetro
    if (req.user.role === 'PT') {
      const { clientId } = req.query;
      if (!clientId || typeof clientId !== 'string') {
        return res.status(400).json({ message: "PT deve fornecer o clientId na query string" });
      }
      targetClientId = clientId;
    }

    const stats = await TrainingPlan.aggregate([
      {
        $match: {
          clientId: new Types.ObjectId(targetClientId),
          isCompleted: true
        }
      },
      {
        // Agrupar por Ano e Mês
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" }
          },
          count: { $sum: 1 } 
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },
      {
        // Formatar para o gráfico
        $project: {
          _id: 0,
          date: { 
            $concat: [
              { $toString: "$_id.year" }, 
              "-", 
              { $toString: "$_id.month" }
            ] 
          },
          totalCompleted: "$count"
        }
      }
    ]);
   
    res.json(stats);

  } catch (err) {
    console.error("Erro ao gerar estatísticas:", err);
    res.status(500).json(err);
  }
};