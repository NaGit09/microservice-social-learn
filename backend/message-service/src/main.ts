import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { register } from 'prom-client';

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
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: 'my-redis',
      port: 6379,
    },
  });
  app.getHttpAdapter().getInstance().get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  app.getHttpAdapter().getInstance().get('/health', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  // start app with port from to .env
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 8089, '0.0.0.0');
  console.log(
    `🚀 Upload service is running on: http://localhost:${process.env.PORT || 8093}`,
  );
}
void bootstrap();
