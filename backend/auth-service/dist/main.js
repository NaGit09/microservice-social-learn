"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ZodValidationPipe_1 = require("./auth/security/ZodValidationPipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new ZodValidationPipe_1.ZodValidationPipe());
    await app.listen(process.env.PORT || 3000);
    console.log('App running with HTTP + Kafka listener');
}
void bootstrap();
//# sourceMappingURL=main.js.map