module.exports = {
  parseWebhook(body) {
    if (!body) return null;

    // Example Capitec webhook payload mapping.
    // Replace these fields with the actual bank payload structure when available.
    return {
      tenantId: body.tenantId || body.merchantId || 'demo-tenant',
      customerName: body.customerName || body.payerName || 'Capitec Customer',
      amount: Number(body.amount || body.value || 0),
      reference: body.reference || body.transactionId || `capitec-${Date.now()}`,
      matched: false,
    };
  },
};
