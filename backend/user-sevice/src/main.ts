import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID as string,
        brokers: [process.env.KAFKA_BROKER as string],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID as string, // tên group consumer phải unique
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  });
  await app.startAllMicroservices();
}
void bootstrap();
