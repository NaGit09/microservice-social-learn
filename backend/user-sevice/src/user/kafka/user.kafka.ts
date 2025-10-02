import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/request/createa-user.req';
import { Controller } from '@nestjs/common';
import { userInfo } from '../dto/response/user.resp';
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
  @MessagePattern('get-user')
  async getInfo(@Payload() payload: unknown): Promise<userInfo> {
    if (typeof payload !== 'string') {
      throw new RpcException('Invalid payload: userId must be a string');
    }
    return this.userService.getInfor(payload);
  }
}
