import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './auth/security/ZodValidationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Dùng pipe cho HTTP
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT || 3000);
  console.log('App running with HTTP + Kafka listener');
}
void bootstrap();
