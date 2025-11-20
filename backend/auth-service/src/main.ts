import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './common/pipe/ZodValidationPipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID as string,
        brokers: [process.env.KAFKA_BROKER as string],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID as string,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
        wrapMessages: true,
      },
      subscribe: {
        fromBeginning: true,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'my-redis',
      port: 6379,
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 8089, '0.0.0.0');
  console.log(
    `🚀 Upload service is running on: http://localhost:${process.env.PORT || 8081}`,
  );
}
void bootstrap();
