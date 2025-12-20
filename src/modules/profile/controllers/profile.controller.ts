import { Controller, Get, Patch, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly getProfileUseCase: GetProfileUseCase,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
    ) { }

    @Get()
    @Permissions('read.profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Return the profile.' })
    getProfile(@Request() req) {
        return this.getProfileUseCase.execute(req.user.userId);
    }

    @Patch()
    @Permissions('update.profile')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'The profile has been successfully updated.' })
    updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
        return this.updateProfileUseCase.execute(req.user.userId, dto);
    }
}
