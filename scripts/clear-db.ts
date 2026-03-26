import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando o banco de dados conforme solicitado...");

  await prisma.project.deleteMany({});
  console.log("✅ Todos os projetos foram removidos.");

  await prisma.testimonial.deleteMany({});
  console.log("✅ Todos os depoimentos foram removidos.");

  // For SiteSettings, we usually want to keep the "global" ID but reset with default values
  await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {
      heroTitle: "Olá, me chamo",
      heroName: "Luiz Boss",
      heroDescription: "Desenvolvedor Full-stack e especialista em produtos digitais premium.",
      heroImageUrl: null,
      heroButtonText: "Entrar em Contato",
      whatsappNumber: "5511999999999",
      emailContact: "contato@luizboss.com",
    },
    create: {
      id: "global",
      heroTitle: "Olá, me chamo",
      heroName: "Luiz Boss",
      heroDescription: "Desenvolvedor Full-stack e especialista em produtos digitais premium.",
      heroImageUrl: null,
      heroButtonText: "Entrar em Contato",
      whatsappNumber: "5511999999999",
      emailContact: "contato@luizboss.com",
    }
  });
  console.log("✅ Configurações resetadas para o padrão.");

  console.log("✨ Banco de dados limpo e pronto para novos conteúdos!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao limpar o banco:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
