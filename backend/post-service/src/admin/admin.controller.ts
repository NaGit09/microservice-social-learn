
import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/enums/user-role';
import { RolesGuard } from '../common/guard/roles.guard';

@Controller('post/admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('posts')
    findAllPosts(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.adminService.findAllPosts(Number(page), Number(limit));
    }

    @Delete('post/:id')
    deletePost(@Param('id') id: string) {
        return this.adminService.deletePost(id);
    }

    @Get('comments')
    findAllComments(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.adminService.findAllComments(Number(page), Number(limit));
    }

    @Delete('comment/:id')
    deleteComment(@Param('id') id: string) {
        return this.adminService.deleteComment(id);
    }

    @Get('stats')
    getStats() {
        return this.adminService.getPostStats();
    }
}
