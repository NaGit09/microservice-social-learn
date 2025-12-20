"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ZodValidationPipe_1 = require("./common/pipe/ZodValidationPipe");
const microservices_1 = require("@nestjs/microservices");
const kafkajs_1 = require("kafkajs");
const prom_client_1 = require("prom-client");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new ZodValidationPipe_1.ZodValidationPipe());
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
                wrapMessages: true,
            },
            subscribe: {
                fromBeginning: true,
            },
        },
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.REDIS,
        options: {
            host: 'my-redis',
            port: 6379,
        },
    });
    app.getHttpAdapter().getInstance().get('/metrics', async (req, res) => {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    });
    app.getHttpAdapter().getInstance().get('/health', async (req, res) => {
        res.set('Content-Type', prom_client_1.register.contentType);
        res.end(await prom_client_1.register.metrics());
    });
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 8089, '0.0.0.0');
    console.log(`🚀 Upload service is running on: http://localhost:${process.env.PORT || 8081}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map