import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // cần subscribe trước khi publish
    this.kafkaClient.subscribeToResponseOf('user-create');
    await this.kafkaClient.connect();
  }

  // Producer
  sendMessage(topic: string, message: any) {
    this.kafkaClient.emit(topic, message);
    console.log(`Sent message to ${topic}:`, message);
  }
}
