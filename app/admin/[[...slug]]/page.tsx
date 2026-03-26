import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  params: { slug?: string[] };
}

export default async function AdminCatchAllPage({ params }: AdminPageProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("luiz_admin_session");
  
  if (!token) {
    redirect("/admin/login");
  }

  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' }
  });
  
  const pixels = await prisma.pixel.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" }
  });

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const adminUser = await prisma.admin.findFirst();

  const initialSlug = params.slug?.[0] || 'dashboard';

  return (
    <div className="bg-[#050505] text-white">
      <DashboardClient 
        projects={projects} 
        pixels={pixels} 
        settings={settings} 
        testimonials={testimonials}
        initialTab={initialSlug} 
        adminUser={adminUser}
      />
    </div>
  );
}
