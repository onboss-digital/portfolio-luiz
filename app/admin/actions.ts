"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// ==========================================
// 🔴 AÇÕES DE PROJETOS (WEB E VÍDEO)
// ==========================================

export async function createProjectAction(data: any) {
  try {
    await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type, // "Web" | "Video"
        category: data.category,
        mediaUrl: data.mediaUrl,
        thumbnail: data.thumbnail,
        tags: data.tags,
        isFeatured: data.isFeatured || false,
        order: Number(data.order) || 0,
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro ao criar projeto." };
  }
}

export async function updateProjectAction(id: string, data: any) {
  try {
    await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        mediaUrl: data.mediaUrl,
        thumbnail: data.thumbnail,
        tags: data.tags,
        isFeatured: data.isFeatured || false,
        order: Number(data.order) || 0,
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: "Erro ao atualizar projeto." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao excluir projeto." };
  }
}

// ==========================================
// 🔴 AÇÕES DE DEPOIMENTOS
// ==========================================

export async function createTestimonialAction(data: any) {
  try {
    await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        text: data.text,
        avatarUrl: data.avatarUrl,
        stars: Number(data.stars) || 5,
        isActive: data.isActive ?? true,
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro ao criar depoimento." };
  }
}

export async function updateTestimonialAction(id: string, data: any) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        text: data.text,
        avatarUrl: data.avatarUrl,
        stars: Number(data.stars) || 5,
        isActive: data.isActive ?? true,
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: "Erro ao atualizar depoimento." };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao excluir depoimento." };
  }
}

// ==========================================
// 🔴 AÇÕES DE PIXELS AVANÇADOS
// ==========================================

export async function createPixelAction(data: any) {
  try {
    await prisma.pixel.create({
      data: {
        title: data.title,
        provider: data.provider,
        pixelId: data.pixelId,
        status: data.status ?? true,
        events: data.events,
        targetType: data.targetType || "all",
        targetUrls: data.targetUrls || null,
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro ao criar pixel." };
  }
}

export async function updatePixelAction(id: string, data: any) {
  try {
    await prisma.pixel.update({
      where: { id },
      data: {
        title: data.title,
        provider: data.provider,
        pixelId: data.pixelId,
        status: data.status,
        events: data.events,
        targetType: data.targetType,
        targetUrls: data.targetUrls,
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: "Erro ao atualizar pixel." };
  }
}

export async function deletePixelAction(id: string) {
  try {
    await prisma.pixel.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao excluir pixel." };
  }
}

// ==========================================
// 🔴 AÇÕES DE SITE SETTINGS (GLOBAL)
// ==========================================

export async function updateSettingsAction(data: any) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        heroGreeting: data.heroGreeting,
        heroName: data.heroName,
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        heroStack: data.heroStack,
        heroButtonText: data.heroButtonText,
        whatsappNumber: data.whatsappNumber,
        whatsappMessage: data.whatsappMessage,
        emailContact: data.emailContact,
        logoText: data.logoText,
        footerText: data.footerText,
        footerBottomText: data.footerBottomText,
        gtmId: data.gtmId,
        clarityId: data.clarityId,
      },
      create: {
        id: "global",
        heroGreeting: data.heroGreeting || "Olá, me chamo",
        heroName: data.heroName || "Luiz Boss",
        heroTitle: data.heroTitle || "Desenvolvedor Full-stack e especialista em produtos digitais premium.",
        heroDescription: data.heroDescription || "Vou ajudar seus projetos como se fosse pra mim...",
        heroStack: data.heroStack || "SaaS, IA, Supabase, Stripe, NextJS",
        heroButtonText: data.heroButtonText || "Entrar em Contato",
        whatsappNumber: data.whatsappNumber || "5511999999999",
        whatsappMessage: data.whatsappMessage || "Olá Luiz, vi seu portfólio!",
        emailContact: data.emailContact || "contato@luizboss.com",
        logoText: data.logoText || "Portfolio",
        footerText: data.footerText || "Transformando Ideias em Realidade Digital",
        footerBottomText: data.footerBottomText || "Luiz Boss © 2026. Todos os Direitos Reservados.",
        gtmId: data.gtmId || "G-HZVL420SMM",
        clarityId: data.clarityId || "sih2jshyh8",
      }
    });
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao salvar configurações globais." };
  }
}

// 🔴 AÇÃO PARA TROCAR EMAIL E SENHA DO ADMIN (IDENTIDADE)
export async function updateAdminIdentityAction(data: any) {
  try {
    const { newEmail, currentPassword, newPassword } = data;

    const admin = await prisma.admin.findFirst();
    if (!admin) return { error: "Admin não encontrado no sistema." };

    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) return { error: "A senha atual está incorreta. Operação negada." };

    const updateData: any = {};
    if (newEmail && newEmail !== admin.email) {
      const existing = await prisma.admin.findUnique({ where: { email: newEmail } });
      if (existing) return { error: "Este e-mail já está em uso por outro administrador." };
      updateData.email = newEmail;
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return { error: "Nenhuma alteração detectada para salvar." };
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: updateData
    });

    const cookieStore = cookies();
    cookieStore.delete("luiz_admin_session");

    return { success: true, message: "Identidade atualizada! Faça login novamente com suas novas credenciais." };
  } catch (error) {
    console.error("Erro ao atualizar identidade admin:", error);
    return { error: "Erro interno ao processar troca de identidade." };
  }
}

// ==========================================
// AÇÕES DE DEPOIMENTOS
// ==========================================

export async function approveTestimonialAction(id: string) {
  try {
    await prisma.testimonial.update({ where: { id }, data: { isActive: true } });
    revalidatePath("/");
    revalidatePath("/avaliacoes");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro ao aprovar depoimento." };
  }
}

export async function rejectTestimonialAction(id: string) {
  try {
    await prisma.testimonial.update({ where: { id }, data: { isActive: false } });
    revalidatePath("/");
    revalidatePath("/avaliacoes");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erro ao rejeitar depoimento." };
  }
}

