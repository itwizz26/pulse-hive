-- Add tenantCode as nullable first so existing tenants can be migrated safely.
ALTER TABLE "Tenant"
ADD COLUMN "tenantCode" TEXT;

-- Assign a valid permanent code to the existing test tenant.
UPDATE "Tenant"
SET "tenantCode" = 'TST-000'
WHERE "id" = 'test-tenant-001';

-- Ensure every existing tenant has a code before making the column required.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Tenant"
    WHERE "tenantCode" IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot make Tenant.tenantCode required: one or more tenants have no tenantCode';
  END IF;
END $$;

-- Make the field required.
ALTER TABLE "Tenant"
ALTER COLUMN "tenantCode" SET NOT NULL;

-- Enforce uniqueness.
CREATE UNIQUE INDEX "Tenant_tenantCode_key"
ON "Tenant"("tenantCode");