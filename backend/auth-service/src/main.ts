import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from './auth/pipe/ZodValidationPipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Dùng pipe cho HTTP
  app.useGlobalPipes(new ZodValidationPipe());

  // Kết nối Kafka trước
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

  // Start tất cả microservice (Kafka listener)
  await app.startAllMicroservices();

  // Cuối cùng mới mở HTTP API
  await app.listen(process.env.PORT || 8089, '0.0.0.0');
  console.log(
    `🚀 Upload service is running on: http://localhost:${process.env.PORT || 8089}`,
  );
}
void bootstrap();
