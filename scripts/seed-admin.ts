import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'onbossdigital@gmail.com';
  const password = 'Meta10k@@';

  console.log("🚀 Iniciando o povoamento do banco de dados (Seed) para Luíz Boss...");

  // 1. Garantir que o registro GLOBAL de configurações exista
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {}, 
    create: {
      id: "global",
      heroTitle: "Olá, é um prazer todos me chamam de",
      heroName: "Luiz Boss",
      heroDescription: "Vou ajudar seus projetos como se fosse pra mim, acredite toco alguns negócios e sei como é confiar em alguém que vai mostrar o que é pra ser feito. • Se você procura Agilidade e Qualidade sou a pessoa certa.",
      heroButtonText: "Entrar em Contato",
      whatsappNumber: "5511999999999",
      whatsappMessage: "Olá Luiz, vi seu portfólio e gostaria de saber mais sobre seu trabalho!",
      emailContact: "contato@luizboss.com",
      logoText: "Portfolio",
      footerText: "Transformando Ideias em Realidade Digital",
      footerBottomText: "Luiz Boss © 2026. Todos os Direitos Reservados.",
      gtmId: "G-HZVL420SMM",
      clarityId: "sih2jshyh8",
    }
  });
  console.log("✅ Registro GLOBAL de configurações criado/validado.");

  // 2. Garantir que o administrador exista
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
    },
  });
  console.log(`✅ Administrador [${email}] criado/atualizado com sucesso.`);

  // 3. Povoar projetos iniciais baseados no index.html
  const projects = [
    {
      title: "Site institucional Green foods",
      description: "Página de apresentação no segmento de hortfruit.",
      type: "Web",
      mediaUrl: "https://greenfoods.com.br",
      thumbnail: "https://i.postimg.cc/k5hk54Vd/Screenshot-1.jpg",
      tags: "Wordpress, Elementor, JavaScript",
      isFeatured: true,
      order: 1
    },
    {
      title: "Site institucional de plataforma de freelancers Lumpic",
      description: "Página de apresentação para plataforma de frelancers de áudio visual.",
      type: "Web",
      mediaUrl: "https://lumpic.netlify.app/freelancer",
      thumbnail: "https://i.postimg.cc/dVTht7N8/Screenshot-2.jpg",
      tags: "React, TailwindCSS, Node.JS",
      isFeatured: true,
      order: 2
    },
    {
      title: "Landing page de suplemento",
      description: "Landing page de vendas para adoçante natural Zero açúcar.",
      type: "Web",
      mediaUrl: "https://www.zerandoacucar.com.br",
      thumbnail: "https://i.postimg.cc/XJxhPkF3/Screenshot-3.jpg",
      tags: "Wordpress, Elementor, JavaScript",
      isFeatured: true,
      order: 3
    },
    {
      title: "Trend Marketing",
      description: "Reel viral para engajamento",
      type: "Video",
      category: "Reels",
      mediaUrl: "https://www.youtube.com/embed/niEaeoT7aMY",
      isFeatured: true,
      order: 4
    }
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log("✅ Projetos iniciais povoados.");

  console.log("✨ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
