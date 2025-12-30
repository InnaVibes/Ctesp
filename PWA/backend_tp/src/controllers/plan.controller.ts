import { Response } from 'express';
import { TrainingPlan } from '../models/TrainingPlan';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, dayOfWeek, exercises } = req.body;

    if (!req.user || req.user.role !== 'PT') {
      return res.status(403).json({ message: 'Apenas PTs podem criar planos' });
    }

    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    if (client.ptId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Este cliente não pertence a você' });
    }

    const newPlan = new TrainingPlan({
      ptId: req.user._id,
      clientId,
      dayOfWeek,
      exercises,
      completions: []
    });

    await newPlan.save();
    await newPlan.populate('clientId', 'username email');

    res.status(201).json(newPlan);
  } catch (err) {
    console.error('Erro ao criar plano:', err);
    res.status(500).json({ error: 'Erro ao criar plano de treino' });
  }
};

export const getPlans = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    let plans;

    if (req.user.role === 'PT') {
      const { clientId } = req.query;
      
      if (clientId) {
        plans = await TrainingPlan.find({ ptId: req.user._id, clientId }).populate('clientId', 'username email');
      } else {
        plans = await TrainingPlan.find({ ptId: req.user._id }).populate('clientId', 'username email');
      }
    } else if (req.user.role === 'CLIENT') {
      plans = await TrainingPlan.find({ clientId: req.user._id }).populate('ptId', 'username email');
    } else {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(plans);
  } catch (err) {
    console.error('Erro ao buscar planos:', err);
    res.status(500).json({ error: 'Erro ao buscar planos' });
  }
};

