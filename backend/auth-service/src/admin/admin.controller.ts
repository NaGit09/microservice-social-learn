
import { Controller, Get, Delete, Param, Query, UseGuards, Patch, Body, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/constant/user-role';
import { RolesGuard } from '../common/guard/roles.guard';
import { ZodValidationPipe } from '../common/pipe/ZodValidationPipe';
import { UpdatePermissionsDtoSchema } from '../common/dto/admin/permissions.dto';
import type { UpdatePermissionsDto } from '../common/dto/admin/permissions.dto';
import { AdminResetPasswordSchema, type AdminResetPasswordDto } from '../common/dto/admin/reset-password.dto';

@Controller('admin')
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

    @Patch('ban/:id')
    async banUser(@Param('id') id: string) {
        return this.adminService.banUser(id);
    }

    @Patch('permissions/:id')
    @UsePipes(new ZodValidationPipe(UpdatePermissionsDtoSchema))
    async updatePermissions(@Param('id') id: string, @Body() dto: UpdatePermissionsDto) {
        return this.adminService.updatePermissions(id, dto.permissions);
    }

    @Patch('reset-password')
    @UsePipes(new ZodValidationPipe(AdminResetPasswordSchema))
    async resetPassword(@Body() dto: AdminResetPasswordDto) {
        return this.adminService.resetUserPassword(dto);
    }
}
