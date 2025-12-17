import { Injectable } from '@nestjs/common';
import { UsersService } from '@modules/users/services/users.service';

@Injectable()
export class DashboardService {
    constructor(private readonly usersService: UsersService) { }

    async getStats() {
        const users = await this.usersService.findAll({ limit: 1 });
        return {
            totalUsers: users.meta.total,
            // Add more stats here as needed
        };
    }
}
