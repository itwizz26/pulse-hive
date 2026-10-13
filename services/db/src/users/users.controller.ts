
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(
        @Body()
        body: {
        email: string;
        password: string;
        role?: string;
        displayName?: string;
        },
    ) {
        return this.usersService.createUser(body);
    }

    @Get('by-email')
    getUserByEmail(@Query('email') email: string) {
        return this.usersService.getUserByEmail(email);
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return this.usersService.getUserById(id);
    }

    @Patch(':id/profile')
    updateProfile(
        @Param('id') id: string,
        @Body() body: { displayName: string },
    ) {
        return this.usersService.updateProfile(id, body);
    }

    @Post(':id/onboard')
    onboardTenant(
        @Param('id') id: string,
        @Body()
        body: {
        name: string;
        tenantCode: string;
        slug: string;
        },
    ) {
        return this.usersService.onboardTenant(id, body);
    }
}
