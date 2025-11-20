import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  emit(topic: string, message: any) {
    this.kafkaClient.emit(topic, message).subscribe({
      error: (err) => console.error('Error emitting kafka msg', err),
      complete: () => console.log(`Emitted to ${topic}`),
    });
  }
}
