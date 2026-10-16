import { Module } from '@nestjs/common';
import { InternalAccessController } from './controllers/internal-access.controller';
import { InternalAccessGuard } from './guards/internal-access.guard';
import { InvitationLifecycleService } from './services/invitation-lifecycle.service';
import { MembershipService } from './services/membership.service';
import { TenantAccessService } from './services/tenant-access.service';

@Module({
    controllers: [InternalAccessController],
    providers: [
        InternalAccessGuard,
        MembershipService,
        InvitationLifecycleService,
        TenantAccessService,
    ],
    exports: [
        MembershipService,
        InvitationLifecycleService,
        TenantAccessService,
    ],
})

export class AccessModule {}