export const completeWorkout = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    console.log('=== COMPLETAR TREINO - DEBUG ===');
    console.log('Plan ID:', id);
    console.log('Feedback recebido:', feedback);
    console.log('File recebido:', req.file);

    if (!req.user || req.user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Apenas clientes podem completar treinos' });
    }

    const plan = await TrainingPlan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: 'Plano não encontrado' });
    }

    if (plan.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Este plano não pertence a você' });
    }

    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const planDayOfWeek = plan.dayOfWeek;

    const daysUntilPlanDay = (planDayOfWeek - currentDayOfWeek + 7) % 7;
    const planDayThisWeek = new Date(now);
    planDayThisWeek.setDate(now.getDate() - currentDayOfWeek + planDayOfWeek);
    planDayThisWeek.setHours(0, 0, 0, 0);

    let targetWeekStart: Date;
    if (now < planDayThisWeek) {
      targetWeekStart = new Date(planDayThisWeek);
      targetWeekStart.setDate(planDayThisWeek.getDate() - 7);
    } else {
      targetWeekStart = planDayThisWeek;
    }

    const nextPlanDay = new Date(targetWeekStart);
    nextPlanDay.setDate(targetWeekStart.getDate() + 7);

    if (currentDayOfWeek === planDayOfWeek && now >= nextPlanDay) {
      return res.status(400).json({ 
        message: `Este treino expirou. O prazo era até ${nextPlanDay.toLocaleDateString('pt-PT')}. O treino foi marcado como não concretizado.`,
        expired: true
      });
    }

    const completionWindowStart = new Date(targetWeekStart);
    completionWindowStart.setHours(0, 0, 0, 0);
    
    const completionWindowEnd = new Date(nextPlanDay);
    completionWindowEnd.setHours(23, 59, 59, 999);

    const alreadyCompletedInWindow = plan.completions.some(c => {
      const completionDate = new Date(c.date);
      return completionDate >= completionWindowStart && completionDate <= completionWindowEnd;
    });

    if (alreadyCompletedInWindow) {
      return res.status(400).json({ 
        message: 'Este treino já foi completado nesta semana' 
      });
    }

    let status: 'completed' | 'late' | 'failed';
    
    if (currentDayOfWeek === planDayOfWeek) {
      status = 'completed';
    } else {
      status = 'late';
    }

    let proofImageUrl = undefined;
    if (req.file) {
      proofImageUrl = `/uploads/${req.file.filename}`;
      console.log('Imagem salva em:', proofImageUrl);
    }

    const completionData = {
      date: now,
      status,
      feedback: feedback || undefined,
      proofImage: proofImageUrl,
    };

    console.log('Dados do completion a guardar:', completionData);

    plan.completions.push(completionData);
    await plan.save();

    console.log('Treino guardado com sucesso!');
    console.log('Total de completions:', plan.completions.length);

    res.json({ 
      plan,
      status,
      message: status === 'completed' 
        ? 'Treino concluído com sucesso!' 
        : 'Treino concluído com atraso. Tente completar no dia correto da próxima vez.'
    });
  } catch (err) {
    console.error('Erro ao completar treino:', err);
    res.status(500).json({ error: 'Erro ao completar treino' });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    // Início da semana atual (Domingo às 00:00)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekData = [
      { name: 'Dom', concluidos: 0, atrasados: 0, falhados: 0 },
      { name: 'Seg', concluidos: 0, atrasados: 0, falhados: 0 },
      { name: 'Ter', concluidos: 0, atrasados: 0, falhados: 0 },
      { name: 'Qua', concluidos: 0, atrasados: 0, falhados: 0 },
      { name: 'Qui', concluidos: 0, atrasados: 0, falhados: 0 },
      { name: 'Sex', concluidos: 0, atrasados: 0, falhados: 0 },
      { name: 'Sáb', concluidos: 0, atrasados: 0, falhados: 0 },
    ];

    if (req.user.role === 'CLIENT') {
      const plans = await TrainingPlan.find({ clientId: req.user._id });
      
      let completedThisWeek = 0;
      let lateThisWeek = 0;
      let failedThisWeek = 0;

      plans.forEach((plan) => {
        plan.completions.forEach((completion) => {
          const completionDate = new Date(completion.date);
          
          // Verificar se está na semana atual
          if (completionDate >= startOfWeek) {
            if (completion.status === 'completed') {
              completedThisWeek++;
            } else if (completion.status === 'late') {
              lateThisWeek++;
            } else if (completion.status === 'failed') {
              failedThisWeek++;
            }

            // Adicionar ao dia correspondente no gráfico
            const dayOfWeek = completionDate.getDay();
            if (completion.status === 'completed') {
              weekData[dayOfWeek].concluidos++;
            } else if (completion.status === 'late') {
              weekData[dayOfWeek].atrasados++;
            } else if (completion.status === 'failed') {
              weekData[dayOfWeek].falhados++;
            }
          }
        });
      });

      const stats = {
        totalPlans: plans.length,
        completedThisWeek,
        lateThisWeek,
        failedThisWeek,
        weekData,
      };

      res.json(stats);
    } else if (req.user.role === 'PT') {
      const plans = await TrainingPlan.find({ ptId: req.user._id });
      const clients = await User.countDocuments({ ptId: req.user._id });
      
      let completedThisWeek = 0;
      let lateThisWeek = 0;
      let failedThisWeek = 0;

      plans.forEach((plan) => {
        plan.completions.forEach((completion) => {
          const completionDate = new Date(completion.date);
          
          if (completionDate >= startOfWeek) {
            if (completion.status === 'completed') {
              completedThisWeek++;
            } else if (completion.status === 'late') {
              lateThisWeek++;
            } else if (completion.status === 'failed') {
              failedThisWeek++;
            }

            const dayOfWeek = completionDate.getDay();
            if (completion.status === 'completed') {
              weekData[dayOfWeek].concluidos++;
            } else if (completion.status === 'late') {
              weekData[dayOfWeek].atrasados++;
            } else if (completion.status === 'failed') {
              weekData[dayOfWeek].falhados++;
            }
          }
        });
      });

      const stats = {
        totalClients: clients,
        totalPlans: plans.length,
        completedThisWeek,
        lateThisWeek,
        failedThisWeek,
        weekData,
      };

      res.json(stats);
    } else {
      return res.status(403).json({ message: 'Acesso negado' });
    }
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

