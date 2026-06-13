const capitec = require('./capitec');

module.exports = {
  capitec,
  generic: {
    parseWebhook(body) {
      if (!body) return null;
      return {
        tenantId: body.tenantId || body.accountId,
        customerName: body.customerName || body.payerName || 'Unknown',
        amount: Number(body.amount || body.value || 0),
        reference: body.reference || body.transactionId || `bank-${Date.now()}`,
        matched: false,
      };
    },
  },
};
