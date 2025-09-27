import { Body, Controller, Get, Param, Patch, UsePipes } from '@nestjs/common';
import { UserService } from '../user.service';
import { UpdateUserSchema, type UpdateUserDto } from '../dto/update-user.dto';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //
  @Get(':id')
  async getInfor(@Param('id') id: string) {
    return this.userService.getInfor(id);
  }
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  async updateUser(
    @Param('id') userId: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateDto);
  }
}