// Marcar treinos expirados como falhados
// Marcar treinos expirados como não concretizados
export const checkExpiredPlans = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0=Domingo, 1=Segunda, etc.

    // Buscar todos os planos do cliente
    const plans = await TrainingPlan.find({ clientId: req.user._id });

    let expiredCount = 0;

    for (const plan of plans) {
      const planDayOfWeek = plan.dayOfWeek;

      // Só verificar se hoje é o dia do plano (para marcar o treino da semana passada como falhado)
      if (currentDayOfWeek !== planDayOfWeek) {
        continue; // Pular este plano, ainda não é dia de verificar
      }

      // Calcular a data do dia do plano na semana passada
      const lastWeekPlanDay = new Date(now);
      lastWeekPlanDay.setDate(now.getDate() - 7);
      lastWeekPlanDay.setHours(0, 0, 0, 0);

      // Calcular a janela de completamento da semana passada
      const windowStart = new Date(lastWeekPlanDay);
      windowStart.setHours(0, 0, 0, 0);

      const windowEnd = new Date(now);
      windowEnd.setHours(0, 0, 0, 0); // Até o início de hoje (não incluindo hoje)

      // Verificar se há completamento naquela janela
      const completedInWindow = plan.completions.some(c => {
        const completionDate = new Date(c.date);
        return completionDate >= windowStart && completionDate < windowEnd;
      });

      // Se não foi completado e o plano já existia naquela semana
      if (!completedInWindow && plan.createdAt < windowEnd) {
        // Verificar se já não foi marcado como falhado para aquela semana
        const alreadyMarkedAsFailed = plan.completions.some(c => {
          const completionDate = new Date(c.date);
          return completionDate >= windowStart && 
                 completionDate < windowEnd && 
                 c.status === 'failed';
        });

        if (!alreadyMarkedAsFailed) {
          // Marcar como não concretizado (falhado)
          const failedDate = new Date(windowEnd);
          failedDate.setSeconds(failedDate.getSeconds() - 1); // 1 segundo antes de hoje começar

          plan.completions.push({
            date: failedDate,
            status: 'failed',
            feedback: 'Treino não realizado no prazo',
          });

          await plan.save();
          expiredCount++;
        }
      }
    }

    res.json({ 
      message: expiredCount > 0 
        ? `${expiredCount} treino(s) marcado(s) como não concretizado(s)` 
        : 'Nenhum treino expirado',
      expiredCount 
    });
  } catch (err) {
    console.error('Erro ao verificar treinos expirados:', err);
    res.status(500).json({ error: 'Erro ao verificar treinos expirados' });
  }
};

// PT: Ver treinos recentemente concluídos pelos seus clientes
export const getRecentCompletions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'PT') {
      return res.status(403).json({ message: 'Apenas PTs podem ver completamentos' });
    }

    const limit = parseInt(req.query.limit as string) || 10;

    const plans = await TrainingPlan.find({ ptId: req.user._id })
      .populate('clientId', 'username email profileImage')
      .sort({ updatedAt: -1 });

    const allCompletions: any[] = [];

    plans.forEach((plan: any) => {
      if (plan.completions && plan.completions.length > 0) {
        plan.completions.forEach((completion: any) => {
          allCompletions.push({
            _id: completion._id,
            planId: plan._id,
            planName: `${plan.dayOfWeek} - ${plan.exercises.length} exercícios`,
            client: plan.clientId,
            date: completion.date,
            status: completion.status,
            feedback: completion.feedback,
            proofImage: completion.proofImage,
            exercises: plan.exercises,
          });
        });
      }
    });

    allCompletions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const recentCompletions = allCompletions.slice(0, limit);

    res.json(recentCompletions);
  } catch (err) {
    console.error('Erro ao buscar completamentos:', err);
    res.status(500).json({ error: 'Erro ao buscar completamentos' });
  }
};

// PT: Ver histórico completo de um cliente específico
export const getClientHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'PT') {
      return res.status(403).json({ message: 'Apenas PTs podem ver histórico' });
    }

    const { clientId } = req.params;

    const client = await User.findById(clientId);
    if (!client || client.ptId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Este cliente não pertence a você' });
    }

    const plans = await TrainingPlan.find({ 
      ptId: req.user._id, 
      clientId 
    })
      .populate('clientId', 'username email profileImage')
      .sort({ createdAt: -1 });

    const history: any[] = [];

    plans.forEach((plan: any) => {
      if (plan.completions && plan.completions.length > 0) {
        plan.completions.forEach((completion: any) => {
          history.push({
            _id: completion._id,
            planId: plan._id,
            planName: `${plan.dayOfWeek} - ${plan.exercises.length} exercícios`,
            dayOfWeek: plan.dayOfWeek,
            date: completion.date,
            status: completion.status,
            feedback: completion.feedback,
            proofImage: completion.proofImage,
            exercises: plan.exercises,
          });
        });
      }
    });

    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const stats = {
      totalCompletions: history.length,
      completed: history.filter(h => h.status === 'completed').length,
      failed: history.filter(h => h.status === 'failed').length,
      withFeedback: history.filter(h => h.feedback).length,
      withProof: history.filter(h => h.proofImage).length,
    };

    res.json({
      client: {
        _id: client._id,
        username: client.username,
        email: client.email,
        profileImage: client.profileImage,
      },
      stats,
      history,
    });
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
};