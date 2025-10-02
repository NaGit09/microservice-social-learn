import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  // init app
  const app = await NestFactory.create(AppModule);
  // connet to microservice and kafka
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
      },
    },
  });
  // start app with port from to .env
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 8089, '0.0.0.0');
  console.log(
    `🚀 Upload service is running on: http://localhost:${process.env.PORT || 8089}`,
  );
}
void bootstrap();
