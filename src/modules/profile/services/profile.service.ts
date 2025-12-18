import { Injectable } from '@nestjs/common';
import { UsersService } from '@modules/users/services/users.service';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly usersService: UsersService) { }

    getProfile(userId: string) {
        return this.usersService.findOne(userId);
    }

    updateProfile(userId: string, dto: UpdateUserDto) {
        return this.usersService.update(userId, dto);
    }
}
