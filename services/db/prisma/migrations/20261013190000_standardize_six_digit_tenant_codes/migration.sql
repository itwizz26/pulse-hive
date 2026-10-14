
-- Expand the global tenant-code sequence without resetting its position.
ALTER SEQUENCE "TenantCodeNumber_seq"
  MAXVALUE 999999
  NO CYCLE;

-- Convert existing three-digit tenant codes to six digits.
-- Example: GLV-001 becomes GLV-000001.
UPDATE "Tenant"
SET "tenantCode" =
  split_part("tenantCode", '-', 1)
  || '-'
  || lpad(
    split_part("tenantCode", '-', 2),
    6,
    '0'
  )
WHERE "tenantCode" ~ '^[A-Z]{3}-[0-9]{3}$';

-- Fail safely if any legacy-format codes remain.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Tenant"
    WHERE "tenantCode" !~ '^[A-Z]{3}-[0-9]{6}$'
  ) THEN
    RAISE EXCEPTION
      'Migration stopped: tenant codes must use the six-digit format XXX-NNNNNN';
  END IF;
END $$;
