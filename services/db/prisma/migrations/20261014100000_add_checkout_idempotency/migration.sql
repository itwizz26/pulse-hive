-- Add checkout idempotency to prevent duplicate orders on retries.
ALTER TABLE "Order"
ADD COLUMN "idempotencyKey" TEXT;

CREATE UNIQUE INDEX "Order_tenantId_idempotencyKey_key"
ON "Order" ("tenantId", "idempotencyKey");

-- Store the Ozow payment request details for retry and reconciliation.
ALTER TABLE "Payment"
ADD COLUMN "paymentRequestId" TEXT,
ADD COLUMN "gatewayUrl" TEXT;

-- Prevent duplicate non-null transaction references per tenant and provider.
CREATE UNIQUE INDEX "Payment_tenantId_provider_transactionReference_key"
ON "Payment" ("tenantId", "provider", "transactionReference");
