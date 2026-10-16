CREATE TYPE "TenantRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER',
    'VIEWER'
);

ALTER TABLE "User"
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

ALTER TABLE "UserTenant"
ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "UserTenant"
ALTER COLUMN "role" TYPE "TenantRole"
USING (
    CASE LOWER("role")
        WHEN 'owner' THEN 'OWNER'
        WHEN 'admin' THEN 'ADMIN'
        WHEN 'viewer' THEN 'VIEWER'
        ELSE 'MEMBER'
    END
)::"TenantRole";

ALTER TABLE "UserTenant"
ALTER COLUMN "role" SET DEFAULT 'MEMBER';

ALTER TABLE "TenantInvitation"
ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "TenantInvitation"
ALTER COLUMN "role" TYPE "TenantRole"
USING (
    CASE LOWER("role")
        WHEN 'owner' THEN 'OWNER'
        WHEN 'admin' THEN 'ADMIN'
        WHEN 'viewer' THEN 'VIEWER'
        ELSE 'MEMBER'
    END
)::"TenantRole";

ALTER TABLE "TenantInvitation"
ALTER COLUMN "role" SET DEFAULT 'MEMBER';

CREATE INDEX "TenantInvitation_tenantId_expiresAt_idx"
ON "TenantInvitation" ("tenantId", "expiresAt");
