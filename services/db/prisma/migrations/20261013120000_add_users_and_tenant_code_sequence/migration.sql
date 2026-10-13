
-- Validate existing tenant codes before initializing the global sequence.
DO $$
DECLARE
  max_number INTEGER;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Tenant"
    WHERE "tenantCode" !~ '^[A-Z]{3}-[0-9]{3}$'
  ) THEN
    RAISE EXCEPTION
      'Migration stopped: one or more existing tenant codes are invalid';
  END IF;

  SELECT MAX(substring("tenantCode" FROM '-([0-9]{3})$')::INTEGER)
  INTO max_number
  FROM "Tenant";

  IF max_number >= 999 THEN
    RAISE EXCEPTION
      'Migration stopped: the three-digit tenant code range is exhausted';
  END IF;
END $$;

-- Create user identity storage.
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'user',
  "displayName" TEXT,
  "bio" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key"
  ON "User"("email");

CREATE INDEX "User_createdAt_idx"
  ON "User"("createdAt");

-- Store tenant membership separately from global user identity.
CREATE TABLE "UserTenant" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UserTenant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserTenant_userId_tenantId_key"
  ON "UserTenant"("userId", "tenantId");

CREATE INDEX "UserTenant_tenantId_idx"
  ON "UserTenant"("tenantId");

CREATE INDEX "UserTenant_userId_idx"
  ON "UserTenant"("userId");

ALTER TABLE "UserTenant"
  ADD CONSTRAINT "UserTenant_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserTenant"
  ADD CONSTRAINT "UserTenant_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- One global sequence shared by every tenant prefix.
-- Numbers allocated from this sequence are not reused after deletion.
CREATE SEQUENCE "TenantCodeNumber_seq"
  MINVALUE 0
  MAXVALUE 999
  START WITH 0
  INCREMENT BY 1
  NO CYCLE;

-- Start after the largest number currently present.
SELECT setval(
  '"TenantCodeNumber_seq"',
  COALESCE(
    (
      SELECT MAX(
        substring("tenantCode" FROM '-([0-9]{3})$')::INTEGER
      )
      FROM "Tenant"
    ),
    -1
  ) + 1,
  false
);
