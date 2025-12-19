
import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/constant/user-role';
import { RolesGuard } from '../common/guard/roles.guard';

@Controller('user/admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get()
    findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.adminService.findAll(Number(page), Number(limit));
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.adminService.delete(id);
    }

    @Get('stats')
    getStats() {
        return this.adminService.getUserStats();
    }
}
