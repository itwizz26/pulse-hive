-- CreateIndex
CREATE INDEX "Order_tenantId_status_idx" ON "Order"("tenantId", "status");

-- CreateIndex
CREATE INDEX "Order_tenantId_date_idx" ON "Order"("tenantId", "date");

-- CreateIndex
CREATE INDEX "Payment_tenantId_matched_idx" ON "Payment"("tenantId", "matched");

-- CreateIndex
CREATE INDEX "Payment_tenantId_createdAt_idx" ON "Payment"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_tenantId_orderId_idx" ON "Payment"("tenantId", "orderId");
