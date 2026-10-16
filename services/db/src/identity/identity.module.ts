import { Module } from '@nestjs/common';

import { IdentityController } from './identity.controller';
import { UserIdentityService } from './services/user-identity.service';
import { UserProfileService } from './services/user-profile.service';

@Module({
    controllers: [IdentityController],
    providers: [UserIdentityService, UserProfileService],
    exports: [UserIdentityService, UserProfileService],
})

export class IdentityModule {}
