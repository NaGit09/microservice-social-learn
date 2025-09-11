import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/createa-user.dto';
import { Controller } from '@nestjs/common';
@Controller()
export class UserKafka {
  constructor(private readonly userService: UserService) {}
  @MessagePattern('user.create')
  async create(@Payload() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
