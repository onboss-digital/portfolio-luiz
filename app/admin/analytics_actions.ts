"use server";

import prisma from "@/lib/prisma";
import { startOfDay, subDays, startOfMonth, startOfYear, endOfDay } from "date-fns";

export async function getDashboardMetricsAction(period: string, customRange?: { from: Date; to: Date }) {
  try {
    let startDate = startOfDay(new Date());
    let endDate = endOfDay(new Date());

    if (period === "7d") {
      startDate = startOfDay(subDays(new Date(), 7));
    } else if (period === "30d") {
      startDate = startOfDay(subDays(new Date(), 30));
    } else if (period === "custom" && customRange) {
      startDate = startOfDay(customRange.from);
      endDate = endOfDay(customRange.to);
    } else if (period === "all") {
      startDate = startOfDay(subDays(new Date(), 730)); // 2 anos
    } else if (period === "today") {
      // Default: já está hoje
    }

    // 1. Total de Visitas (Sessões)
    const totalVisits = await prisma.analyticSession.count({
      where: { createdAt: { gte: startDate, lte: endDate } }
    });

    // 2. Cliques no WhatsApp (Conversões)
    const whatsappClicks = await prisma.analyticEvent.count({
      where: { 
        type: "whatsapp_click",
        createdAt: { gte: startDate, lte: endDate }
      }
    });

    // 3. Tempo Médio de Permanência
    const avgDurationResult = await prisma.analyticSession.aggregate({
      where: { createdAt: { gte: startDate, lte: endDate } },
      _avg: { duration: true }
    });
    const avgDuration = Math.round(avgDurationResult._avg.duration || 0);

    // 4. Taxa de Rejeição (Bounce Rate)
    const bounceCount = await prisma.analyticSession.count({
      where: { 
        createdAt: { gte: startDate, lte: endDate },
        isBounce: true
      }
    });
    const bounceRate = totalVisits > 0 ? Math.round((bounceCount / totalVisits) * 100) : 0;

    // 5. Taxa de Conversão
    const conversionRate = totalVisits > 0 ? ((whatsappClicks / totalVisits) * 100).toFixed(1) : "0";

    // 6. Fontes de Tráfego (UTMs)
    const sourcesRaw = await prisma.analyticSession.groupBy({
      by: ['utmSource'],
      where: { createdAt: { gte: startDate, lte: endDate } },
      _count: { _all: true },
      orderBy: { _count: { utmSource: 'desc' } }
    });

    const trafficSources = sourcesRaw.map(s => ({
      name: s.utmSource || "Direto / Orgânico",
      value: s._count._all
    }));

    // 7. Dados p/ Gráfico de Barras (Visitas diárias)
    // Para simplificar, vamos pegar os últimos X dias dependendo do período
    const daysToReview = period === "7d" ? 7 : period === "30d" ? 30 : 1;
    const chartData = [];
    
    for (let i = daysToReview; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const start = startOfDay(d);
        const end = endOfDay(d);
        
        const count = await prisma.analyticSession.count({
            where: { createdAt: { gte: start, lte: end } }
        });
        
        const conv = await prisma.analyticEvent.count({
            where: { 
                type: "whatsapp_click",
                createdAt: { gte: start, lte: end }
            }
        });

        chartData.push({
            name: start.toLocaleDateString('pt-BR', { weekday: 'short' }),
            date: start.toLocaleDateString('pt-BR'),
            visitas: count,
            conversoes: conv
        });
    }

    return {
      totalVisits,
      whatsappClicks,
      avgDuration,
      bounceRate,
      conversionRate,
      trafficSources,
      chartData
    };
  } catch (err) {
    console.error("Erro ao buscar métricas:", err);
    throw err;
  }
}

export async function getLiveUsersAction() {
  try {
    // Consideramos "online" quem teve atividade nos últimos 5 minutos
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const count = await prisma.analyticSession.count({
      where: {
        updatedAt: { gte: fiveMinutesAgo }
      }
    });

    return count;
  } catch (err) {
    console.error("Erro ao buscar usuários online:", err);
    return 0;
  }
}
