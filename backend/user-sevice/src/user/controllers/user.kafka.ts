import { EventPattern, Payload } from '@nestjs/microservices';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/createa-user.dto';
import { Controller } from '@nestjs/common';
@Controller()
export class UserKafka {
  constructor(private readonly userService: UserService) {}

  @EventPattern('user-create')
  async create(@Payload() payload: unknown) {
    try {
      const dto = CreateUserDto.parse(payload);
      await this.userService.create(dto);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error processing user-create:', message);
    }
  }
}
