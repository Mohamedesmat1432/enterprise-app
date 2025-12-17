import { Controller, Get, Patch, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { ProfileService } from '../services/profile.service';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    @Permissions('read.profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Return the profile.' })
    getProfile(@Request() req) {
        return this.profileService.getProfile(req.user.userId);
    }

    @Patch()
    @Permissions('update.profile')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'The profile has been successfully updated.' })
    updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
        return this.profileService.updateProfile(req.user.userId, dto);
    }
}
