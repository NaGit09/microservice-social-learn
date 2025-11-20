import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { RedisService } from "./config.redis";

@Injectable()
export class RedisAuth implements CanActivate {
    constructor(
        private readonly redisService: RedisService, 
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const redisKey = `auth:session:${token}`;

            const cachedUser = await this.redisService.getData(redisKey);

            if (!cachedUser) {
                throw new UnauthorizedException('Session expired or invalid');
            }

            request['user'] = cachedUser;

            return true;
            
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.error('Redis Auth Error:', error);
            return false;
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}