import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: {
      tenantCode: 'GLV-001',
    },
    update: {
      name: 'Glowa Vee Boutique',
      slug: 'glowavee',
    },
    create: {
      tenantCode: 'GLV-001',
      name: 'Glowa Vee Boutique',
      slug: 'glowavee',
    },
  });

  console.log(`Tenant ready: ${tenant.name} (${tenant.tenantCode})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });