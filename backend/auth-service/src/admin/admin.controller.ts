import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Patch,
  Body,
  UsePipes,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/constant/user-role';
import { RolesGuard } from '../common/guard/roles.guard';
import { ZodValidationPipe } from '../common/pipe/ZodValidationPipe';
import {
  AdminResetPasswordSchema,
  type AdminResetPasswordDto,
} from '../common/dto/admin/reset-password.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  @Patch('unban/:id')
  async unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Patch('permissions/:id/:permission')
  async addPermissions(
    @Param('id') id: string,
    @Param('permission') permission: string,
  ) {
    return this.adminService.addPermissions(id, permission);
  }

  @Delete('permissions/:id/:permission')
  async removePermission(
    @Param('id') id: string,
    @Param('permission') permission: string,
  ) {
    return this.adminService.removePermission(id, permission);
  }

  @Patch('reset-password')
  @UsePipes(new ZodValidationPipe(AdminResetPasswordSchema))
  async resetPassword(@Body() dto: AdminResetPasswordDto) {
    return this.adminService.resetUserPassword(dto);
  }
}
