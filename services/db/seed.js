const prisma = require('./prismaClient');

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo-tenant' },
    update: { name: 'Demo Tenant' },
    create: { id: 'demo-tenant', name: 'Demo Tenant' },
  });

  await prisma.order.upsert({
    where: { id: 'demo-order-1' },
    update: {
      totalAmount: 120.5,
      status: 'Pending Payment',
      customerName: 'Mbali Ndlovu',
    },
    create: {
      id: 'demo-order-1',
      tenantId: tenant.id,
      reference: 'BRIGHT-1001',
      customerName: 'Mbali Ndlovu',
      phone: '0712345678',
      address: '23 Main Street, Soweto',
      quantity: 5,
      totalAmount: 120.5,
      status: 'Pending Payment',
    },
  });

  await prisma.order.upsert({
    where: { id: 'demo-order-2' },
    update: {
      totalAmount: 260.0,
      status: 'Ready to Ship',
      customerName: 'Sizwe Khumalo',
    },
    create: {
      id: 'demo-order-2',
      tenantId: tenant.id,
      reference: 'BRIGHT-1002',
      customerName: 'Sizwe Khumalo',
      phone: '0723456789',
      address: '45 Market Road, Durban',
      quantity: 10,
      totalAmount: 260.0,
      status: 'Ready to Ship',
    },
  });

  await prisma.payment.upsert({
    where: { id: 'demo-payment-1' },
    update: {
      amount: 120.5,
      matched: false,
      orderId: 'demo-order-1',
      reference: 'PAY-1001',
    },
    create: {
      id: 'demo-payment-1',
      tenantId: tenant.id,
      customerName: 'Mbali Ndlovu',
      amount: 120.5,
      orderId: 'demo-order-1',
      reference: 'PAY-1001',
      matched: false,
    },
  });

  await prisma.payment.upsert({
    where: { id: 'demo-payment-2' },
    update: {
      amount: 260.0,
      matched: true,
      orderId: 'demo-order-2',
      reference: 'PAY-1002',
    },
    create: {
      id: 'demo-payment-2',
      tenantId: tenant.id,
      customerName: 'Sizwe Khumalo',
      amount: 260.0,
      orderId: 'demo-order-2',
      reference: 'PAY-1002',
      matched: true,
    },
  });

  console.log('Shared DB seed complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
  process.exit(0);
});
