import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  emitMessage(topic: string, message: unknown) {
    this.kafkaClient.emit(topic, message);
  }
  sendMessage<TResponse>(
    topic: string,
    message: unknown,
  ): Observable<TResponse> {
    return this.kafkaClient.send<TResponse>(topic, message);
  }
}
