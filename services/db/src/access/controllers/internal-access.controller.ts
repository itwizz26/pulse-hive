import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { MembershipStatus } from '@prisma/client';
import {
    isTenantPermission,
    isTenantRole,
    TenantPermission,
} from '../policies/tenant-permissions';
import { InternalAccessGuard } from '../guards/internal-access.guard';
import { InvitationLifecycleService } from '../services/invitation-lifecycle.service';
import { MembershipService } from '../services/membership.service';

@Controller('internal/access')
@UseGuards(InternalAccessGuard)
export class InternalAccessController {
    constructor(
        private readonly memberships: MembershipService,
        private readonly invitations: InvitationLifecycleService,
    ) {}

    @Get('users/:userId/memberships')
    listMemberships(@Param('userId') userId: string) {
        return this.memberships.listUserMemberships(userId);
    }

    @Post('authorize')
    authorize(
        @Headers('x-authenticated-user-id') actorUserId: string | undefined,
        @Body() body: { tenantId?: string; permission?: string },
    ) {
        const actor = this.requireActor(actorUserId);
        const tenantId = this.requireString(body.tenantId, 'tenantId');
        const permission = this.requirePermission(body.permission);

        return this.memberships.requirePermission(actor, tenantId, permission);
    }

    @Post('invitations')
    createInvitation(
        @Headers('x-authenticated-user-id') actorUserId: string | undefined,
        @Body()
        body: {
            tenantId?: string;
            email?: string;
            role?: string;
            expiresInMs?: number;
        },
    ) {
        const actor = this.requireActor(actorUserId);
        const tenantId = this.requireString(body.tenantId, 'tenantId');
        const email = this.requireString(body.email, 'email');
        const role = this.requireRole(body.role);

        if (
            body.expiresInMs !== undefined &&
        (!Number.isSafeInteger(body.expiresInMs) || body.expiresInMs <= 0)
        ) {
            throw new BadRequestException('expiresInMs must be a positive integer');
        }

        return this.invitations.createInvitation({
            actorUserId: actor,
            tenantId,
            email,
            role,
            expiresInMs: body.expiresInMs,
        });
    }

    @Post('invitations/accept')
    acceptInvitation(
        @Headers('x-authenticated-user-id') actorUserId: string | undefined,
        @Body() body: { token?: string },
    ) {
        const actor = this.requireActor(actorUserId);
        const token = this.requireString(body.token, 'token');

        return this.invitations.acceptInvitation(actor, token);
    }

    @Post('invitations/:id/revoke')
    revokeInvitation(
        @Headers('x-authenticated-user-id') actorUserId: string | undefined,
        @Param('id') id: string,
    ) {
        const actor = this.requireActor(actorUserId);
        return this.invitations.revokeInvitation(actor, id);
    }

    @Patch('memberships/role')
    changeRole(
        @Headers('x-authenticated-user-id') actorUserId: string | undefined,
        @Body()
        body: {
            targetUserId?: string;
            tenantId?: string;
            newRole?: string;
        },
    ) {
        const actor = this.requireActor(actorUserId);
        const targetUserId = this.requireString(body.targetUserId, 'targetUserId');
        const tenantId = this.requireString(body.tenantId, 'tenantId');
        const newRole = this.requireRole(body.newRole);

        return this.memberships.changeRole(
            actor,
            targetUserId,
            tenantId,
            newRole,
        );
    }

    @Patch('memberships/status')
    changeStatus(
        @Headers('x-authenticated-user-id') actorUserId: string | undefined,
        @Body()
        body: {
            targetUserId?: string;
            tenantId?: string;
            status?: string;
        },
    ) {
        const actor = this.requireActor(actorUserId);
        const targetUserId = this.requireString(body.targetUserId, 'targetUserId');
        const tenantId = this.requireString(body.tenantId, 'tenantId');

        if (
            !body.status ||
        !Object.values(MembershipStatus).includes(
            body.status as MembershipStatus,
        )
        ) {
            throw new BadRequestException('Invalid membership status');
        }

        return this.memberships.changeMembershipStatus(
            actor,
            targetUserId,
            tenantId,
            body.status as MembershipStatus,
        );
    }

    @Get('tenants/:tenantId/members')
    listTenantMembers(
    @Headers('x-authenticated-user-id') actorUserId: string,
    @Param('tenantId') tenantId: string,
    ) {
        return this.memberships.listTenantMembers(actorUserId, tenantId);
    }

    @Get('tenants/:tenantId/invitations')
    listTenantInvitations(
    @Headers('x-authenticated-user-id') actorUserId: string,
    @Param('tenantId') tenantId: string,
    ) {
        return this.invitations.listTenantInvitations(actorUserId, tenantId);
    }

    private requireActor(value: string | undefined): string {
        return this.requireString(value, 'authenticated user identity');
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new BadRequestException(`${field} is required`);
        }

        return value.trim();
    }

    private requireRole(value: unknown) {
        if (typeof value !== 'string' || !isTenantRole(value)) {
            throw new BadRequestException('Invalid tenant role');
        }

        if (value === 'OWNER') {
            // Ownership assignment is restricted further in MembershipService.
            return value;
        }

        return value;
    }

    private requirePermission(value: unknown): TenantPermission {
        if (typeof value !== 'string' || !isTenantPermission(value)) {
            throw new BadRequestException('Invalid tenant permission');
        }

        return value;
    }
}
