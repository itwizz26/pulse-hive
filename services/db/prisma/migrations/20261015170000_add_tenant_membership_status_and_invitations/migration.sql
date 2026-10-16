-- Add membership lifecycle status.
CREATE TYPE "MembershipStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'REMOVED'
);

ALTER TABLE "UserTenant"
ADD COLUMN "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE';

CREATE INDEX "UserTenant_tenantId_status_idx"
ON "UserTenant"("tenantId", "status");

-- Add secure tenant invitation records.
CREATE TABLE "TenantInvitation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "invitedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TenantInvitation_tokenHash_key"
ON "TenantInvitation"("tokenHash");

CREATE INDEX "TenantInvitation_tenantId_email_idx"
ON "TenantInvitation"("tenantId", "email");

CREATE INDEX "TenantInvitation_expiresAt_idx"
ON "TenantInvitation"("expiresAt");

CREATE INDEX "TenantInvitation_invitedByUserId_idx"
ON "TenantInvitation"("invitedByUserId");

ALTER TABLE "TenantInvitation"
ADD CONSTRAINT "TenantInvitation_tenantId_fkey"
FOREIGN KEY ("tenantId")
REFERENCES "Tenant"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "TenantInvitation"
ADD CONSTRAINT "TenantInvitation_invitedByUserId_fkey"
FOREIGN KEY ("invitedByUserId")
REFERENCES "User"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
