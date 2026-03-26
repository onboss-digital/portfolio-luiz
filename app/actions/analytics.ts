"use server";

import prisma from "@/lib/prisma";

export async function trackSessionAction(
  visitorId: string, 
  utms: { source: string | null; medium: string | null; campaign: string | null },
  device: string,
  browser: string,
  path: string
) {
  try {
    // 1. Verificar se já existe uma sessão aberta hoje para este visitante
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let session = await prisma.analyticSession.findFirst({
      where: {
        visitorId,
        createdAt: { gte: today }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!session) {
      session = await prisma.analyticSession.create({
        data: {
          visitorId,
          utmSource: utms.source,
          utmMedium: utms.medium,
          utmCampaign: utms.campaign,
          device,
          browser,
        }
      });
    }

    // 2. Sempre registrar um evento de PageView para esta sessão
    await prisma.analyticEvent.create({
      data: {
        sessionId: session.id,
        type: "page_view",
        path,
      }
    });

    // 3. Atualizar isBounce (se tiver mais de 1 evento agora, não é bounce)
    const eventsCount = await prisma.analyticEvent.count({
      where: { sessionId: session.id }
    });

    if (eventsCount > 1 && session.isBounce) {
      await prisma.analyticSession.update({
        where: { id: session.id },
        data: { isBounce: false }
      });
    }

    return session.id;
  } catch (err) {
    console.error("Erro no trackSessionAction:", err);
    throw err;
  }
}

export async function trackEventAction(sessionId: string, type: string, path: string) {
  try {
    await prisma.analyticEvent.create({
      data: { sessionId, type, path }
    });

    // Se é conversão (WhatsApp), deixa de ser Bounce
    if (type === "whatsapp_click") {
      await prisma.analyticSession.update({
        where: { id: sessionId },
        data: { isBounce: false }
      });
    }
  } catch (err) {
    console.error("Erro no trackEventAction:", err);
  }
}

export async function updateDurationAction(sessionId: string, additionalSeconds: number) {
  try {
    await prisma.analyticSession.update({
      where: { id: sessionId },
      data: {
        duration: { increment: additionalSeconds }
      }
    });
  } catch (err) {
    console.error("Erro no updateDurationAction:", err);
  }
}
