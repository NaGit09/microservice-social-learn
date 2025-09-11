"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ZodValidationPipe_1 = require("./auth/security/ZodValidationPipe");
const microservices_1 = require("@nestjs/microservices");
const kafkajs_1 = require("kafkajs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new ZodValidationPipe_1.ZodValidationPipe());
    await app.listen(process.env.PORT || 3000);
    console.log('App running with HTTP + Kafka listener');
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                clientId: process.env.KAFKA_CLIENT_ID,
                brokers: [process.env.KAFKA_BROKER],
            },
            consumer: {
                groupId: process.env.KAFKA_GROUP_ID,
            },
            producer: {
                createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner,
            },
        },
    });
    await app.startAllMicroservices();
}
void bootstrap();
//# sourceMappingURL=main.js.map