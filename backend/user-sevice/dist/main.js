"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const kafkajs_1 = require("kafkajs");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    await app.listen(process.env.PORT || 8089, '0.0.0.0');
    console.log(`🚀 Upload service is running on: http://localhost:${process.env.PORT || 8089}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map