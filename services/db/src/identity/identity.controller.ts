import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { InternalServiceGuard } from '../common/guards/internal-service.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserIdentityService } from './services/user-identity.service';
import { UserProfileService } from './services/user-profile.service';

@Controller('users')
@UseGuards(InternalServiceGuard)
export class IdentityController {
    constructor(
        private readonly userIdentity: UserIdentityService,
        private readonly userProfile: UserProfileService,
    ) {}

    @Post()
    createUser(@Body() body: CreateUserDto) {
        return this.userIdentity.createUser(body);
    }

    @Get('by-email')
    getUserByEmail(@Query('email') email: string) {
        return this.userIdentity.getUserByEmail(email);
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.userIdentity.getUserById(id);
    }

    @Patch(':id/profile')
    updateProfile(
        @Param('id') id: string,
        @Body() body: UpdateUserProfileDto,
    ) {
        return this.userProfile.updateProfile(id, body);
    }
}
